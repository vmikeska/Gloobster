using System.Collections.Generic;
using Gloobster.DomainModelsCommon.BaseClasses;

namespace Gloobster.DomainModelsCommon.Interfaces
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