(function ($) {
    $.fn.tipTip = function (options) {
        var defaults = {
            activation: "hover",
            keepAlive: false,
            maxWidth: "200px",
            edgeOffset: 3,
            defaultPosition: "bottom",
            delay: 400,
            fadeIn: 200,
            fadeOut: 200,
            attribute: "title",
            content: false,
            enter: function () {
            },
            exit: function () {
            }
        };
        var opts = $.extend(defaults, options);
        if ($("#tiptip_holder").length <= 0) {
            var tiptip_holder = $('<div id="tiptip_holder" style="max-width:' + opts.maxWidth + ';"></div>');
            var tiptip_content = $('<div id="tiptip_content"></div>');
            var tiptip_arrow = $('<div id="tiptip_arrow"></div>');
            $("body").append(tiptip_holder.html(tiptip_content).prepend(tiptip_arrow.html('<div id="tiptip_arrow_inner"></div>')))
        } else {
            var tiptip_holder = $("#tiptip_holder");
            var tiptip_content = $("#tiptip_content");
            var tiptip_arrow = $("#tiptip_arrow")
        }
        return this.each(function () {
            var org_elem = $(this);
            if (opts.content) {
                var org_title = opts.content
            } else {
                var org_title = org_elem.attr(opts.attribute)
            }
            if (org_title != "") {
                if (!opts.content) {
                    org_elem.removeAttr(opts.attribute)
                }
                var timeout = false;
                if (opts.activation == "hover") {
                    org_elem.hover(function () {
                        active_tiptip()
                    }, function () {
                        if (!opts.keepAlive) {
                            deactive_tiptip()
                        }
                    });
                    if (opts.keepAlive) {
                        tiptip_holder.hover(function () {
                        }, function () {
                            deactive_tiptip()
                        })
                    }
                } else if (opts.activation == "focus") {
                    org_elem.focus(function () {
                        active_tiptip()
                    }).blur(function () {
                        deactive_tiptip()
                    })
                } else if (opts.activation == "click") {
                    org_elem.click(function () {
                        active_tiptip();
                        return false
                    }).hover(function () {
                    }, function () {
                        if (!opts.keepAlive) {
                            deactive_tiptip()
                        }
                    });
                    if (opts.keepAlive) {
                        tiptip_holder.hover(function () {
                        }, function () {
                            deactive_tiptip()
                        })
                    }
                }
                function active_tiptip() {
                    opts.enter.call(this);
                    tiptip_content.html(org_title);
                    tiptip_holder.hide().removeAttr("class").css("margin", "0");
                    tiptip_arrow.removeAttr("style");
                    var top = parseInt(org_elem.offset()['top']);
                    var left = parseInt(org_elem.offset()['left']);
                    var org_width = parseInt(org_elem.outerWidth());
                    var org_height = parseInt(org_elem.outerHeight());
                    var tip_w = tiptip_holder.outerWidth();
                    var tip_h = tiptip_holder.outerHeight();
                    var w_compare = Math.round((org_width - tip_w) / 2);
                    var h_compare = Math.round((org_height - tip_h) / 2);
                    var marg_left = Math.round(left + w_compare);
                    var marg_top = Math.round(top + org_height + opts.edgeOffset);
                    var t_class = "";
                    var arrow_top = "";
                    var arrow_left = Math.round(tip_w - 12) / 2;
                    if (opts.defaultPosition == "bottom") {
                        t_class = "_bottom"
                    } else if (opts.defaultPosition == "top") {
                        t_class = "_top"
                    } else if (opts.defaultPosition == "left") {
                        t_class = "_left"
                    } else if (opts.defaultPosition == "right") {
                        t_class = "_right"
                    }
                    var right_compare = (w_compare + left) < parseInt($(window).scrollLeft());
                    var left_compare = (tip_w + left) > parseInt($(window).width());
                    if ((right_compare && w_compare < 0) || (t_class == "_right" && !left_compare) || (t_class == "_left" && left < (tip_w + opts.edgeOffset + 5))) {
                        t_class = "_right";
                        arrow_top = Math.round(tip_h - 13) / 2;
                        arrow_left = -12;
                        marg_left = Math.round(left + org_width + opts.edgeOffset);
                        marg_top = Math.round(top + h_compare)
                    } else if ((left_compare && w_compare < 0) || (t_class == "_left" && !right_compare)) {
                        t_class = "_left";
                        arrow_top = Math.round(tip_h - 13) / 2;
                        arrow_left = Math.round(tip_w);
                        marg_left = Math.round(left - (tip_w + opts.edgeOffset + 5));
                        marg_top = Math.round(top + h_compare)
                    }
                    var top_compare = (top + org_height + opts.edgeOffset + tip_h + 8) > parseInt($(window).height() + $(window).scrollTop());
                    var bottom_compare = ((top + org_height) - (opts.edgeOffset + tip_h + 8)) < 0;
                    if (top_compare || (t_class == "_bottom" && top_compare) || (t_class == "_top" && !bottom_compare)) {
                        if (t_class == "_top" || t_class == "_bottom") {
                            t_class = "_top"
                        } else {
                            t_class = t_class + "_top"
                        }
                        arrow_top = tip_h;
                        marg_top = Math.round(top - (tip_h + 5 + opts.edgeOffset))
                    } else if (bottom_compare | (t_class == "_top" && bottom_compare) || (t_class == "_bottom" && !top_compare)) {
                        if (t_class == "_top" || t_class == "_bottom") {
                            t_class = "_bottom"
                        } else {
                            t_class = t_class + "_bottom"
                        }
                        arrow_top = -12;
                        marg_top = Math.round(top + org_height + opts.edgeOffset)
                    }
                    if (t_class == "_right_top" || t_class == "_left_top") {
                        marg_top = marg_top + 5
                    } else if (t_class == "_right_bottom" || t_class == "_left_bottom") {
                        marg_top = marg_top - 5
                    }
                    if (t_class == "_left_top" || t_class == "_left_bottom") {
                        marg_left = marg_left + 5
                    }
                    tiptip_arrow.css({"margin-left": arrow_left + "px", "margin-top": arrow_top + "px"});
                    tiptip_holder.css({
                        "margin-left": marg_left + "px",
                        "margin-top": marg_top + "px"
                    }).attr("class", "tip" + t_class);
                    if (timeout) {
                        clearTimeout(timeout)
                    }
                    timeout = setTimeout(function () {
                        tiptip_holder.stop(true, true).fadeIn(opts.fadeIn)
                    }, opts.delay)
                }

                function deactive_tiptip() {
                    opts.exit.call(this);
                    if (timeout) {
                        clearTimeout(timeout)
                    }
                    tiptip_holder.fadeOut(opts.fadeOut)
                }
            }
        })
    }
})(jQuery);
(function (a) {
    var b = a(document).data("func", {});
    a.smartMenu = a.noop;
    a.fn.smartMenu = function (f, c) {
        var i = a("body"), g = {name: "", offsetX: 2, offsetY: 2, textLimit: 6, beforeShow: a.noop, afterShow: a.noop};
        var h = a.extend(g, c || {});
        var e = function (k) {
            var m = k || f, j = k ? Math.random().toString() : h.name, o = "", n = "", l = "smart_menu_";
            if (a.isArray(m) && m.length) {
                o = '<div id="smartMenu_' + j + '" class="' + l + 'box"><div class="' + l + 'body"><ul class="' + l + 'ul">';
                a.each(m, function (q, p) {
                    if (q) {
                        o = o + '<li class="' + l + 'li_separate">&nbsp;</li>'
                    }
                    if (a.isArray(p)) {
                        a.each(p, function (s, v) {
                            var w = v.text, u = "", r = "", t = Math.random().toString().replace(".", "");
                            if (w) {
                                if (w.length > h.textLimit) {
                                    w = w.slice(0, h.textLimit) + "…";
                                    r = ' title="' + v.text + '"'
                                }
                                if (a.isArray(v.data) && v.data.length) {
                                    u = '<li class="' + l + 'li" data-hover="true">' + e(v.data) + '<a href="javascript:" class="' + l + 'a"' + r + ' data-key="' + t + '"><i class="' + l + 'triangle"></i>' + w + "</a></li>"
                                } else {
                                    u = '<li class="' + l + 'li"><a href="javascript:" class="' + l + 'a"' + r + ' data-key="' + t + '">' + w + "</a></li>"
                                }
                                o += u;
                                var x = b.data("func");
                                x[t] = v.func;
                                b.data("func", x)
                            }
                        })
                    }
                });
                o = o + "</ul></div></div>"
            }
            return o
        }, d = function () {
            var j = "#smartMenu_", l = "smart_menu_", k = a(j + h.name);
            if (!k.size()) {
                a("body").append(e());
                a(j + h.name + " a").bind("click", function () {
                    var m = a(this).attr("data-key"), n = b.data("func")[m];
                    if (a.isFunction(n)) {
                        n.call(b.data("trigger"))
                    }
                    a.smartMenu.hide();
                    return false
                });
                a(j + h.name + " li").each(function () {
                    var m = a(this).attr("data-hover"), n = l + "li_hover";
                    a(this).hover(function () {
                        var o = a(this).siblings("." + n);
                        o.removeClass(n).children("." + l + "box").hide();
                        o.children("." + l + "a").removeClass(l + "a_hover");
                        if (m) {
                            a(this).addClass(n).children("." + l + "box").show();
                            a(this).children("." + l + "a").addClass(l + "a_hover")
                        }
                    })
                });
                return a(j + h.name)
            }
            return k
        };
        a(this).each(function () {
            this.oncontextmenu = function (l) {
                if (a.isFunction(h.beforeShow)) {
                    h.beforeShow.call(this)
                }
                l = l || window.event;
                l.cancelBubble = true;
                if (l.stopPropagation) {
                    l.stopPropagation()
                }
                a.smartMenu.hide();
                var k = b.scrollTop();
                var j = d();
                if (j) {
                    j.css({display: "block", left: l.clientX + h.offsetX, top: l.clientY + k + h.offsetY});
                    b.data("target", j);
                    b.data("trigger", this);
                    if (a.isFunction(h.afterShow)) {
                        h.afterShow.call(this)
                    }
                    return false
                }
            }
        });
        if (!i.data("bind")) {
            i.bind("click", a.smartMenu.hide).data("bind", true)
        }
    };
    a.extend(a.smartMenu, {
        hide: function () {
            var c = b.data("target");
            if (c && c.css("display") === "block") {
                c.hide()
            }
        }, remove: function () {
            var c = b.data("target");
            if (c) {
                c.remove()
            }
        }
    })
})(jQuery);
(function ($) {
    var types = ['DOMMouseScroll', 'mousewheel'];
    if ($.event.fixHooks) {
        for (var i = types.length; i;) {
            $.event.fixHooks[types[--i]] = $.event.mouseHooks;
        }
    }
    $.event.special.mousewheel = {
        setup: function () {
            if (this.addEventListener) {
                for (var i = types.length; i;) {
                    this.addEventListener(types[--i], handler, false);
                }
            } else {
                this.onmousewheel = handler;
            }
        }, teardown: function () {
            if (this.removeEventListener) {
                for (var i = types.length; i;) {
                    this.removeEventListener(types[--i], handler, false);
                }
            } else {
                this.onmousewheel = null;
            }
        }
    };
    $.fn.extend({
        mousewheel: function (fn) {
            return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel");
        }, unmousewheel: function (fn) {
            return this.unbind("mousewheel", fn);
        }
    });
    function handler(event) {
        var orgEvent = event || window.event, args = [].slice.call(arguments, 1), delta = 0, returnValue = true, deltaX = 0, deltaY = 0;
        event = $.event.fix(orgEvent);
        event.type = "mousewheel";
        if (orgEvent.wheelDelta) {
            delta = orgEvent.wheelDelta / 120;
        }
        if (orgEvent.detail) {
            delta = -orgEvent.detail / 3;
        }
        deltaY = delta;
        if (orgEvent.axis !== undefined && orgEvent.axis === orgEvent.HORIZONTAL_AXIS) {
            deltaY = 0;
            deltaX = -1 * delta;
        }
        if (orgEvent.wheelDeltaY !== undefined) {
            deltaY = orgEvent.wheelDeltaY / 120;
        }
        if (orgEvent.wheelDeltaX !== undefined) {
            deltaX = -1 * orgEvent.wheelDeltaX / 120;
        }
        args.unshift(event, delta, deltaX, deltaY);
        return ($.event.dispatch || $.event.handle).apply(this, args);
    }
})(jQuery);
eval(function (p, a, c, k, e, r) {
    e = function (c) {
        return (c < a ? '' : e(parseInt(c / a))) + ((c = c % a) > 35 ? String.fromCharCode(c + 29) : c.toString(36))
    };
    if (!''.replace(/^/, String)) {
        while (c--)r[e(c)] = k[c] || e(c);
        k = [function (e) {
            return r[e]
        }];
        e = function () {
            return '\\w+'
        };
        c = 1
    }
    ;
    while (c--)if (k[c])p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c]);
    return p
}('(7($){7 C(c,s){4.i=$(c);4.6=s;4.R=0;4.V={\'v\':0,\'h\':0};4.D={};4.M=0;4.j=$(\'<S/>\',{\'W\':\'H-1m\'});4.o=$(\'<S/>\',{\'W\':\'H-1n-1o\'});4.k=$(\'<S/>\',{\'W\':\'H-1m\'});4.p=$(\'<S/>\',{\'W\':\'H-1n-1p\'});4.q=4.j.1q(4.k);4.i.r({\'1S\':\'1T\',\'m\':\'1U\'}).1V().1W(\'<S W="H-N"></S>\');4.N=4.i.1X(\'.H-N\').r({\'E\':0,\'F\':0,\'m\':\'1Y\'});8(4.6.w==\'1p\'){4.i.1b(4.p.13(4.k))}I 8(4.6.w==\'1o\'){4.i.1b(4.o.13(4.j))}I{4.i.1b(4.o.13(4.j),4.p.13(4.k))}4.o.1q(4.p).r({\'z-1Z\':4.6.1r,\'21\':\'22\'});4.j.r({\'x\':4.6.1c,\'1s\':4.6.y});4.k.r({\'A\':4.6.1c,\'1s\':4.6.y});8(4.6.y){4.q.23(4.O(7(){4.q.J().B(4.6.u,1)}),4.O(7(){8(!4.M){4.q.J().B(4.6.u,4.6.y)}}))}4.1t()}C.K.1d=7(){4.T=4.o.x()-4.j.x();4.G=4.p.A()-4.k.A();4.X=4.N.x()-4.i.x();4.Y=4.N.A()-4.i.A();8(!4.6.1u)14;8(4.X>0){4.o.1v(4.6.Z)}I{4.o.1w(4.6.Z)}8(4.Y>0){4.p.1v(4.6.Z)}I{4.p.1w(4.6.Z)}};C.K.1e=7(){9 a=24(4.6.1x,10);4.o.r({\'E\':a+\'U\',\'x\':4.i.x()-2*a+\'U\'});4.p.r({\'F\':a+\'U\',\'A\':4.i.A()-2*a+\'U\'})};C.K.w=7(v,h){9 a=0;9 b=0;8(v<0){v=0}8(v>4.T){v=4.T}4.j.r(\'E\',v+\'U\');8(h<0){h=0}8(h>4.G){h=4.G}4.k.r(\'F\',h+\'U\');8(4.X>0){b=v/4.T;4.N.r(\'E\',P.16(-4.X*b))}8(4.Y>0){a=h/4.G;4.N.r(\'F\',P.16(-4.Y*a))}8(4.V.v!=b||4.V.h!=a){8(25 4.6.1f==\'7\'){4.6.1f.1y(4.i.17(0),b,a)}4.V.v=b;4.V.h=a}};C.K.1g=7(v,h){9 n=0;9 a=P.26(4.6.1z/4.6.1h);9 b=4.j.m().E;9 c=4.k.m().F;9 d=$.1A[4.6.1B]||$.1A.27;4.q.J().B(4.6.u,1);L.1C(4.R);4.R=L.1D(4.O(7(){4.w(b+d(n/a,n,0,1,a)*v,c+d(n/a,n,0,1,a)*h);8(++n>a){L.1C(4.R);4.q.J().B(4.6.u,4.6.y)}}),4.6.1h)};C.K.O=7(f,s){9 a=4;14 7(){f.28(s||a,29.K.2a.1y(2b))}};C.K.l=7(t,e,f,s){14 t.2c(e,4.O(f,s))};C.K.1t=7(){9 f=$(L.2d);4.l(4.q,\'2e\',7(e){4.M=(e.1i===4.j.17(0))?1:2;9 a=e.18;9 b=e.19;9 c=4.j.m().E;9 d=4.k.m().F;4.l(f,\'1E\',7(e){8(4.M==1){4.w(c+(e.19-b),d)}I{4.w(c,d+(e.18-a))}});4.l(f,\'1F\',7(e){e.1G()})});4.l(f,\'2f\',7(e){8(4.M==1&&e.1i!==4.j.17(0)){4.j.B(4.6.u,4.6.y)}I 8(4.M==2&&e.1i!==4.k.17(0)){4.k.B(4.6.u,4.6.y)}4.M=0;f.1H(\'1E\');f.1H(\'1F\')});4.l(4.i,\'2g\',7(e){9 a=e.1j;9 b=a.1I[0];4.D.1J=b.18;4.D.1K=b.19;4.D.1L=4.j.m().E;4.D.1M=4.k.m().F;4.q.J().B(4.6.u,1);a.11()});4.l(4.i,\'2h\',7(e){9 a=e.1j;9 b=a.2i[0];4.w(4.D.1L+(4.D.1K-b.19)*4.6.1k,4.D.1M+(4.D.1J-b.18)*4.6.1k);a.1G();a.11()});4.l(4.i,\'2j 2k\',7(e){9 a=e.1j;9 b=a.1I[0];4.q.J().B(4.6.u,4.6.y);a.11()});9 g=4.o.x(),G=4.p.A();4.l($(L),\'2l\',7(){4.1e();4.1d();4.w(P.16(4.j.m().E*4.o.x()/g),P.16(4.k.m().F*4.p.A()/G));g=4.o.x();G=4.p.A()});4.l(4.i,\'2m\',7(e,a,b,c){4.w(4.j.m().E-4.6.1l*c,4.k.m().F+4.6.1l*b);4.q.J().B(4.6.u,1);L.2n(4.R);4.R=L.2o(4.O(7(){4.q.J().B(4.6.u,4.6.y)}),4.6.1N);e.11()});4.l(f,\'2p\',7(e){9 a=0,Q=0;Q=(e.1a==2q)?-4.6.12:Q;Q=(e.1a==2r)?4.6.12:Q;a=(e.1a==2s)?-4.6.12:a;a=(e.1a==2t)?4.6.12:a;8(Q||a){4.1g(Q,a)}});4.l(4.i,\'H\',7(e,v,h,a){v=v||0;h=h||0;e.11();8(/^[-\\d\\.]+$/.1O(v)){v=1P(v);8(P.1Q(v)<=1&&!a){v*=4.T}I{v=v+v*(4.T/4.X-1)}}8(/^[-\\d\\.]+$/.1O(h)){h=1P(h);8(P.1Q(h)<=1&&!a){h*=4.G}I{h=h+h*(4.G/4.Y-1)}}4.1g(v,h)});4.1e();4.l($(L),\'2u\',7(){1D(4.O(4.1d),10)})};$.2v.H=7(s){9 a={w:\'2w\',1u:2x,Z:\'2y\',1c:\'2z%\',y:0.5,u:2A,1N:2B,1l:20,1k:0.3,1x:\'2C\',12:1R,1z:2D,1h:15,1B:\'2E\',1r:1R,1f:7(){}};$.2F(a,s);14 4.2G(7(){2H C(4,a)})}})(2I);', 62, 169, '||||this||settings|function|if|var|||||||||container|vslider|hslider|bindEvent|position||vpath|hpath|sliders|css|||sliderOpacityTime||scroll|height|sliderOpacity||width|fadeTo|RollBar|touch|top|left|htrack|rollbar|else|stop|prototype|window|pressed|content|fixFn|Math|vkey|timer|div|vtrack|px|before|class|vdiff|hdiff|autoHideTime||stopPropagation|keyScroll|append|return||round|get|pageX|pageY|keyCode|prepend|sliderSize|checkScroll|pathSize|onscroll|easeScroll|scrollInterval|target|originalEvent|touchSpeed|wheelSpeed|handle|path|vertical|horizontal|add|zIndex|opacity|init|autoHide|fadeIn|fadeOut|pathPadding|call|scrollTime|easing|scrollEasing|clearInterval|setInterval|mousemove|selectstart|preventDefault|unbind|changedTouches|sx|sy|sv|sh|sliderOpacityDelay|test|parseFloat|abs|100|overflow|hidden|relative|contents|wrapAll|children|absolute|index||display|none|hover|parseInt|typeof|floor|linear|apply|Array|slice|arguments|bind|document|mousedown|mouseup|touchstart|touchmove|targetTouches|touchend|touchcancel|resize|mousewheel|clearTimeout|setTimeout|keydown|38|40|37|39|load|fn|both|true|fast|30|200|1000|20px|500|swing|extend|each|new|jQuery'.split('|'), 0, {}))