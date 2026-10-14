import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnnouncementBar } from '../components/AnnouncementBar';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { WhatsAppFloatingButton } from '../components/WhatsAppFloatingButton';
import { AIAssistantWidget } from '../components/AIAssistantWidget';

export const RootLayout: React.FC = () => {
  const { pathname } = useLocation();

  // Scroll to top upon navigating to a new page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans selection:bg-emerald-900 selection:text-emerald-100">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFloatingButton />
      <AIAssistantWidget />
    </div>
  );
};
