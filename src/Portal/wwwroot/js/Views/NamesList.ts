class NamesList {
	$nameInput: any;
	$nameSaveBtn: any;
	$nameEditBtn: any;
	$selectedSpan: any;
	$searchesList: any;
	$addNewItem: any;

	private searches = [];
	public currentSearch;

	private isEditMode = false;

	public onSearchChanged: Function;

	constructor(searches) {
		this.searches = searches;

		this.$nameInput = $("#nameInput");
		this.$nameSaveBtn = $("#nameSaveBtn");
		this.$nameEditBtn = $("#nameEditBtn");	 
		this.$selectedSpan = $("#selectedSpan");
		this.$searchesList = $("#searchesList");
		this.$addNewItem = $("#addNewItem");

		this.$nameEditBtn.click(() => this.editClick());
		this.$nameSaveBtn.click(() => this.saveClick());

		this.$nameInput.focusout(() => {
			this.saveNewName();
		});

		this.$addNewItem.click(() => {
			var data = PlanningSender.createRequest(PlanningType.Custom, "createNewSearch", {			
				searchName: 'new search'
			});

			PlanningSender.pushProp(data, (newSearch) => {
				searches.push(newSearch);
				this.currentSearch = newSearch;
				this.addItem(newSearch);
				this.setToEditMode();
				this.onSearchChanged(newSearch);				
			});
		});

		this.fillList();
	}

	private fillList() {
		this.$searchesList.html("");

		this.searches.forEach((search) => {
			this.addItem(search);
		});

		this.currentSearch = this.searches[0];
		this.$selectedSpan.text(this.currentSearch.searchName);
	}

  private addItem(search) {
	  var itemHtml = `<li data-si="${search.id}">${search.searchName}</li>`;
			var $item = $(itemHtml);
			this.$searchesList.append($item);

			$item.click((e) => {
				this.itemClick($item);
			});
  }

	private itemClick($item) {
		var searchId = $item.data("si");
		var search = _.find(this.searches, (search) => { return search.id === searchId; });
		this.currentSearch = search;
		this.onSearchChanged(search);
	}
 
	public saveClick() {
		this.saveNewName();
	}

	public editClick() {
	 this.setToEditMode();
	}

 private saveNewName() {
	 var newName = this.$nameInput.val();
		var data = PlanningSender.createRequest(PlanningType.Custom, "renameSearch", {
			id: this.currentSearch.id,
			searchName: newName
		});

		PlanningSender.updateProp(data, (res) => {
			this.currentSearch.searchName = newName;
			this.$nameInput.hide();
			this.$selectedSpan.show();
			this.$nameEditBtn.show();
			this.$nameSaveBtn.hide();
			this.isEditMode = false;

			this.$selectedSpan.text(newName);
			this.$searchesList.find(`li[data-si='${this.currentSearch.id}']`).text(newName);
		});
 }

 private setToEditMode() {
	 this.$nameInput.show();
		this.$nameInput.val(this.currentSearch.searchName);
		this.$selectedSpan.hide();
		this.$nameEditBtn.hide();
		this.$nameSaveBtn.show();
		this.isEditMode = true;
		this.$nameInput.focus();
		this.$nameInput.select();
 }

}