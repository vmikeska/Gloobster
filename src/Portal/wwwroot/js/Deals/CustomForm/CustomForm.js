var Planning;
(function (Planning) {
    var CustomFrom = (function () {
        function CustomFrom(v) {
            this.v = v;
            this.create();
            this.dataLoader = new Planning.SearchDataLoader();
            this.menu = new Planning.CustomMenu(this.$form.find(".searches-menu"));
        }
        CustomFrom.prototype.initDaysRange = function () {
            var _this = this;
            this.slider = new Planning.RangeSlider(this.$form.find(".days-range-cont"), "daysRange");
            this.slider.genSlider(1, 21);
            this.slider.onRangeChanged = function (from, to) {
                var caller = new Planning.PropsDataUpload(_this.searchId, "daysRange");
                caller.addVal("from", from);
                caller.addVal("to", to);
                caller.send();
            };
        };
        CustomFrom.prototype.datepicker = function ($dp, opts, callback) {
            if (opts === void 0) { opts = {}; }
            $dp.datepicker(opts);
            $dp.change(function (e) {
                var $this = $(e.target);
                var date = $this.datepicker("getDate");
                callback(date);
            });
        };
        CustomFrom.prototype.create = function () {
            var tmp = this.v.registerTemplate("custom-template");
            this.$form = $(tmp());
            $("#tabContent").html(this.$form);
            this.$dpDep = this.$form.find("#dpDep");
            this.$dpArr = this.$form.find("#dpArr");
            this.initShowHide();
        };
        CustomFrom.prototype.initShowHide = function () {
            var _this = this;
            var $cont = $(".form-cont");
            var $btn = this.$form.find(".show-hide");
            this.setShowHideBtn($cont, $btn, false);
            $btn.click(function (e) {
                e.preventDefault();
                var isHidden = $cont.hasClass("hidden");
                _this.setShowHideBtn($cont, $btn, !isHidden);
            });
        };
        CustomFrom.prototype.setShowHideBtn = function ($cont, $btn, hide) {
            if (hide) {
                $btn.html("show");
                $cont.addClass("hidden");
            }
            else {
                $btn.html("hide");
                $cont.removeClass("hidden");
            }
        };
        CustomFrom.prototype.initFreq = function () {
            var _this = this;
            var items = [{ days: 1, text: "Daily" }, { days: 7, text: "Weekly" }, { days: 30, text: "Monthly" }];
            var $c = this.$form.find(".freq-cont .itbl");
            var lg = Common.ListGenerator.init($c, "freq-item-template");
            lg.evnt(".item", function (e, $item, $target, item) {
                _this.updateFreq(item.days, function () {
                    _this.setFreq(item.days);
                });
            });
            lg.generateList(items);
        };
        CustomFrom.prototype.updateFreq = function (days, callback) {
            var pdu = new Planning.PropsDataUpload(this.searchId, "freq");
            pdu.setVal(days);
            pdu.send(function () {
                callback();
            });
        };
        CustomFrom.prototype.setFreq = function (days) {
            var $c = this.$form.find(".freq-cont");
            $c.find(".item").removeClass("active");
            var $item = $c.find("[data-d=\"" + days + "\"]");
            $item.addClass("active");
        };
        CustomFrom.prototype.initDateRange = function () {
            var _this = this;
            var depOpts = { minDate: moment().add(1, "days").toDate() };
            this.datepicker(this.$dpDep, depOpts, function (date) {
                var md = TravelB.DateUtils.jsDateToMyDate(date);
                var td = TravelB.DateUtils.myDateToTrans(md);
                var caller = new Planning.PropsDataUpload(_this.searchId, "dep");
                caller.setVal(td);
                caller.send();
            });
            this.datepicker(this.$dpArr, {}, function (date) {
                var md = TravelB.DateUtils.jsDateToMyDate(date);
                var td = TravelB.DateUtils.myDateToTrans(md);
                var caller = new Planning.PropsDataUpload(_this.searchId, "arr");
                caller.setVal(td);
                caller.send();
            });
        };
        CustomFrom.prototype.initStandardAir = function () {
            var _this = this;
            var $cb = this.$form.find("#cbStandard");
            $cb.change(function () {
                var state = $cb.prop("checked");
                var caller = new Planning.PropsDataUpload(_this.searchId, "stdAir");
                caller.setVal(state);
                caller.send();
            });
        };
        CustomFrom.prototype.init = function (callback) {
            var _this = this;
            this.dataLoader.getInitData(function (data) {
                _this.searchId = data.first.id;
                _this.menu.init(data.headers);
                _this.initFormControls();
                _this.loadSearch(data.first);
                callback();
            });
            this.menu.onSearchChange = function (id) {
                _this.dataLoader.getSearch(id, function (search) {
                    _this.loadSearch(search);
                    _this.searchId = id;
                    _this.v.planningMap.loadCategory(PlanningType.Custom);
                });
            };
            this.$form.find(".adder").click(function (e) {
                e.preventDefault();
                _this.dataLoader.createNewSearch(function (search) {
                    _this.menu.addItem(search.id, search.name);
                    _this.loadSearch(search);
                    _this.searchId = search.id;
                });
            });
        };
        CustomFrom.prototype.initFormControls = function () {
            this.initDaysRange();
            this.initAirTagger();
            this.initDateRange();
            this.initStandardAir();
            this.initFreq();
        };
        CustomFrom.prototype.loadSearch = function (search) {
            this.$form.find("#cbStandard").prop("checked", search.standardAirs);
            var depDate = TravelB.DateUtils.myDateToJsDate(search.deparature);
            var arrDate = TravelB.DateUtils.myDateToJsDate(search.arrival);
            this.$dpDep.datepicker("setDate", depDate);
            this.$dpArr.datepicker("setDate", arrDate);
            this.slider.setVals(search.daysFrom, search.daysTo);
            var airs = this.getAirs(search);
            this.airTagger.setSelectedItems(airs);
            this.setFreq(search.freq);
        };
        CustomFrom.prototype.getAirs = function (search) {
            var si = [];
            search.customAirs.forEach(function (a) {
                si.push({ kind: "airport", value: a.origId, text: a.text });
            });
            return si;
        };
        CustomFrom.prototype.initAirTagger = function () {
            var _this = this;
            var config = new Planning.TaggingFieldConfig();
            config.containerId = "airTagger";
            config.localValues = false;
            config.listSource = "TaggerAirports";
            config.clientMatch = false;
            this.airTagger = new Planning.TaggingField(config);
            this.airTagger.onItemClickedCustom = function ($target, callback) {
                var val = $target.data("vl");
                var kind = $target.data("kd");
                var text = $target.text();
                var pdu = new Planning.PropsDataUpload(_this.searchId, "custAir");
                pdu.addVal("text", text);
                pdu.addVal("origId", val);
                pdu.send(function () {
                    callback();
                });
            };
            this.airTagger.onDeleteCustom = function (val, callback) {
                _this.dataLoader.removeAirport(_this.searchId, val, function () {
                    callback();
                });
            };
        };
        return CustomFrom;
    }());
    Planning.CustomFrom = CustomFrom;
})(Planning || (Planning = {}));
//# sourceMappingURL=CustomForm.js.map