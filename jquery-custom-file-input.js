/**
 * Custom File Input Plugin Plugin home:
 * http://plugins.jquery.com/project/custom-file Source:
 * http://www.daimi.au.dk/~u061768/jquery-custom-file-input.js Author: mafintosh
 * LICENSE: Currently unknown but assuming GPL / MIT
 */

jQuery.fn.choose = function(f) {
    $(this).bind('choose', f);
};

jQuery.fn.file = function() {
    var zIndex = arguments[0].zIndex;
    var fileInput = arguments[0].fileInput;
    var overlayId = arguments[0].overlayId;
    var hiddenDivId = arguments[0].hiddenDivId;
    var tabIndex = arguments[0].tabIndex;

    return this.each(function() {
        var btn = $(this);
        var pos = btn.offset();
        var width = parseNumber(btn.css("padding-left")) + btn.width() + parseNumber(btn.css("padding-right"));
        var height = parseNumber(btn.css("padding-top")) + btn.height() + parseNumber(btn.css("padding-bottom"));

        function update() {
            pos = btn.offset();
            file.css({
                'top' : pos.top,
                'left' : pos.left,
                'width' : width,
                'height' : height
            });
        }

        btn.mouseover(update);

        var hidden = $('<div></div>').attr("id", hiddenDivId).css({
            'display' : 'none'
        }).appendTo('body');

        var file = $('<div><form></form></div>').appendTo('body').css({
            'position' : 'absolute',
            'overflow' : 'hidden',
            '-moz-opacity' : '0',
            'filter' : 'alpha(opacity: 0)',
            'opacity' : '0',
            'cursor' : 'pointer',
            'z-index' : zIndex
        });
        file.attr("id", overlayId);

        var form = file.find('form');
        form.css({
            'position' : 'relative',
            'float' : 'right'
        });
        var input = form.find('input');
        input.css({
            'position' : 'relative',
            'float' : 'right'
        });
        btn.attr("tabindex", "-1");

        function reset() {
            var input = $('<input type="file" multiple>').appendTo(form);
            input.attr("id", fileInput);
            input.attr("name", fileInput);
            input.attr("tabindex", tabIndex);
            input.focus(function() {
                btn.trigger("mouseover");
            });
            input.blur(function() {
                btn.trigger("mouseout");
            });
            input.change(function(e) {
                input.unbind();
                input.detach();
                btn.trigger('choose', [ input ]);
                reset();
            });
        }

        reset();

        function placer(e) {
            var mleft = e.pageX - pos.left - offset.width;
            var mtop = e.pageY - pos.top - offset.height;
            form.removeAttr("style");
            form.css({
                'margin-left' : mleft,
                'margin-top' : mtop
            });
        }

        function redirect(name) {
            file[name](function(e) {
                btn.trigger(name);
            });
        }

        file.mousemove(placer);
        btn.mousemove(placer);

        redirect('mouseover');
        redirect('mouseout');
        redirect('mousedown');
        redirect('mouseup');

        var offset = {
            width : file.width() - 50,
            height : file.height() / 2
        };

        update();
    });
};

function parseNumber(str) {
    return Number(str.substring(0, str.length - 2));
}
