import { v4 as uuidv4 } from 'uuid';

// Helper để tạo BigInt ID
let postId = 1n;
let categoryId = 1n;

const createBigInt = () => {
  const id = categoryId;
  categoryId += 1n;
  return id;
};

const createPostId = () => {
  const id = postId;
  postId += 1n;
  return id;
};

// Mock Users
export let users = [
  {
    id: uuidv4(),
    email: 'toantran@gmail.com',
    password: '1', // giả lập
    status: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    creator_id: null,
    modifier_id: null,
  },
  {
    id: uuidv4(),
    email: 'haiha@gmail.com',
    password: '2',
    status: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    creator_id: null,
    modifier_id: null,
  },
];

// Mock Categories
export let categories = [
  {
    id: createBigInt(),
    slug: 'tin-tuc',
    name_vi: 'Tin tức',
    name_en: 'News',
    order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    creator_id: users[0].id,
    modifier_id: null,
  },
  {
    id: createBigInt(),
    slug: 'su-kien',
    name_vi: 'Sự kiện',
    name_en: 'Events',
    order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    creator_id: users[0].id,
    modifier_id: null,
  },
];

// Mock Posts
export let posts = [
  {
    id: createPostId(),
    slug: 'nextjs-15-ra-mat',
    title_vi: 'Next.js 15 chính thức ra mắt',
    title_en: 'Next.js 15 Officially Released',
    description_vi: 'Phiên bản mới với nhiều cải tiến...',
    description_en: 'New version with many improvements...',
    content_vi: '<p>Nội dung chi tiết...</p>',
    content_en: '<p>Detailed content...</p>',
    thumbnail: 'https://via.placeholder.com/600x400',
    category_id: categories[0].id,
    creator_id: users[0].id,
    modifier_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];
