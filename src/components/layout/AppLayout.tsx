import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { SideMenuDrawer } from './SideMenuDrawer';
import { PwaInstallPrompt } from './PwaInstallPrompt';
import { AIAssistantDrawer } from '../assistant/AIAssistantDrawer';
import { OnboardingModal } from '../onboarding/OnboardingModal';
import { DiscoverTheoriesModal } from '../discovery/DiscoverTheoriesModal';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#0B0C10] text-white selection:bg-[#D4FF00] selection:text-black transition-colors">
      {/* Desktop Left Sidebar */}
      <Sidebar />

      {/* Slide-out Left Navigation Drawer (Mobile & Toggle) */}
      <SideMenuDrawer />

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        {/* Global Navigation Header */}
        <Header />

        {/* Page View with Max Width Container */}
        <main className="flex-1 max-w-5xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Breakthrough Ideas & Theories Discovery Modal */}
      <DiscoverTheoriesModal />

      {/* Progressive Web App Install Banner */}
      <PwaInstallPrompt />

      {/* AI Learning Assistant Drawer */}
      <AIAssistantDrawer />

      {/* 4-Step Onboarding Modal for New Learners */}
      <OnboardingModal />
    </div>
  );
};
