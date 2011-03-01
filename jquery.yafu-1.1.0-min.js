(function(c){var a={upload:{control:{type:"link",id:"yafu_upload_link",name:"Upload"},divOverlayId:"yafu_div_overlay",zIndexOverlay:"1100",hiddenDivId:"yafu_div_hidden",formId:"yafu_upload_form",url:"fileUpload",method:"post",inputControlId:"file",onSubmit:function(d){}},progress:{labelId:"yafu_upload_label",progressBarId:"yafu_upload_progressbar",url:"uploadStatus",useKey:true,progressInterval:250,onProgress:function(d,f,e){},onComplete:function(d,f,e){}},cancel:{linkId:"yafu_cancel_upload",url:"cancelUpload",onBeforeCancel:function(){},onAfterCancel:function(d,f,e){}},error:{onError:function(){}},cleanup:{autodelete:true,deleteUrl:"deleteUpload",onBeforeDelete:function(){},onAfterDelete:function(d,f,e){}},destroy:{empty:true}};
var b={init:function(d){var i=c(this),h=i.data("yafu");
if(!h){var g={selected:{name:"",key:""},keyValue:"",inputValue:"",interrupted:false,progress:{in_progress:false,bytesUploaded:0,bytesTotal:-1}};
c(this).data("yafu",g);
var f=c(this);
c.extend(true,a,d);
var e=null;
if(a.upload.control.type=="button"){e=c("<input type=button />");
e.attr("value",a.upload.control.name);
e.button()
}else{e=c('<a href="javascript:void" />');
e.text(a.upload.control.name)
}e.attr("id",a.upload.control.id);
c(this).append(e);
e.file({zIndex:a.upload.zIndexOverlay,fileInput:a.upload.inputControlId,overlayId:a.upload.divOverlayId,hiddenDivId:a.upload.hiddenDivId}).choose(function(o,k){g.progress.in_progress=true;
var p=k;
p.attr("id","file");
p.attr("name","file");
var j=c('<input id="submit" name="submit" type=submit />');
var l=c('<iframe id="yafu_iframe" name="yafu_iframe"></iframe>');
var m=c('<input id="key" name="key" type=text />');
m.val(c.md5(k.val())+new Date().getTime());
g.selected.name=k.val();
g.selected.key=m.val();
l.attr("height","0");
l.attr("width","1");
l.load(function(){});
var n=c('<form style="display: none;" id="'+a.upload.formId+'" name="'+a.upload.formId+'" action="'+a.upload.url+'" method="'+a.upload.method+'" target="yafu_iframe" enctype="multipart/form-data"></form>');
n.append(p);
n.append(m);
n.append(j);
f.empty().append(l).append(n);
setTimeout(function(){if(g.interrupted){return w(null)
}g.keyValue=String(m.val());
g.inputValue=String(k.val());
var y="\\";
var x=g.inputValue.lastIndexOf(y);
if(x>-1){var t=x+1;
g.inputValue=String(g.inputValue.substring(t))
}var u=false;
var z=c("<label></label>");
z.attr("id",a.progress.labelId);
z.html(g.inputValue+" - <i>Initializing<i>");
var r=c('<a href="javascript:void"></a>');
r.html("Cancel");
r.attr("id",a.cancel.linkId);
r.click(function(){u=true
});
var q=c("<div></div>");
q.attr("id",a.progress.progressBarId);
q.progressbar({value:0});
q.css({height:"5%"});
c("#"+a.upload.divOverlayId).remove();
c("#"+a.upload.hiddenDivId).remove();
f.append(z).append(q).append(r);
a.upload.onSubmit({fileName:g.selected.name,fileKey:g.selected.key});
function w(B){g.progress.in_progress=false;
if(a.cleanup.autodelete){f.yafu("purge")
}f.yafu("destroy");
a.error.onError();
return f
}try{j.click();
l.empty();
l.load(function(){})
}catch(v){return w(v)
}function s(B,D,C){g.progress.in_progress=false;
f.yafu("destroy");
a.progress.onComplete(B,D,C);
return f
}function A(){if(g.interrupted){return w(null)
}var B=a.progress.url;
var D={key:g.keyValue,nocache:new Date().getTime()};
try{c.getJSON(B,D,function(G,J,I){g.progress.bytesUploaded=G.bytesUploaded;
g.progress.bytesTotal=G.bytesTotal;
var E=Math.floor(100*parseInt(G.bytesUploaded)/parseInt(G.bytesTotal));
if(G.bytesTotal!=-1){z.html(g.inputValue+" - "+E+"%")
}q.progressbar({value:E});
if(!u){if(E!=100){a.progress.onProgress(G,J,I);
setTimeout(A,a.progress.progressInterval)
}else{r.remove();
q.remove();
return s(G,J,I)
}}else{var F=a.cancel.url;
r.remove();
q.remove();
z.html(g.inputValue+" - Canceled");
g.progress.in_progress=false;
g.interrupted=true;
a.cancel.onBeforeCancel();
try{c.getJSON(F,D,function(K,M,L){a.cancel.onAfterCancel(K,M,L);
if(a.cleanup.autodelete){f.yafu("purge")
}})
}catch(H){return w(H)
}}})
}catch(C){return w(C)
}return f
}c(function(){setTimeout(A,500)
});
return f
},500)
})
}return this
},enabled:function(){var d=this.data("yafu");
return(d)?true:false
},data:function(d){var e=this.data("yafu");
if(e){return e[d]
}return this
},purge:function(){var d=this.data("yafu");
if(d){if(d.progress.in_progress){throw'[yafu] File Upload in progress, please "abort" or "destroy"'
}else{a.cleanup.onBeforeDelete();
try{var g={key:d.keyValue,nocache:new Date().getTime()};
c.getJSON(a.cleanup.deleteUrl,g,function(e,i,h){a.cleanup.onAfterDelete(e,i,h)
})
}catch(f){console.log("Could not delete file for key: "+d.keyValue)
}}}return this
},destroy:function(){var d=this.data("yafu");
if(d){if(d.progress.in_progress){this.yafu("abort")
}else{c("#"+a.upload.divOverlayId).remove();
c("#"+a.upload.hiddenDivId).remove();
this.removeData("yafu");
if(a.destroy.empty){this.empty()
}}}return this
},abort:function(){var d=this.data("yafu");
if(d){d.interrupted=true
}return this
},progress:function(){var d=this.data("yafu");
if(d){return d.progress
}else{return null
}}};
c.fn.yafu=function(d){if(b[d]){return b[d].apply(this,Array.prototype.slice.call(arguments,1))
}else{if(typeof d==="object"||!d){return b.init.apply(this,arguments)
}else{c.error("Method "+d+" does not exist on jQuery.yafu")
}}}
})(jQuery);