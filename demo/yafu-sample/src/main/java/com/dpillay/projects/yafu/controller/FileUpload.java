package com.dpillay.projects.yafu.controller;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
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

@Controller
@Scope("session")
public class FileUpload implements Serializable {
	private static final long serialVersionUID = 1392639196671015775L;
	private static Logger log = LoggerFactory.getLogger(FileUpload.class);
	private final String BASE_DIR = "/tmp/yafu";
	private transient Map<String, FileUploadStatus> uploadMap = new ConcurrentHashMap<String, FileUpload.FileUploadStatus>();
	private transient OutputStream os = null;
	private transient File dumpedFile = null;
	private transient InputStream is = null;

	public FileUpload() {
		log.info("file upload created");
	}

	@RequestMapping(value = "/fileUpload", method = RequestMethod.POST)
	public @ResponseBody
	String handleFormUpload(
			@RequestParam(value = "file", required = false) final MultipartFile file,
			@RequestParam(value = "key", required = false) final String key,
			ModelMap modelMap, final HttpServletRequest request) {
		log.info("Received upload file: {} with key: {}",
				file.getOriginalFilename(), key);
		if (!file.isEmpty()) {
			try {
				getFileUploadStatus(key, file);
				is = file.getInputStream();
				dumpedFile = new File(BASE_DIR + "/"
						+ file.getOriginalFilename().replace(" ", "_") + "_"
						+ request.getSession().getId());
				os = new FileOutputStream(dumpedFile);
			} catch (IOException e) {
				log.error(e.getLocalizedMessage(), e);
			}
			return "{ \"uploaded\" : true }";
		} else {
			return "{ \"uploaded\" : false }";
		}
	}

	private FileUploadStatus getFileUploadStatus(String key, MultipartFile file) {
		FileUploadStatus fileUploadStatus = this.uploadMap.get(key);
		if (fileUploadStatus == null) {
			fileUploadStatus = new FileUploadStatus(0, file.getSize(), false);
			this.uploadMap.put(key, fileUploadStatus);
		}
		return fileUploadStatus;
	}

	class FileUploadStatus {

		private volatile long bytesUploaded;
		private volatile long bytesTotal;
		private volatile boolean done = false;

		public FileUploadStatus(long bytesUploaded, long bytesTotal,
				boolean done) {
			super();
			this.bytesUploaded = bytesUploaded;
			this.bytesTotal = bytesTotal;
			this.done = done;
		}

		public void update(String key, long pBytesRead, long pContentLength) {
			if (log.isDebugEnabled())
				log.debug("For key: {}, uploaded : {} / {}", new Object[] {
						key, pBytesRead, pContentLength });
			this.bytesUploaded = pBytesRead;
			this.bytesTotal = pContentLength;
		}

		public long getBytesUploaded() {
			return bytesUploaded;
		}

		public long getBytesTotal() {
			return bytesTotal;
		}
	}

	@RequestMapping(value = "/uploadStatus", method = RequestMethod.GET)
	public @ResponseBody
	String uploadStatus(
			@RequestParam(value = "key", required = false) String key) {
		FileUploadStatus uploadStatus = this.uploadMap.get(key);
		String jsonStatus = "{ \"bytesUploaded\": 0, \"bytesTotal\" : -1 }";
		if (uploadStatus != null && !uploadStatus.done) {
			synchronized (uploadStatus) {
				byte[] bytes = new byte[4096];
				int bytesRead = 0;
				double progressLimit = 0.01;
				long bytesUploaded = uploadStatus.getBytesUploaded();
				try {
					while ((bytesRead = is.read(bytes)) != -1) {
						bytesUploaded += bytesRead;
						uploadStatus.update(key, bytesUploaded,
								uploadStatus.getBytesTotal());
						os.write(bytes);
						if (Double.valueOf(bytesUploaded)
								/ Double.valueOf(uploadStatus.getBytesTotal()) > progressLimit) {
							break;
						}
					}
				} catch (Exception e) {
					log.error(e.getLocalizedMessage(), e);
				}

				jsonStatus = "{ \"bytesUploaded\": "
						+ uploadStatus.getBytesUploaded() + ","
						+ "\"bytesTotal\" : " + uploadStatus.getBytesTotal()
						+ " }";
				if (uploadStatus.bytesTotal == uploadStatus.bytesUploaded) {
					uploadStatus.done = true;
				}
			}
		}
		if (log.isDebugEnabled())
			log.debug("For key: {}, returning status : {}", new Object[] { key,
					jsonStatus });
		return jsonStatus;
	}
}
