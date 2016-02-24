module Views {
	export class TripMenu {

		private privacyTemplate;
		private shareTemplate;
		private participantsTemplate;
		private participantTemplate;
		private userSearchBox: Common.UserSearchBox;

		private container;

		constructor() {
			this.registerEvents();
			this.registerTemplates();

			this.container = $(".menuItemContent");
		}

		private registerTemplates() {
			this.privacyTemplate = ViewBase.currentView.registerTemplate("menuPrivacy-template");
			this.shareTemplate = ViewBase.currentView.registerTemplate("menuShare-template");
			this.participantsTemplate = ViewBase.currentView.registerTemplate("participants-template");		
			this.participantTemplate = ViewBase.currentView.registerTemplate("participant-template");
		}
	 
		private setCode(code) {		 
			var text = "";
			if (code) {
				text = "http://gloobster/" + code;
			}
			$("#sharingCode").val(text);
		}

		private createPrivacyContent(trip) {
			var $html = $(this.privacyTemplate());

			$html.find("#friendsPublic").prop("checked", trip.friendsPublic);
			$html.find("#allowRequestJoin").prop("checked", trip.allowToRequestJoin);
		
			$html.find("#friendsPublic").change((e) => {
				var state = $(e.target).prop("checked");
				var data = { propertyName: "FriendsPublic", values: { id: trip.tripId, state: state } };
				ViewBase.currentView.apiPut("tripProperty", data, () => {
				 trip.friendsPublic = state;
				});
			});

			$html.find("#allowRequestJoin").change((e) => {
				var state = $(e.target).prop("checked");
				var data = { propertyName: "AllowToRequestJoin", values: { id: trip.tripId, state: state } };
				ViewBase.currentView.apiPut("tripProperty", data, () => {
					trip.allowToRequestJoin = state;
				});
			});

			this.container.html($html);
		}

		private createShareContent() {
			var $html = $(this.shareTemplate());

			var shareButtons = new Common.ShareButtons($html.find("#shareCont"));
			$html.find("#share").click(() => {
				var networks = shareButtons.getSelectedNetworks();

				var data = {
					message: $("#message").val(),
					tripId: ViewBase.currentView["trip"].tripId,
					networks: networks
				}

				ViewBase.currentView.apiPost("TripSocNetworks", data, r => {
					this.container.hide();
				});
			});
			this.container.html($html);
		}
	 
		private createParticipantsContent(trip) {		 
			var $html = this.participantsTemplate();
		 
			this.container.html($html);

			trip.participants.forEach((p) => {
				this.generateOneParticipant(p.name, p.userId, p.isAdmin, p.state);
			});

			var config = new Common.UserSearchConfig();
			config.elementId = "friends";
			config.clearAfterSearch = true;
			config.endpoint = "FriendsSearch";
			this.userSearchBox = new Common.UserSearchBox(config);
			this.userSearchBox.onUserSelected = (user) => {
				this.addUser(trip, user);
			};
		}

		private isAreadyAdded(trip, userId) {		 
			var foundParticiapnt = _.find(trip.participants, (p) => { return p.id === userId });
			return foundParticiapnt != null;
		}

		private addUser(trip, user) {
			var userId = user.friendId;
			var isAdded = this.isAreadyAdded(trip, userId);
			if (isAdded) {
				return;
			}

			var data = {
				caption: $("#caption").val(),
				tripId: trip.tripId,
				users: [userId]
			};

			ViewBase.currentView.apiPost("TripParticipants", data, (r) => {
				this.addOneParticipant(user.displayName, userId);
			});

		}

		private generateOneParticipant(name, id, isAdmin, state) {
			var trip = ViewBase.currentView["trip"];

			var context = {
				name: name,
				id: id,
				checked: (isAdmin ? "checked" : ""),
				state: this.getTextState(state)
			};

			var $table = $("#participantsTable");
			var $html = $(this.participantTemplate(context));

			$html.find(".del").click((e) => {
				var $btn = $(e.target);
				var id = $btn.data("id");
				var prms = [["tripId", trip.tripId], ["id", id]];
				ViewBase.currentView.apiDelete("TripParticipants", prms, (r) => {
					$table.find("#" + id).remove();
					trip.participants = _.reject(trip.participants, (p) => { return p.userId === id });
				});
			});

			$html.find(".isAdmin").click((e) => {
				var $chck = $(e.target);
				var id = $chck.data("id");
				var isAdmin = $chck.prop("checked");
				var prms = {
					tripId: trip.tripId,
					id: id,
					isAdmin: isAdmin			
				};
				ViewBase.currentView.apiPut("TripParticipantsIsAdmin", prms, (r) => {
					var par = _.find(trip.participants, (p) => { return p.userId === id });
					par.isAdmin = isAdmin;
				});
			});

			$table.prepend($html);
		}

		private getTextState(state: ParticipantState) {
			if (state === ParticipantState.Invited) {
				return "Invited";
			}
			if (state === ParticipantState.Accepted) {
				return "Accepted";
			}
			if (state === ParticipantState.Maybe) {
				return "Maybe";
			}
			if (state === ParticipantState.Refused) {
				return "Refused";
			}
		}

		private addOneParticipant(name, id) {
			this.generateOneParticipant(name, id, false, 0);
		 
			var trip = ViewBase.currentView["trip"];

			var part = {
				isAdmin: false,
				name: name,
				state: 0,
				userId: id
			};
			trip.participants.push(part);
		}

		private registerEvents() {
			var $btns = $(".tripMenuButton");
			$btns.click((e) => {
				var $btn = $(e.target);
				$btns.not($btn).removeClass("popup-open");
				var tmp = $btn.data("tmp");
				this.displayContent(tmp);
			});
		}

		public displayContent(tmp) {
			this.container.show();
			var trip = ViewBase.currentView["trip"];
			
			if (tmp === "menuPrivacy-template") {
				this.createPrivacyContent(trip);			 
			}

			if (tmp === "menuShare-template") {
				this.createShareContent();			 
			}

			if (tmp === "participants-template") {
				this.createParticipantsContent(trip);			 
			}
		}

	}
}