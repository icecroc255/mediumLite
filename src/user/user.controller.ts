import { Controller, DefaultValuePipe, Get, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { UserService } from './user.service';


@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @UseGuards(JwtGuard)
    @Get('me')
    getMe(@GetUser() user: User) {
        return user;
    }

    @Get()
    getAllUsers(
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
        @Query('offset', new DefaultValuePipe(0) , ParseIntPipe) offset?: number
    ) {
        return this.userService.getAllUsers(limit, offset);
    }
}
