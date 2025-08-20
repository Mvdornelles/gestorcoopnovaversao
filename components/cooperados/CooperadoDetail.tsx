
import React, { useState, useMemo } from 'react';
import { Cooperado, Tier, Interaction } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Edit, TrendingUp, Target, Briefcase, DollarSign, Users, FileText, Plus, Search, Filter } from 'lucide-react';
import { Timeline } from './Timeline';


const tierBadgeColors: { [key in Tier]: string } = {
    [Tier.Bronze]: 'bg-blue-100 text-blue-800',
    [Tier.Prata]: 'bg-neutral-200 text-neutral-800',
    [Tier.Ouro]: 'bg-yellow-100 text-yellow-800',
    [Tier.Diamante]: 'bg-purple-100 text-purple-800',
}

const StatCard: React.FC<{ icon: React.ReactElement, label: string, value: string | number }> = ({ icon, label, value }) => (
    <div className="flex items-center p-4 bg-neutral-50 rounded-lg">
        <div className="bg-primary/10 text-primary p-3 rounded-full">
            {icon}
        </div>
        <div className="ml-4">
            <p className="text-sm text-neutral-500">{label}</p>
            <p className="text-lg font-semibold text-neutral-800">{value}</p>
        </div>
    </div>
)

interface CooperadoDetailProps {
    cooperado: Cooperado;
    onEdit: (cooperado: Cooperado) => void;
    onAddInteraction: () => void;
    onEditInteraction: (interaction: Interaction) => void;
    onDeleteInteraction: (interactionId: string) => void;
}

export const CooperadoDetail: React.FC<CooperadoDetailProps> = ({ cooperado, onEdit, onAddInteraction, onEditInteraction, onDeleteInteraction }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');

    const interactionTypes: { value: Interaction['type'] | 'all', label: string }[] = [
        { value: 'all', label: 'Todos' },
        { value: 'call', label: 'Telefone' },
        { value: 'whatsapp', label: 'WhatsApp' },
        { value: 'meeting', label: 'Reunião' },
        { value: 'email', label: 'E-mail' },
        { value: 'note', label: 'Nota' },
        { value: 'other', label: 'Outro' },
    ];

    const filteredInteractions = useMemo(() => {
        return cooperado.timeline.filter(i => {
            const matchesSearch = i.title.toLowerCase().includes(searchTerm.toLowerCase()) || i.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = typeFilter === 'all' || i.type === typeFilter;
            return matchesSearch && matchesType;
        });
    }, [cooperado.timeline, searchTerm, typeFilter]);
    
    return (
        <Card className="h-full overflow-y-auto">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                <div className="flex items-center gap-4">
                    <img src={cooperado.avatar} alt={cooperado.name} className="h-20 w-20 rounded-full object-cover" />
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-2xl font-bold text-neutral-800">{cooperado.name}</h2>
                             <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${tierBadgeColors[cooperado.tier]}`}>
                                {cooperado.tier}
                            </span>
                        </div>
                        <p className="text-neutral-500">{cooperado.companyName}</p>
                        <p className="text-sm text-neutral-500 mt-1">{cooperado.email}</p>
                    </div>
                </div>
                <Button variant="ghost" onClick={() => onEdit(cooperado)} className="mt-4 md:mt-0">
                    <Edit size={16} className="mr-2" />
                    Editar Perfil
                </Button>
            </div>
            
            <div className="border-t my-6"></div>

            <div className="space-y-6">
                <section>
                    <h3 className="text-lg font-semibold text-neutral-700 mb-3">Perfil Estratégico</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4 text-sm">
                       <div className="flex items-start gap-2 p-3 bg-neutral-50 rounded-md">
                            <Briefcase size={18} className="text-neutral-500 mt-0.5 flex-shrink-0" />
                            <div>
                                <span className="text-neutral-500">Setor:</span>
                                <span className="font-semibold text-neutral-800 ml-1.5">{cooperado.sector}</span>
                            </div>
                        </div>
                         <div className="flex items-start gap-2 p-3 bg-neutral-50 rounded-md">
                            <DollarSign size={18} className="text-neutral-500 mt-0.5 flex-shrink-0" />
                            <div>
                                <span className="text-neutral-500">Faturamento:</span>
                                <span className="font-semibold text-neutral-800 ml-1.5">{cooperado.annualRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}/ano</span>
                            </div>
                        </div>
                         <div className="flex items-start gap-2 p-3 bg-neutral-50 rounded-md">
                            <Users size={18} className="text-neutral-500 mt-0.5 flex-shrink-0" />
                            <div>
                                <span className="text-neutral-500">Funcionários:</span>
                                <span className="font-semibold text-neutral-800 ml-1.5">{cooperado.employeeCount}</span>
                            </div>
                        </div>
                         <div className="flex items-start gap-2 p-3 bg-neutral-50 rounded-md col-span-1 sm:col-span-2 lg:col-span-1 xl:col-span-2">
                            <FileText size={18} className="text-neutral-500 mt-0.5 flex-shrink-0" />
                            <div>
                                <span className="text-neutral-500">Notas:</span>
                                <span className="font-semibold text-neutral-800 ml-1.5">{cooperado.notes}</span>
                            </div>
                        </div>
                    </div>
                </section>

                <section>
                     <h3 className="text-lg font-semibold text-neutral-700 mb-3">Métricas de Performance</h3>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <StatCard icon={<TrendingUp size={24} />} label="Taxa de Engajamento" value={`${cooperado.engagementRate}%`} />
                        <StatCard icon={<Target size={24} />} label="Taxa de Conversão" value={`${cooperado.conversionRate}%`} />
                     </div>
                </section>

                <section>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                        <h3 className="text-lg font-semibold text-neutral-700">Linha do Tempo de Interações</h3>
                        <Button onClick={onAddInteraction} size="sm" className="mt-2 sm:mt-0">
                            <Plus size={16} className="mr-2" />
                            Registrar Interação
                        </Button>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 mb-4 p-3 bg-neutral-50 rounded-lg">
                        <div className="relative flex-grow">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                            <input
                                type="text"
                                placeholder="Buscar no histórico..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white rounded-md pl-10 pr-4 py-2 border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                            />
                        </div>
                        <div className="relative flex-grow">
                             <Filter size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                            <select
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                                className="w-full appearance-none bg-white rounded-md pl-10 pr-4 py-2 border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                            >
                                {interactionTypes.map(type => (
                                    <option key={type.value} value={type.value}>{type.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <Timeline interactions={filteredInteractions} onEdit={onEditInteraction} onDelete={onDeleteInteraction} />
                </section>
            </div>
        </Card>
    );
};