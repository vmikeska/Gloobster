var Planning;
(function (Planning) {
    var CustomPageSetter = (function () {
        function CustomPageSetter(v) {
            this.v = v;
        }
        CustomPageSetter.prototype.setConnections = function (conns) {
        };
        CustomPageSetter.prototype.init = function (callback) {
            this.customForm = new Planning.CustomFrom(this.v);
            this.customForm.init(function () {
                callback();
            });
        };
        CustomPageSetter.prototype.getCustomId = function () {
            return this.customForm.searchId;
        };
        return CustomPageSetter;
    }());
    Planning.CustomPageSetter = CustomPageSetter;
})(Planning || (Planning = {}));
//# sourceMappingURL=CustomPageSetter.js.map