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
    let usersSnapshot;
    try {
      usersSnapshot = await db.collection('users').get();
    } catch (e: any) {
      return res.status(500).json({ error: "Firestore Error: " + (e.message || e) });
    }
    
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
      let subsSnapshot;
      try {
        subsSnapshot = await userDoc.ref.collection('subscriptions').get();
      } catch (e: any) {
        return res.status(500).json({ error: "Firestore Subscriptions fetch error: " + (e.message || e) });
      }
      
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
          } catch (e: any) {
            console.error(`Failed to send to user ${userDoc.id}`, e);
            // Don't stop the loop just because ONE push failed (e.g. invalid token)
            // But if we want to debug the immediate error for the user, we can return it:
            if (e.message?.includes('NOT_FOUND') || e.code?.includes('NOT_FOUND')) {
              return res.status(500).json({ error: "Messaging Error: " + (e.message || e) });
            }
          }
        }
      }
    }

    res.status(200).json({ success: true, sentNotifications: sentCount });
  } catch (error: any) {
    console.error("Global Error", error);
    res.status(500).json({ error: "Global Error: " + error.message });
  }
}
