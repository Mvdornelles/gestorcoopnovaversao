
import React, { useState, useEffect } from 'react';
import { Interaction } from '../../types';
import Button from '../ui/Button';
import { Phone, Mail, Users, MessageSquare, MessageCircle, Info } from 'lucide-react';

type InteractionFormData = Omit<Interaction, 'id' | 'author'>;

interface InteractionFormProps {
  interaction?: Interaction | null;
  onSave: (data: InteractionFormData) => void;
  onClose: () => void;
}

const interactionTypes = [
  { value: 'call', label: 'Telefone', icon: Phone },
  { value: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
  { value: 'meeting', label: 'Reunião', icon: Users },
  { value: 'email', label: 'E-mail', icon: Mail },
  { value: 'note', label: 'Nota', icon: MessageSquare },
  { value: 'other', label: 'Outro', icon: Info },
] as const;

export const InteractionForm: React.FC<InteractionFormProps> = ({ interaction, onSave, onClose }) => {
    const [formData, setFormData] = useState<InteractionFormData>({
        type: 'call',
        title: '',
        description: '',
        date: new Date().toISOString().slice(0, 16), // For datetime-local format
    });
    const [errors, setErrors] = useState<{ title?: string; description?: string }>({});

    useEffect(() => {
        if (interaction) {
            setFormData({
                type: interaction.type,
                title: interaction.title,
                description: interaction.description,
                date: new Date(interaction.date).toISOString().slice(0, 16),
            });
        } else {
             setFormData({
                type: 'call',
                title: '',
                description: '',
                date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16),
            });
        }
    }, [interaction]);

    const handleTypeChange = (type: Interaction['type']) => {
        setFormData(prev => ({ ...prev, type }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if(value.trim()) {
            setErrors(prev => ({...prev, [name]: undefined}));
        }
    };

    const validate = () => {
        const newErrors: { title?: string; description?: string } = {};
        if (!formData.title.trim()) {
            newErrors.title = "O título é obrigatório.";
        }
        if (!formData.description.trim()) {
            newErrors.description = "A descrição é obrigatória.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            const dataToSave = { ...formData, date: new Date(formData.date).toISOString() };
            onSave(dataToSave);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Tipo de Interação</label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {interactionTypes.map(({ value, label, icon: Icon }) => (
                        <button
                            type="button"
                            key={value}
                            onClick={() => handleTypeChange(value)}
                            className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all duration-200 ${formData.type === value ? 'border-primary bg-primary/10 text-primary' : 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 hover:text-primary'}`}
                        >
                            <Icon size={24} />
                            <span className="text-xs mt-1 font-semibold">{label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label htmlFor="title" className="block text-sm font-medium text-neutral-700">Título</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 ${errors.title ? 'border-red-500' : ''}`}
                />
                {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title}</p>}
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-neutral-700">Descrição Detalhada</label>
                <textarea
                    id="description"
                    name="description"
                    rows={5}
                    value={formData.description}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 ${errors.description ? 'border-red-500' : ''}`}
                ></textarea>
                {errors.description && <p className="text-xs text-red-600 mt-1">{errors.description}</p>}
            </div>

             <div>
                <label htmlFor="date" className="block text-sm font-medium text-neutral-700">Data e Hora</label>
                <input
                    type="datetime-local"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
                />
            </div>


            <div className="flex justify-end gap-2 pt-4 border-t">
                <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
                <Button type="submit">{interaction ? 'Salvar Alterações' : 'Salvar Interação'}</Button>
            </div>
        </form>
    );
};