export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  repassword?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    role: 'user' | 'admin';
  };
}
