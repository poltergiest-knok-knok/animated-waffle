import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import your components based on your file structure
import Jet from './Components/Jet.jsx';
import Dark from './Components/Dark.jsx';

export default function App() {
  return (
    // 1. Wrap your application with the Router
    <Router>
      <div className="App">
        {/* 2. Define the Routes */}
        <Routes>
          {/* Route for the home page, rendering the Jet component */}
          <Route path="/" element={<Jet />} />

          {/* Route for the '/next' path, rendering the Dark component */}
          <Route path="/dark" element={<Dark />} />
        </Routes>
      </div>
    </Router>
  );
}

