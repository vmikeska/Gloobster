using System;
using System.Collections.Generic;
using Gloobster.Common;
using Gloobster.Enums;

namespace Gloobster.DomainObjects
{
    public class RemovedPlaceDO
    {
        public string PlaceId { get; set; }
        public string TravelId { get; set; }
    }

	public class AddPlaceResultDO
	{
		public NewPlacePosition Position { get; set; }

		public TripPlaceDO Place { get; set; }

		public TripTravelDO Travel { get; set; }
	}

	public class TripPlaceDO
	{
		public string Id { get; set; }
		public string Description { get; set; }
		public int OrderNo { get; set; }
		public string ArrivingId { get; set; }
		public string LeavingId { get; set; }
		public PlaceDO Place { get; set; }
		public PlaceDO Address { get; set; }
		public string AddressText { get; set; }
		public List<PlaceIdDO> WantVisit { get; set; }
	}

	public class TripTravelDO
	{
		public string Id { get; set; }
		public TravelType Type { get; set; }
		public string Description { get; set; }
		public FlightDO FlightFrom { get; set; }
		public FlightDO FlightTo { get; set; }
		public DateTime? LeavingDateTime { get; set; }
		public DateTime? ArrivingDateTime { get; set; }
	}

    public class FlightDO
    {
        public string AirportId { get; set; }
        public string SelectedName { get; set; }
    }

    public class PlaceDO
	{
		public string SourceId { get; set; }
		public SourceType SourceType { get; set; }
		public string SelectedName { get; set; }
		public LatLng Coordinates { get; set; }
	}

	public class PlaceIdDO
	{
		public string Id { get; set; }
		public string SourceId { get; set; }
		public SourceType SourceType { get; set; }
		public string SelectedName { get; set; }
	}
}