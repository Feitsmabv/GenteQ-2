import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Drop the old header_rels table (references to pages/posts)
  await db.execute(sql`DROP TABLE IF EXISTS "header_rels" CASCADE;`)

  // Simplify header_nav_items: add label and url columns, remove old link columns
  await db.execute(sql`ALTER TABLE "header_nav_items" ADD COLUMN IF NOT EXISTS "label" varchar;`)
  await db.execute(sql`ALTER TABLE "header_nav_items" ADD COLUMN IF NOT EXISTS "url" varchar;`)

  // Copy existing data if possible
  await db.execute(sql`UPDATE "header_nav_items" SET "label" = "link_label" WHERE "link_label" IS NOT NULL;`)
  await db.execute(sql`UPDATE "header_nav_items" SET "url" = "link_url" WHERE "link_url" IS NOT NULL;`)

  // Drop old columns
  await db.execute(sql`ALTER TABLE "header_nav_items" DROP COLUMN IF EXISTS "link_type";`)
  await db.execute(sql`ALTER TABLE "header_nav_items" DROP COLUMN IF EXISTS "link_new_tab";`)
  await db.execute(sql`ALTER TABLE "header_nav_items" DROP COLUMN IF EXISTS "link_url";`)
  await db.execute(sql`ALTER TABLE "header_nav_items" DROP COLUMN IF EXISTS "link_label";`)
  await db.execute(sql`ALTER TABLE "header_nav_items" DROP COLUMN IF EXISTS "link_appearance";`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Reverse: add back old columns
  await db.execute(sql`ALTER TABLE "header_nav_items" ADD COLUMN IF NOT EXISTS "link_type" varchar;`)
  await db.execute(sql`ALTER TABLE "header_nav_items" ADD COLUMN IF NOT EXISTS "link_new_tab" boolean;`)
  await db.execute(sql`ALTER TABLE "header_nav_items" ADD COLUMN IF NOT EXISTS "link_url" varchar;`)
  await db.execute(sql`ALTER TABLE "header_nav_items" ADD COLUMN IF NOT EXISTS "link_label" varchar;`)

  // Recreate header_rels table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "header_rels" (
      "id" serial PRIMARY KEY,
      "order" integer,
      "parent_id" integer REFERENCES "header"("id") ON DELETE CASCADE,
      "path" varchar,
      "pages_id" integer,
      "posts_id" integer
    );
  `)
}
