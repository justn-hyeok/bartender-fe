import type { Message } from "./conversationStorage";

export class AIService {
  static isAIConnected(): boolean {
    // 현재는 항상 AI 연결되지 않은 상태로 고정
    return false;
  }

  static generateResponse(userMessage: string): Promise<string> {
    return new Promise((resolve) => {
      // MCP 질문에 대한 특별 응답
      if (userMessage.toLowerCase().includes('mcp가 뭐야') || 
          userMessage.toLowerCase().includes('mcp란') ||
          userMessage.toLowerCase().includes('mcp는')) {
        const mcpResponse = `MCP란 AI 모델(예: GPT 같은 LLM)이 외부 도구(엑셀), 데이터, API와 안전하게 연결될 수 있게 하는 프로토콜.

MCP의 목적은 모델이 단순히 "텍스트 생성기"에 머무르지 않고,
필요한 정보를 가져오거나 액션을 실행할 수 있도록 표준화된 인터페이스를 제공하는 것.

즉, AI에서의 MCP = AI가 외부 세계와 안전하고 일관되게 연결될 수 있게 해주는 프로토콜이라고 보면 돼요.`;
        
        // 3-5초 랜덤 딜레이
        const delay = Math.random() * 2000 + 3000; // 3000-5000ms
        setTimeout(() => {
          resolve(mcpResponse);
        }, delay);
        return;
      }

      // 메일 요약 요청 처리
      if (userMessage.toLowerCase().includes('메일 요약') && 
          (userMessage.includes('9시') || userMessage.includes('오후'))) {
        const emailResponse = `9시에 온 marketing@techcompany.com 메일 요약입니다.

제목: [중요] 신제품 출시 안내 및 마케팅 전략 회의 요청

요약:
- 새로운 AI 기반 프로덕트 런칭 예정 (다음 달 15일)
- 마케팅팀과 협업하여 런칭 전략 수립 필요
- 주요 타겟 고객층: 스타트업 및 중소기업 개발팀
- 예상 예산: 500만원 규모의 디지털 마케팅 캠페인
- 회의 일정: 이번 주 금요일 오후 2시 (회의실 B 예약됨)`;

        // 6-7초 랜덤 딜레이
        const delay = Math.random() * 1000 + 6000; // 6000-7000ms
        setTimeout(() => {
          resolve(emailResponse);
        }, delay);
        return;
      }

      // 한글파일 변환 요청 처리
      if (userMessage.toLowerCase().includes('한글파일') && 
          (userMessage.includes('옮겨') || userMessage.includes('만들어') || userMessage.includes('변환'))) {
        const hwpResponse = `요약한 메일을 한글파일로 만들어드리겠습니다.

📄 한글 문서 생성 완료:
- 파일명: 메일_요약_20250821.hwp
- 저장 위치: 문서/메일요약 폴더
- 포함 내용: 메일 제목, 발신자, 주요 내용 요약, 액션 아이템

한글 파일이 성공적으로 생성되었습니다. 문서를 확인해보세요!`;

        // 6-7초 딜레이
        const delay = Math.random() * 1000 + 6000; // 6000-7000ms
        setTimeout(() => {
          resolve(hwpResponse);
        }, delay);
        return;
      }

      if (!AIService.isAIConnected()) {
        resolve("AI가 연결되지 않았습니다.");
        return;
      }

      // TODO: 실제 AI API 호출 로직 구현
      setTimeout(() => {
        resolve("AI가 연결되지 않았습니다.");
      }, 2000);
    });
  }

  static async createAIResponse(userMessage: string): Promise<Message> {
    const content = await AIService.generateResponse(userMessage);

    return {
      id: crypto.randomUUID(),
      content,
      isUser: false,
      timestamp: new Date(),
    };
  }
}
