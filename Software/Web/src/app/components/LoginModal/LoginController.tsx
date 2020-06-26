import { action, computed, observable, runInAction } from "mobx";
import { Inject, Injectable } from "react.di";
import { UserService } from "../../api/UserService";
import { KnownLoginError, LoginErrorType, LoginServerError, UserStore } from "../../stores/UserStore";
import { User, UserRole } from "../../models/user/User";
import { LoginResponse } from "../../models/user/LoginResponse";
import { log } from "util";

export enum LoginState {
  NotLoggedIn,
  LoggingIn,
  RequireEmailValidation,
  LoggedIn,
}

export class LoginFormFields {
  @observable username: string;
  @observable password: string;
  @observable remember: boolean;
  @observable loginAttempted = false;

  @computed get usernameValid() {
    return !this.loginAttempted || !!this.username;
  }

  @computed get passwordValid() {
    return !this.loginAttempted || !!this.password;
  }

  @computed get valid() {
    return this.usernameValid && this.passwordValid;
  }
}

@Injectable
export class LoginController {
  @observable state: LoginState = LoginState.NotLoggedIn;
  @observable fields: LoginFormFields = new LoginFormFields();

  user: User; // store the LoginResponse for unvalidated user

  @action logout = () => {
    this.state = LoginState.NotLoggedIn;
  }

  constructor(@Inject private userService: UserService,
              @Inject private userStore: UserStore,

  ) {
  }

  @computed get loggingIn() {
    return this.state === LoginState.LoggingIn;
  }

  @action emailValidationComplete = (validated: boolean) => {
    if (validated) {
      this.completeLogin();
    } else {
      this.state = LoginState.NotLoggedIn;
    }
    this.user = null;
  }

  @action completeLogin() {

    this.userStore.login(this.user, this.fields.remember);

    this.state = LoginState.LoggedIn;
  }

  @action requestLogin = async (username: string, password: string) => {
    this.state = LoginState.LoggingIn;
    try {
      this.user = await this.userStore.requestLogin(username, password);
      runInAction(() => {
        if (this.user.emailValidated) {
          // login directly
          this.completeLogin();
        } else {
          // email not validated. into RequireEmailValidation state
          this.state = LoginState.RequireEmailValidation;
        }
      });
    } catch (e) {
      runInAction(() => {
        this.state = LoginState.NotLoggedIn;
      });
      throw e;
    }

  }
}
