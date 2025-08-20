
import React, { useState, useMemo } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { Plus, Search, User } from 'lucide-react';
import { mockCooperados } from '../data/mockData';
import { Cooperado, Tier, Interaction } from '../types';
import { CooperadoDetail } from '../components/cooperados/CooperadoDetail';
import { InteractionForm } from '../components/cooperados/InteractionForm';

const tierBadgeColors: { [key in Tier]: string } = {
    [Tier.Bronze]: 'bg-blue-100 text-blue-800',
    [Tier.Prata]: 'bg-neutral-200 text-neutral-800',
    [Tier.Ouro]: 'bg-yellow-100 text-yellow-800',
    [Tier.Diamante]: 'bg-purple-100 text-purple-800',
}

// Form Component
const CooperadoForm: React.FC<{ cooperado?: Cooperado | null; onClose: () => void }> = ({ cooperado, onClose }) => (
    <form className="space-y-6">
        <section>
            <h3 className="text-lg font-medium text-neutral-800 border-b pb-2 mb-4">Dados Básicos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-neutral-700">Nome Completo</label>
                    <input type="text" defaultValue={cooperado?.name} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-neutral-700">Email</label>
                    <input type="email" defaultValue={cooperado?.email} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-neutral-700">Nome da Empresa</label>
                    <input type="text" defaultValue={cooperado?.companyName} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-neutral-700">Nível</label>
                    <select defaultValue={cooperado?.tier} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 bg-white">
                        {Object.values(Tier).map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
            </div>
        </section>

        <section>
            <h3 className="text-lg font-medium text-neutral-800 border-b pb-2 mb-4">Perfil Estratégico</h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-neutral-700">Setor</label>
                    <input type="text" defaultValue={cooperado?.sector} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-neutral-700">Faturamento Anual</label>
                    <input type="number" defaultValue={cooperado?.annualRevenue} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-neutral-700">Nº de Funcionários</label>
                    <input type="number" defaultValue={cooperado?.employeeCount} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2" />
                </div>
            </div>
            <div>
                 <label className="block text-sm font-medium text-neutral-700 mt-4">Observações</label>
                 <textarea rows={3} defaultValue={cooperado?.notes} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"></textarea>
            </div>
        </section>

        <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
            <Button type="submit">{cooperado ? 'Salvar Alterações' : 'Adicionar Cooperado'}</Button>
        </div>
    </form>
);


// List Item Component
const CooperadoListItem: React.FC<{ cooperado: Cooperado; isSelected: boolean; onSelect: () => void; }> = ({ cooperado, isSelected, onSelect }) => (
    <button 
        onClick={onSelect} 
        className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${isSelected ? 'bg-primary/10 border-primary shadow-md' : 'bg-white border-transparent hover:bg-neutral-50 hover:shadow-sm'}`}
    >
        <div className="flex items-center gap-4">
            <img className="h-12 w-12 rounded-full object-cover" src={cooperado.avatar} alt={cooperado.name} />
            <div className="flex-1">
                <div className="flex items-center justify-between">
                    <p className="font-semibold text-neutral-800">{cooperado.name}</p>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${tierBadgeColors[cooperado.tier]}`}>
                        {cooperado.tier}
                    </span>
                </div>
                <p className="text-sm text-neutral-500">{cooperado.companyName}</p>
            </div>
        </div>
    </button>
);


