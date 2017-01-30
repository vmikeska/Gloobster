var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Views;
(function (Views) {
    var NewAdminView = (function (_super) {
        __extends(NewAdminView, _super);
        function NewAdminView() {
            _super.call(this);
        }
        NewAdminView.prototype.init = function () {
            this.initTabs();
        };
        NewAdminView.prototype.initTabs = function () {
            var _this = this;
            var tabs = new Common.Tabs($("#mainTabs"), "main");
            tabs.addTab("wikiTab", "WIKI", function () {
                _this.currentPage = new WikiAdminPage();
            });
            tabs.addTab("travelbTab", "Travel buddy");
            tabs.addTab("dashboardTab", "Dashboard");
            tabs.create();
        };
        return NewAdminView;
    }(Views.ViewBase));
    Views.NewAdminView = NewAdminView;
    var AdminPageBase = (function () {
        function AdminPageBase(layoutTmpName) {
            if (layoutTmpName === void 0) { layoutTmpName = null; }
            this.$cont = $(".page-cont");
            if (layoutTmpName) {
                var layoutTmp = Views.ViewBase.currentView.registerTemplate(layoutTmpName);
                var $l = $(layoutTmp());
                this.$cont.html($l);
            }
            this.create();
        }
        AdminPageBase.prototype.create = function () {
            this.createCustom();
        };
        AdminPageBase.prototype.createCustom = function () { };
        return AdminPageBase;
    }());
    Views.AdminPageBase = AdminPageBase;
    var WikiAdminPage = (function (_super) {
        __extends(WikiAdminPage, _super);
        function WikiAdminPage() {
            _super.call(this, "menu-content-tmp");
        }
        WikiAdminPage.prototype.createCustom = function () {
            this.createWikiTabs();
        };
        WikiAdminPage.prototype.createWikiTabs = function () {
            var _this = this;
            var tabs = new Common.Tabs(this.$cont.find(".sub-menu"), "subMenu");
            tabs.onBeforeSwitch = function () {
                _this.$cont.find(".sub-content").empty();
            };
            tabs.addTab("wikiTasks", "Manage tasks", function () {
                var fnc = new WikiAdminTasks(_this.$cont);
                fnc.init();
            });
            tabs.addTab("wikiSections", "Sections management", function () {
                var fnc = new WikiPageSectionsAdmin(_this.$cont);
                fnc.createSectionsTabs();
                fnc.regCreateNewSection();
            });
            tabs.addTab("wikiNewCity", "Add new city", function () {
                var fnc = new WikiAdminAddCity(_this.$cont);
                fnc.init();
            });
            tabs.addTab("wikiSuperAdmins", "SuperAdmins management", function () {
                var fnc = new WikiSuperAdminMgmt(_this.$cont);
                fnc.init();
            });
            tabs.create();
        };
        return WikiAdminPage;
    }(AdminPageBase));
    Views.WikiAdminPage = WikiAdminPage;
    var WikiSuperAdminMgmt = (function () {
        function WikiSuperAdminMgmt($cont) {
            this.$cont = $cont;
        }
        WikiSuperAdminMgmt.prototype.init = function () {
            var _this = this;
            var tmp = Views.ViewBase.currentView.registerTemplate("super-admins-mgmt-tmp");
            var $l = $(tmp());
            this.$cont.find(".sub-content").html($l);
            this.getAdmins(function (admins) {
                _this.genAdmins(admins);
            });
            this.regSearch();
        };
        WikiSuperAdminMgmt.prototype.getAdmins = function (callback) {
            var data = [];
            Views.ViewBase.currentView.apiGet("WikiSuperAdmins", data, function (r) {
                callback(r);
            });
        };
        WikiSuperAdminMgmt.prototype.genAdmins = function (admins) {
            var lg = Common.ListGenerator.init(this.$cont.find(".super-admins-mgmt .cont"), "super-admin-item-tmp");
            lg.clearCont = true;
            lg.evnt(".del", function (e, $item, $target, item) {
                var dialog = new Common.ConfirmDialog();
                dialog.create("Delete", "Do you want to remove SA ?", "Cancel", "Yes", function () {
                    var data = [["id", item.id]];
                    Views.ViewBase.currentView.apiDelete("WikiSuperAdmins", data, function (r) {
                        $(".item[data-uid=\"" + item.id + "\"]").remove();
                    });
                });
            });
            lg.generateList(admins);
        };
        WikiSuperAdminMgmt.prototype.getSearchBox = function (id, callback) {
            var config = new Common.UserSearchConfig();
            config.elementId = id;
            config.clearAfterSearch = true;
            config.endpoint = "FriendsSearch";
            var box = new Common.UserSearchBox(config);
            box.onUserSelected = function (user) {
                callback(user);
            };
        };
        WikiSuperAdminMgmt.prototype.regSearch = function () {
            var _this = this;
            this.getSearchBox("userCombo", function (user) {
                var data = {
                    id: user.friendId
                };
                Views.ViewBase.currentView.apiPost("WikiSuperAdmins", data, function (created) {
                    if (created) {
                        _this.getAdmins(function (admins) {
                            _this.genAdmins(admins);
                        });
                    }
                    else {
                        var id = new Common.InfoDialog();
                        id.create("User creation unsuccessful", "Maybe user already exists ?");
                    }
                });
            });
        };
        return WikiSuperAdminMgmt;
    }());
    Views.WikiSuperAdminMgmt = WikiSuperAdminMgmt;
    var WikiAdminTasks = (function () {
        function WikiAdminTasks($cont) {
            this.$cont = $cont;
        }
        WikiAdminTasks.prototype.init = function () {
            var _this = this;
            this.getTasks(function (tasks) {
                _this.genTasks(tasks);
            });
        };
        WikiAdminTasks.prototype.genTasks = function (tasks) {
            var lg = Common.ListGenerator.init(this.$cont.find(".sub-content"), "task-base-tmp");
            lg.evnt(".action-btn", function (e, $item, $target, item) {
                var name = $target.data("action");
                var id = $item.attr("id");
                var cd = new Common.ConfirmDialog();
                cd.create("Action confirmation", "Do you want to perform action '" + name + "' ?", "Cancel", "Execute", function () {
                    var data = {
                        action: name,
                        id: id
                    };
                    Views.ViewBase.currentView.apiPost("WikiAdminAction", data, function (r) {
                        if (r) {
                            $item.remove();
                        }
                    });
                });
            });
            lg.generateList(tasks);
        };
        WikiAdminTasks.prototype.getTasks = function (callback) {
            Views.ViewBase.currentView.apiGet("WikiAdminAction", [], function (tasks) {
                callback(tasks);
            });
        };
        return WikiAdminTasks;
    }());
    Views.WikiAdminTasks = WikiAdminTasks;
    var WikiAdminAddCity = (function () {
        function WikiAdminAddCity($cont) {
            this.$cont = $cont;
        }
        WikiAdminAddCity.prototype.init = function () {
            var _this = this;
            var tmp = Views.ViewBase.currentView.registerTemplate("add-city-tmp");
            var $l = $(tmp());
            this.$cont.find(".sub-content").html($l);
            $("#SendCity").click(function (e) {
                e.preventDefault();
                _this.createCity();
            });
            this.regSearchBox();
        };
        WikiAdminAddCity.prototype.regSearchBox = function () {
            var _this = this;
            var searchBox = new Common.GNOnlineSearchBox("gnCombo");
            searchBox.onSelected = function (city) { return _this.onCitySelected(city); };
        };
        WikiAdminAddCity.prototype.onCitySelected = function (city) {
            $("#txtGID").val(city.geonameId);
            $("#txtPopulation").val(city.population);
            $("#txtTitle").val(city.name);
            this.selectedCity = city;
        };
        WikiAdminAddCity.prototype.createCity = function () {
            var _this = this;
            if ($("#txtGID").val() === "") {
                return;
            }
            var dialog = new Common.ConfirmDialog();
            dialog.create("Add city", "Do you want to add the city ?", "Cancel", "Create", function () {
                var data = {
                    gid: _this.selectedCity.geonameId,
                    population: $("#txtPopulation").val(),
                    title: $("#txtTitle").val(),
                    countryCode: _this.selectedCity.countryCode
                };
                Views.ViewBase.currentView.apiPost("WikiCity", data, function (r) {
                    var id = new Common.InfoDialog();
                    if (r) {
                        id.create("The city added", "The city has been added");
                    }
                    else {
                        id.create("The city not added", "The city has NOT been added");
                    }
                });
            });
        };
        return WikiAdminAddCity;
    }());
    Views.WikiAdminAddCity = WikiAdminAddCity;
    var WikiPageSectionsAdmin = (function () {
        function WikiPageSectionsAdmin($cont) {
            this.$cont = $cont;
        }
        WikiPageSectionsAdmin.prototype.createSectionsTabs = function () {
            var _this = this;
            var tmp = Views.ViewBase.currentView.registerTemplate("sections-content-tmp");
            var $l = $(tmp());
            this.$cont.find(".sub-content").html($l);
            this.sectionsTab = new Common.Tabs(this.$cont.find(".sections-menu"), "entitySwitch");
            this.sectionsTab.addTab("entCity", "Cities", function () {
                _this.getSectionsMgmt("0", function (sections) {
                    _this.genSectionsTable(sections);
                });
            });
            this.sectionsTab.addTab("entCountry", "Countries", function () {
                _this.getSectionsMgmt("1", function (sections) {
                    _this.genSectionsTable(sections);
                });
            });
            this.sectionsTab.create();
        };
        WikiPageSectionsAdmin.prototype.regCreateNewSection = function () {
            var _this = this;
            var txtInput = $("#newSectionText");
            $("#newSectionBtn").click(function (e) {
                e.preventDefault();
                var txt = txtInput.val();
                if (txt.length > 0) {
                    var cd = new Common.ConfirmDialog();
                    cd.create("Do you want to create new section", "Do you want to create new section with name '" + txt + "'?", "Cancel", "Ok", function () {
                        var data = {
                            type: (_this.sectionsTab.activeTabId === "entCity") ? 0 : 1,
                            name: txt
                        };
                        Views.ViewBase.currentView.apiPost("WikiPageSection", data, function (r) {
                            txtInput.val("");
                            var t = (_this.sectionsTab.activeTabId === "entCity") ? "0" : "1";
                            _this.getSectionsMgmt(t, function (sections) {
                                _this.genSectionsTable(sections);
                            });
                        });
                    });
                }
            });
        };
        WikiPageSectionsAdmin.prototype.genSectionsTable = function (sections) {
            var _this = this;
            var lg = Common.ListGenerator.init(this.$cont.find("#sectionsTable"), "section-item-tmp");
            lg.clearCont = true;
            lg.evnt(".del-cross", function (e, $item, $target, item) {
                var pt = (_this.sectionsTab.activeTabId === "entCity") ? "0" : "1";
                var st = $item.data("t");
                var data = [["pt", pt], ["st", st]];
                var cd1 = new Common.ConfirmDialog();
                cd1.create("Deletion confirmation", "Do you really want to delete it ?", "Cancel", "Delete", function () {
                    var cd2 = new Common.ConfirmDialog();
                    cd2.create("Deletion confirmation", "Do you really want to delete section '" + st + "'", "Cancel", "Delete", function () {
                        Views.ViewBase.currentView.apiDelete("WikiPageSection", data, function (r) {
                            $("tr[data-t=\"" + st + "\"]").remove();
                        });
                    });
                });
            });
            lg.generateList(sections);
        };
        WikiPageSectionsAdmin.prototype.getSectionsMgmt = function (type, callback) {
            var data = [["type", type]];
            Views.ViewBase.currentView.apiGet("WikiPageSection", data, function (r) {
                callback(r);
            });
        };
        return WikiPageSectionsAdmin;
    }());
    Views.WikiPageSectionsAdmin = WikiPageSectionsAdmin;
})(Views || (Views = {}));
//# sourceMappingURL=NewAdminView.js.map