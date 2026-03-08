#!/bin/bash
# 微信小程序版快速安装脚本

echo "======================================"
echo "数智农旅平台 - 微信小程序版"
echo "======================================"

cd "$(dirname "$0")"

echo ""
echo "开始安装依赖..."
npm install --registry=https://registry.npmmirror.com

if [ $? -eq 0 ]; then
    echo ""
    echo "======================================"
    echo "安装完成！"
    echo "======================================"
    echo ""
    echo "下一步："
    echo "1. 运行开发服务器：npm run dev:mp-weixin"
    echo "2. 打开微信开发者工具"
    echo "3. 导入项目：miniprogram/dist/dev/mp-weixin"
    echo ""
else
    echo ""
    echo "安装失败，请检查网络或手动执行：npm install"
    echo ""
fi
