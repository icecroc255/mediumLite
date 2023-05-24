import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto';

@Injectable()
export class PostService {
    constructor(private prisma: PrismaService) {}

    async getUserPosts(userId: number, limit?: number, offset?: number) {
        const posts = await this.prisma.post.findMany({ where: { authorId: userId }, skip: offset, take: limit });

        if (!posts) {
            throw new NotFoundException('You have no posts yet');
        }

        return posts;
    }

    async getPostById(postId: number) {
        const post = await this.prisma.post.findFirst({ where: { id: postId } });

        if (!post) {
            throw new NotFoundException(`Post with id:${postId} not found`);
        }

        return post;
    }

    async createPost(userId: number, dto: CreatePostDto) {
        const existingPost = await this.prisma.post.findUnique({ where: { title: dto.title } });

        if (existingPost) {
            throw new ForbiddenException('Post with the same title already exists')
        }

        const readingTime = await this.calculateReadingTime(dto.content);

        const post = await this.prisma.post.create({
            data: {
                authorId: userId,
                readingTime: readingTime,
                ...dto
            },
        });

        return post;
    }

    private async calculateReadingTime(content: string): Promise<number> {
        const wordsPerMinute = 240;
        const words = content.split(' ').length;
        const readingTime = Math.ceil(words / wordsPerMinute);

        return readingTime;
    }
}
