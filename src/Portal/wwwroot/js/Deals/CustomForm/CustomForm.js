var Planning;
(function (Planning) {
    var CustomForm = (function () {
        function CustomForm($cont, searchId) {
            this.searchId = searchId;
            this.dataLoader = new Planning.SearchDataLoader();
            this.$formCont = $cont.find(".cat-drop-cont .cont");
            this.create();
        }
        Object.defineProperty(CustomForm.prototype, "v", {
            get: function () {
                return Views.ViewBase.currentView;
            },
            enumerable: true,
            configurable: true
        });
        CustomForm.prototype.create = function () {
            var _this = this;
            this.getSearch(function () {
                _this.init();
            });
        };
        CustomForm.prototype.init = function () {
            if (this.search.started) {
                var t2 = this.v.registerTemplate("custom-setting-2-template");
                var context = {
                    customId: this.search.id
                };
                var $t2 = $(t2(context));
                this.$formCont.html($t2);
                this.initFreq();
                this.initAirTagger();
                this.initStandardAir();
                this.loadSearch2();
            }
            else {
                var t1 = this.v.registerTemplate("custom-setting-1-template");
                var $t1 = $(t1());
                this.$formCont.html($t1);
                this.initDaysRange();
                this.initDateRange();
                this.initDatesClosing();
                this.loadSearch1();
            }
        };
        CustomForm.prototype.getSearch = function (callback) {
            var _this = this;
            this.dataLoader.getSearch(this.searchId, function (search) {
                _this.search = search;
                callback();
            });
        };
        CustomForm.prototype.initDaysRange = function () {
            var _this = this;
            this.slider = new Planning.RangeSlider(this.$formCont.find(".days-range-cont"), "daysRange");
            this.slider.genSlider(1, 21);
            this.slider.onRangeChanged = function (from, to) {
                var caller = new Planning.PropsDataUpload(_this.searchId, "daysRange");
                caller.addVal("from", from);
                caller.addVal("to", to);
                caller.send();
            };
        };
        CustomForm.prototype.initDateRange = function () {
            var _this = this;
            var depOpts = { minDate: moment().add(1, "days").toDate() };
            this.dpDep = new Common.MyCalendar(this.$formCont.find(".dp-dep-cont"));
            this.dpDep.onChange = function (date) {
                _this.depDate = date;
                var md = TravelB.DateUtils.momentDateToMyDate(_this.depDate);
                var td = TravelB.DateUtils.myDateToTrans(md);
                var caller = new Planning.PropsDataUpload(_this.searchId, "dep");
                caller.setVal(td);
                caller.send();
            };
            this.dpArr = new Common.MyCalendar(this.$formCont.find(".dp-arr-cont"));
            this.dpArr.onChange = function (date) {
                _this.arrDate = date;
                var md = TravelB.DateUtils.momentDateToMyDate(_this.arrDate);
                var td = TravelB.DateUtils.myDateToTrans(md);
                var caller = new Planning.PropsDataUpload(_this.searchId, "arr");
                caller.setVal(td);
                caller.send();
            };
        };
        CustomForm.prototype.initDatesClosing = function () {
            var _this = this;
            this.$formCont.find(".finish-dates-btn").click(function (e) {
                e.preventDefault();
                _this.updateStarted(true, function () {
                    _this.create();
                });
            });
        };
        CustomForm.prototype.initFreq = function () {
            var _this = this;
            var items = [{ days: 1, text: "Daily" }, { days: 7, text: "Weekly" }, { days: 30, text: "Monthly" }];
            var $c = this.$formCont.find(".freq-cont .itbl");
            var lg = Common.ListGenerator.init($c, "freq-item-template");
            lg.evnt(".item", function (e, $item, $target, item) {
                _this.updateFreq(item.days, function () {
                    _this.setFreq(item.days);
                });
            });
            lg.generateList(items);
        };
        CustomForm.prototype.setFreq = function (days) {
            var $c = this.$formCont.find(".freq-cont");
            $c.find(".item").removeClass("active");
            var $item = $c.find("[data-d=\"" + days + "\"]");
            $item.addClass("active");
        };
        CustomForm.prototype.updateFreq = function (days, callback) {
            var pdu = new Planning.PropsDataUpload(this.searchId, "freq");
            pdu.setVal(days);
            pdu.send(function () {
                callback();
            });
        };
        CustomForm.prototype.updateStarted = function (started, callback) {
            var pdu = new Planning.PropsDataUpload(this.searchId, "started");
            pdu.setVal(started);
            pdu.send(function () {
                callback();
            });
        };
        CustomForm.prototype.initStandardAir = function () {
            var _this = this;
            var $cb = this.$formCont.find(".cb-standard");
            $cb.change(function () {
                var state = $cb.prop("checked");
                var caller = new Planning.PropsDataUpload(_this.searchId, "stdAir");
                caller.setVal(state);
                caller.send();
            });
        };
        CustomForm.prototype.loadSearch1 = function () {
            this.depDate = TravelB.DateUtils.myDateToMomentDate(this.search.deparature);
            this.arrDate = TravelB.DateUtils.myDateToMomentDate(this.search.arrival);
            this.dpDep.setDate(this.depDate);
            this.dpArr.setDate(this.arrDate);
            this.slider.setVals(this.search.daysFrom, this.search.daysTo);
        };
        CustomForm.prototype.loadSearch2 = function () {
            this.$formCont.find(".cb-standard").prop("checked", this.search.standardAirs);
            var airs = this.getAirs(this.search);
            this.airTagger.setSelectedItems(airs);
            this.setFreq(this.search.freq);
        };
        CustomForm.prototype.getAirs = function (search) {
            var si = [];
            search.customAirs.forEach(function (a) {
                si.push({ kind: "airport", value: a.origId, text: a.text });
            });
            return si;
        };
        CustomForm.prototype.initAirTagger = function () {
            var _this = this;
            var config = new Planning.TaggingFieldConfig();
            config.containerId = "airTagger_" + this.searchId;
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
        return CustomForm;
    }());
    Planning.CustomForm = CustomForm;
})(Planning || (Planning = {}));
//# sourceMappingURL=CustomForm.js.map