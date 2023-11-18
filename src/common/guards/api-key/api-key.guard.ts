// nest g guard common/guards/api-key
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/common/decorators/public.decorator';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
  ) {} // 注入 reflector

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.get(IS_PUBLIC_KEY, context.getHandler()); // 获取元数据
    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest<Request>(); // 获取请求对象
    const authHeader = request.header('Authorization'); // 获取请求头中的 Authorization 字段
    return authHeader === this.configService.get('API_KEY'); // 返回是否匹配
  }
}
