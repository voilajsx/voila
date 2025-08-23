import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { EchoPage } from './echo.page';

export const EchoRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<EchoPage />} />
      <Route path="/:message" element={<EchoPage />} />
    </Routes>
  );
};