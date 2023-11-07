// to avoid overflow / crash we create globalThis - to avoid crashing 
import {  PrismaClient} from "@prisma/client";

declare global {
    //  | is used to avoid errors 
    var prisma: PrismaClient | undefined;
};
export const db = globalThis.prisma || new PrismaClient();

if(process.env.NODE_ENV !== "production") globalThis.prisma = db;