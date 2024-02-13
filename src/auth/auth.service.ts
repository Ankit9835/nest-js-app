import { Injectable } from '@nestjs/common';
import { UserRepository } from './users.repository';
import { AuthCredentialDto } from './dto/auth-credentials.dto';

@Injectable()
export class AuthService {
    constructor(private userEntityRepository: UserRepository) {}

    createUser(authcredentialDto: AuthCredentialDto): Promise<void> {
        return this.userEntityRepository.signUp(authcredentialDto)
    }

    logIn(authcredentialDto: AuthCredentialDto): Promise<{accessToken: string}> {
        return this.userEntityRepository.signIn(authcredentialDto)
    }
}
