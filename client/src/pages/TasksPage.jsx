import { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { tasksApi } from '../api/tasks';
import { categoriesApi } from '../api/categories';
import { useDebounce } from '../hooks/useDebounce';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ToastContainer from '../components/common/Toast';
import ConfirmDialog from '../components/common/ConfirmDialog';
import TaskList from '../components/tasks/TaskList';
import TaskSearch from '../components/tasks/TaskSearch';
import TaskFilters from '../components/tasks/TaskFilters';
import TaskForm from '../components/tasks/TaskForm';
import { useToast } from '../hooks/useToast';
import './TasksPage.css';

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [filters, setFilters] = useState({ sort: 'created_at', order: 'desc' });
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);
  const { toasts, success, error: showError } = useToast();

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const params = { ...filters };
      if (debouncedSearch) params.search = debouncedSearch;
      const data = await tasksApi.list(params);
      setTasks(data.tasks);
      setPagination(data.pagination);
    } catch (err) {
      showError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [filters, debouncedSearch, showError]);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await categoriesApi.list();
      setCategories(data.categories);
    } catch {}
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleCreateTask = async (formData) => {
    setFormLoading(true);
    try {
      await tasksApi.create(formData);
      success('Task created!');
      setShowForm(false);
      fetchTasks();
    } catch (err) {
      showError(err.response?.data?.error || 'Failed to create task');
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateTask = async (formData) => {
    setFormLoading(true);
    try {
      await tasksApi.update(editingTask.id, formData);
      success('Task updated!');
      setEditingTask(null);
      fetchTasks();
    } catch (err) {
      showError(err.response?.data?.error || 'Failed to update task');
    } finally {
      setFormLoading(false);
    }
  };

  const handleToggleStatus = async (taskId, newStatus) => {
    try {
      await tasksApi.updateStatus(taskId, newStatus);
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId ? { ...t, status: newStatus, completed_at: newStatus === 'completed' ? new Date().toISOString() : null } : t
        )
      );
      success(newStatus === 'completed' ? 'Task completed!' : 'Task reopened');
    } catch (err) {
      showError('Failed to update status');
    }
  };

  const handleDelete = async () => {
    if (!deletingTask) return;
    try {
      await tasksApi.delete(deletingTask.id);
      success('Task deleted');
      setDeletingTask(null);
      fetchTasks();
    } catch (err) {
      showError('Failed to delete task');
    }
  };

  return (
    <div className="tasks-page">
      <ToastContainer toasts={toasts} />

      <div className="tasks-toolbar">
        <TaskSearch value={searchTerm} onChange={setSearchTerm} />
        <Button onClick={() => setShowForm(true)}>
          <Plus size={18} /> New Task
        </Button>
      </div>

      <TaskFilters filters={filters} onChange={setFilters} categories={categories} />

      {loading ? (
        <div style={{ padding: '40px 0', display: 'flex', justifyContent: 'center' }}>
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <TaskList
            tasks={tasks}
            onToggleStatus={handleToggleStatus}
            onEdit={(task) => setEditingTask(task)}
            onDelete={(task) => setDeletingTask(task)}
          />

          {pagination.totalPages > 1 && (
            <div className="tasks-pagination">
              <Button
                variant="secondary"
                size="sm"
                disabled={pagination.page <= 1}
                onClick={() => setFilters({ ...filters, page: pagination.page - 1 })}
              >
                Previous
              </Button>
              <span className="tasks-pagination-info">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                variant="secondary"
                size="sm"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => setFilters({ ...filters, page: pagination.page + 1 })}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      <TaskForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleCreateTask}
        categories={categories}
        loading={formLoading}
      />

      <TaskForm
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        onSubmit={handleUpdateTask}
        task={editingTask}
        categories={categories}
        loading={formLoading}
      />

      <ConfirmDialog
        isOpen={!!deletingTask}
        onClose={() => setDeletingTask(null)}
        onConfirm={handleDelete}
        title="Delete Task"
        message={`Are you sure you want to delete "${deletingTask?.title}"? This action cannot be undone.`}
      />
    </div>
  );
}
