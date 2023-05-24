import {
    IsNotEmpty,
    IsString,
    IsOptional,
} from 'class-validator';

export class UpdatePostDto {
    @IsNotEmpty()
    @IsString()
    @IsOptional()
    title?: string;

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    content?: string;
}