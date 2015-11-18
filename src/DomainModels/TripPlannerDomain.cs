using System;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Entities.Trip;
using Gloobster.Enums;
using MongoDB.Bson;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Globalization;
using Gloobster.Common;
using Gloobster.Mappers;

namespace Gloobster.DomainModels
{
	public class TripPlannerDomain: ITripPlannerDomain
	{
		public IDbOperations DB { get; set; }

		public string TripId { get; set; }
		public string UserId { get; set; }

		public TripEntity Trip { get; set; }


		public void Initialize(string tripId, string userId)
		{
			//todo: check on permissions

			TripId = tripId;
			UserId = userId;

			LoadTrip();						
		}
		

		public async Task<object> UpdateProperty(string propertyName, Dictionary<string, string> values)
		{
			object result = null;

			var tripId = values["tripId"];
			var tripIdObj = new ObjectId(tripId);
			var entityId = values["entityId"];
			

			if (propertyName == "place")
			{
				var place = new PlaceSE
				{
					SourceType = (SourceType) int.Parse(values["sourceType"]),
					SourceId = values["sourceId"],
					SelectedName = values["selectedName"]
				};

				if (values.ContainsKey("lat") && values.ContainsKey("lng"))
				{
					place.Coordinates = new LatLng
					{
						Lat = float.Parse(values["lat"], CultureInfo.InvariantCulture),
						Lng = float.Parse(values["lng"], CultureInfo.InvariantCulture)
					};
				}
				
				await UpdatePlaceProperty(tripIdObj, entityId, "Place", place);
			}

			if (propertyName == "flightFrom")
			{
				var airportId = values["id"];
				var airportName = values["name"];

				var flight = new FlightSE
				{
					Airport_id = new ObjectId(airportId),
					SelectedName = airportName
				};

				await UpdateTravelProperty(tripIdObj, entityId, "FlightFrom", flight);
			}

			if (propertyName == "flightTo")
			{
				var airportId = values["id"];
				var airportName = values["name"];

				var flight = new FlightSE
				{
					Airport_id = new ObjectId(airportId),
					SelectedName = airportName
				};

				await UpdateTravelProperty(tripIdObj, entityId, "FlightTo", flight);
			}

			if (propertyName == "leavingDateTime")
			{
				var travel = Trip.Travels.FirstOrDefault(t => t.Id == entityId);
				UpdateDate(travel.LeavingDateTime, "LeavingDateTime", tripIdObj, entityId, values);				
			}

			if (propertyName == "arrivingDateTime")
			{
				var travel = Trip.Travels.FirstOrDefault(t => t.Id == entityId);
				UpdateDate(travel.ArrivingDateTime, "ArrivingDateTime", tripIdObj, entityId, values);
			}
			
			if (propertyName == "travelType")
			{
				var travelType = (TravelType) int.Parse(values["travelType"]);
				await UpdateTravelProperty(tripIdObj, entityId, "Type", travelType);
			}

			if (propertyName == "address")
			{
				var address = new PlaceSE
				{
					SourceType = (SourceType)int.Parse(values["sourceType"]),
					SourceId = values["sourceId"],
					SelectedName = values["selectedName"]
				};

				if (values.ContainsKey("lat") && values.ContainsKey("lng"))
				{
					address.Coordinates = new LatLng
					{
						Lat = float.Parse(values["lat"], CultureInfo.InvariantCulture),
						Lng = float.Parse(values["lng"], CultureInfo.InvariantCulture)
					};
				}
				
				var addressText = values["address"];				

				await UpdatePlaceProperty(tripIdObj, entityId, "Address", address);
				await UpdatePlaceProperty(tripIdObj, entityId, "AddressText", addressText);				
            }

			if (propertyName == "description")
			{
				//var entityId = values["entityId"];
				var description = values["description"];
				var entityType = (TripEntityType)int.Parse(values["entityType"]);

				if (entityType == TripEntityType.Travel)
				{
					await UpdateTravelProperty(tripIdObj, entityId, "Description", description);
				}
				if (entityType == TripEntityType.Place)
				{
					await UpdatePlaceProperty(tripIdObj, entityId, "Description", description);
				}				
			}

			if (propertyName == "placeToVisit")
			{
				var place = new PlaceIdSE
				{
					id = NewId(),
					SourceType = (SourceType)int.Parse(values["sourceType"]),
					SourceId = values["sourceId"],
					SelectedName = values["selectedName"]
				};
				
				await PushPlaceProperty(tripIdObj, entityId, "WantVisit", place);
				result = place.id;
			}

			if (propertyName == "placeToVisitRemove")
			{				
				var id = values["id"];				
				result = await DeletePlaceToVisit(tripIdObj, entityId, id);				
			}

			return result;			
		}

