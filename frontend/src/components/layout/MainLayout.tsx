import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { MobileDrawer } from './MobileDrawer';
import { ToastProvider, ToastContainer } from '../ui/Toast';

export function MainLayout() {
  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <MobileDrawer />
        <main className="flex-1 pt-16 lg:pt-20">
          <Outlet />
        </main>
        <Footer />
        <ToastContainer position="top-right" />
      </div>
    </ToastProvider>
  );
}