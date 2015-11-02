﻿
class TripDetailView extends Views.ViewBase
{
	trip: any; 
	comments: Comments;
	files: Files;

	initialize(id: string) {
		var self = this;

		this.files = new Files(this);

	 this.getTrip(id);

		$("#commentSubmit").click(() => {
			self.comments.postComment(self.trip.tripId);
		});
	}


  private getTrip(id: string) {
	  var prms = [["id", id]];
	  super.apiGet("trip", prms, (request) => this.onTripLoaded(request));
  }

	private onTripLoaded(request) {
	 this.trip = request;

		this.files.setTrip(this.trip);

	 this.comments = new Comments(this);
	 this.comments.comments = this.trip.comments;
		this.comments.users = this.trip.users;		

		this.comments.displayComments();
	}

  

	



}