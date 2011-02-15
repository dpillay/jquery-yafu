jQuery.fn.choose=function(a){$(this).bind("choose",a)
};
jQuery.fn.file=function(){var c=arguments[0].zIndex;
var b=arguments[0].fileInput;
var a=arguments[0].overlayId;
return this.each(function(){var f=$(this);
var m=f.offset();
function i(){var p=parseNumber(f.css("padding-left"))+f.width()+parseNumber(f.css("padding-right"));
var o=parseNumber(f.css("padding-top"))+f.height()+parseNumber(f.css("padding-bottom"));
m=f.offset();
g.css({top:m.top,left:m.left,width:p,height:o})
}f.mouseover(i);
var j=$("<div></div>").css({display:"none"}).appendTo("body");
var g=$("<div><form></form></div>").appendTo("body").css({position:"absolute",overflow:"hidden","-moz-opacity":"0",filter:"alpha(opacity: 0)",opacity:"0","z-index":c});
g.attr("id",a);
var e=g.find("form");
var n=e.find("input");
function l(){var o=$('<input type="file" multiple>').appendTo(e);
o.attr("id",b);
o.attr("name",b);
o.change(function(p){o.unbind();
o.detach();
f.trigger("choose",[o]);
l()
})
}l();
function d(o){e.css("margin-left",o.pageX-m.left-h.width);
e.css("margin-top",o.pageY-m.top-h.height+3)
}function k(o){g[o](function(p){f.trigger(o)
})
}g.mousemove(d);
f.mousemove(d);
k("mouseover");
k("mouseout");
k("mousedown");
k("mouseup");
var h={width:g.width()-25,height:g.height()/2};
i()
})
};
function parseNumber(a){return Number(a.substring(0,a.length-2))
};