export type User = {
  id: string;
  email: string;
  password: string;
  status: boolean;
  created_at: string;
  updated_at: string;
  creator_id: string | null;
  modifier_id: string | null;
};

export type Category = {
  id: bigint;
  slug: string;
  name_vi: string;
  name_en: string;
  order: number;
  created_at: string;
  updated_at: string;
  creator_id: string;
  modifier_id: string | null;
};

export type Post = {
  id: bigint;
  slug: string;
  title_vi: string;
  title_en: string;
  description_vi: string;
  description_en: string;
  content_vi: string;
  content_en: string;
  thumbnail: string;
  category_id: bigint;
  creator_id: string;
  modifier_id: string | null;
  created_at: string;
  updated_at: string;
};
