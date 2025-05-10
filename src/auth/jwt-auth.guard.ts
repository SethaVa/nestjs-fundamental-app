import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { PayloadType } from '../types/payload.type';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        return super.canActivate(context);
    }
    handleRequest<TUser = PayloadType>(err: any, user: PayloadType): TUser {
        if (err || !user) {
            throw err || new UnauthorizedException();
        }
        console.log(user);
        if (user && user.artistId) {
            return user as TUser;
        }
        throw err || new UnauthorizedException();
    }
}
