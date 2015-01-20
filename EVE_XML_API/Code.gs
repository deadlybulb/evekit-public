/*
 * EVE XML API download functions.
 *
 * Lots of good ideas borrowed from:
 *   EveApi (https://code.google.com/p/eveapi/)
 *   Prosper Blog (http://eve-prosper.blogspot.co.uk/2014/07/building-better-spreadsheets-crius.html)
 *
 * Author: EveKit Devs
 * EVE Release: Proteus
 *
 * License:
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-2015 eve-kit.org
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

// ------------------------------------------------------------------------------------------
// Connection handling and basic types
// ------------------------------------------------------------------------------------------

/**
 * Create an ApiAuth object.
 *
 * @param {string} keyID EVE API key ID
 * @param {string} vCode EVE API vCode
 * @param {number} charID (optional) character ID, needed for certain API calls.
 */
function ApiAuth(keyID, vCode, charID) {
  this.keyID = keyID;
  this.vCode = vCode;
  this.charID = charID;
}

/**
 * Enumeration of API paths.
 */
ApiPath = {
  ACCOUNT : "/account",
  CHARACTER : "/char",
  CORPORATION : "/corp",
  EVE : "/eve",
  MAP : "/map",
  NONE : "",
  SERVER : "/server",
  API : "/api"
};

/**
 * Enumeration of API pages.
 */
ApiPage = {
  ACCOUNT_STATUS : "AccountStatus",
  CHARACTERS : "Characters",
  API_KEY_INFO : "APIKeyInfo",
  ACCOUNT_BALANCE : "AccountBalance",
  ASSET_LIST : "AssetList",
  CALENDAR_EVENT_ATTENDEES : "CalendarEventAttendees",
  UPCOMING_CALENDAR_EVENTS : "UpcomingCalendarEvents",
  CONTACT_LIST : "ContactList",
  CONTACT_NOTIFICATIONS : "ContactNotifications",
  FACT_WAR_STATS : "FacWarStats",
  FACILITIES : "Facilities",
  INDUSTRY_JOBS : "IndustryJobs",
  INDUSTRY_JOBS_HISTORY : "IndustryJobsHistory",
  KILL_LOG : "KillMails",
  BLUEPRINTS : "Blueprints",
  CONTRACTS : "Contracts",
  CONTRACT_BIDS : "ContractBids",
  CONTRACT_ITEMS : "ContractItems",
  CUSTOMS_OFFICES : "CustomsOffices",
  LOCATIONS : "Locations",
  MAIL_BODIES : "MailBodies",
  MAILING_LISTS : "MailingLists",
  MAIL_MESSAGES : "MailMessages",
  MARKET_ORDERS : "MarketOrders",
  MEDALS : "Medals",
  NOTIFICATIONS : "Notifications",
  NOTIFICATION_TEXTS : "NotificationTexts",
  PLANETARY_COLONIES : "PlanetaryColonies",
  PLANETARY_PINS : "PlanetaryPins",
  PLANETARY_ROUTES : "PlanetaryRoutes",
  PLANETARY_LINKS : "PlanetaryLinks",
  RESEARCH : "Research",
  CHARACTER_SHEET : "CharacterSheet",
  SKILL_IN_TRAINING : "SkillInTraining",
  SKILL_QUEUE : "SkillQueue",
  STANDINGS : "Standings",
  WALLET_JOURNAL : "WalletJournal",
  WALLET_TRANSACTIONS : "WalletTransactions",
  CONTAINER_LOG : "ContainerLog",
  MEMBER_MEDALS : "MemberMedals",
  MEMBER_SECURITY_LOG : "MemberSecurityLog",
  MEMBER_SECURITY : "MemberSecurity",
  MEMBER_TRACKING : "MemberTracking",
  SHAREHOLDERS : "Shareholders",
  CORPORATION_SHEET : "CorporationSheet",
  STARBASE_DETAIL : "StarbaseDetail",
  STARBASE_LIST : "StarbaseList",
  OUTPOST_LIST : "OutpostList",
  OUTPOST_SERVICEDETAIL : "OutpostServiceDetail",
  TITLES : "Titles",
  ALLIANCE_LIST : "AllianceList",
  CHARACTER_AFFILIATION : "CharacterAffiliation",
  CHARACTER_ID : "CharacterID",
  CHARACTER_NAME : "CharacterName",
  CHARACTER_INFO : "CharacterInfo",
  CONQUERABLE_STATION_LIST : "ConquerableStationList",
  ERROR_LIST : "ErrorList",
  FACT_WAR_TOP_STATS : "FacWarTopStats",
  REF_TYPES : "RefTypes",
  SKILL_TREE : "SkillTree",
  TYPE_NAME : "TypeName",
  FACTION_WAR_SYSTEMS : "FacWarSystems",
  JUMPS : "Jumps",
  KILLS : "Kills",
  SOVEREIGNTY : "Sovereignty",
  SERVER_STATUS : "ServerStatus",
  CALL_LIST : "CallList"
};

/**
 * Assemble URL path for request.
 *
 * @param {string} path API path
 * @param {string} page API page
 * @returns {string} URL path for request.
 */
function createAPIURL_(path, page) {
  return EVE_API_URL_ + path + '/' + page + '.xml.aspx';
};

/**
 * Assemble object giving all request arguments including version and credentials.
 *
 * @param {number} version API version
 * @param {Object} auth ApiAuth object holding credentials
 * @param {Object} params existing params we should incorporate
 * @returns {Object} object describe parameters.
 */
function createAPIParams_(version, auth, params) {
  var result = {};
  result.version = version;
  if (auth !== undefined) {
    if (auth.keyID !== undefined) {
      result.keyID = auth.keyID;
    }
    if (auth.vCode !== undefined) {
      result.vCode = auth.vCode;
    }
    if (auth.charID !== undefined) {
      result.characterID = auth.charID;
    }
  }
  if (params !== undefined) {
    for (var key in params) {
      if (params.hasOwnProperty(key)) {
        result[key] = params[key];
      }
    }
  }
  return result;
}

// API Connector
EVE_API_URL_ = "https://api.eveonline.com";

/**
 * Retrieve base URL for API calls.
 */
function getBaseURL() {
  return EVE_API_URL_;
}

/**
 * Change base URL for API calls.
 *
 * @param {string} burl new base URL for future API calls.
 */
function setBaseURL(burl) {
  EVE_API_URL_ = burl;
}

/**
 * Assemble URL call parameters.
 *
 * @param {Object} params params to assemble.
 * @returns {string} search string for URL
 */
function assembleParams_(params) {
  var result = '';
  for (var key in params) {
    if (params.hasOwnProperty(key)) {
      result = result + '&' + encodeURIComponent(key, 'UTF8') + '=' + encodeURIComponent(params[key], 'UTF8');
    }
  }
  if (result.length > 0) {
    result = result.substr(1);
  }
  return result;
}

/**
 * Request EVE API XML document.
 *
 * @param {string} req_url Request URL.
 * @param {Object} params parameters for request.
 * @returns
 */
function request_(req_url, params) {
  var parameters = {
      method : "post",
      payload : assembleParams_(params),
      user_agent : "EveKit/Phoebe (https://www.eve-kit.org; eve.kit.sysop@gmail.com)",
      muteHttpExceptions : true
  };
  return UrlFetchApp.fetch(req_url ,parameters);
};

/**
 * Construct a response exception.
 *
 * @param {number} code HTTP response code.
 * @param {string} msg HTTP response text.
 */
function ApiException(code, msg) {
  this.responseCode = code;
  this.responseText = msg;
}

// ------------------------------------------------------------------------------------------
// Generic API Utilities
// ------------------------------------------------------------------------------------------

/**
 * Set object value by extracting a value from the given document and the given path.  If a parser is specified,
 * then we'll parse the value with parser first.
 *
 * @param {Object} root root XML document element from which search will start.  First path element should match the name of this element.
 * @param {Object} obj target object on which a value will be set.
 * @param {string} key name of the parameter to set on the target object.
 * @param {string} path XML path to extract.
 * @param {Object} parser (optional) parser to process value before we assign to the object.
 */
function SimplePropertySetter_(root, obj, key, path, parser) {
  var els = path.split('/');
  if (els.length === 0) return false;
  if (root.getName() !== els[0]) return false;
  for (var i = 1; i < els.length; i++) {
    root = root.getChild(els[i]);
    if (root === null) return false;
  }
  obj[key] = parser === undefined ? root.getText() : parser(root.getText());
  return true;
}

/**
 * Set object value by extracting an attribute value from the given document and the given path.  If a parser is specified,
 * then we'll parse the value with parser first.
 *
 * @param {Object} root root XML document element from which search will start.  First path element should match the name of this element.
 * @param {Object} obj target object on which a value will be set.
 * @param {string} key name of the parameter to set on the target object.
 * @param {string} path XML path to extract.
 * @param {string] attr the name of the attribute to extract.
 * @param {Object} parser (optional) parser to process value before we assign to the object.
 */
function SimpleAttributeSetter_(root, obj, key, path, attr, parser) {
  var els = path.split('/');
  if (els.length === 0) return false;
  if (root.getName() !== els[0]) return false;
  for (var i = 1; i < els.length; i++) {
    root = root.getChild(els[i]);
    if (root === null) return false;
  }
  if (root.getAttribute(attr) === null) return false;
  obj[key] = parser === undefined ? root.getAttribute(attr).getValue() : parser(root.getAttribute(attr).getValue());
  return true;
}

/**
 * Copy all attributes from the element at the given path to the given object.  If a parser is specified,
 * then pass each attribute value to the parser first.
 *
 * @param {Object} root root XML document element from which search will start.  First path element should match the name of this element.
 * @param {Object} obj target object on which a value will be set.
 * @param {string} path XML path to extract.
 * @param {Object} parser (optional) parser to process value before we assign to the object.
 */
function AllAttributeSetter_(root, obj, path, parser) {
  var els = path.split('/');
  if (els.length === 0) return false;
  if (root.getName() !== els[0]) return false;
  for (var i = 1; i < els.length; i++) {
    root = root.getChild(els[i]);
    if (root === null) return false;
  }
  var attrs = root.getAttributes();
  for (var i = 0; i < attrs.length; i++) {
    var key = attrs[i].getName();
    var val = attrs[i].getValue();
    obj[key] = parser === undefined ? val : parser(val);
  }
  return true;
}

/**
 * Process all children of the element with the given path.  Each child is passed to
 * a processor with a reference to the element representing the child.
 *
 * @param {Object} root root XML document element from which search will start.  First path element should match the name of this element.
 * @param {string} path XML path describing elements to extract.
 * @param {Function} processor function to apply to each child element.
 */
function ProcessChildren_(root, path, processor) {
  var els = path.split('/');
  if (els.length === 0) return false;
  if (root.getName() !== els[0]) return false;
  for (var i = 1; i < els.length; i++) {
    root = root.getChild(els[i]);
    if (root === null) return false;
  }
  var chld = root.getChildren();
  for (var i = 0; i < chld.length; i++) {
    processor(chld[i]);
  }
  return true;
}

/**
 * Find elements matching the given path and which satisfy the (optional) test.
 *
 * @param {Object} root root XML document element from which search will start.  First path element should match the name of this element.
 * @param {string} path XML path describing the location of the desired child.
 * @param {Function} test function to apply to each child element.
 * @returns the array of matching child elements
 */
function FindElements_(root, path, test) {
  var els = path.split('/');
  if (els.length === 0) return [];
  if (root.getName() !== els[0]) return [];
  var next = [];
  var check = [ root ];
  var i = 1;
  while (i < els.length) {
    while (check.length > 0) {
      var subs = check.pop();
      next = next.concat(subs.getChildren(els[i]));
    }
    check = next;
    next = [];
    i = i + 1;
  }
  var result = [];
  for (i = 0; i < check.length; i++) {
    if (test === undefined || test(check[i])) {
      result.push(check[i]);
    }
  }
  return result;
}

/**
 * Convert an EVE API date into a javascript Date.
 *
 * @param {string} dt EVE API date string
 * @returns {Date} equivalent javascript Date (UTC).
 */
function EveDateParser_(dt) {
  // YYYY-MM-DD HH:MM:SS
  // This shouldn't be necessary, but apps script Date seems non-standard.
  var dt_pair = dt.split(' ');
  var dt_day = dt_pair[0].split('-');
  var dt_tm = dt_pair[1].split(':');
  return new Date(Date.UTC(dt_day[0], dt_day[1] - 1, dt_day[2], dt_tm[0], dt_tm[1], dt_tm[2]));
}

/**
 * Retrieve EVE API XML response.  Throws ApiException if return status is not 200.
 *
 * @param {string} path API path
 * @param {stirng} page API page
 * @param {number} version API version
 * @param {Object} auth ApiAuth holding credentials
 * @param {Object} params object with additional parameters for call
 * @param {Object} build result builder for this API call.  If the call does not result in an error, then Response.result is set to the result of calling the builder.
 * @returns {Object} an instance of type Response
 */
function retrieveXML_(path, page, version, auth, params, build) {
  var res = request_(createAPIURL_(path, page), createAPIParams_(version, auth, params));
  var code = res.getResponseCode();
  if ( (code < 200 || code >= 300) && (code < 400 || code >= 500) ) {
    // Not an OK or EVE generated error code, so throw an exception
    throw new ApiException(res.getResponseCode(), res.getContentText());
  }
  var doc = XmlService.parse(res.getContentText());
  var el = doc.getRootElement();
  var result = new Response(el);
  if (result.error === undefined) {
    // Not an error, invoke the builder.
    result.result = build(el);
  }
  return result;
}

/**
 * Curry a constructor into a builder which extracts children of eveapi/result/rowset
 * and invokes the constructor for each child.
 *
 * @param {Function} ctor constructor to invoke on children.
 * @return Function which accepts the root under which children will be searched.
 */
function GenericBuilder_(ctor) {
  return function(root) {
    var vals = [];
    var processor = function(el) {
      vals.push(new ctor(el));
    };
    ProcessChildren_(root, 'eveapi/result/rowset', processor);
    return vals;
  };
}

/**
 * Build lists of objects by finding children at the given path.  Cols is an array containing
 * elements of the form:
 * {
 *   name : value of the "name" attribute an element must have in order for its children to be processed
 *   ctor : the constructor to invoke for each child of the matching element
 *   tgt : a reference to the array which show hold the constructed objects
 * }
 *
 * @param {Object} root the root element under which to find matches
 * @param {Array} cols see above
 * @param {string} path the path of matching elements
 */
function GenericListBuilder_(root, cols, path) {
  for (var i = 0; i < cols.length; i++) {
    var els = FindElements_(root, path, function (ck) {
      return ck.getAttribute('name').getValue() === cols[i].name;
    });
    for (var j = 0; j < els.length; j++) {
      var rows = els[j].getChildren('row');
      for (var k = 0; k < rows.length; k++) {
        cols[i].tgt.push(new cols[i].ctor(rows[k]));
      }
    }
  }
}

// ------------------------------------------------------------------------------------------
// AccountAPI
// ------------------------------------------------------------------------------------------

/**
 * Retrieve account status.
 *
 * @param {ApiAuth} auth ApiAuth holding credentials
 * @returns {AccountStatus} current account status
 */
function accountStatus(auth) {
  return retrieveXML_(ApiPath.ACCOUNT, ApiPage.ACCOUNT_STATUS, 2, auth, {},
      function(el) { return new AccountStatus(el); });
}

/**
 * Retrieve account characters.
 *
 * @param {ApiAuth} auth ApiAuth holding credentials
 * @returns {Array<Character>} array of characters associated with this account
 */
function accountCharacters(auth){
  return retrieveXML_(ApiPath.ACCOUNT, ApiPage.CHARACTERS, 1, auth, {}, GenericBuilder_(Character));
};

/**
 * Retrieve API key information.
 *
 * @param {ApiAuth} auth ApiAuth holding credentials
 * @returns {APIKeyInfo} information about the API Key used to make the call
 */
function accountAPIKeyInfo(auth){
  return retrieveXML_(ApiPath.ACCOUNT, ApiPage.API_KEY_INFO, 2, auth, {},
                      function(el) { return new APIKeyInfo(el); });
};

// ------------------------------------------------------------------------------------------
// CharacterAPI
// ------------------------------------------------------------------------------------------

/**
 * Retrieve character account balances.
 *
 * @param {ApiAuth} auth ApiAuth holding credentials
 * @returns {Array<AccountBalance>} array of character account balances
 */
function charAccountBalances(auth) {
  return retrieveXML_(ApiPath.CHARACTER, ApiPage.ACCOUNT_BALANCE, 2, auth, {}, GenericBuilder_(AccountBalance));
};

/**
 * Retrieve character assets.  Contained assets are stored in the "assets" array of the container.
 *
 * @param {ApiAuth} auth ApiAuth holding credentials
 * @returns {Array<Asset>} array of character assets
 */
