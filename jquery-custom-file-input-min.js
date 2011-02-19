jQuery.fn.choose=function(a){$(this).bind("choose",a)
};
jQuery.fn.file=function(){var d=arguments[0].zIndex;
var c=arguments[0].fileInput;
var b=arguments[0].overlayId;
var a=arguments[0].hiddenDivId;
return this.each(function(){var g=$(this);
var n=g.offset();
function j(){var q=parseNumber(g.css("padding-left"))+g.width()+parseNumber(g.css("padding-right"));
var p=parseNumber(g.css("padding-top"))+g.height()+parseNumber(g.css("padding-bottom"));
n=g.offset();
h.css({top:n.top,left:n.left,width:q,height:p})
}g.mouseover(j);
var k=$("<div></div>").attr("id",a).css({display:"none"}).appendTo("body");
var h=$("<div><form></form></div>").appendTo("body").css({position:"absolute",overflow:"hidden","-moz-opacity":"0",filter:"alpha(opacity: 0)",opacity:"0","z-index":d});
h.attr("id",b);
var f=h.find("form");
var o=f.find("input");
function m(){var p=$('<input type="file" multiple>').appendTo(f);
p.attr("id",c);
p.attr("name",c);
p.change(function(q){p.unbind();
p.detach();
g.trigger("choose",[p]);
m()
})
}m();
function e(p){f.css("margin-left",p.pageX-n.left-i.width);
f.css("margin-top",p.pageY-n.top-i.height+3)
}function l(p){h[p](function(q){g.trigger(p)
})
}h.mousemove(e);
g.mousemove(e);
l("mouseover");
l("mouseout");
l("mousedown");
l("mouseup");
var i={width:h.width()-25,height:h.height()/2};
j()
})
};
function parseNumber(a){return Number(a.substring(0,a.length-2))
};