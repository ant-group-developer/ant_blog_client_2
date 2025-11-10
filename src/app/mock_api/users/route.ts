import { NextResponse } from 'next/server';
import { users } from '../db';
import { v4 as uuidv4 } from 'uuid';

const PER_PAGE = 10;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get('page') || 1);
  const search = searchParams.get('search')?.toLowerCase() || '';

  let filtered = users;
  if (search) {
    filtered = users.filter((u) => u.email.toLowerCase().includes(search));
  }

  const start = (page - 1) * PER_PAGE;
  const paginated = filtered.slice(start, start + PER_PAGE);

  return NextResponse.json({
    data: paginated,
    total: filtered.length,
    page,
    per_page: PER_PAGE,
  });
}

export async function POST(req: Request) {
  const body = await req.json();
  const newUser = {
    id: uuidv4(),
    email: body.email,
    password: '$2b$10$mockhashed', // giả lập
    status: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    creator_id: null,
    modifier_id: null,
  };
  users.push(newUser);
  return NextResponse.json(newUser, { status: 201 });
}
