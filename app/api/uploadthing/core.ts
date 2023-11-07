import { auth } from "@clerk/nextjs";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { isTeacher } from "@/lib/teacher";
 
const f = createUploadthing();

// auth function - we used form clerk to verify fake or real , also protect-uploadthing=backend 
const handleAuth  = () => 
    { 
    const {userId} = auth();
    const isAuthorized = isTeacher(userId);
    if(!userId || !isAuthorized) throw new Error("Unauthorized");
    return {userId};
    };
 
 
// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    courseImage: f( {image : {maxFileSize: "4MB", maxFileCount: 1} } )
    .middleware(() => handleAuth())
    .onUploadComplete(() =>{}), 

    courseAttachment: f(["text", "image", "audio", "video", "pdf"])
    .middleware(()=> handleAuth())
    .onUploadComplete(()=>{}),
    
    // add each chapter video 
    chapterVideo: f({video: {maxFileCount:1, maxFileSize:"512GB"}})
    .middleware(()=>handleAuth())
    .onUploadComplete(()=>{}),


} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;