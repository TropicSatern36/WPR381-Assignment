var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // Send index.html from public/index.html
  res.sendFile('index.html', { root: 'public' });
});

module.exports = router;
