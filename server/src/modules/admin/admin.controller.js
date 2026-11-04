import { getAllTeacherApplications , rejectTeacherService ,approveTeacherService } from "./admin.service.js";

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

export async function approveTeacherController(req,res){
    try{ 
        const appId = req.params.id;
        const adminId = req.user.userId

        const controllerGetsData = await approveTeacherService({appId,adminId})
        return res.status(200).json({
            success:true,
            message:"Teacher application approved Successfully",
            data:controllerGetsData
        });

    }
    catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }

}

export async function rejectTeacherController(req, res) {
    try {
        const appId = req.params.id;
        const adminId = req.user.userId;
        const { reason } = req.body;

        const controllerGetsData = await rejectTeacherService({
            appId,
            adminId,
            reason
        });

        return res.status(200).json({
            success: true,
            message: "Teacher application rejected successfully.",
            data: controllerGetsData
        });

    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal server error."
        });
    }
}