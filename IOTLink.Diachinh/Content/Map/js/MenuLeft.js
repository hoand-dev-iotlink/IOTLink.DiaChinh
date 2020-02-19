//import * as d3 from 'd3';
//import { event as currentEvent } from 'd3-selection';
var MenuLeft = {
    GLOBAL: {
        ListPolylineMenu: null,
        idSelect: null,
        checkSelectAll: false,
        selectedUl: null,
        loadAllDropdownlist: true,
        lstDropdownlist: [],
        checkparent: true,
        hashlink: null,
        isListXa: false,
        checklistTo: false
    },
    CONSTS: {
        parentIdDefault: '64'
    },
    SELECTORS: {
        menuList: '#menu-list',
        loadMenuLeftThuaDat: '#load-menu-left-thua-dat'
    },
    init: function () {
        document.addEventListener("click", function () {
            if (lstHuyenNguoiDung.ListHuyenXaNguoiDungs.length === 0) {
                map.setTileFeatureFilterCode();
            }
        });
        lstHuyenNguoiDung.ListHuyenXaNguoiDungs = JSON.parse('[{"Id":"bc3f1fd80d894dd9a22f1d4e155cb584","Code":null,"NameKVHC":"Quận Cẩm Lệ","Name":"Cẩm Lệ","MaKVHC":"48495"},{"Id":"0db60a0f6dfd42e6be3ed9b4709fc911","Code":null,"NameKVHC":"Quận Hải Châu","Name":"Hải Châu","MaKVHC":"48492"},{"Id":"2712b90d0981417c98fd08a793d9ac6f","Code":null,"NameKVHC":"Huyện Hòa Vang","Name":"Hòa Vang","MaKVHC":"48497"},{"Id":"593373598a454f36a62beeaf32e189e4","Code":null,"NameKVHC":"Huyện Hoàng Sa","Name":"Hoàng Sa","MaKVHC":"48498"},{"Id":"3a3f10b7044a41c0a214bca175ac2b33","Code":null,"NameKVHC":"Quận Liên Chiểu","Name":"Liên Chiểu","MaKVHC":"48490"},{"Id":"ef20477f3a224590994ac1d9fbefb6e9","Code":null,"NameKVHC":"Quận Ngũ Hành Sơn","Name":"Ngũ Hành Sơn","MaKVHC":"48494"},{"Id":"95c111bdf8054a9091a6c12c62b4f269","Code":null,"NameKVHC":"Quận Sơn Trà","Name":"Sơn Trà","MaKVHC":"48493"},{"Id":"ff0cc11e1a4a410bb4741b2b6acc200b","Code":null,"NameKVHC":"Quận Thanh Khê","Name":"Thanh Khê","MaKVHC":"48491"}]');
        if (lstHuyenNguoiDung.ListHuyenXaNguoiDungs.length === 0) {
            setTimeout(function () {
                swal({
                    title: "Thông báo",
                    text: "Tài khoản đăng nhập không quản lý khu vực nào cả!",
                    icon: "error",
                    button: "Đóng",
                }).then((value) => {
                    map.setTileFeatureFilterCode();
                });
            }, 500);
        } else {
            MenuLeft.loadMenuByListHuyenNguoiDung();
        }
        MenuLeft.setEvent();
    },
    setEvent: function () {
        function zoomFunction() {
            d3.selectAll("path").attr('transform', 'translate(' + d3.event.transform.x + ',' + d3.event.transform.y + ') scale(' + d3.event.transform.k + ')');
        }
        $('.btn-show-svg').click(function () {
            var path = d3.geoPath();
            var demo = {
                "type": "FeatureCollection",
                "features": [
                    {
                        "type": "Feature",
                        "properties": {},
                        "geometry": {
                            "type": "Polygon",
                            "coordinates": [
                                [
                                    [
                                        111.68701171875,
                                        42.956422511073335
                                    ],
                                    [
                                        107.40234375,
                                        40.06125658140474
                                    ],
                                    [
                                        110.28076171875,
                                        39.99395569397331
                                    ],
                                    [
                                        109.92919921875,
                                        37.50972584293751
                                    ],
                                    [
                                        112.8076171875,
                                        37.59682400108367
                                    ],
                                    [
                                        114.169921875,
                                        40.6306300839918
                                    ],
                                    [
                                        111.68701171875,
                                        42.956422511073335
                                    ]
                                ]
                            ]
                        }
                    }
                ]
            };
            var demodata = path(demo);
            var zoom = d3.zoom().scaleExtent([0.2, 10]).on("zoom", zoomFunction);
            //var svg2 = d3.select("#abc123").append("svg")
            //    .attr("width", 1200)
            //    .attr("height", 800);
            //var svgPath = svg2.append("path").attr("stroke", "blue").attr("stroke-width", "4px");
            var svg = d3.select("#abc123").append("svg")
                //.attr("width", 1200)
                //.attr("height", 800)
                .style("border", "2px solid steelblue")
                .call(zoom);
            var usaSVG = svg
                .append("path")
                .attr("stroke", "FF00FF")
                .attr("stroke-width", "1px")
                .attr("d", demodata);
            //svgPath.attr("d", demodata);
            //var svgz = document.getElementById("svg");
            //var serializer = new XMLSerializer();
            //var source = serializer.serializeToString(svgz);
            //if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
            //    source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
            //}
            //if (!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
            //    source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
            //}
            //source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

            //var url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);
            //document.getElementById("myAnchor").href = url;
            var a = document.createElement('a');
            a.href = 'data:image/svg;utf8,' + unescape($('svg')[0].outerHTML);
            a.download = 'plot.svg';
            a.target = '_blank';
            document.body.appendChild(a); a.click(); document.body.removeChild(a);
        });


        $(".tatMenuLeft").click(function () {
            $(".menu-district").removeClass("open-menu").addClass("close-menu");
            $("#map").removeClass("defective").addClass("full");
        });
        $("#show-sidebar").click(function () {
            $(".menu-district").removeClass("close-menu").addClass("open-menu");
            $("#map").removeClass("full").addClass("defective");
        });

        $(document).on('click', '.has-children, .has-children-child', function (e, string) {
            let id = $(this).attr('data-id');
            let kind = $(this).attr('data-kind');
            let code = $(this).attr('data-code');
            if (MenuLeft.GLOBAL.checkparent || MenuLeft.GLOBAL.isListXa) {
                if (typeof code !== undefined && code.length > 2) {
                    if (ViewMap.CONSTS.codeDefault != code || MenuLeft.GLOBAL.checkSelectAll) {
                        if (code.length > 3) {
                            setTimeout(function () {
                                map.setTileFeatureFilterCode(code);
                                ViewMap.CONSTS.codeDefault = code;
                                ViewMap.showHideViewProperty(false);
                                $(ViewMap.SELECTORS.advSearch).removeClass("advSearchIndex");
                                ViewMap.resetSearchAdv();
                            }, 1);

                            if ($("[data-id=tothua-" + id + "]")[0].innerHTML == '') {
                                var lstto = MenuLeft.loadListTo(code);
                                if (lstto != null && lstto.length > 0) {
                                    var html2 = '';
                                    for (var iq = 0; iq < lstto.length; iq++) {
                                        html2 += `<li class="has-children-child-tothua" data-code-to="${code}-${lstto[iq]}" >
                                    <a href="#"><i class="fa fa-circle-o" style="width:20px;"></i>Tờ ${lstto[iq]}
                                    </a>
                                </li>`;
                                    }
                                }
                                var idtothua = 'tothua-' + id;
                                $("#" + idtothua).append(html2);
                            }
                            if (MenuLeft.GLOBAL.idSelect != null && MenuLeft.GLOBAL.idSelect != '') {
                                var elementold = document.getElementById(MenuLeft.GLOBAL.idSelect);
                                elementold.style.background = '';
                            }
                            $("[data-code=" + ViewMap.CONSTS.codeDefault + "]").css('background', '');
                            $(".has-all-map").css('background', '');
                            var elementnew = document.getElementById(id);
                            elementnew.style.background = 'rgba(33, 152, 241, 0.3)';
                            MenuLeft.GLOBAL.idSelect = id;
                            //// UpdateURL
                            UpdateUrl(null, null, null, code, null, null);
                            $('.has-children-child').removeClass('children-selected');
                            $('.tree-view-menu-to').css('display', 'none');
                            if (!($('.sidebar-mini').hasClass('sidebar-collapse'))) {
                                $("#" + id).addClass('children-selected');
                                $("[data-id=tothua-" + id + "]").css('display', 'block');
                            }
                            MenuLeft.GLOBAL.checklistTo = true;
                        }
                        //var iconid = 'icon-' + id;
                        //if (kind == "parent") {
                        //    var element = document.getElementById(iconid);
                        //    var elementspan = element.className;
                        //    if (elementspan == "fa fa-chevron-down") {
                        //        $("#" + iconid).removeClass('fa fa-chevron-down').addClass('fa fa-chevron-left');
                        //        $("#child-" + id).css("display", "none");
                        //        MenuLeft.GLOBAL.selectedUl = null;
                        //    }
                        //    else {
                        //        $("#" + iconid).removeClass('fa fa-chevron-left').addClass('fa fa-chevron-down');
                        //        var child = "#child-" + id;
                        //        var childid = "child-" + id;
                        //        $(child).removeAttr("style");
                        //        if (document.getElementById(childid).innerHTML == "" && code.length <= 9) {
                        //            setTimeout(function () { MenuLeft.showDistrictChild(id, child); }, 1);
                        //        }

                        //        var idnow = 'icon-' + MenuLeft.GLOBAL.selectedUl;
                        //        if (MenuLeft.GLOBAL.selectedUl != null) {
                        //            $("#" + idnow).removeClass('fa fa-chevron-down').addClass('fa fa-chevron-left');
                        //            $("#child-" + MenuLeft.GLOBAL.selectedUl).css("display", "none");
                        //        }
                        //        MenuLeft.GLOBAL.selectedUl = id;
                        //    }
                        //}

                        if (string == undefined) {
                            setTimeout(function () {
                                MenuLeft.fitBoundPlaceSelect(code);
                                map.setTileFeatureFilterCode(code);
                            }, 2);
                        } else {
                            if (string == "url-parent") {
                                $(".has-children").css('background', '');
                                $(".has-children").removeClass('menu-open');
                                $(".treeview-menu").css('display', 'none');
                                $("#" + id).addClass('menu-open');
                                $("#" + id).children().last().css('display', 'block');
                            }
                        }
                        ViewMap.removeSelectThuaDat();
                        MenuLeft.GLOBAL.checkSelectAll = false;
                        $(".has-all-map").css('background', '');
                        $(".has-children-child-tothua").css('background', '');
                    } else {
                        console.log('aa');
                        setTimeout(function () {
                            //if ($("[data-code=" + code + "]")[0].attributes.style == undefined || $("[data-code=" + code + "]")[0].attributes.style.value == "") {
                            MenuLeft.fitBoundPlaceSelect(code);
                            map.setTileFeatureFilterCode(code);
                            //}

                            $("[data-code=" + code + "]").css('background', 'rgba(33, 152, 241, 0.3)');
                            $(".has-all-map").css('background', '');
                            if (code.length > 3) {
                                if ($("[data-id=tothua-" + id + "]")[0].innerHTML == '') {
                                    var lstto = MenuLeft.loadListTo(code);
                                    if (lstto != null && lstto.length > 0) {
                                        var html2 = '';
                                        for (var iq = 0; iq < lstto.length; iq++) {
                                            html2 += `<li class="has-children-child-tothua" data-code-to="${code}-${lstto[iq]}" >
                                    <a href="#"><i class="fa fa-circle-o" style="width:20px;"></i>Tờ ${lstto[iq]}
                                    </a>
                                </li>`;
                                        }
                                    }
                                    var idtothua = 'tothua-' + id;
                                    $("#" + idtothua).append(html2);
                                }
                                if (MenuLeft.GLOBAL.checklistTo) {
                                    if (string == undefined) {
                                        $('.has-children-child').removeClass('children-selected');
                                        $('.tree-view-menu-to').css('display', 'none');
                                    }
                                    MenuLeft.GLOBAL.checklistTo = false;
                                } else {
                                    $('.has-children-child').removeClass('children-selected');
                                    $('.tree-view-menu-to').css('display', 'none');
                                    if (!($('.sidebar-mini').hasClass('sidebar-collapse'))) {
                                        $("#" + id).addClass('children-selected');
                                        $("[data-id=tothua-" + id + "]").css('display', 'block');
                                    }
                                    MenuLeft.GLOBAL.checklistTo = true;
                                }
                            }
                        }, 1);
                        $(".has-children-child-tothua").css('background', '');
                    }
                } else {
                    $(".has-children").css('background', '');
                    $(".has-all-map").css('background', 'rgba(33, 152, 241, 0.3)');
                    map.setTileFeatureFilterCode("all");
                    if (string == undefined) {
                        RemoveUrlCode();
                        ViewMap.showHideViewProperty(false);
                    }

                    ViewMap.removeSelectThuaDat();
                    MenuLeft.GLOBAL.checkSelectAll = true;
                    $(".has-children-child-tothua").css('background', '');
                }
            } else {
                MenuLeft.GLOBAL.checkparent = true;
            }
            if (code.length > 3) {
                e.stopPropagation();
                setTimeout(function () {
                    if (window.location.hash == "") {
                        window.location.hash = MenuLeft.GLOBAL.hashlink;
                    }
                }, 200);
            }
        });

        $(document).on('click', '.has-children-child-tothua', function (e) {
            e.stopPropagation();
            let codeto = $(this).attr('data-code-to');
            map.setTileFeatureFilterCode(codeto);
            ViewMap.removeSelectThuaDat();
            ViewMap.showHideViewProperty(false);
            setTimeout(function () {
                if (window.location.hash == "") {
                    window.location.hash = MenuLeft.GLOBAL.hashlink;
                }
            }, 200);
            $(".has-children-child-tothua").css('background', '');
            $("[data-code-to=" + codeto + "]").css('background', 'rgba(119, 238, 407, 0.3)');
            MenuLeft.findTo(codeto.split("-")[0], codeto.split("-")[1]);
        });
    },
    loadMenu: function () {
        $.ajax({
            type: "GET",
            url: ViewMap.GLOBAL.url + "/v2/api/admin-level/children",
            data: {
                parentId: MenuLeft.CONSTS.parentIdDefault,
                key: ViewMap.CONSTS.key
            },
            beforeSend: function () {
                ViewMap.showLoading(true);
            },
            success: function (data) {
                console.log(data);
                if (data.code == "ok" && data.result != null && data.result.length > 0) {
                    //let html = '';
                    let html2 = '';
                    let selecthtml = '';
                    for (var i = 0; i < data.result.length; i++) {
                        //html += `<li class="has-children" id="${data.result[i].id}" data-id="${data.result[i].id}" data-code="${data.result[i].code}" data-kind="parent">
                        //            <input type="checkbox" class="input-checkbox" data-id="${data.result[i].id}">
                        //            <label id="label-menu-left">${data.result[i].description} ${data.result[i].name}`;
                        html2 += `<li class="treeview has-children" id="${data.result[i].id}" data-id="${data.result[i].id}" data-code="${data.result[i].code}" data-kind="parent">
                                    <a href="#">
                                        <i class="fa fa-circle-o text-blue"></i>
                                        <span>${data.result[i].description} ${data.result[i].name}</span>`;
                        if (data.result[i].code.length <= 3) {
                            //html += `<i class="fa fa-chevron-left" id="icon-${data.result[i].id}" style="padding-left:12px; float:right;"></i>`;
                            //MenuLeft.GLOBAL.loadAllDropdownlist = false;
                            //MenuLeft.GLOBAL.lstDropdownlist.push(data.result[i].id);
                            var lst = ViewMap.loadDropdownlistSearchAdv(data.result[i].id, null);
                            if (lst != null) {
                                html2 += `<span class="pull-right-container">
                                              <i class="fa fa-angle-left pull-right"></i>
                                            </span>`;
                                html2 += `</a>`;
                                html2 += `<ul class="treeview-menu" data-id="${data.result[i].id}" style="display: none;">`;
                                for (var ip = 0; ip < lst.length; ip++) {
                                    html2 += `<li class="has-children-child" id="${lst[ip].id}" data-id="${lst[ip].id}" data-code="${lst[ip].code}" data-kind="child"><a href="#"><i class="fa fa-circle-o"></i>${lst[ip].description} ${lst[ip].name}</a></li>`;
                                    if (lst[ip].code == ViewMap.CONSTS.codeDefault) {
                                        html2 = html2.replace(`class="treeview has-children" id="${data.result[i].id}" data-id="${data.result[i].id}" data-code="${data.result[i].code}" data-kind="parent"`, `class="treeview has-children menu-open" id="${data.result[i].id}" data-id="${data.result[i].id}" data-code="${data.result[i].code}" data-kind="parent"`);
                                        html2 = html2.replace(`<ul class="treeview-menu" data-id="${data.result[i].id}" style="display: none;">`, `<ul class="treeview-menu" data-id="${data.result[i].id}" style="display: block;">`);
                                    }
                                }
                                html2 += `</ul>`;
                            }
                        } else {
                            //html += `<i class="fa fa-chevron-left" id="icon-${data.result[i].id}" style="padding-left:12px; float:right;display:none;"></i>`;
                            selecthtml += `<option value="${data.result[i].code}">
                                        ${data.result[i].description} ${data.result[i].name}
                                    </option>`;
                            html2 += `</a>`;
                        }
                        //html += `</label>
                        //        </li>
                        //        <ul id="child-${data.result[i].id}" class="cd-accordion-menu-child"  style="display:none;"></ul>`;
                        html2 += `</li>`;
                        if (data.result[i].code == ViewMap.CONSTS.codeDefault) {
                            MenuLeft.GLOBAL.idSelect = data.result[i].id;
                        }
                    }
                    //$(MenuLeft.SELECTORS.menuList).append(html);
                    $(MenuLeft.SELECTORS.loadMenuLeftThuaDat).append(html2);
                    $(ViewMap.SELECTORS.lstSelectSearch).append(selecthtml);
                    let codeSelectedDefault = ViewMap.SELECTORS.lstSelectSearch + ` option[value=${ViewMap.CONSTS.codeDefault}]`;
                    $(codeSelectedDefault).attr('selected', 'selected');
                    $("[data-code=" + ViewMap.CONSTS.codeDefault + "]").css('background', 'rgba(33, 152, 241, 0.3)');
                    if ($("[data-code=" + ViewMap.CONSTS.codeDefault + "]").length > 0) {
                        MenuLeft.GLOBAL.checklistTo = true;
                    }
                } else {
                    swal({
                        title: "Thông báo",
                        text: "Lỗi! Không lấy được dữ liệu địa chính",
                        icon: "error",
                        button: "Đóng",
                    }).then((value) => {
                    });
                }
                ViewMap.showLoading(false);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                let messageErorr = AppCommon.getMessageErrorReuqest(jqXHR, errorThrown);
                console.log(messageErorr);
                ViewMap.showLoading(false);
            }
        });
    },
    fitBoundPlaceSelect: function (code) {
        //ViewMap.showLoading(true);
        $.ajax({
            type: "GET",
            url: ViewMap.GLOBAL.url + "/v2/api/admin-level/code",
            data: {
                code: code,
                key: ViewMap.CONSTS.key
            },
            success: function (data) {
                console.log(data);
                if (data.code == "ok" && data.result != null && data.result != null && data.result.features.length > 0) {

                    //let ListPolyline = [];
                    //for (var iz = 0; iz < data.result.features[0].geometry.coordinates.length; iz++) {
                    //    for (var i = 0; i < data.result.features[0].geometry.coordinates[iz].length; i++) {
                    //        polyline = new map4d.Polyline({
                    //            path: data.result.features[0].geometry.coordinates[iz][i],
                    //            strokeColor: "#00ffff",
                    //            strokeOpacity: 1.0,
                    //            strokeWidth: 2
                    //        });
                    //        polyline.setMap(map);
                    //        ListPolyline.push(polyline);
                    //    }
                    //}
                    //MenuLeft.GLOBAL.ListPolylineMenu = ListPolyline;
                    let latLngBounds = new map4d.LatLngBounds();
                    let paddingOptions = {
                        top: 10,
                        bottom: 10,
                        left: 10,
                        right: 10
                    };
                    for (var ip = 0; ip < data.result.features[0].geometry.coordinates.length; ip++) {
                        for (var im = 0; im < data.result.features[0].geometry.coordinates[ip].length; im++) {
                            for (var izm = 0; izm < data.result.features[0].geometry.coordinates[ip][im].length; izm++) {
                                latLngBounds.extend(data.result.features[0].geometry.coordinates[ip][im][izm]);
                            }
                        }
                    }
                    map.fitBounds(latLngBounds, paddingOptions, null);
                    var camera = map.getCamera();
                    let ICameraPosition = { target: camera.target/*{ lat: parseFloat(lat), lng: parseFloat(lng) }*/, zoom: 16 };
                    map.moveCamera(ICameraPosition);
                } else {
                    swal({
                        title: "Thông báo",
                        text: "Không lấy được dữ liệu địa chính",
                        icon: "error",
                        button: "Đóng",
                    }).then((value) => {
                    });
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                let messageErorr = AppCommon.getMessageErrorReuqest(jqXHR, errorThrown);
                console.log(messageErorr);
                ViewMap.showLoading(false);
            }
        });
    },
    showDistrictChild: function (parentid, elementid) {
        $.ajax({
            type: "GET",
            url: ViewMap.GLOBAL.url + "/v2/api/admin-level/children",
            async: true,
            data: {
                parentId: parentid,
                key: ViewMap.CONSTS.key
            },
            success: function (data) {
                console.log(data);
                if (data.code == "ok" && data.result != null && data.result.length > 0) {
                    let html = '';
                    for (var i = 0; i < data.result.length; i++) {
                        html += `<li class="has-children-child" id="${data.result[i].id}" data-id="${data.result[i].id}" data-code="${data.result[i].code}" data-kind="child">
                                                <input type="checkbox" class="input-checkbox" data-id="${data.result[i].id}">
                                                 <label id="label-menu-left">${data.result[i].description} ${data.result[i].name}</label>
                                            </li>`;
                    }
                    $(elementid).append(html);
                } else {
                    document.getElementById(iconid).style.display = "none";
                    $('#' + id).attr("data-kind", "child");
                }
                ViewMap.showLoading(false);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                let messageErorr = AppCommon.getMessageErrorReuqest(jqXHR, errorThrown);
                console.log(messageErorr);
                ViewMap.showLoading(false);
            }
        });
    },
    loadMenuByListHuyenNguoiDung: function () {
        ViewMap.showLoading(true);
        if (lstHuyenNguoiDung.Genre == "Huyện") {
            let html2 = '';
            for (var i = 0; i < lstHuyenNguoiDung.ListHuyenXaNguoiDungs.length; i++) {
                html2 += `<li class="treeview has-children" id="${lstHuyenNguoiDung.ListHuyenXaNguoiDungs[i].Id}" data-id="${lstHuyenNguoiDung.ListHuyenXaNguoiDungs[i].Id}" data-code="${lstHuyenNguoiDung.ListHuyenXaNguoiDungs[i].Code}" data-kind="parent">
                                    <a href="#">
                                        <i class="fa fa-circle-o text-blue"></i>
                                        <span title="${lstHuyenNguoiDung.ListHuyenXaNguoiDungs[i].NameKVHC}">${lstHuyenNguoiDung.ListHuyenXaNguoiDungs[i].NameKVHC}</span>`;
                var lst = ViewMap.loadDropdownlistSearchAdv(null, lstHuyenNguoiDung.ListHuyenXaNguoiDungs[i].Code);
                if (lst != null) {
                    html2 += `<span class="pull-right-container">
                                              <i class="fa fa-angle-left pull-right"></i>
                                            </span>`;
                    html2 += `</a>`;
                    html2 += `<ul class="treeview-menu" data-id="${lstHuyenNguoiDung.ListHuyenXaNguoiDungs[i].Id}" style="display: none;">`;
                    for (var ip = 0; ip < lst.length; ip++) {
                        html2 += `<li class="has-children-child" id="${lst[ip].id}" data-id="${lst[ip].id}" data-code="${lst[ip].code}" data-kind="child">
                                    <a href="#" title="${lst[ip].description} ${lst[ip].name}"><i class="fa fa-circle-o"></i>${lst[ip].description} ${lst[ip].name}
                                        <span class="pull-right-container">
                                              <i class="fa fa-angle-left pull-right"></i>
                                            </span>
                                    </a>
                                </li>`;
                        var lstto = this.loadListTo(lst[ip].code);
                        html2 += `<ul class="tree-view-menu-to" data-id="tothua-${lst[ip].id}" style="display: none;">`;
                        if (lstto != null && lstto.length > 0) {
                            for (var iq = 0; iq < lstto.length; iq++) {
                                html2 += `<li class="has-children-child-tothua" data-code-to="${lst[ip].code}-${lstto[iq]}" >
                                    <a href="#"><i class="fa fa-circle-o" style="width:20px;"></i>Tờ ${lstto[iq]}
                                    </a>
                                </li>`;
                            }
                        }
                        html2 += `</ul>`;
                        if (lst[ip].code == ViewMap.CONSTS.codeDefault) {
                            html2 = html2.replace(`class="treeview has-children" id="${lstHuyenNguoiDung.ListHuyenXaNguoiDungs[i].Id}" data-id="${lstHuyenNguoiDung.ListHuyenXaNguoiDungs[i].Id}" data-code="${lstHuyenNguoiDung.ListHuyenXaNguoiDungs[i].Code}" data-kind="parent"`
                                , `class="treeview has-children menu-open" id="${lstHuyenNguoiDung.ListHuyenXaNguoiDungs[i].Id}" data-id="${lstHuyenNguoiDung.ListHuyenXaNguoiDungs[i].Id}" data-code="${lstHuyenNguoiDung.ListHuyenXaNguoiDungs[i].Code}" data-kind="parent"`);
                            html2 = html2.replace(`<ul class="treeview-menu" data-id="${lstHuyenNguoiDung.ListHuyenXaNguoiDungs[i].Id}" style="display: none;">`, `<ul class="treeview-menu" data-id="${lstHuyenNguoiDung.ListHuyenXaNguoiDungs[i].Id}" style="display: block;">`);
                        }
                    }
                    html2 += `</ul>`;
                }
                html2 += `</li>`;
            }
            $(MenuLeft.SELECTORS.loadMenuLeftThuaDat).append(html2);
        } else {
            if (lstHuyenNguoiDung.Genre == "Xã") {
                let listHuyen = lstHuyenNguoiDung.ListHuyenXaNguoiDungs.filter(x => x.MaKVHC.length == 5)
                if (listHuyen.length > 0) {
                    MenuLeft.showHtmlHuyenXa(lstHuyenNguoiDung);
                } else {
                    let html2 = '';
                    for (var iz = 0; iz < lstHuyenNguoiDung.ListHuyenXaNguoiDungs.length; iz++) {
                        html2 += `<li class="treeview has-children" id="${lstHuyenNguoiDung.ListHuyenXaNguoiDungs[iz].Id}" data-id="${lstHuyenNguoiDung.ListHuyenXaNguoiDungs[iz].Id}" data-code="${lstHuyenNguoiDung.ListHuyenXaNguoiDungs[iz].Code}" data-kind="parent">
                                    <a href="#">
                                        <i class="fa fa-circle-o text-blue"></i>
                                        <span>${lstHuyenNguoiDung.ListHuyenXaNguoiDungs[iz].NameKVHC}</span>`;
                        html2 += `</a></li>`;
                    }
                    $(MenuLeft.SELECTORS.loadMenuLeftThuaDat).append(html2);
                    MenuLeft.GLOBAL.isListXa = true;
                }
            }
        }
        let codeSelectedDefault = ViewMap.SELECTORS.lstSelectSearch + ` option[value=${ViewMap.CONSTS.codeDefault}]`;
        $(codeSelectedDefault).attr('selected', 'selected');
        $("[data-code=" + ViewMap.CONSTS.codeDefault + "]").css('background', 'rgba(33, 152, 241, 0.3)');
        if ($("[data-code=" + ViewMap.CONSTS.codeDefault + "]").length > 0) {
            let id = $("[data-code=" + ViewMap.CONSTS.codeDefault + "]").attr('id');
            $("#" + id).addClass('children-selected');
            $("[data-id=tothua-" + id + "]").css('display', 'block');
            if ($("[data-id=tothua-" + id + "]")[0].innerHTML == '') {
                var tolst = MenuLeft.loadListTo(ViewMap.CONSTS.codeDefault);
                if (tolst != null && tolst.length > 0) {
                    var html2 = '';
                    for (var iq2 = 0; iq2 < tolst.length; iq2++) {
                        html2 += `<li class="has-children-child-tothua" data-code-to="${ViewMap.CONSTS.codeDefault}-${tolst[iq2]}" >
                                    <a href="#"><i class="fa fa-circle-o" style="width:20px;"></i>Tờ ${tolst[iq2]}
                                    </a>
                                </li>`;
                    }
                }
                var idtothua = 'tothua-' + id;
                $("#" + idtothua).append(html2);
            }

        }
        setTimeout(function () {
            ViewMap.showLoading(false);
        }, 200);
        MenuLeft.GLOBAL.checklistTo = true;
    },
    loadListTo: function (parentcode) {
        var result = null;
        $.ajax({
            type: "GET",
            url: ViewMap.GLOBAL.url + "/v2/api/land/soto",
            data: {
                code: parentcode,
                key: ViewMap.CONSTS.key
            },
            async: false,
            success: function (data) {
                if (data.code == "ok" && data.result != null && data.result.length > 0) {
                    result = data.result.filter(x => x > 0).sort(MenuLeft.sortNumber);
                } else {
                    swal({
                        title: "Thông báo",
                        text: "Lỗi! Không lấy được dữ liệu danh sách các tờ bản đồ",
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
    sortNumber: function (a, b) {
        return a - b;
    },
    findTo: function (Code, To) {
        $.ajax({
            type: "GET",
            url: ViewMap.GLOBAL.url + "/v2/api/land/find",
            data: {
                code: Code,
                soTo: To,
                key: ViewMap.CONSTS.key
            },
            async: true,
            success: function (data) {
                if (data.code == "ok" && data.result != null && data.result.features.length > 0) {
                    var location;
                    var datare = data.result.features[0];
                    if (datare.geometry.type == "MultiPolygon") {
                        location = datare.geometry.coordinates[0][0][0];
                    } else {
                        if (datare.geometry.type == "Polygon") {
                            location = datare.geometry.coordinates[0][0];
                        }
                    }
                    
                    if (location != null) {
                        var camera = map.getCamera();
                        camera.setTarget({ lng: location[0], lat: location[1] });
                        camera.setZoom(19);
                        map.moveCamera(camera);
                    }
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                let messageErorr = AppCommon.getMessageErrorReuqest(jqXHR, errorThrown);
                console.log(messageErorr);
            }
        });
    },
    showHtmlHuyenXa: function (lstHuyenNguoiDung) {
        let html2 = '';
        let listHuyen = lstHuyenNguoiDung.ListHuyenXaNguoiDungs.filter(x => x.MaKVHC.length == 5);
        for (var i = 0; i < listHuyen.length; i++) {
            let code = listHuyen[i].MaKVHC.substring(2, 5);
            html2 += `<li class="treeview has-children" id="${listHuyen[i].Id}" data-id="${listHuyen[i].Id}" data-code="${code}" data-kind="parent">
                                    <a href="#">
                                        <i class="fa fa-circle-o text-blue"></i>
                                        <span title="${listHuyen[i].NameKVHC}">${listHuyen[i].NameKVHC}</span>`;
            var lst = ViewMap.loadDropdownlistSearchAdv(null, code);
            if (lst != null) {
                html2 += `<span class="pull-right-container">
                                              <i class="fa fa-angle-left pull-right"></i>
                                            </span>`;
                html2 += `</a>`;
                html2 += `<ul class="treeview-menu" data-id="${listHuyen[i].Id}" style="display: none;">`;
                for (var ip = 0; ip < lst.length; ip++) {
                    html2 += `<li class="has-children-child" id="${lst[ip].id}" data-id="${lst[ip].id}" data-code="${lst[ip].code}" data-kind="child">
                                    <a href="#" title="${lst[ip].description} ${lst[ip].name}"><i class="fa fa-circle-o"></i>${lst[ip].description} ${lst[ip].name}
                                        <span class="pull-right-container">
                                              <i class="fa fa-angle-left pull-right"></i>
                                            </span>
                                    </a>
                                </li>`;
                    //var lstto = this.loadListTo(lst[ip].code);
                    html2 += `<ul class="tree-view-menu-to" data-id="tothua-${lst[ip].id}" id="tothua-${lst[ip].id}" style="display: none;">`;
                    //if (lstto != null && lstto.length > 0) {
                    //    for (var iq = 0; iq < lstto.length; iq++) {
                    //        html2 += `<li class="has-children-child-tothua" data-code-to="${lst[ip].code}-${lstto[iq]}" >
                    //                <a href="#"><i class="fa fa-circle-o" style="width:20px;"></i>Tờ ${lstto[iq]}
                    //                </a>
                    //            </li>`;
                    //    }
                    //}
                    html2 += `</ul>`;
                    if (lst[ip].code == ViewMap.CONSTS.codeDefault) {
                        html2 = html2.replace(`class="treeview has-children" id="${listHuyen[i].Id}" data-id="${listHuyen[i].Id}" data-code="${code}" data-kind="parent"`
                            , `class="treeview has-children menu-open" id="${listHuyen[i].Id}" data-id="${listHuyen[i].Id}" data-code="${code}" data-kind="parent"`);
                        html2 = html2.replace(`<ul class="treeview-menu" data-id="${listHuyen[i].Id}" style="display: none;">`, `<ul class="treeview-menu" data-id="${listHuyen[i].Id}" style="display: block;">`);
                    }
                }
                html2 += `</ul>`;
            } else {
                html2 += `</a>`;
            }
            html2 += `</li>`;
        }
        $(MenuLeft.SELECTORS.loadMenuLeftThuaDat).append(html2);
    },
    SortByName: function (x, y) {
        return ((x.name == y.name) ? 0 : ((x.name > y.name) ? 1 : -1));
    },

};