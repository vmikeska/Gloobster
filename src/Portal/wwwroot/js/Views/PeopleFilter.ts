module Views {
	export class PeopleFilter {
		private $userFilter;
		private $userFilterContent;
		private $usersBox;
		private itemTemplate;

	  public onSelectionChanged: Function;

		constructor() {
			this.$userFilter = $(".usersFilterComponent");			
			this.$usersBox = this.$userFilter.find("ul");
			this.itemTemplate = ViewBase.currentView.registerTemplate("item-template");
		 
			this.initBase();
		}

	  public justMeSelected() {
		 var sel = this.getSelection();
		  return sel.me && !sel.everybody && !sel.friends && (sel.singleFriends.length === 0);
	  }

		private initBase() {
			var html =
				this.itemTemplate({ id: "Me", displayName: "Me", checked: true, hasIco: true, ico: "icon-personal" }) +
				this.itemTemplate({ id: "Friends", displayName: "Friends", hasIco: true, ico: "icon-people" }) +
				this.itemTemplate({ id: "Everybody", displayName: "Everybody", hasIco: true, ico: "icon-globe" });

			this.$usersBox.prepend(html);
		}

		public initFriends(friends) {
			friends.forEach((f) => {
			 var $item = $(this.itemTemplate(f));
				$item.find("input").addClass("filterCheckbox");
				this.$usersBox.append($item);
			});
			this.onUsersRendered();
		}

		private onUsersRendered() {
		 this.$usersBox.find("input").change((e) => {
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

			var $chbcks = this.$usersBox.find("input");

		 if (id === "chckEverybody" && checked) {
			$chbcks.not("#chckEverybody").prop("checked", false);
		 } else {
			$("#chckEverybody").prop("checked", false); 
		 }

		 var singleFriendChecked = ((id !== "chckEverybody" && id !== "chckMe" && id !== "chckFriends") && checked);
		 if (singleFriendChecked) {
			$("#chckFriends").prop("checked", false); 
		 }

		 if (id === "chckFriends" && checked) {
			$chbcks.not("#chckEverybody").not("#chckMe").not("#chckFriends").prop("checked", false);
		 }
	  }

		private showHide() {
			this.$userFilterContent.toggle();
		}
	}
}