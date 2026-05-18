const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.spell.findFirst({where: {name: 'Aliado Animal'}}).then(s => console.log(s)).finally(() => p.$disconnect());
