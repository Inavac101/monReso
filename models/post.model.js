const mongoose = require('mongoose');

const Postschema = new mongoose.Schema(
    {
        posterId: {
            type: String,
            required: true
        },
        message: {
            type: String,
            trim: true,
            maxlength: 500,
        },
        picture: {
            type: String,
        },
        vidéo: {
            type: String,
        },
        likers: {
            type: [String],
            requires: true,
        },
        comments: {
            type: [
                {
                commenterId:String,
                commenterPseudo: String,
                text: String,
                timestamp: Number,
                }
            ],
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('post',  PostSchema)