using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.Entities;
using Gloobster.Portal.Controllers.Base;
using Gloobster.Portal.ViewModels;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;
using System.IO;
using Gloobster.DomainInterfaces;
using Gloobster.DomainModels.Services.Accounts;
using Gloobster.Entities.Trip;
using Gloobster.Enums;
using Serilog;

namespace Gloobster.Portal.Controllers.Portal
{
	public class TripController : PortalBaseController
	{
		public IFilesDomain FileDomain { get; set; }
		public ITripPlannerDomain TripPlanner { get; set; }

		public ISharedMapImageDomain SharedImgDomain { get; set; }

		public TripController(ISharedMapImageDomain sharedImgDomain, ITripPlannerDomain tripPlanner, IFilesDomain filesDomain,
            ILogger log, IDbOperations db) : base(log, db)
		{
			FileDomain = filesDomain;
			TripPlanner = tripPlanner;
			SharedImgDomain = sharedImgDomain;
		}

		public IActionResult SharedMapImage(string id)
		{
			var mapStream = SharedImgDomain.GetMap(id);			
			return new FileStreamResult(mapStream, "image/png");		
		}

		public IActionResult Share(string id)
		{
		    var tripIdObj = new ObjectId(id);            
		    var trip = DB.C<TripEntity>().FirstOrDefault(t => t.id == tripIdObj);

		    var ordredPlaces = trip.Places.OrderBy(t => t.OrderNo);
		    var firstPlace = ordredPlaces.First();
            var lastPlace = ordredPlaces.Last();
		    var firstTravel = trip.Travels.FirstOrDefault(t => t.id == firstPlace.LeavingId);
            var lastTravel = trip.Travels.FirstOrDefault(t => t.id == lastPlace.ArrivingId);
		    var fromDate = firstTravel.LeavingDateTime.Value;
		    var toDate = lastTravel.ArrivingDateTime.Value;
		    var dateStr = $"{fromDate.Day}.{fromDate.Month}. to {toDate.Day}.{toDate.Month}. {toDate.Year}";

            var owner = DB.C<PortalUserEntity>().FirstOrDefault(u => u.id == trip.PortalUser_id);

            var viewModel = CreateViewModelInstance<ViewModelShareTrip>();
		    viewModel.Id = id;
            viewModel.Participants = GetParticipantsView(trip.Participants, trip.PortalUser_id);
		    viewModel.OwnerId = trip.PortalUser_id.ToString();
		    viewModel.OwnerDisplayName = owner.DisplayName;
		    viewModel.DateRangeStr = dateStr;
            return View(viewModel);
		}

		public async Task<IActionResult> List()
		{
            var trips = DB.C<TripEntity>().Where(t => t.PortalUser_id == UserIdObj).ToList();

            var query = $"{{ 'Participants.PortalUser_id': ObjectId('{UserId}')}}";
		    var invitedTrips = await DB.FindAsync<TripEntity>(query);

            var viewModel = CreateViewModelInstance<ViewModelTrips>();            
			viewModel.Trips = trips.Select(TripToViewModel).ToList();
            viewModel.InvitedTrips = invitedTrips.Select(TripToViewModel).ToList();
            
            return View(viewModel);
		}
		public async Task<IActionResult> CreateNewTrip(string id)
		{
		    var tripEntity = CreateUserData.GetInitialTripEntity(id, UserId);
            
            await DB.SaveAsync(tripEntity);

			return RedirectToAction("Detail", "Trip", new {id = tripEntity.id.ToString() } );
		}
        
		public IActionResult Detail(string id)
		{			
			var tripIdObj = new ObjectId(id);

			var trip = DB.C<TripEntity>().FirstOrDefault(t => t.id == tripIdObj);
            var owner = DB.C<PortalUserEntity>().First(u => u.id == trip.PortalUser_id);

            //permissions part            
            bool isOwner = owner.id == UserIdObj;
            if (isOwner)
            {
                var vm = CreateDetailVM(trip);
                return View(vm);
            }

            var thisUserParticipant = trip.Participants.FirstOrDefault(p => p.PortalUser_id == UserIdObj);
            bool thisUserIsAdmin = (thisUserParticipant != null) && thisUserParticipant.IsAdmin;
            if (thisUserIsAdmin)
            {
                var vm = CreateDetailVM(trip);
                return View(vm);
            }


            //user has no admin righs
            return RedirectToAction("NoAdminRights", "Trip");            
		}

	    private ViewModelTripDetail CreateDetailVM(TripEntity trip)
	    {
            var viewModel = CreateViewModelInstance<ViewModelTripDetail>();
            viewModel.Name = trip.Name;
            viewModel.TripId = trip.id.ToString();
            viewModel.Description = trip.Description;
            viewModel.Notes = trip.Notes;
            viewModel.NotesPublic = trip.NotesPublic;

	        return viewModel;
	    }

        public IActionResult Overview(OverviewRequest req)
		{		    
			var tripIdObj = new ObjectId(req.id);
			
			var trip = DB.C<TripEntity>().FirstOrDefault(t => t.id == tripIdObj);

			var owner = DB.C<PortalUserEntity>().First(u => u.id == trip.PortalUser_id);
            
            //permissions part
            if (trip.FriendsPublic)
            {
                var vm = CretateOverviewVM(trip, owner);
                return View(vm);
            }

            bool isOwner = owner.id == UserIdObj;
            if (isOwner)
            {
                var vm = CretateOverviewVM(trip, owner);
                return View(vm);
            }

            var thisUserParticipant = trip.Participants.FirstOrDefault(p => p.PortalUser_id == UserIdObj);
            bool thisUserInvited = thisUserParticipant != null;
            if (thisUserInvited)
            {
                var vm = CretateOverviewVM(trip, owner);
                return View(vm);
            }

		    bool sharingByCodeAllowed = !string.IsNullOrEmpty(trip.SharingCode);
		    if (sharingByCodeAllowed)
		    {
		        bool codeMatch = trip.SharingCode == req.sc;
		        if (codeMatch)
		        {
                    var vm = CretateOverviewVM(trip, owner);
                    return View(vm);
                }
		    }

            if (trip.AllowToRequestJoin)
            {
                return RedirectToAction("RequestJoin", "Trip", req.id);
            }
            
            //trip is completly private
            return RedirectToAction("PrivateTrip", "Trip");
		}

