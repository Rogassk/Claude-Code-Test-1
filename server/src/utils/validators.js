const { z } = require('zod');

const signupSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  email: z.string().trim().email('Invalid email address').max(255),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128),
});

const loginSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const forgotPasswordSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128),
});

const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

const createTaskSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(255),
  description: z.string().max(5000).optional().default(''),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional().default('medium'),
  due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD format').nullable().optional().default(null),
  category_ids: z.array(z.number().int().positive()).optional().default([]),
});

const updateTaskSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(255).optional(),
  description: z.string().max(5000).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD format').nullable().optional(),
  category_ids: z.array(z.number().int().positive()).optional(),
});

const updateStatusSchema = z.object({
  status: z.enum(['pending', 'in_progress', 'completed']),
});

const createCategorySchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(50),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a hex color').optional().default('#6366F1'),
});

const updateCategorySchema = z.object({
  name: z.string().trim().min(1).max(50).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
});

module.exports = {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  refreshTokenSchema,
  createTaskSchema,
  updateTaskSchema,
  updateStatusSchema,
  createCategorySchema,
  updateCategorySchema,
};
