var ToolShape = {
    GLOBAL: {
        isStartDistance: false,
        isStartArea: false,
        listDistance: {
            listMarkerDistance: [],
            listPolylineDistance: [],
            listMerterDistance: [],
        },
        listArea: {
            listMarkerArea: [],
            listMerterArea: [],
            polygonArea: null,
            PolylineArea: null,
        },
        polylineTemp: null,
    },
    CONSTS: {
    },
    SELECTORS: {
        btnExportFile: ".btn-export-file",
        btnPrint: ".btn-print",
        btnUpdateFile: ".btn-update-file",
        btnUpdateShape: ".btn-update-shape",
        btnRuleDistance: ".draw-width-height",
        btnRuleArea: ".draw-area",
        btnRuleReplay: ".draw-replay",
        btnExportMultiFile: ".btn-export-multi-file",
        btnDownloadFile: ".btn-download-file",
        modalTrichXuat: ".modal-trich-xuat",
        inputMaXa: "input[name='MaXa']",
        selectVungSoTo: "select[name='VungSoTo']",
        selectVungSoThua: "select[name='VungSoThua']",
        inputSoTo: "input[name='SoTo']",
        inputSoThua: "input[name='SoThua']",
        inputCommon: ".common-so input",
    },
    init: function () {
        ToolShape.setEvent();
    },
    setEvent: function () {
        listMarkerDrawLoDat = [];
        listDataFloor = [{
            objectId: "default",
            objectModel: null,
            polygon: null,
            marker: [],
            area: 0,
        }];
        markerMeter = null;
        $(ToolShape.SELECTORS.btnExportFile).on("click", function () {
            ToolShape.selectExportFileShape();
        });
        $(ToolShape.SELECTORS.btnRuleDistance).on("click", function () {
            if (!ToolShape.GLOBAL.isStartDistance) {
                ToolShape.setShowHideDistance(true);
            }
            $(ViewMap.SELECTORS.inforThuaDat).addClass('detail-property-collapse');
            ViewMap.removeSelectThuaDat();
        });
        $(ToolShape.SELECTORS.btnRuleArea).on("click", function () {
            if (!ToolShape.GLOBAL.isStartArea) {
                ToolShape.setShowHideArea(true);
            }
            $(ViewMap.SELECTORS.inforThuaDat).addClass('detail-property-collapse');
            ViewMap.removeSelectThuaDat();
        });
        $(ToolShape.SELECTORS.btnRuleReplay).on("click", function () {
            ToolShape.replayRuleShape();
        });
        $(ToolShape.SELECTORS.btnExportMultiFile).on("click", function () {
            $(ToolShape.SELECTORS.modalTrichXuat).modal('show');
            let data = ViewMap.GLOBAL.commonData;
            $(ToolShape.SELECTORS.inputMaXa).val(data.features[0].properties.MaXa);
        });
        //$(ToolShape.SELECTORS.btnDownloadFile).on("click", function () {
        //    if (ToolShape.checkFormTrichXuat()) {
        //        let data = {
        //            vungSoTo: $(ToolShape.SELECTORS.selectVungSoTo).val(),
        //            soTo: $(ToolShape.SELECTORS.inputSoTo).val(),
        //            vungSoThua: $(ToolShape.SELECTORS.selectVungSoThua).val(),
        //            soThua: $(ToolShape.SELECTORS.inputSoThua).val(),
        //            type: "SHP",
        //        }
        //        ToolShape.getListThuaDat();
        //    }
        //});
        $(ToolShape.SELECTORS.inputCommon).on("focus", function () {
            insertError($(this), "remove");
        });
        let eventMouseMove = map.addListener("mouseMove", (args) => {
            if (ToolShape.GLOBAL.isStartDistance && ToolShape.GLOBAL.listDistance.listMarkerDistance.length > 0) {
                let path = [];
                let listMarker = ToolShape.GLOBAL.listDistance.listMarkerDistance;
                let endPoint = [listMarker[listMarker.length - 1].getPosition().lng, listMarker[listMarker.length - 1].getPosition().lat];
                let mousePoint = [args.location.lng, args.location.lat];
                path.push(endPoint);
                path.push(mousePoint);
                ToolShape.createPolylineByMouseMoveLoDat(path, 3.0, 0.7);
                ToolShape.ShowMeterDraw(endPoint, mousePoint, true);
            }
            if (ToolShape.GLOBAL.isStartArea && ToolShape.GLOBAL.listArea.listMarkerArea.length > 0) {
                let path = [];
                let listMarker = ToolShape.GLOBAL.listArea.listMarkerArea;
                let endPoint = [listMarker[listMarker.length - 1].getPosition().lng, listMarker[listMarker.length - 1].getPosition().lat];
                let mousePoint = [args.location.lng, args.location.lat];
                path.push(endPoint);
                path.push(mousePoint);
                ToolShape.createPolylineByMouseMoveLoDat(path, 3.0, 0.7);
                ToolShape.ShowMeterDraw(endPoint, mousePoint, true);
            }
            if ((!ToolShape.GLOBAL.isStartDistance && !ToolShape.GLOBAL.isStartArea) && ToolShape.GLOBAL.polylineTemp != null) {
                ToolShape.GLOBAL.polylineTemp.setMap(null);
            }
        });
        let eventClickMap = map.addListener("click", (args) => {
            if (ToolShape.GLOBAL.isStartDistance) {
                ToolShape.createMarkerDrawLoDat(args.location.lat, args.location.lng, false);
                if (ToolShape.GLOBAL.listDistance.listMarkerDistance.length > 1) {
                    let iLatLng = [];
                    $.each(ToolShape.GLOBAL.listDistance.listMarkerDistance, function () {
                        let latLng = { lat: this.getPosition().lat, lng: this.getPosition().lng };
                        iLatLng.push(latLng);
                    });
                    ToolShape.createPolylineLoDat(iLatLng, 3.0, 1.0, true);
                }
            }
            if (ToolShape.GLOBAL.isStartArea) {
                ToolShape.createMarkerDrawLoDat(args.location.lat, args.location.lng, true);
                if (ToolShape.GLOBAL.listArea.listMarkerArea.length > 1) {
                    let iLatLng = [];
                    $.each(ToolShape.GLOBAL.listArea.listMarkerArea, function () {
                        let latLng = { lat: this.getPosition().lat, lng: this.getPosition().lng };
                        iLatLng.push(latLng);
                    });
                    iLatLng.push(iLatLng[0]);
                    ToolShape.createPolygonArea(iLatLng);
                }
            }
        }, { map: true });
        let eventDoubleClickMap = map.addListener("dblClick", (args) => {
            if (ToolShape.GLOBAL.isStartDistance) {
                ToolShape.GLOBAL.isStartDistance = false;
                let list = ToolShape.GLOBAL.listDistance.listMerterDistance;
                let total = 0;
                $.each(list, function (i, obj) {
                    obj.setMap(map);
                    let merter = obj.getLabel().text;
                    total += ToolShape.splitStringDistance(merter);
                });
                let point = args.location;
                total = Math.round(total * 100) / 100
                ToolShape.showMerterTotal(point, total);
            }
            if (ToolShape.GLOBAL.isStartArea) {
                ToolShape.GLOBAL.isStartArea = false;
                ToolShape.GLOBAL.isStartDistance = false;
                let list = ToolShape.GLOBAL.listArea.listMerterArea;
                $.each(list, function (i, obj) {
                    obj.setMap(map);
                });
                if (ToolShape.GLOBAL.listArea.polygonArea != null && typeof ToolShape.GLOBAL.listArea.polygonArea != undefined) {
                    ToolShape.showMerterTotalArea();
                }
            }
        }, { marker: true });
        let eventClickDraw = map.addListener("click", (args) => {
            //Distance
            if (ToolShape.GLOBAL.isStartDistance) {
                ToolShape.createMarkerDrawLoDat(args.location.lat, args.location.lng, false);
                let listMarker = ToolShape.GLOBAL.listDistance.listMarkerDistance;
                let iLatLng = [];
                $.each(listMarker, function (i, obj) {
                    let latLng = { lat: obj.getPosition().lat, lng: obj.getPosition().lng };
                    iLatLng.push(latLng);

                });
                if (iLatLng.length > 1) {
                    let startPoint = [iLatLng[iLatLng.length - 2].lng, iLatLng[iLatLng.length - 2].lat];
                    let endPoint = [iLatLng[iLatLng.length - 1].lng, iLatLng[iLatLng.length - 1].lat];
                    ToolShape.ShowMeterDraw(startPoint, endPoint, false);
                }
                ToolShape.createPolylineLoDat(iLatLng, 3.0, 1.0, true);
            }
            //Area
            if (ToolShape.GLOBAL.isStartArea) {
                ToolShape.createMarkerDrawLoDat(args.location.lat, args.location.lng, true);
                let iLatLng = [];
                if (ToolShape.GLOBAL.listArea.listMarkerArea.length == 2) {
                    let listarea = ToolShape.GLOBAL.listArea.listMarkerArea;
                    $.each(listarea, function () {
                        let item = { lng: this.getPosition().lng, lat: this.getPosition().lat };
                        iLatLng.push(item);
                    })
                    //add marker merter
                    let startPoint = [iLatLng[iLatLng.length - 2].lng, iLatLng[iLatLng.length - 2].lat];
                    let endPoint = [iLatLng[iLatLng.length - 1].lng, iLatLng[iLatLng.length - 1].lat];
                    ToolShape.ShowMeterArea(startPoint, endPoint);
                    //drawing polyline
                    ToolShape.createPolylineLoDat(iLatLng, 3.0, 1.0, false);
                }
                else {
                    if (ToolShape.GLOBAL.listArea.listMarkerArea.length > 2) {
                        let listarea = ToolShape.GLOBAL.listArea.listMarkerArea;
                        //let iLatLng = [];
                        $.each(listarea, function () {
                            let latLng = { lng: this.getPosition().lng, lat: this.getPosition().lat };
                            iLatLng.push(latLng);
                        });
                        //add marker merter
                        let startPoint = [iLatLng[iLatLng.length - 2].lng, iLatLng[iLatLng.length - 2].lat];
                        let endPoint = [iLatLng[iLatLng.length - 1].lng, iLatLng[iLatLng.length - 1].lat];
                        ToolShape.ShowMeterArea(startPoint, endPoint);
                        //drawing polygon
                        iLatLng.push(iLatLng[0]);
                        ToolShape.createPolygonArea(iLatLng);
                        if (ToolShape.GLOBAL.listArea.PolylineArea != null) {
                            ToolShape.GLOBAL.listArea.PolylineArea.setMap(null);
                            ToolShape.GLOBAL.listArea.PolylineArea = null;
                        }
                    }
                }
            }
        }, { polyline: true });
        let eventClickPolygon = map.data.addListener("click", (args) => {
            if (ToolShape.GLOBAL.isStartDistance) {
                ToolShape.createMarkerDrawLoDat(args.location.lat, args.location.lng, false);
                if (ToolShape.GLOBAL.listDistance.listMarkerDistance.length > 1) {
                    let iLatLng = [];
                    $.each(ToolShape.GLOBAL.listDistance.listMarkerDistance, function () {
                        let latLng = { lat: this.getPosition().lat, lng: this.getPosition().lng };
                        iLatLng.push(latLng);
                    });
                    //iLatLng.push(iLatLng[0]);
                    ToolShape.createPolylineLoDat(iLatLng, 3.0, 1.0, true);
                }
            }
            if (ToolShape.GLOBAL.isStartArea) {
                ToolShape.createMarkerDrawLoDat(args.location.lat, args.location.lng, true);
                if (ToolShape.GLOBAL.listArea.listMarkerArea.length > 1) {
                    let iLatLng = [];
                    $.each(ToolShape.GLOBAL.listArea.listMarkerArea, function () {
                        let latLng = { lat: this.getPosition().lat, lng: this.getPosition().lng };
                        iLatLng.push(latLng);
                    });
                    iLatLng.push(iLatLng[0]);
                    ToolShape.createPolygonArea(iLatLng);
                }
            }
        });
    },
    selectExportFileShape: function () {
        bootbox.prompt({
            title: "Chọn file cần trích xuất",
            inputType: 'select',
            inputOptions: [
                {
                    text: 'Shape file',
                    value: 'SHP',
                },
                {
                    text: 'KML',
                    value: 'KML',
                },
                {
                    text: 'Text file',
                    value: 'TXT',
                }
            ],
            callback: function (result) {
                if (result != null) {
                    ToolShape.exportFileShape(result);
                }
            }
        });
    },
    exportFileShape: function (data) {
        if (ViewMap.GLOBAL.ThuaDatSelect != null) {
            //var ListPolyline = ViewMap.GLOBAL.ThuaDatSelect;
            //var id = ListPolyline[0].ObjectId;
            // var ThuaDat = ViewMap.GLOBAL.commonData;
            var shape = ToolShape.getShapeVN2000();
            switch (data) {
                case "TXT":
                    ToolShape.getExportFileTxt(JSON.stringify(shape), data);
                    break;
                case "SHP":
                    ToolShape.getExportFileShape(JSON.stringify(shape), data);
                    break;
                case "KML":
                    ToolShape.getExportFileShape(JSON.stringify(shape), data);
                    break;
                default:
                    break;
            }
        }
    },
    getShapeVN2000: function () {
        var shape;
        var data = ViewMap.GLOBAL.commonData;
        var objShape = [];
        $.each(data.features, function (i, obj) {
            if (obj.properties.info === "vn2000") {
                objShape.push(obj);
            }
        });
        shape = {
            "type": "FeatureCollection",
            "features": objShape,
        }
        return shape;
    },
    getExportFileShape: function (data, type) {
        var param = {
            category: type,
            shapeJson: data
        }
        $.ajax({
            url: "/Home/ExportFileShape",
            type: "POST",
            data: JSON.stringify(param),
            contentType: "application/json",
            dataType: "json",
            async: true,
            success: function (data) {
                if (data.code) {
                    window.location = `/Home/DownloadFile?filePath=${data.result}&type=${type}`;
                }
                else {
                    bootbox.alert("Dữ liệu không hợp lệ");
                }
                //if (data.code == "ok" && data.result.features != null && data.result.features.length > 0) {
                //    var objShape = []; //Object.assign({}, data.result);
                //    $.each(data.result.features, function (i, obj) {
                //        if (obj.properties.info === "vn2000") {
                //            objShape.push(obj);
                //        }
                //    });
                //    var shape = {
                //        "type": "FeatureCollection",
                //        "features": objShape,
                //    }
                //}
            },
            error: function (jqXHR, textStatus, errorThrown) {
                let messageErorr = AppCommon.getMessageErrorReuqest(jqXHR, errorThrown);
                console.log(messageErorr);
            }
        });
    },
    getExportFileTxt: function (data, type) {
        var munber = Date.parse(new Date());
        $("<a />", {
            "download": "ThuaDat_" + munber + ".txt",
            "href": "data:application/json;charset=utf-8," + encodeURIComponent(data),
        }).appendTo("body")
            .click(function () {
                $(this).remove()
            })[0].click()
    },
    //tool rule width/heigth and area
    //Tạo polyline lo dat
    createPolylineByMouseMoveLoDat: function (path, strokeWidth, strokeOpacity) {
        if (ToolShape.GLOBAL.polylineTemp != null) {
            ToolShape.GLOBAL.polylineTemp.setMap(null);
        }
        //tạo đối tượng polyline từ PolylineOptions
        ToolShape.GLOBAL.polylineTemp = new map4d.Polyline({
            path: path, visible: true, strokeColor: "#FF8264", strokeWidth: strokeWidth, strokeOpacity: strokeOpacity,
            closed: false
        })
        //thêm polyline vào map
        ToolShape.GLOBAL.polylineTemp.setMap(map)
    },
    ShowMeterDraw: function (endPoint, mousePoint, check) {
        let projection = new map4d.Projection(map)
        let screenCoordinate1 = projection.fromLatLngToScreen([endPoint[0], endPoint[1]]);
        let screenCoordinate2 = projection.fromLatLngToScreen([mousePoint[0], mousePoint[1]]);
        let x = (screenCoordinate1.x + screenCoordinate2.x) / 2;
        let y = (screenCoordinate1.y + screenCoordinate2.y) / 2;
        let latLngCoordinate = projection.fromScreenToLatLng({ x: x, y: y })
        let measure = new map4d.Measure([endPoint, mousePoint,]);
        let length = (Math.round(measure.length * 100) / 100).toString();
        if (check) {
            if (markerMeter != null) markerMeter.setMap(null);
            markerMeter = new map4d.Marker({
                position: { lat: latLngCoordinate.lat, lng: latLngCoordinate.lng },
                anchor: [0.5, 1],
                visible: true,
                label: new map4d.MarkerLabel({ text: length + " m", color: "000000", fontSize: 12 }),
                icon: new map4d.Icon(32, 32, ""),
            })
            markerMeter.setMap(map);
        } else {
            ToolShape.GLOBAL.listDistance.listMerterDistance.push(markerMeter);
            if (markerMeter != null) markerMeter.setMap(null);
        }
    },
    ShowMeterArea: function (endPoint, mousePoint) {
        let projection = new map4d.Projection(map)
        let screenCoordinate1 = projection.fromLatLngToScreen([endPoint[0], endPoint[1]]);
        let screenCoordinate2 = projection.fromLatLngToScreen([mousePoint[0], mousePoint[1]]);
        let x = (screenCoordinate1.x + screenCoordinate2.x) / 2;
        let y = (screenCoordinate1.y + screenCoordinate2.y) / 2;
        let latLngCoordinate = projection.fromScreenToLatLng({ x: x, y: y })
        let measure = new map4d.Measure([endPoint, mousePoint,]);
        let length = (Math.round(measure.length * 100) / 100).toString();
        if (markerMeter != null) markerMeter.setMap(null);
        markerMeter = new map4d.Marker({
            position: { lat: latLngCoordinate.lat, lng: latLngCoordinate.lng },
            anchor: [0.5, 0.5],
            visible: true,
            label: new map4d.MarkerLabel({ text: length + " m", color: "000000", fontSize: 11 }),
            icon: new map4d.Icon(32, 32, ""),
        })
        markerMeter.setMap(map);
        ToolShape.GLOBAL.listArea.listMerterArea.push(markerMeter);
        if (markerMeter != null) markerMeter.setMap(null);
    },
    showMerterTotal: function (point, total) {
        let projection = new map4d.Projection(map)
        let totalMerter = null;
        totalMerter = new map4d.Marker({
            position: { lat: point.lat, lng: point.lng },
            anchor: [0.5, 0.5],
            visible: true,
            label: new map4d.MarkerLabel({ text: total + " m", color: "000000", fontSize: 11 }),
            icon: new map4d.Icon(32, 32, "")
        });
        totalMerter.setMap(map);
        ToolShape.GLOBAL.listDistance.listMerterDistance.push(totalMerter);
    },
    showMerterTotalArea: function () {
        var area = ToolShape.calculatorAraePolygon(ToolShape.GLOBAL.listArea.polygonArea.getPaths()[0]);
        area = Math.round(area * 100) / 100
        let coordinateTransformer = new map4d.CoordinateTransformer(ToolShape.GLOBAL.listArea.polygonArea.getPaths()[0])
        let pointCenter = coordinateTransformer.center;
        let totalMerter = null;
        totalMerter = new map4d.Marker({
            position: { lat: pointCenter.lat, lng: pointCenter.lng },
            anchor: [0.5, 0.5],
            visible: true,
            label: new map4d.MarkerLabel({ text: area + " m2", color: "000000", fontSize: 11 }),
            icon: new map4d.Icon(32, 32, "")
        });
        totalMerter.setMap(map);
        ToolShape.GLOBAL.listArea.listMerterArea.push(totalMerter);
    },
    //Tạo marker LoDat
    createMarkerDrawLoDat: function (lat, lng, check) {
        //tạo đối tượng marker từ MarkerOption
        let markerDraw = new map4d.Marker({
            position: { lat: lat, lng: lng },
            icon: new map4d.Icon(8, 8, "/Content/Map/images/yellow-point.png"),
            anchor: [0.5, 0.5],
            //title: name
        })
        //thêm marker vào map
        markerDraw.setMap(map);
        if (check) {
            ToolShape.GLOBAL.listArea.listMarkerArea.push(markerDraw);
        } else {
            ToolShape.GLOBAL.listDistance.listMarkerDistance.push(markerDraw);
        }
    },
    //Tạo polyline lo dat
    createPolylineLoDat: function (path, strokeWidth, strokeOpacity, check) {
        if (ToolShape.GLOBAL.polylineTemp != null) {
            ToolShape.GLOBAL.polylineTemp.setMap(null);
        }
        //if (ToolShape.GLOBAL.listDistance.listPolylineDistance != null) {
        //    ToolShape.GLOBAL.listDistance.listPolylineDistance.setMap(null);
        //}
        //tạo đối tượng polyline từ PolylineOptions
        var polylineDistance = new map4d.Polyline({
            path: path, visible: true, strokeColor: "#FF8264", strokeWidth: strokeWidth, strokeOpacity: strokeOpacity,
            closed: false
        })
        //thêm polyline vào map
        polylineDistance.setMap(map);
        if (check) {
            ToolShape.GLOBAL.listDistance.listPolylineDistance.push(polylineDistance)
        } else {
            ToolShape.GLOBAL.listArea.PolylineArea = polylineDistance;
        }
    },
    //Tạo polygon lo dat
    createPolygonArea: function (data) {
        //if (objectModel != null) {
        //    objectModel.setMap(null);
        //}
        //if (markerLoDat != null) {
        //    markerLoDat.setMap(null);
        //}
        if (ToolShape.GLOBAL.listArea.polygonArea != null) {
            ToolShape.GLOBAL.listArea.polygonArea.setMap(null);
        }
        //if (ToolShape.GLOBAL.listDistance.listPolylineDistance != null) {
        //    ToolShape.GLOBAL.listDistance.listPolylineDistance.setMap(null);
        //}
        if (ToolShape.GLOBAL.polylineTemp != null) {
            ToolShape.GLOBAL.polylineTemp.setMap(null);
        }

        let polygonOption = map4d.PolygonOptions = {
            paths: [data], fillOpacity: 0.5
        }

        ToolShape.GLOBAL.listArea.polygonArea = new map4d.Polygon(polygonOption)

        //thêm object vào map
        ToolShape.GLOBAL.listArea.polygonArea.setMap(map);
    },
    setShowHideDistance: function (check) {
        if (check) {
            $(ToolShape.SELECTORS.btnRuleDistance).addClass("btn-active");
            ToolShape.GLOBAL.isStartDistance = true;
        } else {
            $(ToolShape.SELECTORS.btnRuleDistance).removeClass("btn-active");
            ToolShape.GLOBAL.isStartDistance = false;
        }
    },
    setShowHideArea: function (check) {
        if (check) {
            $(ToolShape.SELECTORS.btnRuleArea).addClass("btn-active");
            ToolShape.GLOBAL.isStartArea = true;
        } else {
            $(ToolShape.SELECTORS.btnRuleArea).removeClass("btn-active");
            ToolShape.GLOBAL.isStartArea = false;
        }
    },
    splitStringDistance: function (str) {
        var list = str.split(' ');
        if (list.length > 0) {
            return Number(list[0]);
        }
        return 0;
    },
    replayRuleShape: function () {
        //replay distance
        let list = ToolShape.GLOBAL.listDistance;
        $.each(list.listMarkerDistance, function (i, obj) {
            obj.setMap(null);
            if (typeof list.listMerterDistance[i] != undefined && list.listMerterDistance[i] != null) {
                list.listMerterDistance[i].setMap(null);
            }
            if (typeof list.listPolylineDistance[i] != undefined && list.listPolylineDistance[i] != null) {
                list.listPolylineDistance[i].setMap(null);
            }
        });
        list.listMarkerDistance = [];
        list.listMerterDistance = [];
        list.listPolylineDistance = [];
        isStartDistance = false;
        ToolShape.setShowHideDistance(false);
        //replay area
        let listarea = ToolShape.GLOBAL.listArea;
        $.each(listarea.listMerterArea, function (i, obj) {
            obj.setMap(null);
            if (typeof listarea.listMarkerArea[i] != undefined && listarea.listMarkerArea[i] != null) {
                listarea.listMarkerArea[i].setMap(null);
            }
        });
        if (listarea.polygonArea != null) listarea.polygonArea.setMap(null);
        listarea.listMarkerArea = [];
        listarea.listMerterArea = [];
        listarea.polygonArea = null;
        isStartArea = false;
        ToolShape.setShowHideArea(false);
    },
    // calculator area polygon
    calculatorAraePolygon: function (latng) {
        let arrayLatLng = [];
        let latlng;
        $.each(latng, function (i, obj) {
            latlng = [obj.lng, obj.lat];
            arrayLatLng.push(latlng);
        })
        let measure = new map4d.Measure(arrayLatLng)
        return measure.area;
    },
    //get list thua dat
    //getListThuaDat: function () {
    //    let listparam = [];
    //    for (var i = 0; i < 100; i++) {
    //        let st = i + 1;
    //        let param = {
    //            code: "001001003003",
    //            soTo: 93,
    //            soThua:st 
    //        }
    //        listparam.push(param);
    //    }
    //    let shape;
    //    $.ajax({
    //        type: "POST",
    //        url: ViewMap.GLOBAL.url + "/v2/api/land/find-info-list?key=" + ViewMap.CONSTS.key,
    //        data: JSON.stringify(listparam),
    //        dataType: 'json',
    //        async: false,
    //        contentType: 'application/json-patch+json',
    //        success: function (data) {
    //            console.log(data);
    //            if (data.code == "ok" && data.result.features != null && data.result.features.length > 0) {
    //                var objShape = []; //Object.assign({}, data.result);
    //                $.each(data.result.features, function (i, obj) {
    //                    if (obj.properties.info === "vn2000") {
    //                        objShape.push(obj);
    //                    }
    //                });
    //                shape = {
    //                    "type": "FeatureCollection",
    //                    "features": objShape,
    //                }
    //                ToolShape.getExportFileShape(JSON.stringify(shape), "SHP");
    //                $(ToolShape.SELECTORS.modalTrichXuat).modal("hide");
    //            }
    //        },
    //        error: function (jqXHR, textStatus, errorThrown) {
    //            let messageErorr = AppCommon.getMessageErrorReuqest(jqXHR, errorThrown);
    //            console.log(messageErorr);
    //        }
    //    });

    //},
    checkFormTrichXuat: function () {
        let check = true;
        let SoThua = $(ToolShape.SELECTORS.inputSoThua).val();
        if (!validateText(SoThua, "number", 0, 0) || SoThua === "0") { insertError($(ToolShape.SELECTORS.inputSoThua), "other"); check = false; }
        let SoTo = $(ToolShape.SELECTORS.inputSoTo).val();
        if (!validateText(SoTo, "number", 0, 0) || SoTo === "0") { insertError($(ToolShape.SELECTORS.inputSoTo), "other"); check = false; }
        return check;
    },
};
var ViewMap = {
    GLOBAL: {
        ThuaDatSelect: null,
        location: null,
        url: ConfigMap.UrlApi,//"https://api-fiolis.map4d.vn",
        commonData: {},
        lstSearch: null,
        latLngDefault: {
            lat: ConfigMap.LatDefault, //10.678087311284315,
            lng: ConfigMap.LngDefault,//105.08063708265138
        },
        zoomDefault: 16
    },
    CONSTS: {
        codeDefault: ConfigMap.codeDefault, //"001001003003",
        key: ConfigMap.KeyApp,//"8bd33b7fd36d68baa96bf446c84011da",
        MinDefault: 18,
    },
    SELECTORS: {
        menuright: ".menu-right",
        menuclick: ".location-click",
        addressClick: ".address-menu-click",
        locationClick: ".location-menu-click",
        locationClickVN2000: ".location-menu-click-vn2000",
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
        map.setTileUrl("http://61.28.233.229:8080/all/2d/{z}/{x}/{y}.png");
        map.setTileUrl("http://61.28.233.229:8080/all/3d/{z}/{x}/{y}.png", true);
        map.setPlacesEnabled(false);
        //setTimeout(function () { ViewMap.getThuaDatbyCode(ViewMap.CONSTS.codeDefault), map.data.setMinZoom(13) }, 1);

        ViewMap.SetEvent();
    },
    SetEvent: function () {
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
            }
        });

        $(ViewMap.SELECTORS.tooltipsearchadvance).click(function () {
            var soTo = $(ViewMap.SELECTORS.SoToSearch).val();
            var soThua = $(ViewMap.SELECTORS.SoThuaSearch).val();
            var diaChi = $(ViewMap.SELECTORS.DiaChiSearch).val();
            var chuNha = $(ViewMap.SELECTORS.TenChuSearch).val();
            var MDSuDung = $(ViewMap.SELECTORS.MucDichSuDungSearch).val();
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
            $(ViewMap.SELECTORS.listSearchAdv).html('');
            $(ViewMap.SELECTORS.SoToSearch).val(null);
            $(ViewMap.SELECTORS.SoThuaSearch).val(null);
            $(ViewMap.SELECTORS.MucDichSuDungSearch).val(null);
            $(ViewMap.SELECTORS.TenChuSearch).val(null);
            $(ViewMap.SELECTORS.DiaChiSearch).val(null);
            $(ViewMap.SELECTORS.lstSelectSearch).val(ViewMap.CONSTS.codeDefault);

            if (!$(ViewMap.SELECTORS.advSearch).hasClass("advSearchIndex")) {
                $(ViewMap.SELECTORS.advSearch).addClass("advSearchIndex");
            } else {
                $(ViewMap.SELECTORS.advSearch).removeClass("advSearchIndex");
            }
        });

        $(document).on('click', '#showlstsearch', function () {
            var thua = parseInt($(this).attr('data-thua'));
            var to = parseInt($(this).attr('data-to'));
            var result = ViewMap.GLOBAL.lstSearch.find(x => x.properties.SoThuTuThua === thua && x.properties.SoHieuToBanDo === to);
            if (result !== null && result !== undefined) {
                ViewMap.GLOBAL.commonData = result;
                EditMode3D.resetObject3D();
                let propertie = result.properties;
                $(ViewMap.SELECTORS.MaXa).text(propertie.MaXa);
                $(ViewMap.SELECTORS.TenChu).text(propertie.TenChu);
                $(ViewMap.SELECTORS.DiaChi).text(propertie.DiaChi);
                $(ViewMap.SELECTORS.SoThuaBD).text(propertie.SoThuTuThua);
                $(ViewMap.SELECTORS.SoToBD).text(propertie.SoHieuToBanDo);
                $(ViewMap.SELECTORS.SoThuaOld).text((propertie.SoThuTuThuaCu != null) ? propertie.SoThuTuThuaCu : 0);
                $(ViewMap.SELECTORS.SoToOld).text((propertie.SoHieuToBanDoCu != null) ? propertie.SoHieuToBanDoCu : 0);
                $(ViewMap.SELECTORS.DientichBD).text(propertie.DienTich);
                $(ViewMap.SELECTORS.DientichPL).text(propertie.DienTichPhapLy);
                $(ViewMap.SELECTORS.KHDTC).text(propertie.KyHieuDoiTuong);
                $(ViewMap.SELECTORS.MucDichSuDung).text(propertie.KyHieuMucDichSuDung);
                $(ViewMap.SELECTORS.NameMucDichSuDung).text(propertie.TenMucDichSuDung);
                ViewMap.showHideViewProperty(true);
                ViewMap.setSelectThuaDatSearch(result);
                ////UpdateURL
                UpdateUrl(null, null, null, null, propertie.SoHieuToBanDo, propertie.SoThuTuThua);
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
            });
            function conditionallyHideClearIcon(e) {
                var target = (e && e.target) || input;
                target.nextElementSibling.style.display = target.value ? 'block' : 'none';
            }
        });

        map.addListener("idle", (args) => {
            setTimeout(function () { UpdateUrl(args.camera.getTarget().lat, args.camera.getTarget().lng, args.camera.getZoom(), null, null, null); });
        });
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
    getConvertVN2000: function (lat, lng) {
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
            url: ViewMap.GLOBAL.url + "/v2/api/land/code",
            data: {
                code: code,
                key: ViewMap.CONSTS.key
            },
            success: function (data) {
                if (data.result != null && typeof data.result != "undefined") {
                    if (data.result.features.length > 0) {
                        map.data.clear();
                        ViewMap.drawThuaDat(data.result);
                        ViewMap.showLoading(false);
                        ViewMap.CONSTS.codeDefault = code;
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
                    $(ViewMap.SELECTORS.TenChu).text(propertie.TenChu);
                    $(ViewMap.SELECTORS.DiaChi).text(propertie.DiaChi);
                    $(ViewMap.SELECTORS.SoThuaBD).text(propertie.SoThuTuThua);
                    $(ViewMap.SELECTORS.SoToBD).text(propertie.SoHieuToBanDo);
                    $(ViewMap.SELECTORS.SoThuaOld).text((propertie.SoThuTuThuaCu != null) ? propertie.SoThuTuThuaCu : 0);
                    $(ViewMap.SELECTORS.SoToOld).text((propertie.SoHieuToBanDoCu != null) ? propertie.SoHieuToBanDoCu : 0);
                    $(ViewMap.SELECTORS.DientichBD).text(propertie.DienTich);
                    $(ViewMap.SELECTORS.DientichPL).text(propertie.DienTichPhapLy);
                    $(ViewMap.SELECTORS.KHDTC).text(propertie.KyHieuDoiTuong);
                    $(ViewMap.SELECTORS.MucDichSuDung).text(propertie.KyHieuMucDichSuDung);
                    $(ViewMap.SELECTORS.NameMucDichSuDung).text(propertie.TenMucDichSuDung);
                    ViewMap.showHideViewProperty(true);
                    ViewMap.setSelectThuaDat(data.result.features[0]);

                    ////UpdateURL
                    UpdateUrl(null, null, null, data.result.capHanhChinh[data.result.capHanhChinh.length - 1].code, propertie.SoHieuToBanDo, propertie.SoThuTuThua);
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
                    if (data.result.features.length === 1) {
                        //ViewMap.GLOBAL.commonData = data.result;
                        EditMode3D.resetObject3D();
                        let propertie = data.result.features[0].properties;
                        $(ViewMap.SELECTORS.MaXa).text(propertie.MaXa);
                        $(ViewMap.SELECTORS.TenChu).text(propertie.TenChu);
                        $(ViewMap.SELECTORS.DiaChi).text(propertie.DiaChi);
                        $(ViewMap.SELECTORS.SoThuaBD).text(propertie.SoThuTuThua);
                        $(ViewMap.SELECTORS.SoToBD).text(propertie.SoHieuToBanDo);
                        $(ViewMap.SELECTORS.SoThuaOld).text((propertie.SoThuTuThuaCu != null) ? propertie.SoThuTuThuaCu : 0);
                        $(ViewMap.SELECTORS.SoToOld).text((propertie.SoHieuToBanDoCu != null) ? propertie.SoHieuToBanDoCu : 0);
                        $(ViewMap.SELECTORS.DientichBD).text(propertie.DienTich);
                        $(ViewMap.SELECTORS.DientichPL).text(propertie.DienTichPhapLy);
                        $(ViewMap.SELECTORS.KHDTC).text(propertie.KyHieuDoiTuong);
                        $(ViewMap.SELECTORS.MucDichSuDung).text(propertie.KyHieuMucDichSuDung);
                        $(ViewMap.SELECTORS.NameMucDichSuDung).text(propertie.TenMucDichSuDung);
                        ViewMap.showHideViewProperty(true);
                        ViewMap.setSelectThuaDatSearch(data.result.features[0]);

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
};
var UpdateThuaDat = {
    GLOBAL: {
        KHSelected: null
    },
    CONSTS: {},
    SELECTORS: {
        KHList: '.model-update-thua-dat #KH-listselectid',
        SoToUpdate: ".model-update-thua-dat #text-update-soTo",
        SoThuaUpdate: ".model-update-thua-dat #text-update-soThua",
        SoToUpdateOld: ".model-update-thua-dat #text-update-soTo-old",
        SoThuaUpdateOld: ".model-update-thua-dat #text-update-soThua-old",
        DienTichUpdate: ".model-update-thua-dat #text-update-dienTich",
        DienTichPhapLyUpdate: ".model-update-thua-dat #text-update-dienTichPhapLy",
        TenChuUpdate: ".model-update-thua-dat #text-update-chuNha",
        DiaChiUpdate: ".model-update-thua-dat #text-update-diaChi",
        btnUpdateThuaDat: ".model-update-thua-dat #btn-update-thua-dat",
        modalUpdate: '.model-update-thua-dat',
    },
    init: function () {
        UpdateThuaDat.setEvent();
        UpdateThuaDat.addSelectDistrict();
    },
    setEvent: function () {
        //$("#testselectset").selectBoxIt({
        //    theme: "default",
        //    defaultText: "Make a selection...",
        //    autoWidth: false
        //});
        $(ToolShape.SELECTORS.btnUpdateShape).on("click", function () {
            if (ViewMap.GLOBAL.ThuaDatSelect != null) {
                UpdateThuaDat.getFindInfo(ViewMap.GLOBAL.ThuaDatSelect[0].ObjectId);
                if (UpdateThuaDat.GLOBAL.KHSelected != null) {
                    $(UpdateThuaDat.SELECTORS.KHList).val(UpdateThuaDat.GLOBAL.KHSelected.properties.KyHieuMucDichSuDung).change();
                    if ($(UpdateThuaDat.SELECTORS.KHList).val() == "" || $(UpdateThuaDat.SELECTORS.KHList).val() == null) {
                        $(UpdateThuaDat.SELECTORS.KHList).attr("disabled", "disabled");
                        $(UpdateThuaDat.SELECTORS.KHList).append(`<option value="${UpdateThuaDat.GLOBAL.KHSelected.properties.KyHieuMucDichSuDung}"> 
                                       ${UpdateThuaDat.GLOBAL.KHSelected.properties.KyHieuMucDichSuDung} 
                                  </option>`);
                        $(UpdateThuaDat.SELECTORS.KHList).val(UpdateThuaDat.GLOBAL.KHSelected.properties.KyHieuMucDichSuDung).change();
                    }
                    $(UpdateThuaDat.SELECTORS.SoToUpdate).val(UpdateThuaDat.GLOBAL.KHSelected.properties.SoHieuToBanDo);
                    $(UpdateThuaDat.SELECTORS.SoThuaUpdate).val(UpdateThuaDat.GLOBAL.KHSelected.properties.SoThuTuThua);
                    $(UpdateThuaDat.SELECTORS.SoToUpdateOld).val(UpdateThuaDat.GLOBAL.KHSelected.properties.SoHieuToBanDoCu);
                    if ($(UpdateThuaDat.SELECTORS.SoToUpdateOld).val() == "") {
                        $(UpdateThuaDat.SELECTORS.SoToUpdateOld).val("0");
                    }
                    $(UpdateThuaDat.SELECTORS.SoThuaUpdateOld).val(UpdateThuaDat.GLOBAL.KHSelected.properties.SoThuTuThuaCu);
                    if ($(UpdateThuaDat.SELECTORS.SoThuaUpdateOld).val() == "") {
                        $(UpdateThuaDat.SELECTORS.SoThuaUpdateOld).val("0");
                    }
                    $(UpdateThuaDat.SELECTORS.DienTichUpdate).val(UpdateThuaDat.GLOBAL.KHSelected.properties.DienTich);
                    $(UpdateThuaDat.SELECTORS.DienTichPhapLyUpdate).val(UpdateThuaDat.GLOBAL.KHSelected.properties.DienTichPhapLy);
                    $(UpdateThuaDat.SELECTORS.TenChuUpdate).val(UpdateThuaDat.GLOBAL.KHSelected.properties.TenChu);
                    $(UpdateThuaDat.SELECTORS.DiaChiUpdate).val(UpdateThuaDat.GLOBAL.KHSelected.properties.DiaChi);
                    $(UpdateThuaDat.SELECTORS.modalUpdate).modal('show');
                }
            } else {
                swal({
                    title: "Thông báo",
                    text: "Không tìm thấy dữ liệu",
                    icon: "warning",
                    button: "Đóng",
                }).then((value) => {
                });
                return;
            }

        });

        $(UpdateThuaDat.SELECTORS.btnUpdateThuaDat).on('click', function () {
            var tobando = $(UpdateThuaDat.SELECTORS.SoToUpdate).val();
            var thua = $(UpdateThuaDat.SELECTORS.SoThuaUpdate).val();
            var tobandoold = $(UpdateThuaDat.SELECTORS.SoToUpdateOld).val();
            var thuaold = $(UpdateThuaDat.SELECTORS.SoThuaUpdateOld).val();
            var dientich = $(UpdateThuaDat.SELECTORS.DienTichUpdate).val();
            var dientichphaply = $(UpdateThuaDat.SELECTORS.DienTichPhapLyUpdate).val();
            var tenchu = $(UpdateThuaDat.SELECTORS.TenChuUpdate).val();
            var diachi = $(UpdateThuaDat.SELECTORS.DiaChiUpdate).val();
            var khmucdichsudung = $(UpdateThuaDat.SELECTORS.KHList).val();
            if (tobando === "" || thua === "" || tobandoold === "" || thuaold === "" || dientich === "" || dientichphaply === "") {
                swal({
                    title: "Thông báo",
                    text: "Dữ liệu nhập không đúng",
                    icon: "warning",
                    button: "Đóng",
                }).then((value) => {
                });
                return;
            }

            var dientichnumber = parseFloat(dientich);
            var dientichphaplynumber = parseFloat(dientichphaply);
            var object = {
                id: UpdateThuaDat.GLOBAL.KHSelected.properties.Id,
                objectId: ViewMap.GLOBAL.ThuaDatSelect[0].ObjectId,
                index: UpdateThuaDat.GLOBAL.KHSelected.properties.Index,
                uuid: UpdateThuaDat.GLOBAL.KHSelected.properties.UUID,
                thoiDiemBatDau: UpdateThuaDat.GLOBAL.KHSelected.properties.ThoiDiemBatDau,
                thoiDiemKetThuc: UpdateThuaDat.GLOBAL.KHSelected.properties.ThoiDiemKetThuc,
                maXa: UpdateThuaDat.GLOBAL.KHSelected.properties.MaXa,
                maDoiTuong: UpdateThuaDat.GLOBAL.KHSelected.properties.MaDoiTuong,
                soHieuToBanDo: tobando,
                soThuTuThua: thua,
                soHieuToBanDoCu: tobandoold,
                soThuTuThuaCu: thuaold,
                dienTich: dientichnumber,
                dienTichPhapLy: dientichphaplynumber,
                kyHieuMucDichSuDung: khmucdichsudung,
                kyHieuDoiTuong: UpdateThuaDat.GLOBAL.KHSelected.properties.KyHieuDoiTuong,
                tenChu: tenchu,
                diaChi: diachi,
                daCapGCN: UpdateThuaDat.GLOBAL.KHSelected.properties.DaCapGCN,
                tenChu2: UpdateThuaDat.GLOBAL.KHSelected.properties.TenChu2,
                namSinhC1: UpdateThuaDat.GLOBAL.KHSelected.properties.NamSinhC1,
                soHieuGCN: UpdateThuaDat.GLOBAL.KHSelected.properties.SoHieuGCN,
                soVaoSo: UpdateThuaDat.GLOBAL.KHSelected.properties.SoVaoSo,
                ngayVaoSo: UpdateThuaDat.GLOBAL.KHSelected.properties.NgayVaoSo,
                soBienNhan: UpdateThuaDat.GLOBAL.KHSelected.properties.SoBienNhan,
                nguoiNhanHS: UpdateThuaDat.GLOBAL.KHSelected.properties.NguoiNhanHS,
                coQuanThuLy: UpdateThuaDat.GLOBAL.KHSelected.properties.CoQuanThuLy,
                loaiHS: UpdateThuaDat.GLOBAL.KHSelected.properties.LoaiHS,
                maLienKet: UpdateThuaDat.GLOBAL.KHSelected.properties.MaLienKet,
                shapeSTArea: UpdateThuaDat.GLOBAL.KHSelected.properties.ShapeSTArea,
                shapeSTLength: UpdateThuaDat.GLOBAL.KHSelected.properties.ShapeSTLength,
                shapeLength: UpdateThuaDat.GLOBAL.KHSelected.properties.ShapeLength,
                shapeArea: UpdateThuaDat.GLOBAL.KHSelected.properties.ShapeArea,
                geometry: UpdateThuaDat.GLOBAL.KHSelected.geometry,
                tags: UpdateThuaDat.GLOBAL.KHSelected.properties.Tags
            };
            console.log(object);

            ViewMap.showLoading(true);
            $.ajax({
                type: "POST",
                url: ViewMap.GLOBAL.url + "/v2/api/land/update?key=" + ViewMap.CONSTS.key,
                data: JSON.stringify(object),
                dataType: 'json',
                async: false,
                contentType: 'application/json-patch+json',
                success: function (data) {
                    if (data.code == "ok") {
                        swal({
                            title: "Thông báo",
                            text: "Cập nhật thông tin thửa đất thành công!",
                            icon: "success",
                            button: "Đóng",
                        }).then((value) => {
                            UpdateThuaDat.updateThuaDat(parseInt(tobando), parseInt(thua));
                            $(UpdateThuaDat.SELECTORS.modalUpdate).modal('hide');
                        });
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    let messageErorr = AppCommon.getMessageErrorReuqest(jqXHR, errorThrown);
                    console.log(messageErorr);
                    ViewMap.showLoading(false);
                }
            });
        });

        $(UpdateThuaDat.SELECTORS.DienTichUpdate).keyup(function (evt) {
            var text = $(this).val();
            var splittext = text.split('.');
            if (splittext.length > 2) {
                for (var i = 2; i < splittext.length; i++) {
                    splittext[1] += splittext[i];
                }
                $(this).val(splittext[0] + '.' + splittext[1]);
            }
        });

        $(UpdateThuaDat.SELECTORS.DienTichPhapLyUpdate).keyup(function (evt) {
            var text = $(this).val();
            var splittext = text.split('.');
            if (splittext.length > 2) {
                for (var i = 2; i < splittext.length; i++) {
                    splittext[1] += splittext[i];
                }
                $(this).val(splittext[0] + '.' + splittext[1]);
            }
        });

        //$(".KH-select").select2({
        //    language: "vi",
        //    placeholder: 'Chọn',
        //    width: '100%',
        //    allowClear: true,
        //    ajax:
        //    {
        //        url: ViewMap.GLOBAL.url + "/v2/api/land/all-muc-dich-su-dung?key" + ViewMap.CONSTS.key,
        //        dataType: 'json',
        //        type: 'POST',
        //        delay: 250,
        //        data: function (params) {
        //            var query = {
        //                q: params.term
        //            }
        //            return query;
        //        },
        //        processResults: function (data, params) {
        //            debugger;
        //            return {
        //                results: data.select2,
        //            };
        //        },
        //        cache: false
        //    },
        //    theme: "bootstrap",
        //    minimumInputLength: 3
        //}).on("change", function (e) {

        //});
    },
    getFindInfo: function (objectId) {
        ViewMap.showLoading(true);
        $.ajax({
            type: "GET",
            url: ViewMap.GLOBAL.url + "/v2/api/land/find-info",
            data: {
                code: ViewMap.CONSTS.codeDefault,
                objectId: objectId,
                key: ViewMap.CONSTS.key
            },
            async: false,
            success: function (data) {
                console.log(data);
                if (data.code == "ok" && data.result != null && data.result.features.length > 0) {
                    console.log(data.result.features);
                    UpdateThuaDat.GLOBAL.KHSelected = data.result.features.find(x => x.properties.info === "vn2000");
                } else {
                    swal({
                        title: "Thông báo",
                        text: "Không tìm thấy kết quả",
                        icon: "warning",
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
    updateThuaDat: function (soTo, soThua) {
        ViewMap.showLoading(true);
        $.ajax({
            type: "GET",
            url: ViewMap.GLOBAL.url + "/v2/api/land/find",
            data: {
                code: ViewMap.CONSTS.codeDefault,
                soTo: soTo,
                soThua: soThua,
                key: ViewMap.CONSTS.key
            },
            success: function (data) {
                console.log(data);
                if (data.code == "ok" && data.result != null && data.result.features.length > 0) {
                    let propertie = data.result.features[0].properties;
                    $(ViewMap.SELECTORS.MaXa).text(propertie.MaXa);
                    $(ViewMap.SELECTORS.TenChu).text(propertie.TenChu);
                    $(ViewMap.SELECTORS.DiaChi).text(propertie.DiaChi);
                    $(ViewMap.SELECTORS.SoThuaBD).text(propertie.SoThuTuThua);
                    $(ViewMap.SELECTORS.SoToBD).text(propertie.SoHieuToBanDo);
                    $(ViewMap.SELECTORS.SoThuaOld).text((propertie.SoThuTuThuaCu != null) ? propertie.SoThuTuThuaCu : 0);
                    $(ViewMap.SELECTORS.SoToOld).text((propertie.SoHieuToBanDoCu != null) ? propertie.SoHieuToBanDoCu : 0);
                    $(ViewMap.SELECTORS.DientichBD).text(propertie.DienTich);
                    $(ViewMap.SELECTORS.DientichPL).text(propertie.DienTichPhapLy);
                    $(ViewMap.SELECTORS.KHDTC).text(propertie.KyHieuDoiTuong);
                    $(ViewMap.SELECTORS.MucDichSuDung).text(propertie.KyHieuMucDichSuDung);
                    $(ViewMap.SELECTORS.NameMucDichSuDung).text(propertie.TenMucDichSuDung);
                    ViewMap.showHideViewProperty(true);

                } else {
                    swal({
                        title: "Thông báo",
                        text: "Không tìm thấy kết quả",
                        icon: "warning",
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
    addSelectDistrict: function () {
        $.ajax({
            type: "GET",
            url: ViewMap.GLOBAL.url + "/v2/api/land/all-muc-dich-su-dung",
            data: {
                key: ViewMap.CONSTS.key
            },
            success: function (data) {
                if (data.code == "ok" && data.result != null && data.result.length > 0) {
                    let selecthtml = '';
                    for (var i = 0; i < data.result.length; i++) {
                        selecthtml += `<option value="${data.result[i].mucDichSuDung}">
                                        ${data.result[i].name}
                                    </option>`;
                    }
                    $(UpdateThuaDat.SELECTORS.KHList).append(selecthtml);
                } else {
                    swal({
                        title: "Thông báo",
                        text: "Không tìm thấy thành phố địa chính",
                        icon: "warning",
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
    }
};
var MenuLeft = {
    GLOBAL: {
        ListPolylineMenu: null,
        idSelect: null,
        checkSelectAll: false,
        selectedUl: null
    },
    CONSTS: {
        parentIdDefault: '64'
    },
    SELECTORS: {
        menuList: '#menu-list'
    },
    init: function () {
        MenuLeft.loadMenu();
        MenuLeft.setEvent();
    },
    setEvent: function () {

        $(".tatMenuLeft").click(function () {
            $(".menu-district").removeClass("open-menu").addClass("close-menu");
            //$("#show-sidebar").addClass("show");
            $("#map").removeClass("defective").addClass("full");
        });
        $("#show-sidebar").click(function () {
            $(".menu-district").removeClass("close-menu").addClass("open-menu");
            //$("#show-sidebar").removeClass("show");
            $("#map").removeClass("full").addClass("defective");
        });

        $(document).on('click', '.has-children, .has-children-child', function (e, string) {
            let id = $(this).attr('data-id');
            let kind = $(this).attr('data-kind');
            let code = $(this).attr('data-code');
            if (typeof code !== undefined && code.length > 2) {
                if (ViewMap.CONSTS.codeDefault != code || MenuLeft.GLOBAL.checkSelectAll) {
                    if (code.length > 9) {
                        setTimeout(function () {
                            map.setTileFeatureFilterCode(code);
                            ViewMap.CONSTS.codeDefault = code;
                            ViewMap.showHideViewProperty(false);
                        }, 1);
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
                    }
                    var iconid = 'icon-' + id;
                    if (kind == "parent") {
                        var element = document.getElementById(iconid);
                        var elementspan = element.className;
                        if (elementspan == "fa fa-chevron-down") {
                            $("#" + iconid).removeClass('fa fa-chevron-down').addClass('fa fa-chevron-left');
                            $("#child-" + id).css("display", "none");
                            MenuLeft.GLOBAL.selectedUl = null;
                        }
                        else {
                            $("#" + iconid).removeClass('fa fa-chevron-left').addClass('fa fa-chevron-down');
                            var child = "#child-" + id;
                            var childid = "child-" + id;
                            $(child).removeAttr("style");
                            if (document.getElementById(childid).innerHTML == "" && code.length <= 9) {
                                setTimeout(function () { MenuLeft.showDistrictChild(id, child); }, 1);
                            }

                            var idnow = 'icon-' + MenuLeft.GLOBAL.selectedUl;
                            if (MenuLeft.GLOBAL.selectedUl != null) {
                                $("#" + idnow).removeClass('fa fa-chevron-down').addClass('fa fa-chevron-left');
                                $("#child-" + MenuLeft.GLOBAL.selectedUl).css("display", "none");
                            }
                            MenuLeft.GLOBAL.selectedUl = id;
                        }
                    }

                    if (string == undefined) {
                        setTimeout(function () {
                            MenuLeft.fitBoundPlaceSelect(code);
                            map.setTileFeatureFilterCode(code);
                        }, 200);
                    }
                    ViewMap.removeSelectThuaDat();
                    MenuLeft.GLOBAL.checkSelectAll = false;
                } else {
                    setTimeout(function () {
                        if ($("[data-code=" + code + "]")[0].attributes.style == undefined || $("[data-code=" + code + "]")[0].attributes.style.value == "") {
                            map.setTileFeatureFilterCode(code);
                        }

                        $("[data-code=" + code + "]").css('background', 'rgba(33, 152, 241, 0.3)');
                        $(".has-all-map").css('background', '');
                    }, 1);
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
            }
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
                    let html = '';
                    let selecthtml = '';
                    for (var i = 0; i < data.result.length; i++) {
                        html += `<li class="has-children" id="${data.result[i].id}" data-id="${data.result[i].id}" data-code="${data.result[i].code}" data-kind="parent">
                                    <input type="checkbox" class="input-checkbox" data-id="${data.result[i].id}">
                                    <label id="label-menu-left">${data.result[i].description} ${data.result[i].name}`;
                        if (data.result[i].code.length <= 9) {
                            html += `<i class="fa fa-chevron-left" id="icon-${data.result[i].id}" style="padding-left:12px; float:right;"></i>`;
                        } else {
                            html += `<i class="fa fa-chevron-left" id="icon-${data.result[i].id}" style="padding-left:12px; float:right;display:none;"></i>`;
                            selecthtml += `<option value="${data.result[i].code}">
                                        ${data.result[i].description} ${data.result[i].name}
                                    </option>`;
                        }
                        html += `</label>
                                </li>
                                <ul id="child-${data.result[i].id}" class="cd-accordion-menu-child"  style="display:none;"></ul>`;

                        if (data.result[i].code == ViewMap.CONSTS.codeDefault) {
                            MenuLeft.GLOBAL.idSelect = data.result[i].id;
                        }
                    }
                    $(MenuLeft.SELECTORS.menuList).append(html);
                    $(ViewMap.SELECTORS.lstSelectSearch).append(selecthtml);
                    let codeSelectedDefault = ViewMap.SELECTORS.lstSelectSearch + ` option[value=${ViewMap.CONSTS.codeDefault}]`;
                    $(codeSelectedDefault).attr('selected', 'selected');
                    $("[data-code=" + ViewMap.CONSTS.codeDefault + "]").css('background', 'rgba(33, 152, 241, 0.3)');
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
                    let ICameraPosition = { target: camera.target, zoom: 16 };
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
    }
};
var ImportFile = {
    GLOBAL: {
        FileData: null,
        stringData: null,
        objectData: null
    },
    CONSTS: {

    },
    SELECTORS: {
        modalFile: '#textfileModal',
        Input_File: "input[name='Files']",
        TxtFileUploadError: ".fileUpLoadError",
        fileNames: '.fileNames',
        closeModal: '.close-modal-importfile',
        btnUploadFile: '#btn-upload-file'
    },
    init: function () {
        ImportFile.setEvent();
    },
    setEvent: function () {
        $(ToolShape.SELECTORS.btnUpdateFile).on("click", function () {
            $(ImportFile.SELECTORS.modalFile).modal('show');
        });

        $(ImportFile.SELECTORS.closeModal).on("click", function () {
            $(ImportFile.SELECTORS.modalFile).modal('hide');
            $(ImportFile.SELECTORS.Input_File).val('');
            $(ImportFile.SELECTORS.TxtFileUploadError).text("");
            $(ImportFile.SELECTORS.fileNames).text("");
        });

        $(ImportFile.SELECTORS.btnUploadFile).on("click", function (e) {
            if ($(ImportFile.SELECTORS.Input_File)[0].files.length > 0) {
                //console.log(ImportFile.GLOBAL.objectData);
                arrayfile = [];
                for (var i = 0; i < ImportFile.GLOBAL.objectData.features.length; i++) {
                    var object = {
                        id: (ImportFile.GLOBAL.objectData.features[i].properties.Id == undefined) ? null : ImportFile.GLOBAL.objectData.features[i].properties.Id,
                        objectId: (ImportFile.GLOBAL.objectData.features[i].properties.ObjectId == undefined) ? 0 : ImportFile.GLOBAL.objectData.features[i].properties.ObjectId,
                        index: (ImportFile.GLOBAL.objectData.features[i].properties.Index == undefined) ? null : ImportFile.GLOBAL.objectData.features[i].properties.Index,
                        uuid: (ImportFile.GLOBAL.objectData.features[i].properties.UUID == undefined) ? null : ImportFile.GLOBAL.objectData.features[i].properties.UUID,
                        thoiDiemBatDau: (ImportFile.GLOBAL.objectData.features[i].properties.ThoiDiemBatDau == undefined) ? null : ImportFile.GLOBAL.objectData.features[i].properties.ThoiDiemBatDau,
                        thoiDiemKetThuc: (ImportFile.GLOBAL.objectData.features[i].properties.ThoiDiemKetThuc == undefined) ? null : ImportFile.GLOBAL.objectData.features[i].properties.ThoiDiemKetThuc,
                        maXa: (ImportFile.GLOBAL.objectData.features[i].properties.MaXa == undefined) ? null : ImportFile.GLOBAL.objectData.features[i].properties.MaXa,
                        maDoiTuong: (ImportFile.GLOBAL.objectData.features[i].properties.MaDoiTuong == undefined) ? null : ImportFile.GLOBAL.objectData.features[i].properties.MaDoiTuong,
                        soHieuToBanDo: (ImportFile.GLOBAL.objectData.features[i].properties.SoHieuToBanDo == undefined) ? 0 : ImportFile.GLOBAL.objectData.features[i].properties.SoHieuToBanDo,
                        soThuTuThua: (ImportFile.GLOBAL.objectData.features[i].properties.SoThuTuThua == undefined) ? 0 : ImportFile.GLOBAL.objectData.features[i].properties.SoThuTuThua,
                        soHieuToBanDoCu: (ImportFile.GLOBAL.objectData.features[i].properties.SoHieuToBanDoCu == undefined) ? null : ImportFile.GLOBAL.objectData.features[i].properties.SoHieuToBanDoCu,
                        soThuTuThuaCu: (ImportFile.GLOBAL.objectData.features[i].properties.SoThuTuThuaCu == undefined) ? null : ImportFile.GLOBAL.objectData.features[i].properties.SoThuTuThuaCu,
                        dienTich: (ImportFile.GLOBAL.objectData.features[i].properties.DienTich == undefined) ? 0 : ImportFile.GLOBAL.objectData.features[i].properties.DienTich,
                        dienTichPhapLy: (ImportFile.GLOBAL.objectData.features[i].properties.DienTichPhapLy == undefined) ? 0 : ImportFile.GLOBAL.objectData.features[i].properties.DienTichPhapLy,
                        kyHieuMucDichSuDung: (ImportFile.GLOBAL.objectData.features[i].properties.KyHieuMucDichSuDung == undefined) ? null : ImportFile.GLOBAL.objectData.features[i].properties.KyHieuMucDichSuDung,
                        kyHieuDoiTuong: (ImportFile.GLOBAL.objectData.features[i].properties.KyHieuDoiTuong == undefined) ? null : ImportFile.GLOBAL.objectData.features[i].properties.KyHieuDoiTuong,
                        tenChu: (ImportFile.GLOBAL.objectData.features[i].properties.TenChu == undefined) ? null : ImportFile.GLOBAL.objectData.features[i].properties.TenChu,
                        diaChi: (ImportFile.GLOBAL.objectData.features[i].properties.DiaChi == undefined) ? null : ImportFile.GLOBAL.objectData.features[i].properties.DiaChi,
                        daCapGCN: (ImportFile.GLOBAL.objectData.features[i].properties.DaCapGCN == undefined) ? 0 : ImportFile.GLOBAL.objectData.features[i].properties.DaCapGCN,
                        tenChu2: (ImportFile.GLOBAL.objectData.features[i].properties.TenChu2 == undefined) ? null : ImportFile.GLOBAL.objectData.features[i].properties.TenChu2,
                        namSinhC1: (ImportFile.GLOBAL.objectData.features[i].properties.NamSinhC1 == undefined) ? null : ImportFile.GLOBAL.objectData.features[i].properties.namSinhC1,
                        soHieuGCN: (ImportFile.GLOBAL.objectData.features[i].properties.SoHieuGCN == undefined) ? null : ImportFile.GLOBAL.objectData.features[i].properties.soHieuGCN,
                        soVaoSo: (ImportFile.GLOBAL.objectData.features[i].properties.SoVaoSo == undefined) ? null : ImportFile.GLOBAL.objectData.features[i].properties.SoVaoSo,
                        ngayVaoSo: (ImportFile.GLOBAL.objectData.features[i].properties.NgayVaoSo == undefined) ? null : ImportFile.GLOBAL.objectData.features[i].properties.NgayVaoSo,
                        soBienNhan: (ImportFile.GLOBAL.objectData.features[i].properties.SoBienNhan == undefined) ? 0 : ImportFile.GLOBAL.objectData.features[i].properties.SoBienNhan,
                        nguoiNhanHS: (ImportFile.GLOBAL.objectData.features[i].properties.NguoiNhanHS == undefined) ? null : ImportFile.GLOBAL.objectData.features[i].properties.NguoiNhanHS,
                        coQuanThuLy: (ImportFile.GLOBAL.objectData.features[i].properties.CoQuanThuLy == undefined) ? null : ImportFile.GLOBAL.objectData.features[i].properties.CoQuanThuLy,
                        loaiHS: (ImportFile.GLOBAL.objectData.features[i].properties.LoaiHS == undefined) ? null : ImportFile.GLOBAL.objectData.features[i].properties.LoaiHS,
                        maLienKet: (ImportFile.GLOBAL.objectData.features[i].properties.MaLienKet == undefined) ? null : ImportFile.GLOBAL.objectData.features[i].properties.MaLienKet,
                        shapeSTArea: (ImportFile.GLOBAL.objectData.features[i].properties.ShapeSTArea == undefined) ? 0 : ImportFile.GLOBAL.objectData.features[i].properties.ShapeSTArea,
                        shapeSTLength: (ImportFile.GLOBAL.objectData.features[i].properties.ShapeSTLength == undefined) ? 0 : ImportFile.GLOBAL.objectData.features[i].properties.ShapeSTLength,
                        shapeLength: (ImportFile.GLOBAL.objectData.features[i].properties.ShapeLength == undefined) ? 0 : ImportFile.GLOBAL.objectData.features[i].properties.ShapeLength,
                        shapeArea: (ImportFile.GLOBAL.objectData.features[i].properties.ShapeArea == undefined) ? 0 : ImportFile.GLOBAL.objectData.features[i].properties.ShapeArea,
                        geometry: (ImportFile.GLOBAL.objectData.features[i].geometry == undefined) ? null : ImportFile.GLOBAL.objectData.features[i].geometry,
                        tags: (ImportFile.GLOBAL.objectData.features[i].properties.Tags == undefined) ? null : ImportFile.GLOBAL.objectData.features[i].properties.Tags
                    };
                    arrayfile.push(object);
                }

                ViewMap.showLoading(true);
                $.ajax({
                    type: "POST",
                    url: ViewMap.GLOBAL.url + "/v2/api/land/update-or-insert?key=" + ViewMap.CONSTS.key,
                    data: JSON.stringify(arrayfile),
                    dataType: 'json',
                    contentType: 'application/json-patch+json',
                    success: function (data) {
                        ViewMap.showLoading(false);
                        if (data.code == "ok") {
                            swal({
                                title: "Thông báo",
                                text: "Nhập dữ liệu từ file thành công!",
                                icon: "success",
                                button: "Đóng",
                            }).then((value) => {
                                $(ImportFile.SELECTORS.modalFile).modal('hide');
                                $(ImportFile.SELECTORS.Input_File).val('');
                                $(ImportFile.SELECTORS.fileNames).text("");
                            });
                        } else {
                            swal({
                                title: "Thông báo",
                                text: "Xảy ra lỗi trong quá trình nhập dữ liệu từ file",
                                icon: "warning",
                                button: "Đóng",
                            }).then((value) => {
                                $(ImportFile.SELECTORS.modalFile).modal('hide');
                                $(ImportFile.SELECTORS.Input_File).val('');
                                $(ImportFile.SELECTORS.fileNames).text("");
                            });
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        let messageErorr = AppCommon.getMessageErrorReuqest(jqXHR, errorThrown);
                        console.log(messageErorr);
                        $(ImportFile.SELECTORS.Input_File).val('');
                        $(ImportFile.SELECTORS.fileNames).text("");
                        ViewMap.showLoading(false);
                    }
                });

            } else {
                e.preventDefault();
                $(ImportFile.SELECTORS.TxtFileUploadError).text("Vui lòng chọn file");
            }
        });

        $(document).on("change", ImportFile.SELECTORS.Input_File, (event) => {

            var files = $(ImportFile.SELECTORS.Input_File)[0].files[0];
            var fileReader = new FileReader();
            ImportFile.GLOBAL.stringData = null;
            ImportFile.GLOBAL.objectData = null;
            //console.log(files);
            fileReader.onload = function (progressEvent) {
                ImportFile.GLOBAL.stringData = fileReader.result;
            };
            fileReader.readAsText(files, "UTF-8");
            fileReader.onloadend = function (progressEvent) {
                try {
                    var myfile = files.name.toLowerCase();
                    var ext = myfile.split('.').pop();
                    if (ext != "txt" && ext != "json" && ext != "geojson") {
                        $(ImportFile.SELECTORS.TxtFileUploadError).text("Định dạng của tệp không được cho phép");
                        $(ImportFile.SELECTORS.Input_File).val('');
                        $(ImportFile.SELECTORS.fileNames).text("");
                        return;
                    }
                    else {
                        //$(ImportFile.SELECTORS.TxtFileUploadError).text("");
                        if (files.size == 0) {
                            $(ImportFile.SELECTORS.TxtFileUploadError).text("Không thể đính kém file rỗng!");
                            $(ImportFile.SELECTORS.Input_File).val('');
                            $(ImportFile.SELECTORS.fileNames).text("");
                            return;
                        }
                        if (files.size >= 3145728) {  //// 3MB
                            $(ImportFile.SELECTORS.TxtFileUploadError).text("Kích thước file quá lớn!");
                            $(ImportFile.SELECTORS.Input_File).val('');
                            $(ImportFile.SELECTORS.fileNames).text("");
                            return;
                        }
                        //else {
                        //    $(ImportFile.SELECTORS.TxtFileUploadError).text("");
                        //    $(ImportFile.SELECTORS.fileNames).text(files.name);
                        //}
                    }

                    if (ImportFile.GLOBAL.stringData != null && ImportFile.GLOBAL.stringData != undefined) {
                        var json = JSON.parse(ImportFile.GLOBAL.stringData);
                        console.log(json);
                        if (json.features != undefined) {
                            var check = 0;
                            for (var im = 0; im < json.features.length; im++) {
                                if (im == check) {
                                    if (json.features[im].properties != undefined && json.features[im].geometry != undefined && json.features[im].geometry.coordinates != undefined) {
                                        if (json.features[im].properties != null && json.features[im].geometry.coordinates.length > 0) {
                                            if (json.features[im].properties.MaXa != undefined && json.features[im].properties.MaXa != null && json.features[im].properties.MaXa != '') {
                                                if (json.features[im].properties.SoHieuToBanDo != undefined && json.features[im].properties.SoHieuToBanDo != null && json.features[im].properties.SoHieuToBanDo != '') {
                                                    if (json.features[im].properties.SoThuTuThua != undefined && json.features[im].properties.SoThuTuThua != null && json.features[im].properties.SoThuTuThua != '') {
                                                        check++;
                                                        //$(ImportFile.SELECTORS.TxtFileUploadError).text("");
                                                        //$(ImportFile.SELECTORS.fileNames).text(files.name);
                                                        //return;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                } else {
                                    $(ImportFile.SELECTORS.TxtFileUploadError).text("Dữ liệu JSON trong file không đúng định dạng!");
                                    $(ImportFile.SELECTORS.Input_File).val('');
                                    $(ImportFile.SELECTORS.fileNames).text("");
                                    return;
                                }
                            }
                            $(ImportFile.SELECTORS.TxtFileUploadError).text("");
                            $(ImportFile.SELECTORS.fileNames).text(files.name);
                            ImportFile.GLOBAL.objectData = json;
                            return;
                        }
                        $(ImportFile.SELECTORS.TxtFileUploadError).text("Dữ liệu JSON trong file không đúng định dạng!");
                        $(ImportFile.SELECTORS.Input_File).val('');
                        $(ImportFile.SELECTORS.fileNames).text("");
                    }
                } catch (e) {
                    $(ImportFile.SELECTORS.TxtFileUploadError).text("Dữ liệu trong file không phải là json!");
                    $(ImportFile.SELECTORS.Input_File).val('');
                    $(ImportFile.SELECTORS.fileNames).text("");
                }
            };
        });
    }
};
var EditMode3D = {
    GLOBAL: {
        polygon: null,
        path: null,
        isStartDraw: false,
        isEditDraw: false,
        listMarker: [],
        listPolyline: [],
        polylineTemp: null,
        polygonDraw: null,
        objFile: null,
        textureFile: null,
        objectModel: null,
        locationObject: {},
        scale: 1,
        bearing: 0,
        elevation: 0,
        heightScale: 1,
        objectModeDefault: null,
        fileObjSave: null,
        fileTextureSave: null,
        lstResultfile: {
            obj: null,
            image: null
        },
        listObjectEdit: [],
        objectModelEidt: null,
    },
    CONSTS: {
        key: "208e1c99aa440d8bc2847aafa3bc0669",
        sizeFile: 500,
    },
    SELECTORS: {
        modalMode3D: ".modal-edit-mode-3d",
        btnMode3D: ".btn-edit-mode-3d",
        iCheck: 'input[type="checkbox"].flat-red, input[type="radio"].flat-red',
        modelObject: "input[name='modelObject']",
        drawObject: "#drawObject",
        modelObjectCheck: "input[name='modelObject']:checked",
        formUpdateMode: ".upload-object",
        formDrawMode: ".draw-object",
        formModeObject: ".object-mode",
        btnStartDraw: "#btnStartDraw",
        btnEditDraw: "#btnEditDraw",
        btnEndDraw: "#btnEndDraw",
        btnDeleteDraw: "#btnDeleteDraw",
        txtScale: '#Scale',
        txtBearing: '#Bearing',
        txtElevation: '#Elevation',
        txtHeightScale: '#HeightScale',
        txtHeightfloor: "#Heightfloor",
        txtAreaFloor: "#AreaFloor",
        txtNameObject: "#txtName",
        inputFile: '#objFile',
        selectObjectMode: '.object-mode-3d',
        btnSaveMode3D: ".btn-save-mode-3d",
        focusInput: ".project-content input",
        loadingModel3D: ".modal-edit-mode-3d #loading-map-mode3d"
    },
    init: function () {
        mapMode3D = null;
        $(EditMode3D.SELECTORS.btnMode3D).on("click", function () {
            if (mapMode3D === null || typeof mapMode3D === "undefined" || mapMode3D === "") {
                mapMode3D = new map4d.Map(document.getElementById("mapMode3D"), {
                    zoom: 17,
                    center: { lat: 10.678087311284315, lng: 105.08063708265138 },
                    geolocate: true,
                    minZoom: 3,
                    maxZoom: 22,
                    tilt: 63,
                    controls: true,
                    controlOptions: map4d.ControlOptions.BOTTOM_RIGHT,
                    accessKey: "208e1c99aa440d8bc2847aafa3bc0669",
                });
                mapMode3D.setTileFeatureVisible(false, true)
                mapMode3D.setTileUrl("http://61.28.233.229:8080/all/2d/{z}/{x}/{y}.png");
                mapMode3D.setTileUrl("http://61.28.233.229:8080/all/3d/{z}/{x}/{y}.png", true);
                mapMode3D.setPlacesEnabled(false);
                mapMode3D.setSwitchMode(map4d.SwitchMode.Auto);
                EditMode3D.setEvent();
            }
            setTimeout(function () {
                EditMode3D.drawPolygon(ViewMap.GLOBAL.commonData);
                setTimeout(function () {
                    EditMode3D.fitBoundsThuaDat(EditMode3D.GLOBAL.path);
                    var camera = mapMode3D.getCamera();
                    let zoom = camera.getZoom();
                    camera.setZoom(zoom - 1);
                    camera.setTilt(63);
                    mapMode3D.setCamera(camera);
                }, 1000);
            }, 1);
            $(EditMode3D.SELECTORS.modalMode3D).modal("show");
        });
    },
    setEvent: function () {
        //$(EditMode3D.SELECTORS.btnMode3D).on("click", function () {
        //    setTimeout(function () {
        //        EditMode3D.drawPolygon(ViewMap.GLOBAL.commonData);
        //        setTimeout(function () {
        //            EditMode3D.fitBoundsThuaDat(EditMode3D.GLOBAL.path);
        //            var camera = mapMode3D.getCamera();
        //            let zoom = camera.getZoom();
        //            camera.setZoom(zoom - 1);
        //            camera.setTilt(63);
        //            mapMode3D.setCamera(camera);
        //        }, 1000);
        //    }, 1);
        //    $(EditMode3D.SELECTORS.modalMode3D).modal("show");
        //});
        $(EditMode3D.SELECTORS.modalMode3D).on('shown.bs.modal', function () {
            mapMode3D.showMapObject(false);
            map.showMapObject(false);
            map.enable3dMode(false);
            setTimeout(function () {
                EditMode3D.getObjectOnThuaDat();
            }, 1000);
        });
        $(EditMode3D.SELECTORS.modalMode3D).on('hidden.bs.modal', function () {
            EditMode3D.resetPolygon();
            EditMode3D.GLOBAL.isStartDraw = false;
            EditMode3D.GLOBAL.isEditDraw = false;
            EditMode3D.GLOBAL.locationObject = {};
            //set vẽ đáy
            $(EditMode3D.SELECTORS.drawObject).attr('checked', 'checked');
            $(EditMode3D.SELECTORS.drawObject).prop("checked", true);
            $(EditMode3D.SELECTORS.formUpdateMode).hide();
            $(EditMode3D.SELECTORS.formDrawMode).show();
            $(EditMode3D.SELECTORS.formModeObject).hide();
            $(EditMode3D.SELECTORS.txtScale).val(1);
            $(EditMode3D.SELECTORS.txtBearing).val(0);
            $(EditMode3D.SELECTORS.txtHeightScale).val(1);
            $(EditMode3D.SELECTORS.txtElevation).val(0);
            $(EditMode3D.SELECTORS.selectObjectMode).val("0");
            $(EditMode3D.SELECTORS.txtAreaFloor).val(0);
            $(EditMode3D.SELECTORS.txtHeightfloor).val(1);
            $(EditMode3D.SELECTORS.txtNameObject).val("");
            map.showMapObject(true);
            map.enable3dMode(false);
        });
        $(EditMode3D.SELECTORS.modelObject).on("change", function () {
            let check = $(EditMode3D.SELECTORS.modelObjectCheck).val();
            if (check === "2") {
                $(EditMode3D.SELECTORS.formDrawMode).show();
                $(EditMode3D.SELECTORS.formUpdateMode).hide();
                $(EditMode3D.SELECTORS.formModeObject).hide();
            }
            if (typeof EditMode3D.GLOBAL.locationObject.lat != "undefined") {
                if (check === "1") {
                    $(EditMode3D.SELECTORS.formUpdateMode).show();
                    $(EditMode3D.SELECTORS.formDrawMode).hide();
                    $(EditMode3D.SELECTORS.formModeObject).hide();
                }
                if (check === "3") {

                    $(EditMode3D.SELECTORS.formUpdateMode).hide();
                    $(EditMode3D.SELECTORS.formDrawMode).hide();
                    $(EditMode3D.SELECTORS.formModeObject).show();
                }
            } else {
                $(EditMode3D.SELECTORS.drawObject).attr('checked', 'checked');
                $(EditMode3D.SELECTORS.drawObject).prop("checked", true);
                swal({
                    title: "Thông báo",
                    text: "Bạn chưa vẽ đáy tòa nhà",
                    icon: "warning",
                    button: "Đóng",
                }).then((value) => {
                });
            }
        })
        //change object default mode 3d and drawing
        $(EditMode3D.SELECTORS.selectObjectMode).on("change.select2", function () {
            let val = $(this).val();
            let objname = $(this).find("option[value = '" + val + "']").attr("data-objname");
            let texturename = $(this).find("option[value = '" + val + "']").attr("data-texturename");
            EditMode3D.createObjectModeDefault(val, EditMode3D.GLOBAL.locationObject.lat, EditMode3D.GLOBAL.locationObject.lng, EditMode3D.GLOBAL.scale, EditMode3D.GLOBAL.bearing, EditMode3D.GLOBAL.elevation, objname, texturename);
        });
        $(EditMode3D.SELECTORS.btnSaveMode3D).on("click", function () {
            EditMode3D.saveMode3D();
        });

        $(EditMode3D.SELECTORS.focusInput).on("click", function () {
            $(this).parent().removeClass("has-error");
        });

        let eventClickMap = mapMode3D.addListener("click", (args) => {
            if (EditMode3D.GLOBAL.isStartDraw) {
                EditMode3D.createMarkerDrawLoDat(args.location.lat, args.location.lng, false);
                if (EditMode3D.GLOBAL.listMarker.length <= 2) {
                    let iLatLng = [];
                    $.each(EditMode3D.GLOBAL.listMarker, function () {
                        let latLng = { lat: this.getPosition().lat, lng: this.getPosition().lng };
                        iLatLng.push(latLng);
                    });
                    EditMode3D.createPolylineLoDat(iLatLng, 3.0, 1.0, true);
                }
                if (EditMode3D.GLOBAL.listMarker.length > 2) {
                    let iLatLng = [];
                    $.each(EditMode3D.GLOBAL.listMarker, function () {
                        let latLng = { lat: this.getPosition().lat, lng: this.getPosition().lng };
                        iLatLng.push(latLng);
                    });
                    iLatLng.push(iLatLng[0]);
                    EditMode3D.createPolygonArea(iLatLng);
                }
            }
        }, { polygon: true, polyline: true });

        let eventMouseMove = mapMode3D.addListener("mouseMove", (args) => {
            if (EditMode3D.GLOBAL.isStartDraw && EditMode3D.GLOBAL.listMarker.length > 0) {
                let path = [];
                let listMarker = EditMode3D.GLOBAL.listMarker;
                let endPoint = [listMarker[listMarker.length - 1].getPosition().lng, listMarker[listMarker.length - 1].getPosition().lat];
                let mousePoint = [args.location.lng, args.location.lat];
                path.push(endPoint);
                path.push(mousePoint);
                EditMode3D.createPolylineByMouseMoveLoDat(path, 3.0, 0.7);
                EditMode3D.ShowMeterDraw(endPoint, mousePoint);
            }
            if ((!EditMode3D.GLOBAL.isStartDraw) && EditMode3D.GLOBAL.polylineTemp != null) {
                EditMode3D.GLOBAL.polylineTemp.setMap(null);
            }
        });

        let eventDoubleClickMap = mapMode3D.addListener("dblClick", (args) => {
            if (EditMode3D.GLOBAL.isStartDraw) {
                EditMode3D.GLOBAL.isStartDraw = false;
                markerMeter.setMap(null);
                $(EditMode3D.SELECTORS.btnEndDraw).trigger("click");
                EditMode3D.previewObjectOnMap();
            }
        }, { marker: true });

        let eventDragEndMarker = mapMode3D.addListener("drag", function (data) {
            if (EditMode3D.GLOBAL.isEditDraw) {
                let listMarkerDraw = EditMode3D.GLOBAL.listMarker;
                for (let i = 0; i < listMarkerDraw.length; i++) {
                    if (listMarkerDraw[i].id == data.marker.id) {
                        listMarkerDraw[i] = data.marker;
                        if (listMarkerDraw.length > 2) {
                            let iLatLng = [];
                            $.each(listMarkerDraw, function () {
                                let latLng = { lat: this.getPosition().lat, lng: this.getPosition().lng };
                                iLatLng.push(latLng);
                            });
                            iLatLng.push(iLatLng[0]);
                            EditMode3D.createPolygonArea(iLatLng);
                            EditMode3D.previewObjectOnMap();
                        }
                        break;
                    }
                }
            }
        }, { marker: true });

        let eventDragEnd = mapMode3D.addListener("drag", function (data) {
            lat = EditMode3D.GLOBAL.objectModel.getLocation().lat;
            lng = EditMode3D.GLOBAL.objectModel.getLocation().lng;
            let check = $(EditMode3D.SELECTORS.modelObjectCheck).val();
            if (check === "2") {
                if (EditMode3D.GLOBAL.objectModel != null) {
                    if (EditMode3D.GLOBAL.objectModel.getTransformedCoordinates().length > 0) {
                        EditMode3D.updateMarkerDrawAndPolygonDraw();
                    } else {
                        EditMode3D.movePolygonModelToLocation(lat, lng);
                    }
                }
            }
        }, { object: true });

        let eventClickObject = mapMode3D.addListener("click", function (data) {
            console.log(data);
            let obj = EditMode3D.GLOBAL.listObjectEdit.find(x => x.id == data.object.id);
            if (typeof obj !== "undefined" && obj !== null && typeof obj.id !== "undefined") {
                let polygonEdit = obj.polygon;
                if (typeof polygonEdit !== "undefined" && polygonEdit !== null) {
                    for (var i = 0; i < polygonEdit.paths[0].length - 1; i++) {
                        let latlng = polygonEdit.paths[0][i]
                        EditMode3D.createMarkerDrawLoDat(latlng.lat, latlng.lng);
                    }
                    EditMode3D.GLOBAL.polygonDraw = polygonEdit;
                    $(EditMode3D.SELECTORS.btnStartDraw).addClass("hide");
                    $(EditMode3D.SELECTORS.btnEndDraw).addClass("hide");
                    $(EditMode3D.SELECTORS.btnEditDraw).removeClass("hide");
                    $(EditMode3D.SELECTORS.btnDeleteDraw).removeClass("hide");
                }
                if (typeof obj.object !== "undefined") {
                    EditMode3D.GLOBAL.objectModel = obj.object;
                    EditMode3D.GLOBAL.objectModelEidt = obj.object.id;
                    $(EditMode3D.SELECTORS.txtScale).val(obj.object.scale);
                    $(EditMode3D.SELECTORS.txtBearing).val(obj.object.bearing);
                    $(EditMode3D.SELECTORS.txtHeightScale).val(obj.object.height);
                    $(EditMode3D.SELECTORS.txtElevation).val(obj.object.elevation);
                    if (typeof obj.tags !== "undefined" && obj.tags.area !== "undefined" && obj.tags.floor !== "undefined") {
                        $(EditMode3D.SELECTORS.txtAreaFloor).val(obj.tags.area);
                        $(EditMode3D.SELECTORS.txtHeightfloor).val(obj.tags.floor);
                    }
                    if (typeof obj.name !== "undefined" && obj.name !== "" && obj.name !== null) {
                        $(EditMode3D.SELECTORS.txtNameObject).val(obj.name);
                    }
                    EditMode3D.updateLocation();
                }
            }
            //lat = EditMode3D.GLOBAL.objectModel.getLocation().lat;
            //lng = EditMode3D.GLOBAL.objectModel.getLocation().lng;
            //let check = $(EditMode3D.SELECTORS.modelObjectCheck).val();
            //if (check === "2") {
            //    if (EditMode3D.GLOBAL.objectModel != null) {
            //        if (EditMode3D.GLOBAL.objectModel.getTransformedCoordinates().length > 0) {
            //            EditMode3D.updateMarkerDrawAndPolygonDraw();
            //        } else {
            //            EditMode3D.movePolygonModelToLocation(lat, lng);
            //        }
            //    }
            //}
        }, { object: true });

        $(EditMode3D.SELECTORS.inputFile).on("change", function () {
            var file = this.files;
            for (var i = 0; i < file.length; i++) {
                if (file[i].size <= 512000) { //// 500kB
                    if (file[i].type.split('/')[0] == "image") {
                        let fileImage = file[i];
                        let reader = new FileReader();
                        reader.readAsDataURL(fileImage);
                        reader.onload = function (e) {
                            EditMode3D.GLOBAL.textureFile = reader.result;
                            EditMode3D.previewObjectOnMap();
                        };
                        EditMode3D.GLOBAL.fileTextureSave = file[i];
                    }
                    if (file[i].name.split('.')[1] == "obj") {
                        let fileObj = file[i];
                        let reader = new FileReader();
                        reader.readAsText(fileObj);
                        reader.onload = function (e) {
                            EditMode3D.GLOBAL.objFile = reader.result;
                            EditMode3D.previewObjectOnMap();
                        };
                        EditMode3D.GLOBAL.fileObjSave = file[i];
                    }
                } else {
                    swal({
                        title: "Thông báo",
                        text: `File ${file[i].name} vượt quá dung lượng 500kB`,
                        icon: "warning",
                        button: "Đóng"
                    });
                }
            }
        });

        $(EditMode3D.SELECTORS.btnStartDraw).on("click", function () {
            EditMode3D.resetPolygon();
            EditMode3D.GLOBAL.isStartDraw = true;
            EditMode3D.GLOBAL.isEditDraw = false;
            $(EditMode3D.SELECTORS.btnStartDrawLoDat).prop("disabled", true);
            $(EditMode3D.SELECTORS.btnEditDrawLoDat).prop("disabled", true);
            $(EditMode3D.SELECTORS.btnStartDraw).addClass("hide");
            $(EditMode3D.SELECTORS.btnEndDraw).removeClass("hide");
            $(EditMode3D.SELECTORS.btnDeleteDraw).removeClass("hide");
        });

        $(EditMode3D.SELECTORS.btnEndDraw).on("click", function () {
            if (EditMode3D.GLOBAL.polygonDraw != null) {
                EditMode3D.GLOBAL.isStartDraw = false;
                EditMode3D.GLOBAL.isEditDraw = false;
                EditMode3D.changeEditMode();
                $(EditMode3D.SELECTORS.btnStartDraw).addClass("hide");
                $(EditMode3D.SELECTORS.btnEndDraw).addClass("hide");
                $(EditMode3D.SELECTORS.btnEditDraw).removeClass("hide");
                $(EditMode3D.SELECTORS.btnDeleteDraw).removeClass("hide");
            }
            else {
                $(EditMode3D.SELECTORS.btnDeleteDraw).trigger("click");
            }
        });

        $(EditMode3D.SELECTORS.btnEditDraw).on("click", function () {
            if (EditMode3D.GLOBAL.listMarker.length > 2) {
                EditMode3D.GLOBAL.isStartDraw = false;
                EditMode3D.GLOBAL.isEditDraw = true;
                EditMode3D.changeEditMode();
                $(EditMode3D.SELECTORS.btnStartDraw).addClass("hide");
                $(EditMode3D.SELECTORS.btnEditDraw).addClass("hide");
                $(EditMode3D.SELECTORS.btnEndDraw).removeClass("hide");
                $(EditMode3D.SELECTORS.btnDeleteDraw).removeClass("hide");
            }
            else {
                $(EditMode3D.SELECTORS.btnDeleteDraw).trigger("click");
            }
        });

        $(EditMode3D.SELECTORS.btnDeleteDraw).on("click", function () {
            $(EditMode3D.SELECTORS.btnStartDrawLoDat).prop("disabled", false);
            $(EditMode3D.SELECTORS.btnEditDrawLoDat).prop("disabled", false);
            if (EditMode3D.GLOBAL.objectModelEidt !== null) {
                swal({
                    title: "Thông báo",
                    text: "Bạn có chắc chắn xóa đối tượng này không!",
                    icon: "warning",
                    buttons: [
                        'Hủy',
                        'Đồng ý'
                    ],
                    dangerMode: true,
                }).then((willDelete) => {
                    if (willDelete) {
                        if (EditMode3D.GLOBAL.objectModel != null) {
                            EditMode3D.deleteModel3D(EditMode3D.GLOBAL.objectModelEidt);
                        }
                    }
                });
            } else {
                EditMode3D.resetPolygon();
            }
        });

        $Bearing = $(EditMode3D.SELECTORS.txtBearing).spinner({
            max: 180,
            min: -180
        });
        $Scale = $(EditMode3D.SELECTORS.txtScale).spinner({
            step: 0.1,
            min: 0
        });
        $Elevation = $(EditMode3D.SELECTORS.txtElevation).spinner();
        $HeightScale = $(EditMode3D.SELECTORS.txtHeightScale).spinner();
        $floorArea = $(EditMode3D.SELECTORS.floorArea).spinner({
            min: 0,
            step: 0.1
        });
        $heightBuilding = $(EditMode3D.SELECTORS.heightBuilding).spinner({
            min: 0,
            step: 0.1
        });
        $(EditMode3D.SELECTORS.txtScale).on("spinstop", function () {
            EditMode3D.GLOBAL.scale = parseFloat($(this).spinner("value"));
            if (EditMode3D.GLOBAL.objectModel != null) {
                EditMode3D.GLOBAL.objectModel.setScale(EditMode3D.GLOBAL.scale);
                if (EditMode3D.GLOBAL.objectModel.getTransformedCoordinates().length > 0) {
                    EditMode3D.updateMarkerDrawAndPolygonDraw();
                    EditMode3D.updateLocation();
                }
            }
        });
        $(EditMode3D.SELECTORS.txtBearing).on("spinstop", function () {
            EditMode3D.GLOBAL.bearing = parseFloat($(this).spinner("value"));
            if (EditMode3D.GLOBAL.objectModel != null) {
                EditMode3D.GLOBAL.objectModel.setBearing(EditMode3D.GLOBAL.bearing);
            }
            if (EditMode3D.GLOBAL.polygonDraw != null && EditMode3D.GLOBAL.objectModel != null && EditMode3D.GLOBAL.objectModel.getTransformedCoordinates().length > 0) {
                EditMode3D.updateMarkerDrawAndPolygonDraw();
                EditMode3D.updateLocation();
            }
        });
        $(EditMode3D.SELECTORS.txtElevation).on("spinstop", function () {
            EditMode3D.GLOBAL.elevation = parseFloat($(this).spinner("value"));
            if (EditMode3D.GLOBAL.objectModel != null) {
                EditMode3D.GLOBAL.objectModel.setElevation(EditMode3D.GLOBAL.elevation);
            }
        });
        $(EditMode3D.SELECTORS.txtHeightScale).on("spinstop", function () {
            EditMode3D.GLOBAL.heightScale = parseFloat($(this).spinner("value"));
            if (EditMode3D.GLOBAL.objectModel != null) {
                EditMode3D.GLOBAL.objectModel.setHeight(EditMode3D.GLOBAL.heightScale);
            }
        });
        EditMode3D.setSelectObjectModel();
    },
    setSelectObjectModel: function () {
        $.ajax({
            type: "GET",
            url: "https://api.map4d.vn//v2/api/model/all",
            data: {
                key: EditMode3D.CONSTS.key
            },
            success: function (data) {
                if (data.code = "ok" && data.result != null && typeof data.result != "undefined") {
                    if (data.result.length > 0) {
                        //EditMode3D.GLOBAL.objectModeDefault = data.result
                        let option = data.result;
                        let str = "<option value='0'>---chọn mẫu---</option>";
                        for (var i = 0; i < option.length; i++) {
                            str += "<option value='" + option[i].id + "' data-objName='" + option[i].objName + "' data-textureName='" + option[i].textureName + "'>" + option[i].name + "</option>"
                        }
                        $(EditMode3D.SELECTORS.selectObjectMode).append(str);
                    }
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                let messageErorr = AppCommon.getMessageErrorReuqest(jqXHR, errorThrown);
                console.log(messageErorr);
                ViewMap.showLoading(false);
            }
        });
    },
    resetPolygon: function () {
        if (EditMode3D.GLOBAL.objectModel != null) {
            EditMode3D.GLOBAL.objectModel.setMap(null);
            EditMode3D.GLOBAL.objectModel = null;
        }
        if (EditMode3D.GLOBAL.polygonDraw != null) {
            EditMode3D.GLOBAL.polygonDraw.setMap(null);
            EditMode3D.GLOBAL.polygonDraw = null;
            EditMode3D.GLOBAL.objFile = null;
            EditMode3D.GLOBAL.textureFile = null;
            EditMode3D.GLOBAL.fileObjSave = null;
            EditMode3D.GLOBAL.fileTextureSave = null;
            EditMode3D.GLOBAL.lstResultfile.image = [];
            EditMode3D.GLOBAL.lstResultfile.obj = [];
        }
        EditMode3D.GLOBAL.objectModelEidt = null;
        $.each(EditMode3D.GLOBAL.listMarker, function () {
            this.setMap(null);
        })
        EditMode3D.GLOBAL.listMarker = [];
        EditMode3D.GLOBAL.isStartDraw = false;
        EditMode3D.GLOBAL.isEditDraw = false;
        $(EditMode3D.SELECTORS.btnStartDraw).removeClass("hide");
        $(EditMode3D.SELECTORS.btnEndDraw).addClass("hide");
        $(EditMode3D.SELECTORS.btnEditDraw).addClass("hide");
        $(EditMode3D.SELECTORS.btnDeleteDraw).addClass("hide");

    },
    drawPolygon: function (data) {
        let feature = data.features[0];
        let paths = EditMode3D.convertCoordinate(data.features[0]);
        if (EditMode3D.GLOBAL.polygon !== null) {
            EditMode3D.GLOBAL.polygon.setMap(null);
        }
        EditMode3D.GLOBAL.polygon = new map4d.Polygon({
            paths: paths,
            fillColor: "#0000ff",
            fillOpacity: 0.2,
            strokeColor: "#ea5252",
            strokeOpacity: 1.0,
            strokeWidth: 1
        });
        EditMode3D.GLOBAL.polygon.setMap(mapMode3D);
        EditMode3D.GLOBAL.path = paths;
    },
    convertCoordinate: function (data) {
        //if (data.geometry.type.toLocaleLowerCase() === "multipolygon") {
        //    let count = data.geometry.coordinates[0].length;
        //    let path = [];
        //    for (var i = 0; i < count; i++) {
        //        let datatemp = data.geometry.coordinates[0][i];
        //        path.push(datatemp);
        //    }
        //    return path;
        //}
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
    fitBoundsThuaDat: function (data) {
        let latLngBounds = new map4d.LatLngBounds();
        let paddingOptions = {
            top: 10,
            bottom: 50,
            left: 50,
            right: 50
        };

        for (var i = 0; i < data[0].length; i++) {
            latLngBounds.extend(data[0][i]);
        }
        mapMode3D.fitBounds(latLngBounds);
    },
    createMarkerDrawLoDat: function (lat, lng) {
        //tạo đối tượng marker từ MarkerOption
        let markerDraw = new map4d.Marker({
            position: { lat: lat, lng: lng },
            icon: new map4d.Icon(12, 12, "/images/yellow-point.png"),
            anchor: [0.5, 0.5],
            //title: name
        })
        //thêm marker vào map
        markerDraw.setMap(mapMode3D);
        EditMode3D.GLOBAL.listMarker.push(markerDraw);
    },
    //Tạo polyline lo dat
    createPolylineLoDat: function (path, strokeWidth, strokeOpacity, check) {
        if (EditMode3D.GLOBAL.polylineTemp != null) {
            EditMode3D.GLOBAL.polylineTemp.setMap(null);
        }
        //tạo đối tượng polyline từ PolylineOptions
        var polylineDistance = new map4d.Polyline({
            path: path, visible: true, strokeColor: "#FF8264", strokeWidth: strokeWidth, strokeOpacity: strokeOpacity,
            closed: false
        })
        //thêm polyline vào map
        polylineDistance.setMap(mapMode3D);
        EditMode3D.GLOBAL.listPolyline.push(polylineDistance)
    },
    createPolygonArea: function (data) {
        EditMode3D.RemoveShape();
        if (EditMode3D.GLOBAL.polygonDraw != null) {
            EditMode3D.GLOBAL.polygonDraw.setMap(null);
        }
        if (EditMode3D.GLOBAL.polylineTemp != null) {
            EditMode3D.GLOBAL.polylineTemp.setMap(null);
        }
        let polygonOption = map4d.PolygonOptions = {
            paths: [data], fillOpacity: 0.5
        }
        EditMode3D.GLOBAL.polygonDraw = new map4d.Polygon(polygonOption)
        //thêm object vào map
        EditMode3D.GLOBAL.polygonDraw.setMap(mapMode3D);

    },
    RemoveShape: function () {
        //replay distance
        let list = EditMode3D.GLOBAL.listPolyline;
        $.each(list, function (i, obj) {
            obj.setMap(null);
        });
    },
    ShowMeterDraw: function (endPoint, mousePoint) {
        let projection = new map4d.Projection(map)
        let screenCoordinate1 = projection.fromLatLngToScreen([endPoint[0], endPoint[1]]);
        let screenCoordinate2 = projection.fromLatLngToScreen([mousePoint[0], mousePoint[1]]);
        let x = (screenCoordinate1.x + screenCoordinate2.x) / 2;
        let y = (screenCoordinate1.y + screenCoordinate2.y) / 2;
        let latLngCoordinate = projection.fromScreenToLatLng({ x: x, y: y })
        let measure = new map4d.Measure([endPoint, mousePoint,]);
        let length = (Math.round(measure.length * 100) / 100).toString();
        //if (check) {
        if (markerMeter != null) markerMeter.setMap(null);
        markerMeter = new map4d.Marker({
            position: { lat: latLngCoordinate.lat, lng: latLngCoordinate.lng },
            anchor: [0.5, 1],
            visible: true,
            label: new map4d.MarkerLabel({ text: length + " m", color: "000000", fontSize: 12 }),
            icon: new map4d.Icon(32, 32, ""),
        })
        markerMeter.setMap(mapMode3D);
    },
    createPolylineByMouseMoveLoDat: function (path, strokeWidth, strokeOpacity) {
        if (EditMode3D.GLOBAL.polylineTemp != null) {
            EditMode3D.GLOBAL.polylineTemp.setMap(null);
        }
        //tạo đối tượng polyline từ PolylineOptions
        EditMode3D.GLOBAL.polylineTemp = new map4d.Polyline({
            path: path, visible: true, strokeColor: "#FF8264", strokeWidth: strokeWidth, strokeOpacity: strokeOpacity,
            closed: false
        })
        //thêm polyline vào map
        EditMode3D.GLOBAL.polylineTemp.setMap(mapMode3D)
    },
    changeEditMode: function () {
        if (EditMode3D.GLOBAL.isEditDraw) {
            //if (objectModel != null) {
            //    objectModel.setMap(null);
            //}
            for (let i = 0; i < EditMode3D.GLOBAL.listMarker.length; i++) {
                EditMode3D.GLOBAL.listMarker[i].setDraggable(true);
            }
            EditMode3D.GLOBAL.objectModel.setDraggable(false);
        }
        else {
            for (let i = 0; i < EditMode3D.GLOBAL.listMarker.length; i++) {
                EditMode3D.GLOBAL.listMarker[i].setDraggable(false);
            }
            if (EditMode3D.GLOBAL.objectModel != null) EditMode3D.GLOBAL.objectModel.setDraggable(true);
        }
    },
    //Preview object on map
    previewObjectOnMap: function () {
        if (EditMode3D.GLOBAL.polygonDraw != null) {
            if (EditMode3D.GLOBAL.objFile != null && EditMode3D.GLOBAL.textureFile != null && EditMode3D.GLOBAL.objFile != "" && EditMode3D.GLOBAL.textureFile != "") {
                EditMode3D.createobjectModelByFile(EditMode3D.GLOBAL.locationObject.lat, EditMode3D.GLOBAL.locationObject.lng, EditMode3D.GLOBAL.scale, EditMode3D.GLOBAL.bearing, EditMode3D.GLOBAL.elevation, EditMode3D.GLOBAL.objFile, EditMode3D.GLOBAL.textureFile);
            } else {
                if (EditMode3D.GLOBAL.objectModel != null && EditMode3D.GLOBAL.objectModel.coordinates.length == 0 && EditMode3D.GLOBAL.objectModel.obj.length > 0) {
                    //drawing mode default
                } else {
                    if (EditMode3D.GLOBAL.listMarker.length > 2) {
                        let iLatLng = [];
                        $.each(EditMode3D.GLOBAL.listMarker, function () {
                            let latLng = { lat: this.getPosition().lat, lng: this.getPosition().lng };
                            iLatLng.push(latLng);
                        });
                        iLatLng.push(iLatLng[0]);
                        if (EditMode3D.GLOBAL.objectModel != null) {
                            EditMode3D.GLOBAL.objectModel.setCoordinates(iLatLng);
                        }
                        else {
                            EditMode3D.createobjectModelByCoordinates(EditMode3D.GLOBAL.elevation, EditMode3D.GLOBAL.heightScale, iLatLng);
                        }
                    }
                }
            }
        }
    },
    //Tạo object by polygon
    createobjectModelByCoordinates: function (elevation, heightScale, iLatLng) {
        if (EditMode3D.GLOBAL.objectModel != null) {
            EditMode3D.GLOBAL.objectModel.setMap(null);
        }
        //tạo đối tượng model từ ObjectOption
        EditMode3D.GLOBAL.objectModel = new map4d.MapObject({
            id: EditMode3D.createGuid(),
            scale: 1, // Tỉ lệ vẽ của đối tượng
            coordinates: iLatLng,
            bearing: 0, // Góc quay của đối tượng
            elevation: elevation, // Độ cao so với mặt nước biển
            height: heightScale,
        })

        //thêm object vào map
        EditMode3D.GLOBAL.objectModel.setMap(mapMode3D);
        EditMode3D.GLOBAL.objectModel.setDraggable(true);
        mapMode3D.setSelectedObjects([EditMode3D.GLOBAL.objectModel.getId()]);
        EditMode3D.updateLocation();
    },
    movePolygonModelToLocation: function (lat, lng) {
        if (EditMode3D.GLOBAL.polygonDraw != null) {
            EditMode3D.GLOBAL.polygonDraw.setMap(null);
        }
        $.each(EditMode3D.GLOBAL.listMarker, function () {
            this.setMap(null);
        })
        EditMode3D.GLOBAL.listMarker = [];
        if (EditMode3D.GLOBAL.polygonDraw != null) {
            let coordinatesPoly = EditMode3D.GLOBAL.polygonDraw.getPaths();
            let coordinateTransformer = new map4d.CoordinateTransformer(coordinatesPoly[0]);
            let coordinateTransformerPolygon = coordinateTransformer.translate({ lat: lat, lng: lng });
            if (coordinateTransformerPolygon.length > 2) {
                let coordinatesPolygon = [];
                for (let i = 0; i < coordinateTransformerPolygon.length - 1; i++) {
                    EditMode3D.createMarkerDrawLoDat(coordinateTransformerPolygon[i].lat, coordinateTransformerPolygon[i].lng);
                    let latLng = { lat: coordinateTransformerPolygon[i].lat, lng: coordinateTransformerPolygon[i].lng };
                    coordinatesPolygon.push(latLng);
                }
                coordinatesPolygon.push(coordinatesPolygon[0]);
                EditMode3D.createPolygonArea(coordinatesPolygon);
            }
        }
    },
    updateMarkerDrawAndPolygonDraw: function () {
        if (EditMode3D.GLOBAL.polygonDraw != null) {
            EditMode3D.GLOBAL.polygonDraw.setMap(null);
        }
        $.each(EditMode3D.GLOBAL.listMarker, function () {
            this.setMap(null);
        })
        EditMode3D.GLOBAL.listMarker = [];
        if (EditMode3D.GLOBAL.objectModel.getTransformedCoordinates().length > 0) {
            let coordinatesTemp = EditMode3D.GLOBAL.objectModel.getTransformedCoordinates();
            if (coordinatesTemp.length > 2) {
                let coordinatesPolygon = [];
                for (let i = 0; i < coordinatesTemp.length - 1; i++) {
                    EditMode3D.createMarkerDrawLoDat(coordinatesTemp[i].lat, coordinatesTemp[i].lng);
                    let latLng = { lat: coordinatesTemp[i].lat, lng: coordinatesTemp[i].lng };
                    coordinatesPolygon.push(latLng);
                }
                coordinatesPolygon.push(coordinatesPolygon[0]);
                EditMode3D.createPolygonArea(coordinatesPolygon);
            }
        }
    },
    updateLocation: function () {
        if (EditMode3D.GLOBAL.objectModel != null) {
            let location = EditMode3D.GLOBAL.objectModel.getLocation();
            if (location != null) {
                EditMode3D.GLOBAL.locationObject.lat = location.lat;
                EditMode3D.GLOBAL.locationObject.lng = location.lng;
            }
        }
    },
    //Tạo object by file upload
    createobjectModelByFile: function (lat, lng, scaleNumber, bearingNumber, elevationNumber, objData, textureData) {
        let objectId = EditMode3D.createGuid();
        if (EditMode3D.GLOBAL.objectModel != null) {
            objectId = EditMode3D.GLOBAL.objectModel.id;
            EditMode3D.GLOBAL.objectModel.setMap(null);
            EditMode3D.GLOBAL.objectModel = null;
        }

        //tạo đối tượng model từ ObjectOption
        EditMode3D.GLOBAL.objectModel = new map4d.MapObject({
            name: "Tòa nhà",
            id: objectId,
            scale: scaleNumber, // Tỉ lệ vẽ của đối tượng
            bearing: bearingNumber, // Góc quay của đối tượng
            elevation: elevationNumber, // Độ cao so với mặt nước biển
            location: { lat: lat, lng: lng },
            obj: { reuseId: "", data: objData },
            texture: { reuseId: "", data: textureData }
        })

        //thêm object vào map
        EditMode3D.GLOBAL.objectModel.setMap(mapMode3D);
        EditMode3D.GLOBAL.objectModel.setDraggable(true);
        EditMode3D.updateLocation();
    },
    //Tạo object by mode default
    createObjectModeDefault: function (id, lat, lng, scaleNumber, bearingNumber, elevationNumber, objName, textureName) {
        let objectId = EditMode3D.createGuid();
        if (EditMode3D.GLOBAL.objectModel != null) {
            objectId = EditMode3D.GLOBAL.objectModel.id;
            EditMode3D.GLOBAL.objectModel.setMap(null);
            EditMode3D.GLOBAL.objectModel = null;
        }
        EditMode3D.GLOBAL.objectModel = new map4d.MapObject({
            name: "Tòa nhà",
            id: id,
            scale: scaleNumber, // Tỉ lệ vẽ của đối tượng
            bearing: bearingNumber, // Góc quay của đối tượng
            elevation: elevationNumber, // Độ cao so với mặt nước biển
            location: { lat: lat, lng: lng },
            obj: objName,
            texture: textureName
        })

        //thêm object vào map
        EditMode3D.GLOBAL.objectModel.setMap(mapMode3D);
        EditMode3D.GLOBAL.objectModel.setDraggable(true);
        EditMode3D.updateLocation();
    },
    createGuid: function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },
    saveMode3D: function () {
        if (EditMode3D.checkFormInfor()) {
            let iLatLng = [];
            if (EditMode3D.GLOBAL.objectModel !== null && ViewMap.GLOBAL.commonData !== null) {
                if (EditMode3D.GLOBAL.listMarker.length > 2) {
                    $.each(EditMode3D.GLOBAL.listMarker, function () {
                        let latLng = { lat: this.getPosition().lat, lng: this.getPosition().lng };
                        iLatLng.push(latLng);
                    });
                    iLatLng.push(iLatLng[0]);
                }
                let featuresTD = ViewMap.GLOBAL.commonData.features[0];
                if (typeof featuresTD !== "undefined") {

                    let soTo = featuresTD.properties.SoHieuToBanDo;
                    let soThua = featuresTD.properties.SoThuTuThua;
                    let maXa = featuresTD.properties.MaXa;
                    var tiles = null;
                    EditMode3D.GLOBAL.objectModel.getTileCovers([17, 18, 19], function (data) {
                        tiles = data;
                    });
                    //EditMode3D.saveObjectFile();
                    if (tiles !== null && typeof tiles !== "undefined") {
                        //let check = EditMode3D.GLOBAL.listObjectEdit.find(x => x.id == EditMode3D.GLOBAL.objectModel.id);
                        if (typeof EditMode3D.GLOBAL.objectModelEidt !== "undefined" && EditMode3D.GLOBAL.objectModelEidt !== null) {
                            EditMode3D.updateModel3DThuaDat(EditMode3D.GLOBAL.objectModelEidt, tiles, maXa, soTo, soThua, iLatLng);
                        } else {
                            let object = {
                                name: $(EditMode3D.SELECTORS.txtNameObject).val(),
                                "places": [],
                                location: {
                                    lng: EditMode3D.GLOBAL.objectModel.getLocation().lng,
                                    lat: EditMode3D.GLOBAL.objectModel.getLocation().lat
                                },
                                scale: EditMode3D.GLOBAL.objectModel.getScale(),
                                bearing: EditMode3D.GLOBAL.objectModel.getBearing(),
                                elevation: EditMode3D.GLOBAL.objectModel.getElevation(),
                                "heightScale": 0,
                                "camera": {
                                    "zoom": 0,
                                    "bearing": 0,
                                    "tilt": 0,
                                    "target": {
                                        "lng": 0,
                                        "lat": 0
                                    }
                                },
                                "model": EditMode3D.setObjectModel(),
                                "types": [],
                                "minZoom": 17,
                                "maxZoom": 19,
                                "addressComponents": EditMode3D.getAddressComponents(EditMode3D.GLOBAL.objectModel.getLocation().lat, EditMode3D.GLOBAL.objectModel.getLocation().lng),
                                "startDate": EditMode3D.getDataNowFromat(),
                                "endDate": null,
                                tiles: tiles,
                                "address": null,
                                tags: {
                                    area: Number($(EditMode3D.SELECTORS.txtAreaFloor).val()),
                                    floor: Number($(EditMode3D.SELECTORS.txtHeightfloor).val())
                                },
                                maXa: maXa,
                                soTo: soTo,
                                soThua: soThua,
                                polygon: iLatLng,
                            };
                            EditMode3D.showLoading(true);
                            $.ajax({
                                type: "POST",
                                url: ViewMap.GLOBAL.url + "/v2/api/object?key=" + ViewMap.CONSTS.key,
                                data: JSON.stringify(object),
                                dataType: 'json',
                                async: true,
                                contentType: 'application/json-patch+json',
                                success: function (data) {
                                    EditMode3D.showLoading(false);
                                    if (data.code == "ok") {
                                        swal({
                                            title: "Thông báo",
                                            text: "Cập nhật thông tin không gian 3D thành công!",
                                            icon: "success",
                                            button: "Đóng",
                                        }).then((value) => {
                                            $(EditMode3D.SELECTORS.modalMode3D).modal('hide');
                                            map.showMapObject(true);
                                            map.enable3dMode(true);
                                        });
                                    } else {
                                        swal({
                                            title: "Thông báo",
                                            text: "Cập nhật đã bị lỗi hệ thống!",
                                            icon: "warning",
                                            button: "Đóng",
                                        }).then((value) => {
                                            $(EditMode3D.SELECTORS.modalMode3D).modal('hide');
                                            map.showMapObject(true);
                                            map.enable3dMode(true);
                                        });
                                    }
                                },
                                error: function (errorThrown) {
                                    //let messageErorr = AppCommon.getMessageErrorReuqest(jqXHR, errorThrown);
                                    console.log(messageErorr);
                                    swal({
                                        title: "Thông báo",
                                        text: "Cập nhật đã bị lỗi hệ thống!",
                                        icon: "warning",
                                        button: "Đóng",
                                    });
                                    EditMode3D.showLoading(false);
                                }
                            });
                            EditMode3D.showLoading(false);
                        }
                    }
                }
            } else {
                swal({
                    title: "Thông báo",
                    text: "Chưa có dữ liệu không gian 3D",
                    icon: "error",
                    button: "Đóng",
                })
            }
        }
    },
    getMode3DThuaDat: function () {
        if (ViewMap.GLOBAL.commonData !== null) {
            let featuresTD = ViewMap.GLOBAL.commonData.features[0];
            if (typeof featuresTD !== "undefined") {
                let soTo = featuresTD.properties.SoHieuToBanDo;
                let soThua = featuresTD.properties.SoThuTuThua;
                let maXa = featuresTD.properties.MaXa;
                $.ajax({
                    type: "GET",
                    url: "",
                    data: {
                        key: ViewMap.CONSTS.key
                    },
                    success: function (data) {
                        //if (data.code = "ok" && data.result != null && typeof data.result != "undefined") {
                        //    if (data.result.length > 0) {
                        //        //EditMode3D.GLOBAL.objectModeDefault = data.result
                        //        let option = data.result;
                        //        let str = "<option value='0'>---chọn mẫu---</option>";
                        //        for (var i = 0; i < option.length; i++) {
                        //            str += "<option value='" + option[i].id + "' data-objName='" + option[i].objName + "' data-textureName='" + option[i].textureName + "'>" + option[i].name + "</option>"
                        //        }
                        //        $(EditMode3D.SELECTORS.selectObjectMode).append(str);
                        //    }
                        //}
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        let messageErorr = AppCommon.getMessageErrorReuqest(jqXHR, errorThrown);
                        console.log(messageErorr);
                        ViewMap.showLoading(false);
                    }
                });
            }
        }
    },
    getDataNowFromat: function () {
        var d = new Date(),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    },
    getAddressComponents: function (lat, lng) {
        let AddressComponents = [];
        $.ajax({
            type: "GET",
            url: ViewMap.GLOBAL.url + "/v2/api/admin-level/latlng",
            data: { lat: lat, lng: lng, key: ViewMap.CONSTS.key },
            async: false,
            success: function (data) {
                if (data.result.length > 0) {
                    for (var i = data.result.length - 1; i >= 0; i--) {
                        let obj = data.result[i];
                        AddressComponents.push({ name: obj.name, type: obj.type, code: obj.code });
                    }
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                let messageErorr = AppCommon.getMessageErrorReuqest(jqXHR, errorThrown);
                console.log(messageErorr);
            }
        });
        return AddressComponents;
    },
    setObjectModel: function () {
        let model = null;
        //box white
        if (EditMode3D.GLOBAL.objectModel.getCoordinates().length > 0) {
            model = {
                id: null,
                objName: EditMode3D.GLOBAL.objectModel.getObj(),
                color: null,
                type: "Polygon",
                coordinates: EditMode3D.GLOBAL.objectModel.getCoordinates(),
                height: EditMode3D.GLOBAL.objectModel.getHeight(),
                textureName: EditMode3D.GLOBAL.objectModel.getTexture()
            }
            return model;
        }
        //object file
        if (typeof EditMode3D.GLOBAL.objectModel.getTexture().reuseId !== "undefined" && typeof EditMode3D.GLOBAL.objectModel.getObj().reuseId !== "undefined") {
            EditMode3D.saveObjectFile();
            if (EditMode3D.GLOBAL.lstResultfile.obj !== null && EditMode3D.GLOBAL.lstResultfile.image !== null) {
                model = {
                    id: null,
                    objName: EditMode3D.GLOBAL.lstResultfile.obj.name,
                    color: null,
                    type: "Object",
                    coordinates: EditMode3D.GLOBAL.objectModel.getCoordinates(),
                    height: 0,
                    textureName: EditMode3D.GLOBAL.lstResultfile.image.name
                }
                return model;
            }
        }
        //object default
        if (typeof EditMode3D.GLOBAL.objectModel.getTexture().reuseId === "undefined" && typeof EditMode3D.GLOBAL.objectModel.getObj().reuseId === "undefined") {
            model = {
                id: EditMode3D.GLOBAL.objectModel.getId(),
                objName: EditMode3D.GLOBAL.objectModel.getObj(),
                color: null,
                type: "Object",
                coordinates: EditMode3D.GLOBAL.objectModel.getCoordinates(),
                height: 0,
                textureName: EditMode3D.GLOBAL.objectModel.getTexture()
            }
            return model;
        }
    },
    saveObjectFile: function () {
        if (EditMode3D.GLOBAL.textureFile != null || EditMode3D.GLOBAL.objFile != null) {
            if (EditMode3D.GLOBAL.fileObjSave != null) {
                var formData = new FormData();
                formData.append('file', EditMode3D.GLOBAL.fileObjSave);
                $.ajax({
                    type: "POST",
                    url: ViewMap.GLOBAL.url + "/v2/api/file/obj/?key=" + ViewMap.CONSTS.key,
                    data: formData,
                    async: false,
                    contentType: false,
                    processData: false,
                    success: function (data) {
                        if (data.code == "ok" && data.result != null && data.result != null) {
                            EditMode3D.GLOBAL.lstResultfile.obj = data.result;
                        } else {
                            swal({
                                title: "Thông báo",
                                text: "Không thể lưu file obj",
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
            }
            if (EditMode3D.GLOBAL.fileTextureSave != null) {
                var formData2 = new FormData();
                formData2.append('file', EditMode3D.GLOBAL.fileTextureSave);
                $.ajax({
                    type: "POST",
                    url: ViewMap.GLOBAL.url + "/v2/api/file/texture/?key=" + ViewMap.CONSTS.key,
                    data: formData2,
                    async: false,
                    contentType: false,
                    processData: false,
                    success: function (data) {
                        if (data.code == "ok" && data.result != null && data.result != null) {
                            EditMode3D.GLOBAL.lstResultfile.image = data.result;
                        } else {
                            swal({
                                title: "Thông báo",
                                text: "Không thể lưu file image",
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
            }
        } else {
            swal({
                title: "Thông báo",
                text: `Vui lòng tải lên mẫu không gian 3D`,
                icon: "warning",
                button: "Đóng"
            });
        }
    },
    getObjectOnThuaDat: function () {
        $.ajax({
            type: "GET",
            url: ViewMap.GLOBAL.url + "/v2/api/object/find",
            data: {
                maXa: ViewMap.GLOBAL.commonData.features[0].properties.MaXa,
                soTo: ViewMap.GLOBAL.commonData.features[0].properties.SoHieuToBanDo,
                soThua: ViewMap.GLOBAL.commonData.features[0].properties.SoThuTuThua,
                key: ViewMap.CONSTS.key
            },
            success: function (data) {
                if (data.code = "ok" && data.result != null && typeof data.result != "undefined") {
                    setTimeout(function () {
                        for (var i = 0; i < data.result.length; i++) {
                            EditMode3D.showObjectOnThuaDat(data.result[i]);
                        }
                    }, 1);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                let messageErorr = AppCommon.getMessageErrorReuqest(jqXHR, errorThrown);
                console.log(messageErorr);
                ViewMap.showLoading(false);
            }
        });
    },
    showObjectOnThuaDat: function (data) {
        let checkBoxWhite = true;
        if (checkBoxWhite) {
            let objectEdit = { id: data.id, name: data.name, tags: data.tags };
            //tạo đối tượng model từ ObjectOption
            let objectModel;
            if (typeof data.model.coordinates !== "undefined" && data.model.coordinates.length > 0) {
                objectModel = new map4d.MapObject({
                    id: data.id,
                    scale: data.scale, // Tỉ lệ vẽ của đối tượng
                    coordinates: data.model.coordinates,
                    bearing: data.bearing, // Góc quay của đối tượng
                    elevation: data.elevation, // Độ cao so với mặt nước biển
                    height: data.model.height,
                });
            } else {
                objectModel = new map4d.MapObject({
                    id: data.id,
                    scale: data.scale, // Tỉ lệ vẽ của đối tượng
                    location: data.location,
                    obj: data.model.objName,
                    texture: data.model.textureName,
                    bearing: data.bearing, // Góc quay của đối tượng
                    elevation: data.elevation, // Độ cao so với mặt nước biển
                    height: data.model.height,
                });
            }
            objectModel.setMap(mapMode3D);
            objectEdit.object = objectModel;
            //EditMode3D.GLOBAL.listEdit.listObject.push(objectModel);
            let polygonOption = map4d.PolygonOptions = {
                paths: [data.polygon], fillOpacity: 0.5
            }
            let polygonEdit = new map4d.Polygon(polygonOption)
            //thêm object vào map
            polygonEdit.setMap(mapMode3D);
            objectEdit.polygon = polygonEdit;
            EditMode3D.GLOBAL.listObjectEdit.push(objectEdit);
            //EditMode3D.GLOBAL.listEdit.listPolygon.push(objectModel);
        }
    },
    checkFormInfor: function () {
        let check = true;
        let txtNameObject = $(EditMode3D.SELECTORS.txtNameObject).val();
        if (!validateText(txtNameObject, "text", 0, 0)) { insertError($(EditMode3D.SELECTORS.txtNameObject), "other"); check = false; }
        return check;
    },
    updateModel3DThuaDat: function (id, tiles, maXa, soTo, soThua, iLatLng) {
        let object = {
            id: id,
            name: $(EditMode3D.SELECTORS.txtNameObject).val(),
            "places": [],
            location: {
                lng: EditMode3D.GLOBAL.objectModel.getLocation().lng,
                lat: EditMode3D.GLOBAL.objectModel.getLocation().lat
            },
            scale: EditMode3D.GLOBAL.objectModel.getScale(),
            bearing: EditMode3D.GLOBAL.objectModel.getBearing(),
            elevation: EditMode3D.GLOBAL.objectModel.getElevation(),
            "heightScale": 0,
            "camera": {
                "zoom": 0,
                "bearing": 0,
                "tilt": 0,
                "target": {
                    "lng": 0,
                    "lat": 0
                }
            },
            "model": EditMode3D.setObjectModel(),
            "types": [],
            "minZoom": 17,
            "maxZoom": 19,
            "addressComponents": EditMode3D.getAddressComponents(EditMode3D.GLOBAL.objectModel.getLocation().lat, EditMode3D.GLOBAL.objectModel.getLocation().lng),
            "startDate": EditMode3D.getDataNowFromat(),
            "endDate": null,
            tiles: tiles,
            "address": null,
            tags: {
                area: Number($(EditMode3D.SELECTORS.txtAreaFloor).val()),
                floor: Number($(EditMode3D.SELECTORS.txtHeightfloor).val())
            },
            maXa: maXa,
            soTo: soTo,
            soThua: soThua,
            polygon: iLatLng,
        };
        EditMode3D.showLoading(true);
        $.ajax({
            type: "POST",
            url: ViewMap.GLOBAL.url + "/v2/api/object/" + id + "?key=" + ViewMap.CONSTS.key,
            data: JSON.stringify(object),
            dataType: 'json',
            async: true,
            contentType: 'application/json-patch+json',
            success: function (data) {
                EditMode3D.showLoading(false);
                if (data.code == "ok") {
                    swal({
                        title: "Thông báo",
                        text: "Cập nhật thông tin không gian 3D thành công!",
                        icon: "success",
                        button: "Đóng",
                    }).then((value) => {
                        $(EditMode3D.SELECTORS.modalMode3D).modal('hide');
                        //map.showMapObject(true);
                        //map.enable3dMode(true);
                    });
                } else {
                    swal({
                        title: "Thông báo",
                        text: "Cập nhật đã bị lỗi hệ thống!",
                        icon: "warning",
                        button: "Đóng",
                    }).then((value) => {
                        $(EditMode3D.SELECTORS.modalMode3D).modal('hide');
                        //map.showMapObject(true);
                        //map.enable3dMode(true);
                    });
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                //let messageErorr = AppCommon.getMessageErrorReuqest(jqXHR, errorThrown);
                console.log(errorThrown);
                EditMode3D.showLoading(false);
                swal({
                    title: "Thông báo",
                    text: "Cập nhật đã bị lỗi hệ thống!",
                    icon: "error",
                    button: "Đóng",
                })
            }
        });
    },
    resetObject3D: function (data) {
        for (var i = 0; i < EditMode3D.GLOBAL.listObjectEdit.length; i++) {
            EditMode3D.GLOBAL.listObjectEdit[i].object.setMap(null);
            EditMode3D.GLOBAL.listObjectEdit[i].polygon.setMap(null);
        }
        EditMode3D.GLOBAL.listObjectEdit = [];
    },
    deleteModel3D: function (idobject) {
        EditMode3D.showLoading(true);
        $.ajax({
            type: "POST",
            url: ViewMap.GLOBAL.url + "/v2/api/object/delete/" + idobject + "?key=" + ViewMap.CONSTS.key,
            //data: JSON.stringify(object),
            dataType: 'json',
            async: true,
            contentType: 'application/json-patch+json',
            success: function (data) {
                EditMode3D.showLoading(false);
                if (data.code == "ok") {
                    swal({
                        title: "Thông báo",
                        text: "Bạn đã xóa thành công!",
                        icon: "success",
                        button: "Đóng",
                    });
                    EditMode3D.resetPolygon();
                } else {
                    swal({
                        title: "Thông báo",
                        text: "Xóa đã lỗi hệ thống!",
                        icon: "warning",
                        button: "Đóng",
                    });
                }
            },
            error: function (errorThrown) {
                //let messageErorr = AppCommon.getMessageErrorReuqest(jqXHR, errorThrown);
                console.log(errorThrown);
                EditMode3D.showLoading(false);
                swal({
                    title: "Thông báo",
                    text: "Không xóa được vì lỗi hệ thống.",
                    icon: "error",
                    button: "Đóng",
                });
            }
        });
    },
    showLoading: function (isCheck) {
        if (isCheck) {
            $(EditMode3D.SELECTORS.loadingModel3D).show();
        }
        else {
            $(EditMode3D.SELECTORS.loadingModel3D).hide();
        }
    },
};
var MapControl = {
    SELECTORS: {
        appendRL: "#map .mf-map4d .mf-ui-bottom-right",
        appendUD: "#map .mf-map4d .mf-ui-bottom-right .horizontal .mf-button",
        btnRight: "#map .mf-right",
        btnLeft: "#map .mf-left",
        btnUp: "#map .mf-up",
        btnDown: "#map .mf-down",

        appendRL3D: "#mapMode3D .mf-map4d .mf-ui-bottom-right",
        appendUD3D: "#mapMode3D .mf-map4d .mf-ui-bottom-right .horizontal .mf-button",
        btnRight3D: "#mapMode3D .mf-right",
        btnLeft3D: "#mapMode3D .mf-left",
        btnUp3D: "#mapMode3D .mf-up",
        btnDown3D: "#mapMode3D .mf-down",
    },
    init: function () {
        $(MapControl.SELECTORS.appendRL).append("<div class='footer-map'><div class='mf-button'><a class='mf-right'></a></div><div class='mf-button'><a class='mf-left'></a></div></div>");
        $(MapControl.SELECTORS.appendUD).before("<div class='mf-button'><a class='mf-up'></a></div><div class='mf-button'><a class='mf-down'></a></div>");
        var camera = null;
        $(MapControl.SELECTORS.btnRight).on("click", function () {
            camera = map.getCamera();
            let r = camera.getBearing() + 10;
            camera.setBearing(r);
            map.setCamera(camera);
        });
        $(MapControl.SELECTORS.btnLeft).on("click", function () {
            camera = map.getCamera();
            let l = camera.getBearing() - 10;
            camera.setBearing(l);
            map.setCamera(camera);
        });
        $(MapControl.SELECTORS.btnUp).on("click", function () {
            camera = map.getCamera();
            let u = camera.getTilt() + 10;
            camera.setTilt(u);
            map.setCamera(camera);
        });
        $(MapControl.SELECTORS.btnDown).on("click", function () {
            camera = map.getCamera();
            let d = camera.getTilt() - 10;
            camera.setTilt(d);
            map.setCamera(camera);
        });
    },
    initMode3D: function () {
        $(MapControl.SELECTORS.appendRL3D).append("<div class='footer-map'><div class='mf-button'><a class='mf-right'></a></div><div class='mf-button'><a class='mf-left'></a></div></div>");
        $(MapControl.SELECTORS.appendUD3D).before("<div class='mf-button'><a class='mf-up'></a></div><div class='mf-button'><a class='mf-down'></a></div>");
        var camera = null;
        $(MapControl.SELECTORS.btnRight3D).on("click", function () {
            camera = mapMode3D.getCamera();
            let r = camera.getBearing() + 10;
            camera.setBearing(r);
            mapMode3D.setCamera(camera);
        });
        $(MapControl.SELECTORS.btnLeft3D).on("click", function () {
            camera = mapMode3D.getCamera();
            let l = camera.getBearing() - 10;
            camera.setBearing(l);
            mapMode3D.setCamera(camera);
        });
        $(MapControl.SELECTORS.btnUp3D).on("click", function () {
            camera = mapMode3D.getCamera();
            let u = camera.getTilt() + 10;
            camera.setTilt(u);
            mapMode3D.setCamera(camera);
        });
        $(MapControl.SELECTORS.btnDown3D).on("click", function () {
            camera = mapMode3D.getCamera();
            let d = camera.getTilt() - 10;
            camera.setTilt(d);
            mapMode3D.setCamera(camera);
        });
    },

};
var TachThua = {
    GLOBAL: {
        ThuaDat: null,
        polygon: null,
        path: null,
        listMarkerDiem: [],
        listDiem: [],
        listKetQuaGhiNhan: [],
        maptachthua: null,
        listPolygonTachThua: null,
        listDrawPolygon: [],
        listInforUpdateTachThua: [],
        codeMaXaThuaDat: "",
        polylineGhiNhan: null,
        listSortKetQuaGhiNhan: [],
        polylineSelectPolygon: null,
    },
    CONSTS: {},
    SELECTORS: {
        checkGiaoHoi: ".giao-hoi",
        modalTachThua: ".modal-tach-thua",
        btnTachThua: ".btn-tach-thua",
        formGiaoHoi: ".form-giao-hoi",
        noteGiaoHoi: ".note-giao-hoi",
        menuCachDuongThang: ".menu-cach-duong-thang",
        menuHoiThuan: ".menu-hoi-thuan",
        menuHoiNghich: ".menu-hoi-nghich",
        menuHoiHuong: ".menu-hoi-huong",
        menuDocTheoCanh: ".menu-doc-theo-canh",
        selectDinhA: "#sel_GHCDTDinhA",
        selectDinhB: "#sel_GHCDTDinhB",
        selectDinhC: "#sel_GHCDTDinhC",
        selectDinhD: "#sel_GHCDTDinhD",
        inputCachAB: "#inp_CachAB",
        inputCachCD: "#inp_CachCD",
        inputCachAC: "#inp_CanhAC",
        inputCachBC: "#inp_CanhBC",
        inputGocCAB: "#inp_GocCAB",
        inputGocCBA: "#inp_GocCBA",
        inputGocAPB: "#inp_GocAPB",
        inputGocAPC: "#inp_GocAPC",
        inputKhoangCach: "#inp_KhoangCach",
        radioGiaoHoiThuan: "input[name='loaiGiaoHoiThuan']",
        radioGiaoHoiThuanCheck: "input[name='loaiGiaoHoiThuan']:checked",
        radioTuDiem: "input[name='rad_tudiem']",
        radioTuDiemCheck: "input[name='rad_tudiem']:checked",
        radioDiem: "input[name='rad_diem']",
        radioDiemCheck: "input[name='rad_diem']:checked",
        titleGiaoHoi: ".title-giao-hoi",
        showHideForm: ".btn-show-hide-point",
        formPointMap: ".footer-map-point",
        viewResultTachThua: ".view-tach-thua",
        clearResultTachThua: ".clear-result",
        saveResultTachThua: ".save-tach-thua",
        clearAllPoint: ".clear-all-point",
        closeInforTachThua: ".header-infor span",
        inforTachThua: ".infor-Tach-Thua",
        btnSaveInforTemp: ".btn-save-infor-temp",
        inputIdInfor: "input[name='id']",
        SoToUpdate: ".infor-Tach-Thua #text-update-soTo",
        SoThuaUpdate: ".infor-Tach-Thua #text-update-soThua",
        SoToUpdateOld: ".infor-Tach-Thua #text-update-soTo-old",
        SoThuaUpdateOld: ".infor-Tach-Thua #text-update-soThua-old",
        DienTichUpdate: ".infor-Tach-Thua #text-update-dienTich",
        DienTichPhapLyUpdate: ".infor-Tach-Thua #text-update-dienTichPhapLy",
        TenChuUpdate: ".infor-Tach-Thua #text-update-chuNha",
        DiaChiUpdate: ".infor-Tach-Thua #text-update-diaChi",
        KHList: '.infor-Tach-Thua #KH-listselectid',
        focusInput: ".infor-Tach-Thua input",
        pointGhiNhan: "#pointGhiNhan",
        pointGhiNhanChild: "#pointGhiNhan tr",
    },
    init: function () {
        maptachthua = null;
        $(TachThua.SELECTORS.btnTachThua).on("click", function () {
            if (maptachthua === null || typeof maptachthua === "undefined" || maptachthua === "") {
                maptachthua = new map4d.Map(document.getElementById("madTachThua"), {
                    zoom: 15,
                    center: { lat: 10.678087311284315, lng: 105.08063708265138 },
                    geolocate: true,
                    minZoom: 3,
                    maxZoom: 22,
                    tilt: 0,
                    controls: true,
                    controlOptions: map4d.ControlOptions.TOP_RIGHT,
                    accessKey: "208e1c99aa440d8bc2847aafa3bc0669",
                });
                TachThua.GLOBAL.maptachthua = maptachthua
                maptachthua.setTileUrl("http://61.28.233.229:8080/all/2d/{z}/{x}/{y}.png");
                maptachthua.setTileUrl("http://61.28.233.229:8080/all/2d/{z}/{x}/{y}.png", true);
                maptachthua.setPlacesEnabled(false);
                maptachthua.setTileFeatureVisible(false, false);
                TachThua.setEvent();
                TachThua.addSelectMucDich();
            }
            TachThua.GLOBAL.codeMaXaThuaDat = ViewMap.GLOBAL.commonData.features[0].properties.MaXa;
            let soto = ViewMap.GLOBAL.commonData.features[0].properties.SoHieuToBanDo;
            let sothua = ViewMap.GLOBAL.commonData.features[0].properties.SoThuTuThua;
            TachThua.showTachThua(TachThua.GLOBAL.codeMaXaThuaDat, soto, sothua);
            setTimeout(function () {
                if (TachThua.GLOBAL.path === null) {
                    let feature = TachThua.GLOBAL.ThuaDat.features[0];
                    TachThua.GLOBAL.path = TachThua.convertCoordinate(feature);
                }
                TachThua.fitBoundsThuaDat(TachThua.GLOBAL.path);
                var camera = maptachthua.getCamera();
                let zoom = camera.getZoom();
                camera.setZoom(zoom - 1);
                maptachthua.setCamera(camera);
                TachThua.setMarkerDiem(TachThua.GLOBAL.ThuaDat);
            }, 1000);
            $(TachThua.SELECTORS.modalTachThua).modal('show');
        });
    },
    setEvent: function () {
        $(TachThua.SELECTORS.pointGhiNhan).sortable({
            stop: function (event, ui) {
                TachThua.sortPointResult();
            }
        });
        $('.menu-tach-thua ul li a').click(function () {
            $('li a').removeClass("active");
            $(this).addClass("active");
        });
        //$(TachThua.SELECTORS.btnTachThua).on("click", function () {
        //    TachThua.GLOBAL.codeMaXaThuaDat = ViewMap.GLOBAL.commonData.features[0].properties.MaXa;
        //    let soto = ViewMap.GLOBAL.commonData.features[0].properties.SoHieuToBanDo;
        //    let sothua = ViewMap.GLOBAL.commonData.features[0].properties.SoThuTuThua;
        //    TachThua.showTachThua(TachThua.GLOBAL.codeMaXaThuaDat, soto, sothua);
        //    setTimeout(function () {
        //        if (TachThua.GLOBAL.path === null) {
        //            let feature = TachThua.GLOBAL.ThuaDat.features[0];
        //            TachThua.GLOBAL.path = TachThua.convertCoordinate(feature);
        //        }
        //        TachThua.fitBoundsThuaDat(TachThua.GLOBAL.path);
        //        var camera = maptachthua.getCamera();
        //        let zoom = camera.getZoom();
        //        camera.setZoom(zoom - 1);
        //        maptachthua.setCamera(camera);
        //        TachThua.setMarkerDiem(TachThua.GLOBAL.ThuaDat);
        //    }, 1000);
        //    $(TachThua.SELECTORS.modalTachThua).modal('show');
        //});
        $(TachThua.SELECTORS.modalTachThua).on('hide.bs.modal', function () {
            TachThua.removeMaker();
            TachThua.removerOptionDiem([1, 2, 3, 4]);
            TachThua.ShowHideAll(false);
            TachThua.removeDrawPolylineDiem();
            TachThua.GLOBAL.listKetQuaGhiNhan = [];
            updateListGhiNhan();
            if (TachThua.GLOBAL.polylineSelectPolygon !== null) {
                TachThua.GLOBAL.polylineSelectPolygon.setMap(null);
                TachThua.GLOBAL.polylineSelectPolygon = null;
            }
        });
        $(TachThua.SELECTORS.modalTachThua).on('show.bs.modal', function () {
            setTimeout(function () {
                $(TachThua.SELECTORS.menuCachDuongThang).trigger("click");
            }, 1000);
        });
        $(TachThua.SELECTORS.menuCachDuongThang).on("click", function () {
            TachThua.showHtmlGiaoHoi(1);
            TachThua.setEventChangeAllDiem(1);
        });
        $(TachThua.SELECTORS.menuHoiThuan).on("click", function () {
            TachThua.showHtmlGiaoHoi(2);
            $(TachThua.SELECTORS.radioGiaoHoiThuan).change(function () {
                let check = $(TachThua.SELECTORS.radioGiaoHoiThuanCheck).val();
                if (check === "angle") {
                    $(TachThua.SELECTORS.inputGocCAB).removeAttr("disabled");
                    $(TachThua.SELECTORS.inputGocCBA).removeAttr("disabled");
                    $(TachThua.SELECTORS.inputCachAC).attr("disabled", "");
                    $(TachThua.SELECTORS.inputCachBC).attr("disabled", "");
                }
                if (check === "edge") {
                    $(TachThua.SELECTORS.inputGocCAB).attr("disabled", "");
                    $(TachThua.SELECTORS.inputGocCBA).attr("disabled", "");
                    $(TachThua.SELECTORS.inputCachAC).removeAttr("disabled");
                    $(TachThua.SELECTORS.inputCachBC).removeAttr("disabled");
                }
            });
            TachThua.setEventChangeAllDiem(2);
        });
        $(TachThua.SELECTORS.menuHoiNghich).on("click", function () {
            TachThua.showHtmlGiaoHoi(3);
            TachThua.setEventChangeAllDiem(3);
        });
        $(TachThua.SELECTORS.menuHoiHuong).on("click", function () {
            TachThua.showHtmlGiaoHoi(4);
            TachThua.setEventChangeAllDiem(4);
        });
        $(TachThua.SELECTORS.menuDocTheoCanh).on("click", function () {
            TachThua.showHtmlGiaoHoi(5);
            TachThua.setEventChangeAllDiem(5);
        });
        $(TachThua.SELECTORS.showHideForm).on("click", function () {
            let hide = $(TachThua.SELECTORS.formPointMap).hasClass("footerHide");
            if (hide) {
                $(TachThua.SELECTORS.formPointMap).removeClass("footerHide");
                $(TachThua.SELECTORS.formPointMap).addClass("footerShow");
                $(this).find("i").removeClass("fa-chevron-up");
                $(this).find("i").addClass("fa-chevron-down");
            } else {
                $(TachThua.SELECTORS.formPointMap).addClass("footerHide");
                $(TachThua.SELECTORS.formPointMap).removeClass("footerShow");
                $(this).find("i").removeClass("fa-chevron-down");
                $(this).find("i").addClass("fa-chevron-up");
            }

        });
        $(TachThua.SELECTORS.viewResultTachThua).on("click", function () {
            TachThua.sortPointResult();
            if (TachThua.GLOBAL.listKetQuaGhiNhan.length > 1) {
                var listp = [];
                for (var i = 0; i < TachThua.GLOBAL.listKetQuaGhiNhan.length; i++) {
                    let objVN2000 = TachThua.GLOBAL.listKetQuaGhiNhan[i].diem2000;
                    let xy = {
                        x: objVN2000[1],
                        y: objVN2000[0]
                    };
                    listp.push(xy);
                }
                //var listp = [{ "x": 1181000.3288308799, "y": 537085.5774804119 }, { "x": 1181035.395258569, "y": 537067.3979677357 }]
                TachThua.GLOBAL.listPolygonTachThua = TachThua.getPolygonsTachThua(listp);
                if (TachThua.GLOBAL.listPolygonTachThua.length > 0) {
                    TachThua.drawPolygonTachThua(TachThua.GLOBAL.listPolygonTachThua);
                    TachThua.ShowHideAll(true);
                    TachThua.removeDrawPolylineDiem();
                } else {
                    swal({
                        title: "Thông báo",
                        text: "Điểm không hợp lệ để tách thửa!",
                        icon: "warning",
                        buttons: "Đóng",
                        dangerMode: true,
                    })
                }
            } else {
                swal({
                    title: "Thông báo",
                    text: "Số điểm quá ít để tách thửa!",
                    icon: "warning",
                    buttons: "Đóng",
                    dangerMode: true,
                })
            }
        });
        $(TachThua.SELECTORS.clearResultTachThua).on("click", function () {
            TachThua.ShowHideAll(false);
            TachThua.drawPolylineDiem(TachThua.GLOBAL.listSortKetQuaGhiNhan);
        });
        $(TachThua.SELECTORS.closeInforTachThua).on("click", function () {
            TachThua.showInforUpdateTachThua(false);
        });
        $(TachThua.SELECTORS.btnSaveInforTemp).on("click", function () {
            if (TachThua.checkFormInfor()) {
                let id = $(TachThua.SELECTORS.inputIdInfor).val();
                let maxa = TachThua.GLOBAL.ThuaDat.features[0].properties.MaXa;
                let soto = Number($(TachThua.SELECTORS.SoToUpdate).val());
                let sothua = Number($(TachThua.SELECTORS.SoThuaUpdate).val());
                let check = TachThua.checkSoThuaSoTo(soto, sothua, maxa);
                if (check) {
                    TachThua.setInforUpdateTachThua(id, maxa);
                } else {
                    insertError($(TachThua.SELECTORS.TenChuUpdate), "other");
                }
            }
        });
        $(TachThua.SELECTORS.focusInput).on("click", function () {
            $(this).parent().removeClass("has-error");
        });
        $(TachThua.SELECTORS.SoThuaUpdate).on("focusout", function () {
            let soto = Number($(TachThua.SELECTORS.SoToUpdate).val());
            let sothua = Number($(this).val());
            let maxa = TachThua.GLOBAL.ThuaDat.features[0].properties.MaXa;
            let check = TachThua.checkSoThuaSoTo(soto, sothua, maxa);
            if (!check) {
                $(TachThua.SELECTORS.SoThuaUpdate).parent().addClass("has-error");
            }
        });
        $(TachThua.SELECTORS.saveResultTachThua).on("click", function () {
            if (TachThua.GLOBAL.listPolygonTachThua !== null && TachThua.GLOBAL.listInforUpdateTachThua.length === TachThua.GLOBAL.listPolygonTachThua.length && TachThua.GLOBAL.listInforUpdateTachThua.length > 0) {
                let fromFeatures = TachThua.GLOBAL.ThuaDat.features[0].properties.info === "vn2000" ? TachThua.GLOBAL.ThuaDat.features[0] : TachThua.GLOBAL.ThuaDat.features[1];
                let ThuaDatFrom = {
                    id: fromFeatures.properties.Id,
                    objectId: fromFeatures.properties.ObjectId,
                    uuid: fromFeatures.properties.UUID,
                    thoiDiemBatDau: fromFeatures.properties.ThoiDiemBatDau,
                    thoiDiemKetThuc: fromFeatures.properties.ThoiDiemKetThuc,
                    maXa: fromFeatures.properties.MaXa,
                    maDoiTuong: fromFeatures.properties.MaDoiTuong,
                    soHieuToBanDo: fromFeatures.properties.SoHieuToBanDo,
                    soThuTuThua: fromFeatures.properties.SoThuTuThua,
                    soHieuToBanDoCu: fromFeatures.properties.SoHieuToBanDoCu,
                    soThuTuThuaCu: fromFeatures.properties.SoThuTuThuaCu,
                    dienTich: fromFeatures.properties.DienTich,
                    dienTichPhapLy: fromFeatures.properties.DienTichPhapLy,
                    kyHieuMucDichSuDung: fromFeatures.properties.KyHieuMucDichSuDung,
                    kyHieuDoiTuong: null,
                    tenChu: fromFeatures.properties.TenChu,
                    diaChi: fromFeatures.properties.DiaChi,
                    daCapGCN: 0,
                    tenChu2: fromFeatures.properties.TenChu2,
                    namSinhC1: fromFeatures.properties.NamSinhC1,
                    soHieuGCN: fromFeatures.properties.SoHieuGCN,
                    soVaoSo: fromFeatures.properties.SoVaoSo,
                    ngayVaoSo: fromFeatures.properties.NgayVaoSo,
                    soBienNhan: fromFeatures.properties.SoBienNhan,
                    nguoiNhanHS: fromFeatures.properties.NguoiNhanHS,
                    coQuanThuLy: fromFeatures.properties.CoQuanThuLy,
                    loaiHS: fromFeatures.properties.LoaiHS,
                    maLienKet: fromFeatures.properties.MaLienKet,
                    shapeSTArea: fromFeatures.properties.ShapeSTArea,
                    shapeSTLength: fromFeatures.properties.ShapeSTLength,
                    shapeLength: fromFeatures.properties.ShapeLength,
                    shapeArea: fromFeatures.properties.ShapeArea,
                    geometry: fromFeatures.geometry,
                    tags: {}
                };
                for (var i = 0; i < TachThua.GLOBAL.listInforUpdateTachThua.length; i++) {
                    TachThua.GLOBAL.listInforUpdateTachThua[i].id = TachThua.createGuid();
                }
                let inforUpdate = {
                    from: ThuaDatFrom,
                    to: TachThua.GLOBAL.listInforUpdateTachThua
                };
                swal({
                    title: "Thông báo",
                    text: "Bạn có chắc chắn lưu thông tin và thửa đất đã tách thửa!",
                    icon: "warning",
                    buttons: [
                        'Hủy',
                        'Lưu lại'
                    ],
                    dangerMode: true,
                }).then((willDelete) => {
                    if (willDelete) {
                        //console.log("tach thưa:", JSON.stringify(inforUpdate));
                        TachThua.saveInforTachThua(inforUpdate);
                    }
                });
            } else {
                swal({
                    title: "Thông báo",
                    text: "Chưa cập nhật thông tin đất!",
                    icon: "warning",
                    button: "Đóng",
                }).then((value) => {
                });
            }
        });
        $(TachThua.SELECTORS.clearAllPoint).on("click", function () {
            TachThua.removeDrawPolylineDiem();
            TachThua.ShowHideAll(false);
            TachThua.GLOBAL.listKetQuaGhiNhan = [];
            updateListGhiNhan();
        });
        maptachthua.addListener("click", (args) => {
            let id = args.polygon.id;
            $(TachThua.SELECTORS.inputIdInfor).val(id);
            TachThua.addRemoveInforTachThua(id);
            TachThua.showInforUpdateTachThua(true);
            $(TachThua.SELECTORS.formPointMap).addClass("footerHide");
            $(TachThua.SELECTORS.formPointMap).removeClass("footerShow");
            $(this).find("i").removeClass("fa-chevron-down");
            $(this).find("i").addClass("fa-chevron-up");
            TachThua.drawingPolyline(args.polygon.getPaths()[0]);
        }, { polygon: true });
    },
    showTachThua: function (code, soto, sothua) {
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
            async: false,
            success: function (data) {
                if (data.result !== null && typeof data.result !== "undefined") {
                    console.log("lodat-select:", JSON.stringify(data.result));
                    if (data.result.features.length > 0) {
                        let dataRe = data.result;
                        TachThua.removerPointDuplicate(dataRe);
                        TachThua.GLOBAL.ThuaDat = dataRe;
                        let path = TachThua.drawPolygon(TachThua.GLOBAL.ThuaDat);
                    } else {
                        bootbox.alert("Phường/Xã này chưa có dữ liệu");
                    }
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
    drawPolygon: function (data) {
        let feature = data.features[0];
        let paths = TachThua.convertCoordinate(data.features[0]);
        if (TachThua.GLOBAL.polygon !== null) {
            TachThua.GLOBAL.polygon.setMap(null);
        }
        TachThua.GLOBAL.polygon = new map4d.Polygon({
            paths: paths,
            fillColor: "#0000ff",
            fillOpacity: 0,
            strokeColor: "#ea5252",
            strokeOpacity: 1.0,
            strokeWidth: 1,
            userInteractionEnabled: false,
        });
        TachThua.GLOBAL.polygon.setMap(maptachthua);
        TachThua.GLOBAL.path = paths;
        //TachThua.fitBoundsThuaDat(paths);
        //return paths;
        //maptachthua.fitBounds(paths[0]);
        //var camera = maptachthua.getCamera();
        //let zoom = camera.getZoom();
        //camera.setZoom(zoom - 1);
        //maptachthua.setCamera(camera);
    },
    convertCoordinate: function (data) {
        let res = [];
        if (data.geometry.type.toLocaleLowerCase() === "polygon") {
            //let lenght = data.geometry.coordinates.length;
            return data.geometry.coordinates;
        }
        if (data.geometry.type.toLocaleLowerCase() === "multipolygon") {
            let lenght = data.geometry.coordinates[0].length;
            for (var i = 0; i < lenght; i++) {
                let datatemp = data.geometry.coordinates[0][i];
                res.push(datatemp);
            }
            return res;
        }

    },
    fitBoundsThuaDat: function (data) {
        let latLngBounds = new map4d.LatLngBounds();
        let paddingOptions = {
            top: 10,
            bottom: 50,
            left: 50,
            right: 50
        };

        for (var i = 0; i < data[0].length; i++) {
            latLngBounds.extend(data[0][i]);
        }
        maptachthua.fitBounds(latLngBounds);
    },
    showHtmlGiaoHoi: function (giaohoi) {
        let html = "";
        let note = "";
        $(TachThua.SELECTORS.formGiaoHoi).children().remove();
        $(TachThua.SELECTORS.noteGiaoHoi).children().remove();
        switch (giaohoi) {
            case 1:
                // giao hoi cách đường thẳng
                html = `<div class="col-xs-12 col-sm-10">
                            <input type="text" class="giao-hoi" value="giaohoicachduongthang" style="display:none" />
                            <div class="form-group row">
                                <div class="col-xs-12 col-sm-6">
                                    <label for="sel_GHDoc1" class="col-sm-4 control-label no-padding-right">Đỉnh A</label>
                                    <select class="col-sm-8" id="sel_GHCDTDinhA"></select>
                                </div>
                                <div class="col-xs-12 col-sm-6">
                                    <label for="sel_GHDoc2" class="col-sm-4 control-label no-padding-right">Đỉnh B</label>
                                    <select class="col-sm-8" id="sel_GHCDTDinhB"></select>
                                </div>
                            </div>
                            <div class="form-group row">
                                <div class="col-xs-12 col-sm-6">
                                    <label for="sel_GHDoc1" class="col-sm-4 control-label no-padding-right">Đỉnh C</label>
                                    <select class="col-sm-8" id="sel_GHCDTDinhC"></select>
                                </div>
                                <div class="col-xs-12 col-sm-6">
                                    <label for="sel_GHDoc2" class="col-sm-4 control-label no-padding-right">Đỉnh D</label>
                                    <select class="col-sm-8" id="sel_GHCDTDinhD"></select>
                                </div>
                            </div>
                            <div class="form-group row">
                                <div class="col-xs-12 col-sm-6">
                                    <label for="form-field-9" class="col-sm-4 control-label no-padding-right">Cách AB</label>
                                    <input type="text" class="col-sm-8 input-mask-distance" placeholder="Khoảng cách (m)" id="inp_CachAB">
                                </div>
                                <div class="col-xs-12 col-sm-6">
                                    <label for="form-field-9" class="col-sm-4 control-label no-padding-right">Cách CD</label>
                                    <input type="text" class="col-sm-8 input-mask-distance" placeholder="Khoảng cách (m)" id="inp_CachCD">
                                </div>
                            </div></div>
                            <div class="col-xs-12 col-sm-2">
                                <div class="chon-diem">
                                </div>
                            </div>`;
                note = `<img class="media-object" alt="100%x200" src="/images/GiaoHoi/ghcachduongthang.png" data-holder-rendered="true" style="width: 100%; display: block;">
                        <div class="caption">
                            <p>Lấy ra điểm cách đường AB, CD lần lượt các khoảng là d1 và d2. Kết quả sẽ thu được là 4 điểm 1,2,3,4.</p>
                        </div>`;
                $(TachThua.SELECTORS.formGiaoHoi).append(html);
                $(TachThua.SELECTORS.noteGiaoHoi).append(note);
                $(TachThua.SELECTORS.inputCachAB).inputmask('9{1,5}.9{1,5}');
                $(TachThua.SELECTORS.inputCachCD).inputmask('9{1,5}.9{1,5}');
                $(TachThua.SELECTORS.titleGiaoHoi).text("Giao hội cách đường thẳng")
                break;
            case 2:
                // giao hội thuận
                html = `<div class="col-xs-12 col-sm-8"><div class="form-group row">
                            <input type="text" class="giao-hoi" value="giaohoithuan" style="display:none" />
                            <div class="col-xs-12 col-sm-6">
                                <label for="sel_GHDoc1" class="col-sm-4 control-label no-padding-right">Đỉnh A</label>
                                <select class="col-sm-8" id="sel_GHCDTDinhA"></select>
                            </div>
                            <div class="col-xs-12 col-sm-6">
                                <label for="sel_GHDoc2" class="col-sm-4 control-label no-padding-right">Đỉnh B</label>
                                <select class="col-sm-8" id="sel_GHCDTDinhB"></select>
                            </div>
                        </div>
                        <div class="form-group row">
                            <div class="col-xs-12 col-sm-6">
                                <label for="form-field-9" class="col-sm-4 control-label no-padding-right">Cạnh A-C</label>
                                <input type="text" class="col-sm-8 input-mask-distance" placeholder="Độ dài cạnh (m)" id="inp_CanhAC">
                            </div>

                            <div class="col-xs-12 col-sm-6">
                                <label for="form-field-9" class="col-sm-4 control-label no-padding-right">Cạnh B-C</label>
                                <input type="text" class="col-sm-8 input-mask-distance" placeholder="Độ dài cạnh (m)" id="inp_CanhBC">
                            </div>
                        </div>
                        <div class="form-group row">
                            <div class="col-xs-12 col-sm-6">
                                <label for="form-field-select-1" class="col-sm-4 control-label no-padding-right">Góc CAB</label>
                                <input class="col-sm-8 input-mask-angle" type="text" id="inp_GocCAB" disabled="">
                            </div>
                            <div class="col-xs-12 col-sm-6">
                                <label for="form-field-select-1" class="col-sm-4 control-label no-padding-right">Góc CBA</label>
                                <input class="col-sm-8 input-mask-angle" type="text" id="inp_GocCBA" disabled="">
                            </div>
                        </div></div>
                        <div class="col-xs-12 col-sm-2">
                            <div class="phuong-thuc-giao-hoi-thuan">
                                <label class="control-label bolder blue">Giao hội theo</label>

                                <div class="radio">
                                    <label>
                                        <input name="loaiGiaoHoiThuan" type="radio" class="ace" value="edge" checked>
                                        <span class="lbl"> Cạnh</span>
                                    </label>
                                </div>

                                <div class="radio">
                                    <label>
                                        <input name="loaiGiaoHoiThuan" type="radio" class="ace" value="angle">
                                        <span class="lbl"> Góc</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="col-xs-12 col-sm-2">
                            <div class="chon-diem">
                            </div>
                        </div>`;
                note = `<img class="media-object"  alt="100%x200" src="/images/GiaoHoi/ghthuan.png" data-holder-rendered="true" style="width: 75%; display: block;">
                            <div class="caption">
                                <p>Từ hai đỉnh đã biết tọa độ cộng thêm hai số đo khác của tam giác giao hội, ta có thể tính được tọa độ điểm giao hội. Bài toán giao hội thuận luôn thu được hai kết quả: đỉnh C ở bên trái hay C' ở bên phải so với hướng cạnh gốc AB.</p>
                            </div>`;

                $(TachThua.SELECTORS.formGiaoHoi).append(html);
                $(TachThua.SELECTORS.noteGiaoHoi).append(note);
                $(TachThua.SELECTORS.inputCachAC).inputmask('9{1,5}.9{1,5}');
                $(TachThua.SELECTORS.inputCachBC).inputmask('9{1,5}.9{1,5}');
                $(TachThua.SELECTORS.inputGocCAB).inputmask('9{1,3}º9{1,2}\'9{1,2}.9{1,2}"');
                $(TachThua.SELECTORS.inputGocCBA).inputmask('9{1,3}º9{1,2}\'9{1,2}.9{1,2}"');
                $(TachThua.SELECTORS.titleGiaoHoi).text("Giao hội thuận")
                break;
            case 3:
                // giao hội nghịch
                html = `<div class="col-xs-12 col-sm-10"><div class="form-group row">
                            <input type="text" class="giao-hoi" value="giaohoinghich" style="display:none" />
                            <div class="col-xs-12 col-sm-6">
                                <label for="sel_GHDoc1" class="col-sm-4 control-label no-padding-right">Đỉnh A</label>
                                <select class="col-sm-8" id="sel_GHCDTDinhA"></select>
                            </div>
                            <div class="col-xs-12 col-sm-6">
                                <label for="sel_GHDoc2" class="col-sm-4 control-label no-padding-right">Đỉnh B</label>
                                <select class="col-sm-8" id="sel_GHCDTDinhB"></select>
                            </div>
                        </div>
                        <div class="form-group row">
                            <div class="col-xs-12 col-sm-6">
                                <label for="sel_GHDoc1" class="col-sm-4 control-label no-padding-right">Đỉnh C</label>
                                <select class="col-sm-8" id="sel_GHCDTDinhC"></select>
                            </div>
                        </div>
                        <div class="form-group row">
                            <div class="col-xs-12 col-sm-6">
                                <label for="form-field-select-1" class="col-sm-4 control-label no-padding-right">Góc APB</label>
                                <input class="col-sm-8 input-mask-angle" type="text" id="inp_GocAPB">
                            </div>
                            <div class="col-xs-12 col-sm-6">
                                <label for="form-field-select-1" class="col-sm-4 control-label no-padding-right">Góc APC</label>
                                <input class="col-sm-8 input-mask-angle" type="text" id="inp_GocAPC">
                            </div>
                        </div></div>
                        <div class="col-xs-12 col-sm-2">
                            <div class="chon-diem">
                            </div>
                        </div>`;
                note = `<img class="media-object"  alt="100%x200" src="/images/GiaoHoi/GiaoHoiNghich_3DiemGoc.png" data-holder-rendered="true" style="width: 60%; display: block;">
                                <div class="caption">
                                    <p>Từ ba đỉnh đã biết tọa độ cộng thêm hai số đo góc từ điểm giao hội P ngắm về ABC, ta xác định được tọa độ điểm giao hội P. Góc giao hội sử dụng để tính toán là các góc ngược chiều kim đồng hồ.</p>
                                </div>`

                $(TachThua.SELECTORS.formGiaoHoi).append(html);
                $(TachThua.SELECTORS.noteGiaoHoi).append(note);
                $(TachThua.SELECTORS.inputGocAPB).inputmask('9{1,3}º9{1,2}\'9{1,2}.9{1,2}"');
                $(TachThua.SELECTORS.inputGocAPC).inputmask('9{1,3}º9{1,2}\'9{1,2}.9{1,2}"');
                $(TachThua.SELECTORS.titleGiaoHoi).text("Giao hội nghịch")
                break;
            case 4:
                // giao hội hướng
                html = `<div class="col-xs-12 col-sm-10">
                            <input type="text" class="giao-hoi" value="giaohoihuong" style="display:none" />
                            <div class="form-group row">
                                <div class="col-xs-12 col-sm-6">
                                    <label for="sel_GHDoc1" class="col-sm-4 control-label no-padding-right">Đỉnh A</label>
                                    <select class="col-sm-8" id="sel_GHCDTDinhA"></select>
                                </div>
                                <div class="col-xs-12 col-sm-6">
                                    <label for="sel_GHDoc2" class="col-sm-4 control-label no-padding-right">Đỉnh B</label>
                                    <select class="col-sm-8" id="sel_GHCDTDinhB"></select>
                                </div>
                            </div>
                            <div class="form-group row">
                                <div class="col-xs-12 col-sm-6">
                                    <label for="sel_GHDoc1" class="col-sm-4 control-label no-padding-right">Đỉnh C</label>
                                    <select class="col-sm-8" id="sel_GHCDTDinhC"></select>
                                </div>
                                <div class="col-xs-12 col-sm-6">
                                    <label for="sel_GHDoc2" class="col-sm-4 control-label no-padding-right">Đỉnh D</label>
                                    <select class="col-sm-8" id="sel_GHCDTDinhD"></select>
                                </div>
                            </div></div>`;
                note = `<img class="media-object" alt="100%x200" src="/images/GiaoHoi/ghhuong.png" data-holder-rendered="true" style="width: 100%; display: block;">
                            <div class="caption">
                                <p>Điểm kết quả là giao điểm của hai đường thẳng AB và CD.</p>
                            </div>`;

                $(TachThua.SELECTORS.formGiaoHoi).append(html);
                $(TachThua.SELECTORS.noteGiaoHoi).append(note);
                $(TachThua.SELECTORS.titleGiaoHoi).text("Giao hội hướng")
                break;
            default:
                // giao hội dọc
                html = `<div class="col-xs-12 col-sm-10">
                            <input type="text" class="giao-hoi" value="giaohoidoctheocanh" style="display:none" />
                            <div class="form-group row">
                                <div class="col-xs-12 col-sm-6">
                                    <label for="sel_GHDoc1" class="col-sm-4 control-label no-padding-right">Đỉnh A</label>
                                    <select class="col-sm-8" id="sel_GHCDTDinhA"></select>
                                </div>
                                <div class="col-xs-12 col-sm-6">
                                    <label for="sel_GHDoc2" class="col-sm-4 control-label no-padding-right">Đỉnh B</label>
                                    <select class="col-sm-8" id="sel_GHCDTDinhB"></select>
                                </div>
                            </div>
                            <div class="form-group row">
                                <div class="col-xs-12 col-sm-6">
                                    <label for="form-field-9" class="col-sm-4 control-label no-padding-right">Khoảng cách</label>
                                    <input type="text" class="col-sm-8 input-mask-distance" placeholder="Khoảng cách (m)" id="inp_KhoangCach">
                                </div>
                            </div>
                            <div class="form-group row">
                                <div class="col-xs-12 col-sm-2">
                                    <div class="control-group">
                                        <div class="radio">
                                            <label>
                                                <input name="rad_tudiem" type="radio" class="ace" value="A" checked>
                                                <span class="lbl"> Từ điểm A</span>
                                            </label>
                                        </div>

                                        <div class="radio">
                                            <label>
                                                <input name="rad_tudiem" type="radio" class="ace" value="B">
                                                <span class="lbl"> Từ điểm B</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div></div>`;
                note = `<img class="media-object" alt="100%x200" src="/images/GiaoHoi/ghdoctheocanh.png" data-holder-rendered="true" style="width: 75%; display: block;">
                            <div class="caption">
                                <p>Lấy một điểm C trên đường thẳng AB cách đỉnh A hoặc đỉnh B một khoảng d.</p>
                            </div>`;
                $(TachThua.SELECTORS.formGiaoHoi).append(html);
                $(TachThua.SELECTORS.noteGiaoHoi).append(note);
                $(TachThua.SELECTORS.inputKhoangCach).inputmask('9{1,5}.9{1,5}');
                $(TachThua.SELECTORS.titleGiaoHoi).text("Giao hội dọc theo cạnh");
        }
    },
    setMarkerDiem: function (data) {
        TachThua.GLOBAL.listDiem = [];
        let check = data.features[0].geometry.type;
        let point84 = (data.features[0].properties.info == "wgs84") ? data.features[0].geometry.coordinates[0] : data.features[1].geometry.coordinates[0];
        let point2000 = (data.features[1].properties.info == "vn2000") ? data.features[1].geometry.coordinates[0] : data.features[0].geometry.coordinates[0];
        if (check.toLowerCase() === "multipolygon") {
            for (var i = 0; i < point84.length; i++) {
                for (var j = 0; j < point84[i].length - 1; j++) {
                    let lat = point84[i][j][1];
                    let lng = point84[i][j][0];
                    let markerPoint = new map4d.Marker({
                        position: { lat: lat, lng: lng },
                        icon: new map4d.Icon(10, 10, "/images/iconPoint.png"),
                        anchor: [0.5, 0.5],
                        //title: name
                    });
                    //thêm marker vào map
                    markerPoint.setMap(maptachthua);
                    let countPoint = (i + j + 1).toString();
                    let markerTitelPoint = new map4d.Marker({
                        position: { lat: lat, lng: lng },
                        anchor: [0.5, 1],
                        visible: true,
                        label: new map4d.MarkerLabel({ text: countPoint, color: "ff0000", fontSize: 13 }),
                        icon: new map4d.Icon(32, 32, "")
                    });
                    //thêm marker vào map
                    markerTitelPoint.setMap(maptachthua);
                    let marker = {
                        markerPoint: markerPoint,
                        markerTitelPoint: markerTitelPoint
                    };
                    TachThua.GLOBAL.listMarkerDiem.push(marker);
                    //add diem
                    let xVN2000 = point2000[i][j][1];
                    let yVN2000 = point2000[i][j][0];
                    let diem = {
                        id: Number(countPoint),
                        name: "Điểm " + countPoint,
                        xy: {
                            x: xVN2000,
                            y: yVN2000
                        },
                        latlng: {
                            lat: lat,
                            lng: lng
                        }
                    }
                    TachThua.GLOBAL.listDiem.push(diem);
                }
            }
        }
        if (check.toLowerCase() === "polygon") {
            for (var j = 0; j < point84.length - 1; j++) {
                let lat = point84[j][1];
                let lng = point84[j][0];
                let markerPoint = new map4d.Marker({
                    position: { lat: lat, lng: lng },
                    icon: new map4d.Icon(10, 10, "/images/iconPoint.png"),
                    anchor: [0.5, 0.5],
                    //title: name
                });
                //thêm marker vào map
                markerPoint.setMap(maptachthua);
                let countPoint = (j + 1).toString();
                let markerTitelPoint = new map4d.Marker({
                    position: { lat: lat, lng: lng },
                    anchor: [0.5, 1],
                    visible: true,
                    label: new map4d.MarkerLabel({ text: countPoint, color: "ff0000", fontSize: 13 }),
                    icon: new map4d.Icon(32, 32, "")
                });
                //thêm marker vào map
                markerTitelPoint.setMap(maptachthua);
                let marker = {
                    markerPoint: markerPoint,
                    markerTitelPoint: markerTitelPoint
                };
                TachThua.GLOBAL.listMarkerDiem.push(marker);
                //add diem
                let xVN2000 = point2000[j][1];
                let yVN2000 = point2000[j][0];
                let diem = {
                    id: Number(countPoint),
                    name: "Điểm " + countPoint,
                    xy: {
                        x: xVN2000,
                        y: yVN2000
                    },
                    latlng: {
                        lat: lat,
                        lng: lng
                    }
                }
                TachThua.GLOBAL.listDiem.push(diem);
            }
        }
    },
    removeMaker: function () {
        $.each(TachThua.GLOBAL.listMarkerDiem, function (i, obj) {
            obj.markerPoint.setMap(null);
            obj.markerTitelPoint.setMap(null);
        });
        TachThua.GLOBAL.listMarkerDiem = [];
    },
    setEventChangeAllDiem: function (check) {
        let listSelectPoint = [];
        let html = TachThua.getHtmlSelectDiem(listSelectPoint, true);
        $(TachThua.SELECTORS.selectDinhA).append(html);
        $(TachThua.SELECTORS.selectDinhA).change(function () {
            listSelectPoint = [];
            listSelectPoint.push(Number($(this).val()));
            if (check == 1 || check == 2 || check == 5) {
                let pointselect = Number($(this).val()) - 1;
                let listDiem = TachThua.GLOBAL.listDiem;
                let pointStart = pointselect == 0 ? listDiem[listDiem.length - 1].id : listDiem[pointselect - 1].id;
                let pointEnd = pointselect == (listDiem.length - 1) ? listDiem[0].id : listDiem[pointselect + 1].id;
                let listDinhB = [pointStart, pointEnd];
                TachThua.removerOptionDiem([2, 3, 4])
                html = TachThua.getHtmlSelectDiem(listDinhB, false);
                $(TachThua.SELECTORS.selectDinhB).append(html);
            } else {
                TachThua.removerOptionDiem([2, 3, 4])
                html = TachThua.getHtmlSelectDiem(listSelectPoint, true);
                $(TachThua.SELECTORS.selectDinhB).append(html);
            }
        });
        if (check == 1 || check == 3 || check == 4) {
            $(TachThua.SELECTORS.selectDinhB).change(function () {
                TachThua.removerOptionDiem([3, 4])
                listSelectPoint.push(Number($(this).val()));
                html = TachThua.getHtmlSelectDiem(listSelectPoint, true);
                $(TachThua.SELECTORS.selectDinhC).append(html);
            });
        }
        if (check == 1 || check == 4) {
            $(TachThua.SELECTORS.selectDinhC).change(function () {
                if (check == 1) {
                    let pointselect = Number($(this).val()) - 1;
                    let listDiem = TachThua.GLOBAL.listDiem;
                    let pointStart = pointselect == 0 ? listDiem[listDiem.length - 1].id : listDiem[pointselect - 1].id;
                    let pointEnd = pointselect == (listDiem.length - 1) ? listDiem[0].id : listDiem[pointselect + 1].id;
                    let listDinhD = [];
                    if (listSelectPoint.includes(pointStart) == false) listDinhD.push(pointStart);
                    if (listSelectPoint.includes(pointEnd) == false) listDinhD.push(pointEnd);
                    TachThua.removerOptionDiem([4])
                    html = TachThua.getHtmlSelectDiem(listDinhD, false);
                    $(TachThua.SELECTORS.selectDinhD).append(html);
                } else {
                    TachThua.removerOptionDiem([4])
                    listSelectPoint.push(Number($(this).val()));
                    html = TachThua.getHtmlSelectDiem(listSelectPoint, true);
                    $(TachThua.SELECTORS.selectDinhD).append(html);
                }

            });
        }
    },
    getHtmlSelectDiem: function (listPointSelected, check) {
        let str = '<option selected>- Chọn điểm -</option>';
        if (TachThua.GLOBAL.listDiem != null && TachThua.GLOBAL.listDiem.length > 0) {
            let list = TachThua.GLOBAL.listDiem;

            for (var i = 0; i < list.length; i++) {
                if (check) {
                    if (listPointSelected.includes(list[i].id) == false) {
                        str += '<option value="' + list[i].id + '">' + list[i].name + '</option>';
                    }
                } else {
                    if (listPointSelected.includes(list[i].id) == true) {
                        str += '<option value="' + list[i].id + '">' + list[i].name + '</option>';
                    }
                }
            }
            //} else {
            //    for (var i = 0; i < listPointSelected.length; i++) {
            //        let obj = list[];
            //        str += '<option value="' + obj.id + '">' + obj.name + '</option>';
            //    }
            //}

        }
        return str;
    },
    removerOptionDiem: function (check) {
        if (check.includes(1)) $(TachThua.SELECTORS.selectDinhA).children().remove();
        let select = $(TachThua.SELECTORS.selectDinhB);
        if (check.includes(2) && select.length > 0) {
            $(TachThua.SELECTORS.selectDinhB).children().remove();
        }
        select = $(TachThua.SELECTORS.selectDinhC);
        if (check.includes(3) && select.length > 0) {
            $(TachThua.SELECTORS.selectDinhC).children().remove();
        }
        select = $(TachThua.SELECTORS.selectDinhD);
        if (check.includes(4) && select.length > 0) {
            $(TachThua.SELECTORS.selectDinhD).children().remove();
        }
    },
    checkPointOnLine: function (A, B, C) {
        let CAx = Math.round(A.x * 10000) / 10000;
        let CAy = Math.round(A.y * 10000) / 10000;
        let CBx = Math.round(B.x * 10000) / 10000;
        let CBy = Math.round(B.y * 10000) / 10000;
        let CCx = Math.round(C.x * 10000) / 10000;
        let CCy = Math.round(C.y * 10000) / 10000;
        if ((CAx === CCx && CAy === CCy) || (CBx === CCx && CBy === CCy)) {
            if ((CAx === CCx && CAy === CCy)) {
                return true;
            }
            if ((CBx === CCx && CBy === CCy)) {
                return false;
            }
        } else {
            let AB = (B.y - A.y) / (B.x - A.x);
            let AC = (B.y - C.y) / (B.x - C.x);
            AB = Math.round(AB * 10000) / 10000;
            AC = Math.round(AC * 10000) / 10000;
            if ((A.x > B.x && A.x > C.x && C.x > B.x) || (B.x > A.x && B.x > C.x && C.x > A.x)) {
                if ((A.y > B.y && A.y > C.y && C.y > B.y) || (B.y > A.y && B.y > C.y && C.y > A.y)) {
                    if (AB === AC) {
                        return true;
                    }
                }
            }
        }
        return false;
    },
    orderClockWise: function (listPoints) {
        var listTemp = listPoints.slice(0);
        var mX = 0;
        var mY = 0;
        $.each(listTemp, function (i, obj) {
            mX = mX + obj.x;
            mY = mY + obj.y;
        });
        mX = mX / listTemp.length;
        mY = mY / listTemp.length;
        listTemp.sort(function (a, b) {
            let at1 = (Math.atan2(a.y - mY, a.x - mX));
            let at2 = (Math.atan2(b.y - mY, b.x - mX));
            return at1 - at2;
        });
        var listPointOrder = [];
        for (var i = 0; i < listTemp.length; i++) {
            if (i === listTemp.length - 1) {
                listPointOrder.push(listTemp[i]);
            } else
                if (listTemp[i].x !== listTemp[i + 1].x && listTemp[i].y !== listTemp[i + 1].y) {
                    listPointOrder.push(listTemp[i]);
                }
        }
        return listPointOrder;
    },
    orderClockWiseWGS84: function (listPoints) {
        var listTemp = listPoints.slice(0);
        var mX = 0;
        var mY = 0;
        $.each(listTemp, function (i, obj) {
            mX = mX + obj[0];//obj.lng;
            mY = mY + obj[1];//obj.lat;
        });
        mX = mX / listTemp.length;
        mY = mY / listTemp.length;
        listTemp.sort(function (a, b) {
            let at1 = (Math.atan2(a[1] - mY, a[0] - mX));//(Math.atan2(a.lat - mY, a.lng - mX));
            let at2 = (Math.atan2(b[1] - mY, b[0] - mX));//(Math.atan2(b.lat - mY, b.lng - mX));
            return at1 - at2;
        });
        return listTemp;
    },
    checkListPointWithPolygon: function (listPoint, listDiem) {
        if (listPoint.length > 1) {
            var Polygon1 = [];
            var Polygon2 = [];
            var pointStart, pointEnd;
            let a, b, c;
            let diem1 = false, diem2 = false;
            for (var i = 0; i < listDiem.length; i++) {
                //polygon1
                if ((!diem1 && !diem2) || (diem1 && diem2)) {
                    Polygon1.push(listDiem[i]);
                }
                //polygon 2
                if (diem1 && !diem2) {
                    Polygon2.push(listDiem[i]);
                }
                for (var j = 0; j < listPoint.length; j++) {
                    a = listDiem[i].xy;
                    if (i === listDiem.length - 1) {
                        b = listDiem[0].xy;
                    } else {
                        b = listDiem[i + 1].xy;
                    }
                    c = listPoint[j];
                    if (TachThua.checkPointOnLine(a, b, c)) {
                        if (!diem2 && diem1) diem2 = true;
                        if (!diem1) diem1 = true;
                        break;
                    }
                }
            }
            if ((diem1 && diem2)) {
                //console.log(listpolygon1);
                //console.log(listpolygon2);
                var listpolygon1 = [];
                for (var i = 0; i < Polygon1.length; i++) {
                    listpolygon1.push(Polygon1[i].xy);
                }
                var listpolygon2 = [];
                for (var i = 0; i < Polygon2.length; i++) {
                    listpolygon2.push(Polygon2[i].xy);
                }
                if (TachThua.GLOBAL.listSortKetQuaGhiNhan.length > 0) {
                    if (TachThua.GLOBAL.listSortKetQuaGhiNhan.length <= 2) {
                        $.each(TachThua.GLOBAL.listSortKetQuaGhiNhan, function (i, obj) {
                            listpolygon1.push(listPoint[obj]);
                            listpolygon2.push(listPoint[obj]);
                        });
                    } else if (TachThua.GLOBAL.listSortKetQuaGhiNhan.length > 2) {
                        let countStart = TachThua.GLOBAL.listSortKetQuaGhiNhan[0];
                        let countEnd = TachThua.GLOBAL.listSortKetQuaGhiNhan[TachThua.GLOBAL.listSortKetQuaGhiNhan.length - 1];
                        pointStart = listPoint[countStart];
                        pointEnd = listPoint[countEnd];
                        listpolygon1.push(pointStart);
                        listpolygon1.push(pointEnd);
                        listpolygon2.push(pointStart);
                        listpolygon2.push(pointEnd);
                    }
                } else {
                    if (listPoint.length <= 2) {
                        for (var i = 0; i < listPoint.length; i++) {
                            listpolygon1.push(listPoint[i]);
                            listpolygon2.push(listPoint[i]);
                        }
                    } else if (listPoint.length >= 2) {
                        let countStart = listPoint[0];
                        let countEnd = listPoint[listPoint.length - 1];
                        pointStart = listPoint[countStart];
                        pointEnd = listPoint[countEnd];
                        listpolygon1.push(pointStart);
                        listpolygon1.push(pointEnd);
                        listpolygon2.push(pointStart);
                        listpolygon2.push(pointEnd);
                    }
                }

                var listPolygons = [];
                //listPolygons.push(TachThua.orderClockWise(listpolygon1));
                //listPolygons.push(TachThua.orderClockWise(listpolygon2));
                listPolygons.push(TachThua.clockWiseNew(listpolygon1));
                listPolygons.push(TachThua.clockWiseNew(listpolygon2));
                //let a = TachThua.clockWiseNew(listpolygon1);
                if (listPoint.length > 2) {
                    for (var z = 0; z < listPolygons.length; z++) {
                        let listpolygonConvert = listPolygons[z];
                        for (var i = 0; i < listpolygonConvert.length; i++) {
                            let count = i;
                            if (listpolygonConvert[i].x === pointStart.x && listpolygonConvert[i].y === pointStart.y) {
                                //TH 1 liên kề đầu cuối
                                if (listpolygonConvert[i + 1].x === pointEnd.x && listpolygonConvert[i + 1].y === pointEnd.y) {
                                    for (var j = 1; j < TachThua.GLOBAL.listSortKetQuaGhiNhan.length - 1; j++) {
                                        count = count + 1;
                                        listpolygonConvert.splice(count, 0, listPoint[TachThua.GLOBAL.listSortKetQuaGhiNhan[j]]);
                                    }
                                    break;
                                }
                                //TH 2 2điểm ở đầu và cuối
                                else if (listpolygonConvert[listpolygonConvert.length - 1].x === pointEnd.x && listpolygonConvert[listpolygonConvert.length - 1].y === pointEnd.y) {
                                    count = listpolygonConvert.length - 1;
                                    for (var j = TachThua.GLOBAL.listSortKetQuaGhiNhan.length - 2; j > 0; j--) {
                                        count = count + 1;
                                        listpolygonConvert.splice(count, 0, listPoint[TachThua.GLOBAL.listSortKetQuaGhiNhan[j]]);
                                    }
                                    break;
                                }
                            }
                            if (listpolygonConvert[i].x === pointEnd.x && listpolygonConvert[i].y === pointEnd.y) {
                                //TH 3 2điểm liền kề cuối  -> đầu
                                if (listpolygonConvert[i + 1].x === pointStart.x && listpolygonConvert[i + 1].y === pointStart.y) {
                                    for (var j = TachThua.GLOBAL.listSortKetQuaGhiNhan.length - 2; j > 0; j--) {
                                        count = count + 1;
                                        listpolygonConvert.splice(count, 0, listPoint[TachThua.GLOBAL.listSortKetQuaGhiNhan[j]]);
                                    }
                                    break;
                                } else // TH 4 2điểm ở cuối và đầu
                                    if (listpolygonConvert[listpolygonConvert.length - 1].x === pointStart.x && listpolygonConvert[listpolygonConvert.length - 1].y === pointStart.y) {
                                        count = listpolygonConvert.length - 1;
                                        for (var j = 1; j < TachThua.GLOBAL.listSortKetQuaGhiNhan.length - 1; j++) {
                                            count = count + 1;
                                            listpolygonConvert.splice(count, 0, listPoint[TachThua.GLOBAL.listSortKetQuaGhiNhan[j]]);
                                        }
                                        break;
                                    }
                            }
                        }
                    }
                }
                return listPolygons;
            }
            else
                if (TachThua.GLOBAL.listSortKetQuaGhiNhan.length > 3 && !diem2) {

                    var listpolygon1 = [];
                    //listpolygon1 = listDiem;
                    for (var i = 0; i < listDiem.length; i++) {
                        listpolygon1.push(listDiem[i].xy);
                    }
                    var listpolygon2 = [];
                    //for (var i = 0; i < Polygon2.length; i++) {
                    //    listpolygon2.push(Polygon2[i].xy);
                    //}
                    if (TachThua.GLOBAL.listSortKetQuaGhiNhan.length > 0) {
                        if (TachThua.GLOBAL.listSortKetQuaGhiNhan.length <= 2) {
                            $.each(TachThua.GLOBAL.listSortKetQuaGhiNhan, function (i, obj) {
                                listpolygon1.push(listPoint[obj]);
                                listpolygon2.push(listPoint[obj]);
                            });
                        } else if (TachThua.GLOBAL.listSortKetQuaGhiNhan.length > 2) {
                            let countStart = TachThua.GLOBAL.listSortKetQuaGhiNhan[0];
                            let countEnd = TachThua.GLOBAL.listSortKetQuaGhiNhan[TachThua.GLOBAL.listSortKetQuaGhiNhan.length - 1];
                            pointStart = listPoint[countStart];
                            pointEnd = listPoint[countEnd];
                            listpolygon1.push(pointStart);
                            listpolygon1.push(pointEnd);
                            listpolygon2.push(pointStart);
                            listpolygon2.push(pointEnd);
                        }
                    } else {
                        if (listPoint.length <= 2) {
                            for (var i = 0; i < listPoint.length; i++) {
                                listpolygon1.push(listPoint[i]);
                                listpolygon2.push(listPoint[i]);
                            }
                        } else if (listPoint.length >= 2) {
                            let countStart = listPoint[0];
                            let countEnd = listPoint[listPoint.length - 1];
                            pointStart = listPoint[countStart];
                            pointEnd = listPoint[countEnd];
                            listpolygon1.push(pointStart);
                            listpolygon1.push(pointEnd);
                            listpolygon2.push(pointStart);
                            listpolygon2.push(pointEnd);
                        }
                    }

                    var listPolygons1 = [];
                    //listPolygons.push(TachThua.orderClockWise(listpolygon1));
                    //listPolygons.push(TachThua.orderClockWise(listpolygon2));
                    listPolygons1.push(TachThua.clockWiseNew(listpolygon1));
                    listPolygons1.push(TachThua.clockWiseNew(listpolygon2));
                    if (listPoint.length > 2) {
                        for (var z = 0; z < listPolygons1.length; z++) {
                            let listpolygonConvert = listPolygons1[z];
                            for (var i = 0; i < listpolygonConvert.length; i++) {
                                let count = i;
                                if (listpolygonConvert[i].x === pointStart.x && listpolygonConvert[i].y === pointStart.y) {
                                    //TH 1 liên kề đầu cuối
                                    if (listpolygonConvert[i + 1].x === pointEnd.x && listpolygonConvert[i + 1].y === pointEnd.y) {
                                        for (var j = 1; j < TachThua.GLOBAL.listSortKetQuaGhiNhan.length - 1; j++) {
                                            count = count + 1;
                                            listpolygonConvert.splice(count, 0, listPoint[TachThua.GLOBAL.listSortKetQuaGhiNhan[j]]);
                                        }
                                        break;
                                    }
                                    //TH 2 2điểm ở đầu và cuối
                                    else if (listpolygonConvert[listpolygonConvert.length - 1].x === pointEnd.x && listpolygonConvert[listpolygonConvert.length - 1].y === pointEnd.y) {
                                        count = listpolygonConvert.length - 1;
                                        for (var j = TachThua.GLOBAL.listSortKetQuaGhiNhan.length - 2; j > 0; j--) {
                                            count = count + 1;
                                            listpolygonConvert.splice(count, 0, listPoint[TachThua.GLOBAL.listSortKetQuaGhiNhan[j]]);
                                        }
                                        break;
                                    }
                                }
                                if (listpolygonConvert[i].x === pointEnd.x && listpolygonConvert[i].y === pointEnd.y) {
                                    //TH 3 2điểm liền kề cuối  -> đầu
                                    if (listpolygonConvert[i + 1].x === pointStart.x && listpolygonConvert[i + 1].y === pointStart.y) {
                                        for (var j = TachThua.GLOBAL.listSortKetQuaGhiNhan.length - 2; j > 0; j--) {
                                            count = count + 1;
                                            listpolygonConvert.splice(count, 0, listPoint[TachThua.GLOBAL.listSortKetQuaGhiNhan[j]]);
                                        }
                                        break;
                                    } else // TH 4 2điểm ở cuối và đầu
                                        if (listpolygonConvert[listpolygonConvert.length - 1].x === pointStart.x && listpolygonConvert[listpolygonConvert.length - 1].y === pointStart.y) {
                                            count = listpolygonConvert.length - 1;
                                            for (var j = 1; j < TachThua.GLOBAL.listSortKetQuaGhiNhan.length - 1; j++) {
                                                count = count + 1;
                                                listpolygonConvert.splice(count, 0, listPoint[TachThua.GLOBAL.listSortKetQuaGhiNhan[j]]);
                                            }
                                            break;
                                        }
                                }
                            }
                        }
                    }
                    return listPolygons1;
                }
            return [];
        }
    },
    convertDataVN2000toWGS84: function (object) {
        let data = {
            code: TachThua.GLOBAL.codeMaXaThuaDat,
            geometry: {
                type: "Polygon",
                coordinates: []
            }
        };
        data.geometry.coordinates.push(object);
        var result;
        $.ajax({
            type: "POST",
            url: ViewMap.GLOBAL.url + "/v2/api/land/vn2000-wgs84?key=" + ViewMap.CONSTS.key,
            data: JSON.stringify(data),
            dataType: 'json',
            contentType: 'application/json-patch+json',
            async: false,
            success: function (data) {
                result = data.result;
            },
            error: function (jqXHR, textStatus, errorThrown) {
                let messageErorr = AppCommon.getMessageErrorReuqest(jqXHR, errorThrown);
                console.log(messageErorr);
                ViewMap.showLoading(false);
            }
        });
        return result;
    },
    getPolygonsTachThua: function (listpoint) {
        var list = TachThua.checkListPointWithPolygon(listpoint, TachThua.GLOBAL.listDiem);
        var listWGS84 = [];
        $.each(list, function (i, obj) {
            let polygon = [];
            for (var i = 0; i < obj.length; i++) {
                let point = [];
                point.push(obj[i].y);
                point.push(obj[i].x);
                polygon.push(point);
            }
            let polygonconvert = TachThua.convertDataVN2000toWGS84(polygon);
            listWGS84.push(polygonconvert);
        });
        return listWGS84;
    },
    ShowHideAll: function (check) {
        if (check) {
            TachThua.GLOBAL.polygon.setMap(null);
            $.each(TachThua.GLOBAL.listMarkerDiem, function (i, obj) {
                obj.markerPoint.setMap(null);
                obj.markerTitelPoint.setMap(null);
            });
        }
        else {
            TachThua.GLOBAL.polygon.setMap(maptachthua);
            $.each(TachThua.GLOBAL.listMarkerDiem, function (i, obj) {
                obj.markerPoint.setMap(maptachthua);
                obj.markerTitelPoint.setMap(maptachthua);
            });
            $.each(TachThua.GLOBAL.listDrawPolygon, function (i, obj) {
                obj.setMap(null);
            });
            TachThua.GLOBAL.listDrawPolygon = [];
            TachThua.GLOBAL.listInforUpdateTachThua = [];
            if (TachThua.GLOBAL.polylineSelectPolygon !== null) {
                TachThua.GLOBAL.polylineSelectPolygon.setMap(null);
                TachThua.GLOBAL.polylineSelectPolygon = null;
            }
        }
    },
    drawPolygonTachThua: function (list) {
        for (var i = 0; i < list.length; i++) {
            let feature = list[i].features;
            for (var j = 0; j < feature.length; j++) {
                if (feature[j].properties.info === "wgs84") {
                    let paths = feature[j].geometry.coordinates;
                    paths[0].push(paths[0][0]);
                    if (TachThua.GLOBAL.polygon !== null) {
                        TachThua.GLOBAL.polygon.setMap(null);
                    }
                    let polygon = new map4d.Polygon({
                        paths: paths,
                        fillColor: "#d8eefb",
                        fillOpacity: 0.5,
                        strokeColor: "#ea5252",
                        strokeOpacity: 1.0,
                        strokeWidth: 1,
                    });
                    TachThua.GLOBAL.listDrawPolygon.push(polygon);
                    polygon.setMap(maptachthua);
                    feature[j].properties.id = polygon.id;
                }
                if (feature[j].properties.info === "vn2000") {
                    let paths = feature[j].geometry.coordinates;
                    paths[0].push(paths[0][0]);
                }
            }
        }
    },
    showInforUpdateTachThua: function (check) {
        if (check) {
            $(TachThua.SELECTORS.inforTachThua).removeClass("headerHide");
            $(TachThua.SELECTORS.inforTachThua).addClass("headerShow");
        } else {
            $(TachThua.SELECTORS.inforTachThua).addClass("headerHide");
            $(TachThua.SELECTORS.inforTachThua).removeClass("headerShow");
        }
    },
    addRemoveInforTachThua: function (id) {
        let check = TachThua.GLOBAL.listInforUpdateTachThua.find(x => x.id.toString() === id.toString());
        let area = TachThua.getAreaPolygonTachThua(id);
        if (typeof check !== "undefined" && check !== null && check.soThuTuThua > 0) {
            $(TachThua.SELECTORS.SoToUpdate).val(check.soHieuToBanDo);
            $(TachThua.SELECTORS.SoThuaUpdate).val(check.soThuTuThua);
            $(TachThua.SELECTORS.SoToUpdateOld).val(check.soHieuToBanDoCu);
            $(TachThua.SELECTORS.SoThuaUpdateOld).val(check.soThuTuThuaCu);
            $(TachThua.SELECTORS.DienTichUpdate).val(area);
            $(TachThua.SELECTORS.DienTichPhapLyUpdate).val(check.dienTichPhapLy);
            $(TachThua.SELECTORS.TenChuUpdate).val(check.tenChu);
            $(TachThua.SELECTORS.DiaChiUpdate).val(check.diaChi);
            $(TachThua.SELECTORS.KHList).val(check.kyHieuMucDichSuDung);
        } else {
            let propertie = TachThua.GLOBAL.ThuaDat.features[0].properties;
            $(TachThua.SELECTORS.SoToUpdate).val(propertie.SoHieuToBanDo);
            $(TachThua.SELECTORS.SoThuaUpdate).val(0);
            $(TachThua.SELECTORS.SoToUpdateOld).val(propertie.SoHieuToBanDo);
            $(TachThua.SELECTORS.SoThuaUpdateOld).val(propertie.SoThuTuThua);
            $(TachThua.SELECTORS.DienTichUpdate).val(area);
            $(TachThua.SELECTORS.DienTichPhapLyUpdate).val(0);
            $(TachThua.SELECTORS.TenChuUpdate).val(propertie.TenChu);
            $(TachThua.SELECTORS.DiaChiUpdate).val(propertie.DiaChi);
            $(TachThua.SELECTORS.KHList).val(propertie.KyHieuMucDichSuDung);
        }
    },
    setInforUpdateTachThua: function (id, maxa) {
        let check;
        check = TachThua.GLOBAL.listInforUpdateTachThua.find(x => x.id.toString() === id.toString());
        if (TachThua.GLOBAL.listInforUpdateTachThua.length > 0 && typeof check !== "undefined" && check !== null) {
            check.soHieuToBanDo = Number($(TachThua.SELECTORS.SoToUpdate).val());
            check.soThuTuThua = Number($(TachThua.SELECTORS.SoThuaUpdate).val());
            check.soHieuToBanDoCu = Number($(TachThua.SELECTORS.SoToUpdateOld).val());
            check.soThuTuThuaCu = Number($(TachThua.SELECTORS.SoThuaUpdateOld).val());
            check.dienTich = Number($(TachThua.SELECTORS.DienTichUpdate).val());
            check.dienTichPhapLy = Number($(TachThua.SELECTORS.DienTichPhapLyUpdate).val());
            check.kyHieuMucDichSuDung = $(TachThua.SELECTORS.KHList).val();
            check.tenChu = $(TachThua.SELECTORS.TenChuUpdate).val();
            check.diaChi = $(TachThua.SELECTORS.DiaChiUpdate).val();
            check.geometry = TachThua.getGeometryById(id);
            swal({
                title: "Thông báo",
                text: "Cập nhật thông tin thành công!",
                icon: "success",
                button: "Đóng",
            });
        } else {
            check = {
                id: id,
                objectId: 0,
                uuid: id,
                thoiDiemBatDau: null,
                thoiDiemKetThuc: null,
                maXa: maxa,
                maDoiTuong: "",
                soHieuToBanDo: Number($(TachThua.SELECTORS.SoToUpdate).val()),
                soThuTuThua: Number($(TachThua.SELECTORS.SoThuaUpdate).val()),
                soHieuToBanDoCu: Number($(TachThua.SELECTORS.SoToUpdateOld).val()),
                soThuTuThuaCu: Number($(TachThua.SELECTORS.SoThuaUpdateOld).val()),
                dienTich: Number($(TachThua.SELECTORS.DienTichUpdate).val()),
                dienTichPhapLy: Number($(TachThua.SELECTORS.DienTichPhapLyUpdate).val()),
                kyHieuMucDichSuDung: $(TachThua.SELECTORS.KHList).val(),
                kyHieuDoiTuong: "",
                tenChu: $(TachThua.SELECTORS.TenChuUpdate).val(),
                diaChi: $(TachThua.SELECTORS.DiaChiUpdate).val(),
                daCapGCN: 0,
                tenChu2: "",
                namSinhC1: "",
                soHieuGCN: "",
                soVaoSo: "",
                ngayVaoSo: "",
                soBienNhan: 0,
                nguoiNhanHS: "",
                coQuanThuLy: "",
                loaiHS: "",
                maLienKet: "",
                shapeSTArea: 0,
                shapeSTLength: 0,
                shapeLength: 0,
                shapeArea: 0,
                geometry: TachThua.getGeometryById(id),
                tags: {}
            };
            TachThua.GLOBAL.listInforUpdateTachThua.push(check);
            swal({
                title: "Thông báo",
                text: "Cập nhật thông tin thành công!",
                icon: "success",
                button: "Đóng",
            });
        }
    },
    getGeometryById: function (id) {
        let list = TachThua.GLOBAL.listPolygonTachThua;
        let geometry;
        for (var i = 0; i < list.length; i++) {
            let listfeature = list[i].features;
            if ((typeof listfeature[0].properties.id !== "undefined" && listfeature[0].properties.id.toString() === id) ||
                (typeof listfeature[1].properties.id !== "undefined" && listfeature[1].properties.id.toString() === id)) {
                geometry = listfeature[0].properties.info === "vn2000" ? listfeature[0].geometry : listfeature[1].geometry;
                break;
            }
        }
        return geometry;
    },
    checkFormInfor: function () {
        let check = true;
        let SoThua = $(TachThua.SELECTORS.SoThuaUpdate).val();
        if (!validateText(SoThua, "number", 0, 0) || SoThua === "0") { insertError($(TachThua.SELECTORS.SoThuaUpdate), "other"); check = false; }
        let SoTo = $(TachThua.SELECTORS.SoToUpdate).val();
        if (!validateText(SoTo, "number", 0, 0) || SoTo === "0") { insertError($(TachThua.SELECTORS.SoToUpdate), "other"); check = false; }
        let DienTichUpdate = $(TachThua.SELECTORS.DienTichUpdate).val();
        if (!validateText(DienTichUpdate, "float", 0, 0) || DienTichUpdate === "0") { insertError($(TachThua.SELECTORS.DienTichUpdate), "other"); check = false; }
        let DienTichPhapLyUpdate = $(TachThua.SELECTORS.DienTichPhapLyUpdate).val();
        if (!validateText(DienTichPhapLyUpdate, "float", 0, 0) || DienTichPhapLyUpdate === "0") { insertError($(TachThua.SELECTORS.DienTichPhapLyUpdate), "other"); check = false; }
        let TenChuUpdate = $(TachThua.SELECTORS.TenChuUpdate).val();
        if (!validateText(TenChuUpdate, "text", 0, 0)) { insertError($(TachThua.SELECTORS.TenChuUpdate), "other"); check = false; }
        return check;
    },
    saveInforTachThua: function (data) {
        console.log(data);
        $.ajax({
            type: "POST",
            url: ViewMap.GLOBAL.url + "/v2/api/land/tach-thua?key=" + ViewMap.CONSTS.key,
            data: JSON.stringify(data),
            dataType: 'json',
            async: false,
            contentType: 'application/json-patch+json',
            success: function (data) {
                if (data.code === "ok") {
                    swal({
                        title: "Thông báo",
                        text: "Cập nhật thông tin thửa đất thành công!",
                        icon: "success",
                        button: "Đóng",
                    }).then((value) => {
                        $(TachThua.SELECTORS.modalTachThua).modal('hide');
                        RemoveUrlToThua();
                        setTimeout(function () {
                            location.reload();
                        }, 500);
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
    getAreaPolygonTachThua: function (id) {
        let list = TachThua.GLOBAL.listPolygonTachThua;
        let obj;
        for (var i = 0; i < list.length; i++) {
            obj = (typeof list[i].features[0].properties.id !== "undefined" && list[i].features[0].properties.id == id) ? list[i] : ((typeof list[i].features[1].properties.id !== "undefined" && list[i].features[1].properties.id == id) ? list[i] : null);
            if (typeof obj !== "undefined" && obj !== null) {
                obj = (obj.features[0].properties.info === "vn2000") ? obj.features[0] : obj.features[1];
                break;
            }
        }
        if (typeof obj !== "undefined" && obj !== null) {
            if (obj.geometry.type.toLowerCase() === "polygon") {
                let point = {
                    points: obj.geometry.coordinates[0]
                }
                return Math.abs(TachThua.calculateAreaPolygonVN2000(point));
            }
            if (obj.geometry.type.toLowerCase() === "MultiPolygon") {
                let point = {
                    points: obj.geometry.coordinates[0][0]
                }
                return Math.abs(TachThua.calculateAreaPolygonVN2000(point));
            }
        }
    },
    calculateAreaPolygonVN2000: function (data) {
        let res = 0;
        $.ajax({
            type: "POST",
            url: ViewMap.GLOBAL.url + "/v2/api/land/calculate?key=" + ViewMap.CONSTS.key,
            data: JSON.stringify(data),
            dataType: 'json',
            async: false,
            contentType: 'application/json-patch+json',
            success: function (data) {
                if (data.code === "ok") {
                    res = Math.round(data.result.area.value * 100) / 100;
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                let messageErorr = AppCommon.getMessageErrorReuqest(jqXHR, errorThrown);
                console.log(messageErorr);
                ViewMap.showLoading(false);
            }
        });
        return res;
    },
    sortPointResult: function () {
        TachThua.GLOBAL.listSortKetQuaGhiNhan = [];
        $(TachThua.SELECTORS.pointGhiNhanChild).each(function () {
            let id = $(this).find("th").attr("data-id");
            if (typeof id !== "undefined" && id !== null) {
                TachThua.GLOBAL.listSortKetQuaGhiNhan.push(Number(id));
            }
        })
        if (TachThua.GLOBAL.listSortKetQuaGhiNhan.length > 1) {
            TachThua.drawPolylineDiem(TachThua.GLOBAL.listSortKetQuaGhiNhan);
        }
    },
    drawPolylineDiem: function (listSort) {
        if (TachThua.GLOBAL.polylineGhiNhan !== null) {
            TachThua.GLOBAL.polylineGhiNhan.setMap(null);
            TachThua.GLOBAL.polylineGhiNhan = null;
        }
        let path = [];
        $.each(listSort, function (i, obj) {
            let point = TachThua.GLOBAL.listKetQuaGhiNhan[obj].diem84;
            path.push(point)
        });
        TachThua.GLOBAL.polylineGhiNhan = new map4d.Polyline({
            path: path,
            visible: true,
            strokeColor: "#3dab21",
            strokeWidth: 2,
            strokeOpacity: 1,
            closed: false
        });
        TachThua.GLOBAL.polylineGhiNhan.setMap(maptachthua);
    },
    removeDrawPolylineDiem: function () {
        if (TachThua.GLOBAL.polylineGhiNhan !== null) {
            TachThua.GLOBAL.polylineGhiNhan.setMap(null);
            TachThua.GLOBAL.polylineGhiNhan = null;
        }
    },
    createGuid: function () {
        return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },
    drawingPolyline: function (paths) {
        if (TachThua.GLOBAL.polylineSelectPolygon !== null) {
            TachThua.GLOBAL.polylineSelectPolygon.setMap(null);
            TachThua.GLOBAL.polylineSelectPolygon = null;
        }
        let polyline = new map4d.Polyline({
            path: paths,
            strokeColor: "#00ffff",
            strokeOpacity: 1.0,
            strokeWidth: 2,
        });
        polyline.setMap(maptachthua);
        TachThua.GLOBAL.polylineSelectPolygon = polyline;
    },
    checkSoThuaSoTo: function (soTo, soThua, maXa) {
        let check = false;
        $.ajax({
            type: "GET",
            url: ViewMap.GLOBAL.url + "/v2/api/land/find-info",
            data: {
                code: maXa,
                soTo: soTo,
                soThua: soThua,
                key: ViewMap.CONSTS.key
            },
            async: false,
            success: function (data) {
                if (data.result !== null && typeof data.result !== "undefined") {
                    //console.log("lodat-select:", JSON.stringify(data.result));
                    if (data.result.features.length > 0) {
                        check = false;
                        swal({
                            title: "Thông báo",
                            text: "Số Thửa này đã có trong phường/xã!",
                            icon: "warning",
                            buttons: "Đóng",
                            dangerMode: true,
                        })
                    } else {
                        check = true;
                    }
                } else {
                    swal({
                        title: "Thông báo",
                        text: "Lỗi hệ thống!",
                        icon: "error",
                        buttons: "Đóng",
                        dangerMode: true,
                    });
                    check = false;
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                let messageErorr = AppCommon.getMessageErrorReuqest(jqXHR, errorThrown);
                console.log(messageErorr);
                ViewMap.showLoading(false);
            }
        });
        if (soThua <= 0) {
            return false;
        }
        return check;
    },
    removerPointDuplicate: function (dataParam) {
        let data = dataParam;
        let check = data.features[0].geometry.type;
        let dataVN2000 = (data.features[0].properties.info == "vn2000") ? data.features[0] : data.features[1];
        let dataWGS84 = (data.features[0].properties.info == "wgs84") ? data.features[0] : data.features[1];
        let point84 = (data.features[0].properties.info == "wgs84") ? data.features[0].geometry.coordinates[0] : data.features[1].geometry.coordinates[0];
        let point2000 = (data.features[1].properties.info == "vn2000") ? data.features[1].geometry.coordinates[0] : data.features[0].geometry.coordinates[0];
        if (check.toLowerCase() === "multipolygon") {
            for (var i = 0; i < point2000.length; i++) {
                let temp2000 = [];
                let temp84 = [];
                for (var j = 0; j < point2000[i].length; j++) {
                    if (j === point2000[i].length - 1) {
                        temp2000.push(point2000[i][j]);
                        temp84.push(point84[i][j]);
                    } else
                        if (point2000[i][j][1] !== point2000[i][j + 1][1] && point2000[i][j][0] !== point2000[i][j + 1][0]) {
                            temp2000.push(point2000[i][j]);
                            temp84.push(point84[i][j]);
                        }
                }
                dataVN2000.geometry.coordinates[0][i] = temp2000;
                dataWGS84.geometry.coordinates[0][i] = temp84;
            }
        }
        if (check.toLowerCase() === "polygon") {
            let temp2000 = [];
            let temp84 = [];
            for (var i = 0; i < point2000.length; i++) {
                let x = point2000[i][1];
                let y = point2000[i][0];

                if (i === point2000.length - 1) {
                    temp2000.push(point2000[i]);
                    temp84.push(point84[i]);
                } else
                    if (point2000[i][1] !== point2000[i + 1][1] && point2000[i][0] !== point2000[i + 1][0]) {
                        temp2000.push(point2000[i]);
                        temp84.push(point84[i]);
                    }
            }
            dataVN2000.geometry.coordinates[0] = temp2000;
            dataWGS84.geometry.coordinates[0] = temp84;
        }
        return data;
    },
    clockWiseNew: function (data) {
        var points = data.slice(0);
        // Find min max to get center
        // Sort from top to bottom
        points.sort((a, b) => a.y - b.y);

        // Get center y
        const cy = (points[0].y + points[points.length - 1].y) / 2;

        // Sort from right to left
        points.sort((a, b) => b.x - a.x);

        // Get center x
        const cx = (points[0].x + points[points.length - 1].x) / 2;

        // Center point
        var center = {
            x: cx,
            y: cy
        };
        // Pre calculate the angles as it will be slow in the sort
        // As the points are sorted from right to left the first point
        // is the rightmost

        // Starting angle used to reference other angles
        var startAng;
        points.forEach(point => {
            var ang = Math.atan2(point.y - center.y, point.x - center.x);
            if (!startAng) {
                startAng = ang
            } else {
                if (ang < startAng) { // ensure that all points are clockwise of the start point
                    ang += Math.PI * 2;
                }
            }
            point.angle = ang; // add the angle to the point
        });

        // first sort clockwise
        points.sort((a, b) => a.angle - b.angle);
        var listPointOrder = [];
        for (var i = 0; i < points.length; i++) {
            if (i === points.length - 1) {
                listPointOrder.push(points[i]);
            } else
                if (points[i].x !== points[i + 1].x && points[i].y !== points[i + 1].y) {
                    listPointOrder.push(points[i]);
                }
        }
        return listPointOrder;
        //return points;
    },
    addSelectMucDich: function () {
        $.ajax({
            type: "GET",
            url: ViewMap.GLOBAL.url + "/v2/api/land/all-muc-dich-su-dung",
            data: {
                key: ViewMap.CONSTS.key
            },
            success: function (data) {
                if (data.code == "ok" && data.result != null && data.result.length > 0) {
                    let selecthtml = '';
                    for (var i = 0; i < data.result.length; i++) {
                        selecthtml += `<option value="${data.result[i].mucDichSuDung}">
                                        ${data.result[i].name}
                                    </option>`;
                    }
                    $(TachThua.SELECTORS.KHList).append(selecthtml);
                } else {
                    swal({
                        title: "Thông báo",
                        text: "Không tìm thấy thành phố địa chính",
                        icon: "warning",
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
    },
};
var HopThua = {
    GLOBAL: {
        checkHopThua: false,
        listHopThua: [],
        listPolylineHopThua: [],
    },
    CONSTS: {},
    SELECTORS: {
        btnHopThua: ".btn-hop-thua",
        btnSaveHopThua: ".btn-save-hop-thua",
        btnHuyHopThua: ".btn-huy-hop-thua",
        formInforHopThua: ".form-infor-hop-thua",
        KHList: '.form-infor-hop-thua #KH-listselectid',
        SoToUpdate: ".form-infor-hop-thua #text-update-soTo",
        SoThuaUpdate: ".form-infor-hop-thua #text-update-soThua",
        SoToUpdateOld: ".form-infor-hop-thua #text-update-soTo-old",
        SoThuaUpdateOld: ".form-infor-hop-thua #text-update-soThua-old",
        DienTichUpdate: ".form-infor-hop-thua #text-update-dienTich",
        DienTichPhapLyUpdate: ".form-infor-hop-thua #text-update-dienTichPhapLy",
        TenChuUpdate: ".form-infor-hop-thua #text-update-chuNha",
        DiaChiUpdate: ".form-infor-hop-thua #text-update-diaChi",
        btnUpdateThuaDat: ".form-infor-hop-thua .btn-infor-hop-thua",
    },
    init: function () {
        HopThua.setEvent();
        HopThua.addSelectMucDich();
    },
    setEvent: function () {
        let eventClickPolygon = map.data.addListener("click", (args) => {
            //let checkHopThua = (typeof HopThua !== "undefined" && typeof HopThua.GLOBAL !== "undefined" && typeof HopThua.GLOBAL.checkHopThua !== "undefined") ? HopThua.GLOBAL.checkHopThua : false;
            if (HopThua.GLOBAL.checkHopThua) {
                HopThua.getInforThuaDat(args.location.lat, args.location.lng);
            } else {
                HopThua.GLOBAL.listHopThua = [];
            }
        });
        $(HopThua.SELECTORS.btnHopThua).on("click", function () {
            HopThua.GLOBAL.checkHopThua = !HopThua.GLOBAL.checkHopThua;
            if (HopThua.GLOBAL.checkHopThua) {
                $(this).attr("disabled", "disabled");
                $(HopThua.SELECTORS.btnSaveHopThua).removeAttr("disabled");
                $(HopThua.SELECTORS.btnHuyHopThua).removeAttr("disabled");
            }
        });
        $(HopThua.SELECTORS.btnHuyHopThua).on("click", function () {
            HopThua.GLOBAL.checkHopThua = false;
            if (!HopThua.GLOBAL.checkHopThua) {
                $(HopThua.SELECTORS.btnHopThua).removeAttr("disabled");
                $(HopThua.SELECTORS.btnSaveHopThua).attr("disabled", "disabled");
                $(HopThua.SELECTORS.btnHuyHopThua).attr("disabled", "disabled");
                HopThua.clearPolylineHopThua();
            }
        });
        $(HopThua.SELECTORS.btnSaveHopThua).on("click", function () {
            if (HopThua.GLOBAL.listHopThua.length > 1) {
                $(HopThua.SELECTORS.formInforHopThua).modal("show");
                if (ViewMap.GLOBAL.commonData !== null && typeof ViewMap.GLOBAL.commonData !== "undefined") {
                    let propertie = ViewMap.GLOBAL.commonData.features[0].properties;
                    $(HopThua.SELECTORS.SoToUpdate).val(propertie.SoHieuToBanDo);
                    //$(HopThua.SELECTORS.SoThuaUpdate).val(propertie.SoThuTuThua);
                    //$(UpdateThuaDat.SELECTORS.KHList).val(propertie.KyHieuMucDichSuDung);
                    $(".form-infor-hop-thua #KH-listselectid option[value='" + propertie.KyHieuMucDichSuDung + "']").attr('selected', 'selected');
                    let dienTich = 0, dienTichPhapLy = 0;
                    for (var i = 0; i < HopThua.GLOBAL.listHopThua.length; i++) {
                        let object = HopThua.GLOBAL.listHopThua[i].features[0].properties.info === "vn2000" ? HopThua.GLOBAL.listHopThua[i].features[0] : HopThua.GLOBAL.listHopThua[i].features[1];
                        dienTich = dienTich + object.properties.DienTich;
                        dienTichPhapLy = dienTichPhapLy + object.properties.DienTichPhapLy;
                    }
                    $(HopThua.SELECTORS.DienTichUpdate).val(dienTich);
                    $(HopThua.SELECTORS.DienTichPhapLyUpdate).val(dienTichPhapLy);
                }
            } else {
                swal({
                    title: "Thông báo",
                    text: "Bạn chọn ít nhất 2 thửa đất!",
                    icon: "warning",
                    button: "Đóng",
                });
            }

        });
        $(HopThua.SELECTORS.btnUpdateThuaDat).on("click", function () {
            if (HopThua.checkFormInfor()) {
                //list polygon from
                let maxa = "";
                let listPolygonHopThua = [];
                for (var i = 0; i < HopThua.GLOBAL.listHopThua.length; i++) {
                    let object = HopThua.GLOBAL.listHopThua[i].features[0].properties.info === "vn2000" ? HopThua.GLOBAL.listHopThua[i].features[0] : HopThua.GLOBAL.listHopThua[i].features[1];
                    maxa = object.properties.MaXa;
                    let check = {
                        id: object.properties.Id,
                        objectId: object.properties.ObjectId,
                        uuid: object.properties.UUID,
                        thoiDiemBatDau: object.properties.ThoiDiemBatDau,
                        thoiDiemKetThuc: object.properties.ThoiDiemKetThuc,
                        maXa: object.properties.MaXa,
                        maDoiTuong: object.properties.MaDoiTuong,
                        soHieuToBanDo: object.properties.SoHieuToBanDo,
                        soThuTuThua: object.properties.SoThuTuThua,
                        soHieuToBanDoCu: object.properties.SoHieuToBanDoCu,
                        soThuTuThuaCu: object.properties.SoThuTuThuaCu,
                        dienTich: object.properties.DienTich,
                        dienTichPhapLy: object.properties.DienTichPhapLy,
                        kyHieuMucDichSuDung: object.properties.KyHieuMucDichSuDung,
                        kyHieuDoiTuong: "",
                        tenChu: object.properties.TenChu,
                        diaChi: object.properties.DiaChi,
                        daCapGCN: 0,
                        tenChu2: object.properties.TenChu2,
                        namSinhC1: object.properties.NamSinhC1,
                        soHieuGCN: object.properties.SoHieuGCN,
                        soVaoSo: object.properties.SoVaoSo,
                        ngayVaoSo: object.properties.NgayVaoSo,
                        soBienNhan: 0,
                        nguoiNhanHS: object.properties.NguoiNhanHS,
                        coQuanThuLy: object.properties.CoQuanThuLy,
                        loaiHS: object.properties.LoaiHS,
                        maLienKet: object.properties.MaLienKet,
                        shapeSTArea: 0,
                        shapeSTLength: 0,
                        shapeLength: object.properties.ShapeArea,
                        shapeArea: object.properties.ShapeLength,
                        geometry: object.geometry,
                        tags: {}
                    };
                    listPolygonHopThua.push(check);
                }
                //polygo to
                //let polygonHopThua = HopThua.getPolygonHopThua();
                let polygonHopThua = HopThua.getPolygonHopThuaNew();
                //polygonHopThua.push(polygonHopThua[0]);
                //let geometryHopThua = {
                //    coordinates: [],
                //    type: "Polygon"
                //};
                //geometryHopThua.coordinates.push(polygonHopThua);
                let geometryHopThua = polygonHopThua.geometry;
                let HopThuaTo = {
                    objectId: 0,
                    uuid: "",
                    thoiDiemBatDau: null,
                    thoiDiemKetThuc: null,
                    maXa: maxa,
                    maDoiTuong: "",
                    soHieuToBanDo: Number($(HopThua.SELECTORS.SoToUpdate).val()),
                    soThuTuThua: Number($(HopThua.SELECTORS.SoThuaUpdate).val()),
                    soHieuToBanDoCu: $(HopThua.SELECTORS.SoToUpdateOld).val(),
                    soThuTuThuaCu: $(HopThua.SELECTORS.SoThuaUpdateOld).val(),
                    dienTich: Number($(HopThua.SELECTORS.DienTichUpdate).val()),
                    dienTichPhapLy: Number($(HopThua.SELECTORS.DienTichPhapLyUpdate).val()),
                    kyHieuMucDichSuDung: $(HopThua.SELECTORS.KHList).val(),
                    kyHieuDoiTuong: "",
                    tenChu: $(HopThua.SELECTORS.TenChuUpdate).val(),
                    diaChi: $(HopThua.SELECTORS.DiaChiUpdate).val(),
                    daCapGCN: 0,
                    tenChu2: "",
                    namSinhC1: "",
                    soHieuGCN: "",
                    soVaoSo: "",
                    ngayVaoSo: "",
                    soBienNhan: 0,
                    nguoiNhanHS: "",
                    coQuanThuLy: "",
                    loaiHS: "",
                    maLienKet: "",
                    shapeSTArea: 0,
                    shapeSTLength: 0,
                    shapeLength: 0,
                    shapeArea: 0,
                    geometry: geometryHopThua,
                    tags: {}
                };

                let formHopThua = {
                    from: listPolygonHopThua,
                    to: HopThuaTo
                };
                //console.log(JSON.stringify(formHopThua));
                HopThua.updateHopThua(formHopThua);
            }
        });
        $(HopThua.SELECTORS.formInforHopThua).on('hide.bs.modal', function () {
            $(HopThua.SELECTORS.SoToUpdate).val(0);
            $(HopThua.SELECTORS.SoThuaUpdate).val(0);
            $(HopThua.SELECTORS.SoToUpdateOld).val(0);
            $(HopThua.SELECTORS.SoThuaUpdateOld).val(0);
            $(HopThua.SELECTORS.DienTichUpdate).val(0);
            $(HopThua.SELECTORS.DienTichPhapLyUpdate).val(0);
            $(HopThua.SELECTORS.TenChuUpdate).val("");
            $(HopThua.SELECTORS.DiaChiUpdate).val("");
        });
    },
    getInforThuaDat: function (lat, lng) {
        $.ajax({
            type: "GET",
            url: ViewMap.GLOBAL.url + "/v2/api/land/latlng",
            data: {
                lat: lat,
                lng: lng,
                key: ViewMap.CONSTS.key
            },
            success: function (data) {
                console.log(data);
                if (data.code === "ok" && data.result !== null && data.result.features.length > 0) {
                    let check = HopThua.checkHopThua(data.result);
                    let check1 = HopThua.checkDuplicatePolygon(data.result);
                    if (check && check1) {
                        HopThua.GLOBAL.listHopThua.push(data.result);
                        let geometry = data.result.features[0].properties.info === "wgs84" ? data.result.features[0].geometry : data.result.features[1].geometry;
                        HopThua.setSelectThuaDat(geometry);
                    }
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                let messageErorr = AppCommon.getMessageErrorReuqest(jqXHR, errorThrown);
                console.log(messageErorr);
                ViewMap.showLoading(false);
            }
        });
    },
    checkHopThua: function (data) {
        let checkHopThua = false;
        if (ViewMap.GLOBAL.commonData !== null && ViewMap.GLOBAL.commonData.features !== "undefined" && ViewMap.GLOBAL.commonData.features.length > 0) {
            if (HopThua.GLOBAL.listHopThua.length === 0) {
                HopThua.GLOBAL.listHopThua.push(ViewMap.GLOBAL.commonData);
            }
            let dataVN2000 = data.features[0].properties.info === "vn2000" ? data.features[0] : data.features[1];
            let pathHopThua = HopThua.getCoordinatesSearch(dataVN2000.geometry)[0];
            for (var j = 0; j < HopThua.GLOBAL.listHopThua.length; j++) {
                let dataObj = HopThua.GLOBAL.listHopThua[j];
                let commonDataVN2000 = dataObj.features[0].properties.info === "vn2000" ? dataObj.features[0] : dataObj.features[1];
                let pathCommon = HopThua.getCoordinatesSearch(commonDataVN2000.geometry)[0];
                let listpoint = pathCommon.slice(0);
                listpoint.pop();
                for (var i = 0; i < pathHopThua.length; i++) {
                    let check = pathCommon.filter(x => x[0] === pathHopThua[i][0] && x[1] === pathHopThua[i][1]);
                    if (check.length > 0) {
                        checkHopThua = true;
                        break;
                    }
                }
                if (checkHopThua) {
                    break;
                }
            }
        }
        return checkHopThua;
    },
    getPolygonHopThua: function () {
        let point = [];
        let list = HopThua.GLOBAL.listHopThua;
        for (var i = 0; i < list.length; i++) {
            let data = list[i].features[0].properties.info === "vn2000" ? list[i].features[0] : list[i].features[1];
            let path = HopThua.getCoordinatesSearch(data.geometry)[0];
            let pathPoint = path.slice(0);
            if (pathPoint[0][0] === pathPoint[pathPoint.length - 1][0]) {
                pathPoint.pop();
            }
            if (point.length === 0) {
                point = pathPoint.slice(0);
            } else {
                for (var j = 0; j < pathPoint.length; j++) {
                    let check = point.filter(x => x[0] === pathPoint[j][0] && x[1] === pathPoint[j][1]);
                    if (check.length <= 0) {
                        point.push(pathPoint[j]);
                    }
                }
            }
        }
        console.log(JSON.stringify(point));
        if (point.length > 0) {
            point = HopThua.orderClockWiseVN2000(point);
        }
        console.log(JSON.stringify(point));
        return point;
    },
    getPolygonHopThuaNew: function () {
        let list = HopThua.GLOBAL.listHopThua;
        let polygonUnion = null;
        for (var i = 0; i < list.length; i++) {
            let data = list[i].features[0].properties.info === "vn2000" ? list[i].features[0] : list[i].features[1];
            if (polygonUnion !== null) {
                polygonUnion = turf.union(polygonUnion, data);
            } else {
                polygonUnion = data;
            }
        }
        return polygonUnion;
    },
    setSelectThuaDat: function (data) {
        let Coordinates = HopThua.getCoordinatesSearch(data);
        let ListPolyline = [];
        for (var i = 0; i < Coordinates.length; i++) {
            polyline = new map4d.Polyline({
                path: Coordinates[i],
                strokeColor: "#00ffff",
                strokeOpacity: 1.0,
                strokeWidth: 2,
            });
            polyline.setMap(map);
        }
        HopThua.GLOBAL.listPolylineHopThua.push(polyline);
    },
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
    orderClockWiseVN2000: function (listPoints) {
        var listTemp = listPoints.slice(0);
        var mX = 0;
        var mY = 0;
        $.each(listTemp, function (i, obj) {
            mX = mX + obj[0];//obj.y;
            mY = mY + obj[1];//obj.x;
        });
        mX = mX / listTemp.length;
        mY = mY / listTemp.length;
        listTemp.sort(function (a, b) {
            let at1 = (Math.atan2(a[1] - mY, a[0] - mX));//(Math.atan2(a.x - mY, a.y - mX));
            let at2 = (Math.atan2(b[1] - mY, b[0] - mX));//(Math.atan2(b.x - mY, b.y - mX));
            return at1 - at2;
        });
        var listPointOrder = [];
        for (var i = 0; i < listTemp.length; i++) {
            if (i === listTemp.length - 1) {
                listPointOrder.push(listTemp[i]);
            } else
                if (listTemp[i][0] !== listTemp[i + 1][0] && listTemp[i][1] !== listTemp[i + 1][1]) {
                    listPointOrder.push(listTemp[i]);
                }
        }
        return listPointOrder;
    },
    orderClockWiseWGS84: function (listPoints) {
        var listTemp = listPoints.slice(0);
        var mX = 0;
        var mY = 0;
        $.each(listTemp, function (i, obj) {
            mX = mX + obj[0];//obj.lng;
            mY = mY + obj[1];//obj.lat;
        });
        mX = mX / listTemp.length;
        mY = mY / listTemp.length;
        listTemp.sort(function (a, b) {
            let at1 = (Math.atan2(a[1] - mY, a[0] - mX));//(Math.atan2(a.lat - mY, a.lng - mX));
            let at2 = (Math.atan2(b[1] - mY, b[0] - mX));//(Math.atan2(b.lat - mY, b.lng - mX));
            return at1 - at2;
        });
        var listPointOrder = [];
        for (var i = 0; i < listTemp.length; i++) {
            if (i === listTemp.length - 1) {
                listPointOrder.push(listTemp[i]);
            } else
                if (listTemp[i][0] !== listTemp[i + 1][0] && listTemp[i][1] !== listTemp[i + 1][1]) {
                    listPointOrder.push(listTemp[i]);
                }
        }
        return listPointOrder;
    },
    clearPolylineHopThua: function () {
        $.each(HopThua.GLOBAL.listPolylineHopThua, function (i, obj) {
            obj.setMap(null);
        });
        HopThua.GLOBAL.listHopThua = [];
    },
    updateHopThua: function (data) {
        $.ajax({
            type: "POST",
            url: ViewMap.GLOBAL.url + "/v2/api/land/hop-thua?key=" + ViewMap.CONSTS.key,
            data: JSON.stringify(data),
            dataType: 'json',
            async: false,
            contentType: 'application/json-patch+json',
            success: function (data) {
                if (data.code === "ok") {
                    HopThua.GLOBAL.checkHopThua = !HopThua.GLOBAL.checkHopThua;
                    if (!HopThua.GLOBAL.checkHopThua) {
                        $(HopThua.SELECTORS.btnHopThua).removeAttr("disabled");
                        $(HopThua.SELECTORS.btnSaveHopThua).attr("disabled", "disabled");
                        $(HopThua.SELECTORS.btnHuyHopThua).attr("disabled", "disabled");
                    }
                    swal({
                        title: "Thông báo",
                        text: "Cập nhật thông tin hợp thửa thành công!",
                        icon: "success",
                        button: "Đóng",
                    }).then((value) => {
                        $(HopThua.SELECTORS.formInforHopThua).modal("hide");
                        RemoveUrlToThua();
                        setTimeout(function () {
                            location.reload();
                        }, 500);
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
    checkFormInfor: function () {
        let check = true;
        let SoThua = $(HopThua.SELECTORS.SoThuaUpdate).val();
        if (!validateText(SoThua, "number", 0, 0) || SoThua === "0") { insertError($(HopThua.SELECTORS.SoThuaUpdate), "other"); check = false; }
        let SoTo = $(HopThua.SELECTORS.SoToUpdate).val();
        if (!validateText(SoTo, "number", 0, 0) || SoTo === "0") { insertError($(HopThua.SELECTORS.SoToUpdate), "other"); check = false; }
        let DienTichUpdate = $(HopThua.SELECTORS.DienTichUpdate).val();
        if (!validateText(DienTichUpdate, "float", 0, 0) || DienTichUpdate === "0") { insertError($(HopThua.SELECTORS.DienTichUpdate), "other"); check = false; }
        let DienTichPhapLyUpdate = $(HopThua.SELECTORS.DienTichPhapLyUpdate).val();
        if (!validateText(DienTichPhapLyUpdate, "float", 0, 0) || DienTichPhapLyUpdate === "0") { insertError($(HopThua.SELECTORS.DienTichPhapLyUpdate), "other"); check = false; }
        let TenChuUpdate = $(HopThua.SELECTORS.TenChuUpdate).val();
        if (!validateText(TenChuUpdate, "text", 0, 0)) { insertError($(HopThua.SELECTORS.TenChuUpdate), "other"); check = false; }
        return check;
    },
    checkDuplicatePolygon: function (data) {
        let dataProperties = data.features[0].properties;
        let count = 0;
        for (var j = 0; j < HopThua.GLOBAL.listHopThua.length; j++) {
            //let hopThuaProperties = HopThua.GLOBAL.listHopThua
            let dataObj = HopThua.GLOBAL.listHopThua[j].features[0].properties;
            if (dataProperties.SoHieuToBanDo === dataObj.SoHieuToBanDo && dataProperties.SoThuTuThua === dataObj.SoThuTuThua) {
                count++;
            }
        }
        return count > 0 ? false : true;
    },
    addSelectMucDich: function () {
        $.ajax({
            type: "GET",
            url: ViewMap.GLOBAL.url + "/v2/api/land/all-muc-dich-su-dung",
            data: {
                key: ViewMap.CONSTS.key
            },
            success: function (data) {
                if (data.code == "ok" && data.result != null && data.result.length > 0) {
                    let selecthtml = '';
                    for (var i = 0; i < data.result.length; i++) {
                        selecthtml += `<option value="${data.result[i].mucDichSuDung}">
                                        ${data.result[i].name}
                                    </option>`;
                    }
                    $(HopThua.SELECTORS.KHList).append(selecthtml);
                } else {
                    swal({
                        title: "Thông báo",
                        text: "Không tìm thấy thành phố địa chính",
                        icon: "warning",
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
    },
};