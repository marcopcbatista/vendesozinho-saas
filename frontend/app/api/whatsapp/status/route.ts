import { NextResponse } from "next/server";


export async function GET() {
return NextResponse.json({
status: "connected",
service: "WhatsApp",
timestamp: new Date().toISOString(),
});
}