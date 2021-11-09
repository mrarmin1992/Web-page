using System.ComponentModel;

namespace Core.Specifications
{
    public class VijestSpecParams
    {
        private const int MaxPageSize = 50;
          public int PageIndex { get; set; } = 1;
          private int _pageSize = 2;
          public int PageSize
          {
               get => _pageSize;
               set => _pageSize = (value > MaxPageSize) ? MaxPageSize : value;
          }
          public int? VijestKategorijaId { get; set; }
          public string sort { get; set; }
          public string objava { get; set; } = "";
          private string _search;
          public string Search
          {
               get => _search;
               set => _search = value.ToLower();
          }
    }
}