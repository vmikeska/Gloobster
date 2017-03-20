module Views {

	export class NewAdminView extends ViewBase {

		public isMasterAdmin;
		public isSuperAdmin;
		public isAdminOfSomething;

		private currentPage: AdminPageBase;

		constructor() {
			super();
		}

		private init() {
			this.initTabs();
		}


		private initTabs() {
			var tabs = new Common.Tabs($("#mainTabs"), "main");

			if (this.isMasterAdmin || this.isSuperAdmin || this.isAdminOfSomething) {
				tabs.addTab("wikiTab", "WIKI", () => {
						this.currentPage = new WikiAdminPage(this);
					});
			}

			if (this.isMasterAdmin) {
				tabs.addTab("travelbTab", "Travel buddy");
				tabs.addTab("dashboardTab", "Dashboard");
			}

			tabs.create();
		}
	}


	export class AdminPageBase {
			public $cont;

			public v: NewAdminView;

			constructor(v: NewAdminView, layoutTmpName: string = null) {
					this.v = v;
					this.$cont = $(".page-cont");

					if (layoutTmpName) {
							var layoutTmp = ViewBase.currentView.registerTemplate(layoutTmpName);
							var $l = $(layoutTmp());
						 this.$cont.html($l);
					}

					this.create();
			}

			private create() {
				this.createCustom();
			}

			protected createCustom() {}

		}
		
		export class WikiAdminPage extends AdminPageBase
		{
				constructor(v: NewAdminView) {
						super(v, "menu-content-tmp");
				}

				createCustom() {
						this.createWikiTabs();
				}

				private createWikiTabs() {
						var tabs = new Common.Tabs(this.$cont.find(".sub-menu"), "subMenu");

						tabs.onBeforeSwitch = () => {
								this.$cont.find(".sub-content").empty();
						}

					if (this.v.isAdminOfSomething) {

						tabs.addTab("wikiTasks", "Tasks", () => {
								var fnc = new WikiAdminTasks(this.$cont);
								fnc.init();
							});
					}

					if (this.v.isMasterAdmin) {

						tabs.addTab("wikiSections", "Sections", () => {
								var fnc = new WikiPageSectionsAdmin(this.$cont);

								fnc.createSectionsTabs();
								fnc.regCreateNewSection();
							});

					}

					if (this.v.isSuperAdmin) {

						tabs.addTab("wikiNewCity", "Add new city", () => {
								var fnc = new WikiAdminAddCity(this.$cont);
								fnc.init();
							});

					}

					if (this.v.isMasterAdmin) {

						tabs.addTab("wikiSuperAdmins", "Super admins", () => {
								var fnc = new WikiSuperAdminMgmt(this.$cont);
								fnc.init();
							});
					}

					if (this.v.isMasterAdmin || this.v.isSuperAdmin) {

						tabs.addTab("wikiArticleAdmins", "Article admins", () => {
								var fnc = new WikiArticlesAdminMgmt(this.$cont);
								fnc.init();
							});
					}

					tabs.create();
				}
				
		}

		export class WikiArticlesAdminMgmt {
				private $cont;

				constructor($cont) {
						this.$cont = $cont;
				}


				public init() {
						var tmp = ViewBase.currentView.registerTemplate("article-admins-mgmt-tmp");
						var $l = $(tmp());
						this.$cont.find(".sub-content").html($l);

						this.regUserSearch();

						this.getUsers((users) => {
							this.genUsers(users);
						});
				}

				private getSearchBox(id, callback) {
						var config = new Common.UserSearchConfig();
						config.elementId = id;
						config.clearAfterSearch = true;
						config.endpoint = "FriendsSearch";
						var box = new Common.UserSearchBox(config);
						box.onUserSelected = (user) => {
								callback(user);
						};
				}

				private getUsers(callback: Function) {
					Views.ViewBase.currentView.apiGet("WikiArticlesPermissions", [], (users) => {
						callback(users);
					});
				}

				private genUsers(users) {
						var lg = Common.ListGenerator.init(this.$cont.find(".users-cont"), "article-admin-item-tmp");
					 lg.clearCont = true;

					 lg.evnt(".del", (e, $item, $target, item) => {
						 var data = [["id", item.id]];

						 var cd = new Common.ConfirmDialog();
						 cd.create("Delete",
							 "Do you really want to remove the user?",
							 "Cancel",
							 "Delete",
							 () => {
									 Views.ViewBase.currentView.apiDelete("WikiArticlesPermissions", data, () => {
											 $item.remove();
									 });
							 });
							 
					 });

					 lg.onItemAppended = ($item, item) => {
							 var $combo = $item.find(".article-combo");
							 this.initPlaceCombo($combo, item.id);

							 this.getArticles(item.id, (articles) => {
								 this.genArticles(articles, $item);
							 });							 
					 }

					lg.generateList(users);
				}

				private genArticles(articles, $item) {
						var lgp = Common.ListGenerator.init($item.find(".places"), "place-item-tmp");
					lgp.clearCont = true;
					lgp.evnt(".del", (e, $item, $target, item) => {

						  var uid = $item.closest(".user-item").data("uid");

							var data = [["articleId", item.id], ["userId", uid]];
							
							var cd = new Common.ConfirmDialog();
							cd.create("Remove",
									"Do you really want to remove permissions?",
									"Cancel",
									"Remove",
									() => {
											Views.ViewBase.currentView.apiDelete("WikiArticlePermissions", data, () => {
													$item.remove();
											});
									});

					});

						lgp.generateList(articles);	 
				}

			private getArticles(id, callback: Function) {

				var data = [["id", id]];
				
				Views.ViewBase.currentView.apiGet("WikiArticlePermissions", data, (articles) => {
						callback(articles);
					});
			}

			private regUserSearch() {
						this.getSearchBox("userCombo", (user) => {
								var data = { id: user.friendId };
								Views.ViewBase.currentView.apiPost("WikiArticlesPermissions", data, (created) => {
										if (created) {
												
												this.getUsers((users) => {
														this.genUsers(users);
												});

										} else {
												var id = new Common.InfoDialog();
												id.create("User creation unsuccessful", "Maybe user already exists ?");
										}

								});
						});
				}

				private initPlaceCombo($combo, userId) {
						
						var combo = new WikiSearchCombo();
						combo.initElement($combo);
						combo.selectionCallback = ($a) => {
								var articleId = $a.data("articleid");

								var data = {
										userId: userId,
										articleId: articleId
								};

								Views.ViewBase.currentView.apiPost("WikiArticlePermissions", data, (r) => {

									var $cont = $combo.closest(".user-item");

										this.getArticles(userId, (articles) => {
												this.genArticles(articles, $cont);
										});			
								});
						};
				}
		}

		export class WikiSuperAdminMgmt {
				private $cont;

				constructor($cont) {
						this.$cont = $cont;
				}

				public init() {
						var tmp = ViewBase.currentView.registerTemplate("super-admins-mgmt-tmp");
						var $l = $(tmp());
						this.$cont.find(".sub-content").html($l);

						this.getAdmins((admins) => {
								this.genAdmins(admins);
						});

					  this.regSearch();
				}

				private getAdmins(callback: Function) {
					var data = [];

					ViewBase.currentView.apiGet("WikiSuperAdmins", data, (r) => {
							callback(r);
					});
				}

				private genAdmins(admins) {
						var lg = Common.ListGenerator.init(this.$cont.find(".super-admins-mgmt .cont"), "super-admin-item-tmp");
					  lg.clearCont = true;

					lg.evnt(".del", (e, $item, $target, item) => {
							var dialog = new Common.ConfirmDialog();
							dialog.create("Delete", "Do you want to remove SA ?", "Cancel", "Yes", () => {

									var data = [["id", item.id]];
									ViewBase.currentView.apiDelete("WikiSuperAdmins", data, (r) => {
											$(`.item[data-uid="${item.id}"]`).remove();											
									});

							});
						});

						lg.generateList(admins);
				}

				private getSearchBox(id, callback) {
						var config = new Common.UserSearchConfig();
						config.elementId = id;
						config.clearAfterSearch = true;
						config.endpoint = "FriendsSearch";
						var box = new Common.UserSearchBox(config);
						box.onUserSelected = (user) => {
								callback(user);
						};
				}

			private regSearch() {
				this.getSearchBox("userCombo", (user) => {
						var data = {
							id: user.friendId
						};

						Views.ViewBase.currentView.apiPost("WikiSuperAdmins", data, (created) => {

								if (created) {
									this.getAdmins((admins) => {
										this.genAdmins(admins);
									});
								} else {
									var id = new Common.InfoDialog();
									id.create("User creation unsuccessful", "Maybe user already exists ?");
								}

							});
					});
			}

		}

		export class WikiAdminTasks {
				private $cont;

				constructor($cont) {
						this.$cont = $cont;
				}

				public init() {

						this.getTasks((tasks) => {
							this.genTasks(tasks);
						});
				}

			private genTasks(tasks) {

				var lg = Common.ListGenerator.init(this.$cont.find(".sub-content"), "task-base-tmp");

				lg.evnt(".action-btn", (e, $item, $target, item) => {

						var name = $target.data("action");
						var id = $item.attr("id");

						var cd = new Common.ConfirmDialog();
						cd.create("Action confirmation", `Do you want to perform action '${name}' ?`, "Cancel", "Execute", () => {

								var data = {
									action: name,
									id: id
								};

								Views.ViewBase.currentView.apiPost("WikiAdminAction",
									data,
									(r) => {
										if (r) {
											$item.remove();
										}
									});

							});

					});

				lg.generateList(tasks);
			}

			private getTasks(callback: Function) {
					Views.ViewBase.currentView.apiGet("WikiAdminAction", [], (tasks) => {
						callback(tasks);
					});						
				}
				
		}

		export class WikiAdminAddCity {
				
				private selectedCity;
				private $cont;

				constructor($cont) {
					this.$cont = $cont;
				}

				public init() {
						var tmp = ViewBase.currentView.registerTemplate("add-city-tmp");
						var $l = $(tmp());
						this.$cont.find(".sub-content").html($l);


						$("#SendCity").click((e) => {
								e.preventDefault();
								this.createCity();
						});

						this.regSearchBox();
				}

				private regSearchBox() {
						var searchBox = new Common.GNOnlineSearchBox("gnCombo");
						searchBox.onSelected = (city) => this.onCitySelected(city);
				}

				private onCitySelected(city) {
						$("#txtGID").val(city.geonameId);
						$("#txtPopulation").val(city.population);
						$("#txtTitle").val(city.name);

						this.selectedCity = city;
				}

				private createCity() {
						if ($("#txtGID").val() === "") {
								return;
						}

						var dialog = new Common.ConfirmDialog();
						dialog.create("Add city", "Do you want to add the city ?", "Cancel", "Create", () => {
								var data = {
										gid: this.selectedCity.geonameId,
										population: $("#txtPopulation").val(),
										title: $("#txtTitle").val(),
										countryCode: this.selectedCity.countryCode
								};

								Views.ViewBase.currentView.apiPost("WikiCity", data, (r) => {

										var id = new Common.InfoDialog();
									if (r) {										
										id.create("The city added", "The city has been added");
									} else {
											id.create("The city not added", "The city has NOT been added");
									}

								});
						});
				}


		}

		export class WikiPageSectionsAdmin {
				private sectionsTab;

				private $cont;

				constructor($cont) {
					this.$cont = $cont;
				}

				public createSectionsTabs() {

						var tmp = ViewBase.currentView.registerTemplate("sections-content-tmp");
						var $l = $(tmp());
						this.$cont.find(".sub-content").html($l);

						this.sectionsTab = new Common.Tabs(this.$cont.find(".sections-menu"), "entitySwitch");

						this.sectionsTab.addTab("entCity", "Cities", () => {

								this.getSectionsMgmt("0", (sections) => {
										this.genSectionsTable(sections);
								});

						});
						this.sectionsTab.addTab("entCountry", "Countries", () => {

								this.getSectionsMgmt("1", (sections) => {
										this.genSectionsTable(sections);
								});

						});

						this.sectionsTab.create();
				}

				public regCreateNewSection() {
						var txtInput = $("#newSectionText");

						$("#newSectionBtn").click((e) => {
								e.preventDefault();

								var txt = txtInput.val();

								if (txt.length > 0) {
										var cd = new Common.ConfirmDialog();
										cd.create("Do you want to create new section", `Do you want to create new section with name '${txt}'?`, "Cancel", "Ok", () => {

												var data = {
														type: (this.sectionsTab.activeTabId === "entCity") ? 0 : 1,
														name: txt
												};

												ViewBase.currentView.apiPost("WikiPageSection", data, (r) => {
														txtInput.val("");

														var t = (this.sectionsTab.activeTabId === "entCity") ? "0" : "1";

														this.getSectionsMgmt(t, (sections) => {
																this.genSectionsTable(sections);
														});
												});
										});
								}

						});
				}

				private genSectionsTable(sections) {

						var lg = Common.ListGenerator.init(this.$cont.find("#sectionsTable"), "section-item-tmp");
						lg.clearCont = true;

						lg.evnt(".del-cross", (e, $item, $target, item) => {

								var pt = (this.sectionsTab.activeTabId === "entCity") ? "0" : "1";
								var st = $item.data("t");

								var data = [["pt", pt], ["st", st]];

								var cd1 = new Common.ConfirmDialog();
								cd1.create("Deletion confirmation", `Do you really want to delete it ?`, "Cancel", "Delete", () => {

										var cd2 = new Common.ConfirmDialog();
										cd2.create("Deletion confirmation", `Do you really want to delete section '${st}'`, "Cancel", "Delete", () => {

												ViewBase.currentView.apiDelete("WikiPageSection", data, (r) => {
														$(`tr[data-t="${st}"]`).remove();
												});

										});

								});

						});

						lg.generateList(sections);

				}

				private getSectionsMgmt(type, callback: Function) {
						var data = [["type", type]];

						ViewBase.currentView.apiGet("WikiPageSection", data, (r) => {
								callback(r);
						});
				}
		}

		

}