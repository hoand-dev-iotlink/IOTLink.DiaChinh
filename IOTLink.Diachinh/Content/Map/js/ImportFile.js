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
                                setTimeout(function () {
                                    location.reload();
                                }, 500);
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