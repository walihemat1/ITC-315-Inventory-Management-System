import './App.css'

import Dashboard from './pages/Dashboard';


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
      <Router>
        <Routes>
          <Route
            path="/Dashboard"
            element={<Dashboard />}
          />
        

        </Routes>
      </Router>
  );
}

export default App;


