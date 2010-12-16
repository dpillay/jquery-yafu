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
			OutputStream os = null;
			File dumpedFile = null;
			FileUploadStatus status = getFileUploadStatus(key);
			try {
				InputStream is = file.getInputStream();
				dumpedFile = new File(BASE_DIR + "/"
						+ file.getOriginalFilename().replace(" ", "_") + "_"
						+ request.getSession().getId());
				os = new FileOutputStream(dumpedFile);
				byte[] bytes = new byte[4096];
				int bytesRead = 0;
				double progressLimit = 0.01;
				long bytesUploaded = 0;
				try {
					while ((bytesRead = is.read(bytes)) != -1) {
						bytesUploaded += bytesRead;
						status.update(key, bytesUploaded, file.getSize());
						os.write(bytes);
						if (progressLimit < 1.0
								&& (Double.valueOf(bytesUploaded) / Double
										.valueOf(file.getSize())) > progressLimit) {
							log.debug("Sleeping for key {} ", key);
							try {
								Thread.sleep(100);
							} catch (Exception e) {
							}
							progressLimit += 0.01;
						}
					}
				} catch (Exception e) {
					log.error(e.getLocalizedMessage());
				}

			} catch (IOException e) {
				log.error(e.getLocalizedMessage());
			} finally {
				try {
					os.close();
				} catch (IOException e) {
					log.error(e.getLocalizedMessage());
				}
			}
			return "{ \"uploaded\" : true }";
		} else {
			return "{ \"uploaded\" : false }";
		}
	}

	private FileUploadStatus getFileUploadStatus(String key) {
		FileUploadStatus fileUploadStatus = this.uploadMap.get(key);
		if (fileUploadStatus == null) {
			fileUploadStatus = new FileUploadStatus();
			this.uploadMap.put(key, fileUploadStatus);
		}
		return fileUploadStatus;
	}

	class FileUploadStatus {

		private volatile long bytesUploaded;
		private volatile long bytesTotal;

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

	// @RequestMapping(value = "/uploadStatus", method = RequestMethod.GET)
	// public @ResponseBody
	// String uploadStatus(
	// @RequestParam(value = "key", required = false) String key) {
	// FileUploadStatus uploadStatus = this.uploadMap.get(key);
	// String jsonStatus = null;
	// if (uploadStatus != null) {
	// jsonStatus = "{ \"bytesUploaded\": "
	// + uploadStatus.getBytesUploaded() + ","
	// + "\"bytesTotal\" : " + uploadStatus.getBytesTotal() + " }";
	// } else {
	// jsonStatus = "{ \"bytesUploaded\": 0, \"bytesTotal\" : -1 }";
	// }
	// if (log.isDebugEnabled())
	// log.debug("For key: {}, returning status : {}", new Object[] { key,
	// jsonStatus });
	// return jsonStatus;
	// }
}
