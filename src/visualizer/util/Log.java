package visualizer.util;

import java.util.logging.Logger;

public class Log {

    public static Logger forCategory(Object obj) {
        return Log.forCategory(obj.getClass());
    }

    public static Logger forCategory(Class clazz) {
        return Log.forCategory(clazz.getCanonicalName());
    }

    public static Logger forCategory(String category) {
        return Logger.getLogger(category);
    }
}
