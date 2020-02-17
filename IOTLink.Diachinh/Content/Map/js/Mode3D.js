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
        txtTotalAreaFloor: "#TotalAreaFloor",
        txtNameObject: "#txtName",
        inputFile: '#objFile',
        selectObjectMode: '.object-mode-3d',
        btnSaveMode3D: ".btn-save-mode-3d",
        focusInput: ".project-content input",
        loadingModel3D: ".modal-edit-mode-3d #loading-map-mode3d",
        errorDrawEmpty: ".modal-edit-mode-3d .errorDrawEmpty",
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
                //mapMode3D.setTileUrl("http://61.28.233.229:8080/all/2d/{z}/{x}/{y}.png");
                //mapMode3D.setTileUrl("http://61.28.233.229:8080/all/3d/{z}/{x}/{y}.png", true);
                mapMode3D.setPlacesEnabled(false);
                mapMode3D.setSwitchMode(map4d.SwitchMode.Auto);
                EditMode3D.setEvent();
                MapControl.initMode3D();
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
            $(EditMode3D.SELECTORS.txtTotalAreaFloor).val(0);
            $(EditMode3D.SELECTORS.txtHeightfloor).val(1);
            $(EditMode3D.SELECTORS.txtNameObject).val("");
            map.showMapObject(true);
            map.enable3dMode(false);
            mapMode3D.enable3dMode(true)
            $(EditMode3D.SELECTORS.errorDrawEmpty).hide();
            EditMode3D.removeLisObjectEdit();
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
            if (typeof objname !== "undefined" && typeof texturename !== "undefined" && objname !== "" && objname !== null) {
                EditMode3D.createObjectModeDefault(val, EditMode3D.GLOBAL.locationObject.lat, EditMode3D.GLOBAL.locationObject.lng, EditMode3D.GLOBAL.scale, EditMode3D.GLOBAL.bearing, EditMode3D.GLOBAL.elevation, objname, texturename);
            } else {
                EditMode3D.GLOBAL.objFile = null;
                EditMode3D.GLOBAL.textureFile = null;

                let iLatLng = [];
                $.each(EditMode3D.GLOBAL.listMarker, function () {
                    let latLng = { lat: this.getPosition().lat, lng: this.getPosition().lng };
                    iLatLng.push(latLng);
                });
                iLatLng.push(iLatLng[0]);
                if (EditMode3D.GLOBAL.objectModel != null) {
                    EditMode3D.GLOBAL.objectModel.setCoordinates(iLatLng);
                }
            }
        });
        $(EditMode3D.SELECTORS.btnSaveMode3D).on("click", function () {
            let listpoint = EditMode3D.GLOBAL.polygonDraw.getPaths()[0];
            if (EditMode3D.checkListPointInsindePolygon(listpoint)) {
                EditMode3D.saveMode3D();
            } else {
                swal({
                    title: "Thông báo",
                    text: "Vui lòng bạn di chuyển đối tượng và đáy vào trong thửa đất",
                    icon: "error",
                    button: "Đóng",
                }).then((value) => {
                });
            }
        });

        $(EditMode3D.SELECTORS.focusInput).on("click", function () {
            $(this).parent().removeClass("has-error");
        });

        $(EditMode3D.SELECTORS.txtHeightfloor).on("change", function () {
            let areaFloor = $(EditMode3D.SELECTORS.txtAreaFloor).val();
            let floor = Number($(this).val());
            $(EditMode3D.SELECTORS.txtTotalAreaFloor).val(areaFloor * floor);
        });
        $(EditMode3D.SELECTORS.txtAreaFloor).on("change", function () {
            let areaFloor = $(EditMode3D.SELECTORS.txtAreaFloor).val();
            let floor = Number($(EditMode3D.SELECTORS.txtHeightfloor).val());
            $(EditMode3D.SELECTORS.txtTotalAreaFloor).val(areaFloor * floor);
        });

        let eventClickMap = mapMode3D.addListener("click", (args) => {
            if (EditMode3D.GLOBAL.isStartDraw) {
                if (EditMode3D.checkPointInsidePolygon(args.location)) {
                    $(EditMode3D.SELECTORS.errorDrawEmpty).hide();
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
                } else {
                    $(EditMode3D.SELECTORS.errorDrawEmpty).show();
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
                $(EditMode3D.SELECTORS.txtAreaFloor).val(EditMode3D.calculatorAraePolygon());
                EditMode3D.changeTotalArea();
                //let floor = Number($(EditMode3D.SELECTORS.txtHeightfloor).val());
                //$(EditMode3D.SELECTORS.txtTotalAreaFloor).val(EditMode3D.calculatorAraePolygon() * floor);
                
            }
        }, { marker: true });

        let eventDragEndMarker = mapMode3D.addListener("drag", function (data) {
            if (EditMode3D.GLOBAL.isEditDraw) {
                if (EditMode3D.checkPointInsidePolygon(data.marker.getPosition())) {
                    $(EditMode3D.SELECTORS.errorDrawEmpty).hide();
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
                    $(EditMode3D.SELECTORS.txtAreaFloor).val(EditMode3D.calculatorAraePolygon());
                    EditMode3D.changeTotalArea();
                    //let floor = Number($(EditMode3D.SELECTORS.txtHeightfloor).val());
                    //$(EditMode3D.SELECTORS.txtTotalAreaFloor).val(EditMode3D.calculatorAraePolygon() * floor);
                } else {
                    $(EditMode3D.SELECTORS.errorDrawEmpty).show();
                }
            }
        }, { marker: true });

        let eventDragEnd = mapMode3D.addListener("drag", function (data) {
            let listpoint = EditMode3D.GLOBAL.objectModel.getTransformedCoordinates();
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
            if (!EditMode3D.checkListPointInsindePolygon(listpoint)) {
                $(EditMode3D.SELECTORS.errorDrawEmpty).show();
            } else {
                $(EditMode3D.SELECTORS.errorDrawEmpty).hide();
            }
        }, { object: true });

        let eventClickObject = mapMode3D.addListener("click", function (data) {
            console.log(data);
            let obj = EditMode3D.GLOBAL.listObjectEdit.find(x => x.id == data.object.id);
            if (typeof obj !== "undefined" && obj !== null && typeof obj.id !== "undefined") {
                let polygonEdit = obj.polygon;
                if (typeof polygonEdit !== "undefined" && polygonEdit !== null) {
                    EditMode3D.removeListMarker();
                    if (EditMode3D.GLOBAL.polygonDraw != null) {
                        EditMode3D.GLOBAL.polygonDraw.setMap(null);
                        EditMode3D.GLOBAL.polygonDraw = null;
                    }
                    EditMode3D.GLOBAL.polygonDraw = obj.polygon;
                    for (var i = 0; i < polygonEdit.paths[0].length - 1; i++) {
                        let latlng = polygonEdit.paths[0][i]
                        EditMode3D.createMarkerDrawLoDat(latlng.lat, latlng.lng);
                    }
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
                        $(EditMode3D.SELECTORS.txtTotalAreaFloor).val(obj.tags.totalarea);
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
            url: ViewMap.GLOBAL.url + "/v2/api/model/all",
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
        if (EditMode3D.GLOBAL.objectModelEidt != null && EditMode3D.GLOBAL.objectModelEidt.length > 0) {
            let obj = EditMode3D.GLOBAL.listObjectEdit.find(x => x.id == EditMode3D.GLOBAL.objectModelEidt);
            obj.polygon = EditMode3D.GLOBAL.polygonDraw;
        }
    },
    RemoveShape: function () {
        //replay distance
        let list = EditMode3D.GLOBAL.listPolyline;
        $.each(list, function (i, obj) {
            obj.setMap(null);
        });
    },
    ShowMeterDraw: function (endPoint, mousePoint) {
        //let projection = new map4d.Projection(map)
        //let screenCoordinate1 = projection.fromLatLngToScreen([endPoint[0], endPoint[1]]);
        //let screenCoordinate2 = projection.fromLatLngToScreen([mousePoint[0], mousePoint[1]]);
        //let x = (screenCoordinate1.x + screenCoordinate2.x) / 2;
        //let y = (screenCoordinate1.y + screenCoordinate2.y) / 2;
        //let latLngCoordinate = projection.fromScreenToLatLng({ x: x, y: y })
        let lat = (endPoint[1] + mousePoint[1]) / 2;
        let lng = (endPoint[0] + mousePoint[0]) / 2;
        let measure = new map4d.Measure([endPoint, mousePoint,]);
        let length = (Math.round(measure.length * 100) / 100).toString();
        //if (check) {
        if (markerMeter != null) markerMeter.setMap(null);
        markerMeter = new map4d.Marker({
            position: { lat: lat, lng: lng },
            anchor: [0.5, 1],
            visible: true,
            label: new map4d.MarkerLabel({ text: length + "", color: "000000", fontSize: 12 }),
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
    changeStartStop: function (check) {
        if (check) {
            for (let i = 0; i < EditMode3D.GLOBAL.listMarker.length; i++) {
                EditMode3D.GLOBAL.listMarker[i].setDraggable(true);
            }
            //EditMode3D.GLOBAL.objectModel.setDraggable(false);
        } else {
            for (let i = 0; i < EditMode3D.GLOBAL.listMarker.length; i++) {
                EditMode3D.GLOBAL.listMarker[i].setDraggable(false);
            }
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
                            EditMode3D.GLOBAL.objectModel.setBearing(0);
                            $(EditMode3D.SELECTORS.txtBearing).val(0);
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
                EditMode3D.removeListMarker();
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
                EditMode3D.removeListMarker();
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
                                    floor: Number($(EditMode3D.SELECTORS.txtHeightfloor).val()),
                                    totalarea: Number($(EditMode3D.SELECTORS.txtTotalAreaFloor).val())
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
        let area= $(EditMode3D.SELECTORS.txtAreaFloor).val();
        let floor = $(EditMode3D.SELECTORS.txtHeightfloor).val();
        let dientichdat = ViewMap.GLOBAL.commonData.features[0].properties.DienTich;
        if (area.length > 0 && (isNaN(Number(area)) || Number(area) <= 0 || Number(area) > dientichdat)) { insertError($(EditMode3D.SELECTORS.txtAreaFloor), "other"); check = false; }
        if (floor.length > 0 && (isNaN(parseInt(floor)) || parseInt(floor) <= 0)) { insertError($(EditMode3D.SELECTORS.txtHeightfloor), "other"); check = false; }
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
                floor: Number($(EditMode3D.SELECTORS.txtHeightfloor).val()),
                totalarea: Number($(EditMode3D.SELECTORS.txtTotalAreaFloor).val())
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
    checkListPointInsindePolygon: function (list) {
        let check = true;
        $.each(list, function (i, obj) {
            let polygon = EditMode3D.GLOBAL.polygon.getPaths()[0];
            check = EditMode3D.isPointInPolygon(polygon, obj.lat, obj.lng);
            if (!check) {
                return check;
            }
        });
        return check;
    },
    checkPointInsidePolygon: function (point) {
        let polygon = EditMode3D.GLOBAL.polygon.getPaths()[0];
        let check = EditMode3D.isPointInPolygon(polygon, point.lat, point.lng);
        return check;
    },
    isPointInPolygon: function (poly, lat, lng) {
        let i, j;
        var c = false;
        for (i = 0, j = poly.length - 1; i < poly.length; j = i++) {
            if ((((poly[i].lat <= lat) && (lat < poly[j].lat)) | ((poly[j].lat <= lat) && (lat < poly[i].lat)))
                && (lng < (poly[j].lng - poly[i].lng) * (lat - poly[i].lat) / (poly[j].lat - poly[i].lat) + poly[i].lng))
                c = !c;
        }
        return c;
    },
    calculatorAraePolygon: function () {
        let latlng = EditMode3D.GLOBAL.polygonDraw.getPaths()[0];
        let arrayLatLng = [];
        $.each(latlng, function (i, obj) {
            latlng = [obj.lng, obj.lat];
            arrayLatLng.push(latlng);
        })
        let measure = new map4d.Measure(arrayLatLng)
        return EditMode3D.convertFloat(measure.area);
    },
    convertFloat: function (value) {
        return Math.round(Number(value) * 10) / 10;
    },
    removeLisObjectEdit: function () {
        EditMode3D.removeListMarker();
        for (var i = 0; i < EditMode3D.GLOBAL.listObjectEdit.length; i++) {
            EditMode3D.GLOBAL.listObjectEdit[i].object.setMap(null);
            EditMode3D.GLOBAL.listObjectEdit[i].polygon.setMap(null);
        }
        EditMode3D.GLOBAL.listObjectEdit = [];
    },
    removeListMarker: function () {
        $.each(EditMode3D.GLOBAL.listMarker, function () {
            this.setMap(null);
        })
        EditMode3D.GLOBAL.listMarker = [];
    },
    changeTotalArea: function () {
        let floor = Number($(EditMode3D.SELECTORS.txtHeightfloor).val());
        $(EditMode3D.SELECTORS.txtTotalAreaFloor).val(EditMode3D.calculatorAraePolygon() * floor);
    },
}