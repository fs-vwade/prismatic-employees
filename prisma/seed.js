const prisma = require("../prisma");
const seed = async () =>
	await prisma.employee.createMany({
		data: [...new Array(10)].map((e, idx) => ({ name: `Employee ${idx}` })),
	});

seed()
	.then(async () => await prisma.$disconnect())
	.catch(async function (error) {
		console.error(error);
		await prisma.$disconnect();
		process.exit(1);
	});
