import { postgresAdapter } from '@payloadcms/db-postgres'
import { resendAdapter } from '@payloadcms/email-resend'
import sharp from 'sharp'
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'
import { migrations } from './migrations'

import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Users } from './collections/Users'
import { Header } from './Header/config'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'
import { rateLimit } from './lib/rate-limit'

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
    //
    // ⚠️ VÓÓR ECHTE PRODUCTION LAUNCH (niet dev-preview):
    //   1. Draai `pnpm migrate:create initial` om baseline migration te genereren
    //   2. Zet deze vlag op `false`
    //   3. Commit de `src/migrations/` folder
    //   4. Vercel build draait dan `pnpm migrate` via run-migrate.mjs
    // Anders riskeer je dat Payload het productie-schema overschrijft bij
    // schema-wijzigingen of destructive drift detecteert.
    push: true,
    prodMigrations: migrations,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as any,
  collections: [Pages, Media, Users],
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
  // Email — gebruikt voor password reset, form notificaties, etc.
  // Vereist RESEND_API_KEY en RESEND_FROM_EMAIL. Zonder deze vars valt Payload
  // terug op console logging (dev-safe, maar forgot-password werkt dan niet).
  email: resendAdapter({
    defaultFromAddress: process.env.RESEND_FROM_EMAIL || 'noreply@example.com',
    defaultFromName: 'GenteQ',
    apiKey: process.env.RESEND_API_KEY || '',
  }),
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: async ({ req }: { req: PayloadRequest }): Promise<boolean> => {
        if (req.user) return true

        const secret = process.env.CRON_SECRET
        if (!secret) return false

        // Rate-limit per IP om brute-force op CRON_SECRET te voorkomen.
        const ip =
          req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
          req.headers.get('x-real-ip') ||
          'unknown'
        const { success } = await rateLimit(`cron:${ip}`)
        if (!success) return false

        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${secret}`
      },
    },
    tasks: [],
  },
})
