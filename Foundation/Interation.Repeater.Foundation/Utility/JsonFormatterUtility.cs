using System.Web.Script.Serialization;

namespace Interation.Repeater.Foundation.Utility
{
    public static class JsonFormatterUtility
    {
        public static string Serialize<T>(T obj)
        {
            var javaScriptSerializer = new JavaScriptSerializer();
            return javaScriptSerializer.Serialize(obj);
        }

        public static T Deserialize<T>(string input)
        {
            var javaScriptSerializer = new JavaScriptSerializer();

            try { return javaScriptSerializer.Deserialize<T>(input); }
            catch { return default(T); }
        }
    }
}
