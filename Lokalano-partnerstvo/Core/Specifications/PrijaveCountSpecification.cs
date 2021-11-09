using Core.Entities;

namespace Core.Specifications
{
    public class PrijaveCountSpecification : BaseSpecification<Prijava>
    {
        public PrijaveCountSpecification(string objava) 
        : base(x =>
               (string.IsNullOrEmpty(objava) || x.Objava == objava) &&
               (x.Pogledano == false)

          )
        {
        }
    }
}