        public IActionResult NoAdminRights()
        {
            var viewModel = CreateViewModelInstance<ViewModelNoAdminRights>();
            return View(viewModel);
        }

        public IActionResult PrivateTrip()
	    {
            var viewModel = CreateViewModelInstance<ViewModelTripPrivate>();
            return View(viewModel);            
        }

        public IActionResult RequestJoin(string id)
        {
            var viewModel = CreateViewModelInstance<ViewModelTripRequestJoin>();
            return View(viewModel);
        }


        private ViewModelTripDetail CretateOverviewVM(TripEntity trip, PortalUserEntity owner)
	    {
            var viewModel = CreateViewModelInstance<ViewModelTripDetail>();
            viewModel.Name = trip.Name;
            viewModel.IsUserAdmin = IsUserAdmin(trip);
            viewModel.OwnerDisplayName = owner.DisplayName;
            viewModel.OwnerId = owner.id.ToString();
            viewModel.TripId = trip.id.ToString();
            viewModel.Description = trip.Description;
            viewModel.Notes = trip.Notes;
            viewModel.NotesPublic = trip.NotesPublic;
            viewModel.IsOwner = (trip.PortalUser_id == UserIdObj);
            viewModel.Photo = trip.Picture;
            viewModel.Participants = GetParticipantsView(trip.Participants, owner.id);
            var thisUserParticipant = trip.Participants.FirstOrDefault(p => p.PortalUser_id == UserIdObj);
            viewModel.ThisUserInvited = thisUserParticipant != null;

            return viewModel;
	    }

        

        private List<TripParticipantViewModel> GetParticipantsView(List<ParticipantSE> participants, ObjectId ownerId)
	    {
            var participantIds = participants.Where(p=> p.State == ParticipantState.Accepted).Select(p => p.PortalUser_id).ToList();
            participantIds.Add(ownerId);
            var participantUsers = DB.C<PortalUserEntity>().Where(u => participantIds.Contains(u.id)).ToList();

            var prtcs = participantUsers.Select(p => new TripParticipantViewModel
            {
                DisplayName = p.DisplayName,
                PhotoUrl = "/PortalUser/ProfilePicture/" + p.id
            }).ToList();

	        return prtcs;
	    }

        public IActionResult TripPicture(string id = null)
        {
            var fileLocation = "tpf";
            var tripIdObj = new ObjectId(id);
            var trip = DB.C<TripEntity>().FirstOrDefault(u => u.id == tripIdObj);

            if (trip.Picture == null)
            {
                return new ObjectResult("");
            }

            var filePath = FileDomain.Storage.Combine(fileLocation, trip.Picture);
            bool exists = FileDomain.Storage.FileExists(filePath);
            if (exists)
            {
                var fileStream = FileDomain.GetFile(fileLocation, trip.Picture);
                return new FileStreamResult(fileStream, "image/jpeg");
            }

            return new ObjectResult("");
        }

        private ParticipantSE GetParticipant(TripEntity trip, ObjectId userId)
		{
			if (trip.Participants == null)
			{
				return null;
			}

			var participant = trip.Participants.FirstOrDefault(p => p.PortalUser_id == UserIdObj);
			return participant;
		}
	
		private bool IsUserAdmin(TripEntity trip)
		{
			bool isOwner = trip.PortalUser_id == UserIdObj;
			if (isOwner)
			{
				return true;
			}

			var participant = GetParticipant(trip, UserIdObj.Value);
			if (participant == null)
			{
				return false;
			}

			return participant.IsAdmin;
		}
		
		public IActionResult GetFile(string fileId, string tripId)
		{
			var tripIdObj = new ObjectId(tripId);
            var fileIdObj = new ObjectId(fileId);
            var trip = DB.C<TripEntity>().FirstOrDefault(t => t.id == tripIdObj);

			if (trip == null)
			{
				//throw not exists
				throw new Exception();
			}

			if (trip.Files == null)
			{
				//throw not exists
				throw new Exception();
			}

			//todo: check rights				
			var fileToReturn = trip.Files.FirstOrDefault(f => f.id == fileIdObj);

			if (fileToReturn == null)
			{
				//thorw not found
				throw new Exception();
			}

			var dir = Path.Combine("trips", tripId);
			var fileStream = FileDomain.GetFile(dir, fileToReturn.SavedFileName);


			return File(fileStream, fileToReturn.Type, fileToReturn.OriginalFileName);
		}
		

		private TripItemViewModel TripToViewModel(TripEntity trip)
		{
			var vm = new TripItemViewModel
			{
				Id = trip.id.ToString(),
				Date = trip.CreatedDate,
				Name = trip.Name,

				ImageBig = "~/images/samples/sample05.jpg",
				IsLocked = true
			};
			return vm;
		}		
	}

    public class OverviewRequest
    {
        public string id { get; set; }
        public string sc { get; set; }
    }

}