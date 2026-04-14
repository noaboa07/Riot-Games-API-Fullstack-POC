import { NextResponse } from "next/server";
import { getLatestVersion } from "@/lib/ddragon";

export async function GET() {
  const version = await getLatestVersion();
  return NextResponse.json({ version });
}
