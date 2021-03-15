import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import WebSocket from 'ws';

@WebSocketGateway()
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private client: WebSocket;

  async handleConnection(client: WebSocket, req: Request) {
    console.log(req);
    this.client = client;
    this.sendMessage('client', 'hello');
  }

  handleDisconnect(client: any) {
    console.log('client-close', client);
  }

  sendMessage(event: string, data: any) {
    try {
      this.client?.send(JSON.stringify({
        event,
        data,
      }));
    } catch (error) {
      console.log(error);
    }
  }

  @SubscribeMessage('serviceUpdate')
  onEvent(client: WebSocket, data: any): void {
    console.log(client, data);
    this.sendMessage('serviceUpdate', data);
    // return { event: 'events', data };
  }

  getClient() {
    return this.client;
  }
}
