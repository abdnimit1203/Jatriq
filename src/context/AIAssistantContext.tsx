import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useLanguage } from './LanguageContext';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface AIConfigState {
  hasCustomKey: boolean;
  provider: 'gemini' | 'groq' | 'openai' | 'auto';
  model: string;
  maskedKey: string;
}

interface AIAssistantContextType {
  isOpen: boolean;
  openAssistant: (initialPrompt?: string, tourContext?: any) => void;
  closeAssistant: () => void;
  messages: ChatMessage[];
  sendMessage: (text: string) => Promise<void>;
  isLoading: boolean;
  activeTourContext: any | null;
  clearTourContext: () => void;
  clearMessages: () => void;
  customApiKey: string;
  setCustomApiKey: (key: string) => void;
  aiConfig: AIConfigState;
  saveAiConfig: (key: string, provider?: string, model?: string) => Promise<{ success: boolean; message?: string }>;
  clearAiConfig: () => Promise<void>;
  refreshAiConfig: () => Promise<void>;
}

const AIAssistantContext = createContext<AIAssistantContextType | undefined>(undefined);

const STORAGE_KEY_CUSTOM_API_KEY = 'jatriq_custom_gemini_api_key';

export const AIAssistantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTourContext, setActiveTourContext] = useState<any | null>(null);

  const [customApiKey, setCustomApiKeyState] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_CUSTOM_API_KEY) || '';
    } catch {
      return '';
    }
  });

  const [aiConfig, setAiConfig] = useState<AIConfigState>({
    hasCustomKey: false,
    provider: 'auto',
    model: 'gemini-2.5-flash',
    maskedKey: '',
  });

  // Fetch persisted config from server
  const refreshAiConfig = useCallback(async () => {
    try {
      const res = await fetch('/api/settings/ai-config');
      if (res.ok) {
        const data = await res.json();
        setAiConfig({
          hasCustomKey: data.hasCustomKey,
          provider: data.provider || 'gemini',
          model: data.model || 'gemini-2.5-flash',
          maskedKey: data.maskedKey || '',
        });
      }
    } catch {
      // Offline fallback
    }
  }, []);

  useEffect(() => {
    refreshAiConfig();
  }, [refreshAiConfig]);

  // Sync across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY_CUSTOM_API_KEY) {
        setCustomApiKeyState(e.newValue || '');
        refreshAiConfig();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [refreshAiConfig]);

  const setCustomApiKey = (key: string) => {
    const cleanKey = key.trim();
    setCustomApiKeyState(cleanKey);
    try {
      if (cleanKey) {
        localStorage.setItem(STORAGE_KEY_CUSTOM_API_KEY, cleanKey);
      } else {
        localStorage.removeItem(STORAGE_KEY_CUSTOM_API_KEY);
      }
    } catch {
      // ignore
    }
  };

  const saveAiConfig = async (key: string, provider = 'auto', model?: string) => {
    const cleanKey = key.trim();
    setCustomApiKey(cleanKey);

    try {
      const res = await fetch('/api/settings/ai-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: cleanKey, provider, model }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        await refreshAiConfig();
        return { success: true, message: data.message };
      }
      return { success: false, message: data.error || 'Failed to save configuration' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Network error' };
    }
  };

  const clearAiConfig = async () => {
    setCustomApiKey('');
    try {
      await fetch('/api/settings/ai-config', { method: 'DELETE' });
      await refreshAiConfig();
    } catch {
      // ignore
    }
  };

  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome-msg',
          role: 'assistant',
          content:
            language === 'bn'
              ? 'আসসালামু আলাইকুম! আমি যাত্রিক ট্রাভেল সহকারী (Jatriq AI Concierge)। বাংলাদেশ ভ্রমণ, সাজেক আর্মি কনভয় সময়সূচি, প্যাকিং গাইড, আবহাওয়া, সেরা প্যাকেজ ও বুকিং সম্পর্কিত যেকোনো প্রশ্ন আমাকে করতে পারেন।'
              : 'Hello! I am your Jatriq AI Travel Concierge. Feel free to ask me anything about tour itineraries, Sajek convoy schedules, packing advice, weather, or package details.',
          timestamp: Date.now(),
        },
      ]);
    }
  }, [language]);

  const openAssistant = (initialPrompt?: string, tourContext?: any) => {
    if (tourContext) {
      setActiveTourContext(tourContext);
    }
    setIsOpen(true);
    if (initialPrompt && initialPrompt.trim()) {
      sendMessage(initialPrompt.trim());
    }
  };

  const closeAssistant = () => {
    setIsOpen(false);
  };

  const clearTourContext = () => {
    setActiveTourContext(null);
  };

  const clearMessages = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content:
          language === 'bn'
            ? 'নতুন চ্যাট শুরু হয়েছে। আপনাকে কীভাবে সাহায্য করতে পারি?'
            : 'New conversation started. How can I assist you with your travels today?',
        timestamp: Date.now(),
      },
    ]);
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: Date.now(),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setIsLoading(true);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (customApiKey && customApiKey.trim()) {
        headers['x-custom-api-key'] = customApiKey.trim();
      }

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          messages: newHistory.map((m) => ({ role: m.role, content: m.content })),
          tourContext: activeTourContext,
          userLanguage: language,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to get AI response');
      }

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.text,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content:
          language === 'bn'
            ? `দুঃখিত, তথ্য সংগ্রহে সাময়িক সমস্যা হয়েছে (${err.message || 'নেটওয়ার্ক সংযোগ পরীক্ষা করুন'})। সরাসরি আমাদের হেল্পলাইন বা হোয়াটসঅ্যাপে যোগাযোগ করতে পারেন: +880 1812-345678`
            : `Sorry, there was a temporary issue (${err.message || 'Check network connection'}). Feel free to reach our team directly via WhatsApp: +880 1812-345678`,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AIAssistantContext.Provider
      value={{
        isOpen,
        openAssistant,
        closeAssistant,
        messages,
        sendMessage,
        isLoading,
        activeTourContext,
        clearTourContext,
        clearMessages,
        customApiKey,
        setCustomApiKey,
        aiConfig,
        saveAiConfig,
        clearAiConfig,
        refreshAiConfig,
      }}
    >
      {children}
    </AIAssistantContext.Provider>
  );
};

export const useAIAssistant = () => {
  const context = useContext(AIAssistantContext);
  if (!context) {
    throw new Error('useAIAssistant must be used within an AIAssistantProvider');
  }
  return context;
};
