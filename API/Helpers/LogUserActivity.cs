
using API.Extensions;
using Microsoft.AspNetCore.Mvc.Filters;
using API.Interfaces;

namespace API.Helpers
{
    public class LogUserActivity : IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var resultContext = await next();

            if(!resultContext.HttpContext.User.Identity.IsAuthenticated) return;

            var userId = resultContext.HttpContext.User.GetUserID();

            var repo = resultContext.HttpContext.RequestServices.GetRequiredService<IUserRepository>();

            var user = await repo.GetUserByIdAsync(userId);
            user.LastActive = DateTime.UtcNow;
            await repo.SaveAllAsync();
        }
    }
}