using System;
using System.Threading.Tasks;
using Autofac;
using Gloobster.DomainInterfaces;
using Gloobster.Enums;
using Gloobster.SocialLogin.Facebook.Communication;
using Serilog;

namespace Gloobster.DomainModels.Services.Facebook.TaggedPlacesExtractor
{
    public class PinboardImportDomain : IPinboardImportDomain
    {
        public ILogger Log { get; set; }

        public IPlacesExtractor PlacesExtractor { get; set; }
        public IAccountDomain SocAccount { get; set; }
        public IComponentContext ComponentContext { get; set; }
        public IFacebookService FBService { get; set; }
        
        public async Task<bool> ImportFb(string userId)
        {
            try
            {
                var facebook = SocAccount.GetAuth(SocialNetworkType.Facebook, userId);

                bool isFbUser = (facebook != null);
                if (isFbUser)
                {
                    FBService.SetAccessToken(facebook.AccessToken);
                    bool hasPermissions = FBService.HasPermissions("user_tagged_places");
                    if (hasPermissions)
                    {
                        PlacesExtractor.Driver = ComponentContext.ResolveKeyed<IPlacesExtractorDriver>("Facebook");

                        await PlacesExtractor.ExtractNewAsync(userId, facebook);
                        bool any = await PlacesExtractor.SaveAsync();
                        return any;
                    }
                    return false;
                }
                return false;
            }
            catch (Exception exc)
            {                
                Log.Error("ImportNewFbPins: " + exc.Message);
                return false;
            }            
        }
    }

    
}