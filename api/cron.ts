import * as admin from 'firebase-admin';

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  } catch (err) {
    console.error("Firebase Admin config error. Ensure FIREBASE_SERVICE_ACCOUNT env var is set.", err);
  }
}

export default async function handler(req: any, res: any) {
  // Optional: Security check to ensure it's called by Vercel Cron
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).end('Unauthorized');
  }

  try {
    const db = admin.firestore();
    const messaging = admin.messaging();

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
