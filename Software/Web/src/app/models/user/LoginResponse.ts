import { UserRole } from "./User";

export interface LoginResponse {
  token: string;
  role: UserRole;
  avatarUrl: string;
  username: string;
  email: string;
  emailValidated: boolean;
  expireAt: string;
}
