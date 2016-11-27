var Planning;
(function (Planning) {
    var PropsDataUpload = (function () {
        function PropsDataUpload(searchId, propName) {
            this.values = [];
            this.searchId = searchId;
            this.propName = propName;
        }
        PropsDataUpload.prototype.setVal = function (val) {
            this.value = val;
        };
        PropsDataUpload.prototype.addVal = function (name, val) {
            this.values.push({ name: name, val: val });
        };
        PropsDataUpload.prototype.send = function (callback) {
            if (callback === void 0) { callback = null; }
            var req = {
                id: this.searchId,
                name: this.propName,
                value: this.value,
                values: this.values
            };
            Views.ViewBase.currentView.apiPut("CustomSearch", req, function (res) {
                if (callback) {
                    callback(res);
                }
            });
        };
        return PropsDataUpload;
    }());
    Planning.PropsDataUpload = PropsDataUpload;
    var SearchDataLoader = (function () {
        function SearchDataLoader() {
        }
        SearchDataLoader.prototype.getInitData = function (callback) {
            var prms = [["actionName", "init"]];
            Views.ViewBase.currentView.apiGet("CustomSearch", prms, function (res) {
                callback(res);
            });
        };
        SearchDataLoader.prototype.getSearch = function (id, callback) {
            var prms = [["actionName", "search"], ["id", id]];
            Views.ViewBase.currentView.apiGet("CustomSearch", prms, function (res) {
                callback(res);
            });
        };
        SearchDataLoader.prototype.createNewSearch = function (callback) {
            var data = {
                actionName: "new"
            };
            Views.ViewBase.currentView.apiPost("CustomSearch", data, function (res) {
                callback(res);
            });
        };
        SearchDataLoader.prototype.deleteSearch = function (id, callback) {
            Views.ViewBase.currentView.apiDelete("CustomSearch", [["actionName", "search"], ["id", id]], function (res) {
                callback(res);
            });
        };
        SearchDataLoader.prototype.removeAirport = function (searchId, origId, callback) {
            var prms = [["actionName", "air"], ["id", searchId], ["paramId", origId]];
            Views.ViewBase.currentView.apiDelete("CustomSearch", prms, function (res) {
                callback(res);
            });
        };
        return SearchDataLoader;
    }());
    Planning.SearchDataLoader = SearchDataLoader;
    var CustomMenu = (function () {
        function CustomMenu($cont) {
            this.actCls = "state-active";
            this.dataLoader = new SearchDataLoader();
            this.$cont = $cont;
        }
        CustomMenu.prototype.addItem = function (id, name) {
            this.headers.push({ id: id, name: name });
            this.init(this.headers);
        };
        CustomMenu.prototype.init = function (headers) {
            var _this = this;
            this.headers = headers;
            this.$cont.find(".item").remove();
            var lg = Common.ListGenerator.init(this.$cont.find(".adder"), "custom-menu-btn-template");
            lg.appendStyle = "before";
            var isFirst = true;
            lg.activeItem = function () {
                var obj = {
                    isActive: isFirst,
                    cls: _this.actCls
                };
                isFirst = false;
                return obj;
            };
            lg.evnt(null, function (e, $item, $target, item) {
                _this.itemClicked($item);
            });
            lg.evnt(".delete", function (e, $item, $target, item) {
                _this.delClicked(item.id);
            });
            lg.evnt(".edit", function (e, $item, $target, item) {
                _this.editClicked($item);
            });
            lg.evnt(".edit-save", function (e, $item, $target, item) {
                _this.saveClicked($item);
            });
            lg.evnt(".name-edit", function (e, $item, $target, item) {
                _this.keyPressed(e, $item);
            })
                .setEvent("keyup");
            lg.generateList(headers);
        };
        CustomMenu.prototype.keyPressed = function (e, $item) {
            if (e.keyCode === 13) {
                this.saveClicked($item);
            }
        };
        CustomMenu.prototype.saveClicked = function ($item) {
            var id = $item.data("id");
            var name = $item.find(".name-edit").val();
            var header = _.find(this.headers, function (h) { return h.id === id; });
            header.name = name;
            var pdu = new PropsDataUpload(id, "name");
            pdu.setVal(name);
            pdu.send(function () {
                $item.find(".name-txt").html(name);
                $item.removeClass("state-editing");
                $item.addClass("state-active");
            });
        };
        CustomMenu.prototype.editClicked = function ($item) {
            $item.removeClass("state-active");
            $item.addClass("state-editing");
        };
        CustomMenu.prototype.delClicked = function (id) {
            var _this = this;
            var cd = new Common.ConfirmDialog();
            cd.create("Search removal", "Do you want to remove the search?", "Cancel", "Delete", function () {
                _this.dataLoader.deleteSearch(id, function () {
                    $("#" + id).remove();
                });
            });
        };
        CustomMenu.prototype.itemClicked = function ($item) {
            var id = $item.data("id");
            var $items = this.$cont.find(".item");
            $items.removeClass(this.actCls);
            $item.addClass(this.actCls);
            if (this.onSearchChange) {
                this.onSearchChange(id);
            }
        };
        return CustomMenu;
    }());
    Planning.CustomMenu = CustomMenu;
    var CustomFrom = (function () {
        function CustomFrom(v) {
            this.v = v;
            this.create();
            this.dataLoader = new SearchDataLoader();
            this.menu = new CustomMenu(this.$form.find(".searches-menu"));
            this.init();
        }
        CustomFrom.prototype.initDaysRange = function () {
            var _this = this;
            this.slider = new Planning.RangeSlider(this.$form.find(".days-range-cont"), "daysRange");
            this.slider.genSlider(1, 21);
            this.slider.onRangeChanged = function (from, to) {
                var caller = new PropsDataUpload(_this.searchId, "daysRange");
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
            var pdu = new PropsDataUpload(this.searchId, "freq");
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
                var caller = new PropsDataUpload(_this.searchId, "dep");
                caller.setVal(td);
                caller.send();
            });
            this.datepicker(this.$dpArr, {}, function (date) {
                var md = TravelB.DateUtils.jsDateToMyDate(date);
                var td = TravelB.DateUtils.myDateToTrans(md);
                var caller = new PropsDataUpload(_this.searchId, "arr");
                caller.setVal(td);
                caller.send();
            });
        };
        CustomFrom.prototype.initStandardAir = function () {
            var _this = this;
            var $cb = this.$form.find("#cbStandard");
            $cb.change(function () {
                var state = $cb.prop("checked");
                var caller = new PropsDataUpload(_this.searchId, "stdAir");
                caller.setVal(state);
                caller.send();
            });
        };
        CustomFrom.prototype.init = function () {
            var _this = this;
            this.dataLoader.getInitData(function (data) {
                _this.searchId = data.first.id;
                _this.menu.init(data.headers);
                _this.initFormControls();
                _this.loadSearch(data.first);
            });
            this.menu.onSearchChange = function (id) {
                _this.dataLoader.getSearch(id, function (search) {
                    _this.loadSearch(search);
                    _this.searchId = id;
                });
            };
            this.$form.find(".adder").click(function (e) {
                e.preventDefault();
                _this.dataLoader.createNewSearch(function (search) {
                    _this.menu.addItem(search.id, search.name);
                    _this.loadSearch(search);
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
                var pdu = new PropsDataUpload(_this.searchId, "custAir");
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