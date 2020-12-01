using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models
{
    public class DataContext: DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        { }
        public DbSet<catCharge> catCharge { get; set; }
        public DbSet<TransportRequestInfor> TransportRequestInfor { get; set; }



        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            modelBuilder.Entity<TransportRequestInfor>(entity =>
            {
                entity.HasNoKey();
                entity.ToTable("TransportRequestInfor");

                entity.Property(e => e.RefNo).IsRequired();


                entity.Property(e => e.PlaceFrom).IsRequired();


                entity.Property(e => e.PlaceTo).IsRequired();

                entity.Property(e => e.DriverName).IsRequired();


                entity.Property(e => e.ExcutionDate).IsRequired();


                entity.Property(e => e.LicensePlate).IsRequired();

            });
            modelBuilder.Query<TransportRequestInfor>();
        }
    }
}
