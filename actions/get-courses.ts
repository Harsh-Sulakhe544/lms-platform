// each course with its progress we want to track  
import { Category, Course } from "@prisma/client";

import { getProgress } from "@/actions/get-progress";
import { db } from "@/lib/db"; 

type CourseWithProgressWithCategory = Course & {
    category: Category | null;
    chapters: {id: string}[];
    progress: number | null
}; 
// we want to search wrt ttile , category-id , userId 
type GetCourses = {
    userId: string;
    title?: string;
    categoryId?: string;
}

export const getCourses = async ( {
    userId, title, categoryId ,
}:GetCourses): Promise<CourseWithProgressWithCategory[]> => {

    try {
        // load the courses that are only published  
        const courses = await db.course.findMany({
            where: {
                isPublished: true,
                title: {
                    contains: title,
                },
                categoryId,
            },
            include: {
                category: true, 
                chapters: {
                    where: {
                        isPublished: true,
                    },
                    // we only need id's of published chapters
                    select: {
                        id: true,
                    }
                },
                // only logged-in user purchases 
                purchases: {
                    where: {
                        userId,
                    }
                }
            },
            orderBy : {
                createdAt: "desc",
            }
        });

        const CourseWithProgress: CourseWithProgressWithCategory[] = await Promise.all(
            courses.map(async course => {
                if(course.purchases.length === 0) {
                    return {
                        ...course, 
                        progress: null,
                    }
                }
                const progressPercentage = await getProgress(userId, course.id);
                
                return {
                    ...course,
                    progress: progressPercentage,
                };
            })
        );

        return CourseWithProgress;

    } catch (error) {
        console.log("[GET_COURSES]", error);
        return [];
    }
}
