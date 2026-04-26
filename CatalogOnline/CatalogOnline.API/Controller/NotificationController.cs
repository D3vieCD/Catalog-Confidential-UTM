using CatalogOnline.BusinessLayer;
using CatalogOnline.BusinessLayer.Interfaces;
using CatalogOnline.Domain.Models.Notification;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;

namespace CatalogOnline.API.Controller
{
    [Route("api/notifications")]
    [ApiController]
    [Authorize]
    public class NotificationController : ControllerBase
    {
        private readonly INotificationAction _notificationAction;

        public NotificationController()
        {
            var bl = new BusinessLogic();
            _notificationAction = bl.NotificationAction();
        }

        private int GetUserId()
        {
            var claim = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
            return int.TryParse(claim, out var id) ? id : 0;
        }

        [HttpGet]
        public IActionResult GetNotifications()
        {
            var response = _notificationAction.GetNotificationsAction(GetUserId());
            if (!response.IsValid) return BadRequest(response.Message);
            return Ok(response.Notifications);
        }

        [HttpPost("seen")]
        public IActionResult MarkSeen([FromBody] MarkSeenDto dto)
        {
            var response = _notificationAction.MarkSeenAction(GetUserId(), dto);
            if (!response.IsValid) return BadRequest(response.Message);
            return Ok(new { message = response.Message });
        }
    }
}
