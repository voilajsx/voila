import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { HelloPage } from './hello.page';

export const HelloRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HelloPage />} />
      <Route path="/:name" element={<HelloPage />} />
    </Routes>
  );
};