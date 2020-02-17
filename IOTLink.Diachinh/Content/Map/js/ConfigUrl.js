window.onload = function () {
    setTimeout(function () {
        if (window.location.hash != "") {
            var hashUrl = window.location.hash;
            var searchParams = new URLSearchParams(hashUrl.replace('#', ''));

            if (Number(searchParams.get("lat")) && Number(searchParams.get("lng")) && Number(searchParams.get("zoom"))) {
                let code = searchParams.get("code");
                if (typeof code !== undefined && code !== null && code !== "") {
                    ShowMenu(code);
                    map.setTileFeatureFilterCode(code);
                } else {
                    $("li[data-code='0']").trigger("click", "url");
                }
                if (Number(searchParams.get("code")) && Number(searchParams.get("to")) && Number(searchParams.get("thua"))) {
                    setTimeout(function () {
                        ViewMap.getInfoSearch(Number(searchParams.get("to")), Number(searchParams.get("thua")), "", "", "", searchParams.get("code"));
                        ViewMap.getVN2000ThuaDat(Number(searchParams.get("to")), Number(searchParams.get("thua")), searchParams.get("code"))
                    }, 1000);
                } else {
                    let ICameraPosition = { target: { lat: Number(searchParams.get("lat")), lng: Number(searchParams.get("lng")) }, zoom: Number(searchParams.get("zoom")) };
                    map.moveCamera(ICameraPosition);
                }
            }
            else {
                window.location.hash = `lat=${ViewMap.GLOBAL.latLngDefault.lat}&lng=${ViewMap.GLOBAL.latLngDefault.lng}&zoom=${ViewMap.GLOBAL.zoomDefault}.00&code=${ViewMap.CONSTS.codeDefault}`;
            }
        }
        else {
            window.location.hash = `lat=${ViewMap.GLOBAL.latLngDefault.lat}&lng=${ViewMap.GLOBAL.latLngDefault.lng}&zoom=${ViewMap.GLOBAL.zoomDefault}.00&code=${ViewMap.CONSTS.codeDefault}`;
            map.setTileFeatureFilterCode(ViewMap.CONSTS.codeDefault);
        }
        MenuLeft.GLOBAL.hashlink = window.location.hash;
    }, 500);
};

function UpdateUrl(lat, lng, zoom, code, soTo, soThua) {
    setTimeout(function () {
        var hashUrl = window.location.hash;
        var searchParams = new URLSearchParams(hashUrl.replace('#', ''));
        var latold = searchParams.get("lat");
        var lngold = searchParams.get("lng");
        var zoomold = searchParams.get("zoom");
        var codeold = searchParams.get("code");
        var soToold = searchParams.get("to");
        var soThuaold = searchParams.get("thua");
        if (latold == null && lngold == null && zoomold == null && codeold == null && soToold == null && soThuaold == null && MenuLeft.GLOBAL.hashlink != null) {
            var searchParamsold = new URLSearchParams(MenuLeft.GLOBAL.hashlink.replace('#', ''));
            latold = searchParamsold.get("lat");
            lngold = searchParamsold.get("lng");
            zoomold = searchParamsold.get("zoom");
            codeold = searchParamsold.get("code");
            soToold = searchParamsold.get("to");
            soThuaold = searchParamsold.get("thua");
            window.location.hash = MenuLeft.GLOBAL.hashlink;
        }

        if (latold != null && lat != null) {
            window.location.hash = window.location.hash.replace(`lat=${latold}`, `lat=${lat}`);
        }

        if (lngold != null && lng != null) {
            window.location.hash = window.location.hash.replace(`lng=${lngold}`, `lng=${lng}`);
        }

        if (zoomold != null && zoom != null) {
            window.location.hash = window.location.hash.replace(`zoom=${zoomold}`, `zoom=${zoom}.00`);
        }

        if (code != null) {
            if (codeold != null) {
                window.location.hash = window.location.hash.replace(`code=${codeold}`, `code=${code}`);
            } else {
                var zoomnow = searchParams.get("zoom");
                window.location.hash = window.location.hash.replace(`zoom=${zoomnow}`, `zoom=${zoomnow}&code=${code}`);
            }
        }

        if (soTo != null && soThua != null) {
            if (soToold != null && soThuaold != null) {
                window.location.hash = window.location.hash.replace(`to=${soToold}`, `to=${soTo}`).replace(`thua=${soThuaold}`, `thua=${soThua}`);
            } else {
                window.location.hash = window.location.hash.replace('#', '') + `&to=${soTo}&thua=${soThua}`;
            }
        }

        if (codeold != null) {
            MenuLeft.GLOBAL.hashlink = window.location.hash;
        }
    }, 300);
}

function RemoveUrlCode() {
    setTimeout(function () {
        var hashUrl2 = window.location.hash;
        var searchParams = new URLSearchParams(hashUrl2.replace('#', ''));
        var codeold = searchParams.get("code");
        window.location.hash = window.location.hash.replace(`&code=${codeold}`, ``);
    });
}

function RemoveUrlToThua() {
    setTimeout(function () {
        var hashUrl2 = window.location.hash;
        var searchParams2 = new URLSearchParams(hashUrl2.replace('#', ''));
        var soToold = searchParams2.get("to");
        var soThuaold = searchParams2.get("thua");
        window.location.hash = window.location.hash.replace(`&to=${soToold}&thua=${soThuaold}`, ``);
        if ($("[data-code='0']")[0].attributes.style != undefined && $("[data-code='0']")[0].attributes.style.value != "" && $("[data-code='0']")[0].attributes.style.value != "display:none") {
            RemoveUrlCode();
        }
    });
}

function ShowMenu(code) {
    //let codeParent = code.substring(0, 9);
    //let checkMenuParent = $("li[data-code='" + codeParent + "']");
    //if (typeof checkMenuParent !== undefined && checkMenuParent !== null && checkMenuParent.length > 0) {
        $("li[data-code='" + code + "']").parent().parent().trigger("click", "url-parent");
    //}
    setTimeout(function () {
        if ($("li[data-code='" + code + "']").length > 0) {
            $("li[data-code='" + code + "']").trigger("click", "url");
        } else {
            $("li[data-code='0']").trigger("click", "url");
        }
    }, 1000);
}
