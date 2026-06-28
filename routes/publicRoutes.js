const path = require('path');
const express = require('express');
const multer = require('multer');
const Property = require('../models/Property');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'public', 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024, files: 5 },
  fileFilter: (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
      return cb(null, true);
    }

    cb(new Error('Only JPG, PNG, and WEBP images are allowed.'));
  }
});

router.get('/', (req, res) => {
  res.render('index', {
    title: 'ETAWAH PROPERTIES',
    message: null,
    messageType: null
  });
});

router.get('/seller', (req, res) => {
  res.render('seller', {
    title: 'List Your Property',
    errors: [],
    formData: {}
  });
});

router.post('/seller', upload.array('images', 5), async (req, res) => {
  const { ownerName, phone, propertyType, location, area, price, description } = req.body;
  const errors = [];

  if (!ownerName || ownerName.trim().length < 2) errors.push('Owner name is required.');
  if (!phone || !/^\d{10}$/.test(phone)) errors.push('Phone must be a valid 10-digit number.');
  if (!propertyType) errors.push('Property type is required.');
  if (!location || location.trim().length < 2) errors.push('Location is required.');
  if (!area || Number(area) <= 0) errors.push('Area must be greater than 0.');
  if (!price || Number(price) <= 0) errors.push('Expected price must be greater than 0.');
  if (!description || description.trim().length < 10) {
    errors.push('Description must be at least 10 characters long.');
  }

  if (errors.length > 0) {
    return res.status(400).render('seller', {
      title: 'List Your Property',
      errors,
      formData: req.body
    });
  }

  try {
    const imagePaths = (req.files || []).map((file) => `/uploads/${file.filename}`);

    await Property.create({
      ownerName: ownerName.trim(),
      phone: phone.trim(),
      propertyType: propertyType.trim(),
      location: location.trim(),
      area: Number(area),
      price: Number(price),
      description: description.trim(),
      images: imagePaths,
      status: 'Pending'
    });

    return res.render('submission-success', {
      title: 'Submitted',
      message: 'Your property was submitted successfully and is awaiting admin approval.'
    });
  } catch (error) {
    return res.status(500).render('seller', {
      title: 'List Your Property',
      errors: ['Something went wrong while saving your property. Please try again.'],
      formData: req.body
    });
  }
});

router.get('/properties', async (req, res) => {
  const properties = await Property.find({ status: 'Approved' }).sort({ createdAt: -1 });

  res.render('properties', {
    title: 'Verified Properties',
    properties
  });
});

router.get('/properties/:id', async (req, res) => {
  try {
    const property = await Property.findOne({ _id: req.params.id, status: 'Approved' });

    if (!property) {
      return res.status(404).render('404', { title: 'Property Not Found' });
    }

    return res.render('property-details', {
      title: `${property.propertyType} in ${property.location}`,
      property
    });
  } catch (error) {
    return res.status(404).render('404', { title: 'Property Not Found' });
  }
});

module.exports = router;
