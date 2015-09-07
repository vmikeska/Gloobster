

using Gloobster.Common;
using Microsoft.AspNet.Mvc;

namespace Gloobster.Portal.Controllers
{
    public class PortalBaseController: Controller
    {
        public PortalBaseController(IDbOperations db)
        {
            DB = db;
        }


        public IDbOperations DB;
    }
}