using FourSquare.SharpSquare.Core;

namespace Gloobster.DomainInterfaces
{
	public interface IFoursquareService
	{
		SharpSquare Client { get; set; }
		void Initialize(string clientId, string clientSecret);
	}
}