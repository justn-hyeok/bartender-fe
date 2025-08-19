export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  name: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

const STORAGE_KEY = 'bartender_conversations';

export class ConversationStorage {
  static getAll(): Conversation[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      
      const conversations = JSON.parse(stored);
      return conversations.map((conv: any) => ({
        ...conv,
        createdAt: new Date(conv.createdAt),
        updatedAt: new Date(conv.updatedAt),
        messages: conv.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      }));
    } catch (error) {
      console.error('대화 목록 로드 실패:', error);
      return [];
    }
  }

  static getById(id: string): Conversation | null {
    const conversations = this.getAll();
    return conversations.find(conv => conv.id === id) || null;
  }

  static save(conversations: Conversation[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    } catch (error) {
      console.error('대화 저장 실패:', error);
    }
  }

  static create(name: string, firstMessage?: Message): Conversation {
    const now = new Date();
    const conversation: Conversation = {
      id: Date.now().toString(),
      name,
      messages: firstMessage ? [firstMessage] : [],
      createdAt: now,
      updatedAt: now
    };

    const conversations = this.getAll();
    conversations.push(conversation);
    this.save(conversations);
    
    return conversation;
  }

  static update(id: string, updates: Partial<Conversation>): boolean {
    const conversations = this.getAll();
    const index = conversations.findIndex(conv => conv.id === id);
    
    if (index === -1) return false;
    
    conversations[index] = {
      ...conversations[index],
      ...updates,
      updatedAt: new Date()
    };
    
    this.save(conversations);
    return true;
  }

  static addMessage(conversationId: string, message: Message): boolean {
    const conversations = this.getAll();
    const index = conversations.findIndex(conv => conv.id === conversationId);
    
    if (index === -1) return false;
    
    conversations[index].messages.push(message);
    conversations[index].updatedAt = new Date();
    
    this.save(conversations);
    return true;
  }

  static delete(id: string): boolean {
    const conversations = this.getAll();
    const filtered = conversations.filter(conv => conv.id !== id);
    
    if (filtered.length === conversations.length) return false;
    
    this.save(filtered);
    return true;
  }

  static generateUniqueName(baseName: string): string {
    const conversations = this.getAll();
    const existingNames = conversations.map(conv => conv.name);
    
    let name = baseName;
    let counter = 1;
    
    while (existingNames.includes(name)) {
      name = `${baseName} ${counter}`;
      counter++;
    }
    
    return name;
  }
}