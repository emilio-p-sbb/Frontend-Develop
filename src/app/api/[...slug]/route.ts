import { handler } from '@/lib/proxy'; // atau '@/middleware/proxy' tergantung kamu simpan di mana

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const OPTIONS = handler;
