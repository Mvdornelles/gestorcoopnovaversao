
import React, { useState, useMemo } from 'react';
import { Oportunidade, OpportunityStage, Cooperado } from '../types';
import { mockOportunidades, mockCooperados } from '../data/mockData';
import { MoreHorizontal, Plus, Search, DollarSign, Calendar, Edit, Trash2, Lamp, Menu } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';

const stageConfig: { [key in OpportunityStage]: { border: string; bg: string; text: string; } } = {
    [OpportunityStage.Prospecting]: { border: 'border-neutral-400', bg: 'bg-neutral-100', text: 'text-neutral-800' },
    [OpportunityStage.Qualification]: { border: 'border-blue-500', bg: 'bg-blue-50', text: 'text-blue-800' },
    [OpportunityStage.Diagnosis]: { border: 'border-purple-500', bg: 'bg-purple-50', text: 'text-purple-800' },
    [OpportunityStage.Proposal]: { border: 'border-yellow-500', bg: 'bg-yellow-50', text: 'text-yellow-800' },
    [OpportunityStage.Negotiation]: { border: 'border-orange-500', bg: 'bg-orange-50', text: 'text-orange-800' },
    [OpportunityStage.Won]: { border: 'border-green-500', bg: 'bg-green-50', text: 'text-green-800' },
    [OpportunityStage.Lost]: { border: 'border-red-500', bg: 'bg-red-50', text: 'text-red-800' },
};

// --- Sub-components defined inside the page file ---

const OportunidadeForm: React.FC<{
  oportunidade?: Oportunidade | null;
  onClose: () => void;
  onSave: (data: Omit<Oportunidade, 'id'> & { id?: string }) => void;
}> = ({ oportunidade, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        title: oportunidade?.title || '',
        cooperadoId: oportunidade?.cooperadoId || 0,
        stage: oportunidade?.stage || OpportunityStage.Prospecting,
        value: oportunidade?.value || 0,
        expected_close_date: oportunidade?.expected_close_date || new Date().toISOString().split('T')[0],
        description: oportunidade?.description || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const cooperado = mockCooperados.find(c => c.id === Number(formData.cooperadoId));
        const dataToSave = {
            ...formData,
            cooperadoName: cooperado?.name || 'Não encontrado',
            value: Number(formData.value),
        };
        onSave(oportunidade ? { ...dataToSave, id: oportunidade.id } : dataToSave);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-neutral-700">Título</label>
                <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2" />
            </div>
            <div>
                <label className="block text-sm font-medium text-neutral-700">Cooperado Associado</label>
                <select value={formData.cooperadoId} onChange={e => setFormData({ ...formData, cooperadoId: Number(e.target.value)})} required className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 bg-white text-neutral-900">
                    <option value={0} disabled>Selecione um cooperado</option>
                    {mockCooperados.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-neutral-700">Valor Estimado</label>
                    <input type="number" value={formData.value} onChange={e => setFormData({ ...formData, value: Number(e.target.value) })} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-neutral-700">Data Prevista de Fechamento</label>
                    <input type="date" value={formData.expected_close_date} onChange={e => setFormData({ ...formData, expected_close_date: e.target.value })} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2" />
                </div>
            </div>
             <div>
                <label className="block text-sm font-medium text-neutral-700">Estágio</label>
                <select value={formData.stage} onChange={e => setFormData({ ...formData, stage: e.target.value as OpportunityStage })} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 bg-white text-neutral-900">
                    {Object.values(OpportunityStage).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-neutral-700">Descrição</label>
                <textarea rows={3} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"></textarea>
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t">
                <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
                <Button type="submit">{oportunidade ? 'Salvar Alterações' : 'Criar Oportunidade'}</Button>
            </div>
        </form>
    );
};


const KanbanCard: React.FC<{ oportunidade: Oportunidade; onEdit: (op: Oportunidade) => void; onDelete: (id: string) => void; }> = ({ oportunidade, onEdit, onDelete }) => {
    const cooperado = mockCooperados.find(c => c.id === oportunidade.cooperadoId);
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
                    <img src={cooperado.avatar} alt={cooperado.name} className="h-6 w-6 rounded-full"/>
                    <p className="text-sm font-medium text-neutral-600">{oportunidade.cooperadoName}</p>
                </div>
            )}
            <div className="flex justify-between items-center mt-3 text-sm text-neutral-500">
                <span className="font-semibold text-secondary flex items-center gap-1"><DollarSign size={14}/> {oportunidade.value.toLocaleString('pt-BR')}</span>
                <span className="flex items-center gap-1"><Calendar size={14}/> {new Date(oportunidade.expected_close_date).toLocaleDateString('pt-BR')}</span>
            </div>
             {oportunidade.stage !== OpportunityStage.Won && oportunidade.stage !== OpportunityStage.Lost && (
                <div className="mt-3">
                    <span className="text-xs font-semibold bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full flex items-center gap-1 w-fit">
                        <Lamp size={14} /> Sugestão da IA: Risco de Estagnação
                    </span>
                </div>
            )}
        </div>
    );
};

