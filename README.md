# Expense Tracker with Data Visualization

A full-stack web application for tracking income and expenses with comprehensive analytics and data visualization.

## Tech Stack
- **Frontend**: React, Redux, Chart.js, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT with bcrypt

## Project Structure
```
expense-tracker/
├── backend/           # Express API server
│   ├── models/       # MongoDB schemas
│   ├── routes/       # API routes
│   ├── controllers/  # Business logic
│   ├── middleware/   # Auth & error handling
│   ├── config/       # Database & environment
│   └── server.js     # Entry point
├── frontend/          # React application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   └── App.js
│   └── package.json
└── README.md
```

## Features
- ✅ User authentication (Register/Login)
- ✅ Transaction management (Add/Edit/Delete)
- ✅ Category management
- ✅ Analytics dashboard with charts
- ✅ Budget tracking
- ✅ Search & filter transactions
- ✅ Responsive design
- ✅ Dark/Light mode

## Getting Started

### Backend Setup
```bash
cd backend
npm install
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

Visit `http://localhost:3000` to access the application.
