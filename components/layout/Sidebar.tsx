
import React from 'react';
import { NavLink } from 'react-router-dom';
import { NAV_LINKS } from '../../constants';
import { X, Bot } from 'lucide-react';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* Sidebar */}
      <div
        className={`fixed lg:relative inset-y-0 left-0 w-64 bg-neutral-900 text-white p-4 z-30 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 flex flex-col`}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-primary to-secondary p-2 rounded-lg">
                <Bot size={24} />
            </div>
            <h1 className="text-2xl font-bold text-white">GestorCoop</h1>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-neutral-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1">
          <ul>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <NavLink
                  to={link.href}
                  end
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 my-1 rounded-lg transition-colors duration-200 ${
                      isActive ? 'bg-primary text-white' : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                    }`
                  }
                  onClick={() => setSidebarOpen(false)}
                >
                  {link.icon}
                  <span className="font-medium">{link.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-auto">
            <div className="bg-neutral-800 rounded-lg p-4 text-center">
                <p className="text-sm text-neutral-400">© 2024 GestorCoop</p>
                <p className="text-xs text-neutral-500 mt-1">Todos os direitos reservados.</p>
            </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;