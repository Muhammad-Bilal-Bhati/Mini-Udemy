const courseModel = require('../Models/Course');
const enrollmentModel = require('../Models/Enrollment');
const createCourse = async(req,res)=>{
    try{
        const courseData = Array.isArray(req.body)? req.body : [req.body];
      const courseWithInsID =  courseData.map(course=>({
            ...course,
            instructor: req.user.id
        }))
      const course = await courseModel.create(courseWithInsID)
        if(!course){
            return res.status(400).json({success:false,message:"Course not created"})
        }
        res.status(201).json({success:true,message:"Course created successfully",data:course})
    }
    catch(err){
        res.status(500).json({success:false,message:err.message})
    }
}

const getAllCourses = async (req, res) => {
    try {
        // URL ke '?' ke baad aane wale saare query params nikal lo
        const { category, maxPrice, minRating, search, sort, fields, page = 1, limit = 10 } = req.query;

        const filter = {};

     
        if (category) {
            filter.category = category;
        }

        if (maxPrice) {
            filter.price = { $lte: Number(maxPrice) };
        }

        
        if (minRating) {
            filter.averageRating = { $gte: Number(minRating) };
        }

        
        if (search) {
            filter.$text = { $search: search };
        }

        
        let query = courseModel.find(filter);

        
        if (fields) {
            
            const selectedFields = fields.split(',').join(' ');
            query = query.select(selectedFields);
        } else {
            query = query.select('-chapters -reviews -__v');
        }

        
        if (sort) {
            const sortBy = sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }

    
        const pageNum = Number(page);
        const limitNum = Number(limit);
        const skipCount = (pageNum - 1) * limitNum; 

        query = query.skip(skipCount).limit(limitNum);

        query = query.populate('instructor', 'name email profile.bio');

        
        const [courses, total] = await Promise.all([
            query,
            courseModel.countDocuments(filter)
        ]);

        res.status(200).json({
            success: true,
            count: courses.length,
            total,
            page: pageNum,
            limit: limitNum,
            data: courses
        });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const getCourseById = async (req, res) => {
    try {
        const course = await courseModel.findById(req.params.courseID)
            .populate('instructor', 'name email profile.bio')
            .select('-__v');

        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        res.status(200).json({ success: true, data: course });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const addChapter = async (req,res)=>{
        try{
            const {courseID} = req.params;
            const {title,description,videoURL,duration,isFreePreview} = req.body;

            const course = await courseModel.findById(courseID);
            if(!course){
                return res.status(404).json({success:false,message:"Course not found"})
            }

            if(course.instructor.toString() !== req.user.id){
                return res.status(403).json({success:false,message:"You are not authorized to add chapters to this course"})
            }

            const updateCourse = await courseModel.findByIdAndUpdate(courseID,{
                $push:{
                    chapters:{title,description,videoURL,duration,isFreePreview}
                }
            },
            {new:true,runValidators:true}
        )

        res.status(200).json({success:true,message:"Chapter added successfully",data:updateCourse})

        }
        catch(err){
            res.status(500).json({success:false,message:err.message})
        }
}
const deleteChapter = async (req,res)=>{
    try{
        const {courseID,chapterID} = req.params;
        const course = await courseModel.findById(courseID);
        if(!course){    
            res.status(404).json({success:false,message:"Course not found"})
        }
        if(course.instructor.toString() !== req.user.id){
            res.status(403).json({success:false,message:"You are not authorized to delete this course"})
        }
        const updatedCourse = await courseModel.findByIdAndUpdate(courseID,{
            $pull:{chapters:{_id:chapterID}}
        },
        {new:true,runValidators:true}
    )
    res.status(200).json({success:true,message:"Chapter deleted successfully",data:updatedCourse})
    }
    catch(err){
        res.status(500).json({success:false,message:err.message})
    }
}
const addingReview = async(req,res)=>{
    const {courseID} = req.params
    const {rating,comment} = req.body
    const userID = req.user.id

    const course = await courseModel.findById(courseID)
    if(!course){
        return res.status(404).json({success:false,message:"Course not found"})
    }
    const isUserEnroll = await enrollmentModel.findOne({user:userID,course:courseID})
    if(!isUserEnroll){
        return res.status(403).json({success:false,message:"You are not enrolled in this course"})
    }
    const alreadyReviewed = course.reviews.find(review => review.user.toString() === userID)
    if(alreadyReviewed){
        return res.status(400).json({success:false,message:"You have already reviewed this course"})
    }
    const review = {
        user:userID,
        rating:Number(rating),
        comment
    }
    course.reviews.push(review)

    const totalRating = course.reviews.length
    const sumRating = course.reviews.reduce((acc,review)=> acc + review.rating,0)
    course.averageRating = sumRating/totalRating

    await course.save()
    res.status(200).json({success:true,message:"Review added successfully",data:course})

}
module.exports = {createCourse,getAllCourses,getCourseById,addChapter,deleteChapter,addingReview};