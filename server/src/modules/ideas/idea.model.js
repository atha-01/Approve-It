import mongoose from 'mongoose';

const IdeaSchema = new mongoose.Schema({
    title : {type:String , required:true},
    description :{type:String , required:true},
    submittedBy :{type: mongoose.Schema.Types.ObjectId , ref: "User", required:true},
    status : {type:String , required:true, default: "pending", enum : ['pending','under_review','approved','rejected']},
},{
    timestamps:true         // helps mongoDB maintain and create createAT and updatedAT dates automatically
})

const IdeaModel = mongoose.model('Idea', IdeaSchema); 
export default IdeaModel;  