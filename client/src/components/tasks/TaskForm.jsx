import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Input, { Select, Textarea } from '../common/Input';
import Button from '../common/Button';
import './TaskForm.css';

export default function TaskForm({ isOpen, onClose, onSubmit, task, categories, loading }) {
  const isEdit = !!task;
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    due_date: '',
    category_ids: [],
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'medium',
        due_date: task.due_date || '',
        category_ids: task.categories ? task.categories.map((c) => c.id) : [],
      });
    } else {
      setForm({ title: '', description: '', priority: 'medium', due_date: '', category_ids: [] });
    }
    setErrors({});
  }, [task, isOpen]);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      ...form,
      due_date: form.due_date || null,
    });
  };

  const toggleCategory = (catId) => {
    setForm((prev) => ({
      ...prev,
      category_ids: prev.category_ids.includes(catId)
        ? prev.category_ids.filter((id) => id !== catId)
        : [...prev.category_ids, catId],
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Task' : 'Create Task'}>
      <form className="task-form" onSubmit={handleSubmit}>
        <Input
          label="Title"
          id="task-title"
          placeholder="What needs to be done?"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          error={errors.title}
          required
        />

        <Textarea
          label="Description"
          id="task-description"
          placeholder="Add details (optional)"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={3}
        />

        <div className="task-form-row">
          <Select
            label="Priority"
            id="task-priority"
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value })}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </Select>

          <Input
            label="Due Date"
            id="task-due-date"
            type="date"
            value={form.due_date}
            onChange={(e) => setForm({ ...form, due_date: e.target.value })}
          />
        </div>

        {categories && categories.length > 0 && (
          <div className="form-group">
            <label className="form-label">Categories</label>
            <div className="task-form-categories">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`task-form-cat-btn ${form.category_ids.includes(cat.id) ? 'active' : ''}`}
                  style={{
                    '--cat-color': cat.color,
                    '--cat-bg': cat.color + '20',
                  }}
                  onClick={() => toggleCategory(cat.id)}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="task-form-actions">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={loading}>
            {isEdit ? 'Update Task' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
