import { NextRequest, NextResponse } from "next/server";
// import db from "@/lib/drizzlePg";

export async function POST(request: NextRequest): Promise<NextResponse> {
    const body = await request.json();
    console.table(body);
    return new NextResponse("successful post", { status: 200 });
}
