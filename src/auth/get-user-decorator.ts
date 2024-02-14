import { createParamDecorator, ExecutionContext  } from "@nestjs/common";
import { ExecutionContextHost } from "@nestjs/core/helpers/execution-context-host";
import { User } from "./user.entity";

export const GetUser = createParamDecorator(
    (_data,ctx: ExecutionContext): User => {
        const req = ctx.switchToHttp().getRequest()
        return req.user
    }
)