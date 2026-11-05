import { searchAll } from "./search.service.js";

export async function searchQueryController(req,res,next){
    try{
        const query = req.query.q                               // the variable query stores the data from the query parameters
    if(!query || query.trim() ===""){
        return res.status(400).json({
            message:"No query sent"
        })
    }
    const data = await searchAll(query)
    return res.status(200).json(data);
    }
    catch(error){
        console.error("Search controller error:", error);
        return res.status(500).json({
            message:"Something went wrong"
        })
    }


}