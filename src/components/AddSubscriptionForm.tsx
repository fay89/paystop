import React, { useState } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { es } from 'date-fns/locale/es';
import 'react-datepicker/dist/react-datepicker.css';
import type { Subscription, Frequency } from '../lib/types';
import { Plus } from 'lucide-react';
import { ServicePicker } from './ServicePicker';

registerLocale('es', es);

interface Props {
  onAdd: (sub: Omit<Subscription, 'id'>) => void;
}

export const AddSubscriptionForm: React.FC<Props> = ({ onAdd }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState<Date | null>(new Date());
  const [currency, setCurrency] = useState('€');
  const [frequency, setFrequency] = useState<Frequency>('monthly');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount || !date) return;

    onAdd({
      name,
      amount: parseFloat(amount),
      currency,
      nextPaymentDate: date.toISOString().split('T')[0],
      frequency,
    });
    setName(''); setAmount(''); setDate(new Date()); setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <div className="floating-action">
        <button onClick={() => setIsOpen(true)} className="btn-pill shadow-lg">
          <Plus size={18} strokeWidth={3} /> Añadir Suscripción
        </button>
      </div>
    );
  }

  return (
    <div className="alert-modal-overlay">
      <div className="alert-modal text-left" style={{ background: 'var(--surface-color)', color: 'var(--text-primary)', overflowY: 'auto', maxHeight: '90vh' }}>
        <h3 className="form-title">Nueva Suscripción</h3>

        <form onSubmit={handleSubmit} className="form-body">

          {/* Service Picker */}
          <div className="form-field">
            <label>Servicio</label>
            <ServicePicker value={name} onChange={setName} />
          </div>

          {/* Amount + Currency */}
          <div className="form-field">
            <label>Importe</label>
            <div className="amount-row">
              <select value={currency} onChange={e => setCurrency(e.target.value)} className="currency-select">
                <option value="€">€</option>
                <option value="$">$</option>
                <option value="£">£</option>
              </select>
              <input
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="0.00"
                required
                className="amount-input"
              />
            </div>
          </div>

          {/* Billing date – custom calendar */}
          <div className="form-field">
            <label>Próximo Cobro</label>
            <DatePicker
              selected={date}
              onChange={(d: Date | null) => setDate(d)}
              locale="es"
              dateFormat="dd/MM/yyyy"
              minDate={new Date()}
              required
              placeholderText="Selecciona una fecha..."
              className="datepicker-input"
              calendarClassName="paystop-calendar"
              popperPlacement="top-start"
              showPopperArrow={false}
            />
          </div>

          {/* Frequency */}
          <div className="form-field">
            <label>Frecuencia</label>
            <div className="freq-row">
              {(['monthly', 'yearly'] as Frequency[]).map(f => (
                <button
                  key={f}
                  type="button"
                  className={`freq-btn ${frequency === f ? 'active' : ''}`}
                  onClick={() => setFrequency(f)}
                >
                  {f === 'monthly' ? '📅 Mensual' : '📆 Anual'}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button type="button" onClick={() => setIsOpen(false)} className="btn-pill btn-gray w-full">Cancelar</button>
            <button type="submit" className="btn-pill w-full">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
};
