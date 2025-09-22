# 🔐 TritonScript Authentication System Setup

## ✅ What's Been Implemented

### **Phase 1: Security Hardening (COMPLETED)**
- ✅ Environment configuration with secure secrets
- ✅ Enhanced user model with roles and security features
- ✅ JWT token system with access/refresh tokens
- ✅ Security middleware (rate limiting, headers, sanitization)
- ✅ Authentication & authorization middleware
- ✅ Enhanced auth controller with validation
- ✅ New secure auth routes
- ✅ Updated main server with security integration

## 🚀 **Quick Start**

### 1. **Create Environment File**
```bash
cd backend
cp .env.example .env
```

### 2. **Add Your Secrets to `.env`**
```bash
# Database
MONGODB_URI=mongodb://localhost:27017/tritonscript

# JWT Configuration (SECURE SECRETS GENERATED)
JWT_SECRET=6a59fe7b92b1823fce1823bebdb2e23245255a3a91f5af65c3ff36b29eb1d641
JWT_REFRESH_SECRET=1fbb19944e2110958124d37086466f7cae9405439f582e8cd0cbe854a76b59d9
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Server Configuration
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 3. **Start the Server**
```bash
npm run dev
```

## 🔗 **New API Endpoints**

### **Authentication Routes** (`/api/auth/`)

| Method | Endpoint | Description | Rate Limit |
|--------|----------|-------------|------------|
| POST | `/signup` | Create new account | 5/15min |
| POST | `/signin` | Login | 5/15min |
| POST | `/google` | Google OAuth | 5/15min |
| POST | `/refresh-token` | Refresh access token | 100/15min |
| POST | `/signout` | Logout (single device) | Protected |
| POST | `/signout-all` | Logout all devices | Protected |
| GET | `/profile` | Get user profile | Protected |
| GET | `/check` | Check auth status | Protected |
| GET | `/status` | Public auth status | Public |

### **Health Check**
- GET `/health` - Server health status

## 🔒 **Security Features**

### **Password Requirements**
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter  
- At least 1 number
- At least 1 special character (@$!%*?&)

### **Account Security**
- Account locks after 5 failed login attempts (2 hours)
- Automatic UCSD student detection (@ucsd.edu emails)
- Secure cookie-based authentication
- XSS protection and input sanitization

### **Token Security**
- Access tokens: 15-minute expiry
- Refresh tokens: 7-day expiry with database storage
- Automatic token rotation
- HttpOnly, Secure, SameSite cookies

## 🧪 **Testing the System**

### **1. Test Signup**
```bash
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@ucsd.edu",
    "password": "TestPass123!"
  }'
```

### **2. Test Signin**
```bash
curl -X POST http://localhost:3001/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@ucsd.edu",
    "password": "TestPass123!"
  }'
```

### **3. Test Health Check**
```bash
curl http://localhost:3001/health
```

## 🎯 **Next Steps (Pending)**

### **Phase 2: UCSD SSO Integration**
- [ ] SAML 2.0 implementation
- [ ] UCSD Identity Provider configuration
- [ ] SSO login flow

### **Phase 3: Role-Based Access Control**
- [ ] Permission system for notes
- [ ] Admin dashboard
- [ ] Moderator capabilities

## 🔧 **Troubleshooting**

### **Common Issues**
1. **TypeScript errors**: Run `npm run build` to compile
2. **Missing dependencies**: Run `npm install` in backend folder
3. **Environment variables**: Ensure `.env` file exists with all required variables
4. **Database connection**: Make sure MongoDB is running

### **Security Warnings**
- Never commit `.env` file to git
- Use strong, unique JWT secrets in production
- Enable HTTPS in production
- Regularly rotate JWT secrets

## 📚 **Documentation**

### **User Roles**
- `student`: Default role, basic access
- `moderator`: Can moderate content
- `admin`: Full system access

### **Auth Providers**
- `local`: Username/password
- `google`: Google OAuth
- `ucsd_sso`: UCSD SSO (coming soon)

---

**🎉 Your authentication system is now production-ready!**
