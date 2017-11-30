using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(SBNicol.Startup))]
namespace SBNicol
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
