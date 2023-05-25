import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { RatingService } from './rating.service';
import { GetUser } from 'src/auth/decorator';
import { SetRateDto } from './dto';

@UseGuards(JwtGuard)
@Controller('rating')
export class RatingController {
    constructor(private ratingService: RatingService) {}

    @Post()
    setRateToPost(
        @GetUser('id') userId: number,
        @Body() dto: SetRateDto
    ) {
        return this.ratingService.setRateToPost(userId, dto);
    }

    @Get()
    getPostRating(
        @Query('postId', ParseIntPipe) postId: number
    ) {
        return this.ratingService.getPostRating(postId);
    }

    @Get('my')
    getUserRating(
        @GetUser('id') userId: number
    ) {
        return this.ratingService.getUserRating(userId);
    }
}
