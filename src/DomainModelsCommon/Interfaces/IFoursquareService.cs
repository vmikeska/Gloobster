using FourSquare.SharpSquare.Core;

namespace Gloobster.DomainModelsCommon.Interfaces
{
	public interface IFoursquareService
	{
		SharpSquare Client { get; set; }
		void Initialize(string clientId, string clientSecret);
	}
}