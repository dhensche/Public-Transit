package visualizer.site.actions.home;

import net.sourceforge.stripes.action.DefaultHandler;
import net.sourceforge.stripes.action.ForwardResolution;
import net.sourceforge.stripes.action.Resolution;
import net.sourceforge.stripes.action.UrlBinding;
import visualizer.site.actions.BaseAction;
import visualizer.util.Log;

import java.util.logging.Logger;

@UrlBinding("home.page")
public class IndexAction extends BaseAction {
    private static Logger log = Log.forCategory(IndexAction.class);

    @DefaultHandler
    public Resolution show() {
        return new ForwardResolution("index.jsp");
    }
}
