ALTER TABLE "classrooms" ADD COLUMN "school_year" text NOT NULL;--> statement-breakpoint
ALTER TABLE "classrooms" ADD COLUMN "max_students" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "classrooms" ADD COLUMN "archived_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "students_info" ADD COLUMN "archived_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "teachers_info" ADD COLUMN "archived_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "archived_at" timestamp with time zone;