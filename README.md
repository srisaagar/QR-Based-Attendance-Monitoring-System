A full-stack web application that allows teachers to take attendance using QR codes, view live student responses, and manage sessions. Admins can manage teachers, and students can mark attendance using scanned QR codes.

✨ Features
🧑‍🏫 Teacher Dashboard
Start session and generate QR code
View live student attendance
Add or delete students manually
View attendance history
End ongoing session
👨‍🏫 Student Portal
Scan QR code
Submit attendance with name & roll no
Single-device attendance prevention
🛡️ Admin Dashboard
Add/Delete teachers
View all registered teachers
🛠️ Tech Stack
Layer	Technology
Frontend	React, Tailwind CSS / Custom CSS
Backend	Node.js, Express.js
Database	MongoDB (Mongoose ODM)
QR Code	qrcode.react
Auth	JWT (for teacher & admin login)
📦 Dependencies (Install via npm install)
Frontend (in /client):
npm install axios react-router-dom qrcode.react
Backend (in /server):
npm install express mongoose cors jsonwebtoken bcryptjs dotenv
🚀 How to Run the Project
1. Clone the Repository
git clone https://github.com/sairam030/QR-Attendance.git
cd qr-attendance-app
2. Start Backend
cd server
npm install
node server.js
Runs on: http://localhost:5000
3. Start Frontend
cd client
npm install
npm start
Runs on: http://localhost:3000
