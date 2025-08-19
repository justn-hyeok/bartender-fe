import type { Message } from './conversationStorage';

export class AIService {
  static generateResponse(userMessage: string): Promise<string> {
    return new Promise((resolve) => {
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