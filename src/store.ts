import { create } from 'zustand';

export interface Message {
  id: string;
  type: 'user' | 'melu';
  content: string;
  options?: string[];
}

export interface FamilyProfile {
  name: string;
  familySize: number;
  kidsAges: number[];
  restrictions: string[];
  cookingTime: string;
}

export interface Meal {
  day: string;
  name: string;
  time: number;
  cuisine: string;
  ingredients: string[];
}

interface Store {
  // Onboarding
  isOnboarded: boolean;
  currentStep: number;
  messages: Message[];
  familyProfile: FamilyProfile | null;
  addMessage: (message: Message) => void;
  setOnboarded: (value: boolean) => void;
  setCurrentStep: (step: number) => void;
  setFamilyProfile: (profile: FamilyProfile) => void;
  
  // Meal plan
  currentWeek: Meal[];
  setCurrentWeek: (meals: Meal[]) => void;
  
  // Feedback
  addMealRating: (day: string, rating: number) => void;
}

export const useStore = create<Store>((set) => ({
  // Onboarding
  isOnboarded: false,
  currentStep: 1,
  messages: [
    {
      id: '1',
      type: 'melu',
      content: "Hey, I'm Melu. I'm going to learn your family so every plan I make actually fits your life — not just this week, but every week. This takes about 2 minutes and you'll only do it once.",
    },
    {
      id: '2',
      type: 'melu',
      content: 'How many people are you cooking for, and how old are the kids?',
    },
  ],
  familyProfile: null,
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
  setOnboarded: (value) => set({ isOnboarded: value }),
  setCurrentStep: (step) => set({ currentStep: step }),
  setFamilyProfile: (profile) => set({ familyProfile: profile }),

  // Meal plan
  currentWeek: [
    {
      day: 'MONDAY',
      name: 'Sheet Pan Lemon Chicken',
      time: 30,
      cuisine: 'American',
      ingredients: ['Chicken', 'lemon', 'potatoes', 'green beans', 'garlic'],
    },
    {
      day: 'TUESDAY',
      name: 'Beef Tacos',
      time: 20,
      cuisine: 'Mexican',
      ingredients: ['Ground beef', 'tortillas', 'cheddar', 'lettuce', 'tomato'],
    },
    {
      day: 'WEDNESDAY',
      name: 'Pasta Primavera',
      time: 25,
      cuisine: 'Italian',
      ingredients: ['Pasta', 'zucchini', 'bell peppers', 'tomatoes', 'basil'],
    },
    {
      day: 'THURSDAY',
      name: 'Teriyaki Salmon',
      time: 25,
      cuisine: 'Asian',
      ingredients: ['Salmon', 'teriyaki sauce', 'rice', 'broccoli', 'sesame'],
    },
    {
      day: 'FRIDAY',
      name: 'BBQ Chicken Quesadillas',
      time: 20,
      cuisine: 'American',
      ingredients: ['Chicken', 'tortillas', 'cheddar', 'BBQ sauce', 'green onion'],
    },
  ],
  setCurrentWeek: (meals) => set({ currentWeek: meals }),
  
  addMealRating: (_day, _rating) => set((state) => {
    // Store rating logic would go here
    return state;
  }),
}));
