export async function GET() {
  return Response.json({
    status: 'ok',
    message: 'NextMed API is running',
    timestamp: new Date().toISOString(),
  });
} 