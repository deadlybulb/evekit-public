package org.scribe.builder.api;

public class EVETestApi extends EVEApi {

  @Override
  protected String getAuthorizeURL() {
    return "https://sisilogin.testeveonline.com/oauth/authorize/?response_type=code&client_id=%s&redirect_uri=%s";
  }

  @Override
  public String getAccessTokenEndpoint() {
    return "https://sisilogin.testeveonline.com/oauth/token";
  }

}
