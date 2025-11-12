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
  id: string;
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
  id: string;
  slug: string;
  title_vi: string;
  title_en: string | undefined;
  description_vi: string;
  description_en: string | undefined;
  content_vi: string;
  content_en: string | undefined;
  thumbnail: string | null;
  category_id: string;
  creator_id: string;
  modifier_id: string | null;
  created_at: string;
  updated_at: string;
};
