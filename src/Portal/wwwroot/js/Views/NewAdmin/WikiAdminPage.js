var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Views;
(function (Views) {
    var WikiAdminPage = (function (_super) {
        __extends(WikiAdminPage, _super);
        function WikiAdminPage(v) {
            _super.call(this, v, "menu-content-tmp");
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
            if (this.v.isAdminOfSomething) {
                tabs.addTab("wikiTasks", "Tasks", function () {
                    var fnc = new WikiAdminTasks(_this.$cont);
                    fnc.init();
                });
            }
            if (this.v.isMasterAdmin) {
                tabs.addTab("wikiSections", "Sections", function () {
                    var fnc = new WikiPageSectionsAdmin(_this.$cont);
                    fnc.createSectionsTabs();
                    fnc.regCreateNewSection();
                });
            }
            if (this.v.isSuperAdmin) {
                tabs.addTab("wikiNewCity", "Add new city", function () {
                    var fnc = new WikiAdminAddCity(_this.$cont);
                    fnc.init();
                });
            }
            if (this.v.isMasterAdmin) {
                tabs.addTab("wikiSuperAdmins", "Super admins", function () {
                    var fnc = new WikiSuperAdminMgmt(_this.$cont);
                    fnc.init();
                });
            }
            if (this.v.isMasterAdmin || this.v.isSuperAdmin) {
                tabs.addTab("wikiArticleAdmins", "Article admins", function () {
                    var fnc = new WikiArticlesAdminMgmt(_this.$cont);
                    fnc.init();
                });
            }
            tabs.create();
        };
        return WikiAdminPage;
    }(Views.AdminPageBase));
    Views.WikiAdminPage = WikiAdminPage;
    var WikiArticlesAdminMgmt = (function () {
        function WikiArticlesAdminMgmt($cont) {
            this.$cont = $cont;
        }
        WikiArticlesAdminMgmt.prototype.init = function () {
            var _this = this;
            var tmp = Views.ViewBase.currentView.registerTemplate("article-admins-mgmt-tmp");
            var $l = $(tmp());
            this.$cont.find(".sub-content").html($l);
            this.regUserSearch();
            this.getUsers(function (users) {
                _this.genUsers(users);
            });
        };
        WikiArticlesAdminMgmt.prototype.getSearchBox = function (id, callback) {
            var config = new Common.UserSearchConfig();
            config.elementId = id;
            config.clearAfterSearch = true;
            config.endpoint = "FriendsSearch";
            var box = new Common.UserSearchBox(config);
            box.onUserSelected = function (user) {
                callback(user);
            };
        };
        WikiArticlesAdminMgmt.prototype.getUsers = function (callback) {
            Views.ViewBase.currentView.apiGet("WikiArticlesPermissions", [], function (users) {
                callback(users);
            });
        };
        WikiArticlesAdminMgmt.prototype.genUsers = function (users) {
            var _this = this;
            var lg = Common.ListGenerator.init(this.$cont.find(".users-cont"), "article-admin-item-tmp");
            lg.clearCont = true;
            lg.evnt(".del", function (e, $item, $target, item) {
                var data = [["id", item.id]];
                var cd = new Common.ConfirmDialog();
                cd.create("Delete", "Do you really want to remove the user?", "Cancel", "Delete", function () {
                    Views.ViewBase.currentView.apiDelete("WikiArticlesPermissions", data, function () {
                        $item.remove();
                    });
                });
            });
            lg.onItemAppended = function ($item, item) {
                var $combo = $item.find(".article-combo");
                _this.initPlaceCombo($combo, item.id);
                _this.getArticles(item.id, function (articles) {
                    _this.genArticles(articles, $item);
                });
            };
            lg.generateList(users);
        };
        WikiArticlesAdminMgmt.prototype.genArticles = function (articles, $item) {
            var lgp = Common.ListGenerator.init($item.find(".places"), "place-item-tmp");
            lgp.clearCont = true;
            lgp.evnt(".del", function (e, $item, $target, item) {
                var uid = $item.closest(".user-item").data("uid");
                var data = [["articleId", item.id], ["userId", uid]];
                var cd = new Common.ConfirmDialog();
                cd.create("Remove", "Do you really want to remove permissions?", "Cancel", "Remove", function () {
                    Views.ViewBase.currentView.apiDelete("WikiArticlePermissions", data, function () {
                        $item.remove();
                    });
                });
            });
            lgp.generateList(articles);
        };
        WikiArticlesAdminMgmt.prototype.getArticles = function (id, callback) {
            var data = [["id", id]];
            Views.ViewBase.currentView.apiGet("WikiArticlePermissions", data, function (articles) {
                callback(articles);
            });
        };
        WikiArticlesAdminMgmt.prototype.regUserSearch = function () {
            var _this = this;
            this.getSearchBox("userCombo", function (user) {
                var data = { id: user.friendId };
                Views.ViewBase.currentView.apiPost("WikiArticlesPermissions", data, function (created) {
                    if (created) {
                        _this.getUsers(function (users) {
                            _this.genUsers(users);
                        });
                    }
                    else {
                        var id = new Common.InfoDialog();
                        id.create("User creation unsuccessful", "Maybe user already exists ?");
                    }
                });
            });
        };
        WikiArticlesAdminMgmt.prototype.initPlaceCombo = function ($combo, userId) {
            var _this = this;
            var combo = new Views.WikiSearchCombo();
            combo.initElement($combo);
            combo.selectionCallback = function ($a) {
                var articleId = $a.data("articleid");
                var data = {
                    userId: userId,
                    articleId: articleId
                };
                Views.ViewBase.currentView.apiPost("WikiArticlePermissions", data, function (r) {
                    var $cont = $combo.closest(".user-item");
                    _this.getArticles(userId, function (articles) {
                        _this.genArticles(articles, $cont);
                    });
                });
            };
        };
        return WikiArticlesAdminMgmt;
    }());
    Views.WikiArticlesAdminMgmt = WikiArticlesAdminMgmt;
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
            this.sectionsTab.addTab("entCountry", "Countries", function () {
                _this.getSectionsMgmt("1", function (sections) {
                    _this.genSectionsTable(sections);
                });
            });
            this.sectionsTab.addTab("entCity", "Cities", function () {
                _this.getSectionsMgmt("0", function (sections) {
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
//# sourceMappingURL=WikiAdminPage.js.map