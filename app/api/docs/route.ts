import { NextResponse } from "next/server";
import swaggerSpec from "@/doc/swagger";

export async function GET() {
  return NextResponse.json(swaggerSpec);
}
