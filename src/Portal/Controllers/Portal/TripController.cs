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

namespace Gloobster.Portal.Controllers.Portal
{
	public class TripController : PortalBaseController
	{
		public TripController(IDbOperations db) : base(db)
		{
		}

		public IActionResult List()
		{
			var viewModel = CreateViewModelInstance<ViewModelTrips>();

			var trips = DB.C<TripEntity>().Where(t => t.PortalUser_id == DBUserId).ToList();

			viewModel.Trips = new List<TripItemViewModel>();
			viewModel.Trips.AddRange(GetDummyTrips());
			viewModel.Trips.AddRange(trips.Select(TripToViewModel).ToList());
			
			return View(viewModel);
		}

		private List<TripItemViewModel> GetDummyTrips()
		{
			return new List<TripItemViewModel>
			{
				new TripItemViewModel
				{
					Id = "myId2",
					Date = DateTime.UtcNow,
					Name = "Canary island with Ryan in June",
					ImageBig = "~/images/samples/sample01.jpg",
					IsLocked = false
				},
						 new TripItemViewModel
				{
					Id = "myId",
					Date = DateTime.UtcNow,
					Name = "My super trip",
					ImageBig = "~/images/samples/sample05.jpg",
					IsLocked = true
				}
			};
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

		public async Task<IActionResult> CreateNewTrip(string id)
		{
			var tripEntity = new TripEntity
			{
				id = ObjectId.GenerateNewId(),
				CreatedDate = DateTime.UtcNow,
				Name = id,
				PortalUser_id = DBUserId
			};

			await DB.SaveAsync(tripEntity);

			return RedirectToAction("Detail", "Trip", tripEntity.id);
		}

		public IActionResult Detail()
		{
			var viewModel = CreateViewModelInstance<ViewModelDetail>();
			
			return View(viewModel);
		}

	}
}