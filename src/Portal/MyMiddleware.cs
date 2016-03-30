using System;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.Entities;
using Microsoft.AspNet.Builder;
using Microsoft.AspNet.Http;
using System.Linq;

namespace Gloobster.Portal
{
    public static class BuilderExtensions
    {
        public static IApplicationBuilder UseMyMiddleware(this IApplicationBuilder app)
        {
            return app.UseMiddleware<MyMiddleware>();
        }
    }


    public class MyMiddleware
    {
        readonly RequestDelegate _next;

        public MyMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        //public async Task Invoke(HttpContext context)
        //{
        //    var path = context.Request.Path;

        //    string sessionKeyName = "TestSession";
        //    string callbackKeyName = "callback";
            
        //    var sessionId = context.Session.GetString(sessionKeyName);

        //    bool hasSession = !string.IsNullOrEmpty(sessionId);
        //    if (hasSession)
        //    {
        //        var db = new DbOperations();
        //        var existingAccount = db.C<AccountTestEntity>().FirstOrDefault(e => e.SessionId == sessionId);
        //        bool accountExists = existingAccount != null;
        //        if (!accountExists)
        //        {
        //            var accountCreator = new AccountCreator();
        //            await accountCreator.CreateOrReturnAccount(sessionId);
        //        }
                
        //        await _next(context);
        //        return;
        //    }
        //    else
        //    {
        //        var callback = context.Request.Query[callbackKeyName];
        //        bool hasCallback = !string.IsNullOrEmpty(callback);
        //        if (hasCallback)
        //        {
        //            //in this case the requestor is not able to keep session
        //            await _next(context);
        //            return;
        //        }
        //    }

        //    //user is not logged, let's generate the session
        //    var newSession = Guid.NewGuid().ToString();
        //    context.Session.SetString(sessionKeyName, newSession);
            
        //    var pathToRedirect = $"{path}?{callbackKeyName}=true";

        //    context.Response.Redirect(pathToRedirect);
        //}

        //public async Task Invoke(HttpContext context)
        //{

        //    var sw = new Stopwatch();
        //    sw.Start();

        //    using (var memoryStream = new MemoryStream())
        //    {
        //        var bodyStream = context.Response.Body;
        //        context.Response.Body = memoryStream;

        //        await _next(context);

        //        var isHtml = context.Response.ContentType?.ToLower().Contains("text/html");
        //        if (context.Response.StatusCode == 200 && isHtml.GetValueOrDefault())
        //        {
        //            {
        //                memoryStream.Seek(0, SeekOrigin.Begin);
        //                using (var streamReader = new StreamReader(memoryStream))
        //                {
        //                    var responseBody = await streamReader.ReadToEndAsync();
        //                    var newFooter = @"<footer><div id=""process"">Page processed in {0} milliseconds.</div>";
        //                    responseBody = responseBody.Replace("<footer>", string.Format(newFooter, sw.ElapsedMilliseconds));
        //                    context.Response.Headers.Add("X-ElapsedTime", new[] { sw.ElapsedMilliseconds.ToString() });
        //                    using (var amendedBody = new MemoryStream())
        //                    using (var streamWriter = new StreamWriter(amendedBody))
        //                    {
        //                        streamWriter.Write(responseBody);
        //                        amendedBody.Seek(0, SeekOrigin.Begin);
        //                        await amendedBody.CopyToAsync(bodyStream);
        //                    }
        //                }
        //            }
        //        }
        //    }
        //}
    }
}