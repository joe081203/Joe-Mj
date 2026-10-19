import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, signInWithGoogle, logOutUser, isOwnerUser, OWNER_EMAIL } from '../lib/firebase';
import { UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  role: UserRole;
  isAdmin: boolean;
  isDistributor: boolean;
  ownerEmail: string;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  walletAddress: string | null;
  setRole: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  role: 'customer',
  isAdmin: false,
  isDistributor: false,
  ownerEmail: OWNER_EMAIL,
  signIn: async () => {},
  signOut: async () => {},
  walletAddress: null,
  setRole: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRoleState] = useState<UserRole>('customer');
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const isAdmin = isOwnerUser(user);
  const isDistributor = role === 'distributor';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setWalletAddress(`0x${currentUser.uid.slice(0, 4)}...${currentUser.uid.slice(-4)}`);
        
        // Strict verification: Owner email automatically gets admin role
        if (isOwnerUser(currentUser)) {
          setRoleState('admin');
        } else {
          try {
            const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
            if (userDoc.exists() && userDoc.data()?.role) {
              setRoleState(userDoc.data().role as UserRole);
            } else {
              setRoleState('customer');
            }
          } catch (e) {
            setRoleState('customer');
          }
        }
      } else {
        setWalletAddress(null);
        setRoleState('customer');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error('Sign In Error:', err);
      throw err;
    }
  };

  const handleSignOut = async () => {
    try {
      await logOutUser();
    } catch (err) {
      console.error('Sign Out Error:', err);
    }
  };

  const setRole = async (newRole: UserRole) => {
    if (!user) return;
    // Admins always retain admin rights
    if (isAdmin && newRole !== 'admin') {
      // Allow admin to preview distributor/customer view for testing
      setRoleState(newRole);
      return;
    }
    
    setRoleState(newRole);
    try {
      await setDoc(doc(db, 'users', user.uid), { role: newRole }, { merge: true });
    } catch (err) {
      console.error('Failed to sync role to Firestore:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        role: isAdmin ? (role === 'distributor' || role === 'customer' ? role : 'admin') : role,
        isAdmin,
        isDistributor: role === 'distributor',
        ownerEmail: OWNER_EMAIL,
        signIn: handleSignIn,
        signOut: handleSignOut,
        walletAddress,
        setRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
