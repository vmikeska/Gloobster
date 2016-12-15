using System;
using System.Threading.Tasks;
using Gloobster.DomainModels.SearchEngine8;

namespace Gloobster.DomainModels.SearchEngine
{    
    public static class ExecutionStarter
    {
        public static IQueriesExecutor Executor { get; set; }

        //private const int secInterval = 2;
        
        //public static void Start()
        //{
        //    var dueTime = TimeSpan.FromSeconds(secInterval).TotalMilliseconds;
        //    var timer = new System.Timers.Timer(dueTime);
        //    timer.Elapsed += (sender, e) =>
        //    {
        //        Executor.ExecuteQueriesAsync();

                
        //    };
        //    timer.Start();
        //}

        private const int cleaningMinInterval = 60;

        public static async Task StartCleaning()
        {
            await Executor.DeleteOldQueriesAsync();

            var dueTime = TimeSpan.FromSeconds(cleaningMinInterval).TotalMilliseconds;
            var timer = new System.Timers.Timer(dueTime);            
            timer.Elapsed += (sender, e) =>
            {
                Executor.DeleteOldQueriesAsync();
                
            };
            timer.Start();
        }


    }
}