using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TobyStudentManagementSystem.Models
{
    public class PaymentJson
    {
        public string _id { get; set; }
        public string student_name { get; set; }
        public string payment { get; set; }
        public string payment_name { get; set; }
        public string deadline { get; set; }
        public string payment_date { get; set; }
        public string class_id { get; set; }
    }
}