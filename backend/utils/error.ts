// export function errorHandler(statusCode, message) {
//   const error = new Error();
//   error.statusCode = statusCode;
//   error.message = message;
//   return error;
// }

class CustomError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

export function errorHandler(statusCode: number, message: string) {
  return new CustomError(statusCode, message);
}

export default CustomError;
