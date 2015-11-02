﻿using System;
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
using Gloobster.DomainModels;

namespace Gloobster.Portal.Controllers.Portal
{
	public class TripController : PortalBaseController
	{
		public FilesDomain FileDomain { get; set; }

		public TripController(IFilesDomain filesDomain, IDbOperations db) : base(db)
		{
			FileDomain = (FilesDomain)filesDomain;
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
		
		public IActionResult GetFile(string fileId, string tripId)
		{
			var tripIdObj = new ObjectId(tripId);			
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
			var fileToReturn = trip.Files.FirstOrDefault(f => f.SavedFileName == fileId);

			if (fileToReturn == null)
			{
				//thorw not found
				throw new Exception();
			}

			var dir = Path.Combine("Trips", tripId);
			var fileStream = FileDomain.GetFile(dir, fileToReturn.SavedFileName);


			return File(fileStream, fileToReturn.Type, fileToReturn.OriginalFileName);
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
	}

	public class CommentsRequest
	{
		
	}

	

}