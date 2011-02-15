(function(a){a.fn.yafu=function(){var d=a(this);
var b={upload:{control:{type:"link",id:"yafu_upload_link",name:"Upload"},divOverlayId:"yafu_div_overlay",zIndexOverlay:"1100",formId:"yafu_upload_form",url:"fileUpload",method:"post",inputControlId:"file",onSubmit:function(e){}},progress:{labelId:"yafu_upload_label",progressBarId:"yafu_upload_progressbar",url:"uploadStatus",useKey:true,onProgress:function(e,g,f){},onComplete:function(e,g,f){}},cancel:{linkId:"yafu_cancel_upload",url:"cancelUpload",onBeforeCancel:function(){},onAfterCancel:function(e,g,f){}},onError:function(){},selected:{name:"",key:""}};
b=a.extend(b,arguments[0]);
var c=null;
if(b.upload.control.type=="button"){c=a("<input type=button />");
c.attr("value",b.upload.control.name);
c.button()
}else{c=a('<a href="javascript:void" />');
c.text(b.upload.control.name)
}c.attr("id",b.upload.control.id);
a(this).append(c);
c.file({zIndex:b.upload.zIndexOverlay,fileInput:b.upload.inputControlId,overlayId:b.upload.divOverlayId}).choose(function(k,g){var l=g;
l.attr("id","file");
l.attr("name","file");
var f=a('<input id="submit" name="submit" type=submit />');
var h=a('<iframe id="yafu_iframe" name="yafu_iframe"></iframe>');
var i=a('<input id="key" name="key" type=text />');
i.val(a.md5(g.val()));
b.selected.name=g.val();
b.selected.key=i.val();
h.attr("height","0");
h.attr("width","1");
h.load(function(){});
var j=a('<form style="display: none;" id="'+b.upload.formId+'" name="'+b.upload.formId+'" action="'+b.upload.url+'" method="'+b.upload.method+'" target="yafu_iframe" enctype="multipart/form-data"></form>');
j.append(l);
j.append(i);
j.append(f);
d.empty().append(h).append(j);
setTimeout(function(){var q=String(i.val());
var o=String(g.val());
if(a.browser.msie){var v="fakepath";
var u=o.indexOf(v);
if(u>-1){var r=v.length+u+1;
o=String(o.substring(r))
}}var s=false;
var w=a("<label></label>");
w.attr("id",b.progress.labelId);
w.html(o+" - 0%");
var n=a('<a href="javascript:void"></a>');
n.html("Cancel");
n.attr("id",b.cancel.linkId);
n.click(function(){s=true
});
var m=a("<div></div>");
m.attr("id",b.progress.progressBarId);
m.progressbar({value:0});
m.css({height:"5%"});
d.append(w).append(m).append(n);
b.upload.onSubmit({fileName:b.selected.name,fileKey:b.selected.key});
try{f.click();
h.empty();
h.load(function(){})
}catch(t){b.onError()
}function p(e,z,y){a("#"+b.upload.divOverlayId).remove();
b.progress.onComplete(e,z,y)
}function x(){var y=b.progress.url;
var A={};
if(b.progress.useKey){A={key:q}
}try{a.ajaxSetup({cache:false});
a.getJSON(y,A,function(D,G,F){a.ajaxSetup({cache:true});
var B=Math.floor(100*parseInt(D.bytesUploaded)/parseInt(D.bytesTotal));
w.html(o+" - "+B+"%");
m.progressbar({value:B});
if(!s){if(B!=100){b.progress.onProgress(D,G,F);
setTimeout(x,5)
}else{n.remove();
p(D,G,F)
}}else{var C=b.cancel.url;
n.remove();
m.remove();
w.html(o+" - Canceled");
b.cancel.onBeforeCancel();
try{a.getJSON(C,A,function(e,I,H){b.cancel.onAfterCancel(e,I,H)
})
}catch(E){b.onError()
}}})
}catch(z){b.onError()
}}a(function(){setTimeout(x,500)
})
},500)
})
}
})(jQuery);