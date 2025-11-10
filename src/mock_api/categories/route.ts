import { NextResponse } from 'next/server';
import { categories, users } from '../db';

let nextId = categories.length ? Math.max(...categories.map((c) => Number(c.id))) + 1 : 1;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get('page') || 1);
  const search = searchParams.get('search')?.toLowerCase() || '';

  let filtered = categories;
  if (search) {
    filtered = categories.filter(
      (c) => c.name_vi.toLowerCase().includes(search) || c.name_en.toLowerCase().includes(search)
    );
  }

  const start = (page - 1) * 10;
  const paginated = filtered.slice(start, start + 10);

  return NextResponse.json({
    data: paginated,
    total: filtered.length,
    page,
  });
}

export async function POST(req: Request) {
  const body = await req.json();
  const newCat = {
    id: BigInt(nextId++),
    slug: body.slug || body.name_vi.toLowerCase().replace(/\s+/g, '-'),
    name_vi: body.name_vi,
    name_en: body.name_en,
    order: body.order || 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    creator_id: users[0].id,
    modifier_id: null,
  };
  categories.push(newCat);
  return NextResponse.json(newCat, { status: 201 });
}
