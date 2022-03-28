using System;
using System.Text;

namespace helpers.FileLogger
{
    public interface IFileLogger
    {
        void LogError(Exception errorMessage);
        void LogError(string errorMessage);
        void LogInfo(string infoMessage);
        void LogInfo(StringBuilder infoMessage);
        void LogWarning(string warningMessage);
    }
}