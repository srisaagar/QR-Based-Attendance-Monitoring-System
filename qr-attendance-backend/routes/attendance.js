const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const Attendance = require('../models/Attendance');

const QR_CODE_VALIDITY_SECONDS = 15;

// --- POST: Create Attendance Session ---
router.post('/create', async (req, res) => {
  try {
    const { className, subject, hour, date, teacherId } = req.body;
    const teacherIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    const newSession = await Attendance.create({
      className,
      subject,
      hour,
      date,
      teacherId,
      students: [],
      teacherIp,
      qrCodeGeneratedAt: new Date(),
      qrCodeToken: uuidv4()
    });

    console.log(`✅ [CREATE] Session created: ${newSession._id}`);
    res.status(201).json({
      ...newSession.toObject(),
      qrCodeToken: newSession.qrCodeToken
    });
  } catch (err) {
    console.error('❌ Error creating attendance session:', err);
    res.status(500).json({ message: 'Failed to create session' });
  }
});

// --- PUT: Refresh QR Code ---
router.put('/refresh-qr/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await Attendance.findById(sessionId);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    session.qrCodeGeneratedAt = new Date();
    session.qrCodeToken = uuidv4();
    await session.save();

    console.log(`🔄 [REFRESH] QR refreshed for session: ${sessionId}`);
    res.status(200).json({
      message: 'QR code refreshed successfully',
      qrCodeToken: session.qrCodeToken
    });
  } catch (err) {
    console.error('❌ Error refreshing QR code:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// --- GET: Get Attendance Session by ID ---
router.get('/:sessionId', async (req, res) => {
  try {
    const session = await Attendance.findById(req.params.sessionId);
    if (!session) return res.status(404).json({ message: 'Session not found' });
    res.json(session);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching session' });
  }
});

// --- POST: Student Marks Attendance via QR ---
router.post('/student/mark-attendance', async (req, res) => {
  try {
    const { qrData, name, rollNo, deviceId } = req.body;

    if (!qrData || !name || !rollNo || !deviceId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const usnRegex = /^1MS\d{2}(SCS|SCN|CSE|ECE|ISE|MEC)\d{2}$/i;
    if (!usnRegex.test(rollNo)) {
      return res.status(400).json({
        message: 'Invalid USN format. Expected 1MSxxSCSxx (e.g., 1MS24SCS01)'
      });
    }

    const url = new URL(qrData);
    const sessionId = url.pathname.split('/').pop();
    const qrToken = url.searchParams.get('token');

    if (!sessionId || !qrToken) {
      return res.status(400).json({ message: 'Invalid QR data. Please scan again.' });
    }

    const session = await Attendance.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const now = new Date();
    const generatedAt = new Date(session.qrCodeGeneratedAt);
    const timeDifference = (now - generatedAt) / 1000;

    if (timeDifference > QR_CODE_VALIDITY_SECONDS || session.qrCodeToken !== qrToken) {
      return res.status(400).json({
        message: 'QR Code is expired. Please scan the new one'
      });
    }

    const alreadyMarked = session.students.some(
      s => s.deviceId === deviceId || s.rollNo.toLowerCase() === rollNo.toLowerCase()
    );
    if (alreadyMarked) {
      return res.status(409).json({ message: 'Attendance already marked with this device or roll number.' });
    }

    session.students.push({ name, rollNo, deviceId });
    await session.save();

    res.status(200).json({ message: 'Attendance marked successfully!' });

  } catch (err) {
    console.error('❌ Error in student mark-attendance:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// --- GET: All Sessions by Teacher ---
router.get('/teacher/:teacherId', async (req, res) => {
  try {
    const sessions = await Attendance.find({ teacherId: req.params.teacherId }).sort({ date: -1 });
    res.json(sessions);
  } catch (err) {
    console.error('❌ Error fetching history:', err);
    res.status(500).json({ message: 'Failed to fetch attendance history' });
  }
});

// --- PUT: Remove Student from Session ---
router.put('/:sessionId/remove-student', async (req, res) => {
  try {
    const { rollNo } = req.body;
    const session = await Attendance.findById(req.params.sessionId);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    session.students = session.students.filter((s) => s.rollNo !== rollNo);
    await session.save();

    res.json({ message: 'Student removed' });
  } catch (err) {
    console.error('❌ Error removing student:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// --- POST: Manual Add Student ---
router.post('/student/manual-add', async (req, res) => {
  try {
    const { sessionId, name, rollNo } = req.body;

    if (!sessionId || !name || !rollNo) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const usnRegex = /^1MS\d{2}(SCS|SCN|CSE|ECE|ISE|MEC)\d{2}$/i;
    if (!usnRegex.test(rollNo)) {
      return res.status(400).json({
        message: 'Invalid USN format. Expected 1MSxxSCSxx (e.g., 1MS24SCS01)'
      });
    }

    const session = await Attendance.findById(sessionId);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    const alreadyMarked = session.students.some(s => s.rollNo.toLowerCase() === rollNo.toLowerCase());
    if (alreadyMarked) return res.status(409).json({ message: 'Student already added' });

    session.students.push({ name, rollNo, deviceId: 'manual-entry' });
    await session.save();

    res.status(200).json({ message: 'Student added manually' });
  } catch (err) {
    console.error('❌ Error adding student manually:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;