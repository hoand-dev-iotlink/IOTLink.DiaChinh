var InAn = {
    GLOBAL: {

    },
    CONSTS: {

    },
    SELECTORS: {
        btnInAn: '.btn-in-an',
        btnDownloadDoc: '.btn-tai-file-doc',
        btnDownloadPDF: '.btn-tai-file-pdf',
        btnInTrichLuc: '.btn-trich-luc',
        btnDownloadTrichLucDoc: '.btn-trich-luc-doc',
        btnDownloadTrichLucPDF: '.btn-trich-luc-pdf',
        btnInChungNhan: '.btn-in-chung-nhan',
        btnDownloadChungNhan: '.btn-tai-chung-nhan',
        btnTrichLucSelect: '.btn-select-trich-luc',
        btnHSKTSelect: '.btn-select-hskt'
    },
    init: function () {
        InAn.setEvent();
    },
    setEvent: function () {
        $(InAn.SELECTORS.btnInAn).on("click", function () {
            var result = ViewMap.GLOBAL.commonData.features.find(x => x.properties.info != undefined && x.properties.info == "vn2000");
            if (result != null && result != undefined) {
                //console.log(result);
                var bangToaDo = InAn.CalculateBangToaDo(result.geometry);
                if (bangToaDo.length > 0 && bangToaDo != []) {
                    InAn.InAnEvent(result.properties.MaXa, result.properties.SoHieuToBanDo, result.properties.SoThuTuThua, result.properties.DiaChi, result.properties.KyHieuMucDichSuDung, result.properties.TenChu, bangToaDo);
                    return;
                }
            }
            swal({
                title: "Thông báo",
                text: "Không tìm thấy dữ liệu VN2000 của thửa đất đang chọn",
                icon: "error",
                button: "Đóng",
            }).then((value) => {
            });
        });

        $(InAn.SELECTORS.btnDownloadDoc).on("click", function () {
            var result = ViewMap.GLOBAL.commonData.features.find(x => x.properties.info != undefined && x.properties.info == "vn2000");
            if (result != null && result != undefined) {
                //console.log(result);
                var bangToaDo = InAn.CalculateBangToaDo(result.geometry);
                if (bangToaDo.length > 0 && bangToaDo != []) {
                    InAn.DownloadDocEvent(result.properties.MaXa, result.properties.SoHieuToBanDo, result.properties.SoThuTuThua, result.properties.DiaChi, result.properties.KyHieuMucDichSuDung, result.properties.TenChu, bangToaDo);
                    return;
                }
            }
            swal({
                title: "Thông báo",
                text: "Không tìm thấy dữ liệu VN2000 của thửa đất đang chọn",
                icon: "error",
                button: "Đóng",
            }).then((value) => {
            });
        });

        $(InAn.SELECTORS.btnDownloadPDF).on("click", function () {
            var result = ViewMap.GLOBAL.commonData.features.find(x => x.properties.info != undefined && x.properties.info == "vn2000");
            if (result != null && result != undefined) {
                //console.log(result);
                var bangToaDo = InAn.CalculateBangToaDo(result.geometry);
                if (bangToaDo.length > 0 && bangToaDo != []) {
                    InAn.DownloadPdfEvent(result.properties.MaXa, result.properties.SoHieuToBanDo, result.properties.SoThuTuThua, result.properties.DiaChi, result.properties.KyHieuMucDichSuDung, result.properties.TenChu, bangToaDo);
                    return;
                }
            }
            swal({
                title: "Thông báo",
                text: "Không tìm thấy dữ liệu VN2000 của thửa đất đang chọn",
                icon: "error",
                button: "Đóng",
            }).then((value) => {
            });
        });

        //$(InAn.SELECTORS.btnInTrichLuc).on("click", function () {
        //InTrichLuc: function () {
        //    var result = ViewMap.GLOBAL.commonData.features.find(x => x.properties.info != undefined && x.properties.info == "vn2000");
        //    if (result != null && result != undefined) {
        //        //console.log(result);
        //        var bangToaDo = InAn.CalculateBangToaDo(result.geometry);
        //        if (bangToaDo.length > 0 && bangToaDo != []) {
        //            InAn.TrichLucEvent(result.properties.MaXa, result.properties.SoHieuToBanDo, result.properties.SoThuTuThua, result.properties.DiaChi, result.properties.KyHieuMucDichSuDung, result.properties.TenChu, bangToaDo);
        //            return;
        //        }
        //    }
        //    swal({
        //        title: "Thông báo",
        //        text: "Không tìm thấy dữ liệu VN2000 của thửa đất đang chọn",
        //        icon: "error",
        //        button: "Đóng",
        //    }).then((value) => {
        //    });
        //    //});
        //}

        $(InAn.SELECTORS.btnDownloadTrichLucPDF).on("click", function () {
            var result = ViewMap.GLOBAL.commonData.features.find(x => x.properties.info != undefined && x.properties.info == "vn2000");
            if (result != null && result != undefined) {
                //console.log(result);
                var bangToaDo = InAn.CalculateBangToaDo(result.geometry);
                if (bangToaDo.length > 0 && bangToaDo != []) {
                    InAn.TrichLucPDFEvent(result.properties.MaXa, result.properties.SoHieuToBanDo, result.properties.SoThuTuThua, result.properties.DiaChi, result.properties.KyHieuMucDichSuDung, result.properties.TenChu, bangToaDo);
                    return;
                }
            }
            swal({
                title: "Thông báo",
                text: "Không tìm thấy dữ liệu VN2000 của thửa đất đang chọn",
                icon: "error",
                button: "Đóng",
            }).then((value) => {
            });
        });

        $(InAn.SELECTORS.btnDownloadTrichLucDoc).on("click", function () {
            var result = ViewMap.GLOBAL.commonData.features.find(x => x.properties.info != undefined && x.properties.info == "vn2000");
            if (result != null && result != undefined) {
                //console.log(result);
                var bangToaDo = InAn.CalculateBangToaDo(result.geometry);
                if (bangToaDo.length > 0 && bangToaDo != []) {
                    InAn.TrichLucDocEvent(result.properties.MaXa, result.properties.SoHieuToBanDo, result.properties.SoThuTuThua, result.properties.DiaChi, result.properties.KyHieuMucDichSuDung, result.properties.TenChu, bangToaDo);
                    return;
                }
            }
            swal({
                title: "Thông báo",
                text: "Không tìm thấy dữ liệu VN2000 của thửa đất đang chọn",
                icon: "error",
                button: "Đóng",
            }).then((value) => {
            });
        });

        $(InAn.SELECTORS.btnInChungNhan).on("click", function () {
            var result = ViewMap.GLOBAL.commonData.features.find(x => x.properties.info != undefined && x.properties.info == "vn2000");
            if (result != null && result != undefined) {
                //console.log(result);
                InAn.InGCNEvent(result.properties.MaXa, result.properties.SoHieuToBanDo, result.properties.SoThuTuThua);
                return;
            }
            swal({
                title: "Thông báo",
                text: "Không tìm thấy dữ liệu VN2000 của thửa đất đang chọn",
                icon: "error",
                button: "Đóng",
            }).then((value) => {
            });
        });

        $(InAn.SELECTORS.btnDownloadChungNhan).on("click", function () {
            var result = ViewMap.GLOBAL.commonData.features.find(x => x.properties.info != undefined && x.properties.info == "vn2000");
            if (result != null && result != undefined) {
                //console.log(result);
                InAn.DownloadGCNEvent(result.properties.MaXa, result.properties.SoHieuToBanDo, result.properties.SoThuTuThua);
                return;
            }
            swal({
                title: "Thông báo",
                text: "Không tìm thấy dữ liệu VN2000 của thửa đất đang chọn",
                icon: "error",
                button: "Đóng",
            }).then((value) => {
            });
        });

        $(InAn.SELECTORS.btnTrichLucSelect).on("click", function () {
            InAn.PopUpTrichLuc();
        });

        $(InAn.SELECTORS.btnHSKTSelect).on("click", function () {
            InAn.PopUpHSKT();
        });
    },
    InTrichLuc: function () {
        var result = ViewMap.GLOBAL.commonData.features.find(x => x.properties.info != undefined && x.properties.info == "vn2000");
        if (result != null && result != undefined) {
            ViewMap.showLoading(true);
            var bangToaDo = InAn.CalculateBangToaDo(result.geometry);
            if (bangToaDo.length > 0 && bangToaDo != []) {
                InAn.TrichLucEvent(result.properties.MaXa, result.properties.SoHieuToBanDo, result.properties.SoThuTuThua, result.properties.DiaChi, result.properties.KyHieuMucDichSuDung, result.properties.TenChu, bangToaDo);
                return;
            }
        }
        swal({
            title: "Thông báo",
            text: "Không tìm thấy dữ liệu VN2000 của thửa đất đang chọn",
            icon: "error",
            button: "Đóng",
        }).then((value) => {
        });
        //});
    },
    InTrichLucDoc: function () {
        var result = ViewMap.GLOBAL.commonData.features.find(x => x.properties.info != undefined && x.properties.info == "vn2000");
        if (result != null && result != undefined) {
            ViewMap.showLoading(true);
            var bangToaDo = InAn.CalculateBangToaDo(result.geometry);
            if (bangToaDo.length > 0 && bangToaDo != []) {
                InAn.TrichLucDocEvent(result.properties.MaXa, result.properties.SoHieuToBanDo, result.properties.SoThuTuThua, result.properties.DiaChi, result.properties.KyHieuMucDichSuDung, result.properties.TenChu, bangToaDo);
                return;
            }
        }
        swal({
            title: "Thông báo",
            text: "Không tìm thấy dữ liệu VN2000 của thửa đất đang chọn",
            icon: "error",
            button: "Đóng",
        }).then((value) => {
        });
    },
    InTrichLucPDF: function () {
        var result = ViewMap.GLOBAL.commonData.features.find(x => x.properties.info != undefined && x.properties.info == "vn2000");
        if (result != null && result != undefined) {
            ViewMap.showLoading(true);
            var bangToaDo = InAn.CalculateBangToaDo(result.geometry);
            if (bangToaDo.length > 0 && bangToaDo != []) {
                InAn.TrichLucPDFEvent(result.properties.MaXa, result.properties.SoHieuToBanDo, result.properties.SoThuTuThua, result.properties.DiaChi, result.properties.KyHieuMucDichSuDung, result.properties.TenChu, bangToaDo);
                return;
            }
        }
        swal({
            title: "Thông báo",
            text: "Không tìm thấy dữ liệu VN2000 của thửa đất đang chọn",
            icon: "error",
            button: "Đóng",
        }).then((value) => {
        });
    },
    InHoSoKT: function () {
        var result = ViewMap.GLOBAL.commonData.features.find(x => x.properties.info != undefined && x.properties.info == "vn2000");
        if (result != null && result != undefined) {
            //console.log(result);
            ViewMap.showLoading(true);
            var bangToaDo = InAn.CalculateBangToaDo(result.geometry);
            if (bangToaDo.length > 0 && bangToaDo != []) {
                InAn.InAnEvent(result.properties.MaXa, result.properties.SoHieuToBanDo, result.properties.SoThuTuThua, result.properties.DiaChi, result.properties.KyHieuMucDichSuDung, result.properties.TenChu, bangToaDo);
                return;
            }
        }
        swal({
            title: "Thông báo",
            text: "Không tìm thấy dữ liệu VN2000 của thửa đất đang chọn",
            icon: "error",
            button: "Đóng",
        }).then((value) => {
        });
    },
    InHoSoKTDoc: function () {
        var result = ViewMap.GLOBAL.commonData.features.find(x => x.properties.info != undefined && x.properties.info == "vn2000");
        if (result != null && result != undefined) {
            ViewMap.showLoading(true);
            var bangToaDo = InAn.CalculateBangToaDo(result.geometry);
            if (bangToaDo.length > 0 && bangToaDo != []) {
                InAn.DownloadDocEvent(result.properties.MaXa, result.properties.SoHieuToBanDo, result.properties.SoThuTuThua, result.properties.DiaChi, result.properties.KyHieuMucDichSuDung, result.properties.TenChu, bangToaDo);
                return;
            }
        }
        swal({
            title: "Thông báo",
            text: "Không tìm thấy dữ liệu VN2000 của thửa đất đang chọn",
            icon: "error",
            button: "Đóng",
        }).then((value) => {
        });
    },
    InHoSoKTPDF: function () {
        var result = ViewMap.GLOBAL.commonData.features.find(x => x.properties.info != undefined && x.properties.info == "vn2000");
        if (result != null && result != undefined) {
            ViewMap.showLoading(true);
            var bangToaDo = InAn.CalculateBangToaDo(result.geometry);
            if (bangToaDo.length > 0 && bangToaDo != []) {
                InAn.DownloadPdfEvent(result.properties.MaXa, result.properties.SoHieuToBanDo, result.properties.SoThuTuThua, result.properties.DiaChi, result.properties.KyHieuMucDichSuDung, result.properties.TenChu, bangToaDo);
                return;
            }
        }
        swal({
            title: "Thông báo",
            text: "Không tìm thấy dữ liệu VN2000 của thửa đất đang chọn",
            icon: "error",
            button: "Đóng",
        }).then((value) => {
        });
    },
    CalculateBangToaDo: function (Geometry) {
        var bangtoado = [];
        var index = 0;
        //var polygon = new esri.geometry.Polygon(Geometry.coordinates[0]);
        if (Geometry.type == "MultiPolygon") {
            for (var i = 0; i < Geometry.coordinates.length; i++) {
                for (var j = 0; j < Geometry.coordinates[i].length; j++) {
                    for (var k = 0; k < Geometry.coordinates[i][j].length - 1; k++) {
                        var obj = {};
                        //var point = new esri.geometry.Point({
                        //    x: polygon.rings[j][k][0],
                        //    y: polygon.rings[j][k][1],
                        //    spatialReference: polygon.spatialReference
                        //});
                        ++index;
                        obj.Diem = index;
                        obj.Toadox = Geometry.coordinates[i][j][k][0];
                        obj.Toadoy = Geometry.coordinates[i][j][k][1];
                        var dodaicanh = Problem.getLengthInverseProblem(Geometry.coordinates[i][j][k][0], Geometry.coordinates[i][j][k][1], Geometry.coordinates[i][j][k + 1][0], Geometry.coordinates[i][j][k + 1][1]);
                        obj.DoDai = dodaicanh;
                        bangtoado.push(obj);
                    }
                    // })
                }
            }
        }

        if (Geometry.type == "Polygon") {
            for (var j2 = 0; j2 < Geometry.coordinates.length; j2++) {
                for (var k2 = 0; k2 < Geometry.coordinates[j2].length - 1; k2++) {
                    var obj2 = {};
                    //var point = new esri.geometry.Point({
                    //    x: polygon.rings[j][k][0],
                    //    y: polygon.rings[j][k][1],
                    //    spatialReference: polygon.spatialReference
                    //});
                    ++index;
                    obj2.Diem = index;
                    obj2.Toadox = Geometry.coordinates[j2][k2][0];
                    obj2.Toadoy = Geometry.coordinates[j2][k2][1];
                    var dodaicanh2 = Problem.getLengthInverseProblem(Geometry.coordinates[j2][k2][0], Geometry.coordinates[j2][k2][1], Geometry.coordinates[j2][k2 + 1][0], Geometry.coordinates[j2][k2 + 1][1]);
                    obj.DoDai = dodaicanh2;
                    bangtoado.push(obj2);
                }
                // })
            }
        }
        return bangtoado;
    },
    InAnEvent: function (MaXa, SoHieuToBanDo, SoThuTuThua, DiaChi, KyHieuMucDichSuDung, TenChu, BangToaDo) {
        var kvhc = MaXa;
        var soto = SoHieuToBanDo;
        var sothua = SoThuTuThua;
        var diachi = DiaChi;
        var mdsd = KyHieuMucDichSuDung;
        var tenchu = TenChu;
        var bangtoado = BangToaDo;

        $.ajax({
            type: "POST",
            url: "/InAn/Inhskt",
            data: JSON.stringify({ SOTHUTUTHUA: sothua, SOHIEUTOBANDO: soto, MAXA: kvhc, tenchu: tenchu, mdsddat: mdsd, diachi: diachi, bangtoado: bangtoado }),
            contentType: "application/json; charset=utf-8",
            dataType: "html",
            async: true,
            success: function (response) {
                ViewMap.showLoading(false);
                if (response.indexOf("error image") >= 0) {
                    swal({
                        title: "Thông báo",
                        text: "Vui lòng vào biên tập để lưu hình",
                        icon: "error",
                        button: "Đóng",
                    }).then((value) => {
                    });
                } else {
                    var popup = window.open('/printhtml', '_blank');
                    popup.onload = function () {
                        $(popup.document.head).html('<meta charset="utf-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><title>Hệ thống thông tin đất đai quốc gia - FIOLIS</title>');
                        $(popup.document.body).html(response);
                    };
                }
            },
            failure: function (response) {
                ViewMap.showLoading(false);
                swal({
                    title: "Thông báo",
                    text: "Lỗi hệ thống",
                    icon: "error",
                    button: "Đóng",
                }).then((value) => {
                });
            },
            error: function (response) {
                ViewMap.showLoading(false);
                swal({
                    title: "Thông báo",
                    text: "Lỗi hệ thống",
                    icon: "error",
                    button: "Đóng",
                }).then((value) => {
                });
            }
        });
    },
    DownloadDocEvent: function (MaXa, SoHieuToBanDo, SoThuTuThua, DiaChi, KyHieuMucDichSuDung, TenChu, BangToaDo) {
        var kvhc = MaXa;
        var soto = SoHieuToBanDo;
        var sothua = SoThuTuThua;
        var diachi = DiaChi;
        var mdsd = KyHieuMucDichSuDung;
        var tenchu = TenChu;
        var bangtoado = BangToaDo;

        $.ajax({
            type: "POST",
            url: "/InAn/DownloadFile_hskt",
            data: JSON.stringify({ SOTHUTUTHUA: sothua, SOHIEUTOBANDO: soto, MAXA: kvhc, tenchu: tenchu, mdsddat: mdsd, diachi: diachi, type: "doc", bangtoado: bangtoado }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: true,
            success: function (response) {
                ViewMap.showLoading(false);
                InAn.dowloadFile(response);
                //window.location.href = response;
            },
            failure: function (response) {
                ViewMap.showLoading(false);
                swal({
                    title: "Thông báo",
                    text: "Lỗi hệ thống",
                    icon: "error",
                    button: "Đóng",
                }).then((value) => {
                });
            },
            error: function (response) {
                ViewMap.showLoading(false);
                swal({
                    title: "Thông báo",
                    text: "Lỗi hệ thống",
                    icon: "error",
                    button: "Đóng",
                }).then((value) => {
                });
            }
        });
    },
    DownloadPdfEvent: function (MaXa, SoHieuToBanDo, SoThuTuThua, DiaChi, KyHieuMucDichSuDung, TenChu, BangToaDo) {
        var kvhc = MaXa;
        var soto = SoHieuToBanDo;
        var sothua = SoThuTuThua;
        var diachi = DiaChi;
        var mdsd = KyHieuMucDichSuDung;
        var tenchu = TenChu;
        var bangtoado = BangToaDo;

        $.ajax({
            type: "POST",
            url: "/InAn/DownloadFile_hskt",
            data: JSON.stringify({ SOTHUTUTHUA: sothua, SOHIEUTOBANDO: soto, MAXA: kvhc, tenchu: tenchu, mdsddat: mdsd, diachi: diachi, type: "pdf", bangtoado: bangtoado }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: true,
            success: function (response) {
                ViewMap.showLoading(false);
                InAn.dowloadFile(response);
                //window.location.href = response;
            },
            failure: function (response) {
                ViewMap.showLoading(false);
                swal({
                    title: "Thông báo",
                    text: "Lỗi hệ thống",
                    icon: "error",
                    button: "Đóng",
                }).then((value) => {
                });
            },
            error: function (response) {
                ViewMap.showLoading(false);
                swal({
                    title: "Thông báo",
                    text: "Lỗi hệ thống",
                    icon: "error",
                    button: "Đóng",
                }).then((value) => {
                });
            }
        });
    },
    TrichLucEvent: function (MaXa, SoHieuToBanDo, SoThuTuThua, DiaChi, KyHieuMucDichSuDung, TenChu, BangToaDo) {
        var kvhc = MaXa;
        var soto = SoHieuToBanDo;
        var sothua = SoThuTuThua;
        var diachi = DiaChi;
        var mdsd = KyHieuMucDichSuDung;
        var tenchu = TenChu;
        var bangtoado = BangToaDo;
        $.ajax({
            type: "POST",
            url: "/InAnNew/InTrichLuc",
            data: JSON.stringify({ SOTHUTUTHUA: sothua, SOHIEUTOBANDO: soto, MAXA: kvhc, tenchu: tenchu, mdsddat: mdsd, diachi: diachi, bangtoado: bangtoado }),
            contentType: "application/json; charset=utf-8",
            dataType: "html",
            async:true,
            success: function (response) {
                //var w = window.open();
                //$(w.document.body).html(response);
                ViewMap.showLoading(false);
                if (response.indexOf("error image") >=0) {
                    swal({
                        title: "Thông báo",
                        text: "Vui lòng vào biên tập để lưu hình",
                        icon: "error",
                        button: "Đóng",
                    }).then((value) => {
                    });
                } else {
                    var popup = window.open('/printhtml', '_blank');
                    popup.onload = function () {
                        $(popup.document.head).html('<meta charset="utf-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><title>Hệ thống thông tin đất đai quốc gia - FIOLIS</title>');
                        $(popup.document.body).html(response);
                    };
                }
                
            },
            failure: function (response) {
                ViewMap.showLoading(false);
                swal({
                    title: "Thông báo",
                    text: "Lỗi hệ thống",
                    icon: "error",
                    button: "Đóng",
                }).then((value) => {
                });
            },
            error: function (response) {
                ViewMap.showLoading(false);
                swal({
                    title: "Thông báo",
                    text: "Lỗi hệ thống",
                    icon: "error",
                    button: "Đóng",
                }).then((value) => {
                });
            }
        });
    },
    InGCNEvent: function (MaXa, SoHieuToBanDo, SoThuTuThua) {
        var kvhc = MaXa;
        var soto = SoHieuToBanDo;
        var sothua = SoThuTuThua;
        $.ajax({
            type: "POST",
            url: "/InAn/InGCN",
            data: JSON.stringify({ SOTHUTUTHUA: sothua, SOHIEUTOBANDO: soto, MAXA: kvhc }),
            contentType: "application/json; charset=utf-8",
            dataType: "html",
            success: function (response) {
                // alert("Hello: " + response.Name + " .\nCurrent Date and Time: " + response.DateTime);
                //var w = window.open();
                //$(w.document.body).html(JSON.parse(response));
                window.open(JSON.parse(response));
            },
            failure: function (response) {
                swal({
                    title: "Thông báo",
                    text: "Lỗi hệ thống",
                    icon: "error",
                    button: "Đóng",
                }).then((value) => {
                });
            },
            error: function (response) {
                swal({
                    title: "Thông báo",
                    text: "Lỗi hệ thống",
                    icon: "error",
                    button: "Đóng",
                }).then((value) => {
                });
            }
        });
    },
    DownloadGCNEvent: function (MaXa, SoHieuToBanDo, SoThuTuThua) {
        var kvhc = MaXa;
        var soto = SoHieuToBanDo;
        var sothua = SoThuTuThua;
        $.ajax({
            type: "POST",
            url: "/InAn/InGCN_Html",
            data: JSON.stringify({ SOTHUTUTHUA: sothua, SOHIEUTOBANDO: soto, MAXA: kvhc }),
            contentType: "application/json; charset=utf-8",
            dataType: "html",
            success: function (response) {
                var w = window.open();
                //$(w.document.body)[0].ondblclick = "div_gcn.contentEditable = 'true'; tbrEdit.style.display = ''";
                //$(w.document.body)[0].ID = "abc123";
                // $(w.document.body)[0].addEventListener("ondblclick", "div_gcn.contentEditable = 'true'; tbrEdit.style.display = ''");
                $(w.document.body)[0].outerHTML = (response);

            },
            failure: function (response) {
                alert(response.responseText);
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
    },
    TrichLucDocEvent: function (MaXa, SoHieuToBanDo, SoThuTuThua, DiaChi, KyHieuMucDichSuDung, TenChu, BangToaDo) {
        var kvhc = MaXa;
        var soto = SoHieuToBanDo;
        var sothua = SoThuTuThua;
        var diachi = DiaChi;
        var mdsd = KyHieuMucDichSuDung;
        var tenchu = TenChu;
        var bangtoado = BangToaDo;

        $.ajax({
            type: "POST",
            url: "/InAn/DownloadFile",
            data: JSON.stringify({ SOTHUTUTHUA: sothua, SOHIEUTOBANDO: soto, MAXA: kvhc, tenchu: tenchu, mdsddat: mdsd, diachi: diachi, type: "doc", bangtoado: bangtoado }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: true,
            success: function (response) {
                ViewMap.showLoading(false);
                InAn.dowloadFile(response);
                //window.location.href = response;
                //window.open(response);
            },
            failure: function (response) {
                ViewMap.showLoading(false);
                swal({
                    title: "Thông báo",
                    text: "Lỗi hệ thống",
                    icon: "error",
                    button: "Đóng",
                }).then((value) => {
                });
            },
            error: function (response) {
                ViewMap.showLoading(false);
                swal({
                    title: "Thông báo",
                    text: "Lỗi hệ thống",
                    icon: "error",
                    button: "Đóng",
                }).then((value) => {
                });
            }
        });
    },
    TrichLucPDFEvent: function (MaXa, SoHieuToBanDo, SoThuTuThua, DiaChi, KyHieuMucDichSuDung, TenChu, BangToaDo) {
        var kvhc = MaXa;
        var soto = SoHieuToBanDo;
        var sothua = SoThuTuThua;
        var diachi = DiaChi;
        var mdsd = KyHieuMucDichSuDung;
        var tenchu = TenChu;
        var bangtoado = BangToaDo;

        $.ajax({
            type: "POST",
            url: "/InAn/DownloadFile",
            data: JSON.stringify({ SOTHUTUTHUA: sothua, SOHIEUTOBANDO: soto, MAXA: kvhc, tenchu: tenchu, mdsddat: mdsd, diachi: diachi, type: "pdf", bangtoado: bangtoado }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: true,
            success: function (response) {
                ViewMap.showLoading(false);
                InAn.dowloadFile(response);
                //$(".download-file a").trigger("click");
                //$('.download-file a[href$=".pdf"]')
                //    .attr('download', '')
                //    .attr('target', '_blank'); 
                //window.open(response, '_blank');
                //window.location.href = response;
                //window.open(response);
            },
            failure: function (response) {
                ViewMap.showLoading(false);
                swal({
                    title: "Thông báo",
                    text: "Lỗi hệ thống",
                    icon: "error",
                    button: "Đóng",
                }).then((value) => {
                });
            },
            error: function (response) {
                ViewMap.showLoading(false);
                swal({
                    title: "Thông báo",
                    text: "Lỗi hệ thống",
                    icon: "error",
                    button: "Đóng",
                }).then((value) => {
                });
            }
        });
    },
    PopUpTrichLuc: function () {
        bootbox.prompt({
            title: "Chọn chức năng trích lục",
            inputType: 'select',
            inputOptions: [
                {
                    text: 'Chọn chức năng...',
                    value: ''
                },
                {
                    text: 'In trích lục',
                    value: 'ITL'
                },
                {
                    text: 'Tải trích lục doc',
                    value: 'TTLD'
                },
                {
                    text: 'Tải trích lục pdf',
                    value: 'TTLP'
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
                if (result != null && result != "") {
                    setTimeout(function () {
                        InAn.SelectTypeTrichLuc(result);
                    }, 1);
                }
            },

        });
    },
    PopUpHSKT: function () {
        bootbox.prompt({
            title: "Chọn chức năng hồ sơ kỹ thuật",
            inputType: 'select',
            inputOptions: [
                {
                    text: 'Chọn chức năng...',
                    value: ''
                },
                {
                    text: 'In ấn',
                    value: 'IA'
                },
                {
                    text: 'Tải file doc',
                    value: 'TFD'
                },
                {
                    text: 'Tải file pdf',
                    value: 'TFP'
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
                if (result != null && result != "") {
                    setTimeout(function () {
                        InAn.SelectTypeHSKT(result);
                    }, 1);
                }
            },

        });
    },
    SelectTypeTrichLuc: function (data) {
        if (data != null && data != undefined) {
            switch (data) {
                case "ITL":
                    //$(InAn.SELECTORS.btnInTrichLuc).trigger("click");
                    InAn.InTrichLuc();
                    break;
                case "TTLD":
                    InAn.InTrichLucDoc();
                    //$(InAn.SELECTORS.btnDownloadTrichLucDoc).trigger("click");
                    break;
                case "TTLP":
                    InAn.InTrichLucPDF();
                    //$(InAn.SELECTORS.btnDownloadTrichLucPDF).trigger("click");
                    break;
                default:
                    break;
            }
        }
    },
    SelectTypeHSKT: function (data) {
        if (data != null && data != undefined) {
            switch (data) {
                case "IA":
                    InAn.InHoSoKT();
                    //$(InAn.SELECTORS.btnInAn).trigger("click");
                    break;
                case "TFD":
                    InAn.InHoSoKTDoc();
                    //$(InAn.SELECTORS.btnDownloadDoc).trigger("click");
                    break;
                case "TFP":
                    InAn.InHoSoKTPDF();
                    //$(InAn.SELECTORS.btnDownloadPDF).trigger("click");
                    break;
                default:
                    break;
            }
        }
    },
    dowloadFile: function (response) {
        $(".download-file a").attr("href", response);
        setTimeout(function () { $(".download-file a")[0].click(); }, 100);
    }
};