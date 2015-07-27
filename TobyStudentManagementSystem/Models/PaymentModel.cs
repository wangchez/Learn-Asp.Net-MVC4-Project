using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace TobyStudentManagementSystem.Models
{
    public class PaymentModel
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }

        [MaxLength(30)]
        public string PaymentName { get; set; }

        [Required]
        public decimal Payment { get; set; }

        public DateTime? PaymentDate { get; set; }

        public DateTime? PaymentDeadLine { get; set; }

        [Required]
        public Guid StudentId { get; set; }
        [ForeignKey("StudentId")]
        public StudentModel Students { get; set; }
    }
}