const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const session = require('express-session');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  throw new Error('MONGO_URI is required in .env');
}

mongoose
  .connect(mongoUri)
  .then(() => console.log('MongoDB connected'))
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  });

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'unsafe-dev-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 4,
      httpOnly: true
    }
  })
);

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.locals.isAuthenticated = Boolean(req.session?.isAdmin);
  next();
});

app.use('/', require('./routes/publicRoutes'));
app.use('/admin', require('./routes/adminRoutes'));

app.use((error, req, res, next) => {
  if (error && error.message) {
    return res.status(400).render('seller', {
      title: 'List Your Property',
      errors: [error.message],
      formData: req.body || {}
    });
  }

  return next();
});

app.use((req, res) => {
  res.status(404).render('404', { title: 'Page Not Found' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
