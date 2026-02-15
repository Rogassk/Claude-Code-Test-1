const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });
const { getDb } = require('./connection');
const { runMigrations } = require('./migrate');
const { hashPassword } = require('../utils/password');

async function seed() {
  runMigrations();
  const db = getDb();

  const passwordHash = await hashPassword('password123');

  // Create demo user
  const user = db.prepare(`
    INSERT OR IGNORE INTO users (email, password_hash, name)
    VALUES (?, ?, ?)
  `).run('demo@taskflow.ai', passwordHash, 'Demo User');

  const userId = user.lastInsertRowid || db.prepare('SELECT id FROM users WHERE email = ?').get('demo@taskflow.ai').id;

  // Create categories
  const categories = [
    { name: 'Work', color: '#6366F1' },
    { name: 'Personal', color: '#8B5CF6' },
    { name: 'Health', color: '#10B981' },
    { name: 'Learning', color: '#F59E0B' },
  ];

  const catIds = {};
  for (const cat of categories) {
    const result = db.prepare(`
      INSERT OR IGNORE INTO categories (user_id, name, color) VALUES (?, ?, ?)
    `).run(userId, cat.name, cat.color);
    catIds[cat.name] = result.lastInsertRowid || db.prepare('SELECT id FROM categories WHERE user_id = ? AND name = ?').get(userId, cat.name).id;
  }

  // Create sample tasks
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  const tasks = [
    { title: 'Review project proposal', description: 'Go through the Q1 project proposal and provide feedback', priority: 'high', due_date: today, status: 'pending', categories: ['Work'] },
    { title: 'Morning workout', description: '30 min cardio + stretching', priority: 'medium', due_date: today, status: 'completed', categories: ['Health'] },
    { title: 'Team standup meeting', description: 'Daily standup with the dev team', priority: 'medium', due_date: today, status: 'pending', categories: ['Work'] },
    { title: 'Read chapter 5 of Clean Code', description: 'Continue reading Clean Code book', priority: 'low', due_date: tomorrow, status: 'pending', categories: ['Learning'] },
    { title: 'Grocery shopping', description: 'Buy vegetables, fruits, and protein', priority: 'medium', due_date: tomorrow, status: 'pending', categories: ['Personal'] },
    { title: 'Fix login bug', description: 'Users report intermittent login failures', priority: 'urgent', due_date: today, status: 'in_progress', categories: ['Work'] },
    { title: 'Prepare presentation', description: 'Slides for next week client meeting', priority: 'high', due_date: nextWeek, status: 'pending', categories: ['Work'] },
    { title: 'Dentist appointment', description: 'Annual checkup at 3 PM', priority: 'high', due_date: nextWeek, status: 'pending', categories: ['Health', 'Personal'] },
    { title: 'Update resume', description: 'Add recent projects and skills', priority: 'low', due_date: null, status: 'pending', categories: ['Personal'] },
    { title: 'Complete online course module', description: 'Finish React advanced patterns module', priority: 'medium', due_date: yesterday, status: 'pending', categories: ['Learning'] },
  ];

  const insertTask = db.prepare(`
    INSERT INTO tasks (user_id, title, description, priority, due_date, status, completed_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const insertTaskCat = db.prepare(`
    INSERT OR IGNORE INTO task_categories (task_id, category_id) VALUES (?, ?)
  `);

  for (const task of tasks) {
    const completedAt = task.status === 'completed' ? new Date().toISOString() : null;
    const result = insertTask.run(userId, task.title, task.description, task.priority, task.due_date, task.status, completedAt);
    for (const catName of task.categories) {
      insertTaskCat.run(result.lastInsertRowid, catIds[catName]);
    }
  }

  console.log('Seed data created successfully!');
  console.log('Demo account: demo@taskflow.ai / password123');
}

seed().catch(console.error);
