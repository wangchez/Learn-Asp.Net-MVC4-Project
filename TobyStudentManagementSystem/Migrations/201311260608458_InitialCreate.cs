namespace TobyStudentManagementSystem.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class InitialCreate : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.EventModels",
                c => new
                    {
                        Id = c.Guid(nullable: false, identity: true),
                        EventTitle = c.String(nullable: false, maxLength: 100),
                        StartTime = c.DateTime(nullable: false),
                        EndTime = c.DateTime(nullable: false),
                        IsAllDay = c.Boolean(nullable: false),
                        IsFixed = c.Boolean(nullable: false),
                        StudentId = c.Guid(nullable: false),
                        Color = c.String(nullable: false, maxLength: 10),
                        TeacherId = c.Guid(),
                        WorkTypeId = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.StudentModels", t => t.StudentId, cascadeDelete: true)
                .ForeignKey("dbo.TeacherModels", t => t.TeacherId)
                .Index(t => t.StudentId)
                .Index(t => t.TeacherId);
            
            CreateTable(
                "dbo.StudentModels",
                c => new
                    {
                        Id = c.Guid(nullable: false, identity: true),
                        Name = c.String(nullable: false, maxLength: 15),
                        EnglishName = c.String(maxLength: 20),
                        SchoolId = c.Int(),
                        TobyClassId = c.Int(),
                        Grade = c.String(maxLength: 20),
                        BirthDay = c.DateTime(),
                        PhoneNumber = c.String(maxLength: 20),
                        Address = c.String(maxLength: 50),
                        Contact = c.String(maxLength: 15),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.PaymentModels",
                c => new
                    {
                        Id = c.Guid(nullable: false, identity: true),
                        PaymentName = c.String(maxLength: 30),
                        Payment = c.Decimal(nullable: false, precision: 10, scale: 2),
                        PaymentDate = c.DateTime(),
                        PaymentDeadLine = c.DateTime(),
                        StudentId = c.Guid(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.StudentModels", t => t.StudentId, cascadeDelete: true)
                .Index(t => t.StudentId);
            
            CreateTable(
                "dbo.GradeItemModels",
                c => new
                    {
                        Id = c.Guid(nullable: false, identity: true),
                        ExamName = c.String(nullable: false, maxLength: 30),
                        Grades = c.Decimal(nullable: false, precision: 10, scale: 2),
                        ExamDate = c.DateTime(nullable: false),
                        StudentId = c.Guid(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.StudentModels", t => t.StudentId, cascadeDelete: true)
                .Index(t => t.StudentId);
            
            CreateTable(
                "dbo.TeacherModels",
                c => new
                    {
                        Id = c.Guid(nullable: false, identity: true),
                        Name = c.String(nullable: false, maxLength: 15),
                        EnglishName = c.String(maxLength: 15),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.SchoolLookupTables",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        SchoolName = c.String(nullable: false, maxLength: 30),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.TobyClassLookupTables",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        ClassName = c.String(nullable: false, maxLength: 20),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.WorkTypeLookupTables",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        TypeName = c.String(nullable: false, maxLength: 20),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropIndex("dbo.GradeItemModels", new[] { "StudentId" });
            DropIndex("dbo.PaymentModels", new[] { "StudentId" });
            DropIndex("dbo.EventModels", new[] { "TeacherId" });
            DropIndex("dbo.EventModels", new[] { "StudentId" });
            DropForeignKey("dbo.GradeItemModels", "StudentId", "dbo.StudentModels");
            DropForeignKey("dbo.PaymentModels", "StudentId", "dbo.StudentModels");
            DropForeignKey("dbo.EventModels", "TeacherId", "dbo.TeacherModels");
            DropForeignKey("dbo.EventModels", "StudentId", "dbo.StudentModels");
            DropTable("dbo.WorkTypeLookupTables");
            DropTable("dbo.TobyClassLookupTables");
            DropTable("dbo.SchoolLookupTables");
            DropTable("dbo.TeacherModels");
            DropTable("dbo.GradeItemModels");
            DropTable("dbo.PaymentModels");
            DropTable("dbo.StudentModels");
            DropTable("dbo.EventModels");
        }
    }
}
