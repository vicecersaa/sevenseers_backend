const express = require('express');
const router = express.Router();
const {
  getTeamMemberSection,
  updateTeamMemberSection,
} = require('../controllers/TeamMemberController');

// GET Team Member Section
router.get('/', getTeamMemberSection);

// UPDATE Team Member Section
router.put('/', updateTeamMemberSection);

module.exports = router;
