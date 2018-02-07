const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ArticleSchema = new new Schema({
    title: {
        type: String,
        unique: false,
        require: false
    },
    body: {
        type: String,
        unique: false,
        require: false
    },
    // tags : {
    //     type: [ObjectId],
    //     unique: false,
    //     require: false
    // },
    icon : {
        type: String,
        unique: false,
        require: false
    },
    author: {
        type: ObjectId,
        unique: false,
        require: false
    },
    created_at: {
        type: Date,
        unique: false,
        require: false
    },
    updated_at: {
        type: Date,
        unique: false,
        require: false,
        default: Date.now()
    }
});
