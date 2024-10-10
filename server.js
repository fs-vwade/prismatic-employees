// init requirements
const express = require("express");
const { PrismaClient } = require("@prisma/client");

// create server objects
const app = express();
const prisma = new PrismaClient();

// create constants
const PORT = 3000;

// create middleware to parse incoming JSON payloads
app.use(express.json());

// method, path, handler
/**
 * path: /
 * response: Return API welcome message
 */
app.get("/", (req, res) => {
	res.send("Welcome to the Prismatic Employees API.");
});
/**
 *	path: /employees
 *	return
 */
app.get("/employees", async (req, res) => {
	try {
		res.json(await prisma.employee.findMany());
	} catch (error) {
		res
			.status(500)
			.send("Something bad happened while fetching our employees...");
	}
});
app.get("/employees/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const employees = await prisma.employee.findMany();

		if (id === "random") {
			const rval = Math.floor(Math.random() * employees.length);
			const employee = employees.filter((e) => e.id == rval)[0];
			res.json(employee);
		} else if (0 <= +id && +id < employees.length) {
			const employee = employees.filter((e) => e.id == +id)[0];
			res.json(employee);
		} else {
			res.status(404).send("No employee exists with that ID.");
		}
	} catch (error) {
		res
			.status(500)
			.send("Something bad happened while fetching our employees...");
	}
});
//app.get("/", (req, res)=>{})

// listen
app.listen(PORT);
