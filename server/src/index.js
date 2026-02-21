const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const config = require('./config');
const { runMigrations } = require('./database/migrate');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const categoryRoutes = require('./routes/categories');
const dashboardRoutes = require('./routes/dashboard');

const app = express();

// Security headers
app.use(helmet({ contentSecurityPolicy: false }));

// CORS
app.use(cors({ origin: config.CLIENT_URL, credentials: true }));

// Body parsing
app.use(express.json({ limit: '1mb' }));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve landing page and React app in production
if (config.NODE_ENV === 'production') {
  const rootDir = path.join(__dirname, '../../');
  const clientDist = path.join(__dirname, '../../client/dist');

  // Landing page static assets
  ['styles.css', 'script.js', 'roadmap.css', 'roadmap.js'].forEach((file) => {
    app.get(`/${file}`, (req, res) => res.sendFile(path.join(rootDir, file)));
  });

  // Landing page HTML routes
  app.get('/', (req, res) => res.sendFile(path.join(rootDir, 'index.html')));
  app.get('/roadmap.html', (req, res) => res.sendFile(path.join(rootDir, 'roadmap.html')));

  // React app static assets (JS/CSS bundles)
  app.use(express.static(clientDist));

  // All app routes → React SPA
  app.get('*', (req, res) => res.sendFile(path.join(clientDist, 'index.html')));
}

// Global error handler
app.use(errorHandler);

// Run migrations then start server
runMigrations();

app.listen(config.PORT, () => {
  console.log(`TaskFlow AI server running on http://localhost:${config.PORT}`);
  console.log(`Environment: ${config.NODE_ENV}`);
});
