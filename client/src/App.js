import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import ColorControl from './pages/ColorControl'; 
import Results from './pages/Results'; 


function App() {
  return (
    <Router basename="/color">
      <Routes>
        <Route path="/" element={<ColorControl />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </Router>
    
  );
}

export default App;
