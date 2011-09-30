package visualizer.site.actions;

import net.sourceforge.stripes.action.ActionBean;
import net.sourceforge.stripes.action.ActionBeanContext;
import visualizer.site.extensions.VisualizeActionContext;
import visualizer.util.Log;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.logging.Logger;

public class BaseAction implements ActionBean {
    public Logger log = Log.forCategory(BaseAction.class);

    public static final String STRIPES_SOURCE_PAGE_PARAM = "_sourcePage";
    public static final String STRIPES_FIELDS_PRESENT_PARAM = "__fp";

    private ActionBeanContext context;
    private Boolean debug;

    public ActionBeanContext getContext() {
        return context;
    }

    public void setContext(ActionBeanContext context) {
        this.context = context;
    }

    public VisualizeActionContext getIsisContext() {
        return (VisualizeActionContext) context;
    }

    protected HttpServletRequest getRequest() {
        return this.context.getRequest();
    }

    protected HttpServletResponse getResponse() {
        return this.context.getResponse();
    }

    protected HttpSession getSession() {
        return getRequest().getSession();
    }

    protected String getParameter(String key) {
        return this.getRequest().getParameter(key);
    }
}
