import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.env.STAGE}.env`,
    }),
    TaskModule,
    TypeOrmModule.forRootAsync({
      imports:[ConfigModule],
      inject:[ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          type:'postgres',
          autoLoadEntities: true,
          synchronize: true,
          host:configService.get('DB_HOST'),
          port:configService.get('DB_PORT'),
          username:configService.get('DB_USERNAME'),
          password:configService.get('DB_PASSWORD'),
          database:configService.get('DB_DATABASE')
        }
      }
    }),
    TaskModule,
    AuthModule
  ],
})
export class AppModule {}
