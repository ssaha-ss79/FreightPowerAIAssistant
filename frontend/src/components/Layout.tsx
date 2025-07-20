import { Truck } from 'lucide-react';
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-brand-dark text-gray-200">
      <header className="bg-brand-light p-4 shadow-md">
        <div className="container mx-auto flex items-center gap-4">
          <Truck className="w-8 h-8 text-brand-accent" />
          <h1 className="text-2xl font-bold">Axel - Smart Logistics Assistant</h1>
        </div>
      </header>
      <main className="container mx-auto p-4 lg:p-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;

