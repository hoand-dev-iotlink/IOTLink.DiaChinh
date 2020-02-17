using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;
using FTILIS.Services.Library.Infrastructure.UpdateDatasFromDGN;
using FTILIS.Services.Library.Infrastructure.Services;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using WebGIS.ViewModels;
using FTILIS.Web.FrameWork.Base;
using GeoAPI.Geometries;
using System.Diagnostics;
using AppCore.Models;
using FTILIS.Libraries.Data.SSO.Params;
using FTILIS.Services.Library.Models.LandAndRelateObject;
using FTILIS.Services.Library.Infrastructure;
using FTILIS.Services.Library.Model;
using FTILIS.Services.Library.Infrastructure.FileManager;
using System.Net.Http;
using System.Net.Http.Headers;

namespace IOTLink.Diachinh.Controllers
{
    public class ServicesController : Controller
    {
        private readonly string ProvinceCode = "86";

        //public FileResult getLandAndRelationObject()
        //{
        //    var data = new LandAndRelateObjectParam();
        //    data.MaKVHC = "20272";
        //    data.ProvinceCode = "48";
        //    data.LandInfors = new List<LandInfor>();
        //    //var item = new LandInfor { SoThua = "45", SoTo = "33" };
        //    //data.LandInfors.Add(item);
        //    //item = new LandInfor { SoThua = "90", SoTo = "28" };
        //    //data.LandInfors.Add(item);
        //    //item = new LandInfor { SoThua = "85", SoTo = "33" };
        //    //data.LandInfors.Add(item);
        //    //item = new LandInfor { SoThua = "10", SoTo = "10" };
        //    //data.LandInfors.Add(item);
        //    data.isGetDataForEdit = true;
        //    string path = "";
        //    HttpResponseMessage ret;
        //    var di = ProvinceInfor.GetProvinceInfor(data.ProvinceCode);
        //    //di.DistrictCentralMeridian = 109;

        //    if (di != null)
        //    {
        //        path = LandAndRelationObject.getLandData(data, di);
        //    }

        //    byte[] fileBytes;
        //    string fileName;
        //    if (System.IO.File.Exists(path))
        //    {
        //        fileBytes = System.IO.File.ReadAllBytes(path);
        //        fileName = "Land_In_EPSG4326.kml";
        //    }
        //    else
        //    {
        //        fileBytes = new byte[0];
        //        fileName = "CanNotGetData.kml";
        //    }

        //    return File(fileBytes, System.Net.Mime.MediaTypeNames.Application.Octet, fileName);

        //    //return Content("{" + path + "}", "application/json");
        //}

        //khoanb cập nhật thửa đất

        //check thửa tồn tại trên server
        public ActionResult checkthuaserver(string maxa, string sothua, string soto, string FeatureServiceLink, int ThuaDatIndex)
        {
            bool tontai = false;

            try
            {


                //path = LandAndRelationObject.getLandData_shapefile(data, di); 
                tontai = LandAndRelationObject.checkthuatontai(maxa, sothua, soto, FeatureServiceLink, ThuaDatIndex);


            }
            catch (Exception ex)
            {
                throw ex;
            }


            return Json(tontai, JsonRequestBehavior.AllowGet);

            //  return Content("{" + path + "}", "application/json");
        }

        public ActionResult checkthuacapnhat(string thuacu, string tocu, string xacu, string thuamoi, string tomoi)
        {
            var cothua = false;
            //if (thuacu != thuamoi || tocu != tomoi)
            //{
            decimal sothuamoi = decimal.Parse(thuamoi);
            decimal sotomoi = decimal.Parse(tomoi);
            decimal sothuacu = decimal.Parse(thuacu);
            decimal sotocu = decimal.Parse(tocu);
            using (FTILISEntities dbCommon = new FTILISEntities())
            {
                var objxa = (from item in dbCommon.HC_DMKVHC where item.MAXA == xacu select item).FirstOrDefault();
                if (objxa != null)
                {
                    var objthuadatmoi = (from item in dbCommon.DC_THUADAT where item.SOTHUTUTHUA == sothuamoi && item.SOHIEUTOBANDO == sotomoi && item.XAID == objxa.KVHCID select item).FirstOrDefault();
                    var objthuadatcu = (from item in dbCommon.DC_THUADAT where item.SOTHUTUTHUA == sothuacu && item.SOHIEUTOBANDO == sotocu && item.XAID == objxa.KVHCID select item).FirstOrDefault();
                    //if (objthuadatcu != null)
                    //{
                    //    if (objthuadatmoi != null)
                    //    {
                    //        objthuadatmoi.COTHUABD = "Y";
                    //        objthuadatcu.COTHUABD = "N";
                    //        cothua = true;
                    //    }
                    //    else
                    //    {
                    //        //objthuadatmoi.COTHUABD = "N";
                    //        objthuadatcu.COTHUABD = "N";
                    //        cothua = true;

                    //    }
                    //}
                }
                //}
                //else
                //{
                //    cothua = false;
                //}
            }


            return Json(cothua, JsonRequestBehavior.AllowGet);
        }

