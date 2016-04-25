'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var WeekSchema = new _mongoose2.default.Schema({
  number: Number,
  user_id: String,
  days: Array,
  start_weight: Number,
  end_weight: Number,
  waist: Number,
  hip: Number,
  chest: Number,
  arm: Number,
  thigh: Number
});

exports.default = _mongoose2.default.model('Week', WeekSchema);
//# sourceMappingURL=week.model.js.map
