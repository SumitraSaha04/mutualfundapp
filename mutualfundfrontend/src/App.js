import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import FundSearch from './pages/FundSearch';
import FundDetails from './pages/FundDetails';
import SavedFunds from './pages/SavedFunds';
import Navbar from './components/Navbar'; // ✅ only once

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />

        <Route path="/fund-search" element={<FundSearch />} />
        <Route path="/fund-details/:id" element={<FundDetails />} />
        <Route path="/saved-funds" element={<SavedFunds />} />
        <Route path="*" element={<Navigate to="/fund-search" />} />
      </Routes>
    </Router>
  );
}

export default App;
