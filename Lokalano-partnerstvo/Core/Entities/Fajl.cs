namespace Core.Entities
{
    public class Fajl : BaseEntity
    {
        public string FileUrl { get; set; }
        public string FileName { get; set; }
        public string OriginalFileName { get; set; }
    }
}