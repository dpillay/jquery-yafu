/**
 * jquery-yafu v1.1.0
 * 
 * @alias Dinesh Pillay < code [AT] dpillay [DOT] eml [DOT] cc >
 * @link https://github.com/dpillay/jquery-yafu
 * @license MIT License
 * 
 * Converts any valid element to an overlaid input form via an iFrame. Progress
 * mechanism expects a JSON of the format: { bytesUploaded : <number>,
 * bytesTotal : <number> }
 * 
 * Sample code: <code>
$("#upload").yafu({
    upload : {
        control : {
            type : "link", // The upload control can either be a 'link' or a 'button'
            id : "yafu_upload_link", // Id for the upload control.
            name : "Upload", // Name to be displayed on the upload control.
            tabIndex : "1" // TabIndex that's to be assigned for the control
        },
        divOverlayId : "yafu_div_overlay", // overlay div id
        zIndexOverlay : "1100", // z-index for the overlay div
        hiddenDivId : "yafu_div_hidden", // hidden div id for yafu
        formId : "yafu_upload_form", // form id
        url : "fileUpload", // server url for upload the file.
        method : "post", // server upload method.
        inputControlId : "file", // Id for the <input type=file /> element
        onSubmit : function(data) {
             // Fired just before the 'url' is accessed & the file is uploaded.
        }
    },
    progress : {
        labelId : "yafu_upload_label", // Upload label id.
        progressBarId : "yafu_upload_progressbar", // Id for the jquery ui progress bar component.
        url : "uploadStatus", // server url for tracking upload status. A request param with the key will be sent.
        useKey : true, // _Deprecated_
        progressInterval : 250, // Interval for making progress
        onProgress : function(data, textStatus, xhr) {
            // Fired at regular intervals on each upload increment
        },
        onComplete : function(data, textStatus, xhr) {
            // Fired when the upload is completed.
        }
    },
    cancel : {
        linkId : "yafu_cancel_upload", // The id for the 'Cancel' link
        url : "cancelUpload", // server url for canceling the upload. A request param with the key will be sent.
        onBeforeCancel : function() {
            // On clicking on 'Cancel' button, this is fired just before the url is accessed.
        },
        onAfterCancel : function(data, textStatus, xhr) {
            // On clicking on 'Cancel' button, this is fired after server responds to the request for cancellation.
        }
        // Note: cancel & yafu("abort") are NOT the same thing and apply to different scenarios.
        // yafu("abort") is an external event trying to cancel the upload.
    },
    error : {
        onError : function() {
           // Fired any time there's an error throughout the system.
        }
    },
    cleanup : {
        autodelete : true, // If true, in the event of a cancellation or error, yafu will request the server to delete the file.
        deleteUrl : "deleteUpload", // server url for deleting file. A request param with the key will be sent.
        onBeforeDelete : function() {
           // Fired before the 'deleteUrl' is accessed and the file is requested to be deleted.
        },
        onAfterDelete : function(data, textStatus, xhr) {
           // Fired after the server responds to the request for deletion.
        }
    },
    destroy : {
        empty : true // If true, the container on which yafu is called will be emptied on "destroy"
    }
});
</code>
 */

