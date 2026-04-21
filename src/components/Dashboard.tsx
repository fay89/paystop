import React from 'react';
import type { Subscription } from '../lib/types';
import { isThisMonth } from 'date-fns';

interface Props {
  subscriptions: Subscription[];
}

export const Dashboard: React.FC<Props> = ({ subscriptions }) => {
  const monthlyTotal = subscriptions.reduce((acc, sub) => {
    if (sub.frequency === 'monthly') return acc + sub.amount;
    if (sub.frequency === 'yearly') return acc + (sub.amount / 12);
    return acc;
  }, 0);

  const renewalsThisMonth = subscriptions.filter(sub => {
    return isThisMonth(new Date(sub.nextPaymentDate));
  }).length;

  return (
    <div className="card dashboard-card">
      <div className="title">TOTAL GASTO MENSUAL:</div>
      <div className="amount">€{monthlyTotal.toFixed(2)}</div>
      <div className="subtitle">
        Renovaciones este mes: {renewalsThisMonth}
      </div>
    </div>
  );
};
