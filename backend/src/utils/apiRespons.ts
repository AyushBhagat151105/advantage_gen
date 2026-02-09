export class ApiResponse {
  statusCode: number;
  message: string;
  data: Object;

  constructor(statusCode: number, message: string, data?: Object) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data || {};
  }
}