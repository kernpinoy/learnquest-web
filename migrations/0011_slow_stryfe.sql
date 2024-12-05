CREATE TABLE IF NOT EXISTS "file_upload" (
	"id" text,
	"user_id" text NOT NULL,
	"classroom_id" text NOT NULL,
	"bucket" text,
	"file_name" text,
	"original_name" text,
	"created_at" timestamp with time zone NOT NULL,
	"size" integer,
	"filetype" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "file_upload" ADD CONSTRAINT "file_upload_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "file_upload" ADD CONSTRAINT "file_upload_classroom_id_classrooms_id_fk" FOREIGN KEY ("classroom_id") REFERENCES "public"."classrooms"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
