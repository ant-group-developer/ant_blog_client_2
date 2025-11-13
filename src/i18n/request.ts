import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export default getRequestConfig(async () => {
  const store = await cookies();
  const locale = store.get('locale')?.value || 'en';

  const createPost = (await import(`../../messages/${locale}/createPost.json`)).default;
  const post = (await import(`../../messages/${locale}/post.json`)).default;
  const detailPost = (await import(`../../messages/${locale}/detailPost.json`)).default;
  const layoutPost = (await import(`../../messages/${locale}/layoutPost.json`)).default;
  const layoutAdmin = (await import(`../../messages/${locale}/layoutAdmin.json`)).default;
  const userList = (await import(`../../messages/${locale}/userList.json`)).default;
  const edit = (await import(`../../messages/${locale}/edit.json`)).default;
  const auth = (await import(`../../messages/${locale}/auth.json`)).default;
  const home = (await import(`../../messages/${locale}/home.json`)).default;
  const categoryList = (await import(`../../messages/${locale}/categoryList.json`)).default;
  const postList = (await import(`../../messages/${locale}/postList.json`)).default;
  return {
    locale,
    messages: { edit,postList, categoryList, createPost, layoutPost, post, detailPost, layoutAdmin, userList, auth, home },
  };
});
