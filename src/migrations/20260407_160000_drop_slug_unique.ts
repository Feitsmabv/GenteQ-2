import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Drop unique constraint op woningen.slug en nieuws.slug zodat de
 * "Duplicate" knop in admin werkt zonder client-side validation error.
 * Uniciteit wordt nu door een beforeValidate field hook afgedwongen,
 * die automatisch een suffix toevoegt bij conflict.
 *
 * Behoud een gewone (non-unique) index voor query performance.
 */

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Drop alle bestaande unique indexen op slug kolommen
  await db.execute(sql`
    DO $$
    DECLARE r record;
    BEGIN
      FOR r IN
        SELECT indexname FROM pg_indexes
        WHERE tablename IN ('woningen', 'nieuws')
        AND indexdef ILIKE '%UNIQUE%(slug)%'
      LOOP
        EXECUTE 'DROP INDEX IF EXISTS ' || quote_ident(r.indexname);
      END LOOP;
    END $$;
  `)

  // Maak gewone non-unique indexen
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "woningen_slug_idx" ON "woningen" ("slug")
  `)
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "nieuws_slug_idx" ON "nieuws" ("slug")
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP INDEX IF EXISTS "woningen_slug_idx"`)
  await db.execute(sql`DROP INDEX IF EXISTS "nieuws_slug_idx"`)
  await db.execute(sql`
    CREATE UNIQUE INDEX IF NOT EXISTS "woningen_slug_unique_idx" ON "woningen" ("slug")
  `)
  await db.execute(sql`
    CREATE UNIQUE INDEX IF NOT EXISTS "nieuws_slug_unique_idx" ON "nieuws" ("slug")
  `)
}
