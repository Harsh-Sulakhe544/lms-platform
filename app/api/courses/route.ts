import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";

export  async function POST(
    req:Request
) {
    try {
        // get the user-id from Clerk 
        const { userId } = auth();
        const { title } = await req.json();

        if(!userId || !isTeacher(userId)) {
            return new NextResponse("Unauthorised", {status:401});
        }

        // create a course 
        const course = await db.course.create({
            data:{
                userId, 
                title,
            }
        });

        return NextResponse.json(course);

    } 
    catch (error) {
        console.log("[COURSES]", error);
        return new NextResponse("Internal Error", {status:500});
    }
}