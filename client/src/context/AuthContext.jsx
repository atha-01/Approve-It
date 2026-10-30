
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  loginUser as loginUserRequest,
  getCurrentUser,
} from "../services/authService";

const AuthContext = createContext(null);

const TOKEN_KEY = "approveit-token";
const USER_KEY = "approveit-user";

function readSavedSession() {
  try {
    return {
      token: sessionStorage.getItem(TOKEN_KEY),
      user: JSON.parse(sessionStorage.getItem(USER_KEY) || "null"),
    };
  } catch {
    return { token: null, user: null };
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readSavedSession);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  const logout = useCallback(() => {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    setSession({ token: null, user: null });
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function validateSavedSession() {
      const { token, user } = readSavedSession();

      if (!token || !user) {
        if (!cancelled) {
          setSession({ token: null, user: null });
          setIsCheckingSession(false);
        }
        return;
      }

      try {
        // /me verifies the JWT. Its response contains userId and role.
        const verifiedUser = await getCurrentUser(token);

        if (cancelled) return;

        const currentUser = {
          ...user,
          id: verifiedUser.userId,
          role: verifiedUser.role,
        };

        sessionStorage.setItem(USER_KEY, JSON.stringify(currentUser));
        setSession({ token, user: currentUser });
      } catch {
        if (!cancelled) {
          logout();
        }
      } finally {
        if (!cancelled) {
          setIsCheckingSession(false);
        }
      }
    }

    validateSavedSession();

    return () => {
      cancelled = true;
    };
  }, [logout]);

  const login = useCallback(async ({ email, password, role }) => {
    const result = await loginUserRequest({
        email,
        password,
        role,
    });

    // Only save a session after the backend accepts the credentials.
    sessionStorage.setItem(TOKEN_KEY, result.token);
    sessionStorage.setItem(USER_KEY, JSON.stringify(result.user));

    setSession({
      token: result.token,
      user: result.user,
    });

    return result.user;
  }, []);

  const value = {
    user: session.user,
    token: session.token,
    isAuthenticated: Boolean(session.token && session.user),
    isCheckingSession,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}
