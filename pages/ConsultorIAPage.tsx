
import React from 'react';
import ChatPanel from '../components/ai/ChatPanel';
import AnalysisPanel from '../components/ai/AnalysisPanel';
import { BrainCircuit } from 'lucide-react';

const ConsultorIAPage: React.FC = () => {
  return (
    <div className="h-full flex flex-col">
      {/* Page Header */}
      <div className="flex items-center gap-3 mb-6 flex-shrink-0">
        <BrainCircuit size={32} className="text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">Consultora de IA Sofia</h1>
          <p className="text-neutral-500">Seu centro de interação inteligente para insights e análises.</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
        {/* Left Panel: Chat */}
        <div className="w-full lg:w-[70%] flex flex-col h-full">
          <ChatPanel />
        </div>

        {/* Right Panel: Analysis */}
        <div className="w-full lg:w-[30%] flex flex-col h-full">
          <AnalysisPanel />
        </div>
      </div>
    </div>
  );
};

export default ConsultorIAPage;