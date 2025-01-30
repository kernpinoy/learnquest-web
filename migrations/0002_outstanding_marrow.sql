DO $$ BEGIN
 CREATE TYPE "public"."class_session" AS ENUM('morning', 'afternoon');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."gender" AS ENUM('male', 'female');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "classrooms" ADD COLUMN "class_session" "class_session" NOT NULL;--> statement-breakpoint
ALTER TABLE "classrooms" ADD COLUMN "school_year" text NOT NULL;--> statement-breakpoint
ALTER TABLE "students_info" ADD COLUMN "gender" "gender" NOT NULL;