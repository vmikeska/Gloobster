using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FourSquare.SharpSquare.Core;
using FourSquare.SharpSquare.Entities;
using Gloobster.DomainModelsCommon.Interfaces;

namespace Gloobster.DomainModels.Services.Foursquare
{
	public class FoursquareService: IFoursquareService
	{
		public SharpSquare Client { get; set; }

		public string ClientId { get; set; }
		public string ClientSecret { get; set; }

		public void Initialize(string clientId, string clientSecret)
		{
			ClientId = clientId;
			ClientSecret = clientSecret;

			Client = new SharpSquare(ClientId, ClientSecret);
		}
    }
}
