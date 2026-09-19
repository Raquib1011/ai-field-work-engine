require('dotenv').config();
const prisma = require('../src/prisma');

async function main() {
    // Clean up existing data
    await prisma.skill.deleteMany({});
    await prisma.workOrder.deleteMany({});
    await prisma.user.deleteMany({});

    // Create a Technician with skills
    const tech = await prisma.user.create({
        data: {
            name: 'Alex Rivera',
            email: 'alex.rivera@fieldtech.com',
            role: 'TECHNICIAN',
            location_zip: '10001',
            skills: {
                create: [
                    { skill_name: 'HVAC Repair', experience_years: 5 },
                    { skill_name: 'Electrical Wiring', experience_years: 3 }
                ]
            }
        }
    }
    );

    // Create a Work Order requiring skills
    const workOrder = await prisma.workOrder.create({
        data: {
            title: 'Commercial HVAC System Overhaul',
            description: 'Inspect and repair rooftop cooling units.',
            required_skills: JSON.stringify(['HVAC Repair', 'Electrical Wiring']),
            status: 'OPEN'
        }
    });

    console.log('--- Database Seed Successful ---');
    console.log(`Technician ID : ${tech.id}`);
    console.log(`Work Order ID : ${workOrder.id}`);
}

main()
    .catch((e) => {
        console.error('Seed Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });