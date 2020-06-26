import { UserStore } from "./UserStore";
import { UiStore } from "./UiStore";
import { NotificationStore } from "./NotificationStore";

export default function(useMock: boolean) {
  return [
    { provide: UserStore, useClass: UserStore },
    { provide: NotificationStore, useClass: NotificationStore },
    UiStore,
  ];
}