		private async void UpdateDate(DateTime? oldDate, string propName, ObjectId tripIdObj, string entityId, Dictionary<string, string> values)
		{
			int day = 0, month = 0, year = 0, hour = 0, minute = 0;

			if (oldDate.HasValue)
			{
				day = oldDate.Value.Day;
				month = oldDate.Value.Month;
				year = oldDate.Value.Year;
				hour = oldDate.Value.Hour;
				minute = oldDate.Value.Minute;
			}
			
			if (values.ContainsKey("day") && values.ContainsKey("month") && values.ContainsKey("year"))
			{
				day = int.Parse(values["day"]);
				month = int.Parse(values["month"]);
				year = int.Parse(values["year"]);				
			}

			if (values.ContainsKey("hour") && values.ContainsKey("minute"))
			{
				hour = int.Parse(values["hour"]);
				minute = int.Parse(values["minute"]);				
			}

			//it's actually not UTC time, but rough. If it's not UTC set, DB recalculates it.
			var newDate = new DateTime(year, month, day, hour, minute, 0, DateTimeKind.Utc);

			await UpdateTravelProperty(tripIdObj, entityId, propName, newDate);
		}
		
		private async Task<bool> PushPlaceProperty(ObjectId tripIdObj, string placeId, string propName, object value)
		{
			var filter = DB.F<TripEntity>().Eq(p => p.id, tripIdObj) & DB.F<TripEntity>().Eq("Places._id", placeId);
			var update = DB.U<TripEntity>().Push("Places.$." + propName, value);

			var res = await DB.UpdateAsync(filter, update);
			return res.ModifiedCount == 1;
		}

		private async Task<bool> UpdatePlaceProperty(ObjectId tripIdObj, string placeId, string propName, object value)
		{
			var filter = DB.F<TripEntity>().Eq(p => p.id, tripIdObj) & DB.F<TripEntity>().Eq("Places._id", placeId);
			var update = DB.U<TripEntity>().Set("Places.$." + propName, value);

			var res = await DB.UpdateAsync(filter, update);
			return res.ModifiedCount == 1;			
		}

		private async Task<bool> UpdateTravelProperty(ObjectId travelIdObj, string travelId, string propName, object value)
		{
			var filter = DB.F<TripEntity>().Eq(p => p.id, travelIdObj) & DB.F<TripEntity>().Eq("Travels._id", travelId);
			var update = DB.U<TripEntity>().Set("Travels.$." + propName, value);

			var res = await DB.UpdateAsync(filter, update);
			return res.ModifiedCount == 1;
		}

		private async Task<bool> DeletePlaceToVisit(ObjectId tripIdObj, string placeId, string id)
		{
			 var placeToVisit = DB.C<TripEntity>().First(t => t.id == tripIdObj)
				.Places.First(p => p.Id == placeId)
				.WantVisit.First(w => w.id == id);

			var filter = DB.F<TripEntity>().Eq(p => p.id, tripIdObj) & DB.F<TripEntity>().Eq("Places._id", placeId);
			var update = DB.U<TripEntity>().Pull("Places.$.WantVisit", placeToVisit);

			var res = await DB.UpdateAsync(filter, update);
			return res.ModifiedCount == 1;
		}

