# Setup Instructions

## Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas connection)
- npm or yarn

## Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your MongoDB URI and JWT secret:
   ```
   MONGODB_URI=mongodb://localhost:27017/expense_tracker
   PORT=5000
   JWT_SECRET=your_secure_secret_key
   NODE_ENV=development
   ```

5. Seed default categories (optional):
   ```bash
   node seeds/seedCategories.js
   ```

6. Start the server:
   ```bash
   npm start
   # or for development with auto-reload
   npm run dev
   ```

The backend will run on `http://localhost:5000`

## Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The frontend will run on `http://localhost:3000` and automatically open in your browser.

## Features

### Core Features
- ✅ User Authentication (Register/Login)
- ✅ Transaction Management (CRUD)
- ✅ Category Management
- ✅ Search & Filter Transactions
- ✅ Pagination

### Analytics & Visualization
- ✅ Dashboard Summary (Income, Expenses, Balance)
- ✅ Pie Chart (Expense distribution by category)
- ✅ Bar Chart (Monthly income vs expenses)
- ✅ Line Chart (Spending trend)
- ✅ Expense breakdown report

### UI/UX
- ✅ Responsive design
- ✅ Modern dashboard layout
- ✅ Smooth transitions
- ✅ Toast notifications
- ✅ Loading states

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (requires token)
- `PUT /api/auth/update` - Update user profile

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create transaction
- `GET /api/transactions/:id` - Get single transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create custom category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Analytics
- `GET /api/analytics/summary` - Dashboard summary
- `GET /api/analytics/expense-by-category` - Expense by category
- `GET /api/analytics/monthly-comparison` - Monthly comparison
- `GET /api/analytics/spending-trend` - Spending trend

## Project Structure

```
expense-tracker/
├── backend/
│   ├── models/              # MongoDB schemas
│   ├── controllers/         # Business logic
│   ├── routes/              # API routes
│   ├── middleware/          # Auth & error handling
│   ├── config/              # Database config
│   ├── seeds/               # Seed scripts
│   ├── server.js            # Entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── redux/           # Redux slices & store
│   │   ├── api/             # Axios API setup
│   │   ├── App.js
│   │   └── index.js
│   ├── public/              # Static files
│   └── package.json
└── README.md
```

## Future Enhancements

- Budget management & alerts
- PDF/CSV export functionality
- Dark mode toggle
- PWA features
- Email notifications
- Multi-user/family wallet
- Advanced filtering & search
- Expense predictions
- Admin panel

## Troubleshooting

**MongoDB connection error:**
- Ensure MongoDB is running: `mongod`
- Check MongoDB URI in .env file

**CORS errors:**
- Ensure backend runs on port 5000
- Ensure frontend has correct API base URL

**Module not found:**
- Run `npm install` in both frontend and backend

## License
MIT
