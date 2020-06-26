import moment from "moment";

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

export class User {
  username: string;
  role: UserRole;
  token: string;
  email: string;
  avatarUrl: string;
  registerDate: moment.Moment;
  emailValidated: boolean;

  constructor(params: Partial<User>) {
    Object.assign(this, params);
    this.registerDate = moment(params.registerDate);
  }

}
