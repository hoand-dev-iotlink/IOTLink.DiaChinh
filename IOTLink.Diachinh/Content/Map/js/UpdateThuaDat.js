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
        MucDichSuDung:".model-update-thua-dat .MucDichSuDung",
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
                var result = ViewMap.GLOBAL.commonData.features.find(x => x.properties.info != undefined && x.properties.info == "vn2000");
                //if (result != undefined && result != null) {
                //    UpdateThuaDat.GLOBAL.KHSelected = result;
                //} else {
                    UpdateThuaDat.getFindInfo(ViewMap.GLOBAL.commonData.features[0]);
                //}

                if (UpdateThuaDat.GLOBAL.KHSelected != null) {
                    //$(UpdateThuaDat.SELECTORS.KHList).val(UpdateThuaDat.GLOBAL.KHSelected.properties.KyHieuMucDichSuDung).change();
                    //if ($(UpdateThuaDat.SELECTORS.KHList).val() == "" || $(UpdateThuaDat.SELECTORS.KHList).val() == null) {
                    //    $(UpdateThuaDat.SELECTORS.KHList).attr("disabled", "disabled");
                    //    $(UpdateThuaDat.SELECTORS.KHList).append(`<option value="${UpdateThuaDat.GLOBAL.KHSelected.properties.KyHieuMucDichSuDung}"> 
                    //                   ${UpdateThuaDat.GLOBAL.KHSelected.properties.KyHieuMucDichSuDung} 
                    //              </option>`);
                    //    $(UpdateThuaDat.SELECTORS.KHList).val(UpdateThuaDat.GLOBAL.KHSelected.properties.KyHieuMucDichSuDung).change();
                    //}
                    $(UpdateThuaDat.SELECTORS.MucDichSuDung).text(UpdateThuaDat.convertMucDichSuDung(UpdateThuaDat.GLOBAL.KHSelected.properties.KyHieuMucDichSuDung));
                    $(UpdateThuaDat.SELECTORS.SoToUpdate).val(UpdateThuaDat.GLOBAL.KHSelected.properties.SoHieuToBanDo);
                    $(UpdateThuaDat.SELECTORS.SoThuaUpdate).val(UpdateThuaDat.GLOBAL.KHSelected.properties.SoThuTuThua);
                    $(UpdateThuaDat.SELECTORS.SoToUpdateOld).text(UpdateThuaDat.GLOBAL.KHSelected.properties.SoHieuToBanDoCu);
                    if ($(UpdateThuaDat.SELECTORS.SoToUpdateOld).text() == "") {
                        $(UpdateThuaDat.SELECTORS.SoToUpdateOld).text("0");
                    }
                    $(UpdateThuaDat.SELECTORS.SoThuaUpdateOld).text(UpdateThuaDat.GLOBAL.KHSelected.properties.SoThuTuThuaCu);
                    if ($(UpdateThuaDat.SELECTORS.SoThuaUpdateOld).text() == "") {
                        $(UpdateThuaDat.SELECTORS.SoThuaUpdateOld).text("0");
                    }
                    $(UpdateThuaDat.SELECTORS.DienTichUpdate).text(UpdateThuaDat.GLOBAL.KHSelected.properties.DienTich);
                    $(UpdateThuaDat.SELECTORS.DienTichPhapLyUpdate).text(UpdateThuaDat.GLOBAL.KHSelected.properties.DienTichPhapLy);
                    $(UpdateThuaDat.SELECTORS.TenChuUpdate).text(UpdateThuaDat.GLOBAL.KHSelected.properties.TenChu);
                    $(UpdateThuaDat.SELECTORS.DiaChiUpdate).text(UpdateThuaDat.GLOBAL.KHSelected.properties.DiaChi);
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
            var tobandoint = parseInt(tobando);
            var thuaint = parseInt(thua);
            if (tobando === "" || thua === "" || tobando <= 0 || thua <= 0 || (tobando != tobandoint) || (thua != thuaint) || isNaN(tobandoint) || isNaN(thuaint)) {
                swal({
                    title: "Thông báo",
                    text: "Dữ liệu nhập không đúng",
                    icon: "warning",
                    button: "Đóng",
                }).then((value) => {
                });
                return;
            } else {
                if (!UpdateThuaDat.checkSoToThua(tobando, thua, UpdateThuaDat.GLOBAL.KHSelected.properties.MaXa)) {
                    swal({
                        title: "Thông báo",
                        text: "Số tờ và số thửa đã tồn tại",
                        icon: "warning",
                        button: "Đóng",
                    }).then((value) => {
                    });
                    return;
                }
            }

            //var dientichnumber = parseFloat(dientich);
            //var dientichphaplynumber = parseFloat(dientichphaply);
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
                soHieuToBanDoCu: UpdateThuaDat.GLOBAL.KHSelected.properties.SoHieuToBanDoCu,
                soThuTuThuaCu: UpdateThuaDat.GLOBAL.KHSelected.properties.SoThuTuThuaCu,
                dienTich: UpdateThuaDat.GLOBAL.KHSelected.properties.DienTich,
                dienTichPhapLy: UpdateThuaDat.GLOBAL.KHSelected.properties.DienTichPhapLy,
                kyHieuMucDichSuDung: UpdateThuaDat.GLOBAL.KHSelected.properties.KyHieuMucDichSuDung,
                kyHieuDoiTuong: UpdateThuaDat.GLOBAL.KHSelected.properties.KyHieuDoiTuong,
                tenChu: UpdateThuaDat.GLOBAL.KHSelected.properties.TenChu,
                diaChi: UpdateThuaDat.GLOBAL.KHSelected.properties.DiaChi,
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
            UpdateThuaDat.SyncService(object);
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

    },
    getFindInfo: function (result) {
        ViewMap.showLoading(true);
        $.ajax({
            type: "GET",
            url: ViewMap.GLOBAL.url + "/v2/api/land/find-info",
            data: {
                code: result.properties.MaXa,
                soTo: result.properties.SoHieuToBanDo,
                soThua: result.properties.SoThuTuThua,
                key: ViewMap.CONSTS.key
            },
            async: false,
            success: function (data) {
                console.log(data);
                if (data.code == "ok" && data.result != null && data.result.features.length > 0) {
                    //console.log(data.result.features);
                    UpdateThuaDat.GLOBAL.KHSelected = data.result.features.find(x => x.properties.info === "vn2000");
                    if (UpdateThuaDat.GLOBAL.KHSelected != null && UpdateThuaDat.GLOBAL.KHSelected != undefined) {
                        ViewMap.GLOBAL.commonData = data.result;
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
                    $(ViewMap.SELECTORS.TenChu).text((propertie.TenChu != null ? propertie.TenChu.charAt(0) + propertie.TenChu.slice(1) : ''));
                    $(ViewMap.SELECTORS.DiaChi).text((propertie.DiaChi != null ? propertie.DiaChi.charAt(0) + propertie.DiaChi.slice(1) : ''));
                    $(ViewMap.SELECTORS.SoThuaBD).text((propertie.SoThuTuThua != null && propertie.SoThuTuThua != 0 ? propertie.SoThuTuThua : ''));
                    $(ViewMap.SELECTORS.SoToBD).text((propertie.SoHieuToBanDo != null && propertie.SoHieuToBanDo != 0 ? propertie.SoHieuToBanDo : ''));
                    $(ViewMap.SELECTORS.SoThuaOld).text((propertie.SoThuTuThuaCu != null && propertie.SoThuTuThuaCu != 0) ? propertie.SoThuTuThuaCu : '');
                    $(ViewMap.SELECTORS.SoToOld).text((propertie.SoHieuToBanDoCu != null && propertie.SoHieuToBanDoCu != 0) ? propertie.SoHieuToBanDoCu : '');
                    $(ViewMap.SELECTORS.DientichBD).text((propertie.DienTich != null && propertie.DienTich != 0) ? propertie.DienTich : '');
                    $(ViewMap.SELECTORS.DientichPL).text((propertie.DienTichPhapLy != null && propertie.DienTichPhapLy != 0) ? propertie.DienTichPhapLy : '');
                    $(ViewMap.SELECTORS.KHDTC).text(propertie.KyHieuDoiTuong);
                    $(ViewMap.SELECTORS.MucDichSuDung).text(propertie.KyHieuMucDichSuDung);
                    $(ViewMap.SELECTORS.NameMucDichSuDung).text(propertie.TenMucDichSuDung);
                    ViewMap.showHideViewProperty(true);
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
    checkSoToThua: function (soto, sothua, maXa) {
        let check = false;
        $.ajax({
            type: "GET",
            url: ViewMap.GLOBAL.url + "/v2/api/land/find",
            data: {
                code: maXa,
                soTo: soto,
                soThua: sothua,
                key: ViewMap.CONSTS.key
            },
            dataType: 'json',
            async: false,
            contentType: 'application/json-patch+json',
            success: function (data) {
                if (data.code === "ok") {
                    if (typeof data.result.features !== undefined && data.result.features.length > 0) {
                        check = false;
                    } else if (data.result.features.length == 0){
                        check = true;
                    }
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                let messageErorr = AppCommon.getMessageErrorReuqest(jqXHR, errorThrown);
                console.log(messageErorr);
                ViewMap.showLoading(false);
            }
        });
        return check;
    },
    SyncService: function (data) {
        //let from = data.from;
        //let to = data.to;
        //var listShape = [];
        ////for (var i = 0; i < to.length; i++) {
        //    let obj = to[i];
            let shape = {
                type: "Feature",
                properties: {
                    index: "",
                    shapeSTArea: data.dienTich.toString(),
                    diaChi: data.diaChi,
                    kyHieuMucDichSuDung: data.kyHieuMucDichSuDung,
                    coQuanThuLy: data.coQuanThuLy,
                    shapeSTLength: data.shapeSTLength.toString(),
                    shapeLength: data.shapeSTLength.toString(),
                    soThuTuThua: data.soThuTuThua.toString(),
                    id: data.id.toString(),
                    nguoiNhanHS: data.nguoiNhanHS.toString(),
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
                    soHieuToBanDoCu: data.soHieuToBanDoCu.toString(),
                    tenChu2: "",
                    maDoiTuong: data.maDoiTuong,
                    maLienKet: "",
                    thoiDiemBatDau: "",
                    thoiDiemKetThuc: "",
                    soThuTuThuaCu: data.soThuTuThuaCu.toString(),
                    ngayVaoSo: "",
                    uuid: data.uuid,
                    kyHieuDoiTuong: "",
                    shapeArea: data.shapeArea,
                },
                geometry: {
                    type: "MultiPolygon",
                    coordinates: [TachThua.convertCoordinate(data)]
                }
            }
            listShape.push(shape);
        //}
        //deleteGeometry(from.soHieuToBanDo, from.soThuTuThua, from.maXa);
        updateGeometries(JSON.stringify(listShape));
    },
};