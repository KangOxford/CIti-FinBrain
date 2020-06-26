import { action, computed, observable, runInAction } from "mobx";
import { KnownNotification } from "../models/notification/Notification";
import { Inject, Injectable } from "react.di";
import { NotificationService } from "../api/NotificationService";

const REFRESH_INTERVAL_MS = 2 * 60 * 1000; // 2 min

@Injectable
export class NotificationStore {
  @observable.ref notifications: KnownNotification[] = [];

  @observable refreshing: boolean = false;
  @observable notificationDrawerShown: boolean = false;

  private refreshTimer: NodeJS.Timer;

  @action toggleNotificationDrawerShown = () => {
    this.notificationDrawerShown = !this.notificationDrawerShown;
  }

  @computed get count() {
    return this.notifications.length;
  }

  constructor(@Inject private notificationService: NotificationService) { }

  @action refresh = async () => {
    this.refreshing = true;
    const result = await this.notificationService.getAllNotifications();
    runInAction(() => {
      this.refreshing = false;
      this.notifications = result;
    });
  }

  @action removeNotification = async (id: string) => {
    this.notifications = this.notifications.filter((x) => x.id !== id);
    await this.notificationService.removeNotification(id);
  }

  startFetchLoop() {
    this.refreshTimer = setInterval(this.refresh, REFRESH_INTERVAL_MS);
  }

  stopFetchLoop() {
    clearInterval(this.refreshTimer);
  }

}
