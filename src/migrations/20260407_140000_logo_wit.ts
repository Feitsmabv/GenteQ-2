import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "project_settings"
      ADD COLUMN IF NOT EXISTS "logo_wit_id" integer
  `)
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "project_settings"
        ADD CONSTRAINT "project_settings_logo_wit_fk"
        FOREIGN KEY ("logo_wit_id") REFERENCES "media"("id")
        ON DELETE SET NULL ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "project_settings" DROP CONSTRAINT IF EXISTS "project_settings_logo_wit_fk"
  `)
  await db.execute(sql`
    ALTER TABLE "project_settings" DROP COLUMN IF EXISTS "logo_wit_id"
  `)
}
