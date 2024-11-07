export const dynamic = "force-dynamic";

let count = 0;

export async function GET(request: Request) {
  return Response.json({ count });
}

export async function POST(request: Request) {
  try {
    const data = request.clone();

    // check if data is empty
    if (!data || (typeof data === "object" && Object.keys(data).length === 0)) {
      return Response.json(
        { message: "Invalid request, try again." },
        { status: 400, statusText: "Invalid request." }
      );
    }
  } catch {}
}
