export class SuccessResponseDto<T = any> {
  success: boolean = true;
  message: string;
  data: T;

  constructor(message: string, data: T) {
    this.message = message;
    this.data = data;
  }
}
