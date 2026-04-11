import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Voegt CMS-driven content velden toe aan project_settings:
 * - contactIntro: aanpasbare intro tekst voor contactsectie
 * - propertySidebarTitel + propertySidebarTekst: aanpasbare sidebar op woning detailpagina
 * - pageHeroes: per subpagina (aanbod/nieuws/faq/contact) achtergrond kiezen (kleur of afbeelding)
 */

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "project_settings"
      ADD COLUMN IF NOT EXISTS "contact_intro" varchar,
      ADD COLUMN IF NOT EXISTS "property_sidebar_titel" varchar,
      ADD COLUMN IF NOT EXISTS "property_sidebar_tekst" varchar,
      ADD COLUMN IF NOT EXISTS "page_heroes_aanbod_hero_type" varchar DEFAULT 'kleur',
      ADD COLUMN IF NOT EXISTS "page_heroes_aanbod_hero_kleur" varchar DEFAULT '#1a1612',
      ADD COLUMN IF NOT EXISTS "page_heroes_aanbod_hero_afbeelding_id" integer,
      ADD COLUMN IF NOT EXISTS "page_heroes_nieuws_hero_type" varchar DEFAULT 'kleur',
      ADD COLUMN IF NOT EXISTS "page_heroes_nieuws_hero_kleur" varchar DEFAULT '#1a1612',
      ADD COLUMN IF NOT EXISTS "page_heroes_nieuws_hero_afbeelding_id" integer,
      ADD COLUMN IF NOT EXISTS "page_heroes_faq_hero_type" varchar DEFAULT 'kleur',
      ADD COLUMN IF NOT EXISTS "page_heroes_faq_hero_kleur" varchar DEFAULT '#1a1612',
      ADD COLUMN IF NOT EXISTS "page_heroes_faq_hero_afbeelding_id" integer,
      ADD COLUMN IF NOT EXISTS "page_heroes_contact_hero_type" varchar DEFAULT 'kleur',
      ADD COLUMN IF NOT EXISTS "page_heroes_contact_hero_kleur" varchar DEFAULT '#1a1612',
      ADD COLUMN IF NOT EXISTS "page_heroes_contact_hero_afbeelding_id" integer
  `)

  // Foreign keys voor de afbeelding-uploads (optioneel, refereert naar media tabel)
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "project_settings"
        ADD CONSTRAINT "project_settings_page_heroes_aanbod_afbeelding_fk"
        FOREIGN KEY ("page_heroes_aanbod_hero_afbeelding_id")
        REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
  `)
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "project_settings"
        ADD CONSTRAINT "project_settings_page_heroes_nieuws_afbeelding_fk"
        FOREIGN KEY ("page_heroes_nieuws_hero_afbeelding_id")
        REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
  `)
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "project_settings"
        ADD CONSTRAINT "project_settings_page_heroes_faq_afbeelding_fk"
        FOREIGN KEY ("page_heroes_faq_hero_afbeelding_id")
        REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
  `)
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "project_settings"
        ADD CONSTRAINT "project_settings_page_heroes_contact_afbeelding_fk"
        FOREIGN KEY ("page_heroes_contact_hero_afbeelding_id")
        REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "project_settings"
      DROP COLUMN IF EXISTS "contact_intro",
      DROP COLUMN IF EXISTS "property_sidebar_titel",
      DROP COLUMN IF EXISTS "property_sidebar_tekst",
      DROP COLUMN IF EXISTS "page_heroes_aanbod_hero_type",
      DROP COLUMN IF EXISTS "page_heroes_aanbod_hero_kleur",
      DROP COLUMN IF EXISTS "page_heroes_aanbod_hero_afbeelding_id",
      DROP COLUMN IF EXISTS "page_heroes_nieuws_hero_type",
      DROP COLUMN IF EXISTS "page_heroes_nieuws_hero_kleur",
      DROP COLUMN IF EXISTS "page_heroes_nieuws_hero_afbeelding_id",
      DROP COLUMN IF EXISTS "page_heroes_faq_hero_type",
      DROP COLUMN IF EXISTS "page_heroes_faq_hero_kleur",
      DROP COLUMN IF EXISTS "page_heroes_faq_hero_afbeelding_id",
      DROP COLUMN IF EXISTS "page_heroes_contact_hero_type",
      DROP COLUMN IF EXISTS "page_heroes_contact_hero_kleur",
      DROP COLUMN IF EXISTS "page_heroes_contact_hero_afbeelding_id"
  `)
}
