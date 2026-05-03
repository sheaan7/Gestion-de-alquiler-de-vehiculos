import { NextRequest, NextResponse } from "next/server";

const GATEWAY = process.env.URL_GATEWAY ?? "http://localhost:8080";

type Params = Promise<{ path: string[] }>;

export async function GET(request: NextRequest, { params }: { params: Params }) {
  const { path } = await params;
  const destino = `${GATEWAY}/api/${path.join("/")}${request.nextUrl.search}`;
  let respuesta: Response;
  try {
    respuesta = await fetch(destino, { cache: "no-store" });
  } catch {
    return new NextResponse("No se pudo conectar con el gateway", { status: 502 });
  }
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
  let respuesta: Response;
  try {
    respuesta = await fetch(destino, {
      method: "POST",
      headers: cuerpo ? { "Content-Type": "application/json" } : {},
      body: cuerpo || undefined,
    });
  } catch {
    return new NextResponse("No se pudo conectar con el gateway", { status: 502 });
  }
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

export async function PUT(request: NextRequest, { params }: { params: Params }) {
  const { path } = await params;
  const destino = `${GATEWAY}/api/${path.join("/")}`;
  const cuerpo = await request.text();
  let respuesta: Response;
  try {
    respuesta = await fetch(destino, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: cuerpo,
    });
  } catch {
    return new NextResponse("No se pudo conectar con el gateway", { status: 502 });
  }
  if (!respuesta.ok) {
    const msg = await respuesta.text();
    return new NextResponse(msg || "Error del servidor", { status: respuesta.status });
  }
  return NextResponse.json(await respuesta.json(), { status: respuesta.status });
}

export async function DELETE(request: NextRequest, { params }: { params: Params }) {
  const { path } = await params;
  const destino = `${GATEWAY}/api/${path.join("/")}`;
  let respuesta: Response;
  try {
    respuesta = await fetch(destino, { method: "DELETE" });
  } catch {
    return new NextResponse("No se pudo conectar con el gateway", { status: 502 });
  }
  if (!respuesta.ok) {
    const msg = await respuesta.text();
    return new NextResponse(msg || "Error del servidor", { status: respuesta.status });
  }
  return new NextResponse(null, { status: respuesta.status });
}