function charAssetList(auth) {
  return retrieveXML_(ApiPath.CHARACTER, ApiPage.ASSET_LIST, 2, auth, {}, GenericBuilder_(Asset));
};

/**
 * Retrieve character blueprints.
 *
 * @param {ApiAuth} auth ApiAuth holding credentials
 * @returns {Array<Blueprint>} array of character blueprints
 */
function charBlueprints(auth) {
  return retrieveXML_(ApiPath.CHARACTER, ApiPage.BLUEPRINTS, 2, auth, {}, GenericBuilder_(Blueprint));
};

/**
 * Retrieve calendar event attendees for upcoming calendar events as specified by one or
 * more event IDs.  Event IDs should be specified after the "auth" argument.
 *
 * @param {ApiAuth} auth ApiAuth holding credentials
 * @returns {Array<CalendarEventAttendee>} array of calendar event attendees for the specified events.
 */
function charCalendarEventAttendees(auth) {
  var args = [];
  for (var i = 1; i < arguments.length; i++) {
    args.push(arguments[i]);
  }
  return retrieveXML_(ApiPath.CHARACTER, ApiPage.CALENDAR_EVENT_ATTENDEES, 2, auth,
      { eventIDs: args.join(',')}, GenericBuilder_(CalendarEventAttendee));
};

/**
 * Retrieve character sheet.
 *
 * @param {ApiAuth} auth ApiAuth holding credentials
 * @returns {CharacterSheet} character's sheet
 */
function charSheet(auth) {
  return retrieveXML_(ApiPath.CHARACTER, ApiPage.CHARACTER_SHEET, 1, auth, {},
      function(el) { return new CharacterSheet(el) });
};

/**
 * Retrieve character contact list.  Contacts are stored in one of three arrays
 * in the returned object:
 *
 * <ol>
 * <li> contactList - regular contacts.
 * <li> corporateContactList - corporate contacts.
 * <li> allianceContactList - alliance contacts.
 * </ol>
 *
 * @param {ApiAuth} auth ApiAuth holding credentials
 * @returns {ContactList} character contact list
 */
function charContactList(auth) {
  return retrieveXML_(ApiPath.CHARACTER, ApiPage.CONTACT_LIST, 2, auth, {},
      function(el) { return new ContactList(el) });
};

/**
 * Retrieve character contact notifications.
 *
 * @param {ApiAuth} auth ApiAuth holding credentials
 * @returns {Array<ContactNotification>} array of character contact notifications
 */
function charContactNotifications(auth) {
  return retrieveXML_(ApiPath.CHARACTER, ApiPage.CONTACT_NOTIFICATIONS, 2, auth, {}, GenericBuilder_(ContactNotification));
};

/**
 * Retrieve character contracts.
 *
 * @param {ApiAuth} auth ApiAuth holding credentials
 * @returns {Array<Contract>} array of character contracts
 */
function charContracts(auth) {
  return retrieveXML_(ApiPath.CHARACTER, ApiPage.CONTRACTS, 1, auth, {}, GenericBuilder_(Contract));
};

/**
 * Retrieve contract bids for character contracts.
 *
 * @param {ApiAuth} auth ApiAuth holding credentials
 * @returns {Array<ContractBid>} array of contract bids
 */
function charContractBids(auth) {
  return retrieveXML_(ApiPath.CHARACTER, ApiPage.CONTRACT_BIDS, 1, auth, {}, GenericBuilder_(ContractBid));
};

/**
 * Retrieve contract items for the specified character contract.
 *
 * @param {ApiAuth} auth ApiAuth holding credentials
 * @param {number} contractID ID of contract for which items will be retrieved
 * @returns {Array<ContractItem>} array of contract items
 */
function charContractItems(auth, contractID) {
  return retrieveXML_(ApiPath.CHARACTER, ApiPage.CONTRACT_ITEMS, 1, auth,
      { contractID: contractID }, GenericBuilder_(ContractItem));
};

/**
 * Retrieve character faction war stats.
 *
 * @param {ApiAuth} auth ApiAuth holding credentials
 * @returns {FacWarStats} faction war stats for this character
 */
function charFacWarStats(auth) {
  return retrieveXML_(ApiPath.CHARACTER, ApiPage.FACT_WAR_STATS, 2, auth, {},
      function(el) { return new FacWarStats(el) });
};

/**
 * Retrieve character industry jobs.
 *
 * @param {ApiAuth} auth ApiAuth holding credentials
 * @returns {Array<IndustryJob>} array of character industry jobs
 */
function charIndustryJobs(auth) {
  return retrieveXML_(ApiPath.CHARACTER, ApiPage.INDUSTRY_JOBS, 2, auth, {}, GenericBuilder_(IndustryJob));
};

/**
 * Retrieve historic character industry jobs.
 *
 * @param {ApiAuth} auth ApiAuth holding credentials
 * @returns {Array<IndustryJob>} array of historic character industry jobs
 */
function charIndustryJobsHistory(auth) {
  return retrieveXML_(ApiPath.CHARACTER, ApiPage.INDUSTRY_JOBS_HISTORY, 2, auth, {}, GenericBuilder_(IndustryJob));
};

/**
 * Retrieve a selection of character kill mails.  If "fromID" is defined, then only kill mails with a kill ID
 * before "fromID" will be retrieved (used for walking backwards).  If "rowCount" is specified,
 * then at most "rowCount" rows will be returned.
 *
 * @param {ApiAuth} auth ApiAuth holding credentials
 * @param {number} fromID max kill ID to return for this call
 * @param {number} rowCount limit on number of records returned
 * @returns {Array<KillMail>} array of character kill mails
 */
function charKillMails(auth, fromID, rowCount) {
  var args = {};
  if (fromID !== undefined) args['fromID'] = fromID;
  if (rowCount !== undefined) args['rowCount'] = rowCount;
  return retrieveXML_(ApiPath.CHARACTER, ApiPage.KILL_LOG, 2, auth, args, GenericBuilder_(KillMail));
};

/**
 * Retrieve locations for a set of item IDs owned by this character.  Item IDs should be
 * specified after the "auth" argument.
 *
 * @param {ApiAuth} auth ApiAuth holding credentials
 * @returns {Array<Location>} array of item locations
 */
function charLocations(auth) {
  var args = [];
  for (var i = 1; i < arguments.length; i++) {
    args.push(arguments[i]);
  }
  return retrieveXML_(ApiPath.CHARACTER, ApiPage.LOCATIONS, 2, auth,
      { IDs: args.join(',')}, GenericBuilder_(Location));
};

/**
 * Retrieve character mail message headers.
 *
 * @param {ApiAuth} auth ApiAuth holding credentials
 * @returns {Array<MailMessage>} array of mail message headers
 */
function charMailMessages(auth) {
  return retrieveXML_(ApiPath.CHARACTER, ApiPage.MAIL_MESSAGES, 2, auth, {}, GenericBuilder_(MailMessage));
};

/**
 * Retrieve mail message bodies for the specified message IDs.
 * Message IDs should be specified after the "auth" argument.
 *
 * @param {ApiAuth} auth ApiAuth holding credentials
 * @returns {Array<MailBody>} array of mail bodies for the specified message IDs
 */
function charMailBodies(auth) {
  var args = [];
  for (var i = 1; i < arguments.length; i++) {
    args.push(arguments[i]);
  }
  return retrieveXML_(ApiPath.CHARACTER, ApiPage.MAIL_BODIES, 2, auth,
      { ids: args.join(',')}, GenericBuilder_(MailBody));
};

/**
 * Retrieve character mailing lists.
 *
 * @param {ApiAuth} auth ApiAuth holding credentials
 * @returns {Array<MailingList>} array of character mailing lists
 */
function charMailingLists(auth) {
  return retrieveXML_(ApiPath.CHARACTER, ApiPage.MAILING_LISTS, 2, auth, {}, GenericBuilder_(MailingList));
};

/**
 * Retrieve character market orders.
 *
 * @param {ApiAuth} auth ApiAuth holding credentials
 * @returns {Array<MarketOrder>} array of character market orders
 */
function charMarketOrders(auth) {
  return retrieveXML_(ApiPath.CHARACTER, ApiPage.MARKET_ORDERS, 2, auth, {}, GenericBuilder_(MarketOrder));
};

/**
 * Retrieve list of character medals.  Medals are stored in one of two
 * arrays in the returned object:
 *
 * <ol>
 * <li> currentCorporation - medals awarded from the character's current corporation
 * <li> otherCorporations - medals awarded to the character by other corporations
 * </ol>
 *
 * @param {ApiAuth} auth ApiAuth holding credentials
 * @returns {MedalList} character medal list
 */
function charMedalList(auth) {
  return retrieveXML_(ApiPath.CHARACTER, ApiPage.MEDALS, 2, auth, {},
      function(el) { return new MedalList(el) });
};

/**
 * Retrieve character notifications headers.
 *
 * @param {ApiAuth} auth ApiAuth holding credentials
 * @returns {Array<Notification>} array of character notification headers
 */
function charNotifications(auth) {
  return retrieveXML_(ApiPath.CHARACTER, ApiPage.NOTIFICATIONS, 2, auth, {}, GenericBuilder_(Notification));
};

/**
 * Retrieve character notification bodies.  This is a variable arguments method.  After the ApiAuth, pass
 * one or more notification IDs to retrieve.
 *
 * @param {ApiAuth} auth ApiAuth holding credentials
 * @returns {Array<NotificationText>} array of character notification bodies
 */
function charNotificationTexts(auth) {
  var args = [];
  for (var i = 1; i < arguments.length; i++) {
    args.push(arguments[i]);
  }
  return retrieveXML_(ApiPath.CHARACTER, ApiPage.NOTIFICATION_TEXTS, 2, auth,
      { IDs: args.join(',')}, GenericBuilder_(NotificationText));
};

/**
 * Retrieve character planetary colonies.
 *
 * @param {ApiAuth} auth ApiAuth holding credentials
 * @returns {Array<PlanetaryColony>} array of character planetary colonies
 */
function charPlanetaryColonies(auth) {
  return retrieveXML_(ApiPath.CHARACTER, ApiPage.PLANETARY_COLONIES, 2, auth, {}, GenericBuilder_(PlanetaryColony));
};

/**
 * Retrieve planetary pins for a planetary colony.
 *
 * @param {ApiAuth} auth ApiAuth holding credentials
 * @param {number} planetID ID of planet for which pins will be retrieved
 * @returns {Array<PlanetaryPin>} array of planetary pins
 */
function charPlanetaryPins(auth, planetID) {
  return retrieveXML_(ApiPath.CHARACTER, ApiPage.PLANETARY_PINS, 2, auth, {planetID: planetID}, GenericBuilder_(PlanetaryPin));
};

/**
 * Retrieve planetary routes for a planetary colony.
 *
 * @param {ApiAuth} auth ApiAuth holding credentials
 * @param {number} planetID ID of planet for which routes will be retrieved
 * @returns {Array<PlanetaryRoute>} array of planetary routes
 */
function charPlanetaryRoutes(auth, planetID) {
  return retrieveXML_(ApiPath.CHARACTER, ApiPage.PLANETARY_ROUTES, 2, auth, {planetID: planetID}, GenericBuilder_(PlanetaryRoute));
};

/**
 * Retrieve planetary links for a planetary colony.
 *
 * @param {ApiAuth} auth ApiAuth holding credentials
 * @param {number} planetID ID of planet for which links will be retrieved
 * @returns {Array<PlanetaryLink>} array of planetary links
 */
function charPlanetaryLinks(auth, planetID) {
  return retrieveXML_(ApiPath.CHARACTER, ApiPage.PLANETARY_LINKS, 2, auth, {planetID: planetID}, GenericBuilder_(PlanetaryLink));
};

/**
 * Retrieve character research.
 *
 * @param {ApiAuth} auth ApiAuth holding credentials
 * @returns {Array<Research>} array of character research
 */
function charResearch(auth) {
  return retrieveXML_(ApiPath.CHARACTER, ApiPage.RESEARCH, 2, auth, {}, GenericBuilder_(Research));
};

/**
 * Retrieve character skill in training.
 *
 * @param {ApiAuth} auth ApiAuth holding credentials
 * @returns {SkillInTraining} current character skill in training
 */
function charSkillInTraining(auth) {
  return retrieveXML_(ApiPath.CHARACTER, ApiPage.SKILL_IN_TRAINING, 2, auth, {},
      function(el) { return new SkillInTraining(el) });
};

/**
 * Retrieve character skill queue.
 *
 * @param {ApiAuth} auth ApiAuth holding credentials
 * @returns {Array<SkillInQueue>} array of character skills in queue
 */
function charSkillQueue(auth) {
  return retrieveXML_(ApiPath.CHARACTER, ApiPage.SKILL_QUEUE, 2, auth, {}, GenericBuilder_(SkillInQueue));
};

/**
 * Retrieve character standings.  Standings are stored in one of three arrays
 * in the returned object:
 *
 * <ol>
 * <li> agents - standings with agents
 * <li> NPCCorporations - standings with NPC corporations
 * <li> factions - standings with factions
 * </ol>
 *
 * @param {ApiAuth} auth ApiAuth holding credentials
 * @returns {StandingList} character standing list
 */
function charStandings(auth) {
  return retrieveXML_(ApiPath.CHARACTER, ApiPage.STANDINGS, 2, auth, {}, StandingBuilder_(true));
};

/**
 * Retrieve upcoming calendar events.
 *
 * @param {ApiAuth} auth ApiAuth holding credentials
 * @returns {Array<UpcomingCalendarEvent>} array of upcoming calendar events
 */
function charUpcomingCalendarEvents(auth) {
  return retrieveXML_(ApiPath.CHARACTER, ApiPage.UPCOMING_CALENDAR_EVENTS, 2, auth, {}, GenericBuilder_(UpcomingCalendarEvent));
};

/**
 * Retrieve character wallet journal.  If "fromID" is defined, then only wallet journal entries
 * with a journal ID before "fromID" will be retrieved (used for walking backwards).
 * If "rowCount" is specified, then at most "rowCount" rows will be returned.
 *
 * @param {ApiAuth} auth ApiAuth holding credentials
 * @param {number} fromID max journal ID to return for this call
 * @param {number} rowCount limit on number of records returned
 * @returns {Array<WalletJournal>} array of character journal entries
 */
function charWalletJournal(auth, rowCount, fromID) {
  var args = { accountKey: 1000 };
  if (rowCount !== undefined) args['rowCount'] = rowCount;
  if (fromID !== undefined) args['fromID'] = fromID;
  return retrieveXML_(ApiPath.CHARACTER, ApiPage.WALLET_JOURNAL, 2, auth, args, GenericBuilder_(WalletJournal));
};

/**
 * Retrieve character wallet transactions.  If "fromID" is defined, then only wallet transactions
 * with a transaction ID before "fromID" will be retrieved (used for walking backwards).
 * If "rowCount" is specified, then at most "rowCount" rows will be returned.
 *
 * @param {ApiAuth} auth ApiAuth holding credentials
 * @param {number} fromID max transaction ID to return for this call
 * @param {number} rowCount limit on number of records returned
 * @returns {Array<WalletTransaction>} array of character wallet transactions
 */
function charWalletTransaction(auth, rowCount, fromID) {
  var args = { accountKey: 1000 };
  if (rowCount !== undefined) args['rowCount'] = rowCount;
  if (fromID !== undefined) args['fromID'] = fromID;
  return retrieveXML_(ApiPath.CHARACTER, ApiPage.WALLET_TRANSACTIONS, 2, auth, args, GenericBuilder_(WalletTransaction));
};

// ------------------------------------------------------------------------------------------
// CorporationAPI
// ------------------------------------------------------------------------------------------

/**
 * Retrieve corporation account balances.
 *
 * @param {ApiAuth} auth ApiAuth holding credentials
 * @returns {Array<AccountBalance>} array of corporation account balances
 */
function corpAccountBalances(auth) {
  return retrieveXML_(ApiPath.CORPORATION, ApiPage.ACCOUNT_BALANCE, 2, auth, {}, GenericBuilder_(AccountBalance));
};

/**
 * Retrieve corporation assets.  Contained assets are stored in the "assets" array of the container.
 *
 * @param {ApiAuth} auth ApiAuth holding credentials
 * @returns {Array<Asset>} array of corporation assets
 */
function corpAssetList(auth) {
  return retrieveXML_(ApiPath.CORPORATION, ApiPage.ASSET_LIST, 2, auth, {}, GenericBuilder_(Asset));
};

/**
 * Retrieve corporation blueprints.
 *
 * @param {ApiAuth} auth ApiAuth holding credentials
 * @returns {Array<Blueprint>} array of corporation blueprints
 */
function corpBlueprints(auth) {
  return retrieveXML_(ApiPath.CORPORATION, ApiPage.BLUEPRINTS, 2, auth, {}, GenericBuilder_(Blueprint));
};

