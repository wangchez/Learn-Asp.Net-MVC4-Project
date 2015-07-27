using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using TobyStudentManagementSystem.Models;
using System.Data.Entity;
using EntityFramework.Extensions;
using System.Web.Script.Serialization;

namespace TobyStudentManagementSystem.Controllers
{
    public class AnalysisController : Controller
    {
        //
        // GET: /Analysis/

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult AnalysisChart()
        {
            return View();
        }

        public ActionResult NewGradeItem()
        {
            return PartialView();
        }

        public JsonResult SaveGradeItem(string examName, string scoreAmount, string examDate, Guid studentId)
        {
            decimal scroe;
            DateTime date;
            GradeItemModel gradeItem = new GradeItemModel { ExamName = examName, StudentId = studentId };

            try
            {
                if (!Decimal.TryParse(scoreAmount, out scroe) || !DateTime.TryParse(examDate, out date))
                {
                    throw new Exception();
                }

                gradeItem.Grades = scroe;
                gradeItem.ExamDate = date;

                using (var context = new TobyDBContext())
                {
                    context.GradeItemModels.Add(gradeItem);
                    context.SaveChanges();
                }

                return Json(new
                {
                    item_id = gradeItem.Id,
                    grade = gradeItem.Grades,
                    exam_name = gradeItem.ExamName,
                    exam_date = gradeItem.ExamDate.ToString("MM/dd/yyyy")
                });
            }
            catch
            {
                this.Response.StatusCode = 500;

                return Json(null);
            }
        }

        public JsonResult LoadingGradeItems(Guid studentId)
        {
            List<GradeItemModel> gradeItemModels;

            try
            {
                using (var context = new TobyDBContext())
                {
                    gradeItemModels = context.GradeItemModels.Where(g => g.StudentId == studentId).ToList();
                }

                return Json(gradeItemModels.Select(g => new
                {
                    item_id = g.Id,
                    grade = g.Grades,
                    exam_name = g.ExamName,
                    exam_date = g.ExamDate.ToString("MM/dd/yyyy")
                }));
            }
            catch
            {
                this.Response.StatusCode = 500;

                return Json(null);
            }
        }

        public JsonResult SearchStudent(string studentName)
        {
            StudentModel student;

            try
            {
                using (var context = new TobyDBContext())
                {
                    if (studentName != null && studentName != "")
                    {
                        student = context.StudentModels.Where(students => students.Name == studentName
                            || students.EnglishName == studentName).First();

                    }
                    else
                    {
                        throw new Exception();
                    }
                }

                return Json(new
                {
                    student_id = student.Id,
                    student_name = String.Format("{0}({1})", student.Name, student.EnglishName)
                });
            }
            catch
            {
                this.Response.StatusCode = 500;

                return Json(null);
            }
        }

        public void UpdateGradeItem(string examName, decimal scoreAmount, string examDate, Guid itemId)
        {
            DateTime date;
            try
            {
                if (!DateTime.TryParse(examDate, out date))
                {
                    throw new Exception();
                }

                using (var context = new TobyDBContext())
                {
                    context.GradeItemModels.Update(g => g.Id == itemId, item => new GradeItemModel
                    {
                        Grades = scoreAmount,
                        ExamName = examName,
                        ExamDate = date
                    });
                }
            }
            catch
            {
                this.Response.StatusCode = 500;
            }
        }

        public void DeleteGradeItem(Guid id)
        {
            try
            {
                using (var context = new TobyDBContext())
                {
                    context.GradeItemModels.Delete(g => g.Id == id);
                }
            }
            catch
            {
                this.Response.StatusCode = 500;
            }
        }

        public JsonResult GetChartData(Guid id)
        {
            List<GradeItemModel> gradeItems;
            JavaScriptSerializer serializer = new JavaScriptSerializer();
            try
            {
                using (var context = new TobyDBContext())
                {
                    gradeItems = context.GradeItemModels.Where(g => g.StudentId == id).OrderBy(g => g.ExamDate).ToList();
                }

                return Json(gradeItems.Select(g => new object[4] { 
                  GetJavascriptTimestamp(g.ExamDate), decimal.ToInt32(g.Grades), 
                    g.ExamName, g.Grades.ToString()
                }).ToArray());
            }
            catch
            {
                this.Response.StatusCode = 500;

                return Json(null);
            }
        }

        private long GetJavascriptTimestamp(DateTime input)
        {
            TimeSpan span = new TimeSpan(DateTime.Parse("1/1/1970").Ticks);
            DateTime time = input.Subtract(span);
            return (long)(time.Ticks / 10000);
        }
    }
}
