import { Test, TestingModule } from '@nestjs/testing';
import { ChatGateway } from './chat.gateway';
import { Socket } from 'socket.io';

describe('ChatGateway', () => {
  let gateway: ChatGateway;
  let mockEmit: jest.Mock;
  let mockTo: jest.Mock;
  let mockToEmit: jest.Mock;

  beforeEach(async () => {
    mockEmit = jest.fn();
    mockToEmit = jest.fn();
    mockTo = jest.fn(() => ({
      emit: mockToEmit,
    }));

    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatGateway],
    }).compile();

    gateway = module.get<ChatGateway>(ChatGateway);
    gateway.server = {
      emit: mockEmit,
      to: mockTo,
    } as any;
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('handleSetNick', () => {
    it('should set nickname and emit userJoined', () => {
      const mockClient = { id: 'client1' } as Socket;
      const nick = 'user1';

      gateway.handleSetNick(nick, mockClient);

      expect(gateway['users'].get(mockClient.id)).toEqual({
        id: 'client1',
        nick: 'user1',
      });
      expect(mockEmit).toHaveBeenCalledWith(
        'userJoined',
        'user1 dołączył do czatu',
      );
    });

    it('should update nick on subsequent calls and emit userJoined each time', () => {
      const mockClient = { id: 'client1' } as Socket;
      gateway.handleSetNick('firstNick', mockClient);
      gateway.handleSetNick('secondNick', mockClient);

      expect(gateway['users'].get(mockClient.id).nick).toBe('secondNick');
      expect(mockEmit).toHaveBeenCalledTimes(2);
      expect(mockEmit).toHaveBeenNthCalledWith(
        1,
        'userJoined',
        'firstNick dołączył do czatu',
      );
      expect(mockEmit).toHaveBeenNthCalledWith(
        2,
        'userJoined',
        'secondNick dołączył do czatu',
      );
    });
  });

  describe('handleDisconnect', () => {
    it('should remove user and emit userLeft if user exists', () => {
      const mockClient = { id: 'client1' } as Socket;
      gateway['users'].set(mockClient.id, { id: 'client1', nick: 'user1' });

      gateway.handleDisconnect(mockClient);

      expect(gateway['users'].has(mockClient.id)).toBe(false);
      expect(mockEmit).toHaveBeenCalledWith('userLeft', 'user1 opuścił czat');
    });

    it('should not emit userLeft if user does not exist', () => {
      const mockClient = { id: 'client1' } as Socket;

      gateway.handleDisconnect(mockClient);

      expect(mockEmit).not.toHaveBeenCalled();
    });
  });

  describe('handleMessage', () => {
    it('should emit newMessage when user exists', () => {
      const mockClient = { id: 'client1' } as Socket;
      const user = { id: 'client1', nick: 'user1' };
      gateway['users'].set(mockClient.id, user);

      gateway.handleMessage('Hello', mockClient);

      expect(mockEmit).toHaveBeenCalledWith('newMessage', {
        user: 'user1',
        message: 'Hello',
        timestamp: expect.any(Date),
      });
    });

    it('should not emit newMessage if user does not exist', () => {
      const mockClient = { id: 'client1' } as Socket;

      gateway.handleMessage('Hello', mockClient);

      expect(mockEmit).not.toHaveBeenCalled();
    });
  });

  describe('handlePrivateMessage', () => {
    it('should send private message to recipient', () => {
      const senderClient = { id: 'senderId' } as Socket;
      const recipientUser = { id: 'recipientId', nick: 'recipientNick' };
      gateway['users'].set(senderClient.id, {
        id: 'senderId',
        nick: 'senderNick',
      });
      gateway['users'].set(recipientUser.id, recipientUser);

      const data = { recipient: 'recipientNick', message: 'Hi' };
      gateway.handlePrivateMessage(data, senderClient);

      expect(mockTo).toHaveBeenCalledWith('recipientId');
      expect(mockToEmit).toHaveBeenCalledWith('privateMessage', {
        from: 'senderNick',
        message: 'Hi',
        timestamp: expect.any(Date),
      });
    });

    it('should not send private message if recipient does not exist', () => {
      const senderClient = { id: 'senderId' } as Socket;
      gateway['users'].set(senderClient.id, {
        id: 'senderId',
        nick: 'senderNick',
      });

      const data = { recipient: 'nonExistent', message: 'Hi' };
      gateway.handlePrivateMessage(data, senderClient);

      expect(mockTo).not.toHaveBeenCalled();
      expect(mockToEmit).not.toHaveBeenCalled();
    });

    it('should not send private message if sender does not exist', () => {
      const senderClient = { id: 'senderId' } as Socket;

      const data = { recipient: 'recipientNick', message: 'Hi' };
      gateway.handlePrivateMessage(data, senderClient);

      expect(mockTo).not.toHaveBeenCalled();
      expect(mockToEmit).not.toHaveBeenCalled();
    });
  });
});
