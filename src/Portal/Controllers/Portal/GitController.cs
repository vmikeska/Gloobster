using System.Collections.Generic;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.Portal.Controllers.Base;
using Microsoft.AspNet.Mvc;
using Gloobster.DomainInterfaces;
using Serilog;
using System.Linq;
using Autofac;
using Octokit;

namespace Gloobster.Portal.Controllers.Portal
{
    public class FitlerModel
    {
        public IssuesModel Model { get; set; }
        public string ActFilter { get; set; }
    }

    public class IssuesModel
    {
        public List<Issue> Issues { get; set; }
        
        public List<Issue> GetIssues(string groupLabel, string stateLabel)
        {
            var issues = Issues
                .Where(i => HasLabel(i.Labels, groupLabel) && HasLabel(i.Labels, stateLabel))
                .ToList();

            return issues;
        }

        private bool HasLabel(IReadOnlyList<Label> labels, string labelName)
        {
            return labels.Any(l => l.Name == labelName);
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

            var basicAuth = new Credentials("mikeska@gmail.com", "GitBit007");
            client.Credentials = basicAuth;
            
            IReadOnlyList<Issue> issues = await client.Issue.GetAllForRepository("vmikeska", "Gloobster");

            var issuesList = issues.ToList();

            var model = new IssuesModel
            {
                Issues = issuesList
            };

            return View(model);
        }
    }
}
