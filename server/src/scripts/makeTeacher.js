import prisma from "../config/prisma.ts"  

const searchResult = await prisma.user.findUnique({
    where:{
        "email":"atha22@test.com"
    }
    
})
if(!searchResult){
    console.log("couldn't find user");
    process.exit(1);
}




const updatedRole = await prisma.user.update({
    where:{
        id : searchResult.id
    },
    data:{
        role: "teacher"
    } 
});

console.log(updatedRole.name)
console.log(updatedRole.role)
