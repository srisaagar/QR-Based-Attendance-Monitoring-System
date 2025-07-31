const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');

// POST /api/attendance/create
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
      teacherIp
    });

    // --- DEBUGGING LOG ---
    console.log(`✅ [CREATE] Session successfully created with ID: ${newSession._id}`);

    res.status(201).json(newSession);
  } catch (err) {
    console.error('Error creating attendance session:', err);
    res.status(500).json({ message: 'Failed to create session' });
  }
});

// PUT /api/attendance/refresh-qr/:sessionId
router.put('/refresh-qr/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

    // --- DEBUGGING LOGS ---
    console.log(`\n🔍 [REFRESH] Received request to refresh sessionId: ${sessionId}`);
    const session = await Attendance.findById(sessionId);
    console.log(`👀 [REFRESH] Mongoose findById result:`, session);

    if (!session) {
      console.log(`❌ [REFRESH] Could not find session with ID: ${sessionId}`);
      return res.status(404).json({ message: 'Session not found' });
    }

    session.qrCodeGeneratedAt = new Date();
    await session.save();

    console.log(`🔄 [REFRESH] Successfully refreshed QR for session ID: ${sessionId}`);
    res.status(200).json({ message: 'QR code refreshed successfully' });
  } catch (err) {
    console.error('Error refreshing QR code:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ... (keep all your other routes like /student/mark-attendance, /teacher/:teacherId, etc.)
// GET /api/attendance/:sessionId
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

// POST /api/attendance/student/mark-attendance
router.post('/student/mark-attendance', async (req, res) => {
  try {
    const { qrData, name, rollNo, deviceId } = req.body;

    if (!qrData || !name || !rollNo || !deviceId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // This correctly gets the Session ID, even if the URL has "?t=..." at the end.
    const parts = qrData.split('/');
    const sessionId = parts[parts.length - 1].split('?')[0];

    if (!sessionId || sessionId === "undefined") {
      return res.status(400).json({ message: 'Invalid session ID in QR data' });
    }

    const session = await Attendance.findById(sessionId);
    if (!session) {
        return res.status(404).json({ message: 'Session not found' });
    }

    // --- ✅ THIS IS THE FIX ---
    // We check how old the QR code is. The frontend refreshes it every 10 seconds.
    // We'll allow a 15-second window to account for network lag.
    const QR_CODE_VALIDITY_SECONDS = 15;
    const timeDifference = (new Date() - new Date(session.qrCodeGeneratedAt)) / 1000;

    if (timeDifference > QR_CODE_VALIDITY_SECONDS) {
      // If the QR code is older than our limit, reject the attendance.
      return res.status(400).json({
        message: 'QR Code has expired. Please scan the new one from the teacher\'s screen.'
      });
    }
    // --- END OF FIX ---

    const alreadyMarked = session.students.some(s => s.deviceId === deviceId);
    if (alreadyMarked) {
        return res.status(409).json({ message: 'Attendance already marked with this device.' });
    }

    session.students.push({ name, rollNo, deviceId });
    await session.save();

    res.status(200).json({ message: 'Attendance marked successfully!' });
  } catch (err) {
    console.error('❌ Error in student mark-attendance:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/attendance/teacher/:teacherId
router.get('/teacher/:teacherId', async (req, res) => {
  try {
    const sessions = await Attendance.find({ teacherId: req.params.teacherId }).sort({ date: -1 });
    res.json(sessions);
  } catch (err) {
    console.error('❌ Error fetching history:', err);
    res.status(500).json({ message: 'Failed to fetch attendance history' });
  }
});

// PUT /api/attendance/:sessionId/remove-student
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

// POST /api/attendance/student/manual-add
router.post('/student/manual-add', async (req, res) => {
  try {
    const { sessionId, name, rollNo } = req.body;

    if (!sessionId || !name || !rollNo) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const session = await Attendance.findById(sessionId);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    const alreadyMarked = session.students.some(s => s.rollNo === rollNo);
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