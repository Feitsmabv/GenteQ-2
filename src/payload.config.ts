import { postgresAdapter } from '@payloadcms/db-postgres'
import sharp from 'sharp'
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'
import { migrations } from './migrations'

import { Media } from './collections/Media'
import { Users } from './collections/Users'
import { Header } from './Header/config'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

if (!process.env.PAYLOAD_SECRET) {
  throw new Error('PAYLOAD_SECRET ontbreekt — stel deze in als environment variable.')
}

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL ontbreekt — stel deze in als environment variable.')
}

export default buildConfig({
  admin: {
    components: {},
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  // Cast: payload@3.81 + db-postgres hebben een type-mismatch op `locale`
  // wanneer localization is ingeschakeld. Runtime werkt prima.
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
      max: 3,
      idleTimeoutMillis: 20_000,
      connectionTimeoutMillis: 10_000,
      // Sluit oude connecties netjes af zodat de Transaction pooler niet uitloopt
      allowExitOnIdle: true,
    },
    // push: true zodat de eerste boot tegen een schone Supabase database
    // automatisch het schema (users, media, header global) opbouwt.
    // Zet op false zodra je de eerste echte migratie hebt gegenereerd
    // met `pnpm migrate:create initial` en het schema stabiel is.
    push: true,
    prodMigrations: migrations,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as any,
  collections: [Media, Users],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [Header],
  localization: {
    locales: [
      { label: 'Nederlands', code: 'nl' },
      { label: 'English', code: 'en' },
    ],
    defaultLocale: 'nl',
    fallback: true,
  },
  plugins,
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true

        const secret = process.env.CRON_SECRET
        if (!secret) return false

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${secret}`
      },
    },
    tasks: [],
  },
})
