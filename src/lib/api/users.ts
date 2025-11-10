const API = '/mock_api/users';

export const userApi = {
  getList: (page = 1, search = '') => {
    const params = new URLSearchParams({ page: page.toString() });
    if (search) params.append('search', search);
    return fetch(`${API}?${params}`).then((r) => r.json());
  },

  create: (data: any) =>
    fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then((r) => r.json()),
};
