export class SuccessResponseDto<T = any> {
  success: boolean = true;
  message: string;
  data: T;

  constructor(message: string, data: T) {
    this.message = message;
    this.data = data;
  }
}

export class ErrorResponseDto {
  success: boolean = false;
  message: string;
  statusCode: number;
  error?: any;

  constructor(message: string, statusCode = 500, error?: any) {
    this.message = message;
    this.statusCode = statusCode;
    this.error = error;
  }
}
