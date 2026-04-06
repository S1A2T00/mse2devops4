// Mock data for goals - in production, this would be a real API
const mockGoals = [
  {
    id: 1,
    title: 'Run 5K',
    description: 'Complete a 5K run in under 25 minutes',
    category: 'fitness',
    progress: 75,
    completed: false,
    target: 5,
    current: 3.75,
    unit: 'km',
    dueDate: '2026-04-15',
    createdAt: new Date('2026-03-01'),
  },
  {
    id: 2,
    title: 'Read 3 Books',
    description: 'Read and finish 3 books this month',
    category: 'learning',
    progress: 33,
    completed: false,
    target: 3,
    current: 1,
    unit: 'books',
    dueDate: '2026-04-30',
    createdAt: new Date('2026-03-05'),
  },
  {
    id: 3,
    title: 'Gym 20 Days',
    description: 'Visit gym 20 times this month',
    category: 'fitness',
    progress: 100,
    completed: true,
    target: 20,
    current: 20,
    unit: 'days',
    dueDate: '2026-03-31',
    createdAt: new Date('2026-03-01'),
  },
];

let goalsData = JSON.parse(localStorage.getItem('goals')) || mockGoals;
let actions = JSON.parse(localStorage.getItem('actions')) || [];

// Fetch all goals
export const fetchGoals = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...goalsData]);
    }, 300);
  });
};

// Create new goal
export const createGoal = async (goalData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const newGoal = {
          id: Date.now(),
          ...goalData,
          progress: 0,
          completed: false,
          current: 0,
          createdAt: new Date(),
        };
        goalsData.push(newGoal);
        localStorage.setItem('goals', JSON.stringify(goalsData));

        // Add action
        addAction(`Created goal: "${goalData.title}"`);

        resolve(newGoal);
      } catch (error) {
        reject(error);
      }
    }, 300);
  });
};

// Update goal
export const updateGoal = async (id, updatedData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = goalsData.findIndex((g) => g.id === id);
      if (index !== -1) {
        goalsData[index] = { ...goalsData[index], ...updatedData };
        localStorage.setItem('goals', JSON.stringify(goalsData));
        resolve(goalsData[index]);
      }
    }, 300);
  });
};

// Mark goal as complete
export const completeGoal = async (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const goal = goalsData.find((g) => g.id === id);
      if (goal) {
        goal.completed = true;
        goal.progress = 100;
        goal.current = goal.target;
        localStorage.setItem('goals', JSON.stringify(goalsData));
        addAction(`Completed goal: "${goal.title}"`);
        resolve(goal);
      }
    }, 300);
  });
};

// Delete goal
export const deleteGoal = async (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const goal = goalsData.find((g) => g.id === id);
        if (goal) {
          addAction(`Deleted goal: "${goal.title}"`);
        }
        goalsData = goalsData.filter((g) => g.id !== id);
        localStorage.setItem('goals', JSON.stringify(goalsData));
        resolve(goal || null);
      } catch (error) {
        reject(error);
      }
    }, 300);
  });
};

// Update goal progress
export const updateProgress = async (id, progress) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const goal = goalsData.find((g) => g.id === id);
      if (goal) {
        const oldProgress = goal.progress;
        goal.progress = Math.min(progress, 100);
        goal.current = (goal.target * goal.progress) / 100;
        
        if (goal.progress === 100 && oldProgress < 100) {
          goal.completed = true;
          addAction(`Completed goal: "${goal.title}"`);
        } else {
          addAction(`Updated goal "${goal.title}" to ${goal.progress}%`);
        }
        
        localStorage.setItem('goals', JSON.stringify(goalsData));
        resolve(goal);
      }
    }, 300);
  });
};

// Get actions/activity feed
export const getActions = () => {
  return actions;
};

// Add action to feed
const addAction = (message) => {
  const action = {
    id: Date.now(),
    message,
    timestamp: new Date(),
  };
  actions.unshift(action);
  // Keep only last 50 actions
  if (actions.length > 50) {
    actions = actions.slice(0, 50);
  }
  localStorage.setItem('actions', JSON.stringify(actions));
};

// Clear all actions
export const clearActions = () => {
  actions = [];
  localStorage.setItem('actions', JSON.stringify(actions));
};
