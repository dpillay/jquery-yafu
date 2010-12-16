package com.dpillay.projects.yafu.controller;

import java.io.IOException;
import java.io.Serializable;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.dpillay.projects.yafu.upload.UploadResource;

@Controller
@Scope("session")
public class FileUploadController implements Serializable {
	private static final long serialVersionUID = 1392639196671015775L;
	private static final String BASE_DIR = "/tmp/yafu";
	private static Logger log = LoggerFactory
			.getLogger(FileUploadController.class);
	private volatile transient Map<String, UploadResource> uploadMap = new ConcurrentHashMap<String, UploadResource>();

	public FileUploadController() {
		log.info("file upload created");
	}

	@RequestMapping(value = "/fileUpload", method = RequestMethod.POST)
	public @ResponseBody
	String handleFormUpload(
			@RequestParam(value = "file", required = false) final MultipartFile file,
			@RequestParam(value = "key", required = false) final String key,
			ModelMap modelMap, final HttpServletRequest request) {
		if (log.isDebugEnabled())
			log.debug("Received upload file: {} with key: {}",
					file.getOriginalFilename(), key);
		if (!file.isEmpty()) {
			try {
				getFileUploadStatus(key, file, request.getSession().getId());
				return "{ \"received\" : true }";
			} catch (IOException e) {
				log.error(e.getLocalizedMessage(), e);
			}
		}
		return "{ \"received\" : false }";
	}

	private UploadResource getFileUploadStatus(String key, MultipartFile file,
			String sessionId) throws IOException {
		UploadResource fileUploadStatus = this.uploadMap.get(key);
		if (fileUploadStatus == null) {
			fileUploadStatus = new UploadResource(sessionId, key, file,
					BASE_DIR);
			this.uploadMap.put(key, fileUploadStatus);
		}
		return fileUploadStatus;
	}

	@RequestMapping(value = "/uploadStatus", method = RequestMethod.GET)
	public @ResponseBody
	String uploadStatus(
			@RequestParam(value = "key", required = false) String key) {
		UploadResource uploadStatus = this.uploadMap.get(key);
		String jsonStatus = "{ \"bytesUploaded\": 0, \"bytesTotal\" : -1 }";
		if (uploadStatus != null) {
			uploadStatus.read();
			jsonStatus = "{ \"bytesUploaded\": "
					+ uploadStatus.getBytesUploaded() + ","
					+ "\"bytesTotal\" : " + uploadStatus.getBytesTotal() + " }";
		}
		if (log.isDebugEnabled())
			log.debug("For key: {}, returning status : {}", new Object[] { key,
					jsonStatus });
		return jsonStatus;
	}
}
