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
            tabs.addTab("wikiSections", "Sections management", function () {
                _this.createSectionsTabs();
                _this.regCreateNewSection();
            });
            tabs.addTab("wikiSuperAdmins", "SuperAdmins management", function () {
            });
            tabs.create();
        };
        WikiAdminPage.prototype.createSectionsTabs = function () {
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
        WikiAdminPage.prototype.regCreateNewSection = function () {
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
        WikiAdminPage.prototype.genSectionsTable = function (sections) {
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
        WikiAdminPage.prototype.getSectionsMgmt = function (type, callback) {
            var data = [["type", type]];
            Views.ViewBase.currentView.apiGet("WikiPageSection", data, function (r) {
                callback(r);
            });
        };
        return WikiAdminPage;
    }(AdminPageBase));
    Views.WikiAdminPage = WikiAdminPage;
})(Views || (Views = {}));
//# sourceMappingURL=NewAdminView.js.map