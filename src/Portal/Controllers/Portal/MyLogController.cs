using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.Portal.Controllers.Base;
using Microsoft.AspNet.Mvc;
using Gloobster.DomainInterfaces;
using Serilog;
using System.Linq;
using Autofac;
using Gloobster.Entities;
using Microsoft.AspNet.Http.Extensions;
using MongoDB.Bson;
using MongoDB.Driver;
using UAParser;
using MongoDB.Bson.Serialization.Attributes;

namespace Gloobster.Portal.Controllers.Portal
{
    public class DelModel
    {
        public int TotalEmptyAccounts { get; set; }
        public int OlderThan3Days { get; set; }        

        public string Test { get; set; }
    }

    public class StatsModel
    {
        public List<StatItem> items { get; set; }
    }

    public class StatItem
    {
        public string name { get; set; }
        public long size { get; set; }
        public long storageSize { get; set; }
    }   
    
    public class MyLogController : PortalBaseController
    {
        public MyLogController(ILogger log, IDbOperations db, IComponentContext cc, ILanguages langs) : base(log, db, cc, langs)
        {

        }

        public async Task<IActionResult> Stats()
        {
            var stats = new StatsModel
            {
                items = new List<StatItem>()
            };

            List<BsonDocument> colls = DB.Database.ListCollectionsAsync().Result.ToListAsync<BsonDocument>().Result;
            foreach (var coll in colls)
            {
                var name = coll["name"].AsString;
                
                var result = await DB.Database.RunCommandAsync<BsonDocument>("{collstats: '" + name +"'}");
                var list = result.ToList();
                long size = long.Parse(list.FirstOrDefault(l => l.Name == "size").Value.ToString());
                long storageSize = long.Parse(list.FirstOrDefault(l => l.Name == "storageSize").Value.ToString());

                stats.items.Add(new StatItem {size = size, storageSize = storageSize, name = name});
            }

            stats.items = stats.items.OrderByDescending(o => o.storageSize).ToList();
            return View(stats);
        }

        public IActionResult UsersToDelete()
        {
            var accounts = GetAccountsToDelete();
            var days3ago = DateTime.UtcNow.AddDays(-3);
            var accounts3 = accounts.Where(a => a.Time < days3ago);

            var url = Request.GetDisplayUrl();

            return View(new DelModel {Test = url, TotalEmptyAccounts = accounts.Count, OlderThan3Days = accounts3.Count()});
        }

        public async Task<IActionResult> DeleteEmptyAccounts()
        {
            var accounts = GetAccountsToDelete();
            var days3ago = DateTime.UtcNow.AddDays(-3);
            var accounts3 = accounts.Where(a => a.Time < days3ago);

            foreach (var ac in accounts3)
            {
                await DB.DeleteAsync<AccountEntity>(ac.id);
            }
            
            return RedirectToAction("UsersToDelete", "MyLog");
        }
        
        private List<AccountEntity> GetAccountsToDelete()
        {
            var users = DB.List<UserEntity>();
            var userIds = users.Select(u => u.User_id);

            var accounts = DB.List<AccountEntity>();

            var accountsToDelete = new List<AccountEntity>();

            foreach (var account in accounts)
            {
                bool hasUser = userIds.Contains(account.User_id);
                if (!hasUser)
                {
                    accountsToDelete.Add(account);
                }
            }

            return accountsToDelete;
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
