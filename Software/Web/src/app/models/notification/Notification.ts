
export enum NotificationType {
  PREFERENCE_EVALUATION = "PreferenceEvaluation",
  OTHERS = "Others",
}

export interface Notification {
  id: string;
  type: NotificationType;
  dateTime: string;
}

export interface PreferenceEvaluationNotification extends Notification {
  type: NotificationType.PREFERENCE_EVALUATION;
}

export interface OtherNotificaton extends Notification {
  type: NotificationType.OTHERS;
  content: string;
}

export type KnownNotification = PreferenceEvaluationNotification | OtherNotificaton;
