const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');

// GET all attendances or filter by date
router.get('/', async (req, res) => {
  try {
    const { date } = req.query;
    let query = {};

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);

      query = {
        date: {
          $gte: startDate,
          $lt: endDate
        }
      };
    }

    const attendances = await Attendance.find(query).populate('userID shiftIDs branch');
    res.json(attendances);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE a new attendance
router.post('/', async (req, res) => {
  console.log('Request Body:', req.body); // Debug log
  const attendance = new Attendance({
    userID: req.body.userID,
    userRole: req.body.userRole,
    jobdesk: req.body.jobdesk,
    shiftIDs: req.body.shiftIDs,
    branch: req.body.branch,
    date: req.body.date,
    checkIn: req.body.checkIn,
    checkOut: req.body.checkOut,
    notes: req.body.notes
  });

  try {
    const newAttendance = await attendance.save();
    res.status(201).json(newAttendance);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
