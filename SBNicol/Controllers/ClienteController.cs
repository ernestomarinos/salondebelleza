using System;
using System.IO;
using System.Text;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using General.Librerias.CodigoUsuario;


namespace SBNicol.Controllers
{
    public class ClienteController : Controller
    {
        public char crearCaracterAzar()
        {
            Random oAzar = new Random();
            int n = oAzar.Next(26) + 65;
            System.Threading.Thread.Sleep(15);
            return (char)n;
        }
        //
        // GET: /Cliente/

        public ActionResult Login()
        {
            string codigo = "";
            for (int i = 0; i < 5; i++) codigo += crearCaracterAzar();
            ViewBag.Original = codigo;
            ViewBag.Codigo = Convert.ToBase64String(Encoding.Default.GetBytes(codigo));
            return View();
        }

        public string validarLogin(string usuario, string clave)
        {
            Session["Usuario"] = usuario;
            string data = usuario + "|" + clave;
            daSQL odaSQL = new daSQL("conSBN");
            string rpta = odaSQL.ejecutarComando("uspClienteValidarLoginCsv", "@Login", data);
            if (rpta != "") Session["Cliente"] = rpta;
            return rpta;
        }

        public ActionResult Principal()
        {
            return View();
        }
	}
}