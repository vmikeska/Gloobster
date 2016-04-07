namespace Gloobster.Portal.ViewModels
{
    public class ViewModelTwitterAuthCallback : ViewModelBase
    {
        public string AccessToken { get; set; }
        public string TokenSecret { get; set; }
        public string UserId { get; set; }
    }
}