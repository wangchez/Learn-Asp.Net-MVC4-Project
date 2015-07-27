using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace TobyStudentManagementSystem.Models
{
    public class TobyDBContext : DbContext
    {
        public DbSet<EventModel> EventModels { get; set; }
        public DbSet<StudentModel> StudentModels { get; set; }
        public DbSet<TeacherModel> TeacherModels { get; set; }
        public DbSet<PaymentModel> PaymentModels { get; set; }
        public DbSet<GradeItemModel> GradeItemModels { get; set; }
        public DbSet<SchoolLookupTable> SchoolLookupTable { get; set; }
        public DbSet<TobyClassLookupTable> TobyClassLookupTable { get; set; }
        public DbSet<WorkTypeLookupTable> WorkTypeLookupTable { get; set; }

        public TobyDBContext()
            : base("DefaultConnection")
        {         
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<PaymentModel>().Property(m => m.Payment).HasPrecision(10,2);
            modelBuilder.Entity<GradeItemModel>().Property(m => m.Grades).HasPrecision(10, 2);
        }
    }
}