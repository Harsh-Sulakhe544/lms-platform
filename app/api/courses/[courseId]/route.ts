import Mux from "@mux/mux-node";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";

const { Video } = new Mux(
    process.env.MUX_TOKEN_ID!,
    process.env.MUX_TOKEN_SECRET!,
);

// to unpublish the whole course 

export async function DELETE(
    req:Request,     
    {params}: {params : { courseId: string}}
) {
    try {
        const {userId} = auth();

        if(!userId || !isTeacher(userId)) {
            return new NextResponse("Unauthorized", {status:401});
        }

        const course = await db.course.findUnique({
            where:{
                id: params.courseId, 
                userId:userId,
            }, 
            include: {
                chapters: {
                    include :{
                        muxData: true,   
                    }
                }
            }     
        });

        if(!course) {
            return new NextResponse("Not Found", {status:404});
        }

        // mux-data will automatically get delete => ondelete:cascade inside relation-prisma 
        // we have to manually delete the asset from the mux 

        for(const chapter of course.chapters) {
            if(chapter.muxData?.assetId) {
                await Video.Assets.del(chapter.muxData.assetId);
            }
        }

        const deletedCourse = await db.course.delete({
            where: {
                id: params.courseId,
            },
        });

        return NextResponse.json(deletedCourse);

    } catch (error) {
        console.log("COURSE_ID_DELETE", error);
        return new NextResponse("Internal Error", {status:500});
    }
}
// this will update the course-id when we cahnge the title 
export async function PATCH(
    req:Request, 
    // object destructuring pattern and type annotation combined (but 1st we should have the request)
    {params}: {params : { courseId: string}}
) {
    try {           
        const {userId} = auth();
        const {courseId} = params;
        const values = await req.json();

        if(!userId || !isTeacher(userId)) {
            return new NextResponse("Unauthorized", {status:401});
        }

        const course = await db.course.update({
            where:{
                id: courseId, 
                userId,
            }, 
            data: {
                ...values,
            }
        });

        return NextResponse.json(course);

    } catch (error) {
        console.log("[COURSE_ID]", error);
        return new NextResponse("Internal Error", {status:500});
    }
}