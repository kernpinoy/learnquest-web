CREATE TABLE IF NOT EXISTS "classrooms" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"teacher_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "students_info" (
	"id" text PRIMARY KEY NOT NULL,
	"first_name" text NOT NULL,
	"middle_name" text NOT NULL,
	"last_name" text NOT NULL,
	"classroom_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "classrooms" ADD CONSTRAINT "classrooms_teacher_id_teachers_info_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."teachers_info"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "students_info" ADD CONSTRAINT "students_info_classroom_id_classrooms_id_fk" FOREIGN KEY ("classroom_id") REFERENCES "public"."classrooms"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "students_info" ADD CONSTRAINT "students_info_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
