import { Inject, Injectable } from "react.di";
import { HttpService } from "./HttpService";
import { KnownNotification } from "../models/notification/Notification";
import { HttpMethod } from "./utils";

@Injectable
export class NotificationService {
  constructor(@Inject private httpService: HttpService) { }

  async getAllNotifications(): Promise<KnownNotification[]> {
    const res = await this.httpService.fetch({
      path: "/notification",
    });

    return res.response;
  }

  async removeNotification(id: string) {
    await this.httpService.fetch({
      path: "/notification",
      queryParams: { id },
      method: HttpMethod.DELETE,
    });
  }

}
