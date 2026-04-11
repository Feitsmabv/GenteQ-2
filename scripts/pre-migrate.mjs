// Pre-migrate cleanup: verwijdert de 'dev' entry uit payload_migrations
// zodat `payload migrate` op Vercel niet interactief vraagt om bevestiging.
// Wordt aangeroepen vóór `payload migrate` in vercel-build.
//
// Met retry logica voor "Max client connections reached" op Supabase pooler.

import pg from 'pg'

if (!process.env.DATABASE_URL) {
  console.error('[pre-migrate] DATABASE_URL ontbreekt')
  process.exit(0) // niet falen
}

const MAX_RETRIES = 5
const RETRY_DELAY_MS = 3000

async function tryCleanup() {
  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    max: 1,
    idleTimeoutMillis: 5000,
    connectionTimeoutMillis: 15000,
    allowExitOnIdle: true,
  })

  try {
    const { rows } = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'payload_migrations'
      ) as exists
    `)

    if (rows[0]?.exists) {
      const result = await pool.query(`DELETE FROM payload_migrations WHERE name = 'dev'`)
      if (result.rowCount && result.rowCount > 0) {
        console.log(`[pre-migrate] ${result.rowCount} dev entry verwijderd`)
      } else {
        console.log('[pre-migrate] geen dev entry om op te ruimen')
      }
    } else {
      console.log('[pre-migrate] payload_migrations tabel bestaat nog niet — overslaan')
    }
    return true
  } finally {
    await pool.end()
  }
}

let lastError
for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
  try {
    await tryCleanup()
    process.exit(0)
  } catch (error) {
    lastError = error
    console.warn(`[pre-migrate] Poging ${attempt}/${MAX_RETRIES} mislukt: ${error.message}`)
    if (attempt < MAX_RETRIES) {
      await new Promise((r) => setTimeout(r, RETRY_DELAY_MS))
    }
  }
}

// Alle retries op — log de fout maar laat de build doorgaan.
// payload migrate heeft zijn eigen retry en zal de dev entry detecteren als hij die nog vindt.
console.error(`[pre-migrate] Alle retries opgebruikt: ${lastError?.message}. Build gaat door.`)
process.exit(0)
