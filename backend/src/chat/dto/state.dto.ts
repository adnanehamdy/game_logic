import { IsNotEmpty, IsNumber, IsNumberString, IsString , IsIn} from "class-validator";

export class StateDto {
    @IsString()
    @IsIn(['endgame', 'ingame'])
    state: string;
}