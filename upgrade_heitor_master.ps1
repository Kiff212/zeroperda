$ErrorActionPreference = "Stop"

$email = "heitor@zeroperda.com"

Write-Host "=============================================" -ForegroundColor Yellow
Write-Host " EXECUTANDO PROTOCOLO MASTER: $email" -ForegroundColor Yellow
Write-Host "=============================================" -ForegroundColor Yellow

# 1. REPARO / CHECK
try {
    Write-Host "`n1. Verificando Integridade da Conta (Repair)..." -ForegroundColor Cyan
    $repairBody = @{ email = $email } | ConvertTo-Json
    $repair = Invoke-RestMethod -Uri "https://hxnimypngdpmcozzjbam.supabase.co/functions/v1/repair-user" -Method Post -ContentType "application/json" -Body $repairBody
    
    Write-Host "   > Status: $($repair.message)" -ForegroundColor Green
    if ($repair.userId) { Write-Host "   > ID Confirmado: $($repair.userId)" -ForegroundColor Gray }

} catch {
    Write-Host "   > ERRO NO REPARO:" -ForegroundColor Red
    Write-Host "   > $($_.Exception.Message)" -ForegroundColor Red
    
    $stream = $_.Exception.Response.GetResponseStream()
    if ($stream) {
        $reader = New-Object System.IO.StreamReader($stream)
        $body = $reader.ReadToEnd()
        Write-Host "   > Detalhes: $body" -ForegroundColor Red
    }
    # Se falhar o reparo (ex: usuario nao existe no auth), paramos.
    exit
}

# 2. SIMULAÇÃO DE PAGAMENTO
try {
    Write-Host "`n2. Simulando Compra Aprovada (Kiwify)..." -ForegroundColor Cyan
    
    $webhookBody = @{
        order_status = "paid"
        order = @{ total = "179.90" } # > 100 = PRO
        Customer = @{ email = $email }
    } | ConvertTo-Json

    $webhook = Invoke-RestMethod -Uri "https://hxnimypngdpmcozzjbam.supabase.co/functions/v1/kiwify-webhook" -Method Post -ContentType "application/json" -Body $webhookBody
    
    Write-Host "   > Resultado: $($webhook.message)" -ForegroundColor Green
    Write-Host "`n✅ MISSÃO CUMPRIDA: $email AGORA É PRO." -ForegroundColor Yellow -BackgroundColor Black

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
