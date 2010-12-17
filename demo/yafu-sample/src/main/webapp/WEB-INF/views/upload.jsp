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
	src="<c:url value="/scripts/jquery-1.4.3.min.js" /> "></script>

<script type="text/javascript"
	src="<c:url value="/scripts/jquery-ui-1.8.5.custom.min.js" /> "></script>

<script type="text/javascript"
	src="<c:url value="/scripts/json.min.js" /> "></script>

<script type="text/javascript"
	src="<c:url value="/scripts/jquery-yafu/jquery-custom-file-input.js" /> "></script>

<script type="text/javascript"
	src="<c:url value="/scripts/jquery-yafu/jquery.md5.js" /> "></script>

<script type="text/javascript"
	src="<c:url value="/scripts/jquery-yafu/jquery.yafu.js" /> "></script>

</head>

<body>
<div class="container">
<h1>Upload a file</h1>
<div id="upload"></div>
</div>
</body>

<script type="text/javascript">
    $(document).ready(function() {
        $("#upload").empty();
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
                inputControlId : "file",
                onSubmit : function() {
                }
            },
            progress : {
                labelId : "yafu_upload_label",
                progressBarId : "yafu_upload_progressbar",
                url : "uploadStatus",
                useKey : true,
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
            }
        });
    });
</script>
</html>
