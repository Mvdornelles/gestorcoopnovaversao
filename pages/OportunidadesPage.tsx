import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
    getOportunidades, addOportunidade, updateOportunidade, deleteOportunidade, getCooperados,
    OportunidadeWithCooperado, EstagioOportunidade, Cooperado
} from '../services/api';
import { MoreHorizontal, Plus, Search, DollarSign, Calendar, Edit, Trash2, Lamp } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';

const stageConfig: { [key in EstagioOportunidade]: { border: string; bg: string; text: string; } } = {
    'Prospecção': { border: 'border-neutral-400', bg: 'bg-neutral-100', text: 'text-neutral-800' },
    'Qualificação': { border: 'border-blue-500', bg: 'bg-blue-50', text: 'text-blue-800' },
    'Diagnóstico': { border: 'border-purple-500', bg: 'bg-purple-50', text: 'text-purple-800' },
    'Proposta': { border: 'border-yellow-500', bg: 'bg-yellow-50', text: 'text-yellow-800' },
    'Negociação': { border: 'border-orange-500', bg: 'bg-orange-50', text: 'text-orange-800' },
    'Ganho': { border: 'border-green-500', bg: 'bg-green-50', text: 'text-green-800' },
    'Perdido': { border: 'border-red-500', bg: 'bg-red-50', text: 'text-red-800' },
};

type OportunidadeFormData = Omit<OportunidadeWithCooperado, 'id' | 'created_at' | 'user_id' | 'cooperados'>;

