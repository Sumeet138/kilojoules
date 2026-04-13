# 🚀 Gym Management System - Startup Guide

## 📋 Project Overview

A comprehensive Gym Management System with a Spring Boot backend and React frontend.

**Tech Stack:**
- **Backend:** Spring Boot 3.2.7 (Java 17) + MySQL + JPA
- **Frontend:** React 18 + Vite + Tailwind CSS + Redux Toolkit
- **Build Tools:** Maven (backend), npm (frontend)

---

## 🔍 Audit Summary

### ✅ Working Components
- Backend controllers: 12 REST API controllers covering all features
- Backend services: 14 service classes for business logic
- Backend entities: 12 JPA entities with proper relationships
- Backend repositories: 12 JPA repositories for data access
- Frontend API integration: Complete API store with all endpoints
- Frontend state management: Redux Toolkit with 11 slices
- Frontend routing: React Router with protected routes
- CORS configuration: Configured for localhost:5173
- File upload: Local file system upload working

### ⚠️ Issues Found
1. **Maven not installed** - Required to build and run backend
2. **MySQL database not configured** - Database needs to be created
3. **Email credentials empty** - Gmail SMTP credentials need to be set
4. **Firebase disabled** - Firebase config is commented out
5. **No environment files** - Missing .env files for configuration
6. **No README** - Missing project documentation

### 🔒 Security Notes
- No Spring Security configured (custom authentication only)
- Passwords stored as plain text (should be hashed)
- No JWT token implementation
- No API rate limiting
- CORS only allows localhost:5173

---

## 🛠️ Prerequisites Installation

### 1. Install Maven (Required for Backend)

**Windows:**
```powershell
# Download Maven from: https://maven.apache.org/download.cgi
# Extract to: C:\Program Files\Apache\maven
# Add to PATH:
setx PATH "%PATH%;C:\Program Files\Apache\maven\bin"
# Restart terminal and verify:
mvn --version
```

**Or using Chocolatey:**
```powershell
choco install maven
mvn --version
```

### 2. Install MySQL (Required for Database)

**Windows:**
- Download MySQL Community Server from: https://dev.mysql.com/downloads/mysql/
- Install with default settings
- Set root password (remember it!)
- Install MySQL Workbench for GUI management

**Verify installation:**
```powershell
mysql --version
```

### 3. Verify Existing Tools

```powershell
# Check Java (already installed: v17.0.12)
java -version

# Check Node.js (already installed: v22.14.0)
node --version

# Check npm (already installed: v11.0.0)
npm --version
```

---

## 📦 Step-by-Step Setup

### Phase 1: Database Setup

1. **Start MySQL Service**
```powershell
# Windows
net start MySQL80
```

2. **Create Database**
```sql
-- Open MySQL Workbench or command line
mysql -u root -p

-- Run this SQL:
CREATE DATABASE gym;
USE gym;

-- Verify
SHOW DATABASES;
```

3. **Configure Backend Database Connection**

Edit `Back-End/gym-erp/src/main/resources/application.properties`:

```properties
# Update these values with your MySQL credentials
spring.datasource.url=jdbc:mysql://localhost:3306/gym
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD_HERE
spring.jpa.hibernate.ddl-auto=update
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
spring.jpa.show-sql=true
```

### Phase 2: Email Configuration (Optional)

Edit `Back-End/gym-erp/src/main/resources/application.properties`:

```properties
# Gmail SMTP Configuration
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password-here
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.debug=true
```

**To get Gmail App Password:**
1. Enable 2FA on your Google Account
2. Go to: https://myaccount.google.com/apppasswords
3. Generate a new app password
4. Use it in the configuration

### Phase 3: Backend Setup

1. **Navigate to Backend Directory**
```powershell
cd d:\Coding\Gym-Management-System\Back-End\gym-erp
```

2. **Install Dependencies and Build**
```powershell
mvn clean install
```

3. **Run Backend**
```powershell
mvn spring-boot:run
```

**Expected Output:**
- Server starts on port 8080
- Database tables created automatically (ddl-auto=update)
- Log shows: "Started GymErpApplication in X seconds"

