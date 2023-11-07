"use client";
import * as z from "zod";
import axios from "axios";
import MuxPlayer from "@mux/mux-player-react";

import {  Pencil, PlusCircle, Video } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Chapter, MuxData } from "@prisma/client";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";


interface ChapterVideoFormProps {
    // w2 also need to render the upload video 
    initialData: Chapter & {muxData?: MuxData | null};
    courseId: string;
    chapterId : string
};

// create a schema 
const formSchema = z.object({
    videoUrl: z.string().min(1),
});

export const ChapterVideoForm = ({
    initialData, courseId, chapterId
}:ChapterVideoFormProps) => {
    // create a togle button for editing title 
    const [isEditing , setIsEditing] = useState(false);
    const toggleEdit = () => setIsEditing((current)=> !current)
    
    // use the router 
    const router = useRouter();

    const onSubmit = async (values:z.infer<typeof formSchema>) => 
    {
        // console.log(values);
        try {
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
            toast.success("Chapter updated");
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
                Chapter Video 
                <Button onClick={toggleEdit}  variant={"ghost"}>
                    {isEditing && (
                        <>Cancel</>
                    )}
                    {!isEditing && !initialData.videoUrl && (
                        <>
                        <PlusCircle className="h-4 w-4 mr-2"/>
                        Add a Video
                        </>
                    )}

                    {!isEditing && initialData.videoUrl && (
                        <>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit Video
                        </>
                    )}
                </Button>
            </div>

            {!isEditing && (
               !initialData.videoUrl ? (
                <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                    <Video className="h-10 w-10 text-slate-500"/>
                </div>
               ): (
                    <div className="relative aspect-video mt-2">
                        <MuxPlayer playbackId={initialData?.muxData?.playbackId || ""}
                        />
                    </div>
               )
            )}

            {isEditing && (
                <div>
                    <FileUpload 
                    endpoint="chapterVideo"
                    onChange={(url) => {
                        if(url) {
                            onSubmit({videoUrl:url});
                        }
                    }}
                    />

                    <div className="text-ts text-muted-foreground mt-4">
                        Upload this chapter&apos;s video   

                    </div>
                </div>
            )}

            {initialData.videoUrl && !isEditing && (
                <div className="text-xs text-muted-foreground mt-2">Videos can take a few minutes to process.Refresh the page if video does not appear.</div>
            )}
        </div>
    )
}