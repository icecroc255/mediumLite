import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RatingService {
    constructor(private prisma: PrismaService) {}

    async setRatingToPost(userId: number, postId: number, rate: number) {
        const existingRate = await this.prisma.postRating.findUnique({
            where: {
                postId_userId: {
                    postId, userId
                }
            }
        })

        if (existingRate) {
            throw new ForbiddenException(`You have already set the rate to post ${postId}`);
        }

        const postRating = await this.prisma.postRating.create({
            data: {
                postId: postId,
                userId: userId,
                rate: rate,
            },
        });

        return postRating;
    }

    async getPostRating(postId: number) {
        const existingRate = await this.prisma.postRating.aggregate({
            _avg: {
                rate: true,
            },
            where: { postId: postId },
        })

        if (!existingRate) {
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

        if (!userRating) {
            throw new NotFoundException(`User ${userId} don't have a rating yet`);
        }

        return userRating;
    }
}
