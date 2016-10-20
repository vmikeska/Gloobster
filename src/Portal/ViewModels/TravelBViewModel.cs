using System.Collections.Generic;
using Gloobster.Enums;

namespace Gloobster.Portal.ViewModels
{
    public class TravelBViewModel : ViewModelBase
    {        
        public string GenderStr { get; set; }
        public List<string> EmptyProps { get; set; }

        //todo: is used also on User Settings, maybe to base view ?
        public string GetGenderStr(Gender gender, ViewModelBase vm)
        {
            if (gender == Gender.M)
            {
                return "Male";
                //vm.W("Male", "layout");
            }

            if (gender == Gender.F)
            {
                return "Female";
                //vm.W("Female", "layout");
            }

            return "N/A";
        }
    }
    
    public class TravelBManagementViewModel : ViewModelBase
    {

    }
    
}