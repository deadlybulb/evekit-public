evekit-public
=============

Open sourced code for www.eve-kit.org

More to come in the near future.  For now:

* static-data: scripts we use for processing EVE static data dumps for import into eve-kit.org
* eve_sso: code to perform EVE single sign on using the scribe library

static-data
===========

Useful scripts:

* check_new_db: compares two versions of the EVE static DB stored on the same MySQL server and reports:
  * new or missing tables
  * tables with schema changes

EVE Single Sign On with Scribe
==============================

At EveKit we use the Scribe library to perform single sign on for various providers.
We added modifications to Scribe to make this work with the new EVE SSO support.
Read the "Quickstart" for instructions on how to use this code for servlet based applications.

# Classes

* [EVEApi](eve_sso/java/org/scribe/builder/api/EVEApi.java) Scribe API implementation for EVE SSO against Tranquility.
* [EVETestApi](eve_sso/java/org/scribe/builder/api/EVETestApi.java) Scribe API implementation for EVE SSO against SISI.
* [EVEOAuthServiceImpl](eve_sso/java/org/scribe/builder/api/EVEOAuthServiceImpl.java) Scribe OAuthService implementation which adapts Scribe to EVE SSO.
* [EVESSOAuthorizationHandler](eve_sso/java/org/evekit/examples/sso/EVESSOAuthorizationHandler.java) Example servlet for initiating EVE SSO authentication.
* [EVESSOCallbackHandler](eve_sso/java/org/evekit/examples/sso/EVESSOCallbackHandler.java) Example servlet for handling EVE SSO authentication callback.
* [web.xml](eve_sso/web.xml) Example servlet configuration.

# QuickStart

1. Get Scribe
  * From here: https://github.com/fernandezpablo85/scribe-java
  * Our code is built against Scribe-1.3.5
  * If you don't do Maven, you can pull the jar directly from here: http://search.maven.org/#artifactdetails%7Corg.scribe%7Cscribe%7C1.3.5%7Cjar

2. Configure your EVE SSO application
  * From here: https://developers.eveonline.com/
  * Sign in and go to "Applications" to create an application.
  * Pay attention to three things:
    1. Your EVE APP Client ID
    2. Your EVE APP Secret Key
    3. The callback URL you specified when you created your application.

3. Add the example servlets to your application (example [here](eve_sso/web.xml))
  * org.evekit.examples.sso.EVESSOAuthorizationHandler is the front-end which initiates authentication with EVE.  Your "login" button should hit a URL served by this servlet.
  * org.evekit.examples.sso.EVESSOCallbackHandler handles the callback from EVE after authentication completes.  This servlet should handle the URL you specified as the callback URL for your app.

4. Add your configuration information to EVESSOAuthorizationHandler and EVESSOCallbackHandler
  * In EVESSOAuthorizationHandler:
    * Change getClientID() to return your EVE APP client ID
    * Change getSecretKey() to return your EVE APP secret key
    * Change getApiClass() to return an appropriate class based on whether you want to authenticate against SISI
    * Set the appropriate callback URL in the body of doGet.  **THE URL YOU SPECIFY HERE MUST MATCH THE CALLBACK URL YOU REGISTERED ON THE DEV SITE!**  Otherwise, EVE will reject the authentication attempt.
  * In EVESSOCallbackHandler:
    * Change getVerifyURL() to return the appropriate URL for Tranquility or SISI

That's it!  Successful authentication will always end in EVESSOCallbackHandler.goGet().  See the sample code there for examples of what you can do post authentication.

# Notes

* If you need to authenticate against both Tranquility and SISI, you'll need to create separate applications on https://developers.eveonline.com/ and https://developers.testeveonline.com/, respectively.
* The callback URL you pass when initiating SSO with the EVE servers **must** match the URL you provided when you registered your app.  It's easy to change if you make a mistake.

