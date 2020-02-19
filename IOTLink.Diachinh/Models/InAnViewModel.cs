using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace IOTLink.Diachinh.Models
{
    public class InAnViewModel
    {
        public string MaXa { get; set; }
        public string XA { get; set; }
        public string HUYEN { get; set; }
        public string TINH { get; set; }
        public string SOTHUTHUTHUA { get; set; }
        public string SOTOBANDO { get; set; }
        public string DIENTICH { get; set; }
        public string DIACHI { get; set; }
        public string TENCHU { get; set; }
        public string MUCDICHSUDUNG { get; set; }
        public List<bangtoado> DsDinh { get; set; } = new List<bangtoado>();
        public List<bangtoadoInTrichLuc> DsDinhInTrichLuc { get; set; } = new List<bangtoadoInTrichLuc>();
        public string ANHSODO { get; set; } = string.Empty;
        public string ANHMUITEN { get; set; } = string.Empty;
        public string TypeFile { get; set; } = string.Empty;
    }
}