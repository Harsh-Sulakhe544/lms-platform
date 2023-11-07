"use client";
import axios from "axios";
import { CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti-store";

interface CourseProgressButtonProps {
    chapterId:string;
    courseId:string;
    nextChapterId?:string;
    isCompleted?:boolean;
};

export const CourseProgressButton = ({
    chapterId, courseId, nextChapterId, isCompleted
}: CourseProgressButtonProps) => {
    const router = useRouter();
    const confetti = useConfettiStore();
    const [isLoading, setIsLoading] = useState(false);

    const onClick = async () => {
        try {
            setIsLoading(true);
            // create a toggle button 
            await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
                isCompleted: !isCompleted
            });

            // if we completed-last chapter 
            if(!isCompleted && !nextChapterId) {
                confetti.onOpen();
            }

            // but if there is next chapter 
            if(!isCompleted && nextChapterId) {
                router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
            }

            toast.success("Progress Updated");
            router.refresh();

        } catch (error) {
            toast.error("Something went wrong")
        }finally{
            setIsLoading(false)
        }
    }

    const Icon = isCompleted ? XCircle : CheckCircle
    return (
        <Button type="button" onClick={onClick} disabled={isLoading} variant={isCompleted ? "outline": "success"} 
        className="w-full md:w-auto">
            {isCompleted? "Not Completed": "Mark as complete"}
            <Icon className="h-4 w-4 ml-2"/>

        </Button>
    )
}