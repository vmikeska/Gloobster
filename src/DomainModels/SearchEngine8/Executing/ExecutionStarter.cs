using System;
using Gloobster.DomainModels.SearchEngine8;

namespace Gloobster.DomainModels.SearchEngine
{
    //public delegate void TimeHasComeEventHandler();

    public static class ExecutionStarter
    {
        public static IQueriesExecutor Executor { get; set; }

        private const int secInterval = 2;

        //public static event TimeHasComeEventHandler Execute;

        public static void Start()
        {
            var dueTime = TimeSpan.FromSeconds(secInterval).TotalMilliseconds;
            var timer = new System.Timers.Timer(dueTime);
            timer.Elapsed += (sender, e) =>
            {
                Executor.ExecuteQueriesAsync();

                //Execute?.Invoke();
            };
            timer.Start();
        }

        
    }
}