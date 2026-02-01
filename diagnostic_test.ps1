$ErrorActionPreference = "Stop"

try {
    Write-Host "1. Tentando Reparar Usuario..." -ForegroundColor Cyan
    $repair = Invoke-RestMethod -Uri "https://hxnimypngdpmcozzjbam.supabase.co/functions/v1/repair-user" -Method Post
    Write-Host "   > Sucesso: $($repair.message)" -ForegroundColor Green
    if ($repair.userId) { Write-Host "   > User ID: $($repair.userId)" -ForegroundColor Gray }
} catch {
    Write-Host "   > FALHA NO REPARO:" -ForegroundColor Red
    Write-Host "   > $($_.Exception.Message)" -ForegroundColor Red
    # Tenta ler o corpo do erro
    $stream = $_.Exception.Response.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($stream)
    $body = $reader.ReadToEnd()
    Write-Host "   > Detalhes: $body" -ForegroundColor Red
}

try {
    Write-Host "`n2. Enviando Webhook Kiwify..." -ForegroundColor Cyan
    $body = @{
        order_status = "paid"
        order = @{ total = "179.90" }
        Customer = @{ email = "heitor212@zeroperda.com" }
    } | ConvertTo-Json

    $webhook = Invoke-RestMethod -Uri "https://hxnimypngdpmcozzjbam.supabase.co/functions/v1/kiwify-webhook" -Method Post -ContentType "application/json" -Body $body
    Write-Host "   > Sucesso! Resposta: $($webhook.message)" -ForegroundColor Green
} catch {
    Write-Host "   > FALHA NO WEBHOOK:" -ForegroundColor Red
    Write-Host "   > $($_.Exception.Message)" -ForegroundColor Red
    
    $stream = $_.Exception.Response.GetResponseStream()
    if ($stream) {
        $reader = New-Object System.IO.StreamReader($stream)
        $body = $reader.ReadToEnd()
        Write-Host "   > Detalhes: $body" -ForegroundColor Red
    }
}
