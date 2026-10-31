import { getAllTeacherApplications } from "./admin.service";

export async function getTeacherReqsController(req,res){
    try{
        const recivedData =  await getAllTeacherApplications();
        // if(!recivedData){
        //     res.status(500).json({
        //         message:"Internal Server Error"
        //     })
        // }
        return res.status(200).json(recivedData);
    }
    catch(error){
        return res.status(500).json({
            message:"Something went Wrong"
        })
    }
    

}