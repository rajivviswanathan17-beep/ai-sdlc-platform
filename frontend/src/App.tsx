import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';

// Components
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/Auth/ProtectedRoute';

// Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import Projects from './pages/Projects/Projects';
import ProjectDetail from './pages/Projects/ProjectDetail';
import PRDEditor from './pages/PRD/PRDEditor';
import NFRAnalysis from './pages/NFR/NFRAnalysis';
import StoryGeneration from './pages/Stories/StoryGeneration';
import Profile from './pages/Profile/Profile';
import Settings from './pages/Settings/Settings';

// Styles
import './styles/globals.css';

// React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SocketProvider>
          <Router>
            <div className=\"min-h-screen bg-gray-50\">
              <Routes>
                {/* Public routes */}
                <Route path=\"/login\" element={<Login />} />
                <Route path=\"/register\" element={<Register />} />
                
                {/* Protected routes */}
                <Route
                  path=\"/*\"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Routes>
                          <Route path=\"/\" element={<Navigate to=\"/dashboard\" replace />} />
                          <Route path=\"/dashboard\" element={<Dashboard />} />
                          <Route path=\"/projects\" element={<Projects />} />
                          <Route path=\"/projects/:id\" element={<ProjectDetail />} />
                          <Route path=\"/projects/:id/prd\" element={<PRDEditor />} />
                          <Route path=\"/projects/:id/nfr\" element={<NFRAnalysis />} />
                          <Route path=\"/projects/:id/stories\" element={<StoryGeneration />} />
                          <Route path=\"/profile\" element={<Profile />} />
                          <Route path=\"/settings\" element={<Settings />} />
                        </Routes>
                      </Layout>
                    </ProtectedRoute>
                  }
                />
              </Routes>
              
              {/* Global toast notifications */}
              <Toaster 
                position=\"top-right\"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                  success: {
                    style: {
                      background: '#10b981',
                    },
                  },
                  error: {
                    style: {
                      background: '#ef4444',
                    },
                  },
                }}
              />
            </div>
          </Router>
        </SocketProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;