import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinProject: (projectId: string) => void;
  leaveProject: (projectId: string) => void;
  emitDocumentChange: (data: DocumentChangeData) => void;
  emitCursorPosition: (data: CursorPositionData) => void;
  emitComment: (data: CommentData) => void;
}

interface DocumentChangeData {
  projectId: string;
  documentType: 'prd' | 'nfr' | 'story';
  documentId: string;
  changes: any;
  version: number;
}

interface CursorPositionData {
  projectId: string;
  documentId: string;
  position: {
    line: number;
    column: number;
  };
}

interface CommentData {
  projectId: string;
  documentId: string;
  content: string;
  position?: {
    line: number;
    column: number;
  };
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { token, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && token) {
      const WS_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:3001';
      
      const newSocket = io(WS_URL, {
        auth: {
          token,
        },
        transports: ['websocket', 'polling'],
      });

      newSocket.on('connect', () => {
        console.log('Connected to WebSocket server');
        setIsConnected(true);
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from WebSocket server');
        setIsConnected(false);
      });

      newSocket.on('connect_error', (error) => {
        console.error('WebSocket connection error:', error);
        setIsConnected(false);
      });

      // Real-time collaboration events
      newSocket.on('user-joined', (data) => {
        console.log('User joined project:', data);
        // Handle user joined event (show notification, update UI, etc.)
      });

      newSocket.on('document-change', (data) => {
        console.log('Document change received:', data);
        // Handle real-time document changes
        // This would typically update the editor content
      });

      newSocket.on('cursor-position', (data) => {
        console.log('Cursor position update:', data);
        // Handle real-time cursor positions from other users
      });

      newSocket.on('new-comment', (data) => {
        console.log('New comment received:', data);
        // Handle new comments from other users
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
        setSocket(null);
        setIsConnected(false);
      };
    } else {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
    }
  }, [isAuthenticated, token]);

  const joinProject = (projectId: string) => {
    if (socket && isConnected) {
      socket.emit('join-project', projectId);
    }
  };

  const leaveProject = (projectId: string) => {
    if (socket && isConnected) {
      socket.emit('leave-project', projectId);
    }
  };

  const emitDocumentChange = (data: DocumentChangeData) => {
    if (socket && isConnected) {
      socket.emit('document-change', data);
    }
  };

  const emitCursorPosition = (data: CursorPositionData) => {
    if (socket && isConnected) {
      socket.emit('cursor-position', data);
    }
  };

  const emitComment = (data: CommentData) => {
    if (socket && isConnected) {
      socket.emit('add-comment', data);
    }
  };

  const value: SocketContextType = {
    socket,
    isConnected,
    joinProject,
    leaveProject,
    emitDocumentChange,
    emitCursorPosition,
    emitComment,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};