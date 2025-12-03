import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware deshabilitado - Vercel rewrites manejan las redirecciones
export function middleware(request: NextRequest) {
  // Simplemente pasar todas las solicitudes sin procesar
  // Las redirecciones se manejan en vercel.json
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Matcher vacío para deshabilitar efectivamente el middleware
    '/((?!_next|api|favicon.ico|assets|.*\\..*).*)',
  ],
};



