import React, { useState, useEffect, useMemo } from 'react';
import Card from '../components/ui/Card';
import { Users, DollarSign, Activity, AlertTriangle, ArrowUp, ArrowDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { getCooperados, getOportunidades, OportunidadeWithCooperado, Cooperado, EstagioOportunidade } from '../services/api';

const KpiCard = ({ title, value, icon, trend, change, colorClass }: { title: string; value: string; icon: React.ReactElement<{ size?: string | number }>; trend: 'up' | 'down'; change: string; colorClass: string; }) => {
    return (
        <Card className={`relative overflow-hidden`}>
            <div className={`absolute -top-4 -right-4 text-white/10 ${colorClass} p-2 rounded-full`}>
                {React.cloneElement(icon, { size: 80 })}
            </div>
            <div className="relative z-10">
                <p className="text-neutral-500 font-medium">{title}</p>
                <p className="text-3xl font-bold text-neutral-800 my-2">{value}</p>
                <div className="flex items-center text-sm">
                    {trend === 'up' ? <ArrowUp size={16} className="text-green-500" /> : <ArrowDown size={16} className="text-red-500" />}
                    <span className={`ml-1 ${trend === 'up' ? 'text-green-600' : 'text-red-600'} font-semibold`}>{change}</span>
                    <span className="text-neutral-400 ml-1">no último mês</span>
                </div>
            </div>
        </Card>
    );
}

const churnData = [
    { month: 'Jan', rate: 2.5 }, { month: 'Fev', rate: 2.1 },
    { month: 'Mar', rate: 2.3 }, { month: 'Abr', rate: 1.9 },
    { month: 'Mai', rate: 1.5 }, { month: 'Jun', rate: 1.2 },
];

const DashboardPage: React.FC = () => {
    const { user } = useAuth();
    const [cooperados, setCooperados] = useState<Cooperado[]>([]);
    const [oportunidades, setOportunidades] = useState<OportunidadeWithCooperado[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string|null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            try {
                setLoading(true);
                const [cooperadosData, oportunidadesData] = await Promise.all([
                    getCooperados(user.id),
                    getOportunidades(user.id)
                ]);
                setCooperados(cooperadosData);
                setOportunidades(oportunidadesData);
                setError(null);
            } catch (err) {
                setError("Falha ao carregar dados do dashboard.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    const dashboardStats = useMemo(() => {
        const totalCooperados = cooperados.length;
        const pipelineValue = oportunidades
            .filter(op => op.stage !== 'Ganho' && op.stage !== 'Perdido')
            .reduce((sum, op) => sum + (op.value ?? 0), 0);

        const pipelineData = Object.values(EstagioOportunidade)
            .filter(stage => stage !== 'Ganho' && stage !== 'Perdido')
            .map(stage => ({
                name: stage,
                value: oportunidades
                    .filter(op => op.stage === stage)
                    .reduce((sum, op) => sum + (op.value ?? 0), 0),
            }));

        const recentes = [...cooperados].sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 3);

        return { totalCooperados, pipelineValue, pipelineData, recentes };
    }, [cooperados, oportunidades]);

    if (loading) {
        return <div>Carregando dashboard...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-neutral-800">Dashboard</h1>
        <p className="text-neutral-500 mt-1">Bem-vindo(a) de volta!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Total de Cooperados" value={dashboardStats.totalCooperados.toString()} icon={<Users />} trend="up" change="+2.5%" colorClass="bg-primary" />
        <KpiCard title="Valor do Pipeline" value={`R$${(dashboardStats.pipelineValue / 1000).toFixed(0)}k`} icon={<DollarSign />} trend="up" change="+15.2%" colorClass="bg-secondary" />
        <KpiCard title="Taxa de Churn" value="1.2%" icon={<Activity />} trend="down" change="-0.3%" colorClass="bg-yellow-500" />
        <KpiCard title="Alertas da IA" value="3" icon={<AlertTriangle />} trend="up" change="+1" colorClass="bg-red-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-3">
          <h2 className="text-xl font-semibold text-neutral-800 mb-4">Pipeline por Etapa</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dashboardStats.pipelineData} animationDuration={800}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={{ stroke: 'hsl(var(--border))' }} tickLine={false} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={{ stroke: 'hsl(var(--border))' }} tickLine={false} tickFormatter={(value) => `R$${Number(value) / 1000}k`} />
              <Tooltip
                cursor={{ fill: 'hsl(var(--accent))' }}
                contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)' }}
              />
              <Bar dataKey="value" fill="hsl(var(--primary))" name="Valor" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-neutral-800 mb-4">Tendência da Taxa de Churn (Estático)</h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={churnData} animationDuration={800}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={{ stroke: 'hsl(var(--border))' }} tickLine={false} />
                    <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={{ stroke: 'hsl(var(--border))' }} tickLine={false} domain={[0, 'dataMax + 1']} unit="%" />
                    <Tooltip
                      cursor={{ stroke: 'hsl(var(--destructive))', strokeWidth: 1.5 }}
                      contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)' }}
                    />
                    <Line type="monotone" dataKey="rate" stroke="hsl(var(--destructive))" strokeWidth={2.5} activeDot={{ r: 8 }} name="Taxa de Churn"/>
                </LineChart>
            </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
            <h2 className="text-xl font-semibold text-neutral-800 mb-4">Insights da IA (Estático)</h2>
            <ul className="space-y-4">
                <li className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <AlertTriangle size={20} className="text-blue-500 mt-1 flex-shrink-0" />
                    <div>
                        <p className="font-semibold text-blue-800">Oportunidade de Cross-sell</p>
                        <p className="text-sm text-blue-600">Cooperados do nível Ouro mostraram interesse em 'Previdência Privada'.</p>
                    </div>
                </li>
                 <li className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                    <AlertTriangle size={20} className="text-yellow-500 mt-1 flex-shrink-0" />
                    <div>
                        <p className="font-semibold text-yellow-800">Risco de Churn Identificado</p>
                        <p className="text-sm text-yellow-600">Daniel Alves (Bronze) teve baixa interação nos últimos 60 dias.</p>
                    </div>
                </li>
            </ul>
        </Card>
        <Card>
            <h2 className="text-xl font-semibold text-neutral-800 mb-4">Cooperados Recentes</h2>
            <div className="space-y-3">
                {dashboardStats.recentes.map(cooperado => (
                    <div key={cooperado.id} className="flex items-center justify-between p-2 hover:bg-neutral-100 rounded-md">
                        <div className="flex items-center gap-3">
                            <img src={cooperado.avatar_url ?? ''} alt={cooperado.name} className="h-10 w-10 rounded-full"/>
                            <div>
                                <p className="font-semibold text-neutral-700">{cooperado.name}</p>
                                <p className="text-sm text-neutral-500">{cooperado.email}</p>
                            </div>
                        </div>
                         <p className="text-sm text-neutral-500">Desde {new Date(cooperado.created_at).toLocaleDateString('pt-BR')}</p>
                    </div>
                ))}
            </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;