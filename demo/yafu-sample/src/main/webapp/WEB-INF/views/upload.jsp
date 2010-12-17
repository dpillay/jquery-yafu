<%@ page session="false"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>

<html>
<head>
<title>Create Account</title>
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
                    id : "upload_link",
                    name : "Upload"
                },
                divOverlayId : "div_overlay",
                zIndexOverlay : "1100",
                formId : "upload_form",
                url : "fileUpload",
                method : "post",
                inputControlId : "file"
            },
            progress : {
                labelId : "upload_label",
                progressBarId : "upload_progressbar",
                url : "uploadStatus",
                useKey : true,
                onComplete : function(data) {
                }
            },
            cancel : {
                linkId : "cancel_upload",
                url : "cancelUpload",
                onCancel : function(data) {
                }
            }
        });
    });
</script>
</html>
