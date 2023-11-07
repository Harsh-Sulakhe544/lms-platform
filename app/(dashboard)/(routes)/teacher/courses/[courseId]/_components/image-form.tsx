"use client";
import * as z from "zod";
import axios from "axios";
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Course } from "@prisma/client";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";


interface ImageFormProps {
    initialData:Course
    courseId: string
};

// create a schema 
const formSchema = z.object({
    imageUrl: z.string().min(1, {
        message:"Image is Required",
    }),
});
export const ImageForm = ({
    initialData, courseId
}:ImageFormProps) => {
    // create a togle button for editing title 
    const [isEditing , setIsEditing] = useState(false);
    const toggleEdit = () => setIsEditing((current)=> !current)
    
    // use the router 
    const router = useRouter();

    const onSubmit = async (values:z.infer<typeof formSchema>) => 
    {
        // console.log(values);
        try {
            await axios.patch(`/api/courses/${courseId}`, values);
            toast.success("course updated");
            toggleEdit();
            // fetch the new-data from the database
            router.refresh();

        } catch (error) {
            toast.error("Something Went Wrong");
        }
    };

    return(
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course Image 
                <Button onClick={toggleEdit}  variant={"ghost"}>
                    {isEditing && (
                        <>Cancel</>
                    )}
                    {!isEditing && !initialData.imageUrl && (
                        <>
                        <PlusCircle className="h-4 w-4 mr-2"/>
                        Add an image
                        </>
                    )}

                    {!isEditing && initialData.imageUrl && (
                        <>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit Image
                        </>
                    )}
                </Button>
            </div>

            {!isEditing && (
               !initialData.imageUrl ? (
                <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                    <ImageIcon className="h-10 w-10 text-slate-500"/>
                </div>
               ): (
                    <div className="relative aspect-video mt-2">
                        <Image alt="Upload" fill className="object-cover rounded-md" 
                        src={initialData.imageUrl} />
                    </div>
               )
            )}

            {isEditing && (
                <div>
                    <FileUpload 
                    endpoint="courseImage"
                    onChange={(url) => {
                        if(url) {
                            onSubmit({imageUrl:url});
                        }
                    }}
                    />

                    <div className="text-ts text-muted-foreground mt-4">
                        16:9 Ratio Recommended 
                    </div>
                </div>
            )}

            {initialData.imageUrl && !isEditing && (
                <div className="text-xs text-muted-foreground mt-2">Images can take a few minutes to process.Refresh the page if image does not appear.</div>
            )}
        </div>
    )
}