const OportunidadeForm: React.FC<{
  oportunidade?: OportunidadeWithCooperado | null;
  cooperados: Cooperado[];
  onClose: () => void;
  onSave: (data: Partial<OportunidadeFormData>, id?: number) => void;
}> = ({ oportunidade, cooperados, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        title: oportunidade?.title || '',
        cooperado_id: oportunidade?.cooperado_id || 0,
        stage: oportunidade?.stage || 'Prospecção',
        value: oportunidade?.value || 0,
        expected_close_date: oportunidade?.expected_close_date || new Date().toISOString().split('T')[0],
        description: oportunidade?.description || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData, oportunidade?.id);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-neutral-700">Título</label>
                <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm p-2" />
            </div>
            <div>
                <label className="block text-sm font-medium text-neutral-700">Cooperado Associado</label>
                <select value={formData.cooperado_id} onChange={e => setFormData({ ...formData, cooperado_id: Number(e.target.value)})} required className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm p-2 bg-white">
                    <option value={0} disabled>Selecione um cooperado</option>
                    {cooperados.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-neutral-700">Valor Estimado</label>
                    <input type="number" value={formData.value ?? 0} onChange={e => setFormData({ ...formData, value: Number(e.target.value) })} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm p-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-neutral-700">Data Prevista de Fechamento</label>
                    <input type="date" value={formData.expected_close_date ?? ''} onChange={e => setFormData({ ...formData, expected_close_date: e.target.value })} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm p-2" />
                </div>
            </div>
             <div>
                <label className="block text-sm font-medium text-neutral-700">Estágio</label>
                <select value={formData.stage} onChange={e => setFormData({ ...formData, stage: e.target.value as EstagioOportunidade })} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm p-2 bg-white">
                    {Object.values(EstagioOportunidade).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-neutral-700">Descrição</label>
                <textarea rows={3} value={formData.description ?? ''} onChange={e => setFormData({ ...formData, description: e.target.value })} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm p-2"></textarea>
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t">
                <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
                <Button type="submit">{oportunidade ? 'Salvar Alterações' : 'Criar Oportunidade'}</Button>
            </div>
        </form>
    );
};


const KanbanCard: React.FC<{ oportunidade: OportunidadeWithCooperado; onEdit: (op: OportunidadeWithCooperado) => void; onDelete: (id: number) => void; }> = ({ oportunidade, onEdit, onDelete }) => {
    const cooperado = oportunidade.cooperados;
    return (
        <div className={`bg-white p-3 rounded-lg shadow-sm mb-3 border-l-4 ${stageConfig[oportunidade.stage].border} cursor-grab active:cursor-grabbing`}>
            <div className="flex justify-between items-start">
                <h4 className="font-bold text-neutral-800 pr-2">{oportunidade.title}</h4>
                <div className="flex -mr-2 -mt-1">
                     <Button variant="ghost" size="sm" onClick={() => onEdit(oportunidade)} aria-label="Editar"><Edit size={16}/></Button>
                     <Button variant="ghost" size="sm" onClick={() => onDelete(oportunidade.id)} aria-label="Excluir"><Trash2 size={16} className="text-red-500 hover:text-red-600"/></Button>
                </div>
            </div>
            {cooperado && (
                 <div className="flex items-center gap-2 mt-2">
                    <img src={cooperado.avatar_url ?? ''} alt={cooperado.name} className="h-6 w-6 rounded-full"/>
                    <p className="text-sm font-medium text-neutral-600">{cooperado.name}</p>
                </div>
            )}
            <div className="flex justify-between items-center mt-3 text-sm text-neutral-500">
                <span className="font-semibold text-secondary flex items-center gap-1"><DollarSign size={14}/> {(oportunidade.value ?? 0).toLocaleString('pt-BR')}</span>
                <span className="flex items-center gap-1"><Calendar size={14}/> {new Date(oportunidade.expected_close_date!).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</span>
            </div>
        </div>
    );
};

const KanbanColumn: React.FC<{ stage: EstagioOportunidade; oportunidades: OportunidadeWithCooperado[]; onEdit: (op: OportunidadeWithCooperado) => void; onDelete: (id: number) => void; }> = ({ stage, oportunidades, onEdit, onDelete }) => {
    const totalValue = oportunidades.reduce((sum, op) => sum + (op.value ?? 0), 0);
    const config = stageConfig[stage];

    return (
        <div className="bg-neutral-50 rounded-xl p-3 w-80 flex-shrink-0 h-full flex flex-col">
            <div className={`flex justify-between items-center mb-4 p-2 rounded-md ${config.bg}`}>
                <h3 className={`font-semibold text-base ${config.text}`}>{stage} ({oportunidades.length})</h3>
                <span className={`text-sm font-bold ${config.text}`}>
                    {totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 -mr-2">
                {oportunidades.map(op => <KanbanCard key={op.id} oportunidade={op} onEdit={onEdit} onDelete={onDelete} />)}
            </div>
        </div>
    );
};

const OportunidadesPage: React.FC = () => {
    const { user } = useAuth();
    const [oportunidades, setOportunidades] = useState<OportunidadeWithCooperado[]>([]);
    const [cooperados, setCooperados] = useState<Cooperado[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string|null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingOportunidade, setEditingOportunidade] = useState<OportunidadeWithCooperado | null>(null);

    const fetchData = useCallback(async () => {
        if (!user) return;
        try {
            setLoading(true);
            const [oportunidadesData, cooperadosData] = await Promise.all([
                getOportunidades(user.id),
                getCooperados(user.id)
            ]);
            setOportunidades(oportunidadesData);
            setCooperados(cooperadosData);
            setError(null);
        } catch (err) {
            setError('Falha ao carregar dados.');
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleOpenModal = (oportunidade: OportunidadeWithCooperado | null = null) => {
        setEditingOportunidade(oportunidade);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingOportunidade(null);
    };

    const handleSaveOportunidade = async (data: Partial<OportunidadeFormData>, id?: number) => {
        try {
            if (id) {
                await updateOportunidade(id, data);
            } else {
                await addOportunidade(data as any);
            }
            await fetchData();
            handleCloseModal();
        } catch (err) {
            alert('Falha ao salvar oportunidade.');
        }
    };
    
    const handleDeleteOportunidade = async (id: number) => {
        if (window.confirm('Tem certeza que deseja excluir esta oportunidade?')) {
            try {
                await deleteOportunidade(id);
                await fetchData();
            } catch (err) {
                alert('Falha ao excluir oportunidade.');
            }
        }
    };
    
    const filteredOportunidades = useMemo(() => {
        return oportunidades.filter(op => 
            op.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            op.cooperados?.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [oportunidades, searchQuery]);

    const stages = Object.values(EstagioOportunidade);

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-800">Pipeline de Oportunidades</h1>
                    <p className="text-neutral-500 mt-1">Visualize e gerencie seu funil de vendas de forma interativa.</p>
                </div>
                <div className="flex gap-2 mt-4 md:mt-0">
                    <div className="relative flex-grow md:flex-grow-0">
                         <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                         <input type="text" placeholder="Buscar oportunidades..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-white rounded-lg pl-10 pr-4 py-2 border focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                    <Button onClick={() => handleOpenModal()}>
                        <Plus size={20} className="mr-2" />
                        Criar Oportunidade
                    </Button>
                </div>
            </div>
             <p className="text-sm text-yellow-700 bg-yellow-100 p-2 rounded-md">
                Nota: A funcionalidade de arrastar e soltar (drag & drop) é uma simulação visual.
            </p>

            {loading && <p>Carregando pipeline...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && (
                <div className="flex-1 flex gap-4 overflow-x-auto pb-4">
                    {stages.map(stage => {
                        const oportunidadesDaEtapa = filteredOportunidades.filter(op => op.stage === stage);
                        return (
                            <KanbanColumn
                                key={stage}
                                stage={stage}
                                oportunidades={oportunidadesDaEtapa}
                                onEdit={handleOpenModal}
                                onDelete={handleDeleteOportunidade}
                            />
                        );
                    })}
                </div>
            )}
            
             <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingOportunidade ? 'Editar Oportunidade' : 'Criar Nova Oportunidade'}>
                <OportunidadeForm 
                    oportunidade={editingOportunidade}
                    cooperados={cooperados}
                    onClose={handleCloseModal}
                    onSave={handleSaveOportunidade}
                />
            </Modal>
        </div>
    );
};

export default OportunidadesPage;