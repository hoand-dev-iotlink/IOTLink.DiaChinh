
$(".btn-bien-tap").click(function () {
    var soTo = $(".SoToBD").text();
    var soThua = $(".SoThuaBD").text();
    var maXa = ViewMap.GLOBAL.commonData.features[0].properties.MaXa;
    var domain = location.origin;
    let url = `//apps.dtsgr.com/Library/fiolis/package/editor/svg-editor-es.html?maXa=${maXa}&soTo=${soTo}&soThua=${soThua}&domain=${domain}`;
    let url1 = `scripts/mapiot/bientapbando/editor/svg-editor-es.html?maXa=${maXa}&soTo=${soTo}&soThua=${soThua}&domain=${domain}`;
    $('#svgEditor').attr('src', url1);
    $(".modal-bien-tap").modal('show');
});