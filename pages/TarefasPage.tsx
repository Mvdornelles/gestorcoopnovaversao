
import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { mockTarefas } from '../data/mockData';
import { TaskPriority, Tarefa } from '../types';
import { Plus } from 'lucide-react';

const priorityColors: { [key in TaskPriority]: { bg: string; text: string; ring: string } } = {
  [TaskPriority.High]: { bg: 'bg-red-100', text: 'text-red-800', ring: 'ring-red-500' },
  [TaskPriority.Medium]: { bg: 'bg-yellow-100', text: 'text-yellow-800', ring: 'ring-yellow-500' },
  [TaskPriority.Low]: { bg: 'bg-blue-100', text: 'text-blue-800', ring: 'ring-blue-500' },
};

const TaskItem: React.FC<{ task: Tarefa }> = ({ task }) => {
    const [isChecked, setIsChecked] = useState(task.completed);
    const priority = priorityColors[task.priority];

    return (
        <div className={`flex items-center p-4 rounded-lg border transition-all duration-200 ${isChecked ? 'bg-neutral-100' : 'bg-white'}`}>
            <div className="flex items-center flex-1 gap-4">
                <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => setIsChecked(!isChecked)}
                    className="h-5 w-5 rounded border-neutral-300 text-primary focus:ring-primary cursor-pointer"
                />
                <div className="flex-1">
                    <p className={`font-medium ${isChecked ? 'line-through text-neutral-500' : 'text-neutral-800'}`}>{task.title}</p>
                    <p className={`text-sm ${isChecked ? 'text-neutral-400' : 'text-neutral-500'}`}>{task.linkedTo}</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <span className={`text-sm font-semibold px-3 py-1 rounded-full ${priority.bg} ${priority.text}`}>
                    {task.priority}
                </span>
                <span className={`text-sm ${isChecked ? 'text-neutral-400' : 'text-neutral-600'}`}>
                    Vence em: {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                </span>
            </div>
        </div>
    );
}

const TarefasPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold text-neutral-800">Tarefas</h1>
            <p className="text-neutral-500 mt-1">Acompanhe suas atividades e pendências.</p>
        </div>
        <Button>
            <Plus size={20} className="mr-2" />
            Nova Tarefa
        </Button>
      </div>

      <Card>
        <div className="space-y-4">
            {mockTarefas
                .sort((a, b) => a.completed === b.completed ? 0 : a.completed ? 1 : -1)
                .map(task => <TaskItem key={task.id} task={task} />)
            }
        </div>
      </Card>
    </div>
  );
};

export default TarefasPage;