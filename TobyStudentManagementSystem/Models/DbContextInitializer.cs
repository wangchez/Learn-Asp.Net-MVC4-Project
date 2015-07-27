using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace TobyStudentManagementSystem.Models
{
    public class DbContextInitializer : DropCreateDatabaseIfModelChanges<TobyDBContext>
    {
        protected override void Seed(TobyDBContext context)
        {
            base.Seed(context);
            try
            {
                context.Database.ExecuteSqlCommand("CREATE INDEX IX_StudentModels_Name ON StudentModels (Name)");
                context.Database.ExecuteSqlCommand("CREATE INDEX IX_StudentModels_EnName ON StudentModels (EnglishName)");
                context.Database.ExecuteSqlCommand("CREATE INDEX IX_StudentModels_School ON StudentModels (SchoolId)");
                context.Database.ExecuteSqlCommand("CREATE INDEX IX_StudentModels_TobyClass ON StudentModels (TobyClassId)");
                context.Database.ExecuteSqlCommand("CREATE INDEX IX_EventModels_IsFixed ON EventModels (IsFixed)");
                context.Database.ExecuteSqlCommand("CREATE INDEX IX_EventModels_WorkTyepId ON EventModels (WorkTypeId");
                context.Database.ExecuteSqlCommand("CREATE INDEX IX_EventModels_StartTimeAndEndTime ON EventModels (StartTime DESC, EndTime DESC)");
                context.Database.ExecuteSqlCommand("CREATE INDEX IX_PaymentModels_PaymentDate ON PaymentModels (PaymentDate)");
                context.Database.ExecuteSqlCommand("CREATE INDEX IX_PaymentModels_PaymentDeadLine ON PaymentModels (PaymentDeadLine)");
                context.Database.ExecuteSqlCommand("CREATE INDEX IX_GradeItemModels_ExamDate ON GradeItemModels (ExamDate)");
            }
            catch { };
        }
    }
}