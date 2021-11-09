using System.Reflection;
using Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class MyContext : DbContext
    {
        public MyContext(DbContextOptions<MyContext> options) : base(options)
        {
        }

        public DbSet<Kurs> Kursevi { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<Prijava> Prijave { get; set; }
        public DbSet<Partner> Partneri { get; set; }
        public DbSet<Publikacija> Publikacije { get; set; }
        public DbSet<Fajl> Files { get; set; }
        public DbSet<Vijest> Vijesti { get; set; }
        public DbSet<Obuka> Obuke { get; set; }
        public DbSet<Dogadjaj> Dogadjaji { get; set; }
        public DbSet<KursKategorija> KursKategorije { get; set; }
        public DbSet<VijestKategorija> VijestKategorije { get; set; }
        public DbSet<ObukaKategorija> ObukaKategorije { get; set; }
        public DbSet<DogadjajKategorija> DogadjajKategorije { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        }
    }
}