// nest g interceptor common/interceptors/wrap-response

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
// import { Observable, tap } from 'rxjs';
import { Observable, map } from 'rxjs';

@Injectable()
export class WrapResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...');
    // return next.handle().pipe(tap((data) => console.log('After...', data)));
    // 将返回的数据放到 {data: xxx} 中
    return next.handle().pipe(map((data) => ({ data })));
  }
}
