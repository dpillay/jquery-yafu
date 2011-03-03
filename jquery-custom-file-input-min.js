jQuery.fn.choose=function(a){$(this).bind("choose",a)
};
jQuery.fn.file=function(){var e=arguments[0].zIndex;
var d=arguments[0].fileInput;
var c=arguments[0].overlayId;
var b=arguments[0].hiddenDivId;
var a=arguments[0].tabIndex;
return this.each(function(){var i=$(this);
var p=i.offset();
var h=parseNumber(i.css("padding-left"))+i.width()+parseNumber(i.css("padding-right"));
var r=parseNumber(i.css("padding-top"))+i.height()+parseNumber(i.css("padding-bottom"));
function l(){p=i.offset();
j.css({top:p.top,left:p.left,width:h,height:r})
}i.mouseover(l);
var m=$("<div></div>").attr("id",b).css({display:"none"}).appendTo("body");
var j=$("<div><form></form></div>").appendTo("body").css({position:"absolute",overflow:"hidden","-moz-opacity":"0",filter:"alpha(opacity: 0)",opacity:"0",cursor:"pointer","z-index":e});
j.attr("id",c);
var g=j.find("form");
g.css({position:"relative","float":"right"});
var q=g.find("input");
q.css({position:"relative","float":"right"});
i.attr("tabindex","-1");
function o(){var s=$('<input type="file" multiple>').appendTo(g);
s.attr("id",d);
s.attr("name",d);
s.attr("tabindex",a);
s.focus(function(){i.trigger("mouseover")
});
s.blur(function(){i.trigger("mouseout")
});
s.change(function(t){s.unbind();
s.detach();
i.trigger("choose",[s]);
o()
})
}o();
function f(u){var t=u.pageX-p.left-k.width;
var s=u.pageY-p.top-k.height;
g.removeAttr("style");
g.css({"margin-left":t,"margin-top":s})
}function n(s){j[s](function(t){i.trigger(s)
})
}j.mousemove(f);
i.mousemove(f);
n("mouseover");
n("mouseout");
n("mousedown");
n("mouseup");
var k={width:j.width()-50,height:j.height()/2};
l()
})
};
function parseNumber(a){return Number(a.substring(0,a.length-2))
};