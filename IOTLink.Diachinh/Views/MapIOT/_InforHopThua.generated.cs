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
    [System.Web.WebPages.PageVirtualPathAttribute("~/Views/MapIOT/_InforHopThua.cshtml")]
    public partial class _Views_MapIOT__InforHopThua_cshtml : System.Web.Mvc.WebViewPage<dynamic>
    {
        public _Views_MapIOT__InforHopThua_cshtml()
        {
        }
        public override void Execute()
        {
WriteLiteral("<div");

WriteLiteral(" class=\"modal form-infor-hop-thua\"");

WriteLiteral(">\r\n    <div");

WriteLiteral(" class=\"modal-dialog\"");

WriteLiteral(">\r\n        <div");

WriteLiteral(" class=\"modal-content\"");

WriteLiteral(">\r\n            <!-- Modal Header -->\r\n            <div");

WriteLiteral(" class=\"modal-header\"");

WriteLiteral(" style=\"padding-bottom:0;\"");

WriteLiteral(">\r\n                <h4");

WriteLiteral(" class=\"modal-title\"");

WriteLiteral(">Cập nhật thông tin hợp thửa</h4>\r\n                <button");

WriteLiteral(" type=\"button\"");

WriteLiteral(" id=\"close-modal\"");

WriteLiteral(" class=\"close close-modal-iotlink\"");

WriteLiteral(" data-dismiss=\"modal\"");

WriteLiteral(">&times;</button>\r\n            </div>\r\n\r\n            <!-- Modal body -->\r\n       " +
"     <div");

WriteLiteral(" class=\"modal-body\"");

WriteLiteral(">\r\n                <div");

WriteLiteral(" class=\"row form-group\"");

WriteLiteral(">\r\n                    <label");

WriteLiteral(" class=\"control-label col-md-4 col-xs-12 required\"");

WriteLiteral(">Số hiệu tờ bản đồ <span");

WriteLiteral(" style=\"color:red\"");

WriteLiteral(">*</span></label>\r\n                    <div");

WriteLiteral(" class=\"col-md-8 col-xs-12\"");

WriteLiteral(">\r\n                        <div");

WriteLiteral(" class=\"col-sm-12\"");

WriteLiteral(">\r\n                            <div");

WriteLiteral(" class=\"form-group\"");

WriteLiteral(">\r\n                                <input");

WriteLiteral(" type=\"number\"");

WriteLiteral(" id=\"text-update-soTo\"");

WriteLiteral(" class=\"form-control form-style\"");

WriteLiteral(" placeholder=\"Số hiệu tờ bản đồ\"");

WriteLiteral(" value=\"0\"");

WriteLiteral(" />\r\n                            </div>\r\n                        </div>\r\n        " +
"            </div>\r\n                </div>\r\n                <div");

WriteLiteral(" class=\"row form-group\"");

WriteLiteral(">\r\n                    <label");

WriteLiteral(" class=\"control-label col-md-4 col-xs-12 required\"");

WriteLiteral(">Số thứ tự thửa <span");

WriteLiteral(" style=\"color:red\"");

WriteLiteral(">*</span></label>\r\n                    <div");

WriteLiteral(" class=\"col-md-8 col-xs-12\"");

WriteLiteral(">\r\n                        <div");

WriteLiteral(" class=\"col-sm-12\"");

WriteLiteral(">\r\n                            <div");

WriteLiteral(" class=\"form-group\"");

WriteLiteral(">\r\n                                <input");

WriteLiteral(" type=\"number\"");

WriteLiteral(" id=\"text-update-soThua\"");

WriteLiteral(" class=\"form-control form-style\"");

WriteLiteral(" placeholder=\"Số thứ tự thửa\"");

WriteLiteral(" value=\"0\"");

WriteLiteral(" />\r\n                            </div>\r\n                        </div>\r\n        " +
"            </div>\r\n                </div>\r\n                <div");

WriteLiteral(" class=\"row form-group\"");

WriteLiteral(">\r\n                    <label");

WriteLiteral(" class=\"control-label col-md-4 col-xs-12 required\"");

WriteLiteral(">Tờ bản đồ cũ</label>\r\n                    <div");

WriteLiteral(" class=\"col-md-8 col-xs-12\"");

WriteLiteral(">\r\n                        <div");

WriteLiteral(" class=\"col-sm-12\"");

WriteLiteral(">\r\n                            <div");

WriteLiteral(" class=\"form-group\"");

WriteLiteral(">\r\n                                <input");

WriteLiteral(" type=\"number\"");

WriteLiteral(" id=\"text-update-soTo-old\"");

WriteLiteral(" class=\"form-control form-style\"");

WriteLiteral(" placeholder=\"Tờ bản đồ cũ\"");

WriteLiteral(" value=\"0\"");

WriteLiteral(" />\r\n                            </div>\r\n                        </div>\r\n        " +
"            </div>\r\n                </div>\r\n                <div");

WriteLiteral(" class=\"row form-group\"");

WriteLiteral(">\r\n                    <label");

WriteLiteral(" class=\"control-label col-md-4 col-xs-12 required\"");

WriteLiteral(">Thửa cũ</label>\r\n                    <div");

WriteLiteral(" class=\"col-md-8 col-xs-12\"");

WriteLiteral(">\r\n                        <div");

WriteLiteral(" class=\"col-sm-12\"");

WriteLiteral(">\r\n                            <div");

WriteLiteral(" class=\"form-group\"");

WriteLiteral(">\r\n                                <input");

WriteLiteral(" type=\"number\"");

WriteLiteral(" id=\"text-update-soThua-old\"");

WriteLiteral(" class=\"form-control form-style\"");

WriteLiteral(" placeholder=\"Thửa cũ\"");

WriteLiteral(" value=\"0\"");

WriteLiteral(" />\r\n                            </div>\r\n                        </div>\r\n        " +
"            </div>\r\n                </div>\r\n                <div");

WriteLiteral(" class=\"row form-group\"");

WriteLiteral(">\r\n                    <label");

WriteLiteral(" class=\"control-label col-md-4 col-xs-12 required\"");

WriteLiteral(">Diện tích <span");

WriteLiteral(" style=\"color:red\"");

WriteLiteral(">*</span></label>\r\n                    <div");

WriteLiteral(" class=\"col-md-8 col-xs-12\"");

WriteLiteral(">\r\n                        <div");

WriteLiteral(" class=\"col-sm-12\"");

WriteLiteral(">\r\n                            <div");

WriteLiteral(" class=\"form-group\"");

WriteLiteral(">\r\n                                <input");

WriteLiteral(" type=\"text\"");

WriteLiteral(" id=\"text-update-dienTich\"");

WriteLiteral(" class=\"form-control form-style\"");

WriteLiteral(" placeholder=\"Diện tích\"");

WriteLiteral(" value=\"\"");

WriteLiteral(" oninput=\"this.value = this.value.replace(/[^0-9.]/g, \'\').replace(/(\\..*)\\./g, \'$" +
"1\');\"");

WriteLiteral(" />\r\n                            </div>\r\n                        </div>\r\n        " +
"            </div>\r\n                </div>\r\n                <div");

WriteLiteral(" class=\"row form-group\"");

WriteLiteral(">\r\n                    <label");

WriteLiteral(" class=\"control-label col-md-4 col-xs-12 required\"");

WriteLiteral(">Diện tích pháp lý <span");

WriteLiteral(" style=\"color:red\"");

WriteLiteral(">*</span></label>\r\n                    <div");

WriteLiteral(" class=\"col-md-8 col-xs-12\"");

WriteLiteral(">\r\n                        <div");

WriteLiteral(" class=\"col-sm-12\"");

WriteLiteral(">\r\n                            <div");

WriteLiteral(" class=\"form-group\"");

WriteLiteral(">\r\n                                <input");

WriteLiteral(" type=\"text\"");

WriteLiteral(" id=\"text-update-dienTichPhapLy\"");

WriteLiteral(" class=\"form-control form-style\"");

WriteLiteral(" placeholder=\"Diện tích pháp lý\"");

WriteLiteral(" value=\"\"");

WriteLiteral(" oninput=\"this.value = this.value.replace(/[^0-9.]/g, \'\').replace(/(\\..*)\\./g, \'$" +
"1\');\"");

WriteLiteral(" />\r\n                            </div>\r\n                        </div>\r\n        " +
"            </div>\r\n                </div>\r\n                <div");

WriteLiteral(" class=\"row form-group\"");

WriteLiteral(">\r\n                    <label");

WriteLiteral(" class=\"control-label col-md-4 col-xs-12 required\"");

WriteLiteral(">Mục đích sử dụng <span");

WriteLiteral(" style=\"color:red\"");

WriteLiteral(">*</span></label>\r\n                    <div");

WriteLiteral(" class=\"col-md-8 col-xs-12\"");

WriteLiteral(">\r\n                        <div");

WriteLiteral(" class=\"col-sm-12\"");

WriteLiteral(">\r\n                            <div");

WriteLiteral(" class=\"form-group\"");

WriteLiteral(">\r\n                                <select");

WriteLiteral(" class=\"form-control KH-select\"");

WriteLiteral(" id = \"KH-listselectid\">\r\n                                     ");

WriteLiteral("\r\n                                    ");

WriteLiteral("\r\n                                  </select>\r\n                            </div>" +
"\r\n                        </div>\r\n                    </div>\r\n                </" +
"div>\r\n                <div");

WriteLiteral(" class=\"row form-group\"");

WriteLiteral(">\r\n                    <label");

WriteLiteral(" class=\"control-label col-md-4 col-xs-12 required\"");

WriteLiteral(">Tên chủ</label>\r\n                    <div");

WriteLiteral(" class=\"col-md-8 col-xs-12\"");

WriteLiteral(">\r\n                        <div");

WriteLiteral(" class=\"col-sm-12\"");

WriteLiteral(">\r\n                            <div");

WriteLiteral(" class=\"form-group\"");

WriteLiteral(">\r\n                                <input");

WriteLiteral(" type=\"text\"");

WriteLiteral(" id=\"text-update-chuNha\"");

WriteLiteral(" class=\"form-control form-style\"");

WriteLiteral(" placeholder=\"Tên chủ sở hữu\"");

WriteLiteral(" value=\"\"");

WriteLiteral(" />\r\n                            </div>\r\n                        </div>\r\n        " +
"            </div>\r\n                </div>\r\n                <div");

WriteLiteral(" class=\"row form-group\"");

WriteLiteral(">\r\n                    <label");

WriteLiteral(" class=\"control-label col-md-4 col-xs-12 required\"");

WriteLiteral(">Địa chỉ</label>\r\n                    <div");

WriteLiteral(" class=\"col-md-8 col-xs-12\"");

WriteLiteral(">\r\n                        <div");

WriteLiteral(" class=\"col-sm-12\"");

WriteLiteral(">\r\n                            <div");

WriteLiteral(" class=\"form-group\"");

WriteLiteral(">\r\n                                <input");

WriteLiteral(" type=\"text\"");

WriteLiteral(" id=\"text-update-diaChi\"");

WriteLiteral(" class=\"form-control form-style\"");

WriteLiteral(" placeholder=\"Địa chỉ\"");

WriteLiteral(" value=\"\"");

WriteLiteral(" />\r\n                            </div>\r\n                        </div>\r\n        " +
"            </div>\r\n                </div>\r\n            </div>\r\n            <!--" +
" Modal footer -->\r\n            <div");

WriteLiteral(" class=\"modal-footer\"");

WriteLiteral(">\r\n                <button");

WriteLiteral(" type=\"button\"");

WriteLiteral(" class=\"btn btn-default\"");

WriteLiteral(" data-dismiss=\"modal\"");

WriteLiteral(">Hủy bỏ</button>\r\n                <button");

WriteLiteral(" type=\"button\"");

WriteLiteral(" class=\"btn btn-primary btn-infor-hop-thua\"");

WriteLiteral(">Lưu hợp thửa</button>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>");

        }
    }
}
#pragma warning restore 1591
