import { MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway()
export class GameGateway {
  @SubscribeMessage('message')
  handleMessage(@MessageBody() body: any)
  {
    console.log(body);
  }
}
