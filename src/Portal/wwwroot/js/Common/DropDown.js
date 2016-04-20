var Common;
(function (Common) {
    var DropDown = (function () {
        function DropDown() {
        }
        //https://github.com/jquery/PEP
        DropDown.prototype.initBody = function () {
            //$('.dropdown .selected').unbind();
            //$('.dropdown .inputed').unbind();
            //  $('.dropdown .selected').on('pointerdown', (e) => {
            //   var selected = $(e.target);
            //   var dropdown = selected.closest('.dropdown');
            //	var input = selected.siblings('input');
            //	this.hideOthers(dropdown);
            //	dropdown.toggleClass('dropdown-open');
            //   if (!dropdown.hasClass('with-checkbox')) {
            //    dropdown.find('li:not(.disabled)').unbind('click').click(() => {
            //	    dropdown.removeClass('dropdown-open');
            //			selected.html(selected.html());
            //			input.val(selected.is('[data-value]') ? selected.data('value') : selected.html()).trigger('change');
            //    });
            //   }
            //  });
            //  $(document).on('keypress click', '.dropdown .inputed', (e) => {	   
            //   var inputed = $(e.target);
            //	var dropdown = inputed.closest('.dropdown');
            //	dropdown.addClass('dropdown-open');
            //   if (!dropdown.hasClass('with-checkbox')) {
            //    dropdown.find('li:not(.disabled)').unbind('click').click(() => {
            //	    dropdown.removeClass('dropdown-open');
            //	    inputed.val(inputed.is('[data-value]') ? inputed.data('value') : inputed.html()).trigger('change');
            //    });
            //   }
            //  });
        };
        DropDown.prototype.hideOthers = function (hovered) {
            var $items = $('.dropdown').not(hovered);
            $items.each(function (i, el) {
                $(el).removeClass('dropdown-open');
            });
        };
        DropDown.prototype.init = function () {
            var _this = this;
            $(document).ready(function () {
                _this.initBody();
            });
        };
        return DropDown;
    })();
    Common.DropDown = DropDown;
})(Common || (Common = {}));
//# sourceMappingURL=DropDown.js.map