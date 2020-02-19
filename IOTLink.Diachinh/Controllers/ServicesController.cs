using IOTLink.Diachinh.Sevice;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace IOTLink.Diachinh.Controllers
{
    public class ServicesController : Controller
    {
        private FileManager fileManag = new FileManager();
        // GET: Services
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult Save_svg(string param, string maxa, string sothututhua, string sohieutobando)
        {
            try
            {
                string url = "";
                string makvhc = maxa;
                string innertextsvg = "version = '1.1' xmlns = 'http://www.w3.org/2000/svg' xmlns:xlink = 'http://www.w3.org/1999/xlink' ";
                param = param.Replace("id='single-map-div2_gc'", "id = 'single-map-div2_gc'" + " " + innertextsvg);
                param = param.ToString();
                param = param.Replace("\\\"", "'");
                param = param.Replace("id='single-map-div2_gc'", "id = 'single-map-div2_gc'" + " " + innertextsvg);
                param = param.Replace("\"", "");

                var graphic = param.ToCharArray();
                byte[] graphicBytes = new byte[2 * graphic.Length];
                System.Buffer.BlockCopy(graphic, 0, graphicBytes, 0, graphicBytes.Length);
                var bytes = System.Text.Encoding.UTF8.GetBytes(param);
                url = fileManag.saveFile(maxa, bytes, maxa + "_" + sohieutobando + "_" + sothututhua + ".svg", out makvhc);
                if (System.IO.File.Exists(url))
                    return Json(true, JsonRequestBehavior.AllowGet);
                else
                    return Json(false, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}