/**
 * Retrieve corporation contact list.  Contacts are stored in one of three arrays
 * in the returned object:
 *
 * <ol>
 * <li> contactList - regular contacts.
 * <li> corporateContactList - corporate contacts.
 * <li> allianceContactList - alliance contacts.
 * </ol>
 *
 * @param {ApiAuth} auth ApiAuth holding credentials
 * @returns {ContactList} corporation contact list
 */
function corpContactList(auth) {
  return retrieveXML_(ApiPath.CORPORATION, ApiPage.CONTACT_LIST, 2, auth, {},
      function(el) { return new ContactList(el) });
};

/**
 * Retrieve container log.
 *
 * @param {ApiAuth} auth ApiAuth holding credentials
 * @returns {Array<ContainerLog>} array of container log entries
 */
function corpContainerLog(auth) {
  return retrieveXML_(ApiPath.CORPORATION, ApiPage.CONTAINER_LOG, 2, auth, {}, GenericBuilder_(ContainerLog));
};

/**
 * Retrieve corporation contracts.
 *
 * @param {ApiAuth} auth ApiAuth holding credentials
 * @returns {Array<Contract>} array of corporation contracts
 */
function corpContracts(auth) {
  return retrieveXML_(ApiPath.CORPORATION, ApiPage.CONTRACTS, 1, auth, {}, GenericBuilder_(Contract));
};

/**
 * Retrieve contract bids for corporation contracts.
 *
 * @param {ApiAuth} auth ApiAuth holding credentials
 * @returns {Array<ContractBid>} array of contract bids
 */
function corpContractBids(auth) {
  return retrieveXML_(ApiPath.CORPORATION, ApiPage.CONTRACT_BIDS, 1, auth, {}, GenericBuilder_(ContractBid));
};

/**
 * Retrieve contract items for the specified corporation contract.
 *
 * @param {ApiAuth} auth ApiAuth holding credentials
 * @param {number} contractID ID of contract for which items will be retrieved
 * @returns {Array<ContractItem>} array of contract items
 */
function corpContractItems(auth, contractID) {
  return retrieveXML_(ApiPath.CORPORATION, ApiPage.CONTRACT_ITEMS, 1, auth,
      { contractID: contractID }, GenericBuilder_(ContractItem));
};

/**
 * Retrieve corporation customs offices.
 *
 * @param {ApiAuth} auth ApiAuth holding credentials
 * @returns {Array<CustomsOffice>} array of customs offices
 */
function corpCustomsOffices(auth) {
  return retrieveXML_(ApiPath.CORPORATION, ApiPage.CUSTOMS_OFFICES, 2, auth,
      {}, GenericBuilder_(CustomsOffice));
};

/**
 * Retrieve corporation sheet.  If "corpID" is specified, then retrieve the
 * corporation sheet for the corporation with the specified ID.
 *
 * @param {ApiAuth} auth ApiAuth holding credentials
 * @param {number} corpID if specified, then retrieve the sheet for the specified corporation
 * @returns {CorporationSheet} corporation sheet
 */
function corpSheet(auth, corpID) {
  var args = {};
  if (corpID !== undefined) args['corporationID'] = corpID;
  return retrieveXML_(ApiPath.CORPORATION, ApiPage.CORPORATION_SHEET, 2, auth, args,
      function(el) { return new CorporationSheet(el); });
};

/**
 * Retrieve corporation facilities.
 *
 * @param {ApiAuth} auth ApiAuth holding credentials
 * @returns {Array<Facility>} array of corporation facilities
 */
function corpFacilities(auth) {
  return retrieveXML_(ApiPath.CORPORATION, ApiPage.FACILITIES, 2, auth,
      {}, GenericBuilder_(Facility));
};

/**
 * Retrieve corporation faction war stats.
 *
 * @param {ApiAuth} auth ApiAuth holding credentials
 * @returns {FacWarStats} faction war stats for this corporation
 */
function corpFacWarStats(auth) {
  return retrieveXML_(ApiPath.CORPORATION, ApiPage.FACT_WAR_STATS, 2, auth, {},
      function(el) { return new FacWarStats(el); });
};

/**
 * Retrieve corporation industry jobs.
 *
 * @param {ApiAuth} auth ApiAuth holding credentials
 * @returns {Array<IndustryJob>} array of corporation industry jobs
 */
function corpIndustryJobs(auth) {
  return retrieveXML_(ApiPath.CORPORATION, ApiPage.INDUSTRY_JOBS, 2, auth, {}, GenericBuilder_(IndustryJob));
};

/**
 * Retrieve historic corporation industry jobs.
 *
 * @param {ApiAuth} auth ApiAuth holding credentials
 * @returns {Array<IndustryJob>} array of historic corporation industry jobs
 */
function corpIndustryJobsHistory(auth) {
  return retrieveXML_(ApiPath.CORPORATION, ApiPage.INDUSTRY_JOBS_HISTORY, 2, auth, {}, GenericBuilder_(IndustryJob));
};

/**
 * Retrieve a selection of corporation kill mails.  If "fromID" is defined, then only kill mails with a kill ID
 * before "fromID" will be retrieved (used for walking backwards).  If "rowCount" is specified,
 * then at most "rowCount" rows will be returned.
 *
 * @param {ApiAuth} auth ApiAuth holding credentials
 * @param {number} fromID max kill ID to return for this call
 * @param {number} rowCount limit on number of records returned
 * @returns {Array<KillMail>} array of corporation kill mails
 */
function corpKillMails(auth, fromID, rowCount) {
  var args = {};
  if (fromID !== undefined) args['fromID'] = fromID;
  if (rowCount !== undefined) args['rowCount'] = rowCount;
  return retrieveXML_(ApiPath.CORPORATION, ApiPage.KILL_LOG, 2, auth, args, GenericBuilder_(KillMail));
};

/**
 * Retrieve locations for a set of item IDs owned by this corporation.  Item IDs should be
 * specified after the "auth" argument.
 *
 * @param {ApiAuth} auth ApiAuth holding credentials
 * @returns {Array<Location>} array of item locations
 */
function corpLocations(auth) {
  var args = [];
  for (var i = 1; i < arguments.length; i++) {
    args.push(arguments[i]);
  }
  return retrieveXML_(ApiPath.CORPORATION, ApiPage.LOCATIONS, 2, auth,
      { IDs: args.join(',')}, GenericBuilder_(Location));
};

/**
 * Retrieve corporation market orders.
 *
 * @param {ApiAuth} auth ApiAuth holding credentials
 * @returns {Array<MarketOrder>} array of corporation market orders
 */
function corpMarketOrders(auth) {
  return retrieveXML_(ApiPath.CORPORATION, ApiPage.MARKET_ORDERS, 2, auth, {}, GenericBuilder_(MarketOrder));
};

/**
 * Retrieve list of defined corporation medals.  Medals are stored in
 * the "medals" array in the returned object.
 *
 * @param {ApiAuth} auth ApiAuth holding credentials
 * @returns {MedalList} corporation medals
 */
function corpMedalList(auth) {
  return retrieveXML_(ApiPath.CORPORATION, ApiPage.MEDALS, 2, auth, {},
      function(el) { return new MedalList(el); });
};

/**
 * Retrieve list of medals awarded to members.  Medals are stored in the
 * "issuedMedals" array in the returned object.
 *
 * @param {ApiAuth} auth ApiAuth holding credentials
 * @returns {MedalList} awarded corporation medals
 */
function corpMemberMedals(auth) {
  return retrieveXML_(ApiPath.CORPORATION, ApiPage.MEMBER_MEDALS, 2, auth, {},
      function(el) { return new MedalList(el); });
};

/**
 * Retrieve corporation member security records.
 *
 * @param {ApiAuth} auth ApiAuth holding credentials
 * @returns {Array<MemberSecurity>} array of corporation member security records
 */
function corpMemberSecurity(auth) {
  return retrieveXML_(ApiPath.CORPORATION, ApiPage.MEMBER_SECURITY, 2, auth, {}, GenericBuilder_(MemberSecurity));
};

/**
 * Retrieve corporation member security log.
 *
 * @param {ApiAuth} auth ApiAuth holding credentials
 * @returns {Array<MemberSecurityLog>} array of corporation member security log entries
 */
function corpMemberSecurityLog(auth) {
  return retrieveXML_(ApiPath.CORPORATION, ApiPage.MEMBER_SECURITY_LOG, 2, auth, {}, GenericBuilder_(MemberSecurityLog));
};

/**
 * Retrieve corporation member tracking.
 *
 * @param {ApiAuth} auth ApiAuth holding credentials
 * @returns {Array<MemberTracking>} array of corporation member tracking records
 */
function corpMemberTracking(auth, extended) {
  var args = {};
  if (extended) args['extended'] = 1;
  return retrieveXML_(ApiPath.CORPORATION, ApiPage.MEMBER_TRACKING, 2, auth, args, GenericBuilder_(MemberTracking));
};

/**
 * Retrieve list of corporation outposts.
 *
 * @param {ApiAuth} auth ApiAuth holding credentials
 * @returns {Array<Outpost>} array of corporation outposts
 */
function corpOutpostList(auth) {
  return retrieveXML_(ApiPath.CORPORATION, ApiPage.OUTPOST_LIST, 2, auth, {}, GenericBuilder_(Outpost));
};

/**
 * Retrieve services for a corporation outpost.
 *
 * @param {ApiAuth} auth ApiAuth holding credentials
 * @param {number} itemID item ID of outpost for which services will be retrieved.
 * @returns {Array<OutpostService>} array of services for the specified outpost.
 */
function corpOutpostService(auth, itemid) {
  return retrieveXML_(ApiPath.CORPORATION, ApiPage.OUTPOST_SERVICEDETAIL, 2, auth, {itemID: itemid}, GenericBuilder_(OutpostService));
};

/**
 * Retrieve corporation shareholder list.  Shareholders are stored in one of two arrays
 * in the returned object:
 *
 * <ol>
 * <li> characters - shareholders which are characters
 * <li> corporations - shareholders which are corporations
 * </ol>
 *
 * @param {ApiAuth} auth ApiAuth holding credentials
 * @returns {ShareholderList} corporation shareholders
 */
function corpShareholderList(auth, itemid) {
  return retrieveXML_(ApiPath.CORPORATION, ApiPage.SHAREHOLDERS, 2, auth, {},
      function(el) { return new ShareholderList(el); });
};

/**
 * Retrieve corporation standings.  Standings are stored in one of three arrays
 * in the returned object:
 *
 * <ol>
 * <li> agents - standings with agents
 * <li> NPCCorporations - standings with NPC corporations
 * <li> factions - standings with factions
 * </ol>
 *
 * @param {ApiAuth} auth ApiAuth holding credentials
 * @returns {StandingList} corporation standing list
 */
function corpStandings(auth) {
  return retrieveXML_(ApiPath.CORPORATION, ApiPage.STANDINGS, 2, auth, {}, StandingBuilder_(false));
};

/**
 * Retrieve list of corporation starbases.
 *
 * @param {ApiAuth} auth ApiAuth holding credentials
 * @returns {Array<Starbase>} array of corporation starbases
 */
function corpStarbaseList(auth) {
  return retrieveXML_(ApiPath.CORPORATION, ApiPage.STARBASE_LIST, 2, auth, {}, GenericBuilder_(Starbase));
};

/**
 * Retrieve details for a corporation starbase.
 *
 * @param {ApiAuth} auth ApiAuth holding credentials
 * @param {number} itemID item ID of the starbase for which details will be retrieved
 * @returns {StarbaseDetail} details for the specified corporation starbase
 */
function corpStarbaseDetail(auth, itemid) {
  return retrieveXML_(ApiPath.CORPORATION, ApiPage.STARBASE_DETAIL, 2, auth, {itemID: itemid},
      function(el) { return new StarbaseDetail(el) });
};

/**
 * Retrieve corporation titles.
 *
 * @param {ApiAuth} auth ApiAuth holding credentials
 * @returns {Array<Title>} array of corporation titles
 */
function corpTitles(auth) {
  return retrieveXML_(ApiPath.CORPORATION, ApiPage.TITLES, 2, auth, {}, GenericBuilder_(Title));
};

/**
 * Retrieve corporation wallet journal.  If "fromID" is defined, then only wallet journal entries
 * with a journal ID before "fromID" will be retrieved (used for walking backwards).
 * If "rowCount" is specified, then at most "rowCount" rows will be returned.
 *
 * @param {ApiAuth} auth ApiAuth holding credentials
 * @param {number} fromID max journal ID to return for this call
 * @param {number} rowCount limit on number of records returned
 * @returns {Array<WalletJournal>} array of corporation journal entries
 */
function corpWalletJournal(auth, accountKey, rowCount, fromID) {
  var args = { accountKey: accountKey };
  if (rowCount !== undefined) args['rowCount'] = rowCount;
  if (fromID !== undefined) args['fromID'] = fromID;
  return retrieveXML_(ApiPath.CORPORATION, ApiPage.WALLET_JOURNAL, 2, auth, args, GenericBuilder_(WalletJournal));
};

/**
 * Retrieve corporation wallet transactions.  If "fromID" is defined, then only wallet transactions
 * with a transaction ID before "fromID" will be retrieved (used for walking backwards).
 * If "rowCount" is specified, then at most "rowCount" rows will be returned.
 *
 * @param {ApiAuth} auth ApiAuth holding credentials
 * @param {number} fromID max transaction ID to return for this call
 * @param {number} rowCount limit on number of records returned
 * @returns {Array<WalletTransaction>} array of corporation wallet transactions
 */
function corpWalletTransaction(auth, accountKey, rowCount, fromID) {
  var args = { accountKey: accountKey };
  if (rowCount !== undefined) args['rowCount'] = rowCount;
  if (fromID !== undefined) args['fromID'] = fromID;
  return retrieveXML_(ApiPath.CORPORATION, ApiPage.WALLET_TRANSACTIONS, 2, auth, args, GenericBuilder_(WalletTransaction));
};

// ------------------------------------------------------------------------------------------
// EVEAPI
// ------------------------------------------------------------------------------------------

/**
 * Retrieve list of alliances.
 *
 * @returns {Array<Alliance>} array of current alliances
 */
function eveAllianceList() {
  return retrieveXML_(ApiPath.EVE, ApiPage.ALLIANCE_LIST, 2, undefined, {}, GenericBuilder_(Alliance));
}

/**
 * Retrieve character affiliations.  This is a variable arguments method.  Pass in one or more character IDs
 * for which affiliation should be retrieved.
 *
 * @returns {Array<APICharacter>} array of requested character affiliations
 */
function eveCharacterAffiliation() {
  var args = [];
  for (var i = 0; i < arguments.length; i++) {
    args.push(arguments[i]);
  }
  return retrieveXML_(ApiPath.EVE, ApiPage.CHARACTER_AFFILIATION, 2, undefined,
      { ids: args.join(',')}, GenericBuilder_(APICharacter));
}

/**
 * Map character names to character IDs.  This is a variable arguments method.  Pass in one or more character names
 * for which the mapping should be performed.
 *
 * @returns {Array<Character>} array of requested character mappings
 */
function eveCharacterID() {
  var args = [];
  for (var i = 0; i < arguments.length; i++) {
    args.push(arguments[i]);
  }
  return retrieveXML_(ApiPath.EVE, ApiPage.CHARACTER_ID, 2, undefined,
      { names: args.join(',')}, GenericBuilder_(Character));
}

/**
 * Look up character information by character ID.  There are two variants of this function which are determined by the values
 * stored in the "auth" argument.  If the "auth" argument contains a valid key, vcode and character ID, then the full
 * character info record is returned.  If the "auth" argument only contains a character ID, or only the character ID is
 * valid, then a limited character info record is returned.
 *
 * @param {ApiAuth} auth ApiAuth describing character to look up (see notes above).
 * @returns {CharacterInfo} array of requested character mappings
 */
function eveCharacterInfo(auth) {
  return retrieveXML_(ApiPath.EVE, ApiPage.CHARACTER_INFO, 2, auth, {},
      function(el) { return new CharacterInfo(el); });
}

/**
 * Map character IDs to character names.  This is a variable arguments method.  Pass in one or more character IDs
 * for which the mapping should be performed.
 *
 * @returns {Array<Character>} array of requested character mappings
 */
function eveCharacterName() {
  var args = [];
  for (var i = 0; i < arguments.length; i++) {
    args.push(arguments[i]);
  }
  return retrieveXML_(ApiPath.EVE, ApiPage.CHARACTER_NAME, 2, undefined,
      { ids: args.join(',')}, GenericBuilder_(Character));
}

/**
 * Retrieve list of conquerable stations (including outposts).
 *
 * @returns {Array<ConquerableStation>} array of conquerable stations
 */
function eveConquerableStationList() {
  return retrieveXML_(ApiPath.EVE, ApiPage.CONQUERABLE_STATION_LIST, 2, undefined, {}, GenericBuilder_(ConquerableStation));
}

