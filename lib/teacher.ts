// we want to protect this teacher mode so that only we can access not other 
export const isTeacher = (userId?: string | null) => {
    return userId === process.env.NEXT_PUBLIC_TEACHER_ID;
}