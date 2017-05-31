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
            services.AddTransient<IRecordRepository, EFRecordRepository>();
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
                routes.MapRoute(
                    name: null,
                    template: "Database/{category}/Page{page:int}",
                    defaults: new { controller = "Record", action = "List" });
                routes.MapRoute(
                    name: null,
                    template: "Database/Page{page:int}",
                    defaults: new { controller = "Record", action = "List", page = 1 }
                );
                routes.MapRoute(
                    name: null,
                    template: "Database/{category}",
                    defaults: new { controller = "Record", action = "List", page = 1 }
                );
                routes.MapRoute(
                    name: null,
                    template: "Record/{recordId:int}",
                    defaults: new { controller = "Record", action = "Details", recordId = 1 }
                );
                routes.MapRoute(
                    name: null,
                    template: "Download/{recordId:int}",
                    defaults: new { controller = "Record", action = "Download", recordId = 1 }
                );
                routes.MapRoute(
                    name: null,
                    template: "Plot/{recordId:int}",
                    defaults: new { controller = "Visualise", action = "Plot", recordId = 1 }
                );
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
            });
        }
    }
}
