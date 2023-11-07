"use client";
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Chapter } from "@prisma/client";
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Editor } from "@/components/editor";
import { Preview } from "@/components/preview";


interface ChapterDescriptionFormProps {
    initialData: Chapter
    courseId: string;
    chapterId: string;
};

// create a schema 
const formSchema = z.object({
    description: z.string().min(1),
});
export const ChapterDescriptionForm = ({
    initialData, courseId, chapterId
}:ChapterDescriptionFormProps) => {
    // create a togle button for editing title 
    const [isEditing , setIsEditing] = useState(false);
    const toggleEdit = () => setIsEditing((current)=> !current)
    
    // use the router 
    const router = useRouter();

    // create the hook 
    const form = useForm<z.infer<typeof formSchema>>({
        resolver:zodResolver(formSchema), 
        defaultValues: {
            description: initialData.description || "",
        },
    });

    const { isSubmitting, isValid } = form.formState;
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
                Chapter Description 
                <Button onClick={toggleEdit}  variant={"ghost"}>
                    {isEditing ? (
                        <>Cancel</>
                    ):
                    (
                        <>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit Description
                        </>
                    )}
                </Button>
            </div>

            {!isEditing && (
                <div className={cn("text-sm mt-2", 
                !initialData.description && "text-slate-500 italic")}>
                    {!initialData.description && "No Description"}
                    {initialData.description && (
                        // render the actual-dat from the editor not the html
                        <Preview 
                            value={initialData.description}
                        />
                    )}
                </div>
            )}

            {isEditing && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                    <FormField  control={form.control} name="description" render={({field}) => (
                        <FormItem>
                            <FormControl>
                                <Editor 
                                {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} 
                    />

                    <div className="flex items-center gap-x-2">
                        <Button disabled={!isValid || isSubmitting} type="submit">
                            Save
                        </Button>
                    </div>
                    </form>
                    
                </Form>
            )}
        </div>
    )
}