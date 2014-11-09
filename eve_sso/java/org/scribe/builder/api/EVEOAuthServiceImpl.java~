package org.scribe.builder.api;

import org.scribe.model.OAuthConfig;
import org.scribe.model.OAuthConstants;
import org.scribe.model.OAuthRequest;
import org.scribe.model.Response;
import org.scribe.model.Token;
import org.scribe.model.Verifier;
import org.scribe.oauth.OAuth20ServiceImpl;
import org.scribe.services.Base64Encoder;

public class EVEOAuthServiceImpl extends OAuth20ServiceImpl {

  private final DefaultApi20 api;
  private final OAuthConfig  config;

  public EVEOAuthServiceImpl(DefaultApi20 api, OAuthConfig config) {
    super(api, config);
    this.api = api;
    this.config = config;
  }

  /**
   * {@inheritDoc}
   */
  @Override
  public Token getAccessToken(Token requestToken, Verifier verifier) {
    // Customize the access token request according to the EVE spec here:
    // https://developers.testeveonline.com/resource/single-sign-on
    OAuthRequest request = new OAuthRequest(api.getAccessTokenVerb(), api.getAccessTokenEndpoint());
    String authorization = config.getApiKey() + ":" + config.getApiSecret();
    String encoded = Base64Encoder.getInstance().encode(authorization.getBytes());
    request.addHeader("Authorization", "Basic " + encoded);
    request.addQuerystringParameter("grant_type", "authorization_code");
    request.addQuerystringParameter(OAuthConstants.CODE, verifier.getValue());
    Response response = request.send();
    return api.getAccessTokenExtractor().extract(response.getBody());
  }

  @Override
  public void signRequest(Token accessToken, OAuthRequest request) {
    request.addHeader("Authorization", "Bearer " + accessToken.getToken());
  }

}
