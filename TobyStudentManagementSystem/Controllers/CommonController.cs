using EntityFramework.Extensions;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web.Mvc;
using TobyStudentManagementSystem.Models;

namespace TobyStudentManagementSystem.Controllers
{
    public class CommonController : Controller
    {
        //
        // GET: /Common/

        public ActionResult TeacherLookup()
        {
            return View();
        }

        public ActionResult StudentLookup()
        {
            return View();
        }

        public ActionResult SchoolLookup()
        {
            return View();
        }

        public ActionResult TobyClassLookup()
        {
            return View();
        }

        public ActionResult WorkTypeLookup()
        {
            return View();
        }

        public JsonResult LoadingTeacherModels()
        {
            List<TeacherModel> teacherModels;

            try
            {
                using (var context = new TobyDBContext())
                {
                    teacherModels = context.TeacherModels.ToList();
                }

                return Json(teacherModels.Select(models => new
                {
                    name = models.Name,
                    en_name = models.EnglishName,
                    _id = models.Id
                }).ToArray());
            }
            catch
            {
                this.Response.StatusCode = 500;
                return Json(null);
            }
        }

        public JsonResult LoadingStudentModels(int classId = 0)
        {
            List<StudentModel> studentModels;

            try
            {
                using (var context = new TobyDBContext())
                {
                    studentModels = context.StudentModels.Where(s => classId != 0 ? s.TobyClassId == classId : true)
                        .OrderBy(s => s.TobyClassId).ToList();
                }

                return Json(studentModels.Select(models => new
                {
                    name = models.Name,
                    en_name = models.EnglishName,
                    _id = models.Id,
                    grade = models.Grade,
                    contact = models.Contact,
                    phone = models.PhoneNumber,
                    address = models.Address,
                    birthday = models.BirthDay.HasValue ? models.BirthDay.Value.ToString("MM/dd/yyyy") : null,
                    class_id = models.TobyClassId,
                    school_id = models.SchoolId

                }).ToArray());
            }
            catch
            {
                this.Response.StatusCode = 500;
                return Json(null);
            }
        }

        public JsonResult LoadingSchoolModels()
        {
            List<SchoolLookupTable> schoolModels;

            try
            {
                using (var context = new TobyDBContext())
                {
                    schoolModels = context.SchoolLookupTable.ToList();
                }

                return Json(schoolModels.Select(models => new
                {
                    school_name = models.SchoolName,
                    _id = models.Id
                }).ToArray());
            }
            catch
            {
                this.Response.StatusCode = 500;
                return Json(null);
            }
        }

        public JsonResult LoadingTobyClassModels()
        {
            List<TobyClassLookupTable> tobyClassModels;

            try
            {
                using (var context = new TobyDBContext())
                {
                    tobyClassModels = context.TobyClassLookupTable.ToList();
                }

                return Json(tobyClassModels.Select(models => new
                {
                    class_name = models.ClassName,
                    _id = models.Id
                }).ToArray());
            }
            catch
            {
                this.Response.StatusCode = 500;
                return Json(null);
            }
        }

        public JsonResult LoadingWorkTypeModels()
        {
            List<WorkTypeLookupTable> workTypeModels;

            try
            {
                using (var context = new TobyDBContext())
                {
                    workTypeModels = context.WorkTypeLookupTable.ToList();
                }

                return Json(workTypeModels.Select(models => new
                {
                    type_name = models.TypeName,
                    _id = models.Id
                }).ToArray());
            }
            catch
            {
                this.Response.StatusCode = 500;
                return Json(null);
            }
        }

        public ActionResult AddTeacher()
        {
            return PartialView("AddTeacher");
        }

        public ActionResult AddStudent()
        {
            return PartialView("AddStudent");
        }

        public ActionResult EditedTeacher(string id)
        {
            Guid teacherId;
            TeacherModel teacherModel;
            try
            {
                if (Guid.TryParse(id, out teacherId))
                {
                    using (var context = new TobyDBContext())
                    {
                        teacherModel = context.TeacherModels.Where(teacher => teacher.Id == teacherId).Single();
                    }
                }
                else
                {
                    throw new Exception();
                }

                return PartialView("TeacherDetail", teacherModel);
            }
            catch
            {
                this.Response.StatusCode = 500;
                return PartialView("Error");
            }
        }

