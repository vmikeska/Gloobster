var Common;
(function (Common) {
    var DropDown = (function () {
        function DropDown() {
        }
        DropDown.registerDropDown = function ($dd) {
            $dd.find('.selected').on('click', function (e) {
                var selected = $(e.target);
                var dropdown = selected.closest('.dropdown');
                var input = selected.siblings('input');
                DropDown.hideOthers(dropdown);
                dropdown.toggleClass('dropdown-open');
                if (!dropdown.hasClass('with-checkbox')) {
                    dropdown.find('li:not(.disabled)').unbind('click').click(function (e) {
                        dropdown.removeClass('dropdown-open');
                        var $li = $(e.target);
                        selected.html($li.html());
                        var selValue = $li.is('[data-value]') ? $li.data('value') : $li.html();
                        input.val(selValue);
                        input.trigger('change');
                    });
                }
            });
        };
        DropDown.hideOthers = function (hovered) {
            var $items = $('.dropdown').not(hovered);
            $items.each(function (i, el) {
                $(el).removeClass('dropdown-open');
            });
        };
        DropDown.init = function () {
            var _this = this;
            $(document).ready(function () {
                $(".dropdown").toArray().forEach(function (c) {
                    var $c = $(c);
                    _this.registerDropDown($c);
                });
            });
        };
        return DropDown;
    }());
    Common.DropDown = DropDown;
})(Common || (Common = {}));
//# sourceMappingURL=DropDown.js.map