// Main Page Component
const CooperadosPage: React.FC = () => {
  const [cooperados, setCooperados] = useState<Cooperado[]>(mockCooperados);
  const [isCooperadoModalOpen, setIsCooperadoModalOpen] = useState(false);
  const [isInteractionModalOpen, setIsInteractionModalOpen] = useState(false);
  const [editingCooperado, setEditingCooperado] = useState<Cooperado | null>(null);
  const [editingInteraction, setEditingInteraction] = useState<Interaction | null>(null);
  const [selectedCooperadoId, setSelectedCooperadoId] = useState<number | null>(cooperados[0]?.id ?? null);
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState('Todos');

  const handleOpenCooperadoModal = (cooperado: Cooperado | null = null) => {
    setEditingCooperado(cooperado);
    setIsCooperadoModalOpen(true);
  };
  
  const handleCloseCooperadoModal = () => {
    setIsCooperadoModalOpen(false);
    setEditingCooperado(null);
  };

  const handleOpenInteractionModal = (interaction: Interaction | null = null) => {
    setEditingInteraction(interaction);
    setIsInteractionModalOpen(true);
  };

  const handleCloseInteractionModal = () => {
    setIsInteractionModalOpen(false);
    setEditingInteraction(null);
  };

  const handleSaveInteraction = (data: Omit<Interaction, 'id' | 'author'>) => {
    setCooperados(prev => prev.map(coop => {
      if (coop.id !== selectedCooperadoId) return coop;

      let newTimeline: Interaction[];
      if (editingInteraction) {
        // Edit existing
        newTimeline = coop.timeline.map(i => i.id === editingInteraction.id ? { ...i, ...data } : i);
      } else {
        // Add new
        const newInteraction: Interaction = {
          ...data,
          id: `int-${coop.id}-${Date.now()}`,
          author: 'Mariana Costa' // Mocked author
        };
        newTimeline = [...coop.timeline, newInteraction];
      }
      return { ...coop, timeline: newTimeline };
    }));
    handleCloseInteractionModal();
  };

  const handleDeleteInteraction = (interactionId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta interação?')) {
        setCooperados(prev => prev.map(coop => {
            if (coop.id !== selectedCooperadoId) return coop;
            const newTimeline = coop.timeline.filter(i => i.id !== interactionId);
            return { ...coop, timeline: newTimeline };
        }));
    }
  };


  const filteredCooperados = useMemo(() => {
    return cooperados.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.companyName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTier = tierFilter === 'Todos' || c.tier === tierFilter;
        return matchesSearch && matchesTier;
    });
  }, [searchQuery, tierFilter, cooperados]);

  const selectedCooperado = useMemo(() => {
    if (selectedCooperadoId === null) return null;
    const cooperado = cooperados.find(c => c.id === selectedCooperadoId);
    return cooperado || (filteredCooperados.length > 0 ? filteredCooperados[0] : null);
  }, [selectedCooperadoId, filteredCooperados, cooperados]);
  
  React.useEffect(() => {
    if (selectedCooperado && selectedCooperado.id !== selectedCooperadoId) {
        setSelectedCooperadoId(selectedCooperado.id);
    }
  }, [selectedCooperado, selectedCooperadoId]);


  return (
    <div className="space-y-6 h-full">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold text-neutral-800">Gestão de Cooperados</h1>
            <p className="text-neutral-500 mt-1">Visualize, filtre e gerencie os perfis dos cooperados.</p>
        </div>
        <Button onClick={() => handleOpenCooperadoModal()}>
          <Plus size={20} className="mr-2" />
          Adicionar Cooperado
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
        {/* Left Column: List & Filters */}
        <Card className="lg:col-span-1 p-4 flex flex-col">
            <div className="relative mb-4">
                 <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                 <input 
                    type="text"
                    placeholder="Buscar por nome ou empresa..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-neutral-100 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                 />
            </div>
            <div className="mb-4">
                <label className="text-sm font-medium text-neutral-600">Filtrar por Nível:</label>
                <select 
                    value={tierFilter}
                    onChange={(e) => setTierFilter(e.target.value)}
                    className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 bg-white"
                >
                    <option>Todos</option>
                    {Object.values(Tier).map(t => <option key={t}>{t}</option>)}
                </select>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 pr-2 -mr-2">
                {filteredCooperados.length > 0 ? filteredCooperados.map(cooperado => (
                    <CooperadoListItem 
                        key={cooperado.id} 
                        cooperado={cooperado} 
                        isSelected={selectedCooperadoId === cooperado.id}
                        onSelect={() => setSelectedCooperadoId(cooperado.id)}
                    />
                )) : (
                    <div className="text-center text-neutral-500 pt-10">
                        <p>Nenhum cooperado encontrado.</p>
                    </div>
                )}
            </div>
        </Card>

        {/* Right Column: Detail View */}
        <div className="lg:col-span-2 h-full">
            {selectedCooperado ? (
                <CooperadoDetail 
                  cooperado={selectedCooperado} 
                  onEdit={handleOpenCooperadoModal} 
                  onAddInteraction={() => handleOpenInteractionModal()}
                  onEditInteraction={handleOpenInteractionModal}
                  onDeleteInteraction={handleDeleteInteraction}
                />
            ) : (
                <Card className="h-full flex items-center justify-center">
                    <div className="text-center text-neutral-500">
                        <User size={48} className="mx-auto" />
                        <p className="mt-4">Selecione um cooperado para ver os detalhes.</p>
                    </div>
                </Card>
            )}
        </div>
      </div>


      <Modal isOpen={isCooperadoModalOpen} onClose={handleCloseCooperadoModal} title={editingCooperado ? 'Editar Cooperado' : 'Adicionar Novo Cooperado'}>
        <CooperadoForm cooperado={editingCooperado} onClose={handleCloseCooperadoModal} />
      </Modal>

      <Modal isOpen={isInteractionModalOpen} onClose={handleCloseInteractionModal} title={editingInteraction ? 'Editar Interação' : 'Registrar Nova Interação'}>
        <InteractionForm 
            interaction={editingInteraction}
            onClose={handleCloseInteractionModal}
            onSave={handleSaveInteraction}
        />
      </Modal>
    </div>
  );
};

export default CooperadosPage;