**Test Backend:**
```powershell
# Open browser or use curl
curl http://localhost:8080/api/members
```

### Phase 4: Frontend Setup

1. **Navigate to Frontend Directory**
```powershell
cd d:\Coding\Gym-Management-System\Front-End\Gym-Management
```

2. **Install Dependencies**
```powershell
npm install
```

3. **Run Frontend**
```powershell
npm run dev
```

**Expected Output:**
- Vite server starts on http://localhost:5173
- Browser opens automatically
- Login page loads

---

## 🧪 Testing the Application

### 1. Test Member Registration

**API Endpoint:** `POST /api/members/register`

**Test via Postman/cURL:**
```bash
curl -X POST http://localhost:8080/api/members/register \
  -F "memberId=MEM001" \
  -F "username=john_doe" \
  -F "password=Password123" \
  -F "email=john@example.com" \
  -F "firstName=John" \
  -F "lastName=Doe" \
  -F "phone=1234567890" \
  -F "dob=1990-01-01" \
  -F "age=34" \
  -F "gender=MALE" \
  -F "heightCm=175" \
  -F "weightKg=70"
```

### 2. Test Member Login

**API Endpoint:** `POST /api/members/login`

```bash
curl -X POST http://localhost:8080/api/members/login \
  -H "Content-Type: application/json" \
  -d '{"username":"john_doe","password":"Password123"}'
```

### 3. Test Frontend Integration

1. Open http://localhost:5173
2. Click "Sign Up" → "Member"
3. Fill registration form
4. Submit and verify redirect to dashboard

---

## 📁 Project Structure

### Backend Structure
```
Back-End/gym-erp/
├── src/main/java/com/gym/erp/
│   ├── GymErpApplication.java          # Main entry point
│   ├── configuration/                  # Config classes
│   │   ├── CorsConfig.java            # CORS configuration
│   │   ├── EmailConfig.java           # Email configuration
│   │   └── FirebaseConfig.java        # Firebase (disabled)
│   ├── controller/                     # REST API controllers (12)
│   │   ├── AdminController.java
│   │   ├── MemberController.java
│   │   ├── TrainerController.java
│   │   └── ... (9 more)
│   ├── entity/                         # JPA entities (12)
│   │   ├── Member.java
│   │   ├── Trainer.java
│   │   ├── Admin.java
│   │   └── ... (9 more)
│   ├── repository/                     # JPA repositories (12)
│   ├── service/                        # Business logic (14)
│   ├── payload/                        # DTOs (16)
│   └── exception/                      # Custom exceptions (4)
├── src/main/resources/
│   └── application.properties          # Configuration
└── pom.xml                             # Maven dependencies
```

### Frontend Structure
```
Front-End/Gym-Management/
├── src/
│   ├── API/ApiStore.js                 # API endpoints
│   ├── App.jsx                         # Root component
│   ├── routes.jsx                      # Route configuration
│   ├── components/                     # Reusable components
│   ├── layouts/                        # Layout components (Auth, Dashboard)
│   ├── pages/                          # Page components (36)
│   │   ├── auth/                       # Authentication pages
│   │   ├── dashboard/                  # Dashboard pages
│   │   │   ├── member/                 # Member dashboard
│   │   │   ├── trainer/                # Trainer dashboard
│   │   │   └── admin/                  # Admin dashboard
│   ├── store/                          # Redux store
│   │   ├── index.js                    # Store configuration
│   │   └── slices/                     # Redux slices (11)
│   ├── utils/                          # Utility functions
│   └── widgets/                        # UI widgets (8)
├── public/                             # Static assets
├── index.html                          # HTML template
├── vite.config.js                      # Vite configuration
├── tailwind.config.cjs                 # Tailwind configuration
└── package.json                        # npm dependencies
```

---

## 🔌 API Endpoints Reference

### Authentication
- `POST /api/members/register` - Register member
- `POST /api/members/login` - Member login
- `POST /api/members/forgot-password` - Forgot password
- `POST /api/members/verify-otp` - Verify OTP
- `POST /api/members/reset-password` - Reset password

