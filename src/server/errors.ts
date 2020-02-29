export enum ErrorType {
  INVALID_PASSWORD = "invalidPassword",
  INVALID_BODY = "invalidBody"
}

type IErrors  = {
  [key in ErrorType]: { code: number, details: string };
}

const errors: IErrors = {
  [ErrorType.INVALID_PASSWORD]: { code: 1, details: "Invalid Credentials"},
  [ErrorType.INVALID_BODY]: { code: 2, details: "Invalid Body"},
};

export const createError = (err: ErrorType) => {
  return errors[err];
};