
import React, { useState, useCallback } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import DashboardPage from './pages/DashboardPage';
import CooperadosPage from './pages/CooperadosPage';
import OportunidadesPage from './pages/OportunidadesPage';
import ProdutosPage from './pages/ProdutosPage';
import TarefasPage from './pages/TarefasPage';
import ConsultorIAPage from './pages/ConsultorIAPage';
import RelatoriosPage from './pages/RelatoriosPage';

const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  return (
    <AuthProvider>
      <HashRouter>
        <div className="flex h-screen bg-neutral-100 font-sans">
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header toggleSidebar={toggleSidebar} />
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-neutral-100 p-4 md:p-8">
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/cooperados" element={<CooperadosPage />} />
                <Route path="/oportunidades" element={<OportunidadesPage />} />
                <Route path="/produtos" element={<ProdutosPage />} />
                <Route path="/tarefas" element={<TarefasPage />} />
                <Route path="/consultor" element={<ConsultorIAPage />} />
                <Route path="/relatorios" element={<RelatoriosPage />} />
              </Routes>
            </main>
          </div>
        </div>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;