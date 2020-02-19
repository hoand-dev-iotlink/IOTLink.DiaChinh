using IOTLink.Diachinh.Models;
using IOTLink.Diachinh.Sevice;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace IOTLink.Diachinh.Controllers
{
    public class HomeController : Controller
    {
        private GdalUtilities gdalUtilities = new GdalUtilities();

        [CustomAuthorize]
        //[Authorize]
        public ActionResult Index()
        {

            //BSUserInfor ui = (BSUserInfor)Session["BSUserInfor"];
            //ListHuyenXaNguoiDungModel HuyenND = new ListHuyenXaNguoiDungModel()
            //{
            //    Genre = "Huyện",
            //    ListHuyenXaNguoiDungs = new List<ListHuyenXaNguoiDung>()
            //};
            ListHuyenXaNguoiDungModel XaNguoiDung = new ListHuyenXaNguoiDungModel()
            {
                Genre = "Xã",
                ListHuyenXaNguoiDungs = new List<ListHuyenXaNguoiDung>()
            };
            
            XaNguoiDung.ListHuyenXaNguoiDungs = XaNguoiDung.ListHuyenXaNguoiDungs.OrderBy(x => x.Name).ToList();
            ViewBag.HuyenNguoiDung = XaNguoiDung;
            ViewBag.BanDoXaID = "20272";
            return View();
        }
        [HttpPost]
        public ActionResult ExportFileShape(ExportFileViewModel exportFile)
        {
            try
            {
                CheckFolder();
                string IdGui = Guid.NewGuid().ToString();
                //string filePath = Path.Combine(_hostingEnvironment.WebRootPath + "\\Document", "ThuaDat_" + IdGui + ".json");
                //string filePath = Path.Combine(Server.MapPath("~/Document"), "ThuaDat_" + IdGui + ".json");
                //System.IO.File.WriteAllText(filePath, exportFile.shapeJson);
                bool check = false;
                if (exportFile.category == "SHP")
                {
                    //ShapeJsonViewModel shapeJsonViewModel = JsonConvert.DeserializeObject<ShapeJsonViewModel>(exportFile.shapeJson);
                    //if (shapeJsonViewModel == null)
                    //{
                    //    return Json(new { code = "fail", result = "Lỗi không thể convert ShapeJson" }, JsonRequestBehavior.AllowGet);
                    //}
                    ////bool createshapefilebool = ExportShapefileDataWriter(shapeJsonViewModel);
                    //if (!createshapefilebool)
                    //{
                    //    return Json(new { code = "fail", result = "Lỗi không thể tạo shapefile" }, JsonRequestBehavior.AllowGet);
                    //}
                    string namefile = "ThuaDat_" + IdGui + ".shp";
                    string filePathShape = Path.Combine(Server.MapPath("~/Document/ShapeFile"), "ThuaDat_" + IdGui + ".shp");
                    string filePathZip = Path.Combine(Server.MapPath("~/Document/ShapeFile"), "ThuaDat_" + IdGui + ".zip");
                    //check = gdalUtilities.convertJsonToShapeFile(filePath, filePathShape);
                    check = gdalUtilities.ConvertJsonToShapeFileNew(exportFile.shapeJson, filePathShape, namefile);
                    if (check)
                    {
                        string filesPathName = filePathShape.Substring(0, filePathShape.Length - 4);
                        if (Directory.Exists(filesPathName))
                            Directory.Delete(filesPathName, true);
                        return Json(new { code = "ok", result = "ThuaDat_" + IdGui + ".zip" }, JsonRequestBehavior.AllowGet);
                    }
                }
                if (exportFile.category == "KML")
                {
                    string filePathKML = Path.Combine(Server.MapPath("~/Document/KML"), "ThuaDat_" + IdGui + ".KML");
                    dynamic json = JsonConvert.DeserializeObject(exportFile.shapeJson);
                    check = gdalUtilities.ConvertJsonToKML(json, filePathKML);
                    if (check)
                    {
                        if (System.IO.File.Exists(filePathKML))
                        {
                            System.IO.File.Delete(filePathKML);
                        }
                    }
                    return Json(new { code = "ok", result = "ThuaDat_" + IdGui + ".zip" }, JsonRequestBehavior.AllowGet);
                }

                return Json(true, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { code = "fail", result = ex.Message.ToString() }, JsonRequestBehavior.AllowGet);
                throw;
            }

        }
        public ActionResult DownloadFile(string filePath, string type)
        {
            try
            {
                if (type == "SHP")
                {
                    //string filePathZip = Path.Combine(_hostingEnvironment.WebRootPath + "\\Document\\ShapeFile", filePath);
                    string filePathZip = Path.Combine(Server.MapPath("~/Document/ShapeFile"), filePath);
                    byte[] finalResult = System.IO.File.ReadAllBytes(filePathZip);
                    if (System.IO.File.Exists(filePathZip))
                    {
                        System.IO.File.Delete(filePathZip);
                    }
                    return File(finalResult, "application/zip", Path.GetFileName(filePathZip));
                }
                if (type == "KML")
                {
                    string filePathZip = Path.Combine(Server.MapPath("~/Document/KML"), filePath);
                    //string filePathZip = Path.Combine(_hostingEnvironment.WebRootPath + "\\Document\\KML", filePath);
                    byte[] finalResult = System.IO.File.ReadAllBytes(filePathZip);
                    if (System.IO.File.Exists(filePathZip))
                    {
                        System.IO.File.Delete(filePathZip);
                    }
                    return File(finalResult, "application/zip", Path.GetFileName(filePathZip));
                }
                byte[] s1 = new byte[] { };
                return File(s1, "application/zip", filePath);
            }
            catch (Exception ex)
            {
                byte[] s = new byte[] { };
                return File(s, "application/zip", filePath);
            }

        }

        [HttpGet]
        public ActionResult Login(string returnUrl)
        {        
            ViewBag.ReturnUrl = returnUrl;
            return View();
        }

        [HttpPost]
        public ActionResult Login(LoginViewModel model, string returnUrl = "")
        {
            if (ModelState.IsValid)
            {
                var usernamedefault = ConfigurationManager.AppSettings["UserName"];
                var passworddefault = ConfigurationManager.AppSettings["Password"];
                if (model.Username.Equals(usernamedefault) && model.Password.Equals(passworddefault))
                {
                    CustomPrincipalSerializeModel serializeModel = new CustomPrincipalSerializeModel();
                    serializeModel.UserName = model.Username;
                    string[] role = { "Admin" };
                    serializeModel.roles = role;
                    string userData = JsonConvert.SerializeObject(serializeModel);
                    FormsAuthenticationTicket authenticationTicket = new FormsAuthenticationTicket(
                        1, 
                        model.Username, 
                        DateTime.Now, 
                        DateTime.Now.AddDays(1), 
                        false, 
                        userData
                        );
                    string encTicket = FormsAuthentication.Encrypt(authenticationTicket);
                    HttpCookie faCookie = new HttpCookie("DIACHINH_IOTLINK", encTicket);
                    faCookie.Expires = DateTime.Now.AddDays(1);
                    Response.Cookies.Add(faCookie);
                    if (string.IsNullOrEmpty(returnUrl))
                    {
                        return this.Json(new
                        {
                            Message = "/Home/Index",

                            Status = true,
                        }, JsonRequestBehavior.AllowGet);
                        //return RedirectToAction("Index");
                    }
                    else
                    {
                        return this.Json(new
                        {
                            Message = returnUrl,

                            Status = true,
                        }, JsonRequestBehavior.AllowGet);
                    }
                }
                else
                {
                    return this.Json(new
                    {
                        Message = "Đăng nhập thất bại! Vui lòng kiểm tra lại thông tin đăng nhập",

                        Status = false,
                    }, JsonRequestBehavior.AllowGet);
                }
            }
            //ModelState.AddModelError(string.Empty, "Đăng nhập không thành công! Vui lòng kiểm tra lại thông tin đăng nhập");
            return View(model);
        }

        [AllowAnonymous]
        public ActionResult LogOut()
        {
            if (this.ControllerContext.HttpContext.Request.Cookies.AllKeys.Contains("DIACHINH_IOTLINK"))
            {
                HttpCookie cookie = this.ControllerContext.HttpContext.Request.Cookies["DIACHINH_IOTLINK"];
                cookie.Expires = DateTime.Now.AddDays(-10);
                this.ControllerContext.HttpContext.Response.Cookies.Add(cookie);
            }
            FormsAuthentication.SignOut();
            return RedirectToAction("Login");
        }

        public ActionResult AccessDenied()
        {
            return View();
        }

        private void CheckFolder()
        {
            string document = Server.MapPath("~/Document");
            if (!(Directory.Exists(document)))
            {
                Directory.CreateDirectory(document);
            }
            string shapfile = Server.MapPath("~/Document/ShapeFile");
            if (!(Directory.Exists(shapfile)))
            {
                Directory.CreateDirectory(shapfile);
            }
            string filePathKML = Server.MapPath("~/Document/KML");
            if (!(Directory.Exists(filePathKML)))
            {
                Directory.CreateDirectory(filePathKML);
            }
        }

        private ActionResult RedirectToLocal(string returnUrl)
        {
            if (Url.IsLocalUrl(returnUrl))
            {
                return Redirect(returnUrl);
            }

            return RedirectToAction("Index", "Home");
        }
    }
}