import React, { useState } from 'react';
import type { Subscription } from '../lib/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { X } from 'lucide-react';
import { ServiceLogo } from './ServiceLogo';

interface Props {
  subscriptions: Subscription[];
  onRemove: (id: string) => void;
}

export const SubscriptionList: React.FC<Props> = ({ subscriptions, onRemove }) => {
  const [alertSub, setAlertSub] = useState<Subscription | null>(null);

  if (subscriptions.length === 0) {
    return <div className="text-center text-muted py-8">Aún no hay suscripciones actívas.</div>;
  }



  return (
    <div>
      <div className="list-header">SUSCRIPCIONES ACTIVAS</div>
      <div className="card">
        {subscriptions.map(sub => {
          const dateStr = format(new Date(sub.nextPaymentDate), "d MMMM", { locale: es });

          return (
            <div key={sub.id} className="sub-item" onClick={() => setAlertSub(sub)} style={{ cursor: 'pointer' }}>
               <ServiceLogo name={sub.name} size={40} />
               <div className="sub-info" style={{ marginLeft: '0.75rem' }}>
                 <div className="sub-name text-white">{sub.name}</div>
                 <div className="sub-date">Próximo cobro: {dateStr}</div>
               </div>
               <div className="sub-amount-box text-white">
                 <div className="sub-amount">{sub.currency}{sub.amount.toFixed(2)}</div>
                 <div className="sub-freq">/{sub.frequency === 'monthly' ? 'mes' : 'año'}</div>
               </div>
            </div>
          );
        })}
      </div>

      {/* Specific Alert Modal matched to screenshot */}
      {alertSub && (
        <div className="alert-modal-overlay" onClick={() => setAlertSub(null)}>
          <div className="alert-modal" onClick={e => e.stopPropagation()}>
             <button onClick={() => setAlertSub(null)} className="absolute right-4 top-4 text-gray-400 bg-gray-100 rounded-full p-1"><X size={16}/></button>
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
               <ServiceLogo name={alertSub.name} size={48} />
               <strong style={{ fontSize: '1rem', color: '#111' }}>{alertSub.name}</strong>
             </div>
             <div className="alert-title">Alerta de renovación (¡48H Faltan!)</div>
             <div className="alert-text">
               Tu suscripción a <strong>{alertSub.name}</strong> se renovará pronto
               por <strong>{alertSub.currency}{alertSub.amount.toFixed(2)}</strong>.
             </div>
             <button onClick={() => setAlertSub(null)} className="btn-pill btn-gray">Mantenerme Suscrito</button>
             <button onClick={() => { onRemove(alertSub.id); setAlertSub(null); }} className="btn-pill w-full mt-2" style={{ background: '#3ce57e' }}>IR A CANCELAR</button>
          </div>
        </div>
      )}
    </div>
  );
};
