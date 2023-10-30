import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { UsersService } from "src/users/users.service";
import { ChatGateway } from "./chat.gateway";

@Injectable()
export class NotificationsService {
    constructor(private eventEmitter: EventEmitter2, private usersService: UsersService) {}

    
    sendFriendRequestNotification(userId: number, friendId: number) {
        //debug
        console.log("sendFriendRequestNotification triggered");
        //end debug
        this.eventEmitter.emit('friendRequest', userId, friendId);
    }

    sendGameRequestNotification(userId: number, friendId: number) {
        //debug
        console.log("sendGameRequestNotification triggered");
        //end debug

        this.eventEmitter.emit('gameRequest', friendId, userId);
    }

    sendGameStartNotification(gameState: string, userId: number) {
        //debug
        console.log("sendGameStartNotification triggered");
        //end debug

        this.eventEmitter.emit('gameState', userId, "ingame");

    }

    sendGameEndNotification(gameState: string, userId: number) {
        //debug
        console.log("sendGameEndNotification triggered");
        //end debug
        this.eventEmitter.emit('gameState', userId, "online");
    }


    //save user state
    async saveUserState(userId: number, state: string):Promise<boolean> {
        //debug
        console.log("saveUserState triggered");
        //end debug
        console.log('user state = ', userId, state);

        const isSaved  = await this.usersService.saveUserState(userId, state);
        if (!isSaved){
            return false;
        }
        return true;
    }

}