const KanbanColumn: React.FC<{ stage: OpportunityStage; oportunidades: Oportunidade[]; onEdit: (op: Oportunidade) => void; onDelete: (id: string) => void; }> = ({ stage, oportunidades, onEdit, onDelete }) => {
    const totalValue = oportunidades.reduce((sum, op) => sum + op.value, 0);
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


// --- Main Page Component ---

const OportunidadesPage: React.FC = () => {
    const [oportunidades, setOportunidades] = useState<Oportunidade[]>(mockOportunidades);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingOportunidade, setEditingOportunidade] = useState<Oportunidade | null>(null);

    const handleOpenModal = (oportunidade: Oportunidade | null = null) => {
        setEditingOportunidade(oportunidade);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingOportunidade(null);
    };

    const handleSaveOportunidade = (data: Omit<Oportunidade, 'id'> & { id?: string }) => {
        if (data.id) { // Editing existing
            setOportunidades(prev => prev.map(op => op.id === data.id ? { ...op, ...data } as Oportunidade : op));
        } else { // Adding new
            const newOportunidade: Oportunidade = {
                ...data,
                id: `op-${Date.now()}`,
            } as Oportunidade;
            setOportunidades(prev => [...prev, newOportunidade]);
        }
        handleCloseModal();
    };
    
    const handleDeleteOportunidade = (id: string) => {
        if (window.confirm('Tem certeza que deseja excluir esta oportunidade?')) {
            setOportunidades(prev => prev.filter(op => op.id !== id));
        }
    };
    
    const filteredOportunidades = useMemo(() => {
        return oportunidades.filter(op => 
            op.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            op.cooperadoName.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [oportunidades, searchQuery]);

    const stages = Object.values(OpportunityStage);

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
                         <input 
                            type="text"
                            placeholder="Buscar oportunidades..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white rounded-lg pl-10 pr-4 py-2 border focus:outline-none focus:ring-2 focus:ring-primary"
                         />
                    </div>
                    <Button onClick={() => handleOpenModal()}>
                        <Plus size={20} className="mr-2" />
                        Criar Oportunidade
                    </Button>
                </div>
            </div>
             <p className="text-sm text-yellow-700 bg-yellow-100 p-2 rounded-md">
                Nota: A funcionalidade de arrastar e soltar (drag & drop) é uma simulação visual. Uma implementação completa requer bibliotecas como `dnd-kit`.
            </p>

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
            
             <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingOportunidade ? 'Editar Oportunidade' : 'Criar Nova Oportunidade'}>
                <OportunidadeForm 
                    oportunidade={editingOportunidade}
                    onClose={handleCloseModal}
                    onSave={handleSaveOportunidade}
                />
            </Modal>
        </div>
    );
};

export default OportunidadesPage;