// init requirements
const express = require("express");
const { PrismaClient } = require("@prisma/client");

// create server objects
const app = express();
const prisma = new PrismaClient();

// create constants
const PORT = 3000;

// static functions
function random_choice(input) {
	const array = Array.from(input); // 🍍 typing
	const random_index = Math.floor(Math.random() * array.length);

	return array[random_index];
}

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
 *	response: Return a list of all employees
 */
app.get("/employees", async (req, res) => {
	try {
		res.json(await prisma.employee.findMany());
	} catch (error) {
		console.error(error);
		await prisma.$disconnect();
		res.status(500).json({
			error: "Something bad happened while fetching our employees...",
		});
	}
});
app.post(`/employees`, async (req, res) => {
	try {
		// TODO - figuire out how to do a POST request...
		const { name } = req.body;

		if (name) {
			const employee = await prisma.employee.create({ data: { name } });
			res.status(201).json(employee);
		} else {
			res
				.status(400)
				.send("Ensure the {body} of your request includes a {name} parameter.");
		}
	} catch (error) {
		console.error(error);
		await prisma.$disconnect();
		res.status(500).json({
			error: "Something bad happened while creating a new employee... :(",
		});
	}
});
/**
 * path: /employees/id
 * response: Returns the employee with the given id
 */
app.get("/employees/:id", async (req, res) => {
	try {
		const { id } = req.params;

		if (id === "random") {
			return res.json(random_choice(await prisma.employee.findMany()));
		}

		const employee = await prisma.employee.findUnique({
			where: { id: Number(id) },
		});

		if (employee) {
			res.json(employee);
		} else {
			res.status(404).send(`Could not find any employee with ID #${id}.`);
		}
	} catch (error) {
		console.error(error);
		await prisma.$disconnect();
		res.status(500).json({
			error: "Something bad happened while fetching our employees...",
		});
	}
});
//app.get("/", (req, res)=>{})

// listen
app.listen(PORT);