        public ActionResult EditedStudent(string id)
        {
            Guid studentId;
            StudentModel studentModel;
            try
            {
                if (Guid.TryParse(id, out studentId))
                {
                    using (var context = new TobyDBContext())
                    {
                        studentModel = context.StudentModels.Where(student => student.Id == studentId).Single();
                    }
                }
                else
                {
                    throw new Exception();
                }

                return PartialView("StudentDetail", studentModel);
            }
            catch
            {
                this.Response.StatusCode = 500;
                return PartialView("Error");
            }
        }

        public ActionResult EditedSchool(string id)
        {
            int schoolId;
            SchoolLookupTable schoolModel;
            try
            {
                if (Int32.TryParse(id, out schoolId))
                {
                    using (var context = new TobyDBContext())
                    {
                        schoolModel = context.SchoolLookupTable.Where(school => school.Id == schoolId).Single();
                    }
                }
                else
                {
                    throw new Exception();
                }

                return PartialView("SchoolLutDetail", schoolModel);
            }
            catch
            {
                this.Response.StatusCode = 500;
                return PartialView("Error");
            }
        }

        public ActionResult EditedTobyClass(string id)
        {
            int tobyClassId;
            TobyClassLookupTable tobyClassModel;
            try
            {
                if (Int32.TryParse(id, out tobyClassId))
                {
                    using (var context = new TobyDBContext())
                    {
                        tobyClassModel = context.TobyClassLookupTable.Where(tobyClass => tobyClass.Id == tobyClassId).Single();
                    }
                }
                else
                {
                    throw new Exception();
                }

                return PartialView("TobyClassLutDetail", tobyClassModel);
            }
            catch
            {
                this.Response.StatusCode = 500;
                return PartialView("Error");
            }
        }

        public ActionResult EditedWorkType()
        {
            return PartialView("WorkTypeDetail");
        }

        public JsonResult SavedTeacher(TeacherModel teacher)
        {
            try
            {
                using (var context = new TobyDBContext())
                {
                    if (teacher.Id == Guid.Empty)
                    {
                        context.TeacherModels.Add(teacher);
                        context.SaveChanges();
                    }
                    else
                    {
                        context.TeacherModels.Update(teachers => teachers.Id == teacher.Id, teachers => new TeacherModel
                        {
                            Name = teacher.Name,
                            EnglishName = teacher.EnglishName
                        });
                    }
                }
                return Json(new { _id = teacher.Id, name = teacher.Name, en_name = teacher.EnglishName });
            }
            catch
            {
                this.Response.StatusCode = 500;
                return Json(false);
            }

        }

        public JsonResult SavedStudent(StudentModel student)
        {
            try
            {
                using (var context = new TobyDBContext())
                {
                    if (student.Id == Guid.Empty)
                    {
                        context.StudentModels.Add(student);
                        context.SaveChanges();
                    }
                    else
                    {
                        context.Entry(student).State = EntityState.Modified;
                        context.SaveChanges();
                    }
                }

                return Json(new
                {
                    name = student.Name,
                    en_name = student.EnglishName,
                    _id = student.Id,
                    grade = student.Grade,
                    contact = student.Contact,
                    phone = student.PhoneNumber,
                    address = student.Address,
                    birthday = student.BirthDay.HasValue ? student.BirthDay.Value.ToString("MM/dd/yyyy") : null,
                    class_id = student.TobyClassId,
                    school_id = student.SchoolId
                });
            }
            catch
            {
                this.Response.StatusCode = 500;
                return Json(null);
            }
        }

        public JsonResult SavedSchool(string schoolName, string id)
        {
            SchoolLookupTable schoolModel = new SchoolLookupTable { SchoolName = schoolName };
            int schoolId;
            try
            {
                using (var context = new TobyDBContext())
                {
                    if (id == null)
                    {
                        context.SchoolLookupTable.Add(schoolModel);
                        context.SaveChanges();
                    }
                    else if (Int32.TryParse(id, out schoolId))
                    {
                        context.SchoolLookupTable.Update(school => school.Id == schoolId, schools => new SchoolLookupTable
                        {
                            SchoolName = schoolName
                        });
                    }
                    else
                    {
                        throw new Exception();
                    }
                }
                return Json(new { _id = schoolModel.Id, school_name = schoolModel.SchoolName });
            }
            catch
            {
                this.Response.StatusCode = 500;
                return Json(false);
            }

        }

