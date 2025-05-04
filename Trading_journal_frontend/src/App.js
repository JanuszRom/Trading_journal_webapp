import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import TradeList from './components/TradeList';
import AddTrade from './pages/AddTrade';
import EditTrade from './pages/EditTrade';
import 'bootstrap/dist/css/bootstrap.min.css';
import TradeDetails from './pages/TradeDetails';
import TradeListPage from './pages/TradeListPage';
import AnalyticsPage from './pages/AnalyticsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <>
            <Navigation />
            <Dashboard />
          </>
        } />
        <Route path="/trades" element={
          <>
            <Navigation />
            <TradeListPage />
          </>
        } />
        <Route path="/trades/add" element={
          <>
            <Navigation />
            <AddTrade />
          </>
        } />
        <Route path="/trades/edit/:id" element={
          <>
            <Navigation />
            <EditTrade />
          </>
        }/>
        <Route path="/trade/:id" element={  // 👈 NEW
          <>
            <Navigation />
            <TradeDetails />
          </>
        } />
        <Route path="/analytics" element={
          <>
            <Navigation />
            <AnalyticsPage />
          </>
        } />
      </Routes>     
    </Router>
  );
}

export default App;