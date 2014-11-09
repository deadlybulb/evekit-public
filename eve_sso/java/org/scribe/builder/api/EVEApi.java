package org.scribe.builder.api;

import org.scribe.extractors.AccessTokenExtractor;
import org.scribe.extractors.JsonTokenExtractor;
import org.scribe.model.OAuthConfig;
import org.scribe.model.Verb;
import org.scribe.oauth.OAuthService;
import org.scribe.utils.OAuthEncoder;

public class EVEApi extends DefaultApi20 {

  protected String getAuthorizeURL() {
    return "https://login.eveonline.com/oauth/authorize/?response_type=code&client_id=%s&redirect_uri=%s";
  }

  protected String getScopedAuthorizeURL() {
    return getAuthorizeURL() + "&scope=%s";
  }

  @Override
  public String getAccessTokenEndpoint() {
    return "https://login.eveonline.com/oauth/token";
  }

  @Override
  public Verb getAccessTokenVerb() {
    return Verb.POST;
  }

  @Override
  public AccessTokenExtractor getAccessTokenExtractor() {
    // EVE returns a JSON response
    return new JsonTokenExtractor();
  }

  @Override
  public String getAuthorizationUrl(OAuthConfig cfg) {
    // Append scope if present
    if (cfg.hasScope()) {
      return String.format(getScopedAuthorizeURL(), cfg.getApiKey(), OAuthEncoder.encode(cfg.getCallback()), OAuthEncoder.encode(cfg.getScope()));
    } else {
      return String.format(getAuthorizeURL(), cfg.getApiKey(), OAuthEncoder.encode(cfg.getCallback()));
    }
  }

  @Override
  public OAuthService createService(OAuthConfig config) {
    return new EVEOAuthServiceImpl(this, config);
  }

}
