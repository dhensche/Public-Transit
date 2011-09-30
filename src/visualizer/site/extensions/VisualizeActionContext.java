package visualizer.site.extensions;

import net.sourceforge.stripes.action.ActionBeanContext;
import net.sourceforge.stripes.action.ForwardResolution;
import net.sourceforge.stripes.action.Resolution;
import net.sourceforge.stripes.controller.StripesConstants;

public class VisualizeActionContext extends ActionBeanContext {

    public Resolution getSourcePageResolution() {
        String sourcePage = getRequest().getParameter(StripesConstants.URL_KEY_SOURCE_PAGE);

        if (sourcePage == null) {
            throw new IllegalStateException(
                    "Here's how it is. Someone (quite possible the Stripes Dispatcher) needed " +
                            "to get the source page resolution. But no source page was supplied in the " +
                            "request, and unless you override ActionBeanContext.getSourcePageResolution() " +
                            "you're going to need that value. When you use a <stripes:form> tag a hidden " +
                            "field called '" + StripesConstants.URL_KEY_SOURCE_PAGE + "' is included. " +
                            "If you write your own forms or links that could generate validation errors, " +
                            "you must include a value  for this parameter. This can be done by calling " +
                            "request.getServletPath().");
        } else {
            return new ForwardResolution(sourcePage);
        }
    }
}
