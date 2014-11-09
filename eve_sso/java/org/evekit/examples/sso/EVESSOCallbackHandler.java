package org.evekit.examples.sso;

import java.io.IOException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.scribe.builder.ServiceBuilder;
import org.scribe.model.OAuthRequest;
import org.scribe.model.Response;
import org.scribe.model.Token;
import org.scribe.model.Verb;
import org.scribe.model.Verifier;
import org.scribe.oauth.OAuthService;

/**
 * This servlet handles the callback from EVE SSO after authentication. If successful, then we use the code to extract an access token and also pull down
 * character information. This servlet should serve the URL "https://youreveapp.com/eve_sso_cb" from the example code in EVESSOAuthorizationHandler.
 */
public class EVESSOCallbackHandler extends HttpServlet {

  private static final long serialVersionUID = 1645947784508003309L;

  public static String getVerifyURL() {
    // Uncomment one of the next two lines depending on whether you're authenticating against SISI
    // return "https://sisilogin.testeveonline.com/oauth/verify";
    return "https://login.eveonline.com/oauth/verify";
  }

  @Override
  public void doGet(HttpServletRequest req, HttpServletResponse res) throws IOException {
    // Construct the service to use for verification.
    OAuthService service = new ServiceBuilder().provider(EVESSOAuthorizationHandler.getApiClass()).apiKey(EVESSOAuthorizationHandler.getClientID())
        .apiSecret(EVESSOAuthorizationHandler.getSecretKey()).build();

    // Exchange code for access token
    Verifier v = new Verifier(req.getParameter("code"));
    Token accessToken = service.getAccessToken(null, v);

    // Retrieve character selected for login.
    OAuthRequest request = new OAuthRequest(Verb.GET, getVerifyURL());
    service.signRequest(accessToken, request);
    Response response = request.send();
    if (!response.isSuccessful()) throw new IOException("credential request was not successful!");

    // The server response is in JSON format as described here: https://developers.eveonline.com/resource/single-sign-on
    // You'll want to use a proper JSON parser, but here's a quick hack to pull out character name:
    Pattern charNamePattern = Pattern.compile("\"CharacterName\":\\s*\"(\\S*?)\"");
    Matcher charNameMatcher = charNamePattern.matcher(response.getBody());
    @SuppressWarnings("unused")
    String charName = charNameMatcher.find() ? charNameMatcher.group(1) : "ERROR";

    // Now do something interesting with this authenticated user...

  }

}
