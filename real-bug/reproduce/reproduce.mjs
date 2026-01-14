import { RunnableLambda } from "@langchain/core/runnables";

async function test() {
    try {
        const run = new RunnableLambda({ func: (x) => "passed" });
        await run.invoke("hello");
    } catch (error) {
        console.log("\n!!! ERROR REPRODUCED !!!");
        console.log("Error Message:", error.message);
        console.log("Error Type:", error.constructor.name);
        console.log("Stack:", error.stack);
        console.log("--------------------------\n");
    }
}

test();
