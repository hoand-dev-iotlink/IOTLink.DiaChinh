using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace IOTLink.Diachinh.Models
{
    public class TrichLucModel
    {
    }
    public class bangtoado
    {
        public int Diem { get; set; }
        public decimal Toadox { get; set; }
        public decimal Toadoy { get; set; }
        public decimal DoDai { get; set; }
    }
    public class bangtoadoInTrichLuc
    {
        public string Diem { get; set; }

        public decimal DoDaiCanh { get; set; }
    }

    public class Intrichluc
    {
        public string SOTHUTHUTHUA { get; set; }
        public string SOTOBANDO { get; set; }
        public string SOMANH { get; set; }
        public string XA { get; set; }
        public string HUYEN { get; set; }
        public string TINH { get; set; }
        public string DIENTICH { get; set; }

        public string MUCDICHSUDUNG { get; set; }
        public string TENCHU { get; set; }

        public string DIACHI { get; set; }
        public string ANHSODO { get; set; }
        public string ANHDIEMTOADO { get; set; }
        public List<bangtoado> DsDinh { get; set; }
        public List<bangtoadoInTrichLuc> DsDinhInTrichLuc { get; set; }
        public string ANHMUITEN { get; set; }
    }
}