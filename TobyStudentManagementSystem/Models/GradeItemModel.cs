using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace TobyStudentManagementSystem.Models
{
    public class GradeItemModel
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }

        [MaxLength(30)]
        [Required]
        public string ExamName { get; set; }

        [Required]
        public decimal Grades { get; set; }

        [Required]
        public DateTime ExamDate { get; set; }

        [Required]
        public Guid StudentId { get; set; }
        [ForeignKey("StudentId")]
        public StudentModel Students { get; set; }
    }
}