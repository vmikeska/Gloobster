module Planning {

		export class CustomMenu {

				public onSearchChange: Function;

				private $cont;

				private actCls = "state-active";

				private headers;

				private dataLoader: SearchDataLoader;

				constructor($cont) {
						this.dataLoader = new SearchDataLoader();
						this.$cont = $cont;
				}

				public addItem(id, name) {
						this.headers.push({ id: id, name: name });
						this.init(this.headers, id);
				}

				public init(headers, initId = null) {
						this.headers = headers;

						this.$cont.find(".item").remove();

						var activeId = "";
						if (this.headers.length > 0) {
								activeId = this.headers[0].id;
						}
						if (initId) {
								activeId = initId;
						}


						var lg = Common.ListGenerator.init(this.$cont.find(".adder"), "custom-menu-btn-template");
						lg.appendStyle = "before";

						lg.activeItem = (item) => {
								var obj = {
										isActive: item.id === activeId,
										cls: this.actCls
								};

								return obj;
						}

						lg.evnt(null,
								(e, $item, $target, item) => {
										this.itemClicked($item);
								});

						lg.evnt(".delete",
								(e, $item, $target, item) => {
										this.delClicked(item.id);
								});

						lg.evnt(".edit",
								(e, $item, $target, item) => {
										this.editClicked($item);
								});

						lg.evnt(".edit-save",
								(e, $item, $target, item) => {
										this.saveClicked($item);
								});

						lg.evnt(".name-edit",
								(e, $item, $target, item) => {
										this.keyPressed(e, $item);
								})
								.setEvent("keyup");

						lg.generateList(headers);
				}

				private keyPressed(e, $item) {
						if (e.keyCode === 13) {
								this.saveClicked($item);
						}
				}

				private saveClicked($item) {
						var id = $item.data("id");
						var name = $item.find(".name-edit").val();

						var header = _.find(this.headers, (h) => { return h.id === id });
						header.name = name;

						var pdu = new PropsDataUpload(id, "name");
						pdu.setVal(name);
						pdu.send(() => {
								$item.find(".name-txt").html(name);
								$item.removeClass("state-editing");
								$item.addClass("state-active");
						});
				}

				private editClicked($item) {
						$item.removeClass("state-active");
						$item.addClass("state-editing");
				}

				private delClicked(id) {

						var cd = new Common.ConfirmDialog();

						cd.create("Search removal",
								"Do you want to remove the search?",
								"Cancel",
								"Delete",
								() => {

										this.dataLoader.deleteSearch(id,
												() => {
														$(`#${id}`).remove();
												});

								});

				}

				private itemClicked($item) {

						var id = $item.data("id");

						var $items = this.$cont.find(".item");
						$items.removeClass(this.actCls);

						$item.addClass(this.actCls);

						if (this.onSearchChange) {
								this.onSearchChange(id);
						}
				}


		}


}