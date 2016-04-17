/**
 * Week model events
 */

'use strict';

import {EventEmitter} from 'events';
import Week from './week.model';
var WeekEvents = new EventEmitter();

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
  Week.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    WeekEvents.emit(event + ':' + doc._id, doc);
    WeekEvents.emit(event, doc);
  }
}

export default WeekEvents;
