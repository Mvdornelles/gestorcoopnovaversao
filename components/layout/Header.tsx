
import React from 'react';
import { Menu, Search, Bell, ChevronDown } from 'lucide-react';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  return (
    <header className="bg-neutral-100 p-4 flex items-center justify-between sticky top-0 z-10 border-b border-neutral-200">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="lg:hidden text-neutral-600 mr-4">
          <Menu size={24} />
        </button>
        <div className="relative hidden md:block">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Buscar cooperados, oportunidades..."
            className="bg-white rounded-lg pl-10 pr-4 py-2 w-72 focus:outline-none focus:ring-2 focus:ring-primary border border-neutral-200"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="text-neutral-600 hover:text-primary transition-colors relative">
          <Bell size={24} />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        </button>
        <div className="flex items-center gap-3">
          <img
            src="https://picsum.photos/id/42/200"
            alt="User Avatar"
            className="h-10 w-10 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold text-neutral-800">Mariana Costa</p>
            <p className="text-sm text-neutral-500">Gerente</p>
          </div>
          <button className="text-neutral-500 hover:text-neutral-800">
            <ChevronDown size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;