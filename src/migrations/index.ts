// Migrations zijn geleegd na het strippen van het vastgoed-template.
// Bij de eerste deploy tegen een schone Supabase database genereert Payload
// het schema automatisch. Genereer later een nieuwe baseline migration met:
//   pnpm migrate:create initial
export const migrations: {
  up: (args: { payload: unknown; req: unknown }) => Promise<void>
  down: (args: { payload: unknown; req: unknown }) => Promise<void>
  name: string
}[] = []
