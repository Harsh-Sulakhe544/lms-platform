// here we fetch the course that someone-took 
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { IconBadge } from "@/components/icon-badge";
import { Banner } from "@/components/banner";

import { CircleDollarSign,  File,  LayoutDashboard, ListChecks } from "lucide-react";
import { TitleForm } from "./_components/title-form";
import { DescriptionForm } from "./_components/description-form";
import { ImageForm } from "./_components/image-form";
import { CategoryForm } from "./_components/category-form";
import { PriceForm } from "./_components/price-form";
import { AttachmentForm } from "./_components/attachment-form";
import { ChaptersForm } from "./_components/chapters-form";
import { Actions } from "./_components/actions";

const CourseIdPage = async (
    {
        params
    }: {
        params:{courseId:string}
    }
) => {
    // we want to keep track of which user create which user (same person should edit the course)
    const { userId } = auth();

    if(!userId) {
        return redirect("/")
    }

    const course = await db.course.findUnique({
        where:{
            id: params.courseId,
            userId
        }, 
        // include the previous courses also 
        include: {
            // include both attachment , chapters
            chapters:{
                orderBy:{  position: "asc" }
            },

            attachments: {
                orderBy:{
                    createdAt: "desc"
                },
            },
        },
    });

    // fetch the category of all-simialar-courses 
    const categories = await db.category.findMany({
        orderBy: {
            name:"asc",
        },
    });

    console.log(categories);

    // if user is not oener of the course 
    if(!course) {
        return redirect("/");
    }

    // we need to check whether all the fields are there or not after course is added to app by teacher 
    const requiredFields = [
        course.title,
        course.description,
        course.imageUrl, 
        course.price,
        course.categoryId,
        
        // look for atleast 1 chapter that is published 
        course.chapters.some(chapter => chapter.isPublished)
    ];

    const totalFields = requiredFields.length;
    
    // but we want only-essential fields , no optional 
    const completedFields = requiredFields.filter(Boolean).length

    const completionText = `{${completedFields}/${totalFields}}`

    // check all the fields are true to publish the entire course 
    const isComplete = requiredFields.every(Boolean);

    return ( 
    <> 
    {!course.isPublished && (
        <Banner
        label="This Course is Unpublished, it will not be visible to Students." />
    )}
        <div className="p-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-y-2">
                    <h1 className="text-2xl font-medium">Course Setup</h1>
                    <span className="text-sm text-slate-700">Complete all fields {completionText}
                    </span>
                </div>
                {/* add actions for the course to publish or not  */}
                <Actions 
                    disabled={!isComplete}
                    courseId={params.courseId}
                    isPublished={course.isPublished}
                    />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                <div>
                    <div className="flex items-center gap-x-2">
                        {/* here u can also pass the size,variant as props */}
                        <IconBadge icon={LayoutDashboard}/>
                        <h2 className="text-xl">Customize Your Course </h2>
                    </div>

                    {/* create a title-form  */}
                    <TitleForm
                    initialData={course}
                    courseId={course.id}
                    />

                    {/* create a description-form  */}
                    <DescriptionForm
                    initialData={course}
                    courseId={course.id}
                    />

                    {/* create a image-form  */}
                    <ImageForm
                    initialData={course}
                    courseId={course.id}
                    />

                    {/* create a category-form  */}
                    <CategoryForm
                    initialData={course}
                    courseId={course.id}
                    options={categories.map((category) => ({
                        label:category.name,
                        value:category.id,
                    }))}
                    />
                </div>

                <div className="space-y-6">
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={ListChecks} />
                            <h2 className="text-xl">Course Chapters</h2>
                        </div>

                            {/* create a description-form  */}
                        <ChaptersForm
                        initialData={course}
                        courseId={course.id}
                        />

                    </div>

                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={CircleDollarSign}/>
                            <h2 className="text-xl">Sell Your Course</h2>
                        </div>

                        <PriceForm 
                        initialData={course}
                        courseId= {course.id} />
                    </div>


                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={File}/>
                            <h2 className="text-xl">Resources & Attachments</h2>
                        </div>

                            {/* create a course-attachment-form  */}
                        <AttachmentForm
                            initialData={course}    
                            courseId={course.id}
                        />
                    </div>

                </div>
            </div>
        </div>
    </>
    );
}
 
export default CourseIdPage;