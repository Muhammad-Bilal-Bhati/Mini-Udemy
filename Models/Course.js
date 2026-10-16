const mongoose = require('mongoose');


const reviewSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating:{
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment:{
        type: String,
        required:true
    }

},{
    timestamps: true
});

const chapterSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    videoURL :{
        type: String,
        required: true
    },
    duration:{
        type:Number,
        default: 0
    },
    isFreePreview:{
        type: Boolean,
        default: false
    }
},{timestamps: true});


const courseSchema = new mongoose.Schema({

    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    instructor:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    chapters:[chapterSchema],
    reviews:[reviewSchema],

    averageRating:{
        type: Number,
        default: 0
    },
    totalRatings:{
        type: Number,
        default: 0
    }

},{
    timestamps: true
});

courseSchema.index({ title: 'text', description: 'text' });
courseSchema.index({category:1})


const courseModel = mongoose.model('Course', courseSchema);

module.exports = courseModel;