(function($) {
    var _options = {
        upload : {
            control : {
                type : "link",
                id : "yafu_upload_link",
                name : "Upload",
                tabIndex : "1"
            },
            divOverlayId : "yafu_div_overlay",
            zIndexOverlay : "1100",
            hiddenDivId : "yafu_div_hidden",
            formId : "yafu_upload_form",
            url : "fileUpload",
            method : "post",
            inputControlId : "file",
            onSubmit : function(data) {
            }
        },
        progress : {
            labelId : "yafu_upload_label",
            progressBarId : "yafu_upload_progressbar",
            url : "uploadStatus",
            useKey : true,
            progressInterval : 250,
            onProgress : function(data, textStatus, xhr) {
            },
            onComplete : function(data, textStatus, xhr) {
            }
        },
        cancel : {
            linkId : "yafu_cancel_upload",
            url : "cancelUpload",
            onBeforeCancel : function() {
            },
            onAfterCancel : function(data, textStatus, xhr) {
            }
        },
        error : {
            onError : function() {
            }
        },
        cleanup : {
            autodelete : true,
            deleteUrl : "deleteUpload",
            onBeforeDelete : function() {
            },
            onAfterDelete : function(data, textStatus, xhr) {
            }
        },
        destroy : {
            empty : true
        }
    };

    var methods = {
        init : function(options) {
            var $this = $(this), data = $this.data('yafu');

            // If the plugin hasn't been initialized yet
            if (!data) {
                var _data = {
                    selected : {
                        name : "",
                        key : ""
                    },
                    keyValue : "",
                    inputValue : "",
                    interrupted : false,
                    progress : {
                        in_progress : false,
                        bytesUploaded : 0,
                        bytesTotal : -1
                    }
                };
                $(this).data('yafu', _data);
                var parent = $(this);
                $.extend(true, _options, options);
                var btn = null;
                if (_options.upload.control.type == "button") {
                    btn = $('<input type=button />');
                    btn.attr("value", _options.upload.control.name);
                    btn.button();
                } else {
                    btn = $('<a href="javascript:void" />');
                    btn.text(_options.upload.control.name);
                }
                btn.attr("id", _options.upload.control.id);
                btn.attr("tabindex", "0");
                btn.focus(function() {
                    btn.blur();
                });
                $(this).append(btn);

                btn.file({
                    zIndex : _options.upload.zIndexOverlay,
                    fileInput : _options.upload.inputControlId,
                    overlayId : _options.upload.divOverlayId,
                    hiddenDivId : _options.upload.hiddenDivId,
                    tabIndex : _options.upload.control.tabIndex
                }).choose(
                        function(e, input) {
                            _data.progress.in_progress = true;
                            var file_input = input;
                            file_input.attr("id", "file");
                            file_input.attr("name", "file");

                            var submitBtn = $('<input id="submit" name="submit" type=submit />');
                            var yafu_iframe = $('<iframe id="yafu_iframe" name="yafu_iframe"></iframe>');
                            var key = $('<input id="key" name="key" type=text />');
                            key.val($.md5(input.val()) + new Date().getTime());
                            _data.selected.name = input.val();
                            _data.selected.key = key.val();
                            yafu_iframe.attr("height", "0");
                            yafu_iframe.attr("width", "1");
                            yafu_iframe.load(function() {
                            });

                            var form = $('<form style="display: none;" id="' + _options.upload.formId + '" name="'
                                    + _options.upload.formId + '" action="' + _options.upload.url + '" method="'
                                    + _options.upload.method + '" target="' + 'yafu_iframe' + '" enctype="'
                                    + 'multipart/form-data' + '"></form>');

                            form.append(file_input);
                            form.append(key);
                            form.append(submitBtn);

                            parent.empty().append(yafu_iframe).append(form);

                            setTimeout(function() {
                                if (_data.interrupted) {
                                    return yafuError(null);
                                }
                                _data.keyValue = String(key.val());
                                _data.inputValue = String(input.val());
                                var fakePathString = "\\";
                                var fakePathIndex = _data.inputValue.lastIndexOf(fakePathString);
                                if (fakePathIndex > -1) {
                                    var fakePathLength = fakePathIndex + 1;
                                    _data.inputValue = String(_data.inputValue.substring(fakePathLength));
                                }
                                var canceled = false;
                                var label = $('<label></label>');
                                label.attr("id", _options.progress.labelId);
                                label.html(_data.inputValue + " - <i>Initializing<i>");
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
                                $("#" + _options.upload.divOverlayId).remove();
                                $("#" + _options.upload.hiddenDivId).remove();
                                parent.append(label).append(progress).append(cancelLink);

                                _options.upload.onSubmit({
                                    fileName : _data.selected.name,
                                    fileKey : _data.selected.key
                                });

                                function yafuError(e) {
                                    _data.progress.in_progress = false;
                                    if (_options.cleanup.autodelete) {
                                        parent.yafu("purge");
                                    }
                                    parent.yafu("destroy");
                                    _options.error.onError();
                                    return parent;
                                }

                                try {
                                    submitBtn.click();
                                    yafu_iframe.empty();
                                    yafu_iframe.load(function() {
                                    });
                                } catch (e) {
                                    return yafuError(e);
                                }

                                function yafuComplete(data, textStatus, xhr) {
                                    _data.progress.in_progress = false;
                                    parent.yafu("destroy");
                                    _options.progress.onComplete(data, textStatus, xhr);
                                    return parent;
                                }

                                function yafuProgress() {
                                    if (_data.interrupted) {
                                        return yafuError(null);
                                    }
                                    var progressUrl = _options.progress.url;
                                    var keyParam = {
                                        "key" : _data.keyValue,
                                        "nocache" : new Date().getTime()
                                    };
                                    try {
                                        $.getJSON(progressUrl, keyParam, function(data, textStatus, xhr) {
                                            _data.progress.bytesUploaded = data.bytesUploaded;
                                            _data.progress.bytesTotal = data.bytesTotal;
                                            var percentage = Math.floor(100 * parseInt(data.bytesUploaded)
                                                    / parseInt(data.bytesTotal));
                                            if (data.bytesTotal != -1) {
                                                label.html(_data.inputValue + " - " + percentage + "%");
                                            }
                                            progress.progressbar({
                                                value : percentage
                                            });
                                            if (!canceled) {
                                                if (percentage != 100) {
                                                    _options.progress.onProgress(data, textStatus, xhr);
                                                    setTimeout(yafuProgress, _options.progress.progressInterval);
                                                } else {
                                                    cancelLink.remove();
                                                    progress.remove();
                                                    return yafuComplete(data, textStatus, xhr);
                                                }
                                            } else {
                                                var cancelUrl = _options.cancel.url;
                                                cancelLink.remove();
                                                progress.remove();
                                                label.html(_data.inputValue + " - Canceled");
                                                _data.progress.in_progress = false;
                                                _data.interrupted = true;
                                                _options.cancel.onBeforeCancel();
                                                try {
                                                    $.getJSON(cancelUrl, keyParam, function(data, textStatus, xhr) {
                                                        _options.cancel.onAfterCancel(data, textStatus, xhr);
                                                        if (_options.cleanup.autodelete) {
                                                            parent.yafu("purge");
                                                        }
                                                    });
                                                } catch (e) {
                                                    return yafuError(e);
                                                }
                                            }
                                        });
                                    } catch (e) {
                                        return yafuError(e);
                                    }
                                    return parent;
                                }
                                $(function() {
                                    setTimeout(yafuProgress, 500);
                                });
                                return parent;
                            }, 500);
                        });
            }
            return this;
        },
        enabled : function() {
            var _data = this.data('yafu');
            return (_data) ? true : false;
        },
        data : function(key) {
            var _data = this.data('yafu');
            if (_data) {
                return _data[key];
            }
            return this;
        },
        purge : function() {
            var _data = this.data('yafu');
            if (_data) {
                if (_data.progress.in_progress) {
                    throw '[yafu] File Upload in progress, please "abort" or "destroy"';
                } else {
                    _options.cleanup.onBeforeDelete();
                    try {
                        var keyParam = {
                            "key" : _data.keyValue,
                            "nocache" : new Date().getTime()
                        };
                        $.getJSON(_options.cleanup.deleteUrl, keyParam, function(data, textStatus, xhr) {
                            _options.cleanup.onAfterDelete(data, textStatus, xhr);
                        });
                    } catch (e) {
                        console.log("Could not delete file for key: " + _data.keyValue);
                    }
                }
            }
            return this;
        },
        destroy : function() {
            var _data = this.data('yafu');
            if (_data) {
                if (_data.progress.in_progress) {
                    this.yafu("abort");
                } else {
                    $("#" + _options.upload.divOverlayId).remove();
                    $("#" + _options.upload.hiddenDivId).remove();
                    this.removeData('yafu');
                    if (_options.destroy.empty) {
                        this.empty();
                    }
                }
            }
            return this;
        },
        abort : function() {
            var _data = this.data('yafu');
            if (_data) {
                _data.interrupted = true;
            }
            return this;
        },
        progress : function() {
            var _data = this.data('yafu');
            if (_data) {
                return _data.progress;
            } else {
                return null;
            }
        }
    };

    $.fn.yafu = function(method) {
        // Method calling logic
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.yafu');
        }
    };
})(jQuery);