		public async Task<AddPlaceResultDO> AddPlace(NewPlaceDO newPlace)
		{
			TripPlaceSE lastPlace = GetLastPlace();
			var travelToLastPlace = Trip.Travels.First(t => t.Id == lastPlace.ArrivingId);
			
			bool addAtTheEnd = (lastPlace.Id == newPlace.SelectorId) && newPlace.Position == NewPlacePosition.ToRight;
			if (addAtTheEnd)
			{
				var travel = new TripTravelSE
				{
					Id = NewId(),
					Type = TravelType.Walk,
					LeavingDateTime = travelToLastPlace.ArrivingDateTime.Value.AddDays(1),
					ArrivingDateTime = travelToLastPlace.ArrivingDateTime.Value.AddDays(2)
				};
				PushTravel(travel);
				
				var tripIdObj = new ObjectId(TripId);
				await UpdatePlaceProperty(tripIdObj, lastPlace.Id, "LeavingId", travel.Id);
				
				var place = new TripPlaceSE
				{
					Id = NewId(),
					ArrivingId = travel.Id,
					LeavingId = null,
					OrderNo =  lastPlace.OrderNo + 1,
					WantVisit = new List<PlaceIdSE>()					
				};
				PushPlace(place);

				var result = new AddPlaceResultDO
				{
					Position = newPlace.Position,
					Place = place.ToDO(),
					Travel = travel.ToDO()
				};

				//var resultO = new AddPlaceResultDO
				//{
				//	Position = newPlace.Position,
				//	Place = new PlaceLiteDO
				//	{
				//		Id = place.Id,
				//		OrderNo = place.OrderNo,
				//		LeavingId = null,
				//		ArrivingId = travel.Id
				//	},
				//	Travel = new TravelLiteDO
				//	{
				//		Id = travel.Id,
				//		Type = travel.Type
				//	}
				//};
				return result;
			}

			return null;
		}
		
		//public TripPlannerStructureLiteDO GetStructureLite(bool refresh)
		//{
		//	if (refresh)
		//	{
		//		LoadTrip();
		//	}

		//	var structure = new TripPlannerStructureLiteDO
		//	{
		//		Places = Trip.Places.Select(p => new PlaceLiteDO
		//		{
		//			Id = p.Id,
		//			LeavingId = p.LeavingId,
		//			ArrivingId = p.ArrivingId,
		//			OrderNo = p.OrderNo
		//		}).ToList(),
		//		Travels = Trip.Travels.Select(p => new TravelLiteDO
		//		{
		//			Id = p.Id,
		//		}).ToList()

		//	};

		//	return structure;
		//}

		private void LoadTrip()
		{
			var tripIdObj = new ObjectId(TripId);
			Trip = DB.C<TripEntity>().FirstOrDefault(t => t.id == tripIdObj);
		}

		private async void PushTravel(TripTravelSE travel)
		{
			var filter = DB.F<TripEntity>().Eq(p => p.id, Trip.id);
			var update = DB.U<TripEntity>().Push(p => p.Travels, travel);
			var result = await DB.UpdateAsync(filter, update);			
		}

		private async void PushPlace(TripPlaceSE place)
		{
			var filter = DB.F<TripEntity>().Eq(p => p.id, Trip.id);
			var update = DB.U<TripEntity>().Push(p => p.Places, place);
			UpdateResult result = await DB.UpdateAsync(filter, update);			
		}
		
		private TripPlaceSE GetLastPlace()
		{
			if (Trip.Places == null || !Trip.Places.Any())
			{
				return null;
			}

			if (Trip.Places.Count == 1)
			{
				return Trip.Places.First();
			}

			TripPlaceSE result = Trip.Places.First();
			foreach (var place in Trip.Places)
			{
				if (place.OrderNo > result.OrderNo)
				{
					result = place;
				}
			}

			return result;
		}

		private TripPlaceSE GetPlaceById(string id)
		{
			if (Trip.Places == null || !Trip.Places.Any())
			{
				return null;
			}

			var place = Trip.Places.FirstOrDefault(p => p.Id == id);

			//todo: throw if not found ?

			return place;
		}

		private string NewId()
		{
			return Guid.NewGuid().ToString().Replace("-", string.Empty);
		}
	}

	
}