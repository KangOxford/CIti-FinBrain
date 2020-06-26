import { Injectable } from "react.di";
import { NotificationService } from "../NotificationService";
import { range } from "../../../utils/Range";
import { KnownNotification, Notification, NotificationType } from "../../models/notification/Notification";
import moment from "moment";

@Injectable
export class NotificationServiceMock extends NotificationService {

  async getAllNotifications(): Promise<KnownNotification[]> {
    return [{
      id: "1",
      type: NotificationType.PREFERENCE_EVALUATION,
      dateTime: moment().format(),
    }];
  }

  async removeNotification(id: string): Promise<void> {

  }
}
