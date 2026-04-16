# 🏋️ Kilojoules - Gym Management System

A comprehensive, full-stack Gym Management System designed to streamline gym operations, member management, trainer coordination, and administrative oversight.

---

## 📑 Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [System Architecture](#system-architecture)
4. [Database Schema](#database-schema)
5. [API Documentation](#api-documentation)
6. [Features](#features)
7. [Project Structure](#project-structure)
8. [Setup Instructions](#setup-instructions)
9. [Development Workflow](#development-workflow)
10. [Deployment Guide](#deployment-guide)
11. [Security Considerations](#security-considerations)
12. [Future Enhancements](#future-enhancements)

---

## 📖 Project Overview

**Kilojoules** is a modern Gym Management System built with a React frontend and Spring Boot backend. It provides role-based access for three user types:

- **Members** - Track workouts, book classes, view BMI history, manage memberships
- **Trainers** - Manage classes, create diet plans, track member progress
- **Admins** - Oversee operations, manage users, handle transactions

### Key Objectives

- Centralized management of gym operations
- Real-time tracking of member activities
- Streamlined booking and membership processes
- Data-driven insights through analytics
- Modern, responsive user interface

---

## 🛠️ Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.2.0 | UI Framework |
| Vite | 4.5.0 | Build Tool & Dev Server |
| Tailwind CSS | 3.3.4 | Styling Framework |
| Material Tailwind | 2.1.4 | UI Component Library |
| Redux Toolkit | 2.2.7 | State Management |
| React Router | 6.17.0 | Client-side Routing |
| Axios | 1.7.4 | HTTP Client |
| React Icons | 5.3.0 | Icon Library (Feather) |
| ApexCharts | 3.44.0 | Data Visualization |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Spring Boot | 3.2.7 | Application Framework |
| Java | 17 | Programming Language |
| Spring Data JPA | 3.2.7 | ORM & Data Access |
| MySQL | 8.0+ | Relational Database |
| Spring Boot Mail | 3.2.7 | Email Services |
| Lombok | Latest | Code Generation |
| Maven | Latest | Build Tool |

### Development Tools

- **Maven** - Backend dependency management and build automation
- **npm** - Frontend package management
- **Git** - Version control

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT SIDE                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   React App  │  │   Redux      │  │  React Router│         │
│  │   (Vite)     │  │   Toolkit    │  │  (Navigation)│         │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘         │
│         │                 │                 │                  │
│         └─────────────────┴─────────────────┘                  │
│                           │                                      │
│                           ▼                                      │
│                  HTTP/REST API Calls                           │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SERVER SIDE                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Spring     │  │   Spring     │  │   Spring     │         │
│  │   Boot Web   │  │   Data JPA   │  │   Mail       │         │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘         │
│         │                 │                 │                  │
│         └─────────────────┴─────────────────┘                  │
│                           │                                      │
│                           ▼                                      │
│  ┌──────────────────────────────────────────┐                 │
│  │     REST Controllers (12 Endpoints)       │                 │
│  │     Service Layer (Business Logic)       │                 │
│  │     Repository Layer (Data Access)       │                 │
│  └──────────────────┬───────────────────────┘                 │
│                     │                                          │
│                     ▼                                          │
│  ┌──────────────────────────────────────────┐                 │
│  │         MySQL Database                    │                 │
│  │    (12 Tables with Relationships)         │                 │
│  └──────────────────────────────────────────┘                 │
└─────────────────────────────────────────────────────────────────┘
```

### Architecture Pattern

**Three-Tier Architecture:**

1. **Presentation Layer** (Frontend)
   - React components for UI
   - Redux for state management
   - React Router for navigation
   - Axios for API communication

2. **Business Logic Layer** (Backend)
   - Spring Boot Controllers (REST API)
   - Service classes for business logic
   - DTOs for data transfer
   - Exception handling

3. **Data Access Layer** (Backend)
   - Spring Data JPA Repositories
   - Entity mappings
   - MySQL database

### Data Flow

```
User Action → React Component → Redux Action → API Call (Axios)
    ↓
Spring Controller → Service Layer → Repository → Database
    ↓
Database Query Result → Repository → Service → Controller → JSON Response
    ↓
Axios Response → Redux State Update → Component Re-render → UI Update
```

---

## 🗄️ Database Schema

### Entity Relationships

```
┌─────────────┐       ┌──────────────┐       ┌─────────────┐
│   Admin     │       │   Member     │       │  Trainer    │
└─────────────┘       └──────────────┘       └─────────────┘
                           │                       │
                           │                       │
                           ▼                       ▼
                    ┌──────────────┐       ┌─────────────┐
                    │  Membership  │       │ Fitness     │
                    │  (Member)    │       │  Class      │
                    └──────────────┘       └─────────────┘
                           │                       │
                           │                       │
                           ▼                       ▼
                    ┌──────────────┐       ┌─────────────┐
                    │   Booking    │◄──────┤  Class      │
                    └──────────────┘       └─────────────┘
                           │
                           │
                           ▼
                    ┌──────────────┐
                    │ Transaction  │
                    └──────────────┘

┌─────────────┐       ┌──────────────┐       ┌─────────────┐
│   BMI       │       │   Workout    │       │   Diet      │
│   Record    │       │   History    │       │   Plan      │
└─────────────┘       └──────────────┘       └─────────────┘
        │                       │                       │
        └───────────────────────┴───────────────────────┘
                                │
                                ▼
                         ┌──────────────┐
                         │   Member     │
                         └──────────────┘
```

### Core Entities

| Entity | Primary Key | Key Fields | Relationships |
|--------|-------------|------------|---------------|
| **Admin** | adminId | username, email, firstName, lastName | - |
| **Member** | memberId | username, email, firstName, lastName, dob, gender, heightCm, weightKg | Membership(s), BMIRecord(s), WorkoutHistory(s), Booking(s), Transaction(s), DietPlan(s) |
| **Trainer** | trainerId | username, email, firstName, lastName, specialization, certificationLevel, bio | FitnessClass(es) |
| **MembershipPlan** | planId | planName, planType, price, durationMonths, features | MemberMembership(s) |
| **MemberMembership** | membershipId | startDate, endDate, status, paymentMethod | Member, MembershipPlan, Transaction(s) |
| **FitnessClass** | classId | className, classType, schedule, capacity, price | Trainer, Booking(s) |
| **ClassBooking** | bookingId | bookingDate, status, member, fitnessClass | Member, FitnessClass |
| **BMIRecord** | bmiId | bmi, category, recordedDate | Member |
| **WorkoutHistory** | workoutId | exerciseName, sets, reps, weightKg, workoutDate | Member |
| **DietPlan** | dietPlanId | planName, description, createdDate, member | Member |
| **Transaction** | transactionId | amount, paymentMethod, paymentStatus, transactionDate | Member, MemberMembership |
| **Notification** | notificationId | message, recipientType, recipientId, isRead | - |

### Enums

- **Gender**: MALE, FEMALE, OTHER
- **PlanType**: MONTHLY, QUARTERLY, YEARLY
- **MembershipStatus**: ACTIVE, EXPIRED, CANCELLED
- **ClassType**: YOGA, HIIT, STRENGTH, CARDIO, SPIN, PILATES, CROSSFIT
- **BookingStatus**: BOOKED, ATTENDED, CANCELLED
- **BMICategory**: UNDERWEIGHT, NORMAL, OVERWEIGHT, OBESE
- **PaymentMethod**: CREDIT_CARD, DEBIT_CARD, CASH, UPI
- **PaymentStatus**: PENDING, COMPLETED, FAILED, REFUNDED
- **TransactionStatus**: SUCCESS, FAILED, PENDING
- **RecipientType**: MEMBER, TRAINER, ADMIN

---

## 🔌 API Documentation

### Base URL
```
http://localhost:8080/api
```

### Authentication Endpoints

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| POST | `/members/register` | Register new member | FormData (memberId, username, password, email, firstName, lastName, phone, dob, age, gender, heightCm, weightKg, healthConditions, fitnessGoals, trainerPreference) |
| POST | `/members/login` | Member login | {username, password} |
| POST | `/members/forgot-password` | Request OTP | {email} |
| POST | `/members/verify-otp` | Verify OTP | {email, otp} |
| POST | `/members/reset-password` | Reset password | {email, otp, newPassword} |
| POST | `/trainers/register` | Register trainer | FormData (trainerId, username, password, email, firstName, lastName, phone, specialization, certificationLevel, bio) |
| POST | `/trainers/login` | Trainer login | {username, password} |
| POST | `/admin/register` | Register admin | FormData (adminId, username, password, email, firstName, lastName, phone) |
| POST | `/admin/login` | Admin login | {username, password} |

### Member Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/members` | Get all members |
| GET | `/members/{id}` | Get member by ID |
| PUT | `/members/{id}` | Update member |
| DELETE | `/members/{id}` | Delete member |

### Trainer Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/trainers` | Get all trainers |
| GET | `/trainers/{id}` | Get trainer by ID |
| PUT | `/trainers/{id}` | Update trainer |
| DELETE | `/trainers/{id}` | Delete trainer |

### Admin Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/{id}` | Get admin by ID |
| PUT | `/admin/{id}` | Update admin |

### Membership Plans

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/membership-plans` | Get active plans |
| GET | `/membership-plans/all` | Get all plans |
| POST | `/membership-plans` | Create plan |
| PUT | `/membership-plans/{id}` | Update plan |
| PUT | `/membership-plans/{id}/deactivate` | Deactivate plan |

### Memberships

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/memberships/subscribe` | Subscribe to plan |
| GET | `/memberships/member/{memberId}` | Get member memberships |
| GET | `/memberships/active/{memberId}` | Get active membership |
| PUT | `/memberships/{id}/cancel` | Cancel membership |

### Fitness Classes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/fitness-classes` | Get all classes |
| GET | `/fitness-classes/{id}` | Get class by ID |
| POST | `/fitness-classes` | Create class |
| PUT | `/fitness-classes/{id}` | Update class |
| GET | `/fitness-classes/trainer/{trainerId}` | Get trainer classes |

### Class Bookings

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/bookings` | Book a class |
| GET | `/bookings/member/{memberId}` | Get member bookings |
| GET | `/bookings/class/{classId}` | Get class bookings |
| PUT | `/bookings/{id}/cancel` | Cancel booking |
| PUT | `/bookings/{id}/attend` | Mark as attended |

### BMI Records

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/bmi` | Record BMI |
| GET | `/bmi/member/{memberId}` | Get BMI history |
| GET | `/bmi/member/{memberId}/recent` | Get recent BMI |

### Workout History

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/workout-history` | Log workout |
| GET | `/workout-history/member/{memberId}` | Get workouts |
| GET | `/workout-history/member/{memberId}/recent` | Get recent workouts |
| DELETE | `/workout-history/{id}` | Delete workout |

### Diet Plans

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/diet-plans` | Create diet plan |
| GET | `/diet-plans/member/{memberId}` | Get member diet plans |
| GET | `/diet-plans/member/{memberId}/latest` | Get latest diet plan |
| PUT | `/diet-plans/{id}` | Update diet plan |
| DELETE | `/diet-plans/{id}` | Delete diet plan |

### Transactions

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/transactions` | Record transaction |
| GET | `/transactions/member/{memberId}` | Get member transactions |
| GET | `/transactions` | Get all transactions |

### Notifications

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/notifications` | Create notification |
| GET | `/notifications` | Get notifications |
| PUT | `/notifications/{id}/read` | Mark as read |
| DELETE | `/notifications/{id}` | Delete notification |

---

## ✨ Features

### Member Features

| Feature | Description |
|---------|-------------|
| **Registration & Login** | Secure authentication with role-based access |
| **Profile Management** | View and update personal information, health conditions, fitness goals |
| **BMI Tracking** | Log BMI records with automatic category classification |
| **Workout Logging** | Track exercise history with sets, reps, and weights |
| **Diet Plans** | View personalized diet plans created by trainers |
| **Class Booking** | Browse and book fitness classes with real-time availability |
| **Membership Management** | Subscribe to plans, view active membership, renewal alerts |
| **Transaction History** | View payment history and receipts |
| **Notifications** | Receive updates on bookings, membership, and announcements |

### Trainer Features

| Feature | Description |
|---------|-------------|
| **Registration & Login** | Secure authentication for trainers |
| **Class Management** | Create, update, and manage fitness classes |
| **Attendance Tracking** | Mark member attendance for booked classes |
| **Diet Plan Creation** | Create personalized diet plans for members |
| **Member Management** | View assigned members and their progress |
| **Notifications** | Send and receive system notifications |

### Admin Features

| Feature | Description |
|---------|-------------|
| **Registration & Login** | Secure authentication for administrators |
| **Member Oversight** | View, manage, and deactivate member accounts |
| **Trainer Management** | Manage trainer accounts and assignments |
| **Class Management** | Oversee all fitness classes and schedules |
| **Membership Plans** | Create, update, and deactivate membership plans |
| **Transaction Oversight** | View all transactions and revenue analytics |
| **Notification Management** | Send system-wide notifications |
| **Dashboard Analytics** | View statistics on members, trainers, revenue, and classes |

---

## 📁 Project Structure

### Backend Structure

```
Back-End/gym-erp/
├── src/main/java/com/gym/erp/
│   ├── GymErpApplication.java              # Main Spring Boot application
│   ├── configuration/                      # Configuration classes
│   │   ├── CorsConfig.java                 # CORS configuration
│   │   ├── EmailConfig.java                # Email service configuration
│   │   └── FirebaseConfig.java             # Firebase (currently disabled)
│   ├── controller/                         # REST API controllers (12)
│   │   ├── AdminController.java
│   │   ├── BMIRecordController.java
│   │   ├── ClassBookingController.java
│   │   ├── DietPlanController.java
│   │   ├── FitnessClassController.java
│   │   ├── MemberController.java
│   │   ├── MemberMembershipController.java
│   │   ├── MembershipPlanController.java
│   │   ├── NotificationController.java
│   │   ├── TrainerController.java
│   │   ├── TransactionController.java
│   │   └── WorkoutHistoryController.java
│   ├── entity/                             # JPA entities (12)
│   │   ├── Admin.java
│   │   ├── BMIRecord.java
│   │   ├── ClassBooking.java
│   │   ├── DietPlan.java
│   │   ├── FitnessClass.java
│   │   ├── Member.java
│   │   ├── MemberMembership.java
│   │   ├── MembershipPlan.java
│   │   ├── Notification.java
│   │   ├── Trainer.java
│   │   ├── Transaction.java
│   │   ├── WorkoutHistory.java
│   │   └── enums/                          # Enum definitions (9)
│   │       ├── BMICategory.java
│   │       ├── BookingStatus.java
│   │       ├── ClassType.java
│   │       ├── Gender.java
│   │       ├── MembershipStatus.java
│   │       ├── PaymentMethod.java
│   │       ├── PaymentStatus.java
│   │       ├── PlanType.java
│   │       ├── RecipientType.java
│   │       └── TransactionStatus.java
│   ├── repository/                         # JPA repositories (12)
│   │   ├── AdminRepository.java
│   │   ├── BMIRecordRepository.java
│   │   ├── ClassBookingRepository.java
│   │   ├── DietPlanRepository.java
│   │   ├── FitnessClassRepository.java
│   │   ├── MemberMembershipRepository.java
│   │   ├── MemberRepository.java
│   │   ├── MembershipPlanRepository.java
│   │   ├── NotificationRepository.java
│   │   ├── TrainerRepository.java
│   │   ├── TransactionRepository.java
│   │   └── WorkoutHistoryRepository.java
│   ├── service/                            # Business logic (14)
│   │   ├── AdminService.java
│   │   ├── BMIRecordService.java
│   │   ├── ClassBookingService.java
│   │   ├── DietPlanService.java
│   │   ├── EmailService.java
│   │   ├── FitnessClassService.java
│   │   ├── MemberMembershipService.java
│   │   ├── MemberService.java
│   │   ├── MembershipPlanService.java
│   │   ├── NotificationService.java
│   │   ├── TrainerService.java
│   │   ├── TransactionService.java
│   │   └── WorkoutHistoryService.java
│   ├── payload/                            # Data Transfer Objects (16)
│   │   ├── AuthResponse.java
│   │   ├── LoginRequest.java
│   │   ├── BookingRequest.java
│   │   ├── BMIDto.java
│   │   ├── ClassBookingDto.java
│   │   ├── DietPlanDto.java
│   │   ├── FitnessClassDto.java
│   │   ├── MemberDto.java
│   │   ├── MembershipDto.java
│   │   ├── MembershipPlanDto.java
│   │   ├── NotificationDto.java
│   │   ├── OtpRequest.java
│   │   ├── OtpVerificationRequest.java
│   │   ├── PasswordResetRequest.java
│   │   ├── TrainerDto.java
│   │   ├── TransactionDto.java
│   │   └── WorkoutDto.java
│   └── exception/                          # Custom exceptions (4)
│       ├── ResourceNotFoundException.java
│       ├── AuthenticationException.java
│       ├── BookingException.java
│       └── MembershipException.java
├── src/main/resources/
│   └── application.properties               # Application configuration
├── src/test/                               # Test classes
└── pom.xml                                 # Maven dependencies
```

### Frontend Structure

```
Front-End/Gym-Management/
├── src/
│   ├── API/
│   │   └── ApiStore.js                     # Centralized API endpoints
│   ├── App.jsx                             # Root React component
│   ├── main.jsx                            # Application entry point
│   ├── routes.jsx                          # React Router configuration
│   ├── components/                         # Reusable components
│   │   └── TestAutoFillButton.jsx          # Auto-fill for testing
│   ├── configs/
│   │   └── index.js                        # Configuration constants
│   ├── layouts/                            # Layout components
│   │   ├── auth.jsx                        # Authentication layout (split-screen)
│   │   └── dashboard.jsx                   # Dashboard layout (sidebar + navbar)
│   ├── pages/                              # Page components
│   │   ├── auth/                           # Authentication pages
│   │   │   ├── LoginTypeSelection.jsx      # Role selection for login
│   │   │   ├── SignUpTypeSelection.jsx     # Role selection for signup
│   │   │   ├── ForgotPasswordFlow.jsx      # Password reset flow
│   │   │   ├── member/
│   │   │   │   ├── MemberSignIn.jsx
│   │   │   │   └── MemberSignUp.jsx
│   │   │   ├── trainer/
│   │   │   │   ├── TrainerSignIn.jsx
│   │   │   │   └── TrainerSignUp.jsx
│   │   │   └── admin/
│   │   │       ├── AdminSignIn.jsx
│   │   │       └── AdminSignUp.jsx
│   │   ├── dashboard/                      # Dashboard pages
│   │   │   ├── member/
│   │   │   │   ├── MemberHome.jsx
│   │   │   │   ├── BookClasses.jsx
│   │   │   │   ├── BMITracker.jsx
│   │   │   │   ├── MemberDietPlans.jsx
│   │   │   │   ├── MemberMembership.jsx
│   │   │   │   ├── MemberNotifications.jsx
│   │   │   │   ├── MemberTransactions.jsx
│   │   │   │   ├── MyBookings.jsx
│   │   │   │   └── WorkoutHistory.jsx
│   │   │   ├── trainer/
│   │   │   │   ├── TrainerHome.jsx
│   │   │   │   ├── TrainerClasses.jsx
│   │   │   │   ├── TrainerDietPlans.jsx
│   │   │   │   ├── TrainerMembers.jsx
│   │   │   │   └── TrainerNotifications.jsx
│   │   │   └── admin/
│   │   │       ├── AdminHome.jsx
│   │   │       ├── AdminMemberships.jsx
│   │   │       ├── AdminNotifications.jsx
│   │   │       └── AdminTransactions.jsx
│   │   └── SystemDesign.jsx                # System design documentation page
│   ├── store/                              # Redux store
│   │   ├── index.js                        # Store configuration
│   │   └── slices/                         # Redux slices (11)
│   │       ├── adminSlice.js
│   │       ├── bmiRecordSlice.js
│   │       ├── bookingSlice.js
│   │       ├── classSlice.js
│   │       ├── dietPlanSlice.js
│   │       ├── memberSlice.js
│   │       ├── membershipSlice.js
│   │       ├── membershipPlanSlice.js
│   │       ├── notificationSlice.js
│   │       ├── trainerSlice.js
│   │       ├── transactionSlice.js
│   │       └── workoutSlice.js
│   ├── utils/                              # Utility functions
│   │   └── ProtectedRoute.js               # Route protection wrapper
│   └── widgets/                            # UI widgets
│       ├── cards/
│       │   └── statistics-card.jsx          # Statistics display card
│       ├── charts/
│       │   └── statistics-chart.jsx         # Chart component
│       └── layout/
│           ├── sidenav.jsx                  # Sidebar navigation
│           ├── dashboard-navbar.jsx        # Top navigation bar
│           └── footer.jsx                   # Footer component
├── public/                                  # Static assets
├── index.html                               # HTML template
├── vite.config.js                           # Vite configuration
├── tailwind.config.cjs                      # Tailwind CSS configuration
└── package.json                             # npm dependencies
```

---

## 🚀 Setup Instructions

### Prerequisites

- **Java 17** or higher
- **Maven 3.6+**
- **MySQL 8.0+**
- **Node.js 18+**
- **npm 9+**

### 1. Database Setup

```sql
-- Create database
CREATE DATABASE gym;

-- Use the database
USE gym;

-- Verify
SHOW DATABASES;
```

### 2. Backend Configuration

Edit `Back-End/gym-erp/src/main/resources/application.properties`:

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/gym
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
spring.jpa.hibernate.ddl-auto=update
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
spring.jpa.show-sql=true

# Email Configuration (Optional)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

### 3. Backend Setup

```bash
cd Back-End/gym-erp

# Install dependencies
mvn clean install

# Run the application
mvn spring-boot:run
```

Backend will start on `http://localhost:8080`

### 4. Frontend Setup

```bash
cd Front-End/Gym-Management

# Install dependencies
npm install

# Run the development server
npm run dev
```

Frontend will start on `http://localhost:5173`

### 5. Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

---

## 💻 Development Workflow

### Backend Development

```bash
cd Back-End/gym-erp

# Make changes to code
# Changes auto-reload with Spring Boot DevTools

# Run tests
mvn test

# Build for production
mvn clean package -DskipTests

# Run JAR
java -jar target/gym-erp-0.0.1-SNAPSHOT.jar
```

### Frontend Development

```bash
cd Front-End/Gym-Management

# Make changes to code
# Changes auto-reload with Vite HMR

# Run tests
npm test

# Build for production
npm run build

# Preview production build
npm run preview
```

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes
git add .
git commit -m "feat: add your feature"

# Push to remote
git push origin feature/your-feature-name

# Create pull request
# Merge to main
```

---

## 🌐 Deployment Guide

### Backend Deployment (Production)

1. **Build the Application**
```bash
cd Back-End/gym-erp
mvn clean package -DskipTests
```

2. **Configure Production Database**
```properties
# application-prod.properties
spring.datasource.url=jdbc:mysql://your-production-host:3306/gym
spring.datasource.username=prod_user
spring.datasource.password=secure_password
```

3. **Run with Production Profile**
```bash
java -jar target/gym-erp-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod
```

### Frontend Deployment (Production)

1. **Build the Application**
```bash
cd Front-End/Gym-Management
npm run build
```

2. **Deploy Build Artifacts**
- Copy `dist/` folder to your web server
- Configure web server (Nginx/Apache) to serve static files
- Set up reverse proxy to backend API

### Nginx Configuration Example

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /var/www/kilojoules/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 🔒 Security Considerations

### Current Security Measures

- **CORS Configuration** - Restricted to allowed origins
- **Input Validation** - Spring Validation on request bodies
- **SQL Injection Protection** - JPA/Hibernate parameterized queries

### Recommended Security Enhancements

1. **Password Hashing**
   - Implement BCrypt or Argon2 for password hashing
   - Remove plain-text password storage

2. **JWT Authentication**
   - Implement JWT tokens for secure authentication
   - Add token expiration and refresh mechanism

3. **Spring Security**
   - Configure Spring Security filters
   - Add role-based access control (RBAC)
   - Implement CSRF protection

4. **HTTPS/SSL**
   - Enable HTTPS for production
   - Use SSL certificates

5. **Rate Limiting**
   - Implement API rate limiting
   - Prevent brute force attacks

6. **API Documentation**
   - Add Swagger/OpenAPI documentation
   - Secure API endpoints

7. **Audit Logging**
   - Log all admin actions
   - Track sensitive operations

---

## 🔮 Future Enhancements

### Planned Features

- [ ] **Mobile Application** - React Native app for iOS and Android
- [ ] **Payment Gateway Integration** - Stripe/Razorpay integration
- [ ] **Real-time Notifications** - WebSocket-based push notifications
- [ ] **Video Tutorials** - Integration with video streaming
- [ ] **AI Recommendations** - ML-based workout and diet recommendations
- [ ] **Social Features** - Community forums, leaderboards
- [ ] **Wearable Integration** - Fitbit, Apple Watch integration
- [ ] **Advanced Analytics** - Power BI/Tableau integration
- [ ] **Multi-branch Support** - Manage multiple gym locations
- [ ] **Inventory Management** - Equipment and supplies tracking

### Technical Improvements

- [ ] **Microservices Architecture** - Split into separate services
- [ ] **Docker Containerization** - Docker and Docker Compose setup
- [ ] **Kubernetes Deployment** - K8s orchestration
- [ ] **Caching Layer** - Redis for performance optimization
- [ ] **Message Queue** - RabbitMQ/Kafka for async processing
- [ ] **Automated Testing** - CI/CD pipeline with GitHub Actions
- [ ] **Monitoring** - Prometheus/Grafana monitoring
- [ ] **Logging** - ELK Stack for centralized logging

---

## 📞 Support & Contact

For issues, questions, or contributions:

- **GitHub Repository**: https://github.com/Sumeet138/kilojoules
- **Documentation**: See `STARTUP_GUIDE.md` and `DEPLOYMENT_GUIDE.md`

---

## 📄 License

This project is developed for educational purposes.

---

## 👥 Contributors

- **Sumeet** - Full Stack Developer

---

**Built with ❤️ for the fitness community**
