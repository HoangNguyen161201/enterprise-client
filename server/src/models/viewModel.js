const mongoose = require('mongoose')

//Define chema model
const viewSchema = new mongoose.Schema({
    last_visited_date: {
        type: Date,
        default: () => Date.now()
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    idea_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ideas',
        required: true
    }
})

module.exports = mongoose.model('views', viewSchema);