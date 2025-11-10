// src/app/api/mock/posts/route.ts
import { NextResponse } from 'next/server';
import { posts, users, categories } from '../db';

let nextId = posts.length ? Math.max(...posts.map((p) => Number(p.id))) + 1 : 1;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get('page') || 1);
  const search = searchParams.get('search')?.toLowerCase() || '';
  const category_id = searchParams.get('category_id');
  const id = searchParams.get('id');

  // Nếu có id, trả về post theo id
  if (id) {
    const post = posts.find((p) => p.id === BigInt(id));
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    return NextResponse.json({
      ...post,
      id: post.id.toString(),
      category_id: post.category_id.toString(),
    });
  }

  // Filter posts
  let filtered = posts;

  if (search) {
    filtered = filtered.filter(
      (p) => p.title_vi.toLowerCase().includes(search) || p.title_en.toLowerCase().includes(search)
    );
  }

  if (category_id) {
    filtered = filtered.filter((p) => p.category_id === BigInt(category_id));
  }

  const start = (page - 1) * 10;
  const paginated = filtered.slice(start, start + 10).map((p) => ({
    ...p,
    id: p.id.toString(),
    category_id: p.category_id.toString(),
  }));

  return NextResponse.json({
    data: paginated,
    total: filtered.length,
    page,
  });
}

export async function POST(req: Request) {
  const body = await req.json();
  const newPost = {
    id: BigInt(nextId++),
    slug: body.slug || body.title_vi.toLowerCase().replace(/\s+/g, '-'),
    title_vi: body.title_vi,
    title_en: body.title_en,
    description_vi: body.description_vi || '',
    description_en: body.description_en || '',
    content_vi: body.content_vi,
    content_en: body.content_en,
    thumbnail: body.thumbnail || 'https://via.placeholder.com/600x400',
    category_id: BigInt(body.category_id),
    creator_id: users[0].id,
    modifier_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  posts.push(newPost);

  return NextResponse.json(
    {
      ...newPost,
      id: newPost.id.toString(),
      category_id: newPost.category_id.toString(),
    },
    { status: 201 }
  );
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  const index = posts.findIndex((p) => p.id === BigInt(id));

  if (index === -1) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  const deletedPost = posts.splice(index, 1)[0];

  return NextResponse.json({
    message: 'Post deleted successfully',
    data: {
      ...deletedPost,
      id: deletedPost.id.toString(),
      category_id: deletedPost.category_id.toString(),
    },
  });
}
