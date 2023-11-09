"use client";

import { UserButton,  useAuth } from "@clerk/nextjs";
import {usePathname} from "next/navigation";
import { LogOut } from "lucide-react";
import  Link  from "next/link";

import { Button } from "@/components/ui/button";
import { SearchInput } from "./search-input";


export const NavbarRoutes = () => {
    const {userId} = useAuth();

    const pathname = usePathname();
    
    // if pathname is not available, then we use ? for reduce routing errors 

    // create a teacher-page 
    const isTeacherPage = pathname?.startsWith("/teacher");
    const isCoursePage = pathname?.includes("/courses"); // this is individual-course page 
    const isSearchPage = pathname === "/search"; // to search 
    
    return (
    <> 
    {isSearchPage && (
        <div className="hidden md:block">
            <SearchInput />
        </div>
    )}
        <div className="flex gap-x-2 ml-auto">
            {isTeacherPage || isCoursePage ? (
            <Link href={"/"}> 
              <Button size={"sm"} variant={"ghost"}>
                <LogOut className="h-4 w-4 mr-2" /> Exit
              </Button>
            </Link>  

            ): (
                <Link href={"/teacher/courses"}> 
                    <Button size={"sm"} variant={"ghost"}> Teacher mode</Button>
                </Link>
            )}
            {/* redirect to our-app , instead of clerk when log-out  */}
            <UserButton afterSignOutUrl="/" />
        </div>
    </>    
    )
}