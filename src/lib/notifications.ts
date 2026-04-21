export function checkAlerts(subscriptions: any[]) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  
  const now = new Date().getTime();
  const LIMIT = 48 * 60 * 60 * 1000;
  
  subscriptions.forEach(sub => {
    const payment = new Date(sub.nextPaymentDate).getTime();
    const diff = payment - now;
    
    if (diff > 0 && diff <= LIMIT) {
      const lockKey = `paystop_notified_${sub.id}_${sub.nextPaymentDate}`;
      if (!localStorage.getItem(lockKey)) {
        new Notification('¡Atención! Cobro Inminente', {
          body: `El cobro de ${sub.name} por ${sub.currency}${sub.amount} está a punto de ejecutarse.`,
          icon: '/vite.svg'
        });
        localStorage.setItem(lockKey, 'true');
      }
    }
  });
}

export async function authorizeAlerts() {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  const p = await Notification.requestPermission();
  return p === 'granted';
}
