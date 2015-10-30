using System.Collections.Generic;
using Gloobster.DomainObjects.BaseClasses;

namespace Gloobster.DomainInterfaces
{
	public interface IFacebookTaggedPlacesExtractor
	{
		void SetUserData(string accessToken, string userId);
		void ExtractAll();

		List<FoundPlace> ExtractedPlaces { get; set; }
		List<FoundPlace> UniquePlaces { get; set; }
		List<string> UniqueCountries { get; set; }
	}
}