import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const Protocol = createParamDecorator(
  (defaultValue: string, ctx: ExecutionContext) => {
    console.log('Protocol decorator defaultValue', defaultValue);
    const request = ctx.switchToHttp().getRequest();
    return request.protocol;
  },
);
