import {
    IsNotEmpty,
    IsInt,
    Min, Max
} from 'class-validator';

export class SetRateDto {
    @IsNotEmpty()
    @IsInt()
    @Min(1)
    @Max(10)
    rate: number;

    @IsNotEmpty()
    @IsInt()
    postId: number;
}