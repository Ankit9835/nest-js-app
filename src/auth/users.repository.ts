import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { AuthCredentialDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UserRepository {
    constructor(
        @InjectRepository(User)
        private readonly userEntityRepository: Repository<User>,
    ) { }

    async signUp(authcredentialDto: AuthCredentialDto): Promise<void> {
        const { username, password } = authcredentialDto;

        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(password, salt)
        const user = await this.userEntityRepository.create({
            username,
            password: hashedPassword,
        });


        try {
            const insert = await this.userEntityRepository.save(user);
        } catch (error) {
            console.log(error.code)
            if(error.code === '23505'){
                throw new ConflictException('Username already exists')
            } else if(error.code === '25000') {
                throw new ConflictException('Something went wrong')
            } else {
                throw new InternalServerErrorException()
            }
        }

        
    }
}
