import React, { useState, useEffect, useCallback } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { useAuth } from '../contexts/AuthContext';
import { getTasks, addTask, updateTask, deleteTask, Tarefa, PrioridadeTarefa } from '../services/api';
import { Plus, Trash2 } from 'lucide-react';

const priorityColors: { [key in PrioridadeTarefa]: { bg: string; text: string; } } = {
  'Alta': { bg: 'bg-red-100', text: 'text-red-800' },
  'Média': { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  'Baixa': { bg: 'bg-blue-100', text: 'text-blue-800' },
};

type TarefaFormData = Omit<Tarefa, 'id' | 'created_at' | 'completed' | 'user_id'>;

const TarefaForm: React.FC<{
    onClose: () => void;
    onSave: (data: TarefaFormData) => void;
}> = ({ onClose, onSave }) => {
    const [formData, setFormData] = useState<Omit<TarefaFormData, 'cooperado_id' | 'oportunidade_id'> & { linkedToType: 'none' | 'cooperado' | 'oportunidade', linkedToId: string }>({
        title: '',
        due_date: new Date().toISOString().split('T')[0],
        priority: 'Média',
        linkedToType: 'none',
        linkedToId: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const { linkedToType, linkedToId, ...rest } = formData;
        const taskData: TarefaFormData = {
            ...rest,
            cooperado_id: linkedToType === 'cooperado' ? Number(linkedToId) : null,
            oportunidade_id: linkedToType === 'oportunidade' ? Number(linkedToId) : null,
        };
        onSave(taskData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-neutral-700">Título da Tarefa</label>
                <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm p-2" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-neutral-700">Data de Vencimento</label>
                    <input type="date" value={formData.due_date ?? ''} onChange={e => setFormData({ ...formData, due_date: e.target.value })} required className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm p-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-neutral-700">Prioridade</label>
                    <select value={formData.priority ?? 'Média'} onChange={e => setFormData({ ...formData, priority: e.target.value as PrioridadeTarefa })} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm p-2 bg-white">
                        {Object.keys(priorityColors).map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                </div>
            </div>
            {/* A simplified link for now. A real implementation would have a search/select component. */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-neutral-700">Vincular a</label>
                     <select value={formData.linkedToType} onChange={e => setFormData({ ...formData, linkedToType: e.target.value as any })} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm p-2 bg-white">
                        <option value="none">Ninguém</option>
                        <option value="cooperado">Cooperado</option>
                        <option value="oportunidade">Oportunidade</option>
                    </select>
                </div>
                {formData.linkedToType !== 'none' && (
                    <div>
                        <label className="block text-sm font-medium text-neutral-700">ID do Vínculo</label>
                        <input type="number" placeholder="Digite o ID" value={formData.linkedToId} onChange={e => setFormData({ ...formData, linkedToId: e.target.value })} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm p-2" />
                    </div>
                )}
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t">
                <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
                <Button type="submit">Criar Tarefa</Button>
            </div>
        </form>
    );
};


const TaskItem: React.FC<{ task: Tarefa; onToggle: (id: number, completed: boolean) => void; onDelete: (id: number) => void; }> = ({ task, onToggle, onDelete }) => {
    const priority = priorityColors[task.priority!] ?? priorityColors['Média'];
    const getLinkedToText = () => {
        if (task.cooperado_id) return `Cooperado #${task.cooperado_id}`;
        if (task.oportunidade_id) return `Oportunidade #${task.oportunidade_id}`;
        return 'Nenhum vínculo';
    }

    return (
        <div className={`group flex items-center p-4 rounded-lg border transition-all duration-200 ${task.completed ? 'bg-neutral-100' : 'bg-white'}`}>
            <div className="flex items-center flex-1 gap-4">
                <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => onToggle(task.id, !task.completed)}
                    className="h-5 w-5 rounded border-neutral-300 text-primary focus:ring-primary cursor-pointer"
                />
                <div className="flex-1">
                    <p className={`font-medium ${task.completed ? 'line-through text-neutral-500' : 'text-neutral-800'}`}>{task.title}</p>
                    <p className={`text-sm ${task.completed ? 'text-neutral-400' : 'text-neutral-500'}`}>{getLinkedToText()}</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <span className={`text-sm font-semibold px-3 py-1 rounded-full ${priority.bg} ${priority.text}`}>
                    {task.priority}
                </span>
                <span className={`text-sm ${task.completed ? 'text-neutral-400' : 'text-neutral-600'}`}>
                    Vence em: {new Date(task.due_date!).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                </span>
                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100" onClick={() => onDelete(task.id)}><Trash2 size={16} className="text-red-500"/></Button>
            </div>
        </div>
    );
}

const TarefasPage: React.FC = () => {
    const [tasks, setTasks] = useState<Tarefa[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { user } = useAuth();

    const fetchTasks = useCallback(async () => {
        if (!user) return;
        try {
            setLoading(true);
            const data = await getTasks(user.id);
            setTasks(data);
            setError(null);
        } catch (err) {
            setError('Falha ao carregar as tarefas.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const handleToggleTask = async (id: number, completed: boolean) => {
        try {
            await updateTask(id, { completed });
            await fetchTasks();
        } catch(err) {
            alert('Falha ao atualizar a tarefa.');
        }
    };

    const handleDeleteTask = async (id: number) => {
        if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
            try {
                await deleteTask(id);
                await fetchTasks();
            } catch(err) {
                alert('Falha ao excluir a tarefa.');
            }
        }
    };

    const handleAddTask = async (formData: TarefaFormData) => {
        if(!user) return;
        try {
            await addTask({ ...formData, user_id: user.id });
            await fetchTasks();
            setIsModalOpen(false);
        } catch(err) {
            alert('Falha ao adicionar a tarefa.');
        }
    }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold text-neutral-800">Tarefas</h1>
            <p className="text-neutral-500 mt-1">Acompanhe suas atividades e pendências.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
            <Plus size={20} className="mr-2" />
            Nova Tarefa
        </Button>
      </div>

      <Card>
        {loading && <p>Carregando tarefas...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && (
            <div className="space-y-4">
                {tasks.length > 0 ? (
                    tasks
                        .sort((a, b) => a.completed === b.completed ? 0 : a.completed ? 1 : -1)
                        .map(task => <TaskItem key={task.id} task={task} onToggle={handleToggleTask} onDelete={handleDeleteTask} />)
                ) : (
                    <p className="text-center text-neutral-500 py-4">Nenhuma tarefa encontrada.</p>
                )}
            </div>
        )}
      </Card>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Criar Nova Tarefa">
          <TarefaForm onClose={() => setIsModalOpen(false)} onSave={handleAddTask} />
      </Modal>
    </div>
  );
};

export default TarefasPage;