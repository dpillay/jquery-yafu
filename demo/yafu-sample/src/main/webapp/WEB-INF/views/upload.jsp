<%@ page session="false"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>

<html>
<head>
<title>Yafu Sample Application</title>
<link rel="stylesheet"
	href="<c:url value="/styles/blueprint/screen.css" />" type="text/css"
	media="screen, projection">
<link rel="stylesheet"
	href="<c:url value="/styles/blueprint/print.css" />" type="text/css"
	media="print">
<!--
	[if lt IE 8]>
		<link rel="stylesheet" href="<c:url value="/styles/blueprint/ie.css" />" type="text/css" media="screen, projection">
	<![endif]
-->
<link rel="stylesheet"
	href="<c:url value="/styles/blueprint/print.css" />" type="text/css"
	media="print">
<link rel="stylesheet" href="<c:url value="/styles/popup.css" />"
	type="text/css" media="screen, projection">

<link rel="stylesheet"
	href="<c:url value="/styles/redmond/jquery-ui-1.8.6.custom.css" />"
	type="text/css" media="screen, projection">

<script type="text/javascript"
	src="<c:url value="/scripts/jquery-1.4.4.js" /> "></script>

<script type="text/javascript"
	src="<c:url value="/scripts/jquery-ui-1.8.5.custom.min.js" /> "></script>

<script type="text/javascript"
	src="<c:url value="/scripts/json.min.js" /> "></script>

<script type="text/javascript"
	src="<c:url value="/scripts/jquery-yafu/jquery-custom-file-input.js" /> "></script>

<script type="text/javascript"
	src="<c:url value="/scripts/jquery-yafu/jquery.md5.js" /> "></script>

<script type="text/javascript"
	src="<c:url value="/scripts/jquery-yafu/jquery.yafu-1.1.0.js" /> "></script>

</head>

<body>
<div class="container">
<h1>Upload a file</h1>
<table>
	<tr>
		<td><input id="btnYafu" type="button" tabindex="1"></input></td>
	</tr>
	<tr>
		<td>
		<div id="upload"></div>
		</td>
	</tr>
	<tr>
		<td>
		<div id="yafuCancel"></div>
		</td>
	</tr>
	<tr>
		<td>
		<div id="yafuData"></div>
		</td>
	</tr>
</table>
</div>
</body>

<script type="text/javascript">
    $(document).ready(function() {
        $("#btnYafu").button().val("Click to Import").click(function() {
            var btnYafuData = $('<input></input>').attr("id", "btnYafuData").attr("tabindex", "4");
            btnYafuData.button().val("Get Key").click(function() {
                alert($("#upload").yafu("data", "keyValue"));
            });
            $("#yafuData").append(btnYafuData);
            var btnYafuCancel = $('<input></input>').attr("id", "btnYafuCancel").attr("tabindex", "3");
            btnYafuCancel.button().val("Cancel Import").click(function() {
                $("#upload").yafu("destroy");
                btnYafuData.remove();
                $(this).remove();
            });
            $("#yafuCancel").append(btnYafuCancel);

            $("#upload").yafu({
                upload : {
                    control : {
                        type : "button",
                        id : "yafu_upload_link",
                        name : "Import Data",
                        tabIndex : "2"
                    },
                    divOverlayId : "yafu_div_overlay",
                    zIndexOverlay : "1100",
                    formId : "yafu_upload_form",
                    url : "fileUpload",
                    method : "post",
                    inputControlId : "file",
                    onSubmit : function(data) {
                        alert("File name: " + data.fileName + " & File Key: " + data.fileKey);
                    }
                },
                progress : {
                    labelId : "yafu_upload_label",
                    progressBarId : "yafu_upload_progressbar",
                    url : "uploadStatus",
                    useKey : true,
                    progressInterval : 100,
                    onProgress : function(data, textStatus, xhr) {
                    },
                    onComplete : function(data, textStatus, xhr) {
                        btnYafuCancel.click();
                    }
                },
                cancel : {
                    linkId : "yafu_cancel_upload",
                    url : "cancelUpload",
                    onBeforeCancel : function() {
                    },
                    onAfterCancel : function(data, textStatus, xhr) {
                        btnYafuCancel.click();
                    }
                },
                onError : function() {
                    alert("Houston, we have a problem!");
                },
                destroy : {
                    empty : true
                }
            });
        });
    });
</script>
</html>
