// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;
// const passportLocalMongoose = require('passport-local-mongoose');
import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

// const Schema = mongoose.schema;
const User = new mongoose.Schema({});

User.plugin(passportLocalMongoose);

export default mongoose.model('User', User);
