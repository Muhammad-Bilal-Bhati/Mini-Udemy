const enrollmentModel = require("../Models/Enrollment");
const courseModel = require("../Models/Course");

const enrollCourse = async (req,res)=>{
    const {courseID} = req.params;
    const userID = req.user.id;

    try{
        const existingCourse = await courseModel.findById(courseID);
        if(!existingCourse){
            return res.status(404).json({
                success:false,
                message:"Course not found"
            })
        }
        const enrollment = await enrollmentModel.create({
            user:userID,
            course:courseID
        })

        await courseModel.findByIdAndUpdate(courseID,{
            $inc:{totalStudents:1}
        })

        res.status(200).json({
            success:true,
            message:"Enrollment successful",
            data:enrollment
        })
    }
    catch(error){
        if (error.code === 11000) {
            return res.status(400).json({ 
                success: false, 
                message: "Aap pehle hi is course mein enrolled hain!" 
            });
        }
        res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = {enrollCourse}