/**
 * Retrieve list of error codes.
 *
 * @returns {Array<ErrorCode>} array of error codes and text
 */
function eveErrorList() {
  return retrieveXML_(ApiPath.EVE, ApiPage.ERROR_LIST, 2, undefined, {}, GenericBuilder_(ErrorCode));
}

/**
 * Retrieve faction war global stats.
 *
 * @returns {FacWarGlobalStats} faction war global stats
 */
function eveFacWarStats() {
  return retrieveXML_(ApiPath.EVE, ApiPage.FACT_WAR_STATS, 2, undefined, {},
      function(el) { return new FacWarGlobalStats(el); });
}

/**
 * Retrieve faction war top 100 stats.
 *
 * @returns {FacWarTopStats} faction war top 100 stats
 */
function eveFacWarTopStats() {
  return retrieveXML_(ApiPath.EVE, ApiPage.FACT_WAR_TOP_STATS, 2, undefined, {},
      function(el) { return new FacWarTopStats(el); });
}

/**
 * Retrieve list of ref (transaction) types.
 *
 * @returns {Array<RefType>} array of ref types
 */
function eveRefTypes() {
  return retrieveXML_(ApiPath.EVE, ApiPage.REF_TYPES, 2, undefined, {}, GenericBuilder_(RefType));
}

/**
 * Retrieve current EVE skill tree.
 *
 * @returns {Array<SkillGroup>} array of skill groups
 */
function eveSkillTree() {
  return retrieveXML_(ApiPath.EVE, ApiPage.SKILL_TREE, 2, undefined, {}, GenericBuilder_(SkillGroup));
}

/**
 * Map type IDs to type names.  This is a variable arguments method.  Pass in one or more type IDs
 * for which the mapping should be performed.
 *
 * @returns {Array<TypeName>} array of requested type mappings
 */
function eveTypeName() {
  var args = [];
  for (var i = 0; i < arguments.length; i++) {
    args.push(arguments[i]);
  }
  return retrieveXML_(ApiPath.EVE, ApiPage.TYPE_NAME, 2, undefined,
      { ids: args.join(',')}, GenericBuilder_(TypeName));
}

// ------------------------------------------------------------------------------------------
// Map API
// ------------------------------------------------------------------------------------------
/**
 * Retrieve list of faction war systems.
 *
 * @returns {Array<FactionWarSystem>} array of faction war systems
 */
function mapFacWarSystems() {
  return retrieveXML_(ApiPath.MAP, ApiPage.FACTION_WAR_SYSTEMS, 2, undefined, {}, GenericBuilder_(FactionWarSystem));
}

/**
 * Retrieve list of ship jumps.
 *
 * @returns {Array<ShipJump>} array of ship jumps
 */
function mapJumps() {
  return retrieveXML_(ApiPath.MAP, ApiPage.JUMPS, 2, undefined, {}, GenericBuilder_(ShipJump));
}

/**
 * Retrieve list of kills.
 *
 * @returns {Array<KillStat>} array of kills
 */
function mapKills() {
  return retrieveXML_(ApiPath.MAP, ApiPage.KILLS, 2, undefined, {}, GenericBuilder_(KillStat));
}

/**
 * Retrieve system sovereignty list.
 *
 * @returns {Array<SystemSovereignty>} array of system sovereignty
 */
function mapSovereignty() {
  return retrieveXML_(ApiPath.MAP, ApiPage.SOVEREIGNTY, 2, undefined, {}, GenericBuilder_(SystemSovereignty));
}

// ------------------------------------------------------------------------------------------
// Server API
// ------------------------------------------------------------------------------------------
/**
 * Retrieve server status.
 *
 * @returns {ServerStatus} current server status
 */
function serverStatus() {
  return retrieveXML_(ApiPath.SERVER, ApiPage.SERVER_STATUS, 2, undefined, {},
      function(el) { return new ServerStatus(el); });
}

// ------------------------------------------------------------------------------------------
// API API
// ------------------------------------------------------------------------------------------
/**
 * Retrieve API call list.
 *
 * @returns {APICallList} current API call list
 */
function apiCallList() {
  return retrieveXML_(ApiPath.API, ApiPage.CALL_LIST, 2, undefined, {},
      function(el) { return new APICallList(el); });
}

// ------------------------------------------------------------------------------------------
// Response
// ------------------------------------------------------------------------------------------
function Response(root) {
  // int version
  // Date currentTime
  // Date cachedUntil
  // error = { int code, string error }
  // Object result <-- type depends on API call
  AllAttributeSetter_(root, this, 'eveapi', parseInt);
  var err = {};
  if (AllAttributeSetter_(root, err, 'eveapi/error', parseInt)) {
    // This is an error response.  Finish parsing.
    SimplePropertySetter_(root, err, 'error', 'eveapi/error');
    this.error = err;
  }
  SimplePropertySetter_(root, this, 'currentTime', 'eveapi/currentTime', EveDateParser_);
  SimplePropertySetter_(root, this, 'cachedUntil', 'eveapi/cachedUntil', EveDateParser_);
}

// ------------------------------------------------------------------------------------------
// AccountStatus
// ------------------------------------------------------------------------------------------
function MultiCharacterTraining(root) {
  SimpleAttributeSetter_(root, this, 'trainingEnd', 'row', 'trainingEnd', EveDateParser_);
}

function AccountStatus(root) {
  // Date paidUntil
  // Date createDate
  // int logonCount
  // int logonMinutes
  // multiCharacterTraining = [];
  SimplePropertySetter_(root, this, 'paidUntil', 'eveapi/result/paidUntil', EveDateParser_);
  SimplePropertySetter_(root, this, 'createDate', 'eveapi/result/createDate', EveDateParser_);
  SimplePropertySetter_(root, this, 'logonCount', 'eveapi/result/logonCount', parseInt);
  SimplePropertySetter_(root, this, 'logonMinutes', 'eveapi/result/logonMinutes', parseInt);
  var mct = [];
  var processor = function(el) {
    mct.push(new MultiCharacterTraining(el));
  };
  ProcessChildren_(root, 'eveapi/result/rowset', processor);
  this.multiCharacterTraining = mct;
}

// ------------------------------------------------------------------------------------------
// CharacterList
// ------------------------------------------------------------------------------------------
function Character(root) {
  //string name
  //long characterID
  //string corporationName
  //long corporationID
  SimpleAttributeSetter_(root, this, 'name', 'row', 'name');
  SimpleAttributeSetter_(root, this, 'characterID', 'row', 'characterID', parseInt);
  SimpleAttributeSetter_(root, this, 'corporationName', 'row', 'corporationName');
  SimpleAttributeSetter_(root, this, 'corporationID', 'row', 'corporationID', parseInt);
}

// ------------------------------------------------------------------------------------------
// APIKeyInfo
// ------------------------------------------------------------------------------------------
function APICharacter(root) {
  // long characterID
  // string characterName
  // long corporationID
  // string corporationName
  // long allianceID
  // string allianceName
  // long factionID
  // string factionName
  SimpleAttributeSetter_(root, this, 'characterID', 'row', 'characterID', parseInt);
  SimpleAttributeSetter_(root, this, 'characterName', 'row', 'characterName');
  SimpleAttributeSetter_(root, this, 'corporationID', 'row', 'corporationID', parseInt);
  SimpleAttributeSetter_(root, this, 'corporationName', 'row', 'corporationName');
  SimpleAttributeSetter_(root, this, 'allianceID', 'row', 'allianceID', parseInt);
  SimpleAttributeSetter_(root, this, 'allianceName', 'row', 'allianceName');
  SimpleAttributeSetter_(root, this, 'factionID', 'row', 'factionID', parseInt);
  SimpleAttributeSetter_(root, this, 'factionName', 'row', 'factionName');
}

function APIKeyInfo(root) {
  // long accessMask
  // string type
  // Date expires
  // characters = [] -- array of APICharacter
  SimpleAttributeSetter_(root, this, 'accessMask', 'eveapi/result/key', 'accessMask', parseInt);
  SimpleAttributeSetter_(root, this, 'type', 'eveapi/result/key', 'type');
  // NOTE: expires will be empty if this key never expires.  So we extract as a string first
  // and convert to a date if the string is non-empty. Otherwise, we set expires to null.
  SimpleAttributeSetter_(root, this, 'expires', 'eveapi/result/key', 'expires');
  this.expires = this.expires.length == 0 ? null : EveDateParser_(this.expires);
  var chars = [];
  var processor = function(el) {
    chars.push(new APICharacter(el));
  };
  ProcessChildren_(root, 'eveapi/result/key/rowset', processor);
  this.characters = chars;
}

// ------------------------------------------------------------------------------------------
// AccountBalance
// ------------------------------------------------------------------------------------------
function AccountBalance(root) {
  //int accountID
  //int accountKey
  //double balance
  SimpleAttributeSetter_(root, this, 'accountID', 'row', 'accountID', parseInt);
  SimpleAttributeSetter_(root, this, 'accountKey', 'row', 'accountKey', parseInt);
  SimpleAttributeSetter_(root, this, 'balance', 'row', 'balance', parseFloat);
}

// ------------------------------------------------------------------------------------------
// Asset
// ------------------------------------------------------------------------------------------
function Asset(root) {
  //long itemID
  //long locationID
  //int typeID
  //int quantity
  //int flag
  //boolean singleton
  //int rawQuantity
  //assets = []
  // Set all attributes of the current row.
  AllAttributeSetter_(root, this, 'row', parseInt);
  // Fix singleton
  this.singleton = this.singleton === 1;
  var ats = [];
  var processor = function(el) {
    ats.push(new Asset(el));
  };
  ProcessChildren_(root, 'row/rowset', processor);
  this.assets = ats;
}

// ------------------------------------------------------------------------------------------
// Blueprint
// ------------------------------------------------------------------------------------------
function Blueprint(root) {
  // long itemID
  // long locationID
  // int typeID
  // string typeName
  // int flagID;
  // int quantity
  // int timeEfficiency
  // int materialEfficiency
  // int runs
  AllAttributeSetter_(root, this, 'row', parseInt);
  // Reset typeName as string
  SimpleAttributeSetter_(root, this, 'typeName', 'row', 'typeName');
}

// ------------------------------------------------------------------------------------------
// CalendarEventAttendee
// ------------------------------------------------------------------------------------------
function CalendarEventAttendee(root) {
  //long eventID
  //long characterID
  //string characterName
  //string response
  AllAttributeSetter_(root, this, 'row');
  if (this.eventID !== undefined) this.eventID = parseInt(this.eventID);
  if (this.characterID !== undefined) this.characterID = parseInt(this.characterID);
}

// ------------------------------------------------------------------------------------------
// CharacterSheet
// ------------------------------------------------------------------------------------------
function JumpClone(root) {
  // int jumpCloneID
  // int typeID
  // long lcoationID
  // string cloneName
  AllAttributeSetter_(root, this, 'row');
  if (this.jumpCloneID !== undefined) this.jumpConeID = parseInt(this.jumpCloneID);
  if (this.typeID !== undefined) this.typeID = parseInt(this.typeID);
  if (this.locationID !== undefined) this.locationID = parseInt(this.locationID);
}

function JumpCloneImplant(root) {
  // int jumpCloneID
  // int typeID
  // string typeName
  AllAttributeSetter_(root, this, 'row');
  if (this.jumpCloneID !== undefined) this.jumpConeID = parseInt(this.jumpCloneID);
  if (this.typeID !== undefined) this.typeID = parseInt(this.typeID);
}

function Implant(root) {
  // int typeID
  // string typeName
  AllAttributeSetter_(root, this, 'row');
  if (this.typeID !== undefined) this.typeID = parseInt(this.typeID);
}

function Skill(root) {
  // int typeID
  // int skillpoints
  // int level
  // boolean published
  AllAttributeSetter_(root, this, 'row', parseInt);
  this.published = this.published === 1;
}

function CorporationRole(root) {
  // int roleID
  // string roleNsme
  AllAttributeSetter_(root, this, 'row');
  if (this.roleID !== undefined) this.roleID = parseInt(this.roleID);
}

function CorporationTitle(root) {
  // int titleID
  // string titleNsme
  AllAttributeSetter_(root, this, 'row');
  if (this.titleID !== undefined) this.titleID = parseInt(this.titleID);
}

function CharacterSheet(root) {
  // long   homeStationID
  // String allianceName
  // long   allianceID
  // String factionName
  // long   factionID
  // int    cloneTypeID
  // String cloneName
  // int    cloneSkillPoints
  // int    freeSkillPoints
  // int    freeRespecs
  // Date   cloneJumpDate
  // Date   lastRespecDate
  // Date   lastTimedRespec
  // Date   remoteStationDate
  // Date   jumpActivation
  // Date   jumpFatigue
  // Date   jumpLastUpdate
  // int    intelligence
  // int    memory
  // int    charisma
  // int    perception
  // int    willpower
  // skills = [] <- CharacterSkill
  // jumpClones = [] <- JumpClone
  // jumpCloneImplants = [] <- JumpCloneImplan
  // implants = [] <- Implant
  // corporationRoles = [] <- CorporationRole
  // corporationRolesAtHQ = [] <- CorporationRole
  // corporationRolesAtBase = [] <- CorporationRole
  // corporationRolesAtOther = [] <- CorporationRole
  // corporationTitles = [] <- CorporationTitle
  SimplePropertySetter_(root, this, 'characterID', 'eveapi/result/characterID', parseInt);
  SimplePropertySetter_(root, this, 'name', 'eveapi/result/name');
  SimplePropertySetter_(root, this, 'homeStationID', 'eveapi/result/homeStationID', parseInt);
  SimplePropertySetter_(root, this, 'DoB', 'dateOfBirth', 'eveapi/result/DoB', 'dateOfBirth', EveDateParser_);
  SimplePropertySetter_(root, this, 'race', 'eveapi/result/race');
  SimplePropertySetter_(root, this, 'bloodLine', 'eveapi/result/bloodLine');
  SimplePropertySetter_(root, this, 'ancestry', 'eveapi/result/ancestry');
  SimplePropertySetter_(root, this, 'gender', 'eveapi/result/gender');
  SimplePropertySetter_(root, this, 'corporationName', 'eveapi/result/corporationName');
  SimplePropertySetter_(root, this, 'corporationID', 'eveapi/result/corporationID', parseInt);
  SimplePropertySetter_(root, this, 'allianceName', 'eveapi/result/allianceName');
  SimplePropertySetter_(root, this, 'allianceID', 'eveapi/result/allianceID', parseInt);
  SimplePropertySetter_(root, this, 'factionName', 'eveapi/result/factionName');
  SimplePropertySetter_(root, this, 'factionID', 'eveapi/result/factionID', parseInt);
  SimplePropertySetter_(root, this, 'cloneTypeID', 'eveapi/result/cloneTypeID', parseInt);
  SimplePropertySetter_(root, this, 'cloneName', 'eveapi/result/cloneName');
  SimplePropertySetter_(root, this, 'cloneSkillPoints', 'eveapi/result/cloneSkillPoints', parseInt);
  SimplePropertySetter_(root, this, 'freeSkillPoints', 'eveapi/result/freeSkillPoints', parseInt);
  SimplePropertySetter_(root, this, 'freeRespecs', 'eveapi/result/freeRespecs', parseInt);
  SimplePropertySetter_(root, this, 'cloneJumpDate', 'eveapi/result/cloneJumpDate', EveDateParser_);
  SimplePropertySetter_(root, this, 'lastRespecDate', 'eveapi/result/lastRespecDate', EveDateParser_);
  SimplePropertySetter_(root, this, 'lastTimedRespec', 'eveapi/result/lastTimedRespec', EveDateParser_);
  SimplePropertySetter_(root, this, 'remoteStationDate', 'eveapi/result/remoteStationDate', EveDateParser_);
  SimplePropertySetter_(root, this, 'jumpActivation', 'eveapi/result/jumpActivation', EveDateParser_);
  SimplePropertySetter_(root, this, 'jumpFatigue', 'eveapi/result/jumpFatigue', EveDateParser_);
  SimplePropertySetter_(root, this, 'jumpLastUpdate', 'eveapi/result/jumpLastUpdate', EveDateParser_);
  SimplePropertySetter_(root, this, 'balance', 'eveapi/result/balance', parseFloat);
  SimplePropertySetter_(root, this, 'intelligence', 'eveapi/result/attributes/intelligence', parseInt);
  SimplePropertySetter_(root, this, 'memory', 'eveapi/result/attributes/memory', parseInt);
  SimplePropertySetter_(root, this, 'charisma', 'eveapi/result/attributes/charisma', parseInt);
  SimplePropertySetter_(root, this, 'perception', 'eveapi/result/attributes/perception', parseInt);
  SimplePropertySetter_(root, this, 'willpower', 'eveapi/result/attributes/willpower', parseInt);
  this.skills = [];
  this.jumpClones = [];
  this.jumpCloneImplants = [];
  this.implants = [];
  this.corporationRoles = [];
  this.corporationRolesAtHQ = [];
  this.corporationRolesAtBase = [];
  this.corporationRolesAtOther = [];
  this.corporationTitles = [];
  var cols = [
              { name: 'jumpClones', ctor: JumpClone, tgt: this.jumpClones },
              { name: 'skills', ctor: Skill, tgt: this.skills },
              { name: 'jumpClones', ctor: JumpClone, tgt: this.jumpClones },
              { name: 'jumpCloneImplants', ctor: JumpCloneImplant, tgt: this.jumpCloneImplants },
              { name: 'implants', ctor: Implant, tgt: this.implants },
              { name: 'corporationRoles', ctor: CorporationRole, tgt: this.corporationRoles },
              { name: 'corporationRolesAtHQ', ctor: CorporationRole, tgt: this.corporationRolesAtHQ },
              { name: 'corporationRolesAtBase', ctor: CorporationRole, tgt: this.corporationRolesAtBase },
              { name: 'corporationRolesAtOther', ctor: CorporationRole, tgt: this.corporationRolesAtOther },
              { name: 'corporationTitles', ctor: CorporationTitle, tgt: this.corporationTitles }
              ];
  GenericListBuilder_(root, cols, 'eveapi/result/rowset');
}

