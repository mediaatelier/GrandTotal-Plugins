/*
	TestData Time Importer

	Returns a fixed JSON array with 2000 test time entries.
	Includes a diverse mix of Clients, Projects, Categories, and Users.

	Expected result format:
	[
		{"startDate":"2015-05-24T17:49:27+02:00","client":"Client A","project":"My Project","category":"Development","minutes":120,"notes":"HTML Coding","user":"John Smith","cost":200,"uid":"com.testdata.1"},
		...
	]
*/

function generateTestData() {
	// Arrays of diverse English names and descriptions
	var clients = [
		"Tech Innovations Inc", "Global Marketing Solutions", "Enterprise Consulting Group",
		"Digital Ventures LLC", "Creative Design Studio", "Strategic Management Partners",
		"Software Development Corp", "Financial Services Group", "Healthcare Systems Ltd",
		"Retail Solutions Inc", "Manufacturing Alliance", "Education Technology Co",
		"Media & Entertainment LLC", "Real Estate Holdings", "Transportation Services",
		"Energy & Utilities Group", "Hospitality Management", "Legal Advisory Services",
		"Insurance Partners LLC", "Telecommunications Corp", "Construction & Engineering",
		"Pharmaceutical Research", "Automotive Solutions", "Aerospace Technologies",
		"Food & Beverage Group"
	];

	var projects = [
		"Website Redesign", "Mobile App Development", "Cloud Migration",
		"Digital Marketing Campaign", "Database Optimization", "API Integration",
		"E-commerce Platform", "Customer Portal", "Internal Dashboard",
		"Security Audit", "Performance Testing", "User Research Study",
		"Brand Identity Refresh", "SEO Optimization", "Social Media Strategy",
		"Content Management System", "Payment Gateway Integration", "Email Marketing Automation",
		"Business Intelligence Reports", "Infrastructure Upgrade", "Training Program Development",
		"Quality Assurance Testing", "Product Launch Campaign", "Customer Feedback Analysis",
		"Technical Documentation", "System Architecture Review", "Data Analytics Platform",
		"Compliance Assessment", "Legacy System Modernization", "Vendor Integration"
	];

	var categories = [
		"Development", "Design", "Consulting", "Testing", "Analysis",
		"Planning", "Documentation", "Research", "Training", "Support",
		"Meetings", "Code Review", "Bug Fixing", "Deployment", "Monitoring",
		"Security", "Performance", "UX/UI", "Backend", "Frontend",
		"Database", "DevOps", "Architecture", "Integration", "Migration"
	];

	var users = [
		"John Smith", "Sarah Johnson", "Michael Brown", "Emily Davis", "David Wilson",
		"Jennifer Martinez", "Robert Anderson", "Lisa Thompson", "James Garcia", "Mary Rodriguez",
		"Christopher Lee", "Patricia White", "Daniel Harris", "Linda Clark", "Matthew Lewis",
		"Barbara Walker", "Thomas Hall", "Elizabeth Allen", "Joseph Young", "Margaret King",
		"Charles Wright", "Susan Lopez", "Ryan Hill", "Nancy Scott", "Kevin Green",
		"Karen Adams", "Brian Baker", "Betty Nelson", "Steven Carter", "Helen Mitchell"
	];

	var activities = [
		"Implementing new feature", "Fixing critical bug", "Code refactoring",
		"Client meeting and requirements gathering", "Design mockups and wireframes",
		"Database schema optimization", "API endpoint development", "Security vulnerability assessment",
		"Writing unit tests", "Documentation updates", "Performance profiling",
		"User interface improvements", "Backend logic implementation", "Integration testing",
		"Code review and feedback", "Sprint planning session", "Troubleshooting production issues",
		"Data migration scripts", "Third-party API integration", "Configuration management",
		"Server maintenance", "Team collaboration and standup", "Technical architecture planning",
		"Quality assurance testing", "User acceptance testing", "Deployment preparation",
		"Monitoring and analytics setup", "Customer support escalation", "Research and prototyping",
		"Training and knowledge transfer", "System documentation", "Performance optimization",
		"Cross-browser testing", "Mobile responsiveness fixes", "Accessibility improvements",
		"Load testing and stress testing", "Backup and recovery procedures", "Security patch deployment",
		"Version control management", "Continuous integration setup", "Email template design",
		"Report generation development", "Dashboard widget creation", "Notification system implementation",
		"Payment processing integration", "Authentication and authorization", "Error logging and monitoring",
		"Content updates and revisions", "SEO meta tags optimization", "Social media integration"
	];

	var result = [];
	var baseDate = new Date();
	baseDate.setFullYear(baseDate.getFullYear() - 1); // Start from one year ago

	for (var i = 0; i < 2000; i++) {
		var item = {};

		// Generate a date within the last year
		var daysOffset = Math.floor(Math.random() * 365);
		var hoursOffset = Math.floor(Math.random() * 24);
		var minutesOffset = Math.floor(Math.random() * 60);

		var entryDate = new Date(baseDate);
		entryDate.setDate(entryDate.getDate() + daysOffset);
		entryDate.setHours(hoursOffset);
		entryDate.setMinutes(minutesOffset);

		item.startDate = entryDate.toISOString();

		// Assign random client, project, category, and user
		item.client = clients[i % clients.length];
		item.project = projects[i % projects.length];
		item.category = categories[i % categories.length];
		item.user = users[i % users.length];

		// Random duration between 15 minutes and 8 hours (in 15-minute increments)
		var minuteOptions = [15, 30, 45, 60, 90, 120, 150, 180, 210, 240, 300, 360, 420, 480];
		item.minutes = minuteOptions[i % minuteOptions.length];

		// Activity description
		var activityIndex = i % activities.length;
		item.notes = activities[activityIndex];

		// Calculate cost (assuming $100/hour rate)
		var hourlyRate = 100;
		item.cost = (hourlyRate * item.minutes) / 60;

		// Unique identifier
		item.uid = "com.testdata." + (i + 1);

		result.push(item);
	}

	return result;
}

// Execute and return the test data
generateTestData();
