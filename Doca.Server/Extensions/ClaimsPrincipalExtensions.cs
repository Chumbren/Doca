using System.Security.Claims;

namespace Doca.Server.Extensions
{
    public static class ClaimsPrincipalExtensions
    {
        public static int GetCurrentUserId(this ClaimsPrincipal user)
        {
            var idClaim = user.FindFirstValue(ClaimTypes.NameIdentifier)
                       ?? user.FindFirstValue("sub");

            if (string.IsNullOrEmpty(idClaim) || !int.TryParse(idClaim, out int userId))
            {
                throw new UnauthorizedAccessException("Не удалось определить ID пользователя. Убедитесь, что пользователь авторизован.");
            }

            return userId;
        }

        public static int? TryGetCurrentUserId(this ClaimsPrincipal user)
        {
            var idClaim = user.FindFirstValue(ClaimTypes.NameIdentifier)
                       ?? user.FindFirstValue("sub");

            return int.TryParse(idClaim, out var userId) ? userId : null;
        }
    }
}
