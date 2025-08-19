import { useState, useEffect } from 'react';
import styles from './ChatPage.module.css';
import ChatForm from '../components/chatform/ChatForm';
import { ConversationStorage, type Message } from '../utils/conversationStorage';
import { AIService } from '../utils/aiService';

interface ChatPageProps {
  conversationId?: string;
}

export default function ChatPage({ conversationId }: ChatPageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isFirstAIResponsePending, setIsFirstAIResponsePending] = useState(false);

  // 대화 ID가 있을 때 해당 대화의 메시지 로드
  useEffect(() => {
    if (conversationId) {
      const conversation = ConversationStorage.getById(conversationId);
      if (conversation) {
        setMessages(conversation.messages);
        
        // 첫 번째 AI 응답이 아직 오지 않았는지 확인
        const hasUserMessage = conversation.messages.some(msg => msg.isUser);
        const hasAIResponse = conversation.messages.some(msg => !msg.isUser);
        setIsFirstAIResponsePending(hasUserMessage && !hasAIResponse);
      }
    } else {
      // conversationId가 없을 때는 빈 메시지 배열
      setMessages([]);
      setIsFirstAIResponsePending(false);
    }
  }, [conversationId]);

  const handleSendMessage = (content: string) => {
    // 첫 번째 AI 응답 대기 중이면 새 메시지 전송 불가
    if (isFirstAIResponsePending) {
      return;
    }
    
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: new Date()
    };
    
    // 로컬 상태 업데이트
    setMessages(prev => [...prev, newMessage]);
    
    // 로컬 스토리지에 메시지 저장
    if (conversationId) {
      ConversationStorage.addMessage(conversationId, newMessage);
    }
    
    setIsLoading(true);
    
    // AI 응답 생성 및 추가
    AIService.createAIResponse(content).then(aiResponse => {
      setMessages(prev => [...prev, aiResponse]);
      
      // AI 응답도 로컬 스토리지에 저장
      if (conversationId) {
        ConversationStorage.addMessage(conversationId, aiResponse);
      }
      
      setIsLoading(false);
      setIsFirstAIResponsePending(false); // 첫 AI 응답 완료
    });
  };

  return (
    <div className={styles.chatPage}>
      <div className={styles.messagesContainer}>
        <div className={styles.messagesList}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`${styles.messageWrapper} ${
                message.isUser ? styles.userMessage : styles.aiMessage
              }`}
            >
              <div className={styles.messageBubble}>
                <p className={styles.messageText}>{message.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className={styles.chatFormContainer}>
        <ChatForm onSubmit={handleSendMessage} isLoading={isLoading || isFirstAIResponsePending} />
      </div>
    </div>
  );
}
