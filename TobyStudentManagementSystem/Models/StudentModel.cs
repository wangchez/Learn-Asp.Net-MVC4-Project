using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace TobyStudentManagementSystem.Models
{
    public class StudentModel
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }
        [MaxLength(15)]
        [Required]
        public string Name { get; set; }

        [MaxLength(20)]
        public string EnglishName { get; set; }

        public int? SchoolId { get; set; }

        public int? TobyClassId { get; set; }

        [MaxLength(20)]
        public string Grade { get; set; }

        public DateTime? BirthDay { get; set; }

        [MaxLength(20)]
        public string PhoneNumber { get; set; }

        [MaxLength(50)]
        public string Address { get; set; }

        [MaxLength(15)]
        public string Contact { get; set; }

        public  List<PaymentModel> Payments { get; set; }

        public  List<GradeItemModel> GradeItems { get; set; }
    }
}