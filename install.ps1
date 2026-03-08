# 微信小程序版快速安装脚本 (PowerShell)

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "数智农旅平台 - 微信小程序版" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

Set-Location $PSScriptRoot

Write-Host "开始安装依赖..." -ForegroundColor Yellow
npm install --registry=https://registry.npmmirror.com

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "======================================" -ForegroundColor Green
    Write-Host "安装完成！" -ForegroundColor Green
    Write-Host "======================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "下一步：" -ForegroundColor Cyan
    Write-Host "1. 运行开发服务器：npm run dev:mp-weixin"
    Write-Host "2. 打开微信开发者工具"
    Write-Host "3. 导入项目：miniprogram\dist\dev\mp-weixin"
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "安装失败，请检查网络或手动执行：npm install" -ForegroundColor Red
    Write-Host ""
}
