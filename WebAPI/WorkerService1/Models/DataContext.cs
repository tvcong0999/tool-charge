using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace WebAPI.Service.Models
{

    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        { }
        private DbSet<catCharge> catCharge { get; set; }
        private DbSet<TransportRequestInfor> TransportRequestInfor { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //ModelBuilder.Entity<TransportRequestInfor>()
        }
    } 
}
