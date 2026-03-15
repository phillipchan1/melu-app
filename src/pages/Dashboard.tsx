import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Calendar, ShoppingBag } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentWeek } = useStore();

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Good morning, Phil.</h1>
          <p>This week's plan is set.</p>
        </div>
        <div className="profile-avatar">P</div>
      </div>

      {/* Weekly Meal Plan */}
      <div className="week-section">
        <h3>THIS WEEK</h3>
        <div className="meals-list">
          {currentWeek.map((meal, idx) => (
            <div key={idx} className="meal-item">
              <span className="day">{meal.day.slice(0, 3)}</span>
              <span className="meal-name">{meal.name}</span>
            </div>
          ))}
        </div>
        <button className="view-full-link" onClick={() => navigate('/week')}>
          View full plan →
        </button>
      </div>

      <p className="next-plan-text">Next plan generates Sunday.</p>

      {/* CTA Buttons */}
      <button className="cta-btn" onClick={() => navigate('/grocery')}>
        See this week's groceries
      </button>

      {/* Bottom Navigation */}
      <div className="bottom-nav">
        <button className="nav-btn active" onClick={() => navigate('/')}>
          <Calendar size={24} />
          <span>Plan</span>
        </button>
        <button className="nav-btn" onClick={() => navigate('/grocery')}>
          <ShoppingBag size={24} />
          <span>Grocery</span>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
