import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async getAllUsers(limit?: number, offset?: number) {
        const users = await this.prisma.user.findMany({ 
            take: limit,
            skip: offset,
        });

        if (!users) {
            throw new NotFoundException(`Users not found`);
        }

        const usersWithoutPasswords = users.map(user => {
            const { password, ...data } = user;
            return data;
        })

        return usersWithoutPasswords;
    }
}
