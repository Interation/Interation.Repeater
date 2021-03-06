﻿using System.Web;
using System.Web.Mvc;

namespace Interation.Repeater.IOC
{
    public class InjectionHttpApplication : HttpApplication
    {
        public override void Init()
        {
            ControllerBuilder.Current.SetControllerFactory(new InjectionControllerFactory(InjectionRepository.Instance.Kernel));
        }
    }
}
