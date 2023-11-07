"use client";
import * as z from "zod";
import axios from "axios";
import { File, ImageIcon, Loader2, Pencil, PlusCircle, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Attachment, Course } from "@prisma/client";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";


interface AttachmentFormProps {
    // consider the previous courses also taken by the user 
    initialData: Course & {attachments: Attachment[]}
    courseId: string
};

// create a schema 
const formSchema = z.object({
    url: z.string().min(1),
});
export const AttachmentForm = ({
    initialData, courseId
}:AttachmentFormProps) => {
    // create a togle button for editing title 
    const [isEditing , setIsEditing] = useState(false);

    // create a delete button to delete the course-attachment
    const [deletingId, setDeletingId] = useState<string | null >(null);

    const toggleEdit = () => setIsEditing((current)=> !current)
    
    // use the router 
    const router = useRouter();

    const onSubmit = async (values:z.infer<typeof formSchema>) => 
    {
        // console.log(values);
        try {
            await axios.post(`/api/courses/${courseId}/attachments`, values);
            toast.success("course updated");
            toggleEdit();
            // fetch the new-data from the database
            router.refresh();

        } catch (error) {
            toast.error("Something Went Wrong");
        }
    };

    const onDelete = async (id:string) => {
        try {
            setDeletingId(id);
            await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
            toast.success("Attachment Deleted");
            router.refresh();
            
        } catch (error) {
            toast.error("Something Went Wrong");
            console.log(error);
        }finally{
            setDeletingId(null);
        }
    } 

    return(
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course Attachment 
                <Button onClick={toggleEdit}  variant={"ghost"}>
                    {isEditing && (
                        <>Cancel</>
                    )}
                    {!isEditing && (
                        <>
                        <PlusCircle className="h-4 w-4 mr-2"/>
                        Add a File
                        </>
                    )}

                </Button>
            </div>

            {!isEditing && (
               <>
                {initialData.attachments.length === 0 && (
                    <p className="text-sm mt-2 text-slate-500 italic">No Attachments Yet</p>
                )}
                {/* display the attachments */}
                {initialData.attachments.length > 0 && (
                    <div className="space-y-2">
                        {initialData.attachments.map((attachment)=> (
                            <div 
                            key={attachment.id}
                            className="flex items-center p-3 w-full bg-sky-100  border-sky-200 
                            border text-sky-700 rounded-md"
                            >
                            <File className="h-4 w-4 mr-2 flex-shrink-0"/>
                            <p className="text-xs line-clamp-1">{attachment.name}</p>
                            {deletingId === attachment.id && (
                                <div>
                                    <Loader2 className="h-4 w-4 animate-spin"/>
                                </div>
                            )}

                            {deletingId !== attachment.id && (
                                <button onClick={() => onDelete(attachment.id) }
                                 className="ml-auto hover:opacity-75 transition">
                                    <X className="h-4 w-4 "/>
                                </button>
                            )}

                            </div>
                        ))}
                    </div>
                ) }

               </>
            )}

            {isEditing && (
                <div>
                    <FileUpload 
                    endpoint="courseAttachment"
                    onChange={(url) => {
                        if(url) {
                            onSubmit({url:url});
                        }
                    }}
                    />

                    <div className="text-ts text-muted-foreground mt-4">
                        Add anything your students might need to complete the course.

                    </div>
                </div>
            )}
        </div>
    )
}