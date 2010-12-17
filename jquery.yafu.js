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
        $("#upload").yafu({
            upload : {
                control : {
                    type : "link",
                    id : "yafu_upload_link",
                    name : "Upload"
                },
                divOverlayId : "yafu_div_overlay",
                zIndexOverlay : "1100",
                formId : "yafu_upload_form",
                url : "fileUpload",
                method : "post",
                inputControlId : "file"
            },
            progress : {
                labelId : "yafu_upload_label",
                progressBarId : "yafu_upload_progressbar",
                url : "uploadStatus",
                useKey : true,
                onComplete : function(data) {
                }
            },
            cancel : {
                linkId : "yafu_cancel_upload",
                url : "cancelUpload",
                onCancel : function(data) {
                }
            }
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
        var _options = {
            upload : {
                control : {
                    type : "link",
                    id : "yafu_upload_link",
                    name : "Upload"
                },
                divOverlayId : "yafu_div_overlay",
                zIndexOverlay : "1100",
                formId : "yafu_upload_form",
                url : "fileUpload",
                method : "post",
                inputControlId : "file"
            },
            progress : {
                labelId : "yafu_upload_label",
                progressBarId : "yafu_upload_progressbar",
                url : "uploadStatus",
                useKey : true,
                onComplete : function(data) {
                }
            },
            cancel : {
                linkId : "yafu_cancel_upload",
                url : "cancelUpload",
                onCancel : function(data) {
                }
            }
        };
        _options = $.extend(_options, arguments[0]);
        var btn = null;
        if (_options.upload.control.type == "button") {
            btn = $('<input type=button />');
        } else {
            btn = $('<a href="javascript:void" />');
        }
        btn.attr("id", _options.upload.control.id);
        btn.append(_options.upload.control.name);
        $(this).append(btn);

        btn.file({
            zIndex : _options.upload.zIndexOverlay,
            fileInput : _options.upload.inputControlId,
            overlayId : _options.upload.divOverlayId
        }).choose(function(e, input) {
            var submitBtn = $('<input id="submit" name="submit" type=submit />');
            var yafu_iframe = $('<iframe></iframe>').attr("id", "yafu_iframe").attr("name", "yafu_iframe");
            var key = $('<input id="key" name="key" type=text />');
            key.val($.md5(input.val()));
            yafu_iframe.attr("height", "0");
            yafu_iframe.attr("width", "1");
            yafu_iframe.load(function() {
                var form = $('<form></form>');
                form.attr("id", _options.upload.formId);
                form.attr("name", _options.upload.formId);
                form.attr("action", _options.upload.url);
                form.attr("method", _options.upload.method);
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
                var canceled = false;
                var label = $('<label></label>');
                label.attr("id", _options.progress.labelId);
                label.html(input.val() + " - 0%");
                var cancelLink = $('<a href="javascript:void"></a>');
                cancelLink.html("Cancel");
                cancelLink.attr("id", _options.cancel.linkId);
                cancelLink.click(function() {
                    canceled = true;
                });
                var progress = $('<div></div>');
                progress.attr("id", _options.progress.progressBarId);
                progress.progressbar({
                    value : 0
                });
                progress.css({
                    height : "5%"
                });
                parent.append(label).append(progress).append(cancelLink);

                submitBtn.click();
                yafu_iframe.empty();
                yafu_iframe.load(function() {
                });

                function yafuComplete() {
                    $("#" + _options.upload.divOverlayId).remove();
                    _options.progress.onComplete();
                }

                function yafuProgress() {
                    var progressUrl = _options.progress.url;
                    var keyParam = {};
                    if (_options.progress.useKey) {
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
                        if (!canceled) {
                            if (percentage != 100) {
                                setTimeout(yafuProgress, 5);
                            } else {
                                cancelLink.remove();
                                yafuComplete();
                            }
                        } else {
                            var cancelUrl = _options.cancel.url;
                            cancelLink.remove();
                            progress.remove();
                            label.html(input.val() + " - Canceled");
                            $.getJSON(cancelUrl, keyParam, function(data) {
                                // Anything?
                            });
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