### Trainers
- `POST /api/trainers/register` - Register trainer
- `POST /api/trainers/login` - Trainer login
- `GET /api/trainers` - Get all trainers
- `GET /api/trainers/{id}` - Get trainer by ID
- `PUT /api/trainers/{id}` - Update trainer
- `DELETE /api/trainers/{id}` - Delete trainer

### Admins
- `POST /api/admin/register` - Register admin
- `POST /api/admin/login` - Admin login
- `GET /api/admin/{id}` - Get admin by ID
- `PUT /api/admin/{id}` - Update admin

### Membership Plans
- `GET /api/membership-plans` - Get active plans
- `GET /api/membership-plans/all` - Get all plans
- `POST /api/membership-plans` - Create plan
- `PUT /api/membership-plans/{id}` - Update plan
- `PUT /api/membership-plans/{id}/deactivate` - Deactivate plan

### Memberships
- `POST /api/memberships/subscribe` - Subscribe to plan
- `GET /api/memberships/member/{memberId}` - Get member memberships
- `GET /api/memberships/active/{memberId}` - Get active membership
- `PUT /api/memberships/{id}/cancel` - Cancel membership

### Fitness Classes
- `GET /api/fitness-classes` - Get all classes
- `GET /api/fitness-classes/{id}` - Get class by ID
- `POST /api/fitness-classes` - Create class
- `PUT /api/fitness-classes/{id}` - Update class
- `GET /api/fitness-classes/trainer/{trainerId}` - Get trainer classes

### Class Bookings
- `POST /api/bookings` - Book a class
- `GET /api/bookings/member/{memberId}` - Get member bookings
- `GET /api/bookings/class/{classId}` - Get class bookings
- `PUT /api/bookings/{id}/cancel` - Cancel booking
- `PUT /api/bookings/{id}/attend` - Mark as attended

### BMI Records
- `POST /api/bmi` - Record BMI
- `GET /api/bmi/member/{memberId}` - Get BMI history
- `GET /api/bmi/member/{memberId}/recent` - Get recent BMI

### Workout History
- `POST /api/workout-history` - Log workout
- `GET /api/workout-history/member/{memberId}` - Get workouts
- `GET /api/workout-history/member/{memberId}/recent` - Get recent workouts
- `DELETE /api/workout-history/{id}` - Delete workout

### Diet Plans
- `POST /api/diet-plans` - Create diet plan
- `GET /api/diet-plans/member/{memberId}` - Get member diet plans
- `GET /api/diet-plans/member/{memberId}/latest` - Get latest diet plan
- `PUT /api/diet-plans/{id}` - Update diet plan
- `DELETE /api/diet-plans/{id}` - Delete diet plan

### Transactions
- `POST /api/transactions` - Record transaction
- `GET /api/transactions/member/{memberId}` - Get member transactions
- `GET /api/transactions` - Get all transactions