// ------------------------------------------------------------------------------------------
// ContactList
// ------------------------------------------------------------------------------------------
function Contact(root) {
  // long contactID
  // string contactName
  // boolean inWatchList
  // double standing
  // Set all attributes of the current row.
  AllAttributeSetter_(root, this, 'row');
  if (this.contactID !== undefined) this.contactID = parseInt(this.contactID);
  if (this.inWatchList !== undefined) this.inWatchList = this.inWatchList === 'True';
  if (this.standing !== undefined) this.standing = parseFloat(this.standing);
}

function ContactList(root) {
  // contactList = []
  // corporateContactList = []
  // allianceContactList = []
  this.contactList = [];
  this.corporateContactList = [];
  this.allianceContactList = [];
  var cols = [
              { name: 'contactList', ctor: Contact, tgt: this.contactList },
              { name: 'corporateContactList', ctor: Contact, tgt: this.corporateContactList },
              { name: 'allianceContactList', ctor: Contact, tgt: this.allianceContactList }
              ];
  GenericListBuilder_(root, cols, 'eveapi/result/rowset');
}

// ------------------------------------------------------------------------------------------
// ContactNotifications
// ------------------------------------------------------------------------------------------
function ContactNotification(root) {
  // long notificationID
  // long senderID
  // string senderName
  // Date sentDate
  // string messageData
  AllAttributeSetter_(root, this, 'row');
  if (this.notificationID !== undefined) this.notificationID = parseInt(this.notificationID);
  if (this.senderID !== undefined) this.senderID = parseInt(this.senderID);
  if (this.sentDate !== undefined) this.sentDate = EveDateParser_(this.sentDate);
}

// ------------------------------------------------------------------------------------------
// Contracts
// ------------------------------------------------------------------------------------------
function Contract(root) {
  // long    contractID
  // long    issuerID
  // long    issuerCorpID
  // long    assigneeID
  // long    acceptorID
  // int     startStationID
  // int     endStationID
  // String  type
  // String  status
  // String  title
  // boolean forCorp
  // String  availability
  // Date    dateIssued
  // Date    dateExpired
  // Date    dateAccepted
  // int     numDays
  // Date    dateCompleted
  // double  price
  // double  reward
  // double  collateral
  // double  buyout
  // long    volume
  AllAttributeSetter_(root, this, 'row', parseInt);
  // Fix non-int fields
  if (this.forCorp !== undefined) this.forCorp = this.forCorp === 1;
  SimpleAttributeSetter_(root, this, 'type', 'row', 'type');
  SimpleAttributeSetter_(root, this, 'status', 'row', 'status');
  SimpleAttributeSetter_(root, this, 'title', 'row', 'title');
  SimpleAttributeSetter_(root, this, 'availability', 'row', 'availability');
  SimpleAttributeSetter_(root, this, 'dateIssued', 'row', 'dateIssued', EveDateParser_);
  SimpleAttributeSetter_(root, this, 'dateExpired', 'row', 'dateExpired', EveDateParser_);
  SimpleAttributeSetter_(root, this, 'dateAccepted', 'row', 'dateAccepted', EveDateParser_);
  SimpleAttributeSetter_(root, this, 'dateCompleted', 'row', 'dateCompleted', EveDateParser_);
  SimpleAttributeSetter_(root, this, 'price', 'row', 'price', parseFloat);
  SimpleAttributeSetter_(root, this, 'reward', 'row', 'reward', parseFloat);
  SimpleAttributeSetter_(root, this, 'collateral', 'row', 'collateral', parseFloat);
  SimpleAttributeSetter_(root, this, 'buyout', 'row', 'buyout', parseFloat);
}

function ContractBid(root) {
  // long   bidID
  // long   contractID
  // long   bidderID
  // Date   dateBid
  // double amount
  AllAttributeSetter_(root, this, 'row', parseInt);
  // Fix non-int fields
  SimpleAttributeSetter_(root, this, 'dateBid', 'row', 'dateBid', EveDateParser_);
  SimpleAttributeSetter_(root, this, 'amount', 'row', 'amount', parseFloat);
}

function ContractItem(root) {
  // long    recordID
  // int     typeID
  // long    quantity
  // int     rawQuantity
  // boolean singleton
  // boolean included
  AllAttributeSetter_(root, this, 'row', parseInt);
  // Fix non-int fields
  if (this.singleton !== undefined) this.singleton = this.singleton === 1;
  if (this.included !== undefined) this.included = this.included === 1;
}

// ------------------------------------------------------------------------------------------
// FacWarStats
// ------------------------------------------------------------------------------------------
function FacWarStats(root) {
  // int factionID
  // String factionName
  // Date enlisted
  // int currentRank
  // int highestRank
  // int killsYesterday
  // int killsLastWeek
  // int killsTotal
  // int victoryPointsYesterday
  // int victoryPointsLastWeek
  // int victoryPointsTotal
  // int pilots
  SimplePropertySetter_(root, this, 'factionID', 'eveapi/result/factionID', parseInt);
  SimplePropertySetter_(root, this, 'factionName', 'eveapi/result/factionName');
  SimplePropertySetter_(root, this, 'enlisted', 'eveapi/result/enlisted', EveDateParser_);
  SimplePropertySetter_(root, this, 'currentRank', 'eveapi/result/currentRank', parseInt);
  SimplePropertySetter_(root, this, 'highestRank', 'eveapi/result/highestRank', parseInt);
  SimplePropertySetter_(root, this, 'killsYesterday', 'eveapi/result/killsYesterday', parseInt);
  SimplePropertySetter_(root, this, 'killsLastWeek', 'eveapi/result/killsLastWeek', parseInt);
  SimplePropertySetter_(root, this, 'killsTotal', 'eveapi/result/killsTotal', parseInt);
  SimplePropertySetter_(root, this, 'victoryPointsYesterday', 'eveapi/result/victoryPointsYesterday', parseInt);
  SimplePropertySetter_(root, this, 'victoryPointsLastWeek', 'eveapi/result/victoryPointsLastWeek', parseInt);
  SimplePropertySetter_(root, this, 'victoryPointsTotal', 'eveapi/result/victoryPointsTotal', parseInt);
  SimplePropertySetter_(root, this, 'pilots', 'eveapi/result/pilots', parseInt);
}

// ------------------------------------------------------------------------------------------
// IndustryJob
// ------------------------------------------------------------------------------------------
function IndustryJob(root) {
  // long   jobID
  // long   installerID
  // String installerName
  // long   facilityID
  // long   solarSystemID
  // String solarSystemName
  // long   stationID
  // long   activityID
  // long   blueprintID
  // long   blueprintTypeID
  // String blueprintTypeName
  // long   blueprintLocationID
  // long   outputLocationID
  // int    runs
  // double cost
  // long   teamID
  // int    licensedRuns
  // double probability
  // long   productTypeID
  // String productTypeName
  // int    status
  // long   timeInSeconds
  // Date   startDate
  // Date   endDate
  // Date   pauseDate
  // Date   completedDate
  // long   completedCharacterID
  // int    successfulRuns
  AllAttributeSetter_(root, this, 'row', parseInt);
  // Fix non-int fields
  SimpleAttributeSetter_(root, this, 'installerName', 'row', 'installerName');
  SimpleAttributeSetter_(root, this, 'solarSystemName', 'row', 'solarSystemName');
  SimpleAttributeSetter_(root, this, 'blueprintTypeName', 'row', 'blueprintTypeName');
  SimpleAttributeSetter_(root, this, 'cost', 'row', 'cost', parseFloat);
  SimpleAttributeSetter_(root, this, 'probability', 'row', 'probability', parseFloat);
  SimpleAttributeSetter_(root, this, 'productTypeName', 'row', 'productTypeName');
  SimpleAttributeSetter_(root, this, 'startDate', 'row', 'startDate', EveDateParser_);
  SimpleAttributeSetter_(root, this, 'endDate', 'row', 'endDate', EveDateParser_);
  SimpleAttributeSetter_(root, this, 'pauseDate', 'row', 'pauseDate', EveDateParser_);
  SimpleAttributeSetter_(root, this, 'completedDate', 'row', 'completedDate', EveDateParser_);
}

// ------------------------------------------------------------------------------------------
// KillMail
// ------------------------------------------------------------------------------------------
function KillVictim(root) {
  // long characterID
  // string characterName
  // long corporationID
  // string corporationName
  // long allianceID
  // string allianceName
  // long factionID
  // string factionName
  // int damageTaken
  // int shipTypeID
  AllAttributeSetter_(root, this, 'victim', parseInt);
  // Fix non-int fields
  SimpleAttributeSetter_(root, this, 'characterName', 'victim', 'characterName');
  SimpleAttributeSetter_(root, this, 'corporationName', 'victim', 'corporationName');
  SimpleAttributeSetter_(root, this, 'allianceName', 'victim', 'allianceName');
  SimpleAttributeSetter_(root, this, 'factionName', 'victim', 'factionName');
}

function KillAttacker(root) {
  // long characterID
  // string characterName
  // long corporationID
  // string corporationName
  // long allianceID
  // string allianceName
  // long factionID
  // string factionName
  // double securityStatus
  // int damageDone
  // boolean finalBlow
  // int weaponTypeID
  // int shipTypeID
  AllAttributeSetter_(root, this, 'row', parseInt);
  // Fix non-int fields
  SimpleAttributeSetter_(root, this, 'characterName', 'row', 'characterName');
  SimpleAttributeSetter_(root, this, 'corporationName', 'row', 'corporationName');
  SimpleAttributeSetter_(root, this, 'allianceName', 'row', 'allianceName');
  SimpleAttributeSetter_(root, this, 'factionName', 'row', 'factionName');
  SimpleAttributeSetter_(root, this, 'securityStatus', 'row', 'securityStatus');
  if (this.finalBlow !== undefined) this.finalBlow = this.finalBlow === 1;
}

function KillItem(root) {
  // int typeID
  // int flag
  // int qtyDropped
  // int qtyDestroyed
  // boolean singleton
  AllAttributeSetter_(root, this, 'row', parseInt);
  // Fix singleton
  if (this.singleton !== undefined) this.singleton = this.singleton === 1;
  var its = [];
  var processor = function(el) {
    its.push(new KillItem(el));
  };
  ProcessChildren_(root, 'row/rowset', processor);
  this.items = its;
}

function KillMail(root) {
  // long killID
  // long solarSystemID
  // Date killTime
  // int moonID
  AllAttributeSetter_(root, this, 'row', parseInt);
  // Fix non-int fields
  SimpleAttributeSetter_(root, this, 'killTime', 'row', 'killTime', EveDateParser_);
  // victim
  this.victim = new KillVictim(root.getChild('victim'));
  // attackers and items
  this.attackers = [];
  this.items = [];
  var cols = [
              { name: 'attackers', ctor: KillAttacker, tgt: this.attackers },
              { name: 'items', ctor: KillItem, tgt: this.items }
              ];
  GenericListBuilder_(root, cols, 'row/rowset');
}

// ------------------------------------------------------------------------------------------
// Location
// ------------------------------------------------------------------------------------------
function Location(root) {
  // long itemID
  // string itemName
  // long x
  // long y
  // long z
  AllAttributeSetter_(root, this, 'row', parseInt);
  // Fix non-int fields
  SimpleAttributeSetter_(root, this, 'itemName', 'row', 'itemName');
}

// ------------------------------------------------------------------------------------------
// MailBody
// ------------------------------------------------------------------------------------------
function MailBody(root) {
  // long messageID
  // string body
  SimpleAttributeSetter_(root, this, 'messageID', 'row', 'messageID', parseInt);
  // Extract body
  this.body = root.getContent(0).getText();
}

// ------------------------------------------------------------------------------------------
// MailMessage
// ------------------------------------------------------------------------------------------
function MailMessage(root) {
  // long messageID
  // long senderID
  // string senderName
  // Date sentDate
  // string title
  // long toCorpOrAllianceID
  // long[] toCharacterIDs
  // long toListID
  AllAttributeSetter_(root, this, 'row', parseInt);
  // Fix non-int fields
  SimpleAttributeSetter_(root, this, 'senderName', 'row', 'senderName');
  SimpleAttributeSetter_(root, this, 'sentDate', 'row', 'sentDate', EveDateParser_);
  SimpleAttributeSetter_(root, this, 'title', 'row', 'title');
  SimpleAttributeSetter_(root, this, 'toCharacterIDs', 'row', 'toCharacterIDs');
  var tosplit = this.toCharacterIDs.split(',');
  this.toCharacterIDs = [];
  for (var i = 0; i < tosplit.length; i++) {
    this.toCharacterIDs.push(parseInt(tosplit[i]));
  }
}

// ------------------------------------------------------------------------------------------
// MailingList
// ------------------------------------------------------------------------------------------
function MailingList(root) {
  // long listID
  // string displayName
  SimpleAttributeSetter_(root, this, 'listID', 'row', 'listID', parseInt);
  SimpleAttributeSetter_(root, this, 'displayName', 'row', 'displayName');
}

// ------------------------------------------------------------------------------------------
// MarketOrder
// ------------------------------------------------------------------------------------------
function MarketOrder(root) {
  // long orderID
  // long charID
  // long stationID
  // int volEntered
  // int volRemaining
  // int minVolume
  // int orderState
  // int typeID
  // int range
  // int accountKey
  // int duration
  // double escrow
  // double price
  // boolean bid
  // Date issued
  AllAttributeSetter_(root, this, 'row', parseInt);
  // Fix non-int fields
  if (this.bid !== undefined) this.bid = this.bid === 1;
  SimpleAttributeSetter_(root, this, 'escrow', 'row', 'escrow', parseFloat);
  SimpleAttributeSetter_(root, this, 'price', 'row', 'price', parseFloat);
  SimpleAttributeSetter_(root, this, 'issued', 'row', 'issued', EveDateParser_);
}

// ------------------------------------------------------------------------------------------
// MedalList
// ------------------------------------------------------------------------------------------
function Medal(root) {
  // long medalID
  // (member only) long characterID
  // (char only) string reason
  // (char only) string status
  // (char only) long issuerID
  // (char only) Date issued
  // (optional) corporationID
  // (optional) title
  // (optional) description
  // (corp only) creatorID
  // (corp only) created
  SimpleAttributeSetter_(root, this, 'medalID', 'row', 'medalID', parseInt);
  SimpleAttributeSetter_(root, this, 'characterID', 'row', 'characterID', parseInt);
  SimpleAttributeSetter_(root, this, 'reason', 'row', 'reason');
  SimpleAttributeSetter_(root, this, 'status', 'row', 'status');
  SimpleAttributeSetter_(root, this, 'issuerID', 'row', 'issuerID', parseInt);
  SimpleAttributeSetter_(root, this, 'issued', 'row', 'issued', EveDateParser_);
  SimpleAttributeSetter_(root, this, 'corporationID', 'row', 'corporationID', parseInt);
  SimpleAttributeSetter_(root, this, 'title', 'row', 'title');
  SimpleAttributeSetter_(root, this, 'description', 'row', 'description');
  SimpleAttributeSetter_(root, this, 'creatorID', 'row', 'creatorID', parseInt);
  SimpleAttributeSetter_(root, this, 'created', 'row', 'created', EveDateParser_);
}

