/*
 * EVE XML API download functions.
 *
 * Lots of good ideas borrowed from:
 *   EveApi (https://code.google.com/p/eveapi/)
 *   Prosper Blog (http://eve-prosper.blogspot.co.uk/2014/07/building-better-spreadsheets-crius.html)
 *
 * Author: EveKit Devs
 * EVE Release: Phoebe
 *
 * License:
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2014 eve-kit.org
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
  SERVER : "/server"
};

/**
 * Enumeration of API pages.
 */
ApiPage = {
  ACCOUNT_STATUS : "AccountStatus",
  CHARACTERS : "Characters",
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
  CERTIFICATE_TREE : "CertificateTree",
  CHARACTER_ID : "CharacterID",
  CHARACTER_NAME : "CharacterName",
  CONQUERABLE_STATION_LIST : "ConquerableStationList",
  ERROR_LIST : "ErrorList",
  FACT_WAR_TOP_STATS : "FacWarTopStats",
  REF_TYPES : "RefTypes",
  SKILL_TREE : "SkillTree",
  FACTION_WAR_SYSTEMS : "FacWarSystems",
  JUMPS : "Jumps",
  KILLS : "Kills",
  SOVEREIGNTY : "Sovereignty",
  SERVER_STATUS : "ServerStatus",
  CHARACTER_INFO : "CharacterInfo"
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
    result.keyID = auth.keyID;
    result.vCode = auth.vCode;
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
  return new Date(dt_day[0], dt_day[1] - 1, dt_day[2], dt_tm[0], dt_tm[1], dt_tm[2]);
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
 *   name : value of the "name" attribute a an element must have in order for its children to be processed
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

function AccountAPI(keyid, vcode) {
  this.keyID = keyid;
  this.vCode = vcode;
  this.auth = new ApiAuth(keyid, vcode);
}

AccountAPI.prototype.accountStatus = function() {
  return retrieveXML_(ApiPath.ACCOUNT, ApiPage.ACCOUNT_STATUS, 2, this.auth, {},
      function(el) { return new AccountStatus(el) });
};

AccountAPI.prototype.characters = function() {
  return retrieveXML_(ApiPath.ACCOUNT, ApiPage.CHARACTERS, 1, this.auth, {}, GenericBuilder_(Character));
};

// ------------------------------------------------------------------------------------------
// CharacterAPI
// ------------------------------------------------------------------------------------------

function CharacterAPI(keyid, vcode, charid) {
  this.keyID = keyid;
  this.vCode = vcode;
  this.charID = charid;
  this.auth = new ApiAuth(keyid, vcode, charid);
}

CharacterAPI.prototype.accountBalances = function() {
  return retrieveXML_(ApiPath.CHARACTER, ApiPage.ACCOUNT_BALANCE, 2, this.auth, {}, GenericBuilder_(AccountBalance));
};

CharacterAPI.prototype.assetList = function() {
  return retrieveXML_(ApiPath.CHARACTER, ApiPage.ASSET_LIST, 2, this.auth, {}, GenericBuilder_(Asset));
};

CharacterAPI.prototype.blueprints = function() {
  return retrieveXML_(ApiPath.CHARACTER, ApiPage.BLUEPRINTS, 2, this.auth, {}, GenericBuilder_(Blueprint));
};

CharacterAPI.prototype.calendarEventAttendees = function() {
  var args = [];
  for (var i = 0; i < arguments.length; i++) {
    args.push(arguments[i]);
  }
  return retrieveXML_(ApiPath.CHARACTER, ApiPage.CALENDAR_EVENT_ATTENDEES, 2, this.auth,
      { eventIDs: args.join(',')}, GenericBuilder_(CalendarEventAttendee));
};

CharacterAPI.prototype.sheet = function() {
  return retrieveXML_(ApiPath.CHARACTER, ApiPage.CHARACTER_SHEET, 1, this.auth, {},
      function(el) { return new CharacterSheet(el) });
};

CharacterAPI.prototype.contactList = function() {
  return retrieveXML_(ApiPath.CHARACTER, ApiPage.CONTACT_LIST, 2, this.auth, {},
      function(el) { return new ContactList(el) });
};

CharacterAPI.prototype.contactNotifications = function() {
  return retrieveXML_(ApiPath.CHARACTER, ApiPage.CONTACT_NOTIFICATIONS, 2, this.auth, {}, GenericBuilder_(ContactNotification));
};

CharacterAPI.prototype.contracts = function() {
  return retrieveXML_(ApiPath.CHARACTER, ApiPage.CONTRACTS, 1, this.auth, {}, GenericBuilder_(Contract));
};

CharacterAPI.prototype.contractBids = function() {
  return retrieveXML_(ApiPath.CHARACTER, ApiPage.CONTRACT_BIDS, 1, this.auth, {}, GenericBuilder_(ContractBid));
};

CharacterAPI.prototype.contractItems = function(contractID) {
  return retrieveXML_(ApiPath.CHARACTER, ApiPage.CONTRACT_ITEMS, 1, this.auth,
      { contractID: contractID }, GenericBuilder_(ContractItem));
};

CharacterAPI.prototype.facWarStats = function() {
  return retrieveXML_(ApiPath.CHARACTER, ApiPage.FACT_WAR_STATS, 2, this.auth, {},
      function(el) { return new FacWarStats(el) });
};

CharacterAPI.prototype.industryJobs = function() {
  return retrieveXML_(ApiPath.CHARACTER, ApiPage.INDUSTRY_JOBS, 2, this.auth, {}, GenericBuilder_(IndustryJob));
};

CharacterAPI.prototype.industryJobsHistory = function() {
  return retrieveXML_(ApiPath.CHARACTER, ApiPage.INDUSTRY_JOBS_HISTORY, 2, this.auth, {}, GenericBuilder_(IndustryJob));
};

CharacterAPI.prototype.killMails = function(fromID, rowCount) {
  var args = {};
  if (fromID !== undefined) args['fromID'] = fromID;
  if (rowCount !== undefined) args['rowCount'] = rowCount;
  return retrieveXML_(ApiPath.CHARACTER, ApiPage.KILL_LOG, 2, this.auth, args, GenericBuilder_(KillMail));
};

CharacterAPI.prototype.locations = function() {
  var args = [];
  for (var i = 0; i < arguments.length; i++) {
    args.push(arguments[i]);
  }
  return retrieveXML_(ApiPath.CHARACTER, ApiPage.LOCATIONS, 2, this.auth,
      { IDs: args.join(',')}, GenericBuilder_(Location));
};

CharacterAPI.prototype.mailMessages = function() {
  return retrieveXML_(ApiPath.CHARACTER, ApiPage.MAIL_MESSAGES, 2, this.auth, {}, GenericBuilder_(MailMessage));
};

CharacterAPI.prototype.mailBodies = function() {
  var args = [];
  for (var i = 0; i < arguments.length; i++) {
    args.push(arguments[i]);
  }
  return retrieveXML_(ApiPath.CHARACTER, ApiPage.MAIL_BODIES, 2, this.auth,
      { ids: args.join(',')}, GenericBuilder_(MailBody));
};

CharacterAPI.prototype.mailingLists = function() {
  return retrieveXML_(ApiPath.CHARACTER, ApiPage.MAILING_LISTS, 2, this.auth, {}, GenericBuilder_(MailingList));
};

CharacterAPI.prototype.marketOrders = function() {
  return retrieveXML_(ApiPath.CHARACTER, ApiPage.MARKET_ORDERS, 2, this.auth, {}, GenericBuilder_(MarketOrder));
};

CharacterAPI.prototype.medalList = function() {
  return retrieveXML_(ApiPath.CHARACTER, ApiPage.MEDALS, 2, this.auth, {},
      function(el) { return new MedalList(el) });
};

CharacterAPI.prototype.notifications = function() {
  return retrieveXML_(ApiPath.CHARACTER, ApiPage.NOTIFICATIONS, 2, this.auth, {}, GenericBuilder_(Notification));
};

CharacterAPI.prototype.notificationTexts = function() {
  var args = [];
  for (var i = 0; i < arguments.length; i++) {
    args.push(arguments[i]);
  }
  return retrieveXML_(ApiPath.CHARACTER, ApiPage.NOTIFICATION_TEXTS, 2, this.auth,
      { IDs: args.join(',')}, GenericBuilder_(NotificationText));
};

CharacterAPI.prototype.planetaryColonies = function() {
  return retrieveXML_(ApiPath.CHARACTER, ApiPage.PLANETARY_COLONIES, 2, this.auth, {}, GenericBuilder_(PlanetaryColony));
};

CharacterAPI.prototype.planetaryPins = function(planetID) {
  return retrieveXML_(ApiPath.CHARACTER, ApiPage.PLANETARY_PINS, 2, this.auth, {planetID: planetID}, GenericBuilder_(PlanetaryPin));
};

CharacterAPI.prototype.planetaryRoutes = function(planetID) {
  return retrieveXML_(ApiPath.CHARACTER, ApiPage.PLANETARY_ROUTES, 2, this.auth, {planetID: planetID}, GenericBuilder_(PlanetaryRoute));
};

CharacterAPI.prototype.planetaryLinks = function(planetID) {
  return retrieveXML_(ApiPath.CHARACTER, ApiPage.PLANETARY_LINKS, 2, this.auth, {planetID: planetID}, GenericBuilder_(PlanetaryLink));
};

CharacterAPI.prototype.research = function() {
  return retrieveXML_(ApiPath.CHARACTER, ApiPage.RESEARCH, 2, this.auth, {}, GenericBuilder_(Research));
};

CharacterAPI.prototype.skillInTraining = function() {
  return retrieveXML_(ApiPath.CHARACTER, ApiPage.SKILL_IN_TRAINING, 2, this.auth, {},
      function(el) { return new SkillInTraining(el) });
};

CharacterAPI.prototype.skillQueue = function() {
  return retrieveXML_(ApiPath.CHARACTER, ApiPage.SKILL_QUEUE, 2, this.auth, {}, GenericBuilder_(SkillInQueue));
};

CharacterAPI.prototype.standings = function() {
  return retrieveXML_(ApiPath.CHARACTER, ApiPage.STANDINGS, 2, this.auth, {}, StandingBuilder_(true));
};

CharacterAPI.prototype.upcomingCalendarEvents = function() {
  return retrieveXML_(ApiPath.CHARACTER, ApiPage.UPCOMING_CALENDAR_EVENTS, 2, this.auth, {}, GenericBuilder_(UpcomingCalendarEvent));
};

CharacterAPI.prototype.walletJournal = function(rowCount, fromID) {
  var args = { accountKey: 1000 };
  if (rowCount !== undefined) args['rowCount'] = rowCount;
  if (fromID !== undefined) args['fromID'] = fromID;
  return retrieveXML_(ApiPath.CHARACTER, ApiPage.WALLET_JOURNAL, 2, this.auth, args, GenericBuilder_(WalletJournal));
};

CharacterAPI.prototype.walletTransaction = function(rowCount, fromID) {
  var args = { accountKey: 1000 };
  if (rowCount !== undefined) args['rowCount'] = rowCount;
  if (fromID !== undefined) args['fromID'] = fromID;
  return retrieveXML_(ApiPath.CHARACTER, ApiPage.WALLET_TRANSACTIONS, 2, this.auth, args, GenericBuilder_(WalletTransaction));
};

// ------------------------------------------------------------------------------------------
// CorporationAPI
// ------------------------------------------------------------------------------------------

/**
 * Create an instance of the Corporation API.  Use this instance to retrieve corporation data.
 *
 * @param {number} keyid EVE API key ID
 * @param {string} vcode EVE API vCode
 * @constructor
 */
function CorporationAPI(keyid, vcode) {
  this.keyID = keyid;
  this.vCode = vcode;
  this.auth = new ApiAuth(keyid, vcode);
}

CorporationAPI.prototype.accountBalances = function() {
  return retrieveXML_(ApiPath.CORPORATION, ApiPage.ACCOUNT_BALANCE, 2, this.auth, {}, GenericBuilder_(AccountBalance));
};

CorporationAPI.prototype.assetList = function() {
  return retrieveXML_(ApiPath.CORPORATION, ApiPage.ASSET_LIST, 2, this.auth, {}, GenericBuilder_(Asset));
};

CorporationAPI.prototype.blueprints = function() {
  return retrieveXML_(ApiPath.CORPORATION, ApiPage.BLUEPRINTS, 2, this.auth, {}, GenericBuilder_(Blueprint));
};

CorporationAPI.prototype.contactList = function() {
  return retrieveXML_(ApiPath.CORPORATION, ApiPage.CONTACT_LIST, 2, this.auth, {},
      function(el) { return new ContactList(el) });
};

CorporationAPI.prototype.containerLog = function() {
  return retrieveXML_(ApiPath.CORPORATION, ApiPage.CONTAINER_LOG, 2, this.auth, {}, GenericBuilder_(ContainerLog));
};

CorporationAPI.prototype.contracts = function() {
  return retrieveXML_(ApiPath.CORPORATION, ApiPage.CONTRACTS, 1, this.auth, {}, GenericBuilder_(Contract));
};

CorporationAPI.prototype.contractBids = function() {
  return retrieveXML_(ApiPath.CORPORATION, ApiPage.CONTRACT_BIDS, 1, this.auth, {}, GenericBuilder_(ContractBid));
};

CorporationAPI.prototype.contractItems = function(contractID) {
  return retrieveXML_(ApiPath.CORPORATION, ApiPage.CONTRACT_ITEMS, 1, this.auth,
      { contractID: contractID }, GenericBuilder_(ContractItem));
};

CorporationAPI.prototype.sheet = function(corpID) {
  var args = {};
  if (corpID !== undefined) args['corporationID'] = corpID;
  return retrieveXML_(ApiPath.CORPORATION, ApiPage.CORPORATION_SHEET, 2, this.auth, args,
      function(el) { return new CorporationSheet(el) });
};

CorporationAPI.prototype.facilities = function() {
  return retrieveXML_(ApiPath.CORPORATION, ApiPage.FACILITIES, 2, this.auth,
      {}, GenericBuilder_(Facility));
};

CorporationAPI.prototype.facWarStats = function() {
  return retrieveXML_(ApiPath.CORPORATION, ApiPage.FACT_WAR_STATS, 2, this.auth, {},
      function(el) { return new FacWarStats(el) });
};

CorporationAPI.prototype.industryJobs = function() {
  return retrieveXML_(ApiPath.CORPORATION, ApiPage.INDUSTRY_JOBS, 2, this.auth, {}, GenericBuilder_(IndustryJob));
};

CorporationAPI.prototype.industryJobsHistory = function() {
  return retrieveXML_(ApiPath.CORPORATION, ApiPage.INDUSTRY_JOBS_HISTORY, 2, this.auth, {}, GenericBuilder_(IndustryJob));
};

CorporationAPI.prototype.killMails = function(fromID, rowCount) {
  var args = {};
  if (fromID !== undefined) args['fromID'] = fromID;
  if (rowCount !== undefined) args['rowCount'] = rowCount;
  return retrieveXML_(ApiPath.CORPORATION, ApiPage.KILL_LOG, 2, this.auth, args, GenericBuilder_(KillMail));
};

CorporationAPI.prototype.locations = function() {
  var args = [];
  for (var i = 0; i < arguments.length; i++) {
    args.push(arguments[i]);
  }
  return retrieveXML_(ApiPath.CORPORATION, ApiPage.LOCATIONS, 2, this.auth,
      { IDs: args.join(',')}, GenericBuilder_(Location));
};

CorporationAPI.prototype.marketOrders = function() {
  return retrieveXML_(ApiPath.CORPORATION, ApiPage.MARKET_ORDERS, 2, this.auth, {}, GenericBuilder_(MarketOrder));
};

CorporationAPI.prototype.medalList = function() {
  return retrieveXML_(ApiPath.CORPORATION, ApiPage.MEDALS, 2, this.auth, {},
      function(el) { return new MedalList(el) });
};

CorporationAPI.prototype.memberMedals = function() {
  return retrieveXML_(ApiPath.CORPORATION, ApiPage.MEMBER_MEDALS, 2, this.auth, {},
      function(el) { return new MedalList(el) });
};

CorporationAPI.prototype.memberSecurity = function() {
  return retrieveXML_(ApiPath.CORPORATION, ApiPage.MEMBER_SECURITY, 2, this.auth, {}, GenericBuilder_(MemberSecurity));
};

CorporationAPI.prototype.memberSecurityLog = function() {
  return retrieveXML_(ApiPath.CORPORATION, ApiPage.MEMBER_SECURITY_LOG, 2, this.auth, {}, GenericBuilder_(MemberSecurityLog));
};

CorporationAPI.prototype.memberTracking = function(extended) {
  var args = {};
  if (extended) args['extended'] = 1;
  return retrieveXML_(ApiPath.CORPORATION, ApiPage.MEMBER_TRACKING, 2, this.auth, args, GenericBuilder_(MemberTracking));
};

CorporationAPI.prototype.outpostList = function() {
  return retrieveXML_(ApiPath.CORPORATION, ApiPage.OUTPOST_LIST, 2, this.auth, {}, GenericBuilder_(Outpost));
};

CorporationAPI.prototype.outpostService = function(itemid) {
  return retrieveXML_(ApiPath.CORPORATION, ApiPage.OUTPOST_SERVICEDETAIL, 2, this.auth, {itemID: itemid}, GenericBuilder_(OutpostService));
};

CorporationAPI.prototype.shareholderList = function(itemid) {
  return retrieveXML_(ApiPath.CORPORATION, ApiPage.SHAREHOLDERS, 2, this.auth, {},
      function(el) { return new ShareholderList(el); });
};

CorporationAPI.prototype.standings = function() {
  return retrieveXML_(ApiPath.CORPORATION, ApiPage.STANDINGS, 2, this.auth, {}, StandingBuilder_(false));
};

CorporationAPI.prototype.starbaseList = function() {
  return retrieveXML_(ApiPath.CORPORATION, ApiPage.STARBASE_LIST, 2, this.auth, {}, GenericBuilder_(Starbase));
};

CorporationAPI.prototype.starbaseDetail = function(itemid) {
  return retrieveXML_(ApiPath.CORPORATION, ApiPage.STARBASE_DETAIL, 2, this.auth, {itemID: itemid},
      function(el) { return new StarbaseDetail(el) });
};

CorporationAPI.prototype.titles = function() {
  return retrieveXML_(ApiPath.CORPORATION, ApiPage.TITLES, 2, this.auth, {}, GenericBuilder_(Title));
};

CorporationAPI.prototype.walletJournal = function(accountKey, rowCount, fromID) {
  var args = { accountKey: accountKey };
  if (rowCount !== undefined) args['rowCount'] = rowCount;
  if (fromID !== undefined) args['fromID'] = fromID;
  return retrieveXML_(ApiPath.CORPORATION, ApiPage.WALLET_JOURNAL, 2, this.auth, args, GenericBuilder_(WalletJournal));
};

/**
 * Retrieve corporation wallet transactions
 *
 * @param {number} accountKey wallet account key
 * @param {number} rowCount (optional) number of rows to return
 * @param {number} fromID (optional) retrieve wallet transactions with a transaction ID less than this value
 * @returns {Object} an array of WalletTransaction objects
 */
CorporationAPI.prototype.walletTransaction = function(accountKey, rowCount, fromID) {
  var args = { accountKey: accountKey };
  if (rowCount !== undefined) args['rowCount'] = rowCount;
  if (fromID !== undefined) args['fromID'] = fromID;
  return retrieveXML_(ApiPath.CORPORATION, ApiPage.WALLET_TRANSACTIONS, 2, this.auth, args, GenericBuilder_(WalletTransaction));
};


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
  var multiCharacterTraining = [];
  var processor = function(el) {
    multiCharacterTraining.push(new MultiCharacterTraining(el));
  };
  ProcessChildren_(root, 'eveapi/result/rowset', processor);
  this.multiCharacterTraining = multiCharacterTraining;
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
  var assets = [];
  var processor = function(el) {
    assets.push(new Asset(el));
  };
  ProcessChildren_(root, 'row/rowset', processor);
  this.assets = assets;
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
  var items = [];
  var processor = function(el) {
    assets.push(new KillItem(el));
  };
  ProcessChildren_(root, 'row/rowset', processor);
  this.items = items;
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
