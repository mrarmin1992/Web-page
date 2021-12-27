using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Config
{
    public class KursConfiguration : IEntityTypeConfiguration<Kurs>
    {
        public void Configure(EntityTypeBuilder<Kurs> builder)
        {
            builder.Property(p => p.Cijena).HasColumnType("decimal(18,2)");
            builder.Property(p => p.Naziv).IsRequired().HasMaxLength(50);
            builder.HasOne(k => k.KursKategorija).WithMany()
            .HasForeignKey(p => p.KursKategorijaId);
        }
    }
}