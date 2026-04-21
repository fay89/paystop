export type Frequency = 'monthly' | 'yearly';

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  currency: string;
  nextPaymentDate: string; // ISO yyyy-mm-dd
  frequency: Frequency;
  cancelUrl?: string; // Enlace para cancelar servicio
}
