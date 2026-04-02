export const CUISINE_ADJACENCY: Record<string, string[]> = {
  Mexican: ['Thai', 'Vietnamese', 'Korean', 'Peruvian'],
  Italian: ['French', 'Spanish', 'Greek', 'Moroccan'],
  American: ['BBQ', 'Southern', 'Mexican', 'Italian'],
  Asian: ['Japanese', 'Korean', 'Thai', 'Vietnamese', 'Indian', 'Chinese', 'Southeast Asian'],
  Mediterranean: ['Greek', 'Turkish', 'Moroccan', 'Lebanese', 'Middle Eastern'],
  Indian: ['Thai', 'Moroccan', 'Persian', 'Sri Lankan'],
  French: ['Italian', 'Spanish', 'Moroccan', 'Greek'],
  Chinese: ['Japanese', 'Korean', 'Thai', 'Vietnamese'],
  Japanese: ['Chinese', 'Korean', 'Thai', 'Asian'],
  Korean: ['Japanese', 'Chinese', 'Asian', 'Thai'],
  'Southeast Asian': ['Thai', 'Vietnamese', 'Chinese', 'Indian', 'Asian'],
  'Middle Eastern': ['Mediterranean', 'Indian', 'Greek', 'Moroccan'],
};
