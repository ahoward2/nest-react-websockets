import { Module } from '@nestjs/common';
import { CaslModule } from '../casl/casl.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [CaslModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
