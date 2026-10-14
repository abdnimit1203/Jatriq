import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Sparkles,
  Send,
  X,
  RotateCcw,
  Compass,
  Key,
  Check,
  Cpu,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useAIAssistant } from '../context/AIAssistantContext';
import { useLanguage } from '../context/LanguageContext';

export const AIAssistantWidget: React.FC = () => {
  const {
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
    aiConfig,
    saveAiConfig,
    clearAiConfig,
  } = useAIAssistant();

  const { language, getText } = useLanguage();
  const [input, setInput] = useState('');
  const [showKeySettings, setShowKeySettings] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(customApiKey || '');
  const [providerSelect, setProviderSelect] = useState<'auto' | 'gemini' | 'groq' | 'openai'>('auto');
  const [saveStatus, setSaveStatus] = useState<{ loading: boolean; msg?: string; error?: boolean } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setApiKeyInput(customApiKey || '');
  }, [customApiKey]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      if (window.innerWidth >= 768 && !showKeySettings) {
        setTimeout(() => inputRef.current?.focus(), 150);
      }
    }
  }, [messages, isOpen, showKeySettings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const text = input;
    setInput('');
    sendMessage(text);
  };

  const handleChipClick = (promptText: string) => {
    if (isLoading) return;
    sendMessage(promptText);
  };

  const handleSaveKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus({ loading: true });
    try {
      const res = await saveAiConfig(apiKeyInput.trim(), providerSelect);
      if (res.success) {
        setSaveStatus({ loading: false, msg: 'API key saved successfully!', error: false });
        setTimeout(() => {
          setSaveStatus(null);
          setShowKeySettings(false);
        }, 1500);
      } else {
        setSaveStatus({ loading: false, msg: res.message || 'Failed to save key', error: true });
      }
    } catch (err: any) {
      setSaveStatus({ loading: false, msg: err.message || 'Error saving key', error: true });
    }
  };

  const handleClearKey = async () => {
    setApiKeyInput('');
    setSaveStatus({ loading: true });
    await clearAiConfig();
    setSaveStatus({ loading: false, msg: 'Reverted to default free tier', error: false });
    setTimeout(() => {
      setSaveStatus(null);
      setShowKeySettings(false);
    }, 1200);
  };

  const suggestedChips = [
    {
      bn: 'সাজেক আর্মি কনভয়ের সময়সূচি কত?',
      en: 'What is the Sajek convoy schedule?',
    },
    {
      bn: 'পাহাড় ভ্রমণের জন্য কী কী নেওয়া দরকার?',
      en: 'What packing essentials for hill trips?',
    },
    {
      bn: 'প্যাকেজে কী কী খাবার ও সুবিধা থাকে?',
      en: 'What meals & amenities are included?',
    },
    {
      bn: 'পরিবার নিয়ে যাওয়ার সেরা প্যাকেজ কোনটি?',
      en: 'Which is best package for family trip?',
    },
  ];

  return (
    <>
      {/* Floating Action Button (Launcher) */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => openAssistant()}
          className="fixed bottom-15 right-4 sm:bottom-19 sm:right-6 z-40 group flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 bg-emerald-900/95 hover:bg-emerald-950 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 border border-emerald-600/30 cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-500"
          aria-label="Open AI Travel Assistant"
        >
          <div className="relative">
            <Bot className="w-4 h-4 text-emerald-200" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full" />
          </div>
          
<span className="font-semibold text-[11px] sm:text-xs tracking-normal sm:tracking-wide">
  <span className="sm:hidden">
    {language === 'bn' ? 'এআই' : 'AI'}
  </span>
  <span className="hidden sm:inline">
    {language === 'bn' ? 'এআই গাইড' : 'AI Assistant'}
  </span>
</span>

          <Sparkles className="w-3.5 h-3.5 text-amber-300 group-hover:rotate-12 transition-transform" />
        </button>
      )}

      {/* Floating Chat Modal / Drawer */}
      {isOpen && (
        <div className="fixed inset-x-3 bottom-3 sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[400px] max-h-[85vh] sm:max-h-[580px] h-[min(520px,calc(100dvh-5rem))] sm:h-[560px] z-50 flex flex-col bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-stone-200 overflow-hidden animate-in slide-in-from-bottom-5 duration-250">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white flex items-center justify-between shrink-0 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-emerald-200 shadow-inner">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm sm:text-base leading-tight">
                    {language === 'bn' ? 'যাত্রিক এআই কনসিয়ার্জ' : 'Jatriq Travel Concierge'}
                  </h3>
                  <span className="px-1.5 py-0.5 text-[10px] font-bold bg-emerald-700/80 text-emerald-100 rounded uppercase tracking-wider border border-emerald-500/30">
                    {aiConfig.hasCustomKey ? 'CUSTOM API' : 'GUIDE'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-200 font-medium mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{language === 'bn' ? 'অনলাইন সহায়তা • ২৪/৭' : 'Online • 24/7 Travel Guide'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setShowKeySettings(!showKeySettings)}
                title={showKeySettings ? 'Close API Settings' : 'Custom AI Key Settings'}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  showKeySettings
                    ? 'bg-white text-emerald-950 font-bold'
                    : 'text-emerald-200 hover:text-white hover:bg-white/10'
                }`}
                aria-label="Toggle AI Settings"
              >
                <Key className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={clearMessages}
                title={language === 'bn' ? 'নতুন চ্যাট শুরু করুন' : 'Restart chat'}
                className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Restart chat"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={closeAssistant}
                className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Minimize chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick AI Key Dropdown Settings */}
          {showKeySettings && (
            <div className="bg-stone-900 text-stone-100 p-4 border-b border-stone-800 text-xs animate-in slide-in-from-top-2 duration-150 shrink-0">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold flex items-center gap-1.5 text-emerald-400">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>AI Model & Key Settings</span>
                </span>
                <span className="text-[10px] text-stone-400 font-mono">
                  {aiConfig.hasCustomKey ? `Active: ${aiConfig.provider.toUpperCase()}` : 'Default Free Tier'}
                </span>
              </div>
              <p className="text-[11px] text-stone-300 mb-3 leading-relaxed">
                Supports Google Gemini (`AIza...`), Groq (`gsk_...`), or OpenAI (`sk-...`) keys.
              </p>

              <form onSubmit={handleSaveKey} className="space-y-2.5">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-stone-400 mb-1">Provider</label>
                    <select
                      value={providerSelect}
                      onChange={(e) => setProviderSelect(e.target.value as any)}
                      className="w-full py-1.5 px-2 bg-stone-800 border border-stone-700 rounded-lg text-white text-xs focus:outline-hidden focus:border-emerald-500"
                    >
                      <option value="auto">Auto-Detect</option>
                      <option value="gemini">Google Gemini</option>
                      <option value="groq">Groq (Ultra-Fast)</option>
                      <option value="openai">OpenAI (ChatGPT)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-stone-400 mb-1">Status</label>
                    <div className="py-1.5 px-2 bg-stone-800/80 border border-stone-700 rounded-lg text-[11px] text-emerald-300 truncate">
                      {aiConfig.maskedKey || 'Free / Built-in'}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-stone-400 mb-1">Paste API Key</label>
                  <input
                    type="password"
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    placeholder="AIzaSy... or gsk_... or sk-..."
                    className="w-full py-1.5 px-2.5 bg-stone-800 border border-stone-700 rounded-lg text-white font-mono text-xs focus:outline-hidden focus:border-emerald-500 placeholder:text-stone-500"
                  />
                </div>

                {saveStatus && (
                  <div
                    className={`text-[11px] p-2 rounded flex items-center gap-1.5 ${
                      saveStatus.error ? 'bg-red-950/80 text-red-300 border border-red-800' : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                    }`}
                  >
                    {saveStatus.error ? <AlertCircle className="w-3.5 h-3.5 shrink-0" /> : <Check className="w-3.5 h-3.5 shrink-0" />}
                    <span>{saveStatus.msg}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={handleClearKey}
                    className="text-[11px] text-stone-400 hover:text-white underline cursor-pointer"
                  >
                    Clear / Reset
                  </button>
                  <button
                    type="submit"
                    disabled={saveStatus?.loading}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs cursor-pointer shadow-xs transition-colors disabled:opacity-50"
                  >
                    {saveStatus?.loading ? 'Saving...' : 'Save API Key'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Active Tour Context Banner */}
          {activeTourContext && (
            <div className="px-4 py-2.5 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between gap-2 shrink-0 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-900 truncate font-semibold">
                <Compass className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span className="text-emerald-700 font-normal">
                  {language === 'bn' ? 'নির্বাচিত ট্যুর:' : 'Focused on:'}
                </span>
                <span className="truncate">{getText(activeTourContext.title)}</span>
              </div>
              <button
                type="button"
                onClick={clearTourContext}
                className="text-stone-400 hover:text-stone-700 p-0.5"
                title="Remove tour context"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 bg-stone-50/70 text-xs sm:text-sm">
            {messages.map((msg) => {
              const isAssistant = msg.role === 'assistant';
              return (
                <div
                  key={msg.id}
                  className={`flex ${isAssistant ? 'justify-start' : 'justify-end'} animate-in fade-in duration-200`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 shadow-xs leading-relaxed whitespace-pre-wrap ${
                      isAssistant
                        ? 'bg-white text-stone-800 border border-stone-200/90 rounded-tl-xs'
                        : 'bg-emerald-800 text-white rounded-tr-xs shadow-md'
                    }`}
                  >
                    {isAssistant && (
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 mb-1">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span>Jatriq Concierge</span>
                      </div>
                    )}
                    <p>{msg.content}</p>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-stone-200/90 rounded-2xl rounded-tl-xs p-3.5 shadow-xs flex items-center gap-2 text-stone-500 text-xs font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
                  <span>{language === 'bn' ? 'তথ্য সংগ্রহ করা হচ্ছে...' : 'AI is thinking...'}</span>
                  <div className="flex items-center gap-1 ml-1">
                    <span className="w-1.5 h-1.5 bg-emerald-700 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-emerald-700 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-emerald-700 rounded-full animate-bounce" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Quick Prompt Chips */}
          <div className="px-3.5 py-2 bg-white border-t border-stone-100 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
            {suggestedChips.map((chip, idx) => {
              const chipLabel = language === 'bn' ? chip.bn : chip.en;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleChipClick(chipLabel)}
                  disabled={isLoading}
                  className="px-2.5 py-1 text-[11px] font-medium bg-stone-100 hover:bg-emerald-50 hover:text-emerald-900 hover:border-emerald-200 text-stone-700 rounded-full border border-stone-200/80 transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50"
                >
                  {chipLabel}
                </button>
              );
            })}
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSubmit}
            className="p-3 bg-white border-t border-stone-200 flex items-center gap-2 shrink-0"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                language === 'bn'
                  ? 'ভ্রমণ বা প্যাকেজ সম্পর্কে কিছু জানতে চান?...'
                  : 'Ask about tours, convoy, weather, or tips...'
              }
              className="flex-1 py-2.5 px-3.5 text-xs sm:text-sm bg-stone-100 rounded-xl border border-stone-200 focus:outline-hidden focus:border-emerald-700 focus:bg-white transition-all placeholder:text-stone-400"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2.5 bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 disabled:bg-stone-200 text-white disabled:text-stone-400 rounded-xl transition-all cursor-pointer shadow-sm hover:shadow-md disabled:cursor-not-allowed shrink-0"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
