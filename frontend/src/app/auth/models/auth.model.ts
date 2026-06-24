export interface TokenContainer {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse extends TokenContainer {}
export interface Auth extends TokenContainer {}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}
