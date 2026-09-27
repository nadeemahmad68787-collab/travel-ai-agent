export async function GET() {
  return Response.json({
    message: "API is working ✅",
  });
}

export async function POST() {
  return Response.json({
    result: "Backend is working ✅",
  });
}