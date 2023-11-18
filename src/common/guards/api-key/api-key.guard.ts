// nest g guard common/guards/api-key
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>(); // 获取请求对象
    const authHeader = request.header('Authorization'); // 获取请求头中的 Authorization 字段
    return authHeader === process.env.API_KEY; // 返回是否匹配
  }
}
