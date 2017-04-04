module Views {



		export class CVView extends ViewBase {

				private technos = [
						{
								id: "blockLangs",
								title: "Languages",
								isRoot: true,
								cont: "bprint1",
								text: ""
						},
						{
								technoExport: true,
								id: "blockCSharp",
								title: "C#",
								yearsExperience: 16,
								realKnowledge: 9,
								isRoot: false,
								cont: "blockLangs",
								text: `I've been coding in C# on every project in my professional career. 
												During this time, I developed a general sense for application designing and architecture.`
						},
						{
								technoExport: true,
								id: "blockES5",
								title: "JavaScript 5",
								yearsExperience: 8,
								realKnowledge: 7,
								isRoot: false,
								cont: "blockLangs",
								text: `Roughly half of the projects I took part of, required usage of JavaScript. 
												However I was using TypeScript in last 2 years, I still know ES5 syntax quite well. I don't have any experience with ES6 or higher.`
						},
						{
								technoExport: true,
								id: "blockTS",
								title: "TypeScript",
								yearsExperience: 2,
								realKnowledge: 8,
								isRoot: false,
								cont: "blockLangs",
								text: `I was using TypeScript on the last project, nearly 2 years and I felt in love with its syntax.`
						},

						{
								id: "blockBackend",
								title: "Backend",
								isRoot: true,
								cont: "bprint1",
								text: ""
						},
						{
								technoExport: true,
								id: "blockAspNet",
								title: "ASP.NET MVC",
								yearsExperience: 8,
								realKnowledge: 7,
								isRoot: false,
								cont: "blockBackend",
								text: `I have worked on several ASP.NET MVC projects.These days I am a bit more familiar with vNext MVC, but I can update my knowledge within days.`
						},
						{
								technoExport: true,
								id: "blockAspNetVN",
								title: "ASP.NET MVC vNext",
								titleShort: "vNext",
								yearsExperience: 2,
								realKnowledge: 8,
								isRoot: false,
								cont: "blockBackend",
								text: `The technology of my last project. Well done by Microsoft. I appreciate it's integration with Bower packages, middleware-like request flow and project structure generally.
												I consider this technology as a current peak of web development.`
						},
						{
								technoExport: true,
								id: "blockAzure",
								title: "Azure",
								yearsExperience: 3,
								realKnowledge: 6,
								isRoot: false,
								cont: "blockBackend",
								text: `I have experience with deployment and configuration of web services from two projects.`
						},
						
						{
								id: "blockWeb",
								title: "Web",
								isRoot: true,
								cont: "bprint1",
								text: ""
						},
						{
								technoExport: true,
								id: "blockjQuery",
								title: "jQuery",
								yearsExperience: 6,
								realKnowledge: 8,
								isRoot: false,
								cont: "blockWeb",
								text: `I worked with jQuery on several projects and still consider it as one of the best JS frameworks out there.`
						},
						{
								id: "blockBrowserInterface",
								title: "HTML/HTML5 browser interface",
								yearsExperience: 6,
								realKnowledge: 6,
								isRoot: false,
								cont: "blockWeb",
								text: `My knowledge of browser functionality interface is mostly hidden behind jQuery. I have an average knowledge, but already started improving my knowledge in this field. Due to rising HTML5 support across all web browser platforms and end of the old IE's.`
						},
						{
								technoExport: true,
								id: "blockCSS",
								title: "CSS/HTML",
								yearsExperience: 8,
								realKnowledge: 8,
								isRoot: false,
								cont: "blockWeb",
								text: `I am able to code any design I can think of. Lately I gained some knowledge of CSS3 features. I prefer to use SCSS, but I can learn any other CSS superset fast.`
						},
						{
								id: "blockAngBack",
								title: "Angular1, Backbone",
								yearsExperience: 2,
								realKnowledge: 1,
								isRoot: false,
								cont: "blockWeb",
								text: `I worked roughly a year on a Backbone project and a half a year on an Angular1 project. I have forgotten most of it, but I'm generally very familiar with SPA concept.`
						},
						{
								id: "blockUX",
								title: "UX",
								yearsExperience: 2,
								realKnowledge: 8,
								isRoot: false,
								cont: "blockWeb",
								text: `I was gaining some little UX skills on all the web projects I took part of. But thanks to the last project I qualified me to a higher league.
												I'm convinced I'm better than many professional graphic designers. 
												From the very beginning of UX planning, I can think of behaviour across multiple resolutions and its responsive design.
												I am a skilled user of Balsamique mocking tools. I have exceptional skill and patience to talk to graphic designers.`
						},
						{
								id: "blockGrapDesign",
								title: "Graphic design",
								yearsExperience: 2,
								realKnowledge: 6,
								isRoot: false,
								cont: "blockWeb",
								text: `With the last project, I wasn't that lucky on graphic designers so I had to overtake some design task. 
												I am not talented and I don't plan to develop in this field, but I can definitely make a design based on some defined templates/styles.`
						},

						{
								id: "blockAPI",
								title: "API's",
								isRoot: true,
								cont: "bprint1",
								text: ""
						},
						{
								technoExport: true,
								id: "blockMapbox",
								title: "Mapbox + Leaflet",
								yearsExperience: 1,
								realKnowledge: 7,
								isRoot: false,
								cont: "blockAPI",
								text: `I have solid knowledge of Mapbox.js and Leaflet.js. I can develop nice looking maps and visualise on them basically anything.`
						},
						{
								technoExport: true,
								id: "blockFacebookAPI",
								title: "Facebook API",
								yearsExperience: 5,
								realKnowledge: 8,
								isRoot: false,
								cont: "blockAPI",
								text: `I have solid knowledge of Facebook API. I can make completely customised login or play with the user data. I have also solid knowledge of Facebook terms and conditions.`
						},

						{
								id: "blockArchitecture",
								title: "Architecture",
								isRoot: true,
								cont: "bprint1",
								text: ""
						},
						{
								id: "blockDomModel",
								title: "Domain model",
								yearsExperience: 8,
								realKnowledge: 9,
								isRoot: false,
								cont: "blockArchitecture",
								text: `I worked on many projects using many implementations of DDD. I read the book (DDD from Fowler) and I'm familiar with the terminology and key patterns.`
						},
						{
								id: "blockCommQuery",
								title: "Command & Query",
								yearsExperience: 3,
								realKnowledge: 10,
								isRoot: false,
								cont: "blockArchitecture",
								text: `I would say you should use Command & Query for most of the projects. For most of the projects is DDD overkill.`
						},
						{
								id: "block",
								title: "Big Ball of Mud",
								yearsExperience: 16,
								realKnowledge: 10,
								isRoot: false,
								cont: "blockArchitecture",
								text: `A very favourite pattern on my - for prototyping. Let's not loose time by architecture where is it not necessary.`
						},
						{
								id: "blockMvc",
								title: "MVC & MVVM + REST",
								yearsExperience: 8,
								realKnowledge: 9,
								isRoot: false,
								cont: "blockArchitecture",
								text: `I have strong experience with both, MVC and MVVM patterns. These are my favourite in web development.`
						},
						{
								id: "blockSPA",
								title: "Single Page Applications",
								yearsExperience: 3,
								realKnowledge: 9,
								isRoot: false,
								cont: "blockArchitecture",
								text: `I am fully familiar with the design pattern and all the key aspects of SPA.`
						},
						{
								id: "blockHiLevel",
								title: "High level architecture",
								yearsExperience: 2,
								realKnowledge: 7,
								isRoot: false,
								cont: "blockArchitecture",
								text: "I never took part of any task for high-level architecture on a bigger project. But after 16 years a developed common sense in this field."
						},

						{
								id: "blockProject",
								title: "Project",
								isRoot: true,
								cont: "bprint1",
								text: ""
						},
						{
								id: "blockProjectMgmt",
								title: "Project management / Team leading",
								yearsExperience: 4,
								realKnowledge: 8,
								isRoot: false,
								cont: "blockProject",
								text: `I was working as the head of two start-ups. I spent one year as a head of Release Management department and automation strategy. I have future plans to develop in this field.`
						},
						{
								id: "blockGIT",
								title: "GIT",
								yearsExperience: 8,
								realKnowledge: 8,
								isRoot: false,
								cont: "blockProject",
								text: "I am fully familiar with GIT and its branching strategy. I don't have any admin experience, but my knowledge of GIT is good enough for development and planning. I use SourceTree to manage my feature branches."
						},
						{
								id: "blockReleaseMgmt",
								title: "Release management and automation",
								yearsExperience: 2,
								realKnowledge: 8,
								isRoot: false,
								cont: "blockProject",
								text:`I was working for a couple of years on release management and automation positions. I'm fully familiar with the full development cycle.`
						},
						{
								id: "blockScrum",
								title: "Scrum",
								yearsExperience: 10,
								realKnowledge: 9,
								isRoot: false,
								cont: "blockProject",
								text: `I have rich experience of developing software by Scrum methodology. 
												I have experienced a lot of implementations, excellent, good and bad. Except prototyping, I consider Scrum and all the agile approach generally as the only one to develop software.`
						},
						{
								id: "blockUnitTests",
								title: "Unit tests",
								yearsExperience: 12,
								realKnowledge: 9,
								isRoot: false,
								cont: "blockProject",
								text: `Unit tests are undividable part of enterprise software development. 100% of business logic should be covered. I'm not a fan of TDD, or better said unit tests first - except for business logic modules.`
						},
						{
								id: "blockGulp",
								title: "Gulp",
								yearsExperience: 1,
								realKnowledge: 7,
								isRoot: false,
								cont: "blockProject",
								text: "I like this technology. I managed to set up one project to one-click from build to deployment."
						},
						{
								id: "blockDatabase",
								title: "Databases",
								isRoot: true,
								cont: "bprint1",
								text: "I will possibly not be the best database expert in the team, but during the years I gained a lot of experience in both relational and document databases. I don't like to take part of DB flame wars (Relational DB vs. Document DB), but for most of the projects, my choice would be Document DB. It's clear that both have its usage and was developed to serve its purpose. I am not a big fan of DB server side logic."
						},
						{
								technoExport: true,
								id: "blockMsSql",
								title: "Relational databases (MS SQL)",
								titleShort: "MS SQL",
								yearsExperience: 12,
								realKnowledge: 8,
								isRoot: false,
								cont: "blockDatabase",
								text: "I have roughly 12 years of experience with MS SQL. But in last 3 years, I didn't take part of a project using MS SQL. I have a perfect RD design skills. However I worked on projects, where I was writing just Stored procedures for all year long, I didn't write one single T-SQL line last 5 years. I would be able to refresh my knowledge to expert level within a week or two."
						},

						{
								technoExport: true,
								id: "blockMongo",
								title: "Document DB (Mongo)",
								titleShort: "Mongo",
								yearsExperience: 4,
								realKnowledge: 8,
								isRoot: false,
								cont: "blockDatabase",
								text: "Since the last couple of years, I felt in love with Document DBs. I am convinced, that it's the fastest and cheapest way how to develop most of the applications. But of course, it doesn't fit for every software solution."
						}
				];

				private projects = [
						{
								startMonth: 9,
								startYear: 2015,
								endMonth: 4,
								endYear: 2017,

								projectGroup: "FJ1",

								logo: "gloobster.svg",
								company: "Gloobster.com",
								employed: false,

								position: "Founder",
								locations: ["Frankfurt"],
								description: `Goobster is a travel startup offering long term fly ticket search and a wide range of supportive social network features.`
						},
						{
								startMonth: 1,
								startYear: 2014,
								endMonth: 8,
								endYear: 2015,

								projectGroup: "AGT",

								logo: "agt.png",
								company: "AGT Int.",
								employed: true,

								position: "Senior Developer",
								locations: ["Darmstadt", "Tel Aviv"],
								description: `Mybitat is a joint venture of Samsung and AGT to Improve Ability of the Elderly to Live at Home Longer with Enhanced Quality of Life. 															
															Our team was working on supporting tools for sensor collected data evaluation. I was working mostly on client development tasks.`
						},
						{
								startMonth: 9,
								startYear: 2014,
								endMonth: 12,
								endYear: 2015,

								projectGroup: "AGT",

								logo: "agt.png",
								company: "AGT Int.",
								employed: true,

								position: "Senior Developer",
								locations: ["Darmstadt"],
								description: "Video anomaly detection tool and several other tools for visualization and support of big data field."
						},
						{
								startMonth: 10,
								startYear: 2013,
								endMonth: 9,
								endYear: 2014,

								projectGroup: "AGT",

								logo: "agt.png",
								company: "AGT Int.",
								employed: true,

								position: "Senior Developer",
								locations: ["Darmstadt", "Abu Dhabi"],
								description: `Urban Shield is a large public security and smart city enterprise solution for Abu Dhabi emirate. 
															Collects, process and evaluate thousands of sensors data all around the city. 
															Possibly the biggest project I ever took part of. 
															On the project, I performed multiple tasks including integration, development, analysis, architecture, refactoring and big data experiments. I was also often visiting customer's site to supervise deployment and test process.`
						},
						{
								startMonth: 1,
								startYear: 2013,
								endMonth: 8,
								endYear: 2013,

								projectGroup: "FJ2",

								logo: "simplias.png",
								company: "Simplias GMBH",
								employed: false,

								position: "Senior Developer",
								locations: ["Munich"],
								description: `Mobile field reporting management project. 
																I worked as a developer of the management web application. It is developed as Backbone SPA`,
								url: "http://www.mobilefieldreport.com"
						},
						{
								startMonth: 6,
								startYear: 2011,
								endMonth: 1,
								endYear: 2013,

								projectGroup: "FJ2",

								logo: "cid.svg",
								company: "CID GMBH",
								employed: false,

								position: "Senior Developer",
								locations: ["Gelnhausen"],
								description: `I worked as a developer of a web crawler application. The web crawler component is a part of a larger solution called Topic Analyst. I was responsible mainly for development and partially for deployment and maintenance. My other duties included investigation and analysis of crawling mechanisms and algorithms.`,
						},
						{
								startMonth: 3,
								startYear: 2010,
								endMonth: 6,
								endYear: 2011,

								projectGroup: "UNICORN",

								logo: "bgs.png",
								company: "Be a Golf Star",
								employed: false,

								position: "CTO",
								locations: ["Prague"],
								description: `Online golf manager game. An unsuccessful startup in the gaming industry.
															On this project, I've been working as a CTO.`,
						},
						{
								startMonth: 12,
								startYear: 2009,
								endMonth: 3,
								endYear: 2010,

								projectGroup: "UNICORN",

								logo: "kbc.png",
								company: "KBC",
								employed: false,

								position: "Senior Developer",
								locations: ["Prague"],
								description: `A rework of a call center administration application.`,
						},
						{
								startMonth: 4,
								startYear: 2009,
								endMonth: 3,
								endYear: 2010,

								projectGroup: "UNICORN",

								logo: "rm.png",
								company: "Rooms Outdoor",
								employed: false,

								position: "Senior Developer",
								locations: ["Prague"],
								description: `A web app for designing and configuration of garden houses.`,
								url: "http://roomsoutdoor.co.uk/configurator"
						},
						{
								startMonth: 3,
								startYear: 2008,
								endMonth: 3,
								endYear: 2009,

								projectGroup: "UNICORN",

								logo: "cit.png",
								company: "Sitronics",
								employed: false,

								position: "Senior Build Engineer",
								locations: ["Prague"],
								description: `I was working as a developer/project manager of an automated CI build/deploy/test system.`,

						},
						{
								startMonth: 11,
								startYear: 2007,
								endMonth: 2,
								endYear: 2008,

								projectGroup: "UNICORN",

								logo: "kbc.png",
								company: "KBC",
								employed: false,

								position: "Senior Developer",
								locations: ["Prague"],
								description: `Projects Storm and SySel are remakes of two internal applications, used for accounting management and company's economic plans projection.`,
						},
						{
								startMonth: 5,
								startYear: 2007,
								endMonth: 10,
								endYear: 2007,

								projectGroup: "UNICORN",

								logo: "kbc.png",
								company: "KBC",
								employed: false,

								position: "Senior Developer",
								locations: ["Prague"],
								description: `Project PaySec is a payment portal for internet micro payments connected to KBC banking system.`,
								url: "http://www.paysec.cz"
						},
						{
								startMonth: 2,
								startYear: 2007,
								endMonth: 4,
								endYear: 2007,

								projectGroup: "UNICORN",

								logo: "mcd.png",
								company: "MC DONALD'S",
								employed: true,

								position: "Developer",
								locations: ["Prague"],
								description: `McDonald's, project human resources management.`,
						},
						{
								startMonth: 7,
								startYear: 2006,
								endMonth: 1,
								endYear: 2007,

								projectGroup: "UNICORN",

								logo: "IRC.png",
								company: "Inland revenue and custom of Czech Republic",
								employed: true,

								position: "Developer",
								locations: ["Prague"],
								description: `A web-based SharePoint search extension.`,
						},
						{
								startMonth: 1,
								startYear: 2006,
								endMonth: 6,
								endYear: 2006,

								projectGroup: "UNICORN",

								logo: "erste.svg",
								company: "Erste bank",
								employed: true,

								position: "Developer",
								locations: ["Prague"],
								description: `A client service suite for managing common, savings and budget accounts.`,
						},
						{
								startMonth: 1,
								startYear: 2005,
								endMonth: 12,
								endYear: 2005,

								projectGroup: "AQUA",

								logo: "solitea.jpg",
								company: "Aquasoft",
								employed: true,

								position: "Developer",
								locations: ["Prague"],
								description: `Rework of administration tools from Delphi to .NET and extending by some new features.`,
						},
						{
								startMonth: 1,
								startYear: 2004,
								endMonth: 12,
								endYear: 2004,

								projectGroup: "FJ3",

								logo: "egem.jpg",
								company: "EGEM GMBH",
								employed: false,

								position: "Developer",
								locations: ["Brno"],
								description: `A client-server solution for storing and versioning the company’s documents.`,
						},
						{
								startMonth: 1,
								startYear: 2002,
								endMonth: 12,
								endYear: 2003,

								projectGroup: "FJ3",

								logo: "netbox.svg",
								company: "Netbox",
								employed: false,

								position: "Developer",
								locations: ["Brno"],
								description: "Development of tools for network system administration.",
						}


				];

				private groups = [
						{ g: "FJ1", d: "Own project", m: "Own project" },
						{ g: "AGT", d: "Employee", m: "AGT" },
						{ g: "FJ2", d: "Freelancer", m: "Freelance jobs" },
						{ g: "UNICORN", d: "Employee, Freelancer", m: "Unicorn" },
						{ g: "AQUA", d: "Employee", m: "Aquasoft" },
						{ g: "FJ3", d: "Freelancer", m: "Freelance jobs" }
				];


				private genProjects() {
						var vProjects = _.map(this.projects, (p) => {
								p.cities = p.locations.join(", ");
								return p;
						});

						var t = this.registerTemplate("projs-row-tmp");


						vProjects.forEach((p) => {
								var $i = $(t(p));
								$("#projectsCont").append($i);
						});

				}

				private genCompanies() {
						var projGroups = _.groupBy(this.projects, "projectGroup");

						var comps = [];

						for (let key in projGroups) {

								if (projGroups.hasOwnProperty(key)) {
										var projects = projGroups[key];

										var g = _.find(this.groups, { g: key });

										var locArrays = _.map(projects, (p) => { return p.locations; });
										var allCities = [].concat.apply([], locArrays);


										var comp = {
												yearStart: _.min(_.map(projects, (p) => { return p.startYear; })),
												yearEnd: _.max(_.map(projects, (p) => { return p.endYear; })),
												compGroupName: g.m,
												cities: _.uniq(allCities).join(", "),
												form: g.d,
												emps: _.uniq(_.map(projects, (p) => { return p.company; }))
										};

										comps.push(comp);

								};


						}

						var tmp = this.registerTemplate("comps-row-tmp");

						comps.forEach((c) => {
								var $row = $(tmp(c));
								$("#tblEmployers").append($row);
						});


				}

				constructor() {
						super();

				}

				private init() {
						this.genArticles();

						this.genSkillsPie();
						this.genTechnoBars();

						this.genCompanies();

						this.genProjects();
				}

				private genArticles() {
						var t = this.registerTemplate("category-block-tmp");
						this.technos.forEach((techno) => {

								var $t = t(techno);

								if (techno.isRoot) {
										$(`#${techno.cont}`).append($t);
								} else {
										$(`.subCont_${techno.cont}`).append($t);
								}

						});
				}

				private genTechnoBars() {

						var ctx = $("#technoBars");

						var data = {

								labels: [],
								datasets: [
										{
												label: "Technologies",
												backgroundColor: [
														"#FF6384",
														"#36A2EB",
														"#FFCE56",
														"#57C2DB",
														"#4B966E",
														"#FF6384",
														"#36A2EB",
														"#FFCE56",
														"#57C2DB",
														"#4B966E",
														"#FF6384",
														"#36A2EB",
														"#FFCE56",
														"#57C2DB",
														"#4B966E",
												],
												data: [],
										}
								]
						};

						var options = {
								legend: {
										display: false,
								},
								scales: {
										xAxes: [{
												ticks: {
														fontSize: 19
												}
										}]
								}
						};

						var ts = _.filter(this.technos, { technoExport: true });
						ts = _.sortBy(ts, "yearsExperience").reverse();

						ts.forEach((t) => {
								data.labels.push(t.titleShort ? t.titleShort : t.title);
								data.datasets[0].data.push((t.yearsExperience));
						});


						var myBarChart = new Chart(ctx, {
								type: 'bar',
								data: data,
								options: options
						});


				}

				private myDoughnutChart = null;

				private genSkillsPie() {

						Chart.defaults.global.defaultFontSize = 20;

						Chart.pluginService.register({
								beforeRender: function (chart) {
										if (chart.config.options.showAllTooltips) {
												// create an array of tooltips
												// we can't use the chart tooltip because there is only one tooltip per chart
												chart.pluginTooltips = [];
												chart.config.data.datasets.forEach(function (dataset, i) {
														chart.getDatasetMeta(i).data.forEach(function (sector, j) {
																chart.pluginTooltips.push(new Chart.Tooltip({
																		_chart: chart.chart,
																		_chartInstance: chart,
																		_data: chart.data,
																		_options: chart.options,
																		_active: [sector]
																},
																		chart));
														});
												});

												// turn off normal tooltips
												chart.options.tooltips.enabled = false;
										}
								},
								afterDraw: function (chart, easing) {
										if (chart.config.options.showAllTooltips) {
												// we don't want the permanent tooltips to animate, so don't do anything till the animation runs atleast once
												if (!chart.allTooltipsOnce) {
														if (easing !== 1)
																return;
														chart.allTooltipsOnce = true;
												}

												// turn on tooltips
												chart.options.tooltips.enabled = true;
												Chart.helpers.each(chart.pluginTooltips,
														function (tooltip) {
																tooltip.initialize();
																tooltip.update();
																// we don't actually need this since we are not animating tooltips
																tooltip.pivot();
																tooltip.transition(easing).draw();
														});
												chart.options.tooltips.enabled = false;
										}
								}
						});

						var ctx = $("#pieChart");

						var data = {
								labels: [
										"Backend development",
										"Frontent development",
										"Project management",
										"Architecture",
										"UX"
								],
								datasets: [
										{
												data: [16, 8, 4, 8, 2],
												backgroundColor: [
														"#FF6384",
														"#36A2EB",
														"#FFCE56",
														"#57C2DB",
														"#4B966E",
												],
												//hoverBackgroundColor: [
												//		"#FF6384",
												//		"#36A2EB",
												//		"#FFCE56"
												//]
										}]
						};

						var options = {
				
								legend: {
										display: false,										
								},
								//animation: {
								//		duration: 0
								//},
								showAllTooltips: true,								
								tooltips: {
										callbacks: {
												label: (tooltipItem, data) => {														
														var label = data.labels[tooltipItem.index];
														return label;
												}
										},										
								}
						};

						var cfg = {
								type: 'doughnut',
								data: data,
								options: options
						};

						// And for a doughnut chart
						this.myDoughnutChart = new Chart(ctx, cfg);

				}

		}
}