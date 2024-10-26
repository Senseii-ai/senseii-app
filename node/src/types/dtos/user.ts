export interface User extends Record<string, any> {
  id: string;
  email: string;
  password: string;
  accessToken?: string;
  salt: string;
}
