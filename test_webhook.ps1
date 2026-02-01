$body = @{
    order_status = "paid"
    order = @{ total = "179.90" }
    Customer = @{ email = "heitor212@zeroperda.com" }
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://hxnimypngdpmcozzjbam.supabase.co/functions/v1/kiwify-webhook" -Method Post -ContentType "application/json" -Body $body
