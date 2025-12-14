const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  className: String,
  subject: String,
  hour: String,
  date: String,
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher'
  },
  teacherIp: String,
  qrCodeGeneratedAt: {
    type: Date,
    default: Date.now
  },
  students: [
    {
      name: String,
      rollNo: String,
      deviceId: String,
      markedAt: {
        type: Date,
        default: Date.now
      }
    }
  ]
});

module.exports = mongoose.model('Attendance', attendanceSchema);