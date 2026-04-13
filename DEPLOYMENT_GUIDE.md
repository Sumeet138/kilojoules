# 🚀 Free Tier Deployment Guide - Gym Management System

## Tech Stack Overview
- **Backend**: Spring Boot 3.2.7 (Java 17) + MySQL
- **Frontend**: React 18 + Vite + Tailwind CSS
- **Services**: Firebase Admin SDK, Email (SMTP)

---

## 📋 Recommended Free Tier Services

| Component | Service | Why |
|-----------|---------|-----|
| **Backend Hosting** | Render.com | Free tier supports Spring Boot JAR, 512MB RAM, auto-sleep after 15min |
| **Frontend Hosting** | Vercel / Netlify | Excellent React/Vite support, free SSL, CDN |
| **Database** | TiDB Cloud / PlanetScale | Free MySQL-compatible database (TiDB: 5GB, always free) |
| **File Storage** | Firebase Storage | Already integrated, free tier: 5GB storage |
| **Email** | Gmail SMTP | Already configured, free (2000 emails/day limit) |

---

## 🗺️ Deployment Architecture

```
User → Vercel (Frontend) → Render.com (Backend API) → TiDB Cloud (MySQL)
                                      ↓
                              Firebase (Storage/Auth)
```

---

## 📦 STEP-BY-STEP DEPLOYMENT

---

### **PHASE 1: Database Setup (TiDB Cloud)**

TiDB Cloud offers a free serverless MySQL-compatible database.

