using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

namespace IOTLink.Diachinh.Sevice
{
    public class FileManager
    {
        public string root = ConfigurationManager.AppSettings["FILE_UPLOAD_PATH"];
        public string inscapePath = ConfigurationManager.AppSettings["INSCAPE_PATH"];
        // string tempPath = ConfigurationManager.AppSettings["TEMP_FILE_PATH"];

        //public  string RootPath
        //{
        //    get { return root; }
        //}

        //public  string InscapePath
        //{
        //    get { return inscapePath; }
        //}

        //public  string Temp_File_Path
        //{
        //    get { return tempPath; }
        //}

        public string saveFile(string makvhc, byte[] data, string fileName, /*FileType ftype,*/ out string makvhcmoi)
        {
            
            makvhcmoi = "";
            if (makvhc == "") return "";

            //using (FTILISEntities db = new FTILISEntities())
            //{
            //    var xa = db.HC_DMKVHC.Where(it => it.MAXA == makvhc).FirstOrDefault();
            //    if (xa != null) makvhc = xa.MAKVHC;
            //}
            makvhcmoi = makvhc;
            //string additionPath = getAdditionPath(ftype, makvhc);
            string additionPath = "\\DiaChinh\\" + makvhc + "\\";

            //Lưu file
            System.IO.Directory.CreateDirectory(root + additionPath);
            System.IO.File.WriteAllBytes(root + additionPath + fileName, data);

            return root + additionPath + fileName;
        }

        //public static string getAdditionPath(FileType ftype, string makvhc)
        //{
        //    string additionPath = "";
        //    switch (ftype)
        //    {
        //        case FileType.DiaChinh:
        //            additionPath = "\\DiaChinh\\";
        //            break;
        //        case FileType.TKKK:
        //            additionPath = "\\TKKK\\";
        //            break;
        //        case FileType.QuyHoach:
        //            additionPath = "\\QuyHoach\\";
        //            break;
        //        case FileType.HoSoQuet:
        //            additionPath = "\\HoSoQuet\\";
        //            break;
        //        default:
        //            break;
        //    }

        //    switch (makvhc.Length)
        //    {
        //        case 2:
        //            additionPath = additionPath + makvhc + "\\";
        //            break;
        //        case 5:
        //            additionPath = additionPath + makvhc.Substring(0, 2) + "\\" + makvhc + "\\";
        //            break;
        //        case 10:
        //            additionPath = additionPath + makvhc.Substring(0, 2) + "\\" + makvhc.Substring(0, 5) + "\\" + makvhc + "\\";
        //            break;
        //        default:
        //            break;
        //    }

        //    return additionPath;
        //}
    }
}