function MedalList(root) {
  // (char only) currentCorporation = []
  // (char only) otherCorporations = []
  // (corp only) medals = []
  // (member only) issuedMedals = []
  this.currentCorporation = [];
  this.otherCorporations = [];
  this.medals = [];
  this.issuedMedals = [];
  var cols = [
              { name: 'currentCorporation', ctor: Medal, tgt: this.currentCorporation },
              { name: 'otherCorporations', ctor: Medal, tgt: this.otherCorporations },
              { name: 'medals', ctor: Medal, tgt: this.medals },
              { name: 'issuedMedals', ctor: Medal, tgt: this.issuedMedals }
              ];
  GenericListBuilder_(root, cols, 'eveapi/result/rowset');
}

// ------------------------------------------------------------------------------------------
// NotificationText
// ------------------------------------------------------------------------------------------
function NotificationText(root) {
  // long notificationID
  // string text
  SimpleAttributeSetter_(root, this, 'notificationID', 'row', 'notificationID', parseInt);
  // Extract body
  this.text = root.getContent(0).getText();
}

// ------------------------------------------------------------------------------------------
// Notification
// ------------------------------------------------------------------------------------------
function Notification(root) {
  // long notificationID
  // int typeID
  // long senderID
  // string senderName
  // Date sentDate
  // boolean read
  AllAttributeSetter_(root, this, 'row', parseInt);
  // Fix non-int fields
  if (this.read !== undefined) this.read = this.read === 1;
  SimpleAttributeSetter_(root, this, 'senderName', 'row', 'senderName');
  SimpleAttributeSetter_(root, this, 'sentDate', 'row', 'sentDate', EveDateParser_);
}

// ------------------------------------------------------------------------------------------
// Planetary
// ------------------------------------------------------------------------------------------
function PlanetaryColony(root) {
  // long solarSystemID
  // string solarSystemName
  // long planetID
  // string planetName
  // int planetTypeID
  // string planetTypeName
  // long ownerID
  // string ownerName
  // Date lastUpdate
  // int upgradeLevel
  // int numberOfPins
  AllAttributeSetter_(root, this, 'row', parseInt);
  // Fix non-int fields
  SimpleAttributeSetter_(root, this, 'solarSystemName', 'row', 'solarSystemName');
  SimpleAttributeSetter_(root, this, 'planetName', 'row', 'planetName');
  SimpleAttributeSetter_(root, this, 'planetTypeName', 'row', 'planetTypeName');
  SimpleAttributeSetter_(root, this, 'ownerName', 'row', 'ownerName');
  SimpleAttributeSetter_(root, this, 'lastUpdate', 'row', 'lastUpdate', EveDateParser_);
}

function PlanetaryPin(root) {
  // long pinID
  // int typeID
  // string typeName
  // int schematicID
  // Date lastLaunchTime
  // int cycleTime
  // int quantityPerCycle
  // Date installTime
  // Date expiryTime
  // int contentTypeID
  // string contentTypeName
  // int contentQuantity
  // double longitude
  // double latitude
  AllAttributeSetter_(root, this, 'row', parseInt);
  // Fix non-int fields
  SimpleAttributeSetter_(root, this, 'typeName', 'row', 'typeName');
  SimpleAttributeSetter_(root, this, 'lastLaunchTime', 'row', 'lastLaunchTime', EveDateParser_);
  SimpleAttributeSetter_(root, this, 'installTime', 'row', 'installTime', EveDateParser_);
  SimpleAttributeSetter_(root, this, 'expiryTime', 'row', 'expiryTime', EveDateParser_);
  SimpleAttributeSetter_(root, this, 'contentTypeName', 'row', 'contentTypeName');
  SimpleAttributeSetter_(root, this, 'longitude', 'row', 'longitude', parseFloat);
  SimpleAttributeSetter_(root, this, 'latitude', 'row', 'latitude', parseFloat);
}

function PlanetaryRoute(root) {
  // long routeID
  // long sourcePinID
  // long destinationPinID
  // int contentTypeID
  // string contentTypeName
  // int quantity
  // long waypoint1
  // long waypoint2
  // long waypoint3
  // long waypoint4
  // long waypoint5
  AllAttributeSetter_(root, this, 'row', parseInt);
  // Fix non-int fields
  SimpleAttributeSetter_(root, this, 'contentTypeName', 'row', 'contentTypeName');
}

function PlanetaryLink(root) {
  // long sourcePinID
  // long destinationPinID
  // int linkLevel
  AllAttributeSetter_(root, this, 'row', parseInt);
}

// ------------------------------------------------------------------------------------------
// Research
// ------------------------------------------------------------------------------------------
function Research(root) {
  // long agentID
  // int skillTypeID
  // Date researchStartDate
  // double pointsPerDay
  // double remainderPoints
  SimpleAttributeSetter_(root, this, 'agentID', 'row', 'agentID', parseInt);
  SimpleAttributeSetter_(root, this, 'skillTypeID', 'row', 'skillTypeID', parseInt);
  SimpleAttributeSetter_(root, this, 'researchStartDate', 'row', 'researchStartDate', EveDateParser_);
  SimpleAttributeSetter_(root, this, 'pointsPerDay', 'row', 'pointsPerDay', parseFloat);
  SimpleAttributeSetter_(root, this, 'remainderPoints', 'row', 'remainderPoints', parseFloat);
}

// ------------------------------------------------------------------------------------------
// SkillInTraining
// ------------------------------------------------------------------------------------------
function SkillInTraining(root) {
  // Date currentTQTime
  // Date trainingEndTime
  // Date trainingStartTime
  // int trainingTypeID
  // int trainingStartSP
  // int trainingDestinationSP
  // int trainingToLevel
  // boolean skillInTraining
  SimplePropertySetter_(root, this, 'currentTQTime', 'eveapi/result/currentTQTime', EveDateParser_);
  SimplePropertySetter_(root, this, 'trainingEndTime', 'eveapi/result/trainingEndTime', EveDateParser_);
  SimplePropertySetter_(root, this, 'trainingStartTime', 'eveapi/result/trainingStartTime', EveDateParser_);
  SimplePropertySetter_(root, this, 'trainingTypeID', 'eveapi/result/trainingTypeID', parseInt);
  SimplePropertySetter_(root, this, 'trainingStartSP', 'eveapi/result/trainingStartSP', parseInt);
  SimplePropertySetter_(root, this, 'trainingDestinationSP', 'eveapi/result/trainingDestinationSP', parseInt);
  SimplePropertySetter_(root, this, 'trainingToLevel', 'eveapi/result/trainingToLevel', parseInt);
  SimplePropertySetter_(root, this, 'skillInTraining', 'eveapi/result/skillInTraining', parseInt);
  if (this.skillInTraining !== undefined) this.skillInTraining = this.skillInTraining === 1;
}

// ------------------------------------------------------------------------------------------
// SkillInQueue
// ------------------------------------------------------------------------------------------
function SkillInQueue(root) {
  // int queuePosition
  // int typeID
  // int level
  // int startSP
  // int endSP
  // Date startTime
  // Date endTime
  AllAttributeSetter_(root, this, 'row', parseInt);
  // Fix non-int fields
  SimpleAttributeSetter_(root, this, 'startTime', 'row', 'startTime', EveDateParser_);
  SimpleAttributeSetter_(root, this, 'endTime', 'row', 'endTime', EveDateParser_);
}

// ------------------------------------------------------------------------------------------
// Standings
// ------------------------------------------------------------------------------------------
function StandingBuilder_(is_char) {
  var path = is_char ? 'eveapi/result/characterNPCStandings/rowset' : 'eveapi/result/corporationNPCStandings/rowset';
  return function(root) {
    return new StandingList(path, root);
  };
}

function StandingList(path, root) {
  // agents = []
  // NPCCorporations = []
  // factions = []
  this.agents = [];
  this.NPCCorporations = [];
  this.factions = [];
  var cols = [
              { name: 'agents', ctor: Standing, tgt: this.agents },
              { name: 'NPCCorporations', ctor: Standing, tgt: this.NPCCorporations },
              { name: 'factions', ctor: Standing, tgt: this.factions}
              ];
  GenericListBuilder_(root, cols, path);
}

function Standing(root) {
  // int fromID
  // string fromName
  // double standing
  SimpleAttributeSetter_(root, this, 'fromID', 'row', 'fromID', parseInt);
  SimpleAttributeSetter_(root, this, 'fromName', 'row', 'fromName');
  SimpleAttributeSetter_(root, this, 'standing', 'row', 'standing', parseFloat);
}

// ------------------------------------------------------------------------------------------
// UpcomingCalendarEvent
// ------------------------------------------------------------------------------------------
function UpcomingCalendarEvent(root) {
  // long eventID
  // int ownerID
  // string ownerName
  // Date eventDate
  // string eventTitle
  // int duration
  // int importance
  // string response
  // string eventText
  AllAttributeSetter_(root, this, 'row');
  if (this.eventID !== undefined) this.eventID = parseInt(this.eventID);
  if (this.ownerID !== undefined) this.ownerID = parseInt(this.ownerID);
  if (this.eventDate !== undefined) this.eventDate = EveDateParser_(this.eventDate);
  if (this.duration !== undefined) this.duration = parseInt(this.duration);
  if (this.importance !== undefined) this.importance = parseInt(this.importance);
}

// ------------------------------------------------------------------------------------------
// Wallet
// ------------------------------------------------------------------------------------------
function WalletJournal(root) {
  // Date date
  // long refID
  // int refTypeID
  // string ownerName1
  // long ownerID1
  // string ownerName2
  // long ownerID2
  // string argName1
  // int argID1
  // double amount
  // double balance
  // string reason
  // long taxReceiverID
  // double taxAmount
  AllAttributeSetter_(root, this, 'row', parseInt);
  // Fix fields
  SimpleAttributeSetter_(root, this, 'date', 'row', 'date', EveDateParser_);
  SimpleAttributeSetter_(root, this, 'ownerName1', 'row', 'ownerName1');
  SimpleAttributeSetter_(root, this, 'ownerName2', 'row', 'ownerName2');
  SimpleAttributeSetter_(root, this, 'argName1', 'row', 'argName1');
  SimpleAttributeSetter_(root, this, 'amount', 'row', 'amount', parseFloat);
  SimpleAttributeSetter_(root, this, 'balance', 'row', 'balance', parseFloat);
  SimpleAttributeSetter_(root, this, 'reason', 'row', 'reason');
  SimpleAttributeSetter_(root, this, 'taxAmount', 'row', 'taxAmount', parseFloat);
}

function WalletTransaction(root) {
  // Date transactionDateTime
  // long transactionID
  // int quantity
  // string typeName
  // int typeID
  // double price
  // long clientID
  // string clientName
  // long stationID
  // string stationName
  // string transactionType
  // string transactionFor
  // long journalTransactionID
  AllAttributeSetter_(root, this, 'row', parseInt);
  // Fix fields
  SimpleAttributeSetter_(root, this, 'transactionDateTime', 'row', 'transactionDateTime', EveDateParser_);
  SimpleAttributeSetter_(root, this, 'typeName', 'row', 'typeName');
  SimpleAttributeSetter_(root, this, 'price', 'row', 'price', parseFloat);
  SimpleAttributeSetter_(root, this, 'clientName', 'row', 'clientName');
  SimpleAttributeSetter_(root, this, 'stationName', 'row', 'stationName');
  SimpleAttributeSetter_(root, this, 'transactionType', 'row', 'transactionType');
  SimpleAttributeSetter_(root, this, 'transactionFor', 'row', 'transactionFor');
}

// ------------------------------------------------------------------------------------------
// ContainerLog
// ------------------------------------------------------------------------------------------
function ContainerLog(root) {
  // Date logTime
  // long itemID
  // int itemTypeID
  // long actorID
  // string actorName
  // int flag
  // long locationID
  // string action
  // string passwordType
  // int typeID
  // int quantity
  // string oldConfiguration
  // string newConfiguration
  AllAttributeSetter_(root, this, 'row', parseInt);
  // Fix fields
  SimpleAttributeSetter_(root, this, 'logTime', 'row', 'logTime', EveDateParser_);
  SimpleAttributeSetter_(root, this, 'actorName', 'row', 'actorName');
  SimpleAttributeSetter_(root, this, 'action', 'row', 'action');
  SimpleAttributeSetter_(root, this, 'passwordType', 'row', 'passwordType');
  SimpleAttributeSetter_(root, this, 'oldConfiguration', 'row', 'oldConfiguration');
  SimpleAttributeSetter_(root, this, 'newConfiguration', 'row', 'newConfiguration');
}

// ------------------------------------------------------------------------------------------
// CorporationSheet
// ------------------------------------------------------------------------------------------
function Division(root) {
  // int accountKey
  // string description
  AllAttributeSetter_(root, this, 'row');
  if (this.accountKey !== undefined) this.accountKey = parseInt(this.accountKey);
}

function Logo(root) {
  // int graphicID
  // int shape1
  // int shape2
  // int shape3
  // int color1
  // int color2
  // int color3
  SimplePropertySetter_(root, this, 'graphicID', 'logo/graphicID', parseInt);
  SimplePropertySetter_(root, this, 'shape1', 'logo/shape1', parseInt);
  SimplePropertySetter_(root, this, 'shape2', 'logo/shape2', parseInt);
  SimplePropertySetter_(root, this, 'shape3', 'logo/shape3', parseInt);
  SimplePropertySetter_(root, this, 'color1', 'logo/color1', parseInt);
  SimplePropertySetter_(root, this, 'color2', 'logo/color2', parseInt);
  SimplePropertySetter_(root, this, 'color3', 'logo/color3', parseInt);
}

function CorporationSheet(root) {
  // long corporationID
  // string corporationName
  // string ticker
  // long ceoID
  // string ceoName
  // long stationID
  // string stationName
  // string description
  // string url
  // long allianceID
  // double taxRate
  // int memberCount
  // int memberLimit
  // int shares
  // divisions = [] <- Division
  // walletDivisions = [] <- Division
  // Logo logo
  SimplePropertySetter_(root, this, 'corporationID', 'eveapi/result/corporationID', parseInt);
  SimplePropertySetter_(root, this, 'corporationName', 'eveapi/result/corporationName');
  SimplePropertySetter_(root, this, 'ticker', 'eveapi/result/ticker');
  SimplePropertySetter_(root, this, 'ceoID', 'eveapi/result/ceoID', parseInt);
  SimplePropertySetter_(root, this, 'ceoName', 'eveapi/result/ceoName');
  SimplePropertySetter_(root, this, 'stationID', 'eveapi/result/stationID', parseInt);
  SimplePropertySetter_(root, this, 'stationName', 'eveapi/result/stationName');
  SimplePropertySetter_(root, this, 'description', 'eveapi/result/description');
  SimplePropertySetter_(root, this, 'url', 'eveapi/result/url');
  SimplePropertySetter_(root, this, 'allianceID', 'eveapi/result/allianceID', parseInt);
  SimplePropertySetter_(root, this, 'taxRate', 'eveapi/result/taxRate', parseFloat);
  SimplePropertySetter_(root, this, 'memberCount', 'eveapi/result/memberCount', parseInt);
  SimplePropertySetter_(root, this, 'memberLimit', 'eveapi/result/memberLimit', parseInt);
  SimplePropertySetter_(root, this, 'shares', 'eveapi/result/shares', parseInt);
  this.logo = new Logo(root.getChild('result').getChild('logo'));
  this.divisions = [];
  this.walletDivisions = [];
  var cols = [
              { name: 'divisions', ctor: Division, tgt: this.divisions },
              { name: 'walletDivisions', ctor: Division, tgt: this.walletDivisions }
              ];
  GenericListBuilder_(root, cols, 'eveapi/result/rowset');
}

// ------------------------------------------------------------------------------------------
// MemberSecurity
// ------------------------------------------------------------------------------------------
function MemberSecurity(root) {
  // long characterID
  // string name
  // roles = [] <- CorporationRole
  // grantableRoles = [] <- CorporationRole
  // rolesAtHQ = [] <- CorporationRole
  // grantableRolesAtHQ = [] <- CorporationRole
  // rolesAtBase = [] <- CorporationRole
  // grantableRolesAtBase = [] <- CorporationRole
  // rolesAtOther = [] <- CorporationRole
  // grantableRolesAtOther = [] <- CorporationRole
  // titles = [] <- CorporationTitle
  AllAttributeSetter_(root, this, 'row');
  if (this.characterID !== undefined) this.characterID = parseInt(this.characterID);
  this.roles = [];
  this.grantableRoles = [];
  this.rolesAtHQ = [];
  this.grantableRolesAtHQ = [];
  this.rolesAtBase = [];
  this.grantableRolesAtBase = [];
  this.rolesAtOther = [];
  this.grantableRolesAtOther = [];
  this.titles = [];
  var cols = [
              { name: 'roles', ctor: CorporationRole, tgt: this.roles },
              { name: 'grantableRoles', ctor: CorporationRole, tgt: this.grantableRoles },
              { name: 'rolesAtHQ', ctor: CorporationRole, tgt: this.rolesAtHQ },
              { name: 'grantableRolesAtHQ', ctor: CorporationRole, tgt: this.grantableRolesAtHQ },
              { name: 'rolesAtBase', ctor: CorporationRole, tgt: this.rolesAtBase },
              { name: 'grantableRolesAtBase', ctor: CorporationRole, tgt: this.grantableRolesAtBase },
              { name: 'rolesAtOther', ctor: CorporationRole, tgt: this.rolesAtOther },
              { name: 'grantableRolesAtOther', ctor: CorporationRole, tgt: this.grantableRolesAtOther },
              { name: 'titles', ctor: CorporationTitle, tgt: this.titles }
              ];
  GenericListBuilder_(root, cols, 'row/rowset');
}

