"use strict";
// export function errorHandler(statusCode, message) {
//   const error = new Error();
//   error.statusCode = statusCode;
//   error.message = message;
//   return error;
// }
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
class CustomError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
    }
}
function errorHandler(statusCode, message) {
    return new CustomError(statusCode, message);
}
exports.default = CustomError;
