import { NextResponse } from "next/server";

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ data, error: null }, init);
}

export function fail(error: string, status = 500) {
  return NextResponse.json({ data: null, error }, { status });
}
