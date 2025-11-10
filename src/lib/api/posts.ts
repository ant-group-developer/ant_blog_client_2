const API = '/mock_api/posts';

export const postApi = {
  getList: (page = 1, search = '', category_id?: string) => {
    const params = new URLSearchParams({ page: page.toString() });
    if (search) params.append('search', search);
    if (category_id) params.append('category_id', category_id);
    return fetch(`${API}?${params}`).then((r) => r.json());
  },

  getById: (id: string) => fetch(`${API}/${id}`).then((r) => r.json()),

  create: (data: any) =>
    fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then((r) => r.json()),

  delete: (id: string) => fetch(`${API}?id=${id}`, { method: 'DELETE' }).then((r) => r.json()),
};
