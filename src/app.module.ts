import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { PrismaModule } from './prisma/prisma.module';
import { RatingModule } from './rating/rating.module';

@Module({
  imports: [AuthModule, UserModule, PostModule, PrismaModule, RatingModule],
})

export class AppModule {}
