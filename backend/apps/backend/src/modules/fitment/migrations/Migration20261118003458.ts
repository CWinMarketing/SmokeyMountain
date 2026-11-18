import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20261118003458 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "product_fitment" ("id" text not null, "product_id" text not null, "vehicle_id" text null, "is_universal" boolean not null default false, "notes" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "product_fitment_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_product_fitment_deleted_at" ON "product_fitment" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "vehicle" ("id" text not null, "year" integer not null, "make" text not null, "model" text not null, "submodel" text null, "engine" text null, "drive_type" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "vehicle_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_vehicle_deleted_at" ON "vehicle" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "product_fitment" cascade;`);

    this.addSql(`drop table if exists "vehicle" cascade;`);
  }

}