// ------------------------------------------------------------------------------------------
// CustomsOffice
// ------------------------------------------------------------------------------------------
function CustomsOffice(root) {
  // long itemID
  // int solarSystemID
  // string solarSystemName
  // int reinforceHour
  // boolean allowAlliance
  // boolean allowStandings
  // double standingLevel
  // double taxRateAlliance
  // double taxRateCorp
  // double taxRateStandingHigh
  // double taxRateStandingGood
  // double taxRateStandingNeutral
  // double taxRateStandingBad
  // double taxRateStandingHorrible
  AllAttributeSetter_(root, this, 'row', parseFloat);
  // Fix fields
  SimpleAttributeSetter_(root, this, 'itemID', 'row', 'itemID', parseInt);
  SimpleAttributeSetter_(root, this, 'solarSystemID', 'row', 'solarSystemID', parseInt);
  SimpleAttributeSetter_(root, this, 'solarSystemName', 'row', 'solarSystemName');
  SimpleAttributeSetter_(root, this, 'reinforceHour', 'row', 'reinforceHour', parseInt);
  SimpleAttributeSetter_(root, this, 'allowAlliance', 'row', 'allowAlliance', parseInt);
  SimpleAttributeSetter_(root, this, 'allowStandings', 'row', 'allowStandings', parseInt);
  if (this.allowAlliance !== undefined) this.allowAlliance = this.allowAlliance === 1;
  if (this.allowStandings !== undefined) this.allowStandings = this.allowStandings === 1;
}

// ------------------------------------------------------------------------------------------
// Facility
// ------------------------------------------------------------------------------------------
function Facility(root) {
  // long facilityID
  // int typeID
  // string typeName
  // long solarSystemID
  // string solarSystemName
  // long regionID
  // string regionName
  // int starbaseModifier
  // double tax
  AllAttributeSetter_(root, this, 'row', parseInt);
  // Fix fields
  SimpleAttributeSetter_(root, this, 'typeName', 'row', 'typeName');
  SimpleAttributeSetter_(root, this, 'solarSystemName', 'row', 'solarSystemName');
  SimpleAttributeSetter_(root, this, 'regionName', 'row', 'regionName');
  SimpleAttributeSetter_(root, this, 'tax', 'row', 'tax', parseFloat);
}

// ------------------------------------------------------------------------------------------
// MemberSecurityLog
// ------------------------------------------------------------------------------------------
function ChangedRole(root) {
  // int roleID
  // string roleName
  AllAttributeSetter_(root, this, 'row');
  if (this.roleID !== undefined) this.roleID = parseInt(this.roleID);
}

function MemberSecurityLog(root) {
  // Date changeTime
  // long characterID
  // string characterName
  // long issuerID
  // string issuerName
  // string roleLocationType
  // oldRoles = [] <- ChangedRole
  // newRoles = [] <- ChangedRole
  AllAttributeSetter_(root, this, 'row');
  if (this.changeTime !== undefined) this.changeTime = EveDateParser_(this.changeTime);
  if (this.characterID !== undefined) this.characterID = parseInt(this.characterID);
  if (this.issuerID !== undefined) this.issuerID = parseInt(this.issuerID);
  this.oldRoles = [];
  this.newRoles = [];
  var cols = [
              { name: 'oldRoles', ctor: ChangedRole, tgt: this.oldRoles },
              { name: 'newRoles', ctor: ChangedRole, tgt: this.newRoles }
              ];
  GenericListBuilder_(root, cols, 'row/rowset');
}

// ------------------------------------------------------------------------------------------
// MemberTracking
// ------------------------------------------------------------------------------------------
function MemberTracking(root) {
  // long characterID
  // string name
  // Date startDateTime
  // long baseID
  // string base
  // string title
  // Date logonDateTime
  // Date logoffDateTime
  // long locationID
  // string location
  // int shipTypeID
  // string shipType
  // long roles
  // long grantableRoles
  AllAttributeSetter_(root, this, 'row');
  if (this.characterID !== undefined) this.characterID = parseInt(this.characterID);
  if (this.startDateTime !== undefined) this.startDateTime = EveDateParser_(this.startDateTime);
  if (this.baseID !== undefined) this.baseID = parseInt(this.baseID);
  if (this.logonDateTime !== undefined) this.logonDateTime = EveDateParser_(this.logonDateTime);
  if (this.logoffDateTime !== undefined) this.logoffDateTime = EveDateParser_(this.logoffDateTime);
  if (this.locationID !== undefined) this.locationID = parseInt(this.locationID);
  if (this.shipTypeID !== undefined) this.shipTypeID = parseInt(this.shipTypeID);
  if (this.roles !== undefined) this.roles = parseInt(this.roles);
  if (this.grantableRoles !== undefined) this.grantableRoles = parseInt(this.grantableRoles);
}

// ------------------------------------------------------------------------------------------
// Outpost
// ------------------------------------------------------------------------------------------
function Outpost(root) {
  // long stationID
  // long ownerID
  // string stationName
  // long solarSystemID
  // double dockingCostPerShipVolume
  // double officeRentalCost
  // int stationTypeID
  // double reprocessingEfficiency
  // double reprocessingStationTake
  // long standingOwnerID
  AllAttributeSetter_(root, this, 'row', parseInt);
  // Fix non-int attributes
  SimpleAttributeSetter_(root, this, 'stationName', 'row', 'stationName');
  SimpleAttributeSetter_(root, this, 'dockingCostPerShipVolume', 'row', 'dockingCostPerShipVolume', parseFloat);
  SimpleAttributeSetter_(root, this, 'officeRentalCost', 'row', 'officeRentalCost', parseFloat);
  SimpleAttributeSetter_(root, this, 'reprocessingEfficiency', 'row', 'reprocessingEfficiency', parseFloat);
  SimpleAttributeSetter_(root, this, 'reprocessingStationTake', 'row', 'reprocessingStationTake', parseFloat);
}

// ------------------------------------------------------------------------------------------
// OutpostService
// ------------------------------------------------------------------------------------------
function OutpostService(root) {
  // long stationID
  // long ownerID
  // string serviceName
  // double minStanding
  // double surchargePerBadStanding
  // double discountPerGoodStanding
  AllAttributeSetter_(root, this, 'row', parseInt);
  // Fix non-int attributes
  SimpleAttributeSetter_(root, this, 'serviceName', 'row', 'serviceName');
  SimpleAttributeSetter_(root, this, 'minStanding', 'row', 'minStanding', parseFloat);
  SimpleAttributeSetter_(root, this, 'surchargePerBadStanding', 'row', 'surchargePerBadStanding', parseFloat);
  SimpleAttributeSetter_(root, this, 'discountPerGoodStanding', 'row', 'discountPerGoodStanding', parseFloat);
}

// ------------------------------------------------------------------------------------------
// Shareholders
// ------------------------------------------------------------------------------------------
function Shareholder(root) {
  // long shareholderID
  // string shareholderName
  // long shareholderCorporationID (char only)
  // string shareholderCorporationName (char only)
  // int shares
  AllAttributeSetter_(root, this, 'row');
  if (this.shareholderID !== undefined) this.shareholderID = parseInt(this.shareholderID);
  if (this.shareholderCorporationID !== undefined) this.shareholderCorporationID = parseInt(this.shareholderCorporationID);
  if (this.shares !== undefined) this.shares = parseInt(this.shares);
}

function ShareholderList(root) {
  // characters = [] <- Shareholder
  // corporations = [] <- Shareholder
  this.characters = [];
  this.corporations = [];
  var cols = [
              { name: 'characters', ctor: Shareholder, tgt: this.characters },
              { name: 'corporations', ctor: Shareholder, tgt: this.corporations}
              ];
  GenericListBuilder_(root, cols, 'eveapi/result/rowset');
}

// ------------------------------------------------------------------------------------------
// Starbase
// ------------------------------------------------------------------------------------------
function Starbase(root) {
  // long itemID
  // int typeID
  // long locationID
  // long moonID
  // int state
  // Date stateTimestamp
  // Date onlineTimestamp
  // long standingOwnerID
  AllAttributeSetter_(root, this, 'row', parseInt);
  // Fix non-int attributes
  SimpleAttributeSetter_(root, this, 'stateTimestamp', 'row', 'stateTimestamp', EveDateParser_);
  SimpleAttributeSetter_(root, this, 'onlineTimestamp', 'row', 'onlineTimestamp', EveDateParser_);
}

// ------------------------------------------------------------------------------------------
// StarbaseDetail
// ------------------------------------------------------------------------------------------
function GeneralSettings(root) {
  // int usageFlags
  // int deployFlags
  // boolean allowCorporationMembers
  // boolean allowAllianceMembers
  SimplePropertySetter_(root, this, 'usageFlags', 'generalSettings/usageFlags', parseInt);
  SimplePropertySetter_(root, this, 'deployFlags', 'generalSettings/deployFlags', parseInt);
  SimplePropertySetter_(root, this, 'allowCorporationMembers', 'generalSettings/allowCorporationMembers', parseInt);
  SimplePropertySetter_(root, this, 'allowAllianceMembers', 'generalSettings/allowAllianceMembers', parseInt);
  if (this.allowCorporationMembers !== undefined) this.allowCorporationMembers = this.allowCorporationMembers === 1;
  if (this.allowAllianceMembers !== undefined) this.allowAllianceMembers = this.allowAllianceMembers === 1;
}

function CombatSettings(root) {
  // long useStandingsFrom
  // double onStandingDropStanding
  // boolean onStandingDropEnabled
  // double onStatusDropStanding
  // boolean onStatusDropEnabled
  // double onAggressionStanding
  // boolean onAggressionEnabled
  // double onCorporationWarStanding
  // boolean onCorporationWarEnabled
  SimpleAttributeSetter_(root, this, 'useStandingsFrom', 'combatSettings/useStandingsFrom', 'ownerID', parseInt);
  SimpleAttributeSetter_(root, this, 'onStandingDropStanding', 'combatSettings/onStandingDrop', 'standing', parseFloat);
  SimpleAttributeSetter_(root, this, 'onStandingDropEnabled', 'combatSettings/onStandingDrop', 'enabled', parseInt);
  SimpleAttributeSetter_(root, this, 'onStatusDropStanding', 'combatSettings/onStatusDrop', 'standing', parseFloat);
  SimpleAttributeSetter_(root, this, 'onStatusDropEnabled', 'combatSettings/onStatusDrop', 'enabled', parseInt);
  SimpleAttributeSetter_(root, this, 'onAggressionStanding', 'combatSettings/onAggression', 'standing', parseFloat);
  SimpleAttributeSetter_(root, this, 'onAggressionEnabled', 'combatSettings/onAggression', 'enabled', parseInt);
  SimpleAttributeSetter_(root, this, 'onCorporationWarStanding', 'combatSettings/onCorporationWar', 'standing', parseFloat);
  SimpleAttributeSetter_(root, this, 'onCorporationWarEnabled', 'combatSettings/onCorporationWar', 'enabled', parseInt);
  if (this.onStandingDropEnabled !== undefined) this.onStandingDropEnabled = this.onStandingDropEnabled === 1;
  if (this.onStatusDropEnabled !== undefined) this.onStatusDropEnabled = this.onStatusDropEnabled === 1;
  if (this.onAggressionEnabled !== undefined) this.onAggressionEnabled = this.onAggressionEnabled === 1;
  if (this.onCorporationWarEnabled !== undefined) this.onCorporationWarEnabled = this.onCorporationWarEnabled === 1;
}

function Fuel(root) {
  // int typeID
  // int quantity
  AllAttributeSetter_(root, this, 'row', parseInt);
}

function StarbaseDetail(root) {
  // int state
  // Date stateTimestamp
  // Date onlineTimestamp
  // GeneralSettings generalSettings
  // CombatSettings combatSettings
  // fuel = [] <- Fuel
  SimplePropertySetter_(root, this, 'state', 'eveapi/result/state', parseInt);
  SimplePropertySetter_(root, this, 'stateTimestamp', 'eveapi/result/stateTimestamp', EveDateParser_);
  SimplePropertySetter_(root, this, 'onlineTimestamp', 'eveapi/result/onlineTimestamp', EveDateParser_);
  this.generalSettings = new GeneralSettings(root.getChild('result').getChild('generalSettings'));
  this.combatSettings = new CombatSettings(root.getChild('result').getChild('combatSettings'));
  this.fuel = [];
  var cols = [
              { name: 'fuel', ctor: Fuel, tgt: this.fuel}
              ];
  GenericListBuilder_(root, cols, 'eveapi/result/rowset');
}

// ------------------------------------------------------------------------------------------
// Title
// ------------------------------------------------------------------------------------------
function Role(root) {
  // int roleID
  // string roleName
  // string roleDescription
  AllAttributeSetter_(root, this, 'row');
  if (this.roleID !== undefined) this.roleID = parseInt(this.roleID);
}

function Title(root) {
  // int titleID
  // string titleName
  // roles = [] <- Role
  // grantableRoles = [] <- Role
  // rolesAtHQ = [] <- Role
  // grantableRolesAtHQ = [] <- Role
  // rolesAtBase = [] <- Role
  // grantableRolesAtBase = [] <- Role
  // rolesAtOther = [] <- Role
  // grantableRolesAtOther = [] <- Role
  AllAttributeSetter_(root, this, 'row');
  if (this.titleID !== undefined) this.titleID = parseInt(this.titleID);
  this.roles = [];
  this.grantableRoles = [];
  this.rolesAtHQ = [];
  this.grantableRolesAtHQ = [];
  this.rolesAtBase = [];
  this.grantableRolesAtBase = [];
  this.rolesAtOther = [];
  this.grantableRolesAtOther = [];
  var cols = [
              { name: 'roles', ctor: Role, tgt: this.roles },
              { name: 'grantableRoles', ctor: Role, tgt: this.grantableRoles },
              { name: 'rolesAtHQ', ctor: Role, tgt: this.rolesAtHQ },
              { name: 'grantableRolesAtHQ', ctor: Role, tgt: this.grantableRolesAtHQ },
              { name: 'rolesAtBase', ctor: Role, tgt: this.rolesAtBase },
              { name: 'grantableRolesAtBase', ctor: Role, tgt: this.grantableRolesAtBase },
              { name: 'rolesAtOther', ctor: Role, tgt: this.rolesAtOther },
              { name: 'grantableRolesAtOther', ctor: Role, tgt: this.grantableRolesAtOther }
              ];
  GenericListBuilder_(root, cols, 'row/rowset');
}

// ------------------------------------------------------------------------------------------
// Alliance
// ------------------------------------------------------------------------------------------
function MemberCorporation(root) {
  // long corporationID
  // Date startDate
  SimpleAttributeSetter_(root, this, 'corporationID', 'row', 'corporationID', parseInt);
  SimpleAttributeSetter_(root, this, 'startDate', 'row', 'startDate', EveDateParser_);
}

function Alliance(root) {
  // string name
  // string shortName
  // long allianceID
  // long executorCorpID
  // int memberCount
  // Date startDate
  // memberCorporations = [] <- MemberCorporation
  AllAttributeSetter_(root, this, 'row', parseInt);
  SimpleAttributeSetter_(root, this, 'name', 'row', 'name');
  SimpleAttributeSetter_(root, this, 'shortName', 'row', 'shortName');
  SimpleAttributeSetter_(root, this, 'startDate', 'row', 'startDate', EveDateParser_);
  var mc = [];
  var processor = function(el) {
    mc.push(new MemberCorporation(el));
  };
  ProcessChildren_(root, 'row/rowset', processor);
  this.memberCorporations = mc;
}

// ------------------------------------------------------------------------------------------
// CharacterInfo
// ------------------------------------------------------------------------------------------
function EmploymentHistory(root) {
  // long recordID
  // long corporationID
  // string corporationName
  // Date startDate
  AllAttributeSetter_(root, this, 'row', parseInt);
  SimpleAttributeSetter_(root, this, 'corporationName', 'row', 'corporationName');
  SimpleAttributeSetter_(root, this, 'startDate', 'row', 'startDate', EveDateParser_);
}

