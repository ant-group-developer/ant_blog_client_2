const API = '/mock_api/categories';

export const categoryApi = {
  getList: (page = 1, search = '', id?: string) => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    if (search) params.append('search', search);
    if (id) params.append('id', id);
    return fetch(`${API}?${params}`).then((r) => r.json());
  },
  create: (data: any) =>
    fetch(API, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    }).then((r) => r.json()),
  delete: (id: string) => fetch(`${API}?id=${id}`, { method: 'DELETE' }).then((r) => r.json()),
};
