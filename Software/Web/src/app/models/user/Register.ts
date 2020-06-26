import { UserRole } from "./User";

export interface RegisterParams {
  username: string;
  password: string;
  email: string;
  role: UserRole;
}

export interface RegisterResponse {
  token: string;
  expireAt: string;
}
