namespace Gloobster.Portal.ViewModels
{
    public class NewAdminViewModel : ViewModelBase
    {
        public bool IsMasterAdmin { get; set; }
        public bool IsSuperAdmin { get; set; }
        public bool IsAdminOfSomething { get; set; }
    }
}