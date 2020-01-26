using System;
using System.Runtime.CompilerServices;
using System.Threading;
using System.Threading.Tasks;

namespace DeliveryApp.Extensions
{
    public static class TaskExtensions
    {
        public static void Forget(this Task task, [CallerMemberName] string caller = null)
        {
#pragma warning disable VSTHRD110 // Observe result of async calls
            task.ContinueWith(t => LogForgottenTaskFailure(t.Exception, caller), CancellationToken.None, TaskContinuationOptions.OnlyOnFaulted, TaskScheduler.Default);
#pragma warning restore VSTHRD110 // Observe result of async calls
        }

        private static void LogForgottenTaskFailure(AggregateException exception, string caller)
        {
            Console.WriteLine($"Exception occurred in {caller}: {exception.Message}\n{exception.StackTrace}");
        }
    }
}