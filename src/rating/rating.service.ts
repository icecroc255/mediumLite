import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SetRateDto } from './dto';

@Injectable()
export class RatingService {
    constructor(private prisma: PrismaService) {}

    async setRateToPost(userId: number, dto: SetRateDto) {
        const { postId, rate } = dto;
        const existingRate = await this.prisma.postRating.findUnique({
            where: {
                postId_userId: {
                    postId, userId
                }
            }
        })

        if (existingRate) {
            return `You have already set the rate to post ${postId}`;
        } else {
            const postRating = await this.prisma.postRating.create({
            data: {
                postId: postId,
                userId: userId,
                rate: rate,
            },
        });

        return postRating;
        }

        
    }

    async getPostRating(postId: number) {
        const existingRate = await this.prisma.postRating.aggregate({
            _avg: {
                rate: true,
            },
            where: { postId: postId },
        })

        if (existingRate._avg.rate === null) {
            throw new NotFoundException(`Post ${postId} don't have a rating yet`);
        }

        return existingRate;
    }

    async getUserRating(userId: number) {
        const userRating = await this.prisma.postRating.aggregate({
            _avg: {
                rate: true,
            },
            where: { post : {
                authorId: userId,
            }}
        })

        if (userRating._avg.rate === null) {
            throw new NotFoundException(`User ${userId} don't have a rating yet`);
        }

        return userRating;
    }
}
