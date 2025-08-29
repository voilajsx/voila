/**
 * Simple About Page
 * Route: /about
 * Path: main/home/pages/about.tsx (Option 3 fallback)
 */

import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>About Page</h1>
      <p>Route: /about</p>
      <p>File: main/home/pages/about.tsx</p>
      <p>This is Option 3 fallback - no 'about' app exists</p>
      <a href="/" style={{ color: 'blue' }}>← Back to Home</a>
    </div>
  );
};

export default AboutPage;