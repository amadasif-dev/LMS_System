import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../core/store/hooks';
import { fetchMessages, sendMessage, fetchConversations } from '../../../core/store/slices/chatSlice';
import { Card } from '../../../shared/components/Card/Card';
import { Button } from '../../../shared/components/Button/Button';
import { Input } from '../../../shared/components/Input/Input';
import { Loader } from '../../../shared/components/Loader/Loader';
import { Send, User } from 'lucide-react';
import { formatDate } from '../../../core/utils/helpers';

export const ChatRoom = () => {
  const dispatch = useAppDispatch();
  const { messages, conversations, loading } = useAppSelector((state) => state.chat);
  const { user } = useAppSelector((state) => state.auth);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  useEffect(() => {
    if (selectedUser) {
      dispatch(fetchMessages({ userId: selectedUser }));
    }
  }, [dispatch, selectedUser]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;
    await dispatch(sendMessage({
      receiverId: selectedUser,
      content: newMessage,
    }));
    setNewMessage('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-600">Chat with teachers and students</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        <Card className="p-4 overflow-y-auto">
          <h3 className="font-semibold text-gray-900 mb-4">Conversations</h3>
          {loading ? (
            <Loader />
          ) : (
            <div className="space-y-2">
              {conversations.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No conversations yet</p>
              ) : (
                conversations.map((conv: any) => (
                  <button
                    key={conv.userId}
                    onClick={() => setSelectedUser(conv.userId)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      selectedUser === conv.userId ? 'bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-500" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-gray-900">User</p>
                      <p className="text-sm text-gray-500 truncate">{conv.lastMessage?.content || 'No messages'}</p>
                    </div>
                    {conv.unreadCount > 0 && (
                      <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1">
                        {conv.unreadCount}
                      </span>
                    )}
                  </button>
                ))
              )}
            </div>
          )}
        </Card>

        <Card className="lg:col-span-2 p-4 flex flex-col">
          {selectedUser ? (
            <>
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {messages.map((msg: any) => (
                  <div
                    key={msg._id}
                    className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        msg.senderId === user?.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p>{msg.content}</p>
                      <p className={`text-xs mt-1 ${msg.senderId === user?.id ? 'text-blue-200' : 'text-gray-500'}`}>
                        {formatDate(msg.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} leftIcon={<Send className="h-4 w-4" />} />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a conversation to start messaging
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
