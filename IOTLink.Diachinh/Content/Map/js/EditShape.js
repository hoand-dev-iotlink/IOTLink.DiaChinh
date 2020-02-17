var EditShape = {
    GLOBAL: {
        ThuaDat: null,
        polygon: null,
        path: null,
        listMarkerDiem: [],
        listDiem: [],
        listKetQuaGhiNhan: [],
        mapEditShape: null,
        polygonEidtChange: null,
        listDrawPolygon: [],
        listInforUpdateTachThua: [],
        codeMaXaThuaDat: "",
        polylineGhiNhan: null,
        listSortKetQuaGhiNhan: [],
        polylineSelectPolygon: null,
        markerHighlight:null,
    },
    CONSTS: {

    },
    SELECTORS: {
        checkGiaoHoi: ".giao-hoi",
        modalEditShape: ".modal-edit-shape",
        btnEditShape: ".btn-chinh-sua-thua-dat",
        formGiaoHoi: ".modal-edit-shape .form-giao-hoi",
        noteGiaoHoi: ".modal-edit-shape .note-giao-hoi",
        menuCachDuongThang: ".modal-edit-shape .menu-cach-duong-thang",
        menuHoiThuan: ".modal-edit-shape .menu-hoi-thuan",
        menuHoiNghich: ".modal-edit-shape .menu-hoi-nghich",
        menuHoiHuong: ".modal-edit-shape .menu-hoi-huong",
        menuDocTheoCanh: ".modal-edit-shape .menu-doc-theo-canh",
        menuNhapToaDo: ".modal-edit-shape .menu-nhap-toa-do",
        selectDinhA: ".modal-edit-shape .sel_GHCDTDinhA",
        selectDinhB: ".modal-edit-shape .sel_GHCDTDinhB",
        selectDinhC: ".modal-edit-shape .sel_GHCDTDinhC",
        selectDinhD: ".modal-edit-shape .sel_GHCDTDinhD",
        inputCachAB: ".modal-edit-shape .inp_CachAB",
        inputCachCD: ".modal-edit-shape .inp_CachCD",
        inputCachAC: ".modal-edit-shape .inp_CanhAC",
        inputCachBC: ".modal-edit-shape .inp_CanhBC",
        inputGocCAB: ".modal-edit-shape .inp_GocCAB",
        inputGocCBA: ".modal-edit-shape .inp_GocCBA",
        inputGocAPB: ".modal-edit-shape .inp_GocAPB",
        inputGocAPC: ".modal-edit-shape .inp_GocAPC",
        inputKhoangCach: ".modal-edit-shape .inp_KhoangCach",
        radioGiaoHoiThuan: ".modal-edit-shape input[name='loaiGiaoHoiThuanE']",
        radioGiaoHoiThuanCheck: ".modal-edit-shape input[name='loaiGiaoHoiThuanE']:checked",
        radioTuDiem: ".modal-edit-shape input[name='rad_tudiemE']",
        radioTuDiemCheck: ".modal-edit-shape input[name='rad_tudiemE']:checked",
        radioDiem: ".modal-edit-shape input[name='rad_diem']",
        radioDiemCheck: ".modal-edit-shape input[name='rad_diem']:checked",
        titleGiaoHoi: ".modal-edit-shape .title-giao-hoi",
        showHideForm: ".modal-edit-shape .btn-show-hide-point",
        formPointMap: ".modal-edit-shape .footer-map-point",
        viewResultEditShape: ".modal-edit-shape .view-edit-shape",
        clearResultEditShape: ".modal-edit-shape .clear-result",
        saveResultEditShape: ".modal-edit-shape .save-edit-shape",
        clearAllPoint: ".modal-edit-shape .clear-all-point",
        closeInforTachThua: ".modal-edit-shape .header-infor span",

        //inforTachThua: ".infor-Tach-Thua",
        //btnSaveInforTemp: ".btn-save-infor-temp",
        pointGhiNhan: ".modal-edit-shape #pointGhiNhan",
        pointGhiNhanChild: ".modal-edit-shape #pointGhiNhan tr",
        clearPoint: ".modal-edit-shape .clearPoint",
        menuCaseEditShape: ".menu-case-edit-shap .btn-common-case",
        selectChangePoint: "select[name='select-all-point-change']",
        btnGhiNhanDiem: ".modal-edit-shape #btn_Submit-edit-shape",
        menuGiaoHoi: ".modal-edit-shape .menu-giao-hoi",
        menuNhapDiem: ".modal-edit-shape .nhap-point",
        btnXemThu: ".modal-edit-shape #btn_Preview-edit-shape",
        btnGhiNhanDiemNhap: ".modal-edit-shape .btn-ghi-diem-nhap",
        btnResetGiaoHoi:".modal-edit-shape #btn_Clear_edit_shape",
        inputPointX: ".modal-edit-shape input[name='pointx']",
        inputPointY: ".modal-edit-shape input[name='pointy']",
        checkGiaoHoi: ".modal-edit-shape .giao-hoi",
        tableTr: ".modal-edit-shape .table-point tr",
        classTachDiemA: ".modal-edit-shape .tachdiema span",
    },
    init: function () {
        mapEditShape = null;
        $(EditShape.SELECTORS.btnEditShape).on("click", function () {
            if (mapEditShape === null || typeof mapEditShape === "undefined" || mapEditShape === "") {
                mapEditShape = new map4d.Map(document.getElementById("mapEditShape"), {
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
                EditShape.GLOBAL.mapEditShape = mapEditShape
                //mapEditShape.setTileUrl("http://61.28.233.229:8080/all/2d/{z}/{x}/{y}.png");
                //mapEditShape.setTileUrl("http://61.28.233.229:8080/all/2d/{z}/{x}/{y}.png", true);
                mapEditShape.setPlacesEnabled(false);
                mapEditShape.setTileFeatureVisible(false, false);
                EditShape.setEvent();
                //EditShape.setEsri();
                //EditShape.addSelectMucDich();
            }
            EditShape.GLOBAL.codeMaXaThuaDat = ViewMap.GLOBAL.commonData.features[0].properties.MaXa;
            let soto = ViewMap.GLOBAL.commonData.features[0].properties.SoHieuToBanDo;
            let sothua = ViewMap.GLOBAL.commonData.features[0].properties.SoThuTuThua;
            EditShape.showEditShap(EditShape.GLOBAL.codeMaXaThuaDat, soto, sothua);
            setTimeout(function () {
                if (EditShape.GLOBAL.path === null) {
                    let feature = EditShape.GLOBAL.ThuaDat.features[0];
                    EditShape.GLOBAL.path = EditShape.convertCoordinate(feature);
                }
                EditShape.fitBoundsThuaDat(EditShape.GLOBAL.path);
                var camera = mapEditShape.getCamera();
                let zoom = camera.getZoom();
                camera.setZoom(zoom - 1);
                mapEditShape.setCamera(camera);
                EditShape.setMarkerDiem(EditShape.GLOBAL.ThuaDat);
            }, 1000);
            $(EditShape.SELECTORS.modalEditShape).modal('show');
        });
    },
    setEvent: function () {

        //$(TachThua.SELECTORS.pointGhiNhan).sortable({
        //    stop: function (event, ui) {
        //        TachThua.sortPointResult();
        //    }
        //});
        $('.menu-tach-thua ul li a').click(function () {
            $('li a').removeClass("active");
            $(this).addClass("active");
        });
        $(EditShape.SELECTORS.modalEditShape).on('hide.bs.modal', function () {
            EditShape.removeMaker();
            EditShape.removerOptionDiem([1, 2, 3, 4]);
            EditShape.ShowHideAll(false);
            EditShape.removeDrawPolylineDiem();
            EditShape.GLOBAL.listKetQuaGhiNhan = [];
            EditShape.updateListGhiNhan();
            if (EditShape.GLOBAL.polylineSelectPolygon !== null) {
                EditShape.GLOBAL.polylineSelectPolygon.setMap(null);
                EditShape.GLOBAL.polylineSelectPolygon = null;
            }
            $(EditShape.SELECTORS.selectChangePoint).children().remove();
            if (EditShape.GLOBAL.markerHighlight != null) {
                EditShape.GLOBAL.markerHighlight.setMap(null);
                EditShape.GLOBAL.markerHighlight = null;
            }
            $(EditShape.SELECTORS.inforTachThua).removeClass("headerShow");
            $(EditShape.SELECTORS.inforTachThua).removeClass("headerHide");
            let hide = $(EditShape.SELECTORS.formPointMap).hasClass("footerHide");
            if (hide) {
                $(EditShape.SELECTORS.formPointMap).removeClass("footerHide");
            }

        });
        $(EditShape.SELECTORS.modalEditShape).on('show.bs.modal', function () {
            setTimeout(function () {
                $(EditShape.SELECTORS.menuNhapToaDo).trigger("click");
                EditShape.setPointChangeAllPoint();
            }, 1000);
        });
        $(EditShape.SELECTORS.menuNhapToaDo).on("click", function () {
            EditShape.showHtmlGiaoHoi(6);
            EditShape.removeHideFooter();
        });
        $(EditShape.SELECTORS.menuCachDuongThang).on("click", function () {
            EditShape.showHtmlGiaoHoi(1);
            EditShape.setEventChangeAllDiem(1);
            EditShape.removeHideFooter();
        });
        $(EditShape.SELECTORS.menuHoiThuan).on("click", function () {
            EditShape.showHtmlGiaoHoi(2);
            $(EditShape.SELECTORS.radioGiaoHoiThuan).change(function () {
                let check = $(EditShape.SELECTORS.radioGiaoHoiThuanCheck).val();
                if (check === "angle") {
                    $(EditShape.SELECTORS.inputGocCAB).removeAttr("disabled");
                    $(EditShape.SELECTORS.inputGocCBA).removeAttr("disabled");
                    $(EditShape.SELECTORS.inputCachAC).attr("disabled", "");
                    $(EditShape.SELECTORS.inputCachBC).attr("disabled", "");
                }
                if (check === "edge") {
                    $(EditShape.SELECTORS.inputGocCAB).attr("disabled", "");
                    $(EditShape.SELECTORS.inputGocCBA).attr("disabled", "");
                    $(EditShape.SELECTORS.inputCachAC).removeAttr("disabled");
                    $(EditShape.SELECTORS.inputCachBC).removeAttr("disabled");
                }
            });
            EditShape.setEventChangeAllDiem(2);
            EditShape.removeHideFooter();
        });
        $(EditShape.SELECTORS.menuHoiNghich).on("click", function () {
            EditShape.showHtmlGiaoHoi(3);
            EditShape.setEventChangeAllDiem(3);
            EditShape.removeHideFooter();
        });
        $(EditShape.SELECTORS.menuHoiHuong).on("click", function () {
            EditShape.showHtmlGiaoHoi(4);
            EditShape.setEventChangeAllDiem(4);
            EditShape.removeHideFooter();
        });
        $(EditShape.SELECTORS.menuDocTheoCanh).on("click", function () {
            EditShape.showHtmlGiaoHoi(5);
            EditShape.setEventChangeAllDiem(5);
            EditShape.removeHideFooter();
        });
        $(EditShape.SELECTORS.showHideForm).on("click", function () {
            let hide = $(EditShape.SELECTORS.formPointMap).hasClass("footerHide");
            if (hide) {
                $(EditShape.SELECTORS.formPointMap).removeClass("footerHide");
                $(EditShape.SELECTORS.formPointMap).addClass("footerShow");
                $(this).find("i").removeClass("fa-chevron-up");
                $(this).find("i").addClass("fa-chevron-down");
            } else {
                $(EditShape.SELECTORS.formPointMap).addClass("footerHide");
                $(EditShape.SELECTORS.formPointMap).removeClass("footerShow");
                $(this).find("i").removeClass("fa-chevron-down");
                $(this).find("i").addClass("fa-chevron-up");
            }
        });
        $(EditShape.SELECTORS.closeInforTachThua).on("click", function () {
            EditShape.showInforUpdateTachThua(false);
        });
        $(EditShape.SELECTORS.btnSaveInforTemp).on("click", function () {
            if (EditShape.checkFormInfor()) {
                let id = $(EditShape.SELECTORS.inputIdInfor).val();
                let maxa = EditShape.GLOBAL.ThuaDat.features[0].properties.MaXa;
                let soto = Number($(EditShape.SELECTORS.SoToUpdate).val());
                let sothua = Number($(EditShape.SELECTORS.SoThuaUpdate).val());
                let check = EditShape.checkSoThuaSoTo(soto, sothua, maxa);
                if (check) {
                    EditShape.setInforUpdateTachThua(id, maxa);
                } else {
                    insertError($(EditShape.SELECTORS.TenChuUpdate), "other");
                }
            }
        });
        $(EditShape.SELECTORS.focusInput).on("click", function () {
            $(this).parent().removeClass("has-error");
        });
        $(EditShape.SELECTORS.SoThuaUpdate).on("focusout", function () {
            let soto = Number($(EditShape.SELECTORS.SoToUpdate).val());
            let sothua = Number($(this).val());
            let maxa = EditShape.GLOBAL.ThuaDat.features[0].properties.MaXa;
            let check = EditShape.checkSoThuaSoTo(soto, sothua, maxa);
            if (!check) {
                $(EditShape.SELECTORS.SoThuaUpdate).parent().addClass("has-error");
            }
        });
        $(EditShape.SELECTORS.clearAllPoint).on("click", function () {
            EditShape.removeDrawPolylineDiem();
            EditShape.ShowHideAll(false);
            EditShape.GLOBAL.listKetQuaGhiNhan = [];
            EditShape.updateListGhiNhan();
            EditShape.GLOBAL.polygonEidtChange = null;
        });
        $(EditShape.SELECTORS.menuCaseEditShape).on("click", function () {
            $(this).parent().children().removeClass("active-case");
            $(this).addClass("active-case");
            let menucase = $(this).attr("data-case");
            if (menucase == 1) {
                $(EditShape.SELECTORS.menuGiaoHoi).hide();
                $(EditShape.SELECTORS.menuNhapDiem).show();
            } else {
                $(EditShape.SELECTORS.menuGiaoHoi).show();
                $(EditShape.SELECTORS.menuNhapDiem).hide();
            }
        });
        $(EditShape.SELECTORS.viewResultEditShape).on("click", function () {
            if (EditShape.GLOBAL.listKetQuaGhiNhan.length > 0) {
                if (EditShape.GLOBAL.polygon !== null) {
                    EditShape.GLOBAL.polygon.setMap(null);
                }
                var listp = [];
                let dataVN2000 = EditShape.GLOBAL.ThuaDat.features[0].properties.info === "vn2000" ? EditShape.GLOBAL.ThuaDat.features[0] : EditShape.GLOBAL.ThuaDat.features[1];
                let paths = EditShape.convertCoordinate(dataVN2000);
                let pathsClone = paths[0].slice();
                for (var i = 0; i < EditShape.GLOBAL.listKetQuaGhiNhan.length; i++) {
                    let diem = EditShape.GLOBAL.listKetQuaGhiNhan[i].diemChange;
                    pathsClone[diem - 1] = EditShape.GLOBAL.listKetQuaGhiNhan[i].diem2000;
                    if ((diem - 1) == 0) {
                        pathsClone[pathsClone.length - 1] = EditShape.GLOBAL.listKetQuaGhiNhan[i].diem2000;
                    }
                }
                let listPoint = [];
                listPoint.push(pathsClone)
                EditShape.drawingPolygonViewResultEditShape(listPoint);
            } else {
                swal({
                    title: "Thông báo",
                    text: "Vui lòng tìm điểm thay thế!",
                    icon: "warning",
                    buttons: "Đóng",
                    dangerMode: true,
                })
            }
        });
        $(EditShape.SELECTORS.clearResultEditShape).on("click", function () {
            EditShape.ShowHideAll(false);
            //EditShape.drawPolylineDiem(EditShape.GLOBAL.listSortKetQuaGhiNhan);
        });
        $(EditShape.SELECTORS.saveResultEditShape).on("click", function () {
            if (EditShape.GLOBAL.polygonEidtChange !== null && EditShape.GLOBAL.polygonEidtChange.properties.info === "vn2000") {
                let fromFeatures = EditShape.GLOBAL.ThuaDat.features[0].properties.info === "vn2000" ? EditShape.GLOBAL.ThuaDat.features[0] : EditShape.GLOBAL.ThuaDat.features[1];
                let geometryIEditChange = EditShape.GLOBAL.polygonEidtChange.geometry;
                let ThuaDatEditShape = {
                    id: fromFeatures.properties.Id,
                    objectId: fromFeatures.properties.ObjectId,
                    uuid: fromFeatures.properties.UUID,
                    thoiDiemBatDau: fromFeatures.properties.ThoiDiemBatDau,
                    thoiDiemKetThuc: fromFeatures.properties.ThoiDiemKetThuc,
                    maXa: fromFeatures.properties.MaXa,
                    maDoiTuong: fromFeatures.properties.MaDoiTuong,
                    soHieuToBanDo:Number(fromFeatures.properties.SoHieuToBanDo),
                    soThuTuThua: Number(fromFeatures.properties.SoThuTuThua),
                    soHieuToBanDoCu: fromFeatures.properties.SoHieuToBanDoCu,
                    soThuTuThuaCu: fromFeatures.properties.SoThuTuThuaCu,
                    dienTich: Number(fromFeatures.properties.DienTich),
                    dienTichPhapLy: Number(fromFeatures.properties.DienTichPhapLy),
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
                    geometry:geometryIEditChange,
                    tags: {}
                };
                //for (var i = 0; i < EditShape.GLOBAL.listInforUpdateTachThua.length; i++) {
                //    EditShape.GLOBAL.listInforUpdateTachThua[i].id = EditShape.createGuid();
                //}
                //let inforUpdate = {
                //    from: ThuaDatFrom,
                //    to: EditShape.GLOBAL.listInforUpdateTachThua
                //};
                swal({
                    title: "Thông báo",
                    text: "Bạn có chắc chắn lưu những điểm mới này không?",
                    icon: "warning",
                    buttons: [
                        'Hủy',
                        'Lưu lại'
                    ],
                    dangerMode: true,
                }).then((willDelete) => {
                    if (willDelete) {
                        EditShape.UpdateEidtShape(ThuaDatEditShape);
                        EditShape.SyncService(ThuaDatEditShape);
                    }
                });
            } else {
                swal({
                    title: "Thông báo",
                    text: "Vui lòng xem kết quả trước!",
                    icon: "warning",
                    button: "Đóng",
                }).then((value) => {
                });
            }
        });
        $(EditShape.SELECTORS.btnGhiNhanDiem).click(function () {
            let checkpoint = Number($(EditShape.SELECTORS.selectChangePoint).val());
            if (typeof checkpoint !== "undefined" && !isNaN(checkpoint) && checkpoint > 0) {
                EditShape.addGhiNhanDiem($(EditShape.SELECTORS.selectChangePoint).val());
                $(EditShape.SELECTORS.selectChangePoint).children().remove();
                EditShape.setPointChangeAllPoint();
            } else {
                swal({
                    title: "Thông báo",
                    text: "Bạn phải chọn điểm cần thay thế!",
                    icon: "warning",
                    button: "Đóng",
                });
            }

        });
        $(EditShape.SELECTORS.btnXemThu).click(function (e) {
            buttonTachThua.reset();
            EditShape.getPointView();
        });
        $(EditShape.SELECTORS.btnGhiNhanDiemNhap).click(function () {
            let checkpoint = Number($(EditShape.SELECTORS.selectChangePoint).val());
            if (typeof checkpoint !== "undefined" && !isNaN(checkpoint) && checkpoint > 0) {
                if (buttonTachThua.global.list84.length > 0) {
                    EditShape.addGhiNhanDiem($(EditShape.SELECTORS.selectChangePoint).val());
                    $(EditShape.SELECTORS.selectChangePoint).children().remove();
                    EditShape.setPointChangeAllPoint();
                } else {
                    swal({
                        title: "Thông báo",
                        text: "Bạn phải nhập tọa độ x, y!",
                        icon: "waring",
                        button: "Đóng",
                    });
                }

            } else {
                swal({
                    title: "Thông báo",
                    text: "Bạn phải chọn điểm cần thay thế!",
                    icon: "waring",
                    button: "Đóng",
                });
            }
        });
        $(EditShape.SELECTORS.btnResetGiaoHoi).click(function () {
            buttonTachThua.reset();
            let checkGiaoHoi = $(EditShape.SELECTORS.checkGiaoHoi).val();
            switch (checkGiaoHoi) {
                case "giaohoicachduongthang":
                    $(EditShape.SELECTORS.menuCachDuongThang).trigger("click");
                    break;
                case "giaohoithuan":
                    $(EditShape.SELECTORS.menuHoiThuan).trigger("click");
                    break;
                case "giaohoinghich":
                    $(EditShape.SELECTORS.menuHoiNghich).trigger("click");
                    break;
                case "giaohoihuong":
                    $(EditShape.SELECTORS.menuHoiHuong).trigger("click");
                    break;
                case "giaohoidoctheocanh":
                    $(EditShape.SELECTORS.menuDocTheoCanh).trigger("click");
                    break;
                default:
                    $(EditShape.SELECTORS.menuNhapToaDo).trigger("click");
                    break;
            }
        });

        
        
        mapEditShape.addListener("click", (args) => {
            let id = args.polygon.id;
            $(EditShape.SELECTORS.inputIdInfor).val(id);
            EditShape.addRemoveInforTachThua(id);
            EditShape.showInforUpdateTachThua(true);
            $(EditShape.SELECTORS.formPointMap).addClass("footerHide");
            $(EditShape.SELECTORS.formPointMap).removeClass("footerShow");
            $(this).find("i").removeClass("fa-chevron-down");
            $(this).find("i").addClass("fa-chevron-up");
            EditShape.drawingPolyline(args.polygon.getPaths()[0]);
        }, { polygon: true });
    },
    //setEventClearPoint: function () {
    //    $(EditShape.SELECTORS.clearPoint).on("click", function () {
    //        //let a = $(this).parent();
    //        var id = $(this).parents("tr").find("th").attr("data-id");
    //        EditShape.GLOBAL.listKetQuaGhiNhan.splice(Number(id), 1);
    //        EditShape.updateListGhiNhan();
    //        EditShape.setPointChangeAllPoint();
    //    });
    //},
    showEditShap: function (code, soto, sothua) {
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
                    if (data.result.features.length > 0) {
                        let dataRe = data.result;
                        EditShape.removerPointDuplicate(dataRe);
                        EditShape.GLOBAL.ThuaDat = dataRe;
                        let path = EditShape.drawPolygon(EditShape.GLOBAL.ThuaDat);
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
    //removerPointDuplicate: function (dataParam) {
    //    let data = dataParam;
    //    let check = data.features[0].geometry.type;
    //    let dataVN2000 = (data.features[0].properties.info == "vn2000") ? data.features[0] : data.features[1];
    //    let dataWGS84 = (data.features[0].properties.info == "wgs84") ? data.features[0] : data.features[1];
    //    let point84 = (data.features[0].properties.info == "wgs84") ? data.features[0].geometry.coordinates[0] : data.features[1].geometry.coordinates[0];
    //    let point2000 = (data.features[1].properties.info == "vn2000") ? data.features[1].geometry.coordinates[0] : data.features[0].geometry.coordinates[0];
    //    if (check.toLowerCase() === "multipolygon") {
    //        for (var i = 0; i < point2000.length; i++) {
    //            let temp2000 = [];
    //            let temp84 = [];
    //            for (var j = 0; j < point2000[i].length; j++) {
    //                if (j === point2000[i].length - 1) {
    //                    temp2000.push(point2000[i][j]);
    //                    temp84.push(point84[i][j]);
    //                } else
    //                    if (point2000[i][j][1] === point2000[i][j + 1][1] && point2000[i][j][0] === point2000[i][j + 1][0]) { }
    //                    else {
    //                        temp2000.push(point2000[i][j]);
    //                        temp84.push(point84[i][j]);
    //                    }
    //            }
    //            dataVN2000.geometry.coordinates[0][i] = temp2000;
    //            dataWGS84.geometry.coordinates[0][i] = temp84;
    //        }
    //    }
    //    if (check.toLowerCase() === "polygon") {
    //        let temp2000 = [];
    //        let temp84 = [];
    //        for (var i = 0; i < point2000.length; i++) {
    //            let x = point2000[i][1];
    //            let y = point2000[i][0];

    //            if (i === point2000.length - 1) {
    //                temp2000.push(point2000[i]);
    //                temp84.push(point84[i]);
    //            } else
    //                if (point2000[i][j][1] === point2000[i][j + 1][1] && point2000[i][j][0] === point2000[i][j + 1][0]) { }
    //                else {
    //                    temp2000.push(point2000[i][j]);
    //                    temp84.push(point84[i][j]);
    //                }
    //        }
    //        dataVN2000.geometry.coordinates[0] = temp2000;
    //        dataWGS84.geometry.coordinates[0] = temp84;
    //    }
    //    return data;
    //},
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
                        if (point2000[i][j][1] === point2000[i][j + 1][1] && point2000[i][j][0] === point2000[i][j + 1][0]) { }
                        else {
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
                    if (point2000[i][1] === point2000[i + 1][1] && point2000[i][0] === point2000[i + 1][0]) { }
                    else {
                        temp2000.push(point2000[i]);
                        temp84.push(point84[i]);
                    }
            }
            dataVN2000.geometry.coordinates[0] = temp2000;
            dataWGS84.geometry.coordinates[0] = temp84;
        }
        return data;
    },
    drawPolygon: function (data) {
        let feature = data.features[0];
        let paths = EditShape.convertCoordinate(data.features[0]);
        if (EditShape.GLOBAL.polygon !== null) {
            EditShape.GLOBAL.polygon.setMap(null);
        }
        EditShape.GLOBAL.polygon = new map4d.Polygon({
            paths: paths,
            fillColor: "#0000ff",
            fillOpacity: 0,
            strokeColor: "#ea5252",
            strokeOpacity: 1.0,
            strokeWidth: 1,
            userInteractionEnabled: false,
        });
        EditShape.GLOBAL.polygon.setMap(mapEditShape);
        EditShape.GLOBAL.path = paths;
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
        mapEditShape.fitBounds(latLngBounds);
    },
    setMarkerDiem: function (data) {
        EditShape.GLOBAL.listDiem = [];
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
                    markerPoint.setMap(mapEditShape);
                    let countPoint = (i + j + 1).toString();
                    let markerTitelPoint = new map4d.Marker({
                        position: { lat: lat, lng: lng },
                        anchor: [0.5, 1],
                        visible: true,
                        label: new map4d.MarkerLabel({ text: countPoint, color: "ff0000", fontSize: 13 }),
                        icon: new map4d.Icon(32, 32, "")
                    });
                    //thêm marker vào map
                    markerTitelPoint.setMap(mapEditShape);
                    let marker = {
                        markerPoint: markerPoint,
                        markerTitelPoint: markerTitelPoint
                    };
                    EditShape.GLOBAL.listMarkerDiem.push(marker);
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
                    EditShape.GLOBAL.listDiem.push(diem);
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
                markerPoint.setMap(mapEditShape);
                let countPoint = (j + 1).toString();
                let markerTitelPoint = new map4d.Marker({
                    position: { lat: lat, lng: lng },
                    anchor: [0.5, 1],
                    visible: true,
                    label: new map4d.MarkerLabel({ text: countPoint, color: "ff0000", fontSize: 13 }),
                    icon: new map4d.Icon(32, 32, "")
                });
                //thêm marker vào map
                markerTitelPoint.setMap(mapEditShape);
                let marker = {
                    markerPoint: markerPoint,
                    markerTitelPoint: markerTitelPoint
                };
                EditShape.GLOBAL.listMarkerDiem.push(marker);
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
                EditShape.GLOBAL.listDiem.push(diem);
            }
        }
    },
    showHtmlGiaoHoi: function (giaohoi) {
        let html = "";
        let note = "";
        $(EditShape.SELECTORS.formGiaoHoi).children().remove();
        $(EditShape.SELECTORS.noteGiaoHoi).children().remove();
        $(EditShape.SELECTORS.noteGiaoHoi).show();
        switch (giaohoi) {
            case 1:
                // giao hoi cách đường thẳng
                html = `<div class="col-xs-12 col-sm-10">
                            <input type="text" class="giao-hoi" value="giaohoicachduongthang" style="display:none" />
                            <div class="form-group row">
                                <div class="col-xs-12 col-sm-6">
                                    <label for="sel_GHDoc1" class="col-sm-4 control-label no-padding-right">Đỉnh A</label>
                                    <select class="col-sm-8 sel_GHCDTDinhA"></select>
                                </div>
                                <div class="col-xs-12 col-sm-6">
                                    <label for="sel_GHDoc2" class="col-sm-4 control-label no-padding-right">Đỉnh B</label>
                                    <select class="col-sm-8 sel_GHCDTDinhB"></select>
                                </div>
                            </div>
                            <div class="form-group row">
                                <div class="col-xs-12 col-sm-6">
                                    <label for="sel_GHDoc1" class="col-sm-4 control-label no-padding-right">Đỉnh C</label>
                                    <select class="col-sm-8 sel_GHCDTDinhC"></select>
                                </div>
                                <div class="col-xs-12 col-sm-6">
                                    <label for="sel_GHDoc2" class="col-sm-4 control-label no-padding-right">Đỉnh D</label>
                                    <select class="col-sm-8 sel_GHCDTDinhD"></select>
                                </div>
                            </div>
                            <div class="form-group row">
                                <div class="col-xs-12 col-sm-6">
                                    <label for="form-field-9" class="col-sm-4 control-label no-padding-right">Cách AB</label>
                                    <input type="text" class="col-sm-8 input-mask-distance inp_CachAB" placeholder="Khoảng cách (m)">
                                </div>
                                <div class="col-xs-12 col-sm-6">
                                    <label for="form-field-9" class="col-sm-4 control-label no-padding-right">Cách CD</label>
                                    <input type="text" class="col-sm-8 input-mask-distance inp_CachCD" placeholder="Khoảng cách (m)">
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
                $(EditShape.SELECTORS.formGiaoHoi).append(html);
                $(EditShape.SELECTORS.noteGiaoHoi).append(note);
                $(EditShape.SELECTORS.inputCachAB).inputmask('9{1,5}.9{1,5}');
                $(EditShape.SELECTORS.inputCachCD).inputmask('9{1,5}.9{1,5}');
                $(EditShape.SELECTORS.titleGiaoHoi).text("Giao hội cách đường thẳng")
                break;
            case 2:
                // giao hội thuận
                html = `<div class="col-xs-12 col-sm-8"><div class="form-group row">
                            <input type="text" class="giao-hoi" value="giaohoithuan" style="display:none" />
                            <div class="col-xs-12 col-sm-6">
                                <label for="sel_GHDoc1" class="col-sm-4 control-label no-padding-right">Đỉnh A</label>
                                <select class="col-sm-8 sel_GHCDTDinhA"></select>
                            </div>
                            <div class="col-xs-12 col-sm-6">
                                <label for="sel_GHDoc2" class="col-sm-4 control-label no-padding-right">Đỉnh B</label>
                                <select class="col-sm-8 sel_GHCDTDinhB"></select>
                            </div>
                        </div>
                        <div class="form-group row">
                            <div class="col-xs-12 col-sm-6">
                                <label for="form-field-9" class="col-sm-4 control-label no-padding-right">Cạnh A-C</label>
                                <input type="text" class="col-sm-8 input-mask-distance inp_CanhAC" placeholder="Độ dài cạnh (m)">
                            </div>

                            <div class="col-xs-12 col-sm-6">
                                <label for="form-field-9" class="col-sm-4 control-label no-padding-right">Cạnh B-C</label>
                                <input type="text" class="col-sm-8 input-mask-distance inp_CanhBC" placeholder="Độ dài cạnh (m)">
                            </div>
                        </div>
                        <div class="form-group row">
                            <div class="col-xs-12 col-sm-6">
                                <label for="form-field-select-1" class="col-sm-4 control-label no-padding-right">Góc CAB</label>
                                <input class="col-sm-8 input-mask-angle inp_GocCAB" type="text"  disabled="">
                            </div>
                            <div class="col-xs-12 col-sm-6">
                                <label for="form-field-select-1" class="col-sm-4 control-label no-padding-right">Góc CBA</label>
                                <input class="col-sm-8 input-mask-angle inp_GocCBA" type="text"  disabled="">
                            </div>
                        </div></div>
                        <div class="col-xs-12 col-sm-2">
                            <div class="phuong-thuc-giao-hoi-thuan">
                                <label class="control-label bolder blue">Giao hội theo</label>

                                <div class="radio">
                                    <label>
                                        <input name="loaiGiaoHoiThuanE" type="radio" class="ace" value="edge" checked>
                                        <span class="lbl"> Cạnh</span>
                                    </label>
                                </div>

                                <div class="radio">
                                    <label>
                                        <input name="loaiGiaoHoiThuanE" type="radio" class="ace" value="angle">
                                        <span class="lbl"> Góc</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="col-xs-12 col-sm-2">
                            <div class="chon-diem">
                            </div>
                        </div>`;
                note = `<img class="media-object"  alt="100%x200" src="/images/GiaoHoi/ghthuan.png" data-holder-rendered="true" style="width: 70%; display: block;">
                            <div class="caption">
                                <p>Từ hai đỉnh đã biết tọa độ cộng thêm hai số đo khác của tam giác giao hội, ta có thể tính được tọa độ điểm giao hội. Bài toán giao hội thuận luôn thu được hai kết quả: đỉnh C ở bên trái hay C' ở bên phải so với hướng cạnh gốc AB.</p>
                            </div>`;

                $(EditShape.SELECTORS.formGiaoHoi).append(html);
                $(EditShape.SELECTORS.noteGiaoHoi).append(note);
                $(EditShape.SELECTORS.inputCachAC).inputmask('9{1,5}.9{1,5}');
                $(EditShape.SELECTORS.inputCachBC).inputmask('9{1,5}.9{1,5}');
                $(EditShape.SELECTORS.inputGocCAB).inputmask('9{1,3}º9{1,2}\'9{1,2}.9{1,2}"');
                $(EditShape.SELECTORS.inputGocCBA).inputmask('9{1,3}º9{1,2}\'9{1,2}.9{1,2}"');
                $(EditShape.SELECTORS.titleGiaoHoi).text("Giao hội thuận")
                break;
            case 3:
                // giao hội nghịch
                html = `<div class="col-xs-12 col-sm-10"><div class="form-group row">
                            <input type="text" class="giao-hoi" value="giaohoinghich" style="display:none" />
                            <div class="col-xs-12 col-sm-6">
                                <label for="sel_GHDoc1" class="col-sm-4 control-label no-padding-right">Đỉnh A</label>
                                <select class="col-sm-8 sel_GHCDTDinhA"></select>
                            </div>
                            <div class="col-xs-12 col-sm-6">
                                <label for="sel_GHDoc2" class="col-sm-4 control-label no-padding-right">Đỉnh B</label>
                                <select class="col-sm-8 sel_GHCDTDinhB"></select>
                            </div>
                        </div>
                        <div class="form-group row">
                            <div class="col-xs-12 col-sm-6">
                                <label for="sel_GHDoc1" class="col-sm-4 control-label no-padding-right">Đỉnh C</label>
                                <select class="col-sm-8 sel_GHCDTDinhC"></select>
                            </div>
                        </div>
                        <div class="form-group row">
                            <div class="col-xs-12 col-sm-6">
                                <label for="form-field-select-1" class="col-sm-4 control-label no-padding-right">Góc APB</label>
                                <input class="col-sm-8 input-mask-angle inp_GocAPB" type="text">
                            </div>
                            <div class="col-xs-12 col-sm-6">
                                <label for="form-field-select-1" class="col-sm-4 control-label no-padding-right">Góc APC</label>
                                <input class="col-sm-8 input-mask-angle inp_GocAPC" type="text">
                            </div>
                        </div></div>
                        <div class="col-xs-12 col-sm-2">
                            <div class="chon-diem">
                            </div>
                        </div>`;
                note = `<img class="media-object"  alt="100%x200" src="/images/GiaoHoi/GiaoHoiNghich_3DiemGoc.png" data-holder-rendered="true" style="width: 60%; display: block;">
                                <div class="caption">
                                    <p>Từ ba đỉnh đã biết tọa độ cộng thêm hai số đo góc từ điểm giao hội P ngắm về ABC, ta xác định được tọa độ điểm giao hội P.</p>
                                </div>`

                $(EditShape.SELECTORS.formGiaoHoi).append(html);
                $(EditShape.SELECTORS.noteGiaoHoi).append(note);
                $(EditShape.SELECTORS.inputGocAPB).inputmask('9{1,3}º9{1,2}\'9{1,2}.9{1,2}"');
                $(EditShape.SELECTORS.inputGocAPC).inputmask('9{1,3}º9{1,2}\'9{1,2}.9{1,2}"');
                $(EditShape.SELECTORS.titleGiaoHoi).text("Giao hội nghịch")
                break;
            case 4:
                // giao hội hướng
                html = `<div class="col-xs-12 col-sm-10">
                            <input type="text" class="giao-hoi" value="giaohoihuong" style="display:none" />
                            <div class="form-group row">
                                <div class="col-xs-12 col-sm-6">
                                    <label for="sel_GHDoc1" class="col-sm-4 control-label no-padding-right">Đỉnh A</label>
                                    <select class="col-sm-8 sel_GHCDTDinhA" ></select>
                                </div>
                                <div class="col-xs-12 col-sm-6">
                                    <label for="sel_GHDoc2" class="col-sm-4 control-label no-padding-right">Đỉnh B</label>
                                    <select class="col-sm-8 sel_GHCDTDinhB" ></select>
                                </div>
                            </div>
                            <div class="form-group row">
                                <div class="col-xs-12 col-sm-6">
                                    <label for="sel_GHDoc1" class="col-sm-4 control-label no-padding-right">Đỉnh C</label>
                                    <select class="col-sm-8 sel_GHCDTDinhC" ></select>
                                </div>
                                <div class="col-xs-12 col-sm-6">
                                    <label for="sel_GHDoc2" class="col-sm-4 control-label no-padding-right">Đỉnh D</label>
                                    <select class="col-sm-8 sel_GHCDTDinhD"></select>
                                </div>
                            </div></div>`;
                note = `<img class="media-object" alt="100%x200" src="/images/GiaoHoi/ghhuong.png" data-holder-rendered="true" style="width: 100%; display: block;">
                            <div class="caption">
                                <p>Điểm kết quả là giao điểm của hai đường thẳng AB và CD.</p>
                            </div>`;

                $(EditShape.SELECTORS.formGiaoHoi).append(html);
                $(EditShape.SELECTORS.noteGiaoHoi).append(note);
                $(EditShape.SELECTORS.titleGiaoHoi).text("Giao hội hướng")
                break;
            case 6:
                // nhập tọa độ
                html = `<div class="col-xs-12 col-sm-10">
                            <input type="text" class="giao-hoi" value="nhaptoado" style="display:none" />
                            <div class="form-group row">
                                <div class="col-xs-12 col-sm-6">
                                    <label for="form-field-9" class="col-sm-4 control-label no-padding-right">Tọa độ X</label>
                                    <input type="text" class="col-sm-8" name="pointx" placeholder="Tọa độ X">
                                </div>

                                <div class="col-xs-12 col-sm-6">
                                    <label for="form-field-9" class="col-sm-4 control-label no-padding-right">Tọa độ Y</label>
                                    <input type="text" class="col-sm-8" name="pointy" placeholder="Tọa độ Y">
                                </div>
                            </div>
                            </div>`;
                $(EditShape.SELECTORS.formGiaoHoi).append(html);
                $(EditShape.SELECTORS.titleGiaoHoi).text("Nhập tọa độ");
                $(EditShape.SELECTORS.noteGiaoHoi).hide();
                break;
            default:
                // giao hội dọc
                html = `<div class="col-xs-12 col-sm-10">
                            <input type="text" class="giao-hoi" value="giaohoidoctheocanh" style="display:none" />
                            <div class="form-group row">
                                <div class="col-xs-12 col-sm-6">
                                    <label for="sel_GHDoc1" class="col-sm-4 control-label no-padding-right">Đỉnh A</label>
                                    <select class="col-sm-8 sel_GHCDTDinhA"></select>
                                </div>
                                <div class="col-xs-12 col-sm-6">
                                    <label for="sel_GHDoc2" class="col-sm-4 control-label no-padding-right">Đỉnh B</label>
                                    <select class="col-sm-8 sel_GHCDTDinhB"></select>
                                </div>
                            </div>
                            <div class="form-group row">
                                <div class="col-xs-12 col-sm-6">
                                    <label for="form-field-9" class="col-sm-4 control-label no-padding-right">Khoảng cách</label>
                                    <input type="text" class="col-sm-8 input-mask-distance inp_KhoangCach" placeholder="Khoảng cách (m)">
                                </div>
                            </div>
                            <div class="form-group row">
                                <div class="col-xs-12 col-sm-4">
                                    <div class="control-group">
                                        <div class="radio">
                                            <label>
                                                <input name="rad_tudiemE" type="radio" class="ace" value="A" checked>
                                                <span class="lbl"> Từ điểm A</span>
                                            </label>
                                        </div>

                                        <div class="radio">
                                            <label>
                                                <input name="rad_tudiemE" type="radio" class="ace" value="B">
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
                $(EditShape.SELECTORS.formGiaoHoi).append(html);
                $(EditShape.SELECTORS.noteGiaoHoi).append(note);
                $(EditShape.SELECTORS.inputKhoangCach).inputmask('9{1,5}.9{1,5}');
                $(EditShape.SELECTORS.titleGiaoHoi).text("Giao hội dọc theo cạnh");
                //$(EditShape.SELECTORS.classTachDiemA).trigger("click");
        }
    },
    removeMaker: function () {
        $.each(EditShape.GLOBAL.listMarkerDiem, function (i, obj) {
            obj.markerPoint.setMap(null);
            obj.markerTitelPoint.setMap(null);
        });
        EditShape.GLOBAL.listMarkerDiem = [];
    },
    setEventChangeAllDiem: function (check) {
        let listSelectPoint = [];
        let html = EditShape.getHtmlSelectDiem(listSelectPoint, true);
        $(EditShape.SELECTORS.selectDinhA).append(html);
        $(EditShape.SELECTORS.selectDinhA).change(function () {
            listSelectPoint = [];
            listSelectPoint.push(Number($(this).val()));
            if (check == 1 || check == 2 || check == 5) {
                let pointselect = Number($(this).val()) - 1;
                let listDiem = EditShape.GLOBAL.listDiem;
                let pointStart = pointselect == 0 ? listDiem[listDiem.length - 1].id : listDiem[pointselect - 1].id;
                let pointEnd = pointselect == (listDiem.length - 1) ? listDiem[0].id : listDiem[pointselect + 1].id;
                let listDinhB = [pointStart, pointEnd];
                EditShape.removerOptionDiem([2, 3, 4])
                html = EditShape.getHtmlSelectDiem(listDinhB, false);
                $(EditShape.SELECTORS.selectDinhB).append(html);
            } else {
                EditShape.removerOptionDiem([2, 3, 4])
                html = EditShape.getHtmlSelectDiem(listSelectPoint, true);
                $(EditShape.SELECTORS.selectDinhB).append(html);
            }
        });
        if (check == 1 || check == 3 || check == 4) {
            $(EditShape.SELECTORS.selectDinhB).change(function () {
                EditShape.removerOptionDiem([3, 4])
                listSelectPoint.push(Number($(this).val()));
                html = EditShape.getHtmlSelectDiem(listSelectPoint, true);
                $(EditShape.SELECTORS.selectDinhC).append(html);
            });
        }
        if (check == 1 || check == 4) {
            $(EditShape.SELECTORS.selectDinhC).change(function () {
                if (check == 1) {
                    let pointselect = Number($(this).val()) - 1;
                    let listDiem = EditShape.GLOBAL.listDiem;
                    let pointStart = pointselect == 0 ? listDiem[listDiem.length - 1].id : listDiem[pointselect - 1].id;
                    let pointEnd = pointselect == (listDiem.length - 1) ? listDiem[0].id : listDiem[pointselect + 1].id;
                    let listDinhD = [];
                    if (listSelectPoint.includes(pointStart) == false) listDinhD.push(pointStart);
                    if (listSelectPoint.includes(pointEnd) == false) listDinhD.push(pointEnd);
                    EditShape.removerOptionDiem([4])
                    html = EditShape.getHtmlSelectDiem(listDinhD, false);
                    $(EditShape.SELECTORS.selectDinhD).append(html);
                } else {
                    EditShape.removerOptionDiem([4])
                    listSelectPoint.push(Number($(this).val()));
                    html = EditShape.getHtmlSelectDiem(listSelectPoint, true);
                    $(EditShape.SELECTORS.selectDinhD).append(html);
                }

            });
        }
    },
    getHtmlSelectDiem: function (listPointSelected, check) {
        let str = '<option value="-1" selected>- Chọn điểm -</option>';
        if (EditShape.GLOBAL.listDiem != null && EditShape.GLOBAL.listDiem.length > 0) {
            let list = EditShape.GLOBAL.listDiem;

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
        }
        return str;
    },
    removerOptionDiem: function (check) {
        if (check.includes(1)) $(EditShape.SELECTORS.selectDinhA).children().remove();
        let select = $(EditShape.SELECTORS.selectDinhB);
        if (check.includes(2) && select.length > 0) {
            $(EditShape.SELECTORS.selectDinhB).children().remove();
        }
        select = $(EditShape.SELECTORS.selectDinhC);
        if (check.includes(3) && select.length > 0) {
            $(EditShape.SELECTORS.selectDinhC).children().remove();
        }
        select = $(EditShape.SELECTORS.selectDinhD);
        if (check.includes(4) && select.length > 0) {
            $(EditShape.SELECTORS.selectDinhD).children().remove();
        }
    },
    setPointChangeAllPoint: function () {
        let listSelectPoint = [];
        for (var i = 0; i < EditShape.GLOBAL.listKetQuaGhiNhan.length; i++) {
            listSelectPoint.push(Number(EditShape.GLOBAL.listKetQuaGhiNhan[i].diemChange));
        }
        let html = EditShape.getHtmlSelectDiem(listSelectPoint, true);
        $(EditShape.SELECTORS.selectChangePoint).children().remove();
        $(EditShape.SELECTORS.selectChangePoint).append(html);
    },
    getPointView: function () {
        let phuongThuc = $(EditShape.SELECTORS.checkGiaoHoi).val();
        let giaos;
        if (phuongThuc === "giaohoicachduongthang") {
            let idDiemA = parseInt($(EditShape.SELECTORS.selectDinhA).val());
            let diemA = EditShape.GLOBAL.listDiem.find(function (item) {
                return item.id === idDiemA;
            });
            let idDiemB = parseInt($(EditShape.SELECTORS.selectDinhB).val());
            let diemB = EditShape.GLOBAL.listDiem.find(function (item) {
                return item.id === idDiemB;
            });
            let idDiemC = parseInt($(EditShape.SELECTORS.selectDinhC).val());
            let diemC = EditShape.GLOBAL.listDiem.find(function (item) {
                return item.id === idDiemC;
            });
            let idDiemD = parseInt($(EditShape.SELECTORS.selectDinhD).val());
            let diemD = EditShape.GLOBAL.listDiem.find(function (item) {
                return item.id === idDiemD;
            });
            let cachAB = parseFloat($(EditShape.SELECTORS.inputCachAB).val().replace("_", "0"));
            let cachCD = parseFloat($(EditShape.SELECTORS.inputCachCD).val().replace("_", "0"));
            if (!diemA || !diemB || !diemC || !diemD || !cachAB || !cachCD) {
                buttonTachThua.global.validate.valid = false;
                buttonTachThua.global.validate.error = "Dữ liệu đầu vào chưa đủ";
            }
            if (buttonTachThua.global.validate.valid) {
                giaos = giaoHoiCachDuongThang(diemA.xy, diemB.xy, diemC.xy, diemD.xy, cachAB, cachCD);
            }
        }
        if (phuongThuc === "giaohoithuan") {
            let type = $(EditShape.SELECTORS.radioGiaoHoiThuanCheck).val();
            let idDiemA = parseInt($(EditShape.SELECTORS.selectDinhA).val());
            let diemA = EditShape.GLOBAL.listDiem.find(function (item) {
                return item.id === idDiemA;
            });
            let idDiemB = parseInt($(EditShape.SELECTORS.selectDinhB).val());
            let diemB = EditShape.GLOBAL.listDiem.find(function (item) {
                return item.id === idDiemB;
            });
            if (type === "edge") {
                let canhAC = parseFloat($(EditShape.SELECTORS.inputCachAC).val().replace("_", "0"));
                let canhBC = parseFloat($(EditShape.SELECTORS.inputCachBC).val().replace("_", "0"));
                if (!diemA || !diemB || !canhAC || !canhBC) {
                    buttonTachThua.global.validate.valid = false;
                    buttonTachThua.global.validate.error = "Dữ liệu đầu vào chưa đủ";
                }
                if (buttonTachThua.global.validate.valid) {
                    giaos = giaoHoiThuanTheoCanh(diemA.xy, canhAC, diemB.xy, canhBC);
                }
            }
            if (type === "angle") {
                let gocA = getGocRadian($(EditShape.SELECTORS.inputGocCAB).val());
                let gocB = getGocRadian($(EditShape.SELECTORS.inputGocCBA).val());
                if (!diemA || !diemB || !gocA || !gocB) {
                    validate.valid = false;
                    validate.error = "Dữ liệu đầu vào chưa đủ";
                }
                if (gocA && gocB && (gocA + gocB >= Math.PI)) {
                    buttonTachThua.global.validate.valid = false;
                    buttonTachThua.global.validate.error = "Tổng hai góc nhập vào phải nhỏ hơn 180º";
                }
                if (buttonTachThua.global.validate.valid) {
                    giaos = giaoHoiThuanTheoGoc(diemA.xy, diemB.xy, gocA, gocB);
                }
            }
        }
        if (phuongThuc === "giaohoinghich") {
            let idDiemA = parseInt($(EditShape.SELECTORS.selectDinhA).val());
            let diemA = EditShape.GLOBAL.listDiem.find(function (item) {
                return item.id === idDiemA;
            });
            let idDiemB = parseInt($(EditShape.SELECTORS.selectDinhB).val());
            let diemB = EditShape.GLOBAL.listDiem.find(function (item) {
                return item.id === idDiemB;
            });
            let idDiemC = parseInt($(EditShape.SELECTORS.selectDinhC).val());
            let diemC = EditShape.GLOBAL.listDiem.find(function (item) {
                return item.id === idDiemC;
            });
            let gocAPB = getGocRadian($(EditShape.SELECTORS.inputGocAPB).val());
            let gocAPC = getGocRadian($(EditShape.SELECTORS.inputGocAPC).val());
            if (!diemA || !diemB || !diemC || !gocAPB || !gocAPC) {
                buttonTachThua.global.validate.valid = false;
                buttonTachThua.global.validate.error = "Dữ liệu đầu vào chưa đủ";
            }
            if (gocAPB && gocAPC && (gocAPB >= Math.PI || gocAPC >= Math.PI)) {
                buttonTachThua.global.validate.valid = false;
                buttonTachThua.global.validate.error = "Góc nhập vào phải nhỏ hơn 180º";
            }
            if (buttonTachThua.global.validate.valid) {
                giaos = giaoHoiNghich(diemA.xy, diemB.xy, diemC.xy, gocAPB, gocAPC);
            }
        }
        if (phuongThuc === "giaohoihuong") {
            let idDiemA = parseInt($(EditShape.SELECTORS.selectDinhA).val());
            let diemA = EditShape.GLOBAL.listDiem.find(function (item) {
                return item.id === idDiemA;
            });
            let idDiemB = parseInt($(EditShape.SELECTORS.selectDinhB).val());
            let diemB = EditShape.GLOBAL.listDiem.find(function (item) {
                return item.id === idDiemB;
            });
            let idDiemC = parseInt($(EditShape.SELECTORS.selectDinhC).val());
            let diemC = EditShape.GLOBAL.listDiem.find(function (item) {
                return item.id === idDiemC;
            });
            let idDiemD = parseInt($(EditShape.SELECTORS.selectDinhD).val());
            let diemD = EditShape.GLOBAL.listDiem.find(function (item) {
                return item.id === idDiemD;
            });
            if (!diemA || !diemB || !diemC || !diemD) {
                buttonTachThua.global.validate.valid = false;
                buttonTachThua.global.validate.error = "Dữ liệu đầu vào chưa đủ";
            }
            if (buttonTachThua.global.validate.valid) {
                giaos = giaoHoiHuong(diemA.xy, diemB.xy, diemC.xy, diemD.xy);
            }
        }
        if (phuongThuc === "giaohoidoctheocanh") {
            let idDiemA = parseInt($(EditShape.SELECTORS.selectDinhA).val());
            let diemA = EditShape.GLOBAL.listDiem.find(function (item) {
                return item.id === idDiemA;
            });
            let idDiemB = parseInt($(EditShape.SELECTORS.selectDinhB).val());
            let diemB = EditShape.GLOBAL.listDiem.find(function (item) {
                return item.id === idDiemB;
            });
            let cach = parseFloat($(EditShape.SELECTORS.inputKhoangCach).val().replace("_", "0"));
            if (!diemA || !diemB) {
                buttonTachThua.global.validate.valid = false;
                buttonTachThua.global.validate.error = "Dữ liệu đầu vào chưa đủ";
            }
            let fromB = $(EditShape.SELECTORS.radioTuDiemCheck).val() === "B";
            if (buttonTachThua.global.validate.valid) {
                giaos = giaoHoiDocTheoCanh(diemA.xy, diemB.xy, cach, fromB);
            }
        }
        if (phuongThuc === "nhaptoado") {
            let checkx = validateText($(EditShape.SELECTORS.inputPointX).val(), "float", 2, 20);
            let checky = validateText($(EditShape.SELECTORS.inputPointY).val(), "float", 2, 20);
            if (checkx && checky) {
                let xy = {
                    x: Number($(EditShape.SELECTORS.inputPointX).val()),
                    y: Number($(EditShape.SELECTORS.inputPointY).val())
                }
                giaos = [];
                giaos.push(xy);
            } else {
                buttonTachThua.global.validate.valid = false;
                buttonTachThua.global.validate.error = "Nhập tọa độ không hợp lệ";
            }
        }
        if (buttonTachThua.global.validate.valid && !giaos) {
            buttonTachThua.global.validate.valid = false;
            buttonTachThua.global.validate.error = "Không tìm thấy điểm nào thỏa mãn, hãy kiểm tra lại dữ liệu";
        }
        if (!buttonTachThua.global.validate.valid) {
            $(EditShape.SELECTORS.formGiaoHoi).append(`
                <div class="col-xs-12 error">
                    <p class="text-danger">${buttonTachThua.global.validate.error}</p>
                </div>
            `);
        }
        if (giaos) {
            EditShape.convertVN2000ToWGS84(giaos, function (data) {
                if (data.code === "ok") {
                    if (data.result.features[0].properties.info === "vn2000") {
                        buttonTachThua.global.list2000 = data.result.features[0].geometry.coordinates;
                        buttonTachThua.global.list84 = data.result.features[1].geometry.coordinates;
                    }
                    else {
                        buttonTachThua.global.list2000 = data.result.features[1].geometry.coordinates;
                        buttonTachThua.global.list84 = data.result.features[0].geometry.coordinates;
                    }
                    for (let i = 0; i < buttonTachThua.global.list84.length; i++) {
                        let marker = new map4d.Marker({
                            position: buttonTachThua.global.list84[i],
                            anchor: [0.5, 0.5],
                            visible: true,
                            zIndex: 10,
                            labelAnchor: [0.5, -1],
                            label: new map4d.MarkerLabel({ text: "Điểm " + (i + 1), color: "ff0000", fontSize: 13 }),
                            icon: new map4d.Icon(16, 16, "/images/iconPoint_1.png"),
                        });
                        //thêm marker vào map
                        marker.setMap(EditShape.GLOBAL.mapEditShape);
                        buttonTachThua.global.listMarker.push(marker);
                    };
                    if (giaos.length === 1) {
                        $(EditShape.SELECTORS.formGiaoHoi).append(`
                            <div class="col-xs-12 notification">
                                <p class="text-primary">Tìm thấy 1 điểm duy nhất</p>
                            </div>
                        `);
                    }
                    else {
                        $(EditShape.SELECTORS.formGiaoHoi).append(`
                            <div class="col-xs-12 notification">
                                <p class="text-primary">Tìm thấy ${giaos.length} điểm thỏa mãn, vui lòng chọn điểm</p>
                            </div>
                        `);
                        let html = "";
                        for (let i = 0; i < buttonTachThua.global.list84.length; i++) {
                            html += `
                                <div class="radio">
                                    <label>
                                        <input name="rad_diem" type="radio" class="ace" value="${i}">
                                        <span class="lbl"> Điểm ${i + 1}</span>
                                    </label>
                                </div>
                            `
                        }
                        $(buttonTachThua.selector.chonDiem).html(html);
                    }
                }
            });
        }
    },
    convertVN2000ToWGS84: function (listPoint, callback) {
        $.ajax({
            url: ViewMap.GLOBAL.url + "/v2/api/land/vn2000-wgs84" + "?key=" + ViewMap.CONSTS.key,
            type: "POST",
            async: true,
            contentType: "application/json",
            data: JSON.stringify({
                code: EditShape.GLOBAL.codeMaXaThuaDat,
                geometry: {
                    type: "MultiPoint",
                    coordinates: convertListPointTo2000(listPoint)
                }
            }),
            success: function (data) {
                callback(data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                let messageErorr = AppCommon.getMessageErrorReuqest(jqXHR, errorThrown);
                console.log(messageErorr);
            }
        });
    },
    addGhiNhanDiem: function (pointChange) {
        if (buttonTachThua.global.list84.length === 0) {
            $(buttonTachThua.selector.error).remove();
            $(EditShape.SELECTORS.formGiaoHoi).append(`
                 <div class="col-xs-12 error">
                     <p class="text-danger">Không có điểm nào để ghi nhận!</p>
                 </div>
             `);
        }
        if (buttonTachThua.global.list84.length === 1) {
            let phuongThuc = $(EditShape.SELECTORS.checkGiaoHoi).val();
            let a = {
                diemChange: pointChange,
                phuongThuc: phuongThuc,
                diem84: buttonTachThua.global.list84[0],
                diem2000: buttonTachThua.global.list2000[0]
            }
            EditShape.GLOBAL.listKetQuaGhiNhan.push(a);
            buttonTachThua.reset();
            EditShape.updateListGhiNhan();
        }
        if (buttonTachThua.global.list84.length > 1) {
            let phuongThuc = $(EditShape.SELECTORS.checkGiaoHoi).val();
            let i = $(EditShape.SELECTORS.radioDiemCheck).val()
            if (i != undefined) {
                let a = {
                    diemChange: pointChange,
                    phuongThuc: phuongThuc,
                    diem84: buttonTachThua.global.list84[i],
                    diem2000: buttonTachThua.global.list2000[i]
                }
                EditShape.GLOBAL.listKetQuaGhiNhan.push(a);
                buttonTachThua.reset();
                EditShape.updateListGhiNhan()
            }
            else {
                $(buttonTachThua.selector.error).remove();
                $(EditShape.SELECTORS.formGiaoHoi).append(`
                    <div class="col-xs-12 error">
                        <p class="text-danger">Hãy chọn điểm trước khi ghi nhận!</p>
                    </div>
                `);
            }
        }
    },
    updateListGhiNhan: function () {
        $(buttonTachThua.selector.listGhiNhan).children().remove();
        let html = "";
        removeMarkerGhinhans();
        for (let i = 0; i < EditShape.GLOBAL.listKetQuaGhiNhan.length; i++) {
            let phuongThuc = "";
            switch (EditShape.GLOBAL.listKetQuaGhiNhan[i].phuongThuc) {
                case "giaohoicachduongthang":
                    phuongThuc = "Giao hội cách đường thẳng"
                    break
                case "giaohoithuan":
                    phuongThuc = "Giao hội thuận"
                    break
                case "giaohoinghich":
                    phuongThuc = "Giao hội nghịch"
                    break
                case "giaohoihuong":
                    phuongThuc = "Giao hội hướng"
                    break
                case "giaohoidoctheocanh":
                    phuongThuc = "Giao hội dọc theo cạnh"
                    break
                case "nhaptoado":
                    phuongThuc = "Nhập tọa độ"
                    break
                default:
            }
            html += `
            <tr>
                <th scope="row" data-id="${i}">${i + 1}</th>
                <td>Thay điểm ${EditShape.GLOBAL.listKetQuaGhiNhan[i].diemChange}</td>
                <td><i class="fa fa-trash-o clearPoint" aria-hidden="true"></i></td>
            </tr>
        `;
            let marker = new map4d.Marker({
                position: EditShape.GLOBAL.listKetQuaGhiNhan[i].diem84,
                anchor: [0.5, 0.5],
                visible: true,
                labelAnchor: [0.5, -1],
                label: new map4d.MarkerLabel({ text: "Thay điểm " + EditShape.GLOBAL.listKetQuaGhiNhan[i].diemChange, color: "ff0000", fontSize: 13 }),
                icon: new map4d.Icon(10, 10, "/images/iconPoint.png"),
            });
            //thêm marker vào map
            marker.setMap(EditShape.GLOBAL.mapEditShape);
            buttonTachThua.global.listMarkerGhiNhan.push(marker);
        }
        $(buttonTachThua.selector.listGhiNhan).html(html);
        EditShape.removeDrawPolylineDiem();
        EditShape.setEventClearPoint();
    },
    removeDrawPolylineDiem: function () {
        if (EditShape.GLOBAL.polylineGhiNhan !== null) {
            EditShape.GLOBAL.polylineGhiNhan.setMap(null);
            EditShape.GLOBAL.polylineGhiNhan = null;
        }
    },
    setEventClearPoint: function () {
        $(EditShape.SELECTORS.clearPoint).on("click", function () {
            var id = $(this).parents("tr").find("th").attr("data-id");
            EditShape.GLOBAL.listKetQuaGhiNhan.splice(Number(id), 1);
            EditShape.updateListGhiNhan();
            EditShape.setPointChangeAllPoint();
            EditShape.GLOBAL.polygonEidtChange = null;
            //remove highligt
            let check = $(this).parent("tr").find(".active-select")
            if (check) {
                if (EditShape.GLOBAL.markerHighlight != null) {
                    EditShape.GLOBAL.markerHighlight.setMap(null);
                    EditShape.GLOBAL.markerHighlight = null;
                }
            }
        });
        $(EditShape.SELECTORS.tableTr).on("click", function () {
            let check = $(this).parent().find(".active-select").removeClass("active-select");
            $(this).addClass("active-select");
            let id = $(this).find("th").attr("data-id");
            let position = EditShape.GLOBAL.listKetQuaGhiNhan[Number(id)].diem84;
            if (EditShape.GLOBAL.markerHighlight != null) {
                EditShape.GLOBAL.markerHighlight.setMap(null);
                EditShape.GLOBAL.markerHighlight = null;
            }
            //draw marker
            let marker = new map4d.Marker({
                position: position,
                anchor: [0.5, 0.5],
                zIndex:10,
                //visible: true,
                //labelAnchor: [0.5, -1],
                //label: new map4d.MarkerLabel({ text: "Giao điểm " + (i + 1), color: "ff0000", fontSize: 13 }),
                icon: new map4d.Icon(12, 12, "/images/iconPoint_3.png"),
            });
            //thêm marker vào map
            marker.setMap(EditShape.GLOBAL.mapEditShape);
            EditShape.GLOBAL.markerHighlight = marker;
        });
    },
    drawNhapDiem: function () {
        let xy = {
            x: Number($(EditShape.SELECTORS.inputPointX).val()),
            y: Number($(EditShape.SELECTORS.inputPointY).val())
        }
        let listpoint = [];
        listpoint.push(xy);
        EditShape.convertVN2000ToWGS84(listpoint, function (data) {
            if (data.code === "ok") {
                if (data.result.features[0].properties.info === "vn2000") {
                    buttonTachThua.global.list2000 = data.result.features[0].geometry.coordinates;
                    buttonTachThua.global.list84 = data.result.features[1].geometry.coordinates;
                }
                else {
                    buttonTachThua.global.list2000 = data.result.features[1].geometry.coordinates;
                    buttonTachThua.global.list84 = data.result.features[0].geometry.coordinates;
                }
                for (let i = 0; i < buttonTachThua.global.list84.length; i++) {
                    let marker = new map4d.Marker({
                        position: buttonTachThua.global.list84[i],
                        anchor: [0.5, 0.5],
                        visible: true,
                        labelAnchor: [0.5, -1],
                        label: new map4d.MarkerLabel({ text: "Điểm " + (i + 1), color: "ff0000", fontSize: 13 }),
                        icon: new map4d.Icon(10, 10, "/images/iconPoint.png"),
                    });
                    //thêm marker vào map
                    marker.setMap(EditShape.GLOBAL.mapEditShape);
                    buttonTachThua.global.listMarker.push(marker);
                };
            }
        });
    },
    ShowHideAll: function (check) {
        if (check) {
            EditShape.GLOBAL.polygon.setMap(null);
            $.each(EditShape.GLOBAL.listMarkerDiem, function (i, obj) {
                obj.markerPoint.setMap(null);
                obj.markerTitelPoint.setMap(null);
            });
        }
        else {
            EditShape.GLOBAL.polygon.setMap(mapEditShape);
            $.each(EditShape.GLOBAL.listMarkerDiem, function (i, obj) {
                obj.markerPoint.setMap(mapEditShape);
                obj.markerTitelPoint.setMap(mapEditShape);
            });
            $.each(EditShape.GLOBAL.listDrawPolygon, function (i, obj) {
                obj.setMap(null);
            });
            EditShape.GLOBAL.listDrawPolygon = [];
        }
    },
    drawingPolygonViewResultEditShape: function (paths) {
        $.ajax({
            url: ViewMap.GLOBAL.url + "/v2/api/land/vn2000-wgs84" + "?key=" + ViewMap.CONSTS.key,
            type: "POST",
            async: true,
            contentType: "application/json",
            data: JSON.stringify({
                code: EditShape.GLOBAL.codeMaXaThuaDat,
                geometry: {
                    type: "Polygon",
                    coordinates: paths
                }
            }),
            success: function (data) {
                if (data.code==="ok") {
                    $.each(EditShape.GLOBAL.listDrawPolygon, function (i, obj) {
                        obj.setMap(null);
                    });
                    let feature = data.result.features[0].properties.info === "wgs84" ? data.result.features[0] : data.result.features[1];
                    EditShape.GLOBAL.polygonEidtChange = data.result.features[0].properties.info === "vn2000" ? data.result.features[0] : data.result.features[1];
                    let paths = EditShape.convertCoordinate(feature);
                    EditShape.ShowHideAll(true);
                    let polygon = new map4d.Polygon({
                        paths: paths,
                        fillColor: "#0000ff",
                        fillOpacity: 0,
                        strokeColor: "#ea5252",
                        strokeOpacity: 1.0,
                        strokeWidth: 1,
                        userInteractionEnabled: false,
                    });
                    polygon.setMap(mapEditShape);
                    EditShape.GLOBAL.listDrawPolygon.push(polygon);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                let messageErorr = AppCommon.getMessageErrorReuqest(jqXHR, errorThrown);
                console.log(messageErorr);
            }
        });

    },
    UpdateEidtShape: function (object) {
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
                        $(EditShape.SELECTORS.modalEditShape).modal('hide');
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
    SyncService: function (data) {
        let listShape = [];
        let shape = {
            type: "Feature",
            properties: {
                index: "",
                shapeSTArea: data.dienTich.toString(),
                diaChi: data.diaChi,
                kyHieuMucDichSuDung: data.kyHieuMucDichSuDung,
                coQuanThuLy: data.coQuanThuLy,
                shapeSTLength: ((data.shapeSTLength != null)?data.shapeSTLength.toString():""),
                shapeLength: ((data.shapeSTLength != null)?data.shapeSTLength.toString():""),
                soThuTuThua: ((data.soThuTuThua != null)?data.soThuTuThua.toString():"0"),
                id: data.id.toString(),
                nguoiNhanHS: ((data.nguoiNhanHS != null) ? data.nguoiNhanHS.toString() : ""),
                maXa: data.maXa.toString(),
                tags: "",
                soBienNhan: "",
                soHieuGCN: "",
                daCapGCN: "0",
                dienTichPhapLy: data.dienTichPhapLy,
                objectId: data.objectId,
                soVaoSo: "",
                dienTich: data.dienTich,
                namSinhC1: "",
                tenChu: data.tenChu,
                loaiHS: "",
                soHieuToBanDo: data.soHieuToBanDo.toString(),
                soHieuToBanDoCu: ((data.soHieuToBanDoCu != null)?data.soHieuToBanDoCu.toString():"0"),
                tenChu2: "",
                maDoiTuong: data.maDoiTuong,
                maLienKet: "",
                thoiDiemBatDau: "",
                thoiDiemKetThuc: "",
                soThuTuThuaCu: ((data.soThuTuThuaCu != null) ? data.soThuTuThuaCu.toString() : "0"),
                ngayVaoSo: "",
                uuid: data.uuid,
                kyHieuDoiTuong: "",
                shapeArea: data.shapeArea,
            },
            geometry: {
                type: "MultiPolygon",
                coordinates: [EditShape.convertCoordinate(data)]
            }
        }
        listShape.push(shape);
        updateGeometries(JSON.stringify(listShape));
    },
    removeHideFooter: function () {
        let check = $(EditShape.SELECTORS.formPointMap).hasClass("footerHide");
        if (check) {
            $(EditShape.SELECTORS.formPointMap).removeClass("footerHide");
        }
    }
}