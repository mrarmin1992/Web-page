using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Core.Specifications
{
    public class PartnerSpecParams
    {
        private const int MaxPageSize = 50;
          public int PageIndex { get; set; } = 1;
          private int _pageSize = 2;
          public int PageSize
          {
               get => _pageSize;
               set => _pageSize = (value > MaxPageSize) ? MaxPageSize : value;
          }
          public string sort { get; set; }
          private string _search;
          public string Search
          {
               get => _search;
               set => _search = value.ToLower();
          }
    }
}