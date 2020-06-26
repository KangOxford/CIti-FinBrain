import { isNumber } from "util";
import { action, observable } from "mobx";

export class BaseFormData {

  @observable confirmAttempted = false;

  isEmpty(content) {
    return !content;
  }

  onChange = (key: PropertyKey) => action((e: any) => {
    this[key] = e.target.value;
  })

  validateNumber(content: string, min?: number, max?: number) {

    if (!this.confirmAttempted) { return true; }

    const num = parseFloat(content);
    if (isNaN(num)) {
      return false;
    }

    if (min !== undefined && num < min) {
      return false;
    }

    if (max !== undefined && num > max) {
      return false;
    }

    return true;

  }
}
