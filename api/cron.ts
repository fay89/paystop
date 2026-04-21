import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getMessaging } from 'firebase-admin/messaging';

// Initialize Firebase Admin if not already initialized
if (getApps().length === 0) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');
    initializeApp({
      credential: cert(serviceAccount)
    });
  } catch (err) {
    console.error("Firebase Admin config error. Ensure FIREBASE_SERVICE_ACCOUNT env var is set.", err);
  }
}

export default async function handler(req: any, res: any) {
  // Allow Vercel Cron or manual testing via URL param
  const isVercelCron = req.headers.authorization === `Bearer ${process.env.CRON_SECRET}`;
  const isManualTest = req.query.test === 'paystop'; // Secret testing parameter

  if (!isVercelCron && !isManualTest) {
    return res.status(401).end('Unauthorized');
  }

  try {
    const db = getFirestore();
    const messaging = getMessaging();

    // 1. Get all users
    const usersSnapshot = await db.collection('users').get();
    let sentCount = 0;

    // Tomorrow date bounds
    const now = new Date();
    const tomorrowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime();
    const tomorrowEnd = tomorrowStart + (24 * 60 * 60 * 1000);

    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      const fcmToken = userData.fcmToken;

      if (!fcmToken) continue; // Skip users without push tokens

      // 2. Fetch their subscriptions
      const subsSnapshot = await userDoc.ref.collection('subscriptions').get();
      
      for (const subDoc of subsSnapshot.docs) {
        const sub = subDoc.data();
        const nextPayment = new Date(sub.nextPaymentDate).getTime();

        // 3. Check if billing date is tomorrow
        if (nextPayment >= tomorrowStart && nextPayment < tomorrowEnd) {
          // Send notification
          try {
            await messaging.send({
              token: fcmToken,
              notification: {
                title: 'Alerta de Suscripción 💸',
                body: `Tu suscripción a ${sub.name} se cobrará mañana (${sub.currency}${sub.amount.toFixed(2)}).`
              },
              data: {
                subscriptionId: subDoc.id,
                click_action: 'FLUTTER_NOTIFICATION_CLICK' // Standard to make sure click events fire
              }
            });
            sentCount++;
          } catch (e) {
            console.error(`Failed to send to user ${userDoc.id}`, e);
          }
        }
      }
    }

    res.status(200).json({ success: true, sentNotifications: sentCount });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
