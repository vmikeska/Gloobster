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
using Autofac;
using Gloobster.DomainInterfaces;
using Gloobster.DomainModels;
using Gloobster.DomainModels.Services.Accounts;
using Gloobster.DomainModels.Services.Trip;
using Gloobster.DomainModels.Trips;
using Gloobster.Entities.Trip;
using Gloobster.Enums;
using Serilog;
using Gloobster.Portal.Controllers.Api.Trip;


namespace Gloobster.Portal.Controllers.Portal
{
	public class TripController : PortalBaseController
	{
		public IFilesDomain FileDomain { get; set; }
		public ITripPlannerDomain TripPlanner { get; set; }
		public ISharedMapImageDomain SharedImgDomain { get; set; }
        public ITripDomain Trips { get; set; }
        
		public TripController(ITripDomain trips, ISharedMapImageDomain sharedImgDomain, ITripPlannerDomain tripPlanner, IFilesDomain filesDomain,
            ILogger log, IDbOperations db, IComponentContext cc, ILanguages langs) : base(log, db, cc, langs)
        {
			FileDomain = filesDomain;
			TripPlanner = tripPlanner;
			SharedImgDomain = sharedImgDomain;
		    Trips = trips;
		}

        [CreateAccount]
        public async Task<IActionResult> List(string id = "grid")
        {
            var vm = CreateViewModelInstance<ViewModelTrips>();
            vm.DefaultLangModuleName = "pageTrips";
            vm.LoadClientTexts(new [] { "jsTrip" });

            vm.NewTrips = new List<TripItemViewModel>();
            vm.OldTrips = new List<TripItemViewModel>();

            vm.DisplayType = string.IsNullOrEmpty(id) || (id == "grid");

            if (!IsUserLogged)
            {
                return View(vm);
            }
            
            var oldTrips = new List<TripEntity>();
            var newTrips = new List<TripEntity>();

            var trips = DB.List<TripEntity>(t => t.User_id == UserIdObj);

            CreateTripIfNone(trips, vm);

            var query = $"{{ 'Participants.User_id': ObjectId('{UserId}')}}";
            var invitedTrips = await DB.FindAsync<TripEntity>(query);

            trips.AddRange(invitedTrips);

            foreach (var trip in trips)
            {
                var ft = TripUtils.GetTripFromTo(trip);

                var tripEnd = ft.Item2;

                bool isOld = tripEnd < DateTime.UtcNow;
                if (isOld)
                {
                    oldTrips.Add(trip);
                }
                else
                {
                    newTrips.Add(trip);
                }
            }
            
            vm.OldTrips = ConvertTrips(oldTrips, vm);
            vm.NewTrips = ConvertTrips(newTrips, vm);

            return View(vm);
        }

	    private List<TripItemViewModel> ConvertTrips(List<TripEntity> trips, ViewModelTrips vm)
	    {
            var tripsVM = new List<TripItemViewModel>();
            foreach (var t in trips)
            {
                var tc = TripToViewModel(t, vm);
                tripsVM.Add(tc);
            }

	        return tripsVM;
	    }

	    private async void CreateTripIfNone(List<TripEntity> trips, ViewModelTrips vm)
	    {
            if (!trips.Any())
            {
                var tripName = vm.W("DefaultTripName");

                string tripId = await Trips.CreateNewTrip(tripName, UserId, true);

                var tripIdObj = new ObjectId(tripId);

                var trip = DB.FOD<TripEntity>(t => t.id == tripIdObj);

                trips.Add(trip);
            }
        }

        [CreateAccount]
        public IActionResult Detail(string id)
        {
            var tripIdObj = new ObjectId(id);
            var trip = DB.FOD<TripEntity>(t => t.id == tripIdObj);
            
            //permissions part            
            bool isOwner = trip.User_id == UserIdObj;
            if (isOwner)
            {
                var vm = CreateDetailVM(trip);                
                return View(vm);
            }

            var thisUserParticipant = trip.Participants.FirstOrDefault(p => p.User_id == UserIdObj);
            bool thisUserIsAdmin = (thisUserParticipant != null) && thisUserParticipant.IsAdmin;
            if (thisUserIsAdmin)
            {
                var vm = CreateDetailVM(trip);
                return View(vm);
            }

            //user has no admin righs
            return RedirectToAction("NoAdminRights", "Trip");
        }

