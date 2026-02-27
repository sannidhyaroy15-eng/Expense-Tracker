@echo off
cd /d "c:\xampp\htdocs\Expense Tracker with data viz"

echo Installing backend dependencies...
cd backend
call npm install
cd ..

echo Installing frontend dependencies...
cd frontend
call npm install --legacy-peer-deps
cd ..

echo All installations complete!
pause
