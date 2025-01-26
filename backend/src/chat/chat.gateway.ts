import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface User {
  id: string;
  nick: string;
}

@WebSocketGateway(3001, {
  cors: {
    origin: '*',
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private users: Map<string, User> = new Map();

  afterInit(server: Server) {
    // console.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    // console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    const user = this.users.get(client.id);
    if (user) {
      this.users.delete(client.id);
      this.server.emit('userLeft', `${user.nick} opuścił czat`);
    }
  }

  @SubscribeMessage('setNick')
  handleSetNick(
    @MessageBody() nick: string,
    @ConnectedSocket() client: Socket,
  ): void {
    this.users.set(client.id, { id: client.id, nick });
    this.server.emit('userJoined', `${nick} dołączył do czatu`);
  }

  @SubscribeMessage('sendMessage')
  handleMessage(
    @MessageBody() message: string,
    @ConnectedSocket() client: Socket,
  ): void {
    const user = this.users.get(client.id);
    if (user) {
      this.server.emit('newMessage', {
        user: user.nick,
        message,
        timestamp: new Date(),
      });
    }
  }

  @SubscribeMessage('privateMessage')
  handlePrivateMessage(
    @MessageBody() data: { recipient: string; message: string },
    @ConnectedSocket() client: Socket,
  ): void {
    const sender = this.users.get(client.id);
    const recipient = Array.from(this.users.values()).find(
      (user) => user.nick === data.recipient,
    );

    if (!sender || !recipient) return;

    this.server.to(recipient.id).emit('privateMessage', {
      from: sender.nick,
      message: data.message,
      timestamp: new Date(),
    });
  }
}
