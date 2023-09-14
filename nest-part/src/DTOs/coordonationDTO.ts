import { IsNumber } from 'class-validator';

export class coordonationDTO
{
    @IsNumber()
    x: number;
    @IsNumber()
    y: number;
    @IsNumber()
    w: number;
    @IsNumber()
    h: number;
}