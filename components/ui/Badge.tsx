
import React from 'react';
import { Tier } from '../../types';

interface BadgeProps {
  tier: Tier;
  className?: string;
}

const tierStyles: { [key in Tier]: string } = {
  [Tier.Bronze]: 'bg-yellow-200 text-yellow-900 border border-yellow-300',
  [Tier.Prata]: 'bg-neutral-200 text-neutral-800 border border-neutral-300',
  [Tier.Ouro]: 'bg-amber-400 text-amber-900 border border-amber-500',
  [Tier.Diamante]: 'bg-sky-200 text-sky-900 border border-sky-300',
};

const Badge: React.FC<BadgeProps> = ({ tier, className = '' }) => {
  const classes = `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${tierStyles[tier]} ${className}`;

  return (
    <span className={classes}>
      {tier}
    </span>
  );
};

export default Badge;