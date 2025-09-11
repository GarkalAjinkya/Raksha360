# Raksha360

🛡️ **Raksha360 - A Comprehensive Women's Safety Platform**

Raksha360 is a cutting-edge women's safety application designed to provide protection, emergency assistance, and peace of mind through advanced technology and AI-powered solutions.

## 🎯 Project Overview

This project aims to create a complete ecosystem for women's safety, combining mobile technology, artificial intelligence, and robust backend services to deliver real-time protection and emergency response capabilities.

## 📁 Project Structure

```
Raksha360/
├── README.md                 # Project documentation (this file)
├── ai-ml-server/            # AI/ML backend services
├── backend-api/             # Core API and business logic
└── mobile-app/              # Mobile application frontend
```

### 🌿 Branch Organization

This project follows a **feature-branch development strategy** with separate branches for each major component:

- **`main`** - Main/production branch with project documentation and overall coordination
- **`origin/ai-ml`** - AI/ML server development branch
  - Contains machine learning models, threat detection algorithms, and AI services
- **`origin/back-end`** - Backend API development branch  
  - Contains Express.js + TypeScript server, database models, and API endpoints
- **`origin/front-end`** - Frontend/Mobile app development branch
  - Contains Expo React Native application and mobile UI components

**Development Workflow:**
1. Each team works on their respective feature branch
2. Regular integration testing between components
3. Merge to `main` branch for releases

### 🧠 ai-ml-server/
Contains the artificial intelligence and machine learning components of the platform:
- **Purpose**: Handles AI-powered features like threat detection, risk assessment, and predictive analytics
- **Technologies**: Likely to include Python-based ML frameworks 
- **Features**: 
  - Real-time danger detection algorithms
  - Location-based risk assessment
  - Pattern recognition for suspicious activities
  - Emergency response optimization

### 🔧 backend-api/
Houses the main backend API and server-side business logic:
- **Purpose**: Manages data, user authentication, emergency services integration, and communication
- **Technologies**: Express.js with TypeScript, RESTful APIs, database management, authentication services
- **Features**:
  - User management and authentication
  - Emergency contact management
  - Location tracking and geofencing
  - Integration with emergency services
  - Real-time communication and alerts

### 📱 mobile-app/
Contains the mobile application that end-users interact with:
- **Purpose**: Provides the user interface for all safety features and emergency functions
- **Technologies**: Expo (React Native framework)
- **Features**:
  - Emergency SOS button
  - Location sharing with trusted contacts
  - Safe route recommendations
  - Community safety reporting
  - Real-time alerts and notifications

## 🚀 Getting Started

### Prerequisites
- Node.js and npm/yarn
- Expo CLI (for mobile app development)
- Python 3.8+ (for AI/ML server)
- TypeScript
- Database system (PostgreSQL/MongoDB)

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Raksha360
   ```

2. **Environment Setup:**
   - Copy `.env.example` to `.env` in each component directory
   - Configure your environment variables (see Environment Variables section below)
   - Ensure `.gitignore` files are properly configured to exclude sensitive files

3. Set up each component:
   ```bash
   # Backend API
   cd backend-api
   npm install
   # Copy and configure .env file
   cp .env.example .env
   # Follow setup instructions in backend-api/README.md

   # AI/ML Server
   cd ../ai-ml-server
   pip install -r requirements.txt
   # Copy and configure .env file
   cp .env.example .env
   # Follow setup instructions in ai-ml-server/README.md

   # Mobile App
   cd ../mobile-app
   npm install
   expo install
   # Copy and configure .env file
   cp .env.example .env
   # Follow setup instructions in mobile-app/README.md
   ```

## 🏗️ Development Status

This project is currently in the initial setup phase. Each component directory will contain its own detailed documentation and setup instructions as development progresses.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support & Contact

For questions, suggestions, or support, please reach out through:
- Create an issue in this repository
- Contact the development team

## 🔮 Roadmap

- [ ] Set up backend API infrastructure
- [ ] Develop AI/ML models for threat detection
- [ ] Create mobile app MVP
- [ ] SOS feature implementation
- [ ] Integrate emergency services APIs
- [ ] Implement real-time location tracking
- [ ] Add community safety features
- [ ] Deploy beta version for testing

---

**Note**: This README will be updated as the project develops. Check individual component directories for specific setup and development instructions.