        public ActionResult thuacapnhat(string thuacu, string tocu, string xacu, string thuamoi, string tomoi, string geometry)
        {
            //geometry = geometry.Substring(1, geometry.Length - 1);
            //geometry = geometry.Substring(0, geometry.Length - 1);
            var message = "";
            var idxa = "";
            //if (thuacu != thuamoi || tocu != tomoi)
            //{
            decimal sothuamoi = decimal.Parse(thuamoi);
            decimal sotomoi = decimal.Parse(tomoi);
            decimal sothuacu = decimal.Parse(thuacu);
            decimal sotocu = decimal.Parse(tocu);
            using (FTILISEntities dbCommon = new FTILISEntities())
            {
                var objxa = (from item in dbCommon.HC_DMKVHC where item.MAXA == xacu select item).FirstOrDefault();
                if (objxa != null)
                {
                    idxa = objxa.KVHCID;
                    var objthuadatmoi = (from item in dbCommon.DC_THUADAT where item.SOTHUTUTHUA == sothuamoi && item.SOHIEUTOBANDO == sotomoi && item.XAID == objxa.KVHCID select item).FirstOrDefault();
                    var objthuadatcu = (from item in dbCommon.DC_THUADAT where item.SOTHUTUTHUA == sothuacu && item.SOHIEUTOBANDO == sotocu && item.XAID == objxa.KVHCID select item).FirstOrDefault();
                    //if (objthuadatcu != null)
                    //{
                    //    if (objthuadatmoi != null)
                    //    {
                    //        objthuadatmoi.COTHUABD = "Y";
                    //        objthuadatcu.COTHUABD = "N";
                    //        objthuadatcu.GEOMETRY = geometry;
                    //        dbCommon.context.SaveChanges();
                    //        //  message = true;
                    //    }
                    //    else
                    //    {
                    //        //objthuadatmoi.COTHUABD = "N";
                    //        objthuadatcu.COTHUABD = "N";
                    //        objthuadatcu.GEOMETRY = geometry;
                    //        dbCommon.context.SaveChanges();
                    //        // message = true;
                    //    }

                    //}
                }
                var objthuadatcu1 = (from item in dbCommon.DC_THUADAT where item.SOTHUTUTHUA == sothuacu && item.SOHIEUTOBANDO == sotocu && item.XAID == idxa select item).FirstOrDefault();
                message = objthuadatcu1.GEOMETRY;

                // }
            }

            return Json(message, JsonRequestBehavior.AllowGet);

        }
        public ActionResult capnhatthuadat(string sothututhuadat, string sohieutobando, string maxa_th, List<string> listGeometry, List<toado> toado)
        {

            List<string> listgeo = new List<string>();
            List<toado> listtoado = new List<toado>();

            foreach (string str in listGeometry)
            {
                string geometry = "";
                string geochuan = "";
                //string geo = "";
                //foreach(var data in toado.cou)
                // dynamic objs = JsonConvert.DeserializeObject(toado[0]);
                bool co = false;
                foreach (var data in toado)
                {
                    string[] geo = str.Split(new string[] { "_ring" }, StringSplitOptions.None);
                    string[] thuoctinh = geo[1].ToString().Split(new string[] { "attributes" }, StringSplitOptions.None);
                    string strgeo = geo[0].ToString().Substring(1, geo[0].ToString().Length - 1);
                    string strproperty = thuoctinh[1].ToString().Replace("}}", "}");
                    strproperty = "[{\"attributes" + strproperty;
                    geometry = (strproperty + "," + strgeo + "}}]").Replace("]]],\"}}]", "]]]}}]");
                    if (geometry.Contains(data.toadocu))
                    {
                        geochuan = geometry.Replace(data.toadocu.ToString(), data.toadomoi.ToString());
                        co = true;
                    }
                }
                if (co)
                { listgeo.Add(geochuan); }

            }
            //   string duongdan = "aaaaaaaaaaaaaaaaaaaaaaaaaaa";

            return Json(listgeo, JsonRequestBehavior.AllowGet);

            //  return Content("{" + path + "}", "application/json");
        }
        public ActionResult themdinhthuadat(string sothututhuadat, string sohieutobando, string maxa_th, List<string> listGeometry, List<toadothem> dsdiemthem, List<toadoxoa> dsdiemxoa, List<diem> dsdiem, int rings)
        {

            List<string> listgeo = new List<string>();
            List<toadothem> listtoado = new List<toadothem>();

            for (int i = 0; i <= listGeometry.Count - 1; i++)
            {
                bool co = false;
                string str = "";
                str = listGeometry[i];
                string geometry = "";
                string geochuan = "";
                //string geo = "";
                //foreach(var data in toado.cou)
                // dynamic objs = JsonConvert.DeserializeObject(toado[0]);
                //xử lý geo đầu tiên
                string geohientai = "";
                string strproperty = "";
                if (i == 0)
                {

                    List<string> listring = new List<string>();
                    string[] geo = str.Split(new string[] { "_ring" }, StringSplitOptions.None);
                    string[] thuoctinh = geo[1].ToString().Split(new string[] { "attributes" }, StringSplitOptions.None);
                    string strgeo = geo[0].ToString().Substring(1, geo[0].ToString().Length - 1);
                    strproperty = thuoctinh[1].ToString().Replace("}}", "}");
                    //khoanb
                    string[] tachlan1 = geo[0].Split(new string[] { "[[[" }, StringSplitOptions.None);
                    string ghepdau = tachlan1[0];
                    strproperty = "[{\"attributes" + strproperty;
                    string[] tachlan2 = tachlan1[1].Split(new string[] { "]]]" }, StringSplitOptions.None);
                    string ghepcuoi = tachlan2[1];
                    string[] tachlan3 = ("[" + tachlan2[0] + "]").Split(new string[] { "]],[[" }, StringSplitOptions.None); ;
                    for (var k = 0; k <= rings; k++)
                    {
                        string strdiem = "";
                        foreach (var diem1 in dsdiem)
                        {

                            if (k.ToString() == diem1.rings)
                            {
                                strdiem = strdiem + "," + ("[" + diem1.xcu + "," + diem1.ycu + "]");
                            }
                        }
                        strdiem = strdiem.Substring(1, strdiem.Length - 1);
                        listring.Add(strdiem);
                    }
                    for (int x = 0; x <= listring.Count - 1; x++)
                    {
                        string[] sarr;
                        sarr = listring[x].Split(new string[] { ",[" }, StringSplitOptions.None);
                        for (int y = 0; y <= sarr.Count() - 1; y++)
                        {
                            if (!sarr[y].Contains("["))
                            {
                                sarr[y] = "[" + sarr[y];
                            }
                        }

                        string dau = sarr[0];
                        string cuoi = sarr[sarr.Length - 1];
                        var bienmang = sarr.ToArray();
                        List<string> bienmang1 = sarr.ToList();

                        if (dsdiemxoa != null)
                        {
                            foreach (var item in dsdiemxoa)
                            {
                                foreach (var d in bienmang)
                                {
                                    if (d.Contains("[" + item.xyxoa + "]"))
                                    {
                                        //   sarr.ToArray();
                                        bienmang1.Remove(d);


                                    }
                                }
                            }

                        }
                        if (bienmang1[0] != bienmang1[bienmang1.Count - 1])
                        {
                            bienmang1.Add(bienmang1[0]);
                        }
                        string chuoicuoi = "";
                        for (var z = 0; z <= bienmang1.Count - 1; z++)
                        {
                            chuoicuoi = chuoicuoi + "," + bienmang1[z];


                        }
                        chuoicuoi = chuoicuoi.Substring(1, chuoicuoi.Length - 1);
                        if ((x == 0) && (rings != 0))
                        {
                            listring[x] = "[[" + chuoicuoi;
                        }
                        else if ((x == 0) && (rings == 0))
                        {
                            listring[x] = "[[" + chuoicuoi + "]]";
                        }
                        else if (x == listring.Count - 1)
                        {
                            listring[x] = "],[" + chuoicuoi + "]]";
                        }
                        else
                        {
                            listring[x] = "],[" + chuoicuoi;
                        }


                    }
                    for (int c = 0; c <= listring.Count - 1; c++)
                    {
                        geochuan = geochuan + listring[c];
                    }
                    geohientai = ghepdau.Substring(1, ghepdau.Length - 1) + geochuan + ghepcuoi;
                    co = true;



                    geometry = (strproperty + "," + geohientai + "}}]").Replace("]]],\"}}]", "]]]}}]");




                    if (co)
                    {
                        listgeo.Add(geometry);
                    }
                }
                ////Các geometry liền kề
                else
                {
                    string[] geo = str.Split(new string[] { "_ring" }, StringSplitOptions.None);
                    string[] thuoctinh = geo[1].ToString().Split(new string[] { "attributes" }, StringSplitOptions.None);

                    string strgeo = geo[0].ToString().Substring(1, geo[0].ToString().Length - 1);
                    strproperty = thuoctinh[1].ToString().Replace("}}", "}");
                    strproperty = "[{\"attributes" + strproperty;

                    string[] sarr;
                    sarr = strgeo.Split(']');
                    string[] chuoidau = sarr[0].Split('[');
                    string[] chuoicuoi = sarr[sarr.Length - 5].Split('[');
                    string dau = "[" + chuoidau[chuoidau.Length - 1] + "]";
                    string cuoi = "[" + chuoicuoi[chuoicuoi.Length - 1] + "]";
                    if (dsdiemthem != null)
                    {
                        foreach (var data in dsdiemthem)
                        {

                            var toadodiem1 = "[" + data.xy_dau + "]";
                            var toadodiem2 = "[" + data.xy_cuoi + "]";
                            string diemdau = "", diemcuoi = "";


                            if (strgeo.Contains(toadodiem1) && strgeo.Contains(toadodiem2))
                            {

                                if (strgeo.IndexOf(toadodiem1) < strgeo.IndexOf(toadodiem2))
                                {
                                    if (toadodiem1 == dau && toadodiem2 == cuoi)
                                    {
                                        diemcuoi = toadodiem1;
                                        diemdau = toadodiem2;

                                    }
                                    else
                                    {
                                        diemdau = toadodiem1;
                                        diemcuoi = toadodiem2;
                                    }
                                }
                                else
                                {
                                    if (toadodiem1 == cuoi && toadodiem2 == dau)
                                    {

                                        diemdau = toadodiem1;
                                        diemcuoi = toadodiem2;
                                    }
                                    else
                                    {
                                        diemdau = toadodiem2;
                                        diemcuoi = toadodiem1;
                                    }
                                }

                                // } 
                                //    // kiểm tra điểm đầu xuất hiện 2 lần trong chuỗi.
                                bool xh = false;
                                if (geohientai.Equals(""))
                                {
                                    string lan1 = strgeo.Replace(diemdau + ",", "");
                                    if (lan1.Contains(diemdau))
                                    {
                                        xh = true;
                                    }

                                    lan1 = "";
                                }
                                else
                                {
                                    string lan1 = geohientai.Replace(diemdau + ",", "");
                                    if (lan1.Contains(diemdau))
                                    {
                                        xh = true;
                                    }
                                    lan1 = "";
                                }
                                //tách string 
                                if (geohientai.Equals(""))
                                {
                                    if (xh == false)
                                    {
                                        string[] geotach = strgeo.Split(new string[] { diemdau }, StringSplitOptions.None);
                                        strgeo = geotach[0] + diemdau + "," + "[" + data.toadodiemthem + "]" + geotach[1];


                                        geohientai = strgeo;
                                    }
                                    else
                                    {
                                        string[] geotach = strgeo.Split(new string[] { diemdau }, StringSplitOptions.None);
                                        strgeo = geotach[0] + diemdau + "," + "[" + data.toadodiemthem + "]" + geotach[1] + diemdau + geotach[2];


                                        geohientai = strgeo;

                                    }
                                }
                                else
                                {
                                    if (xh == false)
                                    {
                                        string[] geotach = geohientai.Split(new string[] { diemdau }, StringSplitOptions.None);
                                        strgeo = geotach[0] + diemdau + "," + "[" + data.toadodiemthem + "]" + geotach[1];
                                        geohientai = strgeo;
                                    }
                                    else
                                    {

                                        string[] geotach = geohientai.Split(new string[] { diemdau }, StringSplitOptions.None);
                                        strgeo = geotach[0] + diemdau + "," + "[" + data.toadodiemthem + "]" + geotach[1] + diemdau + geotach[2];
                                        geohientai = strgeo;
                                    }

                                }
                                co = true;
                            }

                        }

                    }
                    geometry = (strproperty + "," + geohientai + "}}]").Replace("]]],\"}}]", "]]]}}]");
                    if (co)
                    { listgeo.Add(geometry); }

                }


            }

            return Json(listgeo, JsonRequestBehavior.AllowGet);

        }
        //khoanb services file txt
        public ActionResult getLandAndRelationObject_txt(LandAndRelateObjectParam DOITUONG, string MAXA, string tinh, string geometry, string FeatureServiceLink, int ThuaDatIndex)
        {
            string path = "";
            byte[] fileBytes;
            string fileName;
            // geometry = geometry.Replace("\"type\":\"polygon\",","");
            geometry = "{\"rings\":" + geometry + "}";
            try
            {
                var data = new LandAndRelateObjectParam();
                data = DOITUONG;
                data.MaKVHC = MAXA;
                data.ProvinceCode = tinh;

                if (data.LandInfors.Count > 0)
                {


                    data.isGetDataForEdit = false;
                    var di = ProvinceInfor.GetProvinceInfor(data.ProvinceCode);
                    //di.DistrictCentralMeridian = 109;

                    if (di != null)
                    {
                        //path = LandAndRelationObject.getLandData_shapefile(data, di); 
                        path = LandAndRelationObject.getLandData_shapefile_txt(data, di, geometry, di.ThuaDatServiceLinkLocal, ThuaDatIndex);
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            var duongdan = "";

            if (path != "")
            {
                var url = HttpContext.Request.Url.Authority;
                //fileBytes = System.IO.File.ReadAllBytes(path);
                // fileName = "ThuaDat_shape.zip";
                duongdan = "http://" + url + "/Temp/" + path + "//" + "ThuaDat_txt.zip";
            }
            else
            {
                fileBytes = new byte[0];
                fileName = "CanNotGetData.zip";
            }

            return Json(duongdan, JsonRequestBehavior.AllowGet);

            //  return Content("{" + path + "}", "application/json");
        }

        public ActionResult getLandAndRelationObject_Geo_OpenMap(LandAndRelateObjectParam DOITUONG, string MAXA, string tinh, string geometry, string FeatureServiceLink, int ThuaDatIndex)
        {
            string path = "";
            byte[] fileBytes;
            string fileName;
            // geometry = geometry.Replace("\"type\":\"polygon\",","");
            geometry = "{\"rings\":" + geometry + "}";
            try
            {
                var data = new LandAndRelateObjectParam();
                data = DOITUONG;
                data.MaKVHC = MAXA;
                data.ProvinceCode = tinh;

                if (data.LandInfors.Count > 0)
                {


                    data.isGetDataForEdit = false;
                    var di = ProvinceInfor.GetProvinceInfor(data.ProvinceCode);
                    //di.DistrictCentralMeridian = 109;

                    if (di != null)
                    {
                        //path = LandAndRelationObject.getLandData_shapefile(data, di); 
                        path = LandAndRelationObject.getLandData_geo_OpenMap(data, di, geometry, di.ThuaDatServiceLinkLocal, ThuaDatIndex);
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            var duongdan = "";
            duongdan = path;
            return Json(duongdan, JsonRequestBehavior.AllowGet);

            //  return Content("{" + path + "}", "application/json");
        }
        //export GML
        public ActionResult export_gml(LandAndRelateObjectParam DOITUONG, string MAXA, string tinh, string where, string FeatureServiceLink, int ThuaDatIndex)
        {
            string path = "";
            byte[] fileBytes;
            string fileName;

            try
            {
                var data = new LandAndRelateObjectParam();
                data = DOITUONG;
                data.MaKVHC = MAXA;
                data.ProvinceCode = tinh;

                //if (data.LandInfors.Count > 0)
                //{


                data.isGetDataForEdit = false;
                var di = ProvinceInfor.GetProvinceInfor(data.ProvinceCode);
                //di.DistrictCentralMeridian = 109;

                if (di != null)
                {
                    //path = LandAndRelationObject.getLandData_shapefile(data, di); 
                    path = LandAndRelationObject.getLandData_exportGML(data, di, where, FeatureServiceLink, ThuaDatIndex);
                }
                //}
            }
            catch (Exception ex)
            {
                throw ex;
            }
            var duongdan = "";

            if (path != "")
            {
                var url = HttpContext.Request.Url.Authority;
                //fileBytes = System.IO.File.ReadAllBytes(path);
                // fileName = "ThuaDat_shape.zip";
                duongdan = "http://" + url + "/Temp/" + path + "//Thuadat//" + "ThuaDat_gml.zip";
            }
            else
            {
                fileBytes = new byte[0];
                fileName = "CanNotGetData.gml";
            }

            return Json(duongdan, JsonRequestBehavior.AllowGet);
        }
        //khoanb services file shapefile
        public ActionResult getLandAndRelationObject_Geo(LandAndRelateObjectParam DOITUONG, string MAXA, string tinh, string geometry, string FeatureServiceLink, int ThuaDatIndex)
        {
            string path = "";
            byte[] fileBytes;
            string fileName;
            // geometry = geometry.Replace("\"type\":\"polygon\",","");
            geometry = "{\"rings\":" + geometry + "}";
            try
            {
                var data = new LandAndRelateObjectParam();
                data = DOITUONG;
                data.MaKVHC = MAXA;
                data.ProvinceCode = tinh;

                if (data.LandInfors.Count > 0)
                {


                    data.isGetDataForEdit = false;
                    var di = ProvinceInfor.GetProvinceInfor(data.ProvinceCode);
                    //di.DistrictCentralMeridian = 109;

                    if (di != null)
                    {
                        //path = LandAndRelationObject.getLandData_shapefile(data, di); 
                        path = LandAndRelationObject.getLandData_shapefile_geo(data, di, geometry, di.ThuaDatServiceLinkLocal, ThuaDatIndex);
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            var duongdan = "";

            if (path != "")
            {
                var url = HttpContext.Request.Url.Authority;
                //fileBytes = System.IO.File.ReadAllBytes(path);
                // fileName = "ThuaDat_shape.zip";
                duongdan = "http://" + url + "/Temp/" + path + "//" + "ThuaDat_shape.zip";
            }
            else
            {
                fileBytes = new byte[0];
                fileName = "CanNotGetData.zip";
            }

            return Json(duongdan, JsonRequestBehavior.AllowGet);

            //  return Content("{" + path + "}", "application/json");
        }
        //export SVG
        public ActionResult export_svg(string param, string maxa, string sothututhua, string sohieutobando)
        {
            //  string path = "abc";
            //byte[] fileBytes;
            string url = "";
            string innertextsvg = "version = '1.1' xmlns = 'http://www.w3.org/2000/svg' xmlns:xlink = 'http://www.w3.org/1999/xlink' ";
            param = param.Replace("id='single-map-div2_gc'", "id = 'single-map-div2_gc'" + " " + innertextsvg);
            param = param.ToString();
            param = param.Replace("\\\"", "'");
            param = param.Replace("id='single-map-div2_gc'", "id = 'single-map-div2_gc'" + " " + innertextsvg);
            param = param.Replace("\"", "");
            try
            {
                var graphic = param.ToCharArray();
                byte[] graphicBytes = new byte[2 * graphic.Length];
                System.Buffer.BlockCopy(graphic, 0, graphicBytes, 0, graphicBytes.Length);

                var bytes = System.Text.Encoding.UTF8.GetBytes(param);
                url = "/Temp/thuadat" + maxa + "_" + sohieutobando + "_" + sothututhua + ".svg";
                System.IO.File.WriteAllBytes(Server.MapPath(url), bytes);

                //convert svg to png
                var urlpng = "/Temp/thuadat" + maxa + "_" + sohieutobando + "_" + sothututhua + ".png";
                string svgFileName = Server.MapPath(url);
                //string PngRelativeDirectory = "C:\\";
                //string pngName = "svgpieresult.png";
                string pngFileName = Server.MapPath(urlpng);


                /* ignored assume sample.svg is in the web app directory
                using (StreamWriter writer = new StreamWriter(svgFileName, false))
                {
                    writer.Write(svgXml);
                }
                 */

                string inkscapeArgs = string.Format(@"-f ""{0}"" -e ""{1}""", svgFileName, pngFileName);

                Process inkscape = Process.Start(
                  new ProcessStartInfo("C:\\Program Files\\inkscape\\inkscape.exe", inkscapeArgs));

                inkscape.WaitForExit(3000);
                var duongdan = "";
                var duongdanpng = "";
                var str = HttpContext.Request.Url.Authority;

                duongdan = "http://" + str + url;
                duongdanpng = "http://" + str + urlpng;
                //lưu ảnh vào cơ sở dữ liệu
                using (FTILISEntities dbo = new FTILISEntities())
                {
                    var objxa = (from item in dbo.HC_DMKVHC where item.MAXA == maxa select item).FirstOrDefault();
                    decimal soto = decimal.Parse(sohieutobando);
                    decimal sothua = decimal.Parse(sothututhua);
                    if (objxa != null)
                    {
                        var objthuadat = (from thua in dbo.DC_THUADAT where thua.XAID == objxa.KVHCID && thua.SOHIEUTOBANDO == soto && thua.SOTHUTUTHUA == sothua select thua).FirstOrDefault();
                        if (objthuadat != null)
                        {
                            objthuadat.HSKTSVGFILEPATH = url;
                            dbo.SaveChanges();
                        }
                    }

                }

                var result = new
                {
                    url = duongdan,
                    tenfile = "thuadat" + maxa + "_" + sohieutobando + "_" + sothututhua + ".svg",
                    urlpng = duongdanpng,
                    tenfilepng = "thuadat" + maxa + "_" + sohieutobando + "_" + sothututhua + ".png"
                };
                return Json(result, JsonRequestBehavior.AllowGet);

            }
            catch (Exception ex)
            {
                throw ex;
            }

            //  return Content("{" + path + "}", "application/json");
        }

        public ActionResult Save_svg(string param, string maxa, string sothututhua, string sohieutobando)
        {
            //  string path = "abc";
            //byte[] fileBytes;
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
            url = FileManager.saveFile(maxa, bytes, maxa + "_" + sohieutobando + "_" + sothututhua + ".svg", FileType.DiaChinh, out makvhc);

            try
            {
                bool tontai = false;
                //lưu ảnh vào cơ sở dữ liệu
                using (FTILISEntities dbo = new FTILISEntities())
                {
                    //var objxa = (from item in dbo.HC_DMKVHC where item.MAXA == maxa select item).FirstOrDefault();
                    decimal soto = decimal.Parse(sohieutobando);
                    decimal sothua = decimal.Parse(sothututhua);

                    var objthuadat = (from thua in dbo.DC_THUADAT where thua.MAKVHC == makvhc && thua.SOHIEUTOBANDO == soto && thua.SOTHUTUTHUA == sothua select thua).ToList();
                    foreach (var td in objthuadat)
                    {
                        if ((td.TRANGTHAI == "Y" && (td.HSKTSVGFILEPATH == null || td.HSKTSVGFILEPATH == ""))
                            || td.TRANGTHAI == "S")
                        {
                            td.HSKTSVGFILEPATH = url;
                            tontai = true;
                        }
                    }

                    if (tontai)
                        dbo.SaveChanges();
                    else
                    {
                        if (System.IO.File.Exists(url))
                            System.IO.File.Delete(url);
                    }
                }

                return Json(tontai.ToString(), JsonRequestBehavior.AllowGet);

            }
            catch (Exception ex)
            {
                throw ex;
            }

            //  return Content("{" + path + "}", "application/json");
        }
        public ActionResult getLandAndRelationObject_shapefile(LandAndRelateObjectParam DOITUONG, string MAXA, string tinh, string geometry)
        {
            string path = "";
            byte[] fileBytes;
            string fileName;

            try
            {
                var data = new LandAndRelateObjectParam();
                data = DOITUONG;
                data.MaKVHC = MAXA;
                data.ProvinceCode = tinh;

                if (data.LandInfors.Count > 0)
                {


                    data.isGetDataForEdit = false;
                    var di = ProvinceInfor.GetProvinceInfor(data.ProvinceCode);
                    //di.DistrictCentralMeridian = 109;

                    if (di != null)
                    {
                        path = LandAndRelationObject.getLandData_shapefile(data, di);
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            var duongdan = "";

            if (path != "")
            {
                var url = HttpContext.Request.Url.Authority;
                //fileBytes = System.IO.File.ReadAllBytes(path);
                // fileName = "ThuaDat_shape.zip";
                duongdan = "http://" + url + "/Temp/" + path + "//" + "ThuaDat_shape.zip";
            }
            else
            {
                fileBytes = new byte[0];
                fileName = "CanNotGetData.zip";
            }

            return Json(duongdan, JsonRequestBehavior.AllowGet);

            //  return Content("{" + path + "}", "application/json");
        }

        public FileResult getLandAndRelationObject(string matinh, string mahuyen, string maxa, string sh, string sott)
        {
            string path = "";
            byte[] fileBytes;
            string fileName;

            try
            {
                var data = new LandAndRelateObjectParam();
                data.MaKVHC = maxa;
                data.ProvinceCode = matinh;
                //data.LandInfors = new List<LandInfor>();
                //var item = new LandInfor { SoThua = "191", SoTo = "12" };
                //data.LandInfors.Add(item);
                //item = new LandInfor { SoThua = "6", SoTo = "17" };
                //data.LandInfors.Add(item);
                string[] shtbd = sh.Split(',');
                string[] sttt = sott.Split(',');

                if (shtbd.Length == sttt.Length && shtbd.Length > 0)
                {
                    LandInfor item;
                    for (int i = 0; i < shtbd.Length; i++)
                    {
                        item = new LandInfor { SoThua = sttt[i], SoTo = shtbd[i] };
                        data.LandInfors.Add(item);
                    }

                    data.isGetDataForEdit = false;
                    var di = ProvinceInfor.GetProvinceInfor(data.ProvinceCode);
                    //di.DistrictCentralMeridian = 109;

                    if (di != null)
                    {
                        path = LandAndRelationObject.getLandData(data, di);
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }

            if (System.IO.File.Exists(path))
            {
                fileBytes = System.IO.File.ReadAllBytes(path);
                fileName = "ThuaDat.kml";
            }
            else
            {
                fileBytes = new byte[0];
                fileName = "CanNotGetData.kml";
            }

            return File(fileBytes, System.Net.Mime.MediaTypeNames.Application.Octet, fileName);

            //  return Content("{" + path + "}", "application/json");
        }

        // GET: GetLandAndRelateData
        public ActionResult _GetLandAndRelateData()
        {
            var data = new GetLandAndRelateData();
            data.MaKVHC = "7840";
            data.shThua_ToBD = "2(26), 112(26)";

            var di = ProvinceInfor.GetProvinceInfor(ProvinceCode);
            if (di != null)
            {
                byte[] response = null;
                var uri = FTILIS.Services.Library.Infrastructure.Token.TokenAuth.TokenConfigInfo.WebAPIGetLayerList + "?ProvinceCode=" + ProvinceCode;
                //"http://localhost:5999/api/LandAndRelationObject/getLayerList?ProvinceCode=86";

                using (var client = new WebClient())
                {
                    response = client.DownloadData(uri); //.UploadValues(uri, new NameValueCollection());
                }
                var result = Encoding.UTF8.GetString(response);
                //.Replace("k__BackingField", "").Replace("<","").Replace(">","");
                var objs = JsonConvert.DeserializeObject<List<LayerInfo>>(result);

                if (objs.Count > 0) data.LayerInfors = objs;
            }
            else data.LayerInfors = new List<LayerInfo>();

            return PartialView(data);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [OutputCache(NoStore = true, Duration = 0, VaryByParam = "*")]
        public async Task<ActionResult> GetLandAndRelateData(GetLandAndRelateData data, string ButtonType)
        {
            string _ten_file, fPath, retData = "{ \"Layers\":[", SHToBD, SHThua;
            var param = new LandAndRelateObjectParam();
            param.ProvinceCode = ProvinceCode;
            ThuaDat td;
            var uri = FTILIS.Services.Library.Infrastructure.Token.TokenAuth.TokenConfigInfo.WebAPIThuaDatLink;
            //"http://localhost:5999/api/LandAndRelationObject/getLandAndRelationObject/";

            try
            {
                if (ModelState.IsValid)
                {
                    if (checkInputData(data, ref param))
                    {
                        _ten_file = Guid.NewGuid().ToString().Replace("-", "_");
                        fPath = Path.Combine(System.Web.HttpContext.Current.Server.MapPath("~/App_Data"), _ten_file);
                        //check if data need lock
                        if (ButtonType.Equals("Edit dữ liệu"))
                        {
                            param.isGetDataForEdit = true;
                        }
                        else param.isGetDataForEdit = false;

                        if (await getData(uri, param, fPath))
                        {
                            //check if has data
                            if (Directory.EnumerateFiles(fPath).ToList().Count > 1)
                            {
                                data.ListThuaDat.Clear();
                                for (var i = 0; i < param.LayerInfors.Count; i++)
                                {
                                    if (System.IO.File.Exists(fPath + "\\" + param.LayerInfors[i].LayerName + ".json"))
                                        using (
                                            var sr =
                                                new StreamReader(fPath + "\\" + param.LayerInfors[i].LayerName + ".json")
                                            )
                                        {
                                            // Read the stream to a string
                                            var rt = sr.ReadToEnd();
                                            rt =
                                                rt.Replace("\r\n", string.Empty)
                                                    .Replace("\n", string.Empty)
                                                    .Replace("\r", string.Empty);
                                            retData = retData + rt + ",";
                                            if (param.LayerInfors[i].LayerName.Equals("ThuaDat"))
                                            {
                                                var objs = JsonConvert.DeserializeObject<JObject>(rt);
                                                if (objs["features"] != null)
                                                {
                                                    foreach (var item in objs["features"])
                                                    {
                                                        SHToBD = item["properties"]["SHTOBD"].ToString();
                                                        SHThua = item["properties"]["SHTHUA"].ToString();
                                                        for (var j = 0; j < param.LandInfors.Count; j++)
                                                        {
                                                            if (param.LandInfors[j].SoThua.Equals(SHThua) &&
                                                                param.LandInfors[j].SoTo.Equals(SHToBD))
                                                            {
                                                                td = new ThuaDat();
                                                                td.MaKVHC = item["properties"]["MAKVHC"].ToString();
                                                                td.SHThua = SHThua;
                                                                td.SHToBanDo = SHToBD;
                                                                td.idThua =
                                                                    int.Parse(item["properties"]["OBJID"].ToString());
                                                                data.ListThuaDat.Add(td);
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                }
                                retData = retData.Remove(retData.Length - 1) + "]";
                                string s1, s2, s3, s4, s5, strListThuaDat = "";
                                s1 =
                                    "<tr><td class='padding-offset' style='width: 30px;'><label class='control-label input-sm col-sm-3'>";
                                s2 =
                                    "</label></td><td class='padding-offset' style='width: 70px;'><label class='control-label input-sm col-sm-3'>";
                                s3 =
                                    "</label></td><td class='padding-offset' style='width: 70px;'><label class='control-label input-sm col-sm-3'>";
                                s4 =
                                    "</label></td><td class='padding-offset' style='width: 70px;'><label class='control-label input-sm col-sm-3'>";
                                s5 = "</label></td></tr>";

                                for (var i = 0; i < data.ListThuaDat.Count; i++)
                                {
                                    strListThuaDat = strListThuaDat + s1 + data.ListThuaDat[i].idThua + s2 +
                                                     data.ListThuaDat[i].SHThua
                                                     + s3 + data.ListThuaDat[i].SHToBanDo + s4 +
                                                     data.ListThuaDat[i].MaKVHC + s5;
                                }
                                if (!strListThuaDat.Equals(""))
                                    retData = retData + ", \"ListThuaDat\":\"" + strListThuaDat + "\"";
                                //else retData = retData;
                                var note = "";
                                if (System.IO.File.Exists(fPath + "\\Note.txt"))
                                {
                                    note = System.IO.File.ReadAllText(fPath + "\\Note.txt").Trim();
                                }

                                if (note.Equals("")) retData = retData + "}";
                                else retData = retData + ", \"NOTE\":\"" + note + "\"}";

                                var jRet = new JsonResult();
                                jRet.Data = retData;
                                jRet.ContentType = "application/json";
                                return jRet;
                            }
                        }
                    }
                    else
                    {
                        return
                            Content(
                                "{\"ERR\":\"ERROR\",\"MESSAGE\":\"Dữ liệu đầu vào lỗi, vui lòng kiểm tra đầu vào\"}",
                                "application/json");
                    }
                }
            }
            catch (Exception ex)
            {
            }

            return PartialView("_GetLandAndRelateData", data);
        }

        private async Task<bool> getData(string uri, LandAndRelateObjectParam param, string fPath)
        {
            var retFileName = "";
            var retVal = false;
            Stream InputStream = null;
            FileStream OutStream = null;
            Task task, t1 = null;
            HttpResponseMessage response;

            try
            {
                if (!Directory.Exists(fPath)) Directory.CreateDirectory(fPath);

                using (var client = new HttpClient())
                {
                    //client.BaseAddress = new Uri(uri);
                    client.DefaultRequestHeaders.Accept.Clear();
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                    response = await client.PostAsJsonAsync(uri, param);
                    if (response.IsSuccessStatusCode)
                    {
                        retFileName = response.Content.Headers.ContentDisposition.FileName;
                        task = response.Content.ReadAsStreamAsync().ContinueWith(t =>
                        {
                            InputStream = t.Result;
                            InputStream.Position = 0;
                            OutStream = new FileStream(fPath + "\\" + retFileName, FileMode.Create);
                            t1 = InputStream.CopyToAsync(OutStream);
                        });

                        //if (t1 != null) t1.Wait();
                        await task;
                        await t1;
                        task.Dispose();
                        t1.Dispose();

                        if (InputStream != null) InputStream.Close();
                        if (OutStream != null) OutStream.Close();

                        if (System.IO.File.Exists(fPath + "\\" + retFileName))
                        {
                            try
                            {
                                ZipFile.ExtractToDirectory(fPath + "\\" + retFileName, fPath);

                                string[] _par;
                                for (int i = 0; i < param.LayerInfors.Count; i++)
                                {
                                    //create geojson file for loading map
                                    _par = new string[2];
                                    _par[0] = fPath + "\\" + param.LayerInfors[i].LayerName + ".json";
                                    _par[1] = fPath + "\\" + param.LayerInfors[i].LayerName + ".shp";
                                    FTILIS.Services.Library.Infrastructure.Python.PyManager.RunMethod("utilities", "ConvertToGeoJson", _par, FTILIS.Services.Library.Infrastructure.Python.FunctionParamType.ARRAY);
                                }
                            }
                            catch (Exception ex)
                            {
                                var s1 = t1.Status.ToString();
                                var s2 = task.Status.ToString();
                                if (s1.Equals(s2)) ;
                            }
                        }
                        retVal = true;
                    }
                }
            }
            catch (Exception ex)
            {
            }

            return retVal;
        }

        private bool checkInputData(GetLandAndRelateData data, ref LandAndRelateObjectParam param)
        {
            if (data.shThua_ToBD.Trim().Equals("") || data.MaKVHC.Trim().Equals("")) return false;
            var ret = false;
            LandInfor item;
            char[] spc = { '(' };
            string[] stst, st;

            try
            {
                //create query
                stst = data.shThua_ToBD.Split(',');
                foreach (var s in stst)
                {
                    st = s.Split(spc);
                    if (st.Length > 1)
                    {
                        item = new LandInfor();
                        item.SoThua = st[0].Trim();
                        item.SoTo = st[1].Replace(")", "").Trim();
                        param.LandInfors.Add(item);
                    }
                }
                foreach (var it in data.LayerInfors)
                {
                    if (it.isSelect) param.LayerInfors.Add(it);
                }
                param.MaKVHC = data.MaKVHC;

                if (param.LayerInfors.Count == 0 || param.LandInfors.Count == 0) return false;
                ret = true;
            }
            catch (Exception ex)
            {
            }

            return ret;
        }

        public ActionResult UpdateData()
        {
            //create param
            NameValueCollection vl = new NameValueCollection()
                {
                    //{"where", "OBJECTID in (189928,189932,189937)"},
                    {"where", "OBJECTID in (189945, 189946)"},
                    {"outFields", "*" },
                    {"f", "json" }
                };
            InsertUpdateDeleteParam IUDParam = new InsertUpdateDeleteParam();
            IUDParam.ProvinceCode = "86";
            var di = ProvinceInfor.GetProvinceInfor(IUDParam.ProvinceCode);
            string uri = di.ThuaDatServiceLink + "/" + di.ThuaDatLayerIndex + "/query?";
            //string uri = "http://localhost:6080/arcgis/rest/services/FeatureService/FeatureServer/2" + "/query?";
            IList<LandFeature> features = LandAndRelationObject.getLandFeatureList(uri, vl, null);
            //for (int i = 0; i < features.Count; i++)
            //{
            //    features[i].GeometryString = LandAndRelationObject.toArcGISGeoJSon(features[i].Geometry);
            //    features[i].TenChu = "hoàng văn nhân";
            //    features[i].Geometry = null;
            //}

            List<LayerInfo> layers = new List<LayerInfo>();
            LayerInfo lyr = new LayerInfo();
            lyr.LayerName = "ThuaDat";
            lyr.LayerID = 1;
            lyr.StringFeatures = LandAndRelationObject.LandFeaturesToGeoJSON(features, false);
            layers.Add(lyr);
            IUDParam.data = layers;

            //start run
            string retString = JsonConvert.SerializeObject(IUDParam);

            //string retString = "{\"FeatureType\":0,\"LandInforsString\":[],\"ProvinceCode\":\"86\",\"data\":[{\"LayerName\":\"ThuaDat\",\"LayerID\":1,\"isSelect\":false,\"StringFeatures\":[{\"geometry\":{\"rings\": [[[554328.687,1116621.867],[554363.397,1116674.437],[554384.017,1116659.547],[554382.267,1116656.977],[554348.797,1116609.197],[554328.687,1116621.867]]]},\"attributes\":{\"OBJECTID\":190645,\"UUID\":\"\",\"ThoiDiemBatDau\":null,\"ThoiDiemKetThuc\":null,\"MaXa\":\"29734\",\"MaDoiTuong\":null,\"SoHieuToBanDo\":17,\"SoThuTuThua\":110,\"SoHieuToBanDoCu\":\"4\",\"SoThuTuThuaCu\":\"ấp 7\",\"DienTich\":1531,\"DienTichPhapLy\":1531,\"KyHieuMucDichSuDung\":\"LUC\",\"KyHieuDoiTuong\":null,\"TenChu\":null,\"DiaChi\":\"ấp 7,Xã Hòa Lộc,Huyện Tam Bình,Tỉnh Vĩnh Long\",\"DaCapGCN\":0}}{\"geometry\":{\"rings\": [[[554472.167,1116678.177],[554435.817,1116626.177],[554355.457,1116510.807],[554353.197,1116508.427],[554331.827,1116516.407],[554346.587,1116539.197],[554378.557,1116585.857],[554413.057,1116636.267],[554452.587,1116693.657],[554472.167,1116678.177]]]},\"attributes\":{\"OBJECTID\":190653,\"UUID\":\"\",\"ThoiDiemBatDau\":null,\"ThoiDiemKetThuc\":null,\"MaXa\":\"29734\",\"MaDoiTuong\":null,\"SoHieuToBanDo\":17,\"SoThuTuThua\":121,\"SoHieuToBanDoCu\":\"4\",\"SoThuTuThuaCu\":\"259+260+c261\",\"DienTich\":5079.45,\"DienTichPhapLy\":0,\"KyHieuMucDichSuDung\":\"LUC\",\"KyHieuDoiTuong\":null,\"TenChu\":null,\"DiaChi\":\"ấp 7, Xã Hòa Lộc, Huyện Tam Bình, Tỉnh Vĩnh Long\",\"DaCapGCN\":1}}{\"geometry\":{\"rings\": [[[554378.557,1116585.857],[554362.677,1116597.507],[554348.097,1116608.417],[554348.797,1116609.197],[554382.267,1116656.977],[554413.057,1116636.267],[554378.557,1116585.857]]]},\"attributes\":{\"OBJECTID\":190648,\"UUID\":\"\",\"ThoiDiemBatDau\":null,\"ThoiDiemKetThuc\":null,\"MaXa\":\"29734\",\"MaDoiTuong\":null,\"SoHieuToBanDo\":17,\"SoThuTuThua\":116,\"SoHieuToBanDoCu\":\"4\",\"SoThuTuThuaCu\":\"ấp 7\",\"DienTich\":2256.34,\"DienTichPhapLy\":0,\"KyHieuMucDichSuDung\":\"LUC\",\"KyHieuDoiTuong\":null,\"TenChu\":null,\"DiaChi\":\"ấp 7, Xã Hòa Lộc, Huyện Tam Bình, Tỉnh Vĩnh Long\",\"DaCapGCN\":1}}{\"geometry\":{\"rings\": [[[554363.397,1116674.437],[554382.277,1116702.907],[554391.647,1116716.277],[554397.537,1116724.247],[554417.587,1116708.937],[554384.017,1116659.547],[554363.397,1116674.437]]]},\"attributes\":{\"OBJECTID\":190628,\"UUID\":\"\",\"ThoiDiemBatDau\":null,\"ThoiDiemKetThuc\":null,\"MaXa\":\"29734\",\"MaDoiTuong\":null,\"SoHieuToBanDo\":17,\"SoThuTuThua\":95,\"SoHieuToBanDoCu\":\"4\",\"SoThuTuThuaCu\":\"ấp 7\",\"DienTich\":1537.64,\"DienTichPhapLy\":1537.6,\"KyHieuMucDichSuDung\":\"LUC\",\"KyHieuDoiTuong\":null,\"TenChu\":null,\"DiaChi\":\"ấp 7,Xã Hòa Lộc,Huyện Tam Bình,Tỉnh Vĩnh Long\",\"DaCapGCN\":0}}{\"geometry\":{\"rings\": [[[554382.267,1116656.977],[554384.017,1116659.547],[554417.587,1116708.937],[554452.587,1116693.657],[554413.057,1116636.267],[554382.267,1116656.977]]]},\"attributes\":{\"OBJECTID\":190621,\"UUID\":\"\",\"ThoiDiemBatDau\":null,\"ThoiDiemKetThuc\":null,\"MaXa\":\"29734\",\"MaDoiTuong\":null,\"SoHieuToBanDo\":17,\"SoThuTuThua\":88,\"SoHieuToBanDoCu\":\"4\",\"SoThuTuThuaCu\":\"ấp 7\",\"DienTich\":2471.92,\"DienTichPhapLy\":7372.5,\"KyHieuMucDichSuDung\":\"LUC\",\"KyHieuDoiTuong\":null,\"TenChu\":null,\"DiaChi\":\"ấp 7,Xã Hòa Lộc,Huyện Tam Bình,Tỉnh Vĩnh Long\",\"DaCapGCN\":0}}{\"geometry\":{\"rings\": [[[554397.537,1116724.247],[554408.417,1116740.677],[554421.627,1116759.997],[554441.657,1116744.997],[554417.587,1116708.937],[554397.537,1116724.247]]]},\"attributes\":{\"OBJECTID\":190617,\"UUID\":\"\",\"ThoiDiemBatDau\":null,\"ThoiDiemKetThuc\":null,\"MaXa\":\"29734\",\"MaDoiTuong\":null,\"SoHieuToBanDo\":17,\"SoThuTuThua\":87,\"SoHieuToBanDoCu\":\"4\",\"SoThuTuThuaCu\":\"ấp 7\",\"DienTich\":1087.89,\"DienTichPhapLy\":1087.9,\"KyHieuMucDichSuDung\":\"LUC\",\"KyHieuDoiTuong\":null,\"TenChu\":null,\"DiaChi\":\"ấp 7,Xã Hòa Lộc,Huyện Tam Bình,Tỉnh Vĩnh Long\",\"DaCapGCN\":0}}{\"geometry\":{\"rings\": [[[554441.657,1116744.997],[554421.627,1116759.997],[554445.277,1116794.657],[554465.687,1116779.797],[554441.657,1116744.997]]]},\"attributes\":{\"OBJECTID\":190604,\"UUID\":\"\",\"ThoiDiemBatDau\":null,\"ThoiDiemKetThuc\":null,\"MaXa\":\"29734\",\"MaDoiTuong\":null,\"SoHieuToBanDo\":17,\"SoThuTuThua\":74,\"SoHieuToBanDoCu\":\"4\",\"SoThuTuThuaCu\":\"ấp 7\",\"DienTich\":1058.17,\"DienTichPhapLy\":1058.2,\"KyHieuMucDichSuDung\":\"LUC\",\"KyHieuDoiTuong\":null,\"TenChu\":null,\"DiaChi\":\"ấp 7,Xã Hòa Lộc,Huyện Tam Bình,Tỉnh Vĩnh Long\",\"DaCapGCN\":0}}{\"geometry\":{\"rings\": [[[554465.687,1116779.797],[554445.277,1116794.657],[554470.087,1116830.447],[554490.297,1116815.017],[554465.687,1116779.797]]]},\"attributes\":{\"OBJECTID\":190598,\"UUID\":\"\",\"ThoiDiemBatDau\":null,\"ThoiDiemKetThuc\":null,\"MaXa\":\"29734\",\"MaDoiTuong\":null,\"SoHieuToBanDo\":17,\"SoThuTuThua\":71,\"SoHieuToBanDoCu\":\"4\",\"SoThuTuThuaCu\":\"ấp 7\",\"DienTich\":1095.34,\"DienTichPhapLy\":1095.3,\"KyHieuMucDichSuDung\":\"LUC\",\"KyHieuDoiTuong\":null,\"TenChu\":null,\"DiaChi\":\"Ấp An Lương B, Xã Long An, Huyện Long Hồ, Tỉnh Vĩnh Long\",\"DaCapGCN\":0}}{\"geometry\":{\"rings\": [[[554472.167,1116678.177],[554452.587,1116693.657],[554523.967,1116798.457],[554545.717,1116829.817],[554568.117,1116862.607],[554590.307,1116846.317],[554472.167,1116678.177]]]},\"attributes\":{\"OBJECTID\":190603,\"UUID\":\"\",\"ThoiDiemBatDau\":null,\"ThoiDiemKetThuc\":null,\"MaXa\":\"29734\",\"MaDoiTuong\":null,\"SoHieuToBanDo\":17,\"SoThuTuThua\":75,\"SoHieuToBanDoCu\":\"4\",\"SoThuTuThuaCu\":\"262+c261\",\"DienTich\":5394.57,\"DienTichPhapLy\":0,\"KyHieuMucDichSuDung\":\"LUC\",\"KyHieuDoiTuong\":null,\"TenChu\":null,\"DiaChi\":\"ấp 7, Xã Hòa Lộc, Huyện Tam Bình, Tỉnh Vĩnh Long\",\"DaCapGCN\":1}}{\"geometry\":{\"rings\": [[[554470.087,1116830.447],[554472.047,1116833.247],[554493.987,1116864.487],[554514.967,1116851.157],[554493.197,1116819.177],[554490.297,1116815.017],[554470.087,1116830.447]]]},\"attributes\":{\"OBJECTID\":190586,\"UUID\":\"\",\"ThoiDiemBatDau\":null,\"ThoiDiemKetThuc\":null,\"MaXa\":\"29734\",\"MaDoiTuong\":null,\"SoHieuToBanDo\":17,\"SoThuTuThua\":59,\"SoHieuToBanDoCu\":\"4\",\"SoThuTuThuaCu\":\"ấp 7\",\"DienTich\":1073.09,\"DienTichPhapLy\":1073.1,\"KyHieuMucDichSuDung\":\"LUC\",\"KyHieuDoiTuong\":null,\"TenChu\":null,\"DiaChi\":\"ấp 2,Xã Hòa Lộc,Huyện Tam Bình,Tỉnh Vĩnh Long\",\"DaCapGCN\":0}}{\"geometry\":{\"rings\": [[[554493.197,1116819.177],[554514.967,1116851.157],[554545.717,1116829.817],[554523.967,1116798.457],[554493.197,1116819.177]]]},\"attributes\":{\"OBJECTID\":190595,\"UUID\":\"\",\"ThoiDiemBatDau\":null,\"ThoiDiemKetThuc\":null,\"MaXa\":\"29734\",\"MaDoiTuong\":null,\"SoHieuToBanDo\":17,\"SoThuTuThua\":65,\"SoHieuToBanDoCu\":\"4\",\"SoThuTuThuaCu\":\"ấp 7\",\"DienTich\":1431.78,\"DienTichPhapLy\":1431.8,\"KyHieuMucDichSuDung\":\"LUC\",\"KyHieuDoiTuong\":null,\"TenChu\":null,\"DiaChi\":\"ấp 7,Xã Hòa Lộc,Huyện Tam Bình,Tỉnh Vĩnh Long\",\"DaCapGCN\":0}}],\"Features\":null}]}";
            //IUDParam = JsonConvert.DeserializeObject<InsertUpdateDeleteParam>(retString);

            string encrString = FTILIS.Services.Library.Infrastructure.Utilities.Utilities.Encrypt(
                retString, true, "F0A0ED41F8047B1161A6938794A23D4B");
            //List<LayerInfo> retVal1 = JsonConvert.DeserializeObject<List<LayerInfo>>(retString);
            //IList<IFeature> feats = LandAndRelationObject.GeoJsonToFeatures(retVal[0].StringFeatures);
            string decrString = FTILIS.Services.Library.Infrastructure.Utilities.Utilities.Decrypt(
                encrString, true, "F0A0ED41F8047B1161A6938794A23D4B");
            MemoryStream stream = new MemoryStream();
            StreamWriter writer = new StreamWriter(stream);
            writer.Write(encrString);
            writer.Flush();
            stream.Position = 0;
            MultipartFormDataContent content = new MultipartFormDataContent();
            content.Add(new StreamContent(stream));

            string uploadServiceBaseAddress = "http://localhost:5999/api/fileupload/UpdateLandFeatures";
            //string uploadServiceBaseAddress = "http://123.30.154.111:1111/api/fileupload/UpdateLandFeatures";

            HttpClient httpClient = new HttpClient();
            HttpResponseMessage response = null;
            Task taskUpload = httpClient.PostAsync(uploadServiceBaseAddress, content).ContinueWith(task =>
            {
                if (task.Status == TaskStatus.RanToCompletion)
                {
                    response = task.Result;

                }
            });

            taskUpload.Wait();
            if (response == null) return Content("{\"Error\":" + "\"Has error\"}", "application/json");
            else return Content("{\"result\":\"" + response.ToString() + "\"}", "application/json");
        }

        //GET
        public ActionResult PopUpMap()
        {
            var data = new PopupMapViewModels();
            data.MaKVHC = "7840";
            data.shThua_ToBD = "2(26)";

            return View(data);
        }

        [HttpPost]
        //[ValidateAntiForgeryToken]
        [OutputCache(NoStore = true, Duration = 0, VaryByParam = "*")]
        public async Task<ActionResult> GetDataForPopupMap(PopupMapViewModels data)
        {
            string retData = "", selectList = "", coor = "";
            var param = new LandAndRelateObjectParam();
            param.ProvinceCode = ProvinceCode;
            List<LayerInfo> retVal;
            string[] stst, st;
            LandInfor item;
            char[] spc = { '(' };
            var uri = FTILIS.Services.Library.Infrastructure.Token.TokenAuth.TokenConfigInfo.BaseUpdateServiceLink + "getLandAndRelationObjects/";
            //"http://localhost:5999/api/LandAndRelationObject/getLandAndRelationObjects/";

            try
            {
                if (ModelState.IsValid)
                {
                    param.isGetDataForEdit = false;
                    param.isArcGisGeoJson = false;
                    param.MaKVHC = data.MaKVHC;
                    stst = data.shThua_ToBD.Split(',');
                    foreach (var s in stst)
                    {
                        st = s.Split(spc);
                        if (st.Length > 1)
                        {
                            item = new LandInfor();
                            item.SoThua = st[0].Trim();
                            item.SoTo = st[1].Replace(")", "").Trim();
                            param.LandInfors.Add(item);
                        }
                    }
                    retVal = await getDataPopupMap(uri, param);

                    for (var i = 0; i < retVal.Count; i++)
                    {
                        if (retVal[i].LayerName.ToUpper().Equals("THUADAT"))
                        {
                            var rt = LandAndRelationObject.FeaturesToGdalJsonsString(retVal[i].StringFeatures);
                            //rt =
                            //    rt.Replace("\r\n", string.Empty)
                            //        .Replace("\n", string.Empty)
                            //        .Replace("\r", string.Empty);
                            retData = retData + rt;
                            selectList = retVal[i].SelectedFeatures;
                            coor = retVal[i].WKT;
                            break;
                        }
                    }
                    //retData = retData.Remove(retData.Length - 1);
                    retData = retData.Replace("OBJECTID", "OBJID");
                    data.JsonData = retData;
                    data.SelectedList = selectList;
                    data.CoordinateSystem = coor;

                    return PartialView("_PopUpMap", data);
                }
            }
            catch (Exception ex)
            {
            }

            return PartialView("_PopUpMapParam", data);
        }

        private async Task<List<LayerInfo>> getDataPopupMap(string uri, LandAndRelateObjectParam param)
        {
            Stream InputStream = null;
            MemoryStream OutStream = null;
            Task task;
            HttpResponseMessage response;
            string decrString = "";
            List<LayerInfo> retVal = null;

            try
            {
                using (var client = new HttpClient())
                {
                    //client.BaseAddress = new Uri(uri);
                    client.DefaultRequestHeaders.Accept.Clear();
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                    response = await client.PostAsJsonAsync(uri, param);
                    if (response.IsSuccessStatusCode)
                    {
                        task = response.Content.ReadAsStreamAsync().ContinueWith(t =>
                        {
                            InputStream = t.Result;
                            InputStream.Position = 0;
                            var sr = new StreamReader(InputStream);
                            var myStr = sr.ReadToEnd();
                            decrString = FTILIS.Services.Library.Infrastructure.Utilities.Utilities.Decrypt(myStr, true, Config.SECURITY_KEY);
                        });

                        await task;
                        task.Dispose();

                        try
                        {
                            retVal = JsonConvert.DeserializeObject<List<LayerInfo>>(decrString);
                        }
                        catch (Exception ex)
                        {
                            retVal = null;
                        }

                        if (InputStream != null) InputStream.Close();
                        if (OutStream != null) OutStream.Close();
                    }
                }
            }
            catch (Exception ex)
            {
            }

            return retVal;
        }
    }
    public class toado
    {
        public string toadocu { get; set; }
        public string toadomoi { get; set; }

        //Fields, properties, methods and events go here...
    }
    public class toadothem
    {
        public string toadodiemthem { get; set; }
        public string xy_dau { get; set; }
        public string xy_cuoi { get; set; }
        public string idring { get; set; }
        //public string y_cuoi { get; set; }
        //public string xydau { get; set; }
        //public string xycuoi { get; set; }
        //public string toadomoi { get; set; }
        //Fields, properties, methods and events go here...
    }
    public class diem
    {
        public string id { get; set; }
        public string xcu { get; set; }
        public string ycu { get; set; }
        public string TT_Xoa { get; set; }
        public string rings { get; set; }
    }
    public class toadoxoa
    {
        public string xyxoa { get; set; }
        public string idring { get; set; }
    }
}