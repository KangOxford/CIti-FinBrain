export interface EmailValidationRequestReceipt {
  validationToken: string;
  expireAt: string;
}

export interface EmailValidationParams {
  validationToken: string;
  validationCode: string;
}
