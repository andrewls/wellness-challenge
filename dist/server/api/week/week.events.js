/**
 * Week model events
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _events = require('events');

var _week = require('./week.model');

var _week2 = _interopRequireDefault(_week);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var WeekEvents = new _events.EventEmitter();

// Set max event listeners (0 == unlimited)
WeekEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  _week2.default.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc) {
    WeekEvents.emit(event + ':' + doc._id, doc);
    WeekEvents.emit(event, doc);
  };
}

exports.default = WeekEvents;
//# sourceMappingURL=week.events.js.map