        [CreateAccount]
        public async Task<IActionResult> Overview(OverviewRequest req)
        {
            var tripIdObj = new ObjectId(req.id);
            var trip = DB.FOD<TripEntity>(t => t.id == tripIdObj);
            var owner = DB.FOD<UserEntity>(u => u.User_id == trip.User_id);
            
            //permissions part
            if (trip.FriendsPublic)
            {
                var vm = CretateOverviewVM(trip, owner);
                return View(vm);
            }

            bool isOwner = trip.User_id == UserIdObj;
            if (isOwner)
            {
                var vm = CretateOverviewVM(trip, owner);
                return View(vm);
            }

            var thisUserParticipant = trip.Participants.FirstOrDefault(p => p.User_id == UserIdObj);
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
                return RedirectToAction("RequestJoin", "Trip", new {id = req.id});
            }

            //trip is completly private
            return RedirectToAction("PrivateTrip", "Trip");
        }

        [CreateAccount]
        public IActionResult Share(string id)
		{
		    var tripIdObj = new ObjectId(id);            
		    var trip = DB.FOD<TripEntity>(t => t.id == tripIdObj);

		    var tripFromTo = TripUtils.GetTripFromTo(trip);
            var fromDate = tripFromTo.Item1;
            var toDate = tripFromTo.Item2;
            
            var owner = DB.FOD<UserEntity>(u => u.User_id == trip.User_id);

            var vm = CreateViewModelInstance<ViewModelShareTrip>();
            vm.DefaultLangModuleName = "pageTripShare";

            var dateStr = string.Format(vm.W("DateRange"), fromDate.Day, fromDate.Month, toDate.Day, toDate.Month, toDate.Year);
            
            vm.Id = id;
            vm.Participants = GetParticipantsView(trip.Participants, trip.User_id);
		    vm.OwnerId = trip.User_id.ToString();
		    vm.OwnerDisplayName = owner.DisplayName;
            vm.Message = trip.LastSharingMessage;
		    vm.DateRangeStr = dateStr;
            vm.TripIsPrivate = !trip.AllowToRequestJoin && !trip.FriendsPublic;
            return View(vm);
		}
        
        public IActionResult SharedMapImage(string id)
        {
            var mapStream = SharedImgDomain.GetMap(id);
            return new FileStreamResult(mapStream, "image/png");
        }


        public async Task<IActionResult> CreateNewTrip(string id)
		{
		    if (IsUserLogged)
		    {
		        string tripId = await Trips.CreateNewTrip(id, UserId, false);
		        
		        return RedirectToAction("Detail", "Trip", new {id = tripId });
		    }
		    
            return RedirectToAction("List", "Trip");            
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
            var vm = CreateViewModelInstance<ViewModelTripRequestJoin>();
            vm.DefaultLangModuleName = "pageTripJoin";
            vm.LoadClientTexts(new[] { "jsTripJoin" });
            vm.Id = id;
            
            return View(vm);
        }
        
        public IActionResult TripPicture(string id)
        {
            var stream = GetPicture(id, TripFileConstants.BigPicNameExt);
            return stream;
        }

        public IActionResult TripPictureSmall_s(string id)
        {
            var stream = GetPicture(id, TripFileConstants.SmallPicNameExt_s);
            return stream;            
        }

        public IActionResult TripPictureSmall_xs(string id)
        {
            var stream = GetPicture(id, TripFileConstants.SmallPicNameExt_xs);
            return stream;
        }




        private FileStreamResult GetPicture(string tripId, string picName)
	    {           
            var tripDir = FileDomain.Storage.Combine(TripFileConstants.FileLocation, tripId);
            
            var filePath = FileDomain.Storage.Combine(tripDir, picName);
            bool exists = FileDomain.Storage.FileExists(filePath);
            if (exists)
            {
                var fileStream = FileDomain.GetFile(tripDir, picName);
                return new FileStreamResult(fileStream, "image/jpeg");                
            }

            return null;
	    }

        private ParticipantSE GetParticipant(TripEntity trip, ObjectId userId)
		{
			if (trip.Participants == null)
			{
				return null;
			}

			var participant = trip.Participants.FirstOrDefault(p => p.User_id == UserIdObj);
			return participant;
		}
	
