var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Views;
(function (Views) {
    var CVView = (function (_super) {
        __extends(CVView, _super);
        function CVView() {
            _super.call(this);
            this.technos = [
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
                    text: "I've been working with C# on every project in my professional career. During the years, using this language, I developed knowledge of a lot design patterns and architecutre skills"
                },
                {
                    technoExport: true,
                    id: "blockES5",
                    title: "JavaScript 5",
                    yearsExperience: 8,
                    realKnowledge: 7,
                    isRoot: false,
                    cont: "blockLangs",
                    text: "Roughly half of project I took part of required usage of JavaScript. I know the language quite well, however I consider ES5 as outdated and prefer to use some modern supersets. I don't have any experience yet with ES6 or higher."
                },
                {
                    technoExport: true,
                    id: "blockTS",
                    title: "TypeScript",
                    yearsExperience: 2,
                    realKnowledge: 8,
                    isRoot: false,
                    cont: "blockLangs",
                    text: "I was using TypeScript on the last project last 2 years and I felt in love with its syntax."
                },
                {
                    id: "blockBackend",
                    title: "Backend",
                    isRoot: true,
                    cont: "bprint1",
                    text: "I am an IT professional with over 14 years of experience. I have 10 years of experience in .NET technologies. I have very strong knowledge of full development cycle. I have also experience with Project management, Architecture and Research in Big Data field."
                },
                {
                    technoExport: true,
                    id: "blockAspNet",
                    title: "ASP.NET MVC",
                    yearsExperience: 8,
                    realKnowledge: 7,
                    isRoot: false,
                    cont: "blockBackend",
                    text: "I have worked on several ASP.NET MVC projects. Currently have a bit fresher knowledge of the vNext, but I can refresh my knowledge of previous version within days."
                },
                {
                    technoExport: true,
                    id: "blockAspNetVN",
                    title: "ASP.NET MVC vNext",
                    yearsExperience: 2,
                    realKnowledge: 8,
                    isRoot: false,
                    cont: "blockBackend",
                    text: "This is the technology of my last project. It's excellent work done by Microsoft. I have to especially appriciate its integration of Bower packages, middleware-like flow and project structure generally. I consider this technology as perfect for web development."
                },
                {
                    technoExport: true,
                    id: "blockAzure",
                    title: "Azure",
                    yearsExperience: 3,
                    realKnowledge: 6,
                    isRoot: false,
                    cont: "blockBackend",
                    text: "I am familiar with deployment on Windows Azure platform. I am able make full configuration and deployment to the service."
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
                    text: "I worked with jQuery on several projects and still consider it as one of the best JS frameworks."
                },
                {
                    id: "blockBrowserInterface",
                    title: "HTML/HTML5 browser interface",
                    yearsExperience: 6,
                    realKnowledge: 6,
                    isRoot: false,
                    cont: "blockWeb",
                    text: "My knowledge of browser functions/interface was in last years hidden behind jQuery. I have planned to increase my knowledge in this field in next years."
                },
                {
                    technoExport: true,
                    id: "blockCSS",
                    title: "CSS/HTML",
                    yearsExperience: 8,
                    realKnowledge: 8,
                    isRoot: false,
                    cont: "blockWeb",
                    text: "I can make any desgin I can think of, I can write code without too many sub-steps. Lately I gained some knowledge of CSS3 features. I prefer to use SCSS, but I can learn any other CSS superset fast."
                },
                {
                    id: "blockAngBack",
                    title: "Angular1, Backbone",
                    yearsExperience: 2,
                    realKnowledge: 1,
                    isRoot: false,
                    cont: "blockWeb",
                    text: "I worked roughly half a year on a Backbone project and half year on an Angular1 project. I have forgotten most of it, but I'm generally very familiar with SPA concept."
                },
                {
                    id: "blockUX",
                    title: "UX",
                    yearsExperience: 6,
                    realKnowledge: 8,
                    isRoot: false,
                    cont: "blockWeb",
                    text: "Especially with the last project I've grown a lot on my UX skills. I'm convinced I'm better than many professional graphic designers. I can think from scratch how the functionality can be displayed in multiple resolutions and crate real responsive design. I am skilled with using mocking tools (Balsamique). And have exceptional skill to task graphic designers."
                },
                {
                    id: "blockGrapDesign",
                    title: "Graphic design",
                    yearsExperience: 2,
                    realKnowledge: 6,
                    isRoot: false,
                    cont: "blockWeb",
                    text: "With the last project, I wasn't that lucky on graphic designers so I had to overtake some design task. I am not talented and I don't plan to develop in this field, but I can definitelly make first design, which is later replaced by a one made by graphic designer."
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
                    text: "I worked on many projects using many implementations of DDD. I read the book (DDD from Fowler) and I'm familiar with the terminology a key patterns"
                },
                {
                    id: "blockCommQuery",
                    title: "Command & Query",
                    yearsExperience: 3,
                    realKnowledge: 10,
                    isRoot: false,
                    cont: "blockArchitecture",
                    text: "DDD has it's specifics and on many projects (roughly 20%) has no competitiv metodology. But for most of the projects is better use Command & Query pattern. It's simple pattern where blocks of funcionality are encapsulated by an overriding execution metod. These Commands or Queries can be organized by multiple styles, on directory level, namespace level and so on..."
                },
                {
                    id: "block",
                    title: "Big Ball of Mud",
                    yearsExperience: 16,
                    realKnowledge: 10,
                    isRoot: false,
                    cont: "blockArchitecture",
                    text: "This might maybe surprise you, but this is definitelly the best technique how to develop prototypes. While prototyping, developer shouldn't loose time with overthinking the architecture. Developer should rather keep focus on finding/testing/proving the key technical aspects. They can be shaped later into a proper application."
                },
                {
                    id: "blockMvc",
                    title: "MVC & MVVM + REST",
                    yearsExperience: 8,
                    realKnowledge: 9,
                    isRoot: false,
                    cont: "blockArchitecture",
                    text: "I have strong experience with both, MVC and MVVM patterns. These are my favorite in web developement."
                },
                {
                    id: "blockSPA",
                    title: "Single Page Applications",
                    yearsExperience: 3,
                    realKnowledge: 9,
                    isRoot: false,
                    cont: "blockArchitecture",
                    text: "I am fully familiar with the design pattern and all the key aspects of SPA."
                },
                {
                    id: "blockHiLevel",
                    title: "High level architecture",
                    yearsExperience: 2,
                    realKnowledge: 7,
                    isRoot: false,
                    cont: "blockArchitecture",
                    text: "I don't have any exceptional knowledge of designing high level architecture."
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
                    text: "I was working as the head of two start-ups. I spent one year as a head of department for release management and automation strategy. Being 16 years in software development overall, I have naturally gained project leading skills. I have future team leading plans."
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
                    text: "I was working for couple of years on release management and automation positions. I'm fully familiar with full development cycle."
                },
                {
                    id: "blockScrum",
                    title: "Scrum",
                    yearsExperience: 10,
                    realKnowledge: 9,
                    isRoot: false,
                    cont: "blockProject",
                    text: "I have rich experience of developing software by Scrum metodology. I have experienced a lot of implmentations, excellent, good and bad. Except prototyping, I consider Scrum and all the agile approach to develop software as the only one possible."
                },
                {
                    id: "blockUnitTests",
                    title: "Unit tests",
                    yearsExperience: 12,
                    realKnowledge: 9,
                    isRoot: false,
                    cont: "blockProject",
                    text: "Unit tests are undivadable part of enterprise software development. 100% of business logic should be covered. I'm not a fan of TDD, or better said unit tests first - except for business logic modules."
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
                    yearsExperience: 12,
                    realKnowledge: 8,
                    isRoot: false,
                    cont: "blockDatabase",
                    text: "I am good in designing relational DB. However my RD knowledge is high, I didn't write one single SQL query in last 3 years. However I used to work on projects, where I was writing just Stored procedures for all year long, I didn't write one single T-SQL line last 5 years. I would be able to refresh my knowledge within a week or two."
                },
                {
                    technoExport: true,
                    id: "blockMongo",
                    title: "Document DB (Mongo)",
                    yearsExperience: 4,
                    realKnowledge: 8,
                    isRoot: false,
                    cont: "blockDatabase",
                    text: "Since last couple of years I felt in love with Document DB. I strongly belive that it's the fastest and cheapest way how to develop most of the applications, however it doesn't fit to all of them."
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
                    text: "I have solid knowledge of Mapbox.js and Leaflet.js. I can develop nice looking maps and visualize date on them by many approaches."
                },
                {
                    technoExport: true,
                    id: "blockFacebookAPI",
                    title: "Facebook API",
                    yearsExperience: 5,
                    realKnowledge: 8,
                    isRoot: false,
                    cont: "blockAPI",
                    text: "I have solid knowledge of Facebook API. I can make completely customized login or play with the user data. I have also solid knowledge of Facebook API terms and conditons."
                },
            ];
            this.groups = [
                { g: "FJ1", d: "Own project" },
                { g: "AGT", d: "Employee" },
                { g: "FJ2", d: "Freelancer" },
                { g: "UNICORN", d: "Employee, Freelancer" },
                { g: "AQUA", d: "Employee" },
                { g: "FJ3", d: "Freelancer" },
            ];
            this.projects = [
                {
                    startMonth: 9,
                    startYear: 2015,
                    endMonth: 4,
                    endYear: 2017,
                    projectGroup: "FJ1",
                    company: "Gloobster.com",
                    employed: false,
                    position: "CTO/CEO",
                    locations: ["Frankfurt"],
                    description: "Social travel portal"
                },
                {
                    startMonth: 1,
                    startYear: 2014,
                    endMonth: 8,
                    endYear: 2015,
                    projectGroup: "AGT",
                    company: "AGT Int.",
                    employed: true,
                    position: "Senior Developer",
                    locations: ["Darmstadt", "Tel Aviv"],
                    description: "Mybitat, joint venture of Samsung and AGT to Improve Ability of the Elderly to Live at Home Longer with Enhanced Quality of Life. Our team was working on supporting tools for sensor collected data evaluation. I was working mostly on client development tasks."
                },
                {
                    startMonth: 9,
                    startYear: 2014,
                    endMonth: 12,
                    endYear: 2015,
                    projectGroup: "AGT",
                    company: "AGT Int.",
                    employed: true,
                    position: "Senior Developer",
                    locations: ["Darmstadt"],
                    description: "Video anomaly detection tool and several other tools for visualization and support big data field."
                },
                {
                    startMonth: 10,
                    startYear: 2013,
                    endMonth: 9,
                    endYear: 2014,
                    projectGroup: "AGT",
                    company: "AGT Int.",
                    employed: true,
                    position: "Senior Developer",
                    locations: ["Darmstadt", "Abu Dhabi"],
                    description: "Urban Shield is a large public security and smart city enterprise solution for Abu Dhabi emirate. Collects, process and evaluate thousands of sensors data all around the city. Possibly biggest project I ever took part of with current cost over 7 billion €. On the project I performed multiple tasks including integration, development, analysis, architecture, refactoring and big data experiments. I was also often visiting customer site to supervise deployment and test process. "
                },
                {
                    startMonth: 1,
                    startYear: 2013,
                    endMonth: 8,
                    endYear: 2013,
                    projectGroup: "FJ2",
                    company: "Simplias GMBH",
                    employed: false,
                    position: "Senior Developer",
                    locations: ["Munich"],
                    description: "Mobile field reporting management project, 9 months fixed contract. I worked as a developer of a management portal web application using single page application pattern based on the Backbone framework. During the project, I gained deep knowledge about Single page application patterns and dozens of other JavaScript technologies and frameworks.",
                    url: "http://www.mobilefieldreport.com"
                },
                {
                    startMonth: 6,
                    startYear: 2011,
                    endMonth: 1,
                    endYear: 2013,
                    projectGroup: "FJ2",
                    company: "CID GMBH",
                    employed: false,
                    position: "Senior Developer",
                    locations: ["Gelnhausen"],
                    description: "I worked as a developer of a web crawler application. The web crawler component is a part of a larger solution called Topic Analyst. I was responsible mainly for development and partially for deployment and maintenance. My other duties included investigation and analysis of crawling mechanisms and algorithms. During this project I gained strong experience with Unit Testing, web request/response&HTTP, MSMQ/NserviceBus",
                },
                {
                    startMonth: 3,
                    startYear: 2010,
                    endMonth: 6,
                    endYear: 2011,
                    projectGroup: "UNICORN",
                    company: "Be a Golf Star",
                    employed: false,
                    position: "CTO",
                    locations: ["Prague"],
                    description: "Online golf manager game. The application is divided into several parts and uses various technologies and frameworks: Websites in MVC2, Background service, Silverlight game graphic view, tools for drawing golf courses in WPF and Silverlight CMS client. On this project I have been responsible for architecture, management of three technical based employees and partially for the analysis. I did most of the work on the database logic and the application core.",
                },
                {
                    startMonth: 12,
                    startYear: 2009,
                    endMonth: 3,
                    endYear: 2010,
                    projectGroup: "UNICORN",
                    company: "KBC",
                    employed: false,
                    position: "Senior Developer",
                    locations: ["Prague"],
                    description: "A call center administration application. It was an existing application, my role was to implement some new features. Project is based on KBC Nirvana framework, MVC architectural pattern, and it was developed using SCRUM methodology. Apart from my .NET framework skills, I was able to put to use my exceptional knowledge of TFS server and Build process for application deployment.",
                },
                {
                    startMonth: 4,
                    startYear: 2009,
                    endMonth: 3,
                    endYear: 2010,
                    projectGroup: "UNICORN",
                    company: "Rooms Outdoor",
                    employed: false,
                    position: "Senior Developer",
                    locations: ["Prague"],
                    description: "A Silverlight application called Configurator that allows their customers to design custom garden studios. I did most of the analytical work and all technical based work. The solution includes a simple Silverlight administration and was connected into company’s 3rd party ERP.",
                    url: "http://roomsoutdoor.co.uk/configurator"
                },
                {
                    startMonth: 3,
                    startYear: 2008,
                    endMonth: 3,
                    endYear: 2009,
                    projectGroup: "UNICORN",
                    company: "Sitronics",
                    employed: false,
                    position: "Senior Build Engineer",
                    locations: ["Prague"],
                    description: "On this project I learnt a great deal about .NET Build process. I also got some experience as team leader. My first role in this company was to implement a number of new features to the company’s Release management system and to debug the existing Build system. In the second phase I was responsible for the Build system future vision and architecture.This build system is large solution based on TFS server modified by custom plug-ins for automated deployment. ",
                },
                {
                    startMonth: 11,
                    startYear: 2007,
                    endMonth: 2,
                    endYear: 2008,
                    projectGroup: "UNICORN",
                    company: "KBC",
                    employed: false,
                    position: "Senior Developer",
                    locations: ["Prague"],
                    description: "Projects Storm and SySel are two internal applications which were made to replace a former internal application. It is used for accounting management and management of economic adherent structure. The two applications are part of a large banking system and were developed on an existing Oracle database. My role was to implement the Views and Business logic into the common internal framework.",
                },
                {
                    startMonth: 5,
                    startYear: 2007,
                    endMonth: 10,
                    endYear: 2007,
                    projectGroup: "UNICORN",
                    company: "KBC",
                    employed: false,
                    position: "Senior Developer",
                    locations: ["Prague"],
                    description: "Project PaySec is a payment portal for internet micro payments connected to KBC banking system.",
                    url: "http://www.paysec.cz"
                },
                {
                    startMonth: 2,
                    startYear: 2007,
                    endMonth: 4,
                    endYear: 2007,
                    projectGroup: "UNICORN",
                    company: "MC DONALD'S",
                    employed: true,
                    position: "Developer",
                    locations: ["Prague"],
                    description: "McDonalds, project McDonald Human Resources. A human resources management system. It was made as a desktop application.",
                },
                {
                    startMonth: 7,
                    startYear: 2006,
                    endMonth: 1,
                    endYear: 2007,
                    projectGroup: "UNICORN",
                    company: "Inland revenue and custom of Czech Republic",
                    employed: true,
                    position: "Developer",
                    locations: ["Prague"],
                    description: "A web application based on the SharePoint technology with intranet and internet applications.",
                },
                {
                    startMonth: 1,
                    startYear: 2006,
                    endMonth: 6,
                    endYear: 2006,
                    projectGroup: "UNICORN",
                    company: "Erste bank",
                    employed: true,
                    position: "Developer",
                    locations: ["Prague"],
                    description: "A client service suite which contains systems for managing common, savings and budged accounts.",
                },
                {
                    startMonth: 1,
                    startYear: 2005,
                    endMonth: 12,
                    endYear: 2005,
                    projectGroup: "AQUA",
                    company: "Aquasoft",
                    employed: true,
                    position: "Developer",
                    locations: ["Prague"],
                    description: "Rework of administration tools from Delphi to .NET and extending by some new features.",
                },
                {
                    startMonth: 1,
                    startYear: 2004,
                    endMonth: 12,
                    endYear: 2004,
                    projectGroup: "FJ3",
                    company: "EGEM GMBH",
                    employed: false,
                    position: "Developer",
                    locations: ["Brno"],
                    description: "A client-server solution for storing and versioning the company’s documents. The communication was based on TCP/IP protocol. The client application also had off-line mode with local storing and synchronization. I was responsible for the technical solution and partially for the analysis ",
                },
                {
                    startMonth: 1,
                    startYear: 2002,
                    endMonth: 12,
                    endYear: 2003,
                    projectGroup: "FJ3",
                    company: "Netbox",
                    employed: false,
                    position: "Developer",
                    locations: ["Brno"],
                    description: "Tools for network system administration",
                }
            ];
        }
        CVView.prototype.init = function () {
            this.genArticles();
            this.genSkillsPie();
            this.genTechnoBars();
        };
        CVView.prototype.genArticles = function () {
            var t = this.registerTemplate("category-block-tmp");
            this.technos.forEach(function (techno) {
                var $t = t(techno);
                if (techno.isRoot) {
                    $("#" + techno.cont).append($t);
                }
                else {
                    $(".subCont_" + techno.cont).append($t);
                }
            });
        };
        CVView.prototype.genTechnoBars = function () {
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
                            "#9FD2E3"
                        ],
                        data: [],
                    }
                ]
            };
            var ts = _.filter(this.technos, { technoExport: true });
            ts = _.sortBy(ts, "yearsExperience").reverse();
            ts.forEach(function (t) {
                data.labels.push(t.title);
                data.datasets[0].data.push((t.yearsExperience));
            });
            var myBarChart = new Chart(ctx, {
                type: 'bar',
                data: data,
            });
        };
        CVView.prototype.genSkillsPie = function () {
            var ctx = $("#pieChart");
            var data = {
                labels: [
                    "Backend",
                    "Frontent",
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
                            "#9FD2E3"
                        ],
                    }]
            };
            var myDoughnutChart = new Chart(ctx, {
                type: 'doughnut',
                data: data,
            });
        };
        return CVView;
    }(Views.ViewBase));
    Views.CVView = CVView;
})(Views || (Views = {}));
//# sourceMappingURL=CVView.js.map