using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using AppCore.Models;
using System.Data;
using Aspose.Words;
using System.Diagnostics;
using FTILIS.Libraries.Services.XuLyHoSo.Classes;
using FTILIS.Libraries.Data.XuLyHoSo.Models.ViewModels.TTGiayChungNhan;
using FTILIS.Services.Library.Infrastructure.FileManager;
using FTILIS.Libraries.Data.XuLyHoSo.Models;
using FTILIS.Web.FrameWork.Base;
using Microsoft.Office.Interop.Word;
using IOTLink.Diachinh.Models;

namespace IOTLink.Diachinh.Controllers
{
    public class InAnController : Controller
    {   // GET: InAn
        public ActionResult Index()
        {
            return View();
        }
        [HttpGet]
        public ActionResult Test()
        {
            return Json(true);
        }

        [HttpPost]
        public ActionResult DownloadFile(string sothututhua, string sohieutobando, string maxa, string tenchu, string mdsddat, string diachi, string type, List<bangtoado> bangtoado)
        {
            try
            {
                var filepath = System.IO.Path.Combine(Server.MapPath("/App_Data/Mau/"), "mauhskythuat.doc");
                //   var duongdananh = System.IO.Path.Combine(Server.MapPath("/Temp/"), "png1.png");
                Aspose.Words.Document doc = new Aspose.Words.Document(filepath);
                DataSet data = GenDB(sothututhua, sohieutobando, maxa, tenchu, mdsddat, diachi, bangtoado);
                doc.MailMerge.ExecuteWithRegions(data);
                Aspose.Words.DocumentBuilder builder = new Aspose.Words.DocumentBuilder(doc);
                builder.MoveToCell(0, 0, 0, 0);
                var urlpng = "/Temp/thuadat" + maxa + "_" + sohieutobando + "_" + sothututhua + ".emf";
                var duongdananh = System.IO.Path.Combine(Server.MapPath(urlpng));
                if (System.IO.File.Exists(duongdananh))
                {
                    builder.InsertImage(duongdananh, 240, 200);
                }
                string tenfile = maxa + "_" + sothututhua + "_" + sohieutobando;

                var url = HttpContext.Request.Url.Authority;
                string duongdan = "";
                if (type == "doc")
                {
                    doc.Save(Server.MapPath("/Temp/") + tenfile + "trichluc.doc");
                    duongdan = "http://" + url + "/Temp/" + tenfile + "trichluc.doc";
                }
                else
                {
                    doc.Save(Server.MapPath("/Temp/") + tenfile + "trichluc.pdf");
                    duongdan = "http://" + url + "/Temp/" + tenfile + "trichluc.pdf";
                }
                return Json(duongdan, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public DataSet GenDB(string sothututhua, string sohieutobando, string maxa, string tenchu, string mdsddat, string diachi, List<bangtoado> bangtoado)
        {
            try
            {
                DataSet data = new DataSet();

                System.Data.DataTable ALLPage_table = new System.Data.DataTable("StoreDetails");

                ALLPage_table.Columns.Add("SOTHUTUTHUA");
                ALLPage_table.Columns.Add("SOTOBANDO");
                ALLPage_table.Columns.Add("XA");
                ALLPage_table.Columns.Add("HUYEN");
                ALLPage_table.Columns.Add("THANHPHO");

                ALLPage_table.Columns.Add("DIENTICH");
                ALLPage_table.Columns.Add("MUCDICHSD");
                ALLPage_table.Columns.Add("TENCHU");
                ALLPage_table.Columns.Add("DIACHI");
                System.Data.DataTable TableToaDo = new System.Data.DataTable("ToaDo");
                TableToaDo.Columns.Add("Diem");
                TableToaDo.Columns.Add("DoDaiCanh");

                Intrichluc obj = new Intrichluc();
                if (sothututhua != null && sohieutobando != null && maxa != null)
                {
                    using (FTILISEntities db = new FTILISEntities())
                    {
                        var objmaxa = (from item in db.HC_DMKVHC where item.MAXA == maxa select item).FirstOrDefault();
                        decimal sothua = decimal.Parse(sothututhua);
                        decimal soto = decimal.Parse(sohieutobando);
                        var objthua = (from item in db.DC_THUADAT where item.SOTHUTUTHUA == sothua && item.SOHIEUTOBANDO == soto && item.XAID == objmaxa.KVHCID select item).FirstOrDefault();
                        if (objthua != null)
                        {
                            var url = HttpContext.Request.Url.Authority;

                            obj.SOTHUTHUTHUA = objthua.SOTHUTUTHUA.ToString();
                            obj.SOTOBANDO = objthua.SOHIEUTOBANDO.ToString();
                            obj.DIENTICH = objthua.DIENTICH.ToString();
                            if (obj.DIACHI == "")
                            {
                                obj.DIACHI = diachi;
                            }
                            else
                            {
                                obj.DIACHI = objthua.DIACHITHUADAT;
                            }
                            var objxa = (from item in db.HC_DMKVHC where item.KVHCID == objthua.XAID select item).FirstOrDefault();
                            if (objxa != null)
                            {
                                obj.XA = objxa.TENKVHC;
                                var objhuyen = (from item in db.HC_HUYEN where item.HUYENID == objxa.HUYENID select item).FirstOrDefault();
                                if (objhuyen != null)
                                {
                                    obj.HUYEN = objhuyen.TENHUYEN;
                                    var objTinh = (from item in db.HC_TINH where item.TINHID == objhuyen.TINHID select item).FirstOrDefault();
                                    if (objTinh != null)
                                    {
                                        obj.TINH = objTinh.TENTINH;
                                    }
                                }
                            }
                            var listmdsddat = (from item in db.DC_MUCDICHSUDUNGDAT join dm in db.DM_MUCDICHSUDUNG on item.MUCDICHSUDUNGID equals dm.MUCDICHSUDUNGID where item.THUADATID == objthua.THUADATID select dm);
                            string mdsd = "";
                            if (listmdsddat != null)
                            {
                                foreach (var objmdsd in listmdsddat)
                                {
                                    mdsd = mdsd + ";" + objmdsd.TENMUCDICHSUDUNG;
                                }
                                mdsd = mdsd.Substring(1, mdsd.Length - 1);
                                obj.MUCDICHSUDUNG = mdsd;
                            }
                            else
                            {
                                var mdsddatbando = (from item in db.DM_MUCDICHSUDUNG where item.MAMUCDICHSUDUNG == mdsddat.ToUpper() select item).FirstOrDefault();
                                if (mdsddatbando != null)
                                {
                                    obj.MUCDICHSUDUNG = mdsddatbando.TENMUCDICHSUDUNG;
                                }
                            }

                            string strchu = "";
                            var listquyen = (from item in db.DC_QUYENSUDUNGDAT where item.THUADATID == objthua.THUADATID select item);
                            if (listquyen != null)
                            {
                                foreach (var objquyen in listquyen)
                                {
                                    var objnguoi = (from item in db.DC_NGUOI where item.NGUOIID == objquyen.NGUOIID select item).FirstOrDefault();
                                    if (objnguoi != null)
                                    {
                                        if (objnguoi.LOAIDOITUONGID == "1")
                                        {
                                            var objchu = (from item in db.DC_CANHAN where item.CANHANID == objnguoi.CHITIETID select item).FirstOrDefault();
                                            if (objchu != null)
                                            {
                                                strchu = strchu + ";" + objchu.HOTEN;
                                            }
                                        }
                                        else if (objnguoi.LOAIDOITUONGID == "2")
                                        {
                                            var objchu = (from item in db.DC_HOGIADINH where item.HOGIADINHID == objnguoi.CHITIETID select item).FirstOrDefault();
                                            if (objchu != null)
                                            {
                                                var objten = (from item in db.DC_CANHAN where item.CANHANID == objchu.CHUHO select item).FirstOrDefault();
                                                if (objten != null)
                                                {
                                                    strchu = strchu + ";" + objten.HOTEN;
                                                }
                                            }
                                        }
                                        else if (objnguoi.LOAIDOITUONGID == "3")
                                        {
                                            var objchu = (from item in db.DC_VOCHONG where item.VOCHONGID == objnguoi.CHITIETID select item).FirstOrDefault();
                                            if (objchu != null)
                                            {
                                                //strchu = strchu + ";" + objchu.CHONG;
                                                var objchong = (from item in db.DC_CANHAN where item.CANHANID == objchu.CHONG select item).FirstOrDefault();
                                                if (objchong != null)
                                                {
                                                    strchu = objchong.HOTEN;
                                                }
                                                var objvo = (from item in db.DC_CANHAN where item.CANHANID == objchu.VO select item).FirstOrDefault();
                                                if (objvo != null)
                                                {
                                                    strchu = strchu + "; " + objvo.HOTEN;
                                                }
                                            }
                                        }
                                        else if (objnguoi.LOAIDOITUONGID == "4")
                                        {
                                            var objchu = (from item in db.DC_CONGDONG where item.CONGDONGID == objnguoi.CHITIETID select item).FirstOrDefault();
                                            if (objchu != null)
                                            {
                                                strchu = objchu.TENCONGDONG;
                                            }
                                        }
                                        else if (objnguoi.LOAIDOITUONGID == "5")
                                        {
                                            var objchu = (from item in db.DC_TOCHUC where item.TOCHUCID == objnguoi.CHITIETID select item).FirstOrDefault();
                                            if (objchu != null)
                                            {
                                                strchu = objchu.TENTOCHUC;
                                            }
                                        }
                                    }
                                }
                            }
                            if (strchu == "")
                            {
                                obj.TENCHU = tenchu;
                            }
                            else
                            { obj.TENCHU = strchu.Substring(1, strchu.Length - 1); }

                            //obj.ANHSODO = "http://" + url + @"/Temp/test.svg";
                            //obj.ANHDIEMTOADO = "http://" + url + @"/Temp/test.png";
                            // convert svg to emf
                            //string svgFileName = Server.MapPath(objthua.HSKTSVGFILEPATH);
                            string svgFileName = FileManager.RootPath + objthua.HSKTSVGFILEPATH;
                            string urlpng = "/Temp/thuadat" + maxa + "_" + sohieutobando + "_" + sothututhua + ".emf";

                            string pngFileName = Server.MapPath(urlpng);

                            string inkscapeArgs = string.Format(@"-f ""{0}"" -e ""{1}""", svgFileName, pngFileName);

                            Process inkscape = Process.Start(
                              new ProcessStartInfo(FileManager.InscapePath, inkscapeArgs));

                            inkscape.WaitForExit(3000);

                            obj.ANHMUITEN = "http://" + url + @"/Temp/Bac.png";

                        }
                    }
                }
                ALLPage_table.Rows.Add(obj.SOTHUTHUTHUA, obj.SOTOBANDO, obj.XA, obj.HUYEN, obj.TINH, obj.DIENTICH, obj.MUCDICHSUDUNG, obj.TENCHU, obj.DIACHI);
                //foreach (var toado in bangtoado)
                //{
                //    TableToaDo.Rows.Add(toado.Diem, toado.Toadox, toado.Toadoy);
                //}
                for (int i = 0; i <= bangtoado.Count - 1; i++)
                {
                    if (i <= bangtoado.Count - 2)
                    {
                        TableToaDo.Rows.Add(bangtoado[i].Diem + "-" + bangtoado[i + 1].Diem, Math.Round(bangtoado[i].DoDai, 2));
                    }
                    else if (i == bangtoado.Count - 1)
                    {
                        TableToaDo.Rows.Add(bangtoado[i].Diem + "-" + bangtoado[0].Diem, Math.Round(bangtoado[i].DoDai, 2));
                    }
                }
                data.Tables.Add(ALLPage_table);
                data.Tables.Add(TableToaDo);
                return data;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public Intrichluc returnobj(string sothututhua, string sohieutobando, string maxa, string tenchu, string mdsddat, string diachi, List<bangtoado> bangtoado)
        {
            Intrichluc obj = new Intrichluc();
            using (FTILISEntities db = new FTILISEntities())
            {
                var objmaxa = (from item in db.HC_DMKVHC where item.MAXA == maxa select item).FirstOrDefault();
                decimal sothua = decimal.Parse(sothututhua);
                decimal soto = decimal.Parse(sohieutobando);
                var objthua = (from item in db.DC_THUADAT where item.SOTHUTUTHUA == sothua && item.SOHIEUTOBANDO == soto && item.XAID == objmaxa.KVHCID select item).FirstOrDefault();
                if (objthua != null)
                {
                    var url = HttpContext.Request.Url.Authority;

                    obj.SOTHUTHUTHUA = objthua.SOTHUTUTHUA.ToString();
                    obj.SOTOBANDO = objthua.SOHIEUTOBANDO.ToString();
                    obj.DIENTICH = objthua.DIENTICH.ToString();
                    if (obj.DIACHI == "")
                    {
                        obj.DIACHI = diachi;
                    }
                    else
                    {
                        obj.DIACHI = objthua.DIACHITHUADAT;
                    }
                    var objxa = (from item in db.HC_DMKVHC where item.KVHCID == objthua.XAID select item).FirstOrDefault();
                    if (objxa != null)
                    {
                        obj.XA = objxa.TENKVHC;
                        var objhuyen = (from item in db.HC_HUYEN where item.HUYENID == objxa.HUYENID select item).FirstOrDefault();
                        if (objhuyen != null)
                        {
                            obj.HUYEN = objhuyen.TENHUYEN;
                            var objTinh = (from item in db.HC_TINH where item.TINHID == objhuyen.TINHID select item).FirstOrDefault();
                            if (objTinh != null)
                            {
                                obj.TINH = objTinh.TENTINH;

                            }
                        }
                    }
                    var listmdsddat = (from item in db.DC_MUCDICHSUDUNGDAT join dm in db.DM_MUCDICHSUDUNG on item.MUCDICHSUDUNGID equals dm.MUCDICHSUDUNGID where item.THUADATID == objthua.THUADATID select dm);
                    string mdsd = "";
                    if (listmdsddat != null)
                    {
                        foreach (var objmdsd in listmdsddat)
                        {

                            mdsd = mdsd + ";" + objmdsd.TENMUCDICHSUDUNG;
                        }
                        mdsd = mdsd.Substring(1, mdsd.Length - 1);
                        obj.MUCDICHSUDUNG = mdsd;
                    }
                    else
                    {
                        var mdsddatbando = (from item in db.DM_MUCDICHSUDUNG where item.MAMUCDICHSUDUNG == mdsddat.ToUpper() select item).FirstOrDefault();
                        if (mdsddatbando != null)
                        {
                            obj.MUCDICHSUDUNG = mdsddatbando.TENMUCDICHSUDUNG;
                        }
                    }


                    string strchu = "";
                    var listquyen = (from item in db.DC_QUYENSUDUNGDAT where item.THUADATID == objthua.THUADATID select item);
                    if (listquyen != null)
                    {
                        foreach (var objquyen in listquyen)
                        {
                            var objnguoi = (from item in db.DC_NGUOI where item.NGUOIID == objquyen.NGUOIID select item).FirstOrDefault();
                            if (objnguoi != null)
                            {
                                if (objnguoi.LOAIDOITUONGID == "1")
                                {
                                    var objchu = (from item in db.DC_CANHAN where item.CANHANID == objnguoi.CHITIETID select item).FirstOrDefault();
                                    if (objchu != null)
                                    {
                                        strchu = strchu + ";" + objchu.HOTEN;
                                    }
                                }
                                else if (objnguoi.LOAIDOITUONGID == "2")
                                {
                                    var objchu = (from item in db.DC_HOGIADINH where item.HOGIADINHID == objnguoi.CHITIETID select item).FirstOrDefault();
                                    if (objchu != null)
                                    {
                                        var objten = (from item in db.DC_CANHAN where item.CANHANID == objchu.CHUHO select item).FirstOrDefault();
                                        if (objten != null)
                                        {
                                            strchu = strchu + ";" + objten.HOTEN;
                                        }

                                    }
                                }
                                else if (objnguoi.LOAIDOITUONGID == "3")
                                {
                                    var objchu = (from item in db.DC_VOCHONG where item.VOCHONGID == objnguoi.CHITIETID select item).FirstOrDefault();
                                    if (objchu != null)
                                    {
                                        //strchu = strchu + ";" + objchu.CHONG;
                                        var objchong = (from item in db.DC_CANHAN where item.CANHANID == objchu.CHONG select item).FirstOrDefault();
                                        if (objchong != null)
                                        {
                                            strchu = objchong.HOTEN;

                                        }
                                        var objvo = (from item in db.DC_CANHAN where item.CANHANID == objchu.VO select item).FirstOrDefault();
                                        if (objvo != null)
                                        {
                                            strchu = strchu + "; " + objvo.HOTEN;

                                        }
                                    }
                                }
                                else if (objnguoi.LOAIDOITUONGID == "4")
                                {

                                    var objchu = (from item in db.DC_CONGDONG where item.CONGDONGID == objnguoi.CHITIETID select item).FirstOrDefault();
                                    if (objchu != null)
                                    {
                                        strchu = objchu.TENCONGDONG;
                                    }

                                }
                                else if (objnguoi.LOAIDOITUONGID == "5")
                                {
                                    var objchu = (from item in db.DC_TOCHUC where item.TOCHUCID == objnguoi.CHITIETID select item).FirstOrDefault();
                                    if (objchu != null)
                                    {
                                        strchu = objchu.TENTOCHUC;
                                    }

                                }
                            }
                        }
                    }
                    if (strchu == "")
                    {
                        obj.TENCHU = tenchu;
                    }
                    else
                    { obj.TENCHU = strchu.Substring(1, strchu.Length - 1); }

                    //bảng tọa độ
                    obj.DsDinh = new List<bangtoado>();
                    obj.DsDinhInTrichLuc = new List<bangtoadoInTrichLuc>();

                    obj.DsDinh = bangtoado;
                    //in trích lục
                    for (int i = 0; i <= bangtoado.Count - 1; i++)
                    {
                        bangtoadoInTrichLuc abc = new bangtoadoInTrichLuc();
                        if (i <= bangtoado.Count - 2)
                        {

                            abc.Diem = bangtoado[i].Diem + "-" + bangtoado[i + 1].Diem;
                            abc.DoDaiCanh = Math.Round(bangtoado[i].DoDai, 2);
                            obj.DsDinhInTrichLuc.Add(abc);
                        }
                        else if (i == bangtoado.Count - 1)
                        {
                            abc.Diem = bangtoado[i].Diem + "-" + bangtoado[0].Diem;
                            abc.DoDaiCanh = Math.Round(bangtoado[i].DoDai, 2);
                            obj.DsDinhInTrichLuc.Add(abc);
                        }
                    }
                    if (objthua.HSKTSVGFILEPATH != null)
                    {
                        byte[] fileBytes = System.IO.File.ReadAllBytes(FileManager.RootPath + objthua.HSKTSVGFILEPATH);
                        string x64string = System.Convert.ToBase64String(fileBytes);
                        obj.ANHSODO = "data:image/svg+xml;base64," + x64string;//"http://" + url + objthua.HSKTSVGFILEPATH;
                                                                               //obj.ANHDIEMTOADO = "http://" + url + @"/Temp/test.svg";
                    }
                    else
                    {
                        obj.ANHSODO = "";
                    }
                    obj.ANHMUITEN = "http://" + url + @"/Images/Bac.png";
                }
            }
            return obj;
        }

        [HttpPost]
        public ActionResult InTrichLuc(string sothututhua, string sohieutobando, string maxa, string tenchu, string mdsddat, string diachi, List<bangtoado> bangtoado)
        {
            Intrichluc obj = new Intrichluc();
            if (sothututhua != null && sohieutobando != null && maxa != null)
            {
                obj = returnobj(sothututhua, sohieutobando, maxa, tenchu, mdsddat, diachi, bangtoado);
                if (obj.ANHSODO.Trim() == "")
                {
                    return Content("<p>error image</p>");
                }
                return View(obj);
            }
            else
            {
                return View(obj);
            }
        }

        //////hồ sơ kỹ thuật
        [HttpPost]
        public ActionResult DownloadFile_hskt(List<bangtoado> bangtoado, string sothututhua, string sohieutobando, string maxa, string tenchu, string mdsddat, string diachi, string type)
        {
            try
            {
                var filepath = System.IO.Path.Combine(Server.MapPath("/App_Data/Mau/"), "mauKT.doc");

                Aspose.Words.Document doc = new Aspose.Words.Document(filepath);
                DataSet data = GenDB_HSKT(sothututhua, sohieutobando, maxa, tenchu, mdsddat, diachi, bangtoado);
                doc.MailMerge.ExecuteWithRegions(data);
                Aspose.Words.DocumentBuilder builder = new Aspose.Words.DocumentBuilder(doc);
                var urlpng = FileManager.Temp_File_Path + "thuadat_" + maxa + "_" + sohieutobando + "_" + sothututhua + ".emf";
                var duongdananh = System.IO.Path.Combine(Server.MapPath(urlpng));
                if (System.IO.File.Exists(duongdananh))
                {
                    builder.MoveToCell(1, 0, 0, 0);
                    builder.InsertImage(duongdananh, 240, 200);
                }
                Aspose.Words.Tables.Table tb = (Aspose.Words.Tables.Table)builder.Document.GetChild(NodeType.Table, 2, true);
                Aspose.Words.Tables.Row cr, r;
                Aspose.Words.Tables.Cell cell;
                Aspose.Words.Run run;
                Aspose.Words.Font font;

                System.Data.DataTable TableToaDo = data.Tables[1];
                for (int i = 0; i < TableToaDo.Rows.Count; i++)
                {
                    cr = (Aspose.Words.Tables.Row)tb.LastRow.Clone(true);
                    r = tb.LastRow;
                    for (int j = 0; j < 3; j++)
                    {
                        run = new Aspose.Words.Run(r.Cells[j].Document);//r.Cells[j].LastParagraph.Runs[r.Cells[j].LastParagraph.Runs.Count - 1];
                        font = run.Font;
                        font.Name = "Times New Roman";
                        font.Size = 10;
                        run.Text = TableToaDo.Rows[i][j].ToString();
                        r.Cells[j].LastParagraph.AppendChild(run);
                    }
                    if (i != TableToaDo.Rows.Count - 1)
                        tb.AppendChild(cr);
                }
                string tenfile = maxa + "_" + sothututhua + "_" + sohieutobando;
                var url = HttpContext.Request.Url.Authority;
                string duongdan = "", path = "";
                if (type == "doc")
                {
                    path = Server.MapPath(FileManager.Temp_File_Path) + tenfile + "hskt.doc";
                    if (System.IO.File.Exists(path))
                        System.IO.File.Delete(path);
                    doc.Save(path);
                    duongdan = "http://" + url + FileManager.Temp_File_Path + tenfile + "hskt.doc";
                }
                else
                {
                    path = Server.MapPath(FileManager.Temp_File_Path) + tenfile + "hskt.pdf";
                    if (System.IO.File.Exists(path))
                        System.IO.File.Delete(path);
                    doc.Save(path);
                    duongdan = "http://" + url + FileManager.Temp_File_Path + tenfile + "hskt.pdf";
                }

                return Json(duongdan, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public DataSet GenDB_HSKT(string sothututhua, string sohieutobando, string maxa, string tenchu, string mdsddat, string diachi, List<bangtoado> bangtoado)
        {
            try
            {
                DataSet data = new DataSet();

                System.Data.DataTable ALLPage_table = new System.Data.DataTable("StoreDetails");

                ALLPage_table.Columns.Add("SOTHUTUTHUA");
                ALLPage_table.Columns.Add("SOTOBANDO");
                ALLPage_table.Columns.Add("MANHBANDO");
                ALLPage_table.Columns.Add("TENCHU");
                ALLPage_table.Columns.Add("MUCDICHSD");
                ALLPage_table.Columns.Add("DIENTICH");
                ALLPage_table.Columns.Add("DIACHITHUA");

                System.Data.DataTable TableToaDo = new System.Data.DataTable("ToaDo");
                TableToaDo.Columns.Add("Diem");
                TableToaDo.Columns.Add("toadox");
                TableToaDo.Columns.Add("toadoy");
                //TableToaDo.Columns.Add("dodai");

                Intrichluc obj = new Intrichluc();
                if (sothututhua != null && sohieutobando != null && maxa != null)
                {
                    using (FTILISEntities db = new FTILISEntities())
                    {
                        var objmaxa = (from item in db.HC_DMKVHC where item.MAXA == maxa select item).FirstOrDefault();
                        decimal sothua = decimal.Parse(sothututhua);
                        decimal soto = decimal.Parse(sohieutobando);
                        var objthua = (from t in db.DC_THUADAT
                                       where t.SOTHUTUTHUA == sothua && t.SOHIEUTOBANDO == soto && t.XAID == objmaxa.KVHCID
                                       select new
                                       {
                                           t,
                                           xa = db.HC_DMKVHC.Where(it => it.KVHCID == t.XAID).FirstOrDefault(),
                                           listmdsddat = (from mdsd in db.DC_MUCDICHSUDUNGDAT.Where(it => it.THUADATID == t.THUADATID)
                                                          select new
                                                          {
                                                              mdsd,
                                                              dm = db.DM_MUCDICHSUDUNG.Where(it => it.MUCDICHSUDUNGID == mdsd.MUCDICHSUDUNGID).FirstOrDefault()
                                                          }).ToList(),
                                           listquyen = (from q in db.DC_QUYENSUDUNGDAT.Where(it => it.THUADATID == t.THUADATID)
                                                        select new
                                                        {
                                                            q,
                                                            objnguoi = db.DC_NGUOI.Where(it => it.NGUOIID == q.NGUOIID).FirstOrDefault()
                                                        }).ToList(),
                                       }).FirstOrDefault();
                        if (objthua != null)
                        {
                            var url = HttpContext.Request.Url.Authority;

                            obj.SOTHUTHUTHUA = objthua.t.SOTHUTUTHUA.ToString();
                            obj.SOTOBANDO = objthua.t.SOHIEUTOBANDO.ToString();
                            obj.DIENTICH = objthua.t.DIENTICH.ToString();
                            if (obj.DIACHI == "")
                            {
                                obj.DIACHI = diachi;
                            }
                            else
                            {
                                obj.DIACHI = objthua.t.DIACHITHUADAT;
                            }

                            if (objthua.xa != null)
                            {
                                obj.XA = objthua.xa.TENKVHC;
                                var objhuyen = (from item in db.HC_HUYEN
                                                where item.HUYENID == objthua.xa.HUYENID
                                                select new
                                                {
                                                    item,
                                                    tinh = db.HC_TINH.Where(it => it.TINHID == item.TINHID).FirstOrDefault()
                                                }).FirstOrDefault();
                                if (objhuyen != null)
                                {
                                    obj.HUYEN = objhuyen.item.TENHUYEN;
                                    if (objhuyen.tinh != null)
                                    {
                                        obj.TINH = objhuyen.tinh.TENTINH;
                                    }
                                }
                            }

                            string mdsd = "";
                            if (objthua.listmdsddat != null)
                            {
                                foreach (var objmdsd in objthua.listmdsddat)
                                {
                                    if (objmdsd.dm != null)
                                        mdsd = mdsd + ";" + objmdsd.dm.TENMUCDICHSUDUNG;
                                }
                                mdsd = mdsd.Substring(1, mdsd.Length - 1);
                                obj.MUCDICHSUDUNG = mdsd;
                            }
                            else
                            {
                                var mdsddatbando = (from item in db.DM_MUCDICHSUDUNG where item.MAMUCDICHSUDUNG == mdsddat.ToUpper() select item).FirstOrDefault();
                                if (mdsddatbando != null)
                                {
                                    obj.MUCDICHSUDUNG = mdsddatbando.TENMUCDICHSUDUNG;
                                }
                            }

                            string strchu = "";
                            //var listquyen = (from item in db.DC_QUYENSUDUNGDAT where item.THUADATID == objthua.THUADATID select item);
                            if (objthua.listquyen != null)
                            {
                                foreach (var objquyen in objthua.listquyen)
                                {
                                    //var objnguoi = (from item in db.DC_NGUOI where item.NGUOIID == objquyen.NGUOIID select item).FirstOrDefault();
                                    if (objquyen.objnguoi != null)
                                    {
                                        if (objquyen.objnguoi.LOAIDOITUONGID == "1")
                                        {
                                            var objchu = (from item in db.DC_CANHAN where item.CANHANID == objquyen.objnguoi.CHITIETID select item).FirstOrDefault();
                                            if (objchu != null)
                                            {
                                                strchu = strchu + ";" + objchu.HOTEN;
                                            }
                                        }
                                        else if (objquyen.objnguoi.LOAIDOITUONGID == "2")
                                        {
                                            var objchu = (from item in db.DC_HOGIADINH where item.HOGIADINHID == objquyen.objnguoi.CHITIETID select item).FirstOrDefault();
                                            if (objchu != null)
                                            {
                                                var objten = (from item in db.DC_CANHAN where item.CANHANID == objchu.CHUHO select item).FirstOrDefault();
                                                if (objten != null)
                                                {
                                                    strchu = strchu + ";" + objten.HOTEN;
                                                }

                                            }
                                        }
                                        else if (objquyen.objnguoi.LOAIDOITUONGID == "3")
                                        {
                                            var objchu = (from item in db.DC_VOCHONG where item.VOCHONGID == objquyen.objnguoi.CHITIETID select item).FirstOrDefault();
                                            if (objchu != null)
                                            {
                                                //strchu = strchu + ";" + objchu.CHONG;
                                                var objchong = (from item in db.DC_CANHAN where item.CANHANID == objchu.CHONG select item).FirstOrDefault();
                                                if (objchong != null)
                                                {
                                                    strchu = objchong.HOTEN;

                                                }
                                                var objvo = (from item in db.DC_CANHAN where item.CANHANID == objchu.VO select item).FirstOrDefault();
                                                if (objvo != null)
                                                {
                                                    strchu = strchu + "; " + objvo.HOTEN;

                                                }
                                            }
                                        }
                                        else if (objquyen.objnguoi.LOAIDOITUONGID == "4")
                                        {

                                            var objchu = (from item in db.DC_CONGDONG where item.CONGDONGID == objquyen.objnguoi.CHITIETID select item).FirstOrDefault();
                                            if (objchu != null)
                                            {
                                                strchu = objchu.TENCONGDONG;
                                            }

                                        }
                                        else if (objquyen.objnguoi.LOAIDOITUONGID == "5")
                                        {
                                            var objchu = (from item in db.DC_TOCHUC where item.TOCHUCID == objquyen.objnguoi.CHITIETID select item).FirstOrDefault();
                                            if (objchu != null)
                                            {
                                                strchu = objchu.TENTOCHUC;
                                            }

                                        }
                                    }
                                }
                            }
                            if (strchu == "")
                            {
                                obj.TENCHU = tenchu;
                            }
                            else
                            { obj.TENCHU = strchu.Substring(1, strchu.Length - 1); }

                            string svgFileName = FileManager.RootPath + objthua.t.HSKTSVGFILEPATH;
                            string urlpng = FileManager.Temp_File_Path + "thuadat_" + maxa + "_" + sohieutobando + "_" + sothututhua + ".emf";

                            string pngFileName = Server.MapPath(urlpng);
                            if (System.IO.File.Exists(pngFileName))
                                System.IO.File.Delete(pngFileName);

                            string inkscapeArgs = string.Format(@"-f ""{0}"" -e ""{1}""", svgFileName, pngFileName);

                            Process inkscape = Process.Start(
                              new ProcessStartInfo(FileManager.InscapePath, inkscapeArgs));

                            inkscape.WaitForExit(3000);

                            obj.ANHMUITEN = "http://" + url + @"/Temp/Bac.png";
                        }
                    }
                }
                foreach (var toado in bangtoado)
                {
                    TableToaDo.Rows.Add(toado.Diem, toado.Toadox, toado.Toadoy);
                }
                //, Math.Round(toado.DoDai, 2)
                ALLPage_table.Rows.Add(obj.SOTHUTHUTHUA, obj.SOTOBANDO, "", obj.TENCHU, obj.MUCDICHSUDUNG, obj.DIENTICH, obj.DIACHI);

                //add bảng tọa độ đỉnh

                data.Tables.Add(ALLPage_table);
                data.Tables.Add(TableToaDo);
                return data;
            }
            catch (Exception ex)
            {

                throw;
            }

        }

        // web hồ sơ kỹ thuật

        [HttpPost]
        public ActionResult Inhskt(string sothututhua, string sohieutobando, string maxa, string tenchu, string mdsddat, string diachi, List<bangtoado> bangtoado)
        {
            Intrichluc obj = new Intrichluc();
            if (sothututhua != null && sohieutobando != null && maxa != null)
            {
                obj = returnobj(sothututhua, sohieutobando, maxa, tenchu, mdsddat, diachi, bangtoado);
                if (obj.ANHSODO.Trim() == "")
                {
                    return Content("<p>error image</p>");
                }
                return View(obj);
            }
            else
            {
                return View(obj);
            }
        }

        [HttpPost]
        public ActionResult InGCN(string SOTHUTUTHUA, string SOHIEUTOBANDO, string MAXA, string type)
        {
            if (type == null || type.Trim().Equals("")) type = "doc";
            decimal sttthua = decimal.Parse(SOTHUTUTHUA);
            decimal shtobd = decimal.Parse(SOHIEUTOBANDO);
            DC_GIAYCHUNGNHAN g = null;
            try
            {
                using (FTILISEntities db = new FTILISEntities())
                {
                    var items = (from td in db.DC_THUADAT.Where(t => t.SOTHUTUTHUA == sttthua && t.SOHIEUTOBANDO == shtobd && t.MAKVHC.EndsWith(MAXA))
                                 select new
                                 {
                                     td,
                                     quyen = (from q in db.DC_QUYENSUDUNGDAT.Where(t => t.THUADATID == td.THUADATID)
                                              select new
                                              {
                                                  q,
                                                  gcn = db.DC_GIAYCHUNGNHAN.Where(t => t.GIAYCHUNGNHANID == q.GIAYCHUNGNHANID).FirstOrDefault()
                                              }).FirstOrDefault()
                                 }).ToList();
                    foreach (var it in items)
                    {
                        if (it.quyen != null && it.quyen.gcn != null)
                        {
                            g = it.quyen.gcn;
                            break;
                        }
                    }

                    if (g != null)
                    {
                        var objgcn = DCGIAYCHUNGNHANServices.getGiayChungNhan(g.GIAYCHUNGNHANID);
                        DC_THUADAT thua = objgcn.DSQuyenSDDat[0].Thua;
                        var filepath = System.IO.Path.Combine(Server.MapPath("/App_Data/Mau/"), "gcntemp123.doc");
                        Aspose.Words.Document doc = new Aspose.Words.Document(filepath);
                        DataSet data = GenDBGCN(objgcn);
                        doc.MailMerge.ExecuteWithRegions(data);
                        Aspose.Words.DocumentBuilder builder = new Aspose.Words.DocumentBuilder(doc);
                        string urlpng = FileManager.Temp_File_Path + "thuadat_" + objgcn.DSQuyenSDDat[0].Thua.MAKVHC + "_"
                            + objgcn.DSQuyenSDDat[0].Thua.SOHIEUTOBANDO + "_" + objgcn.DSQuyenSDDat[0].Thua.SOTHUTUTHUA + ".emf";
                        var duongdananh = System.IO.Path.Combine(Server.MapPath(urlpng));
                        if (System.IO.File.Exists(duongdananh))
                        {
                            builder.MoveToCell(3, 0, 0, 0);
                            builder.InsertImage(duongdananh, 400, 350);
                        }
                        //mui ten chi bac
                        string muiten = "/Images/Bac.png";
                        var duongdanmuiten = System.IO.Path.Combine(Server.MapPath(muiten));
                        if (System.IO.File.Exists(duongdanmuiten))
                        {
                            builder.MoveToCell(3, 0, 1, 0);
                            builder.InsertImage(duongdanmuiten, 10, 100);
                        }
                        string tenfile = MAXA + "_" + SOTHUTUTHUA + "_" + SOHIEUTOBANDO;

                        var url = HttpContext.Request.Url.Authority;
                        string duongdan = "", path = "", path1;

                        path = Server.MapPath(FileManager.Temp_File_Path) + tenfile + "GCN.doc";
                        if (System.IO.File.Exists(path))
                            System.IO.File.Delete(path);
                        doc.Save(path);
                        duongdan = "http://" + url + FileManager.Temp_File_Path + tenfile + "GCN.doc";
                        if (type == "pdf")
                        {
                            path1 = Server.MapPath(FileManager.Temp_File_Path) + tenfile + "GCN.pdf";
                            if (System.IO.File.Exists(path1))
                                System.IO.File.Delete(path1);
                            Application appWord = new Application();
                            Microsoft.Office.Interop.Word.Document wordDocument;
                            wordDocument = appWord.Documents.Open(path);
                            wordDocument.ExportAsFixedFormat(path1, WdExportFormat.wdExportFormatPDF);
                            duongdan = "http://" + url + FileManager.Temp_File_Path + tenfile + "GCN.pdf";
                            wordDocument.Close();
                            appWord.Quit();
                            if (wordDocument != null)
                                System.Runtime.InteropServices.Marshal.ReleaseComObject(wordDocument);
                            if (appWord != null)
                                System.Runtime.InteropServices.Marshal.ReleaseComObject(appWord);
                            wordDocument = null;
                            appWord = null;
                            GC.Collect();
                        }

                        return Json(duongdan.ToString(), JsonRequestBehavior.AllowGet);
                    }
                    else
                    {
                        return Json(new { success = "false", message = "Có lỗi xảy ra" });
                    }
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        [HttpPost]
        public ActionResult InGCN_Html(string SOTHUTUTHUA, string SOHIEUTOBANDO, string MAXA)
        {
            decimal sttthua = decimal.Parse(SOTHUTUTHUA);
            decimal shtobd = decimal.Parse(SOHIEUTOBANDO);
            DC_GIAYCHUNGNHAN g = null;
            try
            {
                using (FTILISEntities db = new FTILISEntities())
                {
                    var items = (from td in db.DC_THUADAT.Where(t => t.SOTHUTUTHUA == sttthua && t.SOHIEUTOBANDO == shtobd && t.MAKVHC.EndsWith(MAXA))
                                 select new
                                 {
                                     td,
                                     quyen = (from q in db.DC_QUYENSUDUNGDAT.Where(t => t.THUADATID == td.THUADATID)
                                              select new
                                              {
                                                  q,
                                                  gcn = db.DC_GIAYCHUNGNHAN.Where(t => t.GIAYCHUNGNHANID == q.GIAYCHUNGNHANID).FirstOrDefault()
                                              }).FirstOrDefault()
                                 }).ToList();
                    foreach (var it in items)
                    {
                        if (it.quyen != null && it.quyen.gcn != null)
                        {
                            g = it.quyen.gcn;
                            break;
                        }
                    }
                    if (g != null)
                    {
                        var objgcn = DCGIAYCHUNGNHANServices.getGiayChungNhan(g.GIAYCHUNGNHANID);
                        DC_THUADAT thua = objgcn.DSQuyenSDDat[0].Thua;
                        // giấy chứng nhận
                        var gcn = DCGIAYCHUNGNHANServices.getGCN_inGCN(objgcn);
                        //   url = "/Temp/thuadat" + maxa + "_" + sohieutobando + "_" + sothututhua + ".svg";
                        var url = HttpContext.Request.Url.Authority;

                        if (thua != null)
                        {
                            if (thua.HSKTPNGFILEPATH == null)
                            {
                                var td = (from it in db.DC_THUADAT.Where(it => it.THUADATID == thua.THUADATID) select it).FirstOrDefault();
                                if (td != null && td.HSKTSVGFILEPATH != null)
                                {
                                    thua.HSKTSVGFILEPATH = td.HSKTSVGFILEPATH;
                                    byte[] fileBytes = System.IO.File.ReadAllBytes(FileManager.RootPath + thua.HSKTSVGFILEPATH);
                                    string x64string = System.Convert.ToBase64String(fileBytes);
                                    gcn.duongdansvg = "data:image/svg+xml;base64," + x64string;
                                }
                            }
                        }

                        //gcn.duongdansvg = "http://" + url + thua.HSKTSVGFILEPATH; //"/Temp/thuadat" + MAXA + "_" + SOHIEUTOBANDO + "_" + SOTHUTUTHUA + ".svg";
                        gcn.duongdanmuiten = "http://" + url + "/Images/Bac.png";
                        return View("InGCN_Html", gcn);
                    }
                    else
                    {
                        return View("InGCN_Html", (new giaychungnhan()));
                    }
                }
            }
            catch (Exception ex)
            {
                return View("InGCN_Html", (new giaychungnhan()));
            }
        }

        [HttpPost]
        public ActionResult InGCN_TuGCN_Html(string gcnid)
        {
            try
            {
                BoHoSoModel bhs = (BoHoSoModel)Session["BoHoSo_" + Guid.NewGuid().ToString()];
                if (bhs.CurDC_GIAYCHUNGNHAN.GIAYCHUNGNHANID == gcnid && bhs.CurDC_GIAYCHUNGNHAN.DSQuyenSDDat.Count > 0
                    && bhs.CurDC_GIAYCHUNGNHAN.DSQuyenSDDat[0].Thua != null)
                {
                    using (FTILISEntities db = new FTILISEntities())
                    {
                        var objgcn = bhs.CurDC_GIAYCHUNGNHAN;
                        DC_THUADAT thua = bhs.CurDC_GIAYCHUNGNHAN.DSQuyenSDDat[0].Thua;
                        // giấy chứng nhận
                        var gcn = DCGIAYCHUNGNHANServices.getGCN_inGCN(objgcn);
                        //   url = "/Temp/thuadat" + maxa + "_" + sohieutobando + "_" + sothututhua + ".svg";
                        var url = HttpContext.Request.Url.Authority;

                        if (thua != null)
                        {
                            if (thua.HSKTPNGFILEPATH == null)
                            {
                                var td = (from it in db.DC_THUADAT.Where(it => it.THUADATID == thua.THUADATID) select it).FirstOrDefault();
                                if (td != null && td.HSKTSVGFILEPATH != null)
                                {
                                    thua.HSKTSVGFILEPATH = td.HSKTSVGFILEPATH;
                                    BOHOSOServices.LuuBoHoSoXuLy(bhs.HoSoTN);
                                    byte[] fileBytes = System.IO.File.ReadAllBytes(FileManager.RootPath + thua.HSKTSVGFILEPATH);
                                    string x64string = System.Convert.ToBase64String(fileBytes);
                                    gcn.duongdansvg = "data:image/svg+xml;base64," + x64string;
                                }
                            }
                        }

                        //gcn.duongdansvg = "http://" + url + thua.HSKTSVGFILEPATH; //"/Temp/thuadat" + MAXA + "_" + SOHIEUTOBANDO + "_" + SOTHUTUTHUA + ".svg";
                        gcn.duongdanmuiten = "http://" + url + "/Images/Bac.png";
                        return View("InGCN_Html", gcn);
                    }
                }
                else
                {
                    return View("InGCN_Html", (new giaychungnhan()));
                }
            }
            catch (Exception ex)
            {

                return View("InGCN_Html", (new giaychungnhan()));
            }
        }

        [HttpPost]
        public ActionResult InGCN_TuGCN(string gcnid, string type)
        {
            try
            {
                BoHoSoModel bhs = (BoHoSoModel)Session["BoHoSo_" + Guid.NewGuid().ToString()];
                var filepath = System.IO.Path.Combine(Server.MapPath("/App_Data/Mau/"), "gcntemp123.doc");
                Aspose.Words.Document doc = new Aspose.Words.Document(filepath);

                if (bhs.CurDC_GIAYCHUNGNHAN.GIAYCHUNGNHANID == gcnid && bhs.CurDC_GIAYCHUNGNHAN.DSQuyenSDDat.Count > 0
                    && bhs.CurDC_GIAYCHUNGNHAN.DSQuyenSDDat[0].Thua != null)
                {
                    DC_THUADAT thua = bhs.CurDC_GIAYCHUNGNHAN.DSQuyenSDDat[0].Thua;
                    string MAXA = thua.MAKVHC, SOTHUTUTHUA = thua.SOTHUTUTHUA.ToString(), SOHIEUTOBANDO = thua.SOHIEUTOBANDO.ToString();
                    DataSet data = GenDBGCN(bhs.CurDC_GIAYCHUNGNHAN);
                    doc.MailMerge.ExecuteWithRegions(data);
                    Aspose.Words.DocumentBuilder builder = new Aspose.Words.DocumentBuilder(doc);
                    string urlpng = FileManager.Temp_File_Path + "thuadat_" + bhs.CurDC_GIAYCHUNGNHAN.DSQuyenSDDat[0].Thua.MAKVHC + "_"
                        + bhs.CurDC_GIAYCHUNGNHAN.DSQuyenSDDat[0].Thua.SOHIEUTOBANDO + "_" + bhs.CurDC_GIAYCHUNGNHAN.DSQuyenSDDat[0].Thua.SOTHUTUTHUA + ".emf";
                    var duongdananh = System.IO.Path.Combine(Server.MapPath(urlpng));
                    if (System.IO.File.Exists(duongdananh))
                    {
                        builder.MoveToCell(3, 0, 0, 0);
                        builder.InsertImage(duongdananh, 400, 350);
                    }
                    //mui ten chi bac
                    string muiten = "/Images/Bac.png";
                    var duongdanmuiten = System.IO.Path.Combine(Server.MapPath(muiten));
                    if (System.IO.File.Exists(duongdanmuiten))
                    {
                        builder.MoveToCell(3, 0, 1, 0);
                        builder.InsertImage(duongdanmuiten, 10, 100);
                    }
                    string tenfile = MAXA + "_" + SOTHUTUTHUA + "_" + SOHIEUTOBANDO;

                    var url = HttpContext.Request.Url.Authority;
                    string duongdan = "", path = "", path1;

                    path = Server.MapPath(FileManager.Temp_File_Path) + tenfile + "GCN.doc";
                    if (System.IO.File.Exists(path))
                        System.IO.File.Delete(path);
                    doc.Save(path);
                    duongdan = "http://" + url + FileManager.Temp_File_Path + tenfile + "GCN.doc";
                    if (type == "pdf")
                    {
                        path1 = Server.MapPath(FileManager.Temp_File_Path) + tenfile + "GCN.pdf";
                        if (System.IO.File.Exists(path1))
                            System.IO.File.Delete(path1);
                        Application appWord = new Application();
                        Microsoft.Office.Interop.Word.Document wordDocument;
                        wordDocument = appWord.Documents.Open(path);
                        wordDocument.ExportAsFixedFormat(path1, WdExportFormat.wdExportFormatPDF);
                        duongdan = "http://" + url + FileManager.Temp_File_Path + tenfile + "GCN.pdf";
                        wordDocument.Close();
                        appWord.Quit();
                        if (wordDocument != null)
                            System.Runtime.InteropServices.Marshal.ReleaseComObject(wordDocument);
                        if (appWord != null)
                            System.Runtime.InteropServices.Marshal.ReleaseComObject(appWord);
                        wordDocument = null;
                        appWord = null;
                        GC.Collect();
                    }

                    return Json(duongdan.ToString(), JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json(new { success = "false", message = "Có lỗi xảy ra" });
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        [HttpPost]
        public ActionResult InGCN_14(string SOTHUTUTHUA, string SOHIEUTOBANDO, string MAXA)
        {
            try
            {

                if (SOTHUTUTHUA != null && SOHIEUTOBANDO != null && MAXA != null)
                {
                    using (FTILISEntities db = new FTILISEntities())
                    {
                        var objxa = (from item in db.HC_DMKVHC where item.MAXA == MAXA select item).FirstOrDefault();
                        // var objgcn = DCGIAYCHUNGNHANServices.getGCN_byThua(objxa.XAID, SOTHUTUTHUA, SOHIEUTOBANDO);
                        // giấy chứng nhận
                        var gcn = DCGIAYCHUNGNHANServices.getbiendong_inGCN(objxa.KVHCID, SOTHUTUTHUA, SOHIEUTOBANDO);
                        //   url = "/Temp/thuadat" + maxa + "_" + sohieutobando + "_" + sothututhua + ".svg";

                        return View(gcn);
                    }
                }
                else
                {
                    return View((new ObjBienDong()));
                }
            }
            catch (Exception ex)
            {

                return View((new ObjBienDong()));
            }
        }
        [HttpPost]
        public ActionResult InGCN_23(string SOTHUTUTHUA, string SOHIEUTOBANDO, string MAXA)
        {
            try
            {

                if (SOTHUTUTHUA != null && SOHIEUTOBANDO != null && MAXA != null)
                {
                    using (FTILISEntities db = new FTILISEntities())
                    {
                        var objxa = (from item in db.HC_DMKVHC where item.MAXA == MAXA select item).FirstOrDefault();
                        // var objgcn = DCGIAYCHUNGNHANServices.getGCN_byThua(objxa.XAID, SOTHUTUTHUA, SOHIEUTOBANDO);
                        // giấy chứng nhận
                        var gcn = DCGIAYCHUNGNHANServices.getbiendong_inGCN(objxa.KVHCID, SOTHUTUTHUA, SOHIEUTOBANDO);
                        //   url = "/Temp/thuadat" + maxa + "_" + sohieutobando + "_" + sothututhua + ".svg";

                        return View(gcn);
                    }
                }
                else
                {
                    return View((new ObjBienDong()));
                }
            }
            catch (Exception ex)
            {

                return View((new ObjBienDong()));
            }
        }

        public DataSet GenDBGCN(string SOTHUTUTHUA, string SOHIEUTOBANDO, string MAXA)
        {
            decimal shtobd, sttthua;
            if (decimal.TryParse(SOHIEUTOBANDO, out shtobd) && decimal.TryParse(SOTHUTUTHUA, out sttthua))
            {
                using (FTILISEntities db = new FTILISEntities())
                {

                    var td = (from it in db.DC_THUADAT.Where(it => it.MAKVHC == MAXA && it.SOHIEUTOBANDO == shtobd && it.SOTHUTUTHUA == sttthua)
                              select new
                              {
                                  it,
                                  qsdd = (from q in db.DC_QUYENSUDUNGDAT.Where(t => t.THUADATID == it.THUADATID)
                                          select new
                                          {
                                              q,
                                              gcn = db.DC_GIAYCHUNGNHAN.Where(t1 => t1.TRANGTHAIXULY.Equals("Y") && t1.GIAYCHUNGNHANID == q.GIAYCHUNGNHANID).FirstOrDefault()
                                          }).ToList()
                              }).ToList();
                    bool found = false;
                    DC_GIAYCHUNGNHAN gcn = null;
                    foreach (var it in td)
                    {
                        if (it.qsdd != null)
                            foreach (var g in it.qsdd)
                            {
                                if (g.gcn != null)
                                {
                                    gcn = g.gcn;
                                    found = true;
                                    break;
                                }
                            }
                        if (found) break;
                    }
                    if (gcn != null)
                    {
                        gcn = DCGIAYCHUNGNHANServices.getGiayChungNhan(gcn.GIAYCHUNGNHANID);
                        return GenDBGCN(gcn);
                    }
                }
            }
            return null;
        }

        public DataSet GenDBGCN(DC_GIAYCHUNGNHAN dcGCN)
        {
            try
            {
                DataSet data = new DataSet();

                System.Data.DataTable ALLPage_table = new System.Data.DataTable("StoreDetails");
                // chủ sử dụng
                ALLPage_table.Columns.Add("TENCHU1");
                ALLPage_table.Columns.Add("sinhnamchu1");
                ALLPage_table.Columns.Add("socmtchu1");
                ALLPage_table.Columns.Add("ngaycmtchu1");
                ALLPage_table.Columns.Add("noicmtchu1");
                ALLPage_table.Columns.Add("diachichu1");
                ALLPage_table.Columns.Add("TENCHU2");
                ALLPage_table.Columns.Add("sinhnamchu2");
                ALLPage_table.Columns.Add("socmtchu2");
                ALLPage_table.Columns.Add("ngaycmtchu2");
                ALLPage_table.Columns.Add("noicmtchu2");
                ALLPage_table.Columns.Add("diachichu2");
                ALLPage_table.Columns.Add("mavach");
                // thửa
                ALLPage_table.Columns.Add("sothua");
                ALLPage_table.Columns.Add("soto");
                ALLPage_table.Columns.Add("diachi");
                ALLPage_table.Columns.Add("dientichpl");
                ALLPage_table.Columns.Add("bangchu");

                ALLPage_table.Columns.Add("hinhthucsudung");
                ALLPage_table.Columns.Add("mucdichsudung");
                ALLPage_table.Columns.Add("thoihansudung");
                ALLPage_table.Columns.Add("nguongocsudung");
                // nhà
                ALLPage_table.Columns.Add("N_loainhao");
                ALLPage_table.Columns.Add("N_dtxaydung");
                ALLPage_table.Columns.Add("N_dtsan");
                ALLPage_table.Columns.Add("N_hinhthucsohuu");

                ALLPage_table.Columns.Add("N_caphang");
                ALLPage_table.Columns.Add("N_thoihan");
                ALLPage_table.Columns.Add("tencongtrinhxaydung");

                // rừng
                ALLPage_table.Columns.Add("R_loai");
                ALLPage_table.Columns.Add("R_dt");
                ALLPage_table.Columns.Add("R_nguon");
                ALLPage_table.Columns.Add("R_sh");
                ALLPage_table.Columns.Add("R_th");
                // cây lâu năm
                ALLPage_table.Columns.Add("C_loaicay");
                ALLPage_table.Columns.Add("C_dt");
                ALLPage_table.Columns.Add("C_ht");
                ALLPage_table.Columns.Add("C_th");
                //giấy chứng nhận
                ALLPage_table.Columns.Add("G_ghichu");
                ALLPage_table.Columns.Add("G_sovaoso");

                // hạng mục
                System.Data.DataTable tablehangmuc = new System.Data.DataTable("hangmuc");
                tablehangmuc.Columns.Add("H_ten");
                tablehangmuc.Columns.Add("H_dt");
                tablehangmuc.Columns.Add("H_dtsan");
                tablehangmuc.Columns.Add("H_ht");
                tablehangmuc.Columns.Add("H_cap");
                tablehangmuc.Columns.Add("H_th");

                giaychungnhan gcn = new giaychungnhan();
                if (dcGCN != null)
                    gcn = DCGIAYCHUNGNHANServices.getGCN_inGCN(dcGCN);

                ALLPage_table.Rows.Add(gcn.TENCHU1, gcn.sinhnamchu1, gcn.socmtchu1, gcn.ngaycmtchu1, gcn.noicmtchu1,
                    gcn.diachichu1, gcn.TENCHU2, gcn.sinhnamchu2, gcn.socmtchu2, gcn.ngaycmtchu2,
                    gcn.noicmtchu2, gcn.diachichu2, gcn.mavach, gcn.Dsthuadat[0].sothua, gcn.Dsthuadat[0].soto,
                    gcn.Dsthuadat[0].diachi, gcn.Dsthuadat[0].dientichpl, gcn.Dsthuadat[0].bangchu, gcn.Dsthuadat[0].hinhthucsudung, gcn.Dsthuadat[0].mucdichsudung,
                    gcn.Dsthuadat[0].thoihansudung, gcn.Dsthuadat[0].nguongocsudung, gcn.Dsnhao[0].N_loainhao, gcn.Dsnhao[0].N_dtxaydung, gcn.Dsnhao[0].N_dtsan,
                    gcn.Dsnhao[0].N_hinhthucsohuu, gcn.Dsnhao[0].N_caphang, gcn.Dsnhao[0].N_thoihan, gcn.tencongtrinhxaydung, gcn.R_loai,
                    gcn.R_dt, gcn.R_nguon, gcn.R_sh, gcn.R_th, gcn.C_loaicay,
                    gcn.C_dt, gcn.C_ht, gcn.C_th, gcn.G_ghichu, gcn.G_sovaoso);

                if (gcn.Dshangmuc != null)
                {
                    foreach (var item in gcn.Dshangmuc)
                    {
                        tablehangmuc.Rows.Add(item.H_ten, item.H_dt, item.H_dtsan, item.H_ht, item.H_cap, item.H_th);
                    }
                }
                else
                {
                    tablehangmuc.Rows.Add("", "", "", "", "", "");
                }
                data.Tables.Add(ALLPage_table);
                data.Tables.Add(tablehangmuc);

                if (dcGCN.DSQuyenSDDat.Count > 0 && dcGCN.DSQuyenSDDat[0].Thua != null)
                {
                    string svgFileName = FileManager.RootPath + dcGCN.DSQuyenSDDat[0].Thua.HSKTSVGFILEPATH;
                    string urlpng = FileManager.Temp_File_Path + "thuadat_" + dcGCN.DSQuyenSDDat[0].Thua.MAKVHC + "_"
                        + dcGCN.DSQuyenSDDat[0].Thua.SOHIEUTOBANDO + "_" + dcGCN.DSQuyenSDDat[0].Thua.SOTHUTUTHUA + ".emf";

                    string pngFileName = Server.MapPath(urlpng);
                    if (System.IO.File.Exists(pngFileName))
                        System.IO.File.Delete(pngFileName);

                    string inkscapeArgs = string.Format(@"-f ""{0}"" -e ""{1}""", svgFileName, pngFileName);

                    Process inkscape = Process.Start(new ProcessStartInfo(FileManager.InscapePath, inkscapeArgs));


                    inkscape.WaitForExit(3000);
                }

                return data;
            }
            catch (Exception ex)
            {

                throw;
            }

        }
    }
    
}