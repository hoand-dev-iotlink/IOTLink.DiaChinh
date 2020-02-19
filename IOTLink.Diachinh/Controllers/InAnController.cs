using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;
using Aspose.Words;
using Aspose.Words.Tables;
using IOTLink.Diachinh.Models;
using IOTLink.Diachinh.Sevice;

namespace IOTLink.Diachinh.Controllers
{
    public class InAnController : Controller
    {
        private FileManager fileManag = new FileManager();
        // GET: InAn
        public ActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public ActionResult InTrichLuc(InAnViewModel param)
        {
            try
            {
                Intrichluc obj = new Intrichluc();
                if (param.SOTHUTHUTHUA != null && param.SOTOBANDO != null && param.MaXa != null)
                {
                    obj.XA = param.XA;
                    obj.HUYEN = param.HUYEN;
                    obj.TINH = param.TINH;
                    obj.TENCHU = param.TENCHU;
                    obj.DIACHI = param.DIACHI;
                    obj.MUCDICHSUDUNG = param.MUCDICHSUDUNG;
                    obj.SOTOBANDO = param.SOTOBANDO;
                    obj.SOTHUTHUTHUA = param.SOTHUTHUTHUA;
                    obj.DIENTICH = param.DIENTICH;
                    obj.MUCDICHSUDUNG = param.MUCDICHSUDUNG;

                    //bảng tọa độ
                    obj.DsDinh = new List<bangtoado>();
                    obj.DsDinhInTrichLuc = new List<bangtoadoInTrichLuc>();

                    //in trích lục
                    for (int i = 0; i <= param.DsDinh.Count - 1; i++)
                    {
                        bangtoadoInTrichLuc abc = new bangtoadoInTrichLuc();
                        if (i <= param.DsDinh.Count - 2)
                        {

                            abc.Diem = param.DsDinh[i].Diem + "-" + param.DsDinh[i + 1].Diem;
                            abc.DoDaiCanh = Math.Round(param.DsDinh[i].DoDai, 2);
                            obj.DsDinhInTrichLuc.Add(abc);
                        }
                        else if (i == param.DsDinh.Count - 1)
                        {
                            abc.Diem = param.DsDinh[i].Diem + "-" + param.DsDinh[0].Diem;
                            abc.DoDaiCanh = Math.Round(param.DsDinh[i].DoDai, 2);
                            obj.DsDinhInTrichLuc.Add(abc);
                        }
                    }
                    obj.DsDinh = param.DsDinh;
                    string fileName = param.MaXa + "_" + param.SOTOBANDO + "_" + param.SOTHUTHUTHUA + ".svg";
                    string additionPath = "\\DiaChinh\\" + param.MaXa + "\\";
                    string url = fileManag.root + additionPath + fileName;
                    if (System.IO.File.Exists(url))
                    {
                        byte[] fileBytes = System.IO.File.ReadAllBytes(url);
                        string x64string = System.Convert.ToBase64String(fileBytes);
                        obj.ANHSODO = "data:image/svg+xml;base64," + x64string;
                    }
                    else
                    {
                        obj.ANHSODO = "";
                    }
                    obj.ANHMUITEN = "/images/Bac.png";
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
            catch (Exception ex)
            {

                throw;
            }

        }

        [HttpPost]
        public ActionResult DownloadFile(InAnViewModel param)
        {
            try
            {
                var filepath = System.IO.Path.Combine(Server.MapPath("/App_Data/Mau/"), "mauhskythuat1.doc");
                //   var duongdananh = System.IO.Path.Combine(Server.MapPath("/Temp/"), "png1.png");
                Aspose.Words.Document doc = new Aspose.Words.Document(filepath);
                DataSet data = GenDB(param);
                doc.MailMerge.ExecuteWithRegions(data);
                Aspose.Words.DocumentBuilder builder = new Aspose.Words.DocumentBuilder(doc);
                builder.MoveToCell(0, 0, 0, 0);
                var urlpng = "/Temp/thuadat" + param.MaXa + "_" + param.SOTOBANDO + "_" + param.SOTHUTHUTHUA + ".emf";
                var duongdananh = System.IO.Path.Combine(Server.MapPath(urlpng));
                if (System.IO.File.Exists(duongdananh))
                {
                    builder.InsertImage(duongdananh, 240, 200);
                }

                Table tb = (Table)builder.Document.GetChild(NodeType.Table, 1, true);
                Row cr, r;
                //Cell cell;
                Run run;
                Font font;

                Table table = (Table)doc.GetChild(NodeType.Table, 1, true);
                System.Data.DataTable TableToaDo = data.Tables[1];
                for (int i = 0; i < TableToaDo.Rows.Count; i++)
                {
                    cr = (Aspose.Words.Tables.Row)tb.LastRow.Clone(true);
                    r = tb.LastRow;
                    for (int j = 0; j < 2; j++)
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

                //Column column = Column.FromIndex(table, 1);
                ////Column newColumn = column.InsertColumnBefore();
                //foreach (Cell cell in column.Cells)
                //    cell.FirstParagraph.AppendChild(new Run(doc, "Column Text " + column.IndexOf(cell)));

                //System.Data.DataTable TableToaDo = data.Tables[1];
                //for (int i = 0; i < TableToaDo.Rows.Count; i++)
                //{
                //    cr = (Aspose.Words.Tables.Row)tb.LastRow.Clone(true);
                //    r = tb.LastRow;
                //    for (int j = 0; j < 2; j++)
                //    {
                //        run = new Aspose.Words.Run(r.Cells[j].Document);//r.Cells[j].LastParagraph.Runs[r.Cells[j].LastParagraph.Runs.Count - 1];
                //        font = run.Font;
                //        font.Name = "Times New Roman";
                //        font.Size = 10;
                //        run.Text = TableToaDo.Rows[i][j].ToString();
                //        r.Cells[j].LastParagraph.AppendChild(run);
                //    }
                //    if (i != TableToaDo.Rows.Count - 1)
                //        tb.AppendChild(cr);
                //}

                string tenfile = param.MaXa + "_" + param.SOTOBANDO + "_" + param.SOTHUTHUTHUA;

                var url = HttpContext.Request.Url.Authority;
                string duongdan = "";
                if (param.TypeFile.ToLower() == "doc".ToLower())
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
        public Intrichluc returnobj(string sothututhua, string sohieutobando, string maxa, string tenchu, string mdsddat, string diachi, List<bangtoado> bangtoado)
        {
            Intrichluc obj = new Intrichluc();
            //using (FTILISEntities db = new FTILISEntities())
            //{
            //    var objmaxa = (from item in db.HC_DMKVHC where item.MAXA == maxa select item).FirstOrDefault();
            //    decimal sothua = decimal.Parse(sothututhua);
            //    decimal soto = decimal.Parse(sohieutobando);
            //    var objthua = (from item in db.DC_THUADAT where item.SOTHUTUTHUA == sothua && item.SOHIEUTOBANDO == soto && item.XAID == objmaxa.KVHCID select item).FirstOrDefault();
            //    if (objthua != null)
            //    {
            //        var url = HttpContext.Request.Url.Authority;

            //        obj.SOTHUTHUTHUA = objthua.SOTHUTUTHUA.ToString();
            //        obj.SOTOBANDO = objthua.SOHIEUTOBANDO.ToString();
            //        obj.DIENTICH = objthua.DIENTICH.ToString();
            //        if (obj.DIACHI == "")
            //        {
            //            obj.DIACHI = diachi;
            //        }
            //        else
            //        {
            //            obj.DIACHI = objthua.DIACHITHUADAT;
            //        }
            //        var objxa = (from item in db.HC_DMKVHC where item.KVHCID == objthua.XAID select item).FirstOrDefault();
            //        if (objxa != null)
            //        {
            //            obj.XA = objxa.TENKVHC;
            //            var objhuyen = (from item in db.HC_HUYEN where item.HUYENID == objxa.HUYENID select item).FirstOrDefault();
            //            if (objhuyen != null)
            //            {
            //                obj.HUYEN = objhuyen.TENHUYEN;
            //                var objTinh = (from item in db.HC_TINH where item.TINHID == objhuyen.TINHID select item).FirstOrDefault();
            //                if (objTinh != null)
            //                {
            //                    obj.TINH = objTinh.TENTINH;

            //                }
            //            }
            //        }
            //        var listmdsddat = (from item in db.DC_MUCDICHSUDUNGDAT join dm in db.DM_MUCDICHSUDUNG on item.MUCDICHSUDUNGID equals dm.MUCDICHSUDUNGID where item.THUADATID == objthua.THUADATID select dm);
            //        string mdsd = "";
            //        if (listmdsddat != null)
            //        {
            //            foreach (var objmdsd in listmdsddat)
            //            {

            //                mdsd = mdsd + ";" + objmdsd.TENMUCDICHSUDUNG;
            //            }
            //            mdsd = mdsd.Substring(1, mdsd.Length - 1);
            //            obj.MUCDICHSUDUNG = mdsd;
            //        }
            //        else
            //        {
            //            var mdsddatbando = (from item in db.DM_MUCDICHSUDUNG where item.MAMUCDICHSUDUNG == mdsddat.ToUpper() select item).FirstOrDefault();
            //            if (mdsddatbando != null)
            //            {
            //                obj.MUCDICHSUDUNG = mdsddatbando.TENMUCDICHSUDUNG;
            //            }
            //        }


            //        string strchu = "";
            //        var listquyen = (from item in db.DC_QUYENSUDUNGDAT where item.THUADATID == objthua.THUADATID select item);
            //        if (listquyen != null)
            //        {
            //            foreach (var objquyen in listquyen)
            //            {
            //                var objnguoi = (from item in db.DC_NGUOI where item.NGUOIID == objquyen.NGUOIID select item).FirstOrDefault();
            //                if (objnguoi != null)
            //                {
            //                    if (objnguoi.LOAIDOITUONGID == "1")
            //                    {
            //                        var objchu = (from item in db.DC_CANHAN where item.CANHANID == objnguoi.CHITIETID select item).FirstOrDefault();
            //                        if (objchu != null)
            //                        {
            //                            strchu = strchu + ";" + objchu.HOTEN;
            //                        }
            //                    }
            //                    else if (objnguoi.LOAIDOITUONGID == "2")
            //                    {
            //                        var objchu = (from item in db.DC_HOGIADINH where item.HOGIADINHID == objnguoi.CHITIETID select item).FirstOrDefault();
            //                        if (objchu != null)
            //                        {
            //                            var objten = (from item in db.DC_CANHAN where item.CANHANID == objchu.CHUHO select item).FirstOrDefault();
            //                            if (objten != null)
            //                            {
            //                                strchu = strchu + ";" + objten.HOTEN;
            //                            }

            //                        }
            //                    }
            //                    else if (objnguoi.LOAIDOITUONGID == "3")
            //                    {
            //                        var objchu = (from item in db.DC_VOCHONG where item.VOCHONGID == objnguoi.CHITIETID select item).FirstOrDefault();
            //                        if (objchu != null)
            //                        {
            //                            //strchu = strchu + ";" + objchu.CHONG;
            //                            var objchong = (from item in db.DC_CANHAN where item.CANHANID == objchu.CHONG select item).FirstOrDefault();
            //                            if (objchong != null)
            //                            {
            //                                strchu = objchong.HOTEN;

            //                            }
            //                            var objvo = (from item in db.DC_CANHAN where item.CANHANID == objchu.VO select item).FirstOrDefault();
            //                            if (objvo != null)
            //                            {
            //                                strchu = strchu + "; " + objvo.HOTEN;

            //                            }
            //                        }
            //                    }
            //                    else if (objnguoi.LOAIDOITUONGID == "4")
            //                    {

            //                        var objchu = (from item in db.DC_CONGDONG where item.CONGDONGID == objnguoi.CHITIETID select item).FirstOrDefault();
            //                        if (objchu != null)
            //                        {
            //                            strchu = objchu.TENCONGDONG;
            //                        }

            //                    }
            //                    else if (objnguoi.LOAIDOITUONGID == "5")
            //                    {
            //                        var objchu = (from item in db.DC_TOCHUC where item.TOCHUCID == objnguoi.CHITIETID select item).FirstOrDefault();
            //                        if (objchu != null)
            //                        {
            //                            strchu = objchu.TENTOCHUC;
            //                        }

            //                    }
            //                }
            //            }
            //        }
            //        if (strchu == "")
            //        {
            //            obj.TENCHU = tenchu;
            //        }
            //        else
            //        { obj.TENCHU = strchu.Substring(1, strchu.Length - 1); }

            //        //bảng tọa độ
            //        obj.DsDinh = new List<Controllers.bangtoado>();
            //        obj.DsDinhInTrichLuc = new List<bangtoadoInTrichLuc>();

            //        obj.DsDinh = bangtoado;
            //        //in trích lục
            //        for (int i = 0; i <= bangtoado.Count - 1; i++)
            //        {
            //            bangtoadoInTrichLuc abc = new bangtoadoInTrichLuc();
            //            if (i <= bangtoado.Count - 2)
            //            {

            //                abc.Diem = bangtoado[i].Diem + "-" + bangtoado[i + 1].Diem;
            //                abc.DoDaiCanh = Math.Round(bangtoado[i].DoDai, 2);
            //                obj.DsDinhInTrichLuc.Add(abc);
            //            }
            //            else if (i == bangtoado.Count - 1)
            //            {
            //                abc.Diem = bangtoado[i].Diem + "-" + bangtoado[0].Diem;
            //                abc.DoDaiCanh = Math.Round(bangtoado[i].DoDai, 2);
            //                obj.DsDinhInTrichLuc.Add(abc);
            //            }
            //        }
            //        if (objthua.HSKTSVGFILEPATH != null)
            //        {
            //            byte[] fileBytes = System.IO.File.ReadAllBytes(FileManager.RootPath + objthua.HSKTSVGFILEPATH);
            //            string x64string = System.Convert.ToBase64String(fileBytes);
            //            obj.ANHSODO = "data:image/svg+xml;base64," + x64string;//"http://" + url + objthua.HSKTSVGFILEPATH;
            //                                                                   //obj.ANHDIEMTOADO = "http://" + url + @"/Temp/test.svg";
            //        }
            //        else
            //        {
            //            obj.ANHSODO = "";
            //        }
            //        obj.ANHMUITEN = "http://" + url + @"/Images/Bac.png";
            //    }
            //}
            return obj;
        }

        public DataSet GenDB(InAnViewModel param)
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
                if (param.SOTHUTHUTHUA != null && param.SOTOBANDO != null && param.MaXa != null)
                {
                    obj.XA = param.XA;
                    obj.HUYEN = param.HUYEN;
                    obj.TINH = param.TINH;
                    obj.TENCHU = param.TENCHU;
                    obj.DIACHI = param.DIACHI;
                    obj.MUCDICHSUDUNG = param.MUCDICHSUDUNG;
                    obj.SOTOBANDO = param.SOTOBANDO;
                    obj.SOTHUTHUTHUA = param.SOTHUTHUTHUA;
                    obj.DIENTICH = param.DIENTICH;
                    obj.MUCDICHSUDUNG = param.MUCDICHSUDUNG;
                    //bảng tọa độ
                    obj.DsDinh = new List<bangtoado>();
                    obj.DsDinhInTrichLuc = new List<bangtoadoInTrichLuc>();

                    //in trích lục
                    for (int i = 0; i <= param.DsDinh.Count - 1; i++)
                    {
                        bangtoadoInTrichLuc abc = new bangtoadoInTrichLuc();
                        if (i <= param.DsDinh.Count - 2)
                        {

                            abc.Diem = param.DsDinh[i].Diem + "-" + param.DsDinh[i + 1].Diem;
                            abc.DoDaiCanh = Math.Round(param.DsDinh[i].DoDai, 2);
                            obj.DsDinhInTrichLuc.Add(abc);
                        }
                        else if (i == param.DsDinh.Count - 1)
                        {
                            abc.Diem = param.DsDinh[i].Diem + "-" + param.DsDinh[0].Diem;
                            abc.DoDaiCanh = Math.Round(param.DsDinh[i].DoDai, 2);
                            obj.DsDinhInTrichLuc.Add(abc);
                        }
                    }
                    obj.DsDinh = param.DsDinh;
                    string fileName = param.MaXa + "_" + param.SOTOBANDO + "_" + param.SOTHUTHUTHUA + ".svg";
                    string additionPath = "\\DiaChinh\\" + param.MaXa + "\\";
                    string svgFileName = fileManag.root + additionPath + fileName;

                    string urlpng = "/Temp/thuadat" + param.MaXa + "_" + param.SOTOBANDO + "_" + param.SOTHUTHUTHUA + ".emf";
                    string pngFileName = Server.MapPath(urlpng);
                    string inkscapeArgs = string.Format(@"-f ""{0}"" -e ""{1}""", svgFileName, pngFileName);
                    Process inkscape = Process.Start(new ProcessStartInfo(fileManag.inscapePath, inkscapeArgs));

                    inkscape.WaitForExit(3000);

                    obj.ANHMUITEN = "/Temp/Bac.png";
                }
                ALLPage_table.Rows.Add(obj.SOTHUTHUTHUA, obj.SOTOBANDO, obj.XA, obj.HUYEN, obj.TINH, obj.DIENTICH, obj.MUCDICHSUDUNG, obj.TENCHU, obj.DIACHI);
                //foreach (var toado in bangtoado)
                //{
                //    TableToaDo.Rows.Add(toado.Diem, toado.Toadox, toado.Toadoy);
                //}
                for (int i = 0; i <= obj.DsDinh.Count - 1; i++)
                {
                    if (i <= obj.DsDinh.Count - 2)
                    {
                        TableToaDo.Rows.Add(obj.DsDinh[i].Diem + "-" + obj.DsDinh[i + 1].Diem, Math.Round(obj.DsDinh[i].DoDai, 2));
                    }
                    else if (i == obj.DsDinh.Count - 1)
                    {
                        TableToaDo.Rows.Add(obj.DsDinh[i].Diem + "-" + obj.DsDinh[0].Diem, Math.Round(obj.DsDinh[i].DoDai, 2));
                    }
                }
                //for (int i = 0; i < obj.DsDinhInTrichLuc.Count; i++)
                //{
                //    TableToaDo.Rows.Add(obj.DsDinhInTrichLuc[i].Diem, obj.DsDinhInTrichLuc[i].DoDaiCanh);
                //}
                data.Tables.Add(ALLPage_table);
                data.Tables.Add(TableToaDo);
                return data;
            }
            catch (Exception ex)
            {
                throw;
            }
        }


        [HttpPost]
        public ActionResult DownloadFile_hskt(InAnViewModel param)
        {
            try
            {
                var filepath = System.IO.Path.Combine(Server.MapPath("/App_Data/Mau/"), "mauKT.doc");

                Aspose.Words.Document doc = new Aspose.Words.Document(filepath);
                DataSet data = GenDB_HSKT(param);
                doc.MailMerge.ExecuteWithRegions(data);
                Aspose.Words.DocumentBuilder builder = new Aspose.Words.DocumentBuilder(doc);
                var urlpng = "/Temp/" + "thuadat" + param.MaXa + "_" + param.SOTOBANDO + "_" + param.SOTHUTHUTHUA + ".emf";
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
                string tenfile = param.MaXa + "_" + param.SOTOBANDO + "_" + param.SOTHUTHUTHUA;
                var url = HttpContext.Request.Url.Authority;
                string duongdan = "", path = "";
                if (param.TypeFile.ToLower() == "doc")
                {
                    path = Server.MapPath("/Temp/") + tenfile + "hskt.doc";
                    if (System.IO.File.Exists(path))
                        System.IO.File.Delete(path);
                    doc.Save(path);
                    duongdan = "http://" + url + "/Temp/" + tenfile + "hskt.doc";
                }
                else
                {
                    path = Server.MapPath("/Temp/") + tenfile + "hskt.pdf";
                    if (System.IO.File.Exists(path))
                        System.IO.File.Delete(path);
                    doc.Save(path);
                    duongdan = "http://" + url + "/Temp/" + tenfile + "hskt.pdf";
                }
                return Json(duongdan, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public DataSet GenDB_HSKT(InAnViewModel param)
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
                if (param.SOTHUTHUTHUA != null && param.SOTOBANDO != null && param.MaXa != null)
                {
                    obj.XA = param.XA;
                    obj.HUYEN = param.HUYEN;
                    obj.TINH = param.TINH;
                    obj.TENCHU = param.TENCHU;
                    obj.DIACHI = param.DIACHI;
                    obj.MUCDICHSUDUNG = param.MUCDICHSUDUNG;
                    obj.SOTOBANDO = param.SOTOBANDO;
                    obj.SOTHUTHUTHUA = param.SOTHUTHUTHUA;
                    obj.DIENTICH = param.DIENTICH;
                    obj.MUCDICHSUDUNG = param.MUCDICHSUDUNG;
                    //bảng tọa độ
                    obj.DsDinh = new List<bangtoado>();
                    obj.DsDinhInTrichLuc = new List<bangtoadoInTrichLuc>();

                    //in trích lục
                    for (int i = 0; i <= param.DsDinh.Count - 1; i++)
                    {
                        bangtoadoInTrichLuc abc = new bangtoadoInTrichLuc();
                        if (i <= param.DsDinh.Count - 2)
                        {

                            abc.Diem = param.DsDinh[i].Diem + "-" + param.DsDinh[i + 1].Diem;
                            abc.DoDaiCanh = Math.Round(param.DsDinh[i].DoDai, 2);
                            obj.DsDinhInTrichLuc.Add(abc);
                        }
                        else if (i == param.DsDinh.Count - 1)
                        {
                            abc.Diem = param.DsDinh[i].Diem + "-" + param.DsDinh[0].Diem;
                            abc.DoDaiCanh = Math.Round(param.DsDinh[i].DoDai, 2);
                            obj.DsDinhInTrichLuc.Add(abc);
                        }
                    }
                    obj.DsDinh = param.DsDinh;

                    string fileName = param.MaXa + "_" + param.SOTOBANDO + "_" + param.SOTHUTHUTHUA + ".svg";
                    string additionPath = "\\DiaChinh\\" + param.MaXa + "\\";
                    string svgFileName = fileManag.root + additionPath + fileName;

                    //string svgFileName = FileManager.RootPath + objthua.t.HSKTSVGFILEPATH;
                    //string urlpng = FileManager.Temp_File_Path + "thuadat_" + maxa + "_" + sohieutobando + "_" + sothututhua + ".emf";

                    string urlpng = "/Temp/thuadat" + param.MaXa + "_" + param.SOTOBANDO + "_" + param.SOTHUTHUTHUA + ".emf";
                    //string pngFileName = Server.MapPath(urlpng);

                    string pngFileName = Server.MapPath(urlpng);
                    if (System.IO.File.Exists(pngFileName))
                        System.IO.File.Delete(pngFileName);

                    string inkscapeArgs = string.Format(@"-f ""{0}"" -e ""{1}""", svgFileName, pngFileName);

                    Process inkscape = Process.Start(
                      new ProcessStartInfo(fileManag.inscapePath, inkscapeArgs));
                    inkscape.WaitForExit(3000);

                    obj.ANHMUITEN = "/Temp/Bac.png";

                    //using (FTILISEntities db = new FTILISEntities())
                    //{
                    //    var objmaxa = (from item in db.HC_DMKVHC where item.MAXA == maxa select item).FirstOrDefault();
                    //    decimal sothua = decimal.Parse(sothututhua);
                    //    decimal soto = decimal.Parse(sohieutobando);
                    //    var objthua = (from t in db.DC_THUADAT
                    //                   where t.SOTHUTUTHUA == sothua && t.SOHIEUTOBANDO == soto && t.XAID == objmaxa.KVHCID
                    //                   select new
                    //                   {
                    //                       t,
                    //                       xa = db.HC_DMKVHC.Where(it => it.KVHCID == t.XAID).FirstOrDefault(),
                    //                       listmdsddat = (from mdsd in db.DC_MUCDICHSUDUNGDAT.Where(it => it.THUADATID == t.THUADATID)
                    //                                      select new
                    //                                      {
                    //                                          mdsd,
                    //                                          dm = db.DM_MUCDICHSUDUNG.Where(it => it.MUCDICHSUDUNGID == mdsd.MUCDICHSUDUNGID).FirstOrDefault()
                    //                                      }).ToList(),
                    //                       listquyen = (from q in db.DC_QUYENSUDUNGDAT.Where(it => it.THUADATID == t.THUADATID)
                    //                                    select new
                    //                                    {
                    //                                        q,
                    //                                        objnguoi = db.DC_NGUOI.Where(it => it.NGUOIID == q.NGUOIID).FirstOrDefault()
                    //                                    }).ToList(),
                    //                   }).FirstOrDefault();
                    //    if (objthua != null)
                    //    {
                    //        var url = HttpContext.Request.Url.Authority;

                    //        obj.SOTHUTHUTHUA = objthua.t.SOTHUTUTHUA.ToString();
                    //        obj.SOTOBANDO = objthua.t.SOHIEUTOBANDO.ToString();
                    //        obj.DIENTICH = objthua.t.DIENTICH.ToString();
                    //        if (obj.DIACHI == "")
                    //        {
                    //            obj.DIACHI = diachi;
                    //        }
                    //        else
                    //        {
                    //            obj.DIACHI = objthua.t.DIACHITHUADAT;
                    //        }

                    //        if (objthua.xa != null)
                    //        {
                    //            obj.XA = objthua.xa.TENKVHC;
                    //            var objhuyen = (from item in db.HC_HUYEN
                    //                            where item.HUYENID == objthua.xa.HUYENID
                    //                            select new
                    //                            {
                    //                                item,
                    //                                tinh = db.HC_TINH.Where(it => it.TINHID == item.TINHID).FirstOrDefault()
                    //                            }).FirstOrDefault();
                    //            if (objhuyen != null)
                    //            {
                    //                obj.HUYEN = objhuyen.item.TENHUYEN;
                    //                if (objhuyen.tinh != null)
                    //                {
                    //                    obj.TINH = objhuyen.tinh.TENTINH;
                    //                }
                    //            }
                    //        }

                    //        string mdsd = "";
                    //        if (objthua.listmdsddat != null)
                    //        {
                    //            foreach (var objmdsd in objthua.listmdsddat)
                    //            {
                    //                if (objmdsd.dm != null)
                    //                    mdsd = mdsd + ";" + objmdsd.dm.TENMUCDICHSUDUNG;
                    //            }
                    //            mdsd = mdsd.Substring(1, mdsd.Length - 1);
                    //            obj.MUCDICHSUDUNG = mdsd;
                    //        }
                    //        else
                    //        {
                    //            var mdsddatbando = (from item in db.DM_MUCDICHSUDUNG where item.MAMUCDICHSUDUNG == mdsddat.ToUpper() select item).FirstOrDefault();
                    //            if (mdsddatbando != null)
                    //            {
                    //                obj.MUCDICHSUDUNG = mdsddatbando.TENMUCDICHSUDUNG;
                    //            }
                    //        }

                    //        string strchu = "";
                    //        //var listquyen = (from item in db.DC_QUYENSUDUNGDAT where item.THUADATID == objthua.THUADATID select item);
                    //        if (objthua.listquyen != null)
                    //        {
                    //            foreach (var objquyen in objthua.listquyen)
                    //            {
                    //                //var objnguoi = (from item in db.DC_NGUOI where item.NGUOIID == objquyen.NGUOIID select item).FirstOrDefault();
                    //                if (objquyen.objnguoi != null)
                    //                {
                    //                    if (objquyen.objnguoi.LOAIDOITUONGID == "1")
                    //                    {
                    //                        var objchu = (from item in db.DC_CANHAN where item.CANHANID == objquyen.objnguoi.CHITIETID select item).FirstOrDefault();
                    //                        if (objchu != null)
                    //                        {
                    //                            strchu = strchu + ";" + objchu.HOTEN;
                    //                        }
                    //                    }
                    //                    else if (objquyen.objnguoi.LOAIDOITUONGID == "2")
                    //                    {
                    //                        var objchu = (from item in db.DC_HOGIADINH where item.HOGIADINHID == objquyen.objnguoi.CHITIETID select item).FirstOrDefault();
                    //                        if (objchu != null)
                    //                        {
                    //                            var objten = (from item in db.DC_CANHAN where item.CANHANID == objchu.CHUHO select item).FirstOrDefault();
                    //                            if (objten != null)
                    //                            {
                    //                                strchu = strchu + ";" + objten.HOTEN;
                    //                            }

                    //                        }
                    //                    }
                    //                    else if (objquyen.objnguoi.LOAIDOITUONGID == "3")
                    //                    {
                    //                        var objchu = (from item in db.DC_VOCHONG where item.VOCHONGID == objquyen.objnguoi.CHITIETID select item).FirstOrDefault();
                    //                        if (objchu != null)
                    //                        {
                    //                            //strchu = strchu + ";" + objchu.CHONG;
                    //                            var objchong = (from item in db.DC_CANHAN where item.CANHANID == objchu.CHONG select item).FirstOrDefault();
                    //                            if (objchong != null)
                    //                            {
                    //                                strchu = objchong.HOTEN;

                    //                            }
                    //                            var objvo = (from item in db.DC_CANHAN where item.CANHANID == objchu.VO select item).FirstOrDefault();
                    //                            if (objvo != null)
                    //                            {
                    //                                strchu = strchu + "; " + objvo.HOTEN;

                    //                            }
                    //                        }
                    //                    }
                    //                    else if (objquyen.objnguoi.LOAIDOITUONGID == "4")
                    //                    {

                    //                        var objchu = (from item in db.DC_CONGDONG where item.CONGDONGID == objquyen.objnguoi.CHITIETID select item).FirstOrDefault();
                    //                        if (objchu != null)
                    //                        {
                    //                            strchu = objchu.TENCONGDONG;
                    //                        }

                    //                    }
                    //                    else if (objquyen.objnguoi.LOAIDOITUONGID == "5")
                    //                    {
                    //                        var objchu = (from item in db.DC_TOCHUC where item.TOCHUCID == objquyen.objnguoi.CHITIETID select item).FirstOrDefault();
                    //                        if (objchu != null)
                    //                        {
                    //                            strchu = objchu.TENTOCHUC;
                    //                        }

                    //                    }
                    //                }
                    //            }
                    //        }
                    //        if (strchu == "")
                    //        {
                    //            obj.TENCHU = tenchu;
                    //        }
                    //        else
                    //        { obj.TENCHU = strchu.Substring(1, strchu.Length - 1); }

                    //        string svgFileName = FileManager.RootPath + objthua.t.HSKTSVGFILEPATH;
                    //        string urlpng = FileManager.Temp_File_Path + "thuadat_" + maxa + "_" + sohieutobando + "_" + sothututhua + ".emf";

                    //        string pngFileName = Server.MapPath(urlpng);
                    //        if (System.IO.File.Exists(pngFileName))
                    //            System.IO.File.Delete(pngFileName);

                    //        string inkscapeArgs = string.Format(@"-f ""{0}"" -e ""{1}""", svgFileName, pngFileName);

                    //        Process inkscape = Process.Start(
                    //          new ProcessStartInfo(FileManager.InscapePath, inkscapeArgs));

                    //        inkscape.WaitForExit(3000);

                    //        obj.ANHMUITEN = "http://" + url + @"/Temp/Bac.png";
                    //    }
                    //}
                }
                foreach (var toado in obj.DsDinh)
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
        public ActionResult Inhskt(InAnViewModel param)
        {
            Intrichluc obj = new Intrichluc();
            if (param.SOTHUTHUTHUA != null && param.SOTOBANDO != null && param.MaXa != null)
            {
                obj.XA = param.XA;
                obj.HUYEN = param.HUYEN;
                obj.TINH = param.TINH;
                obj.TENCHU = param.TENCHU;
                obj.DIACHI = param.DIACHI;
                obj.MUCDICHSUDUNG = param.MUCDICHSUDUNG;
                obj.SOTOBANDO = param.SOTOBANDO;
                obj.SOTHUTHUTHUA = param.SOTHUTHUTHUA;
                obj.DIENTICH = param.DIENTICH;
                obj.MUCDICHSUDUNG = param.MUCDICHSUDUNG;

                //bảng tọa độ
                obj.DsDinh = new List<bangtoado>();
                obj.DsDinhInTrichLuc = new List<bangtoadoInTrichLuc>();

                //in trích lục
                for (int i = 0; i <= param.DsDinh.Count - 1; i++)
                {
                    bangtoadoInTrichLuc abc = new bangtoadoInTrichLuc();
                    if (i <= param.DsDinh.Count - 2)
                    {

                        abc.Diem = param.DsDinh[i].Diem + "-" + param.DsDinh[i + 1].Diem;
                        abc.DoDaiCanh = Math.Round(param.DsDinh[i].DoDai, 2);
                        obj.DsDinhInTrichLuc.Add(abc);
                    }
                    else if (i == param.DsDinh.Count - 1)
                    {
                        abc.Diem = param.DsDinh[i].Diem + "-" + param.DsDinh[0].Diem;
                        abc.DoDaiCanh = Math.Round(param.DsDinh[i].DoDai, 2);
                        obj.DsDinhInTrichLuc.Add(abc);
                    }
                }
                obj.DsDinh = param.DsDinh;
                string fileName = param.MaXa + "_" + param.SOTOBANDO + "_" + param.SOTHUTHUTHUA + ".svg";
                string additionPath = "\\DiaChinh\\" + param.MaXa + "\\";
                string url = fileManag.root + additionPath + fileName;
                if (System.IO.File.Exists(url))
                {
                    byte[] fileBytes = System.IO.File.ReadAllBytes(url);
                    string x64string = System.Convert.ToBase64String(fileBytes);
                    obj.ANHSODO = "data:image/svg+xml;base64," + x64string;
                }
                else
                {
                    obj.ANHSODO = "";
                }
                obj.ANHMUITEN = "/images/Bac.png";
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

        public class Column
        {
            #region Fields

            private int mColumnIndex;
            private Table mTable;

            #endregion Fields

            #region Constructors

            private Column(Table table, int columnIndex)
            {
                if (table == null)
                    throw new ArgumentException("table");

                mTable = table;
                mColumnIndex = columnIndex;
            }

            #endregion Constructors

            #region Properties

            /// <summary>
            /// Returns the cells which make up the column.
            /// </summary>
            public Cell[] Cells
            {
                get
                {
                    return (Cell[])GetColumnCells().ToArray(typeof(Cell));
                }
            }

            #endregion Properties

            #region Methods

            /// <summary>
            /// Returns a new column facade from the table and supplied zero-based index.
            /// </summary>
            public static Column FromIndex(Table table, int columnIndex)
            {
                return new Column(table, columnIndex);
            }

            /// <summary>
            /// Returns the index of the given cell in the column.
            /// </summary>
            public int IndexOf(Cell cell)
            {
                return GetColumnCells().IndexOf(cell);
            }

            /// <summary>
            /// Inserts a brand new column before this column into the table.
            /// </summary>
            public Column InsertColumnBefore()
            {
                Cell[] columnCells = Cells;

                if (columnCells.Length == 0)
                    throw new ArgumentException("Column must not be empty");

                // Create a clone of this column.
                foreach (Cell cell in columnCells)
                    cell.ParentRow.InsertBefore(cell.Clone(false), cell);

                // This is the new column.
                Column column = new Column(columnCells[0].ParentRow.ParentTable, mColumnIndex);

                // We want to make sure that the cells are all valid to work with (have at least one paragraph).
                foreach (Cell cell in column.Cells)
                    cell.EnsureMinimum();

                // Increase the index which this column represents since there is now one extra column infront.
                mColumnIndex++;

                return column;
            }

            /// <summary>
            /// Removes the column from the table.
            /// </summary>
            public void Remove()
            {
                foreach (Cell cell in Cells)
                    cell.Remove();
            }

            /// <summary>
            /// Returns the text of the column. 
            /// </summary>
            public string ToTxt()
            {
                StringBuilder builder = new StringBuilder();

                foreach (Cell cell in Cells)
                    builder.Append(cell.ToString());

                return builder.ToString();
            }

            /// <summary>
            /// Provides an up-to-date collection of cells which make up the column represented by this facade.
            /// </summary>
            private ArrayList GetColumnCells()
            {
                ArrayList columnCells = new ArrayList();

                foreach (Row row in mTable.Rows)
                {
                    Cell cell = row.Cells[mColumnIndex];
                    if (cell != null)
                        columnCells.Add(cell);
                }

                return columnCells;
            }

            #endregion Methods
        }
    }
}