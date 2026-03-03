export const storage = {
  // Set item
  set: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('Error setting localStorage:', error);
    }
  },
};
export const storage = {
  // ... anterior
  // Get item
  get: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Error getting localStorage:', error);
      return null;
    }
  },
};