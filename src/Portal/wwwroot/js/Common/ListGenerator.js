var Common;
(function (Common) {
    var ListGeneratorTest = (function () {
        function ListGeneratorTest() {
        }
        ListGeneratorTest.prototype.test = function (myItems) {
            var lg = ListGenerator.init($("#theCont"), "myItem-template");
            lg.config.customMapping = function (item) {
                return {
                    asdf: item.a,
                    asddd: item.b
                };
            };
            lg.config.evnt($(".delete"), function (e, $item, $target) {
            });
            lg.config.evnt($(".add"), function (e, $item, $target) {
            });
            lg.generateList(myItems);
        };
        return ListGeneratorTest;
    }());
    Common.ListGeneratorTest = ListGeneratorTest;
    var ListGenerator = (function () {
        function ListGenerator() {
        }
        ListGenerator.init = function ($cont, itemTemplateName) {
            var lg = new ListGenerator();
            lg.config = new ListGeneratorConfig();
            lg.config.$cont = $cont;
            lg.config.itemTemplateName = itemTemplateName;
            lg.itemTemplate = Views.ViewBase.currentView.registerTemplate(lg.config.itemTemplateName);
            return lg;
        };
        ListGenerator.prototype.generateList = function (items) {
            var _this = this;
            if (this.config.clearCont) {
                this.config.$cont.empty();
            }
            items.forEach(function (item) {
                _this.generateItem(item);
            });
        };
        ListGenerator.prototype.generateItem = function (item) {
            var context = item;
            if (this.config.customMapping) {
                context = this.config.customMapping(item);
            }
            var $item = $(this.itemTemplate(context));
            this.config.eventHandlers.forEach(function (eh) {
                eh.$selector.on(eh.event, function (e) {
                    e.preventDefault();
                    var $target = $(e.target);
                    eh.handler(e, $item, $target);
                });
            });
            this.config.$cont.append($item);
        };
        return ListGenerator;
    }());
    Common.ListGenerator = ListGenerator;
    var ListGeneratorConfig = (function () {
        function ListGeneratorConfig() {
            this.clearCont = false;
            this.customMapping = null;
        }
        ListGeneratorConfig.prototype.evnt = function ($selector, handler) {
            this.eventHandlers.push(new EventHandler($selector, handler));
        };
        return ListGeneratorConfig;
    }());
    Common.ListGeneratorConfig = ListGeneratorConfig;
    var EventHandler = (function () {
        function EventHandler($selector, handler) {
            this.event = "click";
            this.$selector = $selector;
            this.handler = handler;
        }
        return EventHandler;
    }());
    Common.EventHandler = EventHandler;
})(Common || (Common = {}));
//# sourceMappingURL=ListGenerator.js.map