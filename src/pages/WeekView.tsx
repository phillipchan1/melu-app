import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Clock, Tag } from 'lucide-react';
import './WeekView.css';

const WeekView = () => {
  const navigate = useNavigate();
  const { currentWeek } = useStore();
  const [synced, setSynced] = useState(false);

  const handleSyncCalendar = () => {
    // Simulate sync
    setSynced(true);
    setTimeout(() => {
      navigate('/');
    }, 1500);
  };

  if (synced) {
    return (
      <div className="week-view synced">
        <div className="success-message">
          ✓ Synced to Google Calendar
        </div>
      </div>
    );
  }

  return (
    <div className="week-view">
      <h1>Your week, sorted.</h1>
      <p className="subtitle">{currentWeek.length} dinners, ready to go.</p>

      <div className="meals-detail-list">
        {currentWeek.map((meal, idx) => (
          <div key={idx} className="meal-detail-card">
            <div className="meal-header">
              <span className="day">{meal.day}</span>
              <h2>{meal.name}</h2>
            </div>
            <div className="meal-meta">
              <span className="time">
                <Clock size={16} /> {meal.time} min
              </span>
              <span className="cuisine">
                <Tag size={16} /> {meal.cuisine}
              </span>
            </div>
            <p className="ingredients">
              {meal.ingredients.join(', ')}
            </p>
          </div>
        ))}
      </div>

      <button className="sync-btn" onClick={handleSyncCalendar}>
        Looks good — sync to calendar
      </button>

      <button className="back-btn" onClick={() => navigate('/')}>
        ← Back
      </button>
    </div>
  );
};

export default WeekView;
