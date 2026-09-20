require('dotenv').config(); 

// Import the working configured client from your src folder
const prisma = require('../src/prisma'); 

async function main() {
    console.log('Flushing existing database...');
    await prisma.skill.deleteMany();
    await prisma.workOrder.deleteMany();
    await prisma.user.deleteMany();

    console.log('Seeding Technicians...');
    await prisma.user.create({
        data: {
            name: 'Alex Rivera', email: 'alex@example.com', role: 'TECHNICIAN', location_zip: '10001',
            skills: { create: [{ skill_name: 'HVAC Repair', experience_years: 5 }, { skill_name: 'Electrical Wiring', experience_years: 3 }] }
        }
    });

    await prisma.user.create({
        data: {
            name: 'Sarah Chen', email: 'sarah@example.com', role: 'TECHNICIAN', location_zip: '10002',
            skills: { create: [{ skill_name: 'Network Routing', experience_years: 4 }, { skill_name: 'Cisco Networking', experience_years: 2 }] }
        }
    });

    await prisma.user.create({
        data: {
            name: 'Mike Johnson', email: 'mike@example.com', role: 'TECHNICIAN', location_zip: '10003',
            skills: { create: [{ skill_name: 'Plumbing', experience_years: 6 }, { skill_name: 'HVAC Repair', experience_years: 1 }] }
        }
    });

    console.log('Seeding Work Orders...');
    await prisma.workOrder.createMany({
        data: [
            { 
                title: 'Commercial HVAC System Overhaul', 
                description: 'Inspect and repair rooftop cooling units.', 
                required_skills: JSON.stringify(['HVAC Repair', 'Electrical Wiring']), 
                status: 'OPEN' 
            },
            { 
                title: 'Enterprise Data Center Routing', 
                description: 'Install and configure core routing equipment.', 
                required_skills: JSON.stringify(['Network Routing', 'Cisco Networking']), 
                status: 'OPEN' 
            },
            { 
                title: 'Emergency Server Room Leak', 
                description: 'Fix main water line leak near server racks.', 
                required_skills: JSON.stringify(['Plumbing', 'Facilities Maintenance']), 
                status: 'OPEN' 
            }
        ]
    });

    console.log('Database seeded successfully!');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });