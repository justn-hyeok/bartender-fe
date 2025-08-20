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

const STORAGE_KEY = "bartender_conversations";

type ConversationUpdateListener = (conversationId: string) => void;

// Storage에서 불러올 때 사용하는 타입들
interface StoredMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: string; // ISO string으로 저장됨
}

interface StoredConversation {
  id: string;
  name: string;
  messages: StoredMessage[];
  createdAt: string; // ISO string으로 저장됨
  updatedAt: string; // ISO string으로 저장됨
}

export class ConversationStorage {
  private static listeners: Map<string, Set<ConversationUpdateListener>> = new Map();
  static getAll(): Conversation[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];

      const conversations: StoredConversation[] = JSON.parse(stored);
      return conversations.map((conv: StoredConversation) => ({
        ...conv,
        createdAt: new Date(conv.createdAt),
        updatedAt: new Date(conv.updatedAt),
        messages: conv.messages.map((msg: StoredMessage) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        })),
      }));
    } catch (error) {
      console.error("대화 목록 로드 실패:", error);
      return [];
    }
  }

  static getById(id: string): Conversation | null {
    const conversations = ConversationStorage.getAll();
    return conversations.find((conv) => conv.id === id) || null;
  }

  static save(conversations: Conversation[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    } catch (error) {
      console.error("대화 저장 실패:", error);
    }
  }

  static subscribe(conversationId: string, listener: ConversationUpdateListener): void {
    if (!ConversationStorage.listeners.has(conversationId)) {
      ConversationStorage.listeners.set(conversationId, new Set());
    }
    ConversationStorage.listeners.get(conversationId)!.add(listener);
  }

  static unsubscribe(conversationId: string, listener: ConversationUpdateListener): void {
    const conversationListeners = ConversationStorage.listeners.get(conversationId);
    if (conversationListeners) {
      conversationListeners.delete(listener);
      if (conversationListeners.size === 0) {
        ConversationStorage.listeners.delete(conversationId);
      }
    }
  }

  private static notifyListeners(conversationId: string): void {
    const conversationListeners = ConversationStorage.listeners.get(conversationId);
    if (conversationListeners) {
      conversationListeners.forEach((listener) => listener(conversationId));
    }
  }

  static create(name: string, firstMessage?: Message): Conversation {
    const now = new Date();
    const conversation: Conversation = {
      id: crypto.randomUUID(),
      name,
      messages: firstMessage ? [firstMessage] : [],
      createdAt: now,
      updatedAt: now,
    };

    const conversations = ConversationStorage.getAll();
    conversations.push(conversation);
    ConversationStorage.save(conversations);

    return conversation;
  }

  static update(id: string, updates: Partial<Conversation>): boolean {
    const conversations = ConversationStorage.getAll();
    const index = conversations.findIndex((conv) => conv.id === id);

    if (index === -1) return false;

    conversations[index] = {
      ...conversations[index],
      ...updates,
      updatedAt: new Date(),
    };

    ConversationStorage.save(conversations);
    return true;
  }

  static addMessage(conversationId: string, message: Message): boolean {
    const conversations = ConversationStorage.getAll();
    const index = conversations.findIndex((conv) => conv.id === conversationId);

    if (index === -1) return false;

    conversations[index].messages.push(message);
    conversations[index].updatedAt = new Date();

    ConversationStorage.save(conversations);
    ConversationStorage.notifyListeners(conversationId);
    return true;
  }

  static delete(id: string): boolean {
    const conversations = ConversationStorage.getAll();
    const filtered = conversations.filter((conv) => conv.id !== id);

    if (filtered.length === conversations.length) return false;

    ConversationStorage.save(filtered);
    return true;
  }

  static generateUniqueName(baseName: string): string {
    const conversations = ConversationStorage.getAll();
    const existingNames = conversations.map((conv) => conv.name);

    let name = baseName;
    let counter = 1;

    while (existingNames.includes(name)) {
      name = `${baseName} ${counter}`;
      counter++;
    }

    return name;
  }
}
