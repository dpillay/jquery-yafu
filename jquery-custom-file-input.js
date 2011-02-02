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
    return this.each(function() {
        var btn = $(this);
        var pos = btn.offset();

        function update() {
            var width = parseNumber(btn.css("padding-left")) + btn.width() + parseNumber(btn.css("padding-right"));
            var height = parseNumber(btn.css("padding-top")) + btn.height() + parseNumber(btn.css("padding-bottom"));
            pos = btn.offset();
            file.css({
                'top' : pos.top,
                'left' : pos.left,
                'width' : width,
                'height' : height
            });
        }

        btn.mouseover(update);

        var hidden = $('<div></div>').css({
            'display' : 'none'
        }).appendTo('body');

        var file = $('<div><form></form></div>').appendTo('body').css({
            'position' : 'absolute',
            'overflow' : 'hidden',
            '-moz-opacity' : '0',
            'filter' : 'alpha(opacity: 0)',
            'opacity' : '0',
            'z-index' : zIndex
        });
        file.attr("id", overlayId);

        var form = file.find('form');
        var input = form.find('input');

        function reset() {
            var input = $('<input type="file" multiple>').appendTo(form);
            input.attr("id", fileInput);
            input.attr("name", fileInput);
            input.change(function(e) {
                input.unbind();
                input.detach();
                btn.trigger('choose', [ input ]);
                reset();
            });
        }
        ;

        reset();

        function placer(e) {
            form.css('margin-left', e.pageX - pos.left - offset.width);
            form.css('margin-top', e.pageY - pos.top - offset.height + 3);
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
            width : file.width() - 25,
            height : file.height() / 2
        };

        update();
    });
};

function parseNumber(str) {
    return Number(str.substring(0, str.length - 2));
}
