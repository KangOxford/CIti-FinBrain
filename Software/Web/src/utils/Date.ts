import moment from "moment";

export function getTodayDate() {
  return moment().format("YYYY-MM-DD");
}
