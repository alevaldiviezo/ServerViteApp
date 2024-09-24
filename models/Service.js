const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const Booking = require('./booking');
// const User = require('./user');

const ServiceSchema = new Schema({
    name : String,
    
    image: String,
    price: Number,
    description: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    status:{
        type: String,
        enum: ['available', 'comming soon', 'unavailable' ],
        default: 'available',
        
    },
    bookings: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Booking'
        }
    ]
    
});

//We use findOneAndDelete method to delete a service, so we need to the following middleware to delete any other document related to the service, in this case the bookings

ServiceSchema.post('findOneAndDelete', async function(doc){
    if(doc){
        await Booking.deleteMany({
            _id: {
                $in: doc.bookings
            }
        })
    }
})

module.exports = mongoose.model('Service', ServiceSchema);