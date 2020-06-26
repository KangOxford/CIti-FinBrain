import { Injectable } from "react.di";
import { UserService } from "../UserService";
import { UserRole } from "../../models/user/User";
import { LoginResponse } from "../../models/user/LoginResponse";
import { RegisterParams, RegisterResponse } from "../../models/user/Register";
import { EmailValidationRequestReceipt } from "../../models/user/EmailValidation";
import { NetworkError } from "../NetworkResponse";
import { UserProfile } from "../../models/user/UserProfile";
import { InvestmentPreference } from "../../models/user/InvestmentPreference";
import { PreferenceEvaluationAnswer, PreferenceEvaluationResult } from "../../models/user/PreferenceEvaluation";
import { waitForMs } from "../../../utils/Wait";

const sampleAvatar = "https://en.gravatar.com/userimage/57315252/e9c37404163b4b2e73fd72003e391aac.jpg?size=200";

@Injectable
export class UserServiceMock extends UserService {

  async login(username: string, password: string): Promise<LoginResponse> {

    if (username === "user" && password === "user") {
      return {
        token: "123",
        role: UserRole.USER,
        avatarUrl: null,
        // avatarUrl: sampleAvatar,
        username,
        email: `${username}@test.com`,
        emailValidated: true,
        expireAt: Date.now().toString(),
      };
    } else {
      throw { statusCode: 401 };
    }
  }

  logout() {

  }

  async register(params: RegisterParams): Promise<RegisterResponse> {
    return {
      token: "123",
      expireAt: "null",
    };
  }

  async requestEmailValidation(token: string): Promise<EmailValidationRequestReceipt> {
    await waitForMs(1000);

    return {
      validationToken: "123",
      expireAt: "123",
    };
  }

  async validateEmail(token: string, code: string, userToken: string): Promise<void> {
    if (Math.random() <= 0.5) {
      throw {
        statusCode: 400,
      } as NetworkError;
    }
  }

  async getUserProfile(username: string): Promise<UserProfile> {
    return {
      username,
      email: "smallda@outlook.com",
      registerDate: "123",
      avatarUrl: sampleAvatar,

    };
  }

  async getUserInvestmentPreference(username: string): Promise<InvestmentPreference> {
    return {
      fluctuation: 10,
      profit: 5,
    };
  }
  async setUserInvestmentPreference(username: string, pref: InvestmentPreference): Promise<void> {
  }

  async evaluatePreference(answers: PreferenceEvaluationAnswer): Promise<PreferenceEvaluationResult> {

    await waitForMs(2000);
    return {
      profit: 10,
      fluctuation: 5,
    };
  }

  async setCitiAccount(username: string, password: string): Promise<void> {
    const encrypted = this.encrypt({
      modulus: "9e698de123c3484b174dcaadbc4cb46bc31341a2b743a1a25a1a34e44c9b655f31bfded01b9e14a9b548511d1bfdb9d93b2bbd8fe029fea49376e2f652f3dacc3cc1cf1a15d96726b3e573313803c5be73d154f30820d1e79e17e2d73b4e4fe0b0af406dcddfdb9e0a8d60ca266586bc4d64bd6d08cb37cba72de8240e72d4ed1ef46c76b1df9edd200563ec0614b820f2c6cf847283f74a3105e357a271742b1191314f5ce344f5b39db8caad53d0e6313ee3269aa54e1d3226c072f845e43d950044d77ea3879d65f2b112f7d889ebf793df4d7f247458b623d504c904a6e447fd3283db162d0c84a30b1b1c83d7a43a5ddf9e40165c306bce993bf37e22e3",
      exponent: "10001", eventId: "24FCE4D8FA4E6E1212E7196060852307"}, password);

    console.log(encrypted);
  }

  async getCitiAccount(): Promise<{ username: string }> {
    return { username: null };
  }
}
