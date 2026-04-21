import { useState, useEffect } from 'react';
import type { Subscription } from '../lib/types';
import { db } from '../lib/firebase';
import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  deleteDoc, 
  writeBatch, 
  getDocs, 
  query 
} from 'firebase/firestore';

export function useSubscriptions(userId?: string) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Initial hydration from localStorage (for guest or initial load)
  useEffect(() => {
    if (!userId) {
      try {
        const saved = localStorage.getItem('paystop_data');
        if (saved) {
          setSubscriptions(JSON.parse(saved));
        } else {
          setSubscriptions([]);
        }
      } catch (e) {
        setSubscriptions([]);
      } finally {
        setLoading(false);
      }
    }
  }, [userId]);

  // 2. Sync with Firestore when userId is available
  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    const subsRef = collection(db, 'users', userId, 'subscriptions');
    const q = query(subsRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const remoteData = snapshot.docs.map(doc => ({ ...doc.data() } as Subscription));
      setSubscriptions(remoteData);
      setLoading(false);
      
      // Mirror to localStorage as cache
      localStorage.setItem('paystop_data', JSON.stringify(remoteData));
    }, (error) => {
      console.error("Firestore error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  // 3. Migration logic: When user logs in, if local exists but remote doesn't, upload local
  useEffect(() => {
    if (!userId) return;
    const uid = userId; // Local constant for closure type safety

    const migrate = async () => {
      try {
        const localSaved = localStorage.getItem('paystop_data');
        if (!localSaved) return;
        
        const localData: Subscription[] = JSON.parse(localSaved);
        if (localData.length === 0) return;

        const subsRef = collection(db, 'users', uid, 'subscriptions');
        const snapshot = await getDocs(subsRef);
        
        // Only migrate if remote is empty to avoid duplicates
        if (snapshot.empty) {
          const batch = writeBatch(db);
          localData.forEach(sub => {
            const docRef = doc(subsRef, sub.id);
            batch.set(docRef, sub);
          });
          await batch.commit();
          console.log("Migrated local data to Firestore");
        }
      } catch (err) {
        console.error("Migration failed:", err);
      }
    };

    migrate();
  }, [userId]);

  // 4. Persistence for guest mode (only if not syncing with cloud)
  useEffect(() => {
    if (!userId) {
      localStorage.setItem('paystop_data', JSON.stringify(subscriptions));
    }
  }, [subscriptions, userId]);

  const addSubscription = async (sub: Omit<Subscription, 'id'>) => {
    const id = crypto.randomUUID();
    const newSub = { ...sub, id };

    if (userId) {
      const docRef = doc(db, 'users', userId, 'subscriptions', id);
      await setDoc(docRef, newSub);
    } else {
      setSubscriptions(prev => [...prev, newSub]);
    }
  };

  const removeSubscription = async (id: string) => {
    if (userId) {
      const docRef = doc(db, 'users', userId, 'subscriptions', id);
      await deleteDoc(docRef);
    } else {
      setSubscriptions(prev => prev.filter(s => s.id !== id));
    }
  };

  return { subscriptions, loading, addSubscription, removeSubscription };
}
