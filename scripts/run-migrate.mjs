// Wrapper rond `payload migrate` met retry logic voor Supabase pooler
// connection issues ("Max client connections reached").
//
// Vercel cold builds kunnen pieken in connecties geven omdat dev sessions,
// admin panel, en build env tegelijk connecties claimen op de Transaction pooler.

import { spawn } from 'child_process'

const MAX_RETRIES = 5
const RETRY_DELAY_MS = 4000

function runPayloadMigrate() {
  return new Promise((resolve, reject) => {
    const child = spawn(
      'node',
      ['--no-deprecation', 'node_modules/payload/dist/bin/index.js', 'migrate'],
      {
        stdio: 'pipe',
        env: process.env,
      },
    )

    let stdout = ''
    let stderr = ''

    child.stdout.on('data', (chunk) => {
      const text = chunk.toString()
      stdout += text
      process.stdout.write(text)
    })
    child.stderr.on('data', (chunk) => {
      const text = chunk.toString()
      stderr += text
      process.stderr.write(text)
    })

    child.on('close', (code) => {
      if (code === 0) {
        resolve()
      } else {
        const err = new Error(`payload migrate exited with code ${code}`)
        err.stdout = stdout
        err.stderr = stderr
        err.code = code
        reject(err)
      }
    })

    child.on('error', reject)
  })
}

for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
  try {
    console.log(`[run-migrate] Poging ${attempt}/${MAX_RETRIES}`)
    await runPayloadMigrate()
    console.log('[run-migrate] Migraties succesvol uitgevoerd')
    process.exit(0)
  } catch (error) {
    const isConnectionError =
      error.stderr?.includes('Max client connections reached') ||
      error.stderr?.includes('cannot connect to Postgres') ||
      error.stderr?.includes('ECONNREFUSED') ||
      error.stderr?.includes('timeout')

    if (!isConnectionError || attempt === MAX_RETRIES) {
      console.error(
        `[run-migrate] Definitieve fout (poging ${attempt}/${MAX_RETRIES}): ${error.message}`,
      )
      process.exit(1)
    }

    console.warn(
      `[run-migrate] Connection error (poging ${attempt}/${MAX_RETRIES}). Wacht ${RETRY_DELAY_MS}ms...`,
    )
    await new Promise((r) => setTimeout(r, RETRY_DELAY_MS))
  }
}

process.exit(1)
