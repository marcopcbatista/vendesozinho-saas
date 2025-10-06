Write-Host "Corrigindo exportacoes duplicadas no projeto..." -ForegroundColor Yellow

# Caminho do arquivo a ser verificado
$filePath = "C:\Users\User\vendesozinho-saas\frontend\app\providers.tsx"

# Lê o conteúdo
$content = Get-Content $filePath -Raw

# Remove exportacoes duplicadas de useAuth
$content = $content -replace "export\s*\{\s*useAuth\s*\};", ""

# Salva o conteúdo atualizado
Set-Content -Path $filePath -Value $content -Encoding UTF8

Write-Host "Correcao aplicada com sucesso! Agora rode: npm run dev" -ForegroundColor Green
