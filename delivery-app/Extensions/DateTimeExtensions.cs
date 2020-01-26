using System;

namespace DeliveryApp.Extensions
{
    public static class DateTimeExtensions
    {
        public static DateTime Truncate(this DateTime dt)
        {
            return new DateTime(dt.Year, dt.Month, dt.Day, dt.Hour, dt.Minute, dt.Second);
        }
    }
}