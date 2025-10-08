# Script para corrigir erros de build do Vercel
# Execute na raiz do projeto

Write-Host "=== Iniciando correcao de erros ===" -ForegroundColor Cyan

# Caminho da pasta frontend
$frontendPath = ".\frontend\app"

if (-not (Test-Path $frontendPath)) {
    Write-Host "ERRO: Pasta frontend/app nao encontrada!" -ForegroundColor Red
    Write-Host "Execute este script na raiz do projeto" -ForegroundColor Yellow
    exit
}

# Funcao para corrigir arquivo
function Fix-FileEncoding {
    param($filePath)
    
    try {
        # Ler conteudo do arquivo
        $content = Get-Content -Path $filePath -Raw -Encoding UTF8
        
        if ($null -eq $content) {
            return $false
        }
        
        $originalContent = $content
        $modified = $false
        
        # Substituir aspas tipograficas por aspas normais
        $content = $content -replace [char]0x201C, '"'
        $content = $content -replace [char]0x201D, '"'
        $content = $content -replace [char]0x2018, "'"
        $content = $content -replace [char]0x2019, "'"
        
        # Remover backslashes antes de aspas em className
        $content = $content -replace 'className=\\"', 'className="'
        $content = $content -replace '\\">', '">'
        $content = $content -replace '\\"', '"'
        
        # Verificar se houve mudancas
        if ($content -ne $originalContent) {
            # Salvar com encoding UTF-8 sem BOM
            $utf8NoBom = New-Object System.Text.UTF8Encoding $false
            [System.IO.File]::WriteAllText($filePath, $content, $utf8NoBom)
            $modified = $true
        }
        
        return $modified
        
    } catch {
        Write-Host "ERRO ao processar $filePath : $_" -ForegroundColor Red
        return $false
    }
}

# Processar todos os arquivos .tsx e .ts
$files = Get-ChildItem -Path $frontendPath -Recurse -Include *.tsx,*.ts
$totalFixed = 0

Write-Host "`nProcessando arquivos..." -ForegroundColor Yellow

foreach ($file in $files) {
    $relativePath = $file.FullName.Replace((Get-Location).Path, ".")
    
    if (Fix-FileEncoding -filePath $file.FullName) {
        Write-Host "OK CORRIGIDO: $relativePath" -ForegroundColor Green
        $totalFixed++
    } else {
        Write-Host "  OK: $relativePath" -ForegroundColor Gray
    }
}

Write-Host "`n=== Resumo ===" -ForegroundColor Cyan
Write-Host "Arquivos processados: $($files.Count)" -ForegroundColor White
Write-Host "Arquivos corrigidos: $totalFixed" -ForegroundColor Green

if ($totalFixed -gt 0) {
    Write-Host "`nOK Correcoes aplicadas com sucesso!" -ForegroundColor Green
    Write-Host "Proximos passos:" -ForegroundColor Yellow
    Write-Host "1. git add ." -ForegroundColor White
    Write-Host "2. git commit -m `"fix: corrige erros de encoding e aspas`"" -ForegroundColor White
    Write-Host "3. git push" -ForegroundColor White
} else {
    Write-Host "`nNenhum arquivo precisou de correcao." -ForegroundColor Yellow
    Write-Host "Verifique manualmente os arquivos:" -ForegroundColor Yellow
    Write-Host "- frontend/app/page.tsx (linha ~1912)" -ForegroundColor White
    Write-Host "- frontend/app/(auth)/register/page.tsx (linha 36)" -ForegroundColor White
}

Write-Host "`n=== Concluido ===" -ForegroundColor Cyan