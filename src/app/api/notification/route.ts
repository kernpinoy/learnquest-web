import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { patchFetch } from "next/dist/server/app-render/entry-base";
import { NextRequest, NextResponse } from "next/server";
import { validateRequest } from "~/lib/validate-request";
import { db } from "~/server/db";
import {
  classrooms,
  studentRegistrations,
  studentsInfo,
  teachersInfo,
  users,
} from "~/server/db/schema";
import { studentRegistrationFullName } from "~/server/db/sql-commands";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { session, user } = await validateRequest();

  if (!session || !user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  if (!(user.role === "teacher" || user.role === "admin")) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const [teacher] = await db
    .select({
      id: teachersInfo.id,
    })
    .from(teachersInfo)
    .where(eq(teachersInfo.userId, user.id));

  if (!teacher) {
    return new NextResponse("Teacher not found", { status: 404 });
  }

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      // Cleanup function
      const cleanup = () => {
        clearInterval(intervalId);
        controller.close();
      };

      // Handle client disconnect
      request.signal.addEventListener("abort", cleanup);

      const fetchAndStreamData = async () => {
        try {
          const newRegistrations = await db
            .select({
              id: studentRegistrations.id,
              fullName: studentRegistrationFullName,
              createdAt: studentRegistrations.createdAt,
              classCode: studentRegistrations.classCode,
              className: classrooms.name,
            })
            .from(studentRegistrations)
            .innerJoin(
              classrooms,
              eq(classrooms.classCode, studentRegistrations.classCode),
            )
            .where(eq(studentRegistrations.teacherId, teacher.id))
            .orderBy(desc(studentRegistrations.createdAt)); // Sorted by creation time

          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(newRegistrations)}\n\n`),
          );
        } catch (error) {
          console.error("Error fetching data:", error);
          cleanup();
        }
      };

      // Initial fetch
      await fetchAndStreamData();

      // Periodic updates
      const intervalId = setInterval(fetchAndStreamData, 1000);
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { id, classCode }: { id: string; classCode: string } = body;

  const [classroom] = await db
    .select()
    .from(classrooms)
    .where(eq(classrooms.classCode, classCode));

  if (!classroom) {
    return new Response(JSON.stringify({ message: "Classroom not found" }), {
      status: 404,
    });
  }

  try {
    const [studentRegistration] = await db
      .select()
      .from(studentRegistrations)
      .where(eq(studentRegistrations.id, id));

    if (!studentRegistration) {
      return new Response(
        JSON.stringify({ message: "Registration not found" }),
        {
          status: 404,
        },
      );
    }

    // Move data to users table
    await db.insert(users).values({
      username: studentRegistration.username,
      hashedPassword: studentRegistration.hashedPassword,
      salt: studentRegistration.salt,
      role: "student",
    });

    // Move data to students_info table
    const [userId] = await db
      .select()
      .from(users)
      .where(eq(users.username, studentRegistration.username));

    await db.insert(studentsInfo).values({
      classroomId: classroom.id,
      userId: userId.id,
      firstName: studentRegistration.firstName,
      middleName: studentRegistration.middleName,
      lastName: studentRegistration.lastName,
      gender: studentRegistration.gender,
    });

    // Remove the registration from student_registrations table
    await db
      .delete(studentRegistrations)
      .where(eq(studentRegistrations.id, id));

    return new Response(
      JSON.stringify({ message: "Successfully added to the class." }),
      {
        status: 200,
      },
    );
  } catch (error) {
    throw new Error("Unable to accept student. Try again later.");
  } finally {
    revalidatePath("/dashboard/teacher/[classCode]", "page");
  }
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { id } = body;

  try {
    await db
      .delete(studentRegistrations)
      .where(eq(studentRegistrations.id, id));

    return new NextResponse(
      JSON.stringify({ message: "Successfully declined student." }),
      {
        status: 200,
      },
    );
  } catch (error) {
    throw new Error("Unable to delete registration. Try again later.");
  } finally {
    revalidatePath("/dashboard/teacher/[classCode]", "page");
  }
}
