import { useNavigate } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing">
      <div className="landing-container">
        <h2 className="landing-logo">melu</h2>

        <h1 className="landing-title">
          Dinner, planned. Every week. In 60 seconds.
        </h1>

        <p className="landing-description">
          To plan for you, Melu needs to know your family — who you're feeding, what you love, and what's off the table. It takes about 2 minutes. You'll never need to do it again.
        </p>

        <button
          className="landing-cta"
          onClick={() => navigate('/onboarding')}
        >
          Let's get started
        </button>

        <p className="landing-footer">
          No account needed to try it.
        </p>
      </div>
    </div>
  );
};

export default Landing;
