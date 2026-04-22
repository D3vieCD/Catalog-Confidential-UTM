using CatalogOnline.BusinessLayer;
using CatalogOnline.BusinessLayer.Interfaces;
using CatalogOnline.Domain.Models.Calendar;
using Microsoft.AspNetCore.Mvc;

namespace CatalogOnline.API.Controller
{
    [Route("api/calendar")]
    [ApiController]
    public class CalendarController : ControllerBase
    {
        private readonly ICalendarAction _calendarAction;

          public CalendarController()
          {
               var bl = new BusinessLogic();
               _calendarAction = bl.CalendarAction();
          }

        [HttpPost]
        public IActionResult CreateEvent(CreateCalendarEventDto createData)
        {
            var response = _calendarAction.CreateEventAction(createData);
            if (!response.IsValid) return BadRequest(response.Message);
            return Ok(response.Message);
        }

        [HttpGet]
        public IActionResult GetAllEvents()
        {
            var response = _calendarAction.GetAllEventsAction();
            if (!response.IsValid) return BadRequest(response.Message);
            return Ok(response.Events);
        }

        [HttpGet("{eventId}")]
        public IActionResult GetEventById([FromRoute] int eventId)
        {
            var response = _calendarAction.GetEventByIdAction(eventId);
            if (!response.IsValid) return BadRequest(response.Message);
            return Ok(response.Event);
        }

        [HttpGet("user/{userId}")]
        public IActionResult GetEventsByUserId([FromRoute] int userId)
        {
            var response = _calendarAction.GetEventsByUserIdAction(userId);
            if (!response.IsValid) return BadRequest(response.Message);
            return Ok(response.Events);
        }

        [HttpPut("{eventId}")]
        public IActionResult UpdateEvent([FromRoute] int eventId, UpdateCalendarEventDto updateData)
        {
            var response = _calendarAction.UpdateEventAction(eventId, updateData);
            if (!response.IsValid) return BadRequest(response.Message);
            return Ok(response.Message);
        }

        [HttpDelete("{eventId}")]
        public IActionResult DeleteEvent([FromRoute] int eventId)
        {
            var response = _calendarAction.DeleteEventAction(eventId);
            if (!response.IsValid) return BadRequest(response.Message);
            return Ok(response.Message);
        }
    }
}