# QR-Based-Attendance-Monitoring-System
**Problem Statement**

Traditional attendance systems are:

Time-consuming

Prone to proxy attendance

Hard to manage at scale

**This project solves those issues using dynamic QR codes and a web-based attendance workflow.**

**🎯 Solution Overview**

The system generates session-specific QR codes that:

Are valid only for a short time window

Can be scanned by students to mark attendance

Automatically link attendance to teacher & subject.

**🧑‍💻 User Roles & Features
👨‍💼 Admin**

Create & manage teachers

View attendance records

Monitor overall system usage

**👩‍🏫 Teacher**

Create attendance sessions

Generate auto-refreshing QR codes

View & export attendance data

**🎓 Student**

Scan QR code

Submit USN & name

Attendance recorded instantly

**Tech Stack
Frontend**

⚛️ React.js

🎨 CSS

🌐 Axios

**Backend**

🟢 Node.js

🚀 Express.js

🔐 JWT Authentication

**Database**

🍃 MongoDB (Mongoose)

**Tools & Platforms**

Git & GitHub

VS Code

Postman

**⚙️ Installation & Setup
🔹 Clone Repository**

git clone https://github.com/srisaagar/QR-Based-Attendance-Monitoring-System.git
cd QR-Based-Attendance-Monitoring-System

**🔹 Backend Setup**
cd qr-attendance-backend
npm install

**Create .env file:**

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

**Start backend server:**

npm start

**🔹 Frontend Setup**
cd ..
npm install
npm start

**Future Enhancements**

📱 Mobile app support

📊 Analytics dashboard

🧾 CSV / PDF export

📍 Location-based attendance

⏱️ Advanced QR expiry rules
