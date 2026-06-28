const express = require('express');
const Property = require('../models/Property');
const { ensureAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/login', (req, res) => {
  if (req.session?.isAdmin) {
    return res.redirect('/admin/dashboard');
  }

  return res.render('admin-login', {
    title: 'Admin Login',
    error: null
  });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    req.session.isAdmin = true;
    return res.redirect('/admin/dashboard');
  }

  return res.status(401).render('admin-login', {
    title: 'Admin Login',
    error: 'Invalid credentials.'
  });
});

router.post('/logout', ensureAdmin, (req, res) => {
  req.session.destroy(() => {
    res.redirect('/admin/login');
  });
});

router.get('/dashboard', ensureAdmin, async (req, res) => {
  const pendingProperties = await Property.find({ status: 'Pending' }).sort({ createdAt: -1 });
  const approvedCount = await Property.countDocuments({ status: 'Approved' });
  const rejectedCount = await Property.countDocuments({ status: 'Rejected' });

  return res.render('admin-dashboard', {
    title: 'Admin Dashboard',
    pendingProperties,
    approvedCount,
    rejectedCount
  });
});

router.post('/property/:id/status', ensureAdmin, async (req, res) => {
  const { status } = req.body;

  if (!['Approved', 'Rejected'].includes(status)) {
    return res.status(400).send('Invalid status value.');
  }

  try {
    await Property.findByIdAndUpdate(req.params.id, { status });
    return res.redirect('/admin/dashboard');
  } catch (error) {
    return res.status(400).send('Invalid property ID.');
  }
});

module.exports = router;
