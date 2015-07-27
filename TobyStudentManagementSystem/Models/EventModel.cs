using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace TobyStudentManagementSystem.Models
{
    public class EventModel
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }
        [MaxLength(100)]
        [Required]
        public string EventTitle { get; set; }
        [Required]
        public DateTime StartTime { get; set; }
        [Required]
        public DateTime EndTime { get; set; }
        [Required]
        public bool IsAllDay { get; set; }
        public bool IsFixed { get; set; }   
        [Required]
        public Guid StudentId { get; set; }
        [ForeignKey("StudentId")]
        public StudentModel Student { get; set; }
        [MaxLength(10)]
        [Required]
        public string Color { get; set; }

        public Guid? TeacherId { get; set; }
        [ForeignKey("TeacherId")]
        public TeacherModel Teacher { get; set; }

        public int? WorkTypeId { get; set; }
    }
}