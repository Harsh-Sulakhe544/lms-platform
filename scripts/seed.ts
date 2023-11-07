// this will help to find the courses of similar category 
const {PrismaClient} = require("@prisma/client");

const database = new PrismaClient();

async function main() {
    try {
        await database.category.createMany({
            data: [
               {name: "Computer Science"}, 
               {name: "Music"}, 
               {name: "Fitness"}, 
               {name: "Photography"}, 
               {name: "Accounting"}, 
               {name: "Engineering"}, 
               {name: "Filming"}, 
            ]
        });
        console.log("Success");
    } catch (error) {
        console.log("Error Seeding the database categories", error);
    }finally{
        await database.$disconnect();
    }
}

// run the main() using nodejs 
main();