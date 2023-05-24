import { Body, Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { PostService } from './post.service';
import { GetUser } from 'src/auth/decorator';
import { CreatePostDto } from './dto';


@Controller('posts')
export class PostController {
    constructor(private postService: PostService) {}

    @UseGuards(JwtGuard)
    @Get()
    getUserPosts(
        @GetUser('id') userId: number,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
        @Query('offset', new DefaultValuePipe(0) , ParseIntPipe) offset?: number
    ) {
        return this.postService.getUserPosts(userId, limit, offset);
    }

    @Get(':id')
    getPostById(@Param('id', ParseIntPipe) postId: number) {
        return this.postService.getPostById(postId);
    }

    @UseGuards(JwtGuard)
    @Post()
    createPost(@GetUser('id') userId: number, @Body() dto: CreatePostDto) {
        return this.postService.createPost(userId, dto);
    }
}
