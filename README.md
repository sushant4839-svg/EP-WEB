# ETAWAH PROPERTIES

A complete full-stack real estate website built with Node.js, Express, MongoDB (Mongoose), HTML, CSS, and EJS.

## Project Structure

```
ETAWAH-PROPERTIES/
├── middleware/
│   └── auth.js
├── models/
│   └── Property.js
├── public/
│   ├── css/
│   │   └── style.css
│   └── uploads/
├── routes/
│   ├── adminRoutes.js
│   └── publicRoutes.js
├── views/
│   ├── partials/
│   │   ├── footer.ejs
│   │   └── header.ejs
│   ├── 404.ejs
│   ├── admin-dashboard.ejs
│   ├── admin-login.ejs
│   ├── index.ejs
│   ├── properties.ejs
│   ├── property-details.ejs
│   ├── seller.ejs
│   └── submission-success.ejs
├── .env.example
├── package.json
├── README.md
└── server.js
```

## Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd EP-WEB
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
4. Update values in `.env` as needed.

## Run Locally

1. Ensure MongoDB is running.
2. Start development server:
   ```bash
   npm run dev
   ```
3. Open browser:
   - `http://localhost:5000`

## Deployment

### Option A: Render/Railway (Node app)
1. Push project to GitHub.
2. Create a new Web Service in Render/Railway.
3. Set start command:
   ```bash
   npm start
   ```
4. Add environment variables from `.env.example`.
5. Use a hosted MongoDB URI (MongoDB Atlas).

### Option B: VPS (Ubuntu)
1. Install Node.js and MongoDB (or use MongoDB Atlas).
2. Upload source code and run:
   ```bash
   npm install
   npm start
   ```
3. Use PM2 for process management:
   ```bash
   npm i -g pm2
   pm2 start server.js --name etawah-properties
   pm2 save
   ```
4. Configure Nginx reverse proxy to app port.

## Admin Credentials

Default credentials are set in `.env`:
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`

> Change them before production use.

