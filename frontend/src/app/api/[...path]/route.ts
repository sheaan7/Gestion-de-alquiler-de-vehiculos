import { NextRequest, NextResponse } from "next/server";

const GATEWAY = process.env.URL_GATEWAY ?? "http://localhost:8080";

type Params = Promise<{ path: string[] }>;

export async function GET(request: NextRequest, { params }: { params: Params }) {
  const { path } = await params;
  const destino = `${GATEWAY}/api/${path.join("/")}${request.nextUrl.search}`;
  const respuesta = await fetch(destino, { cache: "no-store" });
  if (!respuesta.ok) {
    const msg = await respuesta.text();
    return new NextResponse(msg || "Error del servidor", { status: respuesta.status });
  }
  return NextResponse.json(await respuesta.json(), { status: respuesta.status });
}

export async function POST(request: NextRequest, { params }: { params: Params }) {
  const { path } = await params;
  const destino = `${GATEWAY}/api/${path.join("/")}`;
  const cuerpo = await request.text();
  const respuesta = await fetch(destino, {
    method: "POST",
    headers: cuerpo ? { "Content-Type": "application/json" } : {},
    body: cuerpo || undefined,
  });
  if (!respuesta.ok) {
    const msg = await respuesta.text();
    return new NextResponse(msg || "Error del servidor", { status: respuesta.status });
  }
  const contentType = respuesta.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    return NextResponse.json(await respuesta.json(), { status: respuesta.status });
  }
  return new NextResponse(null, { status: respuesta.status });
}
