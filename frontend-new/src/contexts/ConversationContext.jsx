import React, { createContext, useContext, useState, useCallback } from "react";

const ConversationContext = createContext();

export const useConversation = () => {
  const context = useContext(ConversationContext);
  if (!context) {
    throw new Error("useConversation must be used within a ConversationProvider");
  }
  return context;
};

export const ConversationProvider = ({ children }) => {
  const [currentSession, setCurrentSession] = useState(null);
  const [sessionHistory, setSessionHistory] = useState([]);
  const [isAgent, setIsAgent] = useState(false);

  const startSession = useCallback((sessionData) => {
    const session = {
      id: sessionData.sessionId,
      sessionId: sessionData.sessionId,
      token: sessionData.token,
      customerName: sessionData.customerName,
      customerEmail: sessionData.customerEmail,
      customerUrl: sessionData.customerUrl, // Add customerUrl to session state
      startTime: new Date().toISOString(),
      status: "active",
    };

    setCurrentSession(session);
    setSessionHistory(prev => [session, ...prev]);
    setIsAgent(true);
  }, []);

  const joinSession = useCallback((sessionData) => {
    const session = {
      id: sessionData.sessionId,
      sessionId: sessionData.sessionId,
      token: sessionData.token,
      startTime: new Date().toISOString(),
      status: "active",
    };

    setCurrentSession(session);
    setIsAgent(false);
  }, []);

  const endSession = useCallback(() => {
    if (currentSession) {
      setCurrentSession(prev => ({
        ...prev,
        status: "ended",
        endTime: new Date().toISOString(),
      }));
      
      // Update session history
      setSessionHistory(prev => 
        prev.map(session => 
          session.id === currentSession.id 
            ? { ...session, status: "ended", endTime: new Date().toISOString() }
            : session
        )
      );
    }
    
    setCurrentSession(null);
    setIsAgent(false);
  }, [currentSession]);

  const getSessionDuration = useCallback((session) => {
    if (!session.startTime) return "0 min";
    
    const start = new Date(session.startTime);
    const end = session.endTime ? new Date(session.endTime) : new Date();
    const durationMs = end - start;
    const minutes = Math.floor(durationMs / 60000);
    
    if (minutes < 1) return "< 1 min";
    if (minutes < 60) return `${minutes} min`;
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  }, []);

  const getActiveSessions = useCallback(() => {
    return sessionHistory.filter(session => session.status === "active");
  }, [sessionHistory]);

  const getCompletedSessions = useCallback(() => {
    return sessionHistory.filter(session => session.status === "ended");
  }, [sessionHistory]);

  const value = {
    // State
    currentSession,
    sessionHistory,
    isAgent,
    
    // Actions
    startSession,
    joinSession,
    endSession,
    
    // Helpers
    getSessionDuration,
    getActiveSessions,
    getCompletedSessions,
  };

  return (
    <ConversationContext.Provider value={value}>
      {children}
    </ConversationContext.Provider>
  );
};
