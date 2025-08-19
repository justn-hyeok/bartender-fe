import type { Message } from './conversationStorage';

export class AIService {
  static isAIConnected(): boolean {
    // 현재는 항상 AI 연결되지 않은 상태로 고정
    return false;
  }

  static generateResponse(userMessage: string): Promise<string> {
    return new Promise((resolve) => {
      if (!this.isAIConnected()) {
        resolve('AI가 연결되지 않았습니다.');
        return;
      }
      
      // TODO: 실제 AI API 호출 로직 구현
      setTimeout(() => {
        resolve('AI가 연결되지 않았습니다.');
      }, 2000);
    });
  }

  static async createAIResponse(userMessage: string): Promise<Message> {
    const content = await this.generateResponse(userMessage);
    
    return {
      id: Date.now().toString(),
      content,
      isUser: false,
      timestamp: new Date()
    };
  }
}