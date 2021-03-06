function Layer(code, title) {
    this.code = code;
    this.source = "";
    this.title = title;
}
Layer.prototype.setSource = function (source) {
    this.source = source;
}
Layer.prototype.getTitle = function () {
    return this.title;
}
Layer.prototype.getServerSource = function (code) {
    var url = config.HOME + this.getUrl(code);
    log.debug("url" + url);
    $.ajax({
        type: "GET"
        , url: url
        , data: {}
        , async: false
    }).done(function (getSource) {
        source = getSource;
    });
    return source;
}
Layer.prototype.bindInSource = function (source) {
    source = source.replace(new RegExp("%bizCode%", 'gi'), this.code);
    source = source.replace(new RegExp("%bizName%", 'gi'), this.title);
    return source;
}
Layer.prototype.show = function (code) {
}
Layer.prototype.hide = function (code) {
}
Layer.prototype.saveLayerData = function () {
    return [];
}
Layer.prototype.getTopLayerCode = function () { }

// Layer 상속
function BizLayer(code, title) {
    Layer.call(this, code, title);
    this.type = "biz";
    this.data;
    this.maxIndex = 0;
    this.preCode = "";
}
BizLayer.prototype = new Layer();
BizLayer.prototype.zindex = 1;
BizLayer.prototype.getUrl = function (code) {
    return "/component/bizFrame.html?time=" + (new Date()).getTime();
}
BizLayer.prototype.bindInSource = function (source) {
    source = source.replace(new RegExp("%bizCode%", 'gi'), this.code);
    source = source.replace(new RegExp("%bizName%", 'gi'), this.title);
    source = source.replace(new RegExp("%bizUrl%", 'gi'), "/" + this.code.replace(/_/g, '/') + ".html");
    return source;
}
BizLayer.prototype.show = function (layer) {
    try {
        if (typeof layer.code == "string") {
            $("#" + layer.code).show();
            $("#" + layer.code).css("z-index", BizLayer.prototype.zindex++);

            $(".taskbar").css({ backgroundColor: "#008c9a", color: "#ffffff", "border-top": "0px", "border-bottom": "1px solid #000000" });
            $("#" + layer.code.replace("biz", "tbar")).css({ backgroundColor: "#364e6f", color: "#ffffff", "border-top": "1px solid #000000", "border-bottom": "0px" });
        }
    }
    catch (e) {
        log.error("BizLayer.prototype.show", e);
    }
    finally {
        log.debug("BizLayer.prototype.show");
    }
}
BizLayer.prototype.hide = function (code) {
    if (typeof code == "string" && code != "") {
        $("#" + code).hide();
        $("#" + code.replace("biz", "tbar")).css({ backgroundColor: "#364e6f", color: "#ffffff" });
    }
}
BizLayer.prototype.getTopLayerCode = function (code) {
    preCode = "";
    maxIndex = 0;
    $(".bizPages:visible").each(function () {
        if ($(this).css("z-index") > maxIndex) {
            maxIndex = $(this).css("z-index");
            preCode = $(this).attr("id");
        }
    })
    return preCode;
}
BizLayer.prototype.pushHtml = function (source) {
    $("#content").append(source);
}
BizLayer.prototype.setEvent = function (code) {
    $("#topHideBtn_" + code).click(function () {
        me.hideLayer(code);
    });
    $("#topCloseBtn_" + code).click(function () {
        me.closeLayer(code);
        me.closeLayer(code.replace("biz", "tbar"), "tbar");
    });
    $("#topReloadBtn_" + code).click(function () {
        BizLayer.prototype.reload(code);
    });
}
BizLayer.prototype.reload = function (code) {
    var bizFrame = document.getElementById("biz_frame_" + code);
    var bizFrameCon = (bizFrame.contentWindow) ? bizFrame.contentWindow : (bizFrame.contentDocument.document) ? bizFrame.contentDocument.document : bizFrame.contentDocument;
    bizFrameCon.location.reload();
}
BizLayer.prototype.getJQObject = function (code) {
    return $("#" + code);
}
BizLayer.prototype.destory = function (code) {
    try {
        $("#" + code).remove();
    }
    catch (e) {
        log.error("BizLayer.prototype.destory", e);
    }
    finally {
        log.debug("BizLayer.prototype.destory");
    }
}

// Layer 상속
function TBarLayer(code, title) {
    Layer.call(this, code, title);
    this.type = "tbar";
}
TBarLayer.prototype = new Layer();
TBarLayer.prototype.getUrl = function (code) {
    return "/component/taskbar.html?time=" + (new Date()).getTime();
}

TBarLayer.prototype.pushHtml = function (source) {
    $("#tbarArea").append(source);
}
TBarLayer.prototype.setEvent = function (code) {
    $("#task_title_" + code).click(function () {
        me.showLayer(code, "tbar");
        me.showLayer(code.replace("tbar", "biz"), "biz");
    });
    $("#task_close_" + code).click(function () {
        me.closeLayer(code);
        me.closeLayer(code.replace("tbar", "biz"), "biz");
    });
}
TBarLayer.prototype.getJQObject = function (code) {
    return $("#" + code);
}
TBarLayer.prototype.destory = function (code) {
    $("#" + code).remove();
}
TBarLayer.prototype.show = function (layer) {
    $(".taskbar").css({ backgroundColor: "#008c9a", color: "#ffffff", "border-top": "0px", "border-bottom": "1px solid #000000" });
    $("#" + layer.code).css({ backgroundColor: "#364e6f", color: "#ffffff", "border-top": "1px solid #000000", "border-bottom": "0px" });
}
TBarLayer.prototype.hide = function (code) {
    if (typeof code == "string" && code != "") {
        $("#" + code).css({ backgroundColor: "#364e6f", color: "#ffffff", "border-top": "0px", "border-bottom": "1px solid #000000" });
    }
}