import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export default getRequestConfig(async () => {
  const store = await cookies();
  const locale = store.get('locale')?.value || 'en';

  const home = (await import(`../../messages/${locale}/home.json`)).default;
  const createPost = (await import(`../../messages/${locale}/createPost.json`)).default;

  return {
    locale,
    messages: { home, createPost },
  };
});
