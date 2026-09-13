import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { MobileDrawer } from './MobileDrawer';
import { ToastProvider, ToastContainer } from '../ui/Toast';
import type { ReactNode } from 'react';

interface MainLayoutProps {
  children?: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col">
        <Header onMenuClick={() => setMobileDrawerOpen(true)} />
        <MobileDrawer isOpen={mobileDrawerOpen} onClose={() => setMobileDrawerOpen(false)} />
        <main id="main-content" className="flex-1 flex flex-col pt-16 lg:pt-20">
          <Outlet />
          {children}
        </main>
        <Footer className="flex-shrink-0" />
        <ToastContainer position="top-right" />
      </div>
    </ToastProvider>
  );
}