
import React from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Download } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';

const tierData = [
    { name: 'Ouro', value: 400 },
    { name: 'Prata', value: 600 },
    { name: 'Bronze', value: 245 },
];
const COLORS = ['#FBBF24', '#9CA3AF', '#3B82F6'];

const monthlyGrowthData = [
    { name: 'Jan', cooperados: 20 }, { name: 'Fev', cooperados: 25 },
    { name: 'Mar', cooperados: 22 }, { name: 'Abr', cooperados: 30 },
    { name: 'Mai', cooperados: 35 }, { name: 'Jun', cooperados: 40 },
];

const RelatoriosPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold text-neutral-800">Relatórios</h1>
            <p className="text-neutral-500 mt-1">Análises detalhadas e exportação de dados.</p>
        </div>
        <Button variant="secondary">
            <Download size={20} className="mr-2" />
            Exportar Tudo (PDF)
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
            <h2 className="text-xl font-semibold text-neutral-800 mb-4">Distribuição de Cooperados por Nível</h2>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={tierData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                        {tierData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </Card>
        <Card>
            <h2 className="text-xl font-semibold text-neutral-800 mb-4">Crescimento Mensal de Cooperados</h2>
             <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyGrowthData}>
                    <defs>
                        <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} />
                    <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.5rem' }} />
                    <Area type="monotone" dataKey="cooperados" stroke="#10B981" fillOpacity={1} fill="url(#colorGrowth)" name="Novos Cooperados"/>
                </AreaChart>
            </ResponsiveContainer>
        </Card>
      </div>
      
      <Card>
          <h2 className="text-xl font-semibold text-neutral-800 mb-4">Filtros Avançados</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                  <label className="block text-sm font-medium text-neutral-700">Período</label>
                  <select className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 bg-white">
                      <option>Últimos 30 dias</option>
                      <option>Últimos 90 dias</option>
                      <option>Este ano</option>
                  </select>
              </div>
              <div>
                  <label className="block text-sm font-medium text-neutral-700">Segmento</label>
                  <select className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 bg-white">
                      <option>Todos</option>
                      <option>Pessoa Física</option>
                      <option>Pessoa Jurídica</option>
                  </select>
              </div>
              <div className="self-end">
                <Button className="w-full">Aplicar Filtros</Button>
              </div>
          </div>
      </Card>

    </div>
  );
};

export default RelatoriosPage;