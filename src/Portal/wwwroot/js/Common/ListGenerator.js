var Common;
(function (Common) {
    var ListGeneratorTest = (function () {
        function ListGeneratorTest() {
        }
        ListGeneratorTest.prototype.test = function (myItems) {
            var lg = ListGenerator.init($("#theCont"), "myItem-template");
            lg.customMapping = function (item) {
                return {
                    asdf: item.a,
                    asddd: item.b
                };
            };
            lg.evnt($(".delete"), function (e, $item, $target) {
            });
            lg.evnt($(".add"), function (e, $item, $target) {
            });
            lg.generateList(myItems);
        };
        return ListGeneratorTest;
    }());
    Common.ListGeneratorTest = ListGeneratorTest;
    var ListGenerator = (function () {
        function ListGenerator() {
            this.clearCont = false;
            this.customMapping = null;
            this.appendStyle = "append";
            this.$items = [];
        }
        ListGenerator.init = function ($cont, itemTemplateName) {
            var lg = new ListGenerator();
            lg.$cont = $cont;
            lg.itemTemplateName = itemTemplateName;
            lg.eventHandlers = [];
            lg.itemTemplate = Views.ViewBase.currentView.registerTemplate(lg.itemTemplateName);
            return lg;
        };
        ListGenerator.prototype.destroy = function () {
            this.$items.forEach(function ($i) {
                $i.remove();
            });
        };
        ListGenerator.prototype.evnt = function (selector, handler) {
            this.eventHandlers.push(new EventHandler(selector, handler));
        };
        ListGenerator.prototype.generateList = function (items) {
            var _this = this;
            if (this.clearCont) {
                this.$cont.empty();
            }
            var itemNo = 0;
            items.forEach(function (item) {
                var $item = _this.generateItem(item);
                _this.$items.push($item);
                $item.data("no", itemNo);
                itemNo++;
            });
        };
        ListGenerator.prototype.generateItem = function (item) {
            var context = item;
            if (this.customMapping) {
                context = this.customMapping(item);
            }
            var $item = $(this.itemTemplate(context));
            this.eventHandlers.forEach(function (eh) {
                $item.find(eh.selector).on(eh.event, function (e) {
                    e.preventDefault();
                    var $target = $(e.delegateTarget);
                    eh.handler(e, $item, $target, item);
                });
            });
            if (this.appendStyle === "append") {
                this.$cont.append($item);
            }
            else if (this.appendStyle === "prepend") {
                this.$cont.prepend($item);
            }
            else if (this.appendStyle === "after") {
                this.$cont.after($item);
            }
            if (this.onItemAppended) {
                this.onItemAppended($item, item);
            }
            return $item;
        };
        return ListGenerator;
    }());
    Common.ListGenerator = ListGenerator;
    var EventHandler = (function () {
        function EventHandler(selector, handler) {
            this.event = "click";
            this.selector = selector;
            this.handler = handler;
        }
        return EventHandler;
    }());
    Common.EventHandler = EventHandler;
})(Common || (Common = {}));
//# sourceMappingURL=ListGenerator.js.map