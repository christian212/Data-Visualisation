using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using AspCoreServer.Models;
using AspCoreServer;

namespace AspCoreServer.Data
{
    public static class DbInitializer
    {
        public static void Initialize(SpaDbContext context)
        {
            context.Database.EnsureCreated();

            if (context.Stacks.Any())
            {
                return;   // DB has been seeded
            }
            var stacks = new Stack[]
            {
               new Stack(){Name = "Test Stack 1"},
               new Stack(){Name = "Test Stack 2"},
               new Stack(){Name = "Test Stack 3"}
            };

            foreach (Stack s in stacks)
            {
                context.Stacks.Add(s);
            }
            context.SaveChanges();
        }
    }
}
