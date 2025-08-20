import { useEffect, useRef, useState } from "react";
import ChatForm from "../../components/chatform/ChatForm";
import { AIService } from "../../utils/aiService";
import { ConversationStorage, type Message } from "../../utils/conversationStorage";
import styles from "./ChatPage.module.css";

interface ChatPageProps {
  conversationId?: string;
}

export default function ChatPage({ conversationId }: ChatPageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesLengthRef = useRef(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  // 메시지가 업데이트될 때 스크롤을 맨 아래로
  useEffect(() => {
    if (messagesEndRef.current && messages.length > messagesLengthRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      messagesLengthRef.current = messages.length;
    }
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    const newMessage: Message = {
      id: crypto.randomUUID(),
      content,
      isUser: true,
      timestamp: new Date(),
    };

    // 로컬 상태 업데이트
    setMessages((prev) => [...prev, newMessage]);

    // 로컬 스토리지에 메시지 저장
    if (conversationId) {
      ConversationStorage.addMessage(conversationId, newMessage);
    }

    setIsLoading(true);

    // AI 응답 생성 및 추가
    AIService.createAIResponse(content)
      .then((aiResponse) => {
        setMessages((prev) => [...prev, aiResponse]);

        // AI 응답도 로컬 스토리지에 저장
        if (conversationId) {
          ConversationStorage.addMessage(conversationId, aiResponse);
        }
      })
      .catch((error) => {
        console.error("AI 응답 생성 실패:", error);
        // 에러 시 기본 응답 추가
        const errorResponse = {
          id: crypto.randomUUID(),
          content: "AI 응답을 생성하는 중 오류가 발생했습니다.",
          isUser: false,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorResponse]);

        if (conversationId) {
          ConversationStorage.addMessage(conversationId, errorResponse);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className={styles.chatPage}>
      <div className={styles.messagesContainer}>
        {messages.length === 0 ? (
          <div className={styles.emptyState}>
            <h3>안녕하세요! 👋</h3>
            <p>무엇을 도와드릴까요? 궁금한 것이 있으시면 언제든 물어보세요.</p>
          </div>
        ) : (
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
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className={styles.chatFormContainer}>
        <ChatForm onSubmit={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}
