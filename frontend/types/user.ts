export interface User {
  id: string;
  email: string;
  role: 'user' | 'robot_owner' | 'admin';
  wallet_address?: string;
  total_spent: number;
  created_at: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserRegister {
  email: string;
  password: string;
  role?: string;
  wallet_address?: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user: User;
}
