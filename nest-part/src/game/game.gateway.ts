import { OnModuleInit } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';


@WebSocketGateway(
  {
    cors: {
      origin: ['http://localhost:5173'],
    },
  }
)
export class GameGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;
  @SubscribeMessage('message')
  handleMessage(@MessageBody() body: any) {
    console.log(body);
  }
  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(socket.id);
      console.log('connectd');
    });
  }
}
