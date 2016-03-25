var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Views;
(function (Views) {
    var WikiAdminView = (function (_super) {
        __extends(WikiAdminView, _super);
        function WikiAdminView() {
            var _this = this;
            _super.call(this);
            this.regActionButtons();
            this.regSearchBox();
            $("#AddCity").click(function (e) {
                e.preventDefault();
                $("#addCityForm").toggle();
            });
            $("#SendCity").click(function (e) {
                e.preventDefault();
                _this.createCity();
            });
        }
        WikiAdminView.prototype.regSearchBox = function () {
            var _this = this;
            var searchBox = new Common.GNOnlineSearchBox("gnCombo");
            searchBox.onSelected = function (city) { return _this.onCitySelected(city); };
        };
        WikiAdminView.prototype.onCitySelected = function (city) {
            $("#txtGID").val(city.geonameId);
            $("#txtPopulation").val(city.population);
            $("#txtTitle").val(city.name);
            this.selectedCity = city;
        };
        WikiAdminView.prototype.createCity = function () {
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
                _this.apiPost("WikiCity", data, function (r) {
                    $("#addCityForm").hide();
                });
            });
        };
        WikiAdminView.prototype.regActionButtons = function () {
            var _this = this;
            $(".actionButton").click(function (e) {
                e.preventDefault();
                var $target = $(e.target);
                var name = $target.data("action");
                var $cont = $target.closest(".task");
                var id = $cont.attr("id");
                var data = {
                    action: name,
                    id: id
                };
                _this.apiPost("AdminAction", data, function (r) {
                    if (r) {
                        $("#" + id).remove();
                    }
                });
            });
        };
        return WikiAdminView;
    })(Views.ViewBase);
    Views.WikiAdminView = WikiAdminView;
})(Views || (Views = {}));
//# sourceMappingURL=WikiAdminView.js.map