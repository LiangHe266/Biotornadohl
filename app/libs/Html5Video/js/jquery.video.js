;(function ($) {
    $.fn.extend({
        html5video: function (options) {
            var defaults = {
                width: 720,               //Number型，播放器宽度。
                height: 480,              //Number型，播放器高度。
                src: "",                  //String型，要播放的视频的 URL。
                poster: "",               //String型，在视频播放之前所显示的图片的 URL。
                loop: false,              //Boolean型，则当媒介文件完成播放后再次开始播放。
                preload: true,            //Boolean型，如果出现该属性，则视频在页面加载时进行加载，并预备播放。
                notsuportmsg: "您的浏览器不支持html5，无法使用该插件！",    //String型，浏览器不支持video标签时的提示，可使用html标签。
                currenttime:0
            };
            var options = $.extend(defaults, options);
            return this.each(function () {
                var o = options;
                var v_container = $(this);
                if (!try_canvas()) {
                    alert("您的浏览器不支持Html5，无法使用该插件功能！！");
                    window.opener = null;
                    window.close();
                } else {
                    //播放器初始化
                    var videoTemplate = '' +
                        '<video src="' + o.src + '" width="' + o.width + '" poster="' + o.poster + '" height="' + o.height + '" id="video_1">' +
                        '<source src="' + o.src + '" type="video/ogg" />' +
                        '<source src="' + o.src + '" type="video/mp4" />' + o.notsuportmsg +
                        '</video>' +
                        '<div class="video_body">' +
                        '<div class="video_controls">' +
                        '<ul class="video_controls_l">' +
                        '<li class="v_play">' +
                        '<i class="iconfont play" title="播放" id="video_play">&#462;</i>' +
                        '<i class="iconfont play" title="暂停" style="display: none;" id="video_pause">&#419;</i>' +
                        '<b>时长：<em id="current_time">00:00</em> / <em id="full_time">00:00</em></b>' +
                        '</li>' +
                        '<li class="v_items">' +
                        '<i class="iconfont save" title="下载该视频">&#342;</i>' +
                        '<i class="iconfont volume" title="音量调节">&#33;</i>' +
                        '<p class="v_volume">' +
                        '<progress  max="100" value="100" class="v_progress"></progress>' +
                        '<input type="range" class="v_range other_range" value="100" min="0" max="100">' +
                        '</p>' +
                        '<mark class="volume_percentage">100%</mark>' +
                        '</li>' +
                        '</ul>' +
                        '<div class="video_controls_r">' +
                        '<i class="iconfont setting" title="设置选项">&#355;</i>' +
                        '</div>' +
                        '</div>' +
                        '<div class="video_range">' +
                        '<progress  max="0" value="0" class="v_progress"></progress>' +
                        '<input type="range" class="v_range" value="0" min="0" max="0">' +
                        '</div>' +
                        '<div class="video_infos" hidden="true">' +
                        '<dl>' +
                        '<dt class="c_size"><i class="iconfont">&#480;</i>初始视频大小：</dt>' +
                        '<dd class="v_size">&nbsp;</dd>' +
                        '<dt class="c_bitrate"><i class="iconfont">&#300;</i>播放速率：<em>正常</em></dt>' +
                        '<dd class="v_bitrate">' +
                        '<progress max="4" value="2" class="v_progress"></progress>' +
                        '<input type="range" class="v_range other_range" value="2" min="0" max="4">' +
                        '</dd>' +
                        '<dt class="c_status"><i class="iconfont">&#278;</i>视频状态：</dt>' +
                        '<dd class="v_status">正在加载中…</dd>' +
                        '<dt class="c_playstatus"><i class="iconfont">&#343;</i>播放状态：</dt>' +
                        '<dd class="v_playstatus"><b>播放</b><b>暂停</b><b>播放结束</b></dd>' +
                        '</dl>' +
                        '</div>' +
                        '<div class="v_bigplaybtn"><i class="iconfont">&#462;</i></div>' +
                        '<div class="video_window" hidden="true">' +
                        '</div>' +
                        '<div class="video_mask"><i class="iconfont" style="display: none;">&#120;</i></div>' +
                        '<input type="text" style="display: none;" id="check_status" value="0">' +
                        '</div>';
                    v_container.html(videoTemplate);
                    var videos = v_container.find("video");
                    if (o.loop) {
                        videos.attr("loop", "loop");
                    }
                    if (o.preload) {
                        videos.attr("preload", "preload");
                    }

                    //样式初始化
                    v_container.css({width: o.width, height: o.height}).show();
                    $(".video_body").css({width: o.width, height: o.height});
                    $(".video_controls_l").width($(".video_body").width() - 150);
                    $(".videocontainer").css({width: o.width, height: o.height}).show();
                    $(".video_controls_l").width($(".video_body").width() - 150);

                    //tiptip
                    $(".video_controls i, .v_share a").tipTip({defaultPosition: "top"});

                    //进度滑块
                    $(".v_range").on("change", function (e) {
                        $(this).prev(".v_progress").val($(this).val());
                    });

                    //播放进度
                    $(".video_range .v_range").on("change", function (e) {
                        videos.get(0).currentTime = $(this).val();
                    });
                    //音量
                    $(".v_volume .v_range").on("change", function (e) {
                        $(".volume_percentage").text($(this).val() + "%");
                        videos.get(0).volume = Number($(this).val()) / 100;
                    });
                    //Play按钮
                    $(".iconfont.play").on("click", function (e) {
                        $(this).hide().siblings(".play").show();
                        if (videos.get(0).paused) {
                            $(".v_bigplaybtn").hide();
                            videos.get(0).play();

                        } else {
                            $(".v_bigplaybtn").show();
                            videos.get(0).pause();
                        }
                    });

                    //video事件绑定
                    videos.on({
                        "loadedmetadata": function () {
                            //视频总时间
                            var _t1 = videos.get(0).duration;
                            var min = Math.floor(_t1 / 60);
                            min = min < 10 ? "0" + min : min;
                            var sec = Math.floor(_t1 - Math.floor(_t1 / 60) * 60);
                            sec = sec < 10 ? "0" + sec : sec;
                            var _t2 = min + ":" + sec;
                            $(".v_play b em:eq(1)").html(_t2);
                            $(".video_range .v_progress, .video_range .v_range").attr("max", Math.floor(_t1));
                            $(".video_infos .v_size").html(videos.get(0).width + " &times; " + videos.get(0).height + "px");
                        }
                        , "timeupdate": function () {
                            //当前播放时间
                            var _t1 = videos.get(0).currentTime;
                            var min = Math.floor(_t1 / 60);
                            min = min < 10 ? "0" + min : min;
                            var sec = Math.floor(_t1 - Math.floor(_t1 / 60) * 60);
                            sec = sec < 10 ? "0" + sec : sec;
                            var _t2 = min + ":" + sec;
                            $(".v_play b em:eq(0)").html(_t2);
                            $(".video_range .v_progress, .video_range .v_range").attr("value", Math.floor(_t1));
                        }
                        , "waiting": function () {
                            $(".v_status").html("视频正在等待中……");
                        }
                        , "canplay": function () {
                            $(".v_status").html("视频加载完成");
                        }
                        , "playing": function () {
                            //真正处于播放的状态，这个时候我们才是真正的在观看视频。
                            $(".v_status").html("视频正在播放");
                            $(".v_playstatus b:eq(0)").addClass("active").siblings("b").removeClass("active");
                        }
                        , "canplaythrough": function () {

                        }
                        , "ended": function () {
                            //播放完毕。
                            $(".v_status").html("视频播放完毕");
                            $(".iconfont.play:visible").hide().siblings(".play").show();
                            $(".v_bigplaybtn").show();
                            $(".v_playstatus b:eq(2)").addClass("active").siblings("b").removeClass("active");
                            $(".video_controls").animate({"bottom": 0}, 500);
                            $(".video_range").animate({"bottom": 42}, 500);
                            $("#check_status").attr("value", "3");
                        }
                        , "play": function () {
                            //播放器不在保持“暂停”状态，即“play()”方法被调用或者autoplay属性设置为true期望播放器自动开始播放。
                            hideContainer();
                            $("#check_status").attr("value", "1");
                        }
                        , "durationchange": function () {
                            //duration(视频播放总时长)属性被更新。
                        }
                        , "pause": function () {
                            $(".v_status").html("视频已暂停");
                            $(".v_playstatus b:eq(1)").addClass("active").siblings("b").removeClass("active");
                            showContainer();
                            $("#check_status").attr("value", "2");
                        }
                    });

                    //下载视频
                    $(".iconfont.save").on("click", function () {
                        window.open(videos.attr("src"));
                    });

                    //播放按钮Big
                    $(".v_bigplaybtn").on("click", function () {
                        $(".iconfont.play:visible").click();
                        $(this).fadeOut(100);
                    });

                    //设置按钮
                    $(".iconfont.setting").on("click", function () {
                        if ($(".video_infos").is(":visible")) {
                            $(".video_infos").fadeOut();
                            $(this).removeClass("active");
                        } else {
                            $(".video_infos").fadeIn();
                            $(this).addClass("active");
                        }
                    });

                    //播放速率
                    $(".v_bitrate .v_range").on("change", function (e) {
                        videos.get(0).playbackRate = $(this).val() / 2;
                        if (videos.get(0).playbackRate == 0) {
                            $(".c_bitrate em").text("0倍");
                        }
                        if (videos.get(0).playbackRate == 0.5) {
                            $(".c_bitrate em").text("0.5倍");
                        }
                        if (videos.get(0).playbackRate == 1) {
                            $(".c_bitrate em").text("1倍");
                        }
                        if (videos.get(0).playbackRate == 1.5) {
                            $(".c_bitrate em").text("1.5倍");
                        }
                        if (videos.get(0).playbackRate == 2) {
                            $(".c_bitrate em").text("2倍");
                        }
                    });


                    //右键菜单
                    $(".video_body").bind("contextmenu", function (e) {
                        return false;
                    });

                    //播放新视频
                    $(".video_playbtn").on("click", function () {
                        if ((new RegExp("^.*?\.(mp4|egg|mov)$")).test($(".video_urlinput").val())) {
                            videos.attr("src", $(".video_urlinput").val());
                            $(".video_window>i").click();
                            return false;
                        }
                    });
                    var videoMenuData = [
                        [
                            {
                                text: "播放/暂停", func: function () {
                                $(".iconfont.play:visible").click();
                            }
                            },
                        ], [
                            {
                                text: "保存视频", func: function () {
                                $(".iconfont.save").click();
                            }
                            }
                        ], [
                            {
                                text: "设置选项", func: function () {
                                $(".iconfont.setting").click();
                            }
                            }

                        ]
                    ];
                    $(".video_mask").on("dbclick", function () {
                        $(".iconfont.fullscreen:visible").click();
                    }).click(function () {
                        $(".iconfont.play:visible").click();
                    }).smartMenu(videoMenuData, {name: "videoMenu"});
                }

                //判断浏览器是否支持html5
                function try_canvas() {
                    var canvas = document.createElement("canvas");
                    if (canvas)  return canvas.getContext;
                }

                //显示控制栏
                function showContainer() {
                    $(".video_controls").animate({"bottom": 0}, 500);
                    $(".video_range").animate({"bottom": 42}, 500);

                }

                //隐藏控制栏
                function hideContainer() {
                    setTimeout(function () {
                        $(".video_controls").animate({"bottom": -40}, 500);
                        $(".video_range").animate({"bottom": -2}, 500);
                        $(".video_infos").hide();
                        $(".iconfont.setting").removeClass("active");
                    }, 7000);
                }

                //鼠标移入时显示控制
                $(".video_mask").bind("mouseover",function(){
                    if(!$("#video_1").get(0).paused) {
                        showContainer();
                        setTimeout(function () {
                            $(".video_controls").animate({"bottom": -40}, 500);
                            $(".video_range").animate({"bottom": -2}, 500);
                            $(".video_infos").hide();
                            $(".iconfont.setting").removeClass("active");
                        }, 5000);
                    }
                    else{
                        showContainer();
                    }
                });

                //设置播放位置
                $("#video_1").get(0).currentTime= o.currenttime;
            });
        }
    });
})(jQuery);
