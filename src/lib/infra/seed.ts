import {
	EmploymentType,
	JobStatus,
	PrismaClient,
	WorkplaceLocation,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
	console.log("🌱 Starting database seeding...");

	// Create departments
	console.log("Creating departments...");
	const engineeringDept = await prisma.department.upsert({
		where: { name: "Engineering" },
		update: {},
		create: {
			name: "Engineering",
		},
	});

	const marketingDept = await prisma.department.upsert({
		where: { name: "Marketing" },
		update: {},
		create: {
			name: "Marketing",
		},
	});

	const salesDept = await prisma.department.upsert({
		where: { name: "Sales" },
		update: {},
		create: {
			name: "Sales",
		},
	});

	const designDept = await prisma.department.upsert({
		where: { name: "Design" },
		update: {},
		create: {
			name: "Design",
		},
	});

	await prisma.department.upsert({
		where: { name: "Human Resources" },
		update: {},
		create: {
			name: "Human Resources",
		},
	});

	// Create jobs
	console.log("Creating jobs...");
	const seniorSoftwareEngineerJob = await prisma.job.create({
		data: {
			title: "Senior Software Engineer",
			descriptionMarkdown: `# Senior Software Engineer

We are looking for a **Senior Software Engineer** to join our growing engineering team.

## Responsibilities:
- Design and implement scalable web applications
- Mentor junior developers
- Collaborate with cross-functional teams
- Write clean, maintainable code
- Participate in code reviews

## Requirements:
- 5+ years of software development experience
- Proficiency in JavaScript/TypeScript
- Experience with React or similar frameworks
- Knowledge of Node.js and databases
- Strong problem-solving skills

## Nice to have:
- Experience with cloud platforms (AWS, GCP, Azure)
- Knowledge of containerization (Docker, Kubernetes)
- Previous experience in a startup environment`,
			workplaceLocation: WorkplaceLocation.HYBRID,
			country: "United States",
			city: "San Francisco",
			zipCode: "94102",
			employmentType: EmploymentType.FULL_TIME,
			salaryMin: 120000,
			salaryMax: 180000,
			status: JobStatus.OPEN,
			departmentId: engineeringDept.id,
		},
	});

	const frontendDeveloperJob = await prisma.job.create({
		data: {
			title: "Frontend Developer",
			descriptionMarkdown: `# Frontend Developer

Join our team to build amazing user experiences!

## What you'll do:
- Develop responsive web applications
- Work closely with designers and product managers
- Optimize applications for speed and scalability
- Implement modern UI/UX patterns

## Requirements:
- 3+ years of frontend development experience
- Strong skills in HTML, CSS, JavaScript
- Experience with React, Vue, or Angular
- Understanding of modern build tools
- Eye for design and user experience`,
			workplaceLocation: WorkplaceLocation.REMOTE,
			country: "United States",
			city: "New York",
			zipCode: "10001",
			employmentType: EmploymentType.FULL_TIME,
			salaryMin: 90000,
			salaryMax: 130000,
			status: JobStatus.OPEN,
			departmentId: engineeringDept.id,
		},
	});

	const marketingManagerJob = await prisma.job.create({
		data: {
			title: "Digital Marketing Manager",
			descriptionMarkdown: `# Digital Marketing Manager

Lead our digital marketing efforts and drive growth!

## Responsibilities:
- Develop and execute digital marketing strategies
- Manage social media campaigns  
- Analyze marketing metrics and ROI
- Collaborate with content creators
- Optimize conversion funnels

## Requirements:
- 4+ years of digital marketing experience
- Proficiency with marketing tools (Google Analytics, HubSpot, etc.)
- Strong analytical and communication skills
- Experience with A/B testing
- Knowledge of SEO/SEM best practices`,
			workplaceLocation: WorkplaceLocation.ON_SITE,
			country: "United States",
			city: "Austin",
			zipCode: "73301",
			employmentType: EmploymentType.FULL_TIME,
			salaryMin: 80000,
			salaryMax: 110000,
			status: JobStatus.OPEN,
			departmentId: marketingDept.id,
		},
	});

	const uxDesignerJob = await prisma.job.create({
		data: {
			title: "UX/UI Designer",
			descriptionMarkdown: `# UX/UI Designer

Create intuitive and beautiful user experiences!

## What you'll do:
- Design user interfaces for web and mobile applications
- Conduct user research and usability testing
- Create wireframes, prototypes, and mockups
- Collaborate with developers and product managers
- Maintain design systems and style guides

## Requirements:
- 3+ years of UX/UI design experience
- Proficiency in Figma, Sketch, or Adobe Creative Suite
- Strong portfolio showcasing design process
- Understanding of user-centered design principles
- Experience with prototyping tools`,
			workplaceLocation: WorkplaceLocation.HYBRID,
			country: "Canada",
			city: "Toronto",
			zipCode: "M5H 2N2",
			employmentType: EmploymentType.FULL_TIME,
			salaryMin: 70000,
			salaryMax: 95000,
			status: JobStatus.OPEN,
			departmentId: designDept.id,
		},
	});

	const salesRepJob = await prisma.job.create({
		data: {
			title: "Sales Representative",
			descriptionMarkdown: `# Sales Representative

Drive revenue growth through strategic sales!

## Responsibilities:
- Generate new business opportunities
- Build and maintain client relationships
- Meet and exceed sales targets
- Conduct product demonstrations
- Collaborate with marketing team on lead generation

## Requirements:
- 2+ years of B2B sales experience
- Excellent communication and negotiation skills
- Proven track record of meeting sales goals
- CRM software experience (Salesforce preferred)
- Self-motivated and results-driven`,
			workplaceLocation: WorkplaceLocation.REMOTE,
			country: "United States",
			city: "Chicago",
			zipCode: "60601",
			employmentType: EmploymentType.FULL_TIME,
			salaryMin: 60000,
			salaryMax: 85000,
			status: JobStatus.OPEN,
			departmentId: salesDept.id,
		},
	});

	const internshipJob = await prisma.job.create({
		data: {
			title: "Software Engineering Intern",
			descriptionMarkdown: `# Software Engineering Intern

Kick-start your career in software development!

## What you'll learn:
- Full-stack web development
- Best practices in software engineering
- Agile development methodologies
- Code review and testing practices
- Working in a professional development environment

## Requirements:
- Currently pursuing Computer Science or related degree
- Basic knowledge of programming languages
- Eagerness to learn and grow
- Strong problem-solving skills
- Good communication abilities`,
			workplaceLocation: WorkplaceLocation.ON_SITE,
			country: "United States",
			city: "Seattle",
			zipCode: "98101",
			employmentType: EmploymentType.INTERNSHIP,
			salaryMin: 5000,
			salaryMax: 7000,
			status: JobStatus.OPEN,
			departmentId: engineeringDept.id,
		},
	});

	// Create job tags
	console.log("Creating job tags...");
	const tags = [
		"JavaScript",
		"TypeScript",
		"React",
		"Node.js",
		"Python",
		"AWS",
		"Docker",
		"Kubernetes",
		"Frontend",
		"Backend",
		"Full-Stack",
		"Remote",
		"Senior",
		"Junior",
		"Marketing",
		"SEO",
		"SEM",
		"Analytics",
		"UX",
		"UI",
		"Design",
		"Figma",
		"Sales",
		"B2B",
		"CRM",
		"Internship",
		"Entry-Level",
		"Hybrid",
		"On-Site",
	];

	for (const tagName of tags) {
		await prisma.jobTag.upsert({
			where: { name: tagName },
			update: {},
			create: {
				name: tagName,
			},
		});
	}

	// Connect some tags to jobs
	console.log("Connecting tags to jobs...");

	// Senior Software Engineer tags
	await prisma.job.update({
		where: { id: seniorSoftwareEngineerJob.id },
		data: {
			tags: {
				connect: [
					{ name: "JavaScript" },
					{ name: "TypeScript" },
					{ name: "React" },
					{ name: "Node.js" },
					{ name: "AWS" },
					{ name: "Senior" },
					{ name: "Full-Stack" },
					{ name: "Hybrid" },
				],
			},
		},
	});

	// Frontend Developer tags
	await prisma.job.update({
		where: { id: frontendDeveloperJob.id },
		data: {
			tags: {
				connect: [
					{ name: "JavaScript" },
					{ name: "React" },
					{ name: "Frontend" },
					{ name: "Remote" },
				],
			},
		},
	});

	// Marketing Manager tags
	await prisma.job.update({
		where: { id: marketingManagerJob.id },
		data: {
			tags: {
				connect: [
					{ name: "Marketing" },
					{ name: "SEO" },
					{ name: "SEM" },
					{ name: "Analytics" },
					{ name: "On-Site" },
				],
			},
		},
	});

	// UX Designer tags
	await prisma.job.update({
		where: { id: uxDesignerJob.id },
		data: {
			tags: {
				connect: [
					{ name: "UX" },
					{ name: "UI" },
					{ name: "Design" },
					{ name: "Figma" },
					{ name: "Hybrid" },
				],
			},
		},
	});

	// Sales Rep tags
	await prisma.job.update({
		where: { id: salesRepJob.id },
		data: {
			tags: {
				connect: [
					{ name: "Sales" },
					{ name: "B2B" },
					{ name: "CRM" },
					{ name: "Remote" },
				],
			},
		},
	});

	// Internship tags
	await prisma.job.update({
		where: { id: internshipJob.id },
		data: {
			tags: {
				connect: [
					{ name: "JavaScript" },
					{ name: "Internship" },
					{ name: "Entry-Level" },
					{ name: "On-Site" },
				],
			},
		},
	});

	console.log("✅ Database seeding completed!");
	console.log(`Created ${await prisma.department.count()} departments`);
	console.log(`Created ${await prisma.job.count()} jobs`);
	console.log(`Created ${await prisma.jobTag.count()} job tags`);
}

main()
	.catch((e) => {
		console.error("❌ Error during seeding:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
