import { NextResponse } from "next/server";
import db from "@/lib/drizzlePg";

const exampleData = {
    rows: [
        { id: 1, mapName: "Ascent", numberOfPlays: 2, numberOfOvertimes: 1 },
    ],
    length: 2,
};

export async function GET(): Promise<NextResponse> {
    const mapResult = await db.query.maps.findMany();
    console.table(mapResult);
    return new NextResponse(JSON.stringify(exampleData));
}
