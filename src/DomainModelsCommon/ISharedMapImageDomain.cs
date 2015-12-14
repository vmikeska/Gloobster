using System.IO;

namespace Gloobster.DomainInterfaces
{
	public interface ISharedMapImageDomain
	{
		Stream GetMap(string tripId);
		Stream GetPinBoardMap(string tripId);
		string GenerateMapLink(string tripId);
		string GeneratePinBoardMapLink(string userId);
	}
}