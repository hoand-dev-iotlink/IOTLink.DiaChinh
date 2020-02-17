using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace IOTLink.Diachinh.Models
{
    public class ListHuyenXaNguoiDungModel
    {
        public string Genre { get; set; }
        public List<ListHuyenXaNguoiDung> ListHuyenXaNguoiDungs { get; set; }
    }

    public class ListHuyenXaNguoiDung
    {
        public string Id { get; set; }
        public string Code { get; set; }
        public string NameKVHC { get; set; }
        public string Name { get; set; }
        public string MaKVHC { get; set; }
    }
}