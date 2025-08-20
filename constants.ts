
import { Home, Users, Briefcase, ShoppingBag, CheckSquare, BrainCircuit, BarChart2 } from 'lucide-react';
import React from 'react';

export const NAV_LINKS = [
  { href: '/', label: 'Dashboard', icon: React.createElement(Home, { size: 20 }) },
  { href: '/cooperados', label: 'Cooperados', icon: React.createElement(Users, { size: 20 }) },
  { href: '/oportunidades', label: 'Oportunidades', icon: React.createElement(Briefcase, { size: 20 }) },
  { href: '/produtos', label: 'Produtos', icon: React.createElement(ShoppingBag, { size: 20 }) },
  { href: '/tarefas', label: 'Tarefas', icon: React.createElement(CheckSquare, { size: 20 }) },
  { href: '/consultor', label: 'Consultor IA', icon: React.createElement(BrainCircuit, { size: 20 }) },
  { href: '/relatorios', label: 'Relatórios', icon: React.createElement(BarChart2, { size: 20 }) },
];