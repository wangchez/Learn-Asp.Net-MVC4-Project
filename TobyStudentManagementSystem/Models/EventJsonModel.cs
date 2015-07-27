using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TobyStudentManagementSystem.Models
{
    public class EventJsonModel
    {
        public string startTime { get; set; }

        public string endTime { get; set; }

        public string eventTile { get; set; }

        public List<Guid> studentIds { get; set; }

        public Guid teacherId { get; set; }

        public int workTypeId { get; set; }
    }
}