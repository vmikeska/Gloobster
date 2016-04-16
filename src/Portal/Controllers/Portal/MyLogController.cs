using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.Portal.Controllers.Base;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;
using Gloobster.DomainInterfaces;
using Gloobster.DomainModels.Services.GeonamesService;
using Gloobster.DomainModels.Wiki;
using Gloobster.Portal.ViewModels;
using Serilog;
using System.Linq;
using System.Web;
using Autofac;
using Gloobster.Entities;
using Microsoft.AspNet.Http;
using UAParser;

namespace Gloobster.Portal.Controllers.Portal
{
    public class MyLogController : PortalBaseController
    {
        public MyLogController(ILogger log, IDbOperations db, IComponentContext cc, ILanguages langs) : base(log, db, cc, langs)
        {

        }

        public IActionResult Index()
        {
            var logs = DB.List<AccessLogEntity>();

            var ids = logs.Select(u => u.User_id).Distinct();

            var users = DB.List<UserEntity>(u => ids.Contains(u.User_id));

            var logsOut = new List<AccessLog>();

            var uaParser = Parser.GetDefault();

            foreach (var l in logs)
            {
                var user = users.FirstOrDefault(u => u.User_id == l.User_id);

                ClientInfo client = uaParser.Parse(l.UserAgent);
                
                var lo = new AccessLog
                {
                    IP = l.IP,
                    UserId = l.User_id.ToString(),
                    DisplayName = user?.DisplayName,
                    Id = l.id.ToString(),
                    Url = l.Url,
                    Time = l.Time,
                    UserAgent = $"{client.UserAgent.Family}, {client.OS.Family}, {client.Device.Family}",
                    IsBot = l.IsBot,
                    HasCallback = l.HasCallback,
                    HasToken = l.HasToken,
                    TokenIssued = l.TokenIssued
                };

                logsOut.Add(lo);
            }


            var logsOutO = logsOut.OrderByDescending(l => l.Time).ToList();

            return View(logsOutO);
        }

    }

    public class AccessLog
    {
        public string Id { get; set; }
        public string UserId { get; set; }
        public string DisplayName { get; set; }
        public string UserAgent { get; set; }
        public DateTime Time { get; set; }
        public bool IsBot { get; set; }
        public string Url { get; set; }
        public bool HasToken { get; set; }
        public bool HasCallback { get; set; }
        public bool TokenIssued { get; set; }

        public string IP { get; set; }
    }


}
