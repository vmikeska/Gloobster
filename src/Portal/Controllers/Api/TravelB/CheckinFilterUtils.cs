using Gloobster.Enums;

namespace Gloobster.Portal.Controllers.Api.Wiki
{
    public class CheckinFilterUtils
    {
        
        public static bool HasGenderMatch(WantMeet wantMeet, Gender gender)
        {
            if (gender == Gender.N)
            {
                return true;
            }

            if (wantMeet == WantMeet.All)
            {
                return true;
            }

            if (wantMeet == WantMeet.Man && gender == Gender.M)
            {
                return true;
            }

            if (wantMeet == WantMeet.Woman && gender == Gender.F)
            {
                return true;
            }

            return false;
        }

        
    }
}