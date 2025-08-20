
import React from 'react';
import { Interaction } from '../../types';
import { MessageSquare, Mail, Phone, Users, MessageCircle, Info, Edit, Trash2, Calendar, Clock } from 'lucide-react';
import Button from '../ui/Button';

const iconMap: { [key in Interaction['type']]: React.ReactElement } = {
  note: <MessageSquare size={18} />,
  email: <Mail size={18} />,
  call: <Phone size={18} />,
  meeting: <Users size={18} />,
  whatsapp: <MessageCircle size={18} />,
  other: <Info size={18} />,
};

const colorMap: { [key in Interaction['type']]: string } = {
  note: 'bg-yellow-500',
  email: 'bg-blue-500',
  call: 'bg-green-500',
  meeting: 'bg-purple-500',
  whatsapp: 'bg-emerald-500',
  other: 'bg-neutral-500',
};

const TimelineItem: React.FC<{ item: Interaction; isLast: boolean; onEdit: (item: Interaction) => void; onDelete: (id: string) => void; }> = ({ item, isLast, onEdit, onDelete }) => {
    return (
      <div className="relative flex gap-4">
        {/* Vertical line */}
        {!isLast && <div className="absolute left-5 top-10 h-full w-0.5 bg-neutral-200"></div>}
        
        {/* Icon */}
        <div className="relative z-10">
          <span className={`h-10 w-10 rounded-full flex items-center justify-center text-white ${colorMap[item.type]}`}>
            {iconMap[item.type]}
          </span>
        </div>

        {/* Card Content */}
        <div className="flex-1 pb-8">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-neutral-200/80">
                <div className="flex justify-between items-start">
                    <div>
                        <h4 className="font-bold text-neutral-800">{item.title}</h4>
                        <div className="flex items-center gap-4 text-xs text-neutral-500 mt-1">
                            <span>por {item.author}</span>
                            <span className="flex items-center gap-1"><Calendar size={12}/> {new Date(item.date).toLocaleDateString('pt-BR')}</span>
                            <span className="flex items-center gap-1"><Clock size={12}/> {new Date(item.date).toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})}</span>
                        </div>
                    </div>
                    <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => onEdit(item)} aria-label="Editar">
                            <Edit size={16} />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => onDelete(item.id)} aria-label="Excluir">
                            <Trash2 size={16} className="text-red-500 hover:text-red-600"/>
                        </Button>
                    </div>
                </div>
                <p className="mt-3 text-sm text-neutral-600 whitespace-pre-wrap">{item.description}</p>
            </div>
        </div>
      </div>
    );
};

export const Timeline: React.FC<{ interactions: Interaction[], onEdit: (item: Interaction) => void, onDelete: (id: string) => void }> = ({ interactions, onEdit, onDelete }) => {
  if (!interactions || interactions.length === 0) {
    return (
        <div className="text-center py-10 px-4 bg-neutral-50 rounded-lg">
            <MessageSquare size={32} className="mx-auto text-neutral-400" />
            <p className="mt-2 text-sm font-medium text-neutral-600">Nenhuma interação encontrada.</p>
            <p className="text-xs text-neutral-500">Use os filtros acima ou registre uma nova interação.</p>
        </div>
    );
  }

  const sortedInteractions = [...interactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="flow-root">
        {sortedInteractions.map((item, idx) => (
          <TimelineItem 
            key={item.id} 
            item={item} 
            isLast={idx === sortedInteractions.length - 1} 
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
    </div>
  );
};