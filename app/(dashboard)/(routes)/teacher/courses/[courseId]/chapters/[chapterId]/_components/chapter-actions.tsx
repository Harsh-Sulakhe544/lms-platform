"use client";
import axios from "axios";

import { Trash } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/modals/confirm-modal";

interface ChapterActionsProps  {
    disabled: boolean;
    courseId: string;
    chapterId: string;
    isPublished: boolean;
};

export const ChapterActions= ({
    disabled, courseId , chapterId, isPublished
}: ChapterActionsProps) => {

    // create a response for cancel and continue in dialog-box 
    const router = useRouter();
    const [isLoading, setIsloading] = useState(false);

    // amke button publish-to respond to publish the course 
    const onClick = async () => {
        try {
            setIsloading(true);

            if(isPublished) {
                await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/unpublish`);
                toast.success("Chapter unPublished");
            }
            else {
                await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/publish`);
                toast.success("Chapter Published");
            }

            // refresh to move the banner when course is published 
            router.refresh();
            
        } catch (error) {
            toast.error("Something went wrong");
            
        }finally{
            setIsloading(false);
        }
    } 

    const onDelete = async () => {
        try {
            setIsloading(true);
            await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`);
            toast.success("Chapter deleted");

            router.refresh();
            router.push(`/teacher/courses/${courseId}`);
            
        } catch (error) {
            toast.error("Something went wrong");
        }finally{
            setIsloading(false);
        }
    }
    return (
        <div className="flex items-center gap-x-2">
            <Button onClick={onClick}
                disabled={disabled || isLoading}
                variant={"outline"}
                size={"sm"}
            >
            {isPublished ? "unPublish" : "Publish"}
            </Button>

            <ConfirmModal onConfirm={onDelete}>
                <Button  size={"sm"} disabled={isLoading}> 
                    <Trash className="h-4 w-4"/>
                </Button>
            </ConfirmModal>

        </div>
    )
}