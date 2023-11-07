"use client";
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {  Loader2, PlusCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Chapter,Course } from "@prisma/client";
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { ChaptersList } from "./chapters-list";


interface ChaptersFormProps {
    // check prsima for chapters as well 
    initialData:Course & {chapters: Chapter[]}
    courseId: string
};

// create a schema 
const formSchema = z.object({
    title: z.string().min(1),
});
export const ChaptersForm = ({
    initialData, courseId
}:ChaptersFormProps) => {
    // create or re-order the chapter 
    const [isCreating, setIsCreating] = useState(false);
    
    // create a togle button for editing title 
    const [isUpdating , setIsUpdating] = useState(false);
    const toggleCreating = () =>{
        setIsCreating((current)=> !current)
    }
    
    // use the router 
    const router = useRouter();

    // create the hook 
    const form = useForm<z.infer<typeof formSchema>>({
        resolver:zodResolver(formSchema), 
        defaultValues: {
            title:  "",
        },
    });

    const { isSubmitting, isValid } = form.formState;
    const onSubmit = async (values:z.infer<typeof formSchema>) => 
    {
        // console.log(values);
        try {
            await axios.post(`/api/courses/${courseId}/chapters`, values);
            toast.success("Chapter Created");
            toggleCreating();
            // fetch the new-data from the database
            router.refresh();

        } catch (error) {
            toast.error("Something Went Wrong");
        }
    };

    // when drag and drop to change the order of the course , it should not come to initial stage when refreshed 
    const onReorder = async (updateData: { id: string; position: number }[] ) => {
        try {
            setIsUpdating(true);
            await axios.put(`/api/courses/${courseId}/chapters/reorder`, {
                list: updateData
            });
            toast.success("Chapters Reordered");
            router.refresh();
            
        } catch  {
            toast.error("Something went wrong");
        }finally{
            setIsUpdating(false);

        }
    }

    // enable the pencil-icon for chapters
    const onEdit = (id: string) => {
        router.push(`/teacher/courses/${courseId}/chapters/${id}`)
    }

    return(
        <div className="relative mt-6 border bg-slate-100 rounded-md p-4">
            {isUpdating && (
                <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-md flex items-center justify-center">
                    <Loader2 className="animate-spin h-6 w-6 text-sky-700" />
                </div>
            )}
            <div className="font-medium flex items-center justify-between">
                Course Chapters 
                <Button onClick={toggleCreating}  variant={"ghost"}>
                    {isCreating ? (
                        <>Cancel</>
                    ):
                    (
                        <>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add a Chapter
                        </>
                    )}
                </Button>
            </div>

            {isCreating && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                        <FormField  control={form.control} name="title" render={({field}) => (
                            <FormItem>
                                <FormControl>
                                    <Input disabled={isSubmitting} placeholder="e.g `Introduction to the course`"
                                    {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} 
                        />
                        
                        <Button disabled={!isValid || isSubmitting} type="submit">
                            Create
                        </Button>  
                    </form>
                </Form>
            )}

            {!isCreating && (
                <div className={cn("text-sm mt-2", 
                !initialData.chapters.length && "text-slate-500 italic")}>
                    {!initialData.chapters.length && "No Chapters"}
                    {/* TODO A LIST OF CHAPTERS */}
                    <ChaptersList 
                    onEdit={onEdit}
                    onReorder = {onReorder}
                    items={initialData.chapters || []}
                    />
                </div>
            )}

            {!isCreating && (
                <p className="text-xs text-muted-foreground mt-4">
                    Drag and drop to Reorder the course
                </p>
            )}
        </div>
    )
}