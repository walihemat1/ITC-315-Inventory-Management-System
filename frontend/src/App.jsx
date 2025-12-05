import './App.css'

import Dashboard from './pages/Dashboard';
import ProductsPage from './pages/Products';
import PurchasesPage from './pages/Purchases';


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
      <Router>
        <Routes>
          <Route
            path="/Dashboard"
            element={<Dashboard />}
          />
          <Route
            path="/products"
            element={<ProductsPage />}
          />

          <Route
            path="/purchases"
            element= {<PurchasesPage />}
          />
        

        </Routes>
      </Router>
  );
}

export default App;


