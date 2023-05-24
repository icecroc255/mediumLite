import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2';
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        ) {}

    async signup(dto: AuthDto) {
        const hashedPassword = await argon.hash(dto.password);
        const existingUser = await this.prisma.user.findUnique({ where: { email: dto.email }});

        if (existingUser) {
            throw new ForbiddenException('Credentials already in use');
        }

        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                password: hashedPassword,
            },
            select: {
                id: true,
                email : true
            }
        });

        return this.signToken(user.id, user.email);
    }

    async signin(dto: AuthDto) {
        const user = await this.prisma.user.findUnique({ where: { email: dto.email }})

        if (!user) {
            throw new ForbiddenException('Credentials incorrect')
        }

        const passwordMatches = await argon.verify(user.password, dto.password);

        if (!passwordMatches) {
            throw new ForbiddenException('Credentials incorrect')
        }

        // delete user.password;
        return this.signToken(user.id, user.email);
    }

    async signToken(userId: number, email: string): Promise<{access_token: string}> {
      const payload = {
        sub: userId,
        email
      };

      const secret = 'SUPER-SECRET';

      const token = await this.jwt.signAsync(payload, {
        expiresIn: '15m',
        secret: secret,
      });

      return {
        access_token: token,
      }
    }
}