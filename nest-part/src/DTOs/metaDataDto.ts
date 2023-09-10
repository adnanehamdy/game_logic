import { IsNumber } from 'class-validator';

export class metaDataDTO
{
    @IsNumber()
    windowWidth: number;
    @IsNumber()
    windowHeight: number;
    @IsNumber()
    width: number;
    @IsNumber()
    height: number;
}