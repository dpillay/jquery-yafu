jQuery.fn.choose=function(a){$(this).bind("choose",a)
};
jQuery.fn.file=function(){var e=arguments[0].zIndex;
var d=arguments[0].fileInput;
var c=arguments[0].overlayId;
var b=arguments[0].hiddenDivId;
var a=arguments[0].tabIndex;
return this.each(function(){var h=$(this);
var o=h.offset();
function k(){var r=parseNumber(h.css("padding-left"))+h.width()+parseNumber(h.css("padding-right"));
var q=parseNumber(h.css("padding-top"))+h.height()+parseNumber(h.css("padding-bottom"));
o=h.offset();
i.css({top:o.top,left:o.left,width:r,height:q})
}h.mouseover(k);
var l=$("<div></div>").attr("id",b).css({display:"none"}).appendTo("body");
var i=$("<div><form></form></div>").appendTo("body").css({position:"absolute",overflow:"hidden","-moz-opacity":"0",filter:"alpha(opacity: 0)",opacity:"0",cursor:"pointer","z-index":e});
i.attr("id",c);
var g=i.find("form");
var p=g.find("input");
function n(){var q=$('<input type="file" multiple>').appendTo(g);
q.attr("id",d);
q.attr("name",d);
q.attr("tabindex",a);
q.focus(function(){h.trigger("mouseover")
});
q.blur(function(){h.trigger("mouseout")
});
q.change(function(r){q.unbind();
q.detach();
h.trigger("choose",[q]);
n()
})
}n();
function f(s){var r=s.pageX-o.left-j.width;
var q=s.pageY-o.top-j.height+3;
g.css({"margin-left":r,"margin-top":q})
}function m(q){i[q](function(r){h.trigger(q)
})
}i.mousemove(f);
h.mousemove(f);
m("mouseover");
m("mouseout");
m("mousedown");
m("mouseup");
var j={width:i.width()-25,height:i.height()/2};
k()
})
};
function parseNumber(a){return Number(a.substring(0,a.length-2))
};