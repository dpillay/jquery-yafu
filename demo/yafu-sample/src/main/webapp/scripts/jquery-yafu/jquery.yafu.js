/**
 * jquery-yafu
 * 
 * Converts any valid element to an overlaid input form via an iFrame. Progress
 * mechanism expects a JSON of the format: { bytesUploaded : <number>,
 * bytesTotal : <number> }
 * 
 * 
 * 
 * Sample code: <code>
 * $("#upload").yafu({
        control : {
            type : "link",
            id : "upload_link",
            name : "Import Data"
        },
        formId : "upload_form",
        uploadUrl : "fileUpload",
        method : "post",
        labelId : "upload_label",
        fileInput : "file",
        overlayId : "div_overlay",
        progressUrl : "uploadStatus",
        useKey : true
    });
  </code>
 * 
 * @alias Dinesh Pillay < code [AT] dpillay [DOT] eml [DOT] cc >
 * @link https://github.com/dpillay/jquery-yafu
 * @license MIT License
 * 
 */

(function($) {
    $.fn.yafu = function() {
        var parent = $(this);
        var options = arguments[0] || {};
        if (options.onComplete == undefined) {
            options.onComplete = function() {
            };
        }
        var btn = null;
        if (options.control.type == "button") {
            btn = $('<input type=button />');
        } else {
            btn = $('<a href="javascript:void" />');
        }
        btn.attr("id", options.control.id);
        btn.append(options.control.name);
        $(this).append(btn);

        btn.file({
            zIndex : "1100",
            fileInput : options.fileInput,
            overlayId : options.overlayId
        }).choose(function(e, input) {
            var submitBtn = $('<input id="submit" name="submit" type=submit />');
            var yafu_iframe = $('<iframe></iframe>').attr("id", "yafu_iframe").attr("name", "yafu_iframe");
            var key = $('<input id="key" name="key" type=text />');
            key.val($.md5(input.val()));
            yafu_iframe.attr("height", "0");
            yafu_iframe.attr("width", "1");
            yafu_iframe.load(function() {
                var form = $('<form></form>');
                form.attr("id", options.formId);
                form.attr("name", options.formId);
                form.attr("action", options.uploadUrl);
                form.attr("method", options.method);
                form.attr("target", "yafu_iframe");
                form.attr("enctype", "multipart/form-data");

                var file_input = input;
                file_input.attr("id", "file");
                file_input.attr("name", "file");

                form.append(file_input);
                form.append(key);
                form.append(submitBtn);

                var yafu_form_div = $("<div></div>");
                yafu_form_div.attr("id", "yafu_top_div");
                yafu_form_div.append(form);

                var yafu_output_div = $("<div></div>");
                yafu_output_div.attr("id", "yafu_output_div");
                yafu_form_div.append(yafu_output_div);

                $(this).contents().find('body').eq(0).append(yafu_form_div);
            });
            parent.empty().append(yafu_iframe);

            setTimeout(function() {
                var label = $('<label></label>');
                if (options.labelId != null && options.labelId != '') {
                    label.attr("id", options.labelId);
                } else {
                    label.attr("id", "yafu_label");
                }
                label.html(input.val() + " - 0%");
                var progress = $('<div></div>');
                progress.progressbar({
                    value : 0
                });
                parent.append(label).append(progress);

                submitBtn.click();
                yafu_iframe.empty();
                yafu_iframe.load(function() {
                });

                function yafuComplete() {
                    $("#" + options.overlayId).remove();
                    onComplete();
                }

                function yafuProgress() {
                    var progressUrl = options.progressUrl;
                    var keyParam = {};
                    if (options.useKey) {
                        keyParam = {
                            "key" : key.val()
                        };
                    }
                    $.getJSON(progressUrl, keyParam, function(data) {
                        var percentage = Math.floor(100 * parseInt(data.bytesUploaded) / parseInt(data.bytesTotal));
                        label.html(input.val() + " - " + percentage + "%");
                        progress.progressbar({
                            value : percentage
                        });
                        if (percentage != 100) {
                            setTimeout(yafuProgress, 5);
                        } else {
                            yafuComplete();
                        }
                    });
                }
                $(function() {
                    yafuProgress();
                });
            }, 500);
        });
    };
})(jQuery);
