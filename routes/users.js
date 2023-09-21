const router = require('express').Router();
const {
  getCurrentUser,
  updateCurrentUser,
} = require('../controllers/users');
const { validateUser } = require('./validation');

router.get('/me', getCurrentUser);
router.patch('/me', validateUser, updateCurrentUser);

module.exports = router;
