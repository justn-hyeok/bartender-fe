import { useState } from 'react';
import styles from './NewPage.module.css';
import Title from '../../components/title/Title';
import ChatForm from '../../components/chatform/ChatForm';
import type { Message } from '../../utils/conversationStorage';
import { ConversationStorage } from '../../utils/conversationStorage';
import { AIService } from '../../utils/aiService';

interface NewPageProps {
  onAddConversation?: ((name: string, firstMessage?: Message) => string) | null;
}

const CONVERSATION_NAME_MAX_LENGTH = 12;

export default function NewPage({ onAddConversation }: NewPageProps) {
  const [isLoading, setIsLoading] = useState(false);

  const generateConversationName = (message: string): string => {
    // 메시지에서 대화 제목 생성
    const cleanMessage = message.trim().replace(/\s+/g, ' ');
    return cleanMessage.length > CONVERSATION_NAME_MAX_LENGTH 
      ? cleanMessage.substring(0, CONVERSATION_NAME_MAX_LENGTH) + '...' 
      : cleanMessage;
  };

  const handleMessageSubmit = async (message: string) => {
    if (onAddConversation) {
      setIsLoading(true);

      const conversationName = generateConversationName(message);

      // 첫 메시지 객체 생성
      const firstMessage: Message = {
        id: crypto.randomUUID(),
        content: message,
        isUser: true,
        timestamp: new Date()
      };

      // 즉시 대화 생성
      const conversationId = onAddConversation(conversationName, firstMessage);

      // AI 연결 상태 확인 후 응답 생성
      if (!AIService.isAIConnected()) {
        const aiResponse = await AIService.createAIResponse(message);
        ConversationStorage.addMessage(conversationId, aiResponse);
        setIsLoading(false);
        return;
      }

      // AI 응답 생성 및 추가
      AIService.createAIResponse(message).then(aiResponse => {
        ConversationStorage.addMessage(conversationId, aiResponse);
      }).catch(error => {
        console.error('AI 응답 생성 실패:', error);
        // 에러 시 기본 응답 추가
        const errorResponse = {
          id: crypto.randomUUID(),
          content: 'AI 응답을 생성하는 중 오류가 발생했습니다.',
          isUser: false,
          timestamp: new Date()
        };
        ConversationStorage.addMessage(conversationId, errorResponse);
      }).finally(() => {
        setIsLoading(false);
      });

    } else {
      if (process.env.NODE_ENV === 'development') {
        console.log('메시지 전송:', message);
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Title userName="부산소마고채찍피티조련마스터18세김현우" />
        <ChatForm onSubmit={handleMessageSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
}
