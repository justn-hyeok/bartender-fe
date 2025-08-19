import { useState, useEffect, useRef } from 'react';
import styles from './ChatPage.module.css';
import ChatForm from '../../components/chatform/ChatForm';
import { ConversationStorage, type Message } from '../../utils/conversationStorage';
import { AIService } from '../../utils/aiService';

interface ChatPageProps {
  conversationId?: string;
}

export default function ChatPage({ conversationId }: ChatPageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesLengthRef = useRef(0);

  // 대화 ID가 있을 때 해당 대화의 메시지 로드
  useEffect(() => {
    if (conversationId) {
      const conversation = ConversationStorage.getById(conversationId);
      if (conversation) {
        setMessages(conversation.messages);
        messagesLengthRef.current = conversation.messages.length;
      } else {
        // conversationId가 있지만 해당 대화를 찾을 수 없을 때도 빈 배열
        setMessages([]);
        messagesLengthRef.current = 0;
      }
    } else {
      // conversationId가 없을 때는 빈 메시지 배열
      setMessages([]);
      messagesLengthRef.current = 0;
    }
  }, [conversationId]);

  // 메시지 업데이트를 이벤트 기반으로 처리
  useEffect(() => {
    if (!conversationId) return;

    const handleMessagesUpdate = () => {
      const conversation = ConversationStorage.getById(conversationId);
      if (conversation) {
        setMessages(conversation.messages);
        messagesLengthRef.current = conversation.messages.length;
      }
    };

    // 구독 등록
    ConversationStorage.subscribe(conversationId, handleMessagesUpdate);

    return () => {
      ConversationStorage.unsubscribe(conversationId, handleMessagesUpdate);
    };
  }, [conversationId]);

  const handleSendMessage = async (content: string) => {

    const newMessage: Message = {
      id: crypto.randomUUID(),
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

    // AI 연결 상태 확인
    if (!AIService.isAIConnected()) {
      const aiResponse = await AIService.createAIResponse(content);
      setMessages(prev => [...prev, aiResponse]);

      if (conversationId) {
        ConversationStorage.addMessage(conversationId, aiResponse);
      }

      return;
    }

    setIsLoading(true);

    // AI 응답 생성 및 추가
    AIService.createAIResponse(content).then(aiResponse => {
      setMessages(prev => [...prev, aiResponse]);

      // AI 응답도 로컬 스토리지에 저장
      if (conversationId) {
        ConversationStorage.addMessage(conversationId, aiResponse);
      }
    }).catch(error => {
      console.error('AI 응답 생성 실패:', error);
      // 에러 시 기본 응답 추가
      const errorResponse = {
        id: crypto.randomUUID(),
        content: 'AI 응답을 생성하는 중 오류가 발생했습니다.',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
      
      if (conversationId) {
        ConversationStorage.addMessage(conversationId, errorResponse);
      }
    }).finally(() => {
      setIsLoading(false);
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
        <ChatForm onSubmit={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}
