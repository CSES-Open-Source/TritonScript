#!/bin/bash

echo "🔐 Installing TritonScript Authentication System Dependencies..."

cd backend

echo "📦 Installing production dependencies..."
npm install express-rate-limit express-validator helmet

echo "📦 Installing development dependencies..."
npm install --save-dev @types/express-rate-limit @types/mongoose

echo "✅ Dependencies installed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Copy .env.example to .env and fill in your secrets"
echo "2. Generate secure JWT secrets (at least 32 characters)"
echo "3. Update your main server file to use the new auth routes"
echo "4. Test the authentication endpoints"
echo ""
echo "🔑 To generate secure secrets, run:"
echo "node -e \"console.log('JWT_SECRET=' + require('crypto').randomBytes(32).toString('hex'))\""
echo "node -e \"console.log('JWT_REFRESH_SECRET=' + require('crypto').randomBytes(32).toString('hex'))\""
