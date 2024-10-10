const prisma = require("../prisma");
const seed = async () =>
	await prisma.employee.createMany({
		data: [...new Array(10)].map(e, (idx) => ({ name: `Employee ${i}` })),
	});

seed()
	.then(async () => await prisma.$disconnect())
	.catch(async (error) => {
		console.error(error);
		await prisma.$disconnect();
		process.exit(1);
	});
