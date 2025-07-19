import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Test from './pages/test'; // 확장자 .jsx는 생략 가능
import ColorControl from './pages/ColorControl'; 
import Results from './pages/Results'; 


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/test" element={<Test />} />
        <Route path="/color" element={<ColorControl />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </Router>
    
  );
}

export default App;
