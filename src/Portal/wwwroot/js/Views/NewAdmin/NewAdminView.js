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
            if (this.isMasterAdmin || this.isSuperAdmin || this.isAdminOfSomething) {
                tabs.addTab("wikiTab", "WIKI", function () {
                    _this.currentPage = new Views.WikiAdminPage(_this);
                });
            }
            if (this.isMasterAdmin) {
                tabs.addTab("quizTab", "Quiz", function () {
                    _this.currentPage = new Views.QuizAdminPage(_this);
                });
            }
            tabs.create();
        };
        return NewAdminView;
    }(Views.ViewBase));
    Views.NewAdminView = NewAdminView;
    var AdminPageBase = (function () {
        function AdminPageBase(v, layoutTmpName) {
            if (layoutTmpName === void 0) { layoutTmpName = null; }
            this.v = v;
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
})(Views || (Views = {}));
//# sourceMappingURL=NewAdminView.js.map