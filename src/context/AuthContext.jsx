import { createContext, useContext, useMemo, useState } from 'react';
import { STORAGE_KEYS, readJson, writeJson } from './storageUtils';

const AuthContext = createContext(null);

const DEFAULT_USERS = [
  {
    id: 'u-demo',
    name: 'Alex Reed',
    email: 'alex@projectflow.local',
    password: 'projectflow',
    role: 'Product Lead'
  }
];

const getStoredUsers = () => readJson(STORAGE_KEYS.authUsers, DEFAULT_USERS);

export const AuthProvider = ({ children }) => {
  const [users, setUsers] = useState(getStoredUsers);
  const [session, setSession] = useState(() => readJson(STORAGE_KEYS.authSession, null));
  const [onboarding, setOnboarding] = useState(() => readJson(STORAGE_KEYS.onboarding, null));

  const currentUser = useMemo(
    () => users.find(user => user.id === session?.userId) || null,
    [users, session]
  );

  const persistUsers = (nextUsers) => {
    setUsers(nextUsers);
    writeJson(STORAGE_KEYS.authUsers, nextUsers);
  };

  const login = ({ email, password }) => {
    const user = users.find(candidate => (
      candidate.email.toLowerCase() === email.trim().toLowerCase() &&
      candidate.password === password
    ));

    if (!user) {
      return { ok: false, message: 'Email or password does not match.' };
    }

    const nextSession = { userId: user.id, createdAt: new Date().toISOString() };
    setSession(nextSession);
    writeJson(STORAGE_KEYS.authSession, nextSession);
    return { ok: true, user };
  };

  const signup = ({ name, email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();
    if (users.some(user => user.email.toLowerCase() === normalizedEmail)) {
      return { ok: false, message: 'An account already exists for this email.' };
    }

    const user = {
      id: `u-${Date.now()}`,
      name: name.trim() || 'ProjectFlow User',
      email: normalizedEmail,
      password,
      role: 'Workspace Member'
    };
    persistUsers([...users, user]);

    const nextSession = { userId: user.id, createdAt: new Date().toISOString() };
    setSession(nextSession);
    writeJson(STORAGE_KEYS.authSession, nextSession);
    return { ok: true, user };
  };

  const logout = () => {
    setSession(null);
    localStorage.removeItem(STORAGE_KEYS.authSession);
  };

  const completeOnboarding = (answers) => {
    const nextOnboarding = {
      completed: true,
      answers,
      completedAt: new Date().toISOString()
    };
    setOnboarding(nextOnboarding);
    writeJson(STORAGE_KEYS.onboarding, nextOnboarding);
  };

  const value = {
    users,
    currentUser,
    isAuthenticated: Boolean(currentUser),
    onboarding,
    onboardingComplete: Boolean(onboarding?.completed),
    login,
    signup,
    logout,
    completeOnboarding
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
