Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  TESTES DO BACKEND - vendeSozinho" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$baseUrl = "http://localhost:5000"

Write-Host "[1] Testando Health Check..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/health" -Method Get
    Write-Host "? Health Check OK!" -ForegroundColor Green
    Write-Host "   Status: $($response.status)" -ForegroundColor Gray
    Write-Host "   Mensagem: $($response.message)`n" -ForegroundColor Gray
} catch {
    Write-Host "? Erro: $_`n" -ForegroundColor Red
}

Write-Host "[2] Testando Database..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/test-db" -Method Get
    Write-Host "? Database OK!" -ForegroundColor Green
    Write-Host "   $($response.message)`n" -ForegroundColor Gray
} catch {
    Write-Host "? Erro: $_`n" -ForegroundColor Red
}

Write-Host "[3] Testando Geração de Texto..." -ForegroundColor Yellow
try {
    $body = @{
        prompt = "Teste de produto"
        type = "produto"
    } | ConvertTo-Json
    $response = Invoke-RestMethod -Uri "$baseUrl/api/generate-text" -Method Post -Body $body -ContentType "application/json"
    Write-Host "? Geração OK!" -ForegroundColor Green
    Write-Host "   Texto: $($response.generated_text.Substring(0,50))...`n" -ForegroundColor Gray
} catch {
    Write-Host "? Erro: $_`n" -ForegroundColor Red
}
