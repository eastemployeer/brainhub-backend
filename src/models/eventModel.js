import mongoose from 'mongoose';
import validator from 'validator';

const eventSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please tell us your first name'],
  },
  lastName: {
    type: String,
    required: [true, 'Please tell us your last name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  date: {
    type: Date,
    required: [true, 'Please provide event start date'],
  },
}, { versionKey: false });

const Event = mongoose.model('Event', eventSchema);

export default Event;