function CharacterInfo(root) {
  // long characterID
  // string characterName
  // string race
  // string bloodline
  // double accountBalance
  // int skillPoints
  // string shipName
  // int shipTypeID
  // string shipTypeName
  // long corporationID
  // string corporation
  // Date corporationDate
  // string lastKnownLocation
  // double securityStatus
  // employmentHistory = [] <- EmploymentHistory
  SimplePropertySetter_(root, this, 'characterID', 'eveapi/result/characterID', parseInt);
  SimplePropertySetter_(root, this, 'characterName', 'eveapi/result/characterName');
  SimplePropertySetter_(root, this, 'race', 'eveapi/result/race');
  SimplePropertySetter_(root, this, 'bloodline', 'eveapi/result/bloodline');
  SimplePropertySetter_(root, this, 'accountBalance', 'eveapi/result/accountBalance', parseFloat);
  SimplePropertySetter_(root, this, 'skillPoints', 'eveapi/result/skillPoints', parseInt);
  SimplePropertySetter_(root, this, 'shipName', 'eveapi/result/shipName');
  SimplePropertySetter_(root, this, 'shipTypeID', 'eveapi/result/shipTypeID', parseInt);
  SimplePropertySetter_(root, this, 'shipTypeName', 'eveapi/result/shipTypeName');
  SimplePropertySetter_(root, this, 'corporationID', 'eveapi/result/corporationID', parseInt);
  SimplePropertySetter_(root, this, 'corporation', 'eveapi/result/corporation');
  SimplePropertySetter_(root, this, 'corporationDate', 'eveapi/result/corporationDate', EveDateParser_);
  SimplePropertySetter_(root, this, 'lastKnownLocation', 'eveapi/result/lastKnownLocation');
  SimplePropertySetter_(root, this, 'securityStatus', 'eveapi/result/securityStatus', parseFloat);
  var eh = [];
  var processor = function(el) {
    eh.push(new MemberCorporation(el));
  };
  ProcessChildren_(root, 'eveapi/result/rowset', processor);
  this.employmentHistory = eh;
}

// ------------------------------------------------------------------------------------------
// ConquerableStation
// ------------------------------------------------------------------------------------------
function ConquerableStation(root) {
  // int stationID
  // string stationName
  // int stationTypeID
  // int solarSystemID
  // int corporationID
  // string corporationName
  AllAttributeSetter_(root, this, 'row', parseInt);
  SimpleAttributeSetter_(root, this, 'stationName', 'row', 'stationName');
  SimpleAttributeSetter_(root, this, 'corporationName', 'row', 'corporationName');
}

// ------------------------------------------------------------------------------------------
// ErrorCode
// ------------------------------------------------------------------------------------------
function ErrorCode(root) {
  // int errorCode
  // string errorText
  AllAttributeSetter_(root, this, 'row');
  if (this.errorCode !== undefined) this.errorCode = parseInt(this.errorCode);
}

// ------------------------------------------------------------------------------------------
// FacWarGlobalStats
// ------------------------------------------------------------------------------------------
function FactionStat(root) {
  // int factionID
  // string factionName
  // int pilots
  // int systemsControlled
  // int killsYesterday
  // int killsLastWeek
  // int killsTotal
  // int victoryPointsYesterday
  // int victoryPointsLastWeek
  // int victoryPointsTotal
  AllAttributeSetter_(root, this, 'row', parseInt);
  SimpleAttributeSetter_(root, this, 'factionName', 'row', 'factionName');
}

function FactionWar(root) {
  // int factionID
  // string factionName
  // int againstID
  // string againstName
  AllAttributeSetter_(root, this, 'row');
  if (this.factionID !== undefined) this.factionID = parseInt(this.factionID);
  if (this.againstID !== undefined) this.againstID = parseInt(this.againstID);
}

function FacWarGlobalStats(root) {
  // int killsYesterday
  // int killsLastWeek
  // int killsTotal
  // int victoryPointsYesterday
  // int victoryPointsLastWeek
  // int victoryPointsTotal
  // factions = [] <- FactionStat
  // factionWars = [] <- FactionWar
  SimplePropertySetter_(root, this, 'killsYesterday', 'eveapi/result/totals/killsYesterday', parseInt);
  SimplePropertySetter_(root, this, 'killsLastWeek', 'eveapi/result/totals/killsLastWeek', parseInt);
  SimplePropertySetter_(root, this, 'killsTotal', 'eveapi/result/totals/killsTotal', parseInt);
  SimplePropertySetter_(root, this, 'victoryPointsYesterday', 'eveapi/result/totals/victoryPointsYesterday', parseInt);
  SimplePropertySetter_(root, this, 'victoryPointsLastWeek', 'eveapi/result/totals/victoryPointsLastWeek', parseInt);
  SimplePropertySetter_(root, this, 'victoryPointsTotal', 'eveapi/result/totals/victoryPointsTotal', parseInt);
  this.factions = [];
  this.factionWars = [];
  var cols = [
              { name: 'factions', ctor: FactionStat, tgt: this.factions },
              { name: 'factionWars', ctor: FactionWar, tgt: this.factionWars }
              ];
  GenericListBuilder_(root, cols, 'eveapi/result/rowset');
}

// ------------------------------------------------------------------------------------------
// FacWarTopStats
// ------------------------------------------------------------------------------------------
function FacWarKillRecord(root) {
  // long characterID
  // string characterName
  // long corporationID
  // string corporationName
  // long factionID
  // string factionName
  // int kills
  AllAttributeSetter_(root, this, 'row');
  if (this.characterID !== undefined) this.characterID = parseInt(this.characterID);
  if (this.corporationID !== undefined) this.corporationID = parseInt(this.corporationID);
  if (this.factionID !== undefined) this.factionID = parseInt(this.factionID);
  if (this.kills !== undefined) this.kills = parseInt(this.kills);
}

function FacWarVictoryPointRecord(root) {
  // long characterID
  // string characterName
  // long corporationID
  // string corporationName
  // long factionID
  // string factionName
  // int victoryPoints
  AllAttributeSetter_(root, this, 'row');
  if (this.characterID !== undefined) this.characterID = parseInt(this.characterID);
  if (this.corporationID !== undefined) this.corporationID = parseInt(this.corporationID);
  if (this.factionID !== undefined) this.factionID = parseInt(this.factionID);
  if (this.victoryPoints !== undefined) this.victoryPoints = parseInt(this.victoryPoints);
}

function FacWarTopStats(root) {
  // characterKillsYesterday = [] <- FacWarKillRecord
  // characterKillsLastWeek = [] <- FacWarKillRecord
  // characterKillsTotal = [] <- FacWarKillRecord
  // characterVictoryPointsYesterday = [] <- FacWarVictoryPointRecord
  // characterVictoryPointsLastWeek = [] <- FacWarVictoryPointRecord
  // characterVictoryPointsTotal = [] <- FacWarVictoryPointRecord
  // corporationKillsYesterday = [] <- FacWarKillRecord
  // corporationKillsLastWeek = [] <- FacWarKillRecord
  // corporationKillsTotal = [] <- FacWarKillRecord
  // corporationVictoryPointsYesterday = [] <- FacWarVictoryPointRecord
  // corporationVictoryPointsLastWeek = [] <- FacWarVictoryPointRecord
  // corporationVictoryPointsTotal = [] <- FacWarVictoryPointRecord
  // factionKillsYesterday = [] <- FacWarKillRecord
  // factionKillsLastWeek = [] <- FacWarKillRecord
  // factionKillsTotal = [] <- FacWarKillRecord
  // factionVictoryPointsYesterday = [] <- FacWarVictoryPointRecord
  // factionVictoryPointsLastWeek = [] <- FacWarVictoryPointRecord
  // factionVictoryPointsTotal = [] <- FacWarVictoryPointRecord
  this.characterKillsYesterday = [];
  this.characterKillsLastWeek = [];
  this.characterKillsTotal = [];
  this.characterVictoryPointsYesterday = [];
  this.characterVictoryPointsLastWeek = [];
  this.characterVictoryPointsTotal = [];
  this.corporationKillsYesterday = [];
  this.corporationKillsLastWeek = [];
  this.corporationKillsTotal = [];
  this.corporationVictoryPointsYesterday = [];
  this.corporationVictoryPointsLastWeek = [];
  this.corporationVictoryPointsTotal = [];
  this.factionKillsYesterday = [];
  this.factionKillsLastWeek = [];
  this.factionKillsTotal = [];
  this.factionVictoryPointsYesterday = [];
  this.factionVictoryPointsLastWeek = [];
  this.factionVictoryPointsTotal = [];
  var cols = [
              { name: 'KillsYesterday', ctor: FacWarKillRecord, tgt: this.characterKillsYesterday },
              { name: 'KillsLastWeek', ctor: FacWarKillRecord, tgt: this.characterKillsLastWeek },
              { name: 'KillsTotal', ctor: FacWarKillRecord, tgt: this.characterKillsTotal },
              { name: 'VictoryPointsYesterday', ctor: FacWarVictoryPointRecord, tgt: this.characterVictoryPointsYesterday},
              { name: 'VictoryPointsLastWeek', ctor: FacWarVictoryPointRecord, tgt: this.characterVictoryPointsLastWeek},
              { name: 'VictoryPointsTotal', ctor: FacWarVictoryPointRecord, tgt: this.characterVictoryPointsTotal}
              ];
  GenericListBuilder_(root, cols, 'eveapi/result/characters/rowset');
  cols = [
              { name: 'KillsYesterday', ctor: FacWarKillRecord, tgt: this.corporationKillsYesterday },
              { name: 'KillsLastWeek', ctor: FacWarKillRecord, tgt: this.corporationKillsLastWeek },
              { name: 'KillsTotal', ctor: FacWarKillRecord, tgt: this.corporationKillsTotal },
              { name: 'VictoryPointsYesterday', ctor: FacWarVictoryPointRecord, tgt: this.corporationVictoryPointsYesterday},
              { name: 'VictoryPointsLastWeek', ctor: FacWarVictoryPointRecord, tgt: this.corporationVictoryPointsLastWeek},
              { name: 'VictoryPointsTotal', ctor: FacWarVictoryPointRecord, tgt: this.corporationVictoryPointsTotal}
              ];
  GenericListBuilder_(root, cols, 'eveapi/result/corporations/rowset');
  cols = [
              { name: 'KillsYesterday', ctor: FacWarKillRecord, tgt: this.factionKillsYesterday },
              { name: 'KillsLastWeek', ctor: FacWarKillRecord, tgt: this.factionKillsLastWeek },
              { name: 'KillsTotal', ctor: FacWarKillRecord, tgt: this.factionKillsTotal },
              { name: 'VictoryPointsYesterday', ctor: FacWarVictoryPointRecord, tgt: this.factionVictoryPointsYesterday},
              { name: 'VictoryPointsLastWeek', ctor: FacWarVictoryPointRecord, tgt: this.factionVictoryPointsLastWeek},
              { name: 'VictoryPointsTotal', ctor: FacWarVictoryPointRecord, tgt: this.factionVictoryPointsTotal}
              ];
  GenericListBuilder_(root, cols, 'eveapi/result/factions/rowset');
}

// ------------------------------------------------------------------------------------------
// RefType
// ------------------------------------------------------------------------------------------
function RefType(root) {
  // int refTypeID
  // string refTypeName
  AllAttributeSetter_(root, this, 'row');
  if (this.refTypeID !== undefined) this.refTypeID = parseInt(this.refTypeID);
}

// ------------------------------------------------------------------------------------------
// SkillGroup
// ------------------------------------------------------------------------------------------
function RequiredSkill(root) {
  // int typeID
  // int skillLevel
  AllAttributeSetter_(root, this, 'row', parseInt);
}

function SkillBonus(root) {
  // string bonusType
  // int bonusValue
  AllAttributeSetter_(root, this, 'row');
  if (this.bonusValue !== undefined) this.bonusValue = parseInt(this.bonusValue);
}

function SkillDef(root) {
  // string typeName
  // int groupID
  // int typeID
  // boolean published
  // string description
  // int rank
  // string primaryAttribute
  // string secondaryAttribute
  // requiredSkills = [] <- RequiredSkill
  // skillBonuses = [] <- SkillBonus
  AllAttributeSetter_(root, this, 'row', parseInt);
  SimpleAttributeSetter_(root, this, 'typeName', 'row', 'typeName');
  this.published = this.published === 1;
  SimplePropertySetter_(root, this, 'description', 'row/description');
  SimplePropertySetter_(root, this, 'rank', 'row/rank', parseInt);
  SimplePropertySetter_(root, this, 'primaryAttribute', 'row/requiredAttributes/primaryAttribute');
  SimplePropertySetter_(root, this, 'secondaryAttribute', 'row/requiredAttributes/secondaryAttribute');
  this.requiredSkills = [];
  this.skillBonuses = [];
  var cols = [
              { name: 'requiredSkills', ctor: RequiredSkill, tgt: this.requiredSkills },
              { name: 'skillBonusCollection', ctor: SkillBonus, tgt: this.skillBonuses}
              ];
  GenericListBuilder_(root, cols, 'row/rowset');
}

function SkillGroup(root) {
  // string groupName
  // int groupID
  // skills = [] <- SkillDef
  AllAttributeSetter_(root, this, 'row');
  if (this.groupID !== undefined) this.groupID = parseInt(this.groupID);
  var skls = [];
  var processor = function(el) {
    skls.push(new SkillDef(el));
  };
  ProcessChildren_(root, 'row/rowset', processor);
  this.skills = skls;
}

// ------------------------------------------------------------------------------------------
// TypeName
// ------------------------------------------------------------------------------------------
function TypeName(root) {
  // int typeID
  // string typeName
  AllAttributeSetter_(root, this, 'row');
  if (this.typeID !== undefined) this.typeID = parseInt(this.typeID);
}

// ------------------------------------------------------------------------------------------
// FactionWarSystem
// ------------------------------------------------------------------------------------------
function FactionWarSystem(root) {
  // long solarSystemID
  // string solarSystemName
  // long occupyingFactionID
  // long owningFactionID
  // string occupyingFactionName
  // string owningFactionName
  // boolean contested
  // int victoryPoints
  // int victoryPointThreshold
  AllAttributeSetter_(root, this, 'row', parseInt);
  SimpleAttributeSetter_(root, this, 'solarSystemName', 'row', 'solarSystemName');
  SimpleAttributeSetter_(root, this, 'occupyingFactionName', 'row', 'occupyingFactionName');
  SimpleAttributeSetter_(root, this, 'owningFactionName', 'row', 'owningFactionName');
  SimpleAttributeSetter_(root, this, 'contested', 'row', 'contested');
  this.contested = this.contested == 'True';
}

// ------------------------------------------------------------------------------------------
// ShipJump
// ------------------------------------------------------------------------------------------
function ShipJump(root) {
  // long solarSystemID
  // int shipJumps
  AllAttributeSetter_(root, this, 'row', parseInt);
}

// ------------------------------------------------------------------------------------------
// KillStat
// ------------------------------------------------------------------------------------------
function KillStat(root) {
  // long solarSystemID
  // int shipKills
  // int factionKills
  // int podKills
  AllAttributeSetter_(root, this, 'row', parseInt);
}

// ------------------------------------------------------------------------------------------
// SystemSovereignty
// ------------------------------------------------------------------------------------------
function SystemSovereignty(root) {
  // long solarSystemID
  // int allianceID
  // long factionID
  // string solarSystemName
  // long corporationID
  AllAttributeSetter_(root, this, 'row', parseInt);
  SimpleAttributeSetter_(root, this, 'solarSystemName', 'row', 'solarSystemName');
}

// ------------------------------------------------------------------------------------------
// ServerStatus
// ------------------------------------------------------------------------------------------
function ServerStatus(root) {
  // boolean serverOpen
  // int onlinePlayers
  SimplePropertySetter_(root, this, 'serverOpen', 'eveapi/result/serverOpen');
  SimplePropertySetter_(root, this, 'onlinePlayers', 'eveapi/result/onlinePlayers', parseInt);
  this.serverOpen = this.serverOpen == 'True';
}

// ------------------------------------------------------------------------------------------
// APICallList
// ------------------------------------------------------------------------------------------
function APICallGroup(root) {
  // int groupID
  // string name
  // string description
  AllAttributeSetter_(root, this, 'row');
  if (this.groupID !== undefined) this.groupID = parseInt(this.groupID);
}

function APICall(root) {
  // long accessMask
  // string type
  // string name
  // int groupID
  // string description
  AllAttributeSetter_(root, this, 'row');
  if (this.accessMask !== undefined) this.accessMask = parseInt(this.accessMask);
  if (this.groupID !== undefined) this.groupID = parseInt(this.groupID);
}

function APICallList(root) {
  // callGroups = [] <- APICallGroup
  // calls = [] <- APICall
  this.callGroups = [];
  this.calls = [];
  var cols = [
              { name: 'callGroups', ctor: APICallGroup, tgt: this.callGroups },
              { name: 'calls', ctor: APICall, tgt: this.calls}
              ];
  GenericListBuilder_(root, cols, 'eveapi/result/rowset');
}
