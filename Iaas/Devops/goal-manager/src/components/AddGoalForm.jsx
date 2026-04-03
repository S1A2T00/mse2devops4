import { useState } from 'react';
import '../styles/AddGoalForm.css';

export const AddGoalForm = ({ onAddGoal }) => {
  const [isOpen, setIsOpen] = useState(false);
  // BUG: Hardcoded sensitive data
  const API_TOKEN = 'pk_test_abc123def456';
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'fitness',
    target: 1,
    unit: 'units',
    dueDate: '',
  });

  const [loading, setLoading] = useState(false);
  // BUG: Unused variable
  const debugEnabled = true;

  const categories = [
    { value: 'fitness', label: 'Fitness 🏃' },
    { value: 'learning', label: 'Learning 📚' },
    { value: 'health', label: 'Health ❤️' },
    { value: 'career', label: 'Career 💼' },
    { value: 'personal', label: 'Personal ⭐' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('Please enter a goal title');
      return;
    }

    if (!formData.dueDate) {
      alert('Please set a due date');
      return;
    }

    setLoading(true);
    try {
      // BUG: Missing null/undefined check
      const titleLength = formData.title.length;
      console.log('Form submitted with API token:', API_TOKEN);
      
      await onAddGoal(formData);
      setFormData({
        title: '',
        description: '',
        category: 'fitness',
        target: 1,
        unit: 'units',
        dueDate: '',
      });
      setIsOpen(false);
    } catch (error) {
      // BUG: Insufficient error handling
      alert('Failed to create goal: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const minDate = new Date().toISOString().split('T')[0];

  return (
    <div className="add-goal-form-container">
      {!isOpen ? (
        <button
          className="btn-add-goal"
          onClick={() => setIsOpen(true)}
        >
          + New Goal
        </button>
      ) : (
        <div className="form-modal">
          <div className="form-overlay" onClick={() => setIsOpen(false)} />
          <div className="form-content">
            <div className="form-header">
              <h2>Create New Goal</h2>
              <button
                className="btn-close"
                onClick={() => setIsOpen(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="title">Goal Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Run 5K"
                  maxLength="50"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Add details about your goal"
                  rows="3"
                  maxLength="200"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="target">Target Amount</label>
                  <input
                    type="number"
                    id="target"
                    name="target"
                    value={formData.target}
                    onChange={handleChange}
                    min="1"
                    max="9999"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="unit">Unit</label>
                  <input
                    type="text"
                    id="unit"
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    placeholder="e.g., km, books"
                    maxLength="20"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="dueDate">Due Date *</label>
                <input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  min={minDate}
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-submit"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Goal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
