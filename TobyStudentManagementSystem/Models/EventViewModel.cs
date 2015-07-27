using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TobyStudentManagementSystem.Models
{
    public class EventViewModel
    {
        public string EventId { get; set; }
        public string Title { get; set; }
        public bool IsFixed { get; set; }
    }
}