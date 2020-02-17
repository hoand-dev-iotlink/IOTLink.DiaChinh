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
        inputCommon:".common-so input",
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
        }, { map: true});
        let eventDoubleClickMap = map.addListener("dblClick", (args) => {
            //Distance
            if (ToolShape.GLOBAL.isStartDistance) {
                let listMarker = ToolShape.GLOBAL.listDistance.listMarkerDistance;
                let getEndPosition = listMarker[listMarker.length - 1].getPosition();
                let endPoint = [getEndPosition.lng, getEndPosition.lat];
                let mousePoint = [args.location.lng, args.location.lat];
                let measure = new map4d.Measure([endPoint, mousePoint,]);
                if ((Math.round(measure.length * 100) / 100) > 1) {
                    ToolShape.createMarkerDrawLoDat(args.location.lat, args.location.lng, false);
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

                ToolShape.GLOBAL.isStartDistance = false;
                let list = ToolShape.GLOBAL.listDistance.listMerterDistance;
                let total = 0;
                $.each(list, function (i, obj) {
                    obj.setMap(map);
                    let merter = obj.getLabel().text;
                    //let split = merter.split(" ");
                    total += ToolShape.splitStringDistance(merter);
                });
                if (list.length > 1) {
                    let point = args.location;
                    total = Math.round(total * 100) / 100
                    ToolShape.showMerterTotal(point, total);
                }
            }
            //area
            if (ToolShape.GLOBAL.isStartArea) {
                ToolShape.GLOBAL.isStartArea = false;
                ToolShape.GLOBAL.isStartDistance = false;
                if (ToolShape.GLOBAL.listArea.listMerterArea.length != ToolShape.GLOBAL.listArea.listMarkerArea.length) {
                    let getStartPoint = ToolShape.GLOBAL.listArea.listMarkerArea[ToolShape.GLOBAL.listArea.listMarkerArea.length - 1].getPosition();
                    let getEndPoint = ToolShape.GLOBAL.listArea.listMarkerArea[0].getPosition();
                    let startPoint = [getStartPoint.lng, getStartPoint.lat];
                    let endPoint = [getEndPoint.lng, getEndPoint.lat];
                    ToolShape.ShowMeterArea(startPoint, endPoint);
                }
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
            buttons: {
                cancel: {
                    label: "Thoát",
                    className: "btn-default"
                },
                confirm: {
                    label: "Đồng ý",
                    className: "btn-primary"
                }
            },
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
            type: "POST",
            url: "/Home/ExportFileShape",
            data: JSON.stringify(param),
            contentType: "application/json",
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
                console.log(errorThrown);
            }
        });
    },
    test: function (data) {
        $.ajax({
            type: "POST",
            url: "/Home/Test",
            data: JSON.stringify(data),
            contentType: "application/json",
            async: true,
            success: function (re) {
                console.log(re)
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(errorThrown);
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
        let lat = (endPoint[1] + mousePoint[1]) / 2;
        let lng = (endPoint[0] + mousePoint[0]) / 2;
        let measure = new map4d.Measure([endPoint, mousePoint,]);
        let length = (Math.round(measure.length * 100) / 100).toString();
        if (check) {
            if (markerMeter != null) markerMeter.setMap(null);
            markerMeter = new map4d.Marker({
                position: { lat: lat, lng: lng },
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
        let lat = (endPoint[1] + mousePoint[1]) / 2;
        let lng = (endPoint[0] + mousePoint[0]) / 2;
        let measure = new map4d.Measure([endPoint, mousePoint,]);
        let length = (Math.round(measure.length * 100) / 100).toString();
        if (markerMeter != null) markerMeter.setMap(null);
        markerMeter = new map4d.Marker({
            position: { lat: lat, lng:lng },
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
            icon: new map4d.Icon(8, 8, "/images/yellow-point.png"),
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
        if (listarea.PolylineArea != null) {
            listarea.PolylineArea.setMap(null);
            listarea.PolylineArea = null;
        }
        
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
}