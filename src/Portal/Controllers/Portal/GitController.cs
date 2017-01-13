using System.Collections.Generic;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.Portal.Controllers.Base;
using Microsoft.AspNet.Mvc;
using Gloobster.DomainInterfaces;
using Serilog;
using System.Linq;
using Autofac;
using Gloobster.Portal.ViewModels;
using Octokit;

namespace Gloobster.Portal.Controllers.Portal
{
    public class FitlerModel
    {
        public IssuesViewModel Model { get; set; }
        public string ActFilter { get; set; }        
    }

    public class IssuesViewModel: ViewModelBase
    {
        public List<Issue> Issues { get; set; }

        public List<string> Categories { get; set; }
        public List<string> Importances { get; set; }


        public List<Issue> GetIssues(string groupLabel, string stateLabel)
        {
            var issues = Issues
                .Where(i => HasLabel(i.Labels, groupLabel) && HasLabel(i.Labels, stateLabel))
                .ToList();

            return issues;
        }

        public double GetEstimationByTag(List<Issue> issues, string label)
        {
            double hoursTotal = 0;

            foreach (var issue in issues)
            {
                bool hasLabel = issue.Labels.Any(l => l.Name.ToLower() == label.ToLower());

                if (hasLabel)
                {
                    int hours = GetHoursEstimation(issue);
                    hoursTotal += hours;
                }
            }

            return hoursTotal;
        }

        public int GetHoursEstimation(Issue issue)
        {
            int totalHours = 0;

            foreach (var label in issue.Labels)
            {
                var name = label.Name;
                if (name.Contains("-"))
                {
                    var prms = name.Split('-');
                    var prefix = prms[0];

                    if (prefix == "zh" || prefix == "zd" || prefix == "zw")
                    {
                        int num = int.Parse(prms[1]);

                        int hours = 0;

                        if (prefix == "zh")
                        {
                            hours = num;
                        }

                        if (prefix == "zd")
                        {
                            hours = num * 8;
                        }

                        if (prefix == "zw")
                        {
                            hours = num * 40;
                        }

                        totalHours += hours;
                    }                    
                }                
            }

            return totalHours;
        }

        private bool HasLabel(IReadOnlyList<Label> labels, string labelName)
        {
            return labels.Any(l => l.Name.ToLower() == labelName.ToLower());
        }
    }
    
    public class GitController : PortalBaseController
    {
        public GitController(ILogger log, IDbOperations db, IComponentContext cc, ILanguages langs) : base(log, db, cc, langs)
        {

        }
        
        public async Task<IActionResult> Issues()
        {


            var client = new GitHubClient(new ProductHeaderValue("Gloobster"));

            
            var tokenAuth = new Credentials("41452f93bab24937cede414f4911074289ba1280");
            client.Credentials = tokenAuth;
            
            //dont delete
            //IReadOnlyList<Label> lablels = await client.Issue.Labels.GetAllForRepository("vmikeska", "Gloobster");

            IReadOnlyList <Issue> issues = await client.Issue.GetAllForRepository("vmikeska", "Gloobster");

            var issuesList = issues.ToList();

            var vm = CreateViewModelInstance<IssuesViewModel>();


            vm.Issues = issuesList;
            vm.Categories = new List<string>
            {
                "Stage",
                "c-Dashboard",
                "c-Deals",
                "c-TravelB",
                "c-Pins",
                "c-Trips",
                "c-WIKI",
                "c-Other",
                "c-Marketing"
            };
            vm.Importances = new List<string>
            {
                "i-Bug",
                "i-Important",
                "i-Backlog",
                "i-Plans",
                "i-Visions"
            };
            
            return View(vm);
        }
        
    }
}
