Write-Host "1. Reparando Usuario heitor212..."
Invoke-RestMethod -Uri "https://hxnimypngdpmcozzjbam.supabase.co/functions/v1/repair-user" -Method Post

Write-Host "`n2. Testando Webhook Kiwify (Upgrade)..."
$body = @{
    order_status = "paid"
    order = @{ total = "179.90" }
    Customer = @{ email = "heitor212@zeroperda.com" }
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://hxnimypngdpmcozzjbam.supabase.co/functions/v1/kiwify-webhook" -Method Post -ContentType "application/json" -Body $body
