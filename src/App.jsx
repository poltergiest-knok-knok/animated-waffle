import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import your components based on your file structure
import Jet from './Components/Jet.jsx';
import Dark from './Components/Dark.jsx';
import Web from './Components/Web/Web.jsx';
import Video from './Components/Video/Video.jsx';
import Thumbnail from './Components/Thumbnail/Thumbnail.jsx';

export default function App() {
  return (
    // 1. Wrap your application with the Router
    <Router>
      <div className="App">
        {/* 2. Define the Routes */}
        <Routes>
          {/* Route for the home page, rendering the Jet component */}
          <Route path="/" element={<Jet />} />

          {/* Route for the '/dark' path, rendering the Dark component */}
          <Route path="/dark" element={<Dark />} />

          {/* Route for the '/web' path, rendering the Web component */}
          <Route path="/web" element={<Web />} />

          {/* Route for the '/video' path, rendering the Video component */}
          <Route path="/video" element={<Video />} />

          {/* Route for the '/thumbnail' path, rendering the Thumbnail component */}
          <Route path="/thumbnail" element={<Thumbnail />} />
        </Routes>
      </div>
    </Router>
  );
}

