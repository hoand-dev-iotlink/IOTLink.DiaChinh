﻿#pragma warning disable 1591
//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//     Runtime Version:4.0.30319.42000
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace ASP
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using System.Net;
    using System.Text;
    using System.Web;
    using System.Web.Helpers;
    using System.Web.Mvc;
    using System.Web.Mvc.Ajax;
    using System.Web.Mvc.Html;
    using System.Web.Optimization;
    using System.Web.Routing;
    using System.Web.Security;
    using System.Web.UI;
    using System.Web.WebPages;
    using FIOLIS.Modules.Map;
    
    [System.CodeDom.Compiler.GeneratedCodeAttribute("RazorGenerator", "2.0.0.0")]
    [System.Web.WebPages.PageVirtualPathAttribute("~/Views/MapIOT/_EditThuaDat.cshtml")]
    public partial class _Views_MapIOT__EditThuaDat_cshtml : System.Web.Mvc.WebViewPage<dynamic>
    {
        public _Views_MapIOT__EditThuaDat_cshtml()
        {
        }
        public override void Execute()
        {
WriteLiteral("\r\n<div");

WriteLiteral(" class=\"modal fade bs-example-modal-lg modal-edit-shape\"");

WriteLiteral(" tabindex=\"-1\"");

WriteLiteral(" role=\"dialog\"");

WriteLiteral(" aria-labelledby=\"myLargeModalLabel\"");

WriteLiteral(" aria-hidden=\"true\"");

WriteLiteral(" data-backdrop=\"static\"");

WriteLiteral(" data-keyboard=\"false\"");

WriteLiteral(">\r\n    <div");

WriteLiteral(" class=\"modal-dialog\"");

WriteLiteral(">\r\n        <div");

WriteLiteral(" class=\"modal-content\"");

WriteLiteral(">\r\n            <div");

WriteLiteral(" class=\"modal-header\"");

WriteLiteral(">\r\n                <button");

WriteLiteral(" type=\"button\"");

WriteLiteral(" class=\"close\"");

WriteLiteral(" data-dismiss=\"modal\"");

WriteLiteral("><span");

WriteLiteral(" aria-hidden=\"true\"");

WriteLiteral(">&times;</span><span");

WriteLiteral(" class=\"sr-only\"");

WriteLiteral(">Close</span></button>\r\n                <h4");

WriteLiteral(" class=\"modal-title\"");

WriteLiteral(" id=\"myModalLabel\"");

WriteLiteral("> Chỉnh sửa đỉnh thửa đất</h4>\r\n            </div>\r\n            <div");

WriteLiteral(" class=\"modal-body\"");

WriteLiteral(">\r\n                <div");

WriteLiteral(" class=\"menu-tach-thua\"");

WriteLiteral(">\r\n                    <div");

WriteLiteral(" style=\"height: 100%;overflow-y:auto\"");

WriteLiteral(">\r\n                        ");

WriteLiteral("\r\n                        <div");

WriteLiteral(" class=\"point-change\"");

WriteLiteral(">\r\n                            <label>Chọn điểm cần thay thế</label>\r\n           " +
"                 <select");

WriteLiteral(" class=\"col-sm-12\"");

WriteLiteral(" name=\"select-all-point-change\"");

WriteLiteral("></select>\r\n                        </div>\r\n                        <div>\r\n      " +
"                      <ul");

WriteLiteral(" class=\"menu-giao-hoi\"");

WriteLiteral(">\r\n                                <li><a");

WriteLiteral(" href=\"javascript:;\"");

WriteLiteral(" class=\"menu-nhap-toa-do active\"");

WriteLiteral("><i");

WriteLiteral(" class=\"fa fa-list-alt\"");

WriteLiteral("></i> Nhập tọa độ</a></li>\r\n                                <li><a");

WriteLiteral(" href=\"javascript:;\"");

WriteLiteral(" class=\"menu-cach-duong-thang\"");

WriteLiteral("><i");

WriteLiteral(" class=\"fa fa-list-alt\"");

WriteLiteral("></i> Giao hội cách đường thẳng</a></li>\r\n                                <li><a");

WriteLiteral(" href=\"javascript:;\"");

WriteLiteral(" class=\"menu-hoi-thuan\"");

WriteLiteral("><i");

WriteLiteral(" class=\"fa fa-tachometer\"");

WriteLiteral("></i> Giao hội thuận</a></li>\r\n                                <li><a");

WriteLiteral(" href=\"javascript:;\"");

WriteLiteral(" class=\"menu-hoi-nghich\"");

WriteLiteral("><i");

WriteLiteral(" class=\"fa fa-desktop\"");

WriteLiteral("></i> Giao hội nghịch</a></li>\r\n                                <li><a");

WriteLiteral(" href=\"javascript:;\"");

WriteLiteral(" class=\"menu-hoi-huong\"");

WriteLiteral("><i");

WriteLiteral(" class=\"fa fa-list\"");

WriteLiteral("></i> Giao hội hướng</a></li>\r\n                                <li><a");

WriteLiteral(" href=\"javascript:;\"");

WriteLiteral(" class=\"menu-doc-theo-canh\"");

WriteLiteral("><i");

WriteLiteral(" class=\"fa fa-pencil-square-o\"");

WriteLiteral("></i> Giao hội dọc theo cạnh</a></li>\r\n                            </ul>\r\n       " +
"                 </div>\r\n\r\n                        ");

WriteLiteral("\r\n                        ");

WriteLiteral("\r\n                        <table");

WriteLiteral(" class=\"table table-hover table-point\"");

WriteLiteral(">\r\n                            <thead>\r\n                                <tr>\r\n   " +
"                                 <th");

WriteLiteral(" scope=\"col\"");

WriteLiteral(">STT</th>\r\n                                    <th");

WriteLiteral(" scope=\"col\"");

WriteLiteral(">Điểm</th>\r\n                                </tr>\r\n                            </" +
"thead>\r\n                            <tbody");

WriteLiteral(" id=\"pointGhiNhan\"");

WriteLiteral("></tbody>\r\n                        </table>\r\n                        ");

WriteLiteral("\r\n\r\n                        <div");

WriteLiteral(" class=\"button-tool\"");

WriteLiteral(">\r\n                            <button");

WriteLiteral(" type=\"button\"");

WriteLiteral(" class=\"btn btn-default clear-all-point\"");

WriteLiteral(" title=\"Xóa toàn bộ điểm thay thế\"");

WriteLiteral("><i");

WriteLiteral(" class=\"fa fa-trash-o\"");

WriteLiteral(" aria-hidden=\"true\"");

WriteLiteral("></i></button>\r\n                            <button");

WriteLiteral(" type=\"button\"");

WriteLiteral(" class=\"btn btn-default view-edit-shape\"");

WriteLiteral(" title=\"Xem kết quả chỉnh sửa\"");

WriteLiteral("><i");

WriteLiteral(" class=\"fa fa-play\"");

WriteLiteral(" aria-hidden=\"true\"");

WriteLiteral("></i></button>\r\n                            <button");

WriteLiteral(" type=\"button\"");

WriteLiteral(" class=\"btn btn-default clear-result\"");

WriteLiteral(" title=\"Xóa kết quả chỉnh sửa\"");

WriteLiteral("><i");

WriteLiteral(" class=\"fa fa-refresh\"");

WriteLiteral(" aria-hidden=\"true\"");

WriteLiteral("></i></button>\r\n                            <button");

WriteLiteral(" type=\"button\"");

WriteLiteral(" class=\"btn btn-default save-edit-shape\"");

WriteLiteral(" title=\"Lưu kết quả\"");

WriteLiteral("><i");

WriteLiteral(" class=\"fa fa-pencil-square-o\"");

WriteLiteral(" aria-hidden=\"true\"");

WriteLiteral("></i></button>\r\n                        </div>\r\n                    </div>\r\n     " +
"           </div>\r\n                <div");

WriteLiteral(" class=\"map-eidt-shape\"");

WriteLiteral(" id=\"mapEditShape\"");

WriteLiteral(">\r\n                    <div");

WriteLiteral(" class=\"footer-map-point col-xs-12 col-sm-12\"");

WriteLiteral(">\r\n                        <div");

WriteLiteral(" class=\"header-point\"");

WriteLiteral(">\r\n                            <h4");

WriteLiteral(" class=\"title-giao-hoi\"");

WriteLiteral(">Giao hội</h4>\r\n                            <span");

WriteLiteral(" class=\"btn-show-hide-point\"");

WriteLiteral("><i");

WriteLiteral(" class=\"fa fa-chevron-down\"");

WriteLiteral(" aria-hidden=\"true\"");

WriteLiteral("></i></span>\r\n                        </div>\r\n                        <div");

WriteLiteral(" class=\"context-point\"");

WriteLiteral(">\r\n                            <div");

WriteLiteral(" class=\"row\"");

WriteLiteral(">\r\n                                <div");

WriteLiteral(" class=\"col-xs-12 col-sm-8\"");

WriteLiteral(">\r\n                                    <div");

WriteLiteral(" class=\"row\"");

WriteLiteral(">\r\n                                        <div");

WriteLiteral(" class=\"col-xs-12 col-sm-12 form-giao-hoi\"");

WriteLiteral(">\r\n                                            <div");

WriteLiteral(" class=\"col-xs-12 col-sm-10\"");

WriteLiteral(">\r\n                                                <div");

WriteLiteral(" class=\"form-group row\"");

WriteLiteral(">\r\n                                                    <div");

WriteLiteral(" class=\"col-xs-12 col-sm-6\"");

WriteLiteral(">\r\n                                                        <label");

WriteLiteral(" for=\"sel_GHDoc1\"");

WriteLiteral(" class=\"col-sm-4 control-label no-padding-right\"");

WriteLiteral(">Đỉnh A</label>\r\n                                                        <select");

WriteLiteral(" class=\"col-sm-8\"");

WriteLiteral(" id=\"sel_GHCDTDinhA\"");

WriteLiteral("></select>\r\n                                                    </div>\r\n         " +
"                                           <div");

WriteLiteral(" class=\"col-xs-12 col-sm-6\"");

WriteLiteral(">\r\n                                                        <label");

WriteLiteral(" for=\"sel_GHDoc2\"");

WriteLiteral(" class=\"col-sm-4 control-label no-padding-right\"");

WriteLiteral(">Đỉnh B</label>\r\n                                                        <select");

WriteLiteral(" class=\"col-sm-8\"");

WriteLiteral(" id=\"sel_GHCDTDinhB\"");

WriteLiteral("></select>\r\n                                                    </div>\r\n         " +
"                                       </div>\r\n                                 " +
"               <div");

WriteLiteral(" class=\"form-group row\"");

WriteLiteral(">\r\n                                                    <div");

WriteLiteral(" class=\"col-xs-12 col-sm-6\"");

WriteLiteral(">\r\n                                                        <label");

WriteLiteral(" for=\"sel_GHDoc1\"");

WriteLiteral(" class=\"col-sm-4 control-label no-padding-right\"");

WriteLiteral(">Đỉnh C</label>\r\n                                                        <select");

WriteLiteral(" class=\"col-sm-8\"");

WriteLiteral(" id=\"sel_GHCDTDinhC\"");

WriteLiteral("></select>\r\n                                                    </div>\r\n         " +
"                                           <div");

WriteLiteral(" class=\"col-xs-12 col-sm-6\"");

WriteLiteral(">\r\n                                                        <label");

WriteLiteral(" for=\"sel_GHDoc2\"");

WriteLiteral(" class=\"col-sm-4 control-label no-padding-right\"");

WriteLiteral(">Đỉnh D</label>\r\n                                                        <select");

WriteLiteral(" class=\"col-sm-8\"");

WriteLiteral(" id=\"sel_GHCDTDinhD\"");

WriteLiteral("></select>\r\n                                                    </div>\r\n         " +
"                                       </div>\r\n                                 " +
"               <div");

WriteLiteral(" class=\"form-group row\"");

WriteLiteral(">\r\n                                                    <div");

WriteLiteral(" class=\"col-xs-12 col-sm-6\"");

WriteLiteral(">\r\n                                                        <label");

WriteLiteral(" for=\"form-field-9\"");

WriteLiteral(" class=\"col-sm-4 control-label no-padding-right\"");

WriteLiteral(">Cách AB</label>\r\n                                                        <input");

WriteLiteral(" type=\"text\"");

WriteLiteral(" class=\"col-sm-8 input-mask-distance\"");

WriteLiteral(" placeholder=\"Khoảng cách (m)\"");

WriteLiteral(" id=\"inp_CachAB\"");

WriteLiteral(">\r\n                                                    </div>\r\n\r\n                " +
"                                    <div");

WriteLiteral(" class=\"col-xs-12 col-sm-6\"");

WriteLiteral(">\r\n                                                        <label");

WriteLiteral(" for=\"form-field-9\"");

WriteLiteral(" class=\"col-sm-4 control-label no-padding-right\"");

WriteLiteral(">Cách CD</label>\r\n                                                        <input");

WriteLiteral(" type=\"text\"");

WriteLiteral(" class=\"col-sm-8 input-mask-distance\"");

WriteLiteral(" placeholder=\"Khoảng cách (m)\"");

WriteLiteral(" id=\"inp_CachCD\"");

WriteLiteral(">\r\n                                                    </div>\r\n                  " +
"                              </div>\r\n                                          " +
"      <div");

WriteLiteral(" class=\"form-group row\"");

WriteLiteral(">\r\n                                                    <div");

WriteLiteral(" class=\"col-xs-12 col-sm-6\"");

WriteLiteral(">\r\n                                                        <label");

WriteLiteral(" for=\"form-field-9\"");

WriteLiteral(" class=\"col-sm-4 control-label no-padding-right\"");

WriteLiteral(">Cạnh A-C</label>\r\n                                                        <input" +
"");

WriteLiteral(" type=\"text\"");

WriteLiteral(" class=\"col-sm-8 input-mask-distance\"");

WriteLiteral(" placeholder=\"Độ dài cạnh (m)\"");

WriteLiteral(" id=\"inp_CanhAC\"");

WriteLiteral(">\r\n                                                    </div>\r\n\r\n                " +
"                                    <div");

WriteLiteral(" class=\"col-xs-12 col-sm-6\"");

WriteLiteral(">\r\n                                                        <label");

WriteLiteral(" for=\"form-field-9\"");

WriteLiteral(" class=\"col-sm-4 control-label no-padding-right\"");

WriteLiteral(">Cạnh B-C</label>\r\n                                                        <input" +
"");

WriteLiteral(" type=\"text\"");

WriteLiteral(" class=\"col-sm-8 input-mask-distance\"");

WriteLiteral(" placeholder=\"Độ dài cạnh (m)\"");

WriteLiteral(" id=\"inp_CanhBC\"");

WriteLiteral(">\r\n                                                    </div>\r\n                  " +
"                              </div>\r\n                                          " +
"      <div");

WriteLiteral(" class=\"form-group row\"");

WriteLiteral(">\r\n                                                    <div");

WriteLiteral(" class=\"col-xs-12 col-sm-6\"");

WriteLiteral(">\r\n                                                        <label");

WriteLiteral(" for=\"form-field-select-1\"");

WriteLiteral(" class=\"col-sm-4 control-label no-padding-right\"");

WriteLiteral(">Góc CAB</label>\r\n                                                        <input");

WriteLiteral(" class=\"col-sm-8 input-mask-angle\"");

WriteLiteral(" type=\"text\"");

WriteLiteral(" id=\"inp_GocCAB\"");

WriteLiteral(" disabled=\"\"");

WriteLiteral(">\r\n                                                    </div>\r\n                  " +
"                                  <div");

WriteLiteral(" class=\"col-xs-12 col-sm-6\"");

WriteLiteral(">\r\n                                                        <label");

WriteLiteral(" for=\"form-field-select-1\"");

WriteLiteral(" class=\"col-sm-4 control-label no-padding-right\"");

WriteLiteral(">Góc CBA</label>\r\n                                                        <input");

WriteLiteral(" class=\"col-sm-8 input-mask-angle\"");

WriteLiteral(" type=\"text\"");

WriteLiteral(" id=\"inp_GocCBA\"");

WriteLiteral(" disabled=\"\"");

WriteLiteral(">\r\n                                                    </div>\r\n                  " +
"                              </div>\r\n                                          " +
"      <div");

WriteLiteral(" class=\"form-group row\"");

WriteLiteral(">\r\n                                                    <div");

WriteLiteral(" class=\"col-xs-12 col-sm-6\"");

WriteLiteral(">\r\n                                                        <label");

WriteLiteral(" for=\"form-field-select-1\"");

WriteLiteral(" class=\"col-sm-4 control-label no-padding-right\"");

WriteLiteral(">Góc APB</label>\r\n                                                        <input");

WriteLiteral(" class=\"col-sm-8 input-mask-angle\"");

WriteLiteral(" type=\"text\"");

WriteLiteral(" id=\"inp_GocAPB\"");

WriteLiteral(">\r\n                                                    </div>\r\n                  " +
"                                  <div");

WriteLiteral(" class=\"col-xs-12 col-sm-6\"");

WriteLiteral(">\r\n                                                        <label");

WriteLiteral(" for=\"form-field-select-1\"");

WriteLiteral(" class=\"col-sm-4 control-label no-padding-right\"");

WriteLiteral(">Góc APC</label>\r\n                                                        <input");

WriteLiteral(" class=\"col-sm-8 input-mask-angle\"");

WriteLiteral(" type=\"text\"");

WriteLiteral(" id=\"inp_GocAPC\"");

WriteLiteral(">\r\n                                                    </div>\r\n                  " +
"                              </div>\r\n                                          " +
"      <div");

WriteLiteral(" class=\"form-group row\"");

WriteLiteral(">\r\n                                                    <div");

WriteLiteral(" class=\"col-xs-12 col-sm-4\"");

WriteLiteral(">\r\n                                                        <div");

WriteLiteral(" class=\"control-group\"");

WriteLiteral(">\r\n                                                        </div>\r\n              " +
"                                      </div>\r\n                                  " +
"              </div>\r\n                                                <div");

WriteLiteral(" class=\"form-group row\"");

WriteLiteral(">\r\n                                                    <div");

WriteLiteral(" class=\"col-xs-12 col-sm-4\"");

WriteLiteral(">\r\n                                                    </div>\r\n                  " +
"                              </div>\r\n                                          " +
"  </div>\r\n                                            <div");

WriteLiteral(" class=\"col-xs-12 col-sm-2\"");

WriteLiteral(">\r\n                                                <div");

WriteLiteral(" class=\"control-group\"");

WriteLiteral(">\r\n                                                </div>\r\n                      " +
"                      </div>\r\n                                            <div");

WriteLiteral(" class=\"col-xs-12 col-sm-2\"");

WriteLiteral(">\r\n                                                <div");

WriteLiteral(" class=\"phương-thuc-giao-hoi-thuan\"");

WriteLiteral(">\r\n                                                </div>\r\n                      " +
"                      </div>\r\n                                        </div>\r\n  " +
"                                  </div>\r\n                                    <d" +
"iv");

WriteLiteral(" class=\"form-actions center\"");

WriteLiteral(">\r\n                                        <button");

WriteLiteral(" type=\"button\"");

WriteLiteral(" class=\"btn btn-sm btn-warning\"");

WriteLiteral(" id=\"btn_Clear_edit_shape\"");

WriteLiteral(">\r\n                                            Làm lại\r\n                         " +
"                   <i");

WriteLiteral(" class=\"ace-icon fa fa-refresh icon-on-right bigger-110\"");

WriteLiteral("></i>\r\n                                        </button>\r\n                       " +
"                 <button");

WriteLiteral(" type=\"button\"");

WriteLiteral(" class=\"btn btn-sm btn-warning\"");

WriteLiteral(" id=\"btn_Preview-edit-shape\"");

WriteLiteral(">\r\n                                            Xem thử\r\n                         " +
"                   <i");

WriteLiteral(" class=\"ace-icon fa fa-arrow-right icon-on-right bigger-110\"");

WriteLiteral("></i>\r\n                                        </button>\r\n                       " +
"                 <button");

WriteLiteral(" type=\"button\"");

WriteLiteral(" class=\"btn btn-sm btn-success\"");

WriteLiteral(" id=\"btn_Submit-edit-shape\"");

WriteLiteral(">\r\n                                            Ghi nhận\r\n                        " +
"                    <i");

WriteLiteral(" class=\"ace-icon fa fa-plus icon-on-right bigger-110\"");

WriteLiteral("></i>\r\n                                        </button>\r\n\r\n                     " +
"               </div>\r\n                                </div>\r\n                 " +
"               <div");

WriteLiteral(" class=\"col-xs-6 col-sm-2 col-md-4\"");

WriteLiteral(">\r\n                                    <div");

WriteLiteral(" class=\"thumbnail search-thumbnail note-giao-hoi\"");

WriteLiteral(">\r\n                                        <img");

WriteLiteral(" class=\"media-object\"");

WriteLiteral(" alt=\"100%x200\"");

WriteLiteral(" src=\"/Images/MapIOT/GiaoHoi/ghcachduongthang.png\"");

WriteLiteral(" data-holder-rendered=\"true\"");

WriteLiteral(" style=\"height: 100%; width: 100%; display: block;\"");

WriteLiteral(">\r\n                                        <div");

WriteLiteral(" class=\"caption\"");

WriteLiteral(">\r\n                                            <p>Lấy ra điểm cách đường AB, CD l" +
"ần lượt các khoảng là d1 và d2. Kết quả sẽ thu được là 4 điểm 1,2,3,4.</p>\r\n    " +
"                                    </div>\r\n                                    " +
"</div>\r\n                                </div>\r\n                            </di" +
"v>\r\n                        </div>\r\n                    </div>\r\n                " +
"</div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n<style>\r\n    .mo" +
"dal-edit-shape {\r\n        width: 100%;\r\n        padding: 0px !important;\r\n      " +
"  overflow: hidden !important;\r\n        height: 100%;\r\n    }\r\n\r\n        .modal-e" +
"dit-shape .modal-dialog {\r\n            width: 100%;\r\n            padding: 5px;\r\n" +
"            margin: 0px;\r\n            height: 100%;\r\n        }\r\n\r\n        .modal" +
"-edit-shape .modal-header {\r\n            position: relative;\r\n        }\r\n\r\n     " +
"   .modal-edit-shape .modal-body {\r\n            height: calc(100vh - 56px);\r\n   " +
"         display: flex;\r\n            padding: 0px !important;\r\n        }\r\n\r\n    " +
".map-eidt-shape {\r\n        height: 100%;\r\n        width: calc(100% - 240px);\r\n  " +
"      background-color: #f1f1f1;\r\n    }\r\n\r\n    .modal-edit-shape .menu-tach-thua" +
" {\r\n        width: 240px;\r\n        height: 100%;\r\n        border-right: 1px soli" +
"d #c3c3c3;\r\n        position: relative;\r\n    }\r\n\r\n    .map-eidt-shape .modal-bod" +
"y {\r\n        position: relative;\r\n    }\r\n\r\n    .menu-tach-thua ul {\r\n        lis" +
"t-style-type: none;\r\n        margin: 0;\r\n        padding: 0;\r\n        width: 100" +
"%;\r\n        background-color: #f1f1f1;\r\n    }\r\n\r\n    .menu-tach-thua li a {\r\n   " +
"     display: block;\r\n        color: #000;\r\n        padding: 10px 16px;\r\n       " +
" text-decoration: none;\r\n    }\r\n\r\n        .menu-tach-thua li a i {\r\n            " +
"font-size: 18px;\r\n        }\r\n        /* Change the link color on hover */\r\n     " +
"   .menu-tach-thua li a:hover {\r\n            background-color: #48a0e2;\r\n       " +
"     color: white;\r\n        }\r\n\r\n        .menu-tach-thua li a.active {\r\n        " +
"    background-color: #48a0e2;\r\n            color: white;\r\n        }\r\n\r\n    .tab" +
"le-point {\r\n        max-height: calc(100% - 400px);\r\n        background-color: w" +
"hite;\r\n    }\r\n\r\n    .button-tool {\r\n        margin: 9px;\r\n        display: flex;" +
"\r\n        justify-content: space-between;\r\n    }\r\n\r\n        .button-tool .btn-de" +
"fault {\r\n            width: 45px;\r\n            height: 40px;\r\n        }\r\n\r\n    ." +
"modal-edit-shape .modal-body .footer-map-point {\r\n        position: absolute;\r\n " +
"       bottom: 0px;\r\n        z-index: 10;\r\n        background: white;\r\n        w" +
"idth: calc(100% - 240px);\r\n        padding: 0px;\r\n        height: 390px\r\n    }\r\n" +
"\r\n        .modal-edit-shape .modal-body .footer-map-point .header-point {\r\n     " +
"       display: flex;\r\n            justify-content: space-between;\r\n            " +
"height: 40px;\r\n            align-items: center;\r\n            padding: 0 25px;\r\n " +
"           background: #49aef9;\r\n            color: #fff;\r\n            font-size" +
": 19px;\r\n        }\r\n\r\n    .footer-map-point .context-point {\r\n        padding: 1" +
"2px;\r\n    }\r\n\r\n        .footer-map-point .context-point label {\r\n            fon" +
"t-size: 14px;\r\n            font-weight: 400;\r\n        }\r\n\r\n    .footer-map-point" +
" select {\r\n        border-radius: 0;\r\n        -webkit-box-shadow: none !importan" +
"t;\r\n        box-shadow: none !important;\r\n        color: #858585;\r\n        backg" +
"round-color: #FFF;\r\n        border: 1px solid #D5D5D5;\r\n        padding: 3px 4px" +
";\r\n        height: 30px;\r\n    }\r\n\r\n    .footer-map-point input {\r\n        border" +
"-radius: 0 !important;\r\n        color: #858585;\r\n        background-color: #FFF;" +
"\r\n        border: 1px solid #D5D5D5;\r\n        padding: 5px 4px 6px;\r\n        fon" +
"t-size: 14px;\r\n        font-family: inherit;\r\n        -webkit-box-shadow: none !" +
"important;\r\n        box-shadow: none !important;\r\n        -webkit-transition-dur" +
"ation: .1s;\r\n        transition-duration: .1s;\r\n    }\r\n\r\n    .footer-map-point ." +
"form-actions {\r\n        display: flex;\r\n        background-color: #F5F5F5;\r\n    " +
"    margin-bottom: 20px;\r\n        margin-top: 20px;\r\n        padding: 19px 20px " +
"20px;\r\n        justify-content: center;\r\n    }\r\n\r\n        .footer-map-point .for" +
"m-actions button {\r\n            border-radius: 0px;\r\n            padding: 7px 18" +
"px;\r\n            margin-left: 5px;\r\n        }\r\n\r\n    .footer-map-point .form-gro" +
"up input:disabled, .footer-map-point .form-group input[disabled] {\r\n        colo" +
"r: #848484 !important;\r\n        background-color: #EEE !important;\r\n    }\r\n\r\n   " +
" .footerHide {\r\n        -webkit-animation-name: animationfooter; /* Safari 4.0 -" +
" 8.0 */\r\n        -webkit-animation-duration: 2s; /* Safari 4.0 - 8.0 */\r\n       " +
" animation-name: animationfooter;\r\n        animation-duration: 2s;\r\n        bott" +
"om: -350px !important;\r\n    }\r\n\r\n    .footerShow {\r\n        -webkit-animation-na" +
"me: animationfooter1; /* Safari 4.0 - 8.0 */\r\n        -webkit-animation-duration" +
": 2s; /* Safari 4.0 - 8.0 */\r\n        animation-name: animationfooter1;\r\n       " +
" animation-duration: 2s;\r\n        bottom: 0px;\r\n    }\r\n\r\n    ");

WriteLiteral("@keyframes animationfooter {\r\n        0% {\r\n            bottom: 0px;\r\n        }\r\n" +
"\r\n        100% {\r\n            bottom: -350px;\r\n        }\r\n    }\r\n\r\n    ");

WriteLiteral("@-webkit-keyframes animationfooter {\r\n        0% {\r\n            bottom: 0px;\r\n   " +
"     }\r\n\r\n        100% {\r\n            bottom: -350px;\r\n        }\r\n    }\r\n\r\n    ");

WriteLiteral("@keyframes animationfooter1 {\r\n        0% {\r\n            bottom: -350px;\r\n       " +
" }\r\n\r\n        100% {\r\n            bottom: 0px\r\n        }\r\n    }\r\n\r\n    ");

WriteLiteral(@"@-webkit-keyframes animationfooter1 {
        0% {
            bottom: -350px;
        }

        100% {
            bottom: 0px
        }
    }

    .headerHide {
        -webkit-animation-name: animationheader; /* Safari 4.0 - 8.0 */
        -webkit-animation-duration: 2s; /* Safari 4.0 - 8.0 */
        animation-name: animationheader;
        animation-duration: 2s;
        right: -350px !important;
    }

    .headerShow {
        -webkit-animation-name: animationheader1; /* Safari 4.0 - 8.0 */
        -webkit-animation-duration: 2s; /* Safari 4.0 - 8.0 */
        animation-name: animationheader1;
        animation-duration: 2s;
        right: 0px;
    }

    ");

WriteLiteral("@keyframes animationheader {\r\n        0% {\r\n            right: 0px;\r\n        }\r\n\r" +
"\n        100% {\r\n            right: -355px;\r\n        }\r\n    }\r\n\r\n    ");

WriteLiteral("@-webkit-keyframes animationheader {\r\n        0% {\r\n            right: 0px;\r\n    " +
"    }\r\n\r\n        100% {\r\n            right: -355px;\r\n        }\r\n    }\r\n\r\n    ");

WriteLiteral("@keyframes animationheader1 {\r\n        0% {\r\n            right: -355px;\r\n        " +
"}\r\n\r\n        100% {\r\n            right: 0px;\r\n        }\r\n    }\r\n\r\n    ");

WriteLiteral("@-webkit-keyframes animationheader1 {\r\n        0% {\r\n            right: -355px;\r\n" +
"        }\r\n\r\n        100% {\r\n            right: 0px;\r\n        }\r\n    }\r\n\r\n    .m" +
"odal-edit-shape .btn-footer {\r\n        /*position: absolute;*/\r\n        bottom: " +
"0px;\r\n        width: 100%;\r\n        display: flex;\r\n    }\r\n\r\n        .modal-edit" +
"-shape .btn-footer button {\r\n            width: 50%;\r\n            border-radius:" +
" 0px;\r\n        }\r\n\r\n    .modal-edit-shape .clearPoint {\r\n        cursor: pointer" +
";\r\n        color: #ed4f4f;\r\n    }\r\n\r\n        .modal-edit-shape .clearPoint:hover" +
" {\r\n            cursor: pointer;\r\n            color: #f5a8a8;\r\n        }\r\n\r\n    " +
".menu-case-edit-shap {\r\n        display: flex;\r\n    }\r\n\r\n        .menu-case-edit" +
"-shap .btn-common-case {\r\n            width: 50%;\r\n            border-radius: 0p" +
"x;\r\n        }\r\n\r\n    .modal-edit-shape .menu-case-edit-shap .btn-default {\r\n    " +
"    background-color: #f4f4f4;\r\n        color: #444;\r\n        width: 50%;\r\n     " +
"   border-radius: 0px;\r\n        border: 0px;\r\n    }\r\n\r\n    .active-case {\r\n     " +
"   background-color: #48a0e2 !important;\r\n        color: #fff !important;\r\n    }" +
"\r\n\r\n    select[name=select-all-point-change] {\r\n        border-radius: 0;\r\n     " +
"   -webkit-box-shadow: none !important;\r\n        box-shadow: none !important;\r\n " +
"       color: #858585;\r\n        background-color: #FFF;\r\n        border: 1px sol" +
"id #D5D5D5;\r\n        padding: 3px 4px;\r\n        height: 30px;\r\n    }\r\n\r\n    .nha" +
"p-point, .point-change {\r\n        padding: 5px;\r\n    }\r\n\r\n    .point-change {\r\n " +
"       height: 65px;\r\n    }\r\n\r\n    .modal-edit-shape .btn-ghi-diem-nhap {\r\n     " +
"   width: 100%;\r\n        border-radius: 0px !important;\r\n        border: 0px !im" +
"portant;\r\n    }\r\n\r\n\r\n    ");

WriteLiteral(@"@media (max-height: 810px) {

        .modal-edit-shape .footer-map-point .context-point {
            padding: 5px !important;
        }

        .modal-edit-shape .col-xs-12, .modal-edit-shape .col-sm-8,
        .modal-edit-shape .col-xs-6, .modal-edit-shape .col-sm-2,
        .modal-edit-shape .col-md-4, .modal-edit-shape .col-sm-12,
        .modal-edit-shape .col-sm-10, .modal-edit-shape .col-sm-4 {
            padding-right: 5px !important;
            padding-left: 5px !important;
        }

        .modal-edit-shape .modal-body .footer-map-point {
            height: 320px !important;
        }

        .modal-edit-shape .footer-map-point .form-actions {
            margin-bottom: 5px;
            margin-top: 5px;
        }

        .modal-edit-shape .footer-map-point {
            padding: 0px !important;
        }

        .modal-edit-shape .footerHide {
            -webkit-animation-name: animationfooter; /* Safari 4.0 - 8.0 */
            -webkit-animation-duration: 2s; /* Safari 4.0 - 8.0 */
            animation-name: animationfooter;
            animation-duration: 2s;
            bottom: -280px !important;
        }
    }
    /*------------------------------------------------------------*/

</style>");

        }
    }
}
#pragma warning restore 1591
