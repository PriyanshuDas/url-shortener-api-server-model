var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CounterSchema = new Schema({
    _id: {type: String, required: true},
    seq: { type: Number, default: 0 }
});

var counter = mongoose.model('counter', CounterSchema);
var count = 1;

// create a schema for our links
var urlSchema = new Schema({
    _id: {type: Number},
    longUrl: String,
    created_at: Date
});

urlSchema.pre('save', function(next){
    console.log('Pre Entry initiated!');
    var doc = this;
    counter.findByIdAndUpdate({_id: 'url_count'}, {$inc: {seq: 1} }, function(error, counter) {
        if (error)
            return next(error);

       // doc.created_at = new Date();
       // doc._id = counter.seq;
       // count = counter.seq;
        console.log('Setting ID : ', counter.seq, ' , '+doc._id);
    });
    next();
});

var URL = mongoose.model('Url', urlSchema);
//var Url = 'bla';
module.exports.URL = URL;
module.exports.counter = counter;
module.exports.count = count;