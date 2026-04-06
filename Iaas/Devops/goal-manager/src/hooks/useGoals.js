import { useState, useCallback } from 'react';
import {
  fetchGoals,
  createGoal,
  updateGoal,
  deleteGoal,
  completeGoal,
  updateProgress,
  getActions,
  clearActions,
} from '../api/goalsApi';

export const useGoals = () => {
  const [goals, setGoals] = useState([]);
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load all goals
  const loadGoals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchGoals();
      setGoals(data);
      setActions(getActions());
    } catch (err) {
      setError(err?.message || 'Failed to load goals');
    } finally {
      setLoading(false);
    }
  }, []);

  // Add new goal
  const addGoal = useCallback(async (goalData) => {
    setError(null);
    try {
      const newGoal = await createGoal(goalData);
      setGoals((prev) => [...prev, newGoal]);
      setActions(getActions());
      return newGoal;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Update existing goal
  const updateGoalData = useCallback(async (id, data) => {
    setError(null);
    try {
      const updated = await updateGoal(id, data);
      setGoals((prev) =>
        prev.map((goal) => (goal.id === id ? updated : goal))
      );
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Mark goal as complete
  const markComplete = useCallback(async (id) => {
    setError(null);
    try {
      const completed = await completeGoal(id);
      setGoals((prev) =>
        prev.map((goal) => (goal.id === id ? completed : goal))
      );
      setActions(getActions());
      return completed;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Update progress
  const updateGoalProgress = useCallback(async (id, progress) => {
    setError(null);
    try {
      const updated = await updateProgress(id, progress);
      setGoals((prev) =>
        prev.map((goal) => (goal.id === id ? updated : goal))
      );
      setActions(getActions());
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Remove goal
  const removeGoal = useCallback(async (id) => {
    setError(null);
    try {
      await deleteGoal(id);
      setGoals((prev) => prev.filter((goal) => goal.id !== id));
      setActions(getActions());
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Clear action history
  const clearActionHistory = useCallback(() => {
    clearActions();
    setActions([]);
  }, []);

  return {
    goals,
    actions,
    loading,
    error,
    loadGoals,
    addGoal,
    updateGoalData,
    markComplete,
    updateGoalProgress,
    removeGoal,
    clearActionHistory,
  };
};
