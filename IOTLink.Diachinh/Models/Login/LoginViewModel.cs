using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace IOTLink.Diachinh.Models
{
    public class LoginViewModel
    {
        [Required(ErrorMessage = "Tài khoản là bắt buộc!")]
        [Display(Name = "Tài khoản")]
        public string Username { get; set; }

        [Required(ErrorMessage = "Mật khẩu là bắt buộc!")]
        [DataType(DataType.Password)]
        [Display(Name = "Mật khẩu")]
        public string Password { get; set; }
    }
}