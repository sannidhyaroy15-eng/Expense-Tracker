$projectPath = "c:\xampp\htdocs\Expense Tracker with data viz"

Write-Host "Installing backend dependencies..." -ForegroundColor Green
Set-Location "$projectPath\backend"
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "Backend installation successful!" -ForegroundColor Green
} else {
    Write-Host "Backend installation failed!" -ForegroundColor Red
}

Write-Host "`nInstalling frontend dependencies..." -ForegroundColor Green
Set-Location "$projectPath\frontend"
npm install --legacy-peer-deps
if ($LASTEXITCODE -eq 0) {
    Write-Host "Frontend installation successful!" -ForegroundColor Green
} else {
    Write-Host "Frontend installation failed!" -ForegroundColor Red
}

Write-Host "`nAll installations completed!" -ForegroundColor Cyan
Set-Location $projectPath
