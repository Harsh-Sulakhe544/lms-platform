import { db } from "@/lib/db";
import { Attachment, Chapter } from "@prisma/client";

interface GetChapterProps {
    userId: string;
    courseId: string;
    chapterId: string;
};

export const getChapter = async ({
    userId, courseId, chapterId
}:GetChapterProps) => {
    try {
        const purchase = await db.purchase.findUnique({
            where: {
                userId_courseId: {
                    userId, 
                    courseId,
                }
            }
        });

        // fetch the course 
    const course = await db.course.findUnique({
        where: {
            isPublished: true, 
            id: courseId,
        },
        select: {
            price: true,
        }
    });
    // now fetch the chapter 
    const chapter = await db.chapter.findUnique({
        where: {
            id: chapterId, 
            isPublished: true, 
        }
    });

    if (!chapter || !course) {
        throw new Error("Chapter or Course not Found");
    }

    // fetch the required other details 
    let muxData = null;
    let attachments : Attachment[] = [] ;
    let nextChapter: Chapter | null = null;

    // fetch only if purchased 
    if(purchase) {
        attachments = await db.attachment.findMany({
            where: {
                courseId: courseId
            }
        });
    }

    if (chapter.isFree || purchase) {
        muxData = await db.muxData.findUnique({
            where: {
                chapterId: chapterId
            }
        });

        // load the next-chapter by position 
        nextChapter = await db.chapter.findFirst({
            where: {
                courseId: courseId, 
                isPublished: true, 
                position: {
                    // gt means greater than
                    gt: chapter?.position,
                }
            }, 
            orderBy: {
                position: "asc",
            },
        });
    }
    // fech the user-progress 
    const userProgress = await db.userProgress.findUnique({
        where: {
            userId_chapterId: {
                userId, 
                chapterId,
            }
        }
    });

    return {
        chapter, 
        course, 
        muxData,
        attachments,
        nextChapter, 
        userProgress, 
        purchase, 
    }
    
    } catch (error) {
        console.log("[GET_CHAPTER]", error);
        return {
            chapter: null,
            course: null, 
            muxData: null, 
            attachments: [],
            nextChapter: null,
            userProgress: null,
            purchase: null,
        }
    }
}