        public JsonResult SavedTobyClass(string className, string id)
        {
            TobyClassLookupTable tobyClassModel = new TobyClassLookupTable { ClassName = className };
            int tobyClassId;
            try
            {
                using (var context = new TobyDBContext())
                {
                    if (id == null)
                    {
                        context.TobyClassLookupTable.Add(tobyClassModel);
                        context.SaveChanges();
                    }
                    else if (Int32.TryParse(id, out tobyClassId))
                    {
                        context.TobyClassLookupTable.Update(tobyClass => tobyClass.Id == tobyClassId, clases => new TobyClassLookupTable
                        {
                            ClassName = className
                        });
                    }
                    else
                    {
                        throw new Exception();
                    }
                }
                return Json(new { _id = tobyClassModel.Id, class_name = tobyClassModel.ClassName });
            }
            catch
            {
                this.Response.StatusCode = 500;
                return Json(false);
            }

        }

        public JsonResult SavedWorkType(string typeName, string id)
        {
            WorkTypeLookupTable workTypeModel = new WorkTypeLookupTable { TypeName = typeName };
            int typeId;
            try
            {
                using (var context = new TobyDBContext())
                {
                    if (id == null)
                    {
                        context.WorkTypeLookupTable.Add(workTypeModel);
                        context.SaveChanges();
                    }
                    else if (Int32.TryParse(id, out typeId))
                    {
                        context.WorkTypeLookupTable.Update(workType=> workType.Id == typeId, type => new WorkTypeLookupTable
                        {
                            TypeName = typeName
                        });
                    }
                    else
                    {
                        throw new Exception();
                    }
                }
                return Json(new { _id = workTypeModel.Id, type_name = workTypeModel.TypeName });
            }
            catch
            {
                this.Response.StatusCode = 500;
                return Json(false);
            }
        }

        public JsonResult DeletedTeacher(string id)
        {
            Guid teacherId;
            try
            {
                if (Guid.TryParse(id, out teacherId))
                {
                    using (var context = new TobyDBContext())
                    {
                        context.TeacherModels.Delete(teacher => teacher.Id == teacherId);
                    }
                }
                else
                {
                    throw new Exception();
                }

                return Json(true);
            }
            catch
            {
                this.Response.StatusCode = 500;
                return Json(false);
            }
        }

        public JsonResult DeletedStudent(string id)
        {
            Guid studentId;
            try
            {
                if (Guid.TryParse(id, out studentId))
                {
                    using (var context = new TobyDBContext())
                    {
                        context.StudentModels.Delete(student => student.Id == studentId);
                    }
                }
                else
                {
                    throw new Exception();
                }

                return Json(true);
            }
            catch
            {
                this.Response.StatusCode = 500;
                return Json(false);
            }
        }

        public JsonResult DeletedSchool(string id)
        {
            int schoolId;
            try
            {
                if (Int32.TryParse(id, out schoolId))
                {
                    using (var context = new TobyDBContext())
                    {
                        context.SchoolLookupTable.Delete(school => school.Id == schoolId);
                    }
                }
                else
                {
                    throw new Exception();
                }

                return Json(true);
            }
            catch
            {
                this.Response.StatusCode = 500;
                return Json(false);
            }
        }

        public JsonResult DeletedTobyClass(string id)
        {
            int tobyClassId;
            try
            {
                if (Int32.TryParse(id, out tobyClassId))
                {
                    using (var context = new TobyDBContext())
                    {
                        context.TobyClassLookupTable.Delete(tobyClass => tobyClass.Id == tobyClassId);
                    }
                }
                else
                {
                    throw new Exception();
                }

                return Json(true);
            }
            catch
            {
                this.Response.StatusCode = 500;
                return Json(false);
            }
        }

        public void DeletedWorkType(int id)
        {
            try
            {

                using (var context = new TobyDBContext())
                {
                    context.WorkTypeLookupTable.Delete(workType => workType.Id == id);
                }
            }
            catch
            {
                this.Response.StatusCode = 500;
            }
        }

    }
}
