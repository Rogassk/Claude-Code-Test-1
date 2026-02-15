const { getDb } = require('../database/connection');

function createError(message, statusCode) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}

function list(userId) {
  const db = getDb();
  return db.prepare(`
    SELECT c.*, COUNT(tc.task_id) as task_count
    FROM categories c
    LEFT JOIN task_categories tc ON c.id = tc.category_id
    WHERE c.user_id = ?
    GROUP BY c.id
    ORDER BY c.name ASC
  `).all(userId);
}

function create(userId, { name, color }) {
  const db = getDb();

  const existing = db.prepare('SELECT id FROM categories WHERE user_id = ? AND name = ?').get(userId, name);
  if (existing) {
    throw createError('A category with this name already exists', 409);
  }

  const result = db.prepare(
    'INSERT INTO categories (user_id, name, color) VALUES (?, ?, ?)'
  ).run(userId, name, color);

  return db.prepare('SELECT * FROM categories WHERE id = ?').get(result.lastInsertRowid);
}

function update(userId, categoryId, data) {
  const db = getDb();

  const existing = db.prepare('SELECT id FROM categories WHERE id = ? AND user_id = ?').get(categoryId, userId);
  if (!existing) {
    throw createError('Category not found', 404);
  }

  if (data.name) {
    const duplicate = db.prepare(
      'SELECT id FROM categories WHERE user_id = ? AND name = ? AND id != ?'
    ).get(userId, data.name, categoryId);
    if (duplicate) {
      throw createError('A category with this name already exists', 409);
    }
  }

  const fields = [];
  const values = [];
  if (data.name !== undefined) { fields.push('name = ?'); values.push(data.name); }
  if (data.color !== undefined) { fields.push('color = ?'); values.push(data.color); }

  if (fields.length > 0) {
    values.push(categoryId, userId);
    db.prepare(`UPDATE categories SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`).run(...values);
  }

  return db.prepare('SELECT * FROM categories WHERE id = ?').get(categoryId);
}

function remove(userId, categoryId) {
  const db = getDb();
  const result = db.prepare('DELETE FROM categories WHERE id = ? AND user_id = ?').run(categoryId, userId);
  if (result.changes === 0) {
    throw createError('Category not found', 404);
  }
}

module.exports = { list, create, update, remove };
