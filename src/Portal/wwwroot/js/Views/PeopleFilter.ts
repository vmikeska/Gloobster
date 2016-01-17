module Views {
	export class PeopleFilter {
		private $userFilter;
		private $userFilterContent;
		private $usersBox;
		private itemTemplate;

	  public onSelectionChanged: Function;

		constructor() {
			this.$userFilter = $(".usersFilterComponent");
			this.$userFilterContent = $(".userFilterContent");
			this.$usersBox = $(".userFilterContent");
			this.itemTemplate = ViewBase.currentView.registerTemplate("item-template");

			this.$userFilter.click((e) => {
				this.showHide();
			});

			this.initBase();
		}

		private initBase() {
		 
		 var html =				
					this.itemTemplate({ id: "Me", displayName: "Me", checked: true }) +
					this.itemTemplate({ id: "Friends", displayName: "Friends" }) +
					this.itemTemplate({ id: "Everybody", displayName: "Everybody" });

		 this.$userFilterContent.prepend(html);		 
		}

		public initFriends(friends) {
			friends.forEach((f) => {
				var html = this.itemTemplate(f);
				this.$usersBox.append(html);
			});
			this.onUsersRendered();
		}

		private onUsersRendered() {
			$(".filterCheckbox").click((e) => {
				var $target = $(e.target);
				var id = $target.attr("id");
				var checked = $target.prop("checked");
				this.setForm(id, checked);


				if (this.onSelectionChanged) {
					var selection = this.getSelection();
					this.onSelectionChanged(selection);
				}
			});
		}

		public getSelection(): Maps.PeopleSelection {
			var evnt = new Maps.PeopleSelection();
			evnt.me = $("#chckMe").prop("checked");
			evnt.friends = $("#chckFriends").prop("checked");
			evnt.everybody = $("#chckEverybody").prop("checked");
			evnt.singleFriends = [];

			var singleUsers = $(".filterCheckbox").not("#chckEverybody").not("#chckMe").not("#chckFriends").toArray();
			singleUsers.forEach((u) => {
				var $u = $(u);
				if ($u.prop("checked")) {
					var id = $u.attr("id").replace("chck", "");
					evnt.singleFriends.push(id);
				}
			});

			return evnt;
		}

		private setForm(id, checked) {
		 if (id === "chckEverybody" && checked) {
			 $(".filterCheckbox").not("#chckEverybody").prop("checked", false);
		 } else {
			$("#chckEverybody").prop("checked", false); 
		 }

		 var singleFriendChecked = ((id !== "chckEverybody" && id !== "chckMe" && id !== "chckFriends") && checked);
		 if (singleFriendChecked) {
			$("#chckFriends").prop("checked", false); 
		 }

		 if (id === "chckFriends" && checked) {
			$(".filterCheckbox").not("#chckEverybody").not("#chckMe").not("#chckFriends").prop("checked", false);
		 }
	  }

		private showHide() {
			this.$userFilterContent.toggle();
		}
	}
}