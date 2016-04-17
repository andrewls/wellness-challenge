'use strict';

import mongoose from 'mongoose';

var WeekSchema = new mongoose.Schema({
  number: Number,
  user_id: String,
  days: Array,
  start_weight: Number,
  end_weight: Number
});

export default mongoose.model('Week', WeekSchema);
