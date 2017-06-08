using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;

using Data_Visualisation.Models;
using Data_Visualisation.Data;

namespace Data_Visualisation
{
    public class Startup
    {
        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        public IConfigurationRoot Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // Add framework services.
            services.AddEntityFrameworkSqlite().AddDbContext<ApplicationDbContext>();
            // Register repository service
            services.AddTransient<IRepository, EFRepository>();
            services.AddMvc();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddDebug();

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseBrowserLink();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }

            app.UseStaticFiles();

            app.UseMvc(routes =>
            {
                // Stacks
                routes.MapRoute(
                    name: null,
                    template: "Datenbank/Stacks/Seite{page:int}",
                    defaults: new { controller = "Stack", action = "List", category = "Stacks" });
                routes.MapRoute(
                    name: null,
                    template: "Datenbank/Stacks",
                    defaults: new { controller = "Stack", action = "List", category = "Stacks", page = 1 });

                // Cells
                routes.MapRoute(
                    name: null,
                    template: "Datenbank/Zellen/Seite{page:int}",
                    defaults: new { controller = "Cell", action = "List", category = "Zellen" });
                routes.MapRoute(
                    name: null,
                    template: "Datenbank/Zellen",
                    defaults: new { controller = "Cell", action = "List", category = "Zellen", page = 1 });

                // Measurements
                routes.MapRoute(
                    name: null,
                    template: "Datenbank/Messungen/Seite{page:int}",
                    defaults: new { controller = "Measurement", action = "List", category = "Messungen" });
                routes.MapRoute(
                    name: null,
                    template: "Datenbank/Messungen",
                    defaults: new { controller = "Measurement", action = "List", category = "Messungen", page = 1 });

                // Database default
                routes.MapRoute(
                    name: null,
                    template: "Datenbank",
                    defaults: new { controller = "Stack", action = "List", category = "Stacks", page = 1 });

                // CRUD Stack
                routes.MapRoute(
                    name: null,
                    template: "Stack/Erstellen",
                    defaults: new { controller = "Stack", action = "Create" });

                // Default
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
            });
        }
    }
}