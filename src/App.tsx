import { useState, useEffect } from 'react';
import { UserRound, Camera, LogOut } from 'lucide-react';
import { onAuthChange, logoutFirebase } from './lib/firebase';
import type { User } from 'firebase/auth';
import { useSubscriptions } from './hooks/useSubscriptions';
import { Dashboard } from './components/Dashboard';
import { SubscriptionList } from './components/SubscriptionList';
import { AddSubscriptionForm } from './components/AddSubscriptionForm';
import { LoginPage } from './components/LoginPage';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const { subscriptions, loading: subsLoading, addSubscription, removeSubscription } = useSubscriptions(user?.uid);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Subscribe to Firebase auth state and handle redirects
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      try {
        // Since we are using standard Email/Auth, we don't need a redirect result check.
        // It will just initialize instantly via onAuthStateChanged below.
      } catch (error) {
        console.error("Auth init error:", error);
      }

      // 2. Set up the long-running auth listener
      const unsub = onAuthChange((firebaseUser) => {
        if (!mounted) return;
        setUser(firebaseUser);
        if (firebaseUser?.photoURL) setAvatar(firebaseUser.photoURL);
        setAuthChecked(true);
      });

      return unsub;
    }

    const initPromise = initAuth();

    return () => {
      mounted = false;
      initPromise.then(unsub => unsub?.());
    };
  }, []);

  const handleLogout = async () => {
    await logoutFirebase();
    setAvatar(null);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 200; canvas.height = 200;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const size = Math.min(img.width, img.height);
        ctx.drawImage(img, (img.width - size) / 2, (img.height - size) / 2, size, size, 0, 0, 200, 200);
        const base64 = canvas.toDataURL('image/jpeg', 0.85);
        setAvatar(base64);
        localStorage.setItem('paystop_avatar', base64);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Avoid flash before auth resolves and initial cloud data loads
  if (!authChecked || (user && subsLoading)) {
    console.log("App: Showing loading spinner", { authChecked, user: !!user, subsLoading });
    return (
      <div style={{ 
        display: 'flex', 
        height: '100vh', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#0d1519'
      }}>
        <div className="login-spinner" style={{ 
          width: '40px',
          height: '40px',
          border: '4px solid rgba(60,229,126,0.1)', 
          borderTopColor: '#3ce57e',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
      </div>
    );
  }

  if (!user) return <LoginPage />;

  const displayName = user.displayName ?? user.email?.split('@')[0] ?? 'Usuario';
  const photoUrl = avatar ?? user.photoURL ?? null;

  return (
    <>
      <header className="app-header">
        {/* Avatar – if Google user, show their photo; else show upload */}
        <label htmlFor="avatar-input" className="avatar-wrapper">
          {photoUrl ? (
            <img src={photoUrl} alt="Tu foto" className="avatar-img" referrerPolicy="no-referrer" />
          ) : (
            <div className="avatar-placeholder">
              <UserRound size={26} />
            </div>
          )}
          <div className="avatar-badge"><Camera size={11} /></div>
          <input
            id="avatar-input"
            type="file"
            accept="image/*"
            capture="user"
            className="hidden-input"
            onChange={handleAvatarChange}
          />
        </label>

        {/* Title – center */}
        <div className="app-title-block">
          <div className="app-logo-row">
            <img src="/logo.png" alt="PayStop Logo" className="app-logo-img" />
            <span className="app-title">Pay<span className="app-title-accent">Stop</span></span>
          </div>
          <p className="app-subtitle">Hola, {displayName.split(' ')[0]} 👋</p>
        </div>

        {/* Logout – right */}
        <button onClick={handleLogout} className="btn-logout" title="Cerrar sesión">
          <LogOut size={18} />
        </button>
      </header>

      <main className="flex flex-col gap-6 flex-1">
        <Dashboard subscriptions={subscriptions} />
        <SubscriptionList subscriptions={subscriptions} onRemove={removeSubscription} />
      </main>

      <AddSubscriptionForm onAdd={addSubscription} />
    </>
  );
}

export default App;
