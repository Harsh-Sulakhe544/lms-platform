import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(
    req:Request,     
    {params}: {params : { courseId: string}}
) {
    try {
        const {userId} = auth();

        if(!userId) {
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

        // check whether we have published-chapter (atleast 1 chapter)

        const hasPublishedChapter = course.chapters.some((chapter) => chapter.isPublished);

        if(!course.title || !course.description || !course.imageUrl || !course.categoryId || !hasPublishedChapter) {
            return new NextResponse("Missing  Required Fields ", {status:401});
        }

        // publish the course 
        const publishedCourse = await db.course.update({
            where:{
                id: params.courseId, 
                userId:userId,
            }, 
            data: {
                isPublished: true,
            }
        });
        return NextResponse.json(publishedCourse);


    } catch (error) {
        console.log("COURSE_ID_PUBLISH", error);
        return new NextResponse("Internal Error", {status:500});
    }
}