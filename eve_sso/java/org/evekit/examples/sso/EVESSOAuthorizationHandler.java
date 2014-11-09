package org.evekit.examples.sso;

import java.io.IOException;
import java.net.URL;
import java.net.URLEncoder;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.scribe.builder.ServiceBuilder;
import org.scribe.builder.api.Api;
import org.scribe.builder.api.EVEApi;
import org.scribe.oauth.OAuthService;

/**
 * This servlet handles the browser request to sign in via EVE. The result of this call will be a redirect back to the browser to perform the authentication.
 * The second half of the signon is handled by the EVESSOCallbackHandler servlet.
 */
public class EVESSOAuthorizationHandler extends HttpServlet {

  private static final long serialVersionUID = 8306269235569648730L;

  public static String getClientID() {
    return "your EVE APP client ID";
  }

  public static String getSecretKey() {
    return "your EVE APP secret key";
  }

  public static Class<? extends Api> getApiClass() {
    // Uncomment one of the next two lines depending on whether you're authenticating against SISI.
    // return EVETestApi.class;
    return EVEApi.class;
  }

  @Override
  public void doGet(HttpServletRequest req, HttpServletResponse res) throws IOException {
    URL source = new URL(req.getRequestURL().toString());

    try {
      // Provide the callback URL which EVE SSO will call once authentication completes. THIS MUST MATCH THE CALLBACK URL YOU REGISTERED WITH YOUR APP!
      // Otherwise, EVE SSO will reject authentication.
      String callback = "https://youreveapp.com/eve_sso_cb";

      // Construct an OAuth request for EVE.
      OAuthService service = new ServiceBuilder().provider(getApiClass()).apiKey(getClientID()).apiSecret(getSecretKey()).callback(callback).build();
      res.sendRedirect(service.getAuthorizationUrl(null));
    } catch (Exception e) {
      // Handle the error however you like. This example redirects back to the caller with an error message as an URL parameter.
      res.sendRedirect(source.getProtocol()
          + "://"
          + source.getHost()
          + (source.getPort() > 0 ? ":" + source.getPort() : "")
          + "/?auth_error="
          + URLEncoder.encode("Error while attempting EVE authentication (" + e + ").  Please retry.  If the problem perists, please contact the site admin.",
                              "UTF-8"));
    }
  }

}
