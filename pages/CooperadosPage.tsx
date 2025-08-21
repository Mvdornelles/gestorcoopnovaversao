
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { Plus, Search, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import {
    getCooperados, getCooperadoById, addCooperado, updateCooperado,
    addInteraction, updateInteraction, deleteInteraction,
    Cooperado, CooperadoDetail as CooperadoDetailType, Interaction, TierCooperado as Tier,
} from '../services/api';
import { CooperadoDetail } from '../components/cooperados/CooperadoDetail';
import { InteractionForm } from '../components/cooperados/InteractionForm';

const tierBadgeColors: { [key in Tier]: string } = {
    [Tier.Bronze]: 'bg-blue-100 text-blue-800',
    [Tier.Prata]: 'bg-neutral-200 text-neutral-800',
    [Tier.Ouro]: 'bg-yellow-100 text-yellow-800',
    [Tier.Diamante]: 'bg-purple-100 text-purple-800',
}

// Form Component
const CooperadoForm: React.FC<{
    cooperado?: Cooperado | null;
    onClose: () => void;
    onSave: (data: Partial<Omit<Cooperado, 'id' | 'created_at' | 'user_id'>>, id?: number) => void;
}> = ({ cooperado, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: cooperado?.name || '',
        email: cooperado?.email || '',
        company_name: cooperado?.company_name || '',
        tier: cooperado?.tier || 'Bronze',
        avatar_url: cooperado?.avatar_url || `https://picsum.photos/seed/${Date.now()}/200`,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData, cooperado?.id);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-neutral-700">Nome Completo</label>
                    <input type="text" value={formData.name} onChange={e => setFormData(f => ({...f, name: e.target.value}))} required className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm p-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-neutral-700">Email</label>
                    <input type="email" value={formData.email ?? ''} onChange={e => setFormData(f => ({...f, email: e.target.value}))} required className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm p-2" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-neutral-700">Nome da Empresa</label>
                    <input type="text" value={formData.company_name ?? ''} onChange={e => setFormData(f => ({...f, company_name: e.target.value}))} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm p-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-neutral-700">Nível</label>
                    <select value={formData.tier ?? 'Bronze'} onChange={e => setFormData(f => ({...f, tier: e.target.value as Tier}))} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm p-2 bg-white">
                        {Object.values(Tier).map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
            </div>
        <div className="flex justify-end gap-2 pt-4 border-t mt-4">
            <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
            <Button type="submit">{cooperado ? 'Salvar Alterações' : 'Adicionar Cooperado'}</Button>
        </div>
    </form>
    );
}


// List Item Component
const CooperadoListItem: React.FC<{ cooperado: Cooperado; isSelected: boolean; onSelect: () => void; }> = ({ cooperado, isSelected, onSelect }) => (
    <button
        onClick={onSelect}
        className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${isSelected ? 'bg-primary/10 border-primary shadow-md' : 'bg-white border-transparent hover:bg-neutral-50 hover:shadow-sm'}`}
    >
        <div className="flex items-center gap-4">
            <img className="h-12 w-12 rounded-full object-cover" src={cooperado.avatar_url ?? ''} alt={cooperado.name} />
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
  const { user } = useAuth();
  const [cooperados, setCooperados] = useState<Cooperado[]>([]);
  const [selectedCooperado, setSelectedCooperado] = useState<CooperadoDetailType | null>(null);
  const [selectedCooperadoId, setSelectedCooperadoId] = useState<number | null>(null);

  const [listLoading, setListLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isCooperadoModalOpen, setIsCooperadoModalOpen] = useState(false);
  const [isInteractionModalOpen, setIsInteractionModalOpen] = useState(false);
  const [editingCooperado, setEditingCooperado] = useState<Cooperado | null>(null);
  const [editingInteraction, setEditingInteraction] = useState<Interaction | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState('Todos');

  const fetchCooperados = useCallback(async () => {
    if (!user) return;
    try {
        setListLoading(true);
        const data = await getCooperados(user.id);
        setCooperados(data);
        if (data.length > 0 && selectedCooperadoId === null) {
            setSelectedCooperadoId(data[0].id);
        }
    } catch (err) {
        setError('Falha ao carregar cooperados.');
    } finally {
        setListLoading(false);
    }
    }, [user, selectedCooperadoId]);

    useEffect(() => {
        fetchCooperados();
    }, [user]);

    useEffect(() => {
        const fetchDetail = async () => {
            if (!selectedCooperadoId) {
                setSelectedCooperado(null);
                return;
            };
            try {
                setDetailLoading(true);
                const data = await getCooperadoById(selectedCooperadoId);
                setSelectedCooperado(data);
            } catch (err) {
                setError('Falha ao carregar detalhes do cooperado.');
            } finally {
                setDetailLoading(false);
            }
        };
        fetchDetail();
    }, [selectedCooperadoId]);

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

  const handleSaveCooperado = async (formData: Partial<Omit<Cooperado, 'id' | 'created_at' | 'user_id'>>, id?: number) => {
      try {
          if (id) {
              await updateCooperado(id, formData);
          } else {
              await addCooperado(formData as any); // Using as any because not all fields are present
          }
          await fetchCooperados();
          if (id) {
              setSelectedCooperado(d => d ? {...d, ...formData} : null);
          }
          handleCloseCooperadoModal();
      } catch (err) {
          alert('Falha ao salvar cooperado.');
      }
  };

  const handleSaveInteraction = async (data: Omit<Interaction, 'id' | 'author_id' | 'created_at'>) => {
    if (!selectedCooperadoId) return;
    try {
        if (editingInteraction) {
            await updateInteraction(editingInteraction.id, data);
        } else {
            await addInteraction({ ...data, cooperado_id: selectedCooperadoId });
        }
        const updatedDetail = await getCooperadoById(selectedCooperadoId);
        setSelectedCooperado(updatedDetail);
        handleCloseInteractionModal();
    } catch (err) {
        alert('Falha ao salvar interação.');
    }
  };

  const handleDeleteInteraction = async (interactionId: number) => {
    if (!selectedCooperadoId) return;
    if (window.confirm('Tem certeza que deseja excluir esta interação?')) {
        try {
            await deleteInteraction(interactionId);
            const updatedDetail = await getCooperadoById(selectedCooperadoId);
            setSelectedCooperado(updatedDetail);
        } catch(err) {
            alert('Falha ao excluir interação.');
        }
    }
  };


  const filteredCooperados = useMemo(() => {
    return cooperados.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.companyName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTier = tierFilter === 'Todos' || c.tier === tierFilter;
        return matchesSearch && matchesTier;
    });
  }, [searchQuery, tierFilter, cooperados]);

  const filteredCooperados = useMemo(() => {
    return cooperados.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || (c.company_name && c.company_name.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesTier = tierFilter === 'Todos' || c.tier === tierFilter;
        return matchesSearch && matchesTier;
    });
  }, [searchQuery, tierFilter, cooperados]);

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
            <Card className="lg:col-span-1 p-4 flex flex-col">
                <div className="relative mb-4">
                     <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                     <input type="text" placeholder="Buscar por nome ou empresa..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-neutral-100 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div className="mb-4">
                    <label className="text-sm font-medium text-neutral-600">Filtrar por Nível:</label>
                    <select value={tierFilter} onChange={(e) => setTierFilter(e.target.value)} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm p-2 bg-white">
                        <option>Todos</option>
                        {Object.values(Tier).map(t => <option key={t}>{t}</option>)}
                    </select>
                </div>
                <div className="flex-1 overflow-y-auto space-y-2 pr-2 -mr-2">
                    {listLoading ? <p>Carregando...</p> : error ? <p className="text-red-500">{error}</p> :
                    filteredCooperados.length > 0 ? filteredCooperados.map(cooperado => (
                        <CooperadoListItem key={cooperado.id} cooperado={cooperado} isSelected={selectedCooperadoId === cooperado.id} onSelect={() => setSelectedCooperadoId(cooperado.id)} />
                    )) : <p className="text-center text-neutral-500 pt-10">Nenhum cooperado encontrado.</p>}
                </div>
            </Card>

            <div className="lg:col-span-2 h-full">
                {detailLoading ? <Card className="h-full flex items-center justify-center"><p>Carregando detalhes...</p></Card> :
                selectedCooperado ? (
                    <CooperadoDetail cooperado={selectedCooperado} onEdit={() => handleOpenCooperadoModal(selectedCooperado)} onAddInteraction={() => handleOpenInteractionModal()} onEditInteraction={handleOpenInteractionModal} onDeleteInteraction={handleDeleteInteraction} />
                ) : (
                    <Card className="h-full flex items-center justify-center">
                        <div className="text-center text-neutral-500">
                            <User size={48} className="mx-auto" />
                            <p className="mt-4">{listLoading ? 'Carregando...' : 'Selecione um cooperado para ver os detalhes.'}</p>
                        </div>
                    </Card>
                )}
            </div>
        </div>

        <Modal isOpen={isCooperadoModalOpen} onClose={handleCloseCooperadoModal} title={editingCooperado ? 'Editar Cooperado' : 'Adicionar Novo Cooperado'}>
            <CooperadoForm cooperado={editingCooperado} onClose={handleCloseCooperadoModal} onSave={handleSaveCooperado} />
        </Modal>

        <Modal isOpen={isInteractionModalOpen} onClose={handleCloseInteractionModal} title={editingInteraction ? 'Editar Interação' : 'Registrar Nova Interação'}>
            <InteractionForm interaction={editingInteraction} onClose={handleCloseInteractionModal} onSave={handleSaveInteraction as any} />
        </Modal>
    </div>
  );
};

export default CooperadosPage;