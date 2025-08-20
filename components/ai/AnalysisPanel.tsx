import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { mockCooperados } from '../../data/mockData';
import { Lightbulb, AlertTriangle, Copy, FileText } from 'lucide-react';

const AnalysisPanel: React.FC = () => {
  return (
    <div className="h-full flex flex-col gap-6 overflow-y-auto pr-2">
      {/* Cooperado Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Análise Focada</CardTitle>
        </CardHeader>
        <CardContent>
          <Select defaultValue="">
            <option value="" disabled>Selecione um cooperado</option>
            {mockCooperados.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </Select>
        </CardContent>
      </Card>

      {/* Actionable Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Lightbulb size={18} className="text-yellow-500" />
            Insights Acionáveis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-blue-50/50 rounded-lg">
            <AlertTriangle size={32} className="text-blue-500 mt-1 flex-shrink-0" />
            <div>
              <p className="font-semibold text-sm text-blue-800">Oportunidade de Cross-sell</p>
              <p className="text-xs text-blue-600">Cooperados do nível Ouro mostraram interesse em 'Previdência Privada'.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-red-50/50 rounded-lg">
            <AlertTriangle size={32} className="text-red-500 mt-1 flex-shrink-0" />
            <div>
              <p className="font-semibold text-sm text-red-800">Risco de Churn Identificado</p>
              <p className="text-xs text-red-600">Daniel Alves (Bronze) teve baixa interação nos últimos 60 dias.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recomendações de Produto</CardTitle>
          <CardDescription className="text-xs">Para: Daniel Alves</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
            <div className="p-3 border rounded-lg">
                <p className="font-semibold text-sm">Crédito Pessoal</p>
                <p className="text-xs text-muted-foreground">Ideal para cooperados buscando capital de giro rápido. Fit: <span className="font-bold text-green-600">85%</span></p>
            </div>
             <div className="p-3 border rounded-lg">
                <p className="font-semibold text-sm">Seguro Residencial</p>
                <p className="text-xs text-muted-foreground">Baixa adesão neste segmento. Oportunidade de campanha. Fit: <span className="font-bold text-yellow-600">65%</span></p>
            </div>
        </CardContent>
      </Card>

      {/* Content Generation */}
      <Card>
        <CardHeader>
            <CardTitle className="text-base">Geração de Conteúdo</CardTitle>
            <CardDescription className="text-xs">Rascunho de e-mail de follow-up para Ana Silva.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="text-xs p-3 bg-neutral-50 rounded-lg border max-h-28 overflow-y-auto">
                <p className="font-semibold">Assunto: Re: Proposta de Investimento</p>
                <p className="mt-2">Olá Ana, tudo bem? Gostaria de saber se você teve a oportunidade de analisar a proposta de investimento que enviei. Fico à disposição para qualquer esclarecimento. Abraços, Mariana.</p>
            </div>
            <div className="flex gap-2 mt-3">
                <Button variant="outline" size="sm"><Copy size={14} className="mr-1"/> Copiar</Button>
                <Button variant="outline" size="sm"><FileText size={14} className="mr-1"/> Salvar</Button>
            </div>
        </CardContent>
      </Card>

    </div>
  );
};

export default AnalysisPanel;