#### Steps:
1. **Sign up**: Go to [https://www.pingcap.com/tidb-cloud/](https://www.pingcap.com/tidb-cloud/)
2. **Create Cluster**:
   - Click "Create Cluster"
   - Select **Serverless** tier (Free)
   - Choose region closest to you (e.g., AWS us-east-1)
   - Click "Create"
3. **Get Connection Details**:
   - Go to cluster dashboard
   - Click "Connect" → Choose "General" tab
   - Note down:
     - **Host**: `xxxxx.xx.aws.tidbcloud.com`
     - **Port**: `4000`
     - **Username**: `xxxxx.root`
     - **Password**: (set during creation)
     - **Database name**: `gym` (create it manually via MySQL client or DBeaver)
4. **Create Database** (via MySQL Workbench/DBeaver/CLI):
   ```sql
   CREATE DATABASE gym;
   ```

---

### **PHASE 2: Backend Deployment (Render.com)**

#### Step 1: Prepare Your Backend Code

**A. Update `application.properties`** for production:

Create `src/main/resources/application-prod.properties`:
```properties
spring.application.name=gym-erp

# Production Database (TiDB Cloud)
spring.datasource.url=jdbc:mysql://<TIDB_HOST>:4000/gym?useSSL=true
spring.datasource.username=<TIDB_USERNAME>
spring.datasource.password=<TIDB_PASSWORD>
spring.jpa.hibernate.ddl-auto=update
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
spring.jpa.show-sql=false

# Jackson
spring.jackson.serialization.fail-on-empty-beans=false

# Email (use environment variables in production)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=${MAIL_USERNAME}
spring.mail.password=${MAIL_PASSWORD}
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true

# File upload
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=20MB

# Server port (Render sets PORT env variable)
server.port=${PORT:8080}
```

**B. Create `Procfile`** (in `Back-End/gym-erp/` root):
```
web: java -Dserver.port=$PORT -Dspring.profiles.active=prod -jar target/gym-erp-0.0.1-SNAPSHOT.jar
```

**C. Create `.gitignore`** entries (if not exists):
```
target/
*.jar
*.class
.env
application-local.properties
```

**D. Create `render.yaml`** (in `Back-End/gym-erp/` root):
```yaml
services:
  - type: web
    name: gym-erp-backend
    env: java
    buildCommand: mvn clean package -DskipTests
    startCommand: java -Dserver.port=$PORT -Dspring.profiles.active=prod -jar target/gym-erp-0.0.1-SNAPSHOT.jar
    envVars:
      - key: JAVA_VERSION
        value: 17
      - key: MAIL_USERNAME
        sync: false
      - key: MAIL_PASSWORD
        sync: false
      - key: SPRING_DATASOURCE_URL
        sync: false
      - key: SPRING_DATASOURCE_USERNAME
        sync: false
      - key: SPRING_DATASOURCE_PASSWORD
        sync: false
```

---

#### Step 2: Push Backend to GitHub

```bash
cd Back-End/gym-erp
git init
git add .
git commit -m "Initial backend commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

---

#### Step 3: Deploy to Render.com

1. **Sign up**: [https://render.com](https://render.com) (use GitHub login)
2. **Create Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `gym-erp-backend`
     - **Region**: Choose closest to your users
     - **Branch**: `main`
     - **Root Directory**: `Back-End/gym-erp`
     - **Runtime**: `Java`
     - **Build Command**: `mvn clean package -DskipTests`
     - **Start Command**: `java -Dserver.port=$PORT -Dspring.profiles.active=prod -jar target/gym-erp-0.0.1-SNAPSHOT.jar`
     - **Instance Type**: **Free**
3. **Add Environment Variables** (in Render dashboard → Environment):
   ```
   SPRING_DATASOURCE_URL=jdbc:mysql://<TIDB_HOST>:4000/gym?useSSL=true
   SPRING_DATASOURCE_USERNAME=<TIDB_USERNAME>
   SPRING_DATASOURCE_PASSWORD=<TIDB_PASSWORD>
   MAIL_USERNAME=your-email@gmail.com
   MAIL_PASSWORD=your-app-password
   SPRING_PROFILES_ACTIVE=prod
   ```
4. **Deploy**: Click "Deploy"
   - First deployment takes 5-10 minutes
   - Monitor logs in Render dashboard

**⚠️ Important Notes for Render Free Tier:**
- Service **sleeps after 15 minutes** of inactivity
- First request after sleep takes ~30 seconds to wake up
- 750 hours/month free (enough for 24/7 for one service)
- 512MB RAM limit

---

### **PHASE 3: Firebase Setup (If Using Storage)**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing
3. **Enable Storage**:
   - Go to "Storage" → "Get Started"
   - Start in **test mode** (change rules later for production)
4. **Download Service Account Key**:
   - Project Settings → Service Accounts
   - Click "Generate new private key"
   - Save as `firebase-service-account.json`
5. **Add to Render Environment Variables**:
   - Don't upload the JSON file to GitHub!
   - Instead, paste the entire JSON content as an env var:
     ```
     FIREBASE_CREDENTIALS_JSON={ "type": "service_account", ... }
     ```
6. **Update your Firebase config code** to use env variable instead of file path

---

### **PHASE 4: Frontend Deployment (Vercel)**

#### Step 1: Prepare Frontend Code

**A. Create environment-based API URL**

Create `.env.production` (in `Front-End/Gym-Management/`):
```env
VITE_API_BASE_URL=https://gym-erp-backend.onrender.com/api
```

**B. Update API configuration**

Update `src/configs/index.js`:
```javascript
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";
```

Update `src/API/ApiStore.js`:
```javascript
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";
```

**C. Create `vercel.json`** (in `Front-End/Gym-Management/` root):
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```
This ensures React Router works correctly on Vercel.

**D. Update `vite.config.js`** for production:
```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
  },
});
```

---

#### Step 2: Push Frontend to GitHub

```bash
cd Front-End/Gym-Management
git init
git add .
git commit -m "Initial frontend commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

---

#### Step 3: Deploy to Vercel

1. **Sign up**: [https://vercel.com](https://vercel.com) (use GitHub login)
2. **Import Project**:
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Configure:
     - **Framework Preset**: `Vite`
     - **Root Directory**: `Front-End/Gym-Management`
     - **Build Command**: `vite build` (auto-detected)
     - **Output Directory**: `dist` (auto-detected)
     - **Install Command**: `npm install` (auto-detected)
3. **Add Environment Variables** (optional, if using .env.production):
   ```
   VITE_API_BASE_URL=https://gym-erp-backend.onrender.com/api
   ```
4. **Deploy**: Click "Deploy"
   - Deployment takes ~2-3 minutes
   - You get a URL like: `https://gym-management.vercel.app`

---

### **PHASE 5: CORS Configuration (Critical!)**

Your backend needs to allow requests from your frontend domain.

**Add to your Spring Boot security config** (create/update `SecurityConfig.java`):

```java
package com.gym.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        
        // Add your Vercel URL here
        config.setAllowedOrigins(List.of(
            "http://localhost:5173",  // Local dev
            "https://your-app.vercel.app"  // Production
        ));
        
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", config);
        return new CorsFilter(source);
    }
}
```

---

### **PHASE 6: Testing & Verification**

#### 1. **Test Backend**
```bash
# Check if backend is running
curl https://gym-erp-backend.onrender.com/api/health

# Check logs in Render dashboard
```

#### 2. **Test Frontend**
- Open your Vercel URL in browser
- Open DevTools (F12) → Network tab
- Verify API calls are going to the correct backend URL
- Check for CORS errors in Console

#### 3. **Test Database Connection**
- Check Render logs for Hibernate DDL statements
- Verify tables are created in TiDB Cloud dashboard

---

## 🔧 Common Issues & Solutions

### **Issue 1: Backend sleeps on Render free tier**
**Solution**: 
- Use [UptimeRobot](https://uptimerobot.com/) to ping your backend every 10 minutes
- Free tier: 50 monitors, keeps backend awake

### **Issue 2: CORS errors**
**Solution**: 
- Ensure your frontend URL is in `CorsConfig.java`
- Re-deploy backend after changes

### **Issue 3: Database connection timeout**
**Solution**: 
- Add to `application-prod.properties`:
  ```properties
  spring.datasource.hikari.connection-timeout=30000
  spring.datasource.hikari.maximum-pool-size=5
  ```

### **Issue 4: File upload fails**
**Solution**: 
- Ensure Firebase credentials are set in environment variables
- Check Firebase Storage rules allow uploads

### **Issue 5: Email not sending**
**Solution**: 
- Use Gmail App Password (not regular password)
- Enable 2FA on Gmail first, then generate App Password
- Google Account → Security → App Passwords

---

## 💰 Cost Breakdown

| Service | Free Tier Limit | Your Usage | Cost |
|---------|----------------|------------|------|
| **Render** | 750 hours/month | ~720 hours | **$0** |
| **Vercel** | Unlimited deployments | 1 deployment | **$0** |
| **TiDB Cloud** | 5GB storage, 50M RU/month | ~100MB | **$0** |
| **Firebase** | 5GB storage, 1GB/day downloads | ~500MB | **$0** |
| **Gmail SMTP** | 2000 emails/day | ~100/month | **$0** |
| **Total** | | | **$0/month** 🎉 |

---

## 🚨 Important Limitations of Free Tier

1. **Render backend sleeps** after 15 min inactivity (30s wake-up time)
2. **Render spins down** if you exceed 750 hours
3. **TiDB Cloud** has request unit limits (50M RU/month)
4. **No custom domain** on Vercel free tier (can add later)
5. **Limited support** on all free tiers

---

## 📈 Upgrade Path (When You Need More)

If your gym grows, consider:
- **Render**: $7/month (always-on, 512MB RAM)
- **Railway.app**: $5/month (better performance than Render free)
- **PlanetScale**: $9/month (Hobby plan, 5GB database)
- **Custom domain**: $10/year (Namecheap)

---

## 🔄 Deployment Workflow (After Initial Setup)

### Deploy Backend Updates:
```bash
cd Back-End/gym-erp
git add .
git commit -m "Update backend feature"
git push origin main
# Render auto-deploys on push to main branch
```

### Deploy Frontend Updates:
```bash
cd Front-End/Gym-Management
git add .
git commit -m "Update frontend UI"
git push origin main
# Vercel auto-deploys on push to main branch
```

---

## 📚 Quick Reference Commands

### Build Backend:
```bash
cd Back-End/gym-erp
mvn clean package -DskipTests
```

### Build Frontend:
```bash
cd Front-End/Gym-Management
npm run build
npm run preview  # Test production build locally
```

### Test Locally with Production Config:
```bash
# Backend
mvn spring-boot:run -Dspring-boot.run.profiles=prod

# Frontend (set env var first)
# Windows CMD:
set VITE_API_BASE_URL=http://localhost:8080/api
npm run dev
# PowerShell:
$env:VITE_API_BASE_URL="http://localhost:8080/api"
npm run dev
```

---

## ✅ Pre-Deployment Checklist

- [ ] TiDB Cloud database created and credentials noted
- [ ] Backend `application-prod.properties` configured
- [ ] Environment variables added to Render
- [ ] CORS configuration updated with production URLs
- [ ] Firebase credentials added as environment variable (not file)
- [ ] Frontend `.env.production` created with backend URL
- [ ] Both repositories pushed to GitHub
- [ ] Backend deployed and logs show successful startup
- [ ] Frontend deployed and can make API calls
- [ ] Test user registration/login flow
- [ ] Test file upload (if applicable)
- [ ] Test email sending (if applicable)

---

## 🎯 Alternative Free Options

If Render doesn't work for you:

### Backend Alternatives:
1. **Railway.app**: $5 credit/month (easier setup than Render)
2. **Fly.io**: 3 free VMs (256MB RAM each)
3. **Oracle Cloud Free Tier**: 2 VMs (1GB RAM each) - always free
4. **Google Cloud Run**: Free tier (2M requests/month)

### Frontend Alternatives:
1. **Netlify**: Same as Vercel, free tier
2. **GitHub Pages**: Free, but needs manual build setup
3. **Cloudflare Pages**: Free, fast CDN

### Database Alternatives:
1. **PlanetScale**: 5GB free (MySQL-compatible)
2. **Supabase**: 500MB free (PostgreSQL, but you'd need to change from MySQL)
3. **CockroachDB Serverless**: 5GB free

---

## 📞 Need Help?

If you encounter issues:
1. Check Render/Vercel deployment logs
2. Test backend endpoints with Postman/cURL
3. Check browser DevTools for frontend errors
4. Verify database connection with MySQL client
5. Ensure all environment variables are set correctly

---

**Good luck with your deployment! 🚀**

*This guide is optimized for zero-cost deployment while maintaining production-ready quality.*
