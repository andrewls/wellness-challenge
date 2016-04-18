'use strict';

var express = require('express');
var controller = require('./week.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.get('/by-user/:id', controller.by_user);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;
//# sourceMappingURL=index.js.map
