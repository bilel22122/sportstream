import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StreamsProvider } from './context/StreamsContext';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { EventDetailPage } from './pages/EventDetailPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <StreamsProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="event/:id" element={<EventDetailPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </StreamsProvider>
    </BrowserRouter>
  );
};

export default App;
