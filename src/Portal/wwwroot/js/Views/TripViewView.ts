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

		private registerEvents() {
			var btns = $(".tripMenuButton");
			btns.click((e) => {
				var $btn = $(e.target);
				var tmp = $btn.data("tmp");
				this.displayContent(tmp);
			});
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

				$html.find("#justForInvited").prop("checked", trip.justForInvited);
				$html.find("#allowRequestJoin").prop("checked", trip.allowToRequestJoin);
				if (trip.sharingCode) {
					$html.find("#shareByCode").prop("checked", trip.sharingCode != null);
					this.setCode(trip.sharingCode);
				}

				$html.find("#justForInvited").change((e) => {
					var state = $(e.target).prop("checked");
					var data = { propertyName: "JustForInvited", values: { id: trip.tripId, state: state } };
					ViewBase.currentView.apiPut("tripProperty", data, () => {
						trip.justForInvited = state;
					});
				});

				$html.find("#allowRequestJoin").change((e) => {
					var state = $(e.target).prop("checked");
					var data = { propertyName: "AllowToRequestJoin", values: { id: trip.tripId, state: state } };
					ViewBase.currentView.apiPut("tripProperty", data, () => {
						trip.allowToRequestJoin = state;
					});
				});

				$html.find("#shareByCode").change((e) => {
					var state = $(e.target).prop("checked");
					var data = { propertyName: "ShareByCode", values: { id: trip.tripId, state: state } };
					ViewBase.currentView.apiPut("tripProperty", data, (code) => {
						this.setCode(code);
						trip.sharingCode = code;
					});
				});

				this.container.html($html);
		}

		private createShareContent() {
			var $html = $(this.shareTemplate());

			var shareButtons = new Common.ShareButtons($html.find("#shareCont"), "Share on social media");
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

			$table.append($html);
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

		public displayContent(tmp) {
			this.container.toggle();
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

	export class TripViewView extends ViewBase {
		trip: any;
		comments: Trip.Comments;
		files: Trip.Files;
		inviteDialogView: InviteDialogView;
	  
		planner: Trip.Planner;
		acceptCombo: Trip.AcceptCombo;
		tripMenu: TripMenu;

		initialize(id: string) {
			var self = this;
		 
			this.inviteDialogView = new InviteDialogView();

			var filesConfig = new Trip.FilesConfig();
			filesConfig.containerId = "filesContainer";
			filesConfig.inputId = "fileInput";
			filesConfig.editable = false;
			filesConfig.addAdder = true;
			filesConfig.templateId = "file-template";

			this.files = new Trip.Files(filesConfig);

			this.getTrip(id);

			$("#commentSubmit").click(() => {
				self.comments.postComment(self.trip.tripId);
			});

			this.tripMenu = new TripMenu();
		}

		private getTrip(id: string) {
			var prms = [["id", id]];
			super.apiGet("trip", prms, (request) => this.onTripLoaded(request));
		}

		private setFilesCustomConfig(tripId: string) {
			var customData = new Common.TripFileCustom();
			customData.tripId = tripId;
			this.files.fileUpload.customConfig = customData;
		}

		private initAcceptCombo() {
			var isOwner = this.trip.ownerId === Reg.LoginManager.currentUserId;
			if (!isOwner) {
				var thisParticipant = _.find(this.trip.participants, (p) => { return p.userId === Reg.LoginManager.currentUserId });
				var acConfig = {
					comboId: "invitationState",
					initialState: thisParticipant.state,
					tripId: this.trip.tripId
				};

				this.acceptCombo = new Trip.AcceptCombo(acConfig);
				$("#invitationState").show();
			}
		}

		private onTripLoaded(request) {
			this.trip = request;

			this.initAcceptCombo();

			this.files.setFiles(this.trip.files, this.trip.tripId, this.trip.filesPublic);

			this.comments = new Trip.Comments();
			this.comments.comments = this.trip.comments;
			this.comments.users = this.trip.users;
			this.comments.displayComments();

			this.planner = new Trip.Planner(this.trip, false);
		}


		private generateButtons() {

		}
	}
}