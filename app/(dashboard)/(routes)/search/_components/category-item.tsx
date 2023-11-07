"use client";
import  qs  from "query-string";

import { IconType } from "react-icons";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";

interface CategoryItemProps {
    
    label:string
    icon?: IconType
    value?: string
}
export const CategoryItem = ({
    label, icon:Icon, value
}: CategoryItemProps) => {

    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    // check which category , title is selected (title should be searched in url - so we need to store it somewhere )
    const currentCategoryId = searchParams.get("categoryId");
    const currentTitle = searchParams.get("title");

    const isSelected = currentCategoryId === value;

    // we want url-stringified 
    const onClick = () => {
        const url = qs.stringifyUrl({
            url: pathname, 
            query: {
                title: currentTitle,
                // if user already selects again same thing , categoryId should disappear , unselect the option now  
                categoryId: isSelected ? null : value
            }
        }, {skipNull: true, skipEmptyString: true});
        router.push(url);
    };
    return (
        <button onClick={onClick}
        className = {
            cn("py-2 px-3 text-sm border border-slate-200 rounded-full flex items-center gap-x-1 hover:border-sky-200 transition", 
            // TODO change active styles 
            isSelected && "border-sky-700 bg-sky-200/20 text-sky-800"
            )}  type="button"
            >
            {Icon && <Icon size={20} />}
            <div className="truncate">{label}</div>
        </button>
    )
}