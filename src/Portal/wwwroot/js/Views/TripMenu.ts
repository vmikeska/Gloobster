module Views {
	export class TripMenu {

		private privacyTemplate;
		private shareTemplate;
		private participantsTemplate;
		private participantTemplate;
		private userSearchBox: Common.UserSearchBox;

		private $container;
		private $win;

		constructor() {
				this.$win = $("#menuItemContent");
				this.$container = this.$win.find(".cont");			

			this.registerEvents();
			this.registerTemplates();

			
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

			this.$container.html($html);
		}

		private fillSocStr(str, $html) {
		 $html.find("#share").find("span").html(str);
		}

		private createShareContent() {
			var $html = $(this.shareTemplate());

			var shareButtons = new Common.ShareButtons($html.find("#shareCont"));
			shareButtons.onSelectionChanged = (nets) => {
				this.fillSocStr(nets, $html);
			}

			this.fillSocStr(shareButtons.getStr(), $html);

			$html.find("#share").click(() => {
				var networks = shareButtons.getSelectedNetworks();

				var data = {
					message: $("#message").val(),
					tripId: ViewBase.currentView["trip"].tripId,
					networks: networks
				}

				this.$container.hide();

				var v = ViewBase.currentView;
					
				var id = new Common.InprogressDialog();
				
				id.create(v.t("SharingTrip", "jsTrip"));

				var hd = new Common.HintDialog();
				ViewBase.currentView.apiPost("TripSocNetworks", data, (r) => {
					id.remove();

					var successful = (r === "");
					if (successful) {
							hd.create(v.t("TripShared", "jsTrip"));
					} else if (r === "HasUnnamed") {
							hd.create(v.t("CannotShareUnnamed", "jsTrip"));
					}
				});
			});
			this.$container.html($html);
		}

		private createParticipantsContent(trip) {		 
			var $html = this.participantsTemplate();
		 
			this.$container.html($html);

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

			$html.find(".delete").click((e) => {
				var $btn = $(e.target);
				var id = $btn.data("id");
				var prms = [["tripId", trip.tripId], ["id", id]];
				ViewBase.currentView.apiDelete("TripParticipants", prms, (r) => {
						$table.find(`#${id}`).remove();
						$table.find(`#line_${id}`).remove();						
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
			var v = ViewBase.currentView;

			if (state === ParticipantState.Invited) {
				return v.t("Invited", "jsTrip");
			}
			if (state === ParticipantState.Accepted) {
			 return v.t("Accepted", "jsTrip");
			}
			if (state === ParticipantState.Maybe) {
			 return v.t("Maybe", "jsTrip");
			}
			if (state === ParticipantState.Refused) {
			 return v.t("Refused", "jsTrip");
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
			var $btns = $(".menu-btn");
			$btns.click((e) => {
				var $btn = $(e.target);
				$btns.not($btn).removeClass("active");
				var t = $btn.data("t");
				this.displayContent(t);
			});

			this.$win.find(".close").click((e) => {
					e.preventDefault();
					this.$win.slideUp();
			});
		}

		public displayContent(tmp) {
			this.$win.slideDown();
			var trip = ViewBase.currentView["trip"];

			if (tmp === "menuPrivacy-template") {
				this.setDialogInfo("PrivacySettings", "PrivacyText");
				this.createPrivacyContent(trip);
			}

			if (tmp === "menuShare-template") {
				this.createShareContent();
			}

			if (tmp === "participants-template") {
					this.setDialogInfo("ParticipTitle", "ParticipText");
				this.createParticipantsContent(trip);
			}
		}

		private setDialogInfo(title, txt) {
				var $cont = $("#menuItemContent");
				var v = ViewBase.currentView;

				var titleTxt = v.t(title, "jsTrip");
				var txtTxt = v.t(txt, "jsTrip");

			$cont.find(".title").html(titleTxt);
			$cont.find(".txt").html(txtTxt);
		}

	}
}