### Notifications
- `POST /api/notifications` - Create notification
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/{id}/read` - Mark as read
- `DELETE /api/notifications/{id}` - Delete notification

---

## 🐛 Common Issues & Solutions

### Issue: Maven command not found
**Solution:** Install Maven as shown in Prerequisites section

### Issue: MySQL connection refused
**Solution:** 
- Ensure MySQL service is running: `net start MySQL80`
- Verify database exists: `mysql -u root -p -e "SHOW DATABASES;"`
- Check credentials in application.properties

### Issue: Port 8080 already in use
**Solution:**
```powershell
# Find process using port 8080
netstat -ano | findstr :8080
# Kill the process (replace PID)
taskkill /PID <PID> /F
```

### Issue: Frontend can't connect to backend
**Solution:**
- Ensure backend is running on port 8080
- Check CORS configuration in CorsConfig.java
- Verify API_BASE_URL in ApiStore.js

### Issue: npm install fails
**Solution:**
```powershell
# Clear npm cache
npm cache clean --force
# Delete node_modules and package-lock.json
rm node_modules package-lock.json
# Install again
npm install
```

### Issue: Database tables not created
**Solution:**
- Check `spring.jpa.hibernate.ddl-auto=update` in application.properties
- Verify database connection
- Check backend logs for SQL errors

---

## 🚀 Running Both Services

### Option 1: Separate Terminals

**Terminal 1 (Backend):**
```powershell
cd d:\Coding\Gym-Management-System\Back-End\gym-erp
mvn spring-boot:run
```

**Terminal 2 (Frontend):**
```powershell
cd d:\Coding\Gym-Management-System\Front-End\Gym-Management
npm run dev
```

### Option 2: Background (PowerShell)

**Backend:**
```powershell
cd d:\Coding\Gym-Management-System\Back-End\gym-erp
Start-Process powershell -ArgumentList "-NoExit", "-Command", "mvn spring-boot:run"
```

**Frontend:**
```powershell
cd d:\Coding\Gym-Management-System\Front-End\Gym-Management
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"
```

---

## 📊 Features Overview

### Member Features
- Registration and login
- Profile management
- BMI tracking
- Workout history logging
- Diet plan viewing
- Fitness class booking
- Membership subscription
- Transaction history
- Notifications

### Trainer Features
- Registration and login
- Class management
- Attendance tracking
- Diet plan creation
- Member management
- Notifications

### Admin Features
- Registration and login
- Member management
- Trainer management
- Class management
- Membership plan management
- Transaction oversight
- Notification management

---

## 🔐 Security Recommendations

### Immediate Actions
1. **Hash passwords** - Use BCrypt or Argon2 instead of plain text
2. **Add JWT tokens** - Implement token-based authentication
3. **Add Spring Security** - Configure proper security filters
4. **Add input validation** - Strengthen API validation
5. **Add rate limiting** - Prevent brute force attacks

### Future Enhancements
1. **Add HTTPS** - Use SSL certificates
2. **Add CSRF protection** - Prevent cross-site request forgery
3. **Add audit logging** - Track all admin actions
4. **Add role-based access control** - Fine-grained permissions
5. **Add API documentation** - Use Swagger/OpenAPI

---

## 📝 Development Workflow

### Making Backend Changes
```powershell
cd d:\Coding\Gym-Management-System\Back-End\gym-erp
# Edit code
mvn spring-boot:run
# Changes auto-reload with devtools
```

### Making Frontend Changes
```powershell
cd d:\Coding\Gym-Management-System\Front-End\Gym-Management
# Edit code
npm run dev
# Changes auto-reload with Vite HMR
```

### Building for Production

**Backend:**
```powershell
cd d:\Coding\Gym-Management-System\Back-End\gym-erp
mvn clean package -DskipTests
# JAR created in target/ directory
java -jar target/gym-erp-0.0.1-SNAPSHOT.jar
```

**Frontend:**
```powershell
cd d:\Coding\Gym-Management-System\Front-End\Gym-Management
npm run build
# Build created in dist/ directory
npm run preview
```

---

## 📚 Additional Resources

- **Spring Boot Documentation:** https://spring.io/projects/spring-boot
- **React Documentation:** https://react.dev
- **Vite Documentation:** https://vitejs.dev
- **Tailwind CSS:** https://tailwindcss.com
- **Redux Toolkit:** https://redux-toolkit.js.org

---

## ✅ Pre-Startup Checklist

Before running the application, ensure:

- [ ] Maven is installed (`mvn --version`)
- [ ] Java 17 is installed (`java -version`)
- [ ] MySQL is installed and running (`mysql --version`)
- [ ] Database "gym" is created
- [ ] Backend application.properties configured
- [ ] Node.js is installed (`node --version`)
- [ ] npm is installed (`npm --version`)
- [ ] Frontend dependencies installed (`npm install`)

---

## 🎯 Quick Start Commands

```powershell
# 1. Start MySQL
net start MySQL80

# 2. Start Backend (Terminal 1)
cd d:\Coding\Gym-Management-System\Back-End\gym-erp
mvn spring-boot:run

# 3. Start Frontend (Terminal 2)
cd d:\Coding\Gym-Management-System\Front-End\Gym-Management
npm run dev

# 4. Open Browser
# Navigate to: http://localhost:5173
```

---

**Good luck with your Gym Management System! 🏋️‍♂️**
