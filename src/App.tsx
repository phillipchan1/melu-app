import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useStore } from './store';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import WeekView from './pages/WeekView';
import GroceryList from './pages/GroceryList';
import './App.css';

function App() {
  const { isOnboarded } = useStore();

  return (
    <Router>
      <Routes>
        {!isOnboarded ? (
          <Route path="*" element={<Onboarding />} />
        ) : (
          <>
            <Route path="/" element={<Dashboard />} />
            <Route path="/week" element={<WeekView />} />
            <Route path="/grocery" element={<GroceryList />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
