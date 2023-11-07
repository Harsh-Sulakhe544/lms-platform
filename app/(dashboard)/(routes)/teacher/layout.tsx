import { isTeacher } from "@/lib/teacher";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

// we also want to block the url for othjer persons to create courses 
const TeacherLayout = ({
    children
}:{
    children: React.ReactNode
}) => {
    const {userId} = auth();

    if(!isTeacher(userId)) {
        return redirect("/");

    }
    
    return ( 
        <>{children}</>
     );
}
 
export default TeacherLayout;