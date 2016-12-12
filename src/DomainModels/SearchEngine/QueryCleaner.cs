using System;

namespace Gloobster.DomainModels.SearchEngine
{
    public delegate void TimeHasComeEventHandler();

    public class QueryCleaner
    {
        private const int secInterval = 20;

        public event TimeHasComeEventHandler Execute;

        public void Start()
        {
            var dueTime = TimeSpan.FromSeconds(secInterval).TotalMilliseconds;
            var timer = new System.Timers.Timer(dueTime);
            timer.Elapsed += (sender, e) =>
            {
                Execute?.Invoke();
            };
            timer.Start();
        }
    }
}