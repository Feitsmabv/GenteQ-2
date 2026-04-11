import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_woningen_type" AS ENUM('appartement', 'woning', 'penthouse');
  CREATE TYPE "public"."enum_woningen_status" AS ENUM('beschikbaar', 'nieuw', 'bijna-volzet', 'verkocht');
  CREATE TYPE "public"."enum_woningen_tuin" AS ENUM('ja', 'nee');
  CREATE TYPE "public"."enum_nieuws_categorie" AS ENUM('bouwupdate', 'evenement', 'project');
  CREATE TYPE "public"."enum_faq_categorie" AS ENUM('project', 'woningen', 'praktisch');
  CREATE TABLE "woningen_kenmerken" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kenmerk" varchar NOT NULL
  );
  
  CREATE TABLE "woningen_galerij" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"afbeelding_id" integer NOT NULL
  );
  
  CREATE TABLE "woningen" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"titel" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"type" "enum_woningen_type" NOT NULL,
  	"status" "enum_woningen_status" DEFAULT 'beschikbaar' NOT NULL,
  	"adres" varchar,
  	"prijs" numeric NOT NULL,
  	"prijs_label" varchar DEFAULT 'Vanaf',
  	"slaapkamers" numeric NOT NULL,
  	"badkamers" numeric NOT NULL,
  	"oppervlakte" varchar NOT NULL,
  	"verdieping" varchar,
  	"garage" numeric DEFAULT 0,
  	"tuin" "enum_woningen_tuin" DEFAULT 'nee',
  	"beschrijving" jsonb,
  	"hoofdafbeelding_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "nieuws" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"titel" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"categorie" "enum_nieuws_categorie" NOT NULL,
  	"datum" timestamp(3) with time zone NOT NULL,
  	"samenvatting" varchar NOT NULL,
  	"afbeelding_id" integer,
  	"inhoud" jsonb NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "faq" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"vraag" varchar NOT NULL,
  	"antwoord" varchar NOT NULL,
  	"categorie" "enum_faq_categorie" NOT NULL,
  	"volgorde" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "project_settings_afstanden" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"locatie" varchar NOT NULL,
  	"afstand" varchar NOT NULL
  );
  
  CREATE TABLE "project_settings_partners" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"naam" varchar NOT NULL,
  	"url" varchar
  );
  
  CREATE TABLE "project_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"projectnaam" varchar DEFAULT 'Projectnaam' NOT NULL,
  	"logo_id" integer,
  	"hero_titel" varchar DEFAULT 'Vind uw droomwoning.',
  	"hero_subtitel" varchar DEFAULT 'Woningen met karakter, gebouwd voor nu en de volgende generaties.',
  	"telefoon" varchar DEFAULT '+32 9 000 00 00',
  	"email" varchar DEFAULT 'info@projectnaam.be',
  	"adres" varchar DEFAULT 'Voorbeeldstraat 1, 1000 Stad',
  	"kantooruren" varchar DEFAULT 'Ma-Vr: 9:00 - 17:00',
  	"brochure_id" integer,
  	"brochure_titel" varchar DEFAULT 'Download de projectbrochure',
  	"brochure_omschrijving" varchar DEFAULT 'Vul uw gegevens in en ontvang de brochure met plannen, prijzen en afwerkingsniveaus direct in uw mailbox.',
  	"intro_titel" varchar DEFAULT 'Wonen waar alles samenkomt',
  	"intro_tekst" varchar,
  	"locatie_titel" varchar DEFAULT 'Een toplocatie in het hart van de stad',
  	"locatie_tekst" varchar DEFAULT 'Geniet van de nabijheid van winkels, scholen, openbaar vervoer en groene parken. Alles op wandelafstand.',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "woningen_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "nieuws_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "faq_id" integer;
  ALTER TABLE "woningen_kenmerken" ADD CONSTRAINT "woningen_kenmerken_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."woningen"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "woningen_galerij" ADD CONSTRAINT "woningen_galerij_afbeelding_id_media_id_fk" FOREIGN KEY ("afbeelding_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "woningen_galerij" ADD CONSTRAINT "woningen_galerij_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."woningen"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "woningen" ADD CONSTRAINT "woningen_hoofdafbeelding_id_media_id_fk" FOREIGN KEY ("hoofdafbeelding_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "nieuws" ADD CONSTRAINT "nieuws_afbeelding_id_media_id_fk" FOREIGN KEY ("afbeelding_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "project_settings_afstanden" ADD CONSTRAINT "project_settings_afstanden_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."project_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "project_settings_partners" ADD CONSTRAINT "project_settings_partners_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."project_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "project_settings" ADD CONSTRAINT "project_settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "project_settings" ADD CONSTRAINT "project_settings_brochure_id_media_id_fk" FOREIGN KEY ("brochure_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "woningen_kenmerken_order_idx" ON "woningen_kenmerken" USING btree ("_order");
  CREATE INDEX "woningen_kenmerken_parent_id_idx" ON "woningen_kenmerken" USING btree ("_parent_id");
  CREATE INDEX "woningen_galerij_order_idx" ON "woningen_galerij" USING btree ("_order");
  CREATE INDEX "woningen_galerij_parent_id_idx" ON "woningen_galerij" USING btree ("_parent_id");
  CREATE INDEX "woningen_galerij_afbeelding_idx" ON "woningen_galerij" USING btree ("afbeelding_id");
  CREATE UNIQUE INDEX "woningen_slug_idx" ON "woningen" USING btree ("slug");
  CREATE INDEX "woningen_hoofdafbeelding_idx" ON "woningen" USING btree ("hoofdafbeelding_id");
  CREATE INDEX "woningen_updated_at_idx" ON "woningen" USING btree ("updated_at");
  CREATE INDEX "woningen_created_at_idx" ON "woningen" USING btree ("created_at");
  CREATE UNIQUE INDEX "nieuws_slug_idx" ON "nieuws" USING btree ("slug");
  CREATE INDEX "nieuws_afbeelding_idx" ON "nieuws" USING btree ("afbeelding_id");
  CREATE INDEX "nieuws_updated_at_idx" ON "nieuws" USING btree ("updated_at");
  CREATE INDEX "nieuws_created_at_idx" ON "nieuws" USING btree ("created_at");
  CREATE INDEX "faq_updated_at_idx" ON "faq" USING btree ("updated_at");
  CREATE INDEX "faq_created_at_idx" ON "faq" USING btree ("created_at");
  CREATE INDEX "project_settings_afstanden_order_idx" ON "project_settings_afstanden" USING btree ("_order");
  CREATE INDEX "project_settings_afstanden_parent_id_idx" ON "project_settings_afstanden" USING btree ("_parent_id");
  CREATE INDEX "project_settings_partners_order_idx" ON "project_settings_partners" USING btree ("_order");
  CREATE INDEX "project_settings_partners_parent_id_idx" ON "project_settings_partners" USING btree ("_parent_id");
  CREATE INDEX "project_settings_logo_idx" ON "project_settings" USING btree ("logo_id");
  CREATE INDEX "project_settings_brochure_idx" ON "project_settings" USING btree ("brochure_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_woningen_fk" FOREIGN KEY ("woningen_id") REFERENCES "public"."woningen"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_nieuws_fk" FOREIGN KEY ("nieuws_id") REFERENCES "public"."nieuws"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faq_fk" FOREIGN KEY ("faq_id") REFERENCES "public"."faq"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_woningen_id_idx" ON "payload_locked_documents_rels" USING btree ("woningen_id");
  CREATE INDEX "payload_locked_documents_rels_nieuws_id_idx" ON "payload_locked_documents_rels" USING btree ("nieuws_id");
  CREATE INDEX "payload_locked_documents_rels_faq_id_idx" ON "payload_locked_documents_rels" USING btree ("faq_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "woningen_kenmerken" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "woningen_galerij" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "woningen" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "nieuws" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "project_settings_afstanden" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "project_settings_partners" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "project_settings" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "woningen_kenmerken" CASCADE;
  DROP TABLE "woningen_galerij" CASCADE;
  DROP TABLE "woningen" CASCADE;
  DROP TABLE "nieuws" CASCADE;
  DROP TABLE "faq" CASCADE;
  DROP TABLE "project_settings_afstanden" CASCADE;
  DROP TABLE "project_settings_partners" CASCADE;
  DROP TABLE "project_settings" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_woningen_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_nieuws_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_faq_fk";
  
  DROP INDEX "payload_locked_documents_rels_woningen_id_idx";
  DROP INDEX "payload_locked_documents_rels_nieuws_id_idx";
  DROP INDEX "payload_locked_documents_rels_faq_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "woningen_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "nieuws_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "faq_id";
  DROP TYPE "public"."enum_woningen_type";
  DROP TYPE "public"."enum_woningen_status";
  DROP TYPE "public"."enum_woningen_tuin";
  DROP TYPE "public"."enum_nieuws_categorie";
  DROP TYPE "public"."enum_faq_categorie";`)
}
