using Gloobster.Entities;
using Gloobster.Portal.Controllers.Api.Wiki;

namespace Gloobster.Portal.ViewModels
{
    public class ViewModelQuiz : ViewModelBase
    {
        public QuizEntity Quiz { get; set; }

        public string GetLetterFromNumber(int no)
        {
            var chars = "ABCDEFG";

            char chr = chars[no + 1];
            return chr.ToString();
        }
    }
}