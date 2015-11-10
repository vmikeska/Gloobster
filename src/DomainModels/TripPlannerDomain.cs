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
		

		public async void UpdateProperty(string propertyName, Dictionary<string, string> values)
		{
			var tripId = values["tripId"];			
			var tripIdObj = new ObjectId(tripId);

			if (propertyName == "place")
			{
				var place = new PlaceSE
				{
					SourceType = (SourceType) int.Parse(values["sourceType"]),
					SourceId = values["sourceId"],
					SelectedName = values["selectedName"]
				};

				var placeId = values["placeId"];
				
				await UpdatePlaceProperty(tripIdObj, placeId, "Place", place);
			}

			if (propertyName == "address")
			{
				var address = new PlaceSE
				{
					SourceType = (SourceType)int.Parse(values["sourceType"]),
					SourceId = values["sourceId"],
					SelectedName = values["selectedName"]
				};

				var placeId = values["placeId"];
				var addressText = values["address"];				

				await UpdatePlaceProperty(tripIdObj, placeId, "Address", address);
				await UpdatePlaceProperty(tripIdObj, placeId, "AddressText", addressText);				
            }

			if (propertyName == "description")
			{
				var placeId = values["placeId"];
				var description = values["description"];
				await UpdatePlaceProperty(tripIdObj, placeId, "Description", description);
			}
		}
		
		private async Task<bool> UpdatePlaceProperty(ObjectId tripIdObj, string placeId, string propName, object value)
		{
			var filter = DB.F<TripEntity>().Eq(p => p.id, tripIdObj) & DB.F<TripEntity>().Eq("Places._id", placeId);
			var update = DB.U<TripEntity>().Set("Places.$." + propName, value);

			var res = await DB.UpdateAsync(filter, update);
			return res.ModifiedCount == 1;			
		}

		public AddPlaceResultDO AddPlace(NewPlaceDO newPlace)
		{
			TripPlaceSE lastPlace = GetLastPlace();
			
			bool addAtTheEnd = (lastPlace.Id == newPlace.SelectorId) && newPlace.Position == NewPlacePosition.ToRight;
			if (addAtTheEnd)
			{
				var travel = new TripTravelSE
				{
					Id = NewId(),
					Type = TravelType.Walk
				};
				PushTravel(travel);
				
				UpdatePlaceArriving(lastPlace, travel.Id);

				var place = new TripPlaceSE
				{
					Id = NewId(),
					ArrivingId = travel.Id,
					LeavingId = null,
					OrderNo =  lastPlace.OrderNo + 1,					
				};
				PushPlace(place);

				var result = new AddPlaceResultDO
				{
					Position = newPlace.Position,
					Place = new PlaceLiteDO
					{
						Id = place.Id,
						OrderNo = place.OrderNo,
						LeavingId = null,
						ArrivingId = travel.Id
					},
					Travel = new TravelLiteDO
					{
						Id = travel.Id,
						Type = travel.Type
					}
				};
				return result;
			}

			return null;
		}
		
		public TripPlannerStructureLiteDO GetStructureLite(bool refresh)
		{
			if (refresh)
			{
				LoadTrip();
			}

			var structure = new TripPlannerStructureLiteDO
			{
				Places = Trip.Places.Select(p => new PlaceLiteDO
				{
					Id = p.Id,
					LeavingId = p.LeavingId,
					ArrivingId = p.ArrivingId,
					OrderNo = p.OrderNo
				}).ToList(),
				Travels = Trip.Travels.Select(p => new TravelLiteDO
				{
					Id = p.Id,
				}).ToList()

			};

			return structure;
		}

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

		private async void UpdatePlaceArriving(TripPlaceSE place, string newLeavingId)
		{
			//todo: try to fix without delete
			var filterDel = DB.F<TripEntity>().Eq(t => t.id, Trip.id);
			var updateDel = DB.U<TripEntity>().Pull(t => t.Places, place);
			UpdateResult resultDel = await DB.UpdateAsync(filterDel, updateDel);

			place.LeavingId = newLeavingId;

			var filter = DB.F<TripEntity>().Eq(t => t.id, Trip.id);
			var update = DB.U<TripEntity>().Push(t => t.Places, place);
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