// this is page gets activated when we click on link of our course(Advanced web development )

import { db } from "@/lib/db";
import { redirect } from "next/navigation";

const CourseIdPage = async ({
    params,
}:{
    params: {courseId: string; }
}) => {
    const course = await db.course.findUnique({
        where: {
            id: params.courseId
        },
        include: {
            chapters: {
                where:{
                    isPublished: true,
                }, 
                orderBy:{
                    position: "asc"
                }
            }
        }
    });

    if(!course) {
        return redirect("/");
    }
    return ( 
        // redirect to introduction page
        redirect(`/courses/${course.id}/chapters/${course.chapters[0].id}`)
     );
}
 
export default CourseIdPage;