using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace TobyStudentManagementSystem.Models
{
    public class TeacherModel
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }

        [Required(ErrorMessage = "Required")]
        [MaxLength(15)]
        public string Name { get; set; }

        [MaxLength(15)]
        public string EnglishName { get; set; }

        public  List<EventModel> WorkEvents { get; set; }
    }
}