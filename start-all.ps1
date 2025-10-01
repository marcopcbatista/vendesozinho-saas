Write-Host "`n?? Iniciando vendeSozinho SaaS...`n" -ForegroundColor Cyan

Write-Host "?? Backend (porta 5000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; Write-Host '?? Backend Iniciando...' -ForegroundColor Cyan; npm run dev"

Start-Sleep -Seconds 3

Write-Host "?? Frontend (porta 3000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; Write-Host '?? Frontend Iniciando...' -ForegroundColor Cyan; npm run dev"

Write-Host "`n? Aplicação iniciada!" -ForegroundColor Green
Write-Host "   Backend:  http://localhost:5000/api/health" -ForegroundColor White
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "`n?? Aguarde alguns segundos para tudo iniciar...`n" -ForegroundColor Yellow
