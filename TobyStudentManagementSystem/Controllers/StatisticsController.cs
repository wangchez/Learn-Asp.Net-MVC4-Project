using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using TobyStudentManagementSystem.Models;
using System.Data.Entity;
namespace TobyStudentManagementSystem.Controllers
{
    public class StatisticsController : Controller
    {
        //
        // GET: /Statistics/

        public ActionResult Index()
        {
            return View("LaborHourStatisticsList");
        }

        public JsonResult LoadingLaborHourStatisticsList(string dateRange)
        {
            List<EventModel> eventModels;
            Dictionary<Guid, Dictionary<string, List<EventModel>>> eventModelDic = new Dictionary<Guid,Dictionary<string,List<EventModel>>>();
            Dictionary<int, string> workTypeDic = new Dictionary<int, string>();
            Dictionary<Guid, string> teacherDic;
            DateTime dateTimeStart, dateTimeEnd;

            try
            {
                using (var context = new TobyDBContext())
                {
                    if(!DateTime.TryParse(dateRange, out dateTimeStart))
                    {
                        throw new Exception();
                    }
                    dateTimeStart = new DateTime(dateTimeStart.Year, dateTimeStart.Month, 1);
                    dateTimeEnd = dateTimeStart.AddMonths(1).AddDays(-1);
                    eventModels = context.EventModels.Where(e => e.TeacherId != null
                        && (e.StartTime >= dateTimeStart && e.EndTime <= dateTimeEnd)).Include(e=> e.Teacher).ToList();
                    eventModelDic = context.TeacherModels.ToDictionary(key=> key.Id, v => new Dictionary<string, List<EventModel>>());
                    workTypeDic = context.WorkTypeLookupTable.ToDictionary(key=> key.Id, v => v.TypeName);
                    teacherDic = context.TeacherModels.ToDictionary(key=> key.Id, v => String.Format("{0}({1})", v.Name, v.EnglishName));
                }

                foreach (EventModel model in eventModels)
                {
                    if (eventModelDic.ContainsKey(model.TeacherId.Value))
                    {
                        var typeName = "NoType";
                        if(workTypeDic.ContainsKey(model.WorkTypeId.GetValueOrDefault()))
                        {
                            typeName = workTypeDic[model.WorkTypeId.GetValueOrDefault()];
                        }

                        if (!eventModelDic[model.TeacherId.Value].ContainsKey(typeName))
                        {
                            eventModelDic[model.TeacherId.Value].Add(typeName, new List<EventModel>());
                        }

                        eventModelDic[model.TeacherId.Value][typeName].Add(model);
                    }
                    else
                    {
                        throw new Exception();
                    }
                    
                }

                return Json(eventModelDic.Select(e => new
                    {
                        teacher_name = teacherDic[e.Key],
                        type_array = e.Value.Select(v => new
                        {
                            type_name = v.Key,
                            labor_hour = v.Value.Sum(h=> h.EndTime.Subtract(h.StartTime).TotalHours)
                        }).ToArray()

                    }).ToArray());
            }
            catch
            {
                this.Response.StatusCode = 500;

                return Json(null);
            }
        }
    }
}
