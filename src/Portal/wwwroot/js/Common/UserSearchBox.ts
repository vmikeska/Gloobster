module Common {
	export class UserSearchBox {

		public config: UserSearchConfig;
		public onUserSelected: Function;

		private delayedCallback: DelayedCallback;
		private $root: any;
		private $input: any;

		private template: any;

		constructor(config: UserSearchConfig) {
			this.config = config;
			this.$root = $("#" + config.elementId);
			this.$input = this.$root.find("input");

			var source = $("#userItem-template").html();
			this.template = Handlebars.compile(source);

			this.delayedCallback = new DelayedCallback(this.$input);
			this.delayedCallback.callback = (placeName) => this.searchUsers(placeName);
		}

		public searchUsers(name: string) {
			var params = [["name", name]];
			Views.ViewBase.currentView.apiGet(this.config.endpoint, params, places => { this.fillSearchBoxHtml(places) });
		}

		private fillSearchBoxHtml(users) {
			this.$root.find("ul").show();
			var htmlContent = "";
			users.forEach(item => {
				htmlContent += this.getItemHtml(item);
			});

			this.$root.find("li").unbind();
			this.$root.find("ul").html(htmlContent);

			this.$root.find("li").click(clickedUser => {
				this.selectUser(clickedUser, users);
			});
		}

		private selectUser(clickedPlace, users) {
			var userId = $(clickedPlace.currentTarget).data("value");

			var clickedUserObj = _.find(users, user => (user.friendId === userId));

			this.$root.find("ul").hide();

			if (this.config.clearAfterSearch) {
				this.$input.val("");
			} else {
				var selectedCaption = clickedUserObj.City + ", " + clickedUserObj.CountryCode;
				this.$input.val(selectedCaption);
			}

			if (this.onUserSelected) {
				this.onUserSelected(clickedUserObj);
			}
		}


		private getItemHtml(item) {

			var context = {
				photoUrl: "/images/samples/sample11.jpg",
				userId: item.friendId,
				displayName: item.displayName
			};

			var html = this.template(context);
			return html;
		}
	}


	export class UserSearchConfig {
		elementId: string;
		clearAfterSearch: boolean;
		endpoint: string;
	}
}