		private bool IsUserAdmin(TripEntity trip)
		{
			bool isOwner = trip.User_id == UserIdObj;
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
            var trip = DB.FOD<TripEntity>(t => t.id == tripIdObj);

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

			//is id of the file protecting permissions enough ?
            
			var fileToReturn = trip.Files.FirstOrDefault(f => f.id == fileIdObj);
            
            if (fileToReturn == null)
			{
				//thorw not found
				throw new Exception();
			}

			var dir = FileDomain.Storage.Combine(TripFileConstants.TripFilesDir, tripId);
			var fileStream = FileDomain.GetFile(dir, fileToReturn.SavedFileName);


			return File(fileStream, fileToReturn.Type, fileToReturn.OriginalFileName);
		}

        private ViewModelTripDetail CretateOverviewVM(TripEntity trip, UserEntity owner)
        {
            var ownerId = trip.User_id.ToString();
            var ownerIdObj = new ObjectId(ownerId);
            
            var vm = CreateViewModelInstance<ViewModelTripDetail>();
            vm.DefaultLangModuleName = "pageTripDetail";
            vm.LoadClientTexts(new[] { "jsTrip" });

            var displayName = GetDisplayName(owner);
            
            vm.Name = trip.Name;
            vm.IsUserAdmin = IsUserAdmin(trip);
            vm.OwnerDisplayName = displayName;
            vm.OwnerId = ownerId;
            vm.TripId = trip.id.ToString();
            vm.Description = trip.Description;
            vm.Notes = trip.Notes;
            vm.NotesPublic = trip.NotesPublic;
            vm.IsOwner = (trip.User_id == UserIdObj);
            vm.HasBigPicture = trip.HasBigPicture;
            vm.Participants = GetParticipantsView(trip.Participants, ownerIdObj);
            var thisUserParticipant = trip.Participants.FirstOrDefault(p => p.User_id == UserIdObj);
            vm.ThisUserInvited = thisUserParticipant != null;

            return vm;
        }
        
        private List<UserViewModel> GetParticipantsView(List<ParticipantSE> participants, ObjectId ownerId)
        {
            var participantIds = participants.Where(p => p.State == ParticipantState.Accepted).Select(p => p.User_id).ToList();
            participantIds.Add(ownerId);
            var participantUsers = DB.List<UserEntity>(u => participantIds.Contains(u.User_id));

            var prtcs = participantUsers.Select(p => new UserViewModel
            {
                Name = p.DisplayName,
                Id = p.User_id.ToString()
            }).ToList();

            return prtcs;
        }

        private ViewModelTripDetail CreateDetailVM(TripEntity trip)
        {
            var vm = CreateViewModelInstance<ViewModelTripDetail>();
            vm.DefaultLangModuleName = "pageTripDetail";
            vm.LoadClientTexts(new[] { "jsTrip" });
            vm.Name = trip.Name;
            vm.TripId = trip.id.ToString();
            vm.Description = trip.Description;
            vm.Notes = trip.Notes;
            vm.NotesPublic = trip.NotesPublic;

            return vm;
        }

	    private string GetDisplayName(UserEntity owner)
	    {
	        string displayName = null;
            if (owner != null)
            {
                displayName = owner.DisplayName;
            }
	        return displayName;
	    }

        private TripItemViewModel TripToViewModel(TripEntity trip, ViewModelBase b)
		{
            var tripFromTo = TripUtils.GetTripFromTo(trip);
            var fromDate = tripFromTo.Item1;
            var toDate = tripFromTo.Item2;

            var owner = DB.FOD<UserEntity>(u => u.User_id == trip.User_id);
            var displayName = GetDisplayName(owner);
            
            var vm = new TripItemViewModel
			{
                B = b,
				Id = trip.id.ToString(),
                FromDate = fromDate,
                ToDate = toDate,                
				Name = trip.Name,
                Participants = GetParticipantsView(trip.Participants, trip.User_id),
                HasSmallPicture = trip.HasSmallPicture,

                IsOwner = trip.User_id == UserIdObj.Value,
                OwnerName = displayName,
                OwnerId = trip.User_id.ToString(),

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