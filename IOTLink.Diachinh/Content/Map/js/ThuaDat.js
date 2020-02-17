var ViewMap = {
    GLOBAL: {
        ThuaDatSelect: null,
        location: null,
        url: "https://api-fiolis.map4d.vn",
        commonData: {},
        lstSearch: null,
        latLngDefault: {
            lat: 10.24549734036859, lng: 105.95832932113176
        },
        zoomDefault: 16
    },
    CONSTS: {
        codeDefault: "29560",
        key: "8bd33b7fd36d68baa96bf446c84011da",
        MinDefault: 18,
    },
    SELECTORS: {
        menuright: ".menu-right",
        menuclick: ".location-click",
        addressClick: ".address-menu-click",
        locationClick: ".location-menu-click",
        locationClickVN2000:".location-menu-click-vn2000",
        closeClick: ".close-content",
        loading: "#loading-map",
        inforThuaDat: "#InforThuaDat",
        SoToBD: ".SoToBD",
        SoThuaBD: ".SoThuaBD",
        SoToOld: ".SoToOld",
        SoThuaOld: ".SoThuaOld",
        DientichBD: ".DientichBD",
        DientichPL: ".DientichPL",
        MucDichSuDung: ".MucDichSuDung",
        NameMucDichSuDung: ".NameMucDichSuDung",
        KHDTC: ".KHDTC",
        TenChu: ".TenChu",
        DiaChi: ".DiaChi",
        MaXa: ".MaXa",
        /*search */
        searchtext: ".search-text",
        idsearchtext: "#id-search-text",
        tooltipsearch: "#tooltip-search",
        tooltipsearchsetting: "#tooltip-searchsetting",
        tooltipsearchadvance: "#tooltip-search-adv",
        tooltiptext: ".tooltiptext",
        tooltiptextsetting: ".tooltiptextsetting",
        clearinputid: ".clear-input-id",
        advSearch: "#advSearch",
        SoToSearch: "#text-search-soTo",
        SoThuaSearch: "#text-search-soThua",
        MucDichSuDungSearch: "#text-search-MDSuDung",
        TenChuSearch: "#text-search-chuNha",
        DiaChiSearch: "#text-search-diaChi",
        listSearchAdv: "#list-search-adv",
        lstSelectSearch: '#lstSelectSearch-adv',
        loadingInfoThuaDat: "#loading-map-infoThuaDat",
        DientichBDDonVi: ".DientichBDDonVi",
        DientichPLDonVi: ".DientichPLDonVi"
    },
    init: function () {
        document.oncontextmenu = document.body.oncontextmenu = function () { return false; }
        map = new map4d.Map(document.getElementById("map"), {
            zoom: ViewMap.GLOBAL.zoomDefault,
            center: ViewMap.GLOBAL.latLngDefault,
            geolocate: true,
            minZoom: 3,
            maxZoom: 22,
            tilt: 0,
            controls: true,
            controlOptions: map4d.ControlOptions.BOTTOM_RIGHT,
            accessKey: "208e1c99aa440d8bc2847aafa3bc0669",
        });
        //map.setTileUrl("http://61.28.233.229:8080/all/2d/{z}/{x}/{y}.png");
        //map.setTileUrl("http://61.28.233.229:8080/all/3d/{z}/{x}/{y}.png", true);
        map.setPlacesEnabled(false);
        
        setTimeout(function () {
            var hashUrl = window.location.hash;
            var searchParams = new URLSearchParams(hashUrl.replace('#', ''));
            let code = searchParams.get("code");
            if (typeof code !== undefined && code !== null && code !== "") { } else {
                ViewMap.CONSTS.codeDefault = currentMaXa.length > 0 ? currentMaXa : ViewMap.CONSTS.codeDefault;
                ViewMap.getThuaDatbyCode(ViewMap.CONSTS.codeDefault);
                map.data.setMinZoom(13);
            }
        }, 1);
        
        $(document).on('click', '.sidebar-toggle', function () {
            if ($('.sidebar-mini').hasClass('sidebar-collapse')) {
                //$('#Version').removeClass('version-collapse');
                $('.has-children-child').removeClass('children-selected');
                $('.tree-view-menu-to').css('display', 'none');
            } else {
                //$('#Version').addClass('version-collapse');
            }
        });
        ViewMap.setEvent();
    },
    setEvent: function () {
        let eventClickPolygon = map.data.addListener("click", (args) => {
            let camera = map.getCamera();
            let zoomCurrent = camera.getZoom();
            if (ViewMap.CONSTS.MinDefault <= zoomCurrent) {
                if (!ToolShape.GLOBAL.isStartArea && !ToolShape.GLOBAL.isStartDistance && !HopThua.GLOBAL.checkHopThua) {
                    ViewMap.showHideMenuClick(false, null);
                    ViewMap.showHideMenu(false, null);
                    setTimeout(function () {
                        ViewMap.getInforThuaDat(args.location.lat, args.location.lng);
                    }, 1);
                }
            } else {
                swal({
                    title: "Thông báo",
                    text: "Bạn cần phải zoom to hơn nữa để hiển thị chi tiết lô đất",
                    icon: "warning",
                    button: "Đóng",
                })
            }
        });
        map.addListener("rightClick", (args) => {
            //ViewMap.showHideMenu(true, args.pixel);
            ViewMap.showHideMenuClick(false, null);
            ViewMap.removeSelectThuaDat();
            ViewMap.getLocationMap(args.location.lat, args.location.lng, false);
        });
        map.addListener("cameraChanging", (args) => {
            ViewMap.showHideMenu(false, null);
        });
        map.addListener("click", (args) => {
            ViewMap.showHideMenu(false, null);
        });
        map.addListener("click", (args) => {
            ViewMap.showHideMenuClick(false, null);
            ViewMap.removeSelectThuaDat();
            if (args != null && args.location != null) {
                ViewMap.getConvertVN2000(args.location.lat, args.location.lng);
                ViewMap.getLocationMap(args.location.lat, args.location.lng, true);
                ViewMap.SetMarkerLocation(args.location.lat, args.location.lng, true);
                ViewMap.showHideViewProperty(false);
            }
        }, { location: true });

        $(ViewMap.SELECTORS.closeClick).click(function () {
            ViewMap.SetMarkerLocation(0, 0, false);
            ViewMap.showHideMenuClick(false, null);
        });
        $(ViewMap.SELECTORS.inforThuaDat).find('.toggle-detail-property').on('click', function () {
            $(ViewMap.SELECTORS.inforThuaDat).toggleClass('detail-property-collapse');
            ViewMap.removeSelectThuaDat();
        });
        $(ViewMap.SELECTORS.tooltipsearch).hover(function () {
            $(ViewMap.SELECTORS.tooltiptext).css({ "visibility": "inherit" });
        });

        $(ViewMap.SELECTORS.tooltipsearch).mouseout(function () {
            $(ViewMap.SELECTORS.tooltiptext).css({ "visibility": "hidden" });
        });

        $(ViewMap.SELECTORS.tooltipsearch).click(function () {
            var text = $(ViewMap.SELECTORS.searchtext).val();
            var splittext = text.split(',');
            if (splittext.length === 2) {
                $(ViewMap.SELECTORS.advSearch).removeClass("advSearchIndex");
                ViewMap.getInfoSearch(splittext[0], splittext[1], "", "", "", ViewMap.CONSTS.codeDefault);
                $(ViewMap.SELECTORS.SoToSearch).val(parseInt(splittext[0]));
                $(ViewMap.SELECTORS.SoThuaSearch).val(parseInt(splittext[1]));
                $(ViewMap.SELECTORS.lstSelectSearch).val(ViewMap.CONSTS.codeDefault);
            }
        });

        $(ViewMap.SELECTORS.tooltipsearchadvance).click(function () {
            var soTo = $(ViewMap.SELECTORS.SoToSearch).val();
            var soThua = $(ViewMap.SELECTORS.SoThuaSearch).val();
            var diaChi = $(ViewMap.SELECTORS.DiaChiSearch).val();
            var chuNha = $(ViewMap.SELECTORS.TenChuSearch).val();
            var MDSuDung = ViewMap.convertMDSD($(ViewMap.SELECTORS.MucDichSuDungSearch).val());

            if ((soTo > 0 && soThua > 0) || (soTo !== "" && soThua !== "")) {
                ViewMap.getInfoSearch(soTo, soThua, diaChi, chuNha, MDSuDung, $(ViewMap.SELECTORS.lstSelectSearch).val());
                return;
            } else {
                if (diaChi !== "" || chuNha !== "" || MDSuDung !== "") {
                    ViewMap.getInfoSearch(soTo, soThua, diaChi, chuNha, MDSuDung, $(ViewMap.SELECTORS.lstSelectSearch).val());
                    return;
                }
            }
            swal({
                title: "Thông báo",
                text: "Dữ liệu nhập không đúng",
                icon: "warning",
                button: "Đóng",
            }).then((value) => {
            });
        });

        $(ViewMap.SELECTORS.tooltipsearchsetting).hover(function () {
            $(ViewMap.SELECTORS.tooltiptextsetting).css({ "visibility": "inherit" });
        });

        $(ViewMap.SELECTORS.tooltipsearchsetting).mouseout(function () {
            $(ViewMap.SELECTORS.tooltiptextsetting).css({ "visibility": "hidden" });
        });

        $(ViewMap.SELECTORS.tooltipsearchsetting).click(function () {
            ViewMap.resetSearchAdv();

            if (!$(ViewMap.SELECTORS.advSearch).hasClass("advSearchIndex")) {
                $(ViewMap.SELECTORS.advSearch).addClass("advSearchIndex");
            } else {
                $(ViewMap.SELECTORS.advSearch).removeClass("advSearchIndex");
            }
            if (MenuLeft.GLOBAL.loadAllDropdownlist == false) {
                for (var i = 0; i < MenuLeft.GLOBAL.lstDropdownlist.length; i++) {
                    ViewMap.loadDropdownlistSearchAdv(MenuLeft.GLOBAL.lstDropdownlist[i]);
                }
                MenuLeft.GLOBAL.loadAllDropdownlist = true;
            }
        });

        $(document).on('click', '#showlstsearch', function () {
            var thua = parseInt($(this).attr('data-thua'));
            var to = parseInt($(this).attr('data-to'));
            var result = ViewMap.GLOBAL.lstSearch.find(x => x.properties.SoThuTuThua === thua && x.properties.SoHieuToBanDo === to);
            if (result !== null && result !== undefined) {
                //ViewMap.GLOBAL.commonData = result;
                UpdateThuaDat.getFindInfo(result);
                EditMode3D.resetObject3D();
                let propertie = result.properties;
                $(ViewMap.SELECTORS.MaXa).text(propertie.MaXa);
                $(ViewMap.SELECTORS.TenChu).text((propertie.TenChu != null ? propertie.TenChu.charAt(0) + propertie.TenChu.slice(1) : ''));
                $(ViewMap.SELECTORS.DiaChi).text((propertie.DiaChi != null ? propertie.DiaChi.charAt(0) + propertie.DiaChi.slice(1) : ''));
                $(ViewMap.SELECTORS.SoThuaBD).text((propertie.SoThuTuThua != null && propertie.SoThuTuThua != 0 ? propertie.SoThuTuThua : ''));
                $(ViewMap.SELECTORS.SoToBD).text((propertie.SoHieuToBanDo != null && propertie.SoHieuToBanDo != 0 ? propertie.SoHieuToBanDo : ''));
                $(ViewMap.SELECTORS.SoThuaOld).text((propertie.SoThuTuThuaCu != null && propertie.SoThuTuThuaCu != 0) ? propertie.SoThuTuThuaCu : '');
                $(ViewMap.SELECTORS.SoToOld).text((propertie.SoHieuToBanDoCu != null && propertie.SoHieuToBanDoCu != 0) ? propertie.SoHieuToBanDoCu : '');
                $(ViewMap.SELECTORS.DientichBD).text((propertie.DienTich != null && propertie.DienTich != 0) ? propertie.DienTich : '');
                $(ViewMap.SELECTORS.DientichPL).text((propertie.DienTichPhapLy != null && propertie.DienTichPhapLy != 0) ? propertie.DienTichPhapLy : '');
                $(ViewMap.SELECTORS.KHDTC).text(propertie.KyHieuDoiTuong);
                $(ViewMap.SELECTORS.MucDichSuDung).text(ViewMap.convertMucDichSuDung(propertie.KyHieuMucDichSuDung));
                //$(ViewMap.SELECTORS.NameMucDichSuDung).text(propertie.TenMucDichSuDung);
                ViewMap.showHideViewProperty(true);
                ViewMap.setSelectThuaDatSearch(result);
                ////UpdateURL
                UpdateUrl(null, null, null, null, propertie.SoHieuToBanDo, propertie.SoThuTuThua);
                if ((propertie.DienTich != null && propertie.DienTich != 0)) {
                    $(ViewMap.SELECTORS.DientichBDDonVi).html(`m<sup>2</sup>`);
                } else {
                    $(ViewMap.SELECTORS.DientichBDDonVi).html('');
                }
                if ((propertie.DienTichPhapLy != null && propertie.DienTichPhapLy != 0)) {
                    $(ViewMap.SELECTORS.DientichPLDonVi).html(`m<sup>2</sup>`);
                } else {
                    $(ViewMap.SELECTORS.DientichPLDonVi).html('');
                }
            }
        });

        $(ViewMap.SELECTORS.searchtext).click(function () {
            var ele = document.getElementById('id-search-text');
            ele.focus();
        });

        $(ViewMap.SELECTORS.searchtext).blur(function () {
            if ($(this).val === "_,_") {
                $(ViewMap.SELECTORS.searchtext).val('');
            }
        });

        $(ViewMap.SELECTORS.searchtext).hover(function () {
            $(ViewMap.SELECTORS.searchtext).attr('placeholder', '_,_');
        });

        $(ViewMap.SELECTORS.searchtext).mouseout(function () {
            $(ViewMap.SELECTORS.searchtext).attr('placeholder', 'Số tờ, Số thửa');
        });

        $(ViewMap.SELECTORS.searchtext).keyup(function (evt) {
            var text = $(this).val();
            var splittext = text.split(',');
            if (splittext.length === 1 && (text.length > 5 || evt.keyCode === 32)) {
                $(this).val(text.slice(0, 5) + ',' + text.slice(5));
            }
            if (evt.keyCode === 13) {
                $(ViewMap.SELECTORS.tooltipsearch).click();
            }
            if (splittext.length > 2) {
                for (var i = 2; i < splittext.length; i++) {
                    splittext[1] += splittext[i];
                }
                $(this).val(splittext[0] + ',' + splittext[1]);
            }
        });

        Array.prototype.forEach.call(document.querySelectorAll('.clearable-input'), function (el) {
            var input = el.querySelector('input');

            conditionallyHideClearIcon();
            input.addEventListener('input', conditionallyHideClearIcon);
            el.querySelector('[data-clear-input]').addEventListener('click', function (e) {
                input.value = '';
                conditionallyHideClearIcon();
                $(ViewMap.SELECTORS.advSearch).removeClass("advSearchIndex");
                ViewMap.resetSearchAdv();
            });
            function conditionallyHideClearIcon(e) {
                var target = (e && e.target) || input;
                target.nextElementSibling.style.display = target.value ? 'block' : 'none';
            }
        });

        map.addListener("idle", (args) => {
            setTimeout(function () { UpdateUrl(args.camera.getTarget().lat, args.camera.getTarget().lng, args.camera.getZoom(), null, null, null);});         
        });
    },
    setStartUp: function () {
        if (typeof currentMaXa !== "undefined" && currentMaXa.length > 0) {

        }
    },
    //select color thua dat select
    setSelectThuaDat: function (data) {
        ViewMap.removeSelectThuaDat();
        if (ViewMap.GLOBAL.ThuaDatSelect == null) {
            geometry = data.geometry;
            //properties = Object.assign({}, data.getProperties());
            //properties.stroke = "#4461ea";
            //properties["fill-opacity"] = 1;
            let Coordinates = ViewMap.getCoordinatesSearch(geometry);
            let ListPolyline = [];
            for (var i = 0; i < Coordinates.length; i++) {
                polyline = new map4d.Polyline({
                    path: Coordinates[i],
                    strokeColor: "#00ffff",
                    strokeOpacity: 1.0,
                    strokeWidth: 2,
                });
                polyline["ObjectId"] = data.properties.ObjectId;
                polyline.setMap(map);
                ListPolyline.push(polyline);
            }
            ViewMap.GLOBAL.ThuaDatSelect = ListPolyline;
        }


        //ViewMap.removeSelectThuaDat();
        //if (ViewMap.GLOBAL.ThuaDatSelect == null) {
        //    geometry = data.geometry;
        //    let Coordinates = ViewMap.getCoordinatesSearch(geometry);
        //    let ListPolyline = [];
        //    for (var i = 0; i < Coordinates.length; i++) {
        //        polyline = new map4d.Polyline({
        //            path: Coordinates[i],
        //            strokeColor: "#00ffff",
        //            strokeOpacity: 1.0,
        //            strokeWidth: 2
        //        });
        //        polyline.setMap(map);
        //        polyline["ObjectId"] = data.properties.ObjectId;
        //        ListPolyline.push(polyline);
        //    }
            
        //}

    },
    //remove select thua dat
    removeSelectThuaDat: function () {
        if (typeof ViewMap.GLOBAL.ThuaDatSelect != "undefined" && ViewMap.GLOBAL.ThuaDatSelect != null && ViewMap.GLOBAL.ThuaDatSelect.length > 0)
            $.each(ViewMap.GLOBAL.ThuaDatSelect, function (i, obj) {
                obj.setMap(null);
            })
        ViewMap.GLOBAL.ThuaDatSelect = null;
    },
    drawThuaDat: function (jsonThuaDat) {
        //features = map.data.addGeoJson(JSON.stringify(jsonThuaDat));
    },
    checkJson: function (obj) {
        try {
            jsonResult = JSON.parse(obj);
            return true;
        }
        catch (e) {
            return false;
        }
    },
    showHideMenu: function (check, pixel) {
        if (check) {
            let top = pixel.y + "px";
            let left = pixel.x + "px";
            $(ViewMap.SELECTORS.menuright).css({ "display": "block", "left": left, "top": top });
        } else {
            $(ViewMap.SELECTORS.menuright).css({ "display": "none" });
        }
    },
    showHideMenuClick: function (check) {
        if (check) {
            $(ViewMap.SELECTORS.menuclick).css({ "display": "flex" });
        } else {
            $(ViewMap.SELECTORS.addressClick).text("");
            $(ViewMap.SELECTORS.locationClick).text("");
            $(ViewMap.SELECTORS.menuclick).css({ "display": "none" });
            ViewMap.SetMarkerLocation(0, 0, false);
        }
    },
    addDataLocation: function (data) {
        $(ViewMap.SELECTORS.addressClick).text(data.str);
        $(ViewMap.SELECTORS.locationClick).text(data.lat + ", " + data.lng);
        ViewMap.showHideMenuClick(true);
    },
    //location map
    getLocationMap: function (lat, lng, isCheck) {
        $.ajax({
            type: "GET",
            url: ViewMap.GLOBAL.url + "/v2/api/admin-level/latlng",
            data: { lat: lat, lng: lng, key: ViewMap.CONSTS.key },
            async: false,
            success: function (data) {
                if (data.result.length > 0) {
                    let str = "";
                    for (var i = data.result.length - 1; i >= 0; i--) {
                        let obj = data.result[i];
                        str += obj.name;
                        if (i > 0) str += ", ";
                    }
                    var re = {
                        str: str,
                        lat: lat,
                        lng: lng
                    }
                    //hiển thị location
                    if (isCheck) ViewMap.addDataLocation(re);
                    ViewMap.GLOBAL.location = { data: data.result, lat: lat, lng: lng };
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                let messageErorr = AppCommon.getMessageErrorReuqest(jqXHR, errorThrown);
                console.log(messageErorr);
            }
        });
    },
    getConvertVN2000: function (lat,lng) {
        $.ajax({
            type: "GET",
            url: ViewMap.GLOBAL.url + "/v2/api/admin-level/wgs84-vn2000",
            data: { lat: lat, lng: lng, key: ViewMap.CONSTS.key },
            success: function (data) {
                if (data.code == "ok" && data.result != null && typeof data.result != undefined) {
                    let x = (Math.round(data.result.x * 1000) / 1000);
                    let y = (Math.round(data.result.y * 1000) / 1000);
                    $(ViewMap.SELECTORS.locationClickVN2000).text(x + ", " + y);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                let messageErorr = AppCommon.getMessageErrorReuqest(jqXHR, errorThrown);
                console.log(messageErorr);
            }
        });
    },
    getThuaDatbyCode: function (code) {
        ViewMap.showLoading(true);
        $.ajax({
            type: "GET",
            url: ViewMap.GLOBAL.url + "/v2/api/admin-level/code",
            data: {
                code: code,
                key: ViewMap.CONSTS.key
            },
            success: function (data) {
                if (data.result != null && typeof data.result != "undefined") {
                    if (data.result.features.length > 0) {
                        let coordinates = ViewMap.convertCoordinate(data.result.features[0]);
                        let latLngBounds = new map4d.LatLngBounds();
                        let paddingOptions = {
                            top: 10,
                            bottom: 10,
                            left: 10,
                            right: 10
                        };

                        for (var iz = 0; iz < coordinates[0].length; iz++) {
                            latLngBounds.extend(coordinates[0][iz]);
                        }
                        map.fitBounds(latLngBounds, paddingOptions, null);
                        ViewMap.CONSTS.codeDefault = code;
                        ViewMap.showLoading(false);
                    } else {
                        ViewMap.showLoading(false);
                        bootbox.alert("Phường/Xã này chưa có dữ liệu");
                    }
                } else {
                    ViewMap.showLoading(false);
                    bootbox.alert("Lỗi hệ thông");
                }

            },
            error: function (jqXHR, textStatus, errorThrown) {
                let messageErorr = AppCommon.getMessageErrorReuqest(jqXHR, errorThrown);
                console.log(messageErorr);
                ViewMap.showLoading(false);
            }
        });
    },
    //set show hide marker location
    SetMarkerLocation: function (lat, lng, check) {
        if (typeof markerClick != "undefined" && markerClick != null) markerClick.setMap(null);
        if (check) { //hiên thị marker
            markerClick = new map4d.Marker({
                position: { lat: lat, lng: lng },
                icon: new map4d.Icon(26, 32, "https://api.map4d.vn/v2/api/place/icon?option=1&type=lodging&size=1x&key=208e1c99aa440d8bc2847aafa3bc0669"),
                anchor: [0.5, 0.9],
            })
            markerClick.setMap(map)
        }
    },
    //show all thua dat ơ phuong
    showThuaDatSelectSubdistrict: function () {
        ViewMap.CONSTS.codeDefault = ViewMap.GLOBAL.location.data[ViewMap.GLOBAL.location.data.length - 1].code;
        setTimeout(function () { ViewMap.getThuaDatbyCode(ViewMap.CONSTS.codeDefault) });
        ViewMap.showHideMenu(false, null);

        //// style selected
        let id = ViewMap.GLOBAL.location.data[ViewMap.GLOBAL.location.data.length - 1].id;
        if (MenuLeft.GLOBAL.idSelect != null && MenuLeft.GLOBAL.idSelect != '') {
            var elementold = document.getElementById(MenuLeft.GLOBAL.idSelect);
            elementold.style.background = '';
        }
        $("[data-code=" + ViewMap.CONSTS.codeDefault + "]").css('background', '');
        var element = document.getElementById(id);
        element.style.background = 'rgba(33, 152, 241, 0.3)';
        MenuLeft.GLOBAL.idSelect = id;
    },
    //show hide loading
    showLoading: function (isCheck) {
        if (isCheck) {
            $(ViewMap.SELECTORS.loading).show();
        }
        else {
            $(ViewMap.SELECTORS.loading).hide();
        }
    },
    //get coordinates geometry data map
    getCoordinates: function (geometry) {
        let data = [];
        let lenght = geometry.getAt(0).getLength();
        for (var i = 0; i < lenght; i++) {
            let datatemp = geometry.getAt(0).getAt(i)._elements;
            data.push(datatemp);
        }
        return data;
    },
    //Show infor thua data
    getInforThuaDat: function (lat, lng) {
        ViewMap.showLoadingInfoThuaDat(true);
        $.ajax({
            type: "GET",
            url: ViewMap.GLOBAL.url + "/v2/api/land/latlng",
            data: {
                lat: lat,
                lng: lng,
                key: ViewMap.CONSTS.key
            },
            success: function (data) {
                //console.log(data);
                ViewMap.GLOBAL.commonData = data.result;
                EditMode3D.resetObject3D();
                if (data.code == "ok" && data.result != null && data.result.features.length > 0 && data.result.capHanhChinh.length > 0) {
                    let propertie = data.result.features[0].properties;
                    $(ViewMap.SELECTORS.MaXa).text(propertie.MaXa);
                    $(ViewMap.SELECTORS.TenChu).text((propertie.TenChu != null ? propertie.TenChu.charAt(0) + propertie.TenChu.slice(1) : ''));
                    $(ViewMap.SELECTORS.DiaChi).text((propertie.DiaChi != null ? propertie.DiaChi.charAt(0) + propertie.DiaChi.slice(1) : ''));
                    $(ViewMap.SELECTORS.SoThuaBD).text((propertie.SoThuTuThua != null && propertie.SoThuTuThua != 0 ? propertie.SoThuTuThua : ''));
                    $(ViewMap.SELECTORS.SoToBD).text((propertie.SoHieuToBanDo != null && propertie.SoHieuToBanDo != 0 ? propertie.SoHieuToBanDo : ''));
                    $(ViewMap.SELECTORS.SoThuaOld).text((propertie.SoThuTuThuaCu != null && propertie.SoThuTuThuaCu != 0) ? propertie.SoThuTuThuaCu : '');
                    $(ViewMap.SELECTORS.SoToOld).text((propertie.SoHieuToBanDoCu != null && propertie.SoHieuToBanDoCu != 0) ? propertie.SoHieuToBanDoCu : '');
                    $(ViewMap.SELECTORS.DientichBD).text((propertie.DienTich != null && propertie.DienTich != 0) ? propertie.DienTich : '');
                    $(ViewMap.SELECTORS.DientichPL).text((propertie.DienTichPhapLy != null && propertie.DienTichPhapLy != 0) ? propertie.DienTichPhapLy : '');
                    $(ViewMap.SELECTORS.KHDTC).text(propertie.KyHieuDoiTuong);
                    $(ViewMap.SELECTORS.MucDichSuDung).text(ViewMap.convertMucDichSuDung(propertie.KyHieuMucDichSuDung));
                    //$(ViewMap.SELECTORS.NameMucDichSuDung).text(propertie.TenMucDichSuDung);
                    ViewMap.showHideViewProperty(true);
                    ViewMap.setSelectThuaDat(data.result.features[0]);
                    if ((propertie.DienTich != null && propertie.DienTich != 0)) {
                        $(ViewMap.SELECTORS.DientichBDDonVi).html(`m<sup>2</sup>`);
                    } else {
                        $(ViewMap.SELECTORS.DientichBDDonVi).html('');
                    }
                    if ((propertie.DienTichPhapLy != null && propertie.DienTichPhapLy != 0)) {
                        $(ViewMap.SELECTORS.DientichPLDonVi).html(`m<sup>2</sup>`);
                    } else {
                        $(ViewMap.SELECTORS.DientichPLDonVi).html('');
                    }

                    var codeurl;
                    for (var im = 0; im < data.result.capHanhChinh.length; im++) {
                        if (data.result.capHanhChinh[im].level == 3) {
                            codeurl = data.result.capHanhChinh[im].code;
                        }
                    }
                    ////UpdateURL
                    UpdateUrl(null, null, null, codeurl, propertie.SoHieuToBanDo, propertie.SoThuTuThua);
                    ViewMap.CONSTS.codeDefault = codeurl;
                } else {
                    swal({
                        title: "Thông báo",
                        text: "Không tìm thấy kết quả",
                        icon: "error",
                        button: "Đóng",
                    }).then((value) => {
                    });
                }
                ViewMap.showLoadingInfoThuaDat(false);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                let messageErorr = AppCommon.getMessageErrorReuqest(jqXHR, errorThrown);
                console.log(messageErorr);
                ViewMap.showLoadingInfoThuaDat(false);
            }
        });
    },
    showHideViewProperty: function (isCheck) {
        if (isCheck) {//show
            $(ViewMap.SELECTORS.inforThuaDat).removeClass('detail-property-collapse');
        }
        else {//hide
            $(ViewMap.SELECTORS.inforThuaDat).addClass('detail-property-collapse');
            ////RemoveURL
            RemoveUrlToThua();
        }
    },
    getInfoSearch: function (soTo, soThua, diaChi, tenChu, mucDichSD, code) {
        //var code;
        //if (status) { //// true: search normal, false: search advance
        //    code = ViewMap.CONSTS.codeDefault;
        //} else {
        //    code = $(MenuLeft.SELECTORS.lstSelectSearch).val();
        //}
        ViewMap.showLoadingInfoThuaDat(true);
        $.ajax({
            type: "GET",
            url: ViewMap.GLOBAL.url + "/v2/api/land/find",
            data: {
                code: code,
                soTo: soTo,
                soThua: soThua,
                diaChi: diaChi,
                tenChu: tenChu,
                kyHieuMucDichSuDung: mucDichSD,
                key: ViewMap.CONSTS.key
            },
            success: function (data) {
                //console.log(data);
                if (data.code == "ok" && data.result != null && data.result.features.length > 0) {
                    $(ViewMap.SELECTORS.listSearchAdv).html('');
                    if (data.result.features.length === 1 && soTo != "" && soTo != null && soThua != "" && soThua != null) {
                        //ViewMap.GLOBAL.commonData = data.result;
                        UpdateThuaDat.getFindInfo(data.result.features[0]);
                        EditMode3D.resetObject3D();
                        let propertie = data.result.features[0].properties;
                        $(ViewMap.SELECTORS.MaXa).text(propertie.MaXa);
                        $(ViewMap.SELECTORS.TenChu).text((propertie.TenChu != null ? propertie.TenChu.charAt(0) + propertie.TenChu.slice(1) : ''));
                        $(ViewMap.SELECTORS.DiaChi).text((propertie.DiaChi != null ? propertie.DiaChi.charAt(0) + propertie.DiaChi.slice(1) : ''));
                        $(ViewMap.SELECTORS.SoThuaBD).text((propertie.SoThuTuThua != null && propertie.SoThuTuThua != 0 ? propertie.SoThuTuThua : ''));
                        $(ViewMap.SELECTORS.SoToBD).text((propertie.SoHieuToBanDo != null && propertie.SoHieuToBanDo != 0 ? propertie.SoHieuToBanDo : ''));
                        $(ViewMap.SELECTORS.SoThuaOld).text((propertie.SoThuTuThuaCu != null && propertie.SoThuTuThuaCu != 0) ? propertie.SoThuTuThuaCu : '');
                        $(ViewMap.SELECTORS.SoToOld).text((propertie.SoHieuToBanDoCu != null && propertie.SoHieuToBanDoCu != 0) ? propertie.SoHieuToBanDoCu : '');
                        $(ViewMap.SELECTORS.DientichBD).text((propertie.DienTich != null && propertie.DienTich != 0) ? propertie.DienTich: '');
                        $(ViewMap.SELECTORS.DientichPL).text((propertie.DienTichPhapLy != null && propertie.DienTichPhapLy != 0) ? propertie.DienTichPhapLy : '');
                        $(ViewMap.SELECTORS.KHDTC).text(propertie.KyHieuDoiTuong);
                        $(ViewMap.SELECTORS.MucDichSuDung).text(ViewMap.convertMucDichSuDung(propertie.KyHieuMucDichSuDung));
                        if ((propertie.DienTich != null && propertie.DienTich != 0)) {
                            $(ViewMap.SELECTORS.DientichBDDonVi).html(`m<sup>2</sup>`);
                        } else {
                            $(ViewMap.SELECTORS.DientichBDDonVi).html('');
                        }
                        if ((propertie.DienTichPhapLy != null && propertie.DienTichPhapLy != 0)) {
                            $(ViewMap.SELECTORS.DientichPLDonVi).html(`m<sup>2</sup>`);
                        } else {
                            $(ViewMap.SELECTORS.DientichPLDonVi).html('');
                        }

                        //$(ViewMap.SELECTORS.NameMucDichSuDung).text(propertie.TenMucDichSuDung);
                        ViewMap.showHideViewProperty(true);
                        setTimeout(function () {
                            ViewMap.setSelectThuaDatSearch(data.result.features[0]);
                        }, 1);
                       
                        ////UpdateURL
                        UpdateUrl(null, null, null, null, propertie.SoHieuToBanDo, propertie.SoThuTuThua);
                    } else {
                        ViewMap.GLOBAL.lstSearch = data.result.features;
                        let html = '<div class="form-content" id = "style-3">';
                        for (var i = 0; i < ViewMap.GLOBAL.lstSearch.length; i++) {
                            html += `
                                <div class="row-item" style="height: 100%;position: relative;">
                                    <div class="item" data-id = "${ViewMap.GLOBAL.lstSearch[i].properties.SoThuTuThua}">
                                                <div class="route-no">
                                                    <span class="font-light ng-binding">${i + 1}</span>
                                                </div>
                                     </div>
                                     <div class="item-route item" style="width:70%" title = "Xem chi tiết">
                                            <div class="" style="">
                                                    <div class="font-bold ng-binding" style = "font-weight: 700; color: #000"> ${ViewMap.GLOBAL.lstSearch[i].properties.TenChu}</div>
                                            </div>
                                            <div class="" style="overflow: hidden;">
                                                    <div class="font-normal ng-binding" style ="color: #000">Số tờ ${ViewMap.GLOBAL.lstSearch[i].properties.SoHieuToBanDo}- Số thừa :${ViewMap.GLOBAL.lstSearch[i].properties.SoThuTuThua}</div>
                                            </div>
                                      </div>
                                <div class="item">
                                    <button class="btn" title= "Xem chi tiết" type="button" id="showlstsearch" style="background: beige;" data-thua ="${ViewMap.GLOBAL.lstSearch[i].properties.SoThuTuThua}" data-to="${ViewMap.GLOBAL.lstSearch[i].properties.SoHieuToBanDo}">
                                        <i class="fa fa-arrow-right"></i>
                                    </button>
                                </div>
                                </div>`;
                        }
                        html += `</div>`;
                        $(ViewMap.SELECTORS.listSearchAdv).html('');
                        $(ViewMap.SELECTORS.listSearchAdv).append(html);
                        $(ViewMap.SELECTORS.advSearch).addClass("advSearchIndex");
                    }
                } else {
                    swal({
                        title: "Thông báo",
                        text: "Không tìm thấy kết quả",
                        icon: "warning",
                        button: "Đóng",
                    }).then((value) => {
                    });
                }
                ViewMap.showLoadingInfoThuaDat(false);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                let messageErorr = AppCommon.getMessageErrorReuqest(jqXHR, errorThrown);
                console.log(messageErorr);
                ViewMap.showLoadingInfoThuaDat(false);
            }
        });
    },
    //select color thua dat select search
    setSelectThuaDatSearch: function (data) {
        ViewMap.removeSelectThuaDat();
        if (ViewMap.GLOBAL.ThuaDatSelect == null) {
            geometry = data.geometry;
            let Coordinates = ViewMap.getCoordinatesSearch(geometry);
            let ListPolyline = [];
            for (var i = 0; i < Coordinates.length; i++) {
                polyline = new map4d.Polyline({
                    path: Coordinates[i],
                    strokeColor: "#00ffff",
                    strokeOpacity: 1.0,
                    strokeWidth: 2
                });
                polyline.setMap(map);
                polyline["ObjectId"] = data.properties.ObjectId;
                ListPolyline.push(polyline);
            }
            ViewMap.GLOBAL.ThuaDatSelect = ListPolyline;
            let latLngBounds = new map4d.LatLngBounds();
            let paddingOptions = {
                top: 10,
                bottom: 10,
                left: 10,
                right: 10
            };

            for (var iz = 0; iz < Coordinates[0].length; iz++) {
                latLngBounds.extend(Coordinates[0][iz]);
            }
            map.fitBounds(latLngBounds, paddingOptions, null);
        }
    },
    //get coordinates geometry data map of search
    getCoordinatesSearch: function (geometry) {
        let data = [];
        if (geometry.type === "Polygon") {
            let lenght = geometry.coordinates.length;
            return geometry.coordinates;
        }
        if (geometry.type === "MultiPolygon") {
            let lenght = geometry.coordinates[0].length;
            for (var i = 0; i < lenght; i++) {
                let datatemp = geometry.coordinates[0][i];
                data.push(datatemp);
            }
            return data;
        }
        
    },
    //show hide loading
    showLoadingInfoThuaDat: function (isCheck) {
        if (isCheck) {
            $(ViewMap.SELECTORS.loadingInfoThuaDat).show();
        }
        else {
            $(ViewMap.SELECTORS.loadingInfoThuaDat).hide();
        }
    },
    getVN2000ThuaDat: function (soto, sothua, code) {
        $.ajax({
            type: "GET",
            url: ViewMap.GLOBAL.url + "/v2/api/land/find-info",
            data: {
                code: code,
                soTo: soto,
                soThua: sothua,
                //objectId: objectId,
                key: ViewMap.CONSTS.key
            },
            async: true,
            success: function (data) {
                if (data.result !== null && typeof data.result !== "undefined") {
                    ViewMap.GLOBAL.commonData = data.result;
                } else {
                    bootbox.alert("Lỗi hệ thống");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                let messageErorr = AppCommon.getMessageErrorReuqest(jqXHR, errorThrown);
                console.log(messageErorr);
                ViewMap.showLoading(false);
            }
        });
    },
    convertMucDichSuDung: function (value) {
        var sliptv = value.split("+");
        let str = "";
        $.each(sliptv, function (i, obj) {
            if (str.length > 0) {
                str += ", ";
            }
            str += obj;
        });
        return str;
    },
    loadDropdownlistSearchAdv: function (parentid, parentcode) {
        var result = null;
        $.ajax({
            type: "GET",
            url: ViewMap.GLOBAL.url + "/v2/api/admin-level/children",
            data: {
                parentId: parentid,
                code : parentcode,
                key: ViewMap.CONSTS.key
            },
            async: false,
            success: function (data) {
                if (data.code == "ok" && data.result != null && data.result.length > 0) {
                    let selecthtml = '';
                    for (var i = 0; i < data.result.length; i++) {
                        selecthtml += `<option value="${data.result[i].code}">
                                        ${data.result[i].description} ${data.result[i].name}
                                    </option>`;
                    }
                    $(ViewMap.SELECTORS.lstSelectSearch).append(selecthtml);
                    result = data.result;
                } else {
                    swal({
                        title: "Thông báo",
                        text: "Lỗi! Không lấy được dữ liệu địa chính",
                        icon: "error",
                        button: "Đóng",
                    }).then((value) => {
                    });
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                let messageErorr = AppCommon.getMessageErrorReuqest(jqXHR, errorThrown);
                console.log(messageErorr);
            }
        });
        return result;
    },
    convertCoordinate: function (data) {
        let path = [];
        let geometry = data.geometry;
        if (geometry.type === "Polygon") {
            let lenght = geometry.coordinates.length;
            return geometry.coordinates;
        }
        if (geometry.type === "MultiPolygon") {
            let lenght = geometry.coordinates[0].length;
            for (var i = 0; i < lenght; i++) {
                let datatemp = geometry.coordinates[0][i];
                path.push(datatemp);
            }
            return path;
        }
    },
    convertMDSD: function (mdsd) {
        let listMDSD = mdsd.split(",");
        let str = "";
        $.each(listMDSD, function (i,obj) {
            if (str.length > 1) {
                str += "+";
            }
            str += obj.trim();
        });
        return str;
    },
    resetSearchAdv: function () {
        $(ViewMap.SELECTORS.listSearchAdv).html('');
        $(ViewMap.SELECTORS.SoToSearch).val(null);
        $(ViewMap.SELECTORS.SoThuaSearch).val(null);
        $(ViewMap.SELECTORS.MucDichSuDungSearch).val(null);
        $(ViewMap.SELECTORS.TenChuSearch).val(null);
        $(ViewMap.SELECTORS.DiaChiSearch).val(null);
        $(ViewMap.SELECTORS.lstSelectSearch).val(ViewMap.CONSTS.codeDefault);
    }
};