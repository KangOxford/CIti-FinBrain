import { action, computed, observable } from "mobx";
import { User, UserRole } from "../models/user/User";
import { UserService } from "../api/UserService";
import { localStorage } from "./UiUtil";
import { Inject, Injectable } from "react.di";
import { HttpService } from "../api/HttpService";
import { RouterStore } from "../routing/RouterStore";
import { NetworkError } from "../api/NetworkResponse";
import { NotificationStore } from "./NotificationStore";

const USER_LOCALSTORAGE_KEY = "user";

export enum LoginErrorType {
  WrongCredential = "WrongCredential",
  ServerError = "ServerError",
  NetworkError = "NetworkError",
}

export interface LoginError {
  type: LoginErrorType;
}

export interface LoginWrongCredentialError extends LoginError {
  type: LoginErrorType.WrongCredential;
}

export interface LoginServerError extends LoginError {
  type: LoginErrorType.ServerError;
  messages: string[];
}

export interface LoginNetworkError extends LoginError {
  type: LoginErrorType.NetworkError;
  error: any;
}

export type KnownLoginError = LoginWrongCredentialError | LoginServerError | LoginNetworkError;

@Injectable
export class UserStore {
  @observable user: User = null;

  @computed get loggedIn() {
    return !!this.user;
  }

  get token() {
    return this.user ? this.user.token : null;
  }

  @computed get isAdmin() {
    return this.user && this.user.role === UserRole.ADMIN;
  }

  @action logout() {
    this.notificationStore.stopFetchLoop();
    this.notificationStore.notifications = [];
    this.user = null;
    this.httpService.token = "";
    this.userService.logout();
    this.clearUser();
  }

  @action login(user: User, remember: boolean) {
    this.user = user;
    this.userService.token = user.token;
    if (remember) {
      this.remember();
    }
    this.notificationStore.startFetchLoop();
  }

  remember() {
    localStorage.setItem(USER_LOCALSTORAGE_KEY, JSON.stringify(this.user));
  }

  clearUser() {
    localStorage.removeItem(USER_LOCALSTORAGE_KEY);
  }

  @action requestLogin = async (username: string, password: string): Promise<User> => {
    try {
      const response = await this.userService.login(username, password);
      return new User(response);
    } catch (e) {
      const {statusCode, info, isNetworkError} = e as NetworkError;
      if (statusCode === 401) {
        throw {type: LoginErrorType.WrongCredential};
      } else if (isNetworkError) {
        throw {type: LoginErrorType.NetworkError, error: info};
      } else {
        throw {type: LoginErrorType.ServerError, messages: info!.errorDescriptions } as LoginServerError;
      }
    }
  }

  constructor(@Inject private userService: UserService,
              @Inject private httpService: HttpService,
              @Inject private routerStore: RouterStore,
              @Inject private notificationStore: NotificationStore,
  ) {
    const user = localStorage.getItem(USER_LOCALSTORAGE_KEY);
    if (user) {
      try {
        this.login(new User(JSON.parse(user)), true);
      } catch (e) {
        console.log(e);
      }
    }
  }
}
