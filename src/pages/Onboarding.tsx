import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Message } from '../store';
import { useStore } from '../store';
import { Send } from 'lucide-react';
import './Onboarding.css';

const Onboarding = () => {
  const navigate = useNavigate();
  const { messages, addMessage, setOnboarded } = useStore();
  const [input, setInput] = useState('');
  const [step, setStep] = useState(2); // Currently on step 2 of 4

  const handleSendMessage = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
    };
    addMessage(userMessage);

    // Simulate Melu response
    setTimeout(() => {
      let meluResponse: Message;

      if (step === 2) {
        meluResponse = {
          id: (Date.now() + 1).toString(),
          type: 'melu',
          content: 'Got it. Any foods that are completely off the table? Allergies, strong dislikes, anything the kids refuse?',
        };
        setStep(3);
      } else if (step === 3) {
        meluResponse = {
          id: (Date.now() + 1).toString(),
          type: 'melu',
          content: "Noted — I'll keep everything mild and shellfish-free. On a typical weeknight, how much time do you actually have to cook?",
        };
        setStep(3.5);
      } else if (step === 3.5) {
        meluResponse = {
          id: (Date.now() + 1).toString(),
          type: 'melu',
          content: "Perfect. You're all set! I'm learning your family. Your first plan will be ready Sunday.",
        };
        // Complete onboarding
        setTimeout(() => {
          setOnboarded(true);
          navigate('/');
        }, 1500);
        setStep(4);
      } else {
        meluResponse = {
          id: (Date.now() + 1).toString(),
          type: 'melu',
          content: 'Thanks for the info!',
        };
      }

      addMessage(meluResponse);
    }, 500);

    setInput('');
  };

  const handleOptionClick = (option: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: option,
    };
    addMessage(userMessage);

    // Next step
    if (step === 3.5) {
      const meluResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'melu',
        content: "Perfect. You're all set! I'm learning your family. Your first plan will be ready Sunday.",
      };
      addMessage(meluResponse);
      setTimeout(() => {
        setOnboarded(true);
        navigate('/');
      }, 1500);
      setStep(4);
    }

    setInput('');
  };

  return (
    <div className="onboarding">
      <div className="onboarding-header">
        <h1>melu</h1>
        <p>Step {step} of 4</p>
      </div>

      <div className="chat-container">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.type}`}>
            {msg.content}
          </div>
        ))}

        {step === 3.5 && (
          <div className="options">
            <button
              className="option-btn"
              onClick={() => handleOptionClick('Under 30 min — keep it quick')}
            >
              Under 30 min — keep it quick
            </button>
            <button
              className="option-btn"
              onClick={() => handleOptionClick('30–45 min — I can manage')}
            >
              30–45 min — I can manage
            </button>
            <button
              className="option-btn"
              onClick={() => handleOptionClick('45 min+ — I like to cook')}
            >
              45 min+ — I like to cook
            </button>
          </div>
        )}
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button onClick={handleSendMessage} className="send-btn">
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
