import {
  BadRequestException,
  UnauthorizedException, 
  NotFoundException, 
  ForbiddenException, 
  NotAcceptableException, 
  RequestTimeoutException, 
  ConflictException, 
  GoneException, 
  PayloadTooLargeException, 
  UnsupportedMediaTypeException, 
  UnprocessableEntityException, 
  InternalServerErrorException, 
  NotImplementedException, 
  BadGatewayException, 
  ServiceUnavailableException, 
  GatewayTimeoutException
} from "@nestjs/common";

export class CustomBadRequestException extends BadRequestException {
  constructor(message: string) {
    super(message, 'Yêu cầu không hợp lệ');
  }
}

export class CustomUnauthorizedException extends UnauthorizedException {
  constructor(message?: string) {
    super(message || 'Không được phép');
  }
}

export class CustomNotFoundException extends NotFoundException {
  constructor(message?: string) {
    super(message || 'Không tìm thấy');
  }
}

export class CustomForbiddenException extends ForbiddenException {
  constructor(message?: string) {
    super(message || 'Cấm truy cập');
  }
}

export class CustomNotAcceptableException extends NotAcceptableException {
  constructor(message?: string) {
    super(message || 'Không chấp nhận được');
  }
}

export class CustomRequestTimeoutException extends RequestTimeoutException {
  constructor(message?: string) {
    super(message || 'Yêu cầu hết thời gian');
  }
}

export class CustomConflictException extends ConflictException {
  constructor(message?: string) {
    super(message || 'Xung đột');
  }
}

export class CustomGoneException extends GoneException {
  constructor(message?: string) {
    super(message || 'Đã biến mất');
  }
}

export class CustomPayloadTooLargeException extends PayloadTooLargeException {
  constructor(message?: string) {
    super(message || 'Payload quá lớn');
  }
}

export class CustomUnsupportedMediaTypeException extends UnsupportedMediaTypeException {
  constructor(message?: string) {
    super(message || 'Loại phương tiện không được hỗ trợ');
  }
}

export class CustomUnprocessableEntityException extends UnprocessableEntityException {
  constructor(message?: string) {
    super(message || 'Không thể xử lý thực thể');
  }
}

export class CustomInternalServerErrorException extends InternalServerErrorException {
  constructor(message?: string) {
    super(message || 'Lỗi máy chủ nội bộ');
  }
}

export class CustomNotImplementedException extends NotImplementedException {
  constructor(message?: string) {
    super(message || 'Chưa được thực hiện');
  }
}

export class CustomBadGatewayException extends BadGatewayException {
  constructor(message?: string) {
    super(message || 'Cổng xấu');
  }
}

export class CustomServiceUnavailableException extends ServiceUnavailableException {
  constructor(message?: string) {
    super(message || 'Dịch vụ không khả dụng');
  }
}

export class CustomGatewayTimeoutException extends GatewayTimeoutException {
  constructor(message?: string) {
    super(message || 'Hết thời gian chờ cổng');
  }
}
