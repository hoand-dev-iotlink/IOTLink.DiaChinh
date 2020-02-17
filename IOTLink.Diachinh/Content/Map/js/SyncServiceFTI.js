function updateGeometries(data) {
    $.ajax({
        type: "POST",
        url: "/ThuaService/updateGeometries",
        data: JSON.stringify({ features: data}),
        contentType: "application/json",
        async: true,
        success: function (re) {
            console.log(re)
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        }
    });
}

function deleteGeometry(soto, sothua,maxa) {
    $.ajax({
        type: "GET",
        url: "/ThuaService/deleteGeometryThua",
        data: {
            thuacu: sothua,
            tocu: soto,
            xacu: maxa
        },
        contentType: "application/json",
        async: true,
        success: function (re) {
            console.log(re)
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        }
    });
}
var svg = "";
function SaveSvG () {
    var kvhc = "29542";
    var soto = "27";
    var sothua = "2";
    let svga = svg
    $.ajax({
        type: "POST",
        url: "/Services/Save_svg",//"/Services/Save_svg",
        //contentType: "application/json",
        //dataType: "json",
        contentType: "application/json",
        data: JSON.stringify({ param: JSON.stringify(svga), maxa: kvhc, sothututhua: sothua, sohieutobando: soto }),
        beforeSend: function (xhr) {

        },
        success: function (response) {
            if (response === "True") {
                alert('Lưu bản vẽ thành công');
            }
            else {
                alert('Có lỗi xảy ra');
            }
        },
        failure: function (response) {
            alert(response.responseText);
        },
        error: function (response) {
            alert(response.responseText);
        }
    });
}