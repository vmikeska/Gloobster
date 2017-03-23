module Views {

		export class WikiAdminPageView extends WikiPageView {

				private standardBlockAdmin: BlockAdmin;
				private doDontAdmin: DoDontAdmin;

				private $adminMode = $("#adminMode");
				private isAdminMode = false;

				private priceAdmin: PriceAdmin;
				private linksAdmin: LinksAdmin;

				constructor(articleId, articleType, photoGID) {
						super(articleId, articleType, photoGID);
						
						this.standardBlockAdmin = new BlockAdmin(articleId, this.langVersion);
						this.doDontAdmin = new DoDontAdmin(articleId, this.langVersion);
						this.priceAdmin = new PriceAdmin(articleId);
						this.linksAdmin = new LinksAdmin(articleId);

						this.regAdminMode();
				}

				private regAdminMode() {
						this.$adminMode.change(() => {
								this.isAdminMode = this.$adminMode.prop("checked");
								this.onAdminModeChanged();
						});
				}

				private onAdminModeChanged() {
						if (this.isAdminMode) {
								this.generateBlocks();
						} else {
								this.destroyBlocks();
						}
				}

				private generateBlocks() {
						this.standardBlockAdmin.generateAdmin();
						this.doDontAdmin.generateAdmin();
						this.priceAdmin.generateAdmin();
						this.linksAdmin.addLinks();
				}

				private destroyBlocks() {
						this.linksAdmin.clean();
						this.priceAdmin.clean();
						this.doDontAdmin.clean();
						this.standardBlockAdmin.clean();
				}

		}

		export class LinksAdmin {

				private get v(): Views.ViewBase {
						return Views.ViewBase.currentView;
				}

				private articleId: string;

				private $form;

				constructor(articleId) {
						this.articleId = articleId;
				}

				public clean() {
						$(".links-admin-btn").remove();
						this.removeEditLinks();
				}

				public addLinks() {
						var $links = $(".adminable-links");
						$links.each((i, linkBlock) => {
								var $lb = $(linkBlock);
								this.addAdminBtn($lb);
						});

						this.refreshEditButtons();
				}

				private addAdminBtn($linkBlock) {
						var $cont = $linkBlock.find(".admin-btn-cont");

						var $btn = $(`<a class="lbtn2 red-orange links-admin-btn" href="#"> Add item</a>`);
						$cont.append($btn);

						$btn.click((e) => {
								e.preventDefault();
								var category = $linkBlock.data("c");
								this.createMainWindow(null, category);
						});
				}

				private createMainWindow(id, category) {
						var isEdit = id !== null;

						var t = this.v.registerTemplate("links-item-admin-template");
						var $t = $(t());

						var cd = new Common.CustomDialog();
						cd.init($t, "Add link item");

						$t.find("#addSocLink").click((e) => {
								e.preventDefault();

								this.createSocLinkWindow($t);
						});

						cd.addBtn("Cancel", "yellow-orange", () => {
								cd.close();
						});

						if (isEdit) {
								cd.addBtn("Delete", "red-orange", () => {
										this.itemDelete(id, () => {
												var $fid = $(`#faviItem_${id}`);
												$fid.remove();
												cd.close();
										});
								});

								var $fi = $(`#faviItem_${id}`);

								$t.find("#linkName").val($fi.data("name"));
								var $icoLinks = $fi.find(".ico-link");

								$icoLinks.each((i, socLink) => {
										var $socLink = $(socLink);
										var t = $socLink.data("t");
										var sid = $socLink.data("sid");
										this.addSocLink(t, sid, $t);
								});

						}

						cd.addBtn("Save", "green-orange", () => {

								this.save($t, id, category, () => {
										cd.close();
								});

						});

				}

				private showInvalid() {
						var id = new Common.InfoDialog();
						id.create("Incomplete", "Name and at least one link has to be created");
				}

				private save($t, id, category, callback: Function) {

						var name = $t.find("#linkName").val();

						if (name.length === 0) {
								this.showInvalid();
								return;
						}

						var data = {
								linkId: id,
								articleId: this.articleId,
								name: name,
								category: category,
								socLinks: []
						};

						var $socLinksRoot = $t.find(".soc-links-list");

						var $socLinks = $socLinksRoot.find(".soc-link-admin");
						$socLinks.each((i, socLink) => {
								var $socLink = $(socLink);
								var linkReq = {
										socNetType: $socLink.data("value"),
										sid: $socLink.data("sid"),
										id: $socLink.data("id")
								};
								data.socLinks.push(linkReq);
						});

						if (data.socLinks.length === 0) {
								this.showInvalid();
								return;
						}

						if (id === null) {
								ViewBase.currentView.apiPost("WikiLink", data, (newItem) => {
										var sls = this.mapsSocLinks(data.socLinks);
										this.createNewItem(newItem.id, name, sls, category);

										this.refreshEditButtons();

										callback();
								});
						} else {
								ViewBase.currentView.apiPut("WikiLink", data, (newItem) => {
										var sls = this.mapsSocLinks(data.socLinks);

										$(`#faviItem_${id}`).remove();

										this.createNewItem(id, name, sls, category);

										this.refreshEditButtons();

										callback();
								});
						}
				}

				private mapsSocLinks(socLinks) {
						var sls = _.map(socLinks, (sl) => {
								return {
										link: this.getLink(sl.socNetType, sl.sid),
										ico: this.getLinkIco(sl.socNetType),
										sid: sl.sid,
										type: sl.socNetType
								};
						});
						return sls;
				}

				private createSocLinkWindow($mainWin) {
						var t = this.v.registerTemplate("links-soc-link-admin-template");
						var $t = $(t());

						Common.DropDown.registerDropDown($t.find(".dropdown"));

						var cd = new Common.CustomDialog();
						cd.init($t, "Add social link");

						cd.addBtn("Add", "green-orange", () => {

								var val = parseInt($t.find(".selectedValue").val());
								var sid = $t.find(".linkId").val();

								this.addSocLink(val, sid, $mainWin);

								cd.close();
						});

						cd.addBtn("Cancel", "yellow-orange", () => {
								cd.close();
						});
				}

				private addSocLink(val, sid, $mainWin) {
						var t = this.v.registerTemplate("soc-link-item-template");

						var context = {
								val: val,
								sid: sid,
								icon: this.getLinkIco(val),
								link: this.getLink(val, sid)
						};

						var $t = $(t(context));

						$t.find(".del").click((e) => {
								e.preventDefault();
								$t.remove();
								this.linksChanged($mainWin);
						});

						var $cont = $mainWin.find(".soc-links-list");
						$cont.append($t);

						this.linksChanged($mainWin);
				}

				private linksChanged($mainWin) {
						var $cont = $mainWin.find(".soc-links-list");
						var visible = $cont.find(".soc-link-admin").length === 0;
						$mainWin.find(".no-links").toggle(visible);
				}

				private getLinkIco(t) {
						if (t === SourceType.S4) {
								return "icon-foursquare";
						}
						if (t === SourceType.FB) {
								return "icon-facebook2";
						}

						if (t === SourceType.Yelp) {
								return "icon-yelp";
						}
						return "";
				}

				private getLink(t, sid) {
						if (t === SourceType.S4) {
								return `https://foursquare.com/v/${sid}`;
						}
						if (t === SourceType.FB) {
								return `https://www.facebook.com/${sid}`;
						}
						if (t === SourceType.Yelp) {
								return `https://www.yelp.com/biz/${sid}`;
						}
				}

				private createNewItem(id, name, socLinks, category) {

						var context = {
								id: id,
								name: name,
								socLinks: socLinks,
						};

						var t = this.v.registerTemplate("new-link-template");
						var $t = $(t(context));

						var $cont = $(`.links-cont[data-category="${category}"]`);

						$cont.find(".empty-cont").remove();

						$cont.append($t);
				}

				private removeEditLinks() {
						var $favItems = $(".block-links .fav-item");

						$favItems.find(".editLink").remove();
				}

				private refreshEditButtons() {
						this.removeEditLinks();

						var $favItems = $(".block-links .fav-item");

						$favItems.each((i, item) => {
								var $item = $(item);

								var id = $item.data("id");

								var $btn = $(`<a href="#" class="lbtn2 yellow-orange editLink" data-id="${id}">Edit</a>`);

								$item.find(".name").before($btn);

								$btn.click((e) => {
										e.preventDefault();

										var category = $item.closest(".block-links").data("c");
										this.createMainWindow(id, category);
								});
						});
				}

				private itemDelete(linkId, callback) {

						ViewBase.currentView.apiDelete("WikiLink", [["linkId", linkId], ["articleId", this.articleId]], (r) => {
								callback();
						});
				}

		}

		export class PriceAdmin {

				private get v(): Views.ViewBase {
						return Views.ViewBase.currentView;
				}

				private articleId;
				private $edited;

				constructor(articleId) {
						this.articleId = articleId;
				}

				public generateAdmin() {
						var $tds = $(".price-item-admin");
						var tds = $tds.toArray();
						tds.forEach((td) => this.generateAdminItem(td));
				}

				public clean() {
						$(".price-edit").remove();
				}

				private generateAdminItem(td) {
						var $td = $(td);
						var id = $td.data("id");
						$td.append(this.getEditButton(id));
				}

				private getEditButton(id) {
						var $edit = $(`<a href="#" class="lbtn2 red-orange price-edit" data-id="${id}">Edit</a>`);
						$edit.click((e) => {
								e.preventDefault();
								var $target = $(e.target);
								this.$edited = $target.closest(".price-item-admin");

								var price = this.$edited.find(".price").text();

								this.edit(id, price);
						});
						return $edit;
				}

				private edit(id, price) {

						var context = {
								id: id,
								price: price
						};

						var t = this.v.registerTemplate("price-edit-template");

						var $t = $(t(context));

						var cd = new Common.CustomDialog();
						cd.init($t, "Reset price");

						cd.addBtn("Reset price", "green-orange", () => {
								var newPrice = $t.find("input").val();

								this.save(id, newPrice, () => {
										this.$edited.find(".price").text(newPrice);
										cd.close();
								});
						});
				}

				private save(id, price, callback) {

						var parsedVal = parseFloat(price);
						if (parsedVal) {
								var data = {
										articleId: this.articleId,
										price: parsedVal,
										priceId: id
								};
								ViewBase.currentView.apiPut("WikiPrice", data, (r) => {
										callback();
								});
						} else {
								var ind = new Common.InfoDialog();
								ind.create("Invalid float", "must be an int or float");
						}
				}
		}


		export class DoDontAdmin {

				private get v(): Views.ViewBase {
						return Views.ViewBase.currentView;
				}

				private articleId;
				private language;
				private $edited;
				private $cont;
				private $form;

				private $lastTextarea;
				private lastType;

				private itemTemplate;

				constructor(articleId, lang) {
						this.articleId = articleId;
						this.language = lang;
						this.$cont = $(".doDont");

						this.itemTemplate = ViewBase.currentView.registerTemplate("doDontItem-template");
				}

				public clean() {
						$(".ddEditButton").remove();
						$(".doDontAdder").remove();
				}

				public generateAdmin() {
						var $items = this.$cont.find(".item");
						var items = $items.toArray();
						items.forEach((item) => {
								var $item = $(item);
								var id = $item.data("id");
								var $html = this.editButton(id);
								$item.append($html);
						});

						$(".admindo").after(this.generateAdder("do"));
						$(".admindont").after(this.generateAdder("dont"));
				}

				private generateDialog(id) {
						var isEdit = id !== null;

						var t = this.v.registerTemplate("do-dont-admin-tmp");
						var context = {
								txt: ""
						};
						var $t = $(t(context));

						var cd = new Common.CustomDialog();

						cd.init($t, "Do/Dont's management");

						this.$lastTextarea = $t.find("#doDontTxt");

						if (isEdit) {
								var curTxt = $(`#ddi_${id}`).find(".txt").html();
								this.$lastTextarea.val(curTxt);
						}

						cd.addBtn("Save", "green-orange", () => {
								var txt = this.$lastTextarea.val();

								if (isEdit) {
										this.save(id, txt, () => {
												cd.close();
										});
								} else {
										this.saveNew(txt, () => {
												cd.close();
										});
								}

						});

						cd.addBtn("Cancel", "yellow-orange", () => {
								cd.close();
						});

						if (isEdit) {
								cd.addBtn("Delete", "red-orange", () => {
										this.delete(id);
										cd.close();
								});
						}

				}

				private editButton(id) {
						var $html = $(`<a class="lbtn2 red-orange ddEditButton" href="#" data-id="${id}">edit</a>`);
						$html.click((e) => {
								e.preventDefault();
								var $t = $(e.target);
								var $block = $t.closest(".dd-block");
								this.lastType = $block.data("t");

								this.generateDialog(id);
						});
						return $html;
				}

				private generateAdder(type) {
						var $html = $(`<a href="#" class="lbtn2 red-orange doDontAdder" data-type="${type}">Add new</a>`);
						$html.click((e) => {
								e.preventDefault();
								this.lastType = type;

								this.generateDialog(null);
						});

						return $html;
				}

				private saveNew(txt, callback: Function) {

						var data = {
								articleId: this.articleId,
								language: this.language,
								text: txt,
								type: this.lastType
						};

						ViewBase.currentView.apiPost("WikiDoDont", data, (r) => {

								var plusMinus = this.lastType === "do" ? "plus" : "minus";
								var context = { id: r, text: txt, plusMinus: plusMinus };
								var $i = $(this.itemTemplate(context));

								var $editBtn = this.editButton(context.id);
								$i.append($editBtn);

								var $cont = $(`.dd-block[data-t="${this.lastType}"]`).find(".inner");

								$cont.find(".empty-block").remove();

								$cont.append($i);
								callback();
						});
				}

				private delete(id) {
						var data = [["articleId", this.articleId], ["id", id], ["type", this.lastType]];

						ViewBase.currentView.apiDelete("WikiDoDont", data, (r) => {
								$(`#ddi_${id}`).remove();
						});
				}


				private save(id, txt, callback: Function) {

						var data = {
								articleId: this.articleId,
								language: this.language,
								id: id,
								text: txt,
								type: this.lastType
						};

						ViewBase.currentView.apiPut("WikiDoDont", data, (r) => {
								$(`#ddi_${id}`).find(".txt").html(txt);
								callback();
						});
				}
		}


		export class BlockAdmin {

				private articleId: string;
				private langVersion: string;

				private lastPosition = 0;
				private $lastTextEdit;
				private $lastSectionTxt;

				private get v(): Views.ViewBase {
						return Views.ViewBase.currentView;
				}

				constructor(articleId, langVersion) {
						this.articleId = articleId;
						this.langVersion = langVersion;

				}

				public clean() {
						$(".edit-section").remove();
				}

				public generateAdmin() {
						var adminBlocks = $(".adminable-block").toArray();

						adminBlocks.forEach((block) => {
								var $block = $(block);
								var id = $block.data("id");
								var sectionType = $block.data("at");

								this.createAdminLink($block, id);
						});
				}

				private createEditWindow(sectionId) {

						this.lastPosition = 0;

						var $block = $(`.block[data-id="${sectionId}"]`);
						this.$lastSectionTxt = $block.find(".text");
						var origTxt = this.$lastSectionTxt.html();

						var cd = new Common.CustomDialog();

						var context = {
								txt: origTxt
						};

						var t = this.v.registerTemplate("block-report-admin-tmp");
						var $tmp = $(t(context));

						cd.init($tmp, "Paragraph administration edit");

						this.$lastTextEdit = $("#newSectText");

						cd.addBtn("Cancel", "red-orange", () => {
								cd.close();
						});

						cd.addBtn("Save", "green-orange", () => {
								var newText = this.$lastTextEdit.val();
								this.save(sectionId, newText, () => {
										this.$lastSectionTxt.html(newText);
										cd.close();
								});
						});

						cd.addBtn("<<", "blue-yellow", () => {
								this.moveVersion(sectionId, +1);
						});

						cd.addBtn(">>", "blue-yellow", () => {
								this.moveVersion(sectionId, -1);
						});


				}

				private moveVersion(sectionId, direction) {

						this.lastPosition += direction;
						this.getVersion(sectionId, this.lastPosition, (txt) => {
								this.$lastTextEdit.val(txt.value);
						});
				}

				private getVersion(id, position, callback) {
						var data = [["articleId", this.articleId], ["lang", this.langVersion], ["addId", id], ["position", position]];
						ViewBase.currentView.apiGet("WikiVersion", data, (r) => {
								callback(r);
						});
				}

				private save(sectionId, newText, callback: Function) {

						var data = {
								articleId: this.articleId,
								sectionId: sectionId,
								language: this.langVersion,
								newText: newText
						};

						ViewBase.currentView.apiPut("WikiUpdate", data, (r) => {
								callback();
						});
				}

				private createAdminLink($block, id) {
						var $html = $(`<a href="#" id="editSection_${id}" class="lbtn2 red-orange edit-section" data-id="${id}">edit</a>`);

						$html.click((e) => {
								e.preventDefault();
								var $edit = $(e.target);
								var id = $edit.data("id");

								this.createEditWindow(id);
						});

						$block.find(".admin-btn-cont").html($html);
				}

		}

}