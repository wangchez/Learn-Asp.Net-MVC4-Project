using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web.Mvc;
using TobyStudentManagementSystem.Models;
using EntityFramework.Extensions;

namespace TobyStudentManagementSystem.Controllers
{
    public class PaymentController : Controller
    {
        //
        // GET: /Payment/

        public ActionResult PaymentList()
        {
            List<TobyClassLookupTable> tobyClassModels;

            try
            {
                using (var context = new TobyDBContext())
                {
                    tobyClassModels = context.TobyClassLookupTable.ToList();
                }

                return View(tobyClassModels);
            }
            catch
            {
                this.Response.StatusCode = 500;
                return PartialView("Error");
            }
        }

        public JsonResult LoadingPaymentList(string dateLimit, int condition = 0)
        {
            List<PaymentModel> paymentModels;
            DateTime currentDate = DateTime.Now.Date;
            DateTime pastDataLimit = new DateTime();
            try
            {
                if (dateLimit != null && !DateTime.TryParse(dateLimit, out pastDataLimit))
                {
                    throw new Exception();
                }

                using (var context = new TobyDBContext())
                {
                    paymentModels = context.PaymentModels.Where(p => condition != 0 ? (condition == 1 ? p.PaymentDate != null
                        && p.PaymentDate >= pastDataLimit
                        : (p.PaymentDeadLine < currentDate && p.PaymentDate == null)) : true).OrderBy(p => p.PaymentDeadLine)
                        .Include(p => p.Students).ToList();
                }

                return Json(paymentModels.Select(payment => new
                    {
                        _id = payment.Id,
                        payment_name = payment.PaymentName,
                        payment = payment.Payment,
                        student_name = String.Format("{0}({1})", payment.Students.Name, payment.Students.EnglishName),
                        payment_date = payment.PaymentDate.HasValue ? payment.PaymentDate.Value.ToString("MM/dd/yyyy") : null,
                        deadline = payment.PaymentDeadLine.HasValue ? payment.PaymentDeadLine.Value.ToString("MM/dd/yyyy") : null,
                        class_id = payment.Students.TobyClassId
                    }).ToArray());
            }
            catch
            {
                this.Response.StatusCode = 500;
                return Json(null);
            }
        }

        public ActionResult NewPaymentPage()
        {
            return PartialView("NewPayment");
        }

        public JsonResult SavedNewPayment(string dealineTime, string paymentAmount, string paymentName, List<string> studentIds)
        {
            Guid studentId;
            DateTime deadline;
            decimal payment;
            PaymentModel paymentModel = new PaymentModel();
            PaymentJson paymentJson;
            List<PaymentJson> paymentJsonList = new List<PaymentJson>();

            try
            {
                using (var context = new TobyDBContext())
                {
                    if (studentIds != null && studentIds.Count != 0)
                    {
                        studentIds.ForEach(id =>
                            {
                                paymentModel = new PaymentModel { PaymentName = paymentName };
                                paymentJson = new PaymentJson { payment_name = paymentName };

                                if (decimal.TryParse(paymentAmount, out payment) && DateTime.TryParse(dealineTime, out deadline)
                                    && Guid.TryParse(id, out studentId))
                                {
                                    paymentModel.Payment = payment;
                                    paymentModel.PaymentDeadLine = deadline;
                                    paymentModel.StudentId = studentId;

                                    var student = context.StudentModels.Where(s => s.Id == studentId).Single();
                                    paymentJson.deadline = deadline.ToString("MM/dd/yyyy");
                                    paymentJson.payment = paymentAmount;
                                    paymentJson.student_name = string.Format("{0}({1})", student.Name, student.EnglishName);
                                    paymentJson.class_id = student.TobyClassId.GetValueOrDefault().ToString();
                                }
                                else
                                {
                                    throw new Exception();
                                }

                                context.PaymentModels.Add(paymentModel);
                                context.SaveChanges();
                                paymentJson._id = paymentModel.Id.ToString();
                                paymentJsonList.Add(paymentJson);
                            });
                    }
                    else
                    {
                        throw new Exception();
                    }
                }

                return Json(paymentJsonList.ToArray());
            }
            catch
            {
                this.Response.StatusCode = 500;

                return Json(null);
            }
        }

        public ActionResult EditedPayment(string paymentId)
        {
            PaymentModel paymentModel;
            Guid id;
            try
            {
                using (var context = new TobyDBContext())
                {
                    if (!Guid.TryParse(paymentId, out id))
                    {
                        throw new Exception();
                    }

                    paymentModel = context.PaymentModels.Where(p => p.Id == id).Single();
                }

                return PartialView("EditedPayment", paymentModel);
            }
            catch
            {
                this.Response.StatusCode = 500;
                return PartialView("Error");
            }
        }

        public ActionResult GetStudentsByClassId(int classId)
        {
            List<StudentModel> studentModels;
            try
            {
                using (var context = new TobyDBContext())
                {
                    studentModels = context.StudentModels.Where(s => s.TobyClassId == classId).ToList();
                }

                return PartialView("SelectedStudents", studentModels.Select(s => new StudentViewModel
                {
                    StudentId = s.Id.ToString(),
                    StudentName = String.Format("{0}({1})", s.Name, s.EnglishName)
                }).ToList());
            }
            catch
            {
                this.Response.StatusCode = 500;

                return PartialView("Error");
            }
        }

        public void UpdatedPayment(string registerTime, string dealineTime, string paymentAmount, string paymentName, string paymentId)
        {
            Guid id;
            DateTime deadline, payDate = DateTime.MaxValue;
            decimal payment;
            try
            {
                using (var context = new TobyDBContext())
                {
                    if (!Guid.TryParse(paymentId, out id) || !decimal.TryParse(paymentAmount, out payment)
                        || !DateTime.TryParse(dealineTime, out deadline) || ( registerTime != "" 
                        && !DateTime.TryParse(registerTime, out payDate)))
                    {
                        throw new Exception();
                    }
                    context.PaymentModels.Update(p => p.Id == id, model => new PaymentModel
                        {
                            Payment = payment,
                            PaymentDeadLine = deadline,
                            PaymentName = paymentName,
                            PaymentDate = registerTime != "" ? payDate : new Nullable<DateTime>()
                        });
                }
            }
            catch { }
        }

        public void DeletedPayment(string paymentId)
        {
            Guid id;
            try
            {
                using (var context = new TobyDBContext())
                {
                    if (!Guid.TryParse(paymentId, out id))
                    {
                        throw new Exception();
                    }

                    context.PaymentModels.Delete(p => p.Id == id);
                }
            }
            catch { }
        }
    }
}
