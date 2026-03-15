import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { ShoppingBag } from 'lucide-react';
import './GroceryList.css';

const GroceryList = () => {
  const navigate = useNavigate();
  const { currentWeek } = useStore();

  // Aggregate ingredients into categories
  const groceryByCategory = {
    Produce: ['zucchini', 'bell peppers', 'tomatoes', 'broccoli', 'lettuce', 'potatoes', 'green beans', 'basil'],
    Proteins: ['Chicken', 'Ground beef', 'Salmon'],
    Dairy: ['cheddar', 'tortillas'],
    Pantry: ['lemon', 'teriyaki sauce', 'rice', 'sesame', 'BBQ sauce', 'garlic', 'olive oil', 'pasta'],
  };

  return (
    <div className="grocery-list">
      <div className="grocery-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          ←
        </button>
        <h1>This Week's Groceries</h1>
        <ShoppingBag size={24} />
      </div>

      <p className="grocery-subtitle">Everything you need for {currentWeek.length} dinners</p>

      <div className="grocery-categories">
        {Object.entries(groceryByCategory).map(([category, items]) => (
          <div key={category} className="category">
            <h3>{category}</h3>
            <ul className="items-list">
              {items.map((item, idx) => (
                <li key={idx}>
                  <input type="checkbox" id={`${category}-${idx}`} />
                  <label htmlFor={`${category}-${idx}`}>{item}</label>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="grocery-footer">
        <p>Print list or share with family</p>
      </div>
    </div>
  );
};

export default GroceryList;
