using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace IOTLink.Diachinh.Models
{
    public class ShapeJsonViewModel
    {
        public string type { get; set; }
        public List<Feature> features { get; set; }
        public class Feature
        {
            public string type { get; set; }
            public Properties properties { get; set; }
            public Geometry geometry { get; set; }
        }

        public class Geometry
        {
            public string type { get; set; }
            public List<List<List<List<double>>>> coordinates { get; set; }
        }

        public class Properties
        {
            public int ObjectId { get; set; }
            public long Index { get; set; }
            public string UUID { get; set; }
            public string ThoiDiemBatDau { get; set; }
            public string ThoiDiemKetThuc { get; set; }
            public string MaXa { get; set; }
            public string MaDoiTuong { get; set; }
            public int SoHieuToBanDo { get; set; }
            public int SoThuTuThua { get; set; }
            public string SoHieuToBanDoCu { get; set; }
            public string SoThuTuThuaCu { get; set; }
            public double DienTich { get; set; }
            public double DienTichPhapLy { get; set; }
            public string KyHieuMucDichSuDung { get; set; }
            public string KyHieuDoiTuong { get; set; }
            public string TenChu { get; set; }
            public string DiaChi { get; set; }
            public int DaCapGCN { get; set; }
            public string TenChu2 { get; set; }
            public string NamSinhC1 { get; set; }
            public string SoHieuGCN { get; set; }
            public string SoVaoSo { get; set; }
            public string NgayVaoSo { get; set; }
            public string SoBienNhan { get; set; }
            public string NguoiNhanHS { get; set; }
            public string CoQuanThuLy { get; set; }
            public string LoaiHS { get; set; }
            public string MaLienKet { get; set; }
            public string ShapeSTArea { get; set; }
            public string ShapeSTLength { get; set; }
            public string ShapeLength { get; set; }
            public string ShapeArea { get; set; }
            public string info { get; set; }
            public string Tags { get; set; }
            public string Id { get; set; }
            public long CreatedDate { get; set; }
            public long UpdatedDate { get; set; }
            public string TenMucDichSuDung { get; set; }
        }
    }
}