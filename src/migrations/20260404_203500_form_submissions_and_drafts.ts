import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // 1. Create form_submissions collection
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "enum_form_submissions_type" AS ENUM('contact', 'brochure');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
  `)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "form_submissions" (
      "id" serial PRIMARY KEY NOT NULL,
      "type" "enum_form_submissions_type" NOT NULL,
      "naam" varchar NOT NULL,
      "email" varchar NOT NULL,
      "telefoon" varchar,
      "interesse" varchar,
      "bericht" varchar,
      "marketing" boolean DEFAULT false,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "form_submissions_created_at_idx" ON "form_submissions" USING btree ("created_at");
  `)

  // 2. Add _status column to woningen for draft/publish workflow
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "enum_woningen_status_draft" AS ENUM('draft', 'published');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
  `)

  await db.execute(sql`
    ALTER TABLE "woningen" ADD COLUMN IF NOT EXISTS "_status" "enum_woningen_status_draft" DEFAULT 'draft';
  `)

  // 3. Create woningen versions table
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "enum__woningen_v_version_type" AS ENUM('appartement', 'woning', 'penthouse');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
  `)
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "enum__woningen_v_version_status" AS ENUM('beschikbaar', 'nieuw', 'bijna-volzet', 'verkocht');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
  `)
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "enum__woningen_v_version_tuin" AS ENUM('ja', 'nee');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
  `)
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "enum__woningen_v_version_status_draft" AS ENUM('draft', 'published');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
  `)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "_woningen_v" (
      "id" serial PRIMARY KEY NOT NULL,
      "parent_id" integer REFERENCES "woningen"("id") ON DELETE SET NULL,
      "version_titel" varchar,
      "version_slug" varchar,
      "version_type" "enum__woningen_v_version_type",
      "version_status" "enum__woningen_v_version_status",
      "version_adres" varchar,
      "version_prijs" numeric,
      "version_prijs_label" varchar,
      "version_slaapkamers" numeric,
      "version_badkamers" numeric,
      "version_oppervlakte" varchar,
      "version_verdieping" varchar,
      "version_garage" numeric,
      "version_tuin" "enum__woningen_v_version_tuin",
      "version_hoofdafbeelding_id" integer REFERENCES "media"("id") ON DELETE SET NULL,
      "version__status" "enum__woningen_v_version_status_draft" DEFAULT 'draft',
      "version_updated_at" timestamp(3) with time zone,
      "version_created_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "latest" boolean,
      "autosave" boolean
    );
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "_woningen_v_parent_idx" ON "_woningen_v" USING btree ("parent_id");
    CREATE INDEX IF NOT EXISTS "_woningen_v_version_version_slug_idx" ON "_woningen_v" USING btree ("version_slug");
    CREATE INDEX IF NOT EXISTS "_woningen_v_created_at_idx" ON "_woningen_v" USING btree ("created_at");
    CREATE INDEX IF NOT EXISTS "_woningen_v_updated_at_idx" ON "_woningen_v" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "_woningen_v_latest_idx" ON "_woningen_v" USING btree ("latest");
    CREATE INDEX IF NOT EXISTS "_woningen_v_autosave_idx" ON "_woningen_v" USING btree ("autosave");
  `)

  // 4. Add _status column to nieuws for draft/publish workflow
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "enum_nieuws_status" AS ENUM('draft', 'published');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
  `)

  await db.execute(sql`
    ALTER TABLE "nieuws" ADD COLUMN IF NOT EXISTS "_status" "enum_nieuws_status" DEFAULT 'draft';
  `)

  // 5. Create nieuws versions table
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "enum__nieuws_v_version_categorie" AS ENUM('bouwupdate', 'evenement', 'project');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
  `)
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "enum__nieuws_v_version_status" AS ENUM('draft', 'published');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
  `)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "_nieuws_v" (
      "id" serial PRIMARY KEY NOT NULL,
      "parent_id" integer REFERENCES "nieuws"("id") ON DELETE SET NULL,
      "version_titel" varchar,
      "version_slug" varchar,
      "version_categorie" "enum__nieuws_v_version_categorie",
      "version_datum" timestamp(3) with time zone,
      "version_samenvatting" varchar,
      "version_afbeelding_id" integer REFERENCES "media"("id") ON DELETE SET NULL,
      "version_inhoud" jsonb,
      "version__status" "enum__nieuws_v_version_status" DEFAULT 'draft',
      "version_updated_at" timestamp(3) with time zone,
      "version_created_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "latest" boolean,
      "autosave" boolean
    );
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "_nieuws_v_parent_idx" ON "_nieuws_v" USING btree ("parent_id");
    CREATE INDEX IF NOT EXISTS "_nieuws_v_version_version_slug_idx" ON "_nieuws_v" USING btree ("version_slug");
    CREATE INDEX IF NOT EXISTS "_nieuws_v_created_at_idx" ON "_nieuws_v" USING btree ("created_at");
    CREATE INDEX IF NOT EXISTS "_nieuws_v_updated_at_idx" ON "_nieuws_v" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "_nieuws_v_latest_idx" ON "_nieuws_v" USING btree ("latest");
    CREATE INDEX IF NOT EXISTS "_nieuws_v_autosave_idx" ON "_nieuws_v" USING btree ("autosave");
  `)

  // 6. Set existing records to 'published' so they remain visible
  await db.execute(sql`UPDATE "woningen" SET "_status" = 'published' WHERE "_status" IS NULL OR "_status" = 'draft'`)
  await db.execute(sql`UPDATE "nieuws" SET "_status" = 'published' WHERE "_status" IS NULL OR "_status" = 'draft'`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS "_nieuws_v"`)
  await db.execute(sql`DROP TABLE IF EXISTS "_woningen_v"`)
  await db.execute(sql`DROP TABLE IF EXISTS "form_submissions"`)

  await db.execute(sql`ALTER TABLE "woningen" DROP COLUMN IF EXISTS "_status"`)
  await db.execute(sql`ALTER TABLE "nieuws" DROP COLUMN IF EXISTS "_status"`)

  await db.execute(sql`DROP TYPE IF EXISTS "enum_form_submissions_type"`)
  await db.execute(sql`DROP TYPE IF EXISTS "enum_woningen_status_draft"`)
  await db.execute(sql`DROP TYPE IF EXISTS "enum__woningen_v_version_type"`)
  await db.execute(sql`DROP TYPE IF EXISTS "enum__woningen_v_version_status"`)
  await db.execute(sql`DROP TYPE IF EXISTS "enum__woningen_v_version_tuin"`)
  await db.execute(sql`DROP TYPE IF EXISTS "enum__woningen_v_version_status_draft"`)
  await db.execute(sql`DROP TYPE IF EXISTS "enum_nieuws_status"`)
  await db.execute(sql`DROP TYPE IF EXISTS "enum__nieuws_v_version_categorie"`)
  await db.execute(sql`DROP TYPE IF EXISTS "enum__nieuws_v_version_status"`)
}
