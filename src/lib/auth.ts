import { jwtDecode } from 'jwt-decode';

export interface JwtPayload {
  role: 'employee' | 'hr';
  sub: number;
  email: string;
  exp: number;
}

// Безопасная функция — возвращает null на сервере
export const getRole = (): 'employee' | 'hr' | null => {
  if (typeof window === 'undefined') {
    return null; // На сервере — нет токена
  }

  const token = localStorage.getItem('access_token');
  if (!token) return null;

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    // Опционально: проверка истечения
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem('access_token');
      return null;
    }
    return decoded.role;
  } catch {
    localStorage.removeItem('access_token');
    return null;
  }
};

export const logout = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
  }
  window.location.href = '/login';
};