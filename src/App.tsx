import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StoreProvider, useStore } from './lib/store';
import { AppLayout } from './components/layout/AppLayout';
import { HomePage } from './pages/HomePage';
import { DiscoverPage } from './pages/DiscoverPage';
import { IdeaDetailPage } from './pages/IdeaDetailPage';
import { BookLibraryPage } from './pages/BookLibraryPage';
import { BookDetailPage } from './pages/BookDetailPage';
import { StashPage } from './pages/StashPage';
import { StashDetailPage } from './pages/StashDetailPage';
import { SearchPage } from './pages/SearchPage';
import { ProfilePage } from './pages/ProfilePage';
import { AuthPage } from './pages/AuthPage';
import { NotFoundPage } from './pages/NotFoundPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />

      {/* Main Layout Protected Routes */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/discover" element={<DiscoverPage />} />
        <Route path="/idea/:id" element={<IdeaDetailPage />} />
        <Route path="/books" element={<BookLibraryPage />} />
        <Route path="/book/:id" element={<BookDetailPage />} />
        <Route path="/stash" element={<StashPage />} />
        <Route path="/stash/:id" element={<StashDetailPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </StoreProvider>
    </QueryClientProvider>
  );
};

export default App;
