import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../lib/firebase';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut as firebaseSignOut, 
    onAuthStateChanged,
    GithubAuthProvider,
    signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                // Fetch additional user profile data from Firestore
                const docRef = doc(db, 'profiles', currentUser.uid);
                const docSnap = await getDoc(docRef);
                
                if (docSnap.exists()) {
                    setUser({ ...currentUser, profile: docSnap.data() });
                } else {
                    setUser(currentUser);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const value = {
        signUp: async ({ email, password, options }) => {
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                
                // Create user profile document mimicking handle_new_user trigger
                await setDoc(doc(db, 'profiles', user.uid), {
                    id: user.uid,
                    username: options?.data?.username || email.split('@')[0],
                    skills: options?.data?.skills || [],
                    total_points: 0,
                    reviews_completed: 0,
                    bugs_found: 0,
                    optimizations_suggested: 0
                });
                return { data: { user }, error: null };
            } catch (error) {
                return { data: null, error };
            }
        },
        signIn: async ({ email, password }) => {
            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                return { data: { user: userCredential.user }, error: null };
            } catch (error) {
                return { data: null, error };
            }
        },
        signInWithGithub: async () => {
            try {
                const provider = new GithubAuthProvider();
                const userCredential = await signInWithPopup(auth, provider);
                const user = userCredential.user;
                
                const docRef = doc(db, 'profiles', user.uid);
                const docSnap = await getDoc(docRef);

                if (!docSnap.exists()) {
                    await setDoc(docRef, {
                        id: user.uid,
                        username: user.displayName || user.email?.split('@')[0] || 'github_user',
                        skills: [],
                        total_points: 0,
                        reviews_completed: 0,
                        bugs_found: 0,
                        optimizations_suggested: 0
                    });
                }
                return { data: { user }, error: null };
            } catch (error) {
                return { data: null, error };
            }
        },
        signOut: async () => {
            try {
                await firebaseSignOut(auth);
                return { error: null };
            } catch (error) {
                return { error };
            }
        },
        user,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
