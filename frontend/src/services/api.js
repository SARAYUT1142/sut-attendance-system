//  แก้ base API ตามที่ backend รันอยู่ ก่อน deploy จริงอย่าลืมเปลี่ยนเป็น URL จริง
const API_BASE = '/api';

export const createApiClient = (token) => async (endpoint, options = {}) => {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    ...(!options.isFormData && { 'Content-Type': 'application/json' }),
    ...(token && { Authorization: `Bearer ${token}` }), 
    ...options.headers,
  };
  const response = await fetch(url, { ...options, headers });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Something went wrong');
  return data;
};
