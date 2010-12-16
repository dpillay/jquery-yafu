package com.dpillay.projects.yafu.controller;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@Scope("session")
public class FileUploadProgress {
	@RequestMapping(value = "/uploadStatus", method = RequestMethod.GET)
	public @ResponseBody
	String uploadStatus(
			@RequestParam(value = "key", required = false) String key) {
		String jsonStatus = "{ \"bytesUploaded\": 0, \"bytesTotal\" : -1 }";
		return jsonStatus;
	}
}
