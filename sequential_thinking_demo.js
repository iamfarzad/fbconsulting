// This script demonstrates using the Sequential Thinking MCP server
// to solve a complex problem step by step

// The problem: Given a 3x3 magic square where each row, column, and diagonal sums to 15,
// determine the missing number in the following partially filled square:
// 2 7 6
// 9 ? 1
// 4 3 8

console.log("Sequential Thinking Demonstration - Solving a Magic Square Problem");
console.log("Problem: Find the missing number in the 3x3 magic square:");
console.log("2 7 6");
console.log("9 ? 1");
console.log("4 3 8");
console.log("\nEach row, column, and diagonal must sum to 15");
console.log("\nWe'll use sequential thinking to solve this step by step.");
console.log("\nStep 1: First row sum: 2 + 7 + 6 = " + (2 + 7 + 6));
console.log("Step 2: Second row sum: 9 + ? + 1 = 15, so ? = " + (15 - 9 - 1));
console.log("Step 3: Verification - Middle column: 7 + 5 + 3 = " + (7 + 5 + 3));
console.log("Step 4: Verification - First diagonal: 2 + 5 + 8 = " + (2 + 5 + 8));
console.log("Step 5: Verification - Second diagonal: 6 + 5 + 4 = " + (6 + 5 + 4));
console.log("\nSolution: The missing number is 5");

/*
This problem demonstrates Sequential Thinking by:
1. Breaking down a complex problem into steps
2. Building on previous steps to reach a solution
3. Verifying the solution with multiple checks
4. Proceeding in a logical, methodical manner
*/
