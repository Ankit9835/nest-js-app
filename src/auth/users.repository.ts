import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { AuthCredentialDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtPayLoadInterface } from './JwtPayload.interface';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class UserRepository {
    constructor(
        @InjectRepository(User)
        private readonly userEntityRepository: Repository<User>,
        private readonly jwtService: JwtService
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
            } else {
                throw new InternalServerErrorException()
            }
        }

        
    }

    async signIn (authcredentialDto: AuthCredentialDto): Promise<{accessToken: string}> {
        const {username, password} = authcredentialDto
        const user = await this.userEntityRepository.findOne({ where: { username } });
        if(user && await bcrypt.compare(password, user.password)){
            const payload: JwtPayLoadInterface = {username}
            const accessToken: string = await this.jwtService.sign(payload)
            return {accessToken}
        } else {
            throw new UnauthorizedException('Please provide valid username')
        }
    }
}
