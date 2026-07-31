var builtInFuncs = {
  "+": ["conjugate", "add"],
  "−": ["negate", "subtract"],
  "×": ["signOf", "multiply"],
  "÷": ["reciprocal", "divide"],
  "⌈": ["ceiling", "greaterOf"],
  "⌊": ["floor", "lesserOf"],
  "∣": ["absolute", "residue"],
  "⍳": ["indexGenerate", "indexOf"],
  "?": ["roll", "deal"],
  "⋆": ["exponentiate", "toThePowerOf"],
  "⍟": ["naturalLog", "logToTheBase"],
  "○": ["piTimes", "circularFuncs"],
  "!": ["factorial", "binomial"],
  "⌹": ["matrixInverse", "matrixDivide"],
  "<": [null, "lessThan"],
  "≤": [null, "lessThanOrEqual"],
  "=": [null, "equals"],
  ">": [null, "greaterThan"],
  "≥": [null, "greaterThanOrEqual"],
  "≠": [null, "notEqual"],
  "≡": ["depth", "match"],
  "≢": [null, "notMatch"],
  "∈": ["enlist", "membership"],
  "⍷": [null, "find"],
  "∪": ["unique", "union"],
  "∩": [null, "intersection"],
  "∼": ["not", "without"],
  "∨": [null, "or"],
  "∧": [null, "and"],
  "⍱": [null, "nor"],
  "⍲": [null, "nand"],
  "⍴": ["shapeOf", "reshape"],
  ",": ["ravel", "catenate"],
  "⍪": [null, "firstAxisCatenate"],
  "⌽": ["reverse", "rotate"],
  "⊖": ["axis1Reverse", "axis1Rotate"],
  "⍉": ["transpose", null],
  "↑": ["first", "take"],
  "↓": [null, "drop"],
  "⊂": ["enclose", "partitionWithAxis"],
  "⊃": ["diclose", "pick"],
  "⌷": [null, "index"],
  "⍋": ["gradeUp", null],
  "⍒": ["gradeDown", null],
  "⊤": ["encode", null],
  "⊥": ["decode", null],
  "⍕": ["format", "formatByExample"],
  "⍎": ["execute", null],
  "⊣": ["stop", "left"],
  "⊢": ["pass", "right"]
};
var isOperator = /[\.\/⌿⍀¨⍣]/;
var isNiladic = /⍬/;
var isFunction = /[\+−×÷⌈⌊∣⍳\?⋆⍟○!⌹<≤=>≥≠≡≢∈⍷∪∩∼∨∧⍱⍲⍴,⍪⌽⊖⍉↑↓⊂⊃⌷⍋⍒⊤⊥⍕⍎⊣⊢]/;
var isArrow = /←/;
var isComment = /[⍝#].*$/;
var stringEater = function(type2) {
  var prev;
  prev = false;
  return function(c) {
    prev = c;
    if (c === type2) {
      return prev === "\\";
    }
    return true;
  };
};
const apl = {
  name: "apl",
  startState: function() {
    return {
      prev: false,
      func: false,
      op: false,
      string: false,
      escape: false
    };
  },
  token: function(stream, state) {
    var ch2;
    if (stream.eatSpace()) {
      return null;
    }
    ch2 = stream.next();
    if (ch2 === '"' || ch2 === "'") {
      stream.eatWhile(stringEater(ch2));
      stream.next();
      state.prev = true;
      return "string";
    }
    if (/[\[{\(]/.test(ch2)) {
      state.prev = false;
      return null;
    }
    if (/[\]}\)]/.test(ch2)) {
      state.prev = true;
      return null;
    }
    if (isNiladic.test(ch2)) {
      state.prev = false;
      return "atom";
    }
    if (/[¯\d]/.test(ch2)) {
      if (state.func) {
        state.func = false;
        state.prev = false;
      } else {
        state.prev = true;
      }
      stream.eatWhile(/[\w\.]/);
      return "number";
    }
    if (isOperator.test(ch2)) {
      return "operator";
    }
    if (isArrow.test(ch2)) {
      return "operator";
    }
    if (isFunction.test(ch2)) {
      state.func = true;
      state.prev = false;
      return builtInFuncs[ch2] ? "variableName.function.standard" : "variableName.function";
    }
    if (isComment.test(ch2)) {
      stream.skipToEnd();
      return "comment";
    }
    if (ch2 === "∘" && stream.peek() === ".") {
      stream.next();
      return "variableName.function";
    }
    stream.eatWhile(/[\w\$_]/);
    state.prev = true;
    return "keyword";
  }
};
const apl$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  apl
});
function errorIfNotEmpty(stream) {
  var nonWS = stream.match(/^\s*\S/);
  stream.skipToEnd();
  return nonWS ? "error" : null;
}
const asciiArmor = {
  name: "asciiarmor",
  token: function(stream, state) {
    var m;
    if (state.state == "top") {
      if (stream.sol() && (m = stream.match(/^-----BEGIN (.*)?-----\s*$/))) {
        state.state = "headers";
        state.type = m[1];
        return "tag";
      }
      return errorIfNotEmpty(stream);
    } else if (state.state == "headers") {
      if (stream.sol() && stream.match(/^\w+:/)) {
        state.state = "header";
        return "atom";
      } else {
        var result = errorIfNotEmpty(stream);
        if (result) state.state = "body";
        return result;
      }
    } else if (state.state == "header") {
      stream.skipToEnd();
      state.state = "headers";
      return "string";
    } else if (state.state == "body") {
      if (stream.sol() && (m = stream.match(/^-----END (.*)?-----\s*$/))) {
        if (m[1] != state.type) return "error";
        state.state = "end";
        return "tag";
      } else {
        if (stream.eatWhile(/[A-Za-z0-9+\/=]/)) {
          return null;
        } else {
          stream.next();
          return "error";
        }
      }
    } else if (state.state == "end") {
      return errorIfNotEmpty(stream);
    }
  },
  blankLine: function(state) {
    if (state.state == "headers") state.state = "body";
  },
  startState: function() {
    return { state: "top", type: null };
  }
};
const asciiarmor = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  asciiArmor
});
function words$k(str) {
  var obj = {}, words2 = str.split(" ");
  for (var i2 = 0; i2 < words2.length; ++i2) obj[words2[i2]] = true;
  return obj;
}
const defaults$1 = {
  keywords: words$k("DEFINITIONS OBJECTS IF DERIVED INFORMATION ACTION REPLY ANY NAMED CHARACTERIZED BEHAVIOUR REGISTERED WITH AS IDENTIFIED CONSTRAINED BY PRESENT BEGIN IMPORTS FROM UNITS SYNTAX MIN-ACCESS MAX-ACCESS MINACCESS MAXACCESS REVISION STATUS DESCRIPTION SEQUENCE SET COMPONENTS OF CHOICE DistinguishedName ENUMERATED SIZE MODULE END INDEX AUGMENTS EXTENSIBILITY IMPLIED EXPORTS"),
  cmipVerbs: words$k("ACTIONS ADD GET NOTIFICATIONS REPLACE REMOVE"),
  compareTypes: words$k("OPTIONAL DEFAULT MANAGED MODULE-TYPE MODULE_IDENTITY MODULE-COMPLIANCE OBJECT-TYPE OBJECT-IDENTITY OBJECT-COMPLIANCE MODE CONFIRMED CONDITIONAL SUBORDINATE SUPERIOR CLASS TRUE FALSE NULL TEXTUAL-CONVENTION"),
  status: words$k("current deprecated mandatory obsolete"),
  tags: words$k("APPLICATION AUTOMATIC EXPLICIT IMPLICIT PRIVATE TAGS UNIVERSAL"),
  storage: words$k("BOOLEAN INTEGER OBJECT IDENTIFIER BIT OCTET STRING UTCTime InterfaceIndex IANAifType CMIP-Attribute REAL PACKAGE PACKAGES IpAddress PhysAddress NetworkAddress BITS BMPString TimeStamp TimeTicks TruthValue RowStatus DisplayString GeneralString GraphicString IA5String NumericString PrintableString SnmpAdminString TeletexString UTF8String VideotexString VisibleString StringStore ISO646String T61String UniversalString Unsigned32 Integer32 Gauge Gauge32 Counter Counter32 Counter64"),
  modifier: words$k("ATTRIBUTE ATTRIBUTES MANDATORY-GROUP MANDATORY-GROUPS GROUP GROUPS ELEMENTS EQUALITY ORDERING SUBSTRINGS DEFINED"),
  accessTypes: words$k("not-accessible accessible-for-notify read-only read-create read-write"),
  multiLineStrings: true
};
function asn1(parserConfig2) {
  var keywords2 = parserConfig2.keywords || defaults$1.keywords, cmipVerbs = parserConfig2.cmipVerbs || defaults$1.cmipVerbs, compareTypes = parserConfig2.compareTypes || defaults$1.compareTypes, status = parserConfig2.status || defaults$1.status, tags = parserConfig2.tags || defaults$1.tags, storage = parserConfig2.storage || defaults$1.storage, modifier = parserConfig2.modifier || defaults$1.modifier, accessTypes = parserConfig2.accessTypes || defaults$1.accessTypes;
  parserConfig2.multiLineStrings || defaults$1.multiLineStrings;
  var indentStatements2 = parserConfig2.indentStatements !== false;
  var isOperatorChar2 = /[\|\^]/;
  var curPunc2;
  function tokenBase2(stream, state) {
    var ch2 = stream.next();
    if (ch2 == '"' || ch2 == "'") {
      state.tokenize = tokenString3(ch2);
      return state.tokenize(stream, state);
    }
    if (/[\[\]\(\){}:=,;]/.test(ch2)) {
      curPunc2 = ch2;
      return "punctuation";
    }
    if (ch2 == "-") {
      if (stream.eat("-")) {
        stream.skipToEnd();
        return "comment";
      }
    }
    if (/\d/.test(ch2)) {
      stream.eatWhile(/[\w\.]/);
      return "number";
    }
    if (isOperatorChar2.test(ch2)) {
      stream.eatWhile(isOperatorChar2);
      return "operator";
    }
    stream.eatWhile(/[\w\-]/);
    var cur = stream.current();
    if (keywords2.propertyIsEnumerable(cur)) return "keyword";
    if (cmipVerbs.propertyIsEnumerable(cur)) return "variableName";
    if (compareTypes.propertyIsEnumerable(cur)) return "atom";
    if (status.propertyIsEnumerable(cur)) return "comment";
    if (tags.propertyIsEnumerable(cur)) return "typeName";
    if (storage.propertyIsEnumerable(cur)) return "modifier";
    if (modifier.propertyIsEnumerable(cur)) return "modifier";
    if (accessTypes.propertyIsEnumerable(cur)) return "modifier";
    return "variableName";
  }
  function tokenString3(quote2) {
    return function(stream, state) {
      var escaped = false, next2, end2 = false;
      while ((next2 = stream.next()) != null) {
        if (next2 == quote2 && !escaped) {
          var afterNext = stream.peek();
          if (afterNext) {
            afterNext = afterNext.toLowerCase();
            if (afterNext == "b" || afterNext == "h" || afterNext == "o")
              stream.next();
          }
          end2 = true;
          break;
        }
        escaped = !escaped && next2 == "\\";
      }
      if (end2 || false)
        state.tokenize = null;
      return "string";
    };
  }
  function Context2(indented, column, type2, align, prev) {
    this.indented = indented;
    this.column = column;
    this.type = type2;
    this.align = align;
    this.prev = prev;
  }
  function pushContext2(state, col, type2) {
    var indent2 = state.indented;
    if (state.context && state.context.type == "statement")
      indent2 = state.context.indented;
    return state.context = new Context2(indent2, col, type2, null, state.context);
  }
  function popContext2(state) {
    var t = state.context.type;
    if (t == ")" || t == "]" || t == "}")
      state.indented = state.context.indented;
    return state.context = state.context.prev;
  }
  return {
    name: "asn1",
    startState: function() {
      return {
        tokenize: null,
        context: new Context2(-2, 0, "top", false),
        indented: 0,
        startOfLine: true
      };
    },
    token: function(stream, state) {
      var ctx = state.context;
      if (stream.sol()) {
        if (ctx.align == null) ctx.align = false;
        state.indented = stream.indentation();
        state.startOfLine = true;
      }
      if (stream.eatSpace()) return null;
      curPunc2 = null;
      var style2 = (state.tokenize || tokenBase2)(stream, state);
      if (style2 == "comment") return style2;
      if (ctx.align == null) ctx.align = true;
      if ((curPunc2 == ";" || curPunc2 == ":" || curPunc2 == ",") && ctx.type == "statement") {
        popContext2(state);
      } else if (curPunc2 == "{") pushContext2(state, stream.column(), "}");
      else if (curPunc2 == "[") pushContext2(state, stream.column(), "]");
      else if (curPunc2 == "(") pushContext2(state, stream.column(), ")");
      else if (curPunc2 == "}") {
        while (ctx.type == "statement") ctx = popContext2(state);
        if (ctx.type == "}") ctx = popContext2(state);
        while (ctx.type == "statement") ctx = popContext2(state);
      } else if (curPunc2 == ctx.type) popContext2(state);
      else if (indentStatements2 && ((ctx.type == "}" || ctx.type == "top") && curPunc2 != ";" || ctx.type == "statement" && curPunc2 == "newstatement"))
        pushContext2(state, stream.column(), "statement");
      state.startOfLine = false;
      return style2;
    },
    languageData: {
      indentOnInput: /^\s*[{}]$/,
      commentTokens: { line: "--" }
    }
  };
}
const asn1$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  asn1
});
var atoms$e = ["exten", "same", "include", "ignorepat", "switch"], dpcmd = ["#include", "#exec"], apps = [
  "addqueuemember",
  "adsiprog",
  "aelsub",
  "agentlogin",
  "agentmonitoroutgoing",
  "agi",
  "alarmreceiver",
  "amd",
  "answer",
  "authenticate",
  "background",
  "backgrounddetect",
  "bridge",
  "busy",
  "callcompletioncancel",
  "callcompletionrequest",
  "celgenuserevent",
  "changemonitor",
  "chanisavail",
  "channelredirect",
  "chanspy",
  "clearhash",
  "confbridge",
  "congestion",
  "continuewhile",
  "controlplayback",
  "dahdiacceptr2call",
  "dahdibarge",
  "dahdiras",
  "dahdiscan",
  "dahdisendcallreroutingfacility",
  "dahdisendkeypadfacility",
  "datetime",
  "dbdel",
  "dbdeltree",
  "deadagi",
  "dial",
  "dictate",
  "directory",
  "disa",
  "dumpchan",
  "eagi",
  "echo",
  "endwhile",
  "exec",
  "execif",
  "execiftime",
  "exitwhile",
  "extenspy",
  "externalivr",
  "festival",
  "flash",
  "followme",
  "forkcdr",
  "getcpeid",
  "gosub",
  "gosubif",
  "goto",
  "gotoif",
  "gotoiftime",
  "hangup",
  "iax2provision",
  "ices",
  "importvar",
  "incomplete",
  "ivrdemo",
  "jabberjoin",
  "jabberleave",
  "jabbersend",
  "jabbersendgroup",
  "jabberstatus",
  "jack",
  "log",
  "macro",
  "macroexclusive",
  "macroexit",
  "macroif",
  "mailboxexists",
  "meetme",
  "meetmeadmin",
  "meetmechanneladmin",
  "meetmecount",
  "milliwatt",
  "minivmaccmess",
  "minivmdelete",
  "minivmgreet",
  "minivmmwi",
  "minivmnotify",
  "minivmrecord",
  "mixmonitor",
  "monitor",
  "morsecode",
  "mp3player",
  "mset",
  "musiconhold",
  "nbscat",
  "nocdr",
  "noop",
  "odbc",
  "odbc",
  "odbcfinish",
  "originate",
  "ospauth",
  "ospfinish",
  "osplookup",
  "ospnext",
  "page",
  "park",
  "parkandannounce",
  "parkedcall",
  "pausemonitor",
  "pausequeuemember",
  "pickup",
  "pickupchan",
  "playback",
  "playtones",
  "privacymanager",
  "proceeding",
  "progress",
  "queue",
  "queuelog",
  "raiseexception",
  "read",
  "readexten",
  "readfile",
  "receivefax",
  "receivefax",
  "receivefax",
  "record",
  "removequeuemember",
  "resetcdr",
  "retrydial",
  "return",
  "ringing",
  "sayalpha",
  "saycountedadj",
  "saycountednoun",
  "saycountpl",
  "saydigits",
  "saynumber",
  "sayphonetic",
  "sayunixtime",
  "senddtmf",
  "sendfax",
  "sendfax",
  "sendfax",
  "sendimage",
  "sendtext",
  "sendurl",
  "set",
  "setamaflags",
  "setcallerpres",
  "setmusiconhold",
  "sipaddheader",
  "sipdtmfmode",
  "sipremoveheader",
  "skel",
  "slastation",
  "slatrunk",
  "sms",
  "softhangup",
  "speechactivategrammar",
  "speechbackground",
  "speechcreate",
  "speechdeactivategrammar",
  "speechdestroy",
  "speechloadgrammar",
  "speechprocessingsound",
  "speechstart",
  "speechunloadgrammar",
  "stackpop",
  "startmusiconhold",
  "stopmixmonitor",
  "stopmonitor",
  "stopmusiconhold",
  "stopplaytones",
  "system",
  "testclient",
  "testserver",
  "transfer",
  "tryexec",
  "trysystem",
  "unpausemonitor",
  "unpausequeuemember",
  "userevent",
  "verbose",
  "vmauthenticate",
  "vmsayname",
  "voicemail",
  "voicemailmain",
  "wait",
  "waitexten",
  "waitfornoise",
  "waitforring",
  "waitforsilence",
  "waitmusiconhold",
  "waituntil",
  "while",
  "zapateller"
];
function basicToken(stream, state) {
  var cur = "";
  var ch2 = stream.next();
  if (state.blockComment) {
    if (ch2 == "-" && stream.match("-;", true)) {
      state.blockComment = false;
    } else if (stream.skipTo("--;")) {
      stream.next();
      stream.next();
      stream.next();
      state.blockComment = false;
    } else {
      stream.skipToEnd();
    }
    return "comment";
  }
  if (ch2 == ";") {
    if (stream.match("--", true)) {
      if (!stream.match("-", false)) {
        state.blockComment = true;
        return "comment";
      }
    }
    stream.skipToEnd();
    return "comment";
  }
  if (ch2 == "[") {
    stream.skipTo("]");
    stream.eat("]");
    return "header";
  }
  if (ch2 == '"') {
    stream.skipTo('"');
    return "string";
  }
  if (ch2 == "'") {
    stream.skipTo("'");
    return "string.special";
  }
  if (ch2 == "#") {
    stream.eatWhile(/\w/);
    cur = stream.current();
    if (dpcmd.indexOf(cur) !== -1) {
      stream.skipToEnd();
      return "strong";
    }
  }
  if (ch2 == "$") {
    var ch1 = stream.peek();
    if (ch1 == "{") {
      stream.skipTo("}");
      stream.eat("}");
      return "variableName.special";
    }
  }
  stream.eatWhile(/\w/);
  cur = stream.current();
  if (atoms$e.indexOf(cur) !== -1) {
    state.extenStart = true;
    switch (cur) {
      case "same":
        state.extenSame = true;
        break;
      case "include":
      case "switch":
      case "ignorepat":
        state.extenInclude = true;
        break;
    }
    return "atom";
  }
}
const asterisk = {
  name: "asterisk",
  startState: function() {
    return {
      blockComment: false,
      extenStart: false,
      extenSame: false,
      extenInclude: false,
      extenExten: false,
      extenPriority: false,
      extenApplication: false
    };
  },
  token: function(stream, state) {
    var cur = "";
    if (stream.eatSpace()) return null;
    if (state.extenStart) {
      stream.eatWhile(/[^\s]/);
      cur = stream.current();
      if (/^=>?$/.test(cur)) {
        state.extenExten = true;
        state.extenStart = false;
        return "strong";
      } else {
        state.extenStart = false;
        stream.skipToEnd();
        return "error";
      }
    } else if (state.extenExten) {
      state.extenExten = false;
      state.extenPriority = true;
      stream.eatWhile(/[^,]/);
      if (state.extenInclude) {
        stream.skipToEnd();
        state.extenPriority = false;
        state.extenInclude = false;
      }
      if (state.extenSame) {
        state.extenPriority = false;
        state.extenSame = false;
        state.extenApplication = true;
      }
      return "tag";
    } else if (state.extenPriority) {
      state.extenPriority = false;
      state.extenApplication = true;
      stream.next();
      if (state.extenSame) return null;
      stream.eatWhile(/[^,]/);
      return "number";
    } else if (state.extenApplication) {
      stream.eatWhile(/,/);
      cur = stream.current();
      if (cur === ",") return null;
      stream.eatWhile(/\w/);
      cur = stream.current().toLowerCase();
      state.extenApplication = false;
      if (apps.indexOf(cur) !== -1) {
        return "def";
      }
    } else {
      return basicToken(stream, state);
    }
    return null;
  },
  languageData: {
    commentTokens: { line: ";", block: { open: ";--", close: "--;" } }
  }
};
const asterisk$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  asterisk
});
var reserve = "><+-.,[]".split("");
const brainfuck = {
  name: "brainfuck",
  startState: function() {
    return {
      commentLine: false,
      left: 0,
      right: 0,
      commentLoop: false
    };
  },
  token: function(stream, state) {
    if (stream.eatSpace()) return null;
    if (stream.sol()) {
      state.commentLine = false;
    }
    var ch2 = stream.next().toString();
    if (reserve.indexOf(ch2) !== -1) {
      if (state.commentLine === true) {
        if (stream.eol()) {
          state.commentLine = false;
        }
        return "comment";
      }
      if (ch2 === "]" || ch2 === "[") {
        if (ch2 === "[") {
          state.left++;
        } else {
          state.right++;
        }
        return "bracket";
      } else if (ch2 === "+" || ch2 === "-") {
        return "keyword";
      } else if (ch2 === "<" || ch2 === ">") {
        return "atom";
      } else if (ch2 === "." || ch2 === ",") {
        return "def";
      }
    } else {
      state.commentLine = true;
      if (stream.eol()) {
        state.commentLine = false;
      }
      return "comment";
    }
    if (stream.eol()) {
      state.commentLine = false;
    }
  }
};
const brainfuck$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  brainfuck
});
var BUILTIN$1 = "builtin", COMMENT$1 = "comment", STRING$1 = "string", ATOM$1 = "atom", NUMBER$1 = "number", KEYWORD = "keyword", MODTAG = "header", COBOLLINENUM = "def", PERIOD = "link";
function makeKeywords$1(str) {
  var obj = {}, words2 = str.split(" ");
  for (var i2 = 0; i2 < words2.length; ++i2) obj[words2[i2]] = true;
  return obj;
}
var atoms$d = makeKeywords$1("TRUE FALSE ZEROES ZEROS ZERO SPACES SPACE LOW-VALUE LOW-VALUES ");
var keywords$C = makeKeywords$1(
  "ACCEPT ACCESS ACQUIRE ADD ADDRESS ADVANCING AFTER ALIAS ALL ALPHABET ALPHABETIC ALPHABETIC-LOWER ALPHABETIC-UPPER ALPHANUMERIC ALPHANUMERIC-EDITED ALSO ALTER ALTERNATE AND ANY ARE AREA AREAS ARITHMETIC ASCENDING ASSIGN AT ATTRIBUTE AUTHOR AUTO AUTO-SKIP AUTOMATIC B-AND B-EXOR B-LESS B-NOT B-OR BACKGROUND-COLOR BACKGROUND-COLOUR BEEP BEFORE BELL BINARY BIT BITS BLANK BLINK BLOCK BOOLEAN BOTTOM BY CALL CANCEL CD CF CH CHARACTER CHARACTERS CLASS CLOCK-UNITS CLOSE COBOL CODE CODE-SET COL COLLATING COLUMN COMMA COMMIT COMMITMENT COMMON COMMUNICATION COMP COMP-0 COMP-1 COMP-2 COMP-3 COMP-4 COMP-5 COMP-6 COMP-7 COMP-8 COMP-9 COMPUTATIONAL COMPUTATIONAL-0 COMPUTATIONAL-1 COMPUTATIONAL-2 COMPUTATIONAL-3 COMPUTATIONAL-4 COMPUTATIONAL-5 COMPUTATIONAL-6 COMPUTATIONAL-7 COMPUTATIONAL-8 COMPUTATIONAL-9 COMPUTE CONFIGURATION CONNECT CONSOLE CONTAINED CONTAINS CONTENT CONTINUE CONTROL CONTROL-AREA CONTROLS CONVERTING COPY CORR CORRESPONDING COUNT CRT CRT-UNDER CURRENCY CURRENT CURSOR DATA DATE DATE-COMPILED DATE-WRITTEN DAY DAY-OF-WEEK DB DB-ACCESS-CONTROL-KEY DB-DATA-NAME DB-EXCEPTION DB-FORMAT-NAME DB-RECORD-NAME DB-SET-NAME DB-STATUS DBCS DBCS-EDITED DE DEBUG-CONTENTS DEBUG-ITEM DEBUG-LINE DEBUG-NAME DEBUG-SUB-1 DEBUG-SUB-2 DEBUG-SUB-3 DEBUGGING DECIMAL-POINT DECLARATIVES DEFAULT DELETE DELIMITED DELIMITER DEPENDING DESCENDING DESCRIBED DESTINATION DETAIL DISABLE DISCONNECT DISPLAY DISPLAY-1 DISPLAY-2 DISPLAY-3 DISPLAY-4 DISPLAY-5 DISPLAY-6 DISPLAY-7 DISPLAY-8 DISPLAY-9 DIVIDE DIVISION DOWN DROP DUPLICATE DUPLICATES DYNAMIC EBCDIC EGI EJECT ELSE EMI EMPTY EMPTY-CHECK ENABLE END END. END-ACCEPT END-ACCEPT. END-ADD END-CALL END-COMPUTE END-DELETE END-DISPLAY END-DIVIDE END-EVALUATE END-IF END-INVOKE END-MULTIPLY END-OF-PAGE END-PERFORM END-READ END-RECEIVE END-RETURN END-REWRITE END-SEARCH END-START END-STRING END-SUBTRACT END-UNSTRING END-WRITE END-XML ENTER ENTRY ENVIRONMENT EOP EQUAL EQUALS ERASE ERROR ESI EVALUATE EVERY EXCEEDS EXCEPTION EXCLUSIVE EXIT EXTEND EXTERNAL EXTERNALLY-DESCRIBED-KEY FD FETCH FILE FILE-CONTROL FILE-STREAM FILES FILLER FINAL FIND FINISH FIRST FOOTING FOR FOREGROUND-COLOR FOREGROUND-COLOUR FORMAT FREE FROM FULL FUNCTION GENERATE GET GIVING GLOBAL GO GOBACK GREATER GROUP HEADING HIGH-VALUE HIGH-VALUES HIGHLIGHT I-O I-O-CONTROL ID IDENTIFICATION IF IN INDEX INDEX-1 INDEX-2 INDEX-3 INDEX-4 INDEX-5 INDEX-6 INDEX-7 INDEX-8 INDEX-9 INDEXED INDIC INDICATE INDICATOR INDICATORS INITIAL INITIALIZE INITIATE INPUT INPUT-OUTPUT INSPECT INSTALLATION INTO INVALID INVOKE IS JUST JUSTIFIED KANJI KEEP KEY LABEL LAST LD LEADING LEFT LEFT-JUSTIFY LENGTH LENGTH-CHECK LESS LIBRARY LIKE LIMIT LIMITS LINAGE LINAGE-COUNTER LINE LINE-COUNTER LINES LINKAGE LOCAL-STORAGE LOCALE LOCALLY LOCK MEMBER MEMORY MERGE MESSAGE METACLASS MODE MODIFIED MODIFY MODULES MOVE MULTIPLE MULTIPLY NATIONAL NATIVE NEGATIVE NEXT NO NO-ECHO NONE NOT NULL NULL-KEY-MAP NULL-MAP NULLS NUMBER NUMERIC NUMERIC-EDITED OBJECT OBJECT-COMPUTER OCCURS OF OFF OMITTED ON ONLY OPEN OPTIONAL OR ORDER ORGANIZATION OTHER OUTPUT OVERFLOW OWNER PACKED-DECIMAL PADDING PAGE PAGE-COUNTER PARSE PERFORM PF PH PIC PICTURE PLUS POINTER POSITION POSITIVE PREFIX PRESENT PRINTING PRIOR PROCEDURE PROCEDURE-POINTER PROCEDURES PROCEED PROCESS PROCESSING PROGRAM PROGRAM-ID PROMPT PROTECTED PURGE QUEUE QUOTE QUOTES RANDOM RD READ READY REALM RECEIVE RECONNECT RECORD RECORD-NAME RECORDS RECURSIVE REDEFINES REEL REFERENCE REFERENCE-MONITOR REFERENCES RELATION RELATIVE RELEASE REMAINDER REMOVAL RENAMES REPEATED REPLACE REPLACING REPORT REPORTING REPORTS REPOSITORY REQUIRED RERUN RESERVE RESET RETAINING RETRIEVAL RETURN RETURN-CODE RETURNING REVERSE-VIDEO REVERSED REWIND REWRITE RF RH RIGHT RIGHT-JUSTIFY ROLLBACK ROLLING ROUNDED RUN SAME SCREEN SD SEARCH SECTION SECURE SECURITY SEGMENT SEGMENT-LIMIT SELECT SEND SENTENCE SEPARATE SEQUENCE SEQUENTIAL SET SHARED SIGN SIZE SKIP1 SKIP2 SKIP3 SORT SORT-MERGE SORT-RETURN SOURCE SOURCE-COMPUTER SPACE-FILL SPECIAL-NAMES STANDARD STANDARD-1 STANDARD-2 START STARTING STATUS STOP STORE STRING SUB-QUEUE-1 SUB-QUEUE-2 SUB-QUEUE-3 SUB-SCHEMA SUBFILE SUBSTITUTE SUBTRACT SUM SUPPRESS SYMBOLIC SYNC SYNCHRONIZED SYSIN SYSOUT TABLE TALLYING TAPE TENANT TERMINAL TERMINATE TEST TEXT THAN THEN THROUGH THRU TIME TIMES TITLE TO TOP TRAILING TRAILING-SIGN TRANSACTION TYPE TYPEDEF UNDERLINE UNEQUAL UNIT UNSTRING UNTIL UP UPDATE UPON USAGE USAGE-MODE USE USING VALID VALIDATE VALUE VALUES VARYING VLR WAIT WHEN WHEN-COMPILED WITH WITHIN WORDS WORKING-STORAGE WRITE XML XML-CODE XML-EVENT XML-NTEXT XML-TEXT ZERO ZERO-FILL "
);
var builtins$9 = makeKeywords$1("- * ** / + < <= = > >= ");
var tests = {
  digit: /\d/,
  digit_or_colon: /[\d:]/,
  hex: /[0-9a-f]/i,
  sign: /[+-]/,
  exponent: /e/i,
  symbol: /[\w*+\-]/
};
function isNumber$1(ch2, stream) {
  if (ch2 === "0" && stream.eat(/x/i)) {
    stream.eatWhile(tests.hex);
    return true;
  }
  if ((ch2 == "+" || ch2 == "-") && tests.digit.test(stream.peek())) {
    stream.eat(tests.sign);
    ch2 = stream.next();
  }
  if (tests.digit.test(ch2)) {
    stream.eat(ch2);
    stream.eatWhile(tests.digit);
    if ("." == stream.peek()) {
      stream.eat(".");
      stream.eatWhile(tests.digit);
    }
    if (stream.eat(tests.exponent)) {
      stream.eat(tests.sign);
      stream.eatWhile(tests.digit);
    }
    return true;
  }
  return false;
}
const cobol = {
  name: "cobol",
  startState: function() {
    return {
      indentStack: null,
      indentation: 0,
      mode: false
    };
  },
  token: function(stream, state) {
    if (state.indentStack == null && stream.sol()) {
      state.indentation = 6;
    }
    if (stream.eatSpace()) {
      return null;
    }
    var returnType = null;
    switch (state.mode) {
      case "string":
        var next2 = false;
        while ((next2 = stream.next()) != null) {
          if ((next2 == '"' || next2 == "'") && !stream.match(/['"]/, false)) {
            state.mode = false;
            break;
          }
        }
        returnType = STRING$1;
        break;
      default:
        var ch2 = stream.next();
        var col = stream.column();
        if (col >= 0 && col <= 5) {
          returnType = COBOLLINENUM;
        } else if (col >= 72 && col <= 79) {
          stream.skipToEnd();
          returnType = MODTAG;
        } else if (ch2 == "*" && col == 6) {
          stream.skipToEnd();
          returnType = COMMENT$1;
        } else if (ch2 == '"' || ch2 == "'") {
          state.mode = "string";
          returnType = STRING$1;
        } else if (ch2 == "'" && !tests.digit_or_colon.test(stream.peek())) {
          returnType = ATOM$1;
        } else if (ch2 == ".") {
          returnType = PERIOD;
        } else if (isNumber$1(ch2, stream)) {
          returnType = NUMBER$1;
        } else {
          if (stream.current().match(tests.symbol)) {
            while (col < 71) {
              if (stream.eat(tests.symbol) === void 0) {
                break;
              } else {
                col++;
              }
            }
          }
          if (keywords$C && keywords$C.propertyIsEnumerable(stream.current().toUpperCase())) {
            returnType = KEYWORD;
          } else if (builtins$9 && builtins$9.propertyIsEnumerable(stream.current().toUpperCase())) {
            returnType = BUILTIN$1;
          } else if (atoms$d && atoms$d.propertyIsEnumerable(stream.current().toUpperCase())) {
            returnType = ATOM$1;
          } else returnType = null;
        }
    }
    return returnType;
  },
  indent: function(state) {
    if (state.indentStack == null) return state.indentation;
    return state.indentStack.indent;
  }
};
const cobol$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  cobol
});
function Context$a(indented, column, type2, info, align, prev) {
  this.indented = indented;
  this.column = column;
  this.type = type2;
  this.info = info;
  this.align = align;
  this.prev = prev;
}
function pushContext$e(state, col, type2, info) {
  var indent2 = state.indented;
  if (state.context && state.context.type == "statement" && type2 != "statement")
    indent2 = state.context.indented;
  return state.context = new Context$a(indent2, col, type2, info, null, state.context);
}
function popContext$e(state) {
  var t = state.context.type;
  if (t == ")" || t == "]" || t == "}")
    state.indented = state.context.indented;
  return state.context = state.context.prev;
}
function typeBefore(stream, state, pos) {
  if (state.prevToken == "variable" || state.prevToken == "type") return true;
  if (/\S(?:[^- ]>|[*\]])\s*$|\*$/.test(stream.string.slice(0, pos))) return true;
  if (state.typeAtEndOfLine && stream.column() == stream.indentation()) return true;
}
function isTopScope(context) {
  for (; ; ) {
    if (!context || context.type == "top") return true;
    if (context.type == "}" && context.prev.info != "namespace") return false;
    context = context.prev;
  }
}
function clike(parserConfig2) {
  var statementIndentUnit2 = parserConfig2.statementIndentUnit, dontAlignCalls = parserConfig2.dontAlignCalls, keywords2 = parserConfig2.keywords || {}, types2 = parserConfig2.types || {}, builtin2 = parserConfig2.builtin || {}, blockKeywords2 = parserConfig2.blockKeywords || {}, defKeywords = parserConfig2.defKeywords || {}, atoms2 = parserConfig2.atoms || {}, hooks2 = parserConfig2.hooks || {}, multiLineStrings2 = parserConfig2.multiLineStrings, indentStatements2 = parserConfig2.indentStatements !== false, indentSwitch = parserConfig2.indentSwitch !== false, namespaceSeparator = parserConfig2.namespaceSeparator, isPunctuationChar = parserConfig2.isPunctuationChar || /[\[\]{}\(\),;\:\.]/, numberStart = parserConfig2.numberStart || /[\d\.]/, number = parserConfig2.number || /^(?:0x[a-f\d]+|0b[01]+|(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?)(u|ll?|l|f)?/i, isOperatorChar2 = parserConfig2.isOperatorChar || /[+\-*&%=<>!?|\/]/, isIdentifierChar = parserConfig2.isIdentifierChar || /[\w\$_\xa1-\uffff]/, isReservedIdentifier = parserConfig2.isReservedIdentifier || false;
  var curPunc2, isDefKeyword;
  function tokenBase2(stream, state) {
    var ch2 = stream.next();
    if (hooks2[ch2]) {
      var result = hooks2[ch2](stream, state);
      if (result !== false) return result;
    }
    if (ch2 == '"' || ch2 == "'") {
      state.tokenize = tokenString3(ch2);
      return state.tokenize(stream, state);
    }
    if (numberStart.test(ch2)) {
      stream.backUp(1);
      if (stream.match(number)) return "number";
      stream.next();
    }
    if (isPunctuationChar.test(ch2)) {
      curPunc2 = ch2;
      return null;
    }
    if (ch2 == "/") {
      if (stream.eat("*")) {
        state.tokenize = tokenComment2;
        return tokenComment2(stream, state);
      }
      if (stream.eat("/")) {
        stream.skipToEnd();
        return "comment";
      }
    }
    if (isOperatorChar2.test(ch2)) {
      while (!stream.match(/^\/[\/*]/, false) && stream.eat(isOperatorChar2)) {
      }
      return "operator";
    }
    stream.eatWhile(isIdentifierChar);
    if (namespaceSeparator) while (stream.match(namespaceSeparator))
      stream.eatWhile(isIdentifierChar);
    var cur = stream.current();
    if (contains(keywords2, cur)) {
      if (contains(blockKeywords2, cur)) curPunc2 = "newstatement";
      if (contains(defKeywords, cur)) isDefKeyword = true;
      return "keyword";
    }
    if (contains(types2, cur)) return "type";
    if (contains(builtin2, cur) || isReservedIdentifier && isReservedIdentifier(cur)) {
      if (contains(blockKeywords2, cur)) curPunc2 = "newstatement";
      return "builtin";
    }
    if (contains(atoms2, cur)) return "atom";
    return "variable";
  }
  function tokenString3(quote2) {
    return function(stream, state) {
      var escaped = false, next2, end2 = false;
      while ((next2 = stream.next()) != null) {
        if (next2 == quote2 && !escaped) {
          end2 = true;
          break;
        }
        escaped = !escaped && next2 == "\\";
      }
      if (end2 || !(escaped || multiLineStrings2))
        state.tokenize = null;
      return "string";
    };
  }
  function tokenComment2(stream, state) {
    var maybeEnd = false, ch2;
    while (ch2 = stream.next()) {
      if (ch2 == "/" && maybeEnd) {
        state.tokenize = null;
        break;
      }
      maybeEnd = ch2 == "*";
    }
    return "comment";
  }
  function maybeEOL(stream, state) {
    if (parserConfig2.typeFirstDefinitions && stream.eol() && isTopScope(state.context))
      state.typeAtEndOfLine = typeBefore(stream, state, stream.pos);
  }
  return {
    name: parserConfig2.name,
    startState: function(indentUnit) {
      return {
        tokenize: null,
        context: new Context$a(-indentUnit, 0, "top", null, false),
        indented: 0,
        startOfLine: true,
        prevToken: null
      };
    },
    token: function(stream, state) {
      var ctx = state.context;
      if (stream.sol()) {
        if (ctx.align == null) ctx.align = false;
        state.indented = stream.indentation();
        state.startOfLine = true;
      }
      if (stream.eatSpace()) {
        maybeEOL(stream, state);
        return null;
      }
      curPunc2 = isDefKeyword = null;
      var style2 = (state.tokenize || tokenBase2)(stream, state);
      if (style2 == "comment" || style2 == "meta") return style2;
      if (ctx.align == null) ctx.align = true;
      if (curPunc2 == ";" || curPunc2 == ":" || curPunc2 == "," && stream.match(/^\s*(?:\/\/.*)?$/, false))
        while (state.context.type == "statement") popContext$e(state);
      else if (curPunc2 == "{") pushContext$e(state, stream.column(), "}");
      else if (curPunc2 == "[") pushContext$e(state, stream.column(), "]");
      else if (curPunc2 == "(") pushContext$e(state, stream.column(), ")");
      else if (curPunc2 == "}") {
        while (ctx.type == "statement") ctx = popContext$e(state);
        if (ctx.type == "}") ctx = popContext$e(state);
        while (ctx.type == "statement") ctx = popContext$e(state);
      } else if (curPunc2 == ctx.type) popContext$e(state);
      else if (indentStatements2 && ((ctx.type == "}" || ctx.type == "top") && curPunc2 != ";" || ctx.type == "statement" && curPunc2 == "newstatement")) {
        pushContext$e(state, stream.column(), "statement", stream.current());
      }
      if (style2 == "variable" && (state.prevToken == "def" || parserConfig2.typeFirstDefinitions && typeBefore(stream, state, stream.start) && isTopScope(state.context) && stream.match(/^\s*\(/, false)))
        style2 = "def";
      if (hooks2.token) {
        var result = hooks2.token(stream, state, style2);
        if (result !== void 0) style2 = result;
      }
      if (style2 == "def" && parserConfig2.styleDefs === false) style2 = "variable";
      state.startOfLine = false;
      state.prevToken = isDefKeyword ? "def" : style2 || curPunc2;
      maybeEOL(stream, state);
      return style2;
    },
    indent: function(state, textAfter, context) {
      if (state.tokenize != tokenBase2 && state.tokenize != null || state.typeAtEndOfLine && isTopScope(state.context))
        return null;
      var ctx = state.context, firstChar = textAfter && textAfter.charAt(0);
      var closing2 = firstChar == ctx.type;
      if (ctx.type == "statement" && firstChar == "}") ctx = ctx.prev;
      if (parserConfig2.dontIndentStatements)
        while (ctx.type == "statement" && parserConfig2.dontIndentStatements.test(ctx.info))
          ctx = ctx.prev;
      if (hooks2.indent) {
        var hook = hooks2.indent(state, ctx, textAfter, context.unit);
        if (typeof hook == "number") return hook;
      }
      var switchBlock = ctx.prev && ctx.prev.info == "switch";
      if (parserConfig2.allmanIndentation && /[{(]/.test(firstChar)) {
        while (ctx.type != "top" && ctx.type != "}") ctx = ctx.prev;
        return ctx.indented;
      }
      if (ctx.type == "statement")
        return ctx.indented + (firstChar == "{" ? 0 : statementIndentUnit2 || context.unit);
      if (ctx.align && (!dontAlignCalls || ctx.type != ")"))
        return ctx.column + (closing2 ? 0 : 1);
      if (ctx.type == ")" && !closing2)
        return ctx.indented + (statementIndentUnit2 || context.unit);
      return ctx.indented + (closing2 ? 0 : context.unit) + (!closing2 && switchBlock && !/^(?:case|default)\b/.test(textAfter) ? context.unit : 0);
    },
    languageData: {
      indentOnInput: indentSwitch ? /^\s*(?:case .*?:|default:|\{\}?|\})$/ : /^\s*[{}]$/,
      commentTokens: { line: "//", block: { open: "/*", close: "*/" } },
      autocomplete: Object.keys(keywords2).concat(Object.keys(types2)).concat(Object.keys(builtin2)).concat(Object.keys(atoms2)),
      ...parserConfig2.languageData
    }
  };
}
function words$j(str) {
  var obj = {}, words2 = str.split(" ");
  for (var i2 = 0; i2 < words2.length; ++i2) obj[words2[i2]] = true;
  return obj;
}
function contains(words2, word) {
  if (typeof words2 === "function") {
    return words2(word);
  } else {
    return words2.propertyIsEnumerable(word);
  }
}
var cKeywords = "auto if break case register continue return default do sizeof static else struct switch extern typedef union for goto while enum const volatile inline restrict asm fortran";
var cppKeywords = "alignas alignof and and_eq audit axiom bitand bitor catch class compl concept constexpr const_cast decltype delete dynamic_cast explicit export final friend import module mutable namespace new noexcept not not_eq operator or or_eq override private protected public reinterpret_cast requires static_assert static_cast template this thread_local throw try typeid typename using virtual xor xor_eq";
var objCKeywords = "bycopy byref in inout oneway out self super atomic nonatomic retain copy readwrite readonly strong weak assign typeof nullable nonnull null_resettable _cmd @interface @implementation @end @protocol @encode @property @synthesize @dynamic @class @public @package @private @protected @required @optional @try @catch @finally @import @selector @encode @defs @synchronized @autoreleasepool @compatibility_alias @available";
var objCBuiltins = "FOUNDATION_EXPORT FOUNDATION_EXTERN NS_INLINE NS_FORMAT_FUNCTION  NS_RETURNS_RETAINEDNS_ERROR_ENUM NS_RETURNS_NOT_RETAINED NS_RETURNS_INNER_POINTER NS_DESIGNATED_INITIALIZER NS_ENUM NS_OPTIONS NS_REQUIRES_NIL_TERMINATION NS_ASSUME_NONNULL_BEGIN NS_ASSUME_NONNULL_END NS_SWIFT_NAME NS_REFINED_FOR_SWIFT";
var basicCTypes = words$j("int long char short double float unsigned signed void bool");
var basicObjCTypes = words$j("SEL instancetype id Class Protocol BOOL");
function cTypes(identifier2) {
  return contains(basicCTypes, identifier2) || /.+_t$/.test(identifier2);
}
function objCTypes(identifier2) {
  return cTypes(identifier2) || contains(basicObjCTypes, identifier2);
}
var cBlockKeywords = "case do else for if switch while struct enum union";
var cDefKeywords = "struct enum union";
function cppHook(stream, state) {
  if (!state.startOfLine) return false;
  for (var ch2, next2 = null; ch2 = stream.peek(); ) {
    if (ch2 == "\\" && stream.match(/^.$/)) {
      next2 = cppHook;
      break;
    } else if (ch2 == "/" && stream.match(/^\/[\/\*]/, false)) {
      break;
    }
    stream.next();
  }
  state.tokenize = next2;
  return "meta";
}
function pointerHook(_stream, state) {
  if (state.prevToken == "type") return "type";
  return false;
}
function cIsReservedIdentifier(token) {
  if (!token || token.length < 2) return false;
  if (token[0] != "_") return false;
  return token[1] == "_" || token[1] !== token[1].toLowerCase();
}
function cpp14Literal(stream) {
  stream.eatWhile(/[\w\.']/);
  return "number";
}
function cpp11StringHook(stream, state) {
  stream.backUp(1);
  if (stream.match(/^(?:R|u8R|uR|UR|LR)/)) {
    var match = stream.match(/^"([^\s\\()]{0,16})\(/);
    if (!match) {
      return false;
    }
    state.cpp11RawStringDelim = match[1];
    state.tokenize = tokenRawString;
    return tokenRawString(stream, state);
  }
  if (stream.match(/^(?:u8|u|U|L)/)) {
    if (stream.match(
      /^["']/,
      /* eat */
      false
    )) {
      return "string";
    }
    return false;
  }
  stream.next();
  return false;
}
function cppLooksLikeConstructor(word) {
  var lastTwo = /(\w+)::~?(\w+)$/.exec(word);
  return lastTwo && lastTwo[1] == lastTwo[2];
}
function tokenAtString(stream, state) {
  var next2;
  while ((next2 = stream.next()) != null) {
    if (next2 == '"' && !stream.eat('"')) {
      state.tokenize = null;
      break;
    }
  }
  return "string";
}
function tokenRawString(stream, state) {
  var delim = state.cpp11RawStringDelim.replace(/[^\w\s]/g, "\\$&");
  var match = stream.match(new RegExp(".*?\\)" + delim + '"'));
  if (match)
    state.tokenize = null;
  else
    stream.skipToEnd();
  return "string";
}
clike({
  name: "c",
  keywords: words$j(cKeywords),
  types: cTypes,
  blockKeywords: words$j(cBlockKeywords),
  defKeywords: words$j(cDefKeywords),
  typeFirstDefinitions: true,
  atoms: words$j("NULL true false"),
  isReservedIdentifier: cIsReservedIdentifier,
  hooks: {
    "#": cppHook,
    "*": pointerHook
  }
});
clike({
  name: "cpp",
  keywords: words$j(cKeywords + " " + cppKeywords),
  types: cTypes,
  blockKeywords: words$j(cBlockKeywords + " class try catch"),
  defKeywords: words$j(cDefKeywords + " class namespace"),
  typeFirstDefinitions: true,
  atoms: words$j("true false NULL nullptr"),
  dontIndentStatements: /^template$/,
  isIdentifierChar: /[\w\$_~\xa1-\uffff]/,
  isReservedIdentifier: cIsReservedIdentifier,
  hooks: {
    "#": cppHook,
    "*": pointerHook,
    "u": cpp11StringHook,
    "U": cpp11StringHook,
    "L": cpp11StringHook,
    "R": cpp11StringHook,
    "0": cpp14Literal,
    "1": cpp14Literal,
    "2": cpp14Literal,
    "3": cpp14Literal,
    "4": cpp14Literal,
    "5": cpp14Literal,
    "6": cpp14Literal,
    "7": cpp14Literal,
    "8": cpp14Literal,
    "9": cpp14Literal,
    token: function(stream, state, style2) {
      if (style2 == "variable" && stream.peek() == "(" && (state.prevToken == ";" || state.prevToken == null || state.prevToken == "}") && cppLooksLikeConstructor(stream.current()))
        return "def";
    }
  },
  namespaceSeparator: "::"
});
clike({
  name: "java",
  keywords: words$j("abstract assert break case catch class const continue default do else enum extends final finally for goto if implements import instanceof interface native new package private protected public return static strictfp super switch synchronized this throw throws transient try volatile while @interface"),
  types: words$j("var byte short int long float double boolean char void Boolean Byte Character Double Float Integer Long Number Object Short String StringBuffer StringBuilder Void"),
  blockKeywords: words$j("catch class do else finally for if switch try while"),
  defKeywords: words$j("class interface enum @interface"),
  typeFirstDefinitions: true,
  atoms: words$j("true false null"),
  number: /^(?:0x[a-f\d_]+|0b[01_]+|(?:[\d_]+\.?\d*|\.\d+)(?:e[-+]?[\d_]+)?)(u|ll?|l|f)?/i,
  hooks: {
    "@": function(stream) {
      if (stream.match("interface", false)) return false;
      stream.eatWhile(/[\w\$_]/);
      return "meta";
    },
    '"': function(stream, state) {
      if (!stream.match(/""$/)) return false;
      state.tokenize = tokenTripleString;
      return state.tokenize(stream, state);
    }
  }
});
const csharp = clike({
  name: "csharp",
  keywords: words$j("abstract as async await base break case catch checked class const continue default delegate do else enum event explicit extern finally fixed for foreach goto if implicit in init interface internal is lock namespace new operator out override params private protected public readonly record ref required return sealed sizeof stackalloc static struct switch this throw try typeof unchecked unsafe using virtual void volatile while add alias ascending descending dynamic from get global group into join let orderby partial remove select set value var yield"),
  types: words$j("Action Boolean Byte Char DateTime DateTimeOffset Decimal Double Func Guid Int16 Int32 Int64 Object SByte Single String Task TimeSpan UInt16 UInt32 UInt64 bool byte char decimal double short int long object sbyte float string ushort uint ulong"),
  blockKeywords: words$j("catch class do else finally for foreach if struct switch try while"),
  defKeywords: words$j("class interface namespace record struct var"),
  typeFirstDefinitions: true,
  atoms: words$j("true false null"),
  hooks: {
    "@": function(stream, state) {
      if (stream.eat('"')) {
        state.tokenize = tokenAtString;
        return tokenAtString(stream, state);
      }
      stream.eatWhile(/[\w\$_]/);
      return "meta";
    }
  }
});
function tokenTripleString(stream, state) {
  var escaped = false;
  while (!stream.eol()) {
    if (!escaped && stream.match('"""')) {
      state.tokenize = null;
      break;
    }
    escaped = stream.next() == "\\" && !escaped;
  }
  return "string";
}
function tokenNestedComment$1(depth) {
  return function(stream, state) {
    var ch2;
    while (ch2 = stream.next()) {
      if (ch2 == "*" && stream.eat("/")) {
        if (depth == 1) {
          state.tokenize = null;
          break;
        } else {
          state.tokenize = tokenNestedComment$1(depth - 1);
          return state.tokenize(stream, state);
        }
      } else if (ch2 == "/" && stream.eat("*")) {
        state.tokenize = tokenNestedComment$1(depth + 1);
        return state.tokenize(stream, state);
      }
    }
    return "comment";
  };
}
const scala = clike({
  name: "scala",
  keywords: words$j(
    /* scala */
    "abstract case catch class def do else extends final finally for forSome if implicit import lazy match new null object override package private protected return sealed super this throw trait try type val var while with yield _ assert assume require print println printf readLine readBoolean readByte readShort readChar readInt readLong readFloat readDouble"
  ),
  types: words$j(
    "AnyVal App Application Array BufferedIterator BigDecimal BigInt Char Console Either Enumeration Equiv Error Exception Fractional Function IndexedSeq Int Integral Iterable Iterator List Map Numeric Nil NotNull Option Ordered Ordering PartialFunction PartialOrdering Product Proxy Range Responder Seq Serializable Set Specializable Stream StringBuilder StringContext Symbol Throwable Traversable TraversableOnce Tuple Unit Vector Boolean Byte Character CharSequence Class ClassLoader Cloneable Comparable Compiler Double Exception Float Integer Long Math Number Object Package Pair Process Runtime Runnable SecurityManager Short StackTraceElement StrictMath String StringBuffer System Thread ThreadGroup ThreadLocal Throwable Triple Void"
  ),
  multiLineStrings: true,
  blockKeywords: words$j("catch class enum do else finally for forSome if match switch try while"),
  defKeywords: words$j("class enum def object package trait type val var"),
  atoms: words$j("true false null"),
  indentStatements: false,
  indentSwitch: false,
  isOperatorChar: /[+\-*&%=<>!?|\/#:@]/,
  hooks: {
    "@": function(stream) {
      stream.eatWhile(/[\w\$_]/);
      return "meta";
    },
    '"': function(stream, state) {
      if (!stream.match('""')) return false;
      state.tokenize = tokenTripleString;
      return state.tokenize(stream, state);
    },
    "'": function(stream) {
      if (stream.match(/^(\\[^'\s]+|[^\\'])'/)) return "character";
      stream.eatWhile(/[\w\$_\xa1-\uffff]/);
      return "atom";
    },
    "=": function(stream, state) {
      var cx2 = state.context;
      if (cx2.type == "}" && cx2.align && stream.eat(">")) {
        state.context = new Context$a(cx2.indented, cx2.column, cx2.type, cx2.info, null, cx2.prev);
        return "operator";
      } else {
        return false;
      }
    },
    "/": function(stream, state) {
      if (!stream.eat("*")) return false;
      state.tokenize = tokenNestedComment$1(1);
      return state.tokenize(stream, state);
    }
  },
  languageData: {
    closeBrackets: { brackets: ["(", "[", "{", "'", '"', '"""'] }
  }
});
function tokenKotlinString(tripleString) {
  return function(stream, state) {
    var escaped = false, next2, end2 = false;
    while (!stream.eol()) {
      if (!tripleString && !escaped && stream.match('"')) {
        end2 = true;
        break;
      }
      if (tripleString && stream.match('"""')) {
        end2 = true;
        break;
      }
      next2 = stream.next();
      if (!escaped && next2 == "$" && stream.match("{"))
        stream.skipTo("}");
      escaped = !escaped && next2 == "\\" && !tripleString;
    }
    if (end2 || !tripleString)
      state.tokenize = null;
    return "string";
  };
}
const kotlin = clike({
  name: "kotlin",
  keywords: words$j(
    /*keywords*/
    "package as typealias class interface this super val operator var fun for is in This throw return annotation break continue object if else while do try when !in !is as? file import where by get set abstract enum open inner override private public internal protected catch finally out final vararg reified dynamic companion constructor init sealed field property receiver param sparam lateinit data inline noinline tailrec external annotation crossinline const operator infix suspend actual expect setparam"
  ),
  types: words$j(
    /* package java.lang */
    "Boolean Byte Character CharSequence Class ClassLoader Cloneable Comparable Compiler Double Exception Float Integer Long Math Number Object Package Pair Process Runtime Runnable SecurityManager Short StackTraceElement StrictMath String StringBuffer System Thread ThreadGroup ThreadLocal Throwable Triple Void Annotation Any BooleanArray ByteArray Char CharArray DeprecationLevel DoubleArray Enum FloatArray Function Int IntArray Lazy LazyThreadSafetyMode LongArray Nothing ShortArray Unit"
  ),
  indentStatements: false,
  multiLineStrings: true,
  number: /^(?:0x[a-f\d_]+|0b[01_]+|(?:[\d_]+(\.\d+)?|\.\d+)(?:e[-+]?[\d_]+)?)(ul?|l|f)?/i,
  blockKeywords: words$j("catch class do else finally for if where try while enum"),
  defKeywords: words$j("class val var object interface fun"),
  atoms: words$j("true false null this"),
  hooks: {
    "@": function(stream) {
      stream.eatWhile(/[\w\$_]/);
      return "meta";
    },
    "*": function(_stream, state) {
      return state.prevToken == "." ? "variable" : "operator";
    },
    '"': function(stream, state) {
      state.tokenize = tokenKotlinString(stream.match('""'));
      return state.tokenize(stream, state);
    },
    "/": function(stream, state) {
      if (!stream.eat("*")) return false;
      state.tokenize = tokenNestedComment$1(1);
      return state.tokenize(stream, state);
    },
    indent: function(state, ctx, textAfter, indentUnit) {
      var firstChar = textAfter && textAfter.charAt(0);
      if ((state.prevToken == "}" || state.prevToken == ")") && textAfter == "")
        return state.indented;
      if (state.prevToken == "operator" && textAfter != "}" && state.context.type != "}" || state.prevToken == "variable" && firstChar == "." || (state.prevToken == "}" || state.prevToken == ")") && firstChar == ".")
        return indentUnit * 2 + ctx.indented;
      if (ctx.align && ctx.type == "}")
        return ctx.indented + (state.context.type == (textAfter || "").charAt(0) ? 0 : indentUnit);
    }
  },
  languageData: {
    closeBrackets: { brackets: ["(", "[", "{", "'", '"', '"""'] }
  }
});
clike({
  name: "shader",
  keywords: words$j("sampler1D sampler2D sampler3D samplerCube sampler1DShadow sampler2DShadow const attribute uniform varying break continue discard return for while do if else struct in out inout"),
  types: words$j("float int bool void vec2 vec3 vec4 ivec2 ivec3 ivec4 bvec2 bvec3 bvec4 mat2 mat3 mat4"),
  blockKeywords: words$j("for while do if else struct"),
  builtin: words$j("radians degrees sin cos tan asin acos atan pow exp log exp2 sqrt inversesqrt abs sign floor ceil fract mod min max clamp mix step smoothstep length distance dot cross normalize ftransform faceforward reflect refract matrixCompMult lessThan lessThanEqual greaterThan greaterThanEqual equal notEqual any all not texture1D texture1DProj texture1DLod texture1DProjLod texture2D texture2DProj texture2DLod texture2DProjLod texture3D texture3DProj texture3DLod texture3DProjLod textureCube textureCubeLod shadow1D shadow2D shadow1DProj shadow2DProj shadow1DLod shadow2DLod shadow1DProjLod shadow2DProjLod dFdx dFdy fwidth noise1 noise2 noise3 noise4"),
  atoms: words$j("true false gl_FragColor gl_SecondaryColor gl_Normal gl_Vertex gl_MultiTexCoord0 gl_MultiTexCoord1 gl_MultiTexCoord2 gl_MultiTexCoord3 gl_MultiTexCoord4 gl_MultiTexCoord5 gl_MultiTexCoord6 gl_MultiTexCoord7 gl_FogCoord gl_PointCoord gl_Position gl_PointSize gl_ClipVertex gl_FrontColor gl_BackColor gl_FrontSecondaryColor gl_BackSecondaryColor gl_TexCoord gl_FogFragCoord gl_FragCoord gl_FrontFacing gl_FragData gl_FragDepth gl_ModelViewMatrix gl_ProjectionMatrix gl_ModelViewProjectionMatrix gl_TextureMatrix gl_NormalMatrix gl_ModelViewMatrixInverse gl_ProjectionMatrixInverse gl_ModelViewProjectionMatrixInverse gl_TextureMatrixTranspose gl_ModelViewMatrixInverseTranspose gl_ProjectionMatrixInverseTranspose gl_ModelViewProjectionMatrixInverseTranspose gl_TextureMatrixInverseTranspose gl_NormalScale gl_DepthRange gl_ClipPlane gl_Point gl_FrontMaterial gl_BackMaterial gl_LightSource gl_LightModel gl_FrontLightModelProduct gl_BackLightModelProduct gl_TextureColor gl_EyePlaneS gl_EyePlaneT gl_EyePlaneR gl_EyePlaneQ gl_FogParameters gl_MaxLights gl_MaxClipPlanes gl_MaxTextureUnits gl_MaxTextureCoords gl_MaxVertexAttribs gl_MaxVertexUniformComponents gl_MaxVaryingFloats gl_MaxVertexTextureImageUnits gl_MaxTextureImageUnits gl_MaxFragmentUniformComponents gl_MaxCombineTextureImageUnits gl_MaxDrawBuffers"),
  indentSwitch: false,
  hooks: { "#": cppHook }
});
clike({
  name: "nesc",
  keywords: words$j(cKeywords + " as atomic async call command component components configuration event generic implementation includes interface module new norace nx_struct nx_union post provides signal task uses abstract extends"),
  types: cTypes,
  blockKeywords: words$j(cBlockKeywords),
  atoms: words$j("null true false"),
  hooks: { "#": cppHook }
});
const objectiveC = clike({
  name: "objectivec",
  keywords: words$j(cKeywords + " " + objCKeywords),
  types: objCTypes,
  builtin: words$j(objCBuiltins),
  blockKeywords: words$j(cBlockKeywords + " @synthesize @try @catch @finally @autoreleasepool @synchronized"),
  defKeywords: words$j(cDefKeywords + " @interface @implementation @protocol @class"),
  dontIndentStatements: /^@.*$/,
  typeFirstDefinitions: true,
  atoms: words$j("YES NO NULL Nil nil true false nullptr"),
  isReservedIdentifier: cIsReservedIdentifier,
  hooks: {
    "#": cppHook,
    "*": pointerHook
  }
});
const objectiveCpp = clike({
  name: "objectivecpp",
  keywords: words$j(cKeywords + " " + objCKeywords + " " + cppKeywords),
  types: objCTypes,
  builtin: words$j(objCBuiltins),
  blockKeywords: words$j(cBlockKeywords + " @synthesize @try @catch @finally @autoreleasepool @synchronized class try catch"),
  defKeywords: words$j(cDefKeywords + " @interface @implementation @protocol @class class namespace"),
  dontIndentStatements: /^@.*$|^template$/,
  typeFirstDefinitions: true,
  atoms: words$j("YES NO NULL Nil nil true false nullptr"),
  isReservedIdentifier: cIsReservedIdentifier,
  hooks: {
    "#": cppHook,
    "*": pointerHook,
    "u": cpp11StringHook,
    "U": cpp11StringHook,
    "L": cpp11StringHook,
    "R": cpp11StringHook,
    "0": cpp14Literal,
    "1": cpp14Literal,
    "2": cpp14Literal,
    "3": cpp14Literal,
    "4": cpp14Literal,
    "5": cpp14Literal,
    "6": cpp14Literal,
    "7": cpp14Literal,
    "8": cpp14Literal,
    "9": cpp14Literal,
    token: function(stream, state, style2) {
      if (style2 == "variable" && stream.peek() == "(" && (state.prevToken == ";" || state.prevToken == null || state.prevToken == "}") && cppLooksLikeConstructor(stream.current()))
        return "def";
    }
  },
  namespaceSeparator: "::"
});
const squirrel = clike({
  name: "squirrel",
  keywords: words$j("base break clone continue const default delete enum extends function in class foreach local resume return this throw typeof yield constructor instanceof static"),
  types: cTypes,
  blockKeywords: words$j("case catch class else for foreach if switch try while"),
  defKeywords: words$j("function local class"),
  typeFirstDefinitions: true,
  atoms: words$j("true false null"),
  hooks: { "#": cppHook }
});
var stringTokenizer = null;
function tokenCeylonString(type2) {
  return function(stream, state) {
    var escaped = false, next2, end2 = false;
    while (!stream.eol()) {
      if (!escaped && stream.match('"') && (type2 == "single" || stream.match('""'))) {
        end2 = true;
        break;
      }
      if (!escaped && stream.match("``")) {
        stringTokenizer = tokenCeylonString(type2);
        end2 = true;
        break;
      }
      next2 = stream.next();
      escaped = type2 == "single" && !escaped && next2 == "\\";
    }
    if (end2)
      state.tokenize = null;
    return "string";
  };
}
clike({
  name: "ceylon",
  keywords: words$j("abstracts alias assembly assert assign break case catch class continue dynamic else exists extends finally for function given if import in interface is let module new nonempty object of out outer package return satisfies super switch then this throw try value void while"),
  types: function(word) {
    var first = word.charAt(0);
    return first === first.toUpperCase() && first !== first.toLowerCase();
  },
  blockKeywords: words$j("case catch class dynamic else finally for function if interface module new object switch try while"),
  defKeywords: words$j("class dynamic function interface module object package value"),
  builtin: words$j("abstract actual aliased annotation by default deprecated doc final formal late license native optional sealed see serializable shared suppressWarnings tagged throws variable"),
  isPunctuationChar: /[\[\]{}\(\),;\:\.`]/,
  isOperatorChar: /[+\-*&%=<>!?|^~:\/]/,
  numberStart: /[\d#$]/,
  number: /^(?:#[\da-fA-F_]+|\$[01_]+|[\d_]+[kMGTPmunpf]?|[\d_]+\.[\d_]+(?:[eE][-+]?\d+|[kMGTPmunpf]|)|)/i,
  multiLineStrings: true,
  typeFirstDefinitions: true,
  atoms: words$j("true false null larger smaller equal empty finished"),
  indentSwitch: false,
  styleDefs: false,
  hooks: {
    "@": function(stream) {
      stream.eatWhile(/[\w\$_]/);
      return "meta";
    },
    '"': function(stream, state) {
      state.tokenize = tokenCeylonString(stream.match('""') ? "triple" : "single");
      return state.tokenize(stream, state);
    },
    "`": function(stream, state) {
      if (!stringTokenizer || !stream.match("`")) return false;
      state.tokenize = stringTokenizer;
      stringTokenizer = null;
      return state.tokenize(stream, state);
    },
    "'": function(stream) {
      if (stream.match(/^(\\[^'\s]+|[^\\'])'/)) return "string.special";
      stream.eatWhile(/[\w\$_\xa1-\uffff]/);
      return "atom";
    },
    token: function(_stream, state, style2) {
      if ((style2 == "variable" || style2 == "type") && state.prevToken == ".") {
        return "variableName.special";
      }
    }
  },
  languageData: {
    closeBrackets: { brackets: ["(", "[", "{", "'", '"', '"""'] }
  }
});
function pushInterpolationStack(state) {
  (state.interpolationStack || (state.interpolationStack = [])).push(state.tokenize);
}
function popInterpolationStack(state) {
  return (state.interpolationStack || (state.interpolationStack = [])).pop();
}
function sizeInterpolationStack(state) {
  return state.interpolationStack ? state.interpolationStack.length : 0;
}
function tokenDartString(quote2, stream, state, raw) {
  var tripleQuoted = false;
  if (stream.eat(quote2)) {
    if (stream.eat(quote2)) tripleQuoted = true;
    else return "string";
  }
  function tokenStringHelper(stream2, state2) {
    var escaped = false;
    while (!stream2.eol()) {
      if (!raw && !escaped && stream2.peek() == "$") {
        pushInterpolationStack(state2);
        state2.tokenize = tokenInterpolation$1;
        return "string";
      }
      var next2 = stream2.next();
      if (next2 == quote2 && !escaped && (!tripleQuoted || stream2.match(quote2 + quote2))) {
        state2.tokenize = null;
        break;
      }
      escaped = !raw && !escaped && next2 == "\\";
    }
    return "string";
  }
  state.tokenize = tokenStringHelper;
  return tokenStringHelper(stream, state);
}
function tokenInterpolation$1(stream, state) {
  stream.eat("$");
  if (stream.eat("{")) {
    state.tokenize = null;
  } else {
    state.tokenize = tokenInterpolationIdentifier;
  }
  return null;
}
function tokenInterpolationIdentifier(stream, state) {
  stream.eatWhile(/[\w_]/);
  state.tokenize = popInterpolationStack(state);
  return "variable";
}
const dart = clike({
  name: "dart",
  keywords: words$j("this super static final const abstract class extends external factory implements mixin get native set typedef with enum throw rethrow assert break case continue default in return new deferred async await covariant try catch finally do else for if switch while import library export part of show hide is as extension on yield late required sealed base interface when inline"),
  blockKeywords: words$j("try catch finally do else for if switch while"),
  builtin: words$j("void bool num int double dynamic var String Null Never"),
  atoms: words$j("true false null"),
  // clike numbers without the suffixes, and with '_' separators.
  number: /^(?:0x[a-f\d_]+|(?:[\d_]+\.?[\d_]*|\.[\d_]+)(?:e[-+]?[\d_]+)?)/i,
  hooks: {
    "@": function(stream) {
      stream.eatWhile(/[\w\$_\.]/);
      return "meta";
    },
    // custom string handling to deal with triple-quoted strings and string interpolation
    "'": function(stream, state) {
      return tokenDartString("'", stream, state, false);
    },
    '"': function(stream, state) {
      return tokenDartString('"', stream, state, false);
    },
    "r": function(stream, state) {
      var peek = stream.peek();
      if (peek == "'" || peek == '"') {
        return tokenDartString(stream.next(), stream, state, true);
      }
      return false;
    },
    "}": function(_stream, state) {
      if (sizeInterpolationStack(state) > 0) {
        state.tokenize = popInterpolationStack(state);
        return null;
      }
      return false;
    },
    "/": function(stream, state) {
      if (!stream.eat("*")) return false;
      state.tokenize = tokenNestedComment$1(1);
      return state.tokenize(stream, state);
    },
    token: function(stream, _, style2) {
      if (style2 == "variable") {
        var isUpper = RegExp("^[_$]*[A-Z][a-zA-Z0-9_$]*$", "g");
        if (isUpper.test(stream.current())) {
          return "type";
        }
      }
    }
  }
});
const clike$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  clike,
  csharp,
  dart,
  kotlin,
  objectiveC,
  objectiveCpp,
  scala,
  squirrel
});
var atoms$c = ["false", "nil", "true"];
var specialForms = [
  ".",
  "catch",
  "def",
  "do",
  "if",
  "monitor-enter",
  "monitor-exit",
  "new",
  "quote",
  "recur",
  "set!",
  "throw",
  "try",
  "var"
];
var coreSymbols = [
  "*",
  "*'",
  "*1",
  "*2",
  "*3",
  "*agent*",
  "*allow-unresolved-vars*",
  "*assert*",
  "*clojure-version*",
  "*command-line-args*",
  "*compile-files*",
  "*compile-path*",
  "*compiler-options*",
  "*data-readers*",
  "*default-data-reader-fn*",
  "*e",
  "*err*",
  "*file*",
  "*flush-on-newline*",
  "*fn-loader*",
  "*in*",
  "*math-context*",
  "*ns*",
  "*out*",
  "*print-dup*",
  "*print-length*",
  "*print-level*",
  "*print-meta*",
  "*print-namespace-maps*",
  "*print-readably*",
  "*read-eval*",
  "*reader-resolver*",
  "*source-path*",
  "*suppress-read*",
  "*unchecked-math*",
  "*use-context-classloader*",
  "*verbose-defrecords*",
  "*warn-on-reflection*",
  "+",
  "+'",
  "-",
  "-'",
  "->",
  "->>",
  "->ArrayChunk",
  "->Eduction",
  "->Vec",
  "->VecNode",
  "->VecSeq",
  "-cache-protocol-fn",
  "-reset-methods",
  "..",
  "/",
  "<",
  "<=",
  "=",
  "==",
  ">",
  ">=",
  "EMPTY-NODE",
  "Inst",
  "StackTraceElement->vec",
  "Throwable->map",
  "accessor",
  "aclone",
  "add-classpath",
  "add-watch",
  "agent",
  "agent-error",
  "agent-errors",
  "aget",
  "alength",
  "alias",
  "all-ns",
  "alter",
  "alter-meta!",
  "alter-var-root",
  "amap",
  "ancestors",
  "and",
  "any?",
  "apply",
  "areduce",
  "array-map",
  "as->",
  "aset",
  "aset-boolean",
  "aset-byte",
  "aset-char",
  "aset-double",
  "aset-float",
  "aset-int",
  "aset-long",
  "aset-short",
  "assert",
  "assoc",
  "assoc!",
  "assoc-in",
  "associative?",
  "atom",
  "await",
  "await-for",
  "await1",
  "bases",
  "bean",
  "bigdec",
  "bigint",
  "biginteger",
  "binding",
  "bit-and",
  "bit-and-not",
  "bit-clear",
  "bit-flip",
  "bit-not",
  "bit-or",
  "bit-set",
  "bit-shift-left",
  "bit-shift-right",
  "bit-test",
  "bit-xor",
  "boolean",
  "boolean-array",
  "boolean?",
  "booleans",
  "bound-fn",
  "bound-fn*",
  "bound?",
  "bounded-count",
  "butlast",
  "byte",
  "byte-array",
  "bytes",
  "bytes?",
  "case",
  "cast",
  "cat",
  "char",
  "char-array",
  "char-escape-string",
  "char-name-string",
  "char?",
  "chars",
  "chunk",
  "chunk-append",
  "chunk-buffer",
  "chunk-cons",
  "chunk-first",
  "chunk-next",
  "chunk-rest",
  "chunked-seq?",
  "class",
  "class?",
  "clear-agent-errors",
  "clojure-version",
  "coll?",
  "comment",
  "commute",
  "comp",
  "comparator",
  "compare",
  "compare-and-set!",
  "compile",
  "complement",
  "completing",
  "concat",
  "cond",
  "cond->",
  "cond->>",
  "condp",
  "conj",
  "conj!",
  "cons",
  "constantly",
  "construct-proxy",
  "contains?",
  "count",
  "counted?",
  "create-ns",
  "create-struct",
  "cycle",
  "dec",
  "dec'",
  "decimal?",
  "declare",
  "dedupe",
  "default-data-readers",
  "definline",
  "definterface",
  "defmacro",
  "defmethod",
  "defmulti",
  "defn",
  "defn-",
  "defonce",
  "defprotocol",
  "defrecord",
  "defstruct",
  "deftype",
  "delay",
  "delay?",
  "deliver",
  "denominator",
  "deref",
  "derive",
  "descendants",
  "destructure",
  "disj",
  "disj!",
  "dissoc",
  "dissoc!",
  "distinct",
  "distinct?",
  "doall",
  "dorun",
  "doseq",
  "dosync",
  "dotimes",
  "doto",
  "double",
  "double-array",
  "double?",
  "doubles",
  "drop",
  "drop-last",
  "drop-while",
  "eduction",
  "empty",
  "empty?",
  "ensure",
  "ensure-reduced",
  "enumeration-seq",
  "error-handler",
  "error-mode",
  "eval",
  "even?",
  "every-pred",
  "every?",
  "ex-data",
  "ex-info",
  "extend",
  "extend-protocol",
  "extend-type",
  "extenders",
  "extends?",
  "false?",
  "ffirst",
  "file-seq",
  "filter",
  "filterv",
  "find",
  "find-keyword",
  "find-ns",
  "find-protocol-impl",
  "find-protocol-method",
  "find-var",
  "first",
  "flatten",
  "float",
  "float-array",
  "float?",
  "floats",
  "flush",
  "fn",
  "fn?",
  "fnext",
  "fnil",
  "for",
  "force",
  "format",
  "frequencies",
  "future",
  "future-call",
  "future-cancel",
  "future-cancelled?",
  "future-done?",
  "future?",
  "gen-class",
  "gen-interface",
  "gensym",
  "get",
  "get-in",
  "get-method",
  "get-proxy-class",
  "get-thread-bindings",
  "get-validator",
  "group-by",
  "halt-when",
  "hash",
  "hash-combine",
  "hash-map",
  "hash-ordered-coll",
  "hash-set",
  "hash-unordered-coll",
  "ident?",
  "identical?",
  "identity",
  "if-let",
  "if-not",
  "if-some",
  "ifn?",
  "import",
  "in-ns",
  "inc",
  "inc'",
  "indexed?",
  "init-proxy",
  "inst-ms",
  "inst-ms*",
  "inst?",
  "instance?",
  "int",
  "int-array",
  "int?",
  "integer?",
  "interleave",
  "intern",
  "interpose",
  "into",
  "into-array",
  "ints",
  "io!",
  "isa?",
  "iterate",
  "iterator-seq",
  "juxt",
  "keep",
  "keep-indexed",
  "key",
  "keys",
  "keyword",
  "keyword?",
  "last",
  "lazy-cat",
  "lazy-seq",
  "let",
  "letfn",
  "line-seq",
  "list",
  "list*",
  "list?",
  "load",
  "load-file",
  "load-reader",
  "load-string",
  "loaded-libs",
  "locking",
  "long",
  "long-array",
  "longs",
  "loop",
  "macroexpand",
  "macroexpand-1",
  "make-array",
  "make-hierarchy",
  "map",
  "map-entry?",
  "map-indexed",
  "map?",
  "mapcat",
  "mapv",
  "max",
  "max-key",
  "memfn",
  "memoize",
  "merge",
  "merge-with",
  "meta",
  "method-sig",
  "methods",
  "min",
  "min-key",
  "mix-collection-hash",
  "mod",
  "munge",
  "name",
  "namespace",
  "namespace-munge",
  "nat-int?",
  "neg-int?",
  "neg?",
  "newline",
  "next",
  "nfirst",
  "nil?",
  "nnext",
  "not",
  "not-any?",
  "not-empty",
  "not-every?",
  "not=",
  "ns",
  "ns-aliases",
  "ns-imports",
  "ns-interns",
  "ns-map",
  "ns-name",
  "ns-publics",
  "ns-refers",
  "ns-resolve",
  "ns-unalias",
  "ns-unmap",
  "nth",
  "nthnext",
  "nthrest",
  "num",
  "number?",
  "numerator",
  "object-array",
  "odd?",
  "or",
  "parents",
  "partial",
  "partition",
  "partition-all",
  "partition-by",
  "pcalls",
  "peek",
  "persistent!",
  "pmap",
  "pop",
  "pop!",
  "pop-thread-bindings",
  "pos-int?",
  "pos?",
  "pr",
  "pr-str",
  "prefer-method",
  "prefers",
  "primitives-classnames",
  "print",
  "print-ctor",
  "print-dup",
  "print-method",
  "print-simple",
  "print-str",
  "printf",
  "println",
  "println-str",
  "prn",
  "prn-str",
  "promise",
  "proxy",
  "proxy-call-with-super",
  "proxy-mappings",
  "proxy-name",
  "proxy-super",
  "push-thread-bindings",
  "pvalues",
  "qualified-ident?",
  "qualified-keyword?",
  "qualified-symbol?",
  "quot",
  "rand",
  "rand-int",
  "rand-nth",
  "random-sample",
  "range",
  "ratio?",
  "rational?",
  "rationalize",
  "re-find",
  "re-groups",
  "re-matcher",
  "re-matches",
  "re-pattern",
  "re-seq",
  "read",
  "read-line",
  "read-string",
  "reader-conditional",
  "reader-conditional?",
  "realized?",
  "record?",
  "reduce",
  "reduce-kv",
  "reduced",
  "reduced?",
  "reductions",
  "ref",
  "ref-history-count",
  "ref-max-history",
  "ref-min-history",
  "ref-set",
  "refer",
  "refer-clojure",
  "reify",
  "release-pending-sends",
  "rem",
  "remove",
  "remove-all-methods",
  "remove-method",
  "remove-ns",
  "remove-watch",
  "repeat",
  "repeatedly",
  "replace",
  "replicate",
  "require",
  "reset!",
  "reset-meta!",
  "reset-vals!",
  "resolve",
  "rest",
  "restart-agent",
  "resultset-seq",
  "reverse",
  "reversible?",
  "rseq",
  "rsubseq",
  "run!",
  "satisfies?",
  "second",
  "select-keys",
  "send",
  "send-off",
  "send-via",
  "seq",
  "seq?",
  "seqable?",
  "seque",
  "sequence",
  "sequential?",
  "set",
  "set-agent-send-executor!",
  "set-agent-send-off-executor!",
  "set-error-handler!",
  "set-error-mode!",
  "set-validator!",
  "set?",
  "short",
  "short-array",
  "shorts",
  "shuffle",
  "shutdown-agents",
  "simple-ident?",
  "simple-keyword?",
  "simple-symbol?",
  "slurp",
  "some",
  "some->",
  "some->>",
  "some-fn",
  "some?",
  "sort",
  "sort-by",
  "sorted-map",
  "sorted-map-by",
  "sorted-set",
  "sorted-set-by",
  "sorted?",
  "special-symbol?",
  "spit",
  "split-at",
  "split-with",
  "str",
  "string?",
  "struct",
  "struct-map",
  "subs",
  "subseq",
  "subvec",
  "supers",
  "swap!",
  "swap-vals!",
  "symbol",
  "symbol?",
  "sync",
  "tagged-literal",
  "tagged-literal?",
  "take",
  "take-last",
  "take-nth",
  "take-while",
  "test",
  "the-ns",
  "thread-bound?",
  "time",
  "to-array",
  "to-array-2d",
  "trampoline",
  "transduce",
  "transient",
  "tree-seq",
  "true?",
  "type",
  "unchecked-add",
  "unchecked-add-int",
  "unchecked-byte",
  "unchecked-char",
  "unchecked-dec",
  "unchecked-dec-int",
  "unchecked-divide-int",
  "unchecked-double",
  "unchecked-float",
  "unchecked-inc",
  "unchecked-inc-int",
  "unchecked-int",
  "unchecked-long",
  "unchecked-multiply",
  "unchecked-multiply-int",
  "unchecked-negate",
  "unchecked-negate-int",
  "unchecked-remainder-int",
  "unchecked-short",
  "unchecked-subtract",
  "unchecked-subtract-int",
  "underive",
  "unquote",
  "unquote-splicing",
  "unreduced",
  "unsigned-bit-shift-right",
  "update",
  "update-in",
  "update-proxy",
  "uri?",
  "use",
  "uuid?",
  "val",
  "vals",
  "var-get",
  "var-set",
  "var?",
  "vary-meta",
  "vec",
  "vector",
  "vector-of",
  "vector?",
  "volatile!",
  "volatile?",
  "vreset!",
  "vswap!",
  "when",
  "when-first",
  "when-let",
  "when-not",
  "when-some",
  "while",
  "with-bindings",
  "with-bindings*",
  "with-in-str",
  "with-loading-context",
  "with-local-vars",
  "with-meta",
  "with-open",
  "with-out-str",
  "with-precision",
  "with-redefs",
  "with-redefs-fn",
  "xml-seq",
  "zero?",
  "zipmap"
];
var haveBodyParameter = [
  "->",
  "->>",
  "as->",
  "binding",
  "bound-fn",
  "case",
  "catch",
  "comment",
  "cond",
  "cond->",
  "cond->>",
  "condp",
  "def",
  "definterface",
  "defmethod",
  "defn",
  "defmacro",
  "defprotocol",
  "defrecord",
  "defstruct",
  "deftype",
  "do",
  "doseq",
  "dotimes",
  "doto",
  "extend",
  "extend-protocol",
  "extend-type",
  "fn",
  "for",
  "future",
  "if",
  "if-let",
  "if-not",
  "if-some",
  "let",
  "letfn",
  "locking",
  "loop",
  "ns",
  "proxy",
  "reify",
  "struct-map",
  "some->",
  "some->>",
  "try",
  "when",
  "when-first",
  "when-let",
  "when-not",
  "when-some",
  "while",
  "with-bindings",
  "with-bindings*",
  "with-in-str",
  "with-loading-context",
  "with-local-vars",
  "with-meta",
  "with-open",
  "with-out-str",
  "with-precision",
  "with-redefs",
  "with-redefs-fn"
];
var atom$1 = createLookupMap(atoms$c);
var specialForm$1 = createLookupMap(specialForms);
var coreSymbol = createLookupMap(coreSymbols);
var hasBodyParameter = createLookupMap(haveBodyParameter);
var delimiter = /^(?:[\\\[\]\s"(),;@^`{}~]|$)/;
var numberLiteral = /^(?:[+\-]?\d+(?:(?:N|(?:[eE][+\-]?\d+))|(?:\.?\d*(?:M|(?:[eE][+\-]?\d+))?)|\/\d+|[xX][0-9a-fA-F]+|r[0-9a-zA-Z]+)?(?=[\\\[\]\s"#'(),;@^`{}~]|$))/;
var characterLiteral = /^(?:\\(?:backspace|formfeed|newline|return|space|tab|o[0-7]{3}|u[0-9A-Fa-f]{4}|x[0-9A-Fa-f]{4}|.)?(?=[\\\[\]\s"(),;@^`{}~]|$))/;
var qualifiedSymbol = /^(?:(?:[^\\\/\[\]\d\s"#'(),;@^`{}~.][^\\\[\]\s"(),;@^`{}~.\/]*(?:\.[^\\\/\[\]\d\s"#'(),;@^`{}~.][^\\\[\]\s"(),;@^`{}~.\/]*)*\/)?(?:\/|[^\\\/\[\]\d\s"#'(),;@^`{}~][^\\\[\]\s"(),;@^`{}~]*)*(?=[\\\[\]\s"(),;@^`{}~]|$))/;
function base$1(stream, state) {
  if (stream.eatSpace() || stream.eat(",")) return ["space", null];
  if (stream.match(numberLiteral)) return [null, "number"];
  if (stream.match(characterLiteral)) return [null, "string.special"];
  if (stream.eat(/^"/)) return (state.tokenize = inString$1)(stream, state);
  if (stream.eat(/^[(\[{]/)) return ["open", "bracket"];
  if (stream.eat(/^[)\]}]/)) return ["close", "bracket"];
  if (stream.eat(/^;/)) {
    stream.skipToEnd();
    return ["space", "comment"];
  }
  if (stream.eat(/^[#'@^`~]/)) return [null, "meta"];
  var matches = stream.match(qualifiedSymbol);
  var symbol2 = matches && matches[0];
  if (!symbol2) {
    stream.next();
    stream.eatWhile(function(c) {
      return !is(c, delimiter);
    });
    return [null, "error"];
  }
  if (symbol2 === "comment" && state.lastToken === "(")
    return (state.tokenize = inComment$1)(stream, state);
  if (is(symbol2, atom$1) || symbol2.charAt(0) === ":") return ["symbol", "atom"];
  if (is(symbol2, specialForm$1) || is(symbol2, coreSymbol)) return ["symbol", "keyword"];
  if (state.lastToken === "(") return ["symbol", "builtin"];
  return ["symbol", "variable"];
}
function inString$1(stream, state) {
  var escaped = false, next2;
  while (next2 = stream.next()) {
    if (next2 === '"' && !escaped) {
      state.tokenize = base$1;
      break;
    }
    escaped = !escaped && next2 === "\\";
  }
  return [null, "string"];
}
function inComment$1(stream, state) {
  var parenthesisCount = 1;
  var next2;
  while (next2 = stream.next()) {
    if (next2 === ")") parenthesisCount--;
    if (next2 === "(") parenthesisCount++;
    if (parenthesisCount === 0) {
      stream.backUp(1);
      state.tokenize = base$1;
      break;
    }
  }
  return ["space", "comment"];
}
function createLookupMap(words2) {
  var obj = {};
  for (var i2 = 0; i2 < words2.length; ++i2) obj[words2[i2]] = true;
  return obj;
}
function is(value, test) {
  if (test instanceof RegExp) return test.test(value);
  if (test instanceof Object) return test.propertyIsEnumerable(value);
}
const clojure = {
  name: "clojure",
  startState: function() {
    return {
      ctx: { prev: null, start: 0, indentTo: 0 },
      lastToken: null,
      tokenize: base$1
    };
  },
  token: function(stream, state) {
    if (stream.sol() && typeof state.ctx.indentTo !== "number")
      state.ctx.indentTo = state.ctx.start + 1;
    var typeStylePair = state.tokenize(stream, state);
    var type2 = typeStylePair[0];
    var style2 = typeStylePair[1];
    var current = stream.current();
    if (type2 !== "space") {
      if (state.lastToken === "(" && state.ctx.indentTo === null) {
        if (type2 === "symbol" && is(current, hasBodyParameter))
          state.ctx.indentTo = state.ctx.start + stream.indentUnit;
        else state.ctx.indentTo = "next";
      } else if (state.ctx.indentTo === "next") {
        state.ctx.indentTo = stream.column();
      }
      state.lastToken = current;
    }
    if (type2 === "open")
      state.ctx = { prev: state.ctx, start: stream.column(), indentTo: null };
    else if (type2 === "close") state.ctx = state.ctx.prev || state.ctx;
    return style2;
  },
  indent: function(state) {
    var i2 = state.ctx.indentTo;
    return typeof i2 === "number" ? i2 : state.ctx.start + 1;
  },
  languageData: {
    closeBrackets: { brackets: ["(", "[", "{", '"'] },
    commentTokens: { line: ";;" },
    autocomplete: [].concat(atoms$c, specialForms, coreSymbols)
  }
};
const clojure$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  clojure
});
function mkCSS(parserConfig2) {
  parserConfig2 = { ...defaults, ...parserConfig2 };
  var inline = parserConfig2.inline;
  var tokenHooks = parserConfig2.tokenHooks, documentTypes2 = parserConfig2.documentTypes || {}, mediaTypes2 = parserConfig2.mediaTypes || {}, mediaFeatures2 = parserConfig2.mediaFeatures || {}, mediaValueKeywords2 = parserConfig2.mediaValueKeywords || {}, propertyKeywords2 = parserConfig2.propertyKeywords || {}, nonStandardPropertyKeywords2 = parserConfig2.nonStandardPropertyKeywords || {}, fontProperties2 = parserConfig2.fontProperties || {}, counterDescriptors2 = parserConfig2.counterDescriptors || {}, colorKeywords2 = parserConfig2.colorKeywords || {}, valueKeywords2 = parserConfig2.valueKeywords || {}, allowNested = parserConfig2.allowNested, lineComment = parserConfig2.lineComment, supportsAtComponent = parserConfig2.supportsAtComponent === true, highlightNonStandardPropertyKeywords = parserConfig2.highlightNonStandardPropertyKeywords !== false;
  var type2, override2;
  function ret2(style2, tp) {
    type2 = tp;
    return style2;
  }
  function tokenBase2(stream, state) {
    var ch2 = stream.next();
    if (tokenHooks[ch2]) {
      var result = tokenHooks[ch2](stream, state);
      if (result !== false) return result;
    }
    if (ch2 == "@") {
      stream.eatWhile(/[\w\\\-]/);
      return ret2("def", stream.current());
    } else if (ch2 == "=" || (ch2 == "~" || ch2 == "|") && stream.eat("=")) {
      return ret2(null, "compare");
    } else if (ch2 == '"' || ch2 == "'") {
      state.tokenize = tokenString3(ch2);
      return state.tokenize(stream, state);
    } else if (ch2 == "#") {
      stream.eatWhile(/[\w\\\-]/);
      return ret2("atom", "hash");
    } else if (ch2 == "!") {
      stream.match(/^\s*\w*/);
      return ret2("keyword", "important");
    } else if (/\d/.test(ch2) || ch2 == "." && stream.eat(/\d/)) {
      stream.eatWhile(/[\w.%]/);
      return ret2("number", "unit");
    } else if (ch2 === "-") {
      if (/[\d.]/.test(stream.peek())) {
        stream.eatWhile(/[\w.%]/);
        return ret2("number", "unit");
      } else if (stream.match(/^-[\w\\\-]*/)) {
        stream.eatWhile(/[\w\\\-]/);
        if (stream.match(/^\s*:/, false))
          return ret2("def", "variable-definition");
        return ret2("variableName", "variable");
      } else if (stream.match(/^\w+-/)) {
        return ret2("meta", "meta");
      }
    } else if (/[,+>*\/]/.test(ch2)) {
      return ret2(null, "select-op");
    } else if (ch2 == "." && stream.match(/^-?[_a-z][_a-z0-9-]*/i)) {
      return ret2("qualifier", "qualifier");
    } else if (/[:;{}\[\]\(\)]/.test(ch2)) {
      return ret2(null, ch2);
    } else if (stream.match(/^[\w-.]+(?=\()/)) {
      if (/^(url(-prefix)?|domain|regexp)$/i.test(stream.current())) {
        state.tokenize = tokenParenthesized2;
      }
      return ret2("variableName.function", "variable");
    } else if (/[\w\\\-]/.test(ch2)) {
      stream.eatWhile(/[\w\\\-]/);
      return ret2("property", "word");
    } else {
      return ret2(null, null);
    }
  }
  function tokenString3(quote2) {
    return function(stream, state) {
      var escaped = false, ch2;
      while ((ch2 = stream.next()) != null) {
        if (ch2 == quote2 && !escaped) {
          if (quote2 == ")") stream.backUp(1);
          break;
        }
        escaped = !escaped && ch2 == "\\";
      }
      if (ch2 == quote2 || !escaped && quote2 != ")") state.tokenize = null;
      return ret2("string", "string");
    };
  }
  function tokenParenthesized2(stream, state) {
    stream.next();
    if (!stream.match(/^\s*[\"\')]/, false))
      state.tokenize = tokenString3(")");
    else
      state.tokenize = null;
    return ret2(null, "(");
  }
  function Context2(type3, indent2, prev) {
    this.type = type3;
    this.indent = indent2;
    this.prev = prev;
  }
  function pushContext2(state, stream, type3, indent2) {
    state.context = new Context2(type3, stream.indentation() + (indent2 === false ? 0 : stream.indentUnit), state.context);
    return type3;
  }
  function popContext2(state) {
    if (state.context.prev)
      state.context = state.context.prev;
    return state.context.type;
  }
  function pass2(type3, stream, state) {
    return states2[state.context.type](type3, stream, state);
  }
  function popAndPass2(type3, stream, state, n) {
    for (var i2 = n || 1; i2 > 0; i2--)
      state.context = state.context.prev;
    return pass2(type3, stream, state);
  }
  function wordAsValue2(stream) {
    var word = stream.current().toLowerCase();
    if (valueKeywords2.hasOwnProperty(word))
      override2 = "atom";
    else if (colorKeywords2.hasOwnProperty(word))
      override2 = "keyword";
    else
      override2 = "variable";
  }
  var states2 = {};
  states2.top = function(type3, stream, state) {
    if (type3 == "{") {
      return pushContext2(state, stream, "block");
    } else if (type3 == "}" && state.context.prev) {
      return popContext2(state);
    } else if (supportsAtComponent && /@component/i.test(type3)) {
      return pushContext2(state, stream, "atComponentBlock");
    } else if (/^@(-moz-)?document$/i.test(type3)) {
      return pushContext2(state, stream, "documentTypes");
    } else if (/^@(media|supports|(-moz-)?document|import)$/i.test(type3)) {
      return pushContext2(state, stream, "atBlock");
    } else if (/^@(font-face|counter-style)/i.test(type3)) {
      state.stateArg = type3;
      return "restricted_atBlock_before";
    } else if (/^@(-(moz|ms|o|webkit)-)?keyframes$/i.test(type3)) {
      return "keyframes";
    } else if (type3 && type3.charAt(0) == "@") {
      return pushContext2(state, stream, "at");
    } else if (type3 == "hash") {
      override2 = "builtin";
    } else if (type3 == "word") {
      override2 = "tag";
    } else if (type3 == "variable-definition") {
      return "maybeprop";
    } else if (type3 == "interpolation") {
      return pushContext2(state, stream, "interpolation");
    } else if (type3 == ":") {
      return "pseudo";
    } else if (allowNested && type3 == "(") {
      return pushContext2(state, stream, "parens");
    }
    return state.context.type;
  };
  states2.block = function(type3, stream, state) {
    if (type3 == "word") {
      var word = stream.current().toLowerCase();
      if (propertyKeywords2.hasOwnProperty(word)) {
        override2 = "property";
        return "maybeprop";
      } else if (nonStandardPropertyKeywords2.hasOwnProperty(word)) {
        override2 = highlightNonStandardPropertyKeywords ? "string.special" : "property";
        return "maybeprop";
      } else if (allowNested) {
        override2 = stream.match(/^\s*:(?:\s|$)/, false) ? "property" : "tag";
        return "block";
      } else {
        override2 = "error";
        return "maybeprop";
      }
    } else if (type3 == "meta") {
      return "block";
    } else if (!allowNested && (type3 == "hash" || type3 == "qualifier")) {
      override2 = "error";
      return "block";
    } else {
      return states2.top(type3, stream, state);
    }
  };
  states2.maybeprop = function(type3, stream, state) {
    if (type3 == ":") return pushContext2(state, stream, "prop");
    return pass2(type3, stream, state);
  };
  states2.prop = function(type3, stream, state) {
    if (type3 == ";") return popContext2(state);
    if (type3 == "{" && allowNested) return pushContext2(state, stream, "propBlock");
    if (type3 == "}" || type3 == "{") return popAndPass2(type3, stream, state);
    if (type3 == "(") return pushContext2(state, stream, "parens");
    if (type3 == "hash" && !/^#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(stream.current())) {
      override2 = "error";
    } else if (type3 == "word") {
      wordAsValue2(stream);
    } else if (type3 == "interpolation") {
      return pushContext2(state, stream, "interpolation");
    }
    return "prop";
  };
  states2.propBlock = function(type3, _stream, state) {
    if (type3 == "}") return popContext2(state);
    if (type3 == "word") {
      override2 = "property";
      return "maybeprop";
    }
    return state.context.type;
  };
  states2.parens = function(type3, stream, state) {
    if (type3 == "{" || type3 == "}") return popAndPass2(type3, stream, state);
    if (type3 == ")") return popContext2(state);
    if (type3 == "(") return pushContext2(state, stream, "parens");
    if (type3 == "interpolation") return pushContext2(state, stream, "interpolation");
    if (type3 == "word") wordAsValue2(stream);
    return "parens";
  };
  states2.pseudo = function(type3, stream, state) {
    if (type3 == "meta") return "pseudo";
    if (type3 == "word") {
      override2 = "variableName.constant";
      return state.context.type;
    }
    return pass2(type3, stream, state);
  };
  states2.documentTypes = function(type3, stream, state) {
    if (type3 == "word" && documentTypes2.hasOwnProperty(stream.current())) {
      override2 = "tag";
      return state.context.type;
    } else {
      return states2.atBlock(type3, stream, state);
    }
  };
  states2.atBlock = function(type3, stream, state) {
    if (type3 == "(") return pushContext2(state, stream, "atBlock_parens");
    if (type3 == "}" || type3 == ";") return popAndPass2(type3, stream, state);
    if (type3 == "{") return popContext2(state) && pushContext2(state, stream, allowNested ? "block" : "top");
    if (type3 == "interpolation") return pushContext2(state, stream, "interpolation");
    if (type3 == "word") {
      var word = stream.current().toLowerCase();
      if (word == "only" || word == "not" || word == "and" || word == "or")
        override2 = "keyword";
      else if (mediaTypes2.hasOwnProperty(word))
        override2 = "attribute";
      else if (mediaFeatures2.hasOwnProperty(word))
        override2 = "property";
      else if (mediaValueKeywords2.hasOwnProperty(word))
        override2 = "keyword";
      else if (propertyKeywords2.hasOwnProperty(word))
        override2 = "property";
      else if (nonStandardPropertyKeywords2.hasOwnProperty(word))
        override2 = highlightNonStandardPropertyKeywords ? "string.special" : "property";
      else if (valueKeywords2.hasOwnProperty(word))
        override2 = "atom";
      else if (colorKeywords2.hasOwnProperty(word))
        override2 = "keyword";
      else
        override2 = "error";
    }
    return state.context.type;
  };
  states2.atComponentBlock = function(type3, stream, state) {
    if (type3 == "}")
      return popAndPass2(type3, stream, state);
    if (type3 == "{")
      return popContext2(state) && pushContext2(state, stream, allowNested ? "block" : "top", false);
    if (type3 == "word")
      override2 = "error";
    return state.context.type;
  };
  states2.atBlock_parens = function(type3, stream, state) {
    if (type3 == ")") return popContext2(state);
    if (type3 == "{" || type3 == "}") return popAndPass2(type3, stream, state, 2);
    return states2.atBlock(type3, stream, state);
  };
  states2.restricted_atBlock_before = function(type3, stream, state) {
    if (type3 == "{")
      return pushContext2(state, stream, "restricted_atBlock");
    if (type3 == "word" && state.stateArg == "@counter-style") {
      override2 = "variable";
      return "restricted_atBlock_before";
    }
    return pass2(type3, stream, state);
  };
  states2.restricted_atBlock = function(type3, stream, state) {
    if (type3 == "}") {
      state.stateArg = null;
      return popContext2(state);
    }
    if (type3 == "word") {
      if (state.stateArg == "@font-face" && !fontProperties2.hasOwnProperty(stream.current().toLowerCase()) || state.stateArg == "@counter-style" && !counterDescriptors2.hasOwnProperty(stream.current().toLowerCase()))
        override2 = "error";
      else
        override2 = "property";
      return "maybeprop";
    }
    return "restricted_atBlock";
  };
  states2.keyframes = function(type3, stream, state) {
    if (type3 == "word") {
      override2 = "variable";
      return "keyframes";
    }
    if (type3 == "{") return pushContext2(state, stream, "top");
    return pass2(type3, stream, state);
  };
  states2.at = function(type3, stream, state) {
    if (type3 == ";") return popContext2(state);
    if (type3 == "{" || type3 == "}") return popAndPass2(type3, stream, state);
    if (type3 == "word") override2 = "tag";
    else if (type3 == "hash") override2 = "builtin";
    return "at";
  };
  states2.interpolation = function(type3, stream, state) {
    if (type3 == "}") return popContext2(state);
    if (type3 == "{" || type3 == ";") return popAndPass2(type3, stream, state);
    if (type3 == "word") override2 = "variable";
    else if (type3 != "variable" && type3 != "(" && type3 != ")") override2 = "error";
    return "interpolation";
  };
  return {
    name: parserConfig2.name,
    startState: function() {
      return {
        tokenize: null,
        state: inline ? "block" : "top",
        stateArg: null,
        context: new Context2(inline ? "block" : "top", 0, null)
      };
    },
    token: function(stream, state) {
      if (!state.tokenize && stream.eatSpace()) return null;
      var style2 = (state.tokenize || tokenBase2)(stream, state);
      if (style2 && typeof style2 == "object") {
        type2 = style2[1];
        style2 = style2[0];
      }
      override2 = style2;
      if (type2 != "comment")
        state.state = states2[state.state](type2, stream, state);
      return override2;
    },
    indent: function(state, textAfter, iCx) {
      var cx2 = state.context, ch2 = textAfter && textAfter.charAt(0);
      var indent2 = cx2.indent;
      if (cx2.type == "prop" && (ch2 == "}" || ch2 == ")")) cx2 = cx2.prev;
      if (cx2.prev) {
        if (ch2 == "}" && (cx2.type == "block" || cx2.type == "top" || cx2.type == "interpolation" || cx2.type == "restricted_atBlock")) {
          cx2 = cx2.prev;
          indent2 = cx2.indent;
        } else if (ch2 == ")" && (cx2.type == "parens" || cx2.type == "atBlock_parens") || ch2 == "{" && (cx2.type == "at" || cx2.type == "atBlock")) {
          indent2 = Math.max(0, cx2.indent - iCx.unit);
        }
      }
      return indent2;
    },
    languageData: {
      indentOnInput: /^\s*\}$/,
      commentTokens: { line: lineComment, block: { open: "/*", close: "*/" } },
      autocomplete: allWords
    }
  };
}
function keySet$1(array) {
  var keys = {};
  for (var i2 = 0; i2 < array.length; ++i2) {
    keys[array[i2].toLowerCase()] = true;
  }
  return keys;
}
var documentTypes_$1 = [
  "domain",
  "regexp",
  "url",
  "url-prefix"
], documentTypes$1 = keySet$1(documentTypes_$1);
var mediaTypes_$1 = [
  "all",
  "aural",
  "braille",
  "handheld",
  "print",
  "projection",
  "screen",
  "tty",
  "tv",
  "embossed"
], mediaTypes$1 = keySet$1(mediaTypes_$1);
var mediaFeatures_$1 = [
  "width",
  "min-width",
  "max-width",
  "height",
  "min-height",
  "max-height",
  "device-width",
  "min-device-width",
  "max-device-width",
  "device-height",
  "min-device-height",
  "max-device-height",
  "aspect-ratio",
  "min-aspect-ratio",
  "max-aspect-ratio",
  "device-aspect-ratio",
  "min-device-aspect-ratio",
  "max-device-aspect-ratio",
  "color",
  "min-color",
  "max-color",
  "color-index",
  "min-color-index",
  "max-color-index",
  "monochrome",
  "min-monochrome",
  "max-monochrome",
  "resolution",
  "min-resolution",
  "max-resolution",
  "scan",
  "grid",
  "orientation",
  "device-pixel-ratio",
  "min-device-pixel-ratio",
  "max-device-pixel-ratio",
  "pointer",
  "any-pointer",
  "hover",
  "any-hover",
  "prefers-color-scheme",
  "dynamic-range",
  "video-dynamic-range"
], mediaFeatures$1 = keySet$1(mediaFeatures_$1);
var mediaValueKeywords_ = [
  "landscape",
  "portrait",
  "none",
  "coarse",
  "fine",
  "on-demand",
  "hover",
  "interlace",
  "progressive",
  "dark",
  "light",
  "standard",
  "high"
], mediaValueKeywords = keySet$1(mediaValueKeywords_);
var propertyKeywords_$1 = [
  "align-content",
  "align-items",
  "align-self",
  "alignment-adjust",
  "alignment-baseline",
  "all",
  "anchor-point",
  "animation",
  "animation-delay",
  "animation-direction",
  "animation-duration",
  "animation-fill-mode",
  "animation-iteration-count",
  "animation-name",
  "animation-play-state",
  "animation-timing-function",
  "appearance",
  "azimuth",
  "backdrop-filter",
  "backface-visibility",
  "background",
  "background-attachment",
  "background-blend-mode",
  "background-clip",
  "background-color",
  "background-image",
  "background-origin",
  "background-position",
  "background-position-x",
  "background-position-y",
  "background-repeat",
  "background-size",
  "baseline-shift",
  "binding",
  "bleed",
  "block-size",
  "bookmark-label",
  "bookmark-level",
  "bookmark-state",
  "bookmark-target",
  "border",
  "border-bottom",
  "border-bottom-color",
  "border-bottom-left-radius",
  "border-bottom-right-radius",
  "border-bottom-style",
  "border-bottom-width",
  "border-collapse",
  "border-color",
  "border-image",
  "border-image-outset",
  "border-image-repeat",
  "border-image-slice",
  "border-image-source",
  "border-image-width",
  "border-left",
  "border-left-color",
  "border-left-style",
  "border-left-width",
  "border-radius",
  "border-right",
  "border-right-color",
  "border-right-style",
  "border-right-width",
  "border-spacing",
  "border-style",
  "border-top",
  "border-top-color",
  "border-top-left-radius",
  "border-top-right-radius",
  "border-top-style",
  "border-top-width",
  "border-width",
  "bottom",
  "box-decoration-break",
  "box-shadow",
  "box-sizing",
  "break-after",
  "break-before",
  "break-inside",
  "caption-side",
  "caret-color",
  "clear",
  "clip",
  "color",
  "color-profile",
  "column-count",
  "column-fill",
  "column-gap",
  "column-rule",
  "column-rule-color",
  "column-rule-style",
  "column-rule-width",
  "column-span",
  "column-width",
  "columns",
  "contain",
  "content",
  "counter-increment",
  "counter-reset",
  "crop",
  "cue",
  "cue-after",
  "cue-before",
  "cursor",
  "direction",
  "display",
  "dominant-baseline",
  "drop-initial-after-adjust",
  "drop-initial-after-align",
  "drop-initial-before-adjust",
  "drop-initial-before-align",
  "drop-initial-size",
  "drop-initial-value",
  "elevation",
  "empty-cells",
  "fit",
  "fit-content",
  "fit-position",
  "flex",
  "flex-basis",
  "flex-direction",
  "flex-flow",
  "flex-grow",
  "flex-shrink",
  "flex-wrap",
  "float",
  "float-offset",
  "flow-from",
  "flow-into",
  "font",
  "font-family",
  "font-feature-settings",
  "font-kerning",
  "font-language-override",
  "font-optical-sizing",
  "font-size",
  "font-size-adjust",
  "font-stretch",
  "font-style",
  "font-synthesis",
  "font-variant",
  "font-variant-alternates",
  "font-variant-caps",
  "font-variant-east-asian",
  "font-variant-ligatures",
  "font-variant-numeric",
  "font-variant-position",
  "font-variation-settings",
  "font-weight",
  "gap",
  "grid",
  "grid-area",
  "grid-auto-columns",
  "grid-auto-flow",
  "grid-auto-rows",
  "grid-column",
  "grid-column-end",
  "grid-column-gap",
  "grid-column-start",
  "grid-gap",
  "grid-row",
  "grid-row-end",
  "grid-row-gap",
  "grid-row-start",
  "grid-template",
  "grid-template-areas",
  "grid-template-columns",
  "grid-template-rows",
  "hanging-punctuation",
  "height",
  "hyphens",
  "icon",
  "image-orientation",
  "image-rendering",
  "image-resolution",
  "inline-box-align",
  "inset",
  "inset-block",
  "inset-block-end",
  "inset-block-start",
  "inset-inline",
  "inset-inline-end",
  "inset-inline-start",
  "isolation",
  "justify-content",
  "justify-items",
  "justify-self",
  "left",
  "letter-spacing",
  "line-break",
  "line-height",
  "line-height-step",
  "line-stacking",
  "line-stacking-ruby",
  "line-stacking-shift",
  "line-stacking-strategy",
  "list-style",
  "list-style-image",
  "list-style-position",
  "list-style-type",
  "margin",
  "margin-bottom",
  "margin-left",
  "margin-right",
  "margin-top",
  "marks",
  "marquee-direction",
  "marquee-loop",
  "marquee-play-count",
  "marquee-speed",
  "marquee-style",
  "mask-clip",
  "mask-composite",
  "mask-image",
  "mask-mode",
  "mask-origin",
  "mask-position",
  "mask-repeat",
  "mask-size",
  "mask-type",
  "max-block-size",
  "max-height",
  "max-inline-size",
  "max-width",
  "min-block-size",
  "min-height",
  "min-inline-size",
  "min-width",
  "mix-blend-mode",
  "move-to",
  "nav-down",
  "nav-index",
  "nav-left",
  "nav-right",
  "nav-up",
  "object-fit",
  "object-position",
  "offset",
  "offset-anchor",
  "offset-distance",
  "offset-path",
  "offset-position",
  "offset-rotate",
  "opacity",
  "order",
  "orphans",
  "outline",
  "outline-color",
  "outline-offset",
  "outline-style",
  "outline-width",
  "overflow",
  "overflow-style",
  "overflow-wrap",
  "overflow-x",
  "overflow-y",
  "padding",
  "padding-bottom",
  "padding-left",
  "padding-right",
  "padding-top",
  "page",
  "page-break-after",
  "page-break-before",
  "page-break-inside",
  "page-policy",
  "pause",
  "pause-after",
  "pause-before",
  "perspective",
  "perspective-origin",
  "pitch",
  "pitch-range",
  "place-content",
  "place-items",
  "place-self",
  "play-during",
  "position",
  "presentation-level",
  "punctuation-trim",
  "quotes",
  "region-break-after",
  "region-break-before",
  "region-break-inside",
  "region-fragment",
  "rendering-intent",
  "resize",
  "rest",
  "rest-after",
  "rest-before",
  "richness",
  "right",
  "rotate",
  "rotation",
  "rotation-point",
  "row-gap",
  "ruby-align",
  "ruby-overhang",
  "ruby-position",
  "ruby-span",
  "scale",
  "scroll-behavior",
  "scroll-margin",
  "scroll-margin-block",
  "scroll-margin-block-end",
  "scroll-margin-block-start",
  "scroll-margin-bottom",
  "scroll-margin-inline",
  "scroll-margin-inline-end",
  "scroll-margin-inline-start",
  "scroll-margin-left",
  "scroll-margin-right",
  "scroll-margin-top",
  "scroll-padding",
  "scroll-padding-block",
  "scroll-padding-block-end",
  "scroll-padding-block-start",
  "scroll-padding-bottom",
  "scroll-padding-inline",
  "scroll-padding-inline-end",
  "scroll-padding-inline-start",
  "scroll-padding-left",
  "scroll-padding-right",
  "scroll-padding-top",
  "scroll-snap-align",
  "scroll-snap-type",
  "shape-image-threshold",
  "shape-inside",
  "shape-margin",
  "shape-outside",
  "size",
  "speak",
  "speak-as",
  "speak-header",
  "speak-numeral",
  "speak-punctuation",
  "speech-rate",
  "stress",
  "string-set",
  "tab-size",
  "table-layout",
  "target",
  "target-name",
  "target-new",
  "target-position",
  "text-align",
  "text-align-last",
  "text-combine-upright",
  "text-decoration",
  "text-decoration-color",
  "text-decoration-line",
  "text-decoration-skip",
  "text-decoration-skip-ink",
  "text-decoration-style",
  "text-emphasis",
  "text-emphasis-color",
  "text-emphasis-position",
  "text-emphasis-style",
  "text-height",
  "text-indent",
  "text-justify",
  "text-orientation",
  "text-outline",
  "text-overflow",
  "text-rendering",
  "text-shadow",
  "text-size-adjust",
  "text-space-collapse",
  "text-transform",
  "text-underline-position",
  "text-wrap",
  "top",
  "touch-action",
  "transform",
  "transform-origin",
  "transform-style",
  "transition",
  "transition-delay",
  "transition-duration",
  "transition-property",
  "transition-timing-function",
  "translate",
  "unicode-bidi",
  "user-select",
  "vertical-align",
  "visibility",
  "voice-balance",
  "voice-duration",
  "voice-family",
  "voice-pitch",
  "voice-range",
  "voice-rate",
  "voice-stress",
  "voice-volume",
  "volume",
  "white-space",
  "widows",
  "width",
  "will-change",
  "word-break",
  "word-spacing",
  "word-wrap",
  "writing-mode",
  "z-index",
  // SVG-specific
  "clip-path",
  "clip-rule",
  "mask",
  "enable-background",
  "filter",
  "flood-color",
  "flood-opacity",
  "lighting-color",
  "stop-color",
  "stop-opacity",
  "pointer-events",
  "color-interpolation",
  "color-interpolation-filters",
  "color-rendering",
  "fill",
  "fill-opacity",
  "fill-rule",
  "image-rendering",
  "marker",
  "marker-end",
  "marker-mid",
  "marker-start",
  "paint-order",
  "shape-rendering",
  "stroke",
  "stroke-dasharray",
  "stroke-dashoffset",
  "stroke-linecap",
  "stroke-linejoin",
  "stroke-miterlimit",
  "stroke-opacity",
  "stroke-width",
  "text-rendering",
  "baseline-shift",
  "dominant-baseline",
  "glyph-orientation-horizontal",
  "glyph-orientation-vertical",
  "text-anchor",
  "writing-mode"
], propertyKeywords$1 = keySet$1(propertyKeywords_$1);
var nonStandardPropertyKeywords_$1 = [
  "accent-color",
  "aspect-ratio",
  "border-block",
  "border-block-color",
  "border-block-end",
  "border-block-end-color",
  "border-block-end-style",
  "border-block-end-width",
  "border-block-start",
  "border-block-start-color",
  "border-block-start-style",
  "border-block-start-width",
  "border-block-style",
  "border-block-width",
  "border-inline",
  "border-inline-color",
  "border-inline-end",
  "border-inline-end-color",
  "border-inline-end-style",
  "border-inline-end-width",
  "border-inline-start",
  "border-inline-start-color",
  "border-inline-start-style",
  "border-inline-start-width",
  "border-inline-style",
  "border-inline-width",
  "content-visibility",
  "margin-block",
  "margin-block-end",
  "margin-block-start",
  "margin-inline",
  "margin-inline-end",
  "margin-inline-start",
  "overflow-anchor",
  "overscroll-behavior",
  "padding-block",
  "padding-block-end",
  "padding-block-start",
  "padding-inline",
  "padding-inline-end",
  "padding-inline-start",
  "scroll-snap-stop",
  "scrollbar-3d-light-color",
  "scrollbar-arrow-color",
  "scrollbar-base-color",
  "scrollbar-dark-shadow-color",
  "scrollbar-face-color",
  "scrollbar-highlight-color",
  "scrollbar-shadow-color",
  "scrollbar-track-color",
  "searchfield-cancel-button",
  "searchfield-decoration",
  "searchfield-results-button",
  "searchfield-results-decoration",
  "shape-inside",
  "zoom"
], nonStandardPropertyKeywords$1 = keySet$1(nonStandardPropertyKeywords_$1);
var fontProperties_$1 = [
  "font-display",
  "font-family",
  "src",
  "unicode-range",
  "font-variant",
  "font-feature-settings",
  "font-stretch",
  "font-weight",
  "font-style"
], fontProperties$1 = keySet$1(fontProperties_$1);
var counterDescriptors_ = [
  "additive-symbols",
  "fallback",
  "negative",
  "pad",
  "prefix",
  "range",
  "speak-as",
  "suffix",
  "symbols",
  "system"
], counterDescriptors = keySet$1(counterDescriptors_);
var colorKeywords_$1 = [
  "aliceblue",
  "antiquewhite",
  "aqua",
  "aquamarine",
  "azure",
  "beige",
  "bisque",
  "black",
  "blanchedalmond",
  "blue",
  "blueviolet",
  "brown",
  "burlywood",
  "cadetblue",
  "chartreuse",
  "chocolate",
  "coral",
  "cornflowerblue",
  "cornsilk",
  "crimson",
  "cyan",
  "darkblue",
  "darkcyan",
  "darkgoldenrod",
  "darkgray",
  "darkgreen",
  "darkgrey",
  "darkkhaki",
  "darkmagenta",
  "darkolivegreen",
  "darkorange",
  "darkorchid",
  "darkred",
  "darksalmon",
  "darkseagreen",
  "darkslateblue",
  "darkslategray",
  "darkslategrey",
  "darkturquoise",
  "darkviolet",
  "deeppink",
  "deepskyblue",
  "dimgray",
  "dimgrey",
  "dodgerblue",
  "firebrick",
  "floralwhite",
  "forestgreen",
  "fuchsia",
  "gainsboro",
  "ghostwhite",
  "gold",
  "goldenrod",
  "gray",
  "grey",
  "green",
  "greenyellow",
  "honeydew",
  "hotpink",
  "indianred",
  "indigo",
  "ivory",
  "khaki",
  "lavender",
  "lavenderblush",
  "lawngreen",
  "lemonchiffon",
  "lightblue",
  "lightcoral",
  "lightcyan",
  "lightgoldenrodyellow",
  "lightgray",
  "lightgreen",
  "lightgrey",
  "lightpink",
  "lightsalmon",
  "lightseagreen",
  "lightskyblue",
  "lightslategray",
  "lightslategrey",
  "lightsteelblue",
  "lightyellow",
  "lime",
  "limegreen",
  "linen",
  "magenta",
  "maroon",
  "mediumaquamarine",
  "mediumblue",
  "mediumorchid",
  "mediumpurple",
  "mediumseagreen",
  "mediumslateblue",
  "mediumspringgreen",
  "mediumturquoise",
  "mediumvioletred",
  "midnightblue",
  "mintcream",
  "mistyrose",
  "moccasin",
  "navajowhite",
  "navy",
  "oldlace",
  "olive",
  "olivedrab",
  "orange",
  "orangered",
  "orchid",
  "palegoldenrod",
  "palegreen",
  "paleturquoise",
  "palevioletred",
  "papayawhip",
  "peachpuff",
  "peru",
  "pink",
  "plum",
  "powderblue",
  "purple",
  "rebeccapurple",
  "red",
  "rosybrown",
  "royalblue",
  "saddlebrown",
  "salmon",
  "sandybrown",
  "seagreen",
  "seashell",
  "sienna",
  "silver",
  "skyblue",
  "slateblue",
  "slategray",
  "slategrey",
  "snow",
  "springgreen",
  "steelblue",
  "tan",
  "teal",
  "thistle",
  "tomato",
  "turquoise",
  "violet",
  "wheat",
  "white",
  "whitesmoke",
  "yellow",
  "yellowgreen"
], colorKeywords$1 = keySet$1(colorKeywords_$1);
var valueKeywords_$1 = [
  "above",
  "absolute",
  "activeborder",
  "additive",
  "activecaption",
  "afar",
  "after-white-space",
  "ahead",
  "alias",
  "all",
  "all-scroll",
  "alphabetic",
  "alternate",
  "always",
  "amharic",
  "amharic-abegede",
  "antialiased",
  "appworkspace",
  "arabic-indic",
  "armenian",
  "asterisks",
  "attr",
  "auto",
  "auto-flow",
  "avoid",
  "avoid-column",
  "avoid-page",
  "avoid-region",
  "axis-pan",
  "background",
  "backwards",
  "baseline",
  "below",
  "bidi-override",
  "binary",
  "bengali",
  "blink",
  "block",
  "block-axis",
  "blur",
  "bold",
  "bolder",
  "border",
  "border-box",
  "both",
  "bottom",
  "break",
  "break-all",
  "break-word",
  "brightness",
  "bullets",
  "button",
  "buttonface",
  "buttonhighlight",
  "buttonshadow",
  "buttontext",
  "calc",
  "cambodian",
  "capitalize",
  "caps-lock-indicator",
  "caption",
  "captiontext",
  "caret",
  "cell",
  "center",
  "checkbox",
  "circle",
  "cjk-decimal",
  "cjk-earthly-branch",
  "cjk-heavenly-stem",
  "cjk-ideographic",
  "clear",
  "clip",
  "close-quote",
  "col-resize",
  "collapse",
  "color",
  "color-burn",
  "color-dodge",
  "column",
  "column-reverse",
  "compact",
  "condensed",
  "conic-gradient",
  "contain",
  "content",
  "contents",
  "content-box",
  "context-menu",
  "continuous",
  "contrast",
  "copy",
  "counter",
  "counters",
  "cover",
  "crop",
  "cross",
  "crosshair",
  "cubic-bezier",
  "currentcolor",
  "cursive",
  "cyclic",
  "darken",
  "dashed",
  "decimal",
  "decimal-leading-zero",
  "default",
  "default-button",
  "dense",
  "destination-atop",
  "destination-in",
  "destination-out",
  "destination-over",
  "devanagari",
  "difference",
  "disc",
  "discard",
  "disclosure-closed",
  "disclosure-open",
  "document",
  "dot-dash",
  "dot-dot-dash",
  "dotted",
  "double",
  "down",
  "drop-shadow",
  "e-resize",
  "ease",
  "ease-in",
  "ease-in-out",
  "ease-out",
  "element",
  "ellipse",
  "ellipsis",
  "embed",
  "end",
  "ethiopic",
  "ethiopic-abegede",
  "ethiopic-abegede-am-et",
  "ethiopic-abegede-gez",
  "ethiopic-abegede-ti-er",
  "ethiopic-abegede-ti-et",
  "ethiopic-halehame-aa-er",
  "ethiopic-halehame-aa-et",
  "ethiopic-halehame-am-et",
  "ethiopic-halehame-gez",
  "ethiopic-halehame-om-et",
  "ethiopic-halehame-sid-et",
  "ethiopic-halehame-so-et",
  "ethiopic-halehame-ti-er",
  "ethiopic-halehame-ti-et",
  "ethiopic-halehame-tig",
  "ethiopic-numeric",
  "ew-resize",
  "exclusion",
  "expanded",
  "extends",
  "extra-condensed",
  "extra-expanded",
  "fantasy",
  "fast",
  "fill",
  "fill-box",
  "fixed",
  "flat",
  "flex",
  "flex-end",
  "flex-start",
  "footnotes",
  "forwards",
  "from",
  "geometricPrecision",
  "georgian",
  "grayscale",
  "graytext",
  "grid",
  "groove",
  "gujarati",
  "gurmukhi",
  "hand",
  "hangul",
  "hangul-consonant",
  "hard-light",
  "hebrew",
  "help",
  "hidden",
  "hide",
  "higher",
  "highlight",
  "highlighttext",
  "hiragana",
  "hiragana-iroha",
  "horizontal",
  "hsl",
  "hsla",
  "hue",
  "hue-rotate",
  "icon",
  "ignore",
  "inactiveborder",
  "inactivecaption",
  "inactivecaptiontext",
  "infinite",
  "infobackground",
  "infotext",
  "inherit",
  "initial",
  "inline",
  "inline-axis",
  "inline-block",
  "inline-flex",
  "inline-grid",
  "inline-table",
  "inset",
  "inside",
  "intrinsic",
  "invert",
  "italic",
  "japanese-formal",
  "japanese-informal",
  "justify",
  "kannada",
  "katakana",
  "katakana-iroha",
  "keep-all",
  "khmer",
  "korean-hangul-formal",
  "korean-hanja-formal",
  "korean-hanja-informal",
  "landscape",
  "lao",
  "large",
  "larger",
  "left",
  "level",
  "lighter",
  "lighten",
  "line-through",
  "linear",
  "linear-gradient",
  "lines",
  "list-item",
  "listbox",
  "listitem",
  "local",
  "logical",
  "loud",
  "lower",
  "lower-alpha",
  "lower-armenian",
  "lower-greek",
  "lower-hexadecimal",
  "lower-latin",
  "lower-norwegian",
  "lower-roman",
  "lowercase",
  "ltr",
  "luminosity",
  "malayalam",
  "manipulation",
  "match",
  "matrix",
  "matrix3d",
  "media-play-button",
  "media-slider",
  "media-sliderthumb",
  "media-volume-slider",
  "media-volume-sliderthumb",
  "medium",
  "menu",
  "menulist",
  "menulist-button",
  "menutext",
  "message-box",
  "middle",
  "min-intrinsic",
  "mix",
  "mongolian",
  "monospace",
  "move",
  "multiple",
  "multiple_mask_images",
  "multiply",
  "myanmar",
  "n-resize",
  "narrower",
  "ne-resize",
  "nesw-resize",
  "no-close-quote",
  "no-drop",
  "no-open-quote",
  "no-repeat",
  "none",
  "normal",
  "not-allowed",
  "nowrap",
  "ns-resize",
  "numbers",
  "numeric",
  "nw-resize",
  "nwse-resize",
  "oblique",
  "octal",
  "opacity",
  "open-quote",
  "optimizeLegibility",
  "optimizeSpeed",
  "oriya",
  "oromo",
  "outset",
  "outside",
  "outside-shape",
  "overlay",
  "overline",
  "padding",
  "padding-box",
  "painted",
  "page",
  "paused",
  "persian",
  "perspective",
  "pinch-zoom",
  "plus-darker",
  "plus-lighter",
  "pointer",
  "polygon",
  "portrait",
  "pre",
  "pre-line",
  "pre-wrap",
  "preserve-3d",
  "progress",
  "push-button",
  "radial-gradient",
  "radio",
  "read-only",
  "read-write",
  "read-write-plaintext-only",
  "rectangle",
  "region",
  "relative",
  "repeat",
  "repeating-linear-gradient",
  "repeating-radial-gradient",
  "repeating-conic-gradient",
  "repeat-x",
  "repeat-y",
  "reset",
  "reverse",
  "rgb",
  "rgba",
  "ridge",
  "right",
  "rotate",
  "rotate3d",
  "rotateX",
  "rotateY",
  "rotateZ",
  "round",
  "row",
  "row-resize",
  "row-reverse",
  "rtl",
  "run-in",
  "running",
  "s-resize",
  "sans-serif",
  "saturate",
  "saturation",
  "scale",
  "scale3d",
  "scaleX",
  "scaleY",
  "scaleZ",
  "screen",
  "scroll",
  "scrollbar",
  "scroll-position",
  "se-resize",
  "searchfield",
  "searchfield-cancel-button",
  "searchfield-decoration",
  "searchfield-results-button",
  "searchfield-results-decoration",
  "self-start",
  "self-end",
  "semi-condensed",
  "semi-expanded",
  "separate",
  "sepia",
  "serif",
  "show",
  "sidama",
  "simp-chinese-formal",
  "simp-chinese-informal",
  "single",
  "skew",
  "skewX",
  "skewY",
  "skip-white-space",
  "slide",
  "slider-horizontal",
  "slider-vertical",
  "sliderthumb-horizontal",
  "sliderthumb-vertical",
  "slow",
  "small",
  "small-caps",
  "small-caption",
  "smaller",
  "soft-light",
  "solid",
  "somali",
  "source-atop",
  "source-in",
  "source-out",
  "source-over",
  "space",
  "space-around",
  "space-between",
  "space-evenly",
  "spell-out",
  "square",
  "square-button",
  "start",
  "static",
  "status-bar",
  "stretch",
  "stroke",
  "stroke-box",
  "sub",
  "subpixel-antialiased",
  "svg_masks",
  "super",
  "sw-resize",
  "symbolic",
  "symbols",
  "system-ui",
  "table",
  "table-caption",
  "table-cell",
  "table-column",
  "table-column-group",
  "table-footer-group",
  "table-header-group",
  "table-row",
  "table-row-group",
  "tamil",
  "telugu",
  "text",
  "text-bottom",
  "text-top",
  "textarea",
  "textfield",
  "thai",
  "thick",
  "thin",
  "threeddarkshadow",
  "threedface",
  "threedhighlight",
  "threedlightshadow",
  "threedshadow",
  "tibetan",
  "tigre",
  "tigrinya-er",
  "tigrinya-er-abegede",
  "tigrinya-et",
  "tigrinya-et-abegede",
  "to",
  "top",
  "trad-chinese-formal",
  "trad-chinese-informal",
  "transform",
  "translate",
  "translate3d",
  "translateX",
  "translateY",
  "translateZ",
  "transparent",
  "ultra-condensed",
  "ultra-expanded",
  "underline",
  "unidirectional-pan",
  "unset",
  "up",
  "upper-alpha",
  "upper-armenian",
  "upper-greek",
  "upper-hexadecimal",
  "upper-latin",
  "upper-norwegian",
  "upper-roman",
  "uppercase",
  "urdu",
  "url",
  "var",
  "vertical",
  "vertical-text",
  "view-box",
  "visible",
  "visibleFill",
  "visiblePainted",
  "visibleStroke",
  "visual",
  "w-resize",
  "wait",
  "wave",
  "wider",
  "window",
  "windowframe",
  "windowtext",
  "words",
  "wrap",
  "wrap-reverse",
  "x-large",
  "x-small",
  "xor",
  "xx-large",
  "xx-small"
], valueKeywords$1 = keySet$1(valueKeywords_$1);
var allWords = documentTypes_$1.concat(mediaTypes_$1).concat(mediaFeatures_$1).concat(mediaValueKeywords_).concat(propertyKeywords_$1).concat(nonStandardPropertyKeywords_$1).concat(colorKeywords_$1).concat(valueKeywords_$1);
const defaults = {
  documentTypes: documentTypes$1,
  mediaTypes: mediaTypes$1,
  mediaFeatures: mediaFeatures$1,
  mediaValueKeywords,
  propertyKeywords: propertyKeywords$1,
  nonStandardPropertyKeywords: nonStandardPropertyKeywords$1,
  fontProperties: fontProperties$1,
  counterDescriptors,
  colorKeywords: colorKeywords$1,
  valueKeywords: valueKeywords$1,
  tokenHooks: {
    "/": function(stream, state) {
      if (!stream.eat("*")) return false;
      state.tokenize = tokenCComment$3;
      return tokenCComment$3(stream, state);
    }
  }
};
mkCSS({ name: "css" });
function tokenCComment$3(stream, state) {
  var maybeEnd = false, ch2;
  while ((ch2 = stream.next()) != null) {
    if (maybeEnd && ch2 == "/") {
      state.tokenize = null;
      break;
    }
    maybeEnd = ch2 == "*";
  }
  return ["comment", "comment"];
}
mkCSS({
  name: "scss",
  mediaTypes: mediaTypes$1,
  mediaFeatures: mediaFeatures$1,
  mediaValueKeywords,
  propertyKeywords: propertyKeywords$1,
  nonStandardPropertyKeywords: nonStandardPropertyKeywords$1,
  colorKeywords: colorKeywords$1,
  valueKeywords: valueKeywords$1,
  fontProperties: fontProperties$1,
  allowNested: true,
  lineComment: "//",
  tokenHooks: {
    "/": function(stream, state) {
      if (stream.eat("/")) {
        stream.skipToEnd();
        return ["comment", "comment"];
      } else if (stream.eat("*")) {
        state.tokenize = tokenCComment$3;
        return tokenCComment$3(stream, state);
      } else {
        return ["operator", "operator"];
      }
    },
    ":": function(stream) {
      if (stream.match(/^\s*\{/, false))
        return [null, null];
      return false;
    },
    "$": function(stream) {
      stream.match(/^[\w-]+/);
      if (stream.match(/^\s*:/, false))
        return ["def", "variable-definition"];
      return ["variableName.special", "variable"];
    },
    "#": function(stream) {
      if (!stream.eat("{")) return false;
      return [null, "interpolation"];
    }
  }
});
mkCSS({
  name: "less",
  mediaTypes: mediaTypes$1,
  mediaFeatures: mediaFeatures$1,
  mediaValueKeywords,
  propertyKeywords: propertyKeywords$1,
  nonStandardPropertyKeywords: nonStandardPropertyKeywords$1,
  colorKeywords: colorKeywords$1,
  valueKeywords: valueKeywords$1,
  fontProperties: fontProperties$1,
  allowNested: true,
  lineComment: "//",
  tokenHooks: {
    "/": function(stream, state) {
      if (stream.eat("/")) {
        stream.skipToEnd();
        return ["comment", "comment"];
      } else if (stream.eat("*")) {
        state.tokenize = tokenCComment$3;
        return tokenCComment$3(stream, state);
      } else {
        return ["operator", "operator"];
      }
    },
    "@": function(stream) {
      if (stream.eat("{")) return [null, "interpolation"];
      if (stream.match(/^(charset|document|font-face|import|(-(moz|ms|o|webkit)-)?keyframes|media|namespace|page|supports)\b/i, false)) return false;
      stream.eatWhile(/[\w\\\-]/);
      if (stream.match(/^\s*:/, false))
        return ["def", "variable-definition"];
      return ["variableName", "variable"];
    },
    "&": function() {
      return ["atom", "atom"];
    }
  }
});
const gss = mkCSS({
  name: "gss",
  documentTypes: documentTypes$1,
  mediaTypes: mediaTypes$1,
  mediaFeatures: mediaFeatures$1,
  propertyKeywords: propertyKeywords$1,
  nonStandardPropertyKeywords: nonStandardPropertyKeywords$1,
  fontProperties: fontProperties$1,
  counterDescriptors,
  colorKeywords: colorKeywords$1,
  valueKeywords: valueKeywords$1,
  supportsAtComponent: true,
  tokenHooks: {
    "/": function(stream, state) {
      if (!stream.eat("*")) return false;
      state.tokenize = tokenCComment$3;
      return tokenCComment$3(stream, state);
    }
  }
});
const css = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  gss,
  mkCSS
});
var variable_regex$1 = /({)?[a-zA-Z0-9_]+(})?/;
function tokenString$q(stream, state) {
  var current, prev, found_var = false;
  while (!stream.eol() && (current = stream.next()) != state.pending) {
    if (current === "$" && prev != "\\" && state.pending == '"') {
      found_var = true;
      break;
    }
    prev = current;
  }
  if (found_var) {
    stream.backUp(1);
  }
  if (current == state.pending) {
    state.continueString = false;
  } else {
    state.continueString = true;
  }
  return "string";
}
function tokenize$4(stream, state) {
  var ch2 = stream.next();
  if (ch2 === "$") {
    if (stream.match(variable_regex$1)) {
      return "variableName.special";
    }
    return "variable";
  }
  if (state.continueString) {
    stream.backUp(1);
    return tokenString$q(stream, state);
  }
  if (stream.match(/(\s+)?\w+\(/) || stream.match(/(\s+)?\w+\ \(/)) {
    stream.backUp(1);
    return "def";
  }
  if (ch2 == "#") {
    stream.skipToEnd();
    return "comment";
  }
  if (ch2 == "'" || ch2 == '"') {
    state.pending = ch2;
    return tokenString$q(stream, state);
  }
  if (ch2 == "(" || ch2 == ")") {
    return "bracket";
  }
  if (ch2.match(/[0-9]/)) {
    return "number";
  }
  stream.eatWhile(/[\w-]/);
  return null;
}
const cmake = {
  name: "cmake",
  startState: function() {
    var state = {};
    state.inDefinition = false;
    state.inInclude = false;
    state.continueString = false;
    state.pending = false;
    return state;
  },
  token: function(stream, state) {
    if (stream.eatSpace()) return null;
    return tokenize$4(stream, state);
  }
};
const cmake$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  cmake
});
var ERRORCLASS$1 = "error";
function wordRegexp$e(words2) {
  return new RegExp("^((" + words2.join(")|(") + "))\\b");
}
var operators$6 = /^(?:->|=>|\+[+=]?|-[\-=]?|\*[\*=]?|\/[\/=]?|[=!]=|<[><]?=?|>>?=?|%=?|&=?|\|=?|\^=?|\~|!|\?|(or|and|\|\||&&|\?)=)/;
var delimiters$1 = /^(?:[()\[\]{},:`=;]|\.\.?\.?)/;
var identifiers$8 = /^[_A-Za-z$][_A-Za-z$0-9]*/;
var atProp = /^@[_A-Za-z$][_A-Za-z$0-9]*/;
var wordOperators$3 = wordRegexp$e([
  "and",
  "or",
  "not",
  "is",
  "isnt",
  "in",
  "instanceof",
  "typeof"
]);
var indentKeywords$1 = [
  "for",
  "while",
  "loop",
  "if",
  "unless",
  "else",
  "switch",
  "try",
  "catch",
  "finally",
  "class"
];
var commonKeywords$5 = [
  "break",
  "by",
  "continue",
  "debugger",
  "delete",
  "do",
  "in",
  "of",
  "new",
  "return",
  "then",
  "this",
  "@",
  "throw",
  "when",
  "until",
  "extends"
];
var keywords$B = wordRegexp$e(indentKeywords$1.concat(commonKeywords$5));
indentKeywords$1 = wordRegexp$e(indentKeywords$1);
var stringPrefixes$2 = /^('{3}|\"{3}|['\"])/;
var regexPrefixes = /^(\/{3}|\/)/;
var commonConstants = ["Infinity", "NaN", "undefined", "null", "true", "false", "on", "off", "yes", "no"];
var constants = wordRegexp$e(commonConstants);
function tokenBase$H(stream, state) {
  if (stream.sol()) {
    if (state.scope.align === null) state.scope.align = false;
    var scopeOffset = state.scope.offset;
    if (stream.eatSpace()) {
      var lineOffset = stream.indentation();
      if (lineOffset > scopeOffset && state.scope.type == "coffee") {
        return "indent";
      } else if (lineOffset < scopeOffset) {
        return "dedent";
      }
      return null;
    } else {
      if (scopeOffset > 0) {
        dedent$1(stream, state);
      }
    }
  }
  if (stream.eatSpace()) {
    return null;
  }
  var ch2 = stream.peek();
  if (stream.match("####")) {
    stream.skipToEnd();
    return "comment";
  }
  if (stream.match("###")) {
    state.tokenize = longComment;
    return state.tokenize(stream, state);
  }
  if (ch2 === "#") {
    stream.skipToEnd();
    return "comment";
  }
  if (stream.match(/^-?[0-9\.]/, false)) {
    var floatLiteral = false;
    if (stream.match(/^-?\d*\.\d+(e[\+\-]?\d+)?/i)) {
      floatLiteral = true;
    }
    if (stream.match(/^-?\d+\.\d*/)) {
      floatLiteral = true;
    }
    if (stream.match(/^-?\.\d+/)) {
      floatLiteral = true;
    }
    if (floatLiteral) {
      if (stream.peek() == ".") {
        stream.backUp(1);
      }
      return "number";
    }
    var intLiteral = false;
    if (stream.match(/^-?0x[0-9a-f]+/i)) {
      intLiteral = true;
    }
    if (stream.match(/^-?[1-9]\d*(e[\+\-]?\d+)?/)) {
      intLiteral = true;
    }
    if (stream.match(/^-?0(?![\dx])/i)) {
      intLiteral = true;
    }
    if (intLiteral) {
      return "number";
    }
  }
  if (stream.match(stringPrefixes$2)) {
    state.tokenize = tokenFactory(stream.current(), false, "string");
    return state.tokenize(stream, state);
  }
  if (stream.match(regexPrefixes)) {
    if (stream.current() != "/" || stream.match(/^.*\//, false)) {
      state.tokenize = tokenFactory(stream.current(), true, "string.special");
      return state.tokenize(stream, state);
    } else {
      stream.backUp(1);
    }
  }
  if (stream.match(operators$6) || stream.match(wordOperators$3)) {
    return "operator";
  }
  if (stream.match(delimiters$1)) {
    return "punctuation";
  }
  if (stream.match(constants)) {
    return "atom";
  }
  if (stream.match(atProp) || state.prop && stream.match(identifiers$8)) {
    return "property";
  }
  if (stream.match(keywords$B)) {
    return "keyword";
  }
  if (stream.match(identifiers$8)) {
    return "variable";
  }
  stream.next();
  return ERRORCLASS$1;
}
function tokenFactory(delimiter2, singleline, outclass) {
  return function(stream, state) {
    while (!stream.eol()) {
      stream.eatWhile(/[^'"\/\\]/);
      if (stream.eat("\\")) {
        stream.next();
        if (singleline && stream.eol()) {
          return outclass;
        }
      } else if (stream.match(delimiter2)) {
        state.tokenize = tokenBase$H;
        return outclass;
      } else {
        stream.eat(/['"\/]/);
      }
    }
    if (singleline) {
      state.tokenize = tokenBase$H;
    }
    return outclass;
  };
}
function longComment(stream, state) {
  while (!stream.eol()) {
    stream.eatWhile(/[^#]/);
    if (stream.match("###")) {
      state.tokenize = tokenBase$H;
      break;
    }
    stream.eatWhile("#");
  }
  return "comment";
}
function indent$2(stream, state, type2 = "coffee") {
  var offset = 0, align = false, alignOffset = null;
  for (var scope = state.scope; scope; scope = scope.prev) {
    if (scope.type === "coffee" || scope.type == "}") {
      offset = scope.offset + stream.indentUnit;
      break;
    }
  }
  if (type2 !== "coffee") {
    align = null;
    alignOffset = stream.column() + stream.current().length;
  } else if (state.scope.align) {
    state.scope.align = false;
  }
  state.scope = {
    offset,
    type: type2,
    prev: state.scope,
    align,
    alignOffset
  };
}
function dedent$1(stream, state) {
  if (!state.scope.prev) return;
  if (state.scope.type === "coffee") {
    var _indent = stream.indentation();
    var matched = false;
    for (var scope = state.scope; scope; scope = scope.prev) {
      if (_indent === scope.offset) {
        matched = true;
        break;
      }
    }
    if (!matched) {
      return true;
    }
    while (state.scope.prev && state.scope.offset !== _indent) {
      state.scope = state.scope.prev;
    }
    return false;
  } else {
    state.scope = state.scope.prev;
    return false;
  }
}
function tokenLexer$1(stream, state) {
  var style2 = state.tokenize(stream, state);
  var current = stream.current();
  if (current === "return") {
    state.dedent = true;
  }
  if ((current === "->" || current === "=>") && stream.eol() || style2 === "indent") {
    indent$2(stream, state);
  }
  var delimiter_index = "[({".indexOf(current);
  if (delimiter_index !== -1) {
    indent$2(stream, state, "])}".slice(delimiter_index, delimiter_index + 1));
  }
  if (indentKeywords$1.exec(current)) {
    indent$2(stream, state);
  }
  if (current == "then") {
    dedent$1(stream, state);
  }
  if (style2 === "dedent") {
    if (dedent$1(stream, state)) {
      return ERRORCLASS$1;
    }
  }
  delimiter_index = "])}".indexOf(current);
  if (delimiter_index !== -1) {
    while (state.scope.type == "coffee" && state.scope.prev)
      state.scope = state.scope.prev;
    if (state.scope.type == current)
      state.scope = state.scope.prev;
  }
  if (state.dedent && stream.eol()) {
    if (state.scope.type == "coffee" && state.scope.prev)
      state.scope = state.scope.prev;
    state.dedent = false;
  }
  return style2 == "indent" || style2 == "dedent" ? null : style2;
}
const coffeeScript = {
  name: "coffeescript",
  startState: function() {
    return {
      tokenize: tokenBase$H,
      scope: { offset: 0, type: "coffee", prev: null, align: false },
      prop: false,
      dedent: 0
    };
  },
  token: function(stream, state) {
    var fillAlign = state.scope.align === null && state.scope;
    if (fillAlign && stream.sol()) fillAlign.align = false;
    var style2 = tokenLexer$1(stream, state);
    if (style2 && style2 != "comment") {
      if (fillAlign) fillAlign.align = true;
      state.prop = style2 == "punctuation" && stream.current() == ".";
    }
    return style2;
  },
  indent: function(state, text2) {
    if (state.tokenize != tokenBase$H) return 0;
    var scope = state.scope;
    var closer = text2 && "])}".indexOf(text2.charAt(0)) > -1;
    if (closer) while (scope.type == "coffee" && scope.prev) scope = scope.prev;
    var closes = closer && scope.type === text2.charAt(0);
    if (scope.align)
      return scope.alignOffset - (closes ? 1 : 0);
    else
      return (closes ? scope.prev : scope).offset;
  },
  languageData: {
    commentTokens: { line: "#" }
  }
};
const coffeescript = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  coffeeScript
});
var specialForm = /^(block|let*|return-from|catch|load-time-value|setq|eval-when|locally|symbol-macrolet|flet|macrolet|tagbody|function|multiple-value-call|the|go|multiple-value-prog1|throw|if|progn|unwind-protect|labels|progv|let|quote)$/;
var assumeBody = /^with|^def|^do|^prog|case$|^cond$|bind$|when$|unless$/;
var numLiteral = /^(?:[+\-]?(?:\d+|\d*\.\d+)(?:[efd][+\-]?\d+)?|[+\-]?\d+(?:\/[+\-]?\d+)?|#b[+\-]?[01]+|#o[+\-]?[0-7]+|#x[+\-]?[\da-f]+)/;
var symbol$2 = /[^\s'`,@()\[\]";]/;
var type$5;
function readSym(stream) {
  var ch2;
  while (ch2 = stream.next()) {
    if (ch2 == "\\") stream.next();
    else if (!symbol$2.test(ch2)) {
      stream.backUp(1);
      break;
    }
  }
  return stream.current();
}
function base(stream, state) {
  if (stream.eatSpace()) {
    type$5 = "ws";
    return null;
  }
  if (stream.match(numLiteral)) return "number";
  var ch2 = stream.next();
  if (ch2 == "\\") ch2 = stream.next();
  if (ch2 == '"') return (state.tokenize = inString)(stream, state);
  else if (ch2 == "(") {
    type$5 = "open";
    return "bracket";
  } else if (ch2 == ")") {
    type$5 = "close";
    return "bracket";
  } else if (ch2 == ";") {
    stream.skipToEnd();
    type$5 = "ws";
    return "comment";
  } else if (/['`,@]/.test(ch2)) return null;
  else if (ch2 == "|") {
    if (stream.skipTo("|")) {
      stream.next();
      return "variableName";
    } else {
      stream.skipToEnd();
      return "error";
    }
  } else if (ch2 == "#") {
    var ch2 = stream.next();
    if (ch2 == "(") {
      type$5 = "open";
      return "bracket";
    } else if (/[+\-=\.']/.test(ch2)) return null;
    else if (/\d/.test(ch2) && stream.match(/^\d*#/)) return null;
    else if (ch2 == "|") return (state.tokenize = inComment)(stream, state);
    else if (ch2 == ":") {
      readSym(stream);
      return "meta";
    } else if (ch2 == "\\") {
      stream.next();
      readSym(stream);
      return "string.special";
    } else return "error";
  } else {
    var name = readSym(stream);
    if (name == ".") return null;
    type$5 = "symbol";
    if (name == "nil" || name == "t" || name.charAt(0) == ":") return "atom";
    if (state.lastType == "open" && (specialForm.test(name) || assumeBody.test(name))) return "keyword";
    if (name.charAt(0) == "&") return "variableName.special";
    return "variableName";
  }
}
function inString(stream, state) {
  var escaped = false, next2;
  while (next2 = stream.next()) {
    if (next2 == '"' && !escaped) {
      state.tokenize = base;
      break;
    }
    escaped = !escaped && next2 == "\\";
  }
  return "string";
}
function inComment(stream, state) {
  var next2, last;
  while (next2 = stream.next()) {
    if (next2 == "#" && last == "|") {
      state.tokenize = base;
      break;
    }
    last = next2;
  }
  type$5 = "ws";
  return "comment";
}
const commonLisp = {
  name: "commonlisp",
  startState: function() {
    return { ctx: { prev: null, start: 0, indentTo: 0 }, lastType: null, tokenize: base };
  },
  token: function(stream, state) {
    if (stream.sol() && typeof state.ctx.indentTo != "number")
      state.ctx.indentTo = state.ctx.start + 1;
    type$5 = null;
    var style2 = state.tokenize(stream, state);
    if (type$5 != "ws") {
      if (state.ctx.indentTo == null) {
        if (type$5 == "symbol" && assumeBody.test(stream.current()))
          state.ctx.indentTo = state.ctx.start + stream.indentUnit;
        else
          state.ctx.indentTo = "next";
      } else if (state.ctx.indentTo == "next") {
        state.ctx.indentTo = stream.column();
      }
      state.lastType = type$5;
    }
    if (type$5 == "open") state.ctx = { prev: state.ctx, start: stream.column(), indentTo: null };
    else if (type$5 == "close") state.ctx = state.ctx.prev || state.ctx;
    return style2;
  },
  indent: function(state) {
    var i2 = state.ctx.indentTo;
    return typeof i2 == "number" ? i2 : state.ctx.start + 1;
  },
  languageData: {
    commentTokens: { line: ";;", block: { open: "#|", close: "|#" } },
    closeBrackets: { brackets: ["(", "[", "{", '"'] }
  }
};
const commonlisp = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  commonLisp
});
var wordRegexp$d = function(words2) {
  return new RegExp("^(?:" + words2.join("|") + ")$", "i");
};
var tokenBase$G = function(stream) {
  curPunc$b = null;
  var ch2 = stream.next();
  if (ch2 === '"') {
    stream.match(/^.*?"/);
    return "string";
  }
  if (ch2 === "'") {
    stream.match(/^.*?'/);
    return "string";
  }
  if (/[{}\(\),\.;\[\]]/.test(ch2)) {
    curPunc$b = ch2;
    return "punctuation";
  } else if (ch2 === "/" && stream.eat("/")) {
    stream.skipToEnd();
    return "comment";
  } else if (operatorChars$2.test(ch2)) {
    stream.eatWhile(operatorChars$2);
    return null;
  } else {
    stream.eatWhile(/[_\w\d]/);
    if (stream.eat(":")) {
      stream.eatWhile(/[\w\d_\-]/);
      return "atom";
    }
    var word = stream.current();
    if (funcs.test(word)) return "builtin";
    if (preds.test(word)) return "def";
    if (keywords$A.test(word) || systemKeywords.test(word)) return "keyword";
    return "variable";
  }
};
var pushContext$d = function(state, type2, col) {
  return state.context = {
    prev: state.context,
    indent: state.indent,
    col,
    type: type2
  };
};
var popContext$d = function(state) {
  state.indent = state.context.indent;
  return state.context = state.context.prev;
};
var curPunc$b;
var funcs = wordRegexp$d(["abs", "acos", "allShortestPaths", "asin", "atan", "atan2", "avg", "ceil", "coalesce", "collect", "cos", "cot", "count", "degrees", "e", "endnode", "exp", "extract", "filter", "floor", "haversin", "head", "id", "keys", "labels", "last", "left", "length", "log", "log10", "lower", "ltrim", "max", "min", "node", "nodes", "percentileCont", "percentileDisc", "pi", "radians", "rand", "range", "reduce", "rel", "relationship", "relationships", "replace", "reverse", "right", "round", "rtrim", "shortestPath", "sign", "sin", "size", "split", "sqrt", "startnode", "stdev", "stdevp", "str", "substring", "sum", "tail", "tan", "timestamp", "toFloat", "toInt", "toString", "trim", "type", "upper"]);
var preds = wordRegexp$d(["all", "and", "any", "contains", "exists", "has", "in", "none", "not", "or", "single", "xor"]);
var keywords$A = wordRegexp$d(["as", "asc", "ascending", "assert", "by", "case", "commit", "constraint", "create", "csv", "cypher", "delete", "desc", "descending", "detach", "distinct", "drop", "else", "end", "ends", "explain", "false", "fieldterminator", "foreach", "from", "headers", "in", "index", "is", "join", "limit", "load", "match", "merge", "null", "on", "optional", "order", "periodic", "profile", "remove", "return", "scan", "set", "skip", "start", "starts", "then", "true", "union", "unique", "unwind", "using", "when", "where", "with", "call", "yield"]);
var systemKeywords = wordRegexp$d(["access", "active", "assign", "all", "alter", "as", "catalog", "change", "copy", "create", "constraint", "constraints", "current", "database", "databases", "dbms", "default", "deny", "drop", "element", "elements", "exists", "from", "grant", "graph", "graphs", "if", "index", "indexes", "label", "labels", "management", "match", "name", "names", "new", "node", "nodes", "not", "of", "on", "or", "password", "populated", "privileges", "property", "read", "relationship", "relationships", "remove", "replace", "required", "revoke", "role", "roles", "set", "show", "start", "status", "stop", "suspended", "to", "traverse", "type", "types", "user", "users", "with", "write"]);
var operatorChars$2 = /[*+\-<>=&|~%^]/;
const cypher = {
  name: "cypher",
  startState: function() {
    return {
      tokenize: tokenBase$G,
      context: null,
      indent: 0,
      col: 0
    };
  },
  token: function(stream, state) {
    if (stream.sol()) {
      if (state.context && state.context.align == null) {
        state.context.align = false;
      }
      state.indent = stream.indentation();
    }
    if (stream.eatSpace()) {
      return null;
    }
    var style2 = state.tokenize(stream, state);
    if (style2 !== "comment" && state.context && state.context.align == null && state.context.type !== "pattern") {
      state.context.align = true;
    }
    if (curPunc$b === "(") {
      pushContext$d(state, ")", stream.column());
    } else if (curPunc$b === "[") {
      pushContext$d(state, "]", stream.column());
    } else if (curPunc$b === "{") {
      pushContext$d(state, "}", stream.column());
    } else if (/[\]\}\)]/.test(curPunc$b)) {
      while (state.context && state.context.type === "pattern") {
        popContext$d(state);
      }
      if (state.context && curPunc$b === state.context.type) {
        popContext$d(state);
      }
    } else if (curPunc$b === "." && state.context && state.context.type === "pattern") {
      popContext$d(state);
    } else if (/atom|string|variable/.test(style2) && state.context) {
      if (/[\}\]]/.test(state.context.type)) {
        pushContext$d(state, "pattern", stream.column());
      } else if (state.context.type === "pattern" && !state.context.align) {
        state.context.align = true;
        state.context.col = stream.column();
      }
    }
    return style2;
  },
  indent: function(state, textAfter, cx2) {
    var firstChar = textAfter && textAfter.charAt(0);
    var context = state.context;
    if (/[\]\}]/.test(firstChar)) {
      while (context && context.type === "pattern") {
        context = context.prev;
      }
    }
    var closing2 = context && firstChar === context.type;
    if (!context) return 0;
    if (context.type === "keywords") return null;
    if (context.align) return context.col + (closing2 ? 0 : 1);
    return context.indent + (closing2 ? 0 : cx2.unit);
  }
};
const cypher$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  cypher
});
function wordRegexp$c(words2) {
  return new RegExp("^((" + words2.join(")|(") + "))\\b");
}
var wordOperators$2 = wordRegexp$c(["and", "or", "not", "is"]);
var commonKeywords$4 = [
  "as",
  "assert",
  "break",
  "class",
  "continue",
  "def",
  "del",
  "elif",
  "else",
  "except",
  "finally",
  "for",
  "from",
  "global",
  "if",
  "import",
  "lambda",
  "pass",
  "raise",
  "return",
  "try",
  "while",
  "with",
  "yield",
  "in",
  "False",
  "True"
];
var commonBuiltins$1 = [
  "abs",
  "all",
  "any",
  "bin",
  "bool",
  "bytearray",
  "callable",
  "chr",
  "classmethod",
  "compile",
  "complex",
  "delattr",
  "dict",
  "dir",
  "divmod",
  "enumerate",
  "eval",
  "filter",
  "float",
  "format",
  "frozenset",
  "getattr",
  "globals",
  "hasattr",
  "hash",
  "help",
  "hex",
  "id",
  "input",
  "int",
  "isinstance",
  "issubclass",
  "iter",
  "len",
  "list",
  "locals",
  "map",
  "max",
  "memoryview",
  "min",
  "next",
  "object",
  "oct",
  "open",
  "ord",
  "pow",
  "property",
  "range",
  "repr",
  "reversed",
  "round",
  "set",
  "setattr",
  "slice",
  "sorted",
  "staticmethod",
  "str",
  "sum",
  "super",
  "tuple",
  "type",
  "vars",
  "zip",
  "__import__",
  "NotImplemented",
  "Ellipsis",
  "__debug__"
];
function top(state) {
  return state.scopes[state.scopes.length - 1];
}
function mkPython(parserConf) {
  var ERRORCLASS2 = "error";
  var delimiters2 = parserConf.delimiters || parserConf.singleDelimiters || /^[\(\)\[\]\{\}@,:`=;\.\\]/;
  var operators2 = [
    parserConf.singleOperators,
    parserConf.doubleOperators,
    parserConf.doubleDelimiters,
    parserConf.tripleDelimiters,
    parserConf.operators || /^([-+*/%\/&|^]=?|[<>=]+|\/\/=?|\*\*=?|!=|[~!@]|\.\.\.)/
  ];
  for (var i2 = 0; i2 < operators2.length; i2++) if (!operators2[i2]) operators2.splice(i2--, 1);
  var hangingIndent = parserConf.hangingIndent;
  var myKeywords = commonKeywords$4, myBuiltins = commonBuiltins$1;
  if (parserConf.extra_keywords != void 0)
    myKeywords = myKeywords.concat(parserConf.extra_keywords);
  if (parserConf.extra_builtins != void 0)
    myBuiltins = myBuiltins.concat(parserConf.extra_builtins);
  var py3 = !(parserConf.version && Number(parserConf.version) < 3);
  if (py3) {
    var identifiers2 = parserConf.identifiers || /^[_A-Za-z\u00A1-\uFFFF][_A-Za-z0-9\u00A1-\uFFFF]*/;
    myKeywords = myKeywords.concat(["nonlocal", "None", "aiter", "anext", "async", "await", "breakpoint", "match", "case"]);
    myBuiltins = myBuiltins.concat(["ascii", "bytes", "exec", "print"]);
    var stringPrefixes2 = new RegExp(`^(([rbuf]|(br)|(rb)|(fr)|(rf))?('{3}|"{3}|['"]))`, "i");
  } else {
    var identifiers2 = parserConf.identifiers || /^[_A-Za-z][_A-Za-z0-9]*/;
    myKeywords = myKeywords.concat(["exec", "print"]);
    myBuiltins = myBuiltins.concat([
      "apply",
      "basestring",
      "buffer",
      "cmp",
      "coerce",
      "execfile",
      "file",
      "intern",
      "long",
      "raw_input",
      "reduce",
      "reload",
      "unichr",
      "unicode",
      "xrange",
      "None"
    ]);
    var stringPrefixes2 = new RegExp(`^(([rubf]|(ur)|(br))?('{3}|"{3}|['"]))`, "i");
  }
  var keywords2 = wordRegexp$c(myKeywords);
  var builtins2 = wordRegexp$c(myBuiltins);
  function tokenBase2(stream, state) {
    var sol = stream.sol() && state.lastToken != "\\";
    if (sol) state.indent = stream.indentation();
    if (sol && top(state).type == "py") {
      var scopeOffset = top(state).offset;
      if (stream.eatSpace()) {
        var lineOffset = stream.indentation();
        if (lineOffset > scopeOffset)
          pushPyScope(stream, state);
        else if (lineOffset < scopeOffset && dedent2(stream, state) && stream.peek() != "#")
          state.errorToken = true;
        return null;
      } else {
        var style2 = tokenBaseInner(stream, state);
        if (scopeOffset > 0 && dedent2(stream, state))
          style2 += " " + ERRORCLASS2;
        return style2;
      }
    }
    return tokenBaseInner(stream, state);
  }
  function tokenBaseInner(stream, state, inFormat) {
    if (stream.eatSpace()) return null;
    if (!inFormat && stream.match(/^#.*/)) return "comment";
    if (stream.match(/^[0-9\.]/, false)) {
      var floatLiteral = false;
      if (stream.match(/^[\d_]*\.\d+(e[\+\-]?\d+)?/i)) {
        floatLiteral = true;
      }
      if (stream.match(/^[\d_]+\.\d*/)) {
        floatLiteral = true;
      }
      if (stream.match(/^\.\d+/)) {
        floatLiteral = true;
      }
      if (floatLiteral) {
        stream.eat(/J/i);
        return "number";
      }
      var intLiteral = false;
      if (stream.match(/^0x[0-9a-f_]+/i)) intLiteral = true;
      if (stream.match(/^0b[01_]+/i)) intLiteral = true;
      if (stream.match(/^0o[0-7_]+/i)) intLiteral = true;
      if (stream.match(/^[1-9][\d_]*(e[\+\-]?[\d_]+)?/)) {
        stream.eat(/J/i);
        intLiteral = true;
      }
      if (stream.match(/^0(?![\dx])/i)) intLiteral = true;
      if (intLiteral) {
        stream.eat(/L/i);
        return "number";
      }
    }
    if (stream.match(stringPrefixes2)) {
      var isFmtString = stream.current().toLowerCase().indexOf("f") !== -1;
      if (!isFmtString) {
        state.tokenize = tokenStringFactory2(stream.current(), state.tokenize);
        return state.tokenize(stream, state);
      } else {
        state.tokenize = formatStringFactory(stream.current(), state.tokenize);
        return state.tokenize(stream, state);
      }
    }
    for (var i3 = 0; i3 < operators2.length; i3++)
      if (stream.match(operators2[i3])) return "operator";
    if (stream.match(delimiters2)) return "punctuation";
    if (state.lastToken == "." && stream.match(identifiers2))
      return "property";
    if (stream.match(keywords2) || stream.match(wordOperators$2))
      return "keyword";
    if (stream.match(builtins2))
      return "builtin";
    if (stream.match(/^(self|cls)\b/))
      return "self";
    if (stream.match(identifiers2)) {
      if (state.lastToken == "def" || state.lastToken == "class")
        return "def";
      return "variable";
    }
    stream.next();
    return inFormat ? null : ERRORCLASS2;
  }
  function formatStringFactory(delimiter2, tokenOuter) {
    while ("rubf".indexOf(delimiter2.charAt(0).toLowerCase()) >= 0)
      delimiter2 = delimiter2.substr(1);
    var singleline = delimiter2.length == 1;
    var OUTCLASS = "string";
    function tokenNestedExpr(depth) {
      return function(stream, state) {
        var inner = tokenBaseInner(stream, state, true);
        if (inner == "punctuation") {
          if (stream.current() == "{") {
            state.tokenize = tokenNestedExpr(depth + 1);
          } else if (stream.current() == "}") {
            if (depth > 1) state.tokenize = tokenNestedExpr(depth - 1);
            else state.tokenize = tokenString3;
          }
        }
        return inner;
      };
    }
    function tokenString3(stream, state) {
      while (!stream.eol()) {
        stream.eatWhile(/[^'"\{\}\\]/);
        if (stream.eat("\\")) {
          stream.next();
          if (singleline && stream.eol())
            return OUTCLASS;
        } else if (stream.match(delimiter2)) {
          state.tokenize = tokenOuter;
          return OUTCLASS;
        } else if (stream.match("{{")) {
          return OUTCLASS;
        } else if (stream.match("{", false)) {
          state.tokenize = tokenNestedExpr(0);
          if (stream.current()) return OUTCLASS;
          else return state.tokenize(stream, state);
        } else if (stream.match("}}")) {
          return OUTCLASS;
        } else if (stream.match("}")) {
          return ERRORCLASS2;
        } else {
          stream.eat(/['"]/);
        }
      }
      if (singleline) {
        if (parserConf.singleLineStringErrors)
          return ERRORCLASS2;
        else
          state.tokenize = tokenOuter;
      }
      return OUTCLASS;
    }
    tokenString3.isString = true;
    return tokenString3;
  }
  function tokenStringFactory2(delimiter2, tokenOuter) {
    while ("rubf".indexOf(delimiter2.charAt(0).toLowerCase()) >= 0)
      delimiter2 = delimiter2.substr(1);
    var singleline = delimiter2.length == 1;
    var OUTCLASS = "string";
    function tokenString3(stream, state) {
      while (!stream.eol()) {
        stream.eatWhile(/[^'"\\]/);
        if (stream.eat("\\")) {
          stream.next();
          if (singleline && stream.eol())
            return OUTCLASS;
        } else if (stream.match(delimiter2)) {
          state.tokenize = tokenOuter;
          return OUTCLASS;
        } else {
          stream.eat(/['"]/);
        }
      }
      if (singleline) {
        if (parserConf.singleLineStringErrors)
          return ERRORCLASS2;
        else
          state.tokenize = tokenOuter;
      }
      return OUTCLASS;
    }
    tokenString3.isString = true;
    return tokenString3;
  }
  function pushPyScope(stream, state) {
    while (top(state).type != "py") state.scopes.pop();
    state.scopes.push({
      offset: top(state).offset + stream.indentUnit,
      type: "py",
      align: null
    });
  }
  function pushBracketScope(stream, state, type2) {
    var align = stream.match(/^[\s\[\{\(]*(?:#|$)/, false) ? null : stream.column() + 1;
    state.scopes.push({
      offset: state.indent + (hangingIndent || stream.indentUnit),
      type: type2,
      align
    });
  }
  function dedent2(stream, state) {
    var indented = stream.indentation();
    while (state.scopes.length > 1 && top(state).offset > indented) {
      if (top(state).type != "py") return true;
      state.scopes.pop();
    }
    return top(state).offset != indented;
  }
  function tokenLexer2(stream, state) {
    if (stream.sol()) {
      state.beginningOfLine = true;
      state.dedent = false;
    }
    var style2 = state.tokenize(stream, state);
    var current = stream.current();
    if (state.beginningOfLine && current == "@")
      return stream.match(identifiers2, false) ? "meta" : py3 ? "operator" : ERRORCLASS2;
    if (/\S/.test(current)) state.beginningOfLine = false;
    if ((style2 == "variable" || style2 == "builtin") && state.lastToken == "meta")
      style2 = "meta";
    if (current == "pass" || current == "return")
      state.dedent = true;
    if (current == "lambda") state.lambda = true;
    if (current == ":" && !state.lambda && top(state).type == "py" && stream.match(/^\s*(?:#|$)/, false))
      pushPyScope(stream, state);
    if (current.length == 1 && !/string|comment/.test(style2)) {
      var delimiter_index = "[({".indexOf(current);
      if (delimiter_index != -1)
        pushBracketScope(stream, state, "])}".slice(delimiter_index, delimiter_index + 1));
      delimiter_index = "])}".indexOf(current);
      if (delimiter_index != -1) {
        if (top(state).type == current) state.indent = state.scopes.pop().offset - (hangingIndent || stream.indentUnit);
        else return ERRORCLASS2;
      }
    }
    if (state.dedent && stream.eol() && top(state).type == "py" && state.scopes.length > 1)
      state.scopes.pop();
    return style2;
  }
  return {
    name: "python",
    startState: function() {
      return {
        tokenize: tokenBase2,
        scopes: [{ offset: 0, type: "py", align: null }],
        indent: 0,
        lastToken: null,
        lambda: false,
        dedent: 0
      };
    },
    token: function(stream, state) {
      var addErr = state.errorToken;
      if (addErr) state.errorToken = false;
      var style2 = tokenLexer2(stream, state);
      if (style2 && style2 != "comment")
        state.lastToken = style2 == "keyword" || style2 == "punctuation" ? stream.current() : style2;
      if (style2 == "punctuation") style2 = null;
      if (stream.eol() && state.lambda)
        state.lambda = false;
      return addErr ? ERRORCLASS2 : style2;
    },
    indent: function(state, textAfter, cx2) {
      if (state.tokenize != tokenBase2)
        return state.tokenize.isString ? null : 0;
      var scope = top(state);
      var closing2 = scope.type == textAfter.charAt(0) || scope.type == "py" && !state.dedent && /^(else:|elif |except |finally:)/.test(textAfter);
      if (scope.align != null)
        return scope.align - (closing2 ? 1 : 0);
      else
        return scope.offset - (closing2 ? hangingIndent || cx2.unit : 0);
    },
    languageData: {
      autocomplete: commonKeywords$4.concat(commonBuiltins$1).concat(["exec", "print"]),
      indentOnInput: /^\s*([\}\]\)]|else:|elif |except |finally:)$/,
      commentTokens: { line: "#" },
      closeBrackets: { brackets: ["(", "[", "{", "'", '"', "'''", '"""'] }
    }
  };
}
var words$i = function(str) {
  return str.split(" ");
};
mkPython({});
const cython = mkPython({
  extra_keywords: words$i("by cdef cimport cpdef ctypedef enum except extern gil include nogil property public readonly struct union DEF IF ELIF ELSE")
});
const python = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  cython,
  mkPython
});
function wordRegExp(words2, end2) {
  return new RegExp((end2 ? "" : "^") + "(?:" + words2.join("|") + ")" + (end2 ? "$" : "\\b"));
}
function chain$a(tokenize2, stream, state) {
  state.tokenize.push(tokenize2);
  return tokenize2(stream, state);
}
var operators$5 = /^(?:[-+/%|&^]|\*\*?|[<>]{2})/;
var conditionalOperators = /^(?:[=!]~|===|<=>|[<>=!]=?|[|&]{2}|~)/;
var indexingOperators = /^(?:\[\][?=]?)/;
var anotherOperators = /^(?:\.(?:\.{2})?|->|[?:])/;
var idents = /^[a-z_\u009F-\uFFFF][a-zA-Z0-9_\u009F-\uFFFF]*/;
var types$5 = /^[A-Z_\u009F-\uFFFF][a-zA-Z0-9_\u009F-\uFFFF]*/;
var keywords$z = wordRegExp([
  "abstract",
  "alias",
  "as",
  "asm",
  "begin",
  "break",
  "case",
  "class",
  "def",
  "do",
  "else",
  "elsif",
  "end",
  "ensure",
  "enum",
  "extend",
  "for",
  "fun",
  "if",
  "include",
  "instance_sizeof",
  "lib",
  "macro",
  "module",
  "next",
  "of",
  "out",
  "pointerof",
  "private",
  "protected",
  "rescue",
  "return",
  "require",
  "select",
  "sizeof",
  "struct",
  "super",
  "then",
  "type",
  "typeof",
  "uninitialized",
  "union",
  "unless",
  "until",
  "when",
  "while",
  "with",
  "yield",
  "__DIR__",
  "__END_LINE__",
  "__FILE__",
  "__LINE__"
]);
var atomWords = wordRegExp(["true", "false", "nil", "self"]);
var indentKeywordsArray = [
  "def",
  "fun",
  "macro",
  "class",
  "module",
  "struct",
  "lib",
  "enum",
  "union",
  "do",
  "for"
];
var indentKeywords = wordRegExp(indentKeywordsArray);
var indentExpressionKeywordsArray = ["if", "unless", "case", "while", "until", "begin", "then"];
var indentExpressionKeywords = wordRegExp(indentExpressionKeywordsArray);
var dedentKeywordsArray = ["end", "else", "elsif", "rescue", "ensure"];
var dedentKeywords = wordRegExp(dedentKeywordsArray);
var dedentPunctualsArray = ["\\)", "\\}", "\\]"];
var dedentPunctuals = new RegExp("^(?:" + dedentPunctualsArray.join("|") + ")$");
var nextTokenizer = {
  "def": tokenFollowIdent,
  "fun": tokenFollowIdent,
  "macro": tokenMacroDef,
  "class": tokenFollowType,
  "module": tokenFollowType,
  "struct": tokenFollowType,
  "lib": tokenFollowType,
  "enum": tokenFollowType,
  "union": tokenFollowType
};
var matching = { "[": "]", "{": "}", "(": ")", "<": ">" };
function tokenBase$F(stream, state) {
  if (stream.eatSpace()) {
    return null;
  }
  if (state.lastToken != "\\" && stream.match("{%", false)) {
    return chain$a(tokenMacro("%", "%"), stream, state);
  }
  if (state.lastToken != "\\" && stream.match("{{", false)) {
    return chain$a(tokenMacro("{", "}"), stream, state);
  }
  if (stream.peek() == "#") {
    stream.skipToEnd();
    return "comment";
  }
  var matched;
  if (stream.match(idents)) {
    stream.eat(/[?!]/);
    matched = stream.current();
    if (stream.eat(":")) {
      return "atom";
    } else if (state.lastToken == ".") {
      return "property";
    } else if (keywords$z.test(matched)) {
      if (indentKeywords.test(matched)) {
        if (!(matched == "fun" && state.blocks.indexOf("lib") >= 0) && !(matched == "def" && state.lastToken == "abstract")) {
          state.blocks.push(matched);
          state.currentIndent += 1;
        }
      } else if ((state.lastStyle == "operator" || !state.lastStyle) && indentExpressionKeywords.test(matched)) {
        state.blocks.push(matched);
        state.currentIndent += 1;
      } else if (matched == "end") {
        state.blocks.pop();
        state.currentIndent -= 1;
      }
      if (nextTokenizer.hasOwnProperty(matched)) {
        state.tokenize.push(nextTokenizer[matched]);
      }
      return "keyword";
    } else if (atomWords.test(matched)) {
      return "atom";
    }
    return "variable";
  }
  if (stream.eat("@")) {
    if (stream.peek() == "[") {
      return chain$a(tokenNest("[", "]", "meta"), stream, state);
    }
    stream.eat("@");
    stream.match(idents) || stream.match(types$5);
    return "propertyName";
  }
  if (stream.match(types$5)) {
    return "tag";
  }
  if (stream.eat(":")) {
    if (stream.eat('"')) {
      return chain$a(tokenQuote('"', "atom", false), stream, state);
    } else if (stream.match(idents) || stream.match(types$5) || stream.match(operators$5) || stream.match(conditionalOperators) || stream.match(indexingOperators)) {
      return "atom";
    }
    stream.eat(":");
    return "operator";
  }
  if (stream.eat('"')) {
    return chain$a(tokenQuote('"', "string", true), stream, state);
  }
  if (stream.peek() == "%") {
    var style2 = "string";
    var embed = true;
    var delim;
    if (stream.match("%r")) {
      style2 = "string.special";
      delim = stream.next();
    } else if (stream.match("%w")) {
      embed = false;
      delim = stream.next();
    } else if (stream.match("%q")) {
      embed = false;
      delim = stream.next();
    } else {
      if (delim = stream.match(/^%([^\w\s=])/)) {
        delim = delim[1];
      } else if (stream.match(/^%[a-zA-Z_\u009F-\uFFFF][\w\u009F-\uFFFF]*/)) {
        return "meta";
      } else if (stream.eat("%")) {
        return "operator";
      }
    }
    if (matching.hasOwnProperty(delim)) {
      delim = matching[delim];
    }
    return chain$a(tokenQuote(delim, style2, embed), stream, state);
  }
  if (matched = stream.match(/^<<-('?)([A-Z]\w*)\1/)) {
    return chain$a(tokenHereDoc(matched[2], !matched[1]), stream, state);
  }
  if (stream.eat("'")) {
    stream.match(/^(?:[^']|\\(?:[befnrtv0'"]|[0-7]{3}|u(?:[0-9a-fA-F]{4}|\{[0-9a-fA-F]{1,6}\})))/);
    stream.eat("'");
    return "atom";
  }
  if (stream.eat("0")) {
    if (stream.eat("x")) {
      stream.match(/^[0-9a-fA-F_]+/);
    } else if (stream.eat("o")) {
      stream.match(/^[0-7_]+/);
    } else if (stream.eat("b")) {
      stream.match(/^[01_]+/);
    }
    return "number";
  }
  if (stream.eat(/^\d/)) {
    stream.match(/^[\d_]*(?:\.[\d_]+)?(?:[eE][+-]?\d+)?/);
    return "number";
  }
  if (stream.match(operators$5)) {
    stream.eat("=");
    return "operator";
  }
  if (stream.match(conditionalOperators) || stream.match(anotherOperators)) {
    return "operator";
  }
  if (matched = stream.match(/[({[]/, false)) {
    matched = matched[0];
    return chain$a(tokenNest(matched, matching[matched], null), stream, state);
  }
  if (stream.eat("\\")) {
    stream.next();
    return "meta";
  }
  stream.next();
  return null;
}
function tokenNest(begin, end2, style2, started) {
  return function(stream, state) {
    if (!started && stream.match(begin)) {
      state.tokenize[state.tokenize.length - 1] = tokenNest(begin, end2, style2, true);
      state.currentIndent += 1;
      return style2;
    }
    var nextStyle = tokenBase$F(stream, state);
    if (stream.current() === end2) {
      state.tokenize.pop();
      state.currentIndent -= 1;
      nextStyle = style2;
    }
    return nextStyle;
  };
}
function tokenMacro(begin, end2, started) {
  return function(stream, state) {
    if (!started && stream.match("{" + begin)) {
      state.currentIndent += 1;
      state.tokenize[state.tokenize.length - 1] = tokenMacro(begin, end2, true);
      return "meta";
    }
    if (stream.match(end2 + "}")) {
      state.currentIndent -= 1;
      state.tokenize.pop();
      return "meta";
    }
    return tokenBase$F(stream, state);
  };
}
function tokenMacroDef(stream, state) {
  if (stream.eatSpace()) {
    return null;
  }
  var matched;
  if (matched = stream.match(idents)) {
    if (matched == "def") {
      return "keyword";
    }
    stream.eat(/[?!]/);
  }
  state.tokenize.pop();
  return "def";
}
function tokenFollowIdent(stream, state) {
  if (stream.eatSpace()) {
    return null;
  }
  if (stream.match(idents)) {
    stream.eat(/[!?]/);
  } else {
    stream.match(operators$5) || stream.match(conditionalOperators) || stream.match(indexingOperators);
  }
  state.tokenize.pop();
  return "def";
}
function tokenFollowType(stream, state) {
  if (stream.eatSpace()) {
    return null;
  }
  stream.match(types$5);
  state.tokenize.pop();
  return "def";
}
function tokenQuote(end2, style2, embed) {
  return function(stream, state) {
    var escaped = false;
    while (stream.peek()) {
      if (!escaped) {
        if (stream.match("{%", false)) {
          state.tokenize.push(tokenMacro("%", "%"));
          return style2;
        }
        if (stream.match("{{", false)) {
          state.tokenize.push(tokenMacro("{", "}"));
          return style2;
        }
        if (embed && stream.match("#{", false)) {
          state.tokenize.push(tokenNest("#{", "}", "meta"));
          return style2;
        }
        var ch2 = stream.next();
        if (ch2 == end2) {
          state.tokenize.pop();
          return style2;
        }
        escaped = embed && ch2 == "\\";
      } else {
        stream.next();
        escaped = false;
      }
    }
    return style2;
  };
}
function tokenHereDoc(phrase, embed) {
  return function(stream, state) {
    if (stream.sol()) {
      stream.eatSpace();
      if (stream.match(phrase)) {
        state.tokenize.pop();
        return "string";
      }
    }
    var escaped = false;
    while (stream.peek()) {
      if (!escaped) {
        if (stream.match("{%", false)) {
          state.tokenize.push(tokenMacro("%", "%"));
          return "string";
        }
        if (stream.match("{{", false)) {
          state.tokenize.push(tokenMacro("{", "}"));
          return "string";
        }
        if (embed && stream.match("#{", false)) {
          state.tokenize.push(tokenNest("#{", "}", "meta"));
          return "string";
        }
        escaped = stream.next() == "\\" && embed;
      } else {
        stream.next();
        escaped = false;
      }
    }
    return "string";
  };
}
const crystal = {
  name: "crystal",
  startState: function() {
    return {
      tokenize: [tokenBase$F],
      currentIndent: 0,
      lastToken: null,
      lastStyle: null,
      blocks: []
    };
  },
  token: function(stream, state) {
    var style2 = state.tokenize[state.tokenize.length - 1](stream, state);
    var token = stream.current();
    if (style2 && style2 != "comment") {
      state.lastToken = token;
      state.lastStyle = style2;
    }
    return style2;
  },
  indent: function(state, textAfter, cx2) {
    textAfter = textAfter.replace(/^\s*(?:\{%)?\s*|\s*(?:%\})?\s*$/g, "");
    if (dedentKeywords.test(textAfter) || dedentPunctuals.test(textAfter)) {
      return cx2.unit * (state.currentIndent - 1);
    }
    return cx2.unit * state.currentIndent;
  },
  languageData: {
    indentOnInput: wordRegExp(dedentPunctualsArray.concat(dedentKeywordsArray), true),
    commentTokens: { line: "#" }
  }
};
const crystal$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  crystal
});
function words$h(str) {
  var obj = {}, words2 = str.split(" ");
  for (var i2 = 0; i2 < words2.length; ++i2) obj[words2[i2]] = true;
  return obj;
}
var blockKeywordsStr = "body catch class do else enum for foreach foreach_reverse if in interface mixin out scope struct switch try union unittest version while with";
const parserConfig$2 = {
  keywords: words$h("abstract alias align asm assert auto break case cast cdouble cent cfloat const continue debug default delegate delete deprecated export extern final finally function goto immutable import inout invariant is lazy macro module new nothrow override package pragma private protected public pure ref return shared short static super synchronized template this throw typedef typeid typeof volatile __FILE__ __LINE__ __gshared __traits __vector __parameters " + blockKeywordsStr),
  blockKeywords: words$h(blockKeywordsStr),
  builtin: words$h("bool byte char creal dchar double float idouble ifloat int ireal long real short ubyte ucent uint ulong ushort wchar wstring void size_t sizediff_t"),
  atoms: words$h("exit failure success true false null"),
  hooks: {
    "@": function(stream, _state) {
      stream.eatWhile(/[\w\$_]/);
      return "meta";
    }
  }
};
var statementIndentUnit = parserConfig$2.statementIndentUnit, keywords$y = parserConfig$2.keywords, builtin$3 = parserConfig$2.builtin, blockKeywords$4 = parserConfig$2.blockKeywords, atoms$b = parserConfig$2.atoms, hooks$2 = parserConfig$2.hooks, multiLineStrings$1 = parserConfig$2.multiLineStrings;
var isOperatorChar$d = /[+\-*&%=<>!?|\/]/;
var curPunc$a;
function tokenBase$E(stream, state) {
  var ch2 = stream.next();
  if (hooks$2[ch2]) {
    var result = hooks$2[ch2](stream, state);
    if (result !== false) return result;
  }
  if (ch2 == '"' || ch2 == "'" || ch2 == "`") {
    state.tokenize = tokenString$p(ch2);
    return state.tokenize(stream, state);
  }
  if (/[\[\]{}\(\),;\:\.]/.test(ch2)) {
    curPunc$a = ch2;
    return null;
  }
  if (/\d/.test(ch2)) {
    stream.eatWhile(/[\w\.]/);
    return "number";
  }
  if (ch2 == "/") {
    if (stream.eat("+")) {
      state.tokenize = tokenNestedComment;
      return tokenNestedComment(stream, state);
    }
    if (stream.eat("*")) {
      state.tokenize = tokenComment$i;
      return tokenComment$i(stream, state);
    }
    if (stream.eat("/")) {
      stream.skipToEnd();
      return "comment";
    }
  }
  if (isOperatorChar$d.test(ch2)) {
    stream.eatWhile(isOperatorChar$d);
    return "operator";
  }
  stream.eatWhile(/[\w\$_\xa1-\uffff]/);
  var cur = stream.current();
  if (keywords$y.propertyIsEnumerable(cur)) {
    if (blockKeywords$4.propertyIsEnumerable(cur)) curPunc$a = "newstatement";
    return "keyword";
  }
  if (builtin$3.propertyIsEnumerable(cur)) {
    if (blockKeywords$4.propertyIsEnumerable(cur)) curPunc$a = "newstatement";
    return "builtin";
  }
  if (atoms$b.propertyIsEnumerable(cur)) return "atom";
  return "variable";
}
function tokenString$p(quote2) {
  return function(stream, state) {
    var escaped = false, next2, end2 = false;
    while ((next2 = stream.next()) != null) {
      if (next2 == quote2 && !escaped) {
        end2 = true;
        break;
      }
      escaped = !escaped && next2 == "\\";
    }
    if (end2 || !(escaped || multiLineStrings$1))
      state.tokenize = null;
    return "string";
  };
}
function tokenComment$i(stream, state) {
  var maybeEnd = false, ch2;
  while (ch2 = stream.next()) {
    if (ch2 == "/" && maybeEnd) {
      state.tokenize = null;
      break;
    }
    maybeEnd = ch2 == "*";
  }
  return "comment";
}
function tokenNestedComment(stream, state) {
  var maybeEnd = false, ch2;
  while (ch2 = stream.next()) {
    if (ch2 == "/" && maybeEnd) {
      state.tokenize = null;
      break;
    }
    maybeEnd = ch2 == "+";
  }
  return "comment";
}
function Context$9(indented, column, type2, align, prev) {
  this.indented = indented;
  this.column = column;
  this.type = type2;
  this.align = align;
  this.prev = prev;
}
function pushContext$c(state, col, type2) {
  var indent2 = state.indented;
  if (state.context && state.context.type == "statement")
    indent2 = state.context.indented;
  return state.context = new Context$9(indent2, col, type2, null, state.context);
}
function popContext$c(state) {
  var t = state.context.type;
  if (t == ")" || t == "]" || t == "}")
    state.indented = state.context.indented;
  return state.context = state.context.prev;
}
const d$1 = {
  name: "d",
  startState: function(indentUnit) {
    return {
      tokenize: null,
      context: new Context$9(-indentUnit, 0, "top", false),
      indented: 0,
      startOfLine: true
    };
  },
  token: function(stream, state) {
    var ctx = state.context;
    if (stream.sol()) {
      if (ctx.align == null) ctx.align = false;
      state.indented = stream.indentation();
      state.startOfLine = true;
    }
    if (stream.eatSpace()) return null;
    curPunc$a = null;
    var style2 = (state.tokenize || tokenBase$E)(stream, state);
    if (style2 == "comment" || style2 == "meta") return style2;
    if (ctx.align == null) ctx.align = true;
    if ((curPunc$a == ";" || curPunc$a == ":" || curPunc$a == ",") && ctx.type == "statement") popContext$c(state);
    else if (curPunc$a == "{") pushContext$c(state, stream.column(), "}");
    else if (curPunc$a == "[") pushContext$c(state, stream.column(), "]");
    else if (curPunc$a == "(") pushContext$c(state, stream.column(), ")");
    else if (curPunc$a == "}") {
      while (ctx.type == "statement") ctx = popContext$c(state);
      if (ctx.type == "}") ctx = popContext$c(state);
      while (ctx.type == "statement") ctx = popContext$c(state);
    } else if (curPunc$a == ctx.type) popContext$c(state);
    else if ((ctx.type == "}" || ctx.type == "top") && curPunc$a != ";" || ctx.type == "statement" && curPunc$a == "newstatement")
      pushContext$c(state, stream.column(), "statement");
    state.startOfLine = false;
    return style2;
  },
  indent: function(state, textAfter, cx2) {
    if (state.tokenize != tokenBase$E && state.tokenize != null) return null;
    var ctx = state.context, firstChar = textAfter && textAfter.charAt(0);
    if (ctx.type == "statement" && firstChar == "}") ctx = ctx.prev;
    var closing2 = firstChar == ctx.type;
    if (ctx.type == "statement") return ctx.indented + (firstChar == "{" ? 0 : statementIndentUnit || cx2.unit);
    else if (ctx.align) return ctx.column + (closing2 ? 0 : 1);
    else return ctx.indented + (closing2 ? 0 : cx2.unit);
  },
  languageData: {
    indentOnInput: /^\s*[{}]$/,
    commentTokens: { line: "//", block: { open: "/*", close: "*/" } }
  }
};
const d$2 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  d: d$1
});
var TOKEN_NAMES = {
  "+": "inserted",
  "-": "deleted",
  "@": "meta"
};
const diff = {
  name: "diff",
  token: function(stream) {
    var tw_pos = stream.string.search(/[\t ]+?$/);
    if (!stream.sol() || tw_pos === 0) {
      stream.skipToEnd();
      return ("error " + (TOKEN_NAMES[stream.string.charAt(0)] || "")).replace(/ $/, "");
    }
    var token_name = TOKEN_NAMES[stream.peek()] || stream.skipToEnd();
    if (tw_pos === -1) {
      stream.skipToEnd();
    } else {
      stream.pos = tw_pos;
    }
    return token_name;
  }
};
const diff$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  diff
});
function simpleMode(states2) {
  ensureState(states2, "start");
  var states_ = {}, meta = states2.languageData || {}, hasIndentation = false;
  for (var state in states2) if (state != meta && states2.hasOwnProperty(state)) {
    var list = states_[state] = [], orig = states2[state];
    for (var i2 = 0; i2 < orig.length; i2++) {
      var data = orig[i2];
      list.push(new Rule(data, states2));
      if (data.indent || data.dedent) hasIndentation = true;
    }
  }
  return {
    name: meta.name,
    startState: function() {
      return { state: "start", pending: null, indent: hasIndentation ? [] : null };
    },
    copyState: function(state2) {
      var s = { state: state2.state, pending: state2.pending, indent: state2.indent && state2.indent.slice(0) };
      if (state2.stack)
        s.stack = state2.stack.slice(0);
      return s;
    },
    token: tokenFunction(states_),
    indent: indentFunction(states_, meta),
    mergeTokens: meta.mergeTokens,
    languageData: meta
  };
}
function ensureState(states2, name) {
  if (!states2.hasOwnProperty(name))
    throw new Error("Undefined state " + name + " in simple mode");
}
function toRegex(val, caret) {
  if (!val) return /(?:)/;
  var flags = "";
  if (val instanceof RegExp) {
    if (val.ignoreCase) flags = "i";
    if (val.unicode) flags += "u";
    val = val.source;
  } else {
    val = String(val);
  }
  return new RegExp("^(?:" + val + ")", flags);
}
function asToken(val) {
  if (!val) return null;
  if (val.apply) return val;
  if (typeof val == "string") return val.replace(/\./g, " ");
  var result = [];
  for (var i2 = 0; i2 < val.length; i2++)
    result.push(val[i2] && val[i2].replace(/\./g, " "));
  return result;
}
function Rule(data, states2) {
  if (data.next || data.push) ensureState(states2, data.next || data.push);
  this.regex = toRegex(data.regex);
  this.token = asToken(data.token);
  this.data = data;
}
function tokenFunction(states2) {
  return function(stream, state) {
    if (state.pending) {
      var pend = state.pending.shift();
      if (state.pending.length == 0) state.pending = null;
      stream.pos += pend.text.length;
      return pend.token;
    }
    var curState2 = states2[state.state];
    for (var i2 = 0; i2 < curState2.length; i2++) {
      var rule = curState2[i2];
      var matches = (!rule.data.sol || stream.sol()) && stream.match(rule.regex);
      if (matches) {
        if (rule.data.next) {
          state.state = rule.data.next;
        } else if (rule.data.push) {
          (state.stack || (state.stack = [])).push(state.state);
          state.state = rule.data.push;
        } else if (rule.data.pop && state.stack && state.stack.length) {
          state.state = state.stack.pop();
        }
        if (rule.data.indent)
          state.indent.push(stream.indentation() + stream.indentUnit);
        if (rule.data.dedent)
          state.indent.pop();
        var token = rule.token;
        if (token && token.apply) token = token(matches);
        if (matches.length > 2 && rule.token && typeof rule.token != "string") {
          state.pending = [];
          for (var j = 2; j < matches.length; j++)
            if (matches[j])
              state.pending.push({ text: matches[j], token: rule.token[j - 1] });
          stream.backUp(matches[0].length - (matches[1] ? matches[1].length : 0));
          return token[0];
        } else if (token && token.join) {
          return token[0];
        } else {
          return token;
        }
      }
    }
    stream.next();
    return null;
  };
}
function indentFunction(states2, meta) {
  return function(state, textAfter) {
    if (state.indent == null || meta.dontIndentStates && meta.dontIndentStates.indexOf(state.state) > -1)
      return null;
    var pos = state.indent.length - 1, rules = states2[state.state];
    scan: for (; ; ) {
      for (var i2 = 0; i2 < rules.length; i2++) {
        var rule = rules[i2];
        if (rule.data.dedent && rule.data.dedentIfLineStart !== false) {
          var m = rule.regex.exec(textAfter);
          if (m && m[0]) {
            pos--;
            if (rule.next || rule.push) rules = states2[rule.next || rule.push];
            textAfter = textAfter.slice(m[0].length);
            continue scan;
          }
        }
      }
      break;
    }
    return pos < 0 ? 0 : state.indent[pos];
  };
}
var from = "from";
var fromRegex = new RegExp("^(\\s*)\\b(" + from + ")\\b", "i");
var shells = ["run", "cmd", "entrypoint", "shell"];
var shellsAsArrayRegex = new RegExp("^(\\s*)(" + shells.join("|") + ")(\\s+\\[)", "i");
var expose = "expose";
var exposeRegex = new RegExp("^(\\s*)(" + expose + ")(\\s+)", "i");
var others = [
  "arg",
  "from",
  "maintainer",
  "label",
  "env",
  "add",
  "copy",
  "volume",
  "user",
  "workdir",
  "onbuild",
  "stopsignal",
  "healthcheck",
  "shell"
];
var instructions = [from, expose].concat(shells).concat(others), instructionRegex = "(" + instructions.join("|") + ")", instructionOnlyLine = new RegExp("^(\\s*)" + instructionRegex + "(\\s*)(#.*)?$", "i"), instructionWithArguments = new RegExp("^(\\s*)" + instructionRegex + "(\\s+)", "i");
const dockerFile = simpleMode({
  start: [
    // Block comment: This is a line starting with a comment
    {
      regex: /^\s*#.*$/,
      sol: true,
      token: "comment"
    },
    {
      regex: fromRegex,
      token: [null, "keyword"],
      sol: true,
      next: "from"
    },
    // Highlight an instruction without any arguments (for convenience)
    {
      regex: instructionOnlyLine,
      token: [null, "keyword", null, "error"],
      sol: true
    },
    {
      regex: shellsAsArrayRegex,
      token: [null, "keyword", null],
      sol: true,
      next: "array"
    },
    {
      regex: exposeRegex,
      token: [null, "keyword", null],
      sol: true,
      next: "expose"
    },
    // Highlight an instruction followed by arguments
    {
      regex: instructionWithArguments,
      token: [null, "keyword", null],
      sol: true,
      next: "arguments"
    },
    {
      regex: /./,
      token: null
    }
  ],
  from: [
    {
      regex: /\s*$/,
      token: null,
      next: "start"
    },
    {
      // Line comment without instruction arguments is an error
      regex: /(\s*)(#.*)$/,
      token: [null, "error"],
      next: "start"
    },
    {
      regex: /(\s*\S+\s+)(as)/i,
      token: [null, "keyword"],
      next: "start"
    },
    // Fail safe return to start
    {
      token: null,
      next: "start"
    }
  ],
  single: [
    {
      regex: /(?:[^\\']|\\.)/,
      token: "string"
    },
    {
      regex: /'/,
      token: "string",
      pop: true
    }
  ],
  double: [
    {
      regex: /(?:[^\\"]|\\.)/,
      token: "string"
    },
    {
      regex: /"/,
      token: "string",
      pop: true
    }
  ],
  array: [
    {
      regex: /\]/,
      token: null,
      next: "start"
    },
    {
      regex: /"(?:[^\\"]|\\.)*"?/,
      token: "string"
    }
  ],
  expose: [
    {
      regex: /\d+$/,
      token: "number",
      next: "start"
    },
    {
      regex: /[^\d]+$/,
      token: null,
      next: "start"
    },
    {
      regex: /\d+/,
      token: "number"
    },
    {
      regex: /[^\d]+/,
      token: null
    },
    // Fail safe return to start
    {
      token: null,
      next: "start"
    }
  ],
  arguments: [
    {
      regex: /^\s*#.*$/,
      sol: true,
      token: "comment"
    },
    {
      regex: /"(?:[^\\"]|\\.)*"?$/,
      token: "string",
      next: "start"
    },
    {
      regex: /"/,
      token: "string",
      push: "double"
    },
    {
      regex: /'(?:[^\\']|\\.)*'?$/,
      token: "string",
      next: "start"
    },
    {
      regex: /'/,
      token: "string",
      push: "single"
    },
    {
      regex: /[^#"']+[\\`]$/,
      token: null
    },
    {
      regex: /[^#"']+$/,
      token: null,
      next: "start"
    },
    {
      regex: /[^#"']+/,
      token: null
    },
    // Fail safe return to start
    {
      token: null,
      next: "start"
    }
  ],
  languageData: {
    commentTokens: { line: "#" }
  }
});
const dockerfile = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  dockerFile
});
var type$4;
function ret$2(style2, tp) {
  type$4 = tp;
  return style2;
}
function tokenBase$D(stream, state) {
  var ch2 = stream.next();
  if (ch2 == "<" && stream.eat("!")) {
    if (stream.eatWhile(/[\-]/)) {
      state.tokenize = tokenSGMLComment$1;
      return tokenSGMLComment$1(stream, state);
    } else if (stream.eatWhile(/[\w]/)) return ret$2("keyword", "doindent");
  } else if (ch2 == "<" && stream.eat("?")) {
    state.tokenize = inBlock$1("meta", "?>");
    return ret$2("meta", ch2);
  } else if (ch2 == "#" && stream.eatWhile(/[\w]/)) return ret$2("atom", "tag");
  else if (ch2 == "|") return ret$2("keyword", "separator");
  else if (ch2.match(/[\(\)\[\]\-\.,\+\?>]/)) return ret$2(null, ch2);
  else if (ch2.match(/[\[\]]/)) return ret$2("rule", ch2);
  else if (ch2 == '"' || ch2 == "'") {
    state.tokenize = tokenString$o(ch2);
    return state.tokenize(stream, state);
  } else if (stream.eatWhile(/[a-zA-Z\?\+\d]/)) {
    var sc = stream.current();
    if (sc.substr(sc.length - 1, sc.length).match(/\?|\+/) !== null) stream.backUp(1);
    return ret$2("tag", "tag");
  } else if (ch2 == "%" || ch2 == "*") return ret$2("number", "number");
  else {
    stream.eatWhile(/[\w\\\-_%.{,]/);
    return ret$2(null, null);
  }
}
function tokenSGMLComment$1(stream, state) {
  var dashes = 0, ch2;
  while ((ch2 = stream.next()) != null) {
    if (dashes >= 2 && ch2 == ">") {
      state.tokenize = tokenBase$D;
      break;
    }
    dashes = ch2 == "-" ? dashes + 1 : 0;
  }
  return ret$2("comment", "comment");
}
function tokenString$o(quote2) {
  return function(stream, state) {
    var escaped = false, ch2;
    while ((ch2 = stream.next()) != null) {
      if (ch2 == quote2 && !escaped) {
        state.tokenize = tokenBase$D;
        break;
      }
      escaped = !escaped && ch2 == "\\";
    }
    return ret$2("string", "tag");
  };
}
function inBlock$1(style2, terminator) {
  return function(stream, state) {
    while (!stream.eol()) {
      if (stream.match(terminator)) {
        state.tokenize = tokenBase$D;
        break;
      }
      stream.next();
    }
    return style2;
  };
}
const dtd = {
  name: "dtd",
  startState: function() {
    return {
      tokenize: tokenBase$D,
      baseIndent: 0,
      stack: []
    };
  },
  token: function(stream, state) {
    if (stream.eatSpace()) return null;
    var style2 = state.tokenize(stream, state);
    var context = state.stack[state.stack.length - 1];
    if (stream.current() == "[" || type$4 === "doindent" || type$4 == "[") state.stack.push("rule");
    else if (type$4 === "endtag") state.stack[state.stack.length - 1] = "endtag";
    else if (stream.current() == "]" || type$4 == "]" || type$4 == ">" && context == "rule") state.stack.pop();
    else if (type$4 == "[") state.stack.push("[");
    return style2;
  },
  indent: function(state, textAfter, cx2) {
    var n = state.stack.length;
    if (textAfter.charAt(0) === "]") n--;
    else if (textAfter.substr(textAfter.length - 1, textAfter.length) === ">") {
      if (textAfter.substr(0, 1) === "<") ;
      else if (type$4 == "doindent" && textAfter.length > 1) ;
      else if (type$4 == "doindent") n--;
      else if (type$4 == ">" && textAfter.length > 1) ;
      else if (type$4 == "tag" && textAfter !== ">") ;
      else if (type$4 == "tag" && state.stack[state.stack.length - 1] == "rule") n--;
      else if (type$4 == "tag") n++;
      else if (textAfter === ">" && state.stack[state.stack.length - 1] == "rule" && type$4 === ">") n--;
      else if (textAfter === ">" && state.stack[state.stack.length - 1] == "rule") ;
      else if (textAfter.substr(0, 1) !== "<" && textAfter.substr(0, 1) === ">") n = n - 1;
      else if (textAfter === ">") ;
      else n = n - 1;
      if (type$4 == null || type$4 == "]") n--;
    }
    return state.baseIndent + n * cx2.unit;
  },
  languageData: {
    indentOnInput: /^\s*[\]>]$/
  }
};
const dtd$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  dtd
});
function forEach(arr, f) {
  for (var i2 = 0; i2 < arr.length; i2++) f(arr[i2], i2);
}
function some(arr, f) {
  for (var i2 = 0; i2 < arr.length; i2++) if (f(arr[i2], i2)) return true;
  return false;
}
var words$g = {
  // Words that introduce unnamed definitions like "define interface"
  unnamedDefinition: ["interface"],
  // Words that introduce simple named definitions like "define library"
  namedDefinition: [
    "module",
    "library",
    "macro",
    "C-struct",
    "C-union",
    "C-function",
    "C-callable-wrapper"
  ],
  // Words that introduce type definitions like "define class".
  // These are also parameterized like "define method" and are
  // appended to otherParameterizedDefinitionWords
  typeParameterizedDefinition: ["class", "C-subtype", "C-mapped-subtype"],
  // Words that introduce trickier definitions like "define method".
  // These require special definitions to be added to startExpressions
  otherParameterizedDefinition: [
    "method",
    "function",
    "C-variable",
    "C-address"
  ],
  // Words that introduce module constant definitions.
  // These must also be simple definitions and are
  // appended to otherSimpleDefinitionWords
  constantSimpleDefinition: ["constant"],
  // Words that introduce module variable definitions.
  // These must also be simple definitions and are
  // appended to otherSimpleDefinitionWords
  variableSimpleDefinition: ["variable"],
  // Other words that introduce simple definitions
  // (without implicit bodies).
  otherSimpleDefinition: [
    "generic",
    "domain",
    "C-pointer-type",
    "table"
  ],
  // Words that begin statements with implicit bodies.
  statement: [
    "if",
    "block",
    "begin",
    "method",
    "case",
    "for",
    "select",
    "when",
    "unless",
    "until",
    "while",
    "iterate",
    "profiling",
    "dynamic-bind"
  ],
  // Patterns that act as separators in compound statements.
  // This may include any general pattern that must be indented
  // specially.
  separator: [
    "finally",
    "exception",
    "cleanup",
    "else",
    "elseif",
    "afterwards"
  ],
  // Keywords that do not require special indentation handling,
  // but which should be highlighted
  other: [
    "above",
    "below",
    "by",
    "from",
    "handler",
    "in",
    "instance",
    "let",
    "local",
    "otherwise",
    "slot",
    "subclass",
    "then",
    "to",
    "keyed-by",
    "virtual"
  ],
  // Condition signaling function calls
  signalingCalls: [
    "signal",
    "error",
    "cerror",
    "break",
    "check-type",
    "abort"
  ]
};
words$g["otherDefinition"] = words$g["unnamedDefinition"].concat(words$g["namedDefinition"]).concat(words$g["otherParameterizedDefinition"]);
words$g["definition"] = words$g["typeParameterizedDefinition"].concat(words$g["otherDefinition"]);
words$g["parameterizedDefinition"] = words$g["typeParameterizedDefinition"].concat(words$g["otherParameterizedDefinition"]);
words$g["simpleDefinition"] = words$g["constantSimpleDefinition"].concat(words$g["variableSimpleDefinition"]).concat(words$g["otherSimpleDefinition"]);
words$g["keyword"] = words$g["statement"].concat(words$g["separator"]).concat(words$g["other"]);
var symbolPattern = "[-_a-zA-Z?!*@<>$%]+";
var symbol$1 = new RegExp("^" + symbolPattern);
var patterns = {
  // Symbols with special syntax
  symbolKeyword: symbolPattern + ":",
  symbolClass: "<" + symbolPattern + ">",
  symbolGlobal: "\\*" + symbolPattern + "\\*",
  symbolConstant: "\\$" + symbolPattern
};
var patternStyles = {
  symbolKeyword: "atom",
  symbolClass: "tag",
  symbolGlobal: "variableName.standard",
  symbolConstant: "variableName.constant"
};
for (var patternName in patterns)
  if (patterns.hasOwnProperty(patternName))
    patterns[patternName] = new RegExp("^" + patterns[patternName]);
patterns["keyword"] = [/^with(?:out)?-[-_a-zA-Z?!*@<>$%]+/];
var styles = {};
styles["keyword"] = "keyword";
styles["definition"] = "def";
styles["simpleDefinition"] = "def";
styles["signalingCalls"] = "builtin";
var wordLookup = {};
var styleLookup = {};
forEach([
  "keyword",
  "definition",
  "simpleDefinition",
  "signalingCalls"
], function(type2) {
  forEach(words$g[type2], function(word) {
    wordLookup[word] = type2;
    styleLookup[word] = styles[type2];
  });
});
function chain$9(stream, state, f) {
  state.tokenize = f;
  return f(stream, state);
}
function tokenBase$C(stream, state) {
  var ch2 = stream.peek();
  if (ch2 == "'" || ch2 == '"') {
    stream.next();
    return chain$9(stream, state, tokenString$n(ch2, "string"));
  } else if (ch2 == "/") {
    stream.next();
    if (stream.eat("*")) {
      return chain$9(stream, state, tokenComment$h);
    } else if (stream.eat("/")) {
      stream.skipToEnd();
      return "comment";
    }
    stream.backUp(1);
  } else if (/[+\-\d\.]/.test(ch2)) {
    if (stream.match(/^[+-]?[0-9]*\.[0-9]*([esdx][+-]?[0-9]+)?/i) || stream.match(/^[+-]?[0-9]+([esdx][+-]?[0-9]+)/i) || stream.match(/^[+-]?\d+/)) {
      return "number";
    }
  } else if (ch2 == "#") {
    stream.next();
    ch2 = stream.peek();
    if (ch2 == '"') {
      stream.next();
      return chain$9(stream, state, tokenString$n('"', "string"));
    } else if (ch2 == "b") {
      stream.next();
      stream.eatWhile(/[01]/);
      return "number";
    } else if (ch2 == "x") {
      stream.next();
      stream.eatWhile(/[\da-f]/i);
      return "number";
    } else if (ch2 == "o") {
      stream.next();
      stream.eatWhile(/[0-7]/);
      return "number";
    } else if (ch2 == "#") {
      stream.next();
      return "punctuation";
    } else if (ch2 == "[" || ch2 == "(") {
      stream.next();
      return "bracket";
    } else if (stream.match(/f|t|all-keys|include|key|next|rest/i)) {
      return "atom";
    } else {
      stream.eatWhile(/[-a-zA-Z]/);
      return "error";
    }
  } else if (ch2 == "~") {
    stream.next();
    ch2 = stream.peek();
    if (ch2 == "=") {
      stream.next();
      ch2 = stream.peek();
      if (ch2 == "=") {
        stream.next();
        return "operator";
      }
      return "operator";
    }
    return "operator";
  } else if (ch2 == ":") {
    stream.next();
    ch2 = stream.peek();
    if (ch2 == "=") {
      stream.next();
      return "operator";
    } else if (ch2 == ":") {
      stream.next();
      return "punctuation";
    }
  } else if ("[](){}".indexOf(ch2) != -1) {
    stream.next();
    return "bracket";
  } else if (".,".indexOf(ch2) != -1) {
    stream.next();
    return "punctuation";
  } else if (stream.match("end")) {
    return "keyword";
  }
  for (var name in patterns) {
    if (patterns.hasOwnProperty(name)) {
      var pattern = patterns[name];
      if (pattern instanceof Array && some(pattern, function(p) {
        return stream.match(p);
      }) || stream.match(pattern))
        return patternStyles[name];
    }
  }
  if (/[+\-*\/^=<>&|]/.test(ch2)) {
    stream.next();
    return "operator";
  }
  if (stream.match("define")) {
    return "def";
  } else {
    stream.eatWhile(/[\w\-]/);
    if (wordLookup.hasOwnProperty(stream.current())) {
      return styleLookup[stream.current()];
    } else if (stream.current().match(symbol$1)) {
      return "variable";
    } else {
      stream.next();
      return "variableName.standard";
    }
  }
}
function tokenComment$h(stream, state) {
  var maybeEnd = false, maybeNested = false, nestedCount = 0, ch2;
  while (ch2 = stream.next()) {
    if (ch2 == "/" && maybeEnd) {
      if (nestedCount > 0) {
        nestedCount--;
      } else {
        state.tokenize = tokenBase$C;
        break;
      }
    } else if (ch2 == "*" && maybeNested) {
      nestedCount++;
    }
    maybeEnd = ch2 == "*";
    maybeNested = ch2 == "/";
  }
  return "comment";
}
function tokenString$n(quote2, style2) {
  return function(stream, state) {
    var escaped = false, next2, end2 = false;
    while ((next2 = stream.next()) != null) {
      if (next2 == quote2 && !escaped) {
        end2 = true;
        break;
      }
      escaped = !escaped && next2 == "\\";
    }
    if (end2 || !escaped) {
      state.tokenize = tokenBase$C;
    }
    return style2;
  };
}
const dylan = {
  name: "dylan",
  startState: function() {
    return {
      tokenize: tokenBase$C,
      currentIndent: 0
    };
  },
  token: function(stream, state) {
    if (stream.eatSpace())
      return null;
    var style2 = state.tokenize(stream, state);
    return style2;
  },
  languageData: {
    commentTokens: { block: { open: "/*", close: "*/" } }
  }
};
const dylan$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  dylan
});
var commentType = { slash: 0, parenthesis: 1 };
var stateType = { comment: 0, _string: 1, characterClass: 2 };
const ebnf = {
  name: "ebnf",
  startState: function() {
    return {
      stringType: null,
      commentType: null,
      braced: 0,
      lhs: true,
      localState: null,
      stack: [],
      inDefinition: false
    };
  },
  token: function(stream, state) {
    if (!stream) return;
    if (state.stack.length === 0) {
      if (stream.peek() == '"' || stream.peek() == "'") {
        state.stringType = stream.peek();
        stream.next();
        state.stack.unshift(stateType._string);
      } else if (stream.match("/*")) {
        state.stack.unshift(stateType.comment);
        state.commentType = commentType.slash;
      } else if (stream.match("(*")) {
        state.stack.unshift(stateType.comment);
        state.commentType = commentType.parenthesis;
      }
    }
    switch (state.stack[0]) {
      case stateType._string:
        while (state.stack[0] === stateType._string && !stream.eol()) {
          if (stream.peek() === state.stringType) {
            stream.next();
            state.stack.shift();
          } else if (stream.peek() === "\\") {
            stream.next();
            stream.next();
          } else {
            stream.match(/^.[^\\\"\']*/);
          }
        }
        return state.lhs ? "property" : "string";
      // Token style
      case stateType.comment:
        while (state.stack[0] === stateType.comment && !stream.eol()) {
          if (state.commentType === commentType.slash && stream.match("*/")) {
            state.stack.shift();
            state.commentType = null;
          } else if (state.commentType === commentType.parenthesis && stream.match("*)")) {
            state.stack.shift();
            state.commentType = null;
          } else {
            stream.match(/^.[^\*]*/);
          }
        }
        return "comment";
      case stateType.characterClass:
        while (state.stack[0] === stateType.characterClass && !stream.eol()) {
          if (!(stream.match(/^[^\]\\]+/) || stream.match("."))) {
            state.stack.shift();
          }
        }
        return "operator";
    }
    var peek = stream.peek();
    switch (peek) {
      case "[":
        stream.next();
        state.stack.unshift(stateType.characterClass);
        return "bracket";
      case ":":
      case "|":
      case ";":
        stream.next();
        return "operator";
      case "%":
        if (stream.match("%%")) {
          return "header";
        } else if (stream.match(/[%][A-Za-z]+/)) {
          return "keyword";
        } else if (stream.match(/[%][}]/)) {
          return "bracket";
        }
        break;
      case "/":
        if (stream.match(/[\/][A-Za-z]+/)) {
          return "keyword";
        }
      case "\\":
        if (stream.match(/[\][a-z]+/)) {
          return "string.special";
        }
      case ".":
        if (stream.match(".")) {
          return "atom";
        }
      case "*":
      case "-":
      case "+":
      case "^":
        if (stream.match(peek)) {
          return "atom";
        }
      case "$":
        if (stream.match("$$")) {
          return "builtin";
        } else if (stream.match(/[$][0-9]+/)) {
          return "variableName.special";
        }
      case "<":
        if (stream.match(/<<[a-zA-Z_]+>>/)) {
          return "builtin";
        }
    }
    if (stream.match("//")) {
      stream.skipToEnd();
      return "comment";
    } else if (stream.match("return")) {
      return "operator";
    } else if (stream.match(/^[a-zA-Z_][a-zA-Z0-9_]*/)) {
      if (stream.match(/(?=[\(.])/)) {
        return "variable";
      } else if (stream.match(/(?=[\s\n]*[:=])/)) {
        return "def";
      }
      return "variableName.special";
    } else if (["[", "]", "(", ")"].indexOf(stream.peek()) != -1) {
      stream.next();
      return "bracket";
    } else if (!stream.eatSpace()) {
      stream.next();
    }
    return null;
  }
};
const ebnf$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  ebnf
});
function words$f(str) {
  var obj = {}, words2 = str.split(" ");
  for (var i2 = 0; i2 < words2.length; ++i2) obj[words2[i2]] = true;
  return obj;
}
function metaHook$1(stream, state) {
  if (!state.startOfLine) return false;
  stream.skipToEnd();
  return "meta";
}
var keyword = words$f("abs acos allnodes ascii asin asstring atan atan2 ave case choose choosen choosesets clustersize combine correlation cos cosh count covariance cron dataset dedup define denormalize distribute distributed distribution ebcdic enth error evaluate event eventextra eventname exists exp failcode failmessage fetch fromunicode getisvalid global graph group hash hash32 hash64 hashcrc hashmd5 having if index intformat isvalid iterate join keyunicode length library limit ln local log loop map matched matchlength matchposition matchtext matchunicode max merge mergejoin min nolocal nonempty normalize parse pipe power preload process project pull random range rank ranked realformat recordof regexfind regexreplace regroup rejected rollup round roundup row rowdiff sample set sin sinh sizeof soapcall sort sorted sqrt stepped stored sum table tan tanh thisnode topn tounicode transfer trim truncate typeof ungroup unicodeorder variance which workunit xmldecode xmlencode xmltext xmlunicode");
var variable = words$f("apply assert build buildindex evaluate fail keydiff keypatch loadxml nothor notify output parallel sequential soapcall wait");
var variable_2 = words$f("__compressed__ all and any as atmost before beginc++ best between case const counter csv descend encrypt end endc++ endmacro except exclusive expire export extend false few first flat from full function group header heading hole ifblock import in interface joined keep keyed last left limit load local locale lookup macro many maxcount maxlength min skew module named nocase noroot noscan nosort not of only opt or outer overwrite packed partition penalty physicallength pipe quote record relationship repeat return right scan self separator service shared skew skip sql store terminator thor threshold token transform trim true type unicodeorder unsorted validate virtual whole wild within xml xpath");
var variable_3 = words$f("ascii big_endian boolean data decimal ebcdic integer pattern qstring real record rule set of string token udecimal unicode unsigned varstring varunicode");
var builtin$2 = words$f("checkpoint deprecated failcode failmessage failure global independent onwarning persist priority recovery stored success wait when");
var blockKeywords$3 = words$f("catch class do else finally for if switch try while");
var atoms$a = words$f("true false null");
var hooks$1 = { "#": metaHook$1 };
var isOperatorChar$c = /[+\-*&%=<>!?|\/]/;
var curPunc$9;
function tokenBase$B(stream, state) {
  var ch2 = stream.next();
  if (hooks$1[ch2]) {
    var result = hooks$1[ch2](stream, state);
    if (result !== false) return result;
  }
  if (ch2 == '"' || ch2 == "'") {
    state.tokenize = tokenString$m(ch2);
    return state.tokenize(stream, state);
  }
  if (/[\[\]{}\(\),;\:\.]/.test(ch2)) {
    curPunc$9 = ch2;
    return null;
  }
  if (/\d/.test(ch2)) {
    stream.eatWhile(/[\w\.]/);
    return "number";
  }
  if (ch2 == "/") {
    if (stream.eat("*")) {
      state.tokenize = tokenComment$g;
      return tokenComment$g(stream, state);
    }
    if (stream.eat("/")) {
      stream.skipToEnd();
      return "comment";
    }
  }
  if (isOperatorChar$c.test(ch2)) {
    stream.eatWhile(isOperatorChar$c);
    return "operator";
  }
  stream.eatWhile(/[\w\$_]/);
  var cur = stream.current().toLowerCase();
  if (keyword.propertyIsEnumerable(cur)) {
    if (blockKeywords$3.propertyIsEnumerable(cur)) curPunc$9 = "newstatement";
    return "keyword";
  } else if (variable.propertyIsEnumerable(cur)) {
    if (blockKeywords$3.propertyIsEnumerable(cur)) curPunc$9 = "newstatement";
    return "variable";
  } else if (variable_2.propertyIsEnumerable(cur)) {
    if (blockKeywords$3.propertyIsEnumerable(cur)) curPunc$9 = "newstatement";
    return "modifier";
  } else if (variable_3.propertyIsEnumerable(cur)) {
    if (blockKeywords$3.propertyIsEnumerable(cur)) curPunc$9 = "newstatement";
    return "type";
  } else if (builtin$2.propertyIsEnumerable(cur)) {
    if (blockKeywords$3.propertyIsEnumerable(cur)) curPunc$9 = "newstatement";
    return "builtin";
  } else {
    var i2 = cur.length - 1;
    while (i2 >= 0 && (!isNaN(cur[i2]) || cur[i2] == "_"))
      --i2;
    if (i2 > 0) {
      var cur2 = cur.substr(0, i2 + 1);
      if (variable_3.propertyIsEnumerable(cur2)) {
        if (blockKeywords$3.propertyIsEnumerable(cur2)) curPunc$9 = "newstatement";
        return "type";
      }
    }
  }
  if (atoms$a.propertyIsEnumerable(cur)) return "atom";
  return null;
}
function tokenString$m(quote2) {
  return function(stream, state) {
    var escaped = false, next2, end2 = false;
    while ((next2 = stream.next()) != null) {
      if (next2 == quote2 && !escaped) {
        end2 = true;
        break;
      }
      escaped = !escaped && next2 == "\\";
    }
    if (end2 || !escaped)
      state.tokenize = tokenBase$B;
    return "string";
  };
}
function tokenComment$g(stream, state) {
  var maybeEnd = false, ch2;
  while (ch2 = stream.next()) {
    if (ch2 == "/" && maybeEnd) {
      state.tokenize = tokenBase$B;
      break;
    }
    maybeEnd = ch2 == "*";
  }
  return "comment";
}
function Context$8(indented, column, type2, align, prev) {
  this.indented = indented;
  this.column = column;
  this.type = type2;
  this.align = align;
  this.prev = prev;
}
function pushContext$b(state, col, type2) {
  return state.context = new Context$8(state.indented, col, type2, null, state.context);
}
function popContext$b(state) {
  var t = state.context.type;
  if (t == ")" || t == "]" || t == "}")
    state.indented = state.context.indented;
  return state.context = state.context.prev;
}
const ecl = {
  name: "ecl",
  startState: function(indentUnit) {
    return {
      tokenize: null,
      context: new Context$8(-indentUnit, 0, "top", false),
      indented: 0,
      startOfLine: true
    };
  },
  token: function(stream, state) {
    var ctx = state.context;
    if (stream.sol()) {
      if (ctx.align == null) ctx.align = false;
      state.indented = stream.indentation();
      state.startOfLine = true;
    }
    if (stream.eatSpace()) return null;
    curPunc$9 = null;
    var style2 = (state.tokenize || tokenBase$B)(stream, state);
    if (style2 == "comment" || style2 == "meta") return style2;
    if (ctx.align == null) ctx.align = true;
    if ((curPunc$9 == ";" || curPunc$9 == ":") && ctx.type == "statement") popContext$b(state);
    else if (curPunc$9 == "{") pushContext$b(state, stream.column(), "}");
    else if (curPunc$9 == "[") pushContext$b(state, stream.column(), "]");
    else if (curPunc$9 == "(") pushContext$b(state, stream.column(), ")");
    else if (curPunc$9 == "}") {
      while (ctx.type == "statement") ctx = popContext$b(state);
      if (ctx.type == "}") ctx = popContext$b(state);
      while (ctx.type == "statement") ctx = popContext$b(state);
    } else if (curPunc$9 == ctx.type) popContext$b(state);
    else if (ctx.type == "}" || ctx.type == "top" || ctx.type == "statement" && curPunc$9 == "newstatement")
      pushContext$b(state, stream.column(), "statement");
    state.startOfLine = false;
    return style2;
  },
  indent: function(state, textAfter, cx2) {
    if (state.tokenize != tokenBase$B && state.tokenize != null) return 0;
    var ctx = state.context, firstChar = textAfter && textAfter.charAt(0);
    if (ctx.type == "statement" && firstChar == "}") ctx = ctx.prev;
    var closing2 = firstChar == ctx.type;
    if (ctx.type == "statement") return ctx.indented + (firstChar == "{" ? 0 : cx2.unit);
    else if (ctx.align) return ctx.column + (closing2 ? 0 : 1);
    else return ctx.indented + (closing2 ? 0 : cx2.unit);
  },
  languageData: {
    indentOnInput: /^\s*[{}]$/
  }
};
const ecl$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  ecl
});
function wordObj$2(words2) {
  var o = {};
  for (var i2 = 0, e = words2.length; i2 < e; ++i2) o[words2[i2]] = true;
  return o;
}
var keywords$x = wordObj$2([
  "note",
  "across",
  "when",
  "variant",
  "until",
  "unique",
  "undefine",
  "then",
  "strip",
  "select",
  "retry",
  "rescue",
  "require",
  "rename",
  "reference",
  "redefine",
  "prefix",
  "once",
  "old",
  "obsolete",
  "loop",
  "local",
  "like",
  "is",
  "inspect",
  "infix",
  "include",
  "if",
  "frozen",
  "from",
  "external",
  "export",
  "ensure",
  "end",
  "elseif",
  "else",
  "do",
  "creation",
  "create",
  "check",
  "alias",
  "agent",
  "separate",
  "invariant",
  "inherit",
  "indexing",
  "feature",
  "expanded",
  "deferred",
  "class",
  "Void",
  "True",
  "Result",
  "Precursor",
  "False",
  "Current",
  "create",
  "attached",
  "detachable",
  "as",
  "and",
  "implies",
  "not",
  "or"
]);
var operators$4 = wordObj$2([":=", "and then", "and", "or", "<<", ">>"]);
function chain$8(newtok, stream, state) {
  state.tokenize.push(newtok);
  return newtok(stream, state);
}
function tokenBase$A(stream, state) {
  if (stream.eatSpace()) return null;
  var ch2 = stream.next();
  if (ch2 == '"' || ch2 == "'") {
    return chain$8(readQuoted$1(ch2, "string"), stream, state);
  } else if (ch2 == "-" && stream.eat("-")) {
    stream.skipToEnd();
    return "comment";
  } else if (ch2 == ":" && stream.eat("=")) {
    return "operator";
  } else if (/[0-9]/.test(ch2)) {
    stream.eatWhile(/[xXbBCc0-9\.]/);
    stream.eat(/[\?\!]/);
    return "variable";
  } else if (/[a-zA-Z_0-9]/.test(ch2)) {
    stream.eatWhile(/[a-zA-Z_0-9]/);
    stream.eat(/[\?\!]/);
    return "variable";
  } else if (/[=+\-\/*^%<>~]/.test(ch2)) {
    stream.eatWhile(/[=+\-\/*^%<>~]/);
    return "operator";
  } else {
    return null;
  }
}
function readQuoted$1(quote2, style2, unescaped) {
  return function(stream, state) {
    var escaped = false, ch2;
    while ((ch2 = stream.next()) != null) {
      if (ch2 == quote2 && !escaped) {
        state.tokenize.pop();
        break;
      }
      escaped = !escaped && ch2 == "%";
    }
    return style2;
  };
}
const eiffel = {
  name: "eiffel",
  startState: function() {
    return { tokenize: [tokenBase$A] };
  },
  token: function(stream, state) {
    var style2 = state.tokenize[state.tokenize.length - 1](stream, state);
    if (style2 == "variable") {
      var word = stream.current();
      style2 = keywords$x.propertyIsEnumerable(stream.current()) ? "keyword" : operators$4.propertyIsEnumerable(stream.current()) ? "operator" : /^[A-Z][A-Z_0-9]*$/g.test(word) ? "tag" : /^0[bB][0-1]+$/g.test(word) ? "number" : /^0[cC][0-7]+$/g.test(word) ? "number" : /^0[xX][a-fA-F0-9]+$/g.test(word) ? "number" : /^([0-9]+\.[0-9]*)|([0-9]*\.[0-9]+)$/g.test(word) ? "number" : /^[0-9]+$/g.test(word) ? "number" : "variable";
    }
    return style2;
  },
  languageData: {
    commentTokens: { line: "--" }
  }
};
const eiffel$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  eiffel
});
function switchState$1(source, setState, f) {
  setState(f);
  return f(source, setState);
}
var lowerRE = /[a-z]/;
var upperRE = /[A-Z]/;
var innerRE = /[a-zA-Z0-9_]/;
var digitRE$1 = /[0-9]/;
var hexRE = /[0-9A-Fa-f]/;
var symbolRE$1 = /[-&*+.\\/<>=?^|:]/;
var specialRE$1 = /[(),[\]{}]/;
var spacesRE = /[ \v\f]/;
function normal$2() {
  return function(source, setState) {
    if (source.eatWhile(spacesRE)) {
      return null;
    }
    var char = source.next();
    if (specialRE$1.test(char)) {
      return char === "{" && source.eat("-") ? switchState$1(source, setState, chompMultiComment(1)) : char === "[" && source.match("glsl|") ? switchState$1(source, setState, chompGlsl) : "builtin";
    }
    if (char === "'") {
      return switchState$1(source, setState, chompChar);
    }
    if (char === '"') {
      return source.eat('"') ? source.eat('"') ? switchState$1(source, setState, chompMultiString) : "string" : switchState$1(source, setState, chompSingleString);
    }
    if (upperRE.test(char)) {
      source.eatWhile(innerRE);
      return "type";
    }
    if (lowerRE.test(char)) {
      var isDef = source.pos === 1;
      source.eatWhile(innerRE);
      return isDef ? "def" : "variable";
    }
    if (digitRE$1.test(char)) {
      if (char === "0") {
        if (source.eat(/[xX]/)) {
          source.eatWhile(hexRE);
          return "number";
        }
      } else {
        source.eatWhile(digitRE$1);
      }
      if (source.eat(".")) {
        source.eatWhile(digitRE$1);
      }
      if (source.eat(/[eE]/)) {
        source.eat(/[-+]/);
        source.eatWhile(digitRE$1);
      }
      return "number";
    }
    if (symbolRE$1.test(char)) {
      if (char === "-" && source.eat("-")) {
        source.skipToEnd();
        return "comment";
      }
      source.eatWhile(symbolRE$1);
      return "keyword";
    }
    if (char === "_") {
      return "keyword";
    }
    return "error";
  };
}
function chompMultiComment(nest) {
  if (nest == 0) {
    return normal$2();
  }
  return function(source, setState) {
    while (!source.eol()) {
      var char = source.next();
      if (char == "{" && source.eat("-")) {
        ++nest;
      } else if (char == "-" && source.eat("}")) {
        --nest;
        if (nest === 0) {
          setState(normal$2());
          return "comment";
        }
      }
    }
    setState(chompMultiComment(nest));
    return "comment";
  };
}
function chompMultiString(source, setState) {
  while (!source.eol()) {
    var char = source.next();
    if (char === '"' && source.eat('"') && source.eat('"')) {
      setState(normal$2());
      return "string";
    }
  }
  return "string";
}
function chompSingleString(source, setState) {
  while (source.skipTo('\\"')) {
    source.next();
    source.next();
  }
  if (source.skipTo('"')) {
    source.next();
    setState(normal$2());
    return "string";
  }
  source.skipToEnd();
  setState(normal$2());
  return "error";
}
function chompChar(source, setState) {
  while (source.skipTo("\\'")) {
    source.next();
    source.next();
  }
  if (source.skipTo("'")) {
    source.next();
    setState(normal$2());
    return "string";
  }
  source.skipToEnd();
  setState(normal$2());
  return "error";
}
function chompGlsl(source, setState) {
  while (!source.eol()) {
    var char = source.next();
    if (char === "|" && source.eat("]")) {
      setState(normal$2());
      return "string";
    }
  }
  return "string";
}
var wellKnownWords$1 = {
  case: 1,
  of: 1,
  as: 1,
  if: 1,
  then: 1,
  else: 1,
  let: 1,
  in: 1,
  type: 1,
  alias: 1,
  module: 1,
  where: 1,
  import: 1,
  exposing: 1,
  port: 1
};
const elm = {
  name: "elm",
  startState: function() {
    return { f: normal$2() };
  },
  copyState: function(s) {
    return { f: s.f };
  },
  token: function(stream, state) {
    var type2 = state.f(stream, function(s) {
      state.f = s;
    });
    var word = stream.current();
    return wellKnownWords$1.hasOwnProperty(word) ? "keyword" : type2;
  },
  languageData: {
    commentTokens: { line: "--" }
  }
};
const elm$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  elm
});
var typeWords = [
  "-type",
  "-spec",
  "-export_type",
  "-opaque"
];
var keywordWords = [
  "after",
  "begin",
  "catch",
  "case",
  "cond",
  "end",
  "fun",
  "if",
  "let",
  "of",
  "query",
  "receive",
  "try",
  "when"
];
var separatorRE = /[\->,;]/;
var separatorWords = [
  "->",
  ";",
  ","
];
var operatorAtomWords = [
  "and",
  "andalso",
  "band",
  "bnot",
  "bor",
  "bsl",
  "bsr",
  "bxor",
  "div",
  "not",
  "or",
  "orelse",
  "rem",
  "xor"
];
var operatorSymbolRE = /[\+\-\*\/<>=\|:!]/;
var operatorSymbolWords = [
  "=",
  "+",
  "-",
  "*",
  "/",
  ">",
  ">=",
  "<",
  "=<",
  "=:=",
  "==",
  "=/=",
  "/=",
  "||",
  "<-",
  "!"
];
var openParenRE = /[<\(\[\{]/;
var openParenWords = [
  "<<",
  "(",
  "[",
  "{"
];
var closeParenRE = /[>\)\]\}]/;
var closeParenWords = [
  "}",
  "]",
  ")",
  ">>"
];
var guardWords = [
  "is_atom",
  "is_binary",
  "is_bitstring",
  "is_boolean",
  "is_float",
  "is_function",
  "is_integer",
  "is_list",
  "is_number",
  "is_pid",
  "is_port",
  "is_record",
  "is_reference",
  "is_tuple",
  "atom",
  "binary",
  "bitstring",
  "boolean",
  "function",
  "integer",
  "list",
  "number",
  "pid",
  "port",
  "record",
  "reference",
  "tuple"
];
var bifWords = [
  "abs",
  "adler32",
  "adler32_combine",
  "alive",
  "apply",
  "atom_to_binary",
  "atom_to_list",
  "binary_to_atom",
  "binary_to_existing_atom",
  "binary_to_list",
  "binary_to_term",
  "bit_size",
  "bitstring_to_list",
  "byte_size",
  "check_process_code",
  "contact_binary",
  "crc32",
  "crc32_combine",
  "date",
  "decode_packet",
  "delete_module",
  "disconnect_node",
  "element",
  "erase",
  "exit",
  "float",
  "float_to_list",
  "garbage_collect",
  "get",
  "get_keys",
  "group_leader",
  "halt",
  "hd",
  "integer_to_list",
  "internal_bif",
  "iolist_size",
  "iolist_to_binary",
  "is_alive",
  "is_atom",
  "is_binary",
  "is_bitstring",
  "is_boolean",
  "is_float",
  "is_function",
  "is_integer",
  "is_list",
  "is_number",
  "is_pid",
  "is_port",
  "is_process_alive",
  "is_record",
  "is_reference",
  "is_tuple",
  "length",
  "link",
  "list_to_atom",
  "list_to_binary",
  "list_to_bitstring",
  "list_to_existing_atom",
  "list_to_float",
  "list_to_integer",
  "list_to_pid",
  "list_to_tuple",
  "load_module",
  "make_ref",
  "module_loaded",
  "monitor_node",
  "node",
  "node_link",
  "node_unlink",
  "nodes",
  "notalive",
  "now",
  "open_port",
  "pid_to_list",
  "port_close",
  "port_command",
  "port_connect",
  "port_control",
  "pre_loaded",
  "process_flag",
  "process_info",
  "processes",
  "purge_module",
  "put",
  "register",
  "registered",
  "round",
  "self",
  "setelement",
  "size",
  "spawn",
  "spawn_link",
  "spawn_monitor",
  "spawn_opt",
  "split_binary",
  "statistics",
  "term_to_binary",
  "time",
  "throw",
  "tl",
  "trunc",
  "tuple_size",
  "tuple_to_list",
  "unlink",
  "unregister",
  "whereis"
];
var anumRE = /[\w@Ø-ÞÀ-Öß-öø-ÿ]/;
var escapesRE = /[0-7]{1,3}|[bdefnrstv\\"']|\^[a-zA-Z]|x[0-9a-zA-Z]{2}|x{[0-9a-zA-Z]+}/;
function tokenizer(stream, state) {
  if (state.in_string) {
    state.in_string = !doubleQuote(stream);
    return rval(state, stream, "string");
  }
  if (state.in_atom) {
    state.in_atom = !singleQuote(stream);
    return rval(state, stream, "atom");
  }
  if (stream.eatSpace()) {
    return rval(state, stream, "whitespace");
  }
  if (!peekToken(state) && stream.match(/-\s*[a-zß-öø-ÿ][\wØ-ÞÀ-Öß-öø-ÿ]*/)) {
    if (is_member(stream.current(), typeWords)) {
      return rval(state, stream, "type");
    } else {
      return rval(state, stream, "attribute");
    }
  }
  var ch2 = stream.next();
  if (ch2 == "%") {
    stream.skipToEnd();
    return rval(state, stream, "comment");
  }
  if (ch2 == ":") {
    return rval(state, stream, "colon");
  }
  if (ch2 == "?") {
    stream.eatSpace();
    stream.eatWhile(anumRE);
    return rval(state, stream, "macro");
  }
  if (ch2 == "#") {
    stream.eatSpace();
    stream.eatWhile(anumRE);
    return rval(state, stream, "record");
  }
  if (ch2 == "$") {
    if (stream.next() == "\\" && !stream.match(escapesRE)) {
      return rval(state, stream, "error");
    }
    return rval(state, stream, "number");
  }
  if (ch2 == ".") {
    return rval(state, stream, "dot");
  }
  if (ch2 == "'") {
    if (!(state.in_atom = !singleQuote(stream))) {
      if (stream.match(/\s*\/\s*[0-9]/, false)) {
        stream.match(/\s*\/\s*[0-9]/, true);
        return rval(state, stream, "fun");
      }
      if (stream.match(/\s*\(/, false) || stream.match(/\s*:/, false)) {
        return rval(state, stream, "function");
      }
    }
    return rval(state, stream, "atom");
  }
  if (ch2 == '"') {
    state.in_string = !doubleQuote(stream);
    return rval(state, stream, "string");
  }
  if (/[A-Z_Ø-ÞÀ-Ö]/.test(ch2)) {
    stream.eatWhile(anumRE);
    return rval(state, stream, "variable");
  }
  if (/[a-z_ß-öø-ÿ]/.test(ch2)) {
    stream.eatWhile(anumRE);
    if (stream.match(/\s*\/\s*[0-9]/, false)) {
      stream.match(/\s*\/\s*[0-9]/, true);
      return rval(state, stream, "fun");
    }
    var w = stream.current();
    if (is_member(w, keywordWords)) {
      return rval(state, stream, "keyword");
    } else if (is_member(w, operatorAtomWords)) {
      return rval(state, stream, "operator");
    } else if (stream.match(/\s*\(/, false)) {
      if (is_member(w, bifWords) && (peekToken(state).token != ":" || peekToken(state, 2).token == "erlang")) {
        return rval(state, stream, "builtin");
      } else if (is_member(w, guardWords)) {
        return rval(state, stream, "guard");
      } else {
        return rval(state, stream, "function");
      }
    } else if (lookahead(stream) == ":") {
      if (w == "erlang") {
        return rval(state, stream, "builtin");
      } else {
        return rval(state, stream, "function");
      }
    } else if (is_member(w, ["true", "false"])) {
      return rval(state, stream, "boolean");
    } else {
      return rval(state, stream, "atom");
    }
  }
  var digitRE2 = /[0-9]/;
  var radixRE = /[0-9a-zA-Z]/;
  if (digitRE2.test(ch2)) {
    stream.eatWhile(digitRE2);
    if (stream.eat("#")) {
      if (!stream.eatWhile(radixRE)) {
        stream.backUp(1);
      }
    } else if (stream.eat(".")) {
      if (!stream.eatWhile(digitRE2)) {
        stream.backUp(1);
      } else {
        if (stream.eat(/[eE]/)) {
          if (stream.eat(/[-+]/)) {
            if (!stream.eatWhile(digitRE2)) {
              stream.backUp(2);
            }
          } else {
            if (!stream.eatWhile(digitRE2)) {
              stream.backUp(1);
            }
          }
        }
      }
    }
    return rval(state, stream, "number");
  }
  if (nongreedy(stream, openParenRE, openParenWords)) {
    return rval(state, stream, "open_paren");
  }
  if (nongreedy(stream, closeParenRE, closeParenWords)) {
    return rval(state, stream, "close_paren");
  }
  if (greedy(stream, separatorRE, separatorWords)) {
    return rval(state, stream, "separator");
  }
  if (greedy(stream, operatorSymbolRE, operatorSymbolWords)) {
    return rval(state, stream, "operator");
  }
  return rval(state, stream, null);
}
function nongreedy(stream, re, words2) {
  if (stream.current().length == 1 && re.test(stream.current())) {
    stream.backUp(1);
    while (re.test(stream.peek())) {
      stream.next();
      if (is_member(stream.current(), words2)) {
        return true;
      }
    }
    stream.backUp(stream.current().length - 1);
  }
  return false;
}
function greedy(stream, re, words2) {
  if (stream.current().length == 1 && re.test(stream.current())) {
    while (re.test(stream.peek())) {
      stream.next();
    }
    while (0 < stream.current().length) {
      if (is_member(stream.current(), words2)) {
        return true;
      } else {
        stream.backUp(1);
      }
    }
    stream.next();
  }
  return false;
}
function doubleQuote(stream) {
  return quote(stream, '"', "\\");
}
function singleQuote(stream) {
  return quote(stream, "'", "\\");
}
function quote(stream, quoteChar, escapeChar) {
  while (!stream.eol()) {
    var ch2 = stream.next();
    if (ch2 == quoteChar) {
      return true;
    } else if (ch2 == escapeChar) {
      stream.next();
    }
  }
  return false;
}
function lookahead(stream) {
  var m = stream.match(/^\s*([^\s%])/, false);
  return m ? m[1] : "";
}
function is_member(element2, list) {
  return -1 < list.indexOf(element2);
}
function rval(state, stream, type2) {
  pushToken(state, realToken(type2, stream));
  switch (type2) {
    case "atom":
      return "atom";
    case "attribute":
      return "attribute";
    case "boolean":
      return "atom";
    case "builtin":
      return "builtin";
    case "close_paren":
      return null;
    case "colon":
      return null;
    case "comment":
      return "comment";
    case "dot":
      return null;
    case "error":
      return "error";
    case "fun":
      return "meta";
    case "function":
      return "tag";
    case "guard":
      return "property";
    case "keyword":
      return "keyword";
    case "macro":
      return "macroName";
    case "number":
      return "number";
    case "open_paren":
      return null;
    case "operator":
      return "operator";
    case "record":
      return "bracket";
    case "separator":
      return null;
    case "string":
      return "string";
    case "type":
      return "def";
    case "variable":
      return "variable";
    default:
      return null;
  }
}
function aToken(tok, col, ind, typ) {
  return {
    token: tok,
    column: col,
    indent: ind,
    type: typ
  };
}
function realToken(type2, stream) {
  return aToken(
    stream.current(),
    stream.column(),
    stream.indentation(),
    type2
  );
}
function fakeToken(type2) {
  return aToken(type2, 0, 0, type2);
}
function peekToken(state, depth) {
  var len2 = state.tokenStack.length;
  var dep = depth ? depth : 1;
  if (len2 < dep) {
    return false;
  } else {
    return state.tokenStack[len2 - dep];
  }
}
function pushToken(state, token) {
  if (!(token.type == "comment" || token.type == "whitespace")) {
    state.tokenStack = maybe_drop_pre(state.tokenStack, token);
    state.tokenStack = maybe_drop_post(state.tokenStack);
  }
}
function maybe_drop_pre(s, token) {
  var last = s.length - 1;
  if (0 < last && s[last].type === "record" && token.type === "dot") {
    s.pop();
  } else if (0 < last && s[last].type === "group") {
    s.pop();
    s.push(token);
  } else {
    s.push(token);
  }
  return s;
}
function maybe_drop_post(s) {
  if (!s.length) return s;
  var last = s.length - 1;
  if (s[last].type === "dot") {
    return [];
  }
  if (last > 1 && s[last].type === "fun" && s[last - 1].token === "fun") {
    return s.slice(0, last - 1);
  }
  switch (s[last].token) {
    case "}":
      return d(s, { g: ["{"] });
    case "]":
      return d(s, { i: ["["] });
    case ")":
      return d(s, { i: ["("] });
    case ">>":
      return d(s, { i: ["<<"] });
    case "end":
      return d(s, { i: ["begin", "case", "fun", "if", "receive", "try"] });
    case ",":
      return d(s, { e: [
        "begin",
        "try",
        "when",
        "->",
        ",",
        "(",
        "[",
        "{",
        "<<"
      ] });
    case "->":
      return d(s, {
        r: ["when"],
        m: ["try", "if", "case", "receive"]
      });
    case ";":
      return d(s, { E: ["case", "fun", "if", "receive", "try", "when"] });
    case "catch":
      return d(s, { e: ["try"] });
    case "of":
      return d(s, { e: ["case"] });
    case "after":
      return d(s, { e: ["receive", "try"] });
    default:
      return s;
  }
}
function d(stack, tt) {
  for (var type2 in tt) {
    var len2 = stack.length - 1;
    var tokens = tt[type2];
    for (var i2 = len2 - 1; -1 < i2; i2--) {
      if (is_member(stack[i2].token, tokens)) {
        var ss = stack.slice(0, i2);
        switch (type2) {
          case "m":
            return ss.concat(stack[i2]).concat(stack[len2]);
          case "r":
            return ss.concat(stack[len2]);
          case "i":
            return ss;
          case "g":
            return ss.concat(fakeToken("group"));
          case "E":
            return ss.concat(stack[i2]);
          case "e":
            return ss.concat(stack[i2]);
        }
      }
    }
  }
  return type2 == "E" ? [] : stack;
}
function indenter$1(state, textAfter, cx2) {
  var t;
  var wordAfter = wordafter(textAfter);
  var currT = peekToken(state, 1);
  var prevT = peekToken(state, 2);
  if (state.in_string || state.in_atom) {
    return null;
  } else if (!prevT) {
    return 0;
  } else if (currT.token == "when") {
    return currT.column + cx2.unit;
  } else if (wordAfter === "when" && prevT.type === "function") {
    return prevT.indent + cx2.unit;
  } else if (wordAfter === "(" && currT.token === "fun") {
    return currT.column + 3;
  } else if (wordAfter === "catch" && (t = getToken(state, ["try"]))) {
    return t.column;
  } else if (is_member(wordAfter, ["end", "after", "of"])) {
    t = getToken(state, ["begin", "case", "fun", "if", "receive", "try"]);
    return t ? t.column : null;
  } else if (is_member(wordAfter, closeParenWords)) {
    t = getToken(state, openParenWords);
    return t ? t.column : null;
  } else if (is_member(currT.token, [",", "|", "||"]) || is_member(wordAfter, [",", "|", "||"])) {
    t = postcommaToken(state);
    return t ? t.column + t.token.length : cx2.unit;
  } else if (currT.token == "->") {
    if (is_member(prevT.token, ["receive", "case", "if", "try"])) {
      return prevT.column + cx2.unit + cx2.unit;
    } else {
      return prevT.column + cx2.unit;
    }
  } else if (is_member(currT.token, openParenWords)) {
    return currT.column + currT.token.length;
  } else {
    t = defaultToken(state);
    return truthy(t) ? t.column + cx2.unit : 0;
  }
}
function wordafter(str) {
  var m = str.match(/,|[a-z]+|\}|\]|\)|>>|\|+|\(/);
  return truthy(m) && m.index === 0 ? m[0] : "";
}
function postcommaToken(state) {
  var objs = state.tokenStack.slice(0, -1);
  var i2 = getTokenIndex(objs, "type", ["open_paren"]);
  return truthy(objs[i2]) ? objs[i2] : false;
}
function defaultToken(state) {
  var objs = state.tokenStack;
  var stop = getTokenIndex(objs, "type", ["open_paren", "separator", "keyword"]);
  var oper = getTokenIndex(objs, "type", ["operator"]);
  if (truthy(stop) && truthy(oper) && stop < oper) {
    return objs[stop + 1];
  } else if (truthy(stop)) {
    return objs[stop];
  } else {
    return false;
  }
}
function getToken(state, tokens) {
  var objs = state.tokenStack;
  var i2 = getTokenIndex(objs, "token", tokens);
  return truthy(objs[i2]) ? objs[i2] : false;
}
function getTokenIndex(objs, propname, propvals) {
  for (var i2 = objs.length - 1; -1 < i2; i2--) {
    if (is_member(objs[i2][propname], propvals)) {
      return i2;
    }
  }
  return false;
}
function truthy(x) {
  return x !== false && x != null;
}
const erlang = {
  name: "erlang",
  startState() {
    return {
      tokenStack: [],
      in_string: false,
      in_atom: false
    };
  },
  token: tokenizer,
  indent: indenter$1,
  languageData: {
    commentTokens: { line: "%" }
  }
};
const erlang$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  erlang
});
function sql(parserConfig2) {
  var client = parserConfig2.client || {}, atoms2 = parserConfig2.atoms || { "false": true, "true": true, "null": true }, builtin2 = parserConfig2.builtin || set(defaultBuiltin), keywords2 = parserConfig2.keywords || set(sqlKeywords), operatorChars2 = parserConfig2.operatorChars || /^[*+\-%<>!=&|~^\/]/, support = parserConfig2.support || {}, hooks2 = parserConfig2.hooks || {}, dateSQL = parserConfig2.dateSQL || { "date": true, "time": true, "timestamp": true }, backslashStringEscapes = parserConfig2.backslashStringEscapes !== false, brackets2 = parserConfig2.brackets || /^[\{}\(\)\[\]]/, punctuation2 = parserConfig2.punctuation || /^[;.,:]/;
  function tokenBase2(stream, state) {
    var ch2 = stream.next();
    if (hooks2[ch2]) {
      var result = hooks2[ch2](stream, state);
      if (result !== false) return result;
    }
    if (support.hexNumber && (ch2 == "0" && stream.match(/^[xX][0-9a-fA-F]+/) || (ch2 == "x" || ch2 == "X") && stream.match(/^'[0-9a-fA-F]*'/))) {
      return "number";
    } else if (support.binaryNumber && ((ch2 == "b" || ch2 == "B") && stream.match(/^'[01]+'/) || ch2 == "0" && stream.match(/^b[01]*/))) {
      return "number";
    } else if (ch2.charCodeAt(0) > 47 && ch2.charCodeAt(0) < 58) {
      stream.match(/^[0-9]*(\.[0-9]+)?([eE][-+]?[0-9]+)?/);
      support.decimallessFloat && stream.match(/^\.(?!\.)/);
      return "number";
    } else if (ch2 == "?" && (stream.eatSpace() || stream.eol() || stream.eat(";"))) {
      return "macroName";
    } else if (ch2 == "'" || ch2 == '"' && support.doubleQuote) {
      state.tokenize = tokenLiteral2(ch2);
      return state.tokenize(stream, state);
    } else if ((support.nCharCast && (ch2 == "n" || ch2 == "N") || support.charsetCast && ch2 == "_" && stream.match(/[a-z][a-z0-9]*/i)) && (stream.peek() == "'" || stream.peek() == '"')) {
      return "keyword";
    } else if (support.escapeConstant && (ch2 == "e" || ch2 == "E") && (stream.peek() == "'" || stream.peek() == '"' && support.doubleQuote)) {
      state.tokenize = function(stream2, state2) {
        return (state2.tokenize = tokenLiteral2(stream2.next(), true))(stream2, state2);
      };
      return "keyword";
    } else if (support.commentSlashSlash && ch2 == "/" && stream.eat("/")) {
      stream.skipToEnd();
      return "comment";
    } else if (support.commentHash && ch2 == "#" || ch2 == "-" && stream.eat("-") && (!support.commentSpaceRequired || stream.eat(" "))) {
      stream.skipToEnd();
      return "comment";
    } else if (ch2 == "/" && stream.eat("*")) {
      state.tokenize = tokenComment2(1);
      return state.tokenize(stream, state);
    } else if (ch2 == ".") {
      if (support.zerolessFloat && stream.match(/^(?:\d+(?:e[+-]?\d+)?)/i))
        return "number";
      if (stream.match(/^\.+/))
        return null;
      if (support.ODBCdotTable && stream.match(/^[\w\d_$#]+/))
        return "type";
    } else if (operatorChars2.test(ch2)) {
      stream.eatWhile(operatorChars2);
      return "operator";
    } else if (brackets2.test(ch2)) {
      return "bracket";
    } else if (punctuation2.test(ch2)) {
      stream.eatWhile(punctuation2);
      return "punctuation";
    } else if (ch2 == "{" && (stream.match(/^( )*(d|D|t|T|ts|TS)( )*'[^']*'( )*}/) || stream.match(/^( )*(d|D|t|T|ts|TS)( )*"[^"]*"( )*}/))) {
      return "number";
    } else {
      stream.eatWhile(/^[_\w\d]/);
      var word = stream.current().toLowerCase();
      if (dateSQL.hasOwnProperty(word) && (stream.match(/^( )+'[^']*'/) || stream.match(/^( )+"[^"]*"/)))
        return "number";
      if (atoms2.hasOwnProperty(word)) return "atom";
      if (builtin2.hasOwnProperty(word)) return "type";
      if (keywords2.hasOwnProperty(word)) return "keyword";
      if (client.hasOwnProperty(word)) return "builtin";
      return null;
    }
  }
  function tokenLiteral2(quote2, backslashEscapes) {
    return function(stream, state) {
      var escaped = false, ch2;
      while ((ch2 = stream.next()) != null) {
        if (ch2 == quote2 && !escaped) {
          state.tokenize = tokenBase2;
          break;
        }
        escaped = (backslashStringEscapes || backslashEscapes) && !escaped && ch2 == "\\";
      }
      return "string";
    };
  }
  function tokenComment2(depth) {
    return function(stream, state) {
      var m = stream.match(/^.*?(\/\*|\*\/)/);
      if (!m) stream.skipToEnd();
      else if (m[1] == "/*") state.tokenize = tokenComment2(depth + 1);
      else if (depth > 1) state.tokenize = tokenComment2(depth - 1);
      else state.tokenize = tokenBase2;
      return "comment";
    };
  }
  function pushContext2(stream, state, type2) {
    state.context = {
      prev: state.context,
      indent: stream.indentation(),
      col: stream.column(),
      type: type2
    };
  }
  function popContext2(state) {
    state.indent = state.context.indent;
    state.context = state.context.prev;
  }
  return {
    name: "sql",
    startState: function() {
      return { tokenize: tokenBase2, context: null };
    },
    token: function(stream, state) {
      if (stream.sol()) {
        if (state.context && state.context.align == null)
          state.context.align = false;
      }
      if (state.tokenize == tokenBase2 && stream.eatSpace()) return null;
      var style2 = state.tokenize(stream, state);
      if (style2 == "comment") return style2;
      if (state.context && state.context.align == null)
        state.context.align = true;
      var tok = stream.current();
      if (tok == "(")
        pushContext2(stream, state, ")");
      else if (tok == "[")
        pushContext2(stream, state, "]");
      else if (state.context && state.context.type == tok)
        popContext2(state);
      return style2;
    },
    indent: function(state, textAfter, iCx) {
      var cx2 = state.context;
      if (!cx2) return null;
      var closing2 = textAfter.charAt(0) == cx2.type;
      if (cx2.align) return cx2.col + (closing2 ? 0 : 1);
      else return cx2.indent + (closing2 ? 0 : iCx.unit);
    },
    languageData: {
      commentTokens: {
        line: support.commentSlashSlash ? "//" : support.commentHash ? "#" : "--",
        block: { open: "/*", close: "*/" }
      },
      closeBrackets: { brackets: ["(", "[", "{", "'", '"', "`"] }
    }
  };
}
function hookIdentifier(stream) {
  var ch2;
  while ((ch2 = stream.next()) != null) {
    if (ch2 == "`" && !stream.eat("`")) return "string.special";
  }
  stream.backUp(stream.current().length - 1);
  return stream.eatWhile(/\w/) ? "string.special" : null;
}
function hookIdentifierDoublequote(stream) {
  var ch2;
  while ((ch2 = stream.next()) != null) {
    if (ch2 == '"' && !stream.eat('"')) return "string.special";
  }
  stream.backUp(stream.current().length - 1);
  return stream.eatWhile(/\w/) ? "string.special" : null;
}
function hookVar(stream) {
  if (stream.eat("@")) {
    stream.match("session.");
    stream.match("local.");
    stream.match("global.");
  }
  if (stream.eat("'")) {
    stream.match(/^.*'/);
    return "string.special";
  } else if (stream.eat('"')) {
    stream.match(/^.*"/);
    return "string.special";
  } else if (stream.eat("`")) {
    stream.match(/^.*`/);
    return "string.special";
  } else if (stream.match(/^[0-9a-zA-Z$\.\_]+/)) {
    return "string.special";
  }
  return null;
}
function hookClient(stream) {
  if (stream.eat("N")) {
    return "atom";
  }
  return stream.match(/^[a-zA-Z.#!?]/) ? "string.special" : null;
}
var sqlKeywords = "alter and as asc between by count create delete desc distinct drop from group having in insert into is join like not on or order select set table union update values where limit ";
function set(str) {
  var obj = {}, words2 = str.split(" ");
  for (var i2 = 0; i2 < words2.length; ++i2) obj[words2[i2]] = true;
  return obj;
}
var defaultBuiltin = "bool boolean bit blob enum long longblob longtext medium mediumblob mediumint mediumtext time timestamp tinyblob tinyint tinytext text bigint int int1 int2 int3 int4 int8 integer float float4 float8 double char varbinary varchar varcharacter precision real date datetime year unsigned signed decimal numeric";
sql({
  keywords: set(sqlKeywords + "begin"),
  builtin: set(defaultBuiltin),
  atoms: set("false true null unknown"),
  dateSQL: set("date time timestamp"),
  support: set("ODBCdotTable doubleQuote binaryNumber hexNumber")
});
sql({
  client: set("$partition binary_checksum checksum connectionproperty context_info current_request_id error_line error_message error_number error_procedure error_severity error_state formatmessage get_filestream_transaction_context getansinull host_id host_name isnull isnumeric min_active_rowversion newid newsequentialid rowcount_big xact_state object_id"),
  keywords: set(sqlKeywords + "begin trigger proc view index for add constraint key primary foreign collate clustered nonclustered declare exec go if use index holdlock nolock nowait paglock readcommitted readcommittedlock readpast readuncommitted repeatableread rowlock serializable snapshot tablock tablockx updlock with"),
  builtin: set("bigint numeric bit smallint decimal smallmoney int tinyint money float real char varchar text nchar nvarchar ntext binary varbinary image cursor timestamp hierarchyid uniqueidentifier sql_variant xml table "),
  atoms: set("is not null like and or in left right between inner outer join all any some cross unpivot pivot exists"),
  operatorChars: /^[*+\-%<>!=^\&|\/]/,
  brackets: /^[\{}\(\)]/,
  punctuation: /^[;.,:/]/,
  backslashStringEscapes: false,
  dateSQL: set("date datetimeoffset datetime2 smalldatetime datetime time"),
  hooks: {
    "@": hookVar
  }
});
sql({
  client: set("charset clear connect edit ego exit go help nopager notee nowarning pager print prompt quit rehash source status system tee"),
  keywords: set(sqlKeywords + "accessible action add after algorithm all analyze asensitive at authors auto_increment autocommit avg avg_row_length before binary binlog both btree cache call cascade cascaded case catalog_name chain change changed character check checkpoint checksum class_origin client_statistics close coalesce code collate collation collations column columns comment commit committed completion concurrent condition connection consistent constraint contains continue contributors convert cross current current_date current_time current_timestamp current_user cursor data database databases day_hour day_microsecond day_minute day_second deallocate dec declare default delay_key_write delayed delimiter des_key_file describe deterministic dev_pop dev_samp deviance diagnostics directory disable discard distinctrow div dual dumpfile each elseif enable enclosed end ends engine engines enum errors escape escaped even event events every execute exists exit explain extended fast fetch field fields first flush for force foreign found_rows full fulltext function general get global grant grants group group_concat handler hash help high_priority hosts hour_microsecond hour_minute hour_second if ignore ignore_server_ids import index index_statistics infile inner innodb inout insensitive insert_method install interval invoker isolation iterate key keys kill language last leading leave left level limit linear lines list load local localtime localtimestamp lock logs low_priority master master_heartbeat_period master_ssl_verify_server_cert masters match max max_rows maxvalue message_text middleint migrate min min_rows minute_microsecond minute_second mod mode modifies modify mutex mysql_errno natural next no no_write_to_binlog offline offset one online open optimize option optionally out outer outfile pack_keys parser partition partitions password phase plugin plugins prepare preserve prev primary privileges procedure processlist profile profiles purge query quick range read read_write reads real rebuild recover references regexp relaylog release remove rename reorganize repair repeatable replace require resignal restrict resume return returns revoke right rlike rollback rollup row row_format rtree savepoint schedule schema schema_name schemas second_microsecond security sensitive separator serializable server session share show signal slave slow smallint snapshot soname spatial specific sql sql_big_result sql_buffer_result sql_cache sql_calc_found_rows sql_no_cache sql_small_result sqlexception sqlstate sqlwarning ssl start starting starts status std stddev stddev_pop stddev_samp storage straight_join subclass_origin sum suspend table_name table_statistics tables tablespace temporary terminated to trailing transaction trigger triggers truncate uncommitted undo uninstall unique unlock upgrade usage use use_frm user user_resources user_statistics using utc_date utc_time utc_timestamp value variables varying view views warnings when while with work write xa xor year_month zerofill begin do then else loop repeat"),
  builtin: set("bool boolean bit blob decimal double float long longblob longtext medium mediumblob mediumint mediumtext time timestamp tinyblob tinyint tinytext text bigint int int1 int2 int3 int4 int8 integer float float4 float8 double char varbinary varchar varcharacter precision date datetime year unsigned signed numeric"),
  atoms: set("false true null unknown"),
  operatorChars: /^[*+\-%<>!=&|^]/,
  dateSQL: set("date time timestamp"),
  support: set("ODBCdotTable decimallessFloat zerolessFloat binaryNumber hexNumber doubleQuote nCharCast charsetCast commentHash commentSpaceRequired"),
  hooks: {
    "@": hookVar,
    "`": hookIdentifier,
    "\\": hookClient
  }
});
sql({
  client: set("charset clear connect edit ego exit go help nopager notee nowarning pager print prompt quit rehash source status system tee"),
  keywords: set(sqlKeywords + "accessible action add after algorithm all always analyze asensitive at authors auto_increment autocommit avg avg_row_length before binary binlog both btree cache call cascade cascaded case catalog_name chain change changed character check checkpoint checksum class_origin client_statistics close coalesce code collate collation collations column columns comment commit committed completion concurrent condition connection consistent constraint contains continue contributors convert cross current current_date current_time current_timestamp current_user cursor data database databases day_hour day_microsecond day_minute day_second deallocate dec declare default delay_key_write delayed delimiter des_key_file describe deterministic dev_pop dev_samp deviance diagnostics directory disable discard distinctrow div dual dumpfile each elseif enable enclosed end ends engine engines enum errors escape escaped even event events every execute exists exit explain extended fast fetch field fields first flush for force foreign found_rows full fulltext function general generated get global grant grants group group_concat handler hard hash help high_priority hosts hour_microsecond hour_minute hour_second if ignore ignore_server_ids import index index_statistics infile inner innodb inout insensitive insert_method install interval invoker isolation iterate key keys kill language last leading leave left level limit linear lines list load local localtime localtimestamp lock logs low_priority master master_heartbeat_period master_ssl_verify_server_cert masters match max max_rows maxvalue message_text middleint migrate min min_rows minute_microsecond minute_second mod mode modifies modify mutex mysql_errno natural next no no_write_to_binlog offline offset one online open optimize option optionally out outer outfile pack_keys parser partition partitions password persistent phase plugin plugins prepare preserve prev primary privileges procedure processlist profile profiles purge query quick range read read_write reads real rebuild recover references regexp relaylog release remove rename reorganize repair repeatable replace require resignal restrict resume return returns revoke right rlike rollback rollup row row_format rtree savepoint schedule schema schema_name schemas second_microsecond security sensitive separator serializable server session share show shutdown signal slave slow smallint snapshot soft soname spatial specific sql sql_big_result sql_buffer_result sql_cache sql_calc_found_rows sql_no_cache sql_small_result sqlexception sqlstate sqlwarning ssl start starting starts status std stddev stddev_pop stddev_samp storage straight_join subclass_origin sum suspend table_name table_statistics tables tablespace temporary terminated to trailing transaction trigger triggers truncate uncommitted undo uninstall unique unlock upgrade usage use use_frm user user_resources user_statistics using utc_date utc_time utc_timestamp value variables varying view views virtual warnings when while with work write xa xor year_month zerofill begin do then else loop repeat"),
  builtin: set("bool boolean bit blob decimal double float long longblob longtext medium mediumblob mediumint mediumtext time timestamp tinyblob tinyint tinytext text bigint int int1 int2 int3 int4 int8 integer float float4 float8 double char varbinary varchar varcharacter precision date datetime year unsigned signed numeric"),
  atoms: set("false true null unknown"),
  operatorChars: /^[*+\-%<>!=&|^]/,
  dateSQL: set("date time timestamp"),
  support: set("ODBCdotTable decimallessFloat zerolessFloat binaryNumber hexNumber doubleQuote nCharCast charsetCast commentHash commentSpaceRequired"),
  hooks: {
    "@": hookVar,
    "`": hookIdentifier,
    "\\": hookClient
  }
});
sql({
  // commands of the official SQLite client, ref: https://www.sqlite.org/cli.html#dotcmd
  client: set("auth backup bail binary changes check clone databases dbinfo dump echo eqp exit explain fullschema headers help import imposter indexes iotrace limit lint load log mode nullvalue once open output print prompt quit read restore save scanstats schema separator session shell show stats system tables testcase timeout timer trace vfsinfo vfslist vfsname width"),
  // ref: http://sqlite.org/lang_keywords.html
  keywords: set(sqlKeywords + "abort action add after all analyze attach autoincrement before begin cascade case cast check collate column commit conflict constraint cross current_date current_time current_timestamp database default deferrable deferred detach each else end escape except exclusive exists explain fail for foreign full glob if ignore immediate index indexed initially inner instead intersect isnull key left limit match natural no notnull null of offset outer plan pragma primary query raise recursive references regexp reindex release rename replace restrict right rollback row savepoint temp temporary then to transaction trigger unique using vacuum view virtual when with without"),
  // SQLite is weakly typed, ref: http://sqlite.org/datatype3.html. This is just a list of some common types.
  builtin: set("bool boolean bit blob decimal double float long longblob longtext medium mediumblob mediumint mediumtext time timestamp tinyblob tinyint tinytext text clob bigint int int2 int8 integer float double char varchar date datetime year unsigned signed numeric real"),
  // ref: http://sqlite.org/syntax/literal-value.html
  atoms: set("null current_date current_time current_timestamp"),
  // ref: http://sqlite.org/lang_expr.html#binaryops
  operatorChars: /^[*+\-%<>!=&|/~]/,
  // SQLite is weakly typed, ref: http://sqlite.org/datatype3.html. This is just a list of some common types.
  dateSQL: set("date time timestamp datetime"),
  support: set("decimallessFloat zerolessFloat"),
  hooks: {
    // bind-parameters ref:http://sqlite.org/lang_expr.html#varparam
    "@": hookVar,
    ":": hookVar,
    "?": hookVar,
    "$": hookVar,
    // The preferred way to escape Identifiers is using double quotes, ref: http://sqlite.org/lang_keywords.html
    '"': hookIdentifierDoublequote,
    // there is also support for backticks, ref: http://sqlite.org/lang_keywords.html
    "`": hookIdentifier
  }
});
sql({
  client: {},
  keywords: set("add all allow alter and any apply as asc authorize batch begin by clustering columnfamily compact consistency count create custom delete desc distinct drop each_quorum exists filtering from grant if in index insert into key keyspace keyspaces level limit local_one local_quorum modify nan norecursive nosuperuser not of on one order password permission permissions primary quorum rename revoke schema select set storage superuser table three to token truncate ttl two type unlogged update use user users using values where with writetime"),
  builtin: set("ascii bigint blob boolean counter decimal double float frozen inet int list map static text timestamp timeuuid tuple uuid varchar varint"),
  atoms: set("false true infinity NaN"),
  operatorChars: /^[<>=]/,
  dateSQL: {},
  support: set("commentSlashSlash decimallessFloat"),
  hooks: {}
});
sql({
  client: set("appinfo arraysize autocommit autoprint autorecovery autotrace blockterminator break btitle cmdsep colsep compatibility compute concat copycommit copytypecheck define describe echo editfile embedded escape exec execute feedback flagger flush heading headsep instance linesize lno loboffset logsource long longchunksize markup native newpage numformat numwidth pagesize pause pno recsep recsepchar release repfooter repheader serveroutput shiftinout show showmode size spool sqlblanklines sqlcase sqlcode sqlcontinue sqlnumber sqlpluscompatibility sqlprefix sqlprompt sqlterminator suffix tab term termout time timing trimout trimspool ttitle underline verify version wrap"),
  keywords: set("abort accept access add all alter and any array arraylen as asc assert assign at attributes audit authorization avg base_table begin between binary_integer body boolean by case cast char char_base check close cluster clusters colauth column comment commit compress connect connected constant constraint crash create current currval cursor data_base database date dba deallocate debugoff debugon decimal declare default definition delay delete desc digits dispose distinct do drop else elseif elsif enable end entry escape exception exception_init exchange exclusive exists exit external fast fetch file for force form from function generic goto grant group having identified if immediate in increment index indexes indicator initial initrans insert interface intersect into is key level library like limited local lock log logging long loop master maxextents maxtrans member minextents minus mislabel mode modify multiset new next no noaudit nocompress nologging noparallel not nowait number_base object of off offline on online only open option or order out package parallel partition pctfree pctincrease pctused pls_integer positive positiven pragma primary prior private privileges procedure public raise range raw read rebuild record ref references refresh release rename replace resource restrict return returning returns reverse revoke rollback row rowid rowlabel rownum rows run savepoint schema segment select separate session set share snapshot some space split sql start statement storage subtype successful synonym tabauth table tables tablespace task terminate then to trigger truncate type union unique unlimited unrecoverable unusable update use using validate value values variable view views when whenever where while with work"),
  builtin: set("abs acos add_months ascii asin atan atan2 average bfile bfilename bigserial bit blob ceil character chartorowid chr clob concat convert cos cosh count dec decode deref dual dump dup_val_on_index empty error exp false float floor found glb greatest hextoraw initcap instr instrb int integer isopen last_day least length lengthb ln lower lpad ltrim lub make_ref max min mlslabel mod months_between natural naturaln nchar nclob new_time next_day nextval nls_charset_decl_len nls_charset_id nls_charset_name nls_initcap nls_lower nls_sort nls_upper nlssort no_data_found notfound null number numeric nvarchar2 nvl others power rawtohex real reftohex round rowcount rowidtochar rowtype rpad rtrim serial sign signtype sin sinh smallint soundex sqlcode sqlerrm sqrt stddev string substr substrb sum sysdate tan tanh to_char text to_date to_label to_multi_byte to_number to_single_byte translate true trunc uid unlogged upper user userenv varchar varchar2 variance varying vsize xml"),
  operatorChars: /^[*\/+\-%<>!=~]/,
  dateSQL: set("date time timestamp"),
  support: set("doubleQuote nCharCast zerolessFloat binaryNumber hexNumber")
});
sql({
  keywords: set("select alter $elem$ $key$ $value$ add after all analyze and archive as asc before between binary both bucket buckets by cascade case cast change cluster clustered clusterstatus collection column columns comment compute concatenate continue create cross cursor data database databases dbproperties deferred delete delimited desc describe directory disable distinct distribute drop else enable end escaped exclusive exists explain export extended external fetch fields fileformat first format formatted from full function functions grant group having hold_ddltime idxproperties if import in index indexes inpath inputdriver inputformat insert intersect into is items join keys lateral left like limit lines load local location lock locks mapjoin materialized minus msck no_drop nocompress not of offline on option or order out outer outputdriver outputformat overwrite partition partitioned partitions percent plus preserve procedure purge range rcfile read readonly reads rebuild recordreader recordwriter recover reduce regexp rename repair replace restrict revoke right rlike row schema schemas semi sequencefile serde serdeproperties set shared show show_database sort sorted ssl statistics stored streamtable table tables tablesample tblproperties temporary terminated textfile then tmp to touch transform trigger unarchive undo union uniquejoin unlock update use using utc utc_tmestamp view when where while with admin authorization char compact compactions conf cube current current_date current_timestamp day decimal defined dependency directories elem_type exchange file following for grouping hour ignore inner interval jar less logical macro minute month more none noscan over owner partialscan preceding pretty principals protection reload rewrite role roles rollup rows second server sets skewed transactions truncate unbounded unset uri user values window year"),
  builtin: set("bool boolean long timestamp tinyint smallint bigint int float double date datetime unsigned string array struct map uniontype key_type utctimestamp value_type varchar"),
  atoms: set("false true null unknown"),
  operatorChars: /^[*+\-%<>!=]/,
  dateSQL: set("date timestamp"),
  support: set("ODBCdotTable doubleQuote binaryNumber hexNumber")
});
sql({
  client: set("source"),
  // For PostgreSQL - https://www.postgresql.org/docs/11/sql-keywords-appendix.html
  // For pl/pgsql lang - https://github.com/postgres/postgres/blob/REL_11_2/src/pl/plpgsql/src/pl_scanner.c
  keywords: set(sqlKeywords + "a abort abs absent absolute access according action ada add admin after aggregate alias all allocate also alter always analyse analyze and any are array array_agg array_max_cardinality as asc asensitive assert assertion assignment asymmetric at atomic attach attribute attributes authorization avg backward base64 before begin begin_frame begin_partition bernoulli between bigint binary bit bit_length blob blocked bom boolean both breadth by c cache call called cardinality cascade cascaded case cast catalog catalog_name ceil ceiling chain char char_length character character_length character_set_catalog character_set_name character_set_schema characteristics characters check checkpoint class class_origin clob close cluster coalesce cobol collate collation collation_catalog collation_name collation_schema collect column column_name columns command_function command_function_code comment comments commit committed concurrently condition condition_number configuration conflict connect connection connection_name constant constraint constraint_catalog constraint_name constraint_schema constraints constructor contains content continue control conversion convert copy corr corresponding cost count covar_pop covar_samp create cross csv cube cume_dist current current_catalog current_date current_default_transform_group current_path current_role current_row current_schema current_time current_timestamp current_transform_group_for_type current_user cursor cursor_name cycle data database datalink datatype date datetime_interval_code datetime_interval_precision day db deallocate debug dec decimal declare default defaults deferrable deferred defined definer degree delete delimiter delimiters dense_rank depends depth deref derived desc describe descriptor detach detail deterministic diagnostics dictionary disable discard disconnect dispatch distinct dlnewcopy dlpreviouscopy dlurlcomplete dlurlcompleteonly dlurlcompletewrite dlurlpath dlurlpathonly dlurlpathwrite dlurlscheme dlurlserver dlvalue do document domain double drop dump dynamic dynamic_function dynamic_function_code each element else elseif elsif empty enable encoding encrypted end end_frame end_partition endexec enforced enum equals errcode error escape event every except exception exclude excluding exclusive exec execute exists exit exp explain expression extension external extract false family fetch file filter final first first_value flag float floor following for force foreach foreign fortran forward found frame_row free freeze from fs full function functions fusion g general generated get global go goto grant granted greatest group grouping groups handler having header hex hierarchy hint hold hour id identity if ignore ilike immediate immediately immutable implementation implicit import in include including increment indent index indexes indicator info inherit inherits initially inline inner inout input insensitive insert instance instantiable instead int integer integrity intersect intersection interval into invoker is isnull isolation join k key key_member key_type label lag language large last last_value lateral lead leading leakproof least left length level library like like_regex limit link listen ln load local localtime localtimestamp location locator lock locked log logged loop lower m map mapping match matched materialized max max_cardinality maxvalue member merge message message_length message_octet_length message_text method min minute minvalue mod mode modifies module month more move multiset mumps name names namespace national natural nchar nclob nesting new next nfc nfd nfkc nfkd nil no none normalize normalized not nothing notice notify notnull nowait nth_value ntile null nullable nullif nulls number numeric object occurrences_regex octet_length octets of off offset oids old on only open operator option options or order ordering ordinality others out outer output over overlaps overlay overriding owned owner p pad parallel parameter parameter_mode parameter_name parameter_ordinal_position parameter_specific_catalog parameter_specific_name parameter_specific_schema parser partial partition pascal passing passthrough password path percent percent_rank percentile_cont percentile_disc perform period permission pg_context pg_datatype_name pg_exception_context pg_exception_detail pg_exception_hint placing plans pli policy portion position position_regex power precedes preceding precision prepare prepared preserve primary print_strict_params prior privileges procedural procedure procedures program public publication query quote raise range rank read reads real reassign recheck recovery recursive ref references referencing refresh regr_avgx regr_avgy regr_count regr_intercept regr_r2 regr_slope regr_sxx regr_sxy regr_syy reindex relative release rename repeatable replace replica requiring reset respect restart restore restrict result result_oid return returned_cardinality returned_length returned_octet_length returned_sqlstate returning returns reverse revoke right role rollback rollup routine routine_catalog routine_name routine_schema routines row row_count row_number rows rowtype rule savepoint scale schema schema_name schemas scope scope_catalog scope_name scope_schema scroll search second section security select selective self sensitive sequence sequences serializable server server_name session session_user set setof sets share show similar simple size skip slice smallint snapshot some source space specific specific_name specifictype sql sqlcode sqlerror sqlexception sqlstate sqlwarning sqrt stable stacked standalone start state statement static statistics stddev_pop stddev_samp stdin stdout storage strict strip structure style subclass_origin submultiset subscription substring substring_regex succeeds sum symmetric sysid system system_time system_user t table table_name tables tablesample tablespace temp template temporary text then ties time timestamp timezone_hour timezone_minute to token top_level_count trailing transaction transaction_active transactions_committed transactions_rolled_back transform transforms translate translate_regex translation treat trigger trigger_catalog trigger_name trigger_schema trim trim_array true truncate trusted type types uescape unbounded uncommitted under unencrypted union unique unknown unlink unlisten unlogged unnamed unnest until untyped update upper uri usage use_column use_variable user user_defined_type_catalog user_defined_type_code user_defined_type_name user_defined_type_schema using vacuum valid validate validator value value_of values var_pop var_samp varbinary varchar variable_conflict variadic varying verbose version versioning view views volatile warning when whenever where while whitespace width_bucket window with within without work wrapper write xml xmlagg xmlattributes xmlbinary xmlcast xmlcomment xmlconcat xmldeclaration xmldocument xmlelement xmlexists xmlforest xmliterate xmlnamespaces xmlparse xmlpi xmlquery xmlroot xmlschema xmlserialize xmltable xmltext xmlvalidate year yes zone"),
  // https://www.postgresql.org/docs/11/datatype.html
  builtin: set("bigint int8 bigserial serial8 bit varying varbit boolean bool box bytea character char varchar cidr circle date double precision float8 inet integer int int4 interval json jsonb line lseg macaddr macaddr8 money numeric decimal path pg_lsn point polygon real float4 smallint int2 smallserial serial2 serial serial4 text time without zone with timetz timestamp timestamptz tsquery tsvector txid_snapshot uuid xml"),
  atoms: set("false true null unknown"),
  operatorChars: /^[*\/+\-%<>!=&|^\/#@?~]/,
  backslashStringEscapes: false,
  dateSQL: set("date time timestamp"),
  support: set("ODBCdotTable decimallessFloat zerolessFloat binaryNumber hexNumber nCharCast charsetCast escapeConstant")
});
sql({
  keywords: set("ancestor and asc by contains desc descendant distinct from group has in is limit offset on order select superset where"),
  atoms: set("false true"),
  builtin: set("blob datetime first key __key__ string integer double boolean null"),
  operatorChars: /^[*+\-%<>!=]/
});
sql({
  client: set("source"),
  //https://github.com/greenplum-db/gpdb/blob/master/src/include/parser/kwlist.h
  keywords: set("abort absolute access action active add admin after aggregate all also alter always analyse analyze and any array as asc assertion assignment asymmetric at authorization backward before begin between bigint binary bit boolean both by cache called cascade cascaded case cast chain char character characteristics check checkpoint class close cluster coalesce codegen collate column comment commit committed concurrency concurrently configuration connection constraint constraints contains content continue conversion copy cost cpu_rate_limit create createdb createexttable createrole createuser cross csv cube current current_catalog current_date current_role current_schema current_time current_timestamp current_user cursor cycle data database day deallocate dec decimal declare decode default defaults deferrable deferred definer delete delimiter delimiters deny desc dictionary disable discard distinct distributed do document domain double drop dxl each else enable encoding encrypted end enum errors escape every except exchange exclude excluding exclusive execute exists explain extension external extract false family fetch fields filespace fill filter first float following for force foreign format forward freeze from full function global grant granted greatest group group_id grouping handler hash having header hold host hour identity if ignore ilike immediate immutable implicit in including inclusive increment index indexes inherit inherits initially inline inner inout input insensitive insert instead int integer intersect interval into invoker is isnull isolation join key language large last leading least left level like limit list listen load local localtime localtimestamp location lock log login mapping master match maxvalue median merge minute minvalue missing mode modifies modify month move name names national natural nchar new newline next no nocreatedb nocreateexttable nocreaterole nocreateuser noinherit nologin none noovercommit nosuperuser not nothing notify notnull nowait null nullif nulls numeric object of off offset oids old on only operator option options or order ordered others out outer over overcommit overlaps overlay owned owner parser partial partition partitions passing password percent percentile_cont percentile_disc placing plans position preceding precision prepare prepared preserve primary prior privileges procedural procedure protocol queue quote randomly range read readable reads real reassign recheck recursive ref references reindex reject relative release rename repeatable replace replica reset resource restart restrict returning returns revoke right role rollback rollup rootpartition row rows rule savepoint scatter schema scroll search second security segment select sequence serializable session session_user set setof sets share show similar simple smallint some split sql stable standalone start statement statistics stdin stdout storage strict strip subpartition subpartitions substring superuser symmetric sysid system table tablespace temp template temporary text then threshold ties time timestamp to trailing transaction treat trigger trim true truncate trusted type unbounded uncommitted unencrypted union unique unknown unlisten until update user using vacuum valid validation validator value values varchar variadic varying verbose version view volatile web when where whitespace window with within without work writable write xml xmlattributes xmlconcat xmlelement xmlexists xmlforest xmlparse xmlpi xmlroot xmlserialize year yes zone"),
  builtin: set("bigint int8 bigserial serial8 bit varying varbit boolean bool box bytea character char varchar cidr circle date double precision float float8 inet integer int int4 interval json jsonb line lseg macaddr macaddr8 money numeric decimal path pg_lsn point polygon real float4 smallint int2 smallserial serial2 serial serial4 text time without zone with timetz timestamp timestamptz tsquery tsvector txid_snapshot uuid xml"),
  atoms: set("false true null unknown"),
  operatorChars: /^[*+\-%<>!=&|^\/#@?~]/,
  dateSQL: set("date time timestamp"),
  support: set("ODBCdotTable decimallessFloat zerolessFloat binaryNumber hexNumber nCharCast charsetCast")
});
sql({
  keywords: set("add after all alter analyze and anti archive array as asc at between bucket buckets by cache cascade case cast change clear cluster clustered codegen collection column columns comment commit compact compactions compute concatenate cost create cross cube current current_date current_timestamp database databases data dbproperties defined delete delimited deny desc describe dfs directories distinct distribute drop else end escaped except exchange exists explain export extended external false fields fileformat first following for format formatted from full function functions global grant group grouping having if ignore import in index indexes inner inpath inputformat insert intersect interval into is items join keys last lateral lazy left like limit lines list load local location lock locks logical macro map minus msck natural no not null nulls of on optimize option options or order out outer outputformat over overwrite partition partitioned partitions percent preceding principals purge range recordreader recordwriter recover reduce refresh regexp rename repair replace reset restrict revoke right rlike role roles rollback rollup row rows schema schemas select semi separated serde serdeproperties set sets show skewed sort sorted start statistics stored stratify struct table tables tablesample tblproperties temp temporary terminated then to touch transaction transactions transform true truncate unarchive unbounded uncache union unlock unset use using values view when where window with"),
  builtin: set("tinyint smallint int bigint boolean float double string binary timestamp decimal array map struct uniontype delimited serde sequencefile textfile rcfile inputformat outputformat"),
  atoms: set("false true null"),
  operatorChars: /^[*\/+\-%<>!=~&|^]/,
  dateSQL: set("date time timestamp"),
  support: set("ODBCdotTable doubleQuote zerolessFloat")
});
const esper = sql({
  client: set("source"),
  // http://www.espertech.com/esper/release-5.5.0/esper-reference/html/appendix_keywords.html
  keywords: set("alter and as asc between by count create delete desc distinct drop from group having in insert into is join like not on or order select set table union update values where limit after all and as at asc avedev avg between by case cast coalesce count create current_timestamp day days delete define desc distinct else end escape events every exists false first from full group having hour hours in inner insert instanceof into irstream is istream join last lastweekday left limit like max match_recognize matches median measures metadatasql min minute minutes msec millisecond milliseconds not null offset on or order outer output partition pattern prev prior regexp retain-union retain-intersection right rstream sec second seconds select set some snapshot sql stddev sum then true unidirectional until update variable weekday when where window"),
  builtin: {},
  atoms: set("false true null"),
  operatorChars: /^[*+\-%<>!=&|^\/#@?~]/,
  dateSQL: set("time"),
  support: set("decimallessFloat zerolessFloat binaryNumber hexNumber")
});
const sql$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  esper,
  sql
});
const factor = simpleMode({
  start: [
    // comments
    { regex: /#?!.*/, token: "comment" },
    // strings """, multiline --> state
    { regex: /"""/, token: "string", next: "string3" },
    { regex: /(STRING:)(\s)/, token: ["keyword", null], next: "string2" },
    { regex: /\S*?"/, token: "string", next: "string" },
    // numbers: dec, hex, unicode, bin, fractional, complex
    { regex: /(?:0x[\d,a-f]+)|(?:0o[0-7]+)|(?:0b[0,1]+)|(?:\-?\d+.?\d*)(?=\s)/, token: "number" },
    //{regex: /[+-]?/} //fractional
    // definition: defining word, defined word, etc
    { regex: /((?:GENERIC)|\:?\:)(\s+)(\S+)(\s+)(\()/, token: ["keyword", null, "def", null, "bracket"], next: "stack" },
    // method definition: defining word, type, defined word, etc
    { regex: /(M\:)(\s+)(\S+)(\s+)(\S+)/, token: ["keyword", null, "def", null, "tag"] },
    // vocabulary using --> state
    { regex: /USING\:/, token: "keyword", next: "vocabulary" },
    // vocabulary definition/use
    { regex: /(USE\:|IN\:)(\s+)(\S+)(?=\s|$)/, token: ["keyword", null, "tag"] },
    // definition: a defining word, defined word
    { regex: /(\S+\:)(\s+)(\S+)(?=\s|$)/, token: ["keyword", null, "def"] },
    // "keywords", incl. ; t f . [ ] { } defining words
    { regex: /(?:;|\\|t|f|if|loop|while|until|do|PRIVATE>|<PRIVATE|\.|\S*\[|\]|\S*\{|\})(?=\s|$)/, token: "keyword" },
    // <constructors> and the like
    { regex: /\S+[\)>\.\*\?]+(?=\s|$)/, token: "builtin" },
    { regex: /[\)><]+\S+(?=\s|$)/, token: "builtin" },
    // operators
    { regex: /(?:[\+\-\=\/\*<>])(?=\s|$)/, token: "keyword" },
    // any id (?)
    { regex: /\S+/, token: "variable" },
    { regex: /\s+|./, token: null }
  ],
  vocabulary: [
    { regex: /;/, token: "keyword", next: "start" },
    { regex: /\S+/, token: "tag" },
    { regex: /\s+|./, token: null }
  ],
  string: [
    { regex: /(?:[^\\]|\\.)*?"/, token: "string", next: "start" },
    { regex: /.*/, token: "string" }
  ],
  string2: [
    { regex: /^;/, token: "keyword", next: "start" },
    { regex: /.*/, token: "string" }
  ],
  string3: [
    { regex: /(?:[^\\]|\\.)*?"""/, token: "string", next: "start" },
    { regex: /.*/, token: "string" }
  ],
  stack: [
    { regex: /\)/, token: "bracket", next: "start" },
    { regex: /--/, token: "bracket" },
    { regex: /\S+/, token: "meta" },
    { regex: /\s+|./, token: null }
  ],
  languageData: {
    name: "factor",
    dontIndentStates: ["start", "vocabulary", "string", "string3", "stack"],
    commentTokens: { line: "!" }
  }
});
const factor$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  factor
});
var keywords$w = {
  "term": true,
  "method": true,
  "accu": true,
  "rule": true,
  "then": true,
  "is": true,
  "and": true,
  "or": true,
  "if": true,
  "default": true
};
var start_blocks = {
  "var_input": true,
  "var_output": true,
  "fuzzify": true,
  "defuzzify": true,
  "function_block": true,
  "ruleblock": true
};
var end_blocks = {
  "end_ruleblock": true,
  "end_defuzzify": true,
  "end_function_block": true,
  "end_fuzzify": true,
  "end_var": true
};
var atoms$9 = {
  "true": true,
  "false": true,
  "nan": true,
  "real": true,
  "min": true,
  "max": true,
  "cog": true,
  "cogs": true
};
var isOperatorChar$b = /[+\-*&^%:=<>!|\/]/;
function tokenBase$z(stream, state) {
  var ch2 = stream.next();
  if (/[\d\.]/.test(ch2)) {
    if (ch2 == ".") {
      stream.match(/^[0-9]+([eE][\-+]?[0-9]+)?/);
    } else if (ch2 == "0") {
      stream.match(/^[xX][0-9a-fA-F]+/) || stream.match(/^0[0-7]+/);
    } else {
      stream.match(/^[0-9]*\.?[0-9]*([eE][\-+]?[0-9]+)?/);
    }
    return "number";
  }
  if (ch2 == "/" || ch2 == "(") {
    if (stream.eat("*")) {
      state.tokenize = tokenComment$f;
      return tokenComment$f(stream, state);
    }
    if (stream.eat("/")) {
      stream.skipToEnd();
      return "comment";
    }
  }
  if (isOperatorChar$b.test(ch2)) {
    stream.eatWhile(isOperatorChar$b);
    return "operator";
  }
  stream.eatWhile(/[\w\$_\xa1-\uffff]/);
  var cur = stream.current().toLowerCase();
  if (keywords$w.propertyIsEnumerable(cur) || start_blocks.propertyIsEnumerable(cur) || end_blocks.propertyIsEnumerable(cur)) {
    return "keyword";
  }
  if (atoms$9.propertyIsEnumerable(cur)) return "atom";
  return "variable";
}
function tokenComment$f(stream, state) {
  var maybeEnd = false, ch2;
  while (ch2 = stream.next()) {
    if ((ch2 == "/" || ch2 == ")") && maybeEnd) {
      state.tokenize = tokenBase$z;
      break;
    }
    maybeEnd = ch2 == "*";
  }
  return "comment";
}
function Context$7(indented, column, type2, align, prev) {
  this.indented = indented;
  this.column = column;
  this.type = type2;
  this.align = align;
  this.prev = prev;
}
function pushContext$a(state, col, type2) {
  return state.context = new Context$7(state.indented, col, type2, null, state.context);
}
function popContext$a(state) {
  if (!state.context.prev) return;
  var t = state.context.type;
  if (t == "end_block")
    state.indented = state.context.indented;
  return state.context = state.context.prev;
}
const fcl = {
  name: "fcl",
  startState: function(indentUnit) {
    return {
      tokenize: null,
      context: new Context$7(-indentUnit, 0, "top", false),
      indented: 0,
      startOfLine: true
    };
  },
  token: function(stream, state) {
    var ctx = state.context;
    if (stream.sol()) {
      if (ctx.align == null) ctx.align = false;
      state.indented = stream.indentation();
      state.startOfLine = true;
    }
    if (stream.eatSpace()) return null;
    var style2 = (state.tokenize || tokenBase$z)(stream, state);
    if (style2 == "comment") return style2;
    if (ctx.align == null) ctx.align = true;
    var cur = stream.current().toLowerCase();
    if (start_blocks.propertyIsEnumerable(cur)) pushContext$a(state, stream.column(), "end_block");
    else if (end_blocks.propertyIsEnumerable(cur)) popContext$a(state);
    state.startOfLine = false;
    return style2;
  },
  indent: function(state, textAfter, cx2) {
    if (state.tokenize != tokenBase$z && state.tokenize != null) return 0;
    var ctx = state.context;
    var closing2 = end_blocks.propertyIsEnumerable(textAfter);
    if (ctx.align) return ctx.column + (closing2 ? 0 : 1);
    else return ctx.indented + (closing2 ? 0 : cx2.unit);
  },
  languageData: {
    commentTokens: { line: "//", block: { open: "(*", close: "*)" } }
  }
};
const fcl$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  fcl
});
function toWordList(words2) {
  var ret2 = [];
  words2.split(" ").forEach(function(e) {
    ret2.push({ name: e });
  });
  return ret2;
}
var coreWordList = toWordList(
  "INVERT AND OR XOR 2* 2/ LSHIFT RSHIFT 0= = 0< < > U< MIN MAX 2DROP 2DUP 2OVER 2SWAP ?DUP DEPTH DROP DUP OVER ROT SWAP >R R> R@ + - 1+ 1- ABS NEGATE S>D * M* UM* FM/MOD SM/REM UM/MOD */ */MOD / /MOD MOD HERE , @ ! CELL+ CELLS C, C@ C! CHARS 2@ 2! ALIGN ALIGNED +! ALLOT CHAR [CHAR] [ ] BL FIND EXECUTE IMMEDIATE COUNT LITERAL STATE ; DOES> >BODY EVALUATE SOURCE >IN <# # #S #> HOLD SIGN BASE >NUMBER HEX DECIMAL FILL MOVE . CR EMIT SPACE SPACES TYPE U. .R U.R ACCEPT TRUE FALSE <> U> 0<> 0> NIP TUCK ROLL PICK 2>R 2R@ 2R> WITHIN UNUSED MARKER I J TO COMPILE, [COMPILE] SAVE-INPUT RESTORE-INPUT PAD ERASE 2LITERAL DNEGATE D- D+ D0< D0= D2* D2/ D< D= DMAX DMIN D>S DABS M+ M*/ D. D.R 2ROT DU< CATCH THROW FREE RESIZE ALLOCATE CS-PICK CS-ROLL GET-CURRENT SET-CURRENT FORTH-WORDLIST GET-ORDER SET-ORDER PREVIOUS SEARCH-WORDLIST WORDLIST FIND ALSO ONLY FORTH DEFINITIONS ORDER -TRAILING /STRING SEARCH COMPARE CMOVE CMOVE> BLANK SLITERAL"
);
var immediateWordList = toWordList("IF ELSE THEN BEGIN WHILE REPEAT UNTIL RECURSE [IF] [ELSE] [THEN] ?DO DO LOOP +LOOP UNLOOP LEAVE EXIT AGAIN CASE OF ENDOF ENDCASE");
function searchWordList(wordList2, word) {
  var i2;
  for (i2 = wordList2.length - 1; i2 >= 0; i2--) {
    if (wordList2[i2].name === word.toUpperCase()) {
      return wordList2[i2];
    }
  }
  return void 0;
}
const forth = {
  name: "forth",
  startState: function() {
    return {
      state: "",
      base: 10,
      coreWordList,
      immediateWordList,
      wordList: []
    };
  },
  token: function(stream, stt) {
    var mat;
    if (stream.eatSpace()) {
      return null;
    }
    if (stt.state === "") {
      if (stream.match(/^(\]|:NONAME)(\s|$)/i)) {
        stt.state = " compilation";
        return "builtin";
      }
      mat = stream.match(/^(\:)\s+(\S+)(\s|$)+/);
      if (mat) {
        stt.wordList.push({ name: mat[2].toUpperCase() });
        stt.state = " compilation";
        return "def";
      }
      mat = stream.match(/^(VARIABLE|2VARIABLE|CONSTANT|2CONSTANT|CREATE|POSTPONE|VALUE|WORD)\s+(\S+)(\s|$)+/i);
      if (mat) {
        stt.wordList.push({ name: mat[2].toUpperCase() });
        return "def";
      }
      mat = stream.match(/^(\'|\[\'\])\s+(\S+)(\s|$)+/);
      if (mat) {
        return "builtin";
      }
    } else {
      if (stream.match(/^(\;|\[)(\s)/)) {
        stt.state = "";
        stream.backUp(1);
        return "builtin";
      }
      if (stream.match(/^(\;|\[)($)/)) {
        stt.state = "";
        return "builtin";
      }
      if (stream.match(/^(POSTPONE)\s+\S+(\s|$)+/)) {
        return "builtin";
      }
    }
    mat = stream.match(/^(\S+)(\s+|$)/);
    if (mat) {
      if (searchWordList(stt.wordList, mat[1]) !== void 0) {
        return "variable";
      }
      if (mat[1] === "\\") {
        stream.skipToEnd();
        return "comment";
      }
      if (searchWordList(stt.coreWordList, mat[1]) !== void 0) {
        return "builtin";
      }
      if (searchWordList(stt.immediateWordList, mat[1]) !== void 0) {
        return "keyword";
      }
      if (mat[1] === "(") {
        stream.eatWhile(function(s) {
          return s !== ")";
        });
        stream.eat(")");
        return "comment";
      }
      if (mat[1] === ".(") {
        stream.eatWhile(function(s) {
          return s !== ")";
        });
        stream.eat(")");
        return "string";
      }
      if (mat[1] === 'S"' || mat[1] === '."' || mat[1] === 'C"') {
        stream.eatWhile(function(s) {
          return s !== '"';
        });
        stream.eat('"');
        return "string";
      }
      if (mat[1] - 68719476735) {
        return "number";
      }
      return "atom";
    }
  }
};
const forth$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  forth
});
function words$e(array) {
  var keys = {};
  for (var i2 = 0; i2 < array.length; ++i2) {
    keys[array[i2]] = true;
  }
  return keys;
}
var keywords$v = words$e([
  "abstract",
  "accept",
  "allocatable",
  "allocate",
  "array",
  "assign",
  "asynchronous",
  "backspace",
  "bind",
  "block",
  "byte",
  "call",
  "case",
  "class",
  "close",
  "common",
  "contains",
  "continue",
  "cycle",
  "data",
  "deallocate",
  "decode",
  "deferred",
  "dimension",
  "do",
  "elemental",
  "else",
  "encode",
  "end",
  "endif",
  "entry",
  "enumerator",
  "equivalence",
  "exit",
  "external",
  "extrinsic",
  "final",
  "forall",
  "format",
  "function",
  "generic",
  "go",
  "goto",
  "if",
  "implicit",
  "import",
  "include",
  "inquire",
  "intent",
  "interface",
  "intrinsic",
  "module",
  "namelist",
  "non_intrinsic",
  "non_overridable",
  "none",
  "nopass",
  "nullify",
  "open",
  "optional",
  "options",
  "parameter",
  "pass",
  "pause",
  "pointer",
  "print",
  "private",
  "program",
  "protected",
  "public",
  "pure",
  "read",
  "recursive",
  "result",
  "return",
  "rewind",
  "save",
  "select",
  "sequence",
  "stop",
  "subroutine",
  "target",
  "then",
  "to",
  "type",
  "use",
  "value",
  "volatile",
  "where",
  "while",
  "write"
]);
var builtins$8 = words$e([
  "abort",
  "abs",
  "access",
  "achar",
  "acos",
  "adjustl",
  "adjustr",
  "aimag",
  "aint",
  "alarm",
  "all",
  "allocated",
  "alog",
  "amax",
  "amin",
  "amod",
  "and",
  "anint",
  "any",
  "asin",
  "associated",
  "atan",
  "besj",
  "besjn",
  "besy",
  "besyn",
  "bit_size",
  "btest",
  "cabs",
  "ccos",
  "ceiling",
  "cexp",
  "char",
  "chdir",
  "chmod",
  "clog",
  "cmplx",
  "command_argument_count",
  "complex",
  "conjg",
  "cos",
  "cosh",
  "count",
  "cpu_time",
  "cshift",
  "csin",
  "csqrt",
  "ctime",
  "c_funloc",
  "c_loc",
  "c_associated",
  "c_null_ptr",
  "c_null_funptr",
  "c_f_pointer",
  "c_null_char",
  "c_alert",
  "c_backspace",
  "c_form_feed",
  "c_new_line",
  "c_carriage_return",
  "c_horizontal_tab",
  "c_vertical_tab",
  "dabs",
  "dacos",
  "dasin",
  "datan",
  "date_and_time",
  "dbesj",
  "dbesj",
  "dbesjn",
  "dbesy",
  "dbesy",
  "dbesyn",
  "dble",
  "dcos",
  "dcosh",
  "ddim",
  "derf",
  "derfc",
  "dexp",
  "digits",
  "dim",
  "dint",
  "dlog",
  "dlog",
  "dmax",
  "dmin",
  "dmod",
  "dnint",
  "dot_product",
  "dprod",
  "dsign",
  "dsinh",
  "dsin",
  "dsqrt",
  "dtanh",
  "dtan",
  "dtime",
  "eoshift",
  "epsilon",
  "erf",
  "erfc",
  "etime",
  "exit",
  "exp",
  "exponent",
  "extends_type_of",
  "fdate",
  "fget",
  "fgetc",
  "float",
  "floor",
  "flush",
  "fnum",
  "fputc",
  "fput",
  "fraction",
  "fseek",
  "fstat",
  "ftell",
  "gerror",
  "getarg",
  "get_command",
  "get_command_argument",
  "get_environment_variable",
  "getcwd",
  "getenv",
  "getgid",
  "getlog",
  "getpid",
  "getuid",
  "gmtime",
  "hostnm",
  "huge",
  "iabs",
  "iachar",
  "iand",
  "iargc",
  "ibclr",
  "ibits",
  "ibset",
  "ichar",
  "idate",
  "idim",
  "idint",
  "idnint",
  "ieor",
  "ierrno",
  "ifix",
  "imag",
  "imagpart",
  "index",
  "int",
  "ior",
  "irand",
  "isatty",
  "ishft",
  "ishftc",
  "isign",
  "iso_c_binding",
  "is_iostat_end",
  "is_iostat_eor",
  "itime",
  "kill",
  "kind",
  "lbound",
  "len",
  "len_trim",
  "lge",
  "lgt",
  "link",
  "lle",
  "llt",
  "lnblnk",
  "loc",
  "log",
  "logical",
  "long",
  "lshift",
  "lstat",
  "ltime",
  "matmul",
  "max",
  "maxexponent",
  "maxloc",
  "maxval",
  "mclock",
  "merge",
  "move_alloc",
  "min",
  "minexponent",
  "minloc",
  "minval",
  "mod",
  "modulo",
  "mvbits",
  "nearest",
  "new_line",
  "nint",
  "not",
  "or",
  "pack",
  "perror",
  "precision",
  "present",
  "product",
  "radix",
  "rand",
  "random_number",
  "random_seed",
  "range",
  "real",
  "realpart",
  "rename",
  "repeat",
  "reshape",
  "rrspacing",
  "rshift",
  "same_type_as",
  "scale",
  "scan",
  "second",
  "selected_int_kind",
  "selected_real_kind",
  "set_exponent",
  "shape",
  "short",
  "sign",
  "signal",
  "sinh",
  "sin",
  "sleep",
  "sngl",
  "spacing",
  "spread",
  "sqrt",
  "srand",
  "stat",
  "sum",
  "symlnk",
  "system",
  "system_clock",
  "tan",
  "tanh",
  "time",
  "tiny",
  "transfer",
  "transpose",
  "trim",
  "ttynam",
  "ubound",
  "umask",
  "unlink",
  "unpack",
  "verify",
  "xor",
  "zabs",
  "zcos",
  "zexp",
  "zlog",
  "zsin",
  "zsqrt"
]);
var dataTypes = words$e([
  "c_bool",
  "c_char",
  "c_double",
  "c_double_complex",
  "c_float",
  "c_float_complex",
  "c_funptr",
  "c_int",
  "c_int16_t",
  "c_int32_t",
  "c_int64_t",
  "c_int8_t",
  "c_int_fast16_t",
  "c_int_fast32_t",
  "c_int_fast64_t",
  "c_int_fast8_t",
  "c_int_least16_t",
  "c_int_least32_t",
  "c_int_least64_t",
  "c_int_least8_t",
  "c_intmax_t",
  "c_intptr_t",
  "c_long",
  "c_long_double",
  "c_long_double_complex",
  "c_long_long",
  "c_ptr",
  "c_short",
  "c_signed_char",
  "c_size_t",
  "character",
  "complex",
  "double",
  "integer",
  "logical",
  "real"
]);
var isOperatorChar$a = /[+\-*&=<>\/\:]/;
var litOperator = /^\.(and|or|eq|lt|le|gt|ge|ne|not|eqv|neqv)\./i;
function tokenBase$y(stream, state) {
  if (stream.match(litOperator)) {
    return "operator";
  }
  var ch2 = stream.next();
  if (ch2 == "!") {
    stream.skipToEnd();
    return "comment";
  }
  if (ch2 == '"' || ch2 == "'") {
    state.tokenize = tokenString$l(ch2);
    return state.tokenize(stream, state);
  }
  if (/[\[\]\(\),]/.test(ch2)) {
    return null;
  }
  if (/\d/.test(ch2)) {
    stream.eatWhile(/[\w\.]/);
    return "number";
  }
  if (isOperatorChar$a.test(ch2)) {
    stream.eatWhile(isOperatorChar$a);
    return "operator";
  }
  stream.eatWhile(/[\w\$_]/);
  var word = stream.current().toLowerCase();
  if (keywords$v.hasOwnProperty(word)) {
    return "keyword";
  }
  if (builtins$8.hasOwnProperty(word) || dataTypes.hasOwnProperty(word)) {
    return "builtin";
  }
  return "variable";
}
function tokenString$l(quote2) {
  return function(stream, state) {
    var escaped = false, next2, end2 = false;
    while ((next2 = stream.next()) != null) {
      if (next2 == quote2 && !escaped) {
        end2 = true;
        break;
      }
      escaped = !escaped && next2 == "\\";
    }
    if (end2 || !escaped) state.tokenize = null;
    return "string";
  };
}
const fortran = {
  name: "fortran",
  startState: function() {
    return { tokenize: null };
  },
  token: function(stream, state) {
    if (stream.eatSpace()) return null;
    var style2 = (state.tokenize || tokenBase$y)(stream, state);
    if (style2 == "comment" || style2 == "meta") return style2;
    return style2;
  }
};
const fortran$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  fortran
});
function mlLike(parserConfig2) {
  var words2 = {
    "as": "keyword",
    "do": "keyword",
    "else": "keyword",
    "end": "keyword",
    "exception": "keyword",
    "fun": "keyword",
    "functor": "keyword",
    "if": "keyword",
    "in": "keyword",
    "include": "keyword",
    "let": "keyword",
    "of": "keyword",
    "open": "keyword",
    "rec": "keyword",
    "struct": "keyword",
    "then": "keyword",
    "type": "keyword",
    "val": "keyword",
    "while": "keyword",
    "with": "keyword"
  };
  var extraWords = parserConfig2.extraWords || {};
  for (var prop in extraWords) {
    if (extraWords.hasOwnProperty(prop)) {
      words2[prop] = parserConfig2.extraWords[prop];
    }
  }
  var hintWords2 = [];
  for (var k in words2) {
    hintWords2.push(k);
  }
  function tokenBase2(stream, state) {
    var ch2 = stream.next();
    if (ch2 === '"') {
      state.tokenize = tokenString3;
      return state.tokenize(stream, state);
    }
    if (ch2 === "{") {
      if (stream.eat("|")) {
        state.longString = true;
        state.tokenize = tokenLongString;
        return state.tokenize(stream, state);
      }
    }
    if (ch2 === "(") {
      if (stream.match(/^\*(?!\))/)) {
        state.commentLevel++;
        state.tokenize = tokenComment2;
        return state.tokenize(stream, state);
      }
    }
    if (ch2 === "~" || ch2 === "?") {
      stream.eatWhile(/\w/);
      return "variableName.special";
    }
    if (ch2 === "`") {
      stream.eatWhile(/\w/);
      return "quote";
    }
    if (ch2 === "/" && parserConfig2.slashComments && stream.eat("/")) {
      stream.skipToEnd();
      return "comment";
    }
    if (/\d/.test(ch2)) {
      if (ch2 === "0" && stream.eat(/[bB]/)) {
        stream.eatWhile(/[01]/);
      }
      if (ch2 === "0" && stream.eat(/[xX]/)) {
        stream.eatWhile(/[0-9a-fA-F]/);
      }
      if (ch2 === "0" && stream.eat(/[oO]/)) {
        stream.eatWhile(/[0-7]/);
      } else {
        stream.eatWhile(/[\d_]/);
        if (stream.eat(".")) {
          stream.eatWhile(/[\d]/);
        }
        if (stream.eat(/[eE]/)) {
          stream.eatWhile(/[\d\-+]/);
        }
      }
      return "number";
    }
    if (/[+\-*&%=<>!?|@\.~:]/.test(ch2)) {
      return "operator";
    }
    if (/[\w\xa1-\uffff]/.test(ch2)) {
      stream.eatWhile(/[\w\xa1-\uffff]/);
      var cur = stream.current();
      return words2.hasOwnProperty(cur) ? words2[cur] : "variable";
    }
    return null;
  }
  function tokenString3(stream, state) {
    var next2, end2 = false, escaped = false;
    while ((next2 = stream.next()) != null) {
      if (next2 === '"' && !escaped) {
        end2 = true;
        break;
      }
      escaped = !escaped && next2 === "\\";
    }
    if (end2 && !escaped) {
      state.tokenize = tokenBase2;
    }
    return "string";
  }
  function tokenComment2(stream, state) {
    var prev, next2;
    while (state.commentLevel > 0 && (next2 = stream.next()) != null) {
      if (prev === "(" && next2 === "*") state.commentLevel++;
      if (prev === "*" && next2 === ")") state.commentLevel--;
      prev = next2;
    }
    if (state.commentLevel <= 0) {
      state.tokenize = tokenBase2;
    }
    return "comment";
  }
  function tokenLongString(stream, state) {
    var prev, next2;
    while (state.longString && (next2 = stream.next()) != null) {
      if (prev === "|" && next2 === "}") state.longString = false;
      prev = next2;
    }
    if (!state.longString) {
      state.tokenize = tokenBase2;
    }
    return "string";
  }
  return {
    startState: function() {
      return { tokenize: tokenBase2, commentLevel: 0, longString: false };
    },
    token: function(stream, state) {
      if (stream.eatSpace()) return null;
      return state.tokenize(stream, state);
    },
    languageData: {
      autocomplete: hintWords2,
      commentTokens: {
        line: parserConfig2.slashComments ? "//" : void 0,
        block: { open: "(*", close: "*)" }
      }
    }
  };
}
const oCaml = mlLike({
  extraWords: {
    "and": "keyword",
    "assert": "keyword",
    "begin": "keyword",
    "class": "keyword",
    "constraint": "keyword",
    "done": "keyword",
    "downto": "keyword",
    "external": "keyword",
    "function": "keyword",
    "initializer": "keyword",
    "lazy": "keyword",
    "match": "keyword",
    "method": "keyword",
    "module": "keyword",
    "mutable": "keyword",
    "new": "keyword",
    "nonrec": "keyword",
    "object": "keyword",
    "private": "keyword",
    "sig": "keyword",
    "to": "keyword",
    "try": "keyword",
    "value": "keyword",
    "virtual": "keyword",
    "when": "keyword",
    // builtins
    "raise": "builtin",
    "failwith": "builtin",
    "true": "builtin",
    "false": "builtin",
    // Pervasives builtins
    "asr": "builtin",
    "land": "builtin",
    "lor": "builtin",
    "lsl": "builtin",
    "lsr": "builtin",
    "lxor": "builtin",
    "mod": "builtin",
    "or": "builtin",
    // More Pervasives
    "raise_notrace": "builtin",
    "trace": "builtin",
    "exit": "builtin",
    "print_string": "builtin",
    "print_endline": "builtin",
    "int": "type",
    "float": "type",
    "bool": "type",
    "char": "type",
    "string": "type",
    "unit": "type",
    // Modules
    "List": "builtin"
  }
});
const fSharp = mlLike({
  extraWords: {
    "abstract": "keyword",
    "assert": "keyword",
    "base": "keyword",
    "begin": "keyword",
    "class": "keyword",
    "default": "keyword",
    "delegate": "keyword",
    "do!": "keyword",
    "done": "keyword",
    "downcast": "keyword",
    "downto": "keyword",
    "elif": "keyword",
    "extern": "keyword",
    "finally": "keyword",
    "for": "keyword",
    "function": "keyword",
    "global": "keyword",
    "inherit": "keyword",
    "inline": "keyword",
    "interface": "keyword",
    "internal": "keyword",
    "lazy": "keyword",
    "let!": "keyword",
    "match": "keyword",
    "member": "keyword",
    "module": "keyword",
    "mutable": "keyword",
    "namespace": "keyword",
    "new": "keyword",
    "null": "keyword",
    "override": "keyword",
    "private": "keyword",
    "public": "keyword",
    "return!": "keyword",
    "return": "keyword",
    "select": "keyword",
    "static": "keyword",
    "to": "keyword",
    "try": "keyword",
    "upcast": "keyword",
    "use!": "keyword",
    "use": "keyword",
    "void": "keyword",
    "when": "keyword",
    "yield!": "keyword",
    "yield": "keyword",
    // Reserved words
    "atomic": "keyword",
    "break": "keyword",
    "checked": "keyword",
    "component": "keyword",
    "const": "keyword",
    "constraint": "keyword",
    "constructor": "keyword",
    "continue": "keyword",
    "eager": "keyword",
    "event": "keyword",
    "external": "keyword",
    "fixed": "keyword",
    "method": "keyword",
    "mixin": "keyword",
    "object": "keyword",
    "parallel": "keyword",
    "process": "keyword",
    "protected": "keyword",
    "pure": "keyword",
    "sealed": "keyword",
    "tailcall": "keyword",
    "trait": "keyword",
    "virtual": "keyword",
    "volatile": "keyword",
    // builtins
    "List": "builtin",
    "Seq": "builtin",
    "Map": "builtin",
    "Set": "builtin",
    "Option": "builtin",
    "int": "builtin",
    "string": "builtin",
    "not": "builtin",
    "true": "builtin",
    "false": "builtin",
    "raise": "builtin",
    "failwith": "builtin"
  },
  slashComments: true
});
const sml = mlLike({
  extraWords: {
    "abstype": "keyword",
    "and": "keyword",
    "andalso": "keyword",
    "case": "keyword",
    "datatype": "keyword",
    "fn": "keyword",
    "handle": "keyword",
    "infix": "keyword",
    "infixr": "keyword",
    "local": "keyword",
    "nonfix": "keyword",
    "op": "keyword",
    "orelse": "keyword",
    "raise": "keyword",
    "withtype": "keyword",
    "eqtype": "keyword",
    "sharing": "keyword",
    "sig": "keyword",
    "signature": "keyword",
    "structure": "keyword",
    "where": "keyword",
    "true": "keyword",
    "false": "keyword",
    // types
    "int": "builtin",
    "real": "builtin",
    "string": "builtin",
    "char": "builtin",
    "bool": "builtin"
  },
  slashComments: true
});
const mllike = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  fSharp,
  oCaml,
  sml
});
function mkGas(arch2) {
  var custom = [];
  var lineCommentStartSymbol = "";
  var directives = {
    ".abort": "builtin",
    ".align": "builtin",
    ".altmacro": "builtin",
    ".ascii": "builtin",
    ".asciz": "builtin",
    ".balign": "builtin",
    ".balignw": "builtin",
    ".balignl": "builtin",
    ".bundle_align_mode": "builtin",
    ".bundle_lock": "builtin",
    ".bundle_unlock": "builtin",
    ".byte": "builtin",
    ".cfi_startproc": "builtin",
    ".comm": "builtin",
    ".data": "builtin",
    ".def": "builtin",
    ".desc": "builtin",
    ".dim": "builtin",
    ".double": "builtin",
    ".eject": "builtin",
    ".else": "builtin",
    ".elseif": "builtin",
    ".end": "builtin",
    ".endef": "builtin",
    ".endfunc": "builtin",
    ".endif": "builtin",
    ".equ": "builtin",
    ".equiv": "builtin",
    ".eqv": "builtin",
    ".err": "builtin",
    ".error": "builtin",
    ".exitm": "builtin",
    ".extern": "builtin",
    ".fail": "builtin",
    ".file": "builtin",
    ".fill": "builtin",
    ".float": "builtin",
    ".func": "builtin",
    ".global": "builtin",
    ".gnu_attribute": "builtin",
    ".hidden": "builtin",
    ".hword": "builtin",
    ".ident": "builtin",
    ".if": "builtin",
    ".incbin": "builtin",
    ".include": "builtin",
    ".int": "builtin",
    ".internal": "builtin",
    ".irp": "builtin",
    ".irpc": "builtin",
    ".lcomm": "builtin",
    ".lflags": "builtin",
    ".line": "builtin",
    ".linkonce": "builtin",
    ".list": "builtin",
    ".ln": "builtin",
    ".loc": "builtin",
    ".loc_mark_labels": "builtin",
    ".local": "builtin",
    ".long": "builtin",
    ".macro": "builtin",
    ".mri": "builtin",
    ".noaltmacro": "builtin",
    ".nolist": "builtin",
    ".octa": "builtin",
    ".offset": "builtin",
    ".org": "builtin",
    ".p2align": "builtin",
    ".popsection": "builtin",
    ".previous": "builtin",
    ".print": "builtin",
    ".protected": "builtin",
    ".psize": "builtin",
    ".purgem": "builtin",
    ".pushsection": "builtin",
    ".quad": "builtin",
    ".reloc": "builtin",
    ".rept": "builtin",
    ".sbttl": "builtin",
    ".scl": "builtin",
    ".section": "builtin",
    ".set": "builtin",
    ".short": "builtin",
    ".single": "builtin",
    ".size": "builtin",
    ".skip": "builtin",
    ".sleb128": "builtin",
    ".space": "builtin",
    ".stab": "builtin",
    ".string": "builtin",
    ".struct": "builtin",
    ".subsection": "builtin",
    ".symver": "builtin",
    ".tag": "builtin",
    ".text": "builtin",
    ".title": "builtin",
    ".type": "builtin",
    ".uleb128": "builtin",
    ".val": "builtin",
    ".version": "builtin",
    ".vtable_entry": "builtin",
    ".vtable_inherit": "builtin",
    ".warning": "builtin",
    ".weak": "builtin",
    ".weakref": "builtin",
    ".word": "builtin"
  };
  var registers = {};
  function x86() {
    lineCommentStartSymbol = "#";
    registers.al = "variable";
    registers.ah = "variable";
    registers.ax = "variable";
    registers.eax = "variableName.special";
    registers.rax = "variableName.special";
    registers.bl = "variable";
    registers.bh = "variable";
    registers.bx = "variable";
    registers.ebx = "variableName.special";
    registers.rbx = "variableName.special";
    registers.cl = "variable";
    registers.ch = "variable";
    registers.cx = "variable";
    registers.ecx = "variableName.special";
    registers.rcx = "variableName.special";
    registers.dl = "variable";
    registers.dh = "variable";
    registers.dx = "variable";
    registers.edx = "variableName.special";
    registers.rdx = "variableName.special";
    registers.si = "variable";
    registers.esi = "variableName.special";
    registers.rsi = "variableName.special";
    registers.di = "variable";
    registers.edi = "variableName.special";
    registers.rdi = "variableName.special";
    registers.sp = "variable";
    registers.esp = "variableName.special";
    registers.rsp = "variableName.special";
    registers.bp = "variable";
    registers.ebp = "variableName.special";
    registers.rbp = "variableName.special";
    registers.ip = "variable";
    registers.eip = "variableName.special";
    registers.rip = "variableName.special";
    registers.cs = "keyword";
    registers.ds = "keyword";
    registers.ss = "keyword";
    registers.es = "keyword";
    registers.fs = "keyword";
    registers.gs = "keyword";
  }
  function armv6() {
    lineCommentStartSymbol = "@";
    directives.syntax = "builtin";
    registers.r0 = "variable";
    registers.r1 = "variable";
    registers.r2 = "variable";
    registers.r3 = "variable";
    registers.r4 = "variable";
    registers.r5 = "variable";
    registers.r6 = "variable";
    registers.r7 = "variable";
    registers.r8 = "variable";
    registers.r9 = "variable";
    registers.r10 = "variable";
    registers.r11 = "variable";
    registers.r12 = "variable";
    registers.sp = "variableName.special";
    registers.lr = "variableName.special";
    registers.pc = "variableName.special";
    registers.r13 = registers.sp;
    registers.r14 = registers.lr;
    registers.r15 = registers.pc;
    custom.push(function(ch2, stream) {
      if (ch2 === "#") {
        stream.eatWhile(/\w/);
        return "number";
      }
    });
  }
  if (arch2 === "x86") {
    x86();
  } else if (arch2 === "arm" || arch2 === "armv6") {
    armv6();
  }
  function nextUntilUnescaped(stream, end2) {
    var escaped = false, next2;
    while ((next2 = stream.next()) != null) {
      if (next2 === end2 && !escaped) {
        return false;
      }
      escaped = !escaped && next2 === "\\";
    }
    return escaped;
  }
  function clikeComment(stream, state) {
    var maybeEnd = false, ch2;
    while ((ch2 = stream.next()) != null) {
      if (ch2 === "/" && maybeEnd) {
        state.tokenize = null;
        break;
      }
      maybeEnd = ch2 === "*";
    }
    return "comment";
  }
  return {
    name: "gas",
    startState: function() {
      return {
        tokenize: null
      };
    },
    token: function(stream, state) {
      if (state.tokenize) {
        return state.tokenize(stream, state);
      }
      if (stream.eatSpace()) {
        return null;
      }
      var style2, cur, ch2 = stream.next();
      if (ch2 === "/") {
        if (stream.eat("*")) {
          state.tokenize = clikeComment;
          return clikeComment(stream, state);
        }
      }
      if (ch2 === lineCommentStartSymbol) {
        stream.skipToEnd();
        return "comment";
      }
      if (ch2 === '"') {
        nextUntilUnescaped(stream, '"');
        return "string";
      }
      if (ch2 === ".") {
        stream.eatWhile(/\w/);
        cur = stream.current().toLowerCase();
        style2 = directives[cur];
        return style2 || null;
      }
      if (ch2 === "=") {
        stream.eatWhile(/\w/);
        return "tag";
      }
      if (ch2 === "{") {
        return "bracket";
      }
      if (ch2 === "}") {
        return "bracket";
      }
      if (/\d/.test(ch2)) {
        if (ch2 === "0" && stream.eat("x")) {
          stream.eatWhile(/[0-9a-fA-F]/);
          return "number";
        }
        stream.eatWhile(/\d/);
        return "number";
      }
      if (/\w/.test(ch2)) {
        stream.eatWhile(/\w/);
        if (stream.eat(":")) {
          return "tag";
        }
        cur = stream.current().toLowerCase();
        style2 = registers[cur];
        return style2 || null;
      }
      for (var i2 = 0; i2 < custom.length; i2++) {
        style2 = custom[i2](ch2, stream, state);
        if (style2) {
          return style2;
        }
      }
    },
    languageData: {
      commentTokens: {
        line: lineCommentStartSymbol,
        block: { open: "/*", close: "*/" }
      }
    }
  };
}
const gas = mkGas("x86");
mkGas("arm");
const gas$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  gas
});
const gherkin = {
  name: "gherkin",
  startState: function() {
    return {
      lineNumber: 0,
      tableHeaderLine: false,
      allowFeature: true,
      allowBackground: false,
      allowScenario: false,
      allowSteps: false,
      allowPlaceholders: false,
      allowMultilineArgument: false,
      inMultilineString: false,
      inMultilineTable: false,
      inKeywordLine: false
    };
  },
  token: function(stream, state) {
    if (stream.sol()) {
      state.lineNumber++;
      state.inKeywordLine = false;
      if (state.inMultilineTable) {
        state.tableHeaderLine = false;
        if (!stream.match(/\s*\|/, false)) {
          state.allowMultilineArgument = false;
          state.inMultilineTable = false;
        }
      }
    }
    stream.eatSpace();
    if (state.allowMultilineArgument) {
      if (state.inMultilineString) {
        if (stream.match('"""')) {
          state.inMultilineString = false;
          state.allowMultilineArgument = false;
        } else {
          stream.match(/.*/);
        }
        return "string";
      }
      if (state.inMultilineTable) {
        if (stream.match(/\|\s*/)) {
          return "bracket";
        } else {
          stream.match(/[^\|]*/);
          return state.tableHeaderLine ? "header" : "string";
        }
      }
      if (stream.match('"""')) {
        state.inMultilineString = true;
        return "string";
      } else if (stream.match("|")) {
        state.inMultilineTable = true;
        state.tableHeaderLine = true;
        return "bracket";
      }
    }
    if (stream.match(/#.*/)) {
      return "comment";
    } else if (!state.inKeywordLine && stream.match(/@\S+/)) {
      return "tag";
    } else if (!state.inKeywordLine && state.allowFeature && stream.match(/(機能|功能|フィーチャ|기능|โครงหลัก|ความสามารถ|ความต้องการทางธุรกิจ|ಹೆಚ್ಚಳ|గుణము|ਮੁਹਾਂਦਰਾ|ਨਕਸ਼ ਨੁਹਾਰ|ਖਾਸੀਅਤ|रूप लेख|وِیژگی|خاصية|תכונה|Функціонал|Функция|Функционалност|Функционал|Үзенчәлеклелек|Свойство|Особина|Мөмкинлек|Могућност|Λειτουργία|Δυνατότητα|Właściwość|Vlastnosť|Trajto|Tính năng|Savybė|Pretty much|Požiadavka|Požadavek|Potrzeba biznesowa|Özellik|Osobina|Ominaisuus|Omadus|OH HAI|Mogućnost|Mogucnost|Jellemző|Hwæt|Hwaet|Funzionalità|Funktionalitéit|Funktionalität|Funkcja|Funkcionalnost|Funkcionalitāte|Funkcia|Fungsi|Functionaliteit|Funcționalitate|Funcţionalitate|Functionalitate|Funcionalitat|Funcionalidade|Fonctionnalité|Fitur|Fīča|Feature|Eiginleiki|Egenskap|Egenskab|Característica|Caracteristica|Business Need|Aspekt|Arwedd|Ahoy matey!|Ability):/)) {
      state.allowScenario = true;
      state.allowBackground = true;
      state.allowPlaceholders = false;
      state.allowSteps = false;
      state.allowMultilineArgument = false;
      state.inKeywordLine = true;
      return "keyword";
    } else if (!state.inKeywordLine && state.allowBackground && stream.match(/(背景|배경|แนวคิด|ಹಿನ್ನೆಲೆ|నేపథ్యం|ਪਿਛੋਕੜ|पृष्ठभूमि|زمینه|الخلفية|רקע|Тарих|Предыстория|Предистория|Позадина|Передумова|Основа|Контекст|Кереш|Υπόβαθρο|Założenia|Yo\-ho\-ho|Tausta|Taust|Situācija|Rerefons|Pozadina|Pozadie|Pozadí|Osnova|Latar Belakang|Kontext|Konteksts|Kontekstas|Kontekst|Háttér|Hannergrond|Grundlage|Geçmiş|Fundo|Fono|First off|Dis is what went down|Dasar|Contexto|Contexte|Context|Contesto|Cenário de Fundo|Cenario de Fundo|Cefndir|Bối cảnh|Bakgrunnur|Bakgrunn|Bakgrund|Baggrund|Background|B4|Antecedents|Antecedentes|Ær|Aer|Achtergrond):/)) {
      state.allowPlaceholders = false;
      state.allowSteps = true;
      state.allowBackground = false;
      state.allowMultilineArgument = false;
      state.inKeywordLine = true;
      return "keyword";
    } else if (!state.inKeywordLine && state.allowScenario && stream.match(/(場景大綱|场景大纲|劇本大綱|剧本大纲|テンプレ|シナリオテンプレート|シナリオテンプレ|シナリオアウトライン|시나리오 개요|สรุปเหตุการณ์|โครงสร้างของเหตุการณ์|ವಿವರಣೆ|కథనం|ਪਟਕਥਾ ਰੂਪ ਰੇਖਾ|ਪਟਕਥਾ ਢਾਂਚਾ|परिदृश्य रूपरेखा|سيناريو مخطط|الگوی سناریو|תבנית תרחיש|Сценарийның төзелеше|Сценарий структураси|Структура сценарію|Структура сценария|Структура сценарија|Скица|Рамка на сценарий|Концепт|Περιγραφή Σεναρίου|Wharrimean is|Template Situai|Template Senario|Template Keadaan|Tapausaihio|Szenariogrundriss|Szablon scenariusza|Swa hwær swa|Swa hwaer swa|Struktura scenarija|Structură scenariu|Structura scenariu|Skica|Skenario konsep|Shiver me timbers|Senaryo taslağı|Schema dello scenario|Scenariomall|Scenariomal|Scenario Template|Scenario Outline|Scenario Amlinellol|Scenārijs pēc parauga|Scenarijaus šablonas|Reckon it's like|Raamstsenaarium|Plang vum Szenario|Plan du Scénario|Plan du scénario|Osnova scénáře|Osnova Scenára|Náčrt Scenáru|Náčrt Scénáře|Náčrt Scenára|MISHUN SRSLY|Menggariskan Senario|Lýsing Dæma|Lýsing Atburðarásar|Konturo de la scenaro|Koncept|Khung tình huống|Khung kịch bản|Forgatókönyv vázlat|Esquema do Cenário|Esquema do Cenario|Esquema del escenario|Esquema de l'escenari|Esbozo do escenario|Delineação do Cenário|Delineacao do Cenario|All y'all|Abstrakt Scenario|Abstract Scenario):/)) {
      state.allowPlaceholders = true;
      state.allowSteps = true;
      state.allowMultilineArgument = false;
      state.inKeywordLine = true;
      return "keyword";
    } else if (state.allowScenario && stream.match(/(例子|例|サンプル|예|ชุดของเหตุการณ์|ชุดของตัวอย่าง|ಉದಾಹರಣೆಗಳು|ఉదాహరణలు|ਉਦਾਹਰਨਾਂ|उदाहरण|نمونه ها|امثلة|דוגמאות|Үрнәкләр|Сценарији|Примеры|Примери|Приклади|Мисоллар|Мисаллар|Σενάρια|Παραδείγματα|You'll wanna|Voorbeelden|Variantai|Tapaukset|Se þe|Se the|Se ðe|Scenarios|Scenariji|Scenarijai|Przykłady|Primjeri|Primeri|Příklady|Príklady|Piemēri|Példák|Pavyzdžiai|Paraugs|Örnekler|Juhtumid|Exemplos|Exemples|Exemple|Exempel|EXAMPLZ|Examples|Esempi|Enghreifftiau|Ekzemploj|Eksempler|Ejemplos|Dữ liệu|Dead men tell no tales|Dæmi|Contoh|Cenários|Cenarios|Beispiller|Beispiele|Atburðarásir):/)) {
      state.allowPlaceholders = false;
      state.allowSteps = true;
      state.allowBackground = false;
      state.allowMultilineArgument = true;
      return "keyword";
    } else if (!state.inKeywordLine && state.allowScenario && stream.match(/(場景|场景|劇本|剧本|シナリオ|시나리오|เหตุการณ์|ಕಥಾಸಾರಾಂಶ|సన్నివేశం|ਪਟਕਥਾ|परिदृश्य|سيناريو|سناریو|תרחיש|Сценарій|Сценарио|Сценарий|Пример|Σενάριο|Tình huống|The thing of it is|Tapaus|Szenario|Swa|Stsenaarium|Skenario|Situai|Senaryo|Senario|Scenaro|Scenariusz|Scenariu|Scénario|Scenario|Scenarijus|Scenārijs|Scenarij|Scenarie|Scénář|Scenár|Primer|MISHUN|Kịch bản|Keadaan|Heave to|Forgatókönyv|Escenario|Escenari|Cenário|Cenario|Awww, look mate|Atburðarás):/)) {
      state.allowPlaceholders = false;
      state.allowSteps = true;
      state.allowBackground = false;
      state.allowMultilineArgument = false;
      state.inKeywordLine = true;
      return "keyword";
    } else if (!state.inKeywordLine && state.allowSteps && stream.match(/(那麼|那么|而且|當|当|并且|同時|同时|前提|假设|假設|假定|假如|但是|但し|並且|もし|ならば|ただし|しかし|かつ|하지만|조건|먼저|만일|만약|단|그리고|그러면|และ |เมื่อ |แต่ |ดังนั้น |กำหนดให้ |ಸ್ಥಿತಿಯನ್ನು |ಮತ್ತು |ನೀಡಿದ |ನಂತರ |ಆದರೆ |మరియు |చెప్పబడినది |కాని |ఈ పరిస్థితిలో |అప్పుడు |ਪਰ |ਤਦ |ਜੇਕਰ |ਜਿਵੇਂ ਕਿ |ਜਦੋਂ |ਅਤੇ |यदि |परन्तु |पर |तब |तदा |तथा |जब |चूंकि |किन्तु |कदा |और |अगर |و |هنگامی |متى |لكن |عندما |ثم |بفرض |با فرض |اما |اذاً |آنگاه |כאשר |וגם |בהינתן |אזי |אז |אבל |Якщо |Һәм |Унда |Тоді |Тогда |То |Также |Та |Пусть |Припустимо, що |Припустимо |Онда |Но |Нехай |Нәтиҗәдә |Лекин |Ләкин |Коли |Когда |Когато |Када |Кад |К тому же |І |И |Задато |Задати |Задате |Если |Допустим |Дано |Дадено |Вә |Ва |Бирок |Әмма |Әйтик |Әгәр |Аммо |Али |Але |Агар |А також |А |Τότε |Όταν |Και |Δεδομένου |Αλλά |Þurh |Þegar |Þa þe |Þá |Þa |Zatati |Zakładając |Zadato |Zadate |Zadano |Zadani |Zadan |Za předpokladu |Za predpokladu |Youse know when youse got |Youse know like when |Yna |Yeah nah |Y'know |Y |Wun |Wtedy |When y'all |When |Wenn |WEN |wann |Ve |Và |Und |Un |ugeholl |Too right |Thurh |Thì |Then y'all |Then |Tha the |Tha |Tetapi |Tapi |Tak |Tada |Tad |Stel |Soit |Siis |Și |Şi |Si |Sed |Se |Så |Quando |Quand |Quan |Pryd |Potom |Pokud |Pokiaľ |Però |Pero |Pak |Oraz |Onda |Ond |Oletetaan |Og |Och |O zaman |Niin |Nhưng |När |Når |Mutta |Men |Mas |Maka |Majd |Mając |Mais |Maar |mä |Ma |Lorsque |Lorsqu'|Logo |Let go and haul |Kun |Kuid |Kui |Kiedy |Khi |Ketika |Kemudian |Keď |Když |Kaj |Kai |Kada |Kad |Jeżeli |Jeśli |Ja |It's just unbelievable |Ir |I CAN HAZ |I |Ha |Givun |Givet |Given y'all |Given |Gitt |Gegeven |Gegeben seien |Gegeben sei |Gdy |Gangway! |Fakat |Étant donnés |Etant donnés |Étant données |Etant données |Étant donnée |Etant donnée |Étant donné |Etant donné |Et |És |Entonces |Entón |Então |Entao |En |Eğer ki |Ef |Eeldades |E |Ðurh |Duota |Dun |Donitaĵo |Donat |Donada |Do |Diyelim ki |Diberi |Dengan |Den youse gotta |DEN |De |Dato |Dați fiind |Daţi fiind |Dati fiind |Dati |Date fiind |Date |Data |Dat fiind |Dar |Dann |dann |Dan |Dados |Dado |Dadas |Dada |Ða ðe |Ða |Cuando |Cho |Cando |Când |Cand |Cal |But y'all |But at the end of the day I reckon |BUT |But |Buh |Blimey! |Biết |Bet |Bagi |Aye |awer |Avast! |Atunci |Atesa |Atès |Apabila |Anrhegedig a |Angenommen |And y'all |And |AN |An |an |Amikor |Amennyiben |Ama |Als |Alors |Allora |Ali |Aleshores |Ale |Akkor |Ak |Adott |Ac |Aber |A zároveň |A tiež |A taktiež |A také |A |a |7 |\* )/)) {
      state.inStep = true;
      state.allowPlaceholders = true;
      state.allowMultilineArgument = true;
      state.inKeywordLine = true;
      return "keyword";
    } else if (stream.match(/"[^"]*"?/)) {
      return "string";
    } else if (state.allowPlaceholders && stream.match(/<[^>]*>?/)) {
      return "variable";
    } else {
      stream.next();
      stream.eatWhile(/[^@"<#]/);
      return null;
    }
  }
};
const gherkin$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  gherkin
});
function words$d(str) {
  var obj = {}, words2 = str.split(" ");
  for (var i2 = 0; i2 < words2.length; ++i2) obj[words2[i2]] = true;
  return obj;
}
var keywords$u = words$d(
  "abstract as assert boolean break byte case catch char class const continue def default do double else enum extends final finally float for goto if implements import in instanceof int interface long native new package private protected public return short static strictfp super switch synchronized threadsafe throw throws trait transient try void volatile while"
);
var blockKeywords$2 = words$d("catch class def do else enum finally for if interface switch trait try while");
var standaloneKeywords = words$d("return break continue");
var atoms$8 = words$d("null true false this");
var curPunc$8;
function tokenBase$x(stream, state) {
  var ch2 = stream.next();
  if (ch2 == '"' || ch2 == "'") {
    return startString$1(ch2, stream, state);
  }
  if (/[\[\]{}\(\),;\:\.]/.test(ch2)) {
    curPunc$8 = ch2;
    return null;
  }
  if (/\d/.test(ch2)) {
    stream.eatWhile(/[\w\.]/);
    if (stream.eat(/eE/)) {
      stream.eat(/\+\-/);
      stream.eatWhile(/\d/);
    }
    return "number";
  }
  if (ch2 == "/") {
    if (stream.eat("*")) {
      state.tokenize.push(tokenComment$e);
      return tokenComment$e(stream, state);
    }
    if (stream.eat("/")) {
      stream.skipToEnd();
      return "comment";
    }
    if (expectExpression(state.lastToken, false)) {
      return startString$1(ch2, stream, state);
    }
  }
  if (ch2 == "-" && stream.eat(">")) {
    curPunc$8 = "->";
    return null;
  }
  if (/[+\-*&%=<>!?|\/~]/.test(ch2)) {
    stream.eatWhile(/[+\-*&%=<>|~]/);
    return "operator";
  }
  stream.eatWhile(/[\w\$_]/);
  if (ch2 == "@") {
    stream.eatWhile(/[\w\$_\.]/);
    return "meta";
  }
  if (state.lastToken == ".") return "property";
  if (stream.eat(":")) {
    curPunc$8 = "proplabel";
    return "property";
  }
  var cur = stream.current();
  if (atoms$8.propertyIsEnumerable(cur)) {
    return "atom";
  }
  if (keywords$u.propertyIsEnumerable(cur)) {
    if (blockKeywords$2.propertyIsEnumerable(cur)) curPunc$8 = "newstatement";
    else if (standaloneKeywords.propertyIsEnumerable(cur)) curPunc$8 = "standalone";
    return "keyword";
  }
  return "variable";
}
tokenBase$x.isBase = true;
function startString$1(quote2, stream, state) {
  var tripleQuoted = false;
  if (quote2 != "/" && stream.eat(quote2)) {
    if (stream.eat(quote2)) tripleQuoted = true;
    else return "string";
  }
  function t(stream2, state2) {
    var escaped = false, next2, end2 = !tripleQuoted;
    while ((next2 = stream2.next()) != null) {
      if (next2 == quote2 && !escaped) {
        if (!tripleQuoted) {
          break;
        }
        if (stream2.match(quote2 + quote2)) {
          end2 = true;
          break;
        }
      }
      if (quote2 == '"' && next2 == "$" && !escaped) {
        if (stream2.eat("{")) {
          state2.tokenize.push(tokenBaseUntilBrace$1());
          return "string";
        } else if (stream2.match(/^\w/, false)) {
          state2.tokenize.push(tokenVariableDeref);
          return "string";
        }
      }
      escaped = !escaped && next2 == "\\";
    }
    if (end2) state2.tokenize.pop();
    return "string";
  }
  state.tokenize.push(t);
  return t(stream, state);
}
function tokenBaseUntilBrace$1() {
  var depth = 1;
  function t(stream, state) {
    if (stream.peek() == "}") {
      depth--;
      if (depth == 0) {
        state.tokenize.pop();
        return state.tokenize[state.tokenize.length - 1](stream, state);
      }
    } else if (stream.peek() == "{") {
      depth++;
    }
    return tokenBase$x(stream, state);
  }
  t.isBase = true;
  return t;
}
function tokenVariableDeref(stream, state) {
  var next2 = stream.match(/^(\.|[\w\$_]+)/);
  if (!next2 || !stream.match(next2[0] == "." ? /^[\w$_]/ : /^\./)) state.tokenize.pop();
  if (!next2) return state.tokenize[state.tokenize.length - 1](stream, state);
  return next2[0] == "." ? null : "variable";
}
function tokenComment$e(stream, state) {
  var maybeEnd = false, ch2;
  while (ch2 = stream.next()) {
    if (ch2 == "/" && maybeEnd) {
      state.tokenize.pop();
      break;
    }
    maybeEnd = ch2 == "*";
  }
  return "comment";
}
function expectExpression(last, newline) {
  return !last || last == "operator" || last == "->" || /[\.\[\{\(,;:]/.test(last) || last == "newstatement" || last == "keyword" || last == "proplabel" || last == "standalone" && !newline;
}
function Context$6(indented, column, type2, align, prev) {
  this.indented = indented;
  this.column = column;
  this.type = type2;
  this.align = align;
  this.prev = prev;
}
function pushContext$9(state, col, type2) {
  return state.context = new Context$6(state.indented, col, type2, null, state.context);
}
function popContext$9(state) {
  var t = state.context.type;
  if (t == ")" || t == "]" || t == "}")
    state.indented = state.context.indented;
  return state.context = state.context.prev;
}
const groovy = {
  name: "groovy",
  startState: function(indentUnit) {
    return {
      tokenize: [tokenBase$x],
      context: new Context$6(-indentUnit, 0, "top", false),
      indented: 0,
      startOfLine: true,
      lastToken: null
    };
  },
  token: function(stream, state) {
    var ctx = state.context;
    if (stream.sol()) {
      if (ctx.align == null) ctx.align = false;
      state.indented = stream.indentation();
      state.startOfLine = true;
      if (ctx.type == "statement" && !expectExpression(state.lastToken, true)) {
        popContext$9(state);
        ctx = state.context;
      }
    }
    if (stream.eatSpace()) return null;
    curPunc$8 = null;
    var style2 = state.tokenize[state.tokenize.length - 1](stream, state);
    if (style2 == "comment") return style2;
    if (ctx.align == null) ctx.align = true;
    if ((curPunc$8 == ";" || curPunc$8 == ":") && ctx.type == "statement") popContext$9(state);
    else if (curPunc$8 == "->" && ctx.type == "statement" && ctx.prev.type == "}") {
      popContext$9(state);
      state.context.align = false;
    } else if (curPunc$8 == "{") pushContext$9(state, stream.column(), "}");
    else if (curPunc$8 == "[") pushContext$9(state, stream.column(), "]");
    else if (curPunc$8 == "(") pushContext$9(state, stream.column(), ")");
    else if (curPunc$8 == "}") {
      while (ctx.type == "statement") ctx = popContext$9(state);
      if (ctx.type == "}") ctx = popContext$9(state);
      while (ctx.type == "statement") ctx = popContext$9(state);
    } else if (curPunc$8 == ctx.type) popContext$9(state);
    else if (ctx.type == "}" || ctx.type == "top" || ctx.type == "statement" && curPunc$8 == "newstatement")
      pushContext$9(state, stream.column(), "statement");
    state.startOfLine = false;
    state.lastToken = curPunc$8 || style2;
    return style2;
  },
  indent: function(state, textAfter, cx2) {
    if (!state.tokenize[state.tokenize.length - 1].isBase) return null;
    var firstChar = textAfter && textAfter.charAt(0), ctx = state.context;
    if (ctx.type == "statement" && !expectExpression(state.lastToken, true)) ctx = ctx.prev;
    var closing2 = firstChar == ctx.type;
    if (ctx.type == "statement") return ctx.indented + (firstChar == "{" ? 0 : cx2.unit);
    else if (ctx.align) return ctx.column + (closing2 ? 0 : 1);
    else return ctx.indented + (closing2 ? 0 : cx2.unit);
  },
  languageData: {
    indentOnInput: /^\s*[{}]$/,
    commentTokens: { line: "//", block: { open: "/*", close: "*/" } },
    closeBrackets: { brackets: ["(", "[", "{", "'", '"', "'''", '"""'] }
  }
};
const groovy$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  groovy
});
function switchState(source, setState, f) {
  setState(f);
  return f(source, setState);
}
var smallRE = /[a-z_]/;
var largeRE = /[A-Z]/;
var digitRE = /\d/;
var hexitRE = /[0-9A-Fa-f]/;
var octitRE = /[0-7]/;
var idRE = /[a-z_A-Z0-9'\xa1-\uffff]/;
var symbolRE = /[-!#$%&*+.\/<=>?@\\^|~:]/;
var specialRE = /[(),;[\]`{}]/;
var whiteCharRE = /[ \t\v\f]/;
function normal$1(source, setState) {
  if (source.eatWhile(whiteCharRE)) {
    return null;
  }
  var ch2 = source.next();
  if (specialRE.test(ch2)) {
    if (ch2 == "{" && source.eat("-")) {
      var t = "comment";
      if (source.eat("#")) {
        t = "meta";
      }
      return switchState(source, setState, ncomment(t, 1));
    }
    return null;
  }
  if (ch2 == "'") {
    if (source.eat("\\")) {
      source.next();
    } else {
      source.next();
    }
    if (source.eat("'")) {
      return "string";
    }
    return "error";
  }
  if (ch2 == '"') {
    return switchState(source, setState, stringLiteral);
  }
  if (largeRE.test(ch2)) {
    source.eatWhile(idRE);
    if (source.eat(".")) {
      return "qualifier";
    }
    return "type";
  }
  if (smallRE.test(ch2)) {
    source.eatWhile(idRE);
    return "variable";
  }
  if (digitRE.test(ch2)) {
    if (ch2 == "0") {
      if (source.eat(/[xX]/)) {
        source.eatWhile(hexitRE);
        return "integer";
      }
      if (source.eat(/[oO]/)) {
        source.eatWhile(octitRE);
        return "number";
      }
    }
    source.eatWhile(digitRE);
    var t = "number";
    if (source.match(/^\.\d+/)) {
      t = "number";
    }
    if (source.eat(/[eE]/)) {
      t = "number";
      source.eat(/[-+]/);
      source.eatWhile(digitRE);
    }
    return t;
  }
  if (ch2 == "." && source.eat("."))
    return "keyword";
  if (symbolRE.test(ch2)) {
    if (ch2 == "-" && source.eat(/-/)) {
      source.eatWhile(/-/);
      if (!source.eat(symbolRE)) {
        source.skipToEnd();
        return "comment";
      }
    }
    source.eatWhile(symbolRE);
    return "variable";
  }
  return "error";
}
function ncomment(type2, nest) {
  if (nest == 0) {
    return normal$1;
  }
  return function(source, setState) {
    var currNest = nest;
    while (!source.eol()) {
      var ch2 = source.next();
      if (ch2 == "{" && source.eat("-")) {
        ++currNest;
      } else if (ch2 == "-" && source.eat("}")) {
        --currNest;
        if (currNest == 0) {
          setState(normal$1);
          return type2;
        }
      }
    }
    setState(ncomment(type2, currNest));
    return type2;
  };
}
function stringLiteral(source, setState) {
  while (!source.eol()) {
    var ch2 = source.next();
    if (ch2 == '"') {
      setState(normal$1);
      return "string";
    }
    if (ch2 == "\\") {
      if (source.eol() || source.eat(whiteCharRE)) {
        setState(stringGap);
        return "string";
      }
      if (source.eat("&")) ;
      else {
        source.next();
      }
    }
  }
  setState(normal$1);
  return "error";
}
function stringGap(source, setState) {
  if (source.eat("\\")) {
    return switchState(source, setState, stringLiteral);
  }
  source.next();
  setState(normal$1);
  return "error";
}
var wellKnownWords = (function() {
  var wkw = {};
  function setType(t) {
    return function() {
      for (var i2 = 0; i2 < arguments.length; i2++)
        wkw[arguments[i2]] = t;
    };
  }
  setType("keyword")(
    "case",
    "class",
    "data",
    "default",
    "deriving",
    "do",
    "else",
    "foreign",
    "if",
    "import",
    "in",
    "infix",
    "infixl",
    "infixr",
    "instance",
    "let",
    "module",
    "newtype",
    "of",
    "then",
    "type",
    "where",
    "_"
  );
  setType("keyword")(
    "..",
    ":",
    "::",
    "=",
    "\\",
    "<-",
    "->",
    "@",
    "~",
    "=>"
  );
  setType("builtin")(
    "!!",
    "$!",
    "$",
    "&&",
    "+",
    "++",
    "-",
    ".",
    "/",
    "/=",
    "<",
    "<*",
    "<=",
    "<$>",
    "<*>",
    "=<<",
    "==",
    ">",
    ">=",
    ">>",
    ">>=",
    "^",
    "^^",
    "||",
    "*",
    "*>",
    "**"
  );
  setType("builtin")(
    "Applicative",
    "Bool",
    "Bounded",
    "Char",
    "Double",
    "EQ",
    "Either",
    "Enum",
    "Eq",
    "False",
    "FilePath",
    "Float",
    "Floating",
    "Fractional",
    "Functor",
    "GT",
    "IO",
    "IOError",
    "Int",
    "Integer",
    "Integral",
    "Just",
    "LT",
    "Left",
    "Maybe",
    "Monad",
    "Nothing",
    "Num",
    "Ord",
    "Ordering",
    "Rational",
    "Read",
    "ReadS",
    "Real",
    "RealFloat",
    "RealFrac",
    "Right",
    "Show",
    "ShowS",
    "String",
    "True"
  );
  setType("builtin")(
    "abs",
    "acos",
    "acosh",
    "all",
    "and",
    "any",
    "appendFile",
    "asTypeOf",
    "asin",
    "asinh",
    "atan",
    "atan2",
    "atanh",
    "break",
    "catch",
    "ceiling",
    "compare",
    "concat",
    "concatMap",
    "const",
    "cos",
    "cosh",
    "curry",
    "cycle",
    "decodeFloat",
    "div",
    "divMod",
    "drop",
    "dropWhile",
    "either",
    "elem",
    "encodeFloat",
    "enumFrom",
    "enumFromThen",
    "enumFromThenTo",
    "enumFromTo",
    "error",
    "even",
    "exp",
    "exponent",
    "fail",
    "filter",
    "flip",
    "floatDigits",
    "floatRadix",
    "floatRange",
    "floor",
    "fmap",
    "foldl",
    "foldl1",
    "foldr",
    "foldr1",
    "fromEnum",
    "fromInteger",
    "fromIntegral",
    "fromRational",
    "fst",
    "gcd",
    "getChar",
    "getContents",
    "getLine",
    "head",
    "id",
    "init",
    "interact",
    "ioError",
    "isDenormalized",
    "isIEEE",
    "isInfinite",
    "isNaN",
    "isNegativeZero",
    "iterate",
    "last",
    "lcm",
    "length",
    "lex",
    "lines",
    "log",
    "logBase",
    "lookup",
    "map",
    "mapM",
    "mapM_",
    "max",
    "maxBound",
    "maximum",
    "maybe",
    "min",
    "minBound",
    "minimum",
    "mod",
    "negate",
    "not",
    "notElem",
    "null",
    "odd",
    "or",
    "otherwise",
    "pi",
    "pred",
    "print",
    "product",
    "properFraction",
    "pure",
    "putChar",
    "putStr",
    "putStrLn",
    "quot",
    "quotRem",
    "read",
    "readFile",
    "readIO",
    "readList",
    "readLn",
    "readParen",
    "reads",
    "readsPrec",
    "realToFrac",
    "recip",
    "rem",
    "repeat",
    "replicate",
    "return",
    "reverse",
    "round",
    "scaleFloat",
    "scanl",
    "scanl1",
    "scanr",
    "scanr1",
    "seq",
    "sequence",
    "sequence_",
    "show",
    "showChar",
    "showList",
    "showParen",
    "showString",
    "shows",
    "showsPrec",
    "significand",
    "signum",
    "sin",
    "sinh",
    "snd",
    "span",
    "splitAt",
    "sqrt",
    "subtract",
    "succ",
    "sum",
    "tail",
    "take",
    "takeWhile",
    "tan",
    "tanh",
    "toEnum",
    "toInteger",
    "toRational",
    "truncate",
    "uncurry",
    "undefined",
    "unlines",
    "until",
    "unwords",
    "unzip",
    "unzip3",
    "userError",
    "words",
    "writeFile",
    "zip",
    "zip3",
    "zipWith",
    "zipWith3"
  );
  return wkw;
})();
const haskell = {
  name: "haskell",
  startState: function() {
    return { f: normal$1 };
  },
  copyState: function(s) {
    return { f: s.f };
  },
  token: function(stream, state) {
    var t = state.f(stream, function(s) {
      state.f = s;
    });
    var w = stream.current();
    return wellKnownWords.hasOwnProperty(w) ? wellKnownWords[w] : t;
  },
  languageData: {
    commentTokens: { line: "--", block: { open: "{-", close: "-}" } }
  }
};
const haskell$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  haskell
});
function kw(type2) {
  return { type: type2, style: "keyword" };
}
var A = kw("keyword a"), B = kw("keyword b"), C = kw("keyword c");
var operator = kw("operator"), atom = { type: "atom", style: "atom" }, attribute$1 = { type: "attribute", style: "attribute" };
var type$3 = kw("typedef");
var keywords$t = {
  "if": A,
  "while": A,
  "else": B,
  "do": B,
  "try": B,
  "return": C,
  "break": C,
  "continue": C,
  "new": C,
  "throw": C,
  "var": kw("var"),
  "inline": attribute$1,
  "static": attribute$1,
  "using": kw("import"),
  "public": attribute$1,
  "private": attribute$1,
  "cast": kw("cast"),
  "import": kw("import"),
  "macro": kw("macro"),
  "function": kw("function"),
  "catch": kw("catch"),
  "untyped": kw("untyped"),
  "callback": kw("cb"),
  "for": kw("for"),
  "switch": kw("switch"),
  "case": kw("case"),
  "default": kw("default"),
  "in": operator,
  "never": kw("property_access"),
  "trace": kw("trace"),
  "class": type$3,
  "abstract": type$3,
  "enum": type$3,
  "interface": type$3,
  "typedef": type$3,
  "extends": type$3,
  "implements": type$3,
  "dynamic": type$3,
  "true": atom,
  "false": atom,
  "null": atom
};
var isOperatorChar$9 = /[+\-*&%=<>!?|]/;
function chain$7(stream, state, f) {
  state.tokenize = f;
  return f(stream, state);
}
function toUnescaped(stream, end2) {
  var escaped = false, next2;
  while ((next2 = stream.next()) != null) {
    if (next2 == end2 && !escaped)
      return true;
    escaped = !escaped && next2 == "\\";
  }
}
var type$3, content;
function ret$1(tp, style2, cont2) {
  type$3 = tp;
  content = cont2;
  return style2;
}
function haxeTokenBase(stream, state) {
  var ch2 = stream.next();
  if (ch2 == '"' || ch2 == "'") {
    return chain$7(stream, state, haxeTokenString(ch2));
  } else if (/[\[\]{}\(\),;\:\.]/.test(ch2)) {
    return ret$1(ch2);
  } else if (ch2 == "0" && stream.eat(/x/i)) {
    stream.eatWhile(/[\da-f]/i);
    return ret$1("number", "number");
  } else if (/\d/.test(ch2) || ch2 == "-" && stream.eat(/\d/)) {
    stream.match(/^\d*(?:\.\d*(?!\.))?(?:[eE][+\-]?\d+)?/);
    return ret$1("number", "number");
  } else if (state.reAllowed && (ch2 == "~" && stream.eat(/\//))) {
    toUnescaped(stream, "/");
    stream.eatWhile(/[gimsu]/);
    return ret$1("regexp", "string.special");
  } else if (ch2 == "/") {
    if (stream.eat("*")) {
      return chain$7(stream, state, haxeTokenComment);
    } else if (stream.eat("/")) {
      stream.skipToEnd();
      return ret$1("comment", "comment");
    } else {
      stream.eatWhile(isOperatorChar$9);
      return ret$1("operator", null, stream.current());
    }
  } else if (ch2 == "#") {
    stream.skipToEnd();
    return ret$1("conditional", "meta");
  } else if (ch2 == "@") {
    stream.eat(/:/);
    stream.eatWhile(/[\w_]/);
    return ret$1("metadata", "meta");
  } else if (isOperatorChar$9.test(ch2)) {
    stream.eatWhile(isOperatorChar$9);
    return ret$1("operator", null, stream.current());
  } else {
    var word;
    if (/[A-Z]/.test(ch2)) {
      stream.eatWhile(/[\w_<>]/);
      word = stream.current();
      return ret$1("type", "type", word);
    } else {
      stream.eatWhile(/[\w_]/);
      var word = stream.current(), known = keywords$t.propertyIsEnumerable(word) && keywords$t[word];
      return known && state.kwAllowed ? ret$1(known.type, known.style, word) : ret$1("variable", "variable", word);
    }
  }
}
function haxeTokenString(quote2) {
  return function(stream, state) {
    if (toUnescaped(stream, quote2))
      state.tokenize = haxeTokenBase;
    return ret$1("string", "string");
  };
}
function haxeTokenComment(stream, state) {
  var maybeEnd = false, ch2;
  while (ch2 = stream.next()) {
    if (ch2 == "/" && maybeEnd) {
      state.tokenize = haxeTokenBase;
      break;
    }
    maybeEnd = ch2 == "*";
  }
  return ret$1("comment", "comment");
}
var atomicTypes = { "atom": true, "number": true, "variable": true, "string": true, "regexp": true };
function HaxeLexical(indented, column, type2, align, prev, info) {
  this.indented = indented;
  this.column = column;
  this.type = type2;
  this.prev = prev;
  this.info = info;
  if (align != null) this.align = align;
}
function inScope(state, varname) {
  for (var v = state.localVars; v; v = v.next)
    if (v.name == varname) return true;
}
function parseHaxe(state, style2, type2, content2, stream) {
  var cc = state.cc;
  cx.state = state;
  cx.stream = stream;
  cx.marked = null, cx.cc = cc;
  if (!state.lexical.hasOwnProperty("align"))
    state.lexical.align = true;
  while (true) {
    var combinator = cc.length ? cc.pop() : statement;
    if (combinator(type2, content2)) {
      while (cc.length && cc[cc.length - 1].lex)
        cc.pop()();
      if (cx.marked) return cx.marked;
      if (type2 == "variable" && inScope(state, content2)) return "variableName.local";
      if (type2 == "variable" && imported(state, content2)) return "variableName.special";
      return style2;
    }
  }
}
function imported(state, typename) {
  if (/[a-z]/.test(typename.charAt(0)))
    return false;
  var len2 = state.importedtypes.length;
  for (var i2 = 0; i2 < len2; i2++)
    if (state.importedtypes[i2] == typename) return true;
}
function registerimport(importname) {
  var state = cx.state;
  for (var t = state.importedtypes; t; t = t.next)
    if (t.name == importname) return;
  state.importedtypes = { name: importname, next: state.importedtypes };
}
var cx = { state: null, marked: null, cc: null };
function pass$2() {
  for (var i2 = arguments.length - 1; i2 >= 0; i2--) cx.cc.push(arguments[i2]);
}
function cont$1() {
  pass$2.apply(null, arguments);
  return true;
}
function inList(name, list) {
  for (var v = list; v; v = v.next)
    if (v.name == name) return true;
  return false;
}
function register(varname) {
  var state = cx.state;
  if (state.context) {
    cx.marked = "def";
    if (inList(varname, state.localVars)) return;
    state.localVars = { name: varname, next: state.localVars };
  } else if (state.globalVars) {
    if (inList(varname, state.globalVars)) return;
    state.globalVars = { name: varname, next: state.globalVars };
  }
}
var defaultVars = { name: "this", next: null };
function pushcontext() {
  if (!cx.state.context) cx.state.localVars = defaultVars;
  cx.state.context = { prev: cx.state.context, vars: cx.state.localVars };
}
function popcontext() {
  cx.state.localVars = cx.state.context.vars;
  cx.state.context = cx.state.context.prev;
}
popcontext.lex = true;
function pushlex(type2, info) {
  var result = function() {
    var state = cx.state;
    state.lexical = new HaxeLexical(state.indented, cx.stream.column(), type2, null, state.lexical, info);
  };
  result.lex = true;
  return result;
}
function poplex() {
  var state = cx.state;
  if (state.lexical.prev) {
    if (state.lexical.type == ")")
      state.indented = state.lexical.indented;
    state.lexical = state.lexical.prev;
  }
}
poplex.lex = true;
function expect(wanted) {
  function f(type2) {
    if (type2 == wanted) return cont$1();
    else if (wanted == ";") return pass$2();
    else return cont$1(f);
  }
  return f;
}
function statement(type2) {
  if (type2 == "@") return cont$1(metadef);
  if (type2 == "var") return cont$1(pushlex("vardef"), vardef1, expect(";"), poplex);
  if (type2 == "keyword a") return cont$1(pushlex("form"), expression, statement, poplex);
  if (type2 == "keyword b") return cont$1(pushlex("form"), statement, poplex);
  if (type2 == "{") return cont$1(pushlex("}"), pushcontext, block$1, poplex, popcontext);
  if (type2 == ";") return cont$1();
  if (type2 == "attribute") return cont$1(maybeattribute);
  if (type2 == "function") return cont$1(functiondef);
  if (type2 == "for") return cont$1(
    pushlex("form"),
    expect("("),
    pushlex(")"),
    forspec1,
    expect(")"),
    poplex,
    statement,
    poplex
  );
  if (type2 == "variable") return cont$1(pushlex("stat"), maybelabel);
  if (type2 == "switch") return cont$1(
    pushlex("form"),
    expression,
    pushlex("}", "switch"),
    expect("{"),
    block$1,
    poplex,
    poplex
  );
  if (type2 == "case") return cont$1(expression, expect(":"));
  if (type2 == "default") return cont$1(expect(":"));
  if (type2 == "catch") return cont$1(
    pushlex("form"),
    pushcontext,
    expect("("),
    funarg,
    expect(")"),
    statement,
    poplex,
    popcontext
  );
  if (type2 == "import") return cont$1(importdef, expect(";"));
  if (type2 == "typedef") return cont$1(typedef);
  return pass$2(pushlex("stat"), expression, expect(";"), poplex);
}
function expression(type2) {
  if (atomicTypes.hasOwnProperty(type2)) return cont$1(maybeoperator);
  if (type2 == "type") return cont$1(maybeoperator);
  if (type2 == "function") return cont$1(functiondef);
  if (type2 == "keyword c") return cont$1(maybeexpression);
  if (type2 == "(") return cont$1(pushlex(")"), maybeexpression, expect(")"), poplex, maybeoperator);
  if (type2 == "operator") return cont$1(expression);
  if (type2 == "[") return cont$1(pushlex("]"), commasep(maybeexpression, "]"), poplex, maybeoperator);
  if (type2 == "{") return cont$1(pushlex("}"), commasep(objprop, "}"), poplex, maybeoperator);
  return cont$1();
}
function maybeexpression(type2) {
  if (type2.match(/[;\}\)\],]/)) return pass$2();
  return pass$2(expression);
}
function maybeoperator(type2, value) {
  if (type2 == "operator" && /\+\+|--/.test(value)) return cont$1(maybeoperator);
  if (type2 == "operator" || type2 == ":") return cont$1(expression);
  if (type2 == ";") return;
  if (type2 == "(") return cont$1(pushlex(")"), commasep(expression, ")"), poplex, maybeoperator);
  if (type2 == ".") return cont$1(property$1, maybeoperator);
  if (type2 == "[") return cont$1(pushlex("]"), expression, expect("]"), poplex, maybeoperator);
}
function maybeattribute(type2) {
  if (type2 == "attribute") return cont$1(maybeattribute);
  if (type2 == "function") return cont$1(functiondef);
  if (type2 == "var") return cont$1(vardef1);
}
function metadef(type2) {
  if (type2 == ":") return cont$1(metadef);
  if (type2 == "variable") return cont$1(metadef);
  if (type2 == "(") return cont$1(pushlex(")"), commasep(metaargs, ")"), poplex, statement);
}
function metaargs(type2) {
  if (type2 == "variable") return cont$1();
}
function importdef(type2, value) {
  if (type2 == "variable" && /[A-Z]/.test(value.charAt(0))) {
    registerimport(value);
    return cont$1();
  } else if (type2 == "variable" || type2 == "property" || type2 == "." || value == "*") return cont$1(importdef);
}
function typedef(type2, value) {
  if (type2 == "variable" && /[A-Z]/.test(value.charAt(0))) {
    registerimport(value);
    return cont$1();
  } else if (type2 == "type" && /[A-Z]/.test(value.charAt(0))) {
    return cont$1();
  }
}
function maybelabel(type2) {
  if (type2 == ":") return cont$1(poplex, statement);
  return pass$2(maybeoperator, expect(";"), poplex);
}
function property$1(type2) {
  if (type2 == "variable") {
    cx.marked = "property";
    return cont$1();
  }
}
function objprop(type2) {
  if (type2 == "variable") cx.marked = "property";
  if (atomicTypes.hasOwnProperty(type2)) return cont$1(expect(":"), expression);
}
function commasep(what, end2) {
  function proceed(type2) {
    if (type2 == ",") return cont$1(what, proceed);
    if (type2 == end2) return cont$1();
    return cont$1(expect(end2));
  }
  return function(type2) {
    if (type2 == end2) return cont$1();
    else return pass$2(what, proceed);
  };
}
function block$1(type2) {
  if (type2 == "}") return cont$1();
  return pass$2(statement, block$1);
}
function vardef1(type2, value) {
  if (type2 == "variable") {
    register(value);
    return cont$1(typeuse, vardef2);
  }
  return cont$1();
}
function vardef2(type2, value) {
  if (value == "=") return cont$1(expression, vardef2);
  if (type2 == ",") return cont$1(vardef1);
}
function forspec1(type2, value) {
  if (type2 == "variable") {
    register(value);
    return cont$1(forin, expression);
  } else {
    return pass$2();
  }
}
function forin(_type, value) {
  if (value == "in") return cont$1();
}
function functiondef(type2, value) {
  if (type2 == "variable" || type2 == "type") {
    register(value);
    return cont$1(functiondef);
  }
  if (value == "new") return cont$1(functiondef);
  if (type2 == "(") return cont$1(pushlex(")"), pushcontext, commasep(funarg, ")"), poplex, typeuse, statement, popcontext);
}
function typeuse(type2) {
  if (type2 == ":") return cont$1(typestring);
}
function typestring(type2) {
  if (type2 == "type") return cont$1();
  if (type2 == "variable") return cont$1();
  if (type2 == "{") return cont$1(pushlex("}"), commasep(typeprop, "}"), poplex);
}
function typeprop(type2) {
  if (type2 == "variable") return cont$1(typeuse);
}
function funarg(type2, value) {
  if (type2 == "variable") {
    register(value);
    return cont$1(typeuse);
  }
}
const haxe = {
  name: "haxe",
  startState: function(indentUnit) {
    var defaulttypes = ["Int", "Float", "String", "Void", "Std", "Bool", "Dynamic", "Array"];
    var state = {
      tokenize: haxeTokenBase,
      reAllowed: true,
      kwAllowed: true,
      cc: [],
      lexical: new HaxeLexical(-indentUnit, 0, "block", false),
      importedtypes: defaulttypes,
      context: null,
      indented: 0
    };
    return state;
  },
  token: function(stream, state) {
    if (stream.sol()) {
      if (!state.lexical.hasOwnProperty("align"))
        state.lexical.align = false;
      state.indented = stream.indentation();
    }
    if (stream.eatSpace()) return null;
    var style2 = state.tokenize(stream, state);
    if (type$3 == "comment") return style2;
    state.reAllowed = !!(type$3 == "operator" || type$3 == "keyword c" || type$3.match(/^[\[{}\(,;:]$/));
    state.kwAllowed = type$3 != ".";
    return parseHaxe(state, style2, type$3, content, stream);
  },
  indent: function(state, textAfter, cx2) {
    if (state.tokenize != haxeTokenBase) return 0;
    var firstChar = textAfter && textAfter.charAt(0), lexical = state.lexical;
    if (lexical.type == "stat" && firstChar == "}") lexical = lexical.prev;
    var type2 = lexical.type, closing2 = firstChar == type2;
    if (type2 == "vardef") return lexical.indented + 4;
    else if (type2 == "form" && firstChar == "{") return lexical.indented;
    else if (type2 == "stat" || type2 == "form") return lexical.indented + cx2.unit;
    else if (lexical.info == "switch" && !closing2)
      return lexical.indented + (/^(?:case|default)\b/.test(textAfter) ? cx2.unit : 2 * cx2.unit);
    else if (lexical.align) return lexical.column + (closing2 ? 0 : 1);
    else return lexical.indented + (closing2 ? 0 : cx2.unit);
  },
  languageData: {
    indentOnInput: /^\s*[{}]$/,
    commentTokens: { line: "//", block: { open: "/*", close: "*/" } }
  }
};
const hxml = {
  name: "hxml",
  startState: function() {
    return {
      define: false,
      inString: false
    };
  },
  token: function(stream, state) {
    var ch2 = stream.peek();
    var sol = stream.sol();
    if (ch2 == "#") {
      stream.skipToEnd();
      return "comment";
    }
    if (sol && ch2 == "-") {
      var style2 = "variable-2";
      stream.eat(/-/);
      if (stream.peek() == "-") {
        stream.eat(/-/);
        style2 = "keyword a";
      }
      if (stream.peek() == "D") {
        stream.eat(/[D]/);
        style2 = "keyword c";
        state.define = true;
      }
      stream.eatWhile(/[A-Z]/i);
      return style2;
    }
    var ch2 = stream.peek();
    if (state.inString == false && ch2 == "'") {
      state.inString = true;
      stream.next();
    }
    if (state.inString == true) {
      if (stream.skipTo("'")) ;
      else {
        stream.skipToEnd();
      }
      if (stream.peek() == "'") {
        stream.next();
        state.inString = false;
      }
      return "string";
    }
    stream.next();
    return null;
  },
  languageData: {
    commentTokens: { line: "#" }
  }
};
const haxe$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  haxe,
  hxml
});
function failFirstLine(stream, state) {
  stream.skipToEnd();
  state.cur = header$1;
  return "error";
}
function start(stream, state) {
  if (stream.match(/^HTTP\/\d\.\d/)) {
    state.cur = responseStatusCode;
    return "keyword";
  } else if (stream.match(/^[A-Z]+/) && /[ \t]/.test(stream.peek())) {
    state.cur = requestPath;
    return "keyword";
  } else {
    return failFirstLine(stream, state);
  }
}
function responseStatusCode(stream, state) {
  var code2 = stream.match(/^\d+/);
  if (!code2) return failFirstLine(stream, state);
  state.cur = responseStatusText;
  var status = Number(code2[0]);
  if (status >= 100 && status < 400) {
    return "atom";
  } else {
    return "error";
  }
}
function responseStatusText(stream, state) {
  stream.skipToEnd();
  state.cur = header$1;
  return null;
}
function requestPath(stream, state) {
  stream.eatWhile(/\S/);
  state.cur = requestProtocol;
  return "string.special";
}
function requestProtocol(stream, state) {
  if (stream.match(/^HTTP\/\d\.\d$/)) {
    state.cur = header$1;
    return "keyword";
  } else {
    return failFirstLine(stream, state);
  }
}
function header$1(stream) {
  if (stream.sol() && !stream.eat(/[ \t]/)) {
    if (stream.match(/^.*?:/)) {
      return "atom";
    } else {
      stream.skipToEnd();
      return "error";
    }
  } else {
    stream.skipToEnd();
    return "string";
  }
}
function body(stream) {
  stream.skipToEnd();
  return null;
}
const http = {
  name: "http",
  token: function(stream, state) {
    var cur = state.cur;
    if (cur != header$1 && cur != body && stream.eatSpace()) return null;
    return cur(stream, state);
  },
  blankLine: function(state) {
    state.cur = body;
  },
  startState: function() {
    return { cur: start };
  }
};
const http$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  http
});
function wordRegexp$b(words2) {
  return new RegExp("^((" + words2.join(")|(") + "))\\b", "i");
}
var builtinArray$1 = [
  "a_correlate",
  "abs",
  "acos",
  "adapt_hist_equal",
  "alog",
  "alog2",
  "alog10",
  "amoeba",
  "annotate",
  "app_user_dir",
  "app_user_dir_query",
  "arg_present",
  "array_equal",
  "array_indices",
  "arrow",
  "ascii_template",
  "asin",
  "assoc",
  "atan",
  "axis",
  "axis",
  "bandpass_filter",
  "bandreject_filter",
  "barplot",
  "bar_plot",
  "beseli",
  "beselj",
  "beselk",
  "besely",
  "beta",
  "biginteger",
  "bilinear",
  "bin_date",
  "binary_template",
  "bindgen",
  "binomial",
  "bit_ffs",
  "bit_population",
  "blas_axpy",
  "blk_con",
  "boolarr",
  "boolean",
  "boxplot",
  "box_cursor",
  "breakpoint",
  "broyden",
  "bubbleplot",
  "butterworth",
  "bytarr",
  "byte",
  "byteorder",
  "bytscl",
  "c_correlate",
  "calendar",
  "caldat",
  "call_external",
  "call_function",
  "call_method",
  "call_procedure",
  "canny",
  "catch",
  "cd",
  "cdf",
  "ceil",
  "chebyshev",
  "check_math",
  "chisqr_cvf",
  "chisqr_pdf",
  "choldc",
  "cholsol",
  "cindgen",
  "cir_3pnt",
  "clipboard",
  "close",
  "clust_wts",
  "cluster",
  "cluster_tree",
  "cmyk_convert",
  "code_coverage",
  "color_convert",
  "color_exchange",
  "color_quan",
  "color_range_map",
  "colorbar",
  "colorize_sample",
  "colormap_applicable",
  "colormap_gradient",
  "colormap_rotation",
  "colortable",
  "comfit",
  "command_line_args",
  "common",
  "compile_opt",
  "complex",
  "complexarr",
  "complexround",
  "compute_mesh_normals",
  "cond",
  "congrid",
  "conj",
  "constrained_min",
  "contour",
  "contour",
  "convert_coord",
  "convol",
  "convol_fft",
  "coord2to3",
  "copy_lun",
  "correlate",
  "cos",
  "cosh",
  "cpu",
  "cramer",
  "createboxplotdata",
  "create_cursor",
  "create_struct",
  "create_view",
  "crossp",
  "crvlength",
  "ct_luminance",
  "cti_test",
  "cursor",
  "curvefit",
  "cv_coord",
  "cvttobm",
  "cw_animate",
  "cw_animate_getp",
  "cw_animate_load",
  "cw_animate_run",
  "cw_arcball",
  "cw_bgroup",
  "cw_clr_index",
  "cw_colorsel",
  "cw_defroi",
  "cw_field",
  "cw_filesel",
  "cw_form",
  "cw_fslider",
  "cw_light_editor",
  "cw_light_editor_get",
  "cw_light_editor_set",
  "cw_orient",
  "cw_palette_editor",
  "cw_palette_editor_get",
  "cw_palette_editor_set",
  "cw_pdmenu",
  "cw_rgbslider",
  "cw_tmpl",
  "cw_zoom",
  "db_exists",
  "dblarr",
  "dcindgen",
  "dcomplex",
  "dcomplexarr",
  "define_key",
  "define_msgblk",
  "define_msgblk_from_file",
  "defroi",
  "defsysv",
  "delvar",
  "dendro_plot",
  "dendrogram",
  "deriv",
  "derivsig",
  "determ",
  "device",
  "dfpmin",
  "diag_matrix",
  "dialog_dbconnect",
  "dialog_message",
  "dialog_pickfile",
  "dialog_printersetup",
  "dialog_printjob",
  "dialog_read_image",
  "dialog_write_image",
  "dictionary",
  "digital_filter",
  "dilate",
  "dindgen",
  "dissolve",
  "dist",
  "distance_measure",
  "dlm_load",
  "dlm_register",
  "doc_library",
  "double",
  "draw_roi",
  "edge_dog",
  "efont",
  "eigenql",
  "eigenvec",
  "ellipse",
  "elmhes",
  "emboss",
  "empty",
  "enable_sysrtn",
  "eof",
  "eos",
  "erase",
  "erf",
  "erfc",
  "erfcx",
  "erode",
  "errorplot",
  "errplot",
  "estimator_filter",
  "execute",
  "exit",
  "exp",
  "expand",
  "expand_path",
  "expint",
  "extract",
  "extract_slice",
  "f_cvf",
  "f_pdf",
  "factorial",
  "fft",
  "file_basename",
  "file_chmod",
  "file_copy",
  "file_delete",
  "file_dirname",
  "file_expand_path",
  "file_gunzip",
  "file_gzip",
  "file_info",
  "file_lines",
  "file_link",
  "file_mkdir",
  "file_move",
  "file_poll_input",
  "file_readlink",
  "file_same",
  "file_search",
  "file_tar",
  "file_test",
  "file_untar",
  "file_unzip",
  "file_which",
  "file_zip",
  "filepath",
  "findgen",
  "finite",
  "fix",
  "flick",
  "float",
  "floor",
  "flow3",
  "fltarr",
  "flush",
  "format_axis_values",
  "forward_function",
  "free_lun",
  "fstat",
  "fulstr",
  "funct",
  "function",
  "fv_test",
  "fx_root",
  "fz_roots",
  "gamma",
  "gamma_ct",
  "gauss_cvf",
  "gauss_pdf",
  "gauss_smooth",
  "gauss2dfit",
  "gaussfit",
  "gaussian_function",
  "gaussint",
  "get_drive_list",
  "get_dxf_objects",
  "get_kbrd",
  "get_login_info",
  "get_lun",
  "get_screen_size",
  "getenv",
  "getwindows",
  "greg2jul",
  "grib",
  "grid_input",
  "grid_tps",
  "grid3",
  "griddata",
  "gs_iter",
  "h_eq_ct",
  "h_eq_int",
  "hanning",
  "hash",
  "hdf",
  "hdf5",
  "heap_free",
  "heap_gc",
  "heap_nosave",
  "heap_refcount",
  "heap_save",
  "help",
  "hilbert",
  "hist_2d",
  "hist_equal",
  "histogram",
  "hls",
  "hough",
  "hqr",
  "hsv",
  "i18n_multibytetoutf8",
  "i18n_multibytetowidechar",
  "i18n_utf8tomultibyte",
  "i18n_widechartomultibyte",
  "ibeta",
  "icontour",
  "iconvertcoord",
  "idelete",
  "identity",
  "idl_base64",
  "idl_container",
  "idl_validname",
  "idlexbr_assistant",
  "idlitsys_createtool",
  "idlunit",
  "iellipse",
  "igamma",
  "igetcurrent",
  "igetdata",
  "igetid",
  "igetproperty",
  "iimage",
  "image",
  "image_cont",
  "image_statistics",
  "image_threshold",
  "imaginary",
  "imap",
  "indgen",
  "int_2d",
  "int_3d",
  "int_tabulated",
  "intarr",
  "interpol",
  "interpolate",
  "interval_volume",
  "invert",
  "ioctl",
  "iopen",
  "ir_filter",
  "iplot",
  "ipolygon",
  "ipolyline",
  "iputdata",
  "iregister",
  "ireset",
  "iresolve",
  "irotate",
  "isa",
  "isave",
  "iscale",
  "isetcurrent",
  "isetproperty",
  "ishft",
  "isocontour",
  "isosurface",
  "isurface",
  "itext",
  "itranslate",
  "ivector",
  "ivolume",
  "izoom",
  "journal",
  "json_parse",
  "json_serialize",
  "jul2greg",
  "julday",
  "keyword_set",
  "krig2d",
  "kurtosis",
  "kw_test",
  "l64indgen",
  "la_choldc",
  "la_cholmprove",
  "la_cholsol",
  "la_determ",
  "la_eigenproblem",
  "la_eigenql",
  "la_eigenvec",
  "la_elmhes",
  "la_gm_linear_model",
  "la_hqr",
  "la_invert",
  "la_least_square_equality",
  "la_least_squares",
  "la_linear_equation",
  "la_ludc",
  "la_lumprove",
  "la_lusol",
  "la_svd",
  "la_tridc",
  "la_trimprove",
  "la_triql",
  "la_trired",
  "la_trisol",
  "label_date",
  "label_region",
  "ladfit",
  "laguerre",
  "lambda",
  "lambdap",
  "lambertw",
  "laplacian",
  "least_squares_filter",
  "leefilt",
  "legend",
  "legendre",
  "linbcg",
  "lindgen",
  "linfit",
  "linkimage",
  "list",
  "ll_arc_distance",
  "lmfit",
  "lmgr",
  "lngamma",
  "lnp_test",
  "loadct",
  "locale_get",
  "logical_and",
  "logical_or",
  "logical_true",
  "lon64arr",
  "lonarr",
  "long",
  "long64",
  "lsode",
  "lu_complex",
  "ludc",
  "lumprove",
  "lusol",
  "m_correlate",
  "machar",
  "make_array",
  "make_dll",
  "make_rt",
  "map",
  "mapcontinents",
  "mapgrid",
  "map_2points",
  "map_continents",
  "map_grid",
  "map_image",
  "map_patch",
  "map_proj_forward",
  "map_proj_image",
  "map_proj_info",
  "map_proj_init",
  "map_proj_inverse",
  "map_set",
  "matrix_multiply",
  "matrix_power",
  "max",
  "md_test",
  "mean",
  "meanabsdev",
  "mean_filter",
  "median",
  "memory",
  "mesh_clip",
  "mesh_decimate",
  "mesh_issolid",
  "mesh_merge",
  "mesh_numtriangles",
  "mesh_obj",
  "mesh_smooth",
  "mesh_surfacearea",
  "mesh_validate",
  "mesh_volume",
  "message",
  "min",
  "min_curve_surf",
  "mk_html_help",
  "modifyct",
  "moment",
  "morph_close",
  "morph_distance",
  "morph_gradient",
  "morph_hitormiss",
  "morph_open",
  "morph_thin",
  "morph_tophat",
  "multi",
  "n_elements",
  "n_params",
  "n_tags",
  "ncdf",
  "newton",
  "noise_hurl",
  "noise_pick",
  "noise_scatter",
  "noise_slur",
  "norm",
  "obj_class",
  "obj_destroy",
  "obj_hasmethod",
  "obj_isa",
  "obj_new",
  "obj_valid",
  "objarr",
  "on_error",
  "on_ioerror",
  "online_help",
  "openr",
  "openu",
  "openw",
  "oplot",
  "oploterr",
  "orderedhash",
  "p_correlate",
  "parse_url",
  "particle_trace",
  "path_cache",
  "path_sep",
  "pcomp",
  "plot",
  "plot3d",
  "plot",
  "plot_3dbox",
  "plot_field",
  "ploterr",
  "plots",
  "polar_contour",
  "polar_surface",
  "polyfill",
  "polyshade",
  "pnt_line",
  "point_lun",
  "polarplot",
  "poly",
  "poly_2d",
  "poly_area",
  "poly_fit",
  "polyfillv",
  "polygon",
  "polyline",
  "polywarp",
  "popd",
  "powell",
  "pref_commit",
  "pref_get",
  "pref_set",
  "prewitt",
  "primes",
  "print",
  "printf",
  "printd",
  "pro",
  "product",
  "profile",
  "profiler",
  "profiles",
  "project_vol",
  "ps_show_fonts",
  "psafm",
  "pseudo",
  "ptr_free",
  "ptr_new",
  "ptr_valid",
  "ptrarr",
  "pushd",
  "qgrid3",
  "qhull",
  "qromb",
  "qromo",
  "qsimp",
  "query_*",
  "query_ascii",
  "query_bmp",
  "query_csv",
  "query_dicom",
  "query_gif",
  "query_image",
  "query_jpeg",
  "query_jpeg2000",
  "query_mrsid",
  "query_pict",
  "query_png",
  "query_ppm",
  "query_srf",
  "query_tiff",
  "query_video",
  "query_wav",
  "r_correlate",
  "r_test",
  "radon",
  "randomn",
  "randomu",
  "ranks",
  "rdpix",
  "read",
  "readf",
  "read_ascii",
  "read_binary",
  "read_bmp",
  "read_csv",
  "read_dicom",
  "read_gif",
  "read_image",
  "read_interfile",
  "read_jpeg",
  "read_jpeg2000",
  "read_mrsid",
  "read_pict",
  "read_png",
  "read_ppm",
  "read_spr",
  "read_srf",
  "read_sylk",
  "read_tiff",
  "read_video",
  "read_wav",
  "read_wave",
  "read_x11_bitmap",
  "read_xwd",
  "reads",
  "readu",
  "real_part",
  "rebin",
  "recall_commands",
  "recon3",
  "reduce_colors",
  "reform",
  "region_grow",
  "register_cursor",
  "regress",
  "replicate",
  "replicate_inplace",
  "resolve_all",
  "resolve_routine",
  "restore",
  "retall",
  "return",
  "reverse",
  "rk4",
  "roberts",
  "rot",
  "rotate",
  "round",
  "routine_filepath",
  "routine_info",
  "rs_test",
  "s_test",
  "save",
  "savgol",
  "scale3",
  "scale3d",
  "scatterplot",
  "scatterplot3d",
  "scope_level",
  "scope_traceback",
  "scope_varfetch",
  "scope_varname",
  "search2d",
  "search3d",
  "sem_create",
  "sem_delete",
  "sem_lock",
  "sem_release",
  "set_plot",
  "set_shading",
  "setenv",
  "sfit",
  "shade_surf",
  "shade_surf_irr",
  "shade_volume",
  "shift",
  "shift_diff",
  "shmdebug",
  "shmmap",
  "shmunmap",
  "shmvar",
  "show3",
  "showfont",
  "signum",
  "simplex",
  "sin",
  "sindgen",
  "sinh",
  "size",
  "skewness",
  "skip_lun",
  "slicer3",
  "slide_image",
  "smooth",
  "sobel",
  "socket",
  "sort",
  "spawn",
  "sph_4pnt",
  "sph_scat",
  "spher_harm",
  "spl_init",
  "spl_interp",
  "spline",
  "spline_p",
  "sprsab",
  "sprsax",
  "sprsin",
  "sprstp",
  "sqrt",
  "standardize",
  "stddev",
  "stop",
  "strarr",
  "strcmp",
  "strcompress",
  "streamline",
  "streamline",
  "stregex",
  "stretch",
  "string",
  "strjoin",
  "strlen",
  "strlowcase",
  "strmatch",
  "strmessage",
  "strmid",
  "strpos",
  "strput",
  "strsplit",
  "strtrim",
  "struct_assign",
  "struct_hide",
  "strupcase",
  "surface",
  "surface",
  "surfr",
  "svdc",
  "svdfit",
  "svsol",
  "swap_endian",
  "swap_endian_inplace",
  "symbol",
  "systime",
  "t_cvf",
  "t_pdf",
  "t3d",
  "tag_names",
  "tan",
  "tanh",
  "tek_color",
  "temporary",
  "terminal_size",
  "tetra_clip",
  "tetra_surface",
  "tetra_volume",
  "text",
  "thin",
  "thread",
  "threed",
  "tic",
  "time_test2",
  "timegen",
  "timer",
  "timestamp",
  "timestamptovalues",
  "tm_test",
  "toc",
  "total",
  "trace",
  "transpose",
  "tri_surf",
  "triangulate",
  "trigrid",
  "triql",
  "trired",
  "trisol",
  "truncate_lun",
  "ts_coef",
  "ts_diff",
  "ts_fcast",
  "ts_smooth",
  "tv",
  "tvcrs",
  "tvlct",
  "tvrd",
  "tvscl",
  "typename",
  "uindgen",
  "uint",
  "uintarr",
  "ul64indgen",
  "ulindgen",
  "ulon64arr",
  "ulonarr",
  "ulong",
  "ulong64",
  "uniq",
  "unsharp_mask",
  "usersym",
  "value_locate",
  "variance",
  "vector",
  "vector_field",
  "vel",
  "velovect",
  "vert_t3d",
  "voigt",
  "volume",
  "voronoi",
  "voxel_proj",
  "wait",
  "warp_tri",
  "watershed",
  "wdelete",
  "wf_draw",
  "where",
  "widget_base",
  "widget_button",
  "widget_combobox",
  "widget_control",
  "widget_displaycontextmenu",
  "widget_draw",
  "widget_droplist",
  "widget_event",
  "widget_info",
  "widget_label",
  "widget_list",
  "widget_propertysheet",
  "widget_slider",
  "widget_tab",
  "widget_table",
  "widget_text",
  "widget_tree",
  "widget_tree_move",
  "widget_window",
  "wiener_filter",
  "window",
  "window",
  "write_bmp",
  "write_csv",
  "write_gif",
  "write_image",
  "write_jpeg",
  "write_jpeg2000",
  "write_nrif",
  "write_pict",
  "write_png",
  "write_ppm",
  "write_spr",
  "write_srf",
  "write_sylk",
  "write_tiff",
  "write_video",
  "write_wav",
  "write_wave",
  "writeu",
  "wset",
  "wshow",
  "wtn",
  "wv_applet",
  "wv_cwt",
  "wv_cw_wavelet",
  "wv_denoise",
  "wv_dwt",
  "wv_fn_coiflet",
  "wv_fn_daubechies",
  "wv_fn_gaussian",
  "wv_fn_haar",
  "wv_fn_morlet",
  "wv_fn_paul",
  "wv_fn_symlet",
  "wv_import_data",
  "wv_import_wavelet",
  "wv_plot3d_wps",
  "wv_plot_multires",
  "wv_pwt",
  "wv_tool_denoise",
  "xbm_edit",
  "xdisplayfile",
  "xdxf",
  "xfont",
  "xinteranimate",
  "xloadct",
  "xmanager",
  "xmng_tmpl",
  "xmtool",
  "xobjview",
  "xobjview_rotate",
  "xobjview_write_image",
  "xpalette",
  "xpcolor",
  "xplot3d",
  "xregistered",
  "xroi",
  "xsq_test",
  "xsurface",
  "xvaredit",
  "xvolume",
  "xvolume_rotate",
  "xvolume_write_image",
  "xyouts",
  "zlib_compress",
  "zlib_uncompress",
  "zoom",
  "zoom_24"
];
var builtins$7 = wordRegexp$b(builtinArray$1);
var keywordArray$2 = [
  "begin",
  "end",
  "endcase",
  "endfor",
  "endwhile",
  "endif",
  "endrep",
  "endforeach",
  "break",
  "case",
  "continue",
  "for",
  "foreach",
  "goto",
  "if",
  "then",
  "else",
  "repeat",
  "until",
  "switch",
  "while",
  "do",
  "pro",
  "function"
];
var keywords$s = wordRegexp$b(keywordArray$2);
var identifiers$7 = new RegExp("^[_a-z¡-￿][_a-z0-9¡-￿]*", "i");
var singleOperators$5 = /[+\-*&=<>\/@#~$]/;
var boolOperators = new RegExp("(and|or|eq|lt|le|gt|ge|ne|not)", "i");
function tokenBase$w(stream) {
  if (stream.eatSpace()) return null;
  if (stream.match(";")) {
    stream.skipToEnd();
    return "comment";
  }
  if (stream.match(/^[0-9\.+-]/, false)) {
    if (stream.match(/^[+-]?0x[0-9a-fA-F]+/))
      return "number";
    if (stream.match(/^[+-]?\d*\.\d+([EeDd][+-]?\d+)?/))
      return "number";
    if (stream.match(/^[+-]?\d+([EeDd][+-]?\d+)?/))
      return "number";
  }
  if (stream.match(/^"([^"]|(""))*"/)) {
    return "string";
  }
  if (stream.match(/^'([^']|(''))*'/)) {
    return "string";
  }
  if (stream.match(keywords$s)) {
    return "keyword";
  }
  if (stream.match(builtins$7)) {
    return "builtin";
  }
  if (stream.match(identifiers$7)) {
    return "variable";
  }
  if (stream.match(singleOperators$5) || stream.match(boolOperators)) {
    return "operator";
  }
  stream.next();
  return null;
}
const idl = {
  name: "idl",
  token: function(stream) {
    return tokenBase$w(stream);
  },
  languageData: {
    autocomplete: builtinArray$1.concat(keywordArray$2)
  }
};
const idl$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  idl
});
function mkJavaScript(parserConfig2) {
  var statementIndent = parserConfig2.statementIndent;
  var jsonldMode = parserConfig2.jsonld;
  var jsonMode = parserConfig2.json || jsonldMode;
  var isTS = parserConfig2.typescript;
  var wordRE2 = parserConfig2.wordCharacters || /[\w$\xa1-\uffff]/;
  var keywords2 = (function() {
    function kw2(type3) {
      return { type: type3, style: "keyword" };
    }
    var A2 = kw2("keyword a"), B2 = kw2("keyword b"), C2 = kw2("keyword c"), D = kw2("keyword d");
    var operator2 = kw2("operator"), atom2 = { type: "atom", style: "atom" };
    return {
      "if": kw2("if"),
      "while": A2,
      "with": A2,
      "else": B2,
      "do": B2,
      "try": B2,
      "finally": B2,
      "return": D,
      "break": D,
      "continue": D,
      "new": kw2("new"),
      "delete": C2,
      "void": C2,
      "throw": C2,
      "debugger": kw2("debugger"),
      "var": kw2("var"),
      "const": kw2("var"),
      "let": kw2("var"),
      "function": kw2("function"),
      "catch": kw2("catch"),
      "for": kw2("for"),
      "switch": kw2("switch"),
      "case": kw2("case"),
      "default": kw2("default"),
      "in": operator2,
      "typeof": operator2,
      "instanceof": operator2,
      "true": atom2,
      "false": atom2,
      "null": atom2,
      "undefined": atom2,
      "NaN": atom2,
      "Infinity": atom2,
      "this": kw2("this"),
      "class": kw2("class"),
      "super": kw2("atom"),
      "yield": C2,
      "export": kw2("export"),
      "import": kw2("import"),
      "extends": C2,
      "await": C2
    };
  })();
  var isOperatorChar2 = /[+\-*&%=<>!?|~^@]/;
  var isJsonldKeyword = /^@(context|id|value|language|type|container|list|set|reverse|index|base|vocab|graph)"/;
  function readRegexp(stream) {
    var escaped = false, next2, inSet = false;
    while ((next2 = stream.next()) != null) {
      if (!escaped) {
        if (next2 == "/" && !inSet) return;
        if (next2 == "[") inSet = true;
        else if (inSet && next2 == "]") inSet = false;
      }
      escaped = !escaped && next2 == "\\";
    }
  }
  var type2, content2;
  function ret2(tp, style2, cont3) {
    type2 = tp;
    content2 = cont3;
    return style2;
  }
  function tokenBase2(stream, state) {
    var ch2 = stream.next();
    if (ch2 == '"' || ch2 == "'") {
      state.tokenize = tokenString3(ch2);
      return state.tokenize(stream, state);
    } else if (ch2 == "." && stream.match(/^\d[\d_]*(?:[eE][+\-]?[\d_]+)?/)) {
      return ret2("number", "number");
    } else if (ch2 == "." && stream.match("..")) {
      return ret2("spread", "meta");
    } else if (/[\[\]{}\(\),;\:\.]/.test(ch2)) {
      return ret2(ch2);
    } else if (ch2 == "=" && stream.eat(">")) {
      return ret2("=>", "operator");
    } else if (ch2 == "0" && stream.match(/^(?:x[\dA-Fa-f_]+|o[0-7_]+|b[01_]+)n?/)) {
      return ret2("number", "number");
    } else if (/\d/.test(ch2)) {
      stream.match(/^[\d_]*(?:n|(?:\.[\d_]*)?(?:[eE][+\-]?[\d_]+)?)?/);
      return ret2("number", "number");
    } else if (ch2 == "/") {
      if (stream.eat("*")) {
        state.tokenize = tokenComment2;
        return tokenComment2(stream, state);
      } else if (stream.eat("/")) {
        stream.skipToEnd();
        return ret2("comment", "comment");
      } else if (expressionAllowed(stream, state, 1)) {
        readRegexp(stream);
        stream.match(/^\b(([gimyus])(?![gimyus]*\2))+\b/);
        return ret2("regexp", "string.special");
      } else {
        stream.eat("=");
        return ret2("operator", "operator", stream.current());
      }
    } else if (ch2 == "`") {
      state.tokenize = tokenQuasi;
      return tokenQuasi(stream, state);
    } else if (ch2 == "#" && stream.peek() == "!") {
      stream.skipToEnd();
      return ret2("meta", "meta");
    } else if (ch2 == "#" && stream.eatWhile(wordRE2)) {
      return ret2("variable", "property");
    } else if (ch2 == "<" && stream.match("!--") || ch2 == "-" && stream.match("->") && !/\S/.test(stream.string.slice(0, stream.start))) {
      stream.skipToEnd();
      return ret2("comment", "comment");
    } else if (isOperatorChar2.test(ch2)) {
      if (ch2 != ">" || !state.lexical || state.lexical.type != ">") {
        if (stream.eat("=")) {
          if (ch2 == "!" || ch2 == "=") stream.eat("=");
        } else if (/[<>*+\-|&?]/.test(ch2)) {
          stream.eat(ch2);
          if (ch2 == ">") stream.eat(ch2);
        }
      }
      if (ch2 == "?" && stream.eat(".")) return ret2(".");
      return ret2("operator", "operator", stream.current());
    } else if (wordRE2.test(ch2)) {
      stream.eatWhile(wordRE2);
      var word = stream.current();
      if (state.lastType != ".") {
        if (keywords2.propertyIsEnumerable(word)) {
          var kw2 = keywords2[word];
          return ret2(kw2.type, kw2.style, word);
        }
        if (word == "async" && stream.match(/^(\s|\/\*([^*]|\*(?!\/))*?\*\/)*[\[\(\w]/, false))
          return ret2("async", "keyword", word);
      }
      return ret2("variable", "variable", word);
    }
  }
  function tokenString3(quote2) {
    return function(stream, state) {
      var escaped = false, next2;
      if (jsonldMode && stream.peek() == "@" && stream.match(isJsonldKeyword)) {
        state.tokenize = tokenBase2;
        return ret2("jsonld-keyword", "meta");
      }
      while ((next2 = stream.next()) != null) {
        if (next2 == quote2 && !escaped) break;
        escaped = !escaped && next2 == "\\";
      }
      if (!escaped) state.tokenize = tokenBase2;
      return ret2("string", "string");
    };
  }
  function tokenComment2(stream, state) {
    var maybeEnd = false, ch2;
    while (ch2 = stream.next()) {
      if (ch2 == "/" && maybeEnd) {
        state.tokenize = tokenBase2;
        break;
      }
      maybeEnd = ch2 == "*";
    }
    return ret2("comment", "comment");
  }
  function tokenQuasi(stream, state) {
    var escaped = false, next2;
    while ((next2 = stream.next()) != null) {
      if (!escaped && (next2 == "`" || next2 == "$" && stream.eat("{"))) {
        state.tokenize = tokenBase2;
        break;
      }
      escaped = !escaped && next2 == "\\";
    }
    return ret2("quasi", "string.special", stream.current());
  }
  var brackets2 = "([{}])";
  function findFatArrow(stream, state) {
    if (state.fatArrowAt) state.fatArrowAt = null;
    var arrow = stream.string.indexOf("=>", stream.start);
    if (arrow < 0) return;
    if (isTS) {
      var m = /:\s*(?:\w+(?:<[^>]*>|\[\])?|\{[^}]*\})\s*$/.exec(stream.string.slice(stream.start, arrow));
      if (m) arrow = m.index;
    }
    var depth = 0, sawSomething = false;
    for (var pos = arrow - 1; pos >= 0; --pos) {
      var ch2 = stream.string.charAt(pos);
      var bracket = brackets2.indexOf(ch2);
      if (bracket >= 0 && bracket < 3) {
        if (!depth) {
          ++pos;
          break;
        }
        if (--depth == 0) {
          if (ch2 == "(") sawSomething = true;
          break;
        }
      } else if (bracket >= 3 && bracket < 6) {
        ++depth;
      } else if (wordRE2.test(ch2)) {
        sawSomething = true;
      } else if (/["'\/`]/.test(ch2)) {
        for (; ; --pos) {
          if (pos == 0) return;
          var next2 = stream.string.charAt(pos - 1);
          if (next2 == ch2 && stream.string.charAt(pos - 2) != "\\") {
            pos--;
            break;
          }
        }
      } else if (sawSomething && !depth) {
        ++pos;
        break;
      }
    }
    if (sawSomething && !depth) state.fatArrowAt = pos;
  }
  var atomicTypes2 = {
    "atom": true,
    "number": true,
    "variable": true,
    "string": true,
    "regexp": true,
    "this": true,
    "import": true,
    "jsonld-keyword": true
  };
  function JSLexical(indented, column, type3, align, prev, info) {
    this.indented = indented;
    this.column = column;
    this.type = type3;
    this.prev = prev;
    this.info = info;
    if (align != null) this.align = align;
  }
  function inScope2(state, varname) {
    for (var v = state.localVars; v; v = v.next)
      if (v.name == varname) return true;
    for (var cx3 = state.context; cx3; cx3 = cx3.prev) {
      for (var v = cx3.vars; v; v = v.next)
        if (v.name == varname) return true;
    }
  }
  function parseJS(state, style2, type3, content3, stream) {
    var cc = state.cc;
    cx2.state = state;
    cx2.stream = stream;
    cx2.marked = null;
    cx2.cc = cc;
    cx2.style = style2;
    if (!state.lexical.hasOwnProperty("align"))
      state.lexical.align = true;
    while (true) {
      var combinator = cc.length ? cc.pop() : jsonMode ? expression2 : statement2;
      if (combinator(type3, content3)) {
        while (cc.length && cc[cc.length - 1].lex)
          cc.pop()();
        if (cx2.marked) return cx2.marked;
        if (type3 == "variable" && inScope2(state, content3)) return "variableName.local";
        return style2;
      }
    }
  }
  var cx2 = { state: null, marked: null, cc: null };
  function pass2() {
    for (var i2 = arguments.length - 1; i2 >= 0; i2--) cx2.cc.push(arguments[i2]);
  }
  function cont2() {
    pass2.apply(null, arguments);
    return true;
  }
  function inList2(name, list) {
    for (var v = list; v; v = v.next) if (v.name == name) return true;
    return false;
  }
  function register2(varname) {
    var state = cx2.state;
    cx2.marked = "def";
    if (state.context) {
      if (state.lexical.info == "var" && state.context && state.context.block) {
        var newContext = registerVarScoped(varname, state.context);
        if (newContext != null) {
          state.context = newContext;
          return;
        }
      } else if (!inList2(varname, state.localVars)) {
        state.localVars = new Var(varname, state.localVars);
        return;
      }
    }
    if (parserConfig2.globalVars && !inList2(varname, state.globalVars))
      state.globalVars = new Var(varname, state.globalVars);
  }
  function registerVarScoped(varname, context) {
    if (!context) {
      return null;
    } else if (context.block) {
      var inner = registerVarScoped(varname, context.prev);
      if (!inner) return null;
      if (inner == context.prev) return context;
      return new Context2(inner, context.vars, true);
    } else if (inList2(varname, context.vars)) {
      return context;
    } else {
      return new Context2(context.prev, new Var(varname, context.vars), false);
    }
  }
  function isModifier(name) {
    return name == "public" || name == "private" || name == "protected" || name == "abstract" || name == "readonly";
  }
  function Context2(prev, vars, block3) {
    this.prev = prev;
    this.vars = vars;
    this.block = block3;
  }
  function Var(name, next2) {
    this.name = name;
    this.next = next2;
  }
  var defaultVars2 = new Var("this", new Var("arguments", null));
  function pushcontext2() {
    cx2.state.context = new Context2(cx2.state.context, cx2.state.localVars, false);
    cx2.state.localVars = defaultVars2;
  }
  function pushblockcontext() {
    cx2.state.context = new Context2(cx2.state.context, cx2.state.localVars, true);
    cx2.state.localVars = null;
  }
  pushcontext2.lex = pushblockcontext.lex = true;
  function popcontext2() {
    cx2.state.localVars = cx2.state.context.vars;
    cx2.state.context = cx2.state.context.prev;
  }
  popcontext2.lex = true;
  function pushlex2(type3, info) {
    var result = function() {
      var state = cx2.state, indent2 = state.indented;
      if (state.lexical.type == "stat") indent2 = state.lexical.indented;
      else for (var outer = state.lexical; outer && outer.type == ")" && outer.align; outer = outer.prev)
        indent2 = outer.indented;
      state.lexical = new JSLexical(indent2, cx2.stream.column(), type3, null, state.lexical, info);
    };
    result.lex = true;
    return result;
  }
  function poplex2() {
    var state = cx2.state;
    if (state.lexical.prev) {
      if (state.lexical.type == ")")
        state.indented = state.lexical.indented;
      state.lexical = state.lexical.prev;
    }
  }
  poplex2.lex = true;
  function expect2(wanted) {
    function exp(type3) {
      if (type3 == wanted) return cont2();
      else if (wanted == ";" || type3 == "}" || type3 == ")" || type3 == "]") return pass2();
      else return cont2(exp);
    }
    return exp;
  }
  function statement2(type3, value) {
    if (type3 == "var") return cont2(pushlex2("vardef", value), vardef, expect2(";"), poplex2);
    if (type3 == "keyword a") return cont2(pushlex2("form"), parenExpr, statement2, poplex2);
    if (type3 == "keyword b") return cont2(pushlex2("form"), statement2, poplex2);
    if (type3 == "keyword d") return cx2.stream.match(/^\s*$/, false) ? cont2() : cont2(pushlex2("stat"), maybeexpression2, expect2(";"), poplex2);
    if (type3 == "debugger") return cont2(expect2(";"));
    if (type3 == "{") return cont2(pushlex2("}"), pushblockcontext, block2, poplex2, popcontext2);
    if (type3 == ";") return cont2();
    if (type3 == "if") {
      if (cx2.state.lexical.info == "else" && cx2.state.cc[cx2.state.cc.length - 1] == poplex2)
        cx2.state.cc.pop()();
      return cont2(pushlex2("form"), parenExpr, statement2, poplex2, maybeelse);
    }
    if (type3 == "function") return cont2(functiondef2);
    if (type3 == "for") return cont2(pushlex2("form"), pushblockcontext, forspec, statement2, popcontext2, poplex2);
    if (type3 == "class" || isTS && value == "interface") {
      cx2.marked = "keyword";
      return cont2(pushlex2("form", type3 == "class" ? type3 : value), className2, poplex2);
    }
    if (type3 == "variable") {
      if (isTS && value == "declare") {
        cx2.marked = "keyword";
        return cont2(statement2);
      } else if (isTS && (value == "module" || value == "enum" || value == "type") && cx2.stream.match(/^\s*\w/, false)) {
        cx2.marked = "keyword";
        if (value == "enum") return cont2(enumdef);
        else if (value == "type") return cont2(typename, expect2("operator"), typeexpr, expect2(";"));
        else return cont2(pushlex2("form"), pattern, expect2("{"), pushlex2("}"), block2, poplex2, poplex2);
      } else if (isTS && value == "namespace") {
        cx2.marked = "keyword";
        return cont2(pushlex2("form"), expression2, statement2, poplex2);
      } else if (isTS && value == "abstract") {
        cx2.marked = "keyword";
        return cont2(statement2);
      } else {
        return cont2(pushlex2("stat"), maybelabel2);
      }
    }
    if (type3 == "switch") return cont2(
      pushlex2("form"),
      parenExpr,
      expect2("{"),
      pushlex2("}", "switch"),
      pushblockcontext,
      block2,
      poplex2,
      poplex2,
      popcontext2
    );
    if (type3 == "case") return cont2(expression2, expect2(":"));
    if (type3 == "default") return cont2(expect2(":"));
    if (type3 == "catch") return cont2(pushlex2("form"), pushcontext2, maybeCatchBinding, statement2, poplex2, popcontext2);
    if (type3 == "export") return cont2(pushlex2("stat"), afterExport, poplex2);
    if (type3 == "import") return cont2(pushlex2("stat"), afterImport, poplex2);
    if (type3 == "async") return cont2(statement2);
    if (value == "@") return cont2(expression2, statement2);
    return pass2(pushlex2("stat"), expression2, expect2(";"), poplex2);
  }
  function maybeCatchBinding(type3) {
    if (type3 == "(") return cont2(funarg2, expect2(")"));
  }
  function expression2(type3, value) {
    return expressionInner(type3, value, false);
  }
  function expressionNoComma(type3, value) {
    return expressionInner(type3, value, true);
  }
  function parenExpr(type3) {
    if (type3 != "(") return pass2();
    return cont2(pushlex2(")"), maybeexpression2, expect2(")"), poplex2);
  }
  function expressionInner(type3, value, noComma) {
    if (cx2.state.fatArrowAt == cx2.stream.start) {
      var body2 = noComma ? arrowBodyNoComma : arrowBody;
      if (type3 == "(") return cont2(pushcontext2, pushlex2(")"), commasep2(funarg2, ")"), poplex2, expect2("=>"), body2, popcontext2);
      else if (type3 == "variable") return pass2(pushcontext2, pattern, expect2("=>"), body2, popcontext2);
    }
    var maybeop = noComma ? maybeoperatorNoComma : maybeoperatorComma;
    if (atomicTypes2.hasOwnProperty(type3)) return cont2(maybeop);
    if (type3 == "function") return cont2(functiondef2, maybeop);
    if (type3 == "class" || isTS && value == "interface") {
      cx2.marked = "keyword";
      return cont2(pushlex2("form"), classExpression, poplex2);
    }
    if (type3 == "keyword c" || type3 == "async") return cont2(noComma ? expressionNoComma : expression2);
    if (type3 == "(") return cont2(pushlex2(")"), maybeexpression2, expect2(")"), poplex2, maybeop);
    if (type3 == "operator" || type3 == "spread") return cont2(noComma ? expressionNoComma : expression2);
    if (type3 == "[") return cont2(pushlex2("]"), arrayLiteral, poplex2, maybeop);
    if (type3 == "{") return contCommasep(objprop2, "}", null, maybeop);
    if (type3 == "quasi") return pass2(quasi, maybeop);
    if (type3 == "new") return cont2(maybeTarget(noComma));
    return cont2();
  }
  function maybeexpression2(type3) {
    if (type3.match(/[;\}\)\],]/)) return pass2();
    return pass2(expression2);
  }
  function maybeoperatorComma(type3, value) {
    if (type3 == ",") return cont2(maybeexpression2);
    return maybeoperatorNoComma(type3, value, false);
  }
  function maybeoperatorNoComma(type3, value, noComma) {
    var me = noComma == false ? maybeoperatorComma : maybeoperatorNoComma;
    var expr = noComma == false ? expression2 : expressionNoComma;
    if (type3 == "=>") return cont2(pushcontext2, noComma ? arrowBodyNoComma : arrowBody, popcontext2);
    if (type3 == "operator") {
      if (/\+\+|--/.test(value) || isTS && value == "!") return cont2(me);
      if (isTS && value == "<" && cx2.stream.match(/^([^<>]|<[^<>]*>)*>\s*\(/, false))
        return cont2(pushlex2(">"), commasep2(typeexpr, ">"), poplex2, me);
      if (value == "?") return cont2(expression2, expect2(":"), expr);
      return cont2(expr);
    }
    if (type3 == "quasi") {
      return pass2(quasi, me);
    }
    if (type3 == ";") return;
    if (type3 == "(") return contCommasep(expressionNoComma, ")", "call", me);
    if (type3 == ".") return cont2(property2, me);
    if (type3 == "[") return cont2(pushlex2("]"), maybeexpression2, expect2("]"), poplex2, me);
    if (isTS && value == "as") {
      cx2.marked = "keyword";
      return cont2(typeexpr, me);
    }
    if (type3 == "regexp") {
      cx2.state.lastType = cx2.marked = "operator";
      cx2.stream.backUp(cx2.stream.pos - cx2.stream.start - 1);
      return cont2(expr);
    }
  }
  function quasi(type3, value) {
    if (type3 != "quasi") return pass2();
    if (value.slice(value.length - 2) != "${") return cont2(quasi);
    return cont2(maybeexpression2, continueQuasi);
  }
  function continueQuasi(type3) {
    if (type3 == "}") {
      cx2.marked = "string.special";
      cx2.state.tokenize = tokenQuasi;
      return cont2(quasi);
    }
  }
  function arrowBody(type3) {
    findFatArrow(cx2.stream, cx2.state);
    return pass2(type3 == "{" ? statement2 : expression2);
  }
  function arrowBodyNoComma(type3) {
    findFatArrow(cx2.stream, cx2.state);
    return pass2(type3 == "{" ? statement2 : expressionNoComma);
  }
  function maybeTarget(noComma) {
    return function(type3) {
      if (type3 == ".") return cont2(noComma ? targetNoComma : target);
      else if (type3 == "variable" && isTS) return cont2(maybeTypeArgs, noComma ? maybeoperatorNoComma : maybeoperatorComma);
      else return pass2(noComma ? expressionNoComma : expression2);
    };
  }
  function target(_, value) {
    if (value == "target") {
      cx2.marked = "keyword";
      return cont2(maybeoperatorComma);
    }
  }
  function targetNoComma(_, value) {
    if (value == "target") {
      cx2.marked = "keyword";
      return cont2(maybeoperatorNoComma);
    }
  }
  function maybelabel2(type3) {
    if (type3 == ":") return cont2(poplex2, statement2);
    return pass2(maybeoperatorComma, expect2(";"), poplex2);
  }
  function property2(type3) {
    if (type3 == "variable") {
      cx2.marked = "property";
      return cont2();
    }
  }
  function objprop2(type3, value) {
    if (type3 == "async") {
      cx2.marked = "property";
      return cont2(objprop2);
    } else if (type3 == "variable" || cx2.style == "keyword") {
      cx2.marked = "property";
      if (value == "get" || value == "set") return cont2(getterSetter);
      var m;
      if (isTS && cx2.state.fatArrowAt == cx2.stream.start && (m = cx2.stream.match(/^\s*:\s*/, false)))
        cx2.state.fatArrowAt = cx2.stream.pos + m[0].length;
      return cont2(afterprop);
    } else if (type3 == "number" || type3 == "string") {
      cx2.marked = jsonldMode ? "property" : cx2.style + " property";
      return cont2(afterprop);
    } else if (type3 == "jsonld-keyword") {
      return cont2(afterprop);
    } else if (isTS && isModifier(value)) {
      cx2.marked = "keyword";
      return cont2(objprop2);
    } else if (type3 == "[") {
      return cont2(expression2, maybetype, expect2("]"), afterprop);
    } else if (type3 == "spread") {
      return cont2(expressionNoComma, afterprop);
    } else if (value == "*") {
      cx2.marked = "keyword";
      return cont2(objprop2);
    } else if (type3 == ":") {
      return pass2(afterprop);
    }
  }
  function getterSetter(type3) {
    if (type3 != "variable") return pass2(afterprop);
    cx2.marked = "property";
    return cont2(functiondef2);
  }
  function afterprop(type3) {
    if (type3 == ":") return cont2(expressionNoComma);
    if (type3 == "(") return pass2(functiondef2);
  }
  function commasep2(what, end2, sep) {
    function proceed(type3, value) {
      if (sep ? sep.indexOf(type3) > -1 : type3 == ",") {
        var lex = cx2.state.lexical;
        if (lex.info == "call") lex.pos = (lex.pos || 0) + 1;
        return cont2(function(type4, value2) {
          if (type4 == end2 || value2 == end2) return pass2();
          return pass2(what);
        }, proceed);
      }
      if (type3 == end2 || value == end2) return cont2();
      if (sep && sep.indexOf(";") > -1) return pass2(what);
      return cont2(expect2(end2));
    }
    return function(type3, value) {
      if (type3 == end2 || value == end2) return cont2();
      return pass2(what, proceed);
    };
  }
  function contCommasep(what, end2, info) {
    for (var i2 = 3; i2 < arguments.length; i2++)
      cx2.cc.push(arguments[i2]);
    return cont2(pushlex2(end2, info), commasep2(what, end2), poplex2);
  }
  function block2(type3) {
    if (type3 == "}") return cont2();
    return pass2(statement2, block2);
  }
  function maybetype(type3, value) {
    if (isTS) {
      if (type3 == ":") return cont2(typeexpr);
      if (value == "?") return cont2(maybetype);
    }
  }
  function maybetypeOrIn(type3, value) {
    if (isTS && (type3 == ":" || value == "in")) return cont2(typeexpr);
  }
  function mayberettype(type3) {
    if (isTS && type3 == ":") {
      if (cx2.stream.match(/^\s*\w+\s+is\b/, false)) return cont2(expression2, isKW, typeexpr);
      else return cont2(typeexpr);
    }
  }
  function isKW(_, value) {
    if (value == "is") {
      cx2.marked = "keyword";
      return cont2();
    }
  }
  function typeexpr(type3, value) {
    if (value == "keyof" || value == "typeof" || value == "infer" || value == "readonly") {
      cx2.marked = "keyword";
      return cont2(value == "typeof" ? expressionNoComma : typeexpr);
    }
    if (type3 == "variable" || value == "void") {
      cx2.marked = "type";
      return cont2(afterType);
    }
    if (value == "|" || value == "&") return cont2(typeexpr);
    if (type3 == "string" || type3 == "number" || type3 == "atom") return cont2(afterType);
    if (type3 == "[") return cont2(pushlex2("]"), commasep2(typeexpr, "]", ","), poplex2, afterType);
    if (type3 == "{") return cont2(pushlex2("}"), typeprops, poplex2, afterType);
    if (type3 == "(") return cont2(commasep2(typearg, ")"), maybeReturnType, afterType);
    if (type3 == "<") return cont2(commasep2(typeexpr, ">"), typeexpr);
    if (type3 == "quasi") return pass2(quasiType, afterType);
  }
  function maybeReturnType(type3) {
    if (type3 == "=>") return cont2(typeexpr);
  }
  function typeprops(type3) {
    if (type3.match(/[\}\)\]]/)) return cont2();
    if (type3 == "," || type3 == ";") return cont2(typeprops);
    return pass2(typeprop2, typeprops);
  }
  function typeprop2(type3, value) {
    if (type3 == "variable" || cx2.style == "keyword") {
      cx2.marked = "property";
      return cont2(typeprop2);
    } else if (value == "?" || type3 == "number" || type3 == "string") {
      return cont2(typeprop2);
    } else if (type3 == ":") {
      return cont2(typeexpr);
    } else if (type3 == "[") {
      return cont2(expect2("variable"), maybetypeOrIn, expect2("]"), typeprop2);
    } else if (type3 == "(") {
      return pass2(functiondecl, typeprop2);
    } else if (!type3.match(/[;\}\)\],]/)) {
      return cont2();
    }
  }
  function quasiType(type3, value) {
    if (type3 != "quasi") return pass2();
    if (value.slice(value.length - 2) != "${") return cont2(quasiType);
    return cont2(typeexpr, continueQuasiType);
  }
  function continueQuasiType(type3) {
    if (type3 == "}") {
      cx2.marked = "string.special";
      cx2.state.tokenize = tokenQuasi;
      return cont2(quasiType);
    }
  }
  function typearg(type3, value) {
    if (type3 == "variable" && cx2.stream.match(/^\s*[?:]/, false) || value == "?") return cont2(typearg);
    if (type3 == ":") return cont2(typeexpr);
    if (type3 == "spread") return cont2(typearg);
    return pass2(typeexpr);
  }
  function afterType(type3, value) {
    if (value == "<") return cont2(pushlex2(">"), commasep2(typeexpr, ">"), poplex2, afterType);
    if (value == "|" || type3 == "." || value == "&") return cont2(typeexpr);
    if (type3 == "[") return cont2(typeexpr, expect2("]"), afterType);
    if (value == "extends" || value == "implements") {
      cx2.marked = "keyword";
      return cont2(typeexpr);
    }
    if (value == "?") return cont2(typeexpr, expect2(":"), typeexpr);
  }
  function maybeTypeArgs(_, value) {
    if (value == "<") return cont2(pushlex2(">"), commasep2(typeexpr, ">"), poplex2, afterType);
  }
  function typeparam() {
    return pass2(typeexpr, maybeTypeDefault);
  }
  function maybeTypeDefault(_, value) {
    if (value == "=") return cont2(typeexpr);
  }
  function vardef(_, value) {
    if (value == "enum") {
      cx2.marked = "keyword";
      return cont2(enumdef);
    }
    return pass2(pattern, maybetype, maybeAssign, vardefCont);
  }
  function pattern(type3, value) {
    if (isTS && isModifier(value)) {
      cx2.marked = "keyword";
      return cont2(pattern);
    }
    if (type3 == "variable") {
      register2(value);
      return cont2();
    }
    if (type3 == "spread") return cont2(pattern);
    if (type3 == "[") return contCommasep(eltpattern, "]");
    if (type3 == "{") return contCommasep(proppattern, "}");
  }
  function proppattern(type3, value) {
    if (type3 == "variable" && !cx2.stream.match(/^\s*:/, false)) {
      register2(value);
      return cont2(maybeAssign);
    }
    if (type3 == "variable") cx2.marked = "property";
    if (type3 == "spread") return cont2(pattern);
    if (type3 == "}") return pass2();
    if (type3 == "[") return cont2(expression2, expect2("]"), expect2(":"), proppattern);
    return cont2(expect2(":"), pattern, maybeAssign);
  }
  function eltpattern() {
    return pass2(pattern, maybeAssign);
  }
  function maybeAssign(_type, value) {
    if (value == "=") return cont2(expressionNoComma);
  }
  function vardefCont(type3) {
    if (type3 == ",") return cont2(vardef);
  }
  function maybeelse(type3, value) {
    if (type3 == "keyword b" && value == "else") return cont2(pushlex2("form", "else"), statement2, poplex2);
  }
  function forspec(type3, value) {
    if (value == "await") return cont2(forspec);
    if (type3 == "(") return cont2(pushlex2(")"), forspec12, poplex2);
  }
  function forspec12(type3) {
    if (type3 == "var") return cont2(vardef, forspec2);
    if (type3 == "variable") return cont2(forspec2);
    return pass2(forspec2);
  }
  function forspec2(type3, value) {
    if (type3 == ")") return cont2();
    if (type3 == ";") return cont2(forspec2);
    if (value == "in" || value == "of") {
      cx2.marked = "keyword";
      return cont2(expression2, forspec2);
    }
    return pass2(expression2, forspec2);
  }
  function functiondef2(type3, value) {
    if (value == "*") {
      cx2.marked = "keyword";
      return cont2(functiondef2);
    }
    if (type3 == "variable") {
      register2(value);
      return cont2(functiondef2);
    }
    if (type3 == "(") return cont2(pushcontext2, pushlex2(")"), commasep2(funarg2, ")"), poplex2, mayberettype, statement2, popcontext2);
    if (isTS && value == "<") return cont2(pushlex2(">"), commasep2(typeparam, ">"), poplex2, functiondef2);
  }
  function functiondecl(type3, value) {
    if (value == "*") {
      cx2.marked = "keyword";
      return cont2(functiondecl);
    }
    if (type3 == "variable") {
      register2(value);
      return cont2(functiondecl);
    }
    if (type3 == "(") return cont2(pushcontext2, pushlex2(")"), commasep2(funarg2, ")"), poplex2, mayberettype, popcontext2);
    if (isTS && value == "<") return cont2(pushlex2(">"), commasep2(typeparam, ">"), poplex2, functiondecl);
  }
  function typename(type3, value) {
    if (type3 == "keyword" || type3 == "variable") {
      cx2.marked = "type";
      return cont2(typename);
    } else if (value == "<") {
      return cont2(pushlex2(">"), commasep2(typeparam, ">"), poplex2);
    }
  }
  function funarg2(type3, value) {
    if (value == "@") cont2(expression2, funarg2);
    if (type3 == "spread") return cont2(funarg2);
    if (isTS && isModifier(value)) {
      cx2.marked = "keyword";
      return cont2(funarg2);
    }
    if (isTS && type3 == "this") return cont2(maybetype, maybeAssign);
    return pass2(pattern, maybetype, maybeAssign);
  }
  function classExpression(type3, value) {
    if (type3 == "variable") return className2(type3, value);
    return classNameAfter(type3, value);
  }
  function className2(type3, value) {
    if (type3 == "variable") {
      register2(value);
      return cont2(classNameAfter);
    }
  }
  function classNameAfter(type3, value) {
    if (value == "<") return cont2(pushlex2(">"), commasep2(typeparam, ">"), poplex2, classNameAfter);
    if (value == "extends" || value == "implements" || isTS && type3 == ",") {
      if (value == "implements") cx2.marked = "keyword";
      return cont2(isTS ? typeexpr : expression2, classNameAfter);
    }
    if (type3 == "{") return cont2(pushlex2("}"), classBody, poplex2);
  }
  function classBody(type3, value) {
    if (type3 == "async" || type3 == "variable" && (value == "static" || value == "get" || value == "set" || isTS && isModifier(value)) && cx2.stream.match(/^\s+#?[\w$\xa1-\uffff]/, false)) {
      cx2.marked = "keyword";
      return cont2(classBody);
    }
    if (type3 == "variable" || cx2.style == "keyword") {
      cx2.marked = "property";
      return cont2(classfield, classBody);
    }
    if (type3 == "number" || type3 == "string") return cont2(classfield, classBody);
    if (type3 == "[")
      return cont2(expression2, maybetype, expect2("]"), classfield, classBody);
    if (value == "*") {
      cx2.marked = "keyword";
      return cont2(classBody);
    }
    if (isTS && type3 == "(") return pass2(functiondecl, classBody);
    if (type3 == ";" || type3 == ",") return cont2(classBody);
    if (type3 == "}") return cont2();
    if (value == "@") return cont2(expression2, classBody);
  }
  function classfield(type3, value) {
    if (value == "!" || value == "?") return cont2(classfield);
    if (type3 == ":") return cont2(typeexpr, maybeAssign);
    if (value == "=") return cont2(expressionNoComma);
    var context = cx2.state.lexical.prev, isInterface = context && context.info == "interface";
    return pass2(isInterface ? functiondecl : functiondef2);
  }
  function afterExport(type3, value) {
    if (value == "*") {
      cx2.marked = "keyword";
      return cont2(maybeFrom, expect2(";"));
    }
    if (value == "default") {
      cx2.marked = "keyword";
      return cont2(expression2, expect2(";"));
    }
    if (type3 == "{") return cont2(commasep2(exportField, "}"), maybeFrom, expect2(";"));
    return pass2(statement2);
  }
  function exportField(type3, value) {
    if (value == "as") {
      cx2.marked = "keyword";
      return cont2(expect2("variable"));
    }
    if (type3 == "variable") return pass2(expressionNoComma, exportField);
  }
  function afterImport(type3) {
    if (type3 == "string") return cont2();
    if (type3 == "(") return pass2(expression2);
    if (type3 == ".") return pass2(maybeoperatorComma);
    return pass2(importSpec, maybeMoreImports, maybeFrom);
  }
  function importSpec(type3, value) {
    if (type3 == "{") return contCommasep(importSpec, "}");
    if (type3 == "variable") register2(value);
    if (value == "*") cx2.marked = "keyword";
    return cont2(maybeAs);
  }
  function maybeMoreImports(type3) {
    if (type3 == ",") return cont2(importSpec, maybeMoreImports);
  }
  function maybeAs(_type, value) {
    if (value == "as") {
      cx2.marked = "keyword";
      return cont2(importSpec);
    }
  }
  function maybeFrom(_type, value) {
    if (value == "from") {
      cx2.marked = "keyword";
      return cont2(expression2);
    }
  }
  function arrayLiteral(type3) {
    if (type3 == "]") return cont2();
    return pass2(commasep2(expressionNoComma, "]"));
  }
  function enumdef() {
    return pass2(pushlex2("form"), pattern, expect2("{"), pushlex2("}"), commasep2(enummember, "}"), poplex2, poplex2);
  }
  function enummember() {
    return pass2(pattern, maybeAssign);
  }
  function isContinuedStatement(state, textAfter) {
    return state.lastType == "operator" || state.lastType == "," || isOperatorChar2.test(textAfter.charAt(0)) || /[,.]/.test(textAfter.charAt(0));
  }
  function expressionAllowed(stream, state, backUp) {
    return state.tokenize == tokenBase2 && /^(?:operator|sof|keyword [bcd]|case|new|export|default|spread|[\[{}\(,;:]|=>)$/.test(state.lastType) || state.lastType == "quasi" && /\{\s*$/.test(stream.string.slice(0, stream.pos - backUp));
  }
  return {
    name: parserConfig2.name,
    startState: function(indentUnit) {
      var state = {
        tokenize: tokenBase2,
        lastType: "sof",
        cc: [],
        lexical: new JSLexical(-indentUnit, 0, "block", false),
        localVars: parserConfig2.localVars,
        context: parserConfig2.localVars && new Context2(null, null, false),
        indented: 0
      };
      if (parserConfig2.globalVars && typeof parserConfig2.globalVars == "object")
        state.globalVars = parserConfig2.globalVars;
      return state;
    },
    token: function(stream, state) {
      if (stream.sol()) {
        if (!state.lexical.hasOwnProperty("align"))
          state.lexical.align = false;
        state.indented = stream.indentation();
        findFatArrow(stream, state);
      }
      if (state.tokenize != tokenComment2 && stream.eatSpace()) return null;
      var style2 = state.tokenize(stream, state);
      if (type2 == "comment") return style2;
      state.lastType = type2 == "operator" && (content2 == "++" || content2 == "--") ? "incdec" : type2;
      return parseJS(state, style2, type2, content2, stream);
    },
    indent: function(state, textAfter, cx3) {
      if (state.tokenize == tokenComment2 || state.tokenize == tokenQuasi) return null;
      if (state.tokenize != tokenBase2) return 0;
      var firstChar = textAfter && textAfter.charAt(0), lexical = state.lexical, top2;
      if (!/^\s*else\b/.test(textAfter)) for (var i2 = state.cc.length - 1; i2 >= 0; --i2) {
        var c = state.cc[i2];
        if (c == poplex2) lexical = lexical.prev;
        else if (c != maybeelse && c != popcontext2) break;
      }
      while ((lexical.type == "stat" || lexical.type == "form") && (firstChar == "}" || (top2 = state.cc[state.cc.length - 1]) && (top2 == maybeoperatorComma || top2 == maybeoperatorNoComma) && !/^[,\.=+\-*:?[\(]/.test(textAfter)))
        lexical = lexical.prev;
      if (statementIndent && lexical.type == ")" && lexical.prev.type == "stat")
        lexical = lexical.prev;
      var type3 = lexical.type, closing2 = firstChar == type3;
      if (type3 == "vardef") return lexical.indented + (state.lastType == "operator" || state.lastType == "," ? lexical.info.length + 1 : 0);
      else if (type3 == "form" && firstChar == "{") return lexical.indented;
      else if (type3 == "form") return lexical.indented + cx3.unit;
      else if (type3 == "stat")
        return lexical.indented + (isContinuedStatement(state, textAfter) ? statementIndent || cx3.unit : 0);
      else if (lexical.info == "switch" && !closing2 && parserConfig2.doubleIndentSwitch != false)
        return lexical.indented + (/^(?:case|default)\b/.test(textAfter) ? cx3.unit : 2 * cx3.unit);
      else if (lexical.align) return lexical.column + (closing2 ? 0 : 1);
      else return lexical.indented + (closing2 ? 0 : cx3.unit);
    },
    languageData: {
      indentOnInput: /^\s*(?:case .*?:|default:|\{|\})$/,
      commentTokens: jsonMode ? void 0 : { line: "//", block: { open: "/*", close: "*/" } },
      closeBrackets: { brackets: ["(", "[", "{", "'", '"', "`"] },
      wordChars: "$"
    }
  };
}
const javascript = mkJavaScript({ name: "javascript" });
mkJavaScript({ name: "json", json: true });
const jsonld = mkJavaScript({ name: "json", jsonld: true });
mkJavaScript({ name: "typescript", typescript: true });
const javascript$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  javascript,
  jsonld
});
function wordRegexp$a(words2, end2, pre) {
  if (typeof pre === "undefined") pre = "";
  if (typeof end2 === "undefined") {
    end2 = "\\b";
  }
  return new RegExp("^" + pre + "((" + words2.join(")|(") + "))" + end2);
}
var octChar = "\\\\[0-7]{1,3}";
var hexChar = "\\\\x[A-Fa-f0-9]{1,2}";
var sChar = `\\\\[abefnrtv0%?'"\\\\]`;
var uChar = "([^\\u0027\\u005C\\uD800-\\uDFFF]|[\\uD800-\\uDFFF][\\uDC00-\\uDFFF])";
var asciiOperatorsList = [
  "[<>]:",
  "[<>=]=",
  "<<=?",
  ">>>?=?",
  "=>",
  "--?>",
  "<--[->]?",
  "\\/\\/",
  "\\.{2,3}",
  "[\\.\\\\%*+\\-<>!\\/^|&]=?",
  "\\?",
  "\\$",
  "~",
  ":"
];
var operators$3 = wordRegexp$a([
  "[<>]:",
  "[<>=]=",
  "[!=]==",
  "<<=?",
  ">>>?=?",
  "=>?",
  "--?>",
  "<--[->]?",
  "\\/\\/",
  "[\\\\%*+\\-<>!\\/^|&\\u00F7\\u22BB]=?",
  "\\?",
  "\\$",
  "~",
  ":",
  "\\u00D7",
  "\\u2208",
  "\\u2209",
  "\\u220B",
  "\\u220C",
  "\\u2218",
  "\\u221A",
  "\\u221B",
  "\\u2229",
  "\\u222A",
  "\\u2260",
  "\\u2264",
  "\\u2265",
  "\\u2286",
  "\\u2288",
  "\\u228A",
  "\\u22C5",
  "\\b(in|isa)\\b(?!.?\\()"
], "");
var delimiters = /^[;,()[\]{}]/;
var identifiers$6 = /^[_A-Za-z\u00A1-\u2217\u2219-\uFFFF][\w\u00A1-\u2217\u2219-\uFFFF]*!*/;
var chars = wordRegexp$a([octChar, hexChar, sChar, uChar], "'");
var openersList = [
  "begin",
  "function",
  "type",
  "struct",
  "immutable",
  "let",
  "macro",
  "for",
  "while",
  "quote",
  "if",
  "else",
  "elseif",
  "try",
  "finally",
  "catch",
  "do"
];
var closersList = ["end", "else", "elseif", "catch", "finally"];
var keywordsList = [
  "if",
  "else",
  "elseif",
  "while",
  "for",
  "begin",
  "let",
  "end",
  "do",
  "try",
  "catch",
  "finally",
  "return",
  "break",
  "continue",
  "global",
  "local",
  "const",
  "export",
  "import",
  "importall",
  "using",
  "function",
  "where",
  "macro",
  "module",
  "baremodule",
  "struct",
  "type",
  "mutable",
  "immutable",
  "quote",
  "typealias",
  "abstract",
  "primitive",
  "bitstype"
];
var builtinsList = ["true", "false", "nothing", "NaN", "Inf"];
var openers = wordRegexp$a(openersList);
var closers = wordRegexp$a(closersList);
var keywords$r = wordRegexp$a(keywordsList);
var builtins$6 = wordRegexp$a(builtinsList);
var macro = /^@[_A-Za-z\u00A1-\uFFFF][\w\u00A1-\uFFFF]*!*/;
var symbol = /^:[_A-Za-z\u00A1-\uFFFF][\w\u00A1-\uFFFF]*!*/;
var stringPrefixes$1 = /^(`|([_A-Za-z\u00A1-\uFFFF]*"("")?))/;
var macroOperators = wordRegexp$a(asciiOperatorsList, "", "@");
var symbolOperators$1 = wordRegexp$a(asciiOperatorsList, "", ":");
function inArray(state) {
  return state.nestedArrays > 0;
}
function inGenerator(state) {
  return state.nestedGenerators > 0;
}
function currentScope$1(state, n) {
  if (typeof n === "undefined") {
    n = 0;
  }
  if (state.scopes.length <= n) {
    return null;
  }
  return state.scopes[state.scopes.length - (n + 1)];
}
function tokenBase$v(stream, state) {
  if (stream.match("#=", false)) {
    state.tokenize = tokenComment$d;
    return state.tokenize(stream, state);
  }
  var leavingExpr = state.leavingExpr;
  if (stream.sol()) {
    leavingExpr = false;
  }
  state.leavingExpr = false;
  if (leavingExpr) {
    if (stream.match(/^'+/)) {
      return "operator";
    }
  }
  if (stream.match(/\.{4,}/)) {
    return "error";
  } else if (stream.match(/\.{1,3}/)) {
    return "operator";
  }
  if (stream.eatSpace()) {
    return null;
  }
  var ch2 = stream.peek();
  if (ch2 === "#") {
    stream.skipToEnd();
    return "comment";
  }
  if (ch2 === "[") {
    state.scopes.push("[");
    state.nestedArrays++;
  }
  if (ch2 === "(") {
    state.scopes.push("(");
    state.nestedGenerators++;
  }
  if (inArray(state) && ch2 === "]") {
    while (state.scopes.length && currentScope$1(state) !== "[") {
      state.scopes.pop();
    }
    state.scopes.pop();
    state.nestedArrays--;
    state.leavingExpr = true;
  }
  if (inGenerator(state) && ch2 === ")") {
    while (state.scopes.length && currentScope$1(state) !== "(") {
      state.scopes.pop();
    }
    state.scopes.pop();
    state.nestedGenerators--;
    state.leavingExpr = true;
  }
  if (inArray(state)) {
    if (state.lastToken == "end" && stream.match(":")) {
      return "operator";
    }
    if (stream.match("end")) {
      return "number";
    }
  }
  var match;
  if (match = stream.match(openers, false)) {
    state.scopes.push(match[0]);
  }
  if (stream.match(closers, false)) {
    state.scopes.pop();
  }
  if (stream.match(/^::(?![:\$])/)) {
    state.tokenize = tokenAnnotation;
    return state.tokenize(stream, state);
  }
  if (!leavingExpr && (stream.match(symbol) || stream.match(symbolOperators$1))) {
    return "builtin";
  }
  if (stream.match(operators$3)) {
    return "operator";
  }
  if (stream.match(/^\.?\d/, false)) {
    var imMatcher = RegExp(/^im\b/);
    var numberLiteral2 = false;
    if (stream.match(/^0x\.[0-9a-f_]+p[\+\-]?[_\d]+/i)) {
      numberLiteral2 = true;
    }
    if (stream.match(/^0x[0-9a-f_]+/i)) {
      numberLiteral2 = true;
    }
    if (stream.match(/^0b[01_]+/i)) {
      numberLiteral2 = true;
    }
    if (stream.match(/^0o[0-7_]+/i)) {
      numberLiteral2 = true;
    }
    if (stream.match(/^(?:(?:\d[_\d]*)?\.(?!\.)(?:\d[_\d]*)?|\d[_\d]*\.(?!\.)(?:\d[_\d]*))?([Eef][\+\-]?[_\d]+)?/i)) {
      numberLiteral2 = true;
    }
    if (stream.match(/^\d[_\d]*(e[\+\-]?\d+)?/i)) {
      numberLiteral2 = true;
    }
    if (numberLiteral2) {
      stream.match(imMatcher);
      state.leavingExpr = true;
      return "number";
    }
  }
  if (stream.match("'")) {
    state.tokenize = tokenChar;
    return state.tokenize(stream, state);
  }
  if (stream.match(stringPrefixes$1)) {
    state.tokenize = tokenStringFactory$1(stream.current());
    return state.tokenize(stream, state);
  }
  if (stream.match(macro) || stream.match(macroOperators)) {
    return "meta";
  }
  if (stream.match(delimiters)) {
    return null;
  }
  if (stream.match(keywords$r)) {
    return "keyword";
  }
  if (stream.match(builtins$6)) {
    return "builtin";
  }
  var isDefinition = state.isDefinition || state.lastToken == "function" || state.lastToken == "macro" || state.lastToken == "type" || state.lastToken == "struct" || state.lastToken == "immutable";
  if (stream.match(identifiers$6)) {
    if (isDefinition) {
      if (stream.peek() === ".") {
        state.isDefinition = true;
        return "variable";
      }
      state.isDefinition = false;
      return "def";
    }
    state.leavingExpr = true;
    return "variable";
  }
  stream.next();
  return "error";
}
function tokenAnnotation(stream, state) {
  stream.match(/.*?(?=[,;{}()=\s]|$)/);
  if (stream.match("{")) {
    state.nestedParameters++;
  } else if (stream.match("}") && state.nestedParameters > 0) {
    state.nestedParameters--;
  }
  if (state.nestedParameters > 0) {
    stream.match(/.*?(?={|})/) || stream.next();
  } else if (state.nestedParameters == 0) {
    state.tokenize = tokenBase$v;
  }
  return "builtin";
}
function tokenComment$d(stream, state) {
  if (stream.match("#=")) {
    state.nestedComments++;
  }
  if (!stream.match(/.*?(?=(#=|=#))/)) {
    stream.skipToEnd();
  }
  if (stream.match("=#")) {
    state.nestedComments--;
    if (state.nestedComments == 0)
      state.tokenize = tokenBase$v;
  }
  return "comment";
}
function tokenChar(stream, state) {
  var isChar = false, match;
  if (stream.match(chars)) {
    isChar = true;
  } else if (match = stream.match(/\\u([a-f0-9]{1,4})(?=')/i)) {
    var value = parseInt(match[1], 16);
    if (value <= 55295 || value >= 57344) {
      isChar = true;
      stream.next();
    }
  } else if (match = stream.match(/\\U([A-Fa-f0-9]{5,8})(?=')/)) {
    var value = parseInt(match[1], 16);
    if (value <= 1114111) {
      isChar = true;
      stream.next();
    }
  }
  if (isChar) {
    state.leavingExpr = true;
    state.tokenize = tokenBase$v;
    return "string";
  }
  if (!stream.match(/^[^']+(?=')/)) {
    stream.skipToEnd();
  }
  if (stream.match("'")) {
    state.tokenize = tokenBase$v;
  }
  return "error";
}
function tokenStringFactory$1(delimiter2) {
  if (delimiter2.substr(-3) === '"""') {
    delimiter2 = '"""';
  } else if (delimiter2.substr(-1) === '"') {
    delimiter2 = '"';
  }
  function tokenString3(stream, state) {
    if (stream.eat("\\")) {
      stream.next();
    } else if (stream.match(delimiter2)) {
      state.tokenize = tokenBase$v;
      state.leavingExpr = true;
      return "string";
    } else {
      stream.eat(/[`"]/);
    }
    stream.eatWhile(/[^\\`"]/);
    return "string";
  }
  return tokenString3;
}
const julia = {
  name: "julia",
  startState: function() {
    return {
      tokenize: tokenBase$v,
      scopes: [],
      lastToken: null,
      leavingExpr: false,
      isDefinition: false,
      nestedArrays: 0,
      nestedComments: 0,
      nestedGenerators: 0,
      nestedParameters: 0,
      firstParenPos: -1
    };
  },
  token: function(stream, state) {
    var style2 = state.tokenize(stream, state);
    var current = stream.current();
    if (current && style2) {
      state.lastToken = current;
    }
    return style2;
  },
  indent: function(state, textAfter, cx2) {
    var delta = 0;
    if (textAfter === "]" || textAfter === ")" || /^end\b/.test(textAfter) || /^else/.test(textAfter) || /^catch\b/.test(textAfter) || /^elseif\b/.test(textAfter) || /^finally/.test(textAfter)) {
      delta = -1;
    }
    return (state.scopes.length + delta) * cx2.unit;
  },
  languageData: {
    indentOnInput: /^\s*(end|else|catch|finally)\b$/,
    commentTokens: { line: "#", block: { open: "#=", close: "=#" } },
    closeBrackets: { brackets: ["(", "[", "{", '"'] },
    autocomplete: keywordsList.concat(builtinsList)
  }
};
const julia$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  julia
});
var tokenBase$u = function(stream, state) {
  var next_rule = state.next || "start";
  {
    state.next = state.next;
    var nr = Rules[next_rule];
    if (nr.splice) {
      for (var i$ = 0; i$ < nr.length; ++i$) {
        var r2 = nr[i$];
        if (r2.regex && stream.match(r2.regex)) {
          state.next = r2.next || state.next;
          return r2.token;
        }
      }
      stream.next();
      return "error";
    }
    if (stream.match(r2 = Rules[next_rule])) {
      if (r2.regex && stream.match(r2.regex)) {
        state.next = r2.next;
        return r2.token;
      } else {
        stream.next();
        return "error";
      }
    }
  }
  stream.next();
  return "error";
};
var identifier$1 = "(?![\\d\\s])[$\\w\\xAA-\\uFFDC](?:(?!\\s)[$\\w\\xAA-\\uFFDC]|-[A-Za-z])*";
var indenter = RegExp("(?:[({[=:]|[-~]>|\\b(?:e(?:lse|xport)|d(?:o|efault)|t(?:ry|hen)|finally|import(?:\\s*all)?|const|var|let|new|catch(?:\\s*" + identifier$1 + ")?))\\s*$");
var keywordend = "(?![$\\w]|-[A-Za-z]|\\s*:(?![:=]))";
var stringfill = {
  token: "string",
  regex: ".+"
};
var Rules = {
  start: [
    {
      token: "docComment",
      regex: "/\\*",
      next: "comment"
    },
    {
      token: "comment",
      regex: "#.*"
    },
    {
      token: "keyword",
      regex: "(?:t(?:h(?:is|row|en)|ry|ypeof!?)|c(?:on(?:tinue|st)|a(?:se|tch)|lass)|i(?:n(?:stanceof)?|mp(?:ort(?:\\s+all)?|lements)|[fs])|d(?:e(?:fault|lete|bugger)|o)|f(?:or(?:\\s+own)?|inally|unction)|s(?:uper|witch)|e(?:lse|x(?:tends|port)|val)|a(?:nd|rguments)|n(?:ew|ot)|un(?:less|til)|w(?:hile|ith)|o[fr]|return|break|let|var|loop)" + keywordend
    },
    {
      token: "atom",
      regex: "(?:true|false|yes|no|on|off|null|void|undefined)" + keywordend
    },
    {
      token: "invalid",
      regex: "(?:p(?:ackage|r(?:ivate|otected)|ublic)|i(?:mplements|nterface)|enum|static|yield)" + keywordend
    },
    {
      token: "className.standard",
      regex: "(?:R(?:e(?:gExp|ferenceError)|angeError)|S(?:tring|yntaxError)|E(?:rror|valError)|Array|Boolean|Date|Function|Number|Object|TypeError|URIError)" + keywordend
    },
    {
      token: "variableName.function.standard",
      regex: "(?:is(?:NaN|Finite)|parse(?:Int|Float)|Math|JSON|(?:en|de)codeURI(?:Component)?)" + keywordend
    },
    {
      token: "variableName.standard",
      regex: "(?:t(?:hat|il|o)|f(?:rom|allthrough)|it|by|e)" + keywordend
    },
    {
      token: "variableName",
      regex: identifier$1 + "\\s*:(?![:=])"
    },
    {
      token: "variableName",
      regex: identifier$1
    },
    {
      token: "operatorKeyword",
      regex: "(?:\\.{3}|\\s+\\?)"
    },
    {
      token: "keyword",
      regex: "(?:@+|::|\\.\\.)",
      next: "key"
    },
    {
      token: "operatorKeyword",
      regex: "\\.\\s*",
      next: "key"
    },
    {
      token: "string",
      regex: "\\\\\\S[^\\s,;)}\\]]*"
    },
    {
      token: "docString",
      regex: "'''",
      next: "qdoc"
    },
    {
      token: "docString",
      regex: '"""',
      next: "qqdoc"
    },
    {
      token: "string",
      regex: "'",
      next: "qstring"
    },
    {
      token: "string",
      regex: '"',
      next: "qqstring"
    },
    {
      token: "string",
      regex: "`",
      next: "js"
    },
    {
      token: "string",
      regex: "<\\[",
      next: "words"
    },
    {
      token: "regexp",
      regex: "//",
      next: "heregex"
    },
    {
      token: "regexp",
      regex: "\\/(?:[^[\\/\\n\\\\]*(?:(?:\\\\.|\\[[^\\]\\n\\\\]*(?:\\\\.[^\\]\\n\\\\]*)*\\])[^[\\/\\n\\\\]*)*)\\/[gimy$]{0,4}",
      next: "key"
    },
    {
      token: "number",
      regex: "(?:0x[\\da-fA-F][\\da-fA-F_]*|(?:[2-9]|[12]\\d|3[0-6])r[\\da-zA-Z][\\da-zA-Z_]*|(?:\\d[\\d_]*(?:\\.\\d[\\d_]*)?|\\.\\d[\\d_]*)(?:e[+-]?\\d[\\d_]*)?[\\w$]*)"
    },
    {
      token: "paren",
      regex: "[({[]"
    },
    {
      token: "paren",
      regex: "[)}\\]]",
      next: "key"
    },
    {
      token: "operatorKeyword",
      regex: "\\S+"
    },
    {
      token: "content",
      regex: "\\s+"
    }
  ],
  heregex: [
    {
      token: "regexp",
      regex: ".*?//[gimy$?]{0,4}",
      next: "start"
    },
    {
      token: "regexp",
      regex: "\\s*#{"
    },
    {
      token: "comment",
      regex: "\\s+(?:#.*)?"
    },
    {
      token: "regexp",
      regex: "\\S+"
    }
  ],
  key: [
    {
      token: "operatorKeyword",
      regex: "[.?@!]+"
    },
    {
      token: "variableName",
      regex: identifier$1,
      next: "start"
    },
    {
      token: "content",
      regex: "",
      next: "start"
    }
  ],
  comment: [
    {
      token: "docComment",
      regex: ".*?\\*/",
      next: "start"
    },
    {
      token: "docComment",
      regex: ".+"
    }
  ],
  qdoc: [
    {
      token: "string",
      regex: ".*?'''",
      next: "key"
    },
    stringfill
  ],
  qqdoc: [
    {
      token: "string",
      regex: '.*?"""',
      next: "key"
    },
    stringfill
  ],
  qstring: [
    {
      token: "string",
      regex: "[^\\\\']*(?:\\\\.[^\\\\']*)*'",
      next: "key"
    },
    stringfill
  ],
  qqstring: [
    {
      token: "string",
      regex: '[^\\\\"]*(?:\\\\.[^\\\\"]*)*"',
      next: "key"
    },
    stringfill
  ],
  js: [
    {
      token: "string",
      regex: "[^\\\\`]*(?:\\\\.[^\\\\`]*)*`",
      next: "key"
    },
    stringfill
  ],
  words: [
    {
      token: "string",
      regex: ".*?\\]>",
      next: "key"
    },
    stringfill
  ]
};
for (var idx in Rules) {
  var r$2 = Rules[idx];
  if (r$2.splice) {
    for (var i = 0, len = r$2.length; i < len; ++i) {
      var rr = r$2[i];
      if (typeof rr.regex === "string") {
        Rules[idx][i].regex = new RegExp("^" + rr.regex);
      }
    }
  } else if (typeof rr.regex === "string") {
    Rules[idx].regex = new RegExp("^" + r$2.regex);
  }
}
const liveScript = {
  name: "livescript",
  startState: function() {
    return {
      next: "start",
      lastToken: { style: null, indent: 0, content: "" }
    };
  },
  token: function(stream, state) {
    while (stream.pos == stream.start)
      var style2 = tokenBase$u(stream, state);
    state.lastToken = {
      style: style2,
      indent: stream.indentation(),
      content: stream.current()
    };
    return style2.replace(/\./g, " ");
  },
  indent: function(state) {
    var indentation = state.lastToken.indent;
    if (state.lastToken.content.match(indenter)) {
      indentation += 2;
    }
    return indentation;
  }
};
const livescript = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  liveScript
});
function prefixRE(words2) {
  return new RegExp("^(?:" + words2.join("|") + ")", "i");
}
function wordRE(words2) {
  return new RegExp("^(?:" + words2.join("|") + ")$", "i");
}
var builtins$5 = wordRE([
  "_G",
  "_VERSION",
  "assert",
  "collectgarbage",
  "dofile",
  "error",
  "getfenv",
  "getmetatable",
  "ipairs",
  "load",
  "loadfile",
  "loadstring",
  "module",
  "next",
  "pairs",
  "pcall",
  "print",
  "rawequal",
  "rawget",
  "rawset",
  "require",
  "select",
  "setfenv",
  "setmetatable",
  "tonumber",
  "tostring",
  "type",
  "unpack",
  "xpcall",
  "coroutine.create",
  "coroutine.resume",
  "coroutine.running",
  "coroutine.status",
  "coroutine.wrap",
  "coroutine.yield",
  "debug.debug",
  "debug.getfenv",
  "debug.gethook",
  "debug.getinfo",
  "debug.getlocal",
  "debug.getmetatable",
  "debug.getregistry",
  "debug.getupvalue",
  "debug.setfenv",
  "debug.sethook",
  "debug.setlocal",
  "debug.setmetatable",
  "debug.setupvalue",
  "debug.traceback",
  "close",
  "flush",
  "lines",
  "read",
  "seek",
  "setvbuf",
  "write",
  "io.close",
  "io.flush",
  "io.input",
  "io.lines",
  "io.open",
  "io.output",
  "io.popen",
  "io.read",
  "io.stderr",
  "io.stdin",
  "io.stdout",
  "io.tmpfile",
  "io.type",
  "io.write",
  "math.abs",
  "math.acos",
  "math.asin",
  "math.atan",
  "math.atan2",
  "math.ceil",
  "math.cos",
  "math.cosh",
  "math.deg",
  "math.exp",
  "math.floor",
  "math.fmod",
  "math.frexp",
  "math.huge",
  "math.ldexp",
  "math.log",
  "math.log10",
  "math.max",
  "math.min",
  "math.modf",
  "math.pi",
  "math.pow",
  "math.rad",
  "math.random",
  "math.randomseed",
  "math.sin",
  "math.sinh",
  "math.sqrt",
  "math.tan",
  "math.tanh",
  "os.clock",
  "os.date",
  "os.difftime",
  "os.execute",
  "os.exit",
  "os.getenv",
  "os.remove",
  "os.rename",
  "os.setlocale",
  "os.time",
  "os.tmpname",
  "package.cpath",
  "package.loaded",
  "package.loaders",
  "package.loadlib",
  "package.path",
  "package.preload",
  "package.seeall",
  "string.byte",
  "string.char",
  "string.dump",
  "string.find",
  "string.format",
  "string.gmatch",
  "string.gsub",
  "string.len",
  "string.lower",
  "string.match",
  "string.rep",
  "string.reverse",
  "string.sub",
  "string.upper",
  "table.concat",
  "table.insert",
  "table.maxn",
  "table.remove",
  "table.sort"
]);
var keywords$q = wordRE([
  "and",
  "break",
  "elseif",
  "false",
  "nil",
  "not",
  "or",
  "return",
  "true",
  "function",
  "end",
  "if",
  "then",
  "else",
  "do",
  "while",
  "repeat",
  "until",
  "for",
  "in",
  "local"
]);
var indentTokens = wordRE(["function", "if", "repeat", "do", "\\(", "{"]);
var dedentTokens = wordRE(["end", "until", "\\)", "}"]);
var dedentPartial = prefixRE(["end", "until", "\\)", "}", "else", "elseif"]);
function readBracket(stream) {
  var level = 0;
  while (stream.eat("=")) ++level;
  stream.eat("[");
  return level;
}
function normal(stream, state) {
  var ch2 = stream.next();
  if (ch2 == "-" && stream.eat("-")) {
    if (stream.eat("[") && /[\[=]/.test(stream.peek()))
      return (state.cur = bracketed(readBracket(stream), "comment"))(stream, state);
    stream.skipToEnd();
    return "comment";
  }
  if (ch2 == '"' || ch2 == "'")
    return (state.cur = string(ch2))(stream, state);
  if (ch2 == "[" && /[\[=]/.test(stream.peek()))
    return (state.cur = bracketed(readBracket(stream), "string"))(stream, state);
  if (/\d/.test(ch2)) {
    stream.eatWhile(/[\w.%]/);
    return "number";
  }
  if (/[\w_]/.test(ch2)) {
    stream.eatWhile(/[\w\\\-_.]/);
    return "variable";
  }
  return null;
}
function bracketed(level, style2) {
  return function(stream, state) {
    var curlev = null, ch2;
    while ((ch2 = stream.next()) != null) {
      if (curlev == null) {
        if (ch2 == "]") curlev = 0;
      } else if (ch2 == "=") ++curlev;
      else if (ch2 == "]" && curlev == level) {
        state.cur = normal;
        break;
      } else curlev = null;
    }
    return style2;
  };
}
function string(quote2) {
  return function(stream, state) {
    var escaped = false, ch2;
    while ((ch2 = stream.next()) != null) {
      if (ch2 == quote2 && !escaped) break;
      escaped = !escaped && ch2 == "\\";
    }
    if (!escaped) state.cur = normal;
    return "string";
  };
}
const lua = {
  name: "lua",
  startState: function() {
    return { basecol: 0, indentDepth: 0, cur: normal };
  },
  token: function(stream, state) {
    if (stream.eatSpace()) return null;
    var style2 = state.cur(stream, state);
    var word = stream.current();
    if (style2 == "variable") {
      if (keywords$q.test(word)) style2 = "keyword";
      else if (builtins$5.test(word)) style2 = "builtin";
    }
    if (style2 != "comment" && style2 != "string") {
      if (indentTokens.test(word)) ++state.indentDepth;
      else if (dedentTokens.test(word)) --state.indentDepth;
    }
    return style2;
  },
  indent: function(state, textAfter, cx2) {
    var closing2 = dedentPartial.test(textAfter);
    return state.basecol + cx2.unit * (state.indentDepth - (closing2 ? 1 : 0));
  },
  languageData: {
    indentOnInput: /^\s*(?:end|until|else|\)|\})$/,
    commentTokens: { line: "--", block: { open: "--[[", close: "]]--" } }
  }
};
const lua$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  lua
});
function parseWords$2(str) {
  var obj = {}, words2 = str.split(" ");
  for (var i2 = 0; i2 < words2.length; ++i2) obj[words2[i2]] = true;
  return obj;
}
var specials$1 = parseWords$2("$! $$ $& $? $+ $abook $abs $active $activecid $activewid $address $addtok $agent $agentname $agentstat $agentver $alias $and $anick $ansi2mirc $aop $appactive $appstate $asc $asctime $asin $atan $avoice $away $awaymsg $awaytime $banmask $base $bfind $binoff $biton $bnick $bvar $bytes $calc $cb $cd $ceil $chan $chanmodes $chantypes $chat $chr $cid $clevel $click $cmdbox $cmdline $cnick $color $com $comcall $comchan $comerr $compact $compress $comval $cos $count $cr $crc $creq $crlf $ctime $ctimer $ctrlenter $date $day $daylight $dbuh $dbuw $dccignore $dccport $dde $ddename $debug $decode $decompress $deltok $devent $dialog $did $didreg $didtok $didwm $disk $dlevel $dll $dllcall $dname $dns $duration $ebeeps $editbox $emailaddr $encode $error $eval $event $exist $feof $ferr $fgetc $file $filename $filtered $finddir $finddirn $findfile $findfilen $findtok $fline $floor $fopen $fread $fserve $fulladdress $fulldate $fullname $fullscreen $get $getdir $getdot $gettok $gmt $group $halted $hash $height $hfind $hget $highlight $hnick $hotline $hotlinepos $ial $ialchan $ibl $idle $iel $ifmatch $ignore $iif $iil $inelipse $ini $inmidi $inpaste $inpoly $input $inrect $inroundrect $insong $instok $int $inwave $ip $isalias $isbit $isdde $isdir $isfile $isid $islower $istok $isupper $keychar $keyrpt $keyval $knick $lactive $lactivecid $lactivewid $left $len $level $lf $line $lines $link $lock $lock $locked $log $logstamp $logstampfmt $longfn $longip $lower $ltimer $maddress $mask $matchkey $matchtok $md5 $me $menu $menubar $menucontext $menutype $mid $middir $mircdir $mircexe $mircini $mklogfn $mnick $mode $modefirst $modelast $modespl $mouse $msfile $network $newnick $nick $nofile $nopath $noqt $not $notags $notify $null $numeric $numok $oline $onpoly $opnick $or $ord $os $passivedcc $pic $play $pnick $port $portable $portfree $pos $prefix $prop $protect $puttok $qt $query $rand $r $rawmsg $read $readomo $readn $regex $regml $regsub $regsubex $remove $remtok $replace $replacex $reptok $result $rgb $right $round $scid $scon $script $scriptdir $scriptline $sdir $send $server $serverip $sfile $sha1 $shortfn $show $signal $sin $site $sline $snick $snicks $snotify $sock $sockbr $sockerr $sockname $sorttok $sound $sqrt $ssl $sreq $sslready $status $strip $str $stripped $syle $submenu $switchbar $tan $target $ticks $time $timer $timestamp $timestampfmt $timezone $tip $titlebar $toolbar $treebar $trust $ulevel $ulist $upper $uptime $url $usermode $v1 $v2 $var $vcmd $vcmdstat $vcmdver $version $vnick $vol $wid $width $wildsite $wildtok $window $wrap $xor");
var keywords$p = parseWords$2("abook ajinvite alias aline ame amsg anick aop auser autojoin avoice away background ban bcopy beep bread break breplace bset btrunc bunset bwrite channel clear clearall cline clipboard close cnick color comclose comopen comreg continue copy creq ctcpreply ctcps dcc dccserver dde ddeserver debug dec describe dialog did didtok disable disconnect dlevel dline dll dns dqwindow drawcopy drawdot drawfill drawline drawpic drawrect drawreplace drawrot drawsave drawscroll drawtext ebeeps echo editbox emailaddr enable events exit fclose filter findtext finger firewall flash flist flood flush flushini font fopen fseek fsend fserve fullname fwrite ghide gload gmove gopts goto gplay gpoint gqreq groups gshow gsize gstop gtalk gunload hadd halt haltdef hdec hdel help hfree hinc hload hmake hop hsave ial ialclear ialmark identd if ignore iline inc invite iuser join kick linesep links list load loadbuf localinfo log mdi me menubar mkdir mnick mode msg nick noop notice notify omsg onotice part partall pdcc perform play playctrl pop protect pvoice qme qmsg query queryn quit raw reload remini remote remove rename renwin reseterror resetidle return rlevel rline rmdir run ruser save savebuf saveini say scid scon server set showmirc signam sline sockaccept sockclose socklist socklisten sockmark sockopen sockpause sockread sockrename sockudp sockwrite sound speak splay sreq strip switchbar timer timestamp titlebar tnick tokenize toolbar topic tray treebar ulist unload unset unsetall updatenl url uwho var vcadd vcmd vcrem vol while whois window winhelp write writeint if isalnum isalpha isaop isavoice isban ischan ishop isignore isin isincs isletter islower isnotify isnum ison isop isprotect isreg isupper isvoice iswm iswmcs elseif else goto menu nicklist status title icon size option text edit button check radio box scroll list combo link tab item");
var functions$2 = parseWords$2("if elseif else and not or eq ne in ni for foreach while switch");
var isOperatorChar$8 = /[+\-*&%=<>!?^\/\|]/;
function chain$6(stream, state, f) {
  state.tokenize = f;
  return f(stream, state);
}
function tokenBase$t(stream, state) {
  var beforeParams = state.beforeParams;
  state.beforeParams = false;
  var ch2 = stream.next();
  if (/[\[\]{}\(\),\.]/.test(ch2)) {
    if (ch2 == "(" && beforeParams) state.inParams = true;
    else if (ch2 == ")") state.inParams = false;
    return null;
  } else if (/\d/.test(ch2)) {
    stream.eatWhile(/[\w\.]/);
    return "number";
  } else if (ch2 == "\\") {
    stream.eat("\\");
    stream.eat(/./);
    return "number";
  } else if (ch2 == "/" && stream.eat("*")) {
    return chain$6(stream, state, tokenComment$c);
  } else if (ch2 == ";" && stream.match(/ *\( *\(/)) {
    return chain$6(stream, state, tokenUnparsed$2);
  } else if (ch2 == ";" && !state.inParams) {
    stream.skipToEnd();
    return "comment";
  } else if (ch2 == '"') {
    stream.eat(/"/);
    return "keyword";
  } else if (ch2 == "$") {
    stream.eatWhile(/[$_a-z0-9A-Z\.:]/);
    if (specials$1 && specials$1.propertyIsEnumerable(stream.current().toLowerCase())) {
      return "keyword";
    } else {
      state.beforeParams = true;
      return "builtin";
    }
  } else if (ch2 == "%") {
    stream.eatWhile(/[^,\s()]/);
    state.beforeParams = true;
    return "string";
  } else if (isOperatorChar$8.test(ch2)) {
    stream.eatWhile(isOperatorChar$8);
    return "operator";
  } else {
    stream.eatWhile(/[\w\$_{}]/);
    var word = stream.current().toLowerCase();
    if (keywords$p && keywords$p.propertyIsEnumerable(word))
      return "keyword";
    if (functions$2 && functions$2.propertyIsEnumerable(word)) {
      state.beforeParams = true;
      return "keyword";
    }
    return null;
  }
}
function tokenComment$c(stream, state) {
  var maybeEnd = false, ch2;
  while (ch2 = stream.next()) {
    if (ch2 == "/" && maybeEnd) {
      state.tokenize = tokenBase$t;
      break;
    }
    maybeEnd = ch2 == "*";
  }
  return "comment";
}
function tokenUnparsed$2(stream, state) {
  var maybeEnd = 0, ch2;
  while (ch2 = stream.next()) {
    if (ch2 == ";" && maybeEnd == 2) {
      state.tokenize = tokenBase$t;
      break;
    }
    if (ch2 == ")")
      maybeEnd++;
    else if (ch2 != " ")
      maybeEnd = 0;
  }
  return "meta";
}
const mirc = {
  name: "mirc",
  startState: function() {
    return {
      tokenize: tokenBase$t,
      beforeParams: false,
      inParams: false
    };
  },
  token: function(stream, state) {
    if (stream.eatSpace()) return null;
    return state.tokenize(stream, state);
  }
};
const mirc$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  mirc
});
var Identifier = "[a-zA-Z\\$][a-zA-Z0-9\\$]*";
var pBase = "(?:\\d+)";
var pFloat = "(?:\\.\\d+|\\d+\\.\\d*|\\d+)";
var pFloatBase = "(?:\\.\\w+|\\w+\\.\\w*|\\w+)";
var pPrecision = "(?:`(?:`?" + pFloat + ")?)";
var reBaseForm = new RegExp("(?:" + pBase + "(?:\\^\\^" + pFloatBase + pPrecision + "?(?:\\*\\^[+-]?\\d+)?))");
var reFloatForm$1 = new RegExp("(?:" + pFloat + pPrecision + "?(?:\\*\\^[+-]?\\d+)?)");
var reIdInContext = new RegExp("(?:`?)(?:" + Identifier + ")(?:`(?:" + Identifier + "))*(?:`?)");
function tokenBase$s(stream, state) {
  var ch2;
  ch2 = stream.next();
  if (ch2 === '"') {
    state.tokenize = tokenString$k;
    return state.tokenize(stream, state);
  }
  if (ch2 === "(") {
    if (stream.eat("*")) {
      state.commentLevel++;
      state.tokenize = tokenComment$b;
      return state.tokenize(stream, state);
    }
  }
  stream.backUp(1);
  if (stream.match(reBaseForm, true, false)) {
    return "number";
  }
  if (stream.match(reFloatForm$1, true, false)) {
    return "number";
  }
  if (stream.match(/(?:In|Out)\[[0-9]*\]/, true, false)) {
    return "atom";
  }
  if (stream.match(/([a-zA-Z\$][a-zA-Z0-9\$]*(?:`[a-zA-Z0-9\$]+)*::usage)/, true, false)) {
    return "meta";
  }
  if (stream.match(/([a-zA-Z\$][a-zA-Z0-9\$]*(?:`[a-zA-Z0-9\$]+)*::[a-zA-Z\$][a-zA-Z0-9\$]*):?/, true, false)) {
    return "string.special";
  }
  if (stream.match(/([a-zA-Z\$][a-zA-Z0-9\$]*\s*:)(?:(?:[a-zA-Z\$][a-zA-Z0-9\$]*)|(?:[^:=>~@\^\&\*\)\[\]'\?,\|])).*/, true, false)) {
    return "variableName.special";
  }
  if (stream.match(/[a-zA-Z\$][a-zA-Z0-9\$]*_+[a-zA-Z\$][a-zA-Z0-9\$]*/, true, false)) {
    return "variableName.special";
  }
  if (stream.match(/[a-zA-Z\$][a-zA-Z0-9\$]*_+/, true, false)) {
    return "variableName.special";
  }
  if (stream.match(/_+[a-zA-Z\$][a-zA-Z0-9\$]*/, true, false)) {
    return "variableName.special";
  }
  if (stream.match(/\\\[[a-zA-Z\$][a-zA-Z0-9\$]*\]/, true, false)) {
    return "character";
  }
  if (stream.match(/(?:\[|\]|{|}|\(|\))/, true, false)) {
    return "bracket";
  }
  if (stream.match(/(?:#[a-zA-Z\$][a-zA-Z0-9\$]*|#+[0-9]?)/, true, false)) {
    return "variableName.constant";
  }
  if (stream.match(reIdInContext, true, false)) {
    return "keyword";
  }
  if (stream.match(/(?:\\|\+|\-|\*|\/|,|;|\.|:|@|~|=|>|<|&|\||_|`|'|\^|\?|!|%)/, true, false)) {
    return "operator";
  }
  stream.next();
  return "error";
}
function tokenString$k(stream, state) {
  var next2, end2 = false, escaped = false;
  while ((next2 = stream.next()) != null) {
    if (next2 === '"' && !escaped) {
      end2 = true;
      break;
    }
    escaped = !escaped && next2 === "\\";
  }
  if (end2 && !escaped) {
    state.tokenize = tokenBase$s;
  }
  return "string";
}
function tokenComment$b(stream, state) {
  var prev, next2;
  while (state.commentLevel > 0 && (next2 = stream.next()) != null) {
    if (prev === "(" && next2 === "*") state.commentLevel++;
    if (prev === "*" && next2 === ")") state.commentLevel--;
    prev = next2;
  }
  if (state.commentLevel <= 0) {
    state.tokenize = tokenBase$s;
  }
  return "comment";
}
const mathematica = {
  name: "mathematica",
  startState: function() {
    return { tokenize: tokenBase$s, commentLevel: 0 };
  },
  token: function(stream, state) {
    if (stream.eatSpace()) return null;
    return state.tokenize(stream, state);
  },
  languageData: {
    commentTokens: { block: { open: "(*", close: "*)" } }
  }
};
const mathematica$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  mathematica
});
function words$c(str) {
  var obj = {}, words2 = str.split(" ");
  for (var i2 = 0; i2 < words2.length; ++i2)
    obj[words2[i2]] = true;
  return obj;
}
var keywords$o = words$c("algorithm and annotation assert block break class connect connector constant constrainedby der discrete each else elseif elsewhen encapsulated end enumeration equation expandable extends external false final flow for function if import impure in initial inner input loop model not operator or outer output package parameter partial protected public pure record redeclare replaceable return stream then true type when while within");
var builtin$1 = words$c("abs acos actualStream asin atan atan2 cardinality ceil cos cosh delay div edge exp floor getInstanceName homotopy inStream integer log log10 mod pre reinit rem semiLinear sign sin sinh spatialDistribution sqrt tan tanh");
var atoms$7 = words$c("Real Boolean Integer String");
var completions = [].concat(Object.keys(keywords$o), Object.keys(builtin$1), Object.keys(atoms$7));
var isSingleOperatorChar$1 = /[;=\(:\),{}.*<>+\-\/^\[\]]/;
var isDoubleOperatorChar$1 = /(:=|<=|>=|==|<>|\.\+|\.\-|\.\*|\.\/|\.\^)/;
var isDigit = /[0-9]/;
var isNonDigit = /[_a-zA-Z]/;
function tokenLineComment$1(stream, state) {
  stream.skipToEnd();
  state.tokenize = null;
  return "comment";
}
function tokenBlockComment$1(stream, state) {
  var maybeEnd = false, ch2;
  while (ch2 = stream.next()) {
    if (maybeEnd && ch2 == "/") {
      state.tokenize = null;
      break;
    }
    maybeEnd = ch2 == "*";
  }
  return "comment";
}
function tokenString$j(stream, state) {
  var escaped = false, ch2;
  while ((ch2 = stream.next()) != null) {
    if (ch2 == '"' && !escaped) {
      state.tokenize = null;
      state.sol = false;
      break;
    }
    escaped = !escaped && ch2 == "\\";
  }
  return "string";
}
function tokenIdent(stream, state) {
  stream.eatWhile(isDigit);
  while (stream.eat(isDigit) || stream.eat(isNonDigit)) {
  }
  var cur = stream.current();
  if (state.sol && (cur == "package" || cur == "model" || cur == "when" || cur == "connector")) state.level++;
  else if (state.sol && cur == "end" && state.level > 0) state.level--;
  state.tokenize = null;
  state.sol = false;
  if (keywords$o.propertyIsEnumerable(cur)) return "keyword";
  else if (builtin$1.propertyIsEnumerable(cur)) return "builtin";
  else if (atoms$7.propertyIsEnumerable(cur)) return "atom";
  else return "variable";
}
function tokenQIdent(stream, state) {
  while (stream.eat(/[^']/)) {
  }
  state.tokenize = null;
  state.sol = false;
  if (stream.eat("'"))
    return "variable";
  else
    return "error";
}
function tokenUnsignedNumber(stream, state) {
  stream.eatWhile(isDigit);
  if (stream.eat(".")) {
    stream.eatWhile(isDigit);
  }
  if (stream.eat("e") || stream.eat("E")) {
    if (!stream.eat("-"))
      stream.eat("+");
    stream.eatWhile(isDigit);
  }
  state.tokenize = null;
  state.sol = false;
  return "number";
}
const modelica = {
  name: "modelica",
  startState: function() {
    return {
      tokenize: null,
      level: 0,
      sol: true
    };
  },
  token: function(stream, state) {
    if (state.tokenize != null) {
      return state.tokenize(stream, state);
    }
    if (stream.sol()) {
      state.sol = true;
    }
    if (stream.eatSpace()) {
      state.tokenize = null;
      return null;
    }
    var ch2 = stream.next();
    if (ch2 == "/" && stream.eat("/")) {
      state.tokenize = tokenLineComment$1;
    } else if (ch2 == "/" && stream.eat("*")) {
      state.tokenize = tokenBlockComment$1;
    } else if (isDoubleOperatorChar$1.test(ch2 + stream.peek())) {
      stream.next();
      state.tokenize = null;
      return "operator";
    } else if (isSingleOperatorChar$1.test(ch2)) {
      state.tokenize = null;
      return "operator";
    } else if (isNonDigit.test(ch2)) {
      state.tokenize = tokenIdent;
    } else if (ch2 == "'" && stream.peek() && stream.peek() != "'") {
      state.tokenize = tokenQIdent;
    } else if (ch2 == '"') {
      state.tokenize = tokenString$j;
    } else if (isDigit.test(ch2)) {
      state.tokenize = tokenUnsignedNumber;
    } else {
      state.tokenize = null;
      return "error";
    }
    return state.tokenize(stream, state);
  },
  indent: function(state, textAfter, cx2) {
    if (state.tokenize != null) return null;
    var level = state.level;
    if (/(algorithm)/.test(textAfter)) level--;
    if (/(equation)/.test(textAfter)) level--;
    if (/(initial algorithm)/.test(textAfter)) level--;
    if (/(initial equation)/.test(textAfter)) level--;
    if (/(end)/.test(textAfter)) level--;
    if (level > 0)
      return cx2.unit * level;
    else
      return 0;
  },
  languageData: {
    commentTokens: { line: "//", block: { open: "/*", close: "*/" } },
    autocomplete: completions
  }
};
const modelica$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  modelica
});
function wordRegexp$9(words2) {
  return new RegExp("^((" + words2.join(")|(") + "))\\b", "i");
}
var singleOperators$4 = new RegExp("^[\\+\\-\\*/&#!_?\\\\<>=\\'\\[\\]]");
var doubleOperators$3 = new RegExp("^(('=)|(<=)|(>=)|('>)|('<)|([[)|(]])|(^$))");
var singleDelimiters$2 = new RegExp("^[\\.,:]");
var brackets = new RegExp("[()]");
var identifiers$5 = new RegExp("^[%A-Za-z][A-Za-z0-9]*");
var commandKeywords = ["break", "close", "do", "else", "for", "goto", "halt", "hang", "if", "job", "kill", "lock", "merge", "new", "open", "quit", "read", "set", "tcommit", "trollback", "tstart", "use", "view", "write", "xecute", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "q", "r", "s", "tc", "tro", "ts", "u", "v", "w", "x"];
var intrinsicFuncsWords = ["\\$ascii", "\\$char", "\\$data", "\\$ecode", "\\$estack", "\\$etrap", "\\$extract", "\\$find", "\\$fnumber", "\\$get", "\\$horolog", "\\$io", "\\$increment", "\\$job", "\\$justify", "\\$length", "\\$name", "\\$next", "\\$order", "\\$piece", "\\$qlength", "\\$qsubscript", "\\$query", "\\$quit", "\\$random", "\\$reverse", "\\$select", "\\$stack", "\\$test", "\\$text", "\\$translate", "\\$view", "\\$x", "\\$y", "\\$a", "\\$c", "\\$d", "\\$e", "\\$ec", "\\$es", "\\$et", "\\$f", "\\$fn", "\\$g", "\\$h", "\\$i", "\\$j", "\\$l", "\\$n", "\\$na", "\\$o", "\\$p", "\\$q", "\\$ql", "\\$qs", "\\$r", "\\$re", "\\$s", "\\$st", "\\$t", "\\$tr", "\\$v", "\\$z"];
var intrinsicFuncs = wordRegexp$9(intrinsicFuncsWords);
var command = wordRegexp$9(commandKeywords);
function tokenBase$r(stream, state) {
  if (stream.sol()) {
    state.label = true;
    state.commandMode = 0;
  }
  var ch2 = stream.peek();
  if (ch2 == " " || ch2 == "	") {
    state.label = false;
    if (state.commandMode == 0)
      state.commandMode = 1;
    else if (state.commandMode < 0 || state.commandMode == 2)
      state.commandMode = 0;
  } else if (ch2 != "." && state.commandMode > 0) {
    if (ch2 == ":")
      state.commandMode = -1;
    else
      state.commandMode = 2;
  }
  if (ch2 === "(" || ch2 === "	")
    state.label = false;
  if (ch2 === ";") {
    stream.skipToEnd();
    return "comment";
  }
  if (stream.match(/^[-+]?\d+(\.\d+)?([eE][-+]?\d+)?/))
    return "number";
  if (ch2 == '"') {
    if (stream.skipTo('"')) {
      stream.next();
      return "string";
    } else {
      stream.skipToEnd();
      return "error";
    }
  }
  if (stream.match(doubleOperators$3) || stream.match(singleOperators$4))
    return "operator";
  if (stream.match(singleDelimiters$2))
    return null;
  if (brackets.test(ch2)) {
    stream.next();
    return "bracket";
  }
  if (state.commandMode > 0 && stream.match(command))
    return "controlKeyword";
  if (stream.match(intrinsicFuncs))
    return "builtin";
  if (stream.match(identifiers$5))
    return "variable";
  if (ch2 === "$" || ch2 === "^") {
    stream.next();
    return "builtin";
  }
  if (ch2 === "@") {
    stream.next();
    return "string.special";
  }
  if (/[\w%]/.test(ch2)) {
    stream.eatWhile(/[\w%]/);
    return "variable";
  }
  stream.next();
  return "error";
}
const mumps = {
  name: "mumps",
  startState: function() {
    return {
      label: false,
      commandMode: 0
    };
  },
  token: function(stream, state) {
    var style2 = tokenBase$r(stream, state);
    if (state.label) return "tag";
    return style2;
  }
};
const mumps$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  mumps
});
var rfc2822 = [
  "From",
  "Sender",
  "Reply-To",
  "To",
  "Cc",
  "Bcc",
  "Message-ID",
  "In-Reply-To",
  "References",
  "Resent-From",
  "Resent-Sender",
  "Resent-To",
  "Resent-Cc",
  "Resent-Bcc",
  "Resent-Message-ID",
  "Return-Path",
  "Received"
];
var rfc2822NoEmail = [
  "Date",
  "Subject",
  "Comments",
  "Keywords",
  "Resent-Date"
];
var whitespace = /^[ \t]/;
var separator = /^From /;
var rfc2822Header = new RegExp("^(" + rfc2822.join("|") + "): ");
var rfc2822HeaderNoEmail = new RegExp("^(" + rfc2822NoEmail.join("|") + "): ");
var header = /^[^:]+:/;
var email = /^[^ ]+@[^ ]+/;
var untilEmail = /^.*?(?=[^ ]+?@[^ ]+)/;
var bracketedEmail = /^<.*?>/;
var untilBracketedEmail = /^.*?(?=<.*>)/;
function styleForHeader(header2) {
  if (header2 === "Subject") return "header";
  return "string";
}
function readToken$1(stream, state) {
  if (stream.sol()) {
    state.inSeparator = false;
    if (state.inHeader && stream.match(whitespace)) {
      return null;
    } else {
      state.inHeader = false;
      state.header = null;
    }
    if (stream.match(separator)) {
      state.inHeaders = true;
      state.inSeparator = true;
      return "atom";
    }
    var match;
    var emailPermitted = false;
    if ((match = stream.match(rfc2822HeaderNoEmail)) || (emailPermitted = true) && (match = stream.match(rfc2822Header))) {
      state.inHeaders = true;
      state.inHeader = true;
      state.emailPermitted = emailPermitted;
      state.header = match[1];
      return "atom";
    }
    if (state.inHeaders && (match = stream.match(header))) {
      state.inHeader = true;
      state.emailPermitted = true;
      state.header = match[1];
      return "atom";
    }
    state.inHeaders = false;
    stream.skipToEnd();
    return null;
  }
  if (state.inSeparator) {
    if (stream.match(email)) return "link";
    if (stream.match(untilEmail)) return "atom";
    stream.skipToEnd();
    return "atom";
  }
  if (state.inHeader) {
    var style2 = styleForHeader(state.header);
    if (state.emailPermitted) {
      if (stream.match(bracketedEmail)) return style2 + " link";
      if (stream.match(untilBracketedEmail)) return style2;
    }
    stream.skipToEnd();
    return style2;
  }
  stream.skipToEnd();
  return null;
}
const mbox = {
  name: "mbox",
  startState: function() {
    return {
      // Is in a mbox separator
      inSeparator: false,
      // Is in a mail header
      inHeader: false,
      // If bracketed email is permitted. Only applicable when inHeader
      emailPermitted: false,
      // Name of current header
      header: null,
      // Is in a region of mail headers
      inHeaders: false
    };
  },
  token: readToken$1,
  blankLine: function(state) {
    state.inHeaders = state.inSeparator = state.inHeader = false;
  },
  languageData: {
    autocomplete: rfc2822.concat(rfc2822NoEmail)
  }
};
const mbox$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  mbox
});
function words$b(str) {
  var obj = {}, words2 = str.split(" ");
  for (var i2 = 0; i2 < words2.length; ++i2) obj[words2[i2]] = true;
  return obj;
}
var keywords$n = words$b(
  /* ngxDirectiveControl */
  "break return rewrite set accept_mutex accept_mutex_delay access_log add_after_body add_before_body add_header addition_types aio alias allow ancient_browser ancient_browser_value auth_basic auth_basic_user_file auth_http auth_http_header auth_http_timeout autoindex autoindex_exact_size autoindex_localtime charset charset_types client_body_buffer_size client_body_in_file_only client_body_in_single_buffer client_body_temp_path client_body_timeout client_header_buffer_size client_header_timeout client_max_body_size connection_pool_size create_full_put_path daemon dav_access dav_methods debug_connection debug_points default_type degradation degrade deny devpoll_changes devpoll_events directio directio_alignment empty_gif env epoll_events error_log eventport_events expires fastcgi_bind fastcgi_buffer_size fastcgi_buffers fastcgi_busy_buffers_size fastcgi_cache fastcgi_cache_key fastcgi_cache_methods fastcgi_cache_min_uses fastcgi_cache_path fastcgi_cache_use_stale fastcgi_cache_valid fastcgi_catch_stderr fastcgi_connect_timeout fastcgi_hide_header fastcgi_ignore_client_abort fastcgi_ignore_headers fastcgi_index fastcgi_intercept_errors fastcgi_max_temp_file_size fastcgi_next_upstream fastcgi_param fastcgi_pass_header fastcgi_pass_request_body fastcgi_pass_request_headers fastcgi_read_timeout fastcgi_send_lowat fastcgi_send_timeout fastcgi_split_path_info fastcgi_store fastcgi_store_access fastcgi_temp_file_write_size fastcgi_temp_path fastcgi_upstream_fail_timeout fastcgi_upstream_max_fails flv geoip_city geoip_country google_perftools_profiles gzip gzip_buffers gzip_comp_level gzip_disable gzip_hash gzip_http_version gzip_min_length gzip_no_buffer gzip_proxied gzip_static gzip_types gzip_vary gzip_window if_modified_since ignore_invalid_headers image_filter image_filter_buffer image_filter_jpeg_quality image_filter_transparency imap_auth imap_capabilities imap_client_buffer index ip_hash keepalive_requests keepalive_timeout kqueue_changes kqueue_events large_client_header_buffers limit_conn limit_conn_log_level limit_rate limit_rate_after limit_req limit_req_log_level limit_req_zone limit_zone lingering_time lingering_timeout lock_file log_format log_not_found log_subrequest map_hash_bucket_size map_hash_max_size master_process memcached_bind memcached_buffer_size memcached_connect_timeout memcached_next_upstream memcached_read_timeout memcached_send_timeout memcached_upstream_fail_timeout memcached_upstream_max_fails merge_slashes min_delete_depth modern_browser modern_browser_value msie_padding msie_refresh multi_accept open_file_cache open_file_cache_errors open_file_cache_events open_file_cache_min_uses open_file_cache_valid open_log_file_cache output_buffers override_charset perl perl_modules perl_require perl_set pid pop3_auth pop3_capabilities port_in_redirect postpone_gzipping postpone_output protocol proxy proxy_bind proxy_buffer proxy_buffer_size proxy_buffering proxy_buffers proxy_busy_buffers_size proxy_cache proxy_cache_key proxy_cache_methods proxy_cache_min_uses proxy_cache_path proxy_cache_use_stale proxy_cache_valid proxy_connect_timeout proxy_headers_hash_bucket_size proxy_headers_hash_max_size proxy_hide_header proxy_ignore_client_abort proxy_ignore_headers proxy_intercept_errors proxy_max_temp_file_size proxy_method proxy_next_upstream proxy_pass_error_message proxy_pass_header proxy_pass_request_body proxy_pass_request_headers proxy_read_timeout proxy_redirect proxy_send_lowat proxy_send_timeout proxy_set_body proxy_set_header proxy_ssl_session_reuse proxy_store proxy_store_access proxy_temp_file_write_size proxy_temp_path proxy_timeout proxy_upstream_fail_timeout proxy_upstream_max_fails random_index read_ahead real_ip_header recursive_error_pages request_pool_size reset_timedout_connection resolver resolver_timeout rewrite_log rtsig_overflow_events rtsig_overflow_test rtsig_overflow_threshold rtsig_signo satisfy secure_link_secret send_lowat send_timeout sendfile sendfile_max_chunk server_name_in_redirect server_names_hash_bucket_size server_names_hash_max_size server_tokens set_real_ip_from smtp_auth smtp_capabilities smtp_client_buffer smtp_greeting_delay so_keepalive source_charset ssi ssi_ignore_recycled_buffers ssi_min_file_chunk ssi_silent_errors ssi_types ssi_value_length ssl ssl_certificate ssl_certificate_key ssl_ciphers ssl_client_certificate ssl_crl ssl_dhparam ssl_engine ssl_prefer_server_ciphers ssl_protocols ssl_session_cache ssl_session_timeout ssl_verify_client ssl_verify_depth starttls stub_status sub_filter sub_filter_once sub_filter_types tcp_nodelay tcp_nopush thread_stack_size timeout timer_resolution types_hash_bucket_size types_hash_max_size underscores_in_headers uninitialized_variable_warn use user userid userid_domain userid_expires userid_mark userid_name userid_p3p userid_path userid_service valid_referers variables_hash_bucket_size variables_hash_max_size worker_connections worker_cpu_affinity worker_priority worker_processes worker_rlimit_core worker_rlimit_nofile worker_rlimit_sigpending worker_threads working_directory xclient xml_entities xslt_stylesheet xslt_typesdrew@li229-23"
);
var keywords_block = words$b(
  /* ngxDirectiveBlock */
  "http mail events server types location upstream charset_map limit_except if geo map"
);
var keywords_important = words$b(
  /* ngxDirectiveImportant */
  "include root server server_name listen internal proxy_pass memcached_pass fastcgi_pass try_files"
);
var type$2;
function ret(style2, tp) {
  type$2 = tp;
  return style2;
}
function tokenBase$q(stream, state) {
  stream.eatWhile(/[\w\$_]/);
  var cur = stream.current();
  if (keywords$n.propertyIsEnumerable(cur)) {
    return "keyword";
  } else if (keywords_block.propertyIsEnumerable(cur)) {
    return "controlKeyword";
  } else if (keywords_important.propertyIsEnumerable(cur)) {
    return "controlKeyword";
  }
  var ch2 = stream.next();
  if (ch2 == "@") {
    stream.eatWhile(/[\w\\\-]/);
    return ret("meta", stream.current());
  } else if (ch2 == "/" && stream.eat("*")) {
    state.tokenize = tokenCComment$2;
    return tokenCComment$2(stream, state);
  } else if (ch2 == "<" && stream.eat("!")) {
    state.tokenize = tokenSGMLComment;
    return tokenSGMLComment(stream, state);
  } else if (ch2 == "=") ret(null, "compare");
  else if ((ch2 == "~" || ch2 == "|") && stream.eat("=")) return ret(null, "compare");
  else if (ch2 == '"' || ch2 == "'") {
    state.tokenize = tokenString$i(ch2);
    return state.tokenize(stream, state);
  } else if (ch2 == "#") {
    stream.skipToEnd();
    return ret("comment", "comment");
  } else if (ch2 == "!") {
    stream.match(/^\s*\w*/);
    return ret("keyword", "important");
  } else if (/\d/.test(ch2)) {
    stream.eatWhile(/[\w.%]/);
    return ret("number", "unit");
  } else if (/[,.+>*\/]/.test(ch2)) {
    return ret(null, "select-op");
  } else if (/[;{}:\[\]]/.test(ch2)) {
    return ret(null, ch2);
  } else {
    stream.eatWhile(/[\w\\\-]/);
    return ret("variable", "variable");
  }
}
function tokenCComment$2(stream, state) {
  var maybeEnd = false, ch2;
  while ((ch2 = stream.next()) != null) {
    if (maybeEnd && ch2 == "/") {
      state.tokenize = tokenBase$q;
      break;
    }
    maybeEnd = ch2 == "*";
  }
  return ret("comment", "comment");
}
function tokenSGMLComment(stream, state) {
  var dashes = 0, ch2;
  while ((ch2 = stream.next()) != null) {
    if (dashes >= 2 && ch2 == ">") {
      state.tokenize = tokenBase$q;
      break;
    }
    dashes = ch2 == "-" ? dashes + 1 : 0;
  }
  return ret("comment", "comment");
}
function tokenString$i(quote2) {
  return function(stream, state) {
    var escaped = false, ch2;
    while ((ch2 = stream.next()) != null) {
      if (ch2 == quote2 && !escaped)
        break;
      escaped = !escaped && ch2 == "\\";
    }
    if (!escaped) state.tokenize = tokenBase$q;
    return ret("string", "string");
  };
}
const nginx = {
  name: "nginx",
  startState: function() {
    return {
      tokenize: tokenBase$q,
      baseIndent: 0,
      stack: []
    };
  },
  token: function(stream, state) {
    if (stream.eatSpace()) return null;
    type$2 = null;
    var style2 = state.tokenize(stream, state);
    var context = state.stack[state.stack.length - 1];
    if (type$2 == "hash" && context == "rule") style2 = "atom";
    else if (style2 == "variable") {
      if (context == "rule") style2 = "number";
      else if (!context || context == "@media{") style2 = "tag";
    }
    if (context == "rule" && /^[\{\};]$/.test(type$2))
      state.stack.pop();
    if (type$2 == "{") {
      if (context == "@media") state.stack[state.stack.length - 1] = "@media{";
      else state.stack.push("{");
    } else if (type$2 == "}") state.stack.pop();
    else if (type$2 == "@media") state.stack.push("@media");
    else if (context == "{" && type$2 != "comment") state.stack.push("rule");
    return style2;
  },
  indent: function(state, textAfter, cx2) {
    var n = state.stack.length;
    if (/^\}/.test(textAfter))
      n -= state.stack[state.stack.length - 1] == "rule" ? 2 : 1;
    return state.baseIndent + n * cx2.unit;
  },
  languageData: {
    indentOnInput: /^\s*\}$/
  }
};
const nginx$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  nginx
});
const nsis = simpleMode({
  start: [
    // Numbers
    { regex: /(?:[+-]?)(?:0x[\d,a-f]+)|(?:0o[0-7]+)|(?:0b[0,1]+)|(?:\d+.?\d*)/, token: "number" },
    // Strings
    { regex: /"(?:[^\\"]|\\.)*"?/, token: "string" },
    { regex: /'(?:[^\\']|\\.)*'?/, token: "string" },
    { regex: /`(?:[^\\`]|\\.)*`?/, token: "string" },
    // Compile Time Commands
    { regex: /^\s*(?:\!(addincludedir|addplugindir|appendfile|assert|cd|define|delfile|echo|error|execute|finalize|getdllversion|gettlbversion|include|insertmacro|macro|macroend|makensis|packhdr|pragma|searchparse|searchreplace|system|tempfile|undef|uninstfinalize|verbose|warning))\b/i, token: "keyword" },
    // Conditional Compilation
    { regex: /^\s*(?:\!(if(?:n?def)?|ifmacron?def|macro))\b/i, token: "keyword", indent: true },
    { regex: /^\s*(?:\!(else|endif|macroend))\b/i, token: "keyword", dedent: true },
    // Runtime Commands
    { regex: /^\s*(?:Abort|AddBrandingImage|AddSize|AllowRootDirInstall|AllowSkipFiles|AutoCloseWindow|BGFont|BGGradient|BrandingText|BringToFront|Call|CallInstDLL|Caption|ChangeUI|CheckBitmap|ClearErrors|CompletedText|ComponentText|CopyFiles|CRCCheck|CreateDirectory|CreateFont|CreateShortCut|Delete|DeleteINISec|DeleteINIStr|DeleteRegKey|DeleteRegValue|DetailPrint|DetailsButtonText|DirText|DirVar|DirVerify|EnableWindow|EnumRegKey|EnumRegValue|Exch|Exec|ExecShell|ExecShellWait|ExecWait|ExpandEnvStrings|File|FileBufSize|FileClose|FileErrorText|FileOpen|FileRead|FileReadByte|FileReadUTF16LE|FileReadWord|FileWriteUTF16LE|FileSeek|FileWrite|FileWriteByte|FileWriteWord|FindClose|FindFirst|FindNext|FindWindow|FlushINI|GetCurInstType|GetCurrentAddress|GetDlgItem|GetDLLVersion|GetDLLVersionLocal|GetErrorLevel|GetFileTime|GetFileTimeLocal|GetFullPathName|GetFunctionAddress|GetInstDirError|GetKnownFolderPath|GetLabelAddress|GetTempFileName|GetWinVer|Goto|HideWindow|Icon|IfAbort|IfErrors|IfFileExists|IfRebootFlag|IfRtlLanguage|IfShellVarContextAll|IfSilent|InitPluginsDir|InstallButtonText|InstallColors|InstallDir|InstallDirRegKey|InstProgressFlags|InstType|InstTypeGetText|InstTypeSetText|Int64Cmp|Int64CmpU|Int64Fmt|IntCmp|IntCmpU|IntFmt|IntOp|IntPtrCmp|IntPtrCmpU|IntPtrOp|IsWindow|LangString|LicenseBkColor|LicenseData|LicenseForceSelection|LicenseLangString|LicenseText|LoadAndSetImage|LoadLanguageFile|LockWindow|LogSet|LogText|ManifestDPIAware|ManifestLongPathAware|ManifestMaxVersionTested|ManifestSupportedOS|MessageBox|MiscButtonText|Name|Nop|OutFile|Page|PageCallbacks|PEAddResource|PEDllCharacteristics|PERemoveResource|PESubsysVer|Pop|Push|Quit|ReadEnvStr|ReadINIStr|ReadRegDWORD|ReadRegStr|Reboot|RegDLL|Rename|RequestExecutionLevel|ReserveFile|Return|RMDir|SearchPath|SectionGetFlags|SectionGetInstTypes|SectionGetSize|SectionGetText|SectionIn|SectionSetFlags|SectionSetInstTypes|SectionSetSize|SectionSetText|SendMessage|SetAutoClose|SetBrandingImage|SetCompress|SetCompressor|SetCompressorDictSize|SetCtlColors|SetCurInstType|SetDatablockOptimize|SetDateSave|SetDetailsPrint|SetDetailsView|SetErrorLevel|SetErrors|SetFileAttributes|SetFont|SetOutPath|SetOverwrite|SetRebootFlag|SetRegView|SetShellVarContext|SetSilent|ShowInstDetails|ShowUninstDetails|ShowWindow|SilentInstall|SilentUnInstall|Sleep|SpaceTexts|StrCmp|StrCmpS|StrCpy|StrLen|SubCaption|Target|Unicode|UninstallButtonText|UninstallCaption|UninstallIcon|UninstallSubCaption|UninstallText|UninstPage|UnRegDLL|Var|VIAddVersionKey|VIFileVersion|VIProductVersion|WindowIcon|WriteINIStr|WriteRegBin|WriteRegDWORD|WriteRegExpandStr|WriteRegMultiStr|WriteRegNone|WriteRegStr|WriteUninstaller|XPStyle)\b/i, token: "keyword" },
    { regex: /^\s*(?:Function|PageEx|Section(?:Group)?)\b/i, token: "keyword", indent: true },
    { regex: /^\s*(?:(Function|PageEx|Section(?:Group)?)End)\b/i, token: "keyword", dedent: true },
    // Command Options
    { regex: /\b(?:ARCHIVE|FILE_ATTRIBUTE_ARCHIVE|FILE_ATTRIBUTE_HIDDEN|FILE_ATTRIBUTE_NORMAL|FILE_ATTRIBUTE_OFFLINE|FILE_ATTRIBUTE_READONLY|FILE_ATTRIBUTE_SYSTEM|FILE_ATTRIBUTE_TEMPORARY|HIDDEN|HKCC|HKCR(32|64)?|HKCU(32|64)?|HKDD|HKEY_CLASSES_ROOT|HKEY_CURRENT_CONFIG|HKEY_CURRENT_USER|HKEY_DYN_DATA|HKEY_LOCAL_MACHINE|HKEY_PERFORMANCE_DATA|HKEY_USERS|HKLM(32|64)?|HKPD|HKU|IDABORT|IDCANCEL|IDD_DIR|IDD_INST|IDD_INSTFILES|IDD_LICENSE|IDD_SELCOM|IDD_UNINST|IDD_VERIFY|IDIGNORE|IDNO|IDOK|IDRETRY|IDYES|MB_ABORTRETRYIGNORE|MB_DEFBUTTON1|MB_DEFBUTTON2|MB_DEFBUTTON3|MB_DEFBUTTON4|MB_ICONEXCLAMATION|MB_ICONINFORMATION|MB_ICONQUESTION|MB_ICONSTOP|MB_OK|MB_OKCANCEL|MB_RETRYCANCEL|MB_RIGHT|MB_RTLREADING|MB_SETFOREGROUND|MB_TOPMOST|MB_USERICON|MB_YESNO|MB_YESNOCANCEL|NORMAL|OFFLINE|READONLY|SHCTX|SHELL_CONTEXT|SW_HIDE|SW_SHOWDEFAULT|SW_SHOWMAXIMIZED|SW_SHOWMINIMIZED|SW_SHOWNORMAL|SYSTEM|TEMPORARY)\b/i, token: "atom" },
    { regex: /\b(?:admin|all|amd64-unicode|auto|both|bottom|bzip2|components|current|custom|directory|false|force|hide|highest|ifdiff|ifnewer|instfiles|lastused|leave|left|license|listonly|lzma|nevershow|none|normal|notset|off|on|right|show|silent|silentlog|textonly|top|true|try|un\.components|un\.custom|un\.directory|un\.instfiles|un\.license|uninstConfirm|user|Win10|Win7|Win8|WinVista|x-86-(ansi|unicode)|zlib)\b/i, token: "builtin" },
    // LogicLib.nsh
    { regex: /\$\{(?:And(?:If(?:Not)?|Unless)|Break|Case(?:2|3|4|5|Else)?|Continue|Default|Do(?:Until|While)?|Else(?:If(?:Not)?|Unless)?|End(?:If|Select|Switch)|Exit(?:Do|For|While)|For(?:Each)?|If(?:Cmd|Not(?:Then)?|Then)?|Loop(?:Until|While)?|Or(?:If(?:Not)?|Unless)|Select|Switch|Unless|While)\}/i, token: "variable-2", indent: true },
    // FileFunc.nsh
    { regex: /\$\{(?:BannerTrimPath|DirState|DriveSpace|Get(BaseName|Drives|ExeName|ExePath|FileAttributes|FileExt|FileName|FileVersion|Options|OptionsS|Parameters|Parent|Root|Size|Time)|Locate|RefreshShellIcons)\}/i, token: "variable-2", dedent: true },
    // Memento.nsh
    { regex: /\$\{(?:Memento(?:Section(?:Done|End|Restore|Save)?|UnselectedSection))\}/i, token: "variable-2", dedent: true },
    // TextFunc.nsh
    { regex: /\$\{(?:Config(?:Read|ReadS|Write|WriteS)|File(?:Join|ReadFromEnd|Recode)|Line(?:Find|Read|Sum)|Text(?:Compare|CompareS)|TrimNewLines)\}/i, token: "variable-2", dedent: true },
    // WinVer.nsh
    { regex: /\$\{(?:(?:At(?:Least|Most)|Is)(?:ServicePack|Win(?:7|8|10|95|98|200(?:0|3|8(?:R2)?)|ME|NT4|Vista|XP))|Is(?:NT|Server))\}/i, token: "variable", dedent: true },
    // WordFunc.nsh
    { regex: /\$\{(?:StrFilterS?|Version(?:Compare|Convert)|Word(?:AddS?|Find(?:(?:2|3)X)?S?|InsertS?|ReplaceS?))\}/i, token: "keyword", dedent: true },
    // x64.nsh
    { regex: /\$\{(?:RunningX64)\}/i, token: "variable", dedent: true },
    { regex: /\$\{(?:Disable|Enable)X64FSRedirection\}/i, token: "keyword", dedent: true },
    // Line Comment
    { regex: /(#|;).*/, token: "comment" },
    // Block Comment
    { regex: /\/\*/, token: "comment", next: "comment" },
    // Operator
    { regex: /[-+\/*=<>!]+/, token: "operator" },
    // Variable
    { regex: /\$\w[\w\.]*/, token: "variable" },
    // Constant
    { regex: /\${[\!\w\.:-]+}/, token: "variableName.constant" },
    // Language String
    { regex: /\$\([\!\w\.:-]+\)/, token: "atom" }
  ],
  comment: [
    { regex: /.*?\*\//, token: "comment", next: "start" },
    { regex: /.*/, token: "comment" }
  ],
  languageData: {
    name: "nsis",
    indentOnInput: /^\s*((Function|PageEx|Section|Section(Group)?)End|(\!(endif|macroend))|\$\{(End(If|Unless|While)|Loop(Until)|Next)\})$/i,
    commentTokens: { line: "#", block: { open: "/*", close: "*/" } }
  }
});
const nsis$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  nsis
});
var Location = {
  PRE_SUBJECT: 0,
  WRITING_SUB_URI: 1,
  WRITING_BNODE_URI: 2,
  PRE_PRED: 3,
  WRITING_PRED_URI: 4,
  PRE_OBJ: 5,
  WRITING_OBJ_URI: 6,
  WRITING_OBJ_BNODE: 7,
  WRITING_OBJ_LITERAL: 8,
  WRITING_LIT_LANG: 9,
  WRITING_LIT_TYPE: 10,
  POST_OBJ: 11,
  ERROR: 12
};
function transitState(currState, c) {
  var currLocation = currState.location;
  var ret2;
  if (currLocation == Location.PRE_SUBJECT && c == "<") ret2 = Location.WRITING_SUB_URI;
  else if (currLocation == Location.PRE_SUBJECT && c == "_") ret2 = Location.WRITING_BNODE_URI;
  else if (currLocation == Location.PRE_PRED && c == "<") ret2 = Location.WRITING_PRED_URI;
  else if (currLocation == Location.PRE_OBJ && c == "<") ret2 = Location.WRITING_OBJ_URI;
  else if (currLocation == Location.PRE_OBJ && c == "_") ret2 = Location.WRITING_OBJ_BNODE;
  else if (currLocation == Location.PRE_OBJ && c == '"') ret2 = Location.WRITING_OBJ_LITERAL;
  else if (currLocation == Location.WRITING_SUB_URI && c == ">") ret2 = Location.PRE_PRED;
  else if (currLocation == Location.WRITING_BNODE_URI && c == " ") ret2 = Location.PRE_PRED;
  else if (currLocation == Location.WRITING_PRED_URI && c == ">") ret2 = Location.PRE_OBJ;
  else if (currLocation == Location.WRITING_OBJ_URI && c == ">") ret2 = Location.POST_OBJ;
  else if (currLocation == Location.WRITING_OBJ_BNODE && c == " ") ret2 = Location.POST_OBJ;
  else if (currLocation == Location.WRITING_OBJ_LITERAL && c == '"') ret2 = Location.POST_OBJ;
  else if (currLocation == Location.WRITING_LIT_LANG && c == " ") ret2 = Location.POST_OBJ;
  else if (currLocation == Location.WRITING_LIT_TYPE && c == ">") ret2 = Location.POST_OBJ;
  else if (currLocation == Location.WRITING_OBJ_LITERAL && c == "@") ret2 = Location.WRITING_LIT_LANG;
  else if (currLocation == Location.WRITING_OBJ_LITERAL && c == "^") ret2 = Location.WRITING_LIT_TYPE;
  else if (c == " " && (currLocation == Location.PRE_SUBJECT || currLocation == Location.PRE_PRED || currLocation == Location.PRE_OBJ || currLocation == Location.POST_OBJ)) ret2 = currLocation;
  else if (currLocation == Location.POST_OBJ && c == ".") ret2 = Location.PRE_SUBJECT;
  else ret2 = Location.ERROR;
  currState.location = ret2;
}
const ntriples = {
  name: "ntriples",
  startState: function() {
    return {
      location: Location.PRE_SUBJECT,
      uris: [],
      anchors: [],
      bnodes: [],
      langs: [],
      types: []
    };
  },
  token: function(stream, state) {
    var ch2 = stream.next();
    if (ch2 == "<") {
      transitState(state, ch2);
      var parsedURI = "";
      stream.eatWhile(function(c) {
        if (c != "#" && c != ">") {
          parsedURI += c;
          return true;
        }
        return false;
      });
      state.uris.push(parsedURI);
      if (stream.match("#", false)) return "variable";
      stream.next();
      transitState(state, ">");
      return "variable";
    }
    if (ch2 == "#") {
      var parsedAnchor = "";
      stream.eatWhile(function(c) {
        if (c != ">" && c != " ") {
          parsedAnchor += c;
          return true;
        }
        return false;
      });
      state.anchors.push(parsedAnchor);
      return "url";
    }
    if (ch2 == ">") {
      transitState(state, ">");
      return "variable";
    }
    if (ch2 == "_") {
      transitState(state, ch2);
      var parsedBNode = "";
      stream.eatWhile(function(c) {
        if (c != " ") {
          parsedBNode += c;
          return true;
        }
        return false;
      });
      state.bnodes.push(parsedBNode);
      stream.next();
      transitState(state, " ");
      return "builtin";
    }
    if (ch2 == '"') {
      transitState(state, ch2);
      stream.eatWhile(function(c) {
        return c != '"';
      });
      stream.next();
      if (stream.peek() != "@" && stream.peek() != "^") {
        transitState(state, '"');
      }
      return "string";
    }
    if (ch2 == "@") {
      transitState(state, "@");
      var parsedLang = "";
      stream.eatWhile(function(c) {
        if (c != " ") {
          parsedLang += c;
          return true;
        }
        return false;
      });
      state.langs.push(parsedLang);
      stream.next();
      transitState(state, " ");
      return "string.special";
    }
    if (ch2 == "^") {
      stream.next();
      transitState(state, "^");
      var parsedType = "";
      stream.eatWhile(function(c) {
        if (c != ">") {
          parsedType += c;
          return true;
        }
        return false;
      });
      state.types.push(parsedType);
      stream.next();
      transitState(state, ">");
      return "variable";
    }
    if (ch2 == " ") {
      transitState(state, ch2);
    }
    if (ch2 == ".") {
      transitState(state, ch2);
    }
  }
};
const ntriples$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  ntriples
});
function wordRegexp$8(words2) {
  return new RegExp("^((" + words2.join(")|(") + "))\\b");
}
var singleOperators$3 = new RegExp("^[\\+\\-\\*/&|\\^~<>!@'\\\\]");
var singleDelimiters$1 = new RegExp("^[\\(\\[\\{\\},:=;\\.]");
var doubleOperators$2 = new RegExp("^((==)|(~=)|(<=)|(>=)|(<<)|(>>)|(\\.[\\+\\-\\*/\\^\\\\]))");
var doubleDelimiters$1 = new RegExp("^((!=)|(\\+=)|(\\-=)|(\\*=)|(/=)|(&=)|(\\|=)|(\\^=))");
var tripleDelimiters$1 = new RegExp("^((>>=)|(<<=))");
var expressionEnd = new RegExp("^[\\]\\)]");
var identifiers$4 = new RegExp("^[_A-Za-z¡-￿][_A-Za-z0-9¡-￿]*");
var builtins$4 = wordRegexp$8([
  "error",
  "eval",
  "function",
  "abs",
  "acos",
  "atan",
  "asin",
  "cos",
  "cosh",
  "exp",
  "log",
  "prod",
  "sum",
  "log10",
  "max",
  "min",
  "sign",
  "sin",
  "sinh",
  "sqrt",
  "tan",
  "reshape",
  "break",
  "zeros",
  "default",
  "margin",
  "round",
  "ones",
  "rand",
  "syn",
  "ceil",
  "floor",
  "size",
  "clear",
  "zeros",
  "eye",
  "mean",
  "std",
  "cov",
  "det",
  "eig",
  "inv",
  "norm",
  "rank",
  "trace",
  "expm",
  "logm",
  "sqrtm",
  "linspace",
  "plot",
  "title",
  "xlabel",
  "ylabel",
  "legend",
  "text",
  "grid",
  "meshgrid",
  "mesh",
  "num2str",
  "fft",
  "ifft",
  "arrayfun",
  "cellfun",
  "input",
  "fliplr",
  "flipud",
  "ismember"
]);
var keywords$m = wordRegexp$8([
  "return",
  "case",
  "switch",
  "else",
  "elseif",
  "end",
  "endif",
  "endfunction",
  "if",
  "otherwise",
  "do",
  "for",
  "while",
  "try",
  "catch",
  "classdef",
  "properties",
  "events",
  "methods",
  "global",
  "persistent",
  "endfor",
  "endwhile",
  "printf",
  "sprintf",
  "disp",
  "until",
  "continue",
  "pkg"
]);
function tokenTranspose(stream, state) {
  if (!stream.sol() && stream.peek() === "'") {
    stream.next();
    state.tokenize = tokenBase$p;
    return "operator";
  }
  state.tokenize = tokenBase$p;
  return tokenBase$p(stream, state);
}
function tokenComment$a(stream, state) {
  if (stream.match(/^.*%}/)) {
    state.tokenize = tokenBase$p;
    return "comment";
  }
  stream.skipToEnd();
  return "comment";
}
function tokenBase$p(stream, state) {
  if (stream.eatSpace()) return null;
  if (stream.match("%{")) {
    state.tokenize = tokenComment$a;
    stream.skipToEnd();
    return "comment";
  }
  if (stream.match(/^[%#]/)) {
    stream.skipToEnd();
    return "comment";
  }
  if (stream.match(/^[0-9\.+-]/, false)) {
    if (stream.match(/^[+-]?0x[0-9a-fA-F]+[ij]?/)) {
      stream.tokenize = tokenBase$p;
      return "number";
    }
    if (stream.match(/^[+-]?\d*\.\d+([EeDd][+-]?\d+)?[ij]?/)) {
      return "number";
    }
    if (stream.match(/^[+-]?\d+([EeDd][+-]?\d+)?[ij]?/)) {
      return "number";
    }
  }
  if (stream.match(wordRegexp$8(["nan", "NaN", "inf", "Inf"]))) {
    return "number";
  }
  var m = stream.match(/^"(?:[^"]|"")*("|$)/) || stream.match(/^'(?:[^']|'')*('|$)/);
  if (m) {
    return m[1] ? "string" : "error";
  }
  if (stream.match(keywords$m)) {
    return "keyword";
  }
  if (stream.match(builtins$4)) {
    return "builtin";
  }
  if (stream.match(identifiers$4)) {
    return "variable";
  }
  if (stream.match(singleOperators$3) || stream.match(doubleOperators$2)) {
    return "operator";
  }
  if (stream.match(singleDelimiters$1) || stream.match(doubleDelimiters$1) || stream.match(tripleDelimiters$1)) {
    return null;
  }
  if (stream.match(expressionEnd)) {
    state.tokenize = tokenTranspose;
    return null;
  }
  stream.next();
  return "error";
}
const octave = {
  name: "octave",
  startState: function() {
    return {
      tokenize: tokenBase$p
    };
  },
  token: function(stream, state) {
    var style2 = state.tokenize(stream, state);
    if (style2 === "number" || style2 === "variable") {
      state.tokenize = tokenTranspose;
    }
    return style2;
  },
  languageData: {
    commentTokens: { line: "%" }
  }
};
const octave$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  octave
});
function wordRegexp$7(words2) {
  return new RegExp("^((" + words2.join(")|(") + "))\\b");
}
var singleOperators$2 = /[\^@!\|<>#~\.\*\-\+\\/,=]/;
var doubleOperators$1 = /(<-)|(:=)|(=<)|(>=)|(<=)|(<:)|(>:)|(=:)|(\\=)|(\\=:)|(!!)|(==)|(::)/;
var tripleOperators = /(:::)|(\.\.\.)|(=<:)|(>=:)/;
var middle$1 = [
  "in",
  "then",
  "else",
  "of",
  "elseof",
  "elsecase",
  "elseif",
  "catch",
  "finally",
  "with",
  "require",
  "prepare",
  "import",
  "export",
  "define",
  "do"
];
var end = ["end"];
var atoms$6 = wordRegexp$7(["true", "false", "nil", "unit"]);
var commonKeywords$3 = wordRegexp$7([
  "andthen",
  "at",
  "attr",
  "declare",
  "feat",
  "from",
  "lex",
  "mod",
  "div",
  "mode",
  "orelse",
  "parser",
  "prod",
  "prop",
  "scanner",
  "self",
  "syn",
  "token"
]);
var openingKeywords$1 = wordRegexp$7([
  "local",
  "proc",
  "fun",
  "case",
  "class",
  "if",
  "cond",
  "or",
  "dis",
  "choice",
  "not",
  "thread",
  "try",
  "raise",
  "lock",
  "for",
  "suchthat",
  "meth",
  "functor"
]);
var middleKeywords$1 = wordRegexp$7(middle$1);
var endKeywords$1 = wordRegexp$7(end);
function tokenBase$o(stream, state) {
  if (stream.eatSpace()) {
    return null;
  }
  if (stream.match(/[{}]/)) {
    return "bracket";
  }
  if (stream.match("[]")) {
    return "keyword";
  }
  if (stream.match(tripleOperators) || stream.match(doubleOperators$1)) {
    return "operator";
  }
  if (stream.match(atoms$6)) {
    return "atom";
  }
  var matched = stream.match(openingKeywords$1);
  if (matched) {
    if (!state.doInCurrentLine)
      state.currentIndent++;
    else
      state.doInCurrentLine = false;
    if (matched[0] == "proc" || matched[0] == "fun")
      state.tokenize = tokenFunProc;
    else if (matched[0] == "class")
      state.tokenize = tokenClass;
    else if (matched[0] == "meth")
      state.tokenize = tokenMeth;
    return "keyword";
  }
  if (stream.match(middleKeywords$1) || stream.match(commonKeywords$3)) {
    return "keyword";
  }
  if (stream.match(endKeywords$1)) {
    state.currentIndent--;
    return "keyword";
  }
  var ch2 = stream.next();
  if (ch2 == '"' || ch2 == "'") {
    state.tokenize = tokenString$h(ch2);
    return state.tokenize(stream, state);
  }
  if (/[~\d]/.test(ch2)) {
    if (ch2 == "~") {
      if (!/^[0-9]/.test(stream.peek()))
        return null;
      else if (stream.next() == "0" && stream.match(/^[xX][0-9a-fA-F]+/) || stream.match(/^[0-9]*(\.[0-9]+)?([eE][~+]?[0-9]+)?/))
        return "number";
    }
    if (ch2 == "0" && stream.match(/^[xX][0-9a-fA-F]+/) || stream.match(/^[0-9]*(\.[0-9]+)?([eE][~+]?[0-9]+)?/))
      return "number";
    return null;
  }
  if (ch2 == "%") {
    stream.skipToEnd();
    return "comment";
  } else if (ch2 == "/") {
    if (stream.eat("*")) {
      state.tokenize = tokenComment$9;
      return tokenComment$9(stream, state);
    }
  }
  if (singleOperators$2.test(ch2)) {
    return "operator";
  }
  stream.eatWhile(/\w/);
  return "variable";
}
function tokenClass(stream, state) {
  if (stream.eatSpace()) {
    return null;
  }
  stream.match(/([A-Z][A-Za-z0-9_]*)|(`.+`)/);
  state.tokenize = tokenBase$o;
  return "type";
}
function tokenMeth(stream, state) {
  if (stream.eatSpace()) {
    return null;
  }
  stream.match(/([a-zA-Z][A-Za-z0-9_]*)|(`.+`)/);
  state.tokenize = tokenBase$o;
  return "def";
}
function tokenFunProc(stream, state) {
  if (stream.eatSpace()) {
    return null;
  }
  if (!state.hasPassedFirstStage && stream.eat("{")) {
    state.hasPassedFirstStage = true;
    return "bracket";
  } else if (state.hasPassedFirstStage) {
    stream.match(/([A-Z][A-Za-z0-9_]*)|(`.+`)|\$/);
    state.hasPassedFirstStage = false;
    state.tokenize = tokenBase$o;
    return "def";
  } else {
    state.tokenize = tokenBase$o;
    return null;
  }
}
function tokenComment$9(stream, state) {
  var maybeEnd = false, ch2;
  while (ch2 = stream.next()) {
    if (ch2 == "/" && maybeEnd) {
      state.tokenize = tokenBase$o;
      break;
    }
    maybeEnd = ch2 == "*";
  }
  return "comment";
}
function tokenString$h(quote2) {
  return function(stream, state) {
    var escaped = false, next2, end2 = false;
    while ((next2 = stream.next()) != null) {
      if (next2 == quote2 && !escaped) {
        end2 = true;
        break;
      }
      escaped = !escaped && next2 == "\\";
    }
    if (end2 || !escaped)
      state.tokenize = tokenBase$o;
    return "string";
  };
}
function buildElectricInputRegEx() {
  var allClosings = middle$1.concat(end);
  return new RegExp("[\\[\\]]|(" + allClosings.join("|") + ")$");
}
const oz = {
  name: "oz",
  startState: function() {
    return {
      tokenize: tokenBase$o,
      currentIndent: 0,
      doInCurrentLine: false,
      hasPassedFirstStage: false
    };
  },
  token: function(stream, state) {
    if (stream.sol())
      state.doInCurrentLine = 0;
    return state.tokenize(stream, state);
  },
  indent: function(state, textAfter, cx2) {
    var trueText = textAfter.replace(/^\s+|\s+$/g, "");
    if (trueText.match(endKeywords$1) || trueText.match(middleKeywords$1) || trueText.match(/(\[])/))
      return cx2.unit * (state.currentIndent - 1);
    if (state.currentIndent < 0)
      return 0;
    return state.currentIndent * cx2.unit;
  },
  languageData: {
    indentOnInut: buildElectricInputRegEx(),
    commentTokens: { line: "%", block: { open: "/*", close: "*/" } }
  }
};
const oz$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  oz
});
function words$a(str) {
  var obj = {}, words2 = str.split(" ");
  for (var i2 = 0; i2 < words2.length; ++i2) obj[words2[i2]] = true;
  return obj;
}
var keywords$l = words$a(
  "absolute and array asm begin case const constructor destructor div do downto else end file for function goto if implementation in inherited inline interface label mod nil not object of operator or packed procedure program record reintroduce repeat self set shl shr string then to type unit until uses var while with xor as class dispinterface except exports finalization finally initialization inline is library on out packed property raise resourcestring threadvar try absolute abstract alias assembler bitpacked break cdecl continue cppdecl cvar default deprecated dynamic enumerator experimental export external far far16 forward generic helper implements index interrupt iocheck local message name near nodefault noreturn nostackframe oldfpccall otherwise overload override pascal platform private protected public published read register reintroduce result safecall saveregisters softfloat specialize static stdcall stored strict unaligned unimplemented varargs virtual write"
);
var atoms$5 = { "null": true };
var isOperatorChar$7 = /[+\-*&%=<>!?|\/]/;
function tokenBase$n(stream, state) {
  var ch2 = stream.next();
  if (ch2 == "#" && state.startOfLine) {
    stream.skipToEnd();
    return "meta";
  }
  if (ch2 == '"' || ch2 == "'") {
    state.tokenize = tokenString$g(ch2);
    return state.tokenize(stream, state);
  }
  if (ch2 == "(" && stream.eat("*")) {
    state.tokenize = tokenComment$8;
    return tokenComment$8(stream, state);
  }
  if (ch2 == "{") {
    state.tokenize = tokenCommentBraces;
    return tokenCommentBraces(stream, state);
  }
  if (/[\[\]\(\),;\:\.]/.test(ch2)) {
    return null;
  }
  if (/\d/.test(ch2)) {
    stream.eatWhile(/[\w\.]/);
    return "number";
  }
  if (ch2 == "/") {
    if (stream.eat("/")) {
      stream.skipToEnd();
      return "comment";
    }
  }
  if (isOperatorChar$7.test(ch2)) {
    stream.eatWhile(isOperatorChar$7);
    return "operator";
  }
  stream.eatWhile(/[\w\$_]/);
  var cur = stream.current().toLowerCase();
  if (keywords$l.propertyIsEnumerable(cur)) return "keyword";
  if (atoms$5.propertyIsEnumerable(cur)) return "atom";
  return "variable";
}
function tokenString$g(quote2) {
  return function(stream, state) {
    var escaped = false, next2, end2 = false;
    while ((next2 = stream.next()) != null) {
      if (next2 == quote2 && !escaped) {
        end2 = true;
        break;
      }
      escaped = !escaped && next2 == "\\";
    }
    if (end2 || !escaped) state.tokenize = null;
    return "string";
  };
}
function tokenComment$8(stream, state) {
  var maybeEnd = false, ch2;
  while (ch2 = stream.next()) {
    if (ch2 == ")" && maybeEnd) {
      state.tokenize = null;
      break;
    }
    maybeEnd = ch2 == "*";
  }
  return "comment";
}
function tokenCommentBraces(stream, state) {
  var ch2;
  while (ch2 = stream.next()) {
    if (ch2 == "}") {
      state.tokenize = null;
      break;
    }
  }
  return "comment";
}
const pascal = {
  name: "pascal",
  startState: function() {
    return { tokenize: null };
  },
  token: function(stream, state) {
    if (stream.eatSpace()) return null;
    var style2 = (state.tokenize || tokenBase$n)(stream, state);
    if (style2 == "comment" || style2 == "meta") return style2;
    return style2;
  },
  languageData: {
    indentOnInput: /^\s*[{}]$/,
    commentTokens: { block: { open: "(*", close: "*)" } }
  }
};
const pascal$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  pascal
});
function look(stream, c) {
  return stream.string.charAt(stream.pos + (c || 0));
}
function prefix(stream, c) {
  if (c) {
    var x = stream.pos - c;
    return stream.string.substr(x >= 0 ? x : 0, c);
  } else {
    return stream.string.substr(0, stream.pos - 1);
  }
}
function suffix(stream, c) {
  var y = stream.string.length;
  var x = y - stream.pos + 1;
  return stream.string.substr(stream.pos, c && c < y ? c : x);
}
function eatSuffix(stream, c) {
  var x = stream.pos + c;
  var y;
  if (x <= 0)
    stream.pos = 0;
  else if (x >= (y = stream.string.length - 1))
    stream.pos = y;
  else
    stream.pos = x;
}
var PERL = {
  //   null - magic touch
  //   1 - keyword
  //   2 - def
  //   3 - atom
  //   4 - operator
  //   5 - builtin (predefined)
  //   [x,y] - x=1,2,3; y=must be defined if x{...}
  //      PERL operators
  "->": 4,
  "++": 4,
  "--": 4,
  "**": 4,
  //   ! ~ \ and unary + and -
  "=~": 4,
  "!~": 4,
  "*": 4,
  "/": 4,
  "%": 4,
  "x": 4,
  "+": 4,
  "-": 4,
  ".": 4,
  "<<": 4,
  ">>": 4,
  //   named unary operators
  "<": 4,
  ">": 4,
  "<=": 4,
  ">=": 4,
  "lt": 4,
  "gt": 4,
  "le": 4,
  "ge": 4,
  "==": 4,
  "!=": 4,
  "<=>": 4,
  "eq": 4,
  "ne": 4,
  "cmp": 4,
  "~~": 4,
  "&": 4,
  "|": 4,
  "^": 4,
  "&&": 4,
  "||": 4,
  "//": 4,
  "..": 4,
  "...": 4,
  "?": 4,
  ":": 4,
  "=": 4,
  "+=": 4,
  "-=": 4,
  "*=": 4,
  //   etc. ???
  ",": 4,
  "=>": 4,
  "::": 4,
  //   list operators (rightward)
  "not": 4,
  "and": 4,
  "or": 4,
  "xor": 4,
  //      PERL predefined variables (I know, what this is a paranoid idea, but may be needed for people, who learn PERL, and for me as well, ...and may be for you?;)
  "BEGIN": [5, 1],
  "END": [5, 1],
  "PRINT": [5, 1],
  "PRINTF": [5, 1],
  "GETC": [5, 1],
  "READ": [5, 1],
  "READLINE": [5, 1],
  "DESTROY": [5, 1],
  "TIE": [5, 1],
  "TIEHANDLE": [5, 1],
  "UNTIE": [5, 1],
  "STDIN": 5,
  "STDIN_TOP": 5,
  "STDOUT": 5,
  "STDOUT_TOP": 5,
  "STDERR": 5,
  "STDERR_TOP": 5,
  "$ARG": 5,
  "$_": 5,
  "@ARG": 5,
  "@_": 5,
  "$LIST_SEPARATOR": 5,
  '$"': 5,
  "$PROCESS_ID": 5,
  "$PID": 5,
  "$$": 5,
  "$REAL_GROUP_ID": 5,
  "$GID": 5,
  "$(": 5,
  "$EFFECTIVE_GROUP_ID": 5,
  "$EGID": 5,
  "$)": 5,
  "$PROGRAM_NAME": 5,
  "$0": 5,
  "$SUBSCRIPT_SEPARATOR": 5,
  "$SUBSEP": 5,
  "$;": 5,
  "$REAL_USER_ID": 5,
  "$UID": 5,
  "$<": 5,
  "$EFFECTIVE_USER_ID": 5,
  "$EUID": 5,
  "$>": 5,
  "$a": 5,
  "$b": 5,
  "$COMPILING": 5,
  "$^C": 5,
  "$DEBUGGING": 5,
  "$^D": 5,
  "${^ENCODING}": 5,
  "$ENV": 5,
  "%ENV": 5,
  "$SYSTEM_FD_MAX": 5,
  "$^F": 5,
  "@F": 5,
  "${^GLOBAL_PHASE}": 5,
  "$^H": 5,
  "%^H": 5,
  "@INC": 5,
  "%INC": 5,
  "$INPLACE_EDIT": 5,
  "$^I": 5,
  "$^M": 5,
  "$OSNAME": 5,
  "$^O": 5,
  "${^OPEN}": 5,
  "$PERLDB": 5,
  "$^P": 5,
  "$SIG": 5,
  "%SIG": 5,
  "$BASETIME": 5,
  "$^T": 5,
  "${^TAINT}": 5,
  "${^UNICODE}": 5,
  "${^UTF8CACHE}": 5,
  "${^UTF8LOCALE}": 5,
  "$PERL_VERSION": 5,
  "$^V": 5,
  "${^WIN32_SLOPPY_STAT}": 5,
  "$EXECUTABLE_NAME": 5,
  "$^X": 5,
  "$1": 5,
  // - regexp $1, $2...
  "$MATCH": 5,
  "$&": 5,
  "${^MATCH}": 5,
  "$PREMATCH": 5,
  "$`": 5,
  "${^PREMATCH}": 5,
  "$POSTMATCH": 5,
  "$'": 5,
  "${^POSTMATCH}": 5,
  "$LAST_PAREN_MATCH": 5,
  "$+": 5,
  "$LAST_SUBMATCH_RESULT": 5,
  "$^N": 5,
  "@LAST_MATCH_END": 5,
  "@+": 5,
  "%LAST_PAREN_MATCH": 5,
  "%+": 5,
  "@LAST_MATCH_START": 5,
  "@-": 5,
  "%LAST_MATCH_START": 5,
  "%-": 5,
  "$LAST_REGEXP_CODE_RESULT": 5,
  "$^R": 5,
  "${^RE_DEBUG_FLAGS}": 5,
  "${^RE_TRIE_MAXBUF}": 5,
  "$ARGV": 5,
  "@ARGV": 5,
  "ARGV": 5,
  "ARGVOUT": 5,
  "$OUTPUT_FIELD_SEPARATOR": 5,
  "$OFS": 5,
  "$,": 5,
  "$INPUT_LINE_NUMBER": 5,
  "$NR": 5,
  "$.": 5,
  "$INPUT_RECORD_SEPARATOR": 5,
  "$RS": 5,
  "$/": 5,
  "$OUTPUT_RECORD_SEPARATOR": 5,
  "$ORS": 5,
  "$\\": 5,
  "$OUTPUT_AUTOFLUSH": 5,
  "$|": 5,
  "$ACCUMULATOR": 5,
  "$^A": 5,
  "$FORMAT_FORMFEED": 5,
  "$^L": 5,
  "$FORMAT_PAGE_NUMBER": 5,
  "$%": 5,
  "$FORMAT_LINES_LEFT": 5,
  "$-": 5,
  "$FORMAT_LINE_BREAK_CHARACTERS": 5,
  "$:": 5,
  "$FORMAT_LINES_PER_PAGE": 5,
  "$=": 5,
  "$FORMAT_TOP_NAME": 5,
  "$^": 5,
  "$FORMAT_NAME": 5,
  "$~": 5,
  "${^CHILD_ERROR_NATIVE}": 5,
  "$EXTENDED_OS_ERROR": 5,
  "$^E": 5,
  "$EXCEPTIONS_BEING_CAUGHT": 5,
  "$^S": 5,
  "$WARNING": 5,
  "$^W": 5,
  "${^WARNING_BITS}": 5,
  "$OS_ERROR": 5,
  "$ERRNO": 5,
  "$!": 5,
  "%OS_ERROR": 5,
  "%ERRNO": 5,
  "%!": 5,
  "$CHILD_ERROR": 5,
  "$?": 5,
  "$EVAL_ERROR": 5,
  "$@": 5,
  "$OFMT": 5,
  "$#": 5,
  "$*": 5,
  "$ARRAY_BASE": 5,
  "$[": 5,
  "$OLD_PERL_VERSION": 5,
  "$]": 5,
  //      PERL blocks
  "if": [1, 1],
  elsif: [1, 1],
  "else": [1, 1],
  "while": [1, 1],
  unless: [1, 1],
  "for": [1, 1],
  foreach: [1, 1],
  //      PERL functions
  "abs": 1,
  // - absolute value function
  accept: 1,
  // - accept an incoming socket connect
  alarm: 1,
  // - schedule a SIGALRM
  "atan2": 1,
  // - arctangent of Y/X in the range -PI to PI
  bind: 1,
  // - binds an address to a socket
  binmode: 1,
  // - prepare binary files for I/O
  bless: 1,
  // - create an object
  bootstrap: 1,
  //
  "break": 1,
  // - break out of a "given" block
  caller: 1,
  // - get context of the current subroutine call
  chdir: 1,
  // - change your current working directory
  chmod: 1,
  // - changes the permissions on a list of files
  chomp: 1,
  // - remove a trailing record separator from a string
  chop: 1,
  // - remove the last character from a string
  chown: 1,
  // - change the ownership on a list of files
  chr: 1,
  // - get character this number represents
  chroot: 1,
  // - make directory new root for path lookups
  close: 1,
  // - close file (or pipe or socket) handle
  closedir: 1,
  // - close directory handle
  connect: 1,
  // - connect to a remote socket
  "continue": [1, 1],
  // - optional trailing block in a while or foreach
  "cos": 1,
  // - cosine function
  crypt: 1,
  // - one-way passwd-style encryption
  dbmclose: 1,
  // - breaks binding on a tied dbm file
  dbmopen: 1,
  // - create binding on a tied dbm file
  "default": 1,
  //
  defined: 1,
  // - test whether a value, variable, or function is defined
  "delete": 1,
  // - deletes a value from a hash
  die: 1,
  // - raise an exception or bail out
  "do": 1,
  // - turn a BLOCK into a TERM
  dump: 1,
  // - create an immediate core dump
  each: 1,
  // - retrieve the next key/value pair from a hash
  endgrent: 1,
  // - be done using group file
  endhostent: 1,
  // - be done using hosts file
  endnetent: 1,
  // - be done using networks file
  endprotoent: 1,
  // - be done using protocols file
  endpwent: 1,
  // - be done using passwd file
  endservent: 1,
  // - be done using services file
  eof: 1,
  // - test a filehandle for its end
  "eval": 1,
  // - catch exceptions or compile and run code
  "exec": 1,
  // - abandon this program to run another
  exists: 1,
  // - test whether a hash key is present
  exit: 1,
  // - terminate this program
  "exp": 1,
  // - raise I to a power
  fcntl: 1,
  // - file control system call
  fileno: 1,
  // - return file descriptor from filehandle
  flock: 1,
  // - lock an entire file with an advisory lock
  fork: 1,
  // - create a new process just like this one
  format: 1,
  // - declare a picture format with use by the write() function
  formline: 1,
  // - internal function used for formats
  getc: 1,
  // - get the next character from the filehandle
  getgrent: 1,
  // - get next group record
  getgrgid: 1,
  // - get group record given group user ID
  getgrnam: 1,
  // - get group record given group name
  gethostbyaddr: 1,
  // - get host record given its address
  gethostbyname: 1,
  // - get host record given name
  gethostent: 1,
  // - get next hosts record
  getlogin: 1,
  // - return who logged in at this tty
  getnetbyaddr: 1,
  // - get network record given its address
  getnetbyname: 1,
  // - get networks record given name
  getnetent: 1,
  // - get next networks record
  getpeername: 1,
  // - find the other end of a socket connection
  getpgrp: 1,
  // - get process group
  getppid: 1,
  // - get parent process ID
  getpriority: 1,
  // - get current nice value
  getprotobyname: 1,
  // - get protocol record given name
  getprotobynumber: 1,
  // - get protocol record numeric protocol
  getprotoent: 1,
  // - get next protocols record
  getpwent: 1,
  // - get next passwd record
  getpwnam: 1,
  // - get passwd record given user login name
  getpwuid: 1,
  // - get passwd record given user ID
  getservbyname: 1,
  // - get services record given its name
  getservbyport: 1,
  // - get services record given numeric port
  getservent: 1,
  // - get next services record
  getsockname: 1,
  // - retrieve the sockaddr for a given socket
  getsockopt: 1,
  // - get socket options on a given socket
  given: 1,
  //
  glob: 1,
  // - expand filenames using wildcards
  gmtime: 1,
  // - convert UNIX time into record or string using Greenwich time
  "goto": 1,
  // - create spaghetti code
  grep: 1,
  // - locate elements in a list test true against a given criterion
  hex: 1,
  // - convert a string to a hexadecimal number
  "import": 1,
  // - patch a module's namespace into your own
  index: 1,
  // - find a substring within a string
  "int": 1,
  // - get the integer portion of a number
  ioctl: 1,
  // - system-dependent device control system call
  "join": 1,
  // - join a list into a string using a separator
  keys: 1,
  // - retrieve list of indices from a hash
  kill: 1,
  // - send a signal to a process or process group
  last: 1,
  // - exit a block prematurely
  lc: 1,
  // - return lower-case version of a string
  lcfirst: 1,
  // - return a string with just the next letter in lower case
  length: 1,
  // - return the number of bytes in a string
  "link": 1,
  // - create a hard link in the filesystem
  listen: 1,
  // - register your socket as a server
  local: 2,
  // - create a temporary value for a global variable (dynamic scoping)
  localtime: 1,
  // - convert UNIX time into record or string using local time
  lock: 1,
  // - get a thread lock on a variable, subroutine, or method
  "log": 1,
  // - retrieve the natural logarithm for a number
  lstat: 1,
  // - stat a symbolic link
  m: null,
  // - match a string with a regular expression pattern
  map: 1,
  // - apply a change to a list to get back a new list with the changes
  mkdir: 1,
  // - create a directory
  msgctl: 1,
  // - SysV IPC message control operations
  msgget: 1,
  // - get SysV IPC message queue
  msgrcv: 1,
  // - receive a SysV IPC message from a message queue
  msgsnd: 1,
  // - send a SysV IPC message to a message queue
  my: 2,
  // - declare and assign a local variable (lexical scoping)
  "new": 1,
  //
  next: 1,
  // - iterate a block prematurely
  no: 1,
  // - unimport some module symbols or semantics at compile time
  oct: 1,
  // - convert a string to an octal number
  open: 1,
  // - open a file, pipe, or descriptor
  opendir: 1,
  // - open a directory
  ord: 1,
  // - find a character's numeric representation
  our: 2,
  // - declare and assign a package variable (lexical scoping)
  pack: 1,
  // - convert a list into a binary representation
  "package": 1,
  // - declare a separate global namespace
  pipe: 1,
  // - open a pair of connected filehandles
  pop: 1,
  // - remove the last element from an array and return it
  pos: 1,
  // - find or set the offset for the last/next m//g search
  print: 1,
  // - output a list to a filehandle
  printf: 1,
  // - output a formatted list to a filehandle
  prototype: 1,
  // - get the prototype (if any) of a subroutine
  push: 1,
  // - append one or more elements to an array
  q: null,
  // - singly quote a string
  qq: null,
  // - doubly quote a string
  qr: null,
  // - Compile pattern
  quotemeta: null,
  // - quote regular expression magic characters
  qw: null,
  // - quote a list of words
  qx: null,
  // - backquote quote a string
  rand: 1,
  // - retrieve the next pseudorandom number
  read: 1,
  // - fixed-length buffered input from a filehandle
  readdir: 1,
  // - get a directory from a directory handle
  readline: 1,
  // - fetch a record from a file
  readlink: 1,
  // - determine where a symbolic link is pointing
  readpipe: 1,
  // - execute a system command and collect standard output
  recv: 1,
  // - receive a message over a Socket
  redo: 1,
  // - start this loop iteration over again
  ref: 1,
  // - find out the type of thing being referenced
  rename: 1,
  // - change a filename
  require: 1,
  // - load in external functions from a library at runtime
  reset: 1,
  // - clear all variables of a given name
  "return": 1,
  // - get out of a function early
  reverse: 1,
  // - flip a string or a list
  rewinddir: 1,
  // - reset directory handle
  rindex: 1,
  // - right-to-left substring search
  rmdir: 1,
  // - remove a directory
  s: null,
  // - replace a pattern with a string
  say: 1,
  // - print with newline
  scalar: 1,
  // - force a scalar context
  seek: 1,
  // - reposition file pointer for random-access I/O
  seekdir: 1,
  // - reposition directory pointer
  select: 1,
  // - reset default output or do I/O multiplexing
  semctl: 1,
  // - SysV semaphore control operations
  semget: 1,
  // - get set of SysV semaphores
  semop: 1,
  // - SysV semaphore operations
  send: 1,
  // - send a message over a socket
  setgrent: 1,
  // - prepare group file for use
  sethostent: 1,
  // - prepare hosts file for use
  setnetent: 1,
  // - prepare networks file for use
  setpgrp: 1,
  // - set the process group of a process
  setpriority: 1,
  // - set a process's nice value
  setprotoent: 1,
  // - prepare protocols file for use
  setpwent: 1,
  // - prepare passwd file for use
  setservent: 1,
  // - prepare services file for use
  setsockopt: 1,
  // - set some socket options
  shift: 1,
  // - remove the first element of an array, and return it
  shmctl: 1,
  // - SysV shared memory operations
  shmget: 1,
  // - get SysV shared memory segment identifier
  shmread: 1,
  // - read SysV shared memory
  shmwrite: 1,
  // - write SysV shared memory
  shutdown: 1,
  // - close down just half of a socket connection
  "sin": 1,
  // - return the sine of a number
  sleep: 1,
  // - block for some number of seconds
  socket: 1,
  // - create a socket
  socketpair: 1,
  // - create a pair of sockets
  "sort": 1,
  // - sort a list of values
  splice: 1,
  // - add or remove elements anywhere in an array
  "split": 1,
  // - split up a string using a regexp delimiter
  sprintf: 1,
  // - formatted print into a string
  "sqrt": 1,
  // - square root function
  srand: 1,
  // - seed the random number generator
  stat: 1,
  // - get a file's status information
  state: 1,
  // - declare and assign a state variable (persistent lexical scoping)
  study: 1,
  // - optimize input data for repeated searches
  "sub": 1,
  // - declare a subroutine, possibly anonymously
  "substr": 1,
  // - get or alter a portion of a string
  symlink: 1,
  // - create a symbolic link to a file
  syscall: 1,
  // - execute an arbitrary system call
  sysopen: 1,
  // - open a file, pipe, or descriptor
  sysread: 1,
  // - fixed-length unbuffered input from a filehandle
  sysseek: 1,
  // - position I/O pointer on handle used with sysread and syswrite
  system: 1,
  // - run a separate program
  syswrite: 1,
  // - fixed-length unbuffered output to a filehandle
  tell: 1,
  // - get current seekpointer on a filehandle
  telldir: 1,
  // - get current seekpointer on a directory handle
  tie: 1,
  // - bind a variable to an object class
  tied: 1,
  // - get a reference to the object underlying a tied variable
  time: 1,
  // - return number of seconds since 1970
  times: 1,
  // - return elapsed time for self and child processes
  tr: null,
  // - transliterate a string
  truncate: 1,
  // - shorten a file
  uc: 1,
  // - return upper-case version of a string
  ucfirst: 1,
  // - return a string with just the next letter in upper case
  umask: 1,
  // - set file creation mode mask
  undef: 1,
  // - remove a variable or function definition
  unlink: 1,
  // - remove one link to a file
  unpack: 1,
  // - convert binary structure into normal perl variables
  unshift: 1,
  // - prepend more elements to the beginning of a list
  untie: 1,
  // - break a tie binding to a variable
  use: 1,
  // - load in a module at compile time
  utime: 1,
  // - set a file's last access and modify times
  values: 1,
  // - return a list of the values in a hash
  vec: 1,
  // - test or set particular bits in a string
  wait: 1,
  // - wait for any child process to die
  waitpid: 1,
  // - wait for a particular child process to die
  wantarray: 1,
  // - get void vs scalar vs list context of current subroutine call
  warn: 1,
  // - print debugging info
  when: 1,
  //
  write: 1,
  // - print a picture record
  y: null
};
var RXstyle = "string.special";
var RXmodifiers = /[goseximacplud]/;
function tokenChain(stream, state, chain2, style2, tail) {
  state.chain = null;
  state.style = null;
  state.tail = null;
  state.tokenize = function(stream2, state2) {
    var e = false, c, i2 = 0;
    while (c = stream2.next()) {
      if (c === chain2[i2] && !e) {
        if (chain2[++i2] !== void 0) {
          state2.chain = chain2[i2];
          state2.style = style2;
          state2.tail = tail;
        } else if (tail)
          stream2.eatWhile(tail);
        state2.tokenize = tokenPerl;
        return style2;
      }
      e = !e && c == "\\";
    }
    return style2;
  };
  return state.tokenize(stream, state);
}
function tokenSOMETHING(stream, state, string2) {
  state.tokenize = function(stream2, state2) {
    if (stream2.string == string2)
      state2.tokenize = tokenPerl;
    stream2.skipToEnd();
    return "string";
  };
  return state.tokenize(stream, state);
}
function tokenPerl(stream, state) {
  if (stream.eatSpace())
    return null;
  if (state.chain)
    return tokenChain(stream, state, state.chain, state.style, state.tail);
  if (stream.match(/^(\-?((\d[\d_]*)?\.\d+(e[+-]?\d+)?|\d+\.\d*)|0x[\da-fA-F_]+|0b[01_]+|\d[\d_]*(e[+-]?\d+)?)/))
    return "number";
  if (stream.match(/^<<(?=[_a-zA-Z])/)) {
    stream.eatWhile(/\w/);
    return tokenSOMETHING(stream, state, stream.current().substr(2));
  }
  if (stream.sol() && stream.match(/^\=item(?!\w)/)) {
    return tokenSOMETHING(stream, state, "=cut");
  }
  var ch2 = stream.next();
  if (ch2 == '"' || ch2 == "'") {
    if (prefix(stream, 3) == "<<" + ch2) {
      var p = stream.pos;
      stream.eatWhile(/\w/);
      var n = stream.current().substr(1);
      if (n && stream.eat(ch2))
        return tokenSOMETHING(stream, state, n);
      stream.pos = p;
    }
    return tokenChain(stream, state, [ch2], "string");
  }
  if (ch2 == "q") {
    var c = look(stream, -2);
    if (!(c && /\w/.test(c))) {
      c = look(stream, 0);
      if (c == "x") {
        c = look(stream, 1);
        if (c == "(") {
          eatSuffix(stream, 2);
          return tokenChain(stream, state, [")"], RXstyle, RXmodifiers);
        }
        if (c == "[") {
          eatSuffix(stream, 2);
          return tokenChain(stream, state, ["]"], RXstyle, RXmodifiers);
        }
        if (c == "{") {
          eatSuffix(stream, 2);
          return tokenChain(stream, state, ["}"], RXstyle, RXmodifiers);
        }
        if (c == "<") {
          eatSuffix(stream, 2);
          return tokenChain(stream, state, [">"], RXstyle, RXmodifiers);
        }
        if (/[\^'"!~\/]/.test(c)) {
          eatSuffix(stream, 1);
          return tokenChain(stream, state, [stream.eat(c)], RXstyle, RXmodifiers);
        }
      } else if (c == "q") {
        c = look(stream, 1);
        if (c == "(") {
          eatSuffix(stream, 2);
          return tokenChain(stream, state, [")"], "string");
        }
        if (c == "[") {
          eatSuffix(stream, 2);
          return tokenChain(stream, state, ["]"], "string");
        }
        if (c == "{") {
          eatSuffix(stream, 2);
          return tokenChain(stream, state, ["}"], "string");
        }
        if (c == "<") {
          eatSuffix(stream, 2);
          return tokenChain(stream, state, [">"], "string");
        }
        if (/[\^'"!~\/]/.test(c)) {
          eatSuffix(stream, 1);
          return tokenChain(stream, state, [stream.eat(c)], "string");
        }
      } else if (c == "w") {
        c = look(stream, 1);
        if (c == "(") {
          eatSuffix(stream, 2);
          return tokenChain(stream, state, [")"], "bracket");
        }
        if (c == "[") {
          eatSuffix(stream, 2);
          return tokenChain(stream, state, ["]"], "bracket");
        }
        if (c == "{") {
          eatSuffix(stream, 2);
          return tokenChain(stream, state, ["}"], "bracket");
        }
        if (c == "<") {
          eatSuffix(stream, 2);
          return tokenChain(stream, state, [">"], "bracket");
        }
        if (/[\^'"!~\/]/.test(c)) {
          eatSuffix(stream, 1);
          return tokenChain(stream, state, [stream.eat(c)], "bracket");
        }
      } else if (c == "r") {
        c = look(stream, 1);
        if (c == "(") {
          eatSuffix(stream, 2);
          return tokenChain(stream, state, [")"], RXstyle, RXmodifiers);
        }
        if (c == "[") {
          eatSuffix(stream, 2);
          return tokenChain(stream, state, ["]"], RXstyle, RXmodifiers);
        }
        if (c == "{") {
          eatSuffix(stream, 2);
          return tokenChain(stream, state, ["}"], RXstyle, RXmodifiers);
        }
        if (c == "<") {
          eatSuffix(stream, 2);
          return tokenChain(stream, state, [">"], RXstyle, RXmodifiers);
        }
        if (/[\^'"!~\/]/.test(c)) {
          eatSuffix(stream, 1);
          return tokenChain(stream, state, [stream.eat(c)], RXstyle, RXmodifiers);
        }
      } else if (/[\^'"!~\/(\[{<]/.test(c)) {
        if (c == "(") {
          eatSuffix(stream, 1);
          return tokenChain(stream, state, [")"], "string");
        }
        if (c == "[") {
          eatSuffix(stream, 1);
          return tokenChain(stream, state, ["]"], "string");
        }
        if (c == "{") {
          eatSuffix(stream, 1);
          return tokenChain(stream, state, ["}"], "string");
        }
        if (c == "<") {
          eatSuffix(stream, 1);
          return tokenChain(stream, state, [">"], "string");
        }
        if (/[\^'"!~\/]/.test(c)) {
          return tokenChain(stream, state, [stream.eat(c)], "string");
        }
      }
    }
  }
  if (ch2 == "m") {
    var c = look(stream, -2);
    if (!(c && /\w/.test(c))) {
      c = stream.eat(/[(\[{<\^'"!~\/]/);
      if (c) {
        if (/[\^'"!~\/]/.test(c)) {
          return tokenChain(stream, state, [c], RXstyle, RXmodifiers);
        }
        if (c == "(") {
          return tokenChain(stream, state, [")"], RXstyle, RXmodifiers);
        }
        if (c == "[") {
          return tokenChain(stream, state, ["]"], RXstyle, RXmodifiers);
        }
        if (c == "{") {
          return tokenChain(stream, state, ["}"], RXstyle, RXmodifiers);
        }
        if (c == "<") {
          return tokenChain(stream, state, [">"], RXstyle, RXmodifiers);
        }
      }
    }
  }
  if (ch2 == "s") {
    var c = /[\/>\]})\w]/.test(look(stream, -2));
    if (!c) {
      c = stream.eat(/[(\[{<\^'"!~\/]/);
      if (c) {
        if (c == "[")
          return tokenChain(stream, state, ["]", "]"], RXstyle, RXmodifiers);
        if (c == "{")
          return tokenChain(stream, state, ["}", "}"], RXstyle, RXmodifiers);
        if (c == "<")
          return tokenChain(stream, state, [">", ">"], RXstyle, RXmodifiers);
        if (c == "(")
          return tokenChain(stream, state, [")", ")"], RXstyle, RXmodifiers);
        return tokenChain(stream, state, [c, c], RXstyle, RXmodifiers);
      }
    }
  }
  if (ch2 == "y") {
    var c = /[\/>\]})\w]/.test(look(stream, -2));
    if (!c) {
      c = stream.eat(/[(\[{<\^'"!~\/]/);
      if (c) {
        if (c == "[")
          return tokenChain(stream, state, ["]", "]"], RXstyle, RXmodifiers);
        if (c == "{")
          return tokenChain(stream, state, ["}", "}"], RXstyle, RXmodifiers);
        if (c == "<")
          return tokenChain(stream, state, [">", ">"], RXstyle, RXmodifiers);
        if (c == "(")
          return tokenChain(stream, state, [")", ")"], RXstyle, RXmodifiers);
        return tokenChain(stream, state, [c, c], RXstyle, RXmodifiers);
      }
    }
  }
  if (ch2 == "t") {
    var c = /[\/>\]})\w]/.test(look(stream, -2));
    if (!c) {
      c = stream.eat("r");
      if (c) {
        c = stream.eat(/[(\[{<\^'"!~\/]/);
        if (c) {
          if (c == "[")
            return tokenChain(stream, state, ["]", "]"], RXstyle, RXmodifiers);
          if (c == "{")
            return tokenChain(stream, state, ["}", "}"], RXstyle, RXmodifiers);
          if (c == "<")
            return tokenChain(stream, state, [">", ">"], RXstyle, RXmodifiers);
          if (c == "(")
            return tokenChain(stream, state, [")", ")"], RXstyle, RXmodifiers);
          return tokenChain(stream, state, [c, c], RXstyle, RXmodifiers);
        }
      }
    }
  }
  if (ch2 == "`") {
    return tokenChain(stream, state, [ch2], "builtin");
  }
  if (ch2 == "/") {
    if (!/~\s*$/.test(prefix(stream)))
      return "operator";
    else
      return tokenChain(stream, state, [ch2], RXstyle, RXmodifiers);
  }
  if (ch2 == "$") {
    var p = stream.pos;
    if (stream.eatWhile(/\d/) || stream.eat("{") && stream.eatWhile(/\d/) && stream.eat("}"))
      return "builtin";
    else
      stream.pos = p;
  }
  if (/[$@%]/.test(ch2)) {
    var p = stream.pos;
    if (stream.eat("^") && stream.eat(/[A-Z]/) || !/[@$%&]/.test(look(stream, -2)) && stream.eat(/[=|\\\-#?@;:&`~\^!\[\]*'"$+.,\/<>()]/)) {
      var c = stream.current();
      if (PERL[c])
        return "builtin";
    }
    stream.pos = p;
  }
  if (/[$@%&]/.test(ch2)) {
    if (stream.eatWhile(/[\w$]/) || stream.eat("{") && stream.eatWhile(/[\w$]/) && stream.eat("}")) {
      var c = stream.current();
      if (PERL[c])
        return "builtin";
      else
        return "variable";
    }
  }
  if (ch2 == "#") {
    if (look(stream, -2) != "$") {
      stream.skipToEnd();
      return "comment";
    }
  }
  if (/[:+\-\^*$&%@=<>!?|\/~\.]/.test(ch2)) {
    var p = stream.pos;
    stream.eatWhile(/[:+\-\^*$&%@=<>!?|\/~\.]/);
    if (PERL[stream.current()])
      return "operator";
    else
      stream.pos = p;
  }
  if (ch2 == "_") {
    if (stream.pos == 1) {
      if (suffix(stream, 6) == "_END__") {
        return tokenChain(stream, state, ["\0"], "comment");
      } else if (suffix(stream, 7) == "_DATA__") {
        return tokenChain(stream, state, ["\0"], "builtin");
      } else if (suffix(stream, 7) == "_C__") {
        return tokenChain(stream, state, ["\0"], "string");
      }
    }
  }
  if (/\w/.test(ch2)) {
    var p = stream.pos;
    if (look(stream, -2) == "{" && (look(stream, 0) == "}" || stream.eatWhile(/\w/) && look(stream, 0) == "}"))
      return "string";
    else
      stream.pos = p;
  }
  if (/[A-Z]/.test(ch2)) {
    var l = look(stream, -2);
    var p = stream.pos;
    stream.eatWhile(/[A-Z_]/);
    if (/[\da-z]/.test(look(stream, 0))) {
      stream.pos = p;
    } else {
      var c = PERL[stream.current()];
      if (!c)
        return "meta";
      if (c[1])
        c = c[0];
      if (l != ":") {
        if (c == 1)
          return "keyword";
        else if (c == 2)
          return "def";
        else if (c == 3)
          return "atom";
        else if (c == 4)
          return "operator";
        else if (c == 5)
          return "builtin";
        else
          return "meta";
      } else
        return "meta";
    }
  }
  if (/[a-zA-Z_]/.test(ch2)) {
    var l = look(stream, -2);
    stream.eatWhile(/\w/);
    var c = PERL[stream.current()];
    if (!c)
      return "meta";
    if (c[1])
      c = c[0];
    if (l != ":") {
      if (c == 1)
        return "keyword";
      else if (c == 2)
        return "def";
      else if (c == 3)
        return "atom";
      else if (c == 4)
        return "operator";
      else if (c == 5)
        return "builtin";
      else
        return "meta";
    } else
      return "meta";
  }
  return null;
}
const perl = {
  name: "perl",
  startState: function() {
    return {
      tokenize: tokenPerl,
      chain: null,
      style: null,
      tail: null
    };
  },
  token: function(stream, state) {
    return (state.tokenize || tokenPerl)(stream, state);
  },
  languageData: {
    commentTokens: { line: "#" },
    wordChars: "$"
  }
};
const perl$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  perl
});
function words$9(str) {
  var obj = {}, words2 = str.split(" ");
  for (var i2 = 0; i2 < words2.length; ++i2) obj[words2[i2]] = true;
  return obj;
}
var pBuiltins = "ABS ACOS ARITY ASIN ATAN AVG BAGSIZE BINSTORAGE BLOOM BUILDBLOOM CBRT CEIL CONCAT COR COS COSH COUNT COUNT_STAR COV CONSTANTSIZE CUBEDIMENSIONS DIFF DISTINCT DOUBLEABS DOUBLEAVG DOUBLEBASE DOUBLEMAX DOUBLEMIN DOUBLEROUND DOUBLESUM EXP FLOOR FLOATABS FLOATAVG FLOATMAX FLOATMIN FLOATROUND FLOATSUM GENERICINVOKER INDEXOF INTABS INTAVG INTMAX INTMIN INTSUM INVOKEFORDOUBLE INVOKEFORFLOAT INVOKEFORINT INVOKEFORLONG INVOKEFORSTRING INVOKER ISEMPTY JSONLOADER JSONMETADATA JSONSTORAGE LAST_INDEX_OF LCFIRST LOG LOG10 LOWER LONGABS LONGAVG LONGMAX LONGMIN LONGSUM MAX MIN MAPSIZE MONITOREDUDF NONDETERMINISTIC OUTPUTSCHEMA  PIGSTORAGE PIGSTREAMING RANDOM REGEX_EXTRACT REGEX_EXTRACT_ALL REPLACE ROUND SIN SINH SIZE SQRT STRSPLIT SUBSTRING SUM STRINGCONCAT STRINGMAX STRINGMIN STRINGSIZE TAN TANH TOBAG TOKENIZE TOMAP TOP TOTUPLE TRIM TEXTLOADER TUPLESIZE UCFIRST UPPER UTF8STORAGECONVERTER ";
var pKeywords = "VOID IMPORT RETURNS DEFINE LOAD FILTER FOREACH ORDER CUBE DISTINCT COGROUP JOIN CROSS UNION SPLIT INTO IF OTHERWISE ALL AS BY USING INNER OUTER ONSCHEMA PARALLEL PARTITION GROUP AND OR NOT GENERATE FLATTEN ASC DESC IS STREAM THROUGH STORE MAPREDUCE SHIP CACHE INPUT OUTPUT STDERROR STDIN STDOUT LIMIT SAMPLE LEFT RIGHT FULL EQ GT LT GTE LTE NEQ MATCHES TRUE FALSE DUMP";
var pTypes = "BOOLEAN INT LONG FLOAT DOUBLE CHARARRAY BYTEARRAY BAG TUPLE MAP ";
var builtins$3 = words$9(pBuiltins), keywords$k = words$9(pKeywords), types$4 = words$9(pTypes);
var isOperatorChar$6 = /[*+\-%<>=&?:\/!|]/;
function chain$5(stream, state, f) {
  state.tokenize = f;
  return f(stream, state);
}
function tokenComment$7(stream, state) {
  var isEnd = false;
  var ch2;
  while (ch2 = stream.next()) {
    if (ch2 == "/" && isEnd) {
      state.tokenize = tokenBase$m;
      break;
    }
    isEnd = ch2 == "*";
  }
  return "comment";
}
function tokenString$f(quote2) {
  return function(stream, state) {
    var escaped = false, next2, end2 = false;
    while ((next2 = stream.next()) != null) {
      if (next2 == quote2 && !escaped) {
        end2 = true;
        break;
      }
      escaped = !escaped && next2 == "\\";
    }
    if (end2 || !escaped)
      state.tokenize = tokenBase$m;
    return "error";
  };
}
function tokenBase$m(stream, state) {
  var ch2 = stream.next();
  if (ch2 == '"' || ch2 == "'")
    return chain$5(stream, state, tokenString$f(ch2));
  else if (/[\[\]{}\(\),;\.]/.test(ch2))
    return null;
  else if (/\d/.test(ch2)) {
    stream.eatWhile(/[\w\.]/);
    return "number";
  } else if (ch2 == "/") {
    if (stream.eat("*")) {
      return chain$5(stream, state, tokenComment$7);
    } else {
      stream.eatWhile(isOperatorChar$6);
      return "operator";
    }
  } else if (ch2 == "-") {
    if (stream.eat("-")) {
      stream.skipToEnd();
      return "comment";
    } else {
      stream.eatWhile(isOperatorChar$6);
      return "operator";
    }
  } else if (isOperatorChar$6.test(ch2)) {
    stream.eatWhile(isOperatorChar$6);
    return "operator";
  } else {
    stream.eatWhile(/[\w\$_]/);
    if (keywords$k && keywords$k.propertyIsEnumerable(stream.current().toUpperCase())) {
      if (!stream.eat(")") && !stream.eat("."))
        return "keyword";
    }
    if (builtins$3 && builtins$3.propertyIsEnumerable(stream.current().toUpperCase()))
      return "builtin";
    if (types$4 && types$4.propertyIsEnumerable(stream.current().toUpperCase()))
      return "type";
    return "variable";
  }
}
const pig = {
  name: "pig",
  startState: function() {
    return {
      tokenize: tokenBase$m,
      startOfLine: true
    };
  },
  token: function(stream, state) {
    if (stream.eatSpace()) return null;
    var style2 = state.tokenize(stream, state);
    return style2;
  },
  languageData: {
    autocomplete: (pBuiltins + pTypes + pKeywords).split(" ")
  }
};
const pig$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  pig
});
function buildRegexp(patterns2, options) {
  options = options || {};
  var prefix2 = options.prefix !== void 0 ? options.prefix : "^";
  var suffix2 = options.suffix !== void 0 ? options.suffix : "\\b";
  for (var i2 = 0; i2 < patterns2.length; i2++) {
    if (patterns2[i2] instanceof RegExp) {
      patterns2[i2] = patterns2[i2].source;
    } else {
      patterns2[i2] = patterns2[i2].replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    }
  }
  return new RegExp(prefix2 + "(" + patterns2.join("|") + ")" + suffix2, "i");
}
var notCharacterOrDash = "(?=[^A-Za-z\\d\\-_]|$)";
var varNames = /[\w\-:]/;
var keywords$j = buildRegexp([
  /begin|break|catch|continue|data|default|do|dynamicparam/,
  /else|elseif|end|exit|filter|finally|for|foreach|from|function|if|in/,
  /param|process|return|switch|throw|trap|try|until|where|while/
], { suffix: notCharacterOrDash });
var punctuation = /[\[\]{},;`\\\.]|@[({]/;
var wordOperators$1 = buildRegexp([
  "f",
  /b?not/,
  /[ic]?split/,
  "join",
  /is(not)?/,
  "as",
  /[ic]?(eq|ne|[gl][te])/,
  /[ic]?(not)?(like|match|contains)/,
  /[ic]?replace/,
  /b?(and|or|xor)/
], { prefix: "-" });
var symbolOperators = /[+\-*\/%]=|\+\+|--|\.\.|[+\-*&^%:=!|\/]|<(?!#)|(?!#)>/;
var operators$2 = buildRegexp([wordOperators$1, symbolOperators], { suffix: "" });
var numbers = /^((0x[\da-f]+)|((\d+\.\d+|\d\.|\.\d+|\d+)(e[\+\-]?\d+)?))[ld]?([kmgtp]b)?/i;
var identifiers$3 = /^[A-Za-z\_][A-Za-z\-\_\d]*\b/;
var symbolBuiltins = /[A-Z]:|%|\?/i;
var namedBuiltins = buildRegexp([
  /Add-(Computer|Content|History|Member|PSSnapin|Type)/,
  /Checkpoint-Computer/,
  /Clear-(Content|EventLog|History|Host|Item(Property)?|Variable)/,
  /Compare-Object/,
  /Complete-Transaction/,
  /Connect-PSSession/,
  /ConvertFrom-(Csv|Json|SecureString|StringData)/,
  /Convert-Path/,
  /ConvertTo-(Csv|Html|Json|SecureString|Xml)/,
  /Copy-Item(Property)?/,
  /Debug-Process/,
  /Disable-(ComputerRestore|PSBreakpoint|PSRemoting|PSSessionConfiguration)/,
  /Disconnect-PSSession/,
  /Enable-(ComputerRestore|PSBreakpoint|PSRemoting|PSSessionConfiguration)/,
  /(Enter|Exit)-PSSession/,
  /Export-(Alias|Clixml|Console|Counter|Csv|FormatData|ModuleMember|PSSession)/,
  /ForEach-Object/,
  /Format-(Custom|List|Table|Wide)/,
  new RegExp("Get-(Acl|Alias|AuthenticodeSignature|ChildItem|Command|ComputerRestorePoint|Content|ControlPanelItem|Counter|Credential|Culture|Date|Event|EventLog|EventSubscriber|ExecutionPolicy|FormatData|Help|History|Host|HotFix|Item|ItemProperty|Job|Location|Member|Module|PfxCertificate|Process|PSBreakpoint|PSCallStack|PSDrive|PSProvider|PSSession|PSSessionConfiguration|PSSnapin|Random|Service|TraceSource|Transaction|TypeData|UICulture|Unique|Variable|Verb|WinEvent|WmiObject)"),
  /Group-Object/,
  /Import-(Alias|Clixml|Counter|Csv|LocalizedData|Module|PSSession)/,
  /ImportSystemModules/,
  /Invoke-(Command|Expression|History|Item|RestMethod|WebRequest|WmiMethod)/,
  /Join-Path/,
  /Limit-EventLog/,
  /Measure-(Command|Object)/,
  /Move-Item(Property)?/,
  new RegExp("New-(Alias|Event|EventLog|Item(Property)?|Module|ModuleManifest|Object|PSDrive|PSSession|PSSessionConfigurationFile|PSSessionOption|PSTransportOption|Service|TimeSpan|Variable|WebServiceProxy|WinEvent)"),
  /Out-(Default|File|GridView|Host|Null|Printer|String)/,
  /Pause/,
  /(Pop|Push)-Location/,
  /Read-Host/,
  /Receive-(Job|PSSession)/,
  /Register-(EngineEvent|ObjectEvent|PSSessionConfiguration|WmiEvent)/,
  /Remove-(Computer|Event|EventLog|Item(Property)?|Job|Module|PSBreakpoint|PSDrive|PSSession|PSSnapin|TypeData|Variable|WmiObject)/,
  /Rename-(Computer|Item(Property)?)/,
  /Reset-ComputerMachinePassword/,
  /Resolve-Path/,
  /Restart-(Computer|Service)/,
  /Restore-Computer/,
  /Resume-(Job|Service)/,
  /Save-Help/,
  /Select-(Object|String|Xml)/,
  /Send-MailMessage/,
  new RegExp("Set-(Acl|Alias|AuthenticodeSignature|Content|Date|ExecutionPolicy|Item(Property)?|Location|PSBreakpoint|PSDebug|PSSessionConfiguration|Service|StrictMode|TraceSource|Variable|WmiInstance)"),
  /Show-(Command|ControlPanelItem|EventLog)/,
  /Sort-Object/,
  /Split-Path/,
  /Start-(Job|Process|Service|Sleep|Transaction|Transcript)/,
  /Stop-(Computer|Job|Process|Service|Transcript)/,
  /Suspend-(Job|Service)/,
  /TabExpansion2/,
  /Tee-Object/,
  /Test-(ComputerSecureChannel|Connection|ModuleManifest|Path|PSSessionConfigurationFile)/,
  /Trace-Command/,
  /Unblock-File/,
  /Undo-Transaction/,
  /Unregister-(Event|PSSessionConfiguration)/,
  /Update-(FormatData|Help|List|TypeData)/,
  /Use-Transaction/,
  /Wait-(Event|Job|Process)/,
  /Where-Object/,
  /Write-(Debug|Error|EventLog|Host|Output|Progress|Verbose|Warning)/,
  /cd|help|mkdir|more|oss|prompt/,
  /ac|asnp|cat|cd|chdir|clc|clear|clhy|cli|clp|cls|clv|cnsn|compare|copy|cp|cpi|cpp|cvpa|dbp|del|diff|dir|dnsn|ebp/,
  /echo|epal|epcsv|epsn|erase|etsn|exsn|fc|fl|foreach|ft|fw|gal|gbp|gc|gci|gcm|gcs|gdr|ghy|gi|gjb|gl|gm|gmo|gp|gps/,
  /group|gsn|gsnp|gsv|gu|gv|gwmi|h|history|icm|iex|ihy|ii|ipal|ipcsv|ipmo|ipsn|irm|ise|iwmi|iwr|kill|lp|ls|man|md/,
  /measure|mi|mount|move|mp|mv|nal|ndr|ni|nmo|npssc|nsn|nv|ogv|oh|popd|ps|pushd|pwd|r|rbp|rcjb|rcsn|rd|rdr|ren|ri/,
  /rjb|rm|rmdir|rmo|rni|rnp|rp|rsn|rsnp|rujb|rv|rvpa|rwmi|sajb|sal|saps|sasv|sbp|sc|select|set|shcm|si|sl|sleep|sls/,
  /sort|sp|spjb|spps|spsv|start|sujb|sv|swmi|tee|trcm|type|where|wjb|write/
], { prefix: "", suffix: "" });
var variableBuiltins = buildRegexp([
  /[$?^_]|Args|ConfirmPreference|ConsoleFileName|DebugPreference|Error|ErrorActionPreference|ErrorView|ExecutionContext/,
  /FormatEnumerationLimit|Home|Host|Input|MaximumAliasCount|MaximumDriveCount|MaximumErrorCount|MaximumFunctionCount/,
  /MaximumHistoryCount|MaximumVariableCount|MyInvocation|NestedPromptLevel|OutputEncoding|Pid|Profile|ProgressPreference/,
  /PSBoundParameters|PSCommandPath|PSCulture|PSDefaultParameterValues|PSEmailServer|PSHome|PSScriptRoot|PSSessionApplicationName/,
  /PSSessionConfigurationName|PSSessionOption|PSUICulture|PSVersionTable|Pwd|ShellId|StackTrace|VerbosePreference/,
  /WarningPreference|WhatIfPreference/,
  /Event|EventArgs|EventSubscriber|Sender/,
  /Matches|Ofs|ForEach|LastExitCode|PSCmdlet|PSItem|PSSenderInfo|This/,
  /true|false|null/
], { prefix: "\\$", suffix: "" });
var builtins$2 = buildRegexp([symbolBuiltins, namedBuiltins, variableBuiltins], { suffix: notCharacterOrDash });
var grammar = {
  keyword: keywords$j,
  number: numbers,
  operator: operators$2,
  builtin: builtins$2,
  punctuation,
  variable: identifiers$3
};
function tokenBase$l(stream, state) {
  var parent = state.returnStack[state.returnStack.length - 1];
  if (parent && parent.shouldReturnFrom(state)) {
    state.tokenize = parent.tokenize;
    state.returnStack.pop();
    return state.tokenize(stream, state);
  }
  if (stream.eatSpace()) {
    return null;
  }
  if (stream.eat("(")) {
    state.bracketNesting += 1;
    return "punctuation";
  }
  if (stream.eat(")")) {
    state.bracketNesting -= 1;
    return "punctuation";
  }
  for (var key in grammar) {
    if (stream.match(grammar[key])) {
      return key;
    }
  }
  var ch2 = stream.next();
  if (ch2 === "'") {
    return tokenSingleQuoteString(stream, state);
  }
  if (ch2 === "$") {
    return tokenVariable$1(stream, state);
  }
  if (ch2 === '"') {
    return tokenDoubleQuoteString(stream, state);
  }
  if (ch2 === "<" && stream.eat("#")) {
    state.tokenize = tokenComment$6;
    return tokenComment$6(stream, state);
  }
  if (ch2 === "#") {
    stream.skipToEnd();
    return "comment";
  }
  if (ch2 === "@") {
    var quoteMatch = stream.eat(/["']/);
    if (quoteMatch && stream.eol()) {
      state.tokenize = tokenMultiString;
      state.startQuote = quoteMatch[0];
      return tokenMultiString(stream, state);
    } else if (stream.eol()) {
      return "error";
    } else if (stream.peek().match(/[({]/)) {
      return "punctuation";
    } else if (stream.peek().match(varNames)) {
      return tokenVariable$1(stream, state);
    }
  }
  return "error";
}
function tokenSingleQuoteString(stream, state) {
  var ch2;
  while ((ch2 = stream.peek()) != null) {
    stream.next();
    if (ch2 === "'" && !stream.eat("'")) {
      state.tokenize = tokenBase$l;
      return "string";
    }
  }
  return "error";
}
function tokenDoubleQuoteString(stream, state) {
  var ch2;
  while ((ch2 = stream.peek()) != null) {
    if (ch2 === "$") {
      state.tokenize = tokenStringInterpolation;
      return "string";
    }
    stream.next();
    if (ch2 === "`") {
      stream.next();
      continue;
    }
    if (ch2 === '"' && !stream.eat('"')) {
      state.tokenize = tokenBase$l;
      return "string";
    }
  }
  return "error";
}
function tokenStringInterpolation(stream, state) {
  return tokenInterpolation(stream, state, tokenDoubleQuoteString);
}
function tokenMultiStringReturn(stream, state) {
  state.tokenize = tokenMultiString;
  state.startQuote = '"';
  return tokenMultiString(stream, state);
}
function tokenHereStringInterpolation(stream, state) {
  return tokenInterpolation(stream, state, tokenMultiStringReturn);
}
function tokenInterpolation(stream, state, parentTokenize) {
  if (stream.match("$(")) {
    var savedBracketNesting = state.bracketNesting;
    state.returnStack.push({
      /*jshint loopfunc:true */
      shouldReturnFrom: function(state2) {
        return state2.bracketNesting === savedBracketNesting;
      },
      tokenize: parentTokenize
    });
    state.tokenize = tokenBase$l;
    state.bracketNesting += 1;
    return "punctuation";
  } else {
    stream.next();
    state.returnStack.push({
      shouldReturnFrom: function() {
        return true;
      },
      tokenize: parentTokenize
    });
    state.tokenize = tokenVariable$1;
    return state.tokenize(stream, state);
  }
}
function tokenComment$6(stream, state) {
  var maybeEnd = false, ch2;
  while ((ch2 = stream.next()) != null) {
    if (maybeEnd && ch2 == ">") {
      state.tokenize = tokenBase$l;
      break;
    }
    maybeEnd = ch2 === "#";
  }
  return "comment";
}
function tokenVariable$1(stream, state) {
  var ch2 = stream.peek();
  if (stream.eat("{")) {
    state.tokenize = tokenVariableWithBraces;
    return tokenVariableWithBraces(stream, state);
  } else if (ch2 != void 0 && ch2.match(varNames)) {
    stream.eatWhile(varNames);
    state.tokenize = tokenBase$l;
    return "variable";
  } else {
    state.tokenize = tokenBase$l;
    return "error";
  }
}
function tokenVariableWithBraces(stream, state) {
  var ch2;
  while ((ch2 = stream.next()) != null) {
    if (ch2 === "}") {
      state.tokenize = tokenBase$l;
      break;
    }
  }
  return "variable";
}
function tokenMultiString(stream, state) {
  var quote2 = state.startQuote;
  if (stream.sol() && stream.match(new RegExp(quote2 + "@"))) {
    state.tokenize = tokenBase$l;
  } else if (quote2 === '"') {
    while (!stream.eol()) {
      var ch2 = stream.peek();
      if (ch2 === "$") {
        state.tokenize = tokenHereStringInterpolation;
        return "string";
      }
      stream.next();
      if (ch2 === "`") {
        stream.next();
      }
    }
  } else {
    stream.skipToEnd();
  }
  return "string";
}
const powerShell = {
  name: "powershell",
  startState: function() {
    return {
      returnStack: [],
      bracketNesting: 0,
      tokenize: tokenBase$l
    };
  },
  token: function(stream, state) {
    return state.tokenize(stream, state);
  },
  languageData: {
    commentTokens: { line: "#", block: { open: "<#", close: "#>" } }
  }
};
const powershell = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  powerShell
});
const properties = {
  name: "properties",
  token: function(stream, state) {
    var sol = stream.sol() || state.afterSection;
    var eol = stream.eol();
    state.afterSection = false;
    if (sol) {
      if (state.nextMultiline) {
        state.inMultiline = true;
        state.nextMultiline = false;
      } else {
        state.position = "def";
      }
    }
    if (eol && !state.nextMultiline) {
      state.inMultiline = false;
      state.position = "def";
    }
    if (sol) {
      while (stream.eatSpace()) {
      }
    }
    var ch2 = stream.next();
    if (sol && (ch2 === "#" || ch2 === "!" || ch2 === ";")) {
      state.position = "comment";
      stream.skipToEnd();
      return "comment";
    } else if (sol && ch2 === "[") {
      state.afterSection = true;
      stream.skipTo("]");
      stream.eat("]");
      return "header";
    } else if (ch2 === "=" || ch2 === ":") {
      state.position = "quote";
      return null;
    } else if (ch2 === "\\" && state.position === "quote") {
      if (stream.eol()) {
        state.nextMultiline = true;
      }
    }
    return state.position;
  },
  startState: function() {
    return {
      position: "def",
      // Current position, "def", "quote" or "comment"
      nextMultiline: false,
      // Is the next line multiline value
      inMultiline: false,
      // Is the current line a multiline value
      afterSection: false
      // Did we just open a section
    };
  }
};
const properties$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  properties
});
function wordRegexp$6(words2) {
  return new RegExp("^((" + words2.join(")|(") + "))\\b", "i");
}
var keywordArray$1 = [
  "package",
  "message",
  "import",
  "syntax",
  "required",
  "optional",
  "repeated",
  "reserved",
  "default",
  "extensions",
  "packed",
  "bool",
  "bytes",
  "double",
  "enum",
  "float",
  "string",
  "int32",
  "int64",
  "uint32",
  "uint64",
  "sint32",
  "sint64",
  "fixed32",
  "fixed64",
  "sfixed32",
  "sfixed64",
  "option",
  "service",
  "rpc",
  "returns"
];
var keywords$i = wordRegexp$6(keywordArray$1);
var identifiers$2 = new RegExp("^[_A-Za-z¡-￿][_A-Za-z0-9¡-￿]*");
function tokenBase$k(stream) {
  if (stream.eatSpace()) return null;
  if (stream.match("//")) {
    stream.skipToEnd();
    return "comment";
  }
  if (stream.match(/^[0-9\.+-]/, false)) {
    if (stream.match(/^[+-]?0x[0-9a-fA-F]+/))
      return "number";
    if (stream.match(/^[+-]?\d*\.\d+([EeDd][+-]?\d+)?/))
      return "number";
    if (stream.match(/^[+-]?\d+([EeDd][+-]?\d+)?/))
      return "number";
  }
  if (stream.match(/^"([^"]|(""))*"/)) {
    return "string";
  }
  if (stream.match(/^'([^']|(''))*'/)) {
    return "string";
  }
  if (stream.match(keywords$i)) {
    return "keyword";
  }
  if (stream.match(identifiers$2)) {
    return "variable";
  }
  stream.next();
  return null;
}
const protobuf = {
  name: "protobuf",
  token: tokenBase$k,
  languageData: {
    autocomplete: keywordArray$1
  }
};
const protobuf$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  protobuf
});
var ATTRS_NEST = {
  "{": "}",
  "(": ")",
  "[": "]"
};
function defaultCopyState(state) {
  if (typeof state != "object") return state;
  let newState = {};
  for (let prop in state) {
    let val = state[prop];
    newState[prop] = val instanceof Array ? val.slice() : val;
  }
  return newState;
}
let State$1 = class State {
  constructor(indentUnit) {
    this.indentUnit = indentUnit;
    this.javaScriptLine = false;
    this.javaScriptLineExcludesColon = false;
    this.javaScriptArguments = false;
    this.javaScriptArgumentsDepth = 0;
    this.isInterpolating = false;
    this.interpolationNesting = 0;
    this.jsState = javascript.startState(indentUnit);
    this.restOfLine = "";
    this.isIncludeFiltered = false;
    this.isEach = false;
    this.lastTag = "";
    this.isAttrs = false;
    this.attrsNest = [];
    this.inAttributeName = true;
    this.attributeIsType = false;
    this.attrValue = "";
    this.indentOf = Infinity;
    this.indentToken = "";
  }
  copy() {
    var res = new State(this.indentUnit);
    res.javaScriptLine = this.javaScriptLine;
    res.javaScriptLineExcludesColon = this.javaScriptLineExcludesColon;
    res.javaScriptArguments = this.javaScriptArguments;
    res.javaScriptArgumentsDepth = this.javaScriptArgumentsDepth;
    res.isInterpolating = this.isInterpolating;
    res.interpolationNesting = this.interpolationNesting;
    res.jsState = (javascript.copyState || defaultCopyState)(this.jsState);
    res.restOfLine = this.restOfLine;
    res.isIncludeFiltered = this.isIncludeFiltered;
    res.isEach = this.isEach;
    res.lastTag = this.lastTag;
    res.isAttrs = this.isAttrs;
    res.attrsNest = this.attrsNest.slice();
    res.inAttributeName = this.inAttributeName;
    res.attributeIsType = this.attributeIsType;
    res.attrValue = this.attrValue;
    res.indentOf = this.indentOf;
    res.indentToken = this.indentToken;
    return res;
  }
};
function javaScript(stream, state) {
  if (stream.sol()) {
    state.javaScriptLine = false;
    state.javaScriptLineExcludesColon = false;
  }
  if (state.javaScriptLine) {
    if (state.javaScriptLineExcludesColon && stream.peek() === ":") {
      state.javaScriptLine = false;
      state.javaScriptLineExcludesColon = false;
      return;
    }
    var tok = javascript.token(stream, state.jsState);
    if (stream.eol()) state.javaScriptLine = false;
    return tok || true;
  }
}
function javaScriptArguments(stream, state) {
  if (state.javaScriptArguments) {
    if (state.javaScriptArgumentsDepth === 0 && stream.peek() !== "(") {
      state.javaScriptArguments = false;
      return;
    }
    if (stream.peek() === "(") {
      state.javaScriptArgumentsDepth++;
    } else if (stream.peek() === ")") {
      state.javaScriptArgumentsDepth--;
    }
    if (state.javaScriptArgumentsDepth === 0) {
      state.javaScriptArguments = false;
      return;
    }
    var tok = javascript.token(stream, state.jsState);
    return tok || true;
  }
}
function yieldStatement(stream) {
  if (stream.match(/^yield\b/)) {
    return "keyword";
  }
}
function doctype(stream) {
  if (stream.match(/^(?:doctype) *([^\n]+)?/)) return "meta";
}
function interpolation(stream, state) {
  if (stream.match("#{")) {
    state.isInterpolating = true;
    state.interpolationNesting = 0;
    return "punctuation";
  }
}
function interpolationContinued(stream, state) {
  if (state.isInterpolating) {
    if (stream.peek() === "}") {
      state.interpolationNesting--;
      if (state.interpolationNesting < 0) {
        stream.next();
        state.isInterpolating = false;
        return "punctuation";
      }
    } else if (stream.peek() === "{") {
      state.interpolationNesting++;
    }
    return javascript.token(stream, state.jsState) || true;
  }
}
function caseStatement(stream, state) {
  if (stream.match(/^case\b/)) {
    state.javaScriptLine = true;
    return "keyword";
  }
}
function when(stream, state) {
  if (stream.match(/^when\b/)) {
    state.javaScriptLine = true;
    state.javaScriptLineExcludesColon = true;
    return "keyword";
  }
}
function defaultStatement(stream) {
  if (stream.match(/^default\b/)) {
    return "keyword";
  }
}
function extendsStatement(stream, state) {
  if (stream.match(/^extends?\b/)) {
    state.restOfLine = "string";
    return "keyword";
  }
}
function append(stream, state) {
  if (stream.match(/^append\b/)) {
    state.restOfLine = "variable";
    return "keyword";
  }
}
function prepend(stream, state) {
  if (stream.match(/^prepend\b/)) {
    state.restOfLine = "variable";
    return "keyword";
  }
}
function block(stream, state) {
  if (stream.match(/^block\b *(?:(prepend|append)\b)?/)) {
    state.restOfLine = "variable";
    return "keyword";
  }
}
function include(stream, state) {
  if (stream.match(/^include\b/)) {
    state.restOfLine = "string";
    return "keyword";
  }
}
function includeFiltered(stream, state) {
  if (stream.match(/^include:([a-zA-Z0-9\-]+)/, false) && stream.match("include")) {
    state.isIncludeFiltered = true;
    return "keyword";
  }
}
function includeFilteredContinued(stream, state) {
  if (state.isIncludeFiltered) {
    var tok = filter(stream, state);
    state.isIncludeFiltered = false;
    state.restOfLine = "string";
    return tok;
  }
}
function mixin(stream, state) {
  if (stream.match(/^mixin\b/)) {
    state.javaScriptLine = true;
    return "keyword";
  }
}
function call(stream, state) {
  if (stream.match(/^\+([-\w]+)/)) {
    if (!stream.match(/^\( *[-\w]+ *=/, false)) {
      state.javaScriptArguments = true;
      state.javaScriptArgumentsDepth = 0;
    }
    return "variable";
  }
  if (stream.match("+#{", false)) {
    stream.next();
    state.mixinCallAfter = true;
    return interpolation(stream, state);
  }
}
function callArguments(stream, state) {
  if (state.mixinCallAfter) {
    state.mixinCallAfter = false;
    if (!stream.match(/^\( *[-\w]+ *=/, false)) {
      state.javaScriptArguments = true;
      state.javaScriptArgumentsDepth = 0;
    }
    return true;
  }
}
function conditional(stream, state) {
  if (stream.match(/^(if|unless|else if|else)\b/)) {
    state.javaScriptLine = true;
    return "keyword";
  }
}
function each(stream, state) {
  if (stream.match(/^(- *)?(each|for)\b/)) {
    state.isEach = true;
    return "keyword";
  }
}
function eachContinued(stream, state) {
  if (state.isEach) {
    if (stream.match(/^ in\b/)) {
      state.javaScriptLine = true;
      state.isEach = false;
      return "keyword";
    } else if (stream.sol() || stream.eol()) {
      state.isEach = false;
    } else if (stream.next()) {
      while (!stream.match(/^ in\b/, false) && stream.next()) {
      }
      return "variable";
    }
  }
}
function whileStatement(stream, state) {
  if (stream.match(/^while\b/)) {
    state.javaScriptLine = true;
    return "keyword";
  }
}
function tag(stream, state) {
  var captures;
  if (captures = stream.match(/^(\w(?:[-:\w]*\w)?)\/?/)) {
    state.lastTag = captures[1].toLowerCase();
    return "tag";
  }
}
function filter(stream, state) {
  if (stream.match(/^:([\w\-]+)/)) {
    setStringMode(stream, state);
    return "atom";
  }
}
function code(stream, state) {
  if (stream.match(/^(!?=|-)/)) {
    state.javaScriptLine = true;
    return "punctuation";
  }
}
function id(stream) {
  if (stream.match(/^#([\w-]+)/)) {
    return "builtin";
  }
}
function className(stream) {
  if (stream.match(/^\.([\w-]+)/)) {
    return "className";
  }
}
function attrs(stream, state) {
  if (stream.peek() == "(") {
    stream.next();
    state.isAttrs = true;
    state.attrsNest = [];
    state.inAttributeName = true;
    state.attrValue = "";
    state.attributeIsType = false;
    return "punctuation";
  }
}
function attrsContinued(stream, state) {
  if (state.isAttrs) {
    if (ATTRS_NEST[stream.peek()]) {
      state.attrsNest.push(ATTRS_NEST[stream.peek()]);
    }
    if (state.attrsNest[state.attrsNest.length - 1] === stream.peek()) {
      state.attrsNest.pop();
    } else if (stream.eat(")")) {
      state.isAttrs = false;
      return "punctuation";
    }
    if (state.inAttributeName && stream.match(/^[^=,\)!]+/)) {
      if (stream.peek() === "=" || stream.peek() === "!") {
        state.inAttributeName = false;
        state.jsState = javascript.startState(2);
        if (state.lastTag === "script" && stream.current().trim().toLowerCase() === "type") {
          state.attributeIsType = true;
        } else {
          state.attributeIsType = false;
        }
      }
      return "attribute";
    }
    var tok = javascript.token(stream, state.jsState);
    if (state.attrsNest.length === 0 && (tok === "string" || tok === "variable" || tok === "keyword")) {
      try {
        Function("", "var x " + state.attrValue.replace(/,\s*$/, "").replace(/^!/, ""));
        state.inAttributeName = true;
        state.attrValue = "";
        stream.backUp(stream.current().length);
        return attrsContinued(stream, state);
      } catch (ex) {
      }
    }
    state.attrValue += stream.current();
    return tok || true;
  }
}
function attributesBlock(stream, state) {
  if (stream.match(/^&attributes\b/)) {
    state.javaScriptArguments = true;
    state.javaScriptArgumentsDepth = 0;
    return "keyword";
  }
}
function indent$1(stream) {
  if (stream.sol() && stream.eatSpace()) {
    return "indent";
  }
}
function comment(stream, state) {
  if (stream.match(/^ *\/\/(-)?([^\n]*)/)) {
    state.indentOf = stream.indentation();
    state.indentToken = "comment";
    return "comment";
  }
}
function colon(stream) {
  if (stream.match(/^: */)) {
    return "colon";
  }
}
function text(stream, state) {
  if (stream.match(/^(?:\| ?| )([^\n]+)/)) {
    return "string";
  }
  if (stream.match(/^(<[^\n]*)/, false)) {
    setStringMode(stream, state);
    stream.skipToEnd();
    return state.indentToken;
  }
}
function dot(stream, state) {
  if (stream.eat(".")) {
    setStringMode(stream, state);
    return "dot";
  }
}
function fail(stream) {
  stream.next();
  return null;
}
function setStringMode(stream, state) {
  state.indentOf = stream.indentation();
  state.indentToken = "string";
}
function restOfLine(stream, state) {
  if (stream.sol()) {
    state.restOfLine = "";
  }
  if (state.restOfLine) {
    stream.skipToEnd();
    var tok = state.restOfLine;
    state.restOfLine = "";
    return tok;
  }
}
function startState(indentUnit) {
  return new State$1(indentUnit);
}
function copyState(state) {
  return state.copy();
}
function nextToken(stream, state) {
  var tok = restOfLine(stream, state) || interpolationContinued(stream, state) || includeFilteredContinued(stream, state) || eachContinued(stream, state) || attrsContinued(stream, state) || javaScript(stream, state) || javaScriptArguments(stream, state) || callArguments(stream, state) || yieldStatement(stream) || doctype(stream) || interpolation(stream, state) || caseStatement(stream, state) || when(stream, state) || defaultStatement(stream) || extendsStatement(stream, state) || append(stream, state) || prepend(stream, state) || block(stream, state) || include(stream, state) || includeFiltered(stream, state) || mixin(stream, state) || call(stream, state) || conditional(stream, state) || each(stream, state) || whileStatement(stream, state) || tag(stream, state) || filter(stream, state) || code(stream, state) || id(stream) || className(stream) || attrs(stream, state) || attributesBlock(stream, state) || indent$1(stream) || text(stream, state) || comment(stream, state) || colon(stream) || dot(stream, state) || fail(stream);
  return tok === true ? null : tok;
}
const pug = {
  startState,
  copyState,
  token: nextToken
};
const pug$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  pug
});
var words$8 = {};
var variable_regex = /({)?([a-z][a-z0-9_]*)?((::[a-z][a-z0-9_]*)*::)?[a-zA-Z0-9_]+(})?/;
function define$2(style2, string2) {
  var split = string2.split(" ");
  for (var i2 = 0; i2 < split.length; i2++) {
    words$8[split[i2]] = style2;
  }
}
define$2("keyword", "class define site node include import inherits");
define$2("keyword", "case if else in and elsif default or");
define$2("atom", "false true running present absent file directory undef");
define$2("builtin", "action augeas burst chain computer cron destination dport exec file filebucket group host icmp iniface interface jump k5login limit log_level log_prefix macauthorization mailalias maillist mcx mount nagios_command nagios_contact nagios_contactgroup nagios_host nagios_hostdependency nagios_hostescalation nagios_hostextinfo nagios_hostgroup nagios_service nagios_servicedependency nagios_serviceescalation nagios_serviceextinfo nagios_servicegroup nagios_timeperiod name notify outiface package proto reject resources router schedule scheduled_task selboolean selmodule service source sport ssh_authorized_key sshkey stage state table tidy todest toports tosource user vlan yumrepo zfs zone zpool");
function tokenString$e(stream, state) {
  var current, prev, found_var = false;
  while (!stream.eol() && (current = stream.next()) != state.pending) {
    if (current === "$" && prev != "\\" && state.pending == '"') {
      found_var = true;
      break;
    }
    prev = current;
  }
  if (found_var) {
    stream.backUp(1);
  }
  if (current == state.pending) {
    state.continueString = false;
  } else {
    state.continueString = true;
  }
  return "string";
}
function tokenize$3(stream, state) {
  var word = stream.match(/[\w]+/, false);
  var attribute2 = stream.match(/(\s+)?\w+\s+=>.*/, false);
  var resource = stream.match(/(\s+)?[\w:_]+(\s+)?{/, false);
  var special_resource = stream.match(/(\s+)?[@]{1,2}[\w:_]+(\s+)?{/, false);
  var ch2 = stream.next();
  if (ch2 === "$") {
    if (stream.match(variable_regex)) {
      return state.continueString ? "variableName.special" : "variable";
    }
    return "error";
  }
  if (state.continueString) {
    stream.backUp(1);
    return tokenString$e(stream, state);
  }
  if (state.inDefinition) {
    if (stream.match(/(\s+)?[\w:_]+(\s+)?/)) {
      return "def";
    }
    stream.match(/\s+{/);
    state.inDefinition = false;
  }
  if (state.inInclude) {
    stream.match(/(\s+)?\S+(\s+)?/);
    state.inInclude = false;
    return "def";
  }
  if (stream.match(/(\s+)?\w+\(/)) {
    stream.backUp(1);
    return "def";
  }
  if (attribute2) {
    stream.match(/(\s+)?\w+/);
    return "tag";
  }
  if (word && words$8.hasOwnProperty(word)) {
    stream.backUp(1);
    stream.match(/[\w]+/);
    if (stream.match(/\s+\S+\s+{/, false)) {
      state.inDefinition = true;
    }
    if (word == "include") {
      state.inInclude = true;
    }
    return words$8[word];
  }
  if (/(^|\s+)[A-Z][\w:_]+/.test(word)) {
    stream.backUp(1);
    stream.match(/(^|\s+)[A-Z][\w:_]+/);
    return "def";
  }
  if (resource) {
    stream.match(/(\s+)?[\w:_]+/);
    return "def";
  }
  if (special_resource) {
    stream.match(/(\s+)?[@]{1,2}/);
    return "atom";
  }
  if (ch2 == "#") {
    stream.skipToEnd();
    return "comment";
  }
  if (ch2 == "'" || ch2 == '"') {
    state.pending = ch2;
    return tokenString$e(stream, state);
  }
  if (ch2 == "{" || ch2 == "}") {
    return "bracket";
  }
  if (ch2 == "/") {
    stream.match(/^[^\/]*\//);
    return "string.special";
  }
  if (ch2.match(/[0-9]/)) {
    stream.eatWhile(/[0-9]+/);
    return "number";
  }
  if (ch2 == "=") {
    if (stream.peek() == ">") {
      stream.next();
    }
    return "operator";
  }
  stream.eatWhile(/[\w-]/);
  return null;
}
const puppet = {
  name: "puppet",
  startState: function() {
    var state = {};
    state.inDefinition = false;
    state.inInclude = false;
    state.continueString = false;
    state.pending = false;
    return state;
  },
  token: function(stream, state) {
    if (stream.eatSpace()) return null;
    return tokenize$3(stream, state);
  }
};
const puppet$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  puppet
});
var curPunc$7, keywords$h = buildRE(["abs", "acos", "aj", "aj0", "all", "and", "any", "asc", "asin", "asof", "atan", "attr", "avg", "avgs", "bin", "by", "ceiling", "cols", "cor", "cos", "count", "cov", "cross", "csv", "cut", "delete", "deltas", "desc", "dev", "differ", "distinct", "div", "do", "each", "ej", "enlist", "eval", "except", "exec", "exit", "exp", "fby", "fills", "first", "fkeys", "flip", "floor", "from", "get", "getenv", "group", "gtime", "hclose", "hcount", "hdel", "hopen", "hsym", "iasc", "idesc", "if", "ij", "in", "insert", "inter", "inv", "key", "keys", "last", "like", "list", "lj", "load", "log", "lower", "lsq", "ltime", "ltrim", "mavg", "max", "maxs", "mcount", "md5", "mdev", "med", "meta", "min", "mins", "mmax", "mmin", "mmu", "mod", "msum", "neg", "next", "not", "null", "or", "over", "parse", "peach", "pj", "plist", "prd", "prds", "prev", "prior", "rand", "rank", "ratios", "raze", "read0", "read1", "reciprocal", "reverse", "rload", "rotate", "rsave", "rtrim", "save", "scan", "select", "set", "setenv", "show", "signum", "sin", "sqrt", "ss", "ssr", "string", "sublist", "sum", "sums", "sv", "system", "tables", "tan", "til", "trim", "txf", "type", "uj", "ungroup", "union", "update", "upper", "upsert", "value", "var", "view", "views", "vs", "wavg", "where", "where", "while", "within", "wj", "wj1", "wsum", "xasc", "xbar", "xcol", "xcols", "xdesc", "xexp", "xgroup", "xkey", "xlog", "xprev", "xrank"]), E = /[|/&^!+:\\\-*%$=~#;@><,?_\'\"\[\(\]\)\s{}]/;
function buildRE(w) {
  return new RegExp("^(" + w.join("|") + ")$");
}
function tokenBase$j(stream, state) {
  var sol = stream.sol(), c = stream.next();
  curPunc$7 = null;
  if (sol) {
    if (c == "/")
      return (state.tokenize = tokenLineComment)(stream, state);
    else if (c == "\\") {
      if (stream.eol() || /\s/.test(stream.peek()))
        return stream.skipToEnd(), /^\\\s*$/.test(stream.current()) ? (state.tokenize = tokenCommentToEOF)(stream) : state.tokenize = tokenBase$j, "comment";
      else
        return state.tokenize = tokenBase$j, "builtin";
    }
  }
  if (/\s/.test(c))
    return stream.peek() == "/" ? (stream.skipToEnd(), "comment") : "null";
  if (c == '"')
    return (state.tokenize = tokenString$d)(stream, state);
  if (c == "`")
    return stream.eatWhile(/[A-Za-z\d_:\/.]/), "macroName";
  if ("." == c && /\d/.test(stream.peek()) || /\d/.test(c)) {
    var t = null;
    stream.backUp(1);
    if (stream.match(/^\d{4}\.\d{2}(m|\.\d{2}([DT](\d{2}(:\d{2}(:\d{2}(\.\d{1,9})?)?)?)?)?)/) || stream.match(/^\d+D(\d{2}(:\d{2}(:\d{2}(\.\d{1,9})?)?)?)/) || stream.match(/^\d{2}:\d{2}(:\d{2}(\.\d{1,9})?)?/) || stream.match(/^\d+[ptuv]{1}/))
      t = "temporal";
    else if (stream.match(/^0[NwW]{1}/) || stream.match(/^0x[\da-fA-F]*/) || stream.match(/^[01]+[b]{1}/) || stream.match(/^\d+[chijn]{1}/) || stream.match(/-?\d*(\.\d*)?(e[+\-]?\d+)?(e|f)?/))
      t = "number";
    return t && (!(c = stream.peek()) || E.test(c)) ? t : (stream.next(), "error");
  }
  if (/[A-Za-z]|\./.test(c))
    return stream.eatWhile(/[A-Za-z._\d]/), keywords$h.test(stream.current()) ? "keyword" : "variable";
  if (/[|/&^!+:\\\-*%$=~#;@><\.,?_\']/.test(c))
    return null;
  if (/[{}\(\[\]\)]/.test(c))
    return null;
  return "error";
}
function tokenLineComment(stream, state) {
  return stream.skipToEnd(), /^\/\s*$/.test(stream.current()) ? (state.tokenize = tokenBlockComment)(stream, state) : state.tokenize = tokenBase$j, "comment";
}
function tokenBlockComment(stream, state) {
  var f = stream.sol() && stream.peek() == "\\";
  stream.skipToEnd();
  if (f && /^\\\s*$/.test(stream.current()))
    state.tokenize = tokenBase$j;
  return "comment";
}
function tokenCommentToEOF(stream) {
  return stream.skipToEnd(), "comment";
}
function tokenString$d(stream, state) {
  var escaped = false, next2, end2 = false;
  while (next2 = stream.next()) {
    if (next2 == '"' && !escaped) {
      end2 = true;
      break;
    }
    escaped = !escaped && next2 == "\\";
  }
  if (end2) state.tokenize = tokenBase$j;
  return "string";
}
function pushContext$8(state, type2, col) {
  state.context = { prev: state.context, indent: state.indent, col, type: type2 };
}
function popContext$8(state) {
  state.indent = state.context.indent;
  state.context = state.context.prev;
}
const q = {
  name: "q",
  startState: function() {
    return {
      tokenize: tokenBase$j,
      context: null,
      indent: 0,
      col: 0
    };
  },
  token: function(stream, state) {
    if (stream.sol()) {
      if (state.context && state.context.align == null)
        state.context.align = false;
      state.indent = stream.indentation();
    }
    var style2 = state.tokenize(stream, state);
    if (style2 != "comment" && state.context && state.context.align == null && state.context.type != "pattern") {
      state.context.align = true;
    }
    if (curPunc$7 == "(") pushContext$8(state, ")", stream.column());
    else if (curPunc$7 == "[") pushContext$8(state, "]", stream.column());
    else if (curPunc$7 == "{") pushContext$8(state, "}", stream.column());
    else if (/[\]\}\)]/.test(curPunc$7)) {
      while (state.context && state.context.type == "pattern") popContext$8(state);
      if (state.context && curPunc$7 == state.context.type) popContext$8(state);
    } else if (curPunc$7 == "." && state.context && state.context.type == "pattern") popContext$8(state);
    else if (/atom|string|variable/.test(style2) && state.context) {
      if (/[\}\]]/.test(state.context.type))
        pushContext$8(state, "pattern", stream.column());
      else if (state.context.type == "pattern" && !state.context.align) {
        state.context.align = true;
        state.context.col = stream.column();
      }
    }
    return style2;
  },
  indent: function(state, textAfter, cx2) {
    var firstChar = textAfter && textAfter.charAt(0);
    var context = state.context;
    if (/[\]\}]/.test(firstChar))
      while (context && context.type == "pattern") context = context.prev;
    var closing2 = context && firstChar == context.type;
    if (!context)
      return 0;
    else if (context.type == "pattern")
      return context.col;
    else if (context.align)
      return context.col + (closing2 ? 0 : 1);
    else
      return context.indent + (closing2 ? 0 : cx2.unit);
  },
  languageData: {
    commentTokens: { line: "/" }
  }
};
const q$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  q
});
function wordObj$1(words2) {
  var res = {};
  for (var i2 = 0; i2 < words2.length; ++i2) res[words2[i2]] = true;
  return res;
}
var commonAtoms$2 = ["NULL", "NA", "Inf", "NaN", "NA_integer_", "NA_real_", "NA_complex_", "NA_character_", "TRUE", "FALSE"];
var commonBuiltins = ["list", "quote", "bquote", "eval", "return", "call", "parse", "deparse"];
var commonKeywords$2 = ["if", "else", "repeat", "while", "function", "for", "in", "next", "break"];
var commonBlockKeywords = ["if", "else", "repeat", "while", "function", "for"];
var atoms$4 = wordObj$1(commonAtoms$2);
var builtins$1 = wordObj$1(commonBuiltins);
var keywords$g = wordObj$1(commonKeywords$2);
var blockkeywords = wordObj$1(commonBlockKeywords);
var opChars = /[+\-*\/^<>=!&|~$:]/;
var curPunc$6;
function tokenBase$i(stream, state) {
  curPunc$6 = null;
  var ch2 = stream.next();
  if (ch2 == "#") {
    stream.skipToEnd();
    return "comment";
  } else if (ch2 == "0" && stream.eat("x")) {
    stream.eatWhile(/[\da-f]/i);
    return "number";
  } else if (ch2 == "." && stream.eat(/\d/)) {
    stream.match(/\d*(?:e[+\-]?\d+)?/);
    return "number";
  } else if (/\d/.test(ch2)) {
    stream.match(/\d*(?:\.\d+)?(?:e[+\-]\d+)?L?/);
    return "number";
  } else if (ch2 == "'" || ch2 == '"') {
    state.tokenize = tokenString$c(ch2);
    return "string";
  } else if (ch2 == "`") {
    stream.match(/[^`]+`/);
    return "string.special";
  } else if (ch2 == "." && stream.match(/.(?:[.]|\d+)/)) {
    return "keyword";
  } else if (/[a-zA-Z\.]/.test(ch2)) {
    stream.eatWhile(/[\w\.]/);
    var word = stream.current();
    if (atoms$4.propertyIsEnumerable(word)) return "atom";
    if (keywords$g.propertyIsEnumerable(word)) {
      if (blockkeywords.propertyIsEnumerable(word) && !stream.match(/\s*if(\s+|$)/, false))
        curPunc$6 = "block";
      return "keyword";
    }
    if (builtins$1.propertyIsEnumerable(word)) return "builtin";
    return "variable";
  } else if (ch2 == "%") {
    if (stream.skipTo("%")) stream.next();
    return "variableName.special";
  } else if (ch2 == "<" && stream.eat("-") || ch2 == "<" && stream.match("<-") || ch2 == "-" && stream.match(/>>?/)) {
    return "operator";
  } else if (ch2 == "=" && state.ctx.argList) {
    return "operator";
  } else if (opChars.test(ch2)) {
    if (ch2 == "$") return "operator";
    stream.eatWhile(opChars);
    return "operator";
  } else if (/[\(\){}\[\];]/.test(ch2)) {
    curPunc$6 = ch2;
    if (ch2 == ";") return "punctuation";
    return null;
  } else {
    return null;
  }
}
function tokenString$c(quote2) {
  return function(stream, state) {
    if (stream.eat("\\")) {
      var ch2 = stream.next();
      if (ch2 == "x") stream.match(/^[a-f0-9]{2}/i);
      else if ((ch2 == "u" || ch2 == "U") && stream.eat("{") && stream.skipTo("}")) stream.next();
      else if (ch2 == "u") stream.match(/^[a-f0-9]{4}/i);
      else if (ch2 == "U") stream.match(/^[a-f0-9]{8}/i);
      else if (/[0-7]/.test(ch2)) stream.match(/^[0-7]{1,2}/);
      return "string.special";
    } else {
      var next2;
      while ((next2 = stream.next()) != null) {
        if (next2 == quote2) {
          state.tokenize = tokenBase$i;
          break;
        }
        if (next2 == "\\") {
          stream.backUp(1);
          break;
        }
      }
      return "string";
    }
  };
}
var ALIGN_YES = 1, ALIGN_NO = 2, BRACELESS = 4;
function push(state, type2, stream) {
  state.ctx = {
    type: type2,
    indent: state.indent,
    flags: 0,
    column: stream.column(),
    prev: state.ctx
  };
}
function setFlag(state, flag) {
  var ctx = state.ctx;
  state.ctx = {
    type: ctx.type,
    indent: ctx.indent,
    flags: ctx.flags | flag,
    column: ctx.column,
    prev: ctx.prev
  };
}
function pop(state) {
  state.indent = state.ctx.indent;
  state.ctx = state.ctx.prev;
}
const r = {
  name: "r",
  startState: function(indentUnit) {
    return {
      tokenize: tokenBase$i,
      ctx: {
        type: "top",
        indent: -indentUnit,
        flags: ALIGN_NO
      },
      indent: 0,
      afterIdent: false
    };
  },
  token: function(stream, state) {
    if (stream.sol()) {
      if ((state.ctx.flags & 3) == 0) state.ctx.flags |= ALIGN_NO;
      if (state.ctx.flags & BRACELESS) pop(state);
      state.indent = stream.indentation();
    }
    if (stream.eatSpace()) return null;
    var style2 = state.tokenize(stream, state);
    if (style2 != "comment" && (state.ctx.flags & ALIGN_NO) == 0) setFlag(state, ALIGN_YES);
    if ((curPunc$6 == ";" || curPunc$6 == "{" || curPunc$6 == "}") && state.ctx.type == "block") pop(state);
    if (curPunc$6 == "{") push(state, "}", stream);
    else if (curPunc$6 == "(") {
      push(state, ")", stream);
      if (state.afterIdent) state.ctx.argList = true;
    } else if (curPunc$6 == "[") push(state, "]", stream);
    else if (curPunc$6 == "block") push(state, "block", stream);
    else if (curPunc$6 == state.ctx.type) pop(state);
    else if (state.ctx.type == "block" && style2 != "comment") setFlag(state, BRACELESS);
    state.afterIdent = style2 == "variable" || style2 == "keyword";
    return style2;
  },
  indent: function(state, textAfter, cx2) {
    if (state.tokenize != tokenBase$i) return 0;
    var firstChar = textAfter && textAfter.charAt(0), ctx = state.ctx, closing2 = firstChar == ctx.type;
    if (ctx.flags & BRACELESS) ctx = ctx.prev;
    if (ctx.type == "block") return ctx.indent + (firstChar == "{" ? 0 : cx2.unit);
    else if (ctx.flags & ALIGN_YES) return ctx.column + (closing2 ? 0 : 1);
    else return ctx.indent + (closing2 ? 0 : cx2.unit);
  },
  languageData: {
    wordChars: ".",
    commentTokens: { line: "#" },
    autocomplete: commonAtoms$2.concat(commonBuiltins, commonKeywords$2)
  }
};
const r$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  r
});
var headerSeparator = /^-+$/;
var headerLine = /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)  ?\d{1,2} \d{2}:\d{2}(:\d{2})? [A-Z]{3,4} \d{4} - /;
var simpleEmail = /^[\w+.-]+@[\w.-]+/;
const rpmChanges = {
  name: "rpmchanges",
  token: function(stream) {
    if (stream.sol()) {
      if (stream.match(headerSeparator)) {
        return "tag";
      }
      if (stream.match(headerLine)) {
        return "tag";
      }
    }
    if (stream.match(simpleEmail)) {
      return "string";
    }
    stream.next();
    return null;
  }
};
var arch = /^(i386|i586|i686|x86_64|ppc64le|ppc64|ppc|ia64|s390x|s390|sparc64|sparcv9|sparc|noarch|alphaev6|alpha|hppa|mipsel)/;
var preamble = /^[a-zA-Z0-9()]+:/;
var section = /^%(debug_package|package|description|prep|build|install|files|clean|changelog|preinstall|preun|postinstall|postun|pretrans|posttrans|pre|post|triggerin|triggerun|verifyscript|check|triggerpostun|triggerprein|trigger)/;
var control_flow_complex = /^%(ifnarch|ifarch|if)/;
var control_flow_simple = /^%(else|endif)/;
var operators$1 = /^(\!|\?|\<\=|\<|\>\=|\>|\=\=|\&\&|\|\|)/;
const rpmSpec = {
  name: "rpmspec",
  startState: function() {
    return {
      controlFlow: false,
      macroParameters: false,
      section: false
    };
  },
  token: function(stream, state) {
    var ch2 = stream.peek();
    if (ch2 == "#") {
      stream.skipToEnd();
      return "comment";
    }
    if (stream.sol()) {
      if (stream.match(preamble)) {
        return "header";
      }
      if (stream.match(section)) {
        return "atom";
      }
    }
    if (stream.match(/^\$\w+/)) {
      return "def";
    }
    if (stream.match(/^\$\{\w+\}/)) {
      return "def";
    }
    if (stream.match(control_flow_simple)) {
      return "keyword";
    }
    if (stream.match(control_flow_complex)) {
      state.controlFlow = true;
      return "keyword";
    }
    if (state.controlFlow) {
      if (stream.match(operators$1)) {
        return "operator";
      }
      if (stream.match(/^(\d+)/)) {
        return "number";
      }
      if (stream.eol()) {
        state.controlFlow = false;
      }
    }
    if (stream.match(arch)) {
      if (stream.eol()) {
        state.controlFlow = false;
      }
      return "number";
    }
    if (stream.match(/^%[\w]+/)) {
      if (stream.match("(")) {
        state.macroParameters = true;
      }
      return "keyword";
    }
    if (state.macroParameters) {
      if (stream.match(/^\d+/)) {
        return "number";
      }
      if (stream.match(")")) {
        state.macroParameters = false;
        return "keyword";
      }
    }
    if (stream.match(/^%\{\??[\w \-\:\!]+\}/)) {
      if (stream.eol()) {
        state.controlFlow = false;
      }
      return "def";
    }
    stream.next();
    return null;
  }
};
const rpm = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  rpmChanges,
  rpmSpec
});
function wordObj(words2) {
  var o = {};
  for (var i2 = 0, e = words2.length; i2 < e; ++i2) o[words2[i2]] = true;
  return o;
}
var keywordList = [
  "alias",
  "and",
  "BEGIN",
  "begin",
  "break",
  "case",
  "class",
  "def",
  "defined?",
  "do",
  "else",
  "elsif",
  "END",
  "end",
  "ensure",
  "false",
  "for",
  "if",
  "in",
  "module",
  "next",
  "not",
  "or",
  "redo",
  "rescue",
  "retry",
  "return",
  "self",
  "super",
  "then",
  "true",
  "undef",
  "unless",
  "until",
  "when",
  "while",
  "yield",
  "nil",
  "raise",
  "throw",
  "catch",
  "fail",
  "loop",
  "callcc",
  "caller",
  "lambda",
  "proc",
  "public",
  "protected",
  "private",
  "require",
  "load",
  "require_relative",
  "extend",
  "autoload",
  "__END__",
  "__FILE__",
  "__LINE__",
  "__dir__"
], keywords$f = wordObj(keywordList);
var indentWords = wordObj([
  "def",
  "class",
  "case",
  "for",
  "while",
  "until",
  "module",
  "catch",
  "loop",
  "proc",
  "begin"
]);
var dedentWords = wordObj(["end", "until"]);
var opening$1 = { "[": "]", "{": "}", "(": ")" };
var closing$1 = { "]": "[", "}": "{", ")": "(" };
var curPunc$5;
function chain$4(newtok, stream, state) {
  state.tokenize.push(newtok);
  return newtok(stream, state);
}
function tokenBase$h(stream, state) {
  if (stream.sol() && stream.match("=begin") && stream.eol()) {
    state.tokenize.push(readBlockComment);
    return "comment";
  }
  if (stream.eatSpace()) return null;
  var ch2 = stream.next(), m;
  if (ch2 == "`" || ch2 == "'" || ch2 == '"') {
    return chain$4(readQuoted(ch2, "string", ch2 == '"' || ch2 == "`"), stream, state);
  } else if (ch2 == "/") {
    if (regexpAhead(stream))
      return chain$4(readQuoted(ch2, "string.special", true), stream, state);
    else
      return "operator";
  } else if (ch2 == "%") {
    var style2 = "string", embed = true;
    if (stream.eat("s")) style2 = "atom";
    else if (stream.eat(/[WQ]/)) style2 = "string";
    else if (stream.eat(/[r]/)) style2 = "string.special";
    else if (stream.eat(/[wxq]/)) {
      style2 = "string";
      embed = false;
    }
    var delim = stream.eat(/[^\w\s=]/);
    if (!delim) return "operator";
    if (opening$1.propertyIsEnumerable(delim)) delim = opening$1[delim];
    return chain$4(readQuoted(delim, style2, embed, true), stream, state);
  } else if (ch2 == "#") {
    stream.skipToEnd();
    return "comment";
  } else if (ch2 == "<" && (m = stream.match(/^<([-~])[\`\"\']?([a-zA-Z_?]\w*)[\`\"\']?(?:;|$)/))) {
    return chain$4(readHereDoc(m[2], m[1]), stream, state);
  } else if (ch2 == "0") {
    if (stream.eat("x")) stream.eatWhile(/[\da-fA-F]/);
    else if (stream.eat("b")) stream.eatWhile(/[01]/);
    else stream.eatWhile(/[0-7]/);
    return "number";
  } else if (/\d/.test(ch2)) {
    stream.match(/^[\d_]*(?:\.[\d_]+)?(?:[eE][+\-]?[\d_]+)?/);
    return "number";
  } else if (ch2 == "?") {
    while (stream.match(/^\\[CM]-/)) {
    }
    if (stream.eat("\\")) stream.eatWhile(/\w/);
    else stream.next();
    return "string";
  } else if (ch2 == ":") {
    if (stream.eat("'")) return chain$4(readQuoted("'", "atom", false), stream, state);
    if (stream.eat('"')) return chain$4(readQuoted('"', "atom", true), stream, state);
    if (stream.eat(/[\<\>]/)) {
      stream.eat(/[\<\>]/);
      return "atom";
    }
    if (stream.eat(/[\+\-\*\/\&\|\:\!]/)) {
      return "atom";
    }
    if (stream.eat(/[a-zA-Z$@_\xa1-\uffff]/)) {
      stream.eatWhile(/[\w$\xa1-\uffff]/);
      stream.eat(/[\?\!\=]/);
      return "atom";
    }
    return "operator";
  } else if (ch2 == "@" && stream.match(/^@?[a-zA-Z_\xa1-\uffff]/)) {
    stream.eat("@");
    stream.eatWhile(/[\w\xa1-\uffff]/);
    return "propertyName";
  } else if (ch2 == "$") {
    if (stream.eat(/[a-zA-Z_]/)) {
      stream.eatWhile(/[\w]/);
    } else if (stream.eat(/\d/)) {
      stream.eat(/\d/);
    } else {
      stream.next();
    }
    return "variableName.special";
  } else if (/[a-zA-Z_\xa1-\uffff]/.test(ch2)) {
    stream.eatWhile(/[\w\xa1-\uffff]/);
    stream.eat(/[\?\!]/);
    if (stream.eat(":")) return "atom";
    return "variable";
  } else if (ch2 == "|" && (state.varList || state.lastTok == "{" || state.lastTok == "do")) {
    curPunc$5 = "|";
    return null;
  } else if (/[\(\)\[\]{}\\;]/.test(ch2)) {
    curPunc$5 = ch2;
    return null;
  } else if (ch2 == "-" && stream.eat(">")) {
    return "operator";
  } else if (/[=+\-\/*:\.^%<>~|]/.test(ch2)) {
    var more = stream.eatWhile(/[=+\-\/*:\.^%<>~|]/);
    if (ch2 == "." && !more) curPunc$5 = ".";
    return "operator";
  } else {
    return null;
  }
}
function regexpAhead(stream) {
  var start2 = stream.pos, depth = 0, next2, found = false, escaped = false;
  while ((next2 = stream.next()) != null) {
    if (!escaped) {
      if ("[{(".indexOf(next2) > -1) {
        depth++;
      } else if ("]})".indexOf(next2) > -1) {
        depth--;
        if (depth < 0) break;
      } else if (next2 == "/" && depth == 0) {
        found = true;
        break;
      }
      escaped = next2 == "\\";
    } else {
      escaped = false;
    }
  }
  stream.backUp(stream.pos - start2);
  return found;
}
function tokenBaseUntilBrace(depth) {
  if (!depth) depth = 1;
  return function(stream, state) {
    if (stream.peek() == "}") {
      if (depth == 1) {
        state.tokenize.pop();
        return state.tokenize[state.tokenize.length - 1](stream, state);
      } else {
        state.tokenize[state.tokenize.length - 1] = tokenBaseUntilBrace(depth - 1);
      }
    } else if (stream.peek() == "{") {
      state.tokenize[state.tokenize.length - 1] = tokenBaseUntilBrace(depth + 1);
    }
    return tokenBase$h(stream, state);
  };
}
function tokenBaseOnce() {
  var alreadyCalled = false;
  return function(stream, state) {
    if (alreadyCalled) {
      state.tokenize.pop();
      return state.tokenize[state.tokenize.length - 1](stream, state);
    }
    alreadyCalled = true;
    return tokenBase$h(stream, state);
  };
}
function readQuoted(quote2, style2, embed, unescaped) {
  return function(stream, state) {
    var escaped = false, ch2;
    if (state.context.type === "read-quoted-paused") {
      state.context = state.context.prev;
      stream.eat("}");
    }
    while ((ch2 = stream.next()) != null) {
      if (ch2 == quote2 && (unescaped || !escaped)) {
        state.tokenize.pop();
        break;
      }
      if (embed && ch2 == "#" && !escaped) {
        if (stream.eat("{")) {
          if (quote2 == "}") {
            state.context = { prev: state.context, type: "read-quoted-paused" };
          }
          state.tokenize.push(tokenBaseUntilBrace());
          break;
        } else if (/[@\$]/.test(stream.peek())) {
          state.tokenize.push(tokenBaseOnce());
          break;
        }
      }
      escaped = !escaped && ch2 == "\\";
    }
    return style2;
  };
}
function readHereDoc(phrase, mayIndent) {
  return function(stream, state) {
    if (mayIndent) stream.eatSpace();
    if (stream.match(phrase)) state.tokenize.pop();
    else stream.skipToEnd();
    return "string";
  };
}
function readBlockComment(stream, state) {
  if (stream.sol() && stream.match("=end") && stream.eol())
    state.tokenize.pop();
  stream.skipToEnd();
  return "comment";
}
const ruby = {
  name: "ruby",
  startState: function(indentUnit) {
    return {
      tokenize: [tokenBase$h],
      indented: 0,
      context: { type: "top", indented: -indentUnit },
      continuedLine: false,
      lastTok: null,
      varList: false
    };
  },
  token: function(stream, state) {
    curPunc$5 = null;
    if (stream.sol()) state.indented = stream.indentation();
    var style2 = state.tokenize[state.tokenize.length - 1](stream, state), kwtype;
    var thisTok = curPunc$5;
    if (style2 == "variable") {
      var word = stream.current();
      style2 = state.lastTok == "." ? "property" : keywords$f.propertyIsEnumerable(stream.current()) ? "keyword" : /^[A-Z]/.test(word) ? "tag" : state.lastTok == "def" || state.lastTok == "class" || state.varList ? "def" : "variable";
      if (style2 == "keyword") {
        thisTok = word;
        if (indentWords.propertyIsEnumerable(word)) kwtype = "indent";
        else if (dedentWords.propertyIsEnumerable(word)) kwtype = "dedent";
        else if ((word == "if" || word == "unless") && stream.column() == stream.indentation())
          kwtype = "indent";
        else if (word == "do" && state.context.indented < state.indented)
          kwtype = "indent";
      }
    }
    if (curPunc$5 || style2 && style2 != "comment") state.lastTok = thisTok;
    if (curPunc$5 == "|") state.varList = !state.varList;
    if (kwtype == "indent" || /[\(\[\{]/.test(curPunc$5))
      state.context = { prev: state.context, type: curPunc$5 || style2, indented: state.indented };
    else if ((kwtype == "dedent" || /[\)\]\}]/.test(curPunc$5)) && state.context.prev)
      state.context = state.context.prev;
    if (stream.eol())
      state.continuedLine = curPunc$5 == "\\" || style2 == "operator";
    return style2;
  },
  indent: function(state, textAfter, cx2) {
    if (state.tokenize[state.tokenize.length - 1] != tokenBase$h) return null;
    var firstChar = textAfter && textAfter.charAt(0);
    var ct = state.context;
    var closed = ct.type == closing$1[firstChar] || ct.type == "keyword" && /^(?:end|until|else|elsif|when|rescue)\b/.test(textAfter);
    return ct.indented + (closed ? 0 : cx2.unit) + (state.continuedLine ? cx2.unit : 0);
  },
  languageData: {
    indentOnInput: /^\s*(?:end|rescue|elsif|else|\})$/,
    commentTokens: { line: "#" },
    autocomplete: keywordList
  }
};
const ruby$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  ruby
});
var words$7 = {};
var isDoubleOperatorSym = {
  eq: "operator",
  lt: "operator",
  le: "operator",
  gt: "operator",
  ge: "operator",
  "in": "operator",
  ne: "operator",
  or: "operator"
};
var isDoubleOperatorChar = /(<=|>=|!=|<>)/;
var isSingleOperatorChar = /[=\(:\),{}.*<>+\-\/^\[\]]/;
function define$1(style2, string2, context) {
  if (context) {
    var split = string2.split(" ");
    for (var i2 = 0; i2 < split.length; i2++) {
      words$7[split[i2]] = { style: style2, state: context };
    }
  }
}
define$1("def", "stack pgm view source debug nesting nolist", ["inDataStep"]);
define$1("def", "if while until for do do; end end; then else cancel", ["inDataStep"]);
define$1("def", "label format _n_ _error_", ["inDataStep"]);
define$1("def", "ALTER BUFNO BUFSIZE CNTLLEV COMPRESS DLDMGACTION ENCRYPT ENCRYPTKEY EXTENDOBSCOUNTER GENMAX GENNUM INDEX LABEL OBSBUF OUTREP PW PWREQ READ REPEMPTY REPLACE REUSE ROLE SORTEDBY SPILL TOBSNO TYPE WRITE FILECLOSE FIRSTOBS IN OBS POINTOBS WHERE WHEREUP IDXNAME IDXWHERE DROP KEEP RENAME", ["inDataStep"]);
define$1("def", "filevar finfo finv fipname fipnamel fipstate first firstobs floor", ["inDataStep"]);
define$1("def", "varfmt varinfmt varlabel varlen varname varnum varray varrayx vartype verify vformat vformatd vformatdx vformatn vformatnx vformatw vformatwx vformatx vinarray vinarrayx vinformat vinformatd vinformatdx vinformatn vinformatnx vinformatw vinformatwx vinformatx vlabel vlabelx vlength vlengthx vname vnamex vnferr vtype vtypex weekday", ["inDataStep"]);
define$1("def", "zipfips zipname zipnamel zipstate", ["inDataStep"]);
define$1("def", "put putc putn", ["inDataStep"]);
define$1("builtin", "data run", ["inDataStep"]);
define$1("def", "data", ["inProc"]);
define$1("def", "%if %end %end; %else %else; %do %do; %then", ["inMacro"]);
define$1("builtin", "proc run; quit; libname filename %macro %mend option options", ["ALL"]);
define$1("def", "footnote title libname ods", ["ALL"]);
define$1("def", "%let %put %global %sysfunc %eval ", ["ALL"]);
define$1("variable", "&sysbuffr &syscc &syscharwidth &syscmd &sysdate &sysdate9 &sysday &sysdevic &sysdmg &sysdsn &sysencoding &sysenv &syserr &syserrortext &sysfilrc &syshostname &sysindex &sysinfo &sysjobid &syslast &syslckrc &syslibrc &syslogapplname &sysmacroname &sysmenv &sysmsg &sysncpu &sysodspath &sysparm &syspbuff &sysprocessid &sysprocessname &sysprocname &sysrc &sysscp &sysscpl &sysscpl &syssite &sysstartid &sysstartname &systcpiphostname &systime &sysuserid &sysver &sysvlong &sysvlong4 &syswarningtext", ["ALL"]);
define$1("def", "source2 nosource2 page pageno pagesize", ["ALL"]);
define$1("def", "_all_ _character_ _cmd_ _freq_ _i_ _infile_ _last_ _msg_ _null_ _numeric_ _temporary_ _type_ abort abs addr adjrsq airy alpha alter altlog altprint and arcos array arsin as atan attrc attrib attrn authserver autoexec awscontrol awsdef awsmenu awsmenumerge awstitle backward band base betainv between blocksize blshift bnot bor brshift bufno bufsize bxor by byerr byline byte calculated call cards cards4 catcache cbufno cdf ceil center cexist change chisq cinv class cleanup close cnonct cntllev coalesce codegen col collate collin column comamid comaux1 comaux2 comdef compbl compound compress config continue convert cos cosh cpuid create cross crosstab css curobs cv daccdb daccdbsl daccsl daccsyd dacctab dairy datalines datalines4 datejul datepart datetime day dbcslang dbcstype dclose ddfm ddm delete delimiter depdb depdbsl depsl depsyd deptab dequote descending descript design= device dflang dhms dif digamma dim dinfo display distinct dkricond dkrocond dlm dnum do dopen doptname doptnum dread drop dropnote dsname dsnferr echo else emaildlg emailid emailpw emailserver emailsys encrypt end endsas engine eof eov erf erfc error errorcheck errors exist exp fappend fclose fcol fdelete feedback fetch fetchobs fexist fget file fileclose fileexist filefmt filename fileref  fmterr fmtsearch fnonct fnote font fontalias  fopen foptname foptnum force formatted formchar formdelim formdlim forward fpoint fpos fput fread frewind frlen from fsep fuzz fwrite gaminv gamma getoption getvarc getvarn go goto group gwindow hbar hbound helpenv helploc hms honorappearance hosthelp hostprint hour hpct html hvar ibessel ibr id if index indexc indexw initcmd initstmt inner input inputc inputn inr insert int intck intnx into intrr invaliddata irr is jbessel join juldate keep kentb kurtosis label lag last lbound leave left length levels lgamma lib  library libref line linesize link list log log10 log2 logpdf logpmf logsdf lostcard lowcase lrecl ls macro macrogen maps mautosource max maxdec maxr mdy mean measures median memtype merge merror min minute missing missover mlogic mod mode model modify month mopen mort mprint mrecall msglevel msymtabmax mvarsize myy n nest netpv new news nmiss no nobatch nobs nocaps nocardimage nocenter nocharcode nocmdmac nocol nocum nodate nodbcs nodetails nodmr nodms nodmsbatch nodup nodupkey noduplicates noechoauto noequals noerrorabend noexitwindows nofullstimer noicon noimplmac noint nolist noloadlist nomiss nomlogic nomprint nomrecall nomsgcase nomstored nomultenvappl nonotes nonumber noobs noovp nopad nopercent noprint noprintinit normal norow norsasuser nosetinit  nosplash nosymbolgen note notes notitle notitles notsorted noverbose noxsync noxwait npv null number numkeys nummousekeys nway obs  on open     order ordinal otherwise out outer outp= output over ovp p(1 5 10 25 50 75 90 95 99) pad pad2  paired parm parmcards path pathdll pathname pdf peek peekc pfkey pmf point poisson poke position printer probbeta probbnml probchi probf probgam probhypr probit probnegb probnorm probsig probt procleave prt ps  pw pwreq qtr quote r ranbin rancau random ranexp rangam range ranks rannor ranpoi rantbl rantri ranuni rcorr read recfm register regr remote remove rename repeat repeated replace resolve retain return reuse reverse rewind right round rsquare rtf rtrace rtraceloc s s2 samploc sasautos sascontrol sasfrscr sasmsg sasmstore sasscript sasuser saving scan sdf second select selection separated seq serror set setcomm setot sign simple sin sinh siteinfo skewness skip sle sls sortedby sortpgm sortseq sortsize soundex  spedis splashlocation split spool sqrt start std stderr stdin stfips stimer stname stnamel stop stopover sub subgroup subpopn substr sum sumwgt symbol symbolgen symget symput sysget sysin sysleave sysmsg sysparm sysprint sysprintfont sysprod sysrc system t table tables tan tanh tapeclose tbufsize terminal test then timepart tinv  tnonct to today tol tooldef totper transformout translate trantab tranwrd trigamma trim trimn trunc truncover type unformatted uniform union until upcase update user usericon uss validate value var  weight when where while wincharset window work workinit workterm write wsum xsync xwait yearcutoff yes yyq  min max", ["inDataStep", "inProc"]);
define$1("operator", "and not ", ["inDataStep", "inProc"]);
function tokenize$2(stream, state) {
  var ch2 = stream.next();
  if (ch2 === "/" && stream.eat("*")) {
    state.continueComment = true;
    return "comment";
  } else if (state.continueComment === true) {
    if (ch2 === "*" && stream.peek() === "/") {
      stream.next();
      state.continueComment = false;
    } else if (stream.skipTo("*")) {
      stream.skipTo("*");
      stream.next();
      if (stream.eat("/"))
        state.continueComment = false;
    } else {
      stream.skipToEnd();
    }
    return "comment";
  }
  if (ch2 == "*" && stream.column() == stream.indentation()) {
    stream.skipToEnd();
    return "comment";
  }
  var doubleOperator = ch2 + stream.peek();
  if ((ch2 === '"' || ch2 === "'") && !state.continueString) {
    state.continueString = ch2;
    return "string";
  } else if (state.continueString) {
    if (state.continueString == ch2) {
      state.continueString = null;
    } else if (stream.skipTo(state.continueString)) {
      stream.next();
      state.continueString = null;
    } else {
      stream.skipToEnd();
    }
    return "string";
  } else if (state.continueString !== null && stream.eol()) {
    stream.skipTo(state.continueString) || stream.skipToEnd();
    return "string";
  } else if (/[\d\.]/.test(ch2)) {
    if (ch2 === ".")
      stream.match(/^[0-9]+([eE][\-+]?[0-9]+)?/);
    else if (ch2 === "0")
      stream.match(/^[xX][0-9a-fA-F]+/) || stream.match(/^0[0-7]+/);
    else
      stream.match(/^[0-9]*\.?[0-9]*([eE][\-+]?[0-9]+)?/);
    return "number";
  } else if (isDoubleOperatorChar.test(ch2 + stream.peek())) {
    stream.next();
    return "operator";
  } else if (isDoubleOperatorSym.hasOwnProperty(doubleOperator)) {
    stream.next();
    if (stream.peek() === " ")
      return isDoubleOperatorSym[doubleOperator.toLowerCase()];
  } else if (isSingleOperatorChar.test(ch2)) {
    return "operator";
  }
  var word;
  if (stream.match(/[%&;\w]+/, false) != null) {
    word = ch2 + stream.match(/[%&;\w]+/, true);
    if (/&/.test(word)) return "variable";
  } else {
    word = ch2;
  }
  if (state.nextword) {
    stream.match(/[\w]+/);
    if (stream.peek() === ".") stream.skipTo(" ");
    state.nextword = false;
    return "variableName.special";
  }
  word = word.toLowerCase();
  if (state.inDataStep) {
    if (word === "run;" || stream.match(/run\s;/)) {
      state.inDataStep = false;
      return "builtin";
    }
    if (word && stream.next() === ".") {
      if (/\w/.test(stream.peek())) return "variableName.special";
      else return "variable";
    }
    if (word && words$7.hasOwnProperty(word) && (words$7[word].state.indexOf("inDataStep") !== -1 || words$7[word].state.indexOf("ALL") !== -1)) {
      if (stream.start < stream.pos)
        stream.backUp(stream.pos - stream.start);
      for (var i2 = 0; i2 < word.length; ++i2) stream.next();
      return words$7[word].style;
    }
  }
  if (state.inProc) {
    if (word === "run;" || word === "quit;") {
      state.inProc = false;
      return "builtin";
    }
    if (word && words$7.hasOwnProperty(word) && (words$7[word].state.indexOf("inProc") !== -1 || words$7[word].state.indexOf("ALL") !== -1)) {
      stream.match(/[\w]+/);
      return words$7[word].style;
    }
  }
  if (state.inMacro) {
    if (word === "%mend") {
      if (stream.peek() === ";") stream.next();
      state.inMacro = false;
      return "builtin";
    }
    if (word && words$7.hasOwnProperty(word) && (words$7[word].state.indexOf("inMacro") !== -1 || words$7[word].state.indexOf("ALL") !== -1)) {
      stream.match(/[\w]+/);
      return words$7[word].style;
    }
    return "atom";
  }
  if (word && words$7.hasOwnProperty(word)) {
    stream.backUp(1);
    stream.match(/[\w]+/);
    if (word === "data" && /=/.test(stream.peek()) === false) {
      state.inDataStep = true;
      state.nextword = true;
      return "builtin";
    }
    if (word === "proc") {
      state.inProc = true;
      state.nextword = true;
      return "builtin";
    }
    if (word === "%macro") {
      state.inMacro = true;
      state.nextword = true;
      return "builtin";
    }
    if (/title[1-9]/.test(word)) return "def";
    if (word === "footnote") {
      stream.eat(/[1-9]/);
      return "def";
    }
    if (state.inDataStep === true && words$7[word].state.indexOf("inDataStep") !== -1)
      return words$7[word].style;
    if (state.inProc === true && words$7[word].state.indexOf("inProc") !== -1)
      return words$7[word].style;
    if (state.inMacro === true && words$7[word].state.indexOf("inMacro") !== -1)
      return words$7[word].style;
    if (words$7[word].state.indexOf("ALL") !== -1)
      return words$7[word].style;
    return null;
  }
  return null;
}
const sas = {
  name: "sas",
  startState: function() {
    return {
      inDataStep: false,
      inProc: false,
      inMacro: false,
      nextword: false,
      continueString: null,
      continueComment: false
    };
  },
  token: function(stream, state) {
    if (stream.eatSpace()) return null;
    return tokenize$2(stream, state);
  },
  languageData: {
    commentTokens: { block: { open: "/*", close: "*/" } }
  }
};
const sas$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  sas
});
var BUILTIN = "builtin", COMMENT = "comment", STRING = "string", SYMBOL = "symbol", ATOM = "atom", NUMBER = "number", BRACKET = "bracket";
var INDENT_WORD_SKIP = 2;
function makeKeywords(str) {
  var obj = {}, words2 = str.split(" ");
  for (var i2 = 0; i2 < words2.length; ++i2) obj[words2[i2]] = true;
  return obj;
}
var keywords$e = makeKeywords("λ case-lambda call/cc class cond-expand define-class define-values exit-handler field import inherit init-field interface let*-values let-values let/ec mixin opt-lambda override protect provide public rename require require-for-syntax syntax syntax-case syntax-error unit/sig unless when with-syntax and begin call-with-current-continuation call-with-input-file call-with-output-file case cond define define-syntax define-macro defmacro delay do dynamic-wind else for-each if lambda let let* let-syntax letrec letrec-syntax map or syntax-rules abs acos angle append apply asin assoc assq assv atan boolean? caar cadr call-with-input-file call-with-output-file call-with-values car cdddar cddddr cdr ceiling char->integer char-alphabetic? char-ci<=? char-ci<? char-ci=? char-ci>=? char-ci>? char-downcase char-lower-case? char-numeric? char-ready? char-upcase char-upper-case? char-whitespace? char<=? char<? char=? char>=? char>? char? close-input-port close-output-port complex? cons cos current-input-port current-output-port denominator display eof-object? eq? equal? eqv? eval even? exact->inexact exact? exp expt #f floor force gcd imag-part inexact->exact inexact? input-port? integer->char integer? interaction-environment lcm length list list->string list->vector list-ref list-tail list? load log magnitude make-polar make-rectangular make-string make-vector max member memq memv min modulo negative? newline not null-environment null? number->string number? numerator odd? open-input-file open-output-file output-port? pair? peek-char port? positive? procedure? quasiquote quote quotient rational? rationalize read read-char real-part real? remainder reverse round scheme-report-environment set! set-car! set-cdr! sin sqrt string string->list string->number string->symbol string-append string-ci<=? string-ci<? string-ci=? string-ci>=? string-ci>? string-copy string-fill! string-length string-ref string-set! string<=? string<? string=? string>=? string>? string? substring symbol->string symbol? #t tan transcript-off transcript-on truncate values vector vector->list vector-fill! vector-length vector-ref vector-set! with-input-from-file with-output-to-file write write-char zero?");
var indentKeys = makeKeywords("define let letrec let* lambda define-macro defmacro let-syntax letrec-syntax let-values let*-values define-syntax syntax-rules define-values when unless");
function stateStack(indent2, type2, prev) {
  this.indent = indent2;
  this.type = type2;
  this.prev = prev;
}
function pushStack(state, indent2, type2) {
  state.indentStack = new stateStack(indent2, type2, state.indentStack);
}
function popStack(state) {
  state.indentStack = state.indentStack.prev;
}
var binaryMatcher = new RegExp(/^(?:[-+]i|[-+][01]+#*(?:\/[01]+#*)?i|[-+]?[01]+#*(?:\/[01]+#*)?@[-+]?[01]+#*(?:\/[01]+#*)?|[-+]?[01]+#*(?:\/[01]+#*)?[-+](?:[01]+#*(?:\/[01]+#*)?)?i|[-+]?[01]+#*(?:\/[01]+#*)?)(?=[()\s;"]|$)/i);
var octalMatcher = new RegExp(/^(?:[-+]i|[-+][0-7]+#*(?:\/[0-7]+#*)?i|[-+]?[0-7]+#*(?:\/[0-7]+#*)?@[-+]?[0-7]+#*(?:\/[0-7]+#*)?|[-+]?[0-7]+#*(?:\/[0-7]+#*)?[-+](?:[0-7]+#*(?:\/[0-7]+#*)?)?i|[-+]?[0-7]+#*(?:\/[0-7]+#*)?)(?=[()\s;"]|$)/i);
var hexMatcher = new RegExp(/^(?:[-+]i|[-+][\da-f]+#*(?:\/[\da-f]+#*)?i|[-+]?[\da-f]+#*(?:\/[\da-f]+#*)?@[-+]?[\da-f]+#*(?:\/[\da-f]+#*)?|[-+]?[\da-f]+#*(?:\/[\da-f]+#*)?[-+](?:[\da-f]+#*(?:\/[\da-f]+#*)?)?i|[-+]?[\da-f]+#*(?:\/[\da-f]+#*)?)(?=[()\s;"]|$)/i);
var decimalMatcher = new RegExp(/^(?:[-+]i|[-+](?:(?:(?:\d+#+\.?#*|\d+\.\d*#*|\.\d+#*|\d+)(?:[esfdl][-+]?\d+)?)|\d+#*\/\d+#*)i|[-+]?(?:(?:(?:\d+#+\.?#*|\d+\.\d*#*|\.\d+#*|\d+)(?:[esfdl][-+]?\d+)?)|\d+#*\/\d+#*)@[-+]?(?:(?:(?:\d+#+\.?#*|\d+\.\d*#*|\.\d+#*|\d+)(?:[esfdl][-+]?\d+)?)|\d+#*\/\d+#*)|[-+]?(?:(?:(?:\d+#+\.?#*|\d+\.\d*#*|\.\d+#*|\d+)(?:[esfdl][-+]?\d+)?)|\d+#*\/\d+#*)[-+](?:(?:(?:\d+#+\.?#*|\d+\.\d*#*|\.\d+#*|\d+)(?:[esfdl][-+]?\d+)?)|\d+#*\/\d+#*)?i|(?:(?:(?:\d+#+\.?#*|\d+\.\d*#*|\.\d+#*|\d+)(?:[esfdl][-+]?\d+)?)|\d+#*\/\d+#*))(?=[()\s;"]|$)/i);
function isBinaryNumber(stream) {
  return stream.match(binaryMatcher);
}
function isOctalNumber(stream) {
  return stream.match(octalMatcher);
}
function isDecimalNumber(stream, backup) {
  if (backup === true) {
    stream.backUp(1);
  }
  return stream.match(decimalMatcher);
}
function isHexNumber(stream) {
  return stream.match(hexMatcher);
}
function processEscapedSequence(stream, options) {
  var next2, escaped = false;
  while ((next2 = stream.next()) != null) {
    if (next2 == options.token && !escaped) {
      options.state.mode = false;
      break;
    }
    escaped = !escaped && next2 == "\\";
  }
}
const scheme = {
  name: "scheme",
  startState: function() {
    return {
      indentStack: null,
      indentation: 0,
      mode: false,
      sExprComment: false,
      sExprQuote: false
    };
  },
  token: function(stream, state) {
    if (state.indentStack == null && stream.sol()) {
      state.indentation = stream.indentation();
    }
    if (stream.eatSpace()) {
      return null;
    }
    var returnType = null;
    switch (state.mode) {
      case "string":
        processEscapedSequence(stream, {
          token: '"',
          state
        });
        returnType = STRING;
        break;
      case "symbol":
        processEscapedSequence(stream, {
          token: "|",
          state
        });
        returnType = SYMBOL;
        break;
      case "comment":
        var next2, maybeEnd = false;
        while ((next2 = stream.next()) != null) {
          if (next2 == "#" && maybeEnd) {
            state.mode = false;
            break;
          }
          maybeEnd = next2 == "|";
        }
        returnType = COMMENT;
        break;
      case "s-expr-comment":
        state.mode = false;
        if (stream.peek() == "(" || stream.peek() == "[") {
          state.sExprComment = 0;
        } else {
          stream.eatWhile(/[^\s\(\)\[\]]/);
          returnType = COMMENT;
          break;
        }
      default:
        var ch2 = stream.next();
        if (ch2 == '"') {
          state.mode = "string";
          returnType = STRING;
        } else if (ch2 == "'") {
          if (stream.peek() == "(" || stream.peek() == "[") {
            if (typeof state.sExprQuote != "number") {
              state.sExprQuote = 0;
            }
            returnType = ATOM;
          } else {
            stream.eatWhile(/[\w_\-!$%&*+\.\/:<=>?@\^~]/);
            returnType = ATOM;
          }
        } else if (ch2 == "|") {
          state.mode = "symbol";
          returnType = SYMBOL;
        } else if (ch2 == "#") {
          if (stream.eat("|")) {
            state.mode = "comment";
            returnType = COMMENT;
          } else if (stream.eat(/[tf]/i)) {
            returnType = ATOM;
          } else if (stream.eat(";")) {
            state.mode = "s-expr-comment";
            returnType = COMMENT;
          } else {
            var numTest = null, hasExactness = false, hasRadix = true;
            if (stream.eat(/[ei]/i)) {
              hasExactness = true;
            } else {
              stream.backUp(1);
            }
            if (stream.match(/^#b/i)) {
              numTest = isBinaryNumber;
            } else if (stream.match(/^#o/i)) {
              numTest = isOctalNumber;
            } else if (stream.match(/^#x/i)) {
              numTest = isHexNumber;
            } else if (stream.match(/^#d/i)) {
              numTest = isDecimalNumber;
            } else if (stream.match(/^[-+0-9.]/, false)) {
              hasRadix = false;
              numTest = isDecimalNumber;
            } else if (!hasExactness) {
              stream.eat("#");
            }
            if (numTest != null) {
              if (hasRadix && !hasExactness) {
                stream.match(/^#[ei]/i);
              }
              if (numTest(stream))
                returnType = NUMBER;
            }
          }
        } else if (/^[-+0-9.]/.test(ch2) && isDecimalNumber(stream, true)) {
          returnType = NUMBER;
        } else if (ch2 == ";") {
          stream.skipToEnd();
          returnType = COMMENT;
        } else if (ch2 == "(" || ch2 == "[") {
          var keyWord = "";
          var indentTemp = stream.column(), letter;
          while ((letter = stream.eat(/[^\s\(\[\;\)\]]/)) != null) {
            keyWord += letter;
          }
          if (keyWord.length > 0 && indentKeys.propertyIsEnumerable(keyWord)) {
            pushStack(state, indentTemp + INDENT_WORD_SKIP, ch2);
          } else {
            stream.eatSpace();
            if (stream.eol() || stream.peek() == ";") {
              pushStack(state, indentTemp + 1, ch2);
            } else {
              pushStack(state, indentTemp + stream.current().length, ch2);
            }
          }
          stream.backUp(stream.current().length - 1);
          if (typeof state.sExprComment == "number") state.sExprComment++;
          if (typeof state.sExprQuote == "number") state.sExprQuote++;
          returnType = BRACKET;
        } else if (ch2 == ")" || ch2 == "]") {
          returnType = BRACKET;
          if (state.indentStack != null && state.indentStack.type == (ch2 == ")" ? "(" : "[")) {
            popStack(state);
            if (typeof state.sExprComment == "number") {
              if (--state.sExprComment == 0) {
                returnType = COMMENT;
                state.sExprComment = false;
              }
            }
            if (typeof state.sExprQuote == "number") {
              if (--state.sExprQuote == 0) {
                returnType = ATOM;
                state.sExprQuote = false;
              }
            }
          }
        } else {
          stream.eatWhile(/[\w_\-!$%&*+\.\/:<=>?@\^~]/);
          if (keywords$e && keywords$e.propertyIsEnumerable(stream.current())) {
            returnType = BUILTIN;
          } else returnType = "variable";
        }
    }
    return typeof state.sExprComment == "number" ? COMMENT : typeof state.sExprQuote == "number" ? ATOM : returnType;
  },
  indent: function(state) {
    if (state.indentStack == null) return state.indentation;
    return state.indentStack.indent;
  },
  languageData: {
    closeBrackets: { brackets: ["(", "[", "{", '"'] },
    commentTokens: { line: ";;" }
  }
};
const scheme$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  scheme
});
var words$6 = {};
function define(style2, dict) {
  for (var i2 = 0; i2 < dict.length; i2++) {
    words$6[dict[i2]] = style2;
  }
}
var commonAtoms$1 = ["true", "false"];
var commonKeywords$1 = [
  "if",
  "then",
  "do",
  "else",
  "elif",
  "while",
  "until",
  "for",
  "in",
  "esac",
  "fi",
  "fin",
  "fil",
  "done",
  "exit",
  "set",
  "unset",
  "export",
  "function"
];
var commonCommands = [
  "ab",
  "awk",
  "bash",
  "beep",
  "cat",
  "cc",
  "cd",
  "chown",
  "chmod",
  "chroot",
  "clear",
  "cp",
  "curl",
  "cut",
  "diff",
  "echo",
  "find",
  "gawk",
  "gcc",
  "get",
  "git",
  "grep",
  "hg",
  "kill",
  "killall",
  "ln",
  "ls",
  "make",
  "mkdir",
  "openssl",
  "mv",
  "nc",
  "nl",
  "node",
  "npm",
  "ping",
  "ps",
  "restart",
  "rm",
  "rmdir",
  "sed",
  "service",
  "sh",
  "shopt",
  "shred",
  "source",
  "sort",
  "sleep",
  "ssh",
  "start",
  "stop",
  "su",
  "sudo",
  "svn",
  "tee",
  "telnet",
  "top",
  "touch",
  "vi",
  "vim",
  "wall",
  "wc",
  "wget",
  "who",
  "write",
  "yes",
  "zsh"
];
define("atom", commonAtoms$1);
define("keyword", commonKeywords$1);
define("builtin", commonCommands);
function tokenBase$g(stream, state) {
  if (stream.eatSpace()) return null;
  var sol = stream.sol();
  var ch2 = stream.next();
  if (ch2 === "\\") {
    stream.next();
    return null;
  }
  if (ch2 === "'" || ch2 === '"' || ch2 === "`") {
    state.tokens.unshift(tokenString$b(ch2, ch2 === "`" ? "quote" : "string"));
    return tokenize$1(stream, state);
  }
  if (ch2 === "#") {
    if (sol && stream.eat("!")) {
      stream.skipToEnd();
      return "meta";
    }
    stream.skipToEnd();
    return "comment";
  }
  if (ch2 === "$") {
    state.tokens.unshift(tokenDollar);
    return tokenize$1(stream, state);
  }
  if (ch2 === "+" || ch2 === "=") {
    return "operator";
  }
  if (ch2 === "-") {
    stream.eat("-");
    stream.eatWhile(/\w/);
    return "attribute";
  }
  if (ch2 == "<") {
    if (stream.match("<<")) return "operator";
    var heredoc = stream.match(/^<-?\s*(?:['"]([^'"]*)['"]|([^'"\s]*))/);
    if (heredoc) {
      state.tokens.unshift(tokenHeredoc(heredoc[1] || heredoc[2]));
      return "string.special";
    }
  }
  if (/\d/.test(ch2)) {
    stream.eatWhile(/\d/);
    if (stream.eol() || !/\w/.test(stream.peek())) {
      return "number";
    }
  }
  stream.eatWhile(/[\w-]/);
  var cur = stream.current();
  if (stream.peek() === "=" && /\w+/.test(cur)) return "def";
  return words$6.hasOwnProperty(cur) ? words$6[cur] : null;
}
function tokenString$b(quote2, style2) {
  var close = quote2 == "(" ? ")" : quote2 == "{" ? "}" : quote2;
  return function(stream, state) {
    var next2, escaped = false;
    while ((next2 = stream.next()) != null) {
      if (next2 === close && !escaped) {
        state.tokens.shift();
        break;
      } else if (next2 === "$" && !escaped && quote2 !== "'" && stream.peek() != close) {
        escaped = true;
        stream.backUp(1);
        state.tokens.unshift(tokenDollar);
        break;
      } else if (!escaped && quote2 !== close && next2 === quote2) {
        state.tokens.unshift(tokenString$b(quote2, style2));
        return tokenize$1(stream, state);
      } else if (!escaped && /['"]/.test(next2) && !/['"]/.test(quote2)) {
        state.tokens.unshift(tokenStringStart(next2, "string"));
        stream.backUp(1);
        break;
      }
      escaped = !escaped && next2 === "\\";
    }
    return style2;
  };
}
function tokenStringStart(quote2, style2) {
  return function(stream, state) {
    state.tokens[0] = tokenString$b(quote2, style2);
    stream.next();
    return tokenize$1(stream, state);
  };
}
var tokenDollar = function(stream, state) {
  if (state.tokens.length > 1) stream.eat("$");
  var ch2 = stream.next();
  if (/['"({]/.test(ch2)) {
    state.tokens[0] = tokenString$b(ch2, ch2 == "(" ? "quote" : ch2 == "{" ? "def" : "string");
    return tokenize$1(stream, state);
  }
  if (!/\d/.test(ch2)) stream.eatWhile(/\w/);
  state.tokens.shift();
  return "def";
};
function tokenHeredoc(delim) {
  return function(stream, state) {
    if (stream.sol() && stream.string == delim) state.tokens.shift();
    stream.skipToEnd();
    return "string.special";
  };
}
function tokenize$1(stream, state) {
  return (state.tokens[0] || tokenBase$g)(stream, state);
}
const shell = {
  name: "shell",
  startState: function() {
    return { tokens: [] };
  },
  token: function(stream, state) {
    return tokenize$1(stream, state);
  },
  languageData: {
    autocomplete: commonAtoms$1.concat(commonKeywords$1, commonCommands),
    closeBrackets: { brackets: ["(", "[", "{", "'", '"', "`"] },
    commentTokens: { line: "#" }
  }
};
const shell$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  shell
});
function words$5(str) {
  var obj = {}, words2 = str.split(" ");
  for (var i2 = 0; i2 < words2.length; ++i2) obj[words2[i2]] = true;
  return obj;
}
var keywords$d = words$5("if elsif else stop require");
var atoms$3 = words$5("true false not");
function tokenBase$f(stream, state) {
  var ch2 = stream.next();
  if (ch2 == "/" && stream.eat("*")) {
    state.tokenize = tokenCComment$1;
    return tokenCComment$1(stream, state);
  }
  if (ch2 === "#") {
    stream.skipToEnd();
    return "comment";
  }
  if (ch2 == '"') {
    state.tokenize = tokenString$a(ch2);
    return state.tokenize(stream, state);
  }
  if (ch2 == "(") {
    state._indent.push("(");
    state._indent.push("{");
    return null;
  }
  if (ch2 === "{") {
    state._indent.push("{");
    return null;
  }
  if (ch2 == ")") {
    state._indent.pop();
    state._indent.pop();
  }
  if (ch2 === "}") {
    state._indent.pop();
    return null;
  }
  if (ch2 == ",")
    return null;
  if (ch2 == ";")
    return null;
  if (/[{}\(\),;]/.test(ch2))
    return null;
  if (/\d/.test(ch2)) {
    stream.eatWhile(/[\d]/);
    stream.eat(/[KkMmGg]/);
    return "number";
  }
  if (ch2 == ":") {
    stream.eatWhile(/[a-zA-Z_]/);
    stream.eatWhile(/[a-zA-Z0-9_]/);
    return "operator";
  }
  stream.eatWhile(/\w/);
  var cur = stream.current();
  if (cur == "text" && stream.eat(":")) {
    state.tokenize = tokenMultiLineString;
    return "string";
  }
  if (keywords$d.propertyIsEnumerable(cur))
    return "keyword";
  if (atoms$3.propertyIsEnumerable(cur))
    return "atom";
  return null;
}
function tokenMultiLineString(stream, state) {
  state._multiLineString = true;
  if (!stream.sol()) {
    stream.eatSpace();
    if (stream.peek() == "#") {
      stream.skipToEnd();
      return "comment";
    }
    stream.skipToEnd();
    return "string";
  }
  if (stream.next() == "." && stream.eol()) {
    state._multiLineString = false;
    state.tokenize = tokenBase$f;
  }
  return "string";
}
function tokenCComment$1(stream, state) {
  var maybeEnd = false, ch2;
  while ((ch2 = stream.next()) != null) {
    if (maybeEnd && ch2 == "/") {
      state.tokenize = tokenBase$f;
      break;
    }
    maybeEnd = ch2 == "*";
  }
  return "comment";
}
function tokenString$a(quote2) {
  return function(stream, state) {
    var escaped = false, ch2;
    while ((ch2 = stream.next()) != null) {
      if (ch2 == quote2 && !escaped)
        break;
      escaped = !escaped && ch2 == "\\";
    }
    if (!escaped) state.tokenize = tokenBase$f;
    return "string";
  };
}
const sieve = {
  name: "sieve",
  startState: function(base2) {
    return {
      tokenize: tokenBase$f,
      baseIndent: base2 || 0,
      _indent: []
    };
  },
  token: function(stream, state) {
    if (stream.eatSpace())
      return null;
    return (state.tokenize || tokenBase$f)(stream, state);
  },
  indent: function(state, _textAfter, cx2) {
    var length = state._indent.length;
    if (_textAfter && _textAfter[0] == "}")
      length--;
    if (length < 0)
      length = 0;
    return length * cx2.unit;
  },
  languageData: {
    indentOnInput: /^\s*\}$/
  }
};
const sieve$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  sieve
});
var specialChars = /[+\-\/\\*~<>=@%|&?!.,:;^]/;
var keywords$c = /true|false|nil|self|super|thisContext/;
var Context$5 = function(tokenizer2, parent) {
  this.next = tokenizer2;
  this.parent = parent;
};
var Token = function(name, context, eos) {
  this.name = name;
  this.context = context;
  this.eos = eos;
};
var State2 = function() {
  this.context = new Context$5(next, null);
  this.expectVariable = true;
  this.indentation = 0;
  this.userIndentationDelta = 0;
};
State2.prototype.userIndent = function(indentation, indentUnit) {
  this.userIndentationDelta = indentation > 0 ? indentation / indentUnit - this.indentation : 0;
};
var next = function(stream, context, state) {
  var token = new Token(null, context, false);
  var aChar = stream.next();
  if (aChar === '"') {
    token = nextComment(stream, new Context$5(nextComment, context));
  } else if (aChar === "'") {
    token = nextString(stream, new Context$5(nextString, context));
  } else if (aChar === "#") {
    if (stream.peek() === "'") {
      stream.next();
      token = nextSymbol(stream, new Context$5(nextSymbol, context));
    } else {
      if (stream.eatWhile(/[^\s.{}\[\]()]/))
        token.name = "string.special";
      else
        token.name = "meta";
    }
  } else if (aChar === "$") {
    if (stream.next() === "<") {
      stream.eatWhile(/[^\s>]/);
      stream.next();
    }
    token.name = "string.special";
  } else if (aChar === "|" && state.expectVariable) {
    token.context = new Context$5(nextTemporaries, context);
  } else if (/[\[\]{}()]/.test(aChar)) {
    token.name = "bracket";
    token.eos = /[\[{(]/.test(aChar);
    if (aChar === "[") {
      state.indentation++;
    } else if (aChar === "]") {
      state.indentation = Math.max(0, state.indentation - 1);
    }
  } else if (specialChars.test(aChar)) {
    stream.eatWhile(specialChars);
    token.name = "operator";
    token.eos = aChar !== ";";
  } else if (/\d/.test(aChar)) {
    stream.eatWhile(/[\w\d]/);
    token.name = "number";
  } else if (/[\w_]/.test(aChar)) {
    stream.eatWhile(/[\w\d_]/);
    token.name = state.expectVariable ? keywords$c.test(stream.current()) ? "keyword" : "variable" : null;
  } else {
    token.eos = state.expectVariable;
  }
  return token;
};
var nextComment = function(stream, context) {
  stream.eatWhile(/[^"]/);
  return new Token("comment", stream.eat('"') ? context.parent : context, true);
};
var nextString = function(stream, context) {
  stream.eatWhile(/[^']/);
  return new Token("string", stream.eat("'") ? context.parent : context, false);
};
var nextSymbol = function(stream, context) {
  stream.eatWhile(/[^']/);
  return new Token("string.special", stream.eat("'") ? context.parent : context, false);
};
var nextTemporaries = function(stream, context) {
  var token = new Token(null, context, false);
  var aChar = stream.next();
  if (aChar === "|") {
    token.context = context.parent;
    token.eos = true;
  } else {
    stream.eatWhile(/[^|]/);
    token.name = "variable";
  }
  return token;
};
const smalltalk = {
  name: "smalltalk",
  startState: function() {
    return new State2();
  },
  token: function(stream, state) {
    state.userIndent(stream.indentation(), stream.indentUnit);
    if (stream.eatSpace()) {
      return null;
    }
    var token = state.context.next(stream, state.context, state);
    state.context = token.context;
    state.expectVariable = token.eos;
    return token.name;
  },
  blankLine: function(state, indentUnit) {
    state.userIndent(0, indentUnit);
  },
  indent: function(state, textAfter, cx2) {
    var i2 = state.context.next === next && textAfter && textAfter.charAt(0) === "]" ? -1 : state.userIndentationDelta;
    return (state.indentation + i2) * cx2.unit;
  },
  languageData: {
    indentOnInput: /^\s*\]$/
  }
};
const smalltalk$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  smalltalk
});
var isStringChar = /[^\s\|\!\+\-\*\?\~\^\&\:\(\)\[\]\{\}\"\\]/;
var isOperatorChar$5 = /[\|\!\+\-\*\?\~\^\&]/;
var isOperatorString = /^(OR|AND|NOT|TO)$/;
function isNumber(word) {
  return parseFloat(word).toString() === word;
}
function tokenString$9(quote2) {
  return function(stream, state) {
    var escaped = false, next2;
    while ((next2 = stream.next()) != null) {
      if (next2 == quote2 && !escaped) break;
      escaped = !escaped && next2 == "\\";
    }
    if (!escaped) state.tokenize = tokenBase$e;
    return "string";
  };
}
function tokenOperator(operator2) {
  return function(stream, state) {
    if (operator2 == "|")
      stream.eat(/\|/);
    else if (operator2 == "&")
      stream.eat(/\&/);
    state.tokenize = tokenBase$e;
    return "operator";
  };
}
function tokenWord(ch2) {
  return function(stream, state) {
    var word = ch2;
    while ((ch2 = stream.peek()) && ch2.match(isStringChar) != null) {
      word += stream.next();
    }
    state.tokenize = tokenBase$e;
    if (isOperatorString.test(word))
      return "operator";
    else if (isNumber(word))
      return "number";
    else if (stream.peek() == ":")
      return "propertyName";
    else
      return "string";
  };
}
function tokenBase$e(stream, state) {
  var ch2 = stream.next();
  if (ch2 == '"')
    state.tokenize = tokenString$9(ch2);
  else if (isOperatorChar$5.test(ch2))
    state.tokenize = tokenOperator(ch2);
  else if (isStringChar.test(ch2))
    state.tokenize = tokenWord(ch2);
  return state.tokenize != tokenBase$e ? state.tokenize(stream, state) : null;
}
const solr = {
  name: "solr",
  startState: function() {
    return {
      tokenize: tokenBase$e
    };
  },
  token: function(stream, state) {
    if (stream.eatSpace()) return null;
    return state.tokenize(stream, state);
  }
};
const solr$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  solr
});
var curPunc$4;
function wordRegexp$5(words2) {
  return new RegExp("^(?:" + words2.join("|") + ")$", "i");
}
var ops = wordRegexp$5([
  "str",
  "lang",
  "langmatches",
  "datatype",
  "bound",
  "sameterm",
  "isiri",
  "isuri",
  "iri",
  "uri",
  "bnode",
  "count",
  "sum",
  "min",
  "max",
  "avg",
  "sample",
  "group_concat",
  "rand",
  "abs",
  "ceil",
  "floor",
  "round",
  "concat",
  "substr",
  "strlen",
  "replace",
  "ucase",
  "lcase",
  "encode_for_uri",
  "contains",
  "strstarts",
  "strends",
  "strbefore",
  "strafter",
  "year",
  "month",
  "day",
  "hours",
  "minutes",
  "seconds",
  "timezone",
  "tz",
  "now",
  "uuid",
  "struuid",
  "md5",
  "sha1",
  "sha256",
  "sha384",
  "sha512",
  "coalesce",
  "if",
  "strlang",
  "strdt",
  "isnumeric",
  "regex",
  "exists",
  "isblank",
  "isliteral",
  "a",
  "bind"
]);
var keywords$b = wordRegexp$5([
  "base",
  "prefix",
  "select",
  "distinct",
  "reduced",
  "construct",
  "describe",
  "ask",
  "from",
  "named",
  "where",
  "order",
  "limit",
  "offset",
  "filter",
  "optional",
  "graph",
  "by",
  "asc",
  "desc",
  "as",
  "having",
  "undef",
  "values",
  "group",
  "minus",
  "in",
  "not",
  "service",
  "silent",
  "using",
  "insert",
  "delete",
  "union",
  "true",
  "false",
  "with",
  "data",
  "copy",
  "to",
  "move",
  "add",
  "create",
  "drop",
  "clear",
  "load",
  "into"
]);
var operatorChars$1 = /[*+\-<>=&|\^\/!\?]/;
var PN_CHARS = "[A-Za-z_\\-0-9]";
var PREFIX_START = new RegExp("[A-Za-z]");
var PREFIX_REMAINDER = new RegExp("((" + PN_CHARS + "|\\.)*(" + PN_CHARS + "))?:");
function tokenBase$d(stream, state) {
  var ch2 = stream.next();
  curPunc$4 = null;
  if (ch2 == "$" || ch2 == "?") {
    if (ch2 == "?" && stream.match(/\s/, false)) {
      return "operator";
    }
    stream.match(/^[A-Za-z0-9_\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][A-Za-z0-9_\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]*/);
    return "variableName.local";
  } else if (ch2 == "<" && !stream.match(/^[\s\u00a0=]/, false)) {
    stream.match(/^[^\s\u00a0>]*>?/);
    return "atom";
  } else if (ch2 == '"' || ch2 == "'") {
    state.tokenize = tokenLiteral$1(ch2);
    return state.tokenize(stream, state);
  } else if (/[{}\(\),\.;\[\]]/.test(ch2)) {
    curPunc$4 = ch2;
    return "bracket";
  } else if (ch2 == "#") {
    stream.skipToEnd();
    return "comment";
  } else if (operatorChars$1.test(ch2)) {
    return "operator";
  } else if (ch2 == ":") {
    eatPnLocal(stream);
    return "atom";
  } else if (ch2 == "@") {
    stream.eatWhile(/[a-z\d\-]/i);
    return "meta";
  } else if (PREFIX_START.test(ch2) && stream.match(PREFIX_REMAINDER)) {
    eatPnLocal(stream);
    return "atom";
  }
  stream.eatWhile(/[_\w\d]/);
  var word = stream.current();
  if (ops.test(word))
    return "builtin";
  else if (keywords$b.test(word))
    return "keyword";
  else
    return "variable";
}
function eatPnLocal(stream) {
  stream.match(/(\.(?=[\w_\-\\%])|[:\w_-]|\\[-\\_~.!$&'()*+,;=/?#@%]|%[a-f\d][a-f\d])+/i);
}
function tokenLiteral$1(quote2) {
  return function(stream, state) {
    var escaped = false, ch2;
    while ((ch2 = stream.next()) != null) {
      if (ch2 == quote2 && !escaped) {
        state.tokenize = tokenBase$d;
        break;
      }
      escaped = !escaped && ch2 == "\\";
    }
    return "string";
  };
}
function pushContext$7(state, type2, col) {
  state.context = { prev: state.context, indent: state.indent, col, type: type2 };
}
function popContext$7(state) {
  state.indent = state.context.indent;
  state.context = state.context.prev;
}
const sparql = {
  name: "sparql",
  startState: function() {
    return {
      tokenize: tokenBase$d,
      context: null,
      indent: 0,
      col: 0
    };
  },
  token: function(stream, state) {
    if (stream.sol()) {
      if (state.context && state.context.align == null) state.context.align = false;
      state.indent = stream.indentation();
    }
    if (stream.eatSpace()) return null;
    var style2 = state.tokenize(stream, state);
    if (style2 != "comment" && state.context && state.context.align == null && state.context.type != "pattern") {
      state.context.align = true;
    }
    if (curPunc$4 == "(") pushContext$7(state, ")", stream.column());
    else if (curPunc$4 == "[") pushContext$7(state, "]", stream.column());
    else if (curPunc$4 == "{") pushContext$7(state, "}", stream.column());
    else if (/[\]\}\)]/.test(curPunc$4)) {
      while (state.context && state.context.type == "pattern") popContext$7(state);
      if (state.context && curPunc$4 == state.context.type) {
        popContext$7(state);
        if (curPunc$4 == "}" && state.context && state.context.type == "pattern")
          popContext$7(state);
      }
    } else if (curPunc$4 == "." && state.context && state.context.type == "pattern") popContext$7(state);
    else if (/atom|string|variable/.test(style2) && state.context) {
      if (/[\}\]]/.test(state.context.type))
        pushContext$7(state, "pattern", stream.column());
      else if (state.context.type == "pattern" && !state.context.align) {
        state.context.align = true;
        state.context.col = stream.column();
      }
    }
    return style2;
  },
  indent: function(state, textAfter, cx2) {
    var firstChar = textAfter && textAfter.charAt(0);
    var context = state.context;
    if (/[\]\}]/.test(firstChar))
      while (context && context.type == "pattern") context = context.prev;
    var closing2 = context && firstChar == context.type;
    if (!context)
      return 0;
    else if (context.type == "pattern")
      return context.col;
    else if (context.align)
      return context.col + (closing2 ? 0 : 1);
    else
      return context.indent + (closing2 ? 0 : cx2.unit);
  },
  languageData: {
    commentTokens: { line: "#" }
  }
};
const sparql$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  sparql
});
const spreadsheet = {
  name: "spreadsheet",
  startState: function() {
    return {
      stringType: null,
      stack: []
    };
  },
  token: function(stream, state) {
    if (!stream) return;
    if (state.stack.length === 0) {
      if (stream.peek() == '"' || stream.peek() == "'") {
        state.stringType = stream.peek();
        stream.next();
        state.stack.unshift("string");
      }
    }
    switch (state.stack[0]) {
      case "string":
        while (state.stack[0] === "string" && !stream.eol()) {
          if (stream.peek() === state.stringType) {
            stream.next();
            state.stack.shift();
          } else if (stream.peek() === "\\") {
            stream.next();
            stream.next();
          } else {
            stream.match(/^.[^\\\"\']*/);
          }
        }
        return "string";
      case "characterClass":
        while (state.stack[0] === "characterClass" && !stream.eol()) {
          if (!(stream.match(/^[^\]\\]+/) || stream.match(/^\\./)))
            state.stack.shift();
        }
        return "operator";
    }
    var peek = stream.peek();
    switch (peek) {
      case "[":
        stream.next();
        state.stack.unshift("characterClass");
        return "bracket";
      case ":":
        stream.next();
        return "operator";
      case "\\":
        if (stream.match(/\\[a-z]+/)) return "string.special";
        else {
          stream.next();
          return "atom";
        }
      case ".":
      case ",":
      case ";":
      case "*":
      case "-":
      case "+":
      case "^":
      case "<":
      case "/":
      case "=":
        stream.next();
        return "atom";
      case "$":
        stream.next();
        return "builtin";
    }
    if (stream.match(/\d+/)) {
      if (stream.match(/^\w+/)) return "error";
      return "number";
    } else if (stream.match(/^[a-zA-Z_]\w*/)) {
      if (stream.match(/(?=[\(.])/, false)) return "keyword";
      return "variable";
    } else if (["[", "]", "(", ")", "{", "}"].indexOf(peek) != -1) {
      stream.next();
      return "bracket";
    } else if (!stream.eatSpace()) {
      stream.next();
    }
    return null;
  }
};
const spreadsheet$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  spreadsheet
});
var tagKeywords_ = ["a", "abbr", "address", "area", "article", "aside", "audio", "b", "base", "bdi", "bdo", "bgsound", "blockquote", "body", "br", "button", "canvas", "caption", "cite", "code", "col", "colgroup", "data", "datalist", "dd", "del", "details", "dfn", "div", "dl", "dt", "em", "embed", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "iframe", "img", "input", "ins", "kbd", "keygen", "label", "legend", "li", "link", "main", "map", "mark", "marquee", "menu", "menuitem", "meta", "meter", "nav", "nobr", "noframes", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "script", "section", "select", "small", "source", "span", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "u", "ul", "var", "video"];
var documentTypes_ = ["domain", "regexp", "url-prefix", "url"];
var mediaTypes_ = ["all", "aural", "braille", "handheld", "print", "projection", "screen", "tty", "tv", "embossed"];
var mediaFeatures_ = ["width", "min-width", "max-width", "height", "min-height", "max-height", "device-width", "min-device-width", "max-device-width", "device-height", "min-device-height", "max-device-height", "aspect-ratio", "min-aspect-ratio", "max-aspect-ratio", "device-aspect-ratio", "min-device-aspect-ratio", "max-device-aspect-ratio", "color", "min-color", "max-color", "color-index", "min-color-index", "max-color-index", "monochrome", "min-monochrome", "max-monochrome", "resolution", "min-resolution", "max-resolution", "scan", "grid", "dynamic-range", "video-dynamic-range"];
var propertyKeywords_ = ["align-content", "align-items", "align-self", "alignment-adjust", "alignment-baseline", "anchor-point", "animation", "animation-delay", "animation-direction", "animation-duration", "animation-fill-mode", "animation-iteration-count", "animation-name", "animation-play-state", "animation-timing-function", "appearance", "azimuth", "backface-visibility", "background", "background-attachment", "background-clip", "background-color", "background-image", "background-origin", "background-position", "background-repeat", "background-size", "baseline-shift", "binding", "bleed", "bookmark-label", "bookmark-level", "bookmark-state", "bookmark-target", "border", "border-bottom", "border-bottom-color", "border-bottom-left-radius", "border-bottom-right-radius", "border-bottom-style", "border-bottom-width", "border-collapse", "border-color", "border-image", "border-image-outset", "border-image-repeat", "border-image-slice", "border-image-source", "border-image-width", "border-left", "border-left-color", "border-left-style", "border-left-width", "border-radius", "border-right", "border-right-color", "border-right-style", "border-right-width", "border-spacing", "border-style", "border-top", "border-top-color", "border-top-left-radius", "border-top-right-radius", "border-top-style", "border-top-width", "border-width", "bottom", "box-decoration-break", "box-shadow", "box-sizing", "break-after", "break-before", "break-inside", "caption-side", "clear", "clip", "color", "color-profile", "column-count", "column-fill", "column-gap", "column-rule", "column-rule-color", "column-rule-style", "column-rule-width", "column-span", "column-width", "columns", "content", "counter-increment", "counter-reset", "crop", "cue", "cue-after", "cue-before", "cursor", "direction", "display", "dominant-baseline", "drop-initial-after-adjust", "drop-initial-after-align", "drop-initial-before-adjust", "drop-initial-before-align", "drop-initial-size", "drop-initial-value", "elevation", "empty-cells", "fit", "fit-position", "flex", "flex-basis", "flex-direction", "flex-flow", "flex-grow", "flex-shrink", "flex-wrap", "float", "float-offset", "flow-from", "flow-into", "font", "font-feature-settings", "font-family", "font-kerning", "font-language-override", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-synthesis", "font-variant", "font-variant-alternates", "font-variant-caps", "font-variant-east-asian", "font-variant-ligatures", "font-variant-numeric", "font-variant-position", "font-weight", "grid", "grid-area", "grid-auto-columns", "grid-auto-flow", "grid-auto-position", "grid-auto-rows", "grid-column", "grid-column-end", "grid-column-start", "grid-row", "grid-row-end", "grid-row-start", "grid-template", "grid-template-areas", "grid-template-columns", "grid-template-rows", "hanging-punctuation", "height", "hyphens", "icon", "image-orientation", "image-rendering", "image-resolution", "inline-box-align", "justify-content", "left", "letter-spacing", "line-break", "line-height", "line-stacking", "line-stacking-ruby", "line-stacking-shift", "line-stacking-strategy", "list-style", "list-style-image", "list-style-position", "list-style-type", "margin", "margin-bottom", "margin-left", "margin-right", "margin-top", "marker-offset", "marks", "marquee-direction", "marquee-loop", "marquee-play-count", "marquee-speed", "marquee-style", "max-height", "max-width", "min-height", "min-width", "move-to", "nav-down", "nav-index", "nav-left", "nav-right", "nav-up", "object-fit", "object-position", "opacity", "order", "orphans", "outline", "outline-color", "outline-offset", "outline-style", "outline-width", "overflow", "overflow-style", "overflow-wrap", "overflow-x", "overflow-y", "padding", "padding-bottom", "padding-left", "padding-right", "padding-top", "page", "page-break-after", "page-break-before", "page-break-inside", "page-policy", "pause", "pause-after", "pause-before", "perspective", "perspective-origin", "pitch", "pitch-range", "play-during", "position", "presentation-level", "punctuation-trim", "quotes", "region-break-after", "region-break-before", "region-break-inside", "region-fragment", "rendering-intent", "resize", "rest", "rest-after", "rest-before", "richness", "right", "rotation", "rotation-point", "ruby-align", "ruby-overhang", "ruby-position", "ruby-span", "shape-image-threshold", "shape-inside", "shape-margin", "shape-outside", "size", "speak", "speak-as", "speak-header", "speak-numeral", "speak-punctuation", "speech-rate", "stress", "string-set", "tab-size", "table-layout", "target", "target-name", "target-new", "target-position", "text-align", "text-align-last", "text-decoration", "text-decoration-color", "text-decoration-line", "text-decoration-skip", "text-decoration-style", "text-emphasis", "text-emphasis-color", "text-emphasis-position", "text-emphasis-style", "text-height", "text-indent", "text-justify", "text-outline", "text-overflow", "text-shadow", "text-size-adjust", "text-space-collapse", "text-transform", "text-underline-position", "text-wrap", "top", "transform", "transform-origin", "transform-style", "transition", "transition-delay", "transition-duration", "transition-property", "transition-timing-function", "unicode-bidi", "vertical-align", "visibility", "voice-balance", "voice-duration", "voice-family", "voice-pitch", "voice-range", "voice-rate", "voice-stress", "voice-volume", "volume", "white-space", "widows", "width", "will-change", "word-break", "word-spacing", "word-wrap", "z-index", "clip-path", "clip-rule", "mask", "enable-background", "filter", "flood-color", "flood-opacity", "lighting-color", "stop-color", "stop-opacity", "pointer-events", "color-interpolation", "color-interpolation-filters", "color-rendering", "fill", "fill-opacity", "fill-rule", "image-rendering", "marker", "marker-end", "marker-mid", "marker-start", "shape-rendering", "stroke", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "text-rendering", "baseline-shift", "dominant-baseline", "glyph-orientation-horizontal", "glyph-orientation-vertical", "text-anchor", "writing-mode", "font-smoothing", "osx-font-smoothing"];
var nonStandardPropertyKeywords_ = ["scrollbar-arrow-color", "scrollbar-base-color", "scrollbar-dark-shadow-color", "scrollbar-face-color", "scrollbar-highlight-color", "scrollbar-shadow-color", "scrollbar-3d-light-color", "scrollbar-track-color", "shape-inside", "searchfield-cancel-button", "searchfield-decoration", "searchfield-results-button", "searchfield-results-decoration", "zoom"];
var fontProperties_ = ["font-family", "src", "unicode-range", "font-variant", "font-feature-settings", "font-stretch", "font-weight", "font-style"];
var colorKeywords_ = ["aliceblue", "antiquewhite", "aqua", "aquamarine", "azure", "beige", "bisque", "black", "blanchedalmond", "blue", "blueviolet", "brown", "burlywood", "cadetblue", "chartreuse", "chocolate", "coral", "cornflowerblue", "cornsilk", "crimson", "cyan", "darkblue", "darkcyan", "darkgoldenrod", "darkgray", "darkgreen", "darkkhaki", "darkmagenta", "darkolivegreen", "darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue", "darkslategray", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgray", "dodgerblue", "firebrick", "floralwhite", "forestgreen", "fuchsia", "gainsboro", "ghostwhite", "gold", "goldenrod", "gray", "grey", "green", "greenyellow", "honeydew", "hotpink", "indianred", "indigo", "ivory", "khaki", "lavender", "lavenderblush", "lawngreen", "lemonchiffon", "lightblue", "lightcoral", "lightcyan", "lightgoldenrodyellow", "lightgray", "lightgreen", "lightpink", "lightsalmon", "lightseagreen", "lightskyblue", "lightslategray", "lightsteelblue", "lightyellow", "lime", "limegreen", "linen", "magenta", "maroon", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen", "mediumslateblue", "mediumspringgreen", "mediumturquoise", "mediumvioletred", "midnightblue", "mintcream", "mistyrose", "moccasin", "navajowhite", "navy", "oldlace", "olive", "olivedrab", "orange", "orangered", "orchid", "palegoldenrod", "palegreen", "paleturquoise", "palevioletred", "papayawhip", "peachpuff", "peru", "pink", "plum", "powderblue", "purple", "rebeccapurple", "red", "rosybrown", "royalblue", "saddlebrown", "salmon", "sandybrown", "seagreen", "seashell", "sienna", "silver", "skyblue", "slateblue", "slategray", "snow", "springgreen", "steelblue", "tan", "teal", "thistle", "tomato", "turquoise", "violet", "wheat", "white", "whitesmoke", "yellow", "yellowgreen"];
var valueKeywords_ = ["above", "absolute", "activeborder", "additive", "activecaption", "afar", "after-white-space", "ahead", "alias", "all", "all-scroll", "alphabetic", "alternate", "always", "amharic", "amharic-abegede", "antialiased", "appworkspace", "arabic-indic", "armenian", "asterisks", "attr", "auto", "avoid", "avoid-column", "avoid-page", "avoid-region", "background", "backwards", "baseline", "below", "bidi-override", "binary", "bengali", "blink", "block", "block-axis", "bold", "bolder", "border", "border-box", "both", "bottom", "break", "break-all", "break-word", "bullets", "button", "buttonface", "buttonhighlight", "buttonshadow", "buttontext", "calc", "cambodian", "capitalize", "caps-lock-indicator", "caption", "captiontext", "caret", "cell", "center", "checkbox", "circle", "cjk-decimal", "cjk-earthly-branch", "cjk-heavenly-stem", "cjk-ideographic", "clear", "clip", "close-quote", "col-resize", "collapse", "column", "compact", "condensed", "conic-gradient", "contain", "content", "contents", "content-box", "context-menu", "continuous", "copy", "counter", "counters", "cover", "crop", "cross", "crosshair", "currentcolor", "cursive", "cyclic", "dashed", "decimal", "decimal-leading-zero", "default", "default-button", "destination-atop", "destination-in", "destination-out", "destination-over", "devanagari", "disc", "discard", "disclosure-closed", "disclosure-open", "document", "dot-dash", "dot-dot-dash", "dotted", "double", "down", "e-resize", "ease", "ease-in", "ease-in-out", "ease-out", "element", "ellipse", "ellipsis", "embed", "end", "ethiopic", "ethiopic-abegede", "ethiopic-abegede-am-et", "ethiopic-abegede-gez", "ethiopic-abegede-ti-er", "ethiopic-abegede-ti-et", "ethiopic-halehame-aa-er", "ethiopic-halehame-aa-et", "ethiopic-halehame-am-et", "ethiopic-halehame-gez", "ethiopic-halehame-om-et", "ethiopic-halehame-sid-et", "ethiopic-halehame-so-et", "ethiopic-halehame-ti-er", "ethiopic-halehame-ti-et", "ethiopic-halehame-tig", "ethiopic-numeric", "ew-resize", "expanded", "extends", "extra-condensed", "extra-expanded", "fantasy", "fast", "fill", "fixed", "flat", "flex", "footnotes", "forwards", "from", "geometricPrecision", "georgian", "graytext", "groove", "gujarati", "gurmukhi", "hand", "hangul", "hangul-consonant", "hebrew", "help", "hidden", "hide", "high", "higher", "highlight", "highlighttext", "hiragana", "hiragana-iroha", "horizontal", "hsl", "hsla", "icon", "ignore", "inactiveborder", "inactivecaption", "inactivecaptiontext", "infinite", "infobackground", "infotext", "inherit", "initial", "inline", "inline-axis", "inline-block", "inline-flex", "inline-table", "inset", "inside", "intrinsic", "invert", "italic", "japanese-formal", "japanese-informal", "justify", "kannada", "katakana", "katakana-iroha", "keep-all", "khmer", "korean-hangul-formal", "korean-hanja-formal", "korean-hanja-informal", "landscape", "lao", "large", "larger", "left", "level", "lighter", "line-through", "linear", "linear-gradient", "lines", "list-item", "listbox", "listitem", "local", "logical", "loud", "lower", "lower-alpha", "lower-armenian", "lower-greek", "lower-hexadecimal", "lower-latin", "lower-norwegian", "lower-roman", "lowercase", "ltr", "malayalam", "match", "matrix", "matrix3d", "media-play-button", "media-slider", "media-sliderthumb", "media-volume-slider", "media-volume-sliderthumb", "medium", "menu", "menulist", "menulist-button", "menutext", "message-box", "middle", "min-intrinsic", "mix", "mongolian", "monospace", "move", "multiple", "myanmar", "n-resize", "narrower", "ne-resize", "nesw-resize", "no-close-quote", "no-drop", "no-open-quote", "no-repeat", "none", "normal", "not-allowed", "nowrap", "ns-resize", "numbers", "numeric", "nw-resize", "nwse-resize", "oblique", "octal", "open-quote", "optimizeLegibility", "optimizeSpeed", "oriya", "oromo", "outset", "outside", "outside-shape", "overlay", "overline", "padding", "padding-box", "painted", "page", "paused", "persian", "perspective", "plus-darker", "plus-lighter", "pointer", "polygon", "portrait", "pre", "pre-line", "pre-wrap", "preserve-3d", "progress", "push-button", "radial-gradient", "radio", "read-only", "read-write", "read-write-plaintext-only", "rectangle", "region", "relative", "repeat", "repeating-linear-gradient", "repeating-radial-gradient", "repeating-conic-gradient", "repeat-x", "repeat-y", "reset", "reverse", "rgb", "rgba", "ridge", "right", "rotate", "rotate3d", "rotateX", "rotateY", "rotateZ", "round", "row-resize", "rtl", "run-in", "running", "s-resize", "sans-serif", "scale", "scale3d", "scaleX", "scaleY", "scaleZ", "scroll", "scrollbar", "scroll-position", "se-resize", "searchfield", "searchfield-cancel-button", "searchfield-decoration", "searchfield-results-button", "searchfield-results-decoration", "semi-condensed", "semi-expanded", "separate", "serif", "show", "sidama", "simp-chinese-formal", "simp-chinese-informal", "single", "skew", "skewX", "skewY", "skip-white-space", "slide", "slider-horizontal", "slider-vertical", "sliderthumb-horizontal", "sliderthumb-vertical", "slow", "small", "small-caps", "small-caption", "smaller", "solid", "somali", "source-atop", "source-in", "source-out", "source-over", "space", "spell-out", "square", "square-button", "standard", "start", "static", "status-bar", "stretch", "stroke", "sub", "subpixel-antialiased", "super", "sw-resize", "symbolic", "symbols", "table", "table-caption", "table-cell", "table-column", "table-column-group", "table-footer-group", "table-header-group", "table-row", "table-row-group", "tamil", "telugu", "text", "text-bottom", "text-top", "textarea", "textfield", "thai", "thick", "thin", "threeddarkshadow", "threedface", "threedhighlight", "threedlightshadow", "threedshadow", "tibetan", "tigre", "tigrinya-er", "tigrinya-er-abegede", "tigrinya-et", "tigrinya-et-abegede", "to", "top", "trad-chinese-formal", "trad-chinese-informal", "translate", "translate3d", "translateX", "translateY", "translateZ", "transparent", "ultra-condensed", "ultra-expanded", "underline", "up", "upper-alpha", "upper-armenian", "upper-greek", "upper-hexadecimal", "upper-latin", "upper-norwegian", "upper-roman", "uppercase", "urdu", "url", "var", "vertical", "vertical-text", "visible", "visibleFill", "visiblePainted", "visibleStroke", "visual", "w-resize", "wait", "wave", "wider", "window", "windowframe", "windowtext", "words", "x-large", "x-small", "xor", "xx-large", "xx-small", "bicubic", "optimizespeed", "grayscale", "row", "row-reverse", "wrap", "wrap-reverse", "column-reverse", "flex-start", "flex-end", "space-between", "space-around", "unset"];
var wordOperatorKeywords_ = ["in", "and", "or", "not", "is not", "is a", "is", "isnt", "defined", "if unless"], blockKeywords_ = ["for", "if", "else", "unless", "from", "to"], commonAtoms_ = ["null", "true", "false", "href", "title", "type", "not-allowed", "readonly", "disabled"], commonDef_ = ["@font-face", "@keyframes", "@media", "@viewport", "@page", "@host", "@supports", "@block", "@css"];
var hintWords = tagKeywords_.concat(
  documentTypes_,
  mediaTypes_,
  mediaFeatures_,
  propertyKeywords_,
  nonStandardPropertyKeywords_,
  colorKeywords_,
  valueKeywords_,
  fontProperties_,
  wordOperatorKeywords_,
  blockKeywords_,
  commonAtoms_,
  commonDef_
);
function wordRegexp$4(words2) {
  words2 = words2.sort(function(a, b) {
    return b > a;
  });
  return new RegExp("^((" + words2.join(")|(") + "))\\b");
}
function keySet(array) {
  var keys = {};
  for (var i2 = 0; i2 < array.length; ++i2) keys[array[i2]] = true;
  return keys;
}
function escapeRegExp(text2) {
  return text2.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
var tagKeywords = keySet(tagKeywords_), tagVariablesRegexp = /^(a|b|i|s|col|em)$/i, propertyKeywords = keySet(propertyKeywords_), nonStandardPropertyKeywords = keySet(nonStandardPropertyKeywords_), valueKeywords = keySet(valueKeywords_), colorKeywords = keySet(colorKeywords_), documentTypes = keySet(documentTypes_), documentTypesRegexp = wordRegexp$4(documentTypes_), mediaFeatures = keySet(mediaFeatures_), mediaTypes = keySet(mediaTypes_), fontProperties = keySet(fontProperties_), operatorsRegexp = /^\s*([.]{2,3}|&&|\|\||\*\*|[?!=:]?=|[-+*\/%<>]=?|\?:|\~)/, wordOperatorKeywordsRegexp = wordRegexp$4(wordOperatorKeywords_), blockKeywords$1 = keySet(blockKeywords_), vendorPrefixesRegexp = new RegExp(/^\-(moz|ms|o|webkit)-/i), commonAtoms = keySet(commonAtoms_), firstWordMatch = "", states = {}, ch, style, type$1, override;
function tokenBase$c(stream, state) {
  firstWordMatch = stream.string.match(/(^[\w-]+\s*=\s*$)|(^\s*[\w-]+\s*=\s*[\w-])|(^\s*(\.|#|@|\$|\&|\[|\d|\+|::?|\{|\>|~|\/)?\s*[\w-]*([a-z0-9-]|\*|\/\*)(\(|,)?)/);
  state.context.line.firstWord = firstWordMatch ? firstWordMatch[0].replace(/^\s*/, "") : "";
  state.context.line.indent = stream.indentation();
  ch = stream.peek();
  if (stream.match("//")) {
    stream.skipToEnd();
    return ["comment", "comment"];
  }
  if (stream.match("/*")) {
    state.tokenize = tokenCComment;
    return tokenCComment(stream, state);
  }
  if (ch == '"' || ch == "'") {
    stream.next();
    state.tokenize = tokenString$8(ch);
    return state.tokenize(stream, state);
  }
  if (ch == "@") {
    stream.next();
    stream.eatWhile(/[\w\\-]/);
    return ["def", stream.current()];
  }
  if (ch == "#") {
    stream.next();
    if (stream.match(/^[0-9a-f]{3}([0-9a-f]([0-9a-f]{2}){0,2})?\b(?!-)/i)) {
      return ["atom", "atom"];
    }
    if (stream.match(/^[a-z][\w-]*/i)) {
      return ["builtin", "hash"];
    }
  }
  if (stream.match(vendorPrefixesRegexp)) {
    return ["meta", "vendor-prefixes"];
  }
  if (stream.match(/^-?[0-9]?\.?[0-9]/)) {
    stream.eatWhile(/[a-z%]/i);
    return ["number", "unit"];
  }
  if (ch == "!") {
    stream.next();
    return [stream.match(/^(important|optional)/i) ? "keyword" : "operator", "important"];
  }
  if (ch == "." && stream.match(/^\.[a-z][\w-]*/i)) {
    return ["qualifier", "qualifier"];
  }
  if (stream.match(documentTypesRegexp)) {
    if (stream.peek() == "(") state.tokenize = tokenParenthesized;
    return ["property", "word"];
  }
  if (stream.match(/^[a-z][\w-]*\(/i)) {
    stream.backUp(1);
    return ["keyword", "mixin"];
  }
  if (stream.match(/^(\+|-)[a-z][\w-]*\(/i)) {
    stream.backUp(1);
    return ["keyword", "block-mixin"];
  }
  if (stream.string.match(/^\s*&/) && stream.match(/^[-_]+[a-z][\w-]*/)) {
    return ["qualifier", "qualifier"];
  }
  if (stream.match(/^(\/|&)(-|_|:|\.|#|[a-z])/)) {
    stream.backUp(1);
    return ["variableName.special", "reference"];
  }
  if (stream.match(/^&{1}\s*$/)) {
    return ["variableName.special", "reference"];
  }
  if (stream.match(wordOperatorKeywordsRegexp)) {
    return ["operator", "operator"];
  }
  if (stream.match(/^\$?[-_]*[a-z0-9]+[\w-]*/i)) {
    if (stream.match(/^(\.|\[)[\w-\'\"\]]+/i, false)) {
      if (!wordIsTag(stream.current())) {
        stream.match(".");
        return ["variable", "variable-name"];
      }
    }
    return ["variable", "word"];
  }
  if (stream.match(operatorsRegexp)) {
    return ["operator", stream.current()];
  }
  if (/[:;,{}\[\]\(\)]/.test(ch)) {
    stream.next();
    return [null, ch];
  }
  stream.next();
  return [null, null];
}
function tokenCComment(stream, state) {
  var maybeEnd = false, ch2;
  while ((ch2 = stream.next()) != null) {
    if (maybeEnd && ch2 == "/") {
      state.tokenize = null;
      break;
    }
    maybeEnd = ch2 == "*";
  }
  return ["comment", "comment"];
}
function tokenString$8(quote2) {
  return function(stream, state) {
    var escaped = false, ch2;
    while ((ch2 = stream.next()) != null) {
      if (ch2 == quote2 && !escaped) {
        if (quote2 == ")") stream.backUp(1);
        break;
      }
      escaped = !escaped && ch2 == "\\";
    }
    if (ch2 == quote2 || !escaped && quote2 != ")") state.tokenize = null;
    return ["string", "string"];
  };
}
function tokenParenthesized(stream, state) {
  stream.next();
  if (!stream.match(/\s*[\"\')]/, false))
    state.tokenize = tokenString$8(")");
  else
    state.tokenize = null;
  return [null, "("];
}
function Context$4(type2, indent2, prev, line) {
  this.type = type2;
  this.indent = indent2;
  this.prev = prev;
  this.line = line || { firstWord: "", indent: 0 };
}
function pushContext$6(state, stream, type2, indent2) {
  indent2 = indent2 >= 0 ? indent2 : stream.indentUnit;
  state.context = new Context$4(type2, stream.indentation() + indent2, state.context);
  return type2;
}
function popContext$6(state, stream, currentIndent) {
  var contextIndent = state.context.indent - stream.indentUnit;
  currentIndent = currentIndent || false;
  state.context = state.context.prev;
  if (currentIndent) state.context.indent = contextIndent;
  return state.context.type;
}
function pass$1(type2, stream, state) {
  return states[state.context.type](type2, stream, state);
}
function popAndPass(type2, stream, state, n) {
  for (var i2 = 1; i2 > 0; i2--)
    state.context = state.context.prev;
  return pass$1(type2, stream, state);
}
function wordIsTag(word) {
  return word.toLowerCase() in tagKeywords;
}
function wordIsProperty(word) {
  word = word.toLowerCase();
  return word in propertyKeywords || word in fontProperties;
}
function wordIsBlock(word) {
  return word.toLowerCase() in blockKeywords$1;
}
function wordIsVendorPrefix(word) {
  return word.toLowerCase().match(vendorPrefixesRegexp);
}
function wordAsValue(word) {
  var wordLC = word.toLowerCase();
  var override2 = "variable";
  if (wordIsTag(word)) override2 = "tag";
  else if (wordIsBlock(word)) override2 = "block-keyword";
  else if (wordIsProperty(word)) override2 = "property";
  else if (wordLC in valueKeywords || wordLC in commonAtoms) override2 = "atom";
  else if (wordLC == "return" || wordLC in colorKeywords) override2 = "keyword";
  else if (word.match(/^[A-Z]/)) override2 = "string";
  return override2;
}
function typeIsBlock(type2, stream) {
  return endOfLine(stream) && (type2 == "{" || type2 == "]" || type2 == "hash" || type2 == "qualifier") || type2 == "block-mixin";
}
function typeIsInterpolation(type2, stream) {
  return type2 == "{" && stream.match(/^\s*\$?[\w-]+/i, false);
}
function typeIsPseudo(type2, stream) {
  return type2 == ":" && stream.match(/^[a-z-]+/, false);
}
function startOfLine(stream) {
  return stream.sol() || stream.string.match(new RegExp("^\\s*" + escapeRegExp(stream.current())));
}
function endOfLine(stream) {
  return stream.eol() || stream.match(/^\s*$/, false);
}
function firstWordOfLine(line) {
  var re = /^\s*[-_]*[a-z0-9]+[\w-]*/i;
  var result = typeof line == "string" ? line.match(re) : line.string.match(re);
  return result ? result[0].replace(/^\s*/, "") : "";
}
states.block = function(type2, stream, state) {
  if (type2 == "comment" && startOfLine(stream) || type2 == "," && endOfLine(stream) || type2 == "mixin") {
    return pushContext$6(state, stream, "block", 0);
  }
  if (typeIsInterpolation(type2, stream)) {
    return pushContext$6(state, stream, "interpolation");
  }
  if (endOfLine(stream) && type2 == "]") {
    if (!/^\s*(\.|#|:|\[|\*|&)/.test(stream.string) && !wordIsTag(firstWordOfLine(stream))) {
      return pushContext$6(state, stream, "block", 0);
    }
  }
  if (typeIsBlock(type2, stream)) {
    return pushContext$6(state, stream, "block");
  }
  if (type2 == "}" && endOfLine(stream)) {
    return pushContext$6(state, stream, "block", 0);
  }
  if (type2 == "variable-name") {
    if (stream.string.match(/^\s?\$[\w-\.\[\]\'\"]+$/) || wordIsBlock(firstWordOfLine(stream))) {
      return pushContext$6(state, stream, "variableName");
    } else {
      return pushContext$6(state, stream, "variableName", 0);
    }
  }
  if (type2 == "=") {
    if (!endOfLine(stream) && !wordIsBlock(firstWordOfLine(stream))) {
      return pushContext$6(state, stream, "block", 0);
    }
    return pushContext$6(state, stream, "block");
  }
  if (type2 == "*") {
    if (endOfLine(stream) || stream.match(/\s*(,|\.|#|\[|:|{)/, false)) {
      override = "tag";
      return pushContext$6(state, stream, "block");
    }
  }
  if (typeIsPseudo(type2, stream)) {
    return pushContext$6(state, stream, "pseudo");
  }
  if (/@(font-face|media|supports|(-moz-)?document)/.test(type2)) {
    return pushContext$6(state, stream, endOfLine(stream) ? "block" : "atBlock");
  }
  if (/@(-(moz|ms|o|webkit)-)?keyframes$/.test(type2)) {
    return pushContext$6(state, stream, "keyframes");
  }
  if (/@extends?/.test(type2)) {
    return pushContext$6(state, stream, "extend", 0);
  }
  if (type2 && type2.charAt(0) == "@") {
    if (stream.indentation() > 0 && wordIsProperty(stream.current().slice(1))) {
      override = "variable";
      return "block";
    }
    if (/(@import|@require|@charset)/.test(type2)) {
      return pushContext$6(state, stream, "block", 0);
    }
    return pushContext$6(state, stream, "block");
  }
  if (type2 == "reference" && endOfLine(stream)) {
    return pushContext$6(state, stream, "block");
  }
  if (type2 == "(") {
    return pushContext$6(state, stream, "parens");
  }
  if (type2 == "vendor-prefixes") {
    return pushContext$6(state, stream, "vendorPrefixes");
  }
  if (type2 == "word") {
    var word = stream.current();
    override = wordAsValue(word);
    if (override == "property") {
      if (startOfLine(stream)) {
        return pushContext$6(state, stream, "block", 0);
      } else {
        override = "atom";
        return "block";
      }
    }
    if (override == "tag") {
      if (/embed|menu|pre|progress|sub|table/.test(word)) {
        if (wordIsProperty(firstWordOfLine(stream))) {
          override = "atom";
          return "block";
        }
      }
      if (stream.string.match(new RegExp("\\[\\s*" + word + "|" + word + "\\s*\\]"))) {
        override = "atom";
        return "block";
      }
      if (tagVariablesRegexp.test(word)) {
        if (startOfLine(stream) && stream.string.match(/=/) || !startOfLine(stream) && !stream.string.match(/^(\s*\.|#|\&|\[|\/|>|\*)/) && !wordIsTag(firstWordOfLine(stream))) {
          override = "variable";
          if (wordIsBlock(firstWordOfLine(stream))) return "block";
          return pushContext$6(state, stream, "block", 0);
        }
      }
      if (endOfLine(stream)) return pushContext$6(state, stream, "block");
    }
    if (override == "block-keyword") {
      override = "keyword";
      if (stream.current(/(if|unless)/) && !startOfLine(stream)) {
        return "block";
      }
      return pushContext$6(state, stream, "block");
    }
    if (word == "return") return pushContext$6(state, stream, "block", 0);
    if (override == "variable" && stream.string.match(/^\s?\$[\w-\.\[\]\'\"]+$/)) {
      return pushContext$6(state, stream, "block");
    }
  }
  return state.context.type;
};
states.parens = function(type2, stream, state) {
  if (type2 == "(") return pushContext$6(state, stream, "parens");
  if (type2 == ")") {
    if (state.context.prev.type == "parens") {
      return popContext$6(state, stream);
    }
    if (stream.string.match(/^[a-z][\w-]*\(/i) && endOfLine(stream) || wordIsBlock(firstWordOfLine(stream)) || /(\.|#|:|\[|\*|&|>|~|\+|\/)/.test(firstWordOfLine(stream)) || !stream.string.match(/^-?[a-z][\w-\.\[\]\'\"]*\s*=/) && wordIsTag(firstWordOfLine(stream))) {
      return pushContext$6(state, stream, "block");
    }
    if (stream.string.match(/^[\$-]?[a-z][\w-\.\[\]\'\"]*\s*=/) || stream.string.match(/^\s*(\(|\)|[0-9])/) || stream.string.match(/^\s+[a-z][\w-]*\(/i) || stream.string.match(/^\s+[\$-]?[a-z]/i)) {
      return pushContext$6(state, stream, "block", 0);
    }
    if (endOfLine(stream)) return pushContext$6(state, stream, "block");
    else return pushContext$6(state, stream, "block", 0);
  }
  if (type2 && type2.charAt(0) == "@" && wordIsProperty(stream.current().slice(1))) {
    override = "variable";
  }
  if (type2 == "word") {
    var word = stream.current();
    override = wordAsValue(word);
    if (override == "tag" && tagVariablesRegexp.test(word)) {
      override = "variable";
    }
    if (override == "property" || word == "to") override = "atom";
  }
  if (type2 == "variable-name") {
    return pushContext$6(state, stream, "variableName");
  }
  if (typeIsPseudo(type2, stream)) {
    return pushContext$6(state, stream, "pseudo");
  }
  return state.context.type;
};
states.vendorPrefixes = function(type2, stream, state) {
  if (type2 == "word") {
    override = "property";
    return pushContext$6(state, stream, "block", 0);
  }
  return popContext$6(state, stream);
};
states.pseudo = function(type2, stream, state) {
  if (!wordIsProperty(firstWordOfLine(stream.string))) {
    stream.match(/^[a-z-]+/);
    override = "variableName.special";
    if (endOfLine(stream)) return pushContext$6(state, stream, "block");
    return popContext$6(state, stream);
  }
  return popAndPass(type2, stream, state);
};
states.atBlock = function(type2, stream, state) {
  if (type2 == "(") return pushContext$6(state, stream, "atBlock_parens");
  if (typeIsBlock(type2, stream)) {
    return pushContext$6(state, stream, "block");
  }
  if (typeIsInterpolation(type2, stream)) {
    return pushContext$6(state, stream, "interpolation");
  }
  if (type2 == "word") {
    var word = stream.current().toLowerCase();
    if (/^(only|not|and|or)$/.test(word))
      override = "keyword";
    else if (documentTypes.hasOwnProperty(word))
      override = "tag";
    else if (mediaTypes.hasOwnProperty(word))
      override = "attribute";
    else if (mediaFeatures.hasOwnProperty(word))
      override = "property";
    else if (nonStandardPropertyKeywords.hasOwnProperty(word))
      override = "string.special";
    else override = wordAsValue(stream.current());
    if (override == "tag" && endOfLine(stream)) {
      return pushContext$6(state, stream, "block");
    }
  }
  if (type2 == "operator" && /^(not|and|or)$/.test(stream.current())) {
    override = "keyword";
  }
  return state.context.type;
};
states.atBlock_parens = function(type2, stream, state) {
  if (type2 == "{" || type2 == "}") return state.context.type;
  if (type2 == ")") {
    if (endOfLine(stream)) return pushContext$6(state, stream, "block");
    else return pushContext$6(state, stream, "atBlock");
  }
  if (type2 == "word") {
    var word = stream.current().toLowerCase();
    override = wordAsValue(word);
    if (/^(max|min)/.test(word)) override = "property";
    if (override == "tag") {
      tagVariablesRegexp.test(word) ? override = "variable" : override = "atom";
    }
    return state.context.type;
  }
  return states.atBlock(type2, stream, state);
};
states.keyframes = function(type2, stream, state) {
  if (stream.indentation() == "0" && (type2 == "}" && startOfLine(stream) || type2 == "]" || type2 == "hash" || type2 == "qualifier" || wordIsTag(stream.current()))) {
    return popAndPass(type2, stream, state);
  }
  if (type2 == "{") return pushContext$6(state, stream, "keyframes");
  if (type2 == "}") {
    if (startOfLine(stream)) return popContext$6(state, stream, true);
    else return pushContext$6(state, stream, "keyframes");
  }
  if (type2 == "unit" && /^[0-9]+\%$/.test(stream.current())) {
    return pushContext$6(state, stream, "keyframes");
  }
  if (type2 == "word") {
    override = wordAsValue(stream.current());
    if (override == "block-keyword") {
      override = "keyword";
      return pushContext$6(state, stream, "keyframes");
    }
  }
  if (/@(font-face|media|supports|(-moz-)?document)/.test(type2)) {
    return pushContext$6(state, stream, endOfLine(stream) ? "block" : "atBlock");
  }
  if (type2 == "mixin") {
    return pushContext$6(state, stream, "block", 0);
  }
  return state.context.type;
};
states.interpolation = function(type2, stream, state) {
  if (type2 == "{") popContext$6(state, stream) && pushContext$6(state, stream, "block");
  if (type2 == "}") {
    if (stream.string.match(/^\s*(\.|#|:|\[|\*|&|>|~|\+|\/)/i) || stream.string.match(/^\s*[a-z]/i) && wordIsTag(firstWordOfLine(stream))) {
      return pushContext$6(state, stream, "block");
    }
    if (!stream.string.match(/^(\{|\s*\&)/) || stream.match(/\s*[\w-]/, false)) {
      return pushContext$6(state, stream, "block", 0);
    }
    return pushContext$6(state, stream, "block");
  }
  if (type2 == "variable-name") {
    return pushContext$6(state, stream, "variableName", 0);
  }
  if (type2 == "word") {
    override = wordAsValue(stream.current());
    if (override == "tag") override = "atom";
  }
  return state.context.type;
};
states.extend = function(type2, stream, state) {
  if (type2 == "[" || type2 == "=") return "extend";
  if (type2 == "]") return popContext$6(state, stream);
  if (type2 == "word") {
    override = wordAsValue(stream.current());
    return "extend";
  }
  return popContext$6(state, stream);
};
states.variableName = function(type2, stream, state) {
  if (type2 == "string" || type2 == "[" || type2 == "]" || stream.current().match(/^(\.|\$)/)) {
    if (stream.current().match(/^\.[\w-]+/i)) override = "variable";
    return "variableName";
  }
  return popAndPass(type2, stream, state);
};
const stylus = {
  name: "stylus",
  startState: function() {
    return {
      tokenize: null,
      state: "block",
      context: new Context$4("block", 0, null)
    };
  },
  token: function(stream, state) {
    if (!state.tokenize && stream.eatSpace()) return null;
    style = (state.tokenize || tokenBase$c)(stream, state);
    if (style && typeof style == "object") {
      type$1 = style[1];
      style = style[0];
    }
    override = style;
    state.state = states[state.state](type$1, stream, state);
    return override;
  },
  indent: function(state, textAfter, iCx) {
    var cx2 = state.context, ch2 = textAfter && textAfter.charAt(0), indent2 = cx2.indent, lineFirstWord = firstWordOfLine(textAfter), lineIndent = cx2.line.indent, prevLineFirstWord = state.context.prev ? state.context.prev.line.firstWord : "", prevLineIndent = state.context.prev ? state.context.prev.line.indent : lineIndent;
    if (cx2.prev && (ch2 == "}" && (cx2.type == "block" || cx2.type == "atBlock" || cx2.type == "keyframes") || ch2 == ")" && (cx2.type == "parens" || cx2.type == "atBlock_parens") || ch2 == "{" && cx2.type == "at")) {
      indent2 = cx2.indent - iCx.unit;
    } else if (!/(\})/.test(ch2)) {
      if (/@|\$|\d/.test(ch2) || /^\{/.test(textAfter) || /^\s*\/(\/|\*)/.test(textAfter) || /^\s*\/\*/.test(prevLineFirstWord) || /^\s*[\w-\.\[\]\'\"]+\s*(\?|:|\+)?=/i.test(textAfter) || /^(\+|-)?[a-z][\w-]*\(/i.test(textAfter) || /^return/.test(textAfter) || wordIsBlock(lineFirstWord)) {
        indent2 = lineIndent;
      } else if (/(\.|#|:|\[|\*|&|>|~|\+|\/)/.test(ch2) || wordIsTag(lineFirstWord)) {
        if (/\,\s*$/.test(prevLineFirstWord)) {
          indent2 = prevLineIndent;
        } else if (/(\.|#|:|\[|\*|&|>|~|\+|\/)/.test(prevLineFirstWord) || wordIsTag(prevLineFirstWord)) {
          indent2 = lineIndent <= prevLineIndent ? prevLineIndent : prevLineIndent + iCx.unit;
        } else {
          indent2 = lineIndent;
        }
      } else if (!/,\s*$/.test(textAfter) && (wordIsVendorPrefix(lineFirstWord) || wordIsProperty(lineFirstWord))) {
        if (wordIsBlock(prevLineFirstWord)) {
          indent2 = lineIndent <= prevLineIndent ? prevLineIndent : prevLineIndent + iCx.unit;
        } else if (/^\{/.test(prevLineFirstWord)) {
          indent2 = lineIndent <= prevLineIndent ? lineIndent : prevLineIndent + iCx.unit;
        } else if (wordIsVendorPrefix(prevLineFirstWord) || wordIsProperty(prevLineFirstWord)) {
          indent2 = lineIndent >= prevLineIndent ? prevLineIndent : lineIndent;
        } else if (/^(\.|#|:|\[|\*|&|@|\+|\-|>|~|\/)/.test(prevLineFirstWord) || /=\s*$/.test(prevLineFirstWord) || wordIsTag(prevLineFirstWord) || /^\$[\w-\.\[\]\'\"]/.test(prevLineFirstWord)) {
          indent2 = prevLineIndent + iCx.unit;
        } else {
          indent2 = lineIndent;
        }
      }
    }
    return indent2;
  },
  languageData: {
    indentOnInput: /^\s*\}$/,
    commentTokens: { line: "//", block: { open: "/*", close: "*/" } },
    autocomplete: hintWords
  }
};
const stylus$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  stylus
});
function wordSet(words2) {
  var set2 = {};
  for (var i2 = 0; i2 < words2.length; i2++) set2[words2[i2]] = true;
  return set2;
}
var keywords$a = wordSet([
  "_",
  "var",
  "let",
  "actor",
  "class",
  "enum",
  "extension",
  "import",
  "protocol",
  "struct",
  "func",
  "typealias",
  "associatedtype",
  "open",
  "public",
  "internal",
  "fileprivate",
  "private",
  "deinit",
  "init",
  "new",
  "override",
  "self",
  "subscript",
  "super",
  "convenience",
  "dynamic",
  "final",
  "indirect",
  "lazy",
  "required",
  "static",
  "unowned",
  "unowned(safe)",
  "unowned(unsafe)",
  "weak",
  "as",
  "is",
  "break",
  "case",
  "continue",
  "default",
  "else",
  "fallthrough",
  "for",
  "guard",
  "if",
  "in",
  "repeat",
  "switch",
  "where",
  "while",
  "defer",
  "return",
  "inout",
  "mutating",
  "nonmutating",
  "isolated",
  "nonisolated",
  "catch",
  "do",
  "rethrows",
  "throw",
  "throws",
  "async",
  "await",
  "try",
  "didSet",
  "get",
  "set",
  "willSet",
  "assignment",
  "associativity",
  "infix",
  "left",
  "none",
  "operator",
  "postfix",
  "precedence",
  "precedencegroup",
  "prefix",
  "right",
  "Any",
  "AnyObject",
  "Type",
  "dynamicType",
  "Self",
  "Protocol",
  "__COLUMN__",
  "__FILE__",
  "__FUNCTION__",
  "__LINE__"
]);
var definingKeywords = wordSet(["var", "let", "actor", "class", "enum", "extension", "import", "protocol", "struct", "func", "typealias", "associatedtype", "for"]);
var atoms$2 = wordSet(["true", "false", "nil", "self", "super", "_"]);
var types$3 = wordSet([
  "Array",
  "Bool",
  "Character",
  "Dictionary",
  "Double",
  "Float",
  "Int",
  "Int8",
  "Int16",
  "Int32",
  "Int64",
  "Never",
  "Optional",
  "Set",
  "String",
  "UInt8",
  "UInt16",
  "UInt32",
  "UInt64",
  "Void"
]);
var operators = "+-/*%=|&<>~^?!";
var punc = ":;,.(){}[]";
var binary = /^\-?0b[01][01_]*/;
var octal = /^\-?0o[0-7][0-7_]*/;
var hexadecimal = /^\-?0x[\dA-Fa-f][\dA-Fa-f_]*(?:(?:\.[\dA-Fa-f][\dA-Fa-f_]*)?[Pp]\-?\d[\d_]*)?/;
var decimal = /^\-?\d[\d_]*(?:\.\d[\d_]*)?(?:[Ee]\-?\d[\d_]*)?/;
var identifier = /^\$\d+|(`?)[_A-Za-z][_A-Za-z$0-9]*\1/;
var property = /^\.(?:\$\d+|(`?)[_A-Za-z][_A-Za-z$0-9]*\1)/;
var instruction = /^\#[A-Za-z]+/;
var attribute = /^@(?:\$\d+|(`?)[_A-Za-z][_A-Za-z$0-9]*\1)/;
function tokenBase$b(stream, state, prev) {
  if (stream.sol()) state.indented = stream.indentation();
  if (stream.eatSpace()) return null;
  var ch2 = stream.peek();
  if (ch2 == "/") {
    if (stream.match("//")) {
      stream.skipToEnd();
      return "comment";
    }
    if (stream.match("/*")) {
      state.tokenize.push(tokenComment$5);
      return tokenComment$5(stream, state);
    }
  }
  if (stream.match(instruction)) return "builtin";
  if (stream.match(attribute)) return "attribute";
  if (stream.match(binary)) return "number";
  if (stream.match(octal)) return "number";
  if (stream.match(hexadecimal)) return "number";
  if (stream.match(decimal)) return "number";
  if (stream.match(property)) return "property";
  if (operators.indexOf(ch2) > -1) {
    stream.next();
    return "operator";
  }
  if (punc.indexOf(ch2) > -1) {
    stream.next();
    stream.match("..");
    return "punctuation";
  }
  var stringMatch;
  if (stringMatch = stream.match(/("""|"|')/)) {
    var tokenize2 = tokenString$7.bind(null, stringMatch[0]);
    state.tokenize.push(tokenize2);
    return tokenize2(stream, state);
  }
  if (stream.match(identifier)) {
    var ident = stream.current();
    if (types$3.hasOwnProperty(ident)) return "type";
    if (atoms$2.hasOwnProperty(ident)) return "atom";
    if (keywords$a.hasOwnProperty(ident)) {
      if (definingKeywords.hasOwnProperty(ident))
        state.prev = "define";
      return "keyword";
    }
    if (prev == "define") return "def";
    return "variable";
  }
  stream.next();
  return null;
}
function tokenUntilClosingParen() {
  var depth = 0;
  return function(stream, state, prev) {
    var inner = tokenBase$b(stream, state, prev);
    if (inner == "punctuation") {
      if (stream.current() == "(") ++depth;
      else if (stream.current() == ")") {
        if (depth == 0) {
          stream.backUp(1);
          state.tokenize.pop();
          return state.tokenize[state.tokenize.length - 1](stream, state);
        } else --depth;
      }
    }
    return inner;
  };
}
function tokenString$7(openQuote, stream, state) {
  var singleLine = openQuote.length == 1;
  var ch2, escaped = false;
  while (ch2 = stream.peek()) {
    if (escaped) {
      stream.next();
      if (ch2 == "(") {
        state.tokenize.push(tokenUntilClosingParen());
        return "string";
      }
      escaped = false;
    } else if (stream.match(openQuote)) {
      state.tokenize.pop();
      return "string";
    } else {
      stream.next();
      escaped = ch2 == "\\";
    }
  }
  if (singleLine) {
    state.tokenize.pop();
  }
  return "string";
}
function tokenComment$5(stream, state) {
  var ch2;
  while (ch2 = stream.next()) {
    if (ch2 === "/" && stream.eat("*")) {
      state.tokenize.push(tokenComment$5);
    } else if (ch2 === "*" && stream.eat("/")) {
      state.tokenize.pop();
      break;
    }
  }
  return "comment";
}
function Context$3(prev, align, indented) {
  this.prev = prev;
  this.align = align;
  this.indented = indented;
}
function pushContext$5(state, stream) {
  var align = stream.match(/^\s*($|\/[\/\*]|[)}\]])/, false) ? null : stream.column() + 1;
  state.context = new Context$3(state.context, align, state.indented);
}
function popContext$5(state) {
  if (state.context) {
    state.indented = state.context.indented;
    state.context = state.context.prev;
  }
}
const swift = {
  name: "swift",
  startState: function() {
    return {
      prev: null,
      context: null,
      indented: 0,
      tokenize: []
    };
  },
  token: function(stream, state) {
    var prev = state.prev;
    state.prev = null;
    var tokenize2 = state.tokenize[state.tokenize.length - 1] || tokenBase$b;
    var style2 = tokenize2(stream, state, prev);
    if (!style2 || style2 == "comment") state.prev = prev;
    else if (!state.prev) state.prev = style2;
    if (style2 == "punctuation") {
      var bracket = /[\(\[\{]|([\]\)\}])/.exec(stream.current());
      if (bracket) (bracket[1] ? popContext$5 : pushContext$5)(state, stream);
    }
    return style2;
  },
  indent: function(state, textAfter, iCx) {
    var cx2 = state.context;
    if (!cx2) return 0;
    var closing2 = /^[\]\}\)]/.test(textAfter);
    if (cx2.align != null) return cx2.align - (closing2 ? 1 : 0);
    return cx2.indented + (closing2 ? 0 : iCx.unit);
  },
  languageData: {
    indentOnInput: /^\s*[\)\}\]]$/,
    commentTokens: { line: "//", block: { open: "/*", close: "*/" } },
    closeBrackets: { brackets: ["(", "[", "{", "'", '"', "`"] }
  }
};
const swift$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  swift
});
function mkStex(mathMode) {
  function pushCommand(state, command2) {
    state.cmdState.push(command2);
  }
  function peekCommand(state) {
    if (state.cmdState.length > 0) {
      return state.cmdState[state.cmdState.length - 1];
    } else {
      return null;
    }
  }
  function popCommand(state) {
    var plug = state.cmdState.pop();
    if (plug) {
      plug.closeBracket();
    }
  }
  function getMostPowerful(state) {
    var context = state.cmdState;
    for (var i2 = context.length - 1; i2 >= 0; i2--) {
      var plug = context[i2];
      if (plug.name == "DEFAULT") {
        continue;
      }
      return plug;
    }
    return { styleIdentifier: function() {
      return null;
    } };
  }
  function addPluginPattern(pluginName2, cmdStyle, styles2) {
    return function() {
      this.name = pluginName2;
      this.bracketNo = 0;
      this.style = cmdStyle;
      this.styles = styles2;
      this.argument = null;
      this.styleIdentifier = function() {
        return this.styles[this.bracketNo - 1] || null;
      };
      this.openBracket = function() {
        this.bracketNo++;
        return "bracket";
      };
      this.closeBracket = function() {
      };
    };
  }
  var plugins = {};
  plugins["importmodule"] = addPluginPattern("importmodule", "tag", ["string", "builtin"]);
  plugins["documentclass"] = addPluginPattern("documentclass", "tag", ["", "atom"]);
  plugins["usepackage"] = addPluginPattern("usepackage", "tag", ["atom"]);
  plugins["begin"] = addPluginPattern("begin", "tag", ["atom"]);
  plugins["end"] = addPluginPattern("end", "tag", ["atom"]);
  plugins["label"] = addPluginPattern("label", "tag", ["atom"]);
  plugins["ref"] = addPluginPattern("ref", "tag", ["atom"]);
  plugins["eqref"] = addPluginPattern("eqref", "tag", ["atom"]);
  plugins["cite"] = addPluginPattern("cite", "tag", ["atom"]);
  plugins["bibitem"] = addPluginPattern("bibitem", "tag", ["atom"]);
  plugins["Bibitem"] = addPluginPattern("Bibitem", "tag", ["atom"]);
  plugins["RBibitem"] = addPluginPattern("RBibitem", "tag", ["atom"]);
  plugins["DEFAULT"] = function() {
    this.name = "DEFAULT";
    this.style = "tag";
    this.styleIdentifier = this.openBracket = this.closeBracket = function() {
    };
  };
  function setState(state, f) {
    state.f = f;
  }
  function normal2(source, state) {
    var plug;
    if (source.match(/^\\[a-zA-Z@\xc0-\u1fff\u2060-\uffff]+/)) {
      var cmdName = source.current().slice(1);
      plug = plugins.hasOwnProperty(cmdName) ? plugins[cmdName] : plugins["DEFAULT"];
      plug = new plug();
      pushCommand(state, plug);
      setState(state, beginParams);
      return plug.style;
    }
    if (source.match(/^\\[$&%#{}_]/)) {
      return "tag";
    }
    if (source.match(/^\\[,;!\/\\]/)) {
      return "tag";
    }
    if (source.match("\\[")) {
      setState(state, function(source2, state2) {
        return inMathMode(source2, state2, "\\]");
      });
      return "keyword";
    }
    if (source.match("\\(")) {
      setState(state, function(source2, state2) {
        return inMathMode(source2, state2, "\\)");
      });
      return "keyword";
    }
    if (source.match("$$")) {
      setState(state, function(source2, state2) {
        return inMathMode(source2, state2, "$$");
      });
      return "keyword";
    }
    if (source.match("$")) {
      setState(state, function(source2, state2) {
        return inMathMode(source2, state2, "$");
      });
      return "keyword";
    }
    var ch2 = source.next();
    if (ch2 == "%") {
      source.skipToEnd();
      return "comment";
    } else if (ch2 == "}" || ch2 == "]") {
      plug = peekCommand(state);
      if (plug) {
        plug.closeBracket(ch2);
        setState(state, beginParams);
      } else {
        return "error";
      }
      return "bracket";
    } else if (ch2 == "{" || ch2 == "[") {
      plug = plugins["DEFAULT"];
      plug = new plug();
      pushCommand(state, plug);
      return "bracket";
    } else if (/\d/.test(ch2)) {
      source.eatWhile(/[\w.%]/);
      return "atom";
    } else {
      source.eatWhile(/[\w\-_]/);
      plug = getMostPowerful(state);
      if (plug.name == "begin") {
        plug.argument = source.current();
      }
      return plug.styleIdentifier();
    }
  }
  function inMathMode(source, state, endModeSeq) {
    if (source.eatSpace()) {
      return null;
    }
    if (endModeSeq && source.match(endModeSeq)) {
      setState(state, normal2);
      return "keyword";
    }
    if (source.match(/^\\[a-zA-Z@]+/)) {
      return "tag";
    }
    if (source.match(/^[a-zA-Z]+/)) {
      return "variableName.special";
    }
    if (source.match(/^\\[$&%#{}_]/)) {
      return "tag";
    }
    if (source.match(/^\\[,;!\/]/)) {
      return "tag";
    }
    if (source.match(/^[\^_&]/)) {
      return "tag";
    }
    if (source.match(/^[+\-<>|=,\/@!*:;'"`~#?]/)) {
      return null;
    }
    if (source.match(/^(\d+\.\d*|\d*\.\d+|\d+)/)) {
      return "number";
    }
    var ch2 = source.next();
    if (ch2 == "{" || ch2 == "}" || ch2 == "[" || ch2 == "]" || ch2 == "(" || ch2 == ")") {
      return "bracket";
    }
    if (ch2 == "%") {
      source.skipToEnd();
      return "comment";
    }
    return "error";
  }
  function beginParams(source, state) {
    var ch2 = source.peek(), lastPlug;
    if (ch2 == "{" || ch2 == "[") {
      lastPlug = peekCommand(state);
      lastPlug.openBracket(ch2);
      source.eat(ch2);
      setState(state, normal2);
      return "bracket";
    }
    if (/[ \t\r]/.test(ch2)) {
      source.eat(ch2);
      return null;
    }
    setState(state, normal2);
    popCommand(state);
    return normal2(source, state);
  }
  return {
    name: "stex",
    startState: function() {
      var f = mathMode ? function(source, state) {
        return inMathMode(source, state);
      } : normal2;
      return {
        cmdState: [],
        f
      };
    },
    copyState: function(s) {
      return {
        cmdState: s.cmdState.slice(),
        f: s.f
      };
    },
    token: function(stream, state) {
      return state.f(stream, state);
    },
    blankLine: function(state) {
      state.f = normal2;
      state.cmdState.length = 0;
    },
    languageData: {
      commentTokens: { line: "%" }
    }
  };
}
const stex = mkStex(false);
mkStex(true);
const stex$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  stex
});
function mkVerilog(parserConfig2) {
  var statementIndentUnit2 = parserConfig2.statementIndentUnit, dontAlignCalls = parserConfig2.dontAlignCalls, noIndentKeywords = parserConfig2.noIndentKeywords || [], multiLineStrings2 = parserConfig2.multiLineStrings, hooks2 = parserConfig2.hooks || {};
  function words2(str) {
    var obj = {}, words3 = str.split(" ");
    for (var i3 = 0; i3 < words3.length; ++i3) obj[words3[i3]] = true;
    return obj;
  }
  var keywords2 = words2(
    "accept_on alias always always_comb always_ff always_latch and assert assign assume automatic before begin bind bins binsof bit break buf bufif0 bufif1 byte case casex casez cell chandle checker class clocking cmos config const constraint context continue cover covergroup coverpoint cross deassign default defparam design disable dist do edge else end endcase endchecker endclass endclocking endconfig endfunction endgenerate endgroup endinterface endmodule endpackage endprimitive endprogram endproperty endspecify endsequence endtable endtask enum event eventually expect export extends extern final first_match for force foreach forever fork forkjoin function generate genvar global highz0 highz1 if iff ifnone ignore_bins illegal_bins implements implies import incdir include initial inout input inside instance int integer interconnect interface intersect join join_any join_none large let liblist library local localparam logic longint macromodule matches medium modport module nand negedge nettype new nexttime nmos nor noshowcancelled not notif0 notif1 null or output package packed parameter pmos posedge primitive priority program property protected pull0 pull1 pulldown pullup pulsestyle_ondetect pulsestyle_onevent pure rand randc randcase randsequence rcmos real realtime ref reg reject_on release repeat restrict return rnmos rpmos rtran rtranif0 rtranif1 s_always s_eventually s_nexttime s_until s_until_with scalared sequence shortint shortreal showcancelled signed small soft solve specify specparam static string strong strong0 strong1 struct super supply0 supply1 sync_accept_on sync_reject_on table tagged task this throughout time timeprecision timeunit tran tranif0 tranif1 tri tri0 tri1 triand trior trireg type typedef union unique unique0 unsigned until until_with untyped use uwire var vectored virtual void wait wait_order wand weak weak0 weak1 while wildcard wire with within wor xnor xor"
  );
  var isOperatorChar2 = /[\+\-\*\/!~&|^%=?:]/;
  var isBracketChar = /[\[\]{}()]/;
  var unsignedNumber = /\d[0-9_]*/;
  var decimalLiteral = /\d*\s*'s?d\s*\d[0-9_]*/i;
  var binaryLiteral = /\d*\s*'s?b\s*[xz01][xz01_]*/i;
  var octLiteral = /\d*\s*'s?o\s*[xz0-7][xz0-7_]*/i;
  var hexLiteral = /\d*\s*'s?h\s*[0-9a-fxz?][0-9a-fxz?_]*/i;
  var realLiteral = /(\d[\d_]*(\.\d[\d_]*)?E-?[\d_]+)|(\d[\d_]*\.\d[\d_]*)/i;
  var closingBracketOrWord = /^((\w+)|[)}\]])/;
  var closingBracket = /[)}\]]/;
  var curPunc2;
  var curKeyword;
  var blockKeywords2 = words2(
    "case checker class clocking config function generate interface module package primitive program property specify sequence table task"
  );
  var openClose = {};
  for (var keyword2 in blockKeywords2) {
    openClose[keyword2] = "end" + keyword2;
  }
  openClose["begin"] = "end";
  openClose["casex"] = "endcase";
  openClose["casez"] = "endcase";
  openClose["do"] = "while";
  openClose["fork"] = "join;join_any;join_none";
  openClose["covergroup"] = "endgroup";
  for (var i2 in noIndentKeywords) {
    var keyword2 = noIndentKeywords[i2];
    if (openClose[keyword2]) {
      openClose[keyword2] = void 0;
    }
  }
  var statementKeywords = words2("always always_comb always_ff always_latch assert assign assume else export for foreach forever if import initial repeat while");
  function tokenBase2(stream, state) {
    var ch2 = stream.peek(), style2;
    if (hooks2[ch2] && (style2 = hooks2[ch2](stream, state)) != false) return style2;
    if (hooks2.tokenBase && (style2 = hooks2.tokenBase(stream, state)) != false)
      return style2;
    if (/[,;:\.]/.test(ch2)) {
      curPunc2 = stream.next();
      return null;
    }
    if (isBracketChar.test(ch2)) {
      curPunc2 = stream.next();
      return "bracket";
    }
    if (ch2 == "`") {
      stream.next();
      if (stream.eatWhile(/[\w\$_]/)) {
        return "def";
      } else {
        return null;
      }
    }
    if (ch2 == "$") {
      stream.next();
      if (stream.eatWhile(/[\w\$_]/)) {
        return "meta";
      } else {
        return null;
      }
    }
    if (ch2 == "#") {
      stream.next();
      stream.eatWhile(/[\d_.]/);
      return "def";
    }
    if (ch2 == '"') {
      stream.next();
      state.tokenize = tokenString3(ch2);
      return state.tokenize(stream, state);
    }
    if (ch2 == "/") {
      stream.next();
      if (stream.eat("*")) {
        state.tokenize = tokenComment2;
        return tokenComment2(stream, state);
      }
      if (stream.eat("/")) {
        stream.skipToEnd();
        return "comment";
      }
      stream.backUp(1);
    }
    if (stream.match(realLiteral) || stream.match(decimalLiteral) || stream.match(binaryLiteral) || stream.match(octLiteral) || stream.match(hexLiteral) || stream.match(unsignedNumber) || stream.match(realLiteral)) {
      return "number";
    }
    if (stream.eatWhile(isOperatorChar2)) {
      return "meta";
    }
    if (stream.eatWhile(/[\w\$_]/)) {
      var cur = stream.current();
      if (keywords2[cur]) {
        if (openClose[cur]) {
          curPunc2 = "newblock";
        }
        if (statementKeywords[cur]) {
          curPunc2 = "newstatement";
        }
        curKeyword = cur;
        return "keyword";
      }
      return "variable";
    }
    stream.next();
    return null;
  }
  function tokenString3(quote2) {
    return function(stream, state) {
      var escaped = false, next2, end2 = false;
      while ((next2 = stream.next()) != null) {
        if (next2 == quote2 && !escaped) {
          end2 = true;
          break;
        }
        escaped = !escaped && next2 == "\\";
      }
      if (end2 || !(escaped || multiLineStrings2))
        state.tokenize = tokenBase2;
      return "string";
    };
  }
  function tokenComment2(stream, state) {
    var maybeEnd = false, ch2;
    while (ch2 = stream.next()) {
      if (ch2 == "/" && maybeEnd) {
        state.tokenize = tokenBase2;
        break;
      }
      maybeEnd = ch2 == "*";
    }
    return "comment";
  }
  function Context2(indented, column, type2, align, prev) {
    this.indented = indented;
    this.column = column;
    this.type = type2;
    this.align = align;
    this.prev = prev;
  }
  function pushContext2(state, col, type2) {
    var indent2 = state.indented;
    var c = new Context2(indent2, col, type2, null, state.context);
    return state.context = c;
  }
  function popContext2(state) {
    var t = state.context.type;
    if (t == ")" || t == "]" || t == "}") {
      state.indented = state.context.indented;
    }
    return state.context = state.context.prev;
  }
  function isClosing(text2, contextClosing) {
    if (text2 == contextClosing) {
      return true;
    } else {
      var closingKeywords = contextClosing.split(";");
      for (var i3 in closingKeywords) {
        if (text2 == closingKeywords[i3]) {
          return true;
        }
      }
      return false;
    }
  }
  function buildElectricInputRegEx2() {
    var allClosings = [];
    for (var i3 in openClose) {
      if (openClose[i3]) {
        var closings = openClose[i3].split(";");
        for (var j in closings) {
          allClosings.push(closings[j]);
        }
      }
    }
    var re = new RegExp("[{}()\\[\\]]|(" + allClosings.join("|") + ")$");
    return re;
  }
  return {
    name: "verilog",
    startState: function(indentUnit) {
      var state = {
        tokenize: null,
        context: new Context2(-indentUnit, 0, "top", false),
        indented: 0,
        startOfLine: true
      };
      if (hooks2.startState) hooks2.startState(state);
      return state;
    },
    token: function(stream, state) {
      var ctx = state.context;
      if (stream.sol()) {
        if (ctx.align == null) ctx.align = false;
        state.indented = stream.indentation();
        state.startOfLine = true;
      }
      if (hooks2.token) {
        var style2 = hooks2.token(stream, state);
        if (style2 !== void 0) {
          return style2;
        }
      }
      if (stream.eatSpace()) return null;
      curPunc2 = null;
      curKeyword = null;
      var style2 = (state.tokenize || tokenBase2)(stream, state);
      if (style2 == "comment" || style2 == "meta" || style2 == "variable") return style2;
      if (ctx.align == null) ctx.align = true;
      if (curPunc2 == ctx.type) {
        popContext2(state);
      } else if (curPunc2 == ";" && ctx.type == "statement" || ctx.type && isClosing(curKeyword, ctx.type)) {
        ctx = popContext2(state);
        while (ctx && ctx.type == "statement") ctx = popContext2(state);
      } else if (curPunc2 == "{") {
        pushContext2(state, stream.column(), "}");
      } else if (curPunc2 == "[") {
        pushContext2(state, stream.column(), "]");
      } else if (curPunc2 == "(") {
        pushContext2(state, stream.column(), ")");
      } else if (ctx && ctx.type == "endcase" && curPunc2 == ":") {
        pushContext2(state, stream.column(), "statement");
      } else if (curPunc2 == "newstatement") {
        pushContext2(state, stream.column(), "statement");
      } else if (curPunc2 == "newblock") {
        if (curKeyword == "function" && ctx && (ctx.type == "statement" || ctx.type == "endgroup")) ;
        else if (curKeyword == "task" && ctx && ctx.type == "statement") ;
        else {
          var close = openClose[curKeyword];
          pushContext2(state, stream.column(), close);
        }
      }
      state.startOfLine = false;
      return style2;
    },
    indent: function(state, textAfter, cx2) {
      if (state.tokenize != tokenBase2 && state.tokenize != null) return null;
      if (hooks2.indent) {
        var fromHook = hooks2.indent(state);
        if (fromHook >= 0) return fromHook;
      }
      var ctx = state.context, firstChar = textAfter && textAfter.charAt(0);
      if (ctx.type == "statement" && firstChar == "}") ctx = ctx.prev;
      var closing2 = false;
      var possibleClosing = textAfter.match(closingBracketOrWord);
      if (possibleClosing)
        closing2 = isClosing(possibleClosing[0], ctx.type);
      if (ctx.type == "statement") return ctx.indented + (firstChar == "{" ? 0 : statementIndentUnit2 || cx2.unit);
      else if (closingBracket.test(ctx.type) && ctx.align && !dontAlignCalls) return ctx.column + (closing2 ? 0 : 1);
      else if (ctx.type == ")" && !closing2) return ctx.indented + (statementIndentUnit2 || cx2.unit);
      else return ctx.indented + (closing2 ? 0 : cx2.unit);
    },
    languageData: {
      indentOnInput: buildElectricInputRegEx2(),
      commentTokens: { line: "//", block: { open: "/*", close: "*/" } }
    }
  };
}
const verilog = mkVerilog({});
var tlvIdentifierStyle = {
  "|": "link",
  ">": "property",
  // Should condition this off for > TLV 1c.
  "$": "variable",
  "$$": "variable",
  "?$": "qualifier",
  "?*": "qualifier",
  "-": "contentSeparator",
  "/": "property",
  "/-": "property",
  "@": "variableName.special",
  "@-": "variableName.special",
  "@++": "variableName.special",
  "@+=": "variableName.special",
  "@+=-": "variableName.special",
  "@--": "variableName.special",
  "@-=": "variableName.special",
  "%+": "tag",
  "%-": "tag",
  "%": "tag",
  ">>": "tag",
  "<<": "tag",
  "<>": "tag",
  "#": "tag",
  // Need to choose a style for this.
  "^": "attribute",
  "^^": "attribute",
  "^!": "attribute",
  "*": "variable",
  "**": "variable",
  "\\": "keyword",
  '"': "comment"
};
var tlvScopePrefixChars = {
  "/": "beh-hier",
  ">": "beh-hier",
  "-": "phys-hier",
  "|": "pipe",
  "?": "when",
  "@": "stage",
  "\\": "keyword"
};
var tlvIndentUnit = 3;
var tlvIdentMatch = /^([~!@#\$%\^&\*-\+=\?\/\\\|'"<>]+)([\d\w_]*)/;
var tlvLineIndentationMatch = /^[! ] */;
var tlvCommentMatch = /^\/[\/\*]/;
mkVerilog({
  hooks: {
    electricInput: false,
    // Return undefined for verilog tokenizing, or style for TLV token (null not used).
    // Standard CM styles are used for most formatting, but some TL-Verilog-specific highlighting
    // can be enabled with the definition of cm-tlv-* styles, including highlighting for:
    //   - M4 tokens
    //   - TLV scope indentation
    //   - Statement delimitation (enabled by tlvTrackStatements)
    token: function(stream, state) {
      var style2 = void 0;
      var match;
      if (stream.sol() && !state.tlvInBlockComment) {
        if (stream.peek() == "\\") {
          style2 = "def";
          stream.skipToEnd();
          if (stream.string.match(/\\SV/)) {
            state.tlvCodeActive = false;
          } else if (stream.string.match(/\\TLV/)) {
            state.tlvCodeActive = true;
          }
        }
        if (state.tlvCodeActive && stream.pos == 0 && state.indented == 0 && (match = stream.match(tlvLineIndentationMatch, false))) {
          state.indented = match[0].length;
        }
        var indented = state.indented;
        var depth = indented / tlvIndentUnit;
        if (depth <= state.tlvIndentationStyle.length) {
          var blankline = stream.string.length == indented;
          var chPos = depth * tlvIndentUnit;
          if (chPos < stream.string.length) {
            var bodyString = stream.string.slice(chPos);
            var ch2 = bodyString[0];
            if (tlvScopePrefixChars[ch2] && ((match = bodyString.match(tlvIdentMatch)) && tlvIdentifierStyle[match[1]])) {
              indented += tlvIndentUnit;
              if (!(ch2 == "\\" && chPos > 0)) {
                state.tlvIndentationStyle[depth] = tlvScopePrefixChars[ch2];
                depth++;
              }
            }
          }
          if (!blankline) {
            while (state.tlvIndentationStyle.length > depth) {
              state.tlvIndentationStyle.pop();
            }
          }
        }
        state.tlvNextIndent = indented;
      }
      if (state.tlvCodeActive) {
        var match;
        if (style2 !== void 0) ;
        else if (state.tlvInBlockComment) {
          if (stream.match(/^.*?\*\//)) {
            state.tlvInBlockComment = false;
          } else {
            stream.skipToEnd();
          }
          style2 = "comment";
        } else if ((match = stream.match(tlvCommentMatch)) && !state.tlvInBlockComment) {
          if (match[0] == "//") {
            stream.skipToEnd();
          } else {
            state.tlvInBlockComment = true;
          }
          style2 = "comment";
        } else if (match = stream.match(tlvIdentMatch)) {
          var prefix2 = match[1];
          var mnemonic = match[2];
          if (
            // is identifier prefix
            tlvIdentifierStyle.hasOwnProperty(prefix2) && // has mnemonic or we're at the end of the line (maybe it hasn't been typed yet)
            (mnemonic.length > 0 || stream.eol())
          ) {
            style2 = tlvIdentifierStyle[prefix2];
          } else {
            stream.backUp(stream.current().length - 1);
          }
        } else if (stream.match(/^\t+/)) {
          style2 = "invalid";
        } else if (stream.match(/^[\[\]{}\(\);\:]+/)) {
          style2 = "meta";
        } else if (match = stream.match(/^[mM]4([\+_])?[\w\d_]*/)) {
          style2 = match[1] == "+" ? "keyword.special" : "keyword";
        } else if (stream.match(/^ +/)) {
          if (stream.eol()) {
            style2 = "error";
          }
        } else if (stream.match(/^[\w\d_]+/)) {
          style2 = "number";
        } else {
          stream.next();
        }
      } else {
        if (stream.match(/^[mM]4([\w\d_]*)/)) {
          style2 = "keyword";
        }
      }
      return style2;
    },
    indent: function(state) {
      return state.tlvCodeActive == true ? state.tlvNextIndent : -1;
    },
    startState: function(state) {
      state.tlvIndentationStyle = [];
      state.tlvCodeActive = true;
      state.tlvNextIndent = -1;
      state.tlvInBlockComment = false;
    }
  }
});
const verilog$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  verilog
});
function parseWords$1(str) {
  var obj = {}, words2 = str.split(" ");
  for (var i2 = 0; i2 < words2.length; ++i2) obj[words2[i2]] = true;
  return obj;
}
var keywords$9 = parseWords$1("Tcl safe after append array auto_execok auto_import auto_load auto_mkindex auto_mkindex_old auto_qualify auto_reset bgerror binary break catch cd close concat continue dde eof encoding error eval exec exit expr fblocked fconfigure fcopy file fileevent filename filename flush for foreach format gets glob global history http if incr info interp join lappend lindex linsert list llength load lrange lreplace lsearch lset lsort memory msgcat namespace open package parray pid pkg::create pkg_mkIndex proc puts pwd re_syntax read regex regexp registry regsub rename resource return scan seek set socket source split string subst switch tcl_endOfWord tcl_findLibrary tcl_startOfNextWord tcl_wordBreakAfter tcl_startOfPreviousWord tcl_wordBreakBefore tcltest tclvars tell time trace unknown unset update uplevel upvar variable vwait");
var functions$1 = parseWords$1("if elseif else and not or eq ne in ni for foreach while switch");
var isOperatorChar$4 = /[+\-*&%=<>!?^\/\|]/;
function chain$3(stream, state, f) {
  state.tokenize = f;
  return f(stream, state);
}
function tokenBase$a(stream, state) {
  var beforeParams = state.beforeParams;
  state.beforeParams = false;
  var ch2 = stream.next();
  if ((ch2 == '"' || ch2 == "'") && state.inParams) {
    return chain$3(stream, state, tokenString$6(ch2));
  } else if (/[\[\]{}\(\),;\.]/.test(ch2)) {
    if (ch2 == "(" && beforeParams) state.inParams = true;
    else if (ch2 == ")") state.inParams = false;
    return null;
  } else if (/\d/.test(ch2)) {
    stream.eatWhile(/[\w\.]/);
    return "number";
  } else if (ch2 == "#") {
    if (stream.eat("*"))
      return chain$3(stream, state, tokenComment$4);
    if (ch2 == "#" && stream.match(/ *\[ *\[/))
      return chain$3(stream, state, tokenUnparsed$1);
    stream.skipToEnd();
    return "comment";
  } else if (ch2 == '"') {
    stream.skipTo(/"/);
    return "comment";
  } else if (ch2 == "$") {
    stream.eatWhile(/[$_a-z0-9A-Z\.{:]/);
    stream.eatWhile(/}/);
    state.beforeParams = true;
    return "builtin";
  } else if (isOperatorChar$4.test(ch2)) {
    stream.eatWhile(isOperatorChar$4);
    return "comment";
  } else {
    stream.eatWhile(/[\w\$_{}\xa1-\uffff]/);
    var word = stream.current().toLowerCase();
    if (keywords$9 && keywords$9.propertyIsEnumerable(word))
      return "keyword";
    if (functions$1 && functions$1.propertyIsEnumerable(word)) {
      state.beforeParams = true;
      return "keyword";
    }
    return null;
  }
}
function tokenString$6(quote2) {
  return function(stream, state) {
    var escaped = false, next2, end2 = false;
    while ((next2 = stream.next()) != null) {
      if (next2 == quote2 && !escaped) {
        end2 = true;
        break;
      }
      escaped = !escaped && next2 == "\\";
    }
    if (end2) state.tokenize = tokenBase$a;
    return "string";
  };
}
function tokenComment$4(stream, state) {
  var maybeEnd = false, ch2;
  while (ch2 = stream.next()) {
    if (ch2 == "#" && maybeEnd) {
      state.tokenize = tokenBase$a;
      break;
    }
    maybeEnd = ch2 == "*";
  }
  return "comment";
}
function tokenUnparsed$1(stream, state) {
  var maybeEnd = 0, ch2;
  while (ch2 = stream.next()) {
    if (ch2 == "#" && maybeEnd == 2) {
      state.tokenize = tokenBase$a;
      break;
    }
    if (ch2 == "]")
      maybeEnd++;
    else if (ch2 != " ")
      maybeEnd = 0;
  }
  return "meta";
}
const tcl = {
  name: "tcl",
  startState: function() {
    return {
      tokenize: tokenBase$a,
      beforeParams: false,
      inParams: false
    };
  },
  token: function(stream, state) {
    if (stream.eatSpace()) return null;
    return state.tokenize(stream, state);
  },
  languageData: {
    commentTokens: { line: "#" }
  }
};
const tcl$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  tcl
});
var TOKEN_STYLES = {
  addition: "inserted",
  attributes: "propertyName",
  bold: "strong",
  cite: "keyword",
  code: "monospace",
  definitionList: "list",
  deletion: "deleted",
  div: "punctuation",
  em: "emphasis",
  footnote: "variable",
  footCite: "qualifier",
  header: "heading",
  html: "comment",
  image: "atom",
  italic: "emphasis",
  link: "link",
  linkDefinition: "link",
  list1: "list",
  list2: "list.special",
  list3: "list",
  notextile: "string.special",
  pre: "operator",
  p: "content",
  quote: "bracket",
  span: "quote",
  specialChar: "character",
  strong: "strong",
  sub: "content.special",
  sup: "content.special",
  table: "variableName.special",
  tableHeading: "operator"
};
function startNewLine(stream, state) {
  state.mode = Modes.newLayout;
  state.tableHeading = false;
  if (state.layoutType === "definitionList" && state.spanningLayout && stream.match(RE("definitionListEnd"), false))
    state.spanningLayout = false;
}
function handlePhraseModifier(stream, state, ch2) {
  if (ch2 === "_") {
    if (stream.eat("_"))
      return togglePhraseModifier(stream, state, "italic", /__/, 2);
    else
      return togglePhraseModifier(stream, state, "em", /_/, 1);
  }
  if (ch2 === "*") {
    if (stream.eat("*")) {
      return togglePhraseModifier(stream, state, "bold", /\*\*/, 2);
    }
    return togglePhraseModifier(stream, state, "strong", /\*/, 1);
  }
  if (ch2 === "[") {
    if (stream.match(/\d+\]/)) state.footCite = true;
    return tokenStyles(state);
  }
  if (ch2 === "(") {
    var spec = stream.match(/^(r|tm|c)\)/);
    if (spec)
      return TOKEN_STYLES.specialChar;
  }
  if (ch2 === "<" && stream.match(/(\w+)[^>]+>[^<]+<\/\1>/))
    return TOKEN_STYLES.html;
  if (ch2 === "?" && stream.eat("?"))
    return togglePhraseModifier(stream, state, "cite", /\?\?/, 2);
  if (ch2 === "=" && stream.eat("="))
    return togglePhraseModifier(stream, state, "notextile", /==/, 2);
  if (ch2 === "-" && !stream.eat("-"))
    return togglePhraseModifier(stream, state, "deletion", /-/, 1);
  if (ch2 === "+")
    return togglePhraseModifier(stream, state, "addition", /\+/, 1);
  if (ch2 === "~")
    return togglePhraseModifier(stream, state, "sub", /~/, 1);
  if (ch2 === "^")
    return togglePhraseModifier(stream, state, "sup", /\^/, 1);
  if (ch2 === "%")
    return togglePhraseModifier(stream, state, "span", /%/, 1);
  if (ch2 === "@")
    return togglePhraseModifier(stream, state, "code", /@/, 1);
  if (ch2 === "!") {
    var type2 = togglePhraseModifier(stream, state, "image", /(?:\([^\)]+\))?!/, 1);
    stream.match(/^:\S+/);
    return type2;
  }
  return tokenStyles(state);
}
function togglePhraseModifier(stream, state, phraseModifier, closeRE, openSize) {
  var charBefore = stream.pos > openSize ? stream.string.charAt(stream.pos - openSize - 1) : null;
  var charAfter = stream.peek();
  if (state[phraseModifier]) {
    if ((!charAfter || /\W/.test(charAfter)) && charBefore && /\S/.test(charBefore)) {
      var type2 = tokenStyles(state);
      state[phraseModifier] = false;
      return type2;
    }
  } else if ((!charBefore || /\W/.test(charBefore)) && charAfter && /\S/.test(charAfter) && stream.match(new RegExp("^.*\\S" + closeRE.source + "(?:\\W|$)"), false)) {
    state[phraseModifier] = true;
    state.mode = Modes.attributes;
  }
  return tokenStyles(state);
}
function tokenStyles(state) {
  var disabled = textileDisabled(state);
  if (disabled) return disabled;
  var styles2 = [];
  if (state.layoutType) styles2.push(TOKEN_STYLES[state.layoutType]);
  styles2 = styles2.concat(activeStyles(
    state,
    "addition",
    "bold",
    "cite",
    "code",
    "deletion",
    "em",
    "footCite",
    "image",
    "italic",
    "link",
    "span",
    "strong",
    "sub",
    "sup",
    "table",
    "tableHeading"
  ));
  if (state.layoutType === "header")
    styles2.push(TOKEN_STYLES.header + "-" + state.header);
  return styles2.length ? styles2.join(" ") : null;
}
function textileDisabled(state) {
  var type2 = state.layoutType;
  switch (type2) {
    case "notextile":
    case "code":
    case "pre":
      return TOKEN_STYLES[type2];
    default:
      if (state.notextile)
        return TOKEN_STYLES.notextile + (type2 ? " " + TOKEN_STYLES[type2] : "");
      return null;
  }
}
function activeStyles(state) {
  var styles2 = [];
  for (var i2 = 1; i2 < arguments.length; ++i2) {
    if (state[arguments[i2]])
      styles2.push(TOKEN_STYLES[arguments[i2]]);
  }
  return styles2;
}
function blankLine(state) {
  var spanningLayout = state.spanningLayout, type2 = state.layoutType;
  for (var key in state) if (state.hasOwnProperty(key))
    delete state[key];
  state.mode = Modes.newLayout;
  if (spanningLayout) {
    state.layoutType = type2;
    state.spanningLayout = true;
  }
}
var REs = {
  cache: {},
  single: {
    bc: "bc",
    bq: "bq",
    definitionList: /- .*?:=+/,
    definitionListEnd: /.*=:\s*$/,
    div: "div",
    drawTable: /\|.*\|/,
    foot: /fn\d+/,
    header: /h[1-6]/,
    html: /\s*<(?:\/)?(\w+)(?:[^>]+)?>(?:[^<]+<\/\1>)?/,
    link: /[^"]+":\S/,
    linkDefinition: /\[[^\s\]]+\]\S+/,
    list: /(?:#+|\*+)/,
    notextile: "notextile",
    para: "p",
    pre: "pre",
    table: "table",
    tableCellAttributes: /[\/\\]\d+/,
    tableHeading: /\|_\./,
    tableText: /[^"_\*\[\(\?\+~\^%@|-]+/,
    text: /[^!"_=\*\[\(<\?\+~\^%@-]+/
  },
  attributes: {
    align: /(?:<>|<|>|=)/,
    selector: /\([^\(][^\)]+\)/,
    lang: /\[[^\[\]]+\]/,
    pad: /(?:\(+|\)+){1,2}/,
    css: /\{[^\}]+\}/
  },
  createRe: function(name) {
    switch (name) {
      case "drawTable":
        return REs.makeRe("^", REs.single.drawTable, "$");
      case "html":
        return REs.makeRe("^", REs.single.html, "(?:", REs.single.html, ")*", "$");
      case "linkDefinition":
        return REs.makeRe("^", REs.single.linkDefinition, "$");
      case "listLayout":
        return REs.makeRe("^", REs.single.list, RE("allAttributes"), "*\\s+");
      case "tableCellAttributes":
        return REs.makeRe("^", REs.choiceRe(
          REs.single.tableCellAttributes,
          RE("allAttributes")
        ), "+\\.");
      case "type":
        return REs.makeRe("^", RE("allTypes"));
      case "typeLayout":
        return REs.makeRe(
          "^",
          RE("allTypes"),
          RE("allAttributes"),
          "*\\.\\.?",
          "(\\s+|$)"
        );
      case "attributes":
        return REs.makeRe("^", RE("allAttributes"), "+");
      case "allTypes":
        return REs.choiceRe(
          REs.single.div,
          REs.single.foot,
          REs.single.header,
          REs.single.bc,
          REs.single.bq,
          REs.single.notextile,
          REs.single.pre,
          REs.single.table,
          REs.single.para
        );
      case "allAttributes":
        return REs.choiceRe(
          REs.attributes.selector,
          REs.attributes.css,
          REs.attributes.lang,
          REs.attributes.align,
          REs.attributes.pad
        );
      default:
        return REs.makeRe("^", REs.single[name]);
    }
  },
  makeRe: function() {
    var pattern = "";
    for (var i2 = 0; i2 < arguments.length; ++i2) {
      var arg = arguments[i2];
      pattern += typeof arg === "string" ? arg : arg.source;
    }
    return new RegExp(pattern);
  },
  choiceRe: function() {
    var parts = [arguments[0]];
    for (var i2 = 1; i2 < arguments.length; ++i2) {
      parts[i2 * 2 - 1] = "|";
      parts[i2 * 2] = arguments[i2];
    }
    parts.unshift("(?:");
    parts.push(")");
    return REs.makeRe.apply(null, parts);
  }
};
function RE(name) {
  return REs.cache[name] || (REs.cache[name] = REs.createRe(name));
}
var Modes = {
  newLayout: function(stream, state) {
    if (stream.match(RE("typeLayout"), false)) {
      state.spanningLayout = false;
      return (state.mode = Modes.blockType)(stream, state);
    }
    var newMode;
    if (!textileDisabled(state)) {
      if (stream.match(RE("listLayout"), false))
        newMode = Modes.list;
      else if (stream.match(RE("drawTable"), false))
        newMode = Modes.table;
      else if (stream.match(RE("linkDefinition"), false))
        newMode = Modes.linkDefinition;
      else if (stream.match(RE("definitionList")))
        newMode = Modes.definitionList;
      else if (stream.match(RE("html"), false))
        newMode = Modes.html;
    }
    return (state.mode = newMode || Modes.text)(stream, state);
  },
  blockType: function(stream, state) {
    var match, type2;
    state.layoutType = null;
    if (match = stream.match(RE("type")))
      type2 = match[0];
    else
      return (state.mode = Modes.text)(stream, state);
    if (match = type2.match(RE("header"))) {
      state.layoutType = "header";
      state.header = parseInt(match[0][1]);
    } else if (type2.match(RE("bq"))) {
      state.layoutType = "quote";
    } else if (type2.match(RE("bc"))) {
      state.layoutType = "code";
    } else if (type2.match(RE("foot"))) {
      state.layoutType = "footnote";
    } else if (type2.match(RE("notextile"))) {
      state.layoutType = "notextile";
    } else if (type2.match(RE("pre"))) {
      state.layoutType = "pre";
    } else if (type2.match(RE("div"))) {
      state.layoutType = "div";
    } else if (type2.match(RE("table"))) {
      state.layoutType = "table";
    }
    state.mode = Modes.attributes;
    return tokenStyles(state);
  },
  text: function(stream, state) {
    if (stream.match(RE("text"))) return tokenStyles(state);
    var ch2 = stream.next();
    if (ch2 === '"')
      return (state.mode = Modes.link)(stream, state);
    return handlePhraseModifier(stream, state, ch2);
  },
  attributes: function(stream, state) {
    state.mode = Modes.layoutLength;
    if (stream.match(RE("attributes")))
      return TOKEN_STYLES.attributes;
    else
      return tokenStyles(state);
  },
  layoutLength: function(stream, state) {
    if (stream.eat(".") && stream.eat("."))
      state.spanningLayout = true;
    state.mode = Modes.text;
    return tokenStyles(state);
  },
  list: function(stream, state) {
    var match = stream.match(RE("list"));
    state.listDepth = match[0].length;
    var listMod = (state.listDepth - 1) % 3;
    if (!listMod)
      state.layoutType = "list1";
    else if (listMod === 1)
      state.layoutType = "list2";
    else
      state.layoutType = "list3";
    state.mode = Modes.attributes;
    return tokenStyles(state);
  },
  link: function(stream, state) {
    state.mode = Modes.text;
    if (stream.match(RE("link"))) {
      stream.match(/\S+/);
      return TOKEN_STYLES.link;
    }
    return tokenStyles(state);
  },
  linkDefinition: function(stream) {
    stream.skipToEnd();
    return TOKEN_STYLES.linkDefinition;
  },
  definitionList: function(stream, state) {
    stream.match(RE("definitionList"));
    state.layoutType = "definitionList";
    if (stream.match(/\s*$/))
      state.spanningLayout = true;
    else
      state.mode = Modes.attributes;
    return tokenStyles(state);
  },
  html: function(stream) {
    stream.skipToEnd();
    return TOKEN_STYLES.html;
  },
  table: function(stream, state) {
    state.layoutType = "table";
    return (state.mode = Modes.tableCell)(stream, state);
  },
  tableCell: function(stream, state) {
    if (stream.match(RE("tableHeading")))
      state.tableHeading = true;
    else
      stream.eat("|");
    state.mode = Modes.tableCellAttributes;
    return tokenStyles(state);
  },
  tableCellAttributes: function(stream, state) {
    state.mode = Modes.tableText;
    if (stream.match(RE("tableCellAttributes")))
      return TOKEN_STYLES.attributes;
    else
      return tokenStyles(state);
  },
  tableText: function(stream, state) {
    if (stream.match(RE("tableText")))
      return tokenStyles(state);
    if (stream.peek() === "|") {
      state.mode = Modes.tableCell;
      return tokenStyles(state);
    }
    return handlePhraseModifier(stream, state, stream.next());
  }
};
const textile = {
  name: "textile",
  startState: function() {
    return { mode: Modes.newLayout };
  },
  token: function(stream, state) {
    if (stream.sol()) startNewLine(stream, state);
    return state.mode(stream, state);
  },
  blankLine
};
const textile$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  textile
});
var textwords = {};
var keywords$8 = {
  "allTags": true,
  "closeAll": true,
  "list": true,
  "newJournal": true,
  "newTiddler": true,
  "permaview": true,
  "saveChanges": true,
  "search": true,
  "slider": true,
  "tabs": true,
  "tag": true,
  "tagging": true,
  "tags": true,
  "tiddler": true,
  "timeline": true,
  "today": true,
  "version": true,
  "option": true,
  "with": true,
  "filter": true
};
var isSpaceName = /[\w_\-]/i, reHR = /^\-\-\-\-+$/, reWikiCommentStart = /^\/\*\*\*$/, reWikiCommentStop = /^\*\*\*\/$/, reBlockQuote = /^<<<$/, reJsCodeStart = /^\/\/\{\{\{$/, reJsCodeStop = /^\/\/\}\}\}$/, reXmlCodeStart = /^<!--\{\{\{-->$/, reXmlCodeStop = /^<!--\}\}\}-->$/, reCodeBlockStart = /^\{\{\{$/, reCodeBlockStop = /^\}\}\}$/, reUntilCodeStop = /.*?\}\}\}/;
function chain$2(stream, state, f) {
  state.tokenize = f;
  return f(stream, state);
}
function tokenBase$9(stream, state) {
  var sol = stream.sol(), ch2 = stream.peek();
  state.block = false;
  if (sol && /[<\/\*{}\-]/.test(ch2)) {
    if (stream.match(reCodeBlockStart)) {
      state.block = true;
      return chain$2(stream, state, twTokenCode);
    }
    if (stream.match(reBlockQuote))
      return "quote";
    if (stream.match(reWikiCommentStart) || stream.match(reWikiCommentStop))
      return "comment";
    if (stream.match(reJsCodeStart) || stream.match(reJsCodeStop) || stream.match(reXmlCodeStart) || stream.match(reXmlCodeStop))
      return "comment";
    if (stream.match(reHR))
      return "contentSeparator";
  }
  stream.next();
  if (sol && /[\/\*!#;:>|]/.test(ch2)) {
    if (ch2 == "!") {
      stream.skipToEnd();
      return "header";
    }
    if (ch2 == "*") {
      stream.eatWhile("*");
      return "comment";
    }
    if (ch2 == "#") {
      stream.eatWhile("#");
      return "comment";
    }
    if (ch2 == ";") {
      stream.eatWhile(";");
      return "comment";
    }
    if (ch2 == ":") {
      stream.eatWhile(":");
      return "comment";
    }
    if (ch2 == ">") {
      stream.eatWhile(">");
      return "quote";
    }
    if (ch2 == "|")
      return "header";
  }
  if (ch2 == "{" && stream.match("{{"))
    return chain$2(stream, state, twTokenCode);
  if (/[hf]/i.test(ch2) && /[ti]/i.test(stream.peek()) && stream.match(/\b(ttps?|tp|ile):\/\/[\-A-Z0-9+&@#\/%?=~_|$!:,.;]*[A-Z0-9+&@#\/%=~_|$]/i))
    return "link";
  if (ch2 == '"')
    return "string";
  if (ch2 == "~")
    return "brace";
  if (/[\[\]]/.test(ch2) && stream.match(ch2))
    return "brace";
  if (ch2 == "@") {
    stream.eatWhile(isSpaceName);
    return "link";
  }
  if (/\d/.test(ch2)) {
    stream.eatWhile(/\d/);
    return "number";
  }
  if (ch2 == "/") {
    if (stream.eat("%")) {
      return chain$2(stream, state, twTokenComment);
    } else if (stream.eat("/")) {
      return chain$2(stream, state, twTokenEm);
    }
  }
  if (ch2 == "_" && stream.eat("_"))
    return chain$2(stream, state, twTokenUnderline);
  if (ch2 == "-" && stream.eat("-")) {
    if (stream.peek() != " ")
      return chain$2(stream, state, twTokenStrike);
    if (stream.peek() == " ")
      return "brace";
  }
  if (ch2 == "'" && stream.eat("'"))
    return chain$2(stream, state, twTokenStrong);
  if (ch2 == "<" && stream.eat("<"))
    return chain$2(stream, state, twTokenMacro);
  stream.eatWhile(/[\w\$_]/);
  return textwords.propertyIsEnumerable(stream.current()) ? "keyword" : null;
}
function twTokenComment(stream, state) {
  var maybeEnd = false, ch2;
  while (ch2 = stream.next()) {
    if (ch2 == "/" && maybeEnd) {
      state.tokenize = tokenBase$9;
      break;
    }
    maybeEnd = ch2 == "%";
  }
  return "comment";
}
function twTokenStrong(stream, state) {
  var maybeEnd = false, ch2;
  while (ch2 = stream.next()) {
    if (ch2 == "'" && maybeEnd) {
      state.tokenize = tokenBase$9;
      break;
    }
    maybeEnd = ch2 == "'";
  }
  return "strong";
}
function twTokenCode(stream, state) {
  var sb = state.block;
  if (sb && stream.current()) {
    return "comment";
  }
  if (!sb && stream.match(reUntilCodeStop)) {
    state.tokenize = tokenBase$9;
    return "comment";
  }
  if (sb && stream.sol() && stream.match(reCodeBlockStop)) {
    state.tokenize = tokenBase$9;
    return "comment";
  }
  stream.next();
  return "comment";
}
function twTokenEm(stream, state) {
  var maybeEnd = false, ch2;
  while (ch2 = stream.next()) {
    if (ch2 == "/" && maybeEnd) {
      state.tokenize = tokenBase$9;
      break;
    }
    maybeEnd = ch2 == "/";
  }
  return "emphasis";
}
function twTokenUnderline(stream, state) {
  var maybeEnd = false, ch2;
  while (ch2 = stream.next()) {
    if (ch2 == "_" && maybeEnd) {
      state.tokenize = tokenBase$9;
      break;
    }
    maybeEnd = ch2 == "_";
  }
  return "link";
}
function twTokenStrike(stream, state) {
  var maybeEnd = false, ch2;
  while (ch2 = stream.next()) {
    if (ch2 == "-" && maybeEnd) {
      state.tokenize = tokenBase$9;
      break;
    }
    maybeEnd = ch2 == "-";
  }
  return "deleted";
}
function twTokenMacro(stream, state) {
  if (stream.current() == "<<") {
    return "meta";
  }
  var ch2 = stream.next();
  if (!ch2) {
    state.tokenize = tokenBase$9;
    return null;
  }
  if (ch2 == ">") {
    if (stream.peek() == ">") {
      stream.next();
      state.tokenize = tokenBase$9;
      return "meta";
    }
  }
  stream.eatWhile(/[\w\$_]/);
  return keywords$8.propertyIsEnumerable(stream.current()) ? "keyword" : null;
}
const tiddlyWiki = {
  name: "tiddlywiki",
  startState: function() {
    return { tokenize: tokenBase$9 };
  },
  token: function(stream, state) {
    if (stream.eatSpace()) return null;
    var style2 = state.tokenize(stream, state);
    return style2;
  }
};
const tiddlywiki = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  tiddlyWiki
});
function inBlock(style2, terminator, returnTokenizer) {
  return function(stream, state) {
    while (!stream.eol()) {
      if (stream.match(terminator)) {
        state.tokenize = inText;
        break;
      }
      stream.next();
    }
    if (returnTokenizer) state.tokenize = returnTokenizer;
    return style2;
  };
}
function inLine(style2) {
  return function(stream, state) {
    while (!stream.eol()) {
      stream.next();
    }
    state.tokenize = inText;
    return style2;
  };
}
function inText(stream, state) {
  function chain2(parser) {
    state.tokenize = parser;
    return parser(stream, state);
  }
  var sol = stream.sol();
  var ch2 = stream.next();
  switch (ch2) {
    //switch is generally much faster than if, so it is used here
    case "{":
      stream.eat("/");
      stream.eatSpace();
      stream.eatWhile(/[^\s\u00a0=\"\'\/?(}]/);
      state.tokenize = inPlugin;
      return "tag";
    case "_":
      if (stream.eat("_"))
        return chain2(inBlock("strong", "__", inText));
      break;
    case "'":
      if (stream.eat("'"))
        return chain2(inBlock("em", "''", inText));
      break;
    case "(":
      if (stream.eat("("))
        return chain2(inBlock("link", "))", inText));
      break;
    case "[":
      return chain2(inBlock("url", "]", inText));
    case "|":
      if (stream.eat("|"))
        return chain2(inBlock("comment", "||"));
      break;
    case "-":
      if (stream.eat("=")) {
        return chain2(inBlock("header string", "=-", inText));
      } else if (stream.eat("-")) {
        return chain2(inBlock("error tw-deleted", "--", inText));
      }
      break;
    case "=":
      if (stream.match("=="))
        return chain2(inBlock("tw-underline", "===", inText));
      break;
    case ":":
      if (stream.eat(":"))
        return chain2(inBlock("comment", "::"));
      break;
    case "^":
      return chain2(inBlock("tw-box", "^"));
    case "~":
      if (stream.match("np~"))
        return chain2(inBlock("meta", "~/np~"));
      break;
  }
  if (sol) {
    switch (ch2) {
      case "!":
        if (stream.match("!!!!!")) {
          return chain2(inLine("header string"));
        } else if (stream.match("!!!!")) {
          return chain2(inLine("header string"));
        } else if (stream.match("!!!")) {
          return chain2(inLine("header string"));
        } else if (stream.match("!!")) {
          return chain2(inLine("header string"));
        } else {
          return chain2(inLine("header string"));
        }
      case "*":
      //unordered list line item, or <li /> at start of line
      case "#":
      //ordered list line item, or <li /> at start of line
      case "+":
        return chain2(inLine("tw-listitem bracket"));
    }
  }
  return null;
}
var pluginName, type;
function inPlugin(stream, state) {
  var ch2 = stream.next();
  var peek = stream.peek();
  if (ch2 == "}") {
    state.tokenize = inText;
    return "tag";
  } else if (ch2 == "(" || ch2 == ")") {
    return "bracket";
  } else if (ch2 == "=") {
    type = "equals";
    if (peek == ">") {
      stream.next();
      peek = stream.peek();
    }
    if (!/[\'\"]/.test(peek)) {
      state.tokenize = inAttributeNoQuote();
    }
    return "operator";
  } else if (/[\'\"]/.test(ch2)) {
    state.tokenize = inAttribute(ch2);
    return state.tokenize(stream, state);
  } else {
    stream.eatWhile(/[^\s\u00a0=\"\'\/?]/);
    return "keyword";
  }
}
function inAttribute(quote2) {
  return function(stream, state) {
    while (!stream.eol()) {
      if (stream.next() == quote2) {
        state.tokenize = inPlugin;
        break;
      }
    }
    return "string";
  };
}
function inAttributeNoQuote() {
  return function(stream, state) {
    while (!stream.eol()) {
      var ch2 = stream.next();
      var peek = stream.peek();
      if (ch2 == " " || ch2 == "," || /[ )}]/.test(peek)) {
        state.tokenize = inPlugin;
        break;
      }
    }
    return "string";
  };
}
var curState, setStyle;
function pass() {
  for (var i2 = arguments.length - 1; i2 >= 0; i2--) curState.cc.push(arguments[i2]);
}
function cont() {
  pass.apply(null, arguments);
  return true;
}
function pushContext$4(pluginName2, startOfLine2) {
  var noIndent = curState.context && curState.context.noIndent;
  curState.context = {
    prev: curState.context,
    pluginName: pluginName2,
    indent: curState.indented,
    startOfLine: startOfLine2,
    noIndent
  };
}
function popContext$4() {
  if (curState.context) curState.context = curState.context.prev;
}
function element(type2) {
  if (type2 == "openPlugin") {
    curState.pluginName = pluginName;
    return cont(attributes, endplugin(curState.startOfLine));
  } else if (type2 == "closePlugin") {
    var err = false;
    if (curState.context) {
      err = curState.context.pluginName != pluginName;
      popContext$4();
    } else {
      err = true;
    }
    if (err) setStyle = "error";
    return cont(endcloseplugin(err));
  } else if (type2 == "string") {
    if (!curState.context || curState.context.name != "!cdata") pushContext$4("!cdata");
    if (curState.tokenize == inText) popContext$4();
    return cont();
  } else return cont();
}
function endplugin(startOfLine2) {
  return function(type2) {
    if (type2 == "selfclosePlugin" || type2 == "endPlugin")
      return cont();
    if (type2 == "endPlugin") {
      pushContext$4(curState.pluginName, startOfLine2);
      return cont();
    }
    return cont();
  };
}
function endcloseplugin(err) {
  return function(type2) {
    if (err) setStyle = "error";
    if (type2 == "endPlugin") return cont();
    return pass();
  };
}
function attributes(type2) {
  if (type2 == "keyword") {
    setStyle = "attribute";
    return cont(attributes);
  }
  if (type2 == "equals") return cont(attvalue, attributes);
  return pass();
}
function attvalue(type2) {
  if (type2 == "keyword") {
    setStyle = "string";
    return cont();
  }
  if (type2 == "string") return cont(attvaluemaybe);
  return pass();
}
function attvaluemaybe(type2) {
  if (type2 == "string") return cont(attvaluemaybe);
  else return pass();
}
const tiki = {
  name: "tiki",
  startState: function() {
    return { tokenize: inText, cc: [], indented: 0, startOfLine: true, pluginName: null, context: null };
  },
  token: function(stream, state) {
    if (stream.sol()) {
      state.startOfLine = true;
      state.indented = stream.indentation();
    }
    if (stream.eatSpace()) return null;
    setStyle = type = pluginName = null;
    var style2 = state.tokenize(stream, state);
    if ((style2 || type) && style2 != "comment") {
      curState = state;
      while (true) {
        var comb = state.cc.pop() || element;
        if (comb(type || style2)) break;
      }
    }
    state.startOfLine = false;
    return setStyle || style2;
  },
  indent: function(state, textAfter, cx2) {
    var context = state.context;
    if (context && context.noIndent) return 0;
    if (context && /^{\//.test(textAfter))
      context = context.prev;
    while (context && !context.startOfLine)
      context = context.prev;
    if (context) return context.indent + cx2.unit;
    else return 0;
  }
};
const tiki$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  tiki
});
const toml = {
  name: "toml",
  startState: function() {
    return {
      inString: false,
      stringType: "",
      lhs: true,
      inArray: 0
    };
  },
  token: function(stream, state) {
    let quote2;
    if (!state.inString && (quote2 = stream.match(/^('''|"""|'|")/))) {
      state.stringType = quote2[0];
      state.inString = true;
    }
    if (stream.sol() && !state.inString && state.inArray === 0) {
      state.lhs = true;
    }
    if (state.inString) {
      while (state.inString) {
        if (stream.match(state.stringType)) {
          state.inString = false;
        } else if (stream.peek() === "\\") {
          stream.next();
          stream.next();
        } else if (stream.eol()) {
          break;
        } else {
          stream.match(/^.[^\\\"\']*/);
        }
      }
      return state.lhs ? "property" : "string";
    } else if (state.inArray && stream.peek() === "]") {
      stream.next();
      state.inArray--;
      return "bracket";
    } else if (state.lhs && stream.peek() === "[" && stream.skipTo("]")) {
      stream.next();
      if (stream.peek() === "]") stream.next();
      return "atom";
    } else if (stream.peek() === "#") {
      stream.skipToEnd();
      return "comment";
    } else if (stream.eatSpace()) {
      return null;
    } else if (state.lhs && stream.eatWhile(function(c) {
      return c != "=" && c != " ";
    })) {
      return "property";
    } else if (state.lhs && stream.peek() === "=") {
      stream.next();
      state.lhs = false;
      return null;
    } else if (!state.lhs && stream.match(/^\d\d\d\d[\d\-\:\.T]*Z/)) {
      return "atom";
    } else if (!state.lhs && (stream.match("true") || stream.match("false"))) {
      return "atom";
    } else if (!state.lhs && stream.peek() === "[") {
      state.inArray++;
      stream.next();
      return "bracket";
    } else if (!state.lhs && stream.match(/^\-?\d+(?:\.\d+)?/)) {
      return "number";
    } else if (!stream.eatSpace()) {
      stream.next();
    }
    return null;
  },
  languageData: {
    commentTokens: { line: "#" }
  }
};
const toml$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  toml
});
var words$4 = {};
function tokenBase$8(stream) {
  if (stream.eatSpace()) return null;
  var sol = stream.sol();
  var ch2 = stream.next();
  if (ch2 === "\\") {
    if (stream.match("fB") || stream.match("fR") || stream.match("fI") || stream.match("u") || stream.match("d") || stream.match("%") || stream.match("&")) {
      return "string";
    }
    if (stream.match("m[")) {
      stream.skipTo("]");
      stream.next();
      return "string";
    }
    if (stream.match("s+") || stream.match("s-")) {
      stream.eatWhile(/[\d-]/);
      return "string";
    }
    if (stream.match("(") || stream.match("*(")) {
      stream.eatWhile(/[\w-]/);
      return "string";
    }
    return "string";
  }
  if (sol && (ch2 === "." || ch2 === "'")) {
    if (stream.eat("\\") && stream.eat('"')) {
      stream.skipToEnd();
      return "comment";
    }
  }
  if (sol && ch2 === ".") {
    if (stream.match("B ") || stream.match("I ") || stream.match("R ")) {
      return "attribute";
    }
    if (stream.match("TH ") || stream.match("SH ") || stream.match("SS ") || stream.match("HP ")) {
      stream.skipToEnd();
      return "quote";
    }
    if (stream.match(/[A-Z]/) && stream.match(/[A-Z]/) || stream.match(/[a-z]/) && stream.match(/[a-z]/)) {
      return "attribute";
    }
  }
  stream.eatWhile(/[\w-]/);
  var cur = stream.current();
  return words$4.hasOwnProperty(cur) ? words$4[cur] : null;
}
function tokenize(stream, state) {
  return (state.tokens[0] || tokenBase$8)(stream, state);
}
const troff = {
  name: "troff",
  startState: function() {
    return { tokens: [] };
  },
  token: function(stream, state) {
    return tokenize(stream, state);
  }
};
const troff$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  troff
});
function words$3(str) {
  var obj = {}, words2 = str.split(" ");
  for (var i2 = 0; i2 < words2.length; ++i2) obj[words2[i2]] = true;
  return obj;
}
const parserConfig$1 = {
  keywords: words$3("activate address alive all alt altstep and and4b any break case component const continue control deactivate display do else encode enumerated except exception execute extends extension external for from function goto group if import in infinity inout interleave label language length log match message mixed mod modifies module modulepar mtc noblock not not4b nowait of on optional or or4b out override param pattern port procedure record recursive rem repeat return runs select self sender set signature system template testcase to type union value valueof var variant while with xor xor4b"),
  builtin: words$3("bit2hex bit2int bit2oct bit2str char2int char2oct encvalue decomp decvalue float2int float2str hex2bit hex2int hex2oct hex2str int2bit int2char int2float int2hex int2oct int2str int2unichar isbound ischosen ispresent isvalue lengthof log2str oct2bit oct2char oct2hex oct2int oct2str regexp replace rnd sizeof str2bit str2float str2hex str2int str2oct substr unichar2int unichar2char enum2int"),
  types: words$3("anytype bitstring boolean char charstring default float hexstring integer objid octetstring universal verdicttype timer"),
  timerOps: words$3("read running start stop timeout"),
  portOps: words$3("call catch check clear getcall getreply halt raise receive reply send trigger"),
  configOps: words$3("create connect disconnect done kill killed map unmap"),
  verdictOps: words$3("getverdict setverdict"),
  sutOps: words$3("action"),
  functionOps: words$3("apply derefers refers"),
  verdictConsts: words$3("error fail inconc none pass"),
  booleanConsts: words$3("true false"),
  otherConsts: words$3("null NULL omit"),
  visibilityModifiers: words$3("private public friend"),
  templateMatch: words$3("complement ifpresent subset superset permutation")
};
var wordList = [];
function add(obj) {
  if (obj) {
    for (var prop in obj) if (obj.hasOwnProperty(prop))
      wordList.push(prop);
  }
}
add(parserConfig$1.keywords);
add(parserConfig$1.builtin);
add(parserConfig$1.timerOps);
add(parserConfig$1.portOps);
var keywords$7 = parserConfig$1.keywords || {}, builtin = parserConfig$1.builtin || {}, timerOps = parserConfig$1.timerOps || {}, portOps = parserConfig$1.portOps || {}, configOps = parserConfig$1.configOps || {}, verdictOps = parserConfig$1.verdictOps || {}, sutOps = parserConfig$1.sutOps || {}, functionOps = parserConfig$1.functionOps || {}, verdictConsts = parserConfig$1.verdictConsts || {}, booleanConsts = parserConfig$1.booleanConsts || {}, otherConsts = parserConfig$1.otherConsts || {}, types$2 = parserConfig$1.types || {}, visibilityModifiers = parserConfig$1.visibilityModifiers || {}, templateMatch = parserConfig$1.templateMatch || {}, indentStatements$1 = parserConfig$1.indentStatements !== false;
var isOperatorChar$3 = /[+\-*&@=<>!\/]/;
var curPunc$3;
function tokenBase$7(stream, state) {
  var ch2 = stream.next();
  if (ch2 == '"' || ch2 == "'") {
    state.tokenize = tokenString$5(ch2);
    return state.tokenize(stream, state);
  }
  if (/[\[\]{}\(\),;\\:\?\.]/.test(ch2)) {
    curPunc$3 = ch2;
    return "punctuation";
  }
  if (ch2 == "#") {
    stream.skipToEnd();
    return "atom";
  }
  if (ch2 == "%") {
    stream.eatWhile(/\b/);
    return "atom";
  }
  if (/\d/.test(ch2)) {
    stream.eatWhile(/[\w\.]/);
    return "number";
  }
  if (ch2 == "/") {
    if (stream.eat("*")) {
      state.tokenize = tokenComment$3;
      return tokenComment$3(stream, state);
    }
    if (stream.eat("/")) {
      stream.skipToEnd();
      return "comment";
    }
  }
  if (isOperatorChar$3.test(ch2)) {
    if (ch2 == "@") {
      if (stream.match("try") || stream.match("catch") || stream.match("lazy")) {
        return "keyword";
      }
    }
    stream.eatWhile(isOperatorChar$3);
    return "operator";
  }
  stream.eatWhile(/[\w\$_\xa1-\uffff]/);
  var cur = stream.current();
  if (keywords$7.propertyIsEnumerable(cur)) return "keyword";
  if (builtin.propertyIsEnumerable(cur)) return "builtin";
  if (timerOps.propertyIsEnumerable(cur)) return "def";
  if (configOps.propertyIsEnumerable(cur)) return "def";
  if (verdictOps.propertyIsEnumerable(cur)) return "def";
  if (portOps.propertyIsEnumerable(cur)) return "def";
  if (sutOps.propertyIsEnumerable(cur)) return "def";
  if (functionOps.propertyIsEnumerable(cur)) return "def";
  if (verdictConsts.propertyIsEnumerable(cur)) return "string";
  if (booleanConsts.propertyIsEnumerable(cur)) return "string";
  if (otherConsts.propertyIsEnumerable(cur)) return "string";
  if (types$2.propertyIsEnumerable(cur)) return "typeName.standard";
  if (visibilityModifiers.propertyIsEnumerable(cur))
    return "modifier";
  if (templateMatch.propertyIsEnumerable(cur)) return "atom";
  return "variable";
}
function tokenString$5(quote2) {
  return function(stream, state) {
    var escaped = false, next2, end2 = false;
    while ((next2 = stream.next()) != null) {
      if (next2 == quote2 && !escaped) {
        var afterQuote = stream.peek();
        if (afterQuote) {
          afterQuote = afterQuote.toLowerCase();
          if (afterQuote == "b" || afterQuote == "h" || afterQuote == "o")
            stream.next();
        }
        end2 = true;
        break;
      }
      escaped = !escaped && next2 == "\\";
    }
    if (end2 || false)
      state.tokenize = null;
    return "string";
  };
}
function tokenComment$3(stream, state) {
  var maybeEnd = false, ch2;
  while (ch2 = stream.next()) {
    if (ch2 == "/" && maybeEnd) {
      state.tokenize = null;
      break;
    }
    maybeEnd = ch2 == "*";
  }
  return "comment";
}
function Context$2(indented, column, type2, align, prev) {
  this.indented = indented;
  this.column = column;
  this.type = type2;
  this.align = align;
  this.prev = prev;
}
function pushContext$3(state, col, type2) {
  var indent2 = state.indented;
  if (state.context && state.context.type == "statement")
    indent2 = state.context.indented;
  return state.context = new Context$2(indent2, col, type2, null, state.context);
}
function popContext$3(state) {
  var t = state.context.type;
  if (t == ")" || t == "]" || t == "}")
    state.indented = state.context.indented;
  return state.context = state.context.prev;
}
const ttcn = {
  name: "ttcn",
  startState: function() {
    return {
      tokenize: null,
      context: new Context$2(0, 0, "top", false),
      indented: 0,
      startOfLine: true
    };
  },
  token: function(stream, state) {
    var ctx = state.context;
    if (stream.sol()) {
      if (ctx.align == null) ctx.align = false;
      state.indented = stream.indentation();
      state.startOfLine = true;
    }
    if (stream.eatSpace()) return null;
    curPunc$3 = null;
    var style2 = (state.tokenize || tokenBase$7)(stream, state);
    if (style2 == "comment") return style2;
    if (ctx.align == null) ctx.align = true;
    if ((curPunc$3 == ";" || curPunc$3 == ":" || curPunc$3 == ",") && ctx.type == "statement") {
      popContext$3(state);
    } else if (curPunc$3 == "{") pushContext$3(state, stream.column(), "}");
    else if (curPunc$3 == "[") pushContext$3(state, stream.column(), "]");
    else if (curPunc$3 == "(") pushContext$3(state, stream.column(), ")");
    else if (curPunc$3 == "}") {
      while (ctx.type == "statement") ctx = popContext$3(state);
      if (ctx.type == "}") ctx = popContext$3(state);
      while (ctx.type == "statement") ctx = popContext$3(state);
    } else if (curPunc$3 == ctx.type) popContext$3(state);
    else if (indentStatements$1 && ((ctx.type == "}" || ctx.type == "top") && curPunc$3 != ";" || ctx.type == "statement" && curPunc$3 == "newstatement"))
      pushContext$3(state, stream.column(), "statement");
    state.startOfLine = false;
    return style2;
  },
  languageData: {
    indentOnInput: /^\s*[{}]$/,
    commentTokens: { line: "//", block: { open: "/*", close: "*/" } },
    autocomplete: wordList
  }
};
const ttcn$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  ttcn
});
function words$2(str) {
  var obj = {}, words2 = str.split(" ");
  for (var i2 = 0; i2 < words2.length; ++i2)
    obj[words2[i2]] = true;
  return obj;
}
const parserConfig = {
  keywords: words$2("Yes No LogFile FileMask ConsoleMask AppendFile TimeStampFormat LogEventTypes SourceInfoFormat LogEntityName LogSourceInfo DiskFullAction LogFileNumber LogFileSize MatchingHints Detailed Compact SubCategories Stack Single None Seconds DateTime Time Stop Error Retry Delete TCPPort KillTimer NumHCs UnixSocketsEnabled LocalAddress"),
  fileNCtrlMaskOptions: words$2("TTCN_EXECUTOR TTCN_ERROR TTCN_WARNING TTCN_PORTEVENT TTCN_TIMEROP TTCN_VERDICTOP TTCN_DEFAULTOP TTCN_TESTCASE TTCN_ACTION TTCN_USER TTCN_FUNCTION TTCN_STATISTICS TTCN_PARALLEL TTCN_MATCHING TTCN_DEBUG EXECUTOR ERROR WARNING PORTEVENT TIMEROP VERDICTOP DEFAULTOP TESTCASE ACTION USER FUNCTION STATISTICS PARALLEL MATCHING DEBUG LOG_ALL LOG_NOTHING ACTION_UNQUALIFIED DEBUG_ENCDEC DEBUG_TESTPORT DEBUG_UNQUALIFIED DEFAULTOP_ACTIVATE DEFAULTOP_DEACTIVATE DEFAULTOP_EXIT DEFAULTOP_UNQUALIFIED ERROR_UNQUALIFIED EXECUTOR_COMPONENT EXECUTOR_CONFIGDATA EXECUTOR_EXTCOMMAND EXECUTOR_LOGOPTIONS EXECUTOR_RUNTIME EXECUTOR_UNQUALIFIED FUNCTION_RND FUNCTION_UNQUALIFIED MATCHING_DONE MATCHING_MCSUCCESS MATCHING_MCUNSUCC MATCHING_MMSUCCESS MATCHING_MMUNSUCC MATCHING_PCSUCCESS MATCHING_PCUNSUCC MATCHING_PMSUCCESS MATCHING_PMUNSUCC MATCHING_PROBLEM MATCHING_TIMEOUT MATCHING_UNQUALIFIED PARALLEL_PORTCONN PARALLEL_PORTMAP PARALLEL_PTC PARALLEL_UNQUALIFIED PORTEVENT_DUALRECV PORTEVENT_DUALSEND PORTEVENT_MCRECV PORTEVENT_MCSEND PORTEVENT_MMRECV PORTEVENT_MMSEND PORTEVENT_MQUEUE PORTEVENT_PCIN PORTEVENT_PCOUT PORTEVENT_PMIN PORTEVENT_PMOUT PORTEVENT_PQUEUE PORTEVENT_STATE PORTEVENT_UNQUALIFIED STATISTICS_UNQUALIFIED STATISTICS_VERDICT TESTCASE_FINISH TESTCASE_START TESTCASE_UNQUALIFIED TIMEROP_GUARD TIMEROP_READ TIMEROP_START TIMEROP_STOP TIMEROP_TIMEOUT TIMEROP_UNQUALIFIED USER_UNQUALIFIED VERDICTOP_FINAL VERDICTOP_GETVERDICT VERDICTOP_SETVERDICT VERDICTOP_UNQUALIFIED WARNING_UNQUALIFIED"),
  externalCommands: words$2("BeginControlPart EndControlPart BeginTestCase EndTestCase")
};
var keywords$6 = parserConfig.keywords, fileNCtrlMaskOptions = parserConfig.fileNCtrlMaskOptions, externalCommands = parserConfig.externalCommands, indentStatements = parserConfig.indentStatements !== false;
var isOperatorChar$2 = /[\|]/;
var curPunc$2;
function tokenBase$6(stream, state) {
  var ch2 = stream.next();
  if (ch2 == '"' || ch2 == "'") {
    state.tokenize = tokenString$4(ch2);
    return state.tokenize(stream, state);
  }
  if (/[:=]/.test(ch2)) {
    curPunc$2 = ch2;
    return "punctuation";
  }
  if (ch2 == "#") {
    stream.skipToEnd();
    return "comment";
  }
  if (/\d/.test(ch2)) {
    stream.eatWhile(/[\w\.]/);
    return "number";
  }
  if (isOperatorChar$2.test(ch2)) {
    stream.eatWhile(isOperatorChar$2);
    return "operator";
  }
  if (ch2 == "[") {
    stream.eatWhile(/[\w_\]]/);
    return "number";
  }
  stream.eatWhile(/[\w\$_]/);
  var cur = stream.current();
  if (keywords$6.propertyIsEnumerable(cur)) return "keyword";
  if (fileNCtrlMaskOptions.propertyIsEnumerable(cur))
    return "atom";
  if (externalCommands.propertyIsEnumerable(cur)) return "deleted";
  return "variable";
}
function tokenString$4(quote2) {
  return function(stream, state) {
    var escaped = false, next2, end2 = false;
    while ((next2 = stream.next()) != null) {
      if (next2 == quote2 && !escaped) {
        var afterNext = stream.peek();
        if (afterNext) {
          afterNext = afterNext.toLowerCase();
          if (afterNext == "b" || afterNext == "h" || afterNext == "o")
            stream.next();
        }
        end2 = true;
        break;
      }
      escaped = !escaped && next2 == "\\";
    }
    if (end2 || false)
      state.tokenize = null;
    return "string";
  };
}
function Context$1(indented, column, type2, align, prev) {
  this.indented = indented;
  this.column = column;
  this.type = type2;
  this.align = align;
  this.prev = prev;
}
function pushContext$2(state, col, type2) {
  var indent2 = state.indented;
  if (state.context && state.context.type == "statement")
    indent2 = state.context.indented;
  return state.context = new Context$1(indent2, col, type2, null, state.context);
}
function popContext$2(state) {
  var t = state.context.type;
  if (t == ")" || t == "]" || t == "}")
    state.indented = state.context.indented;
  return state.context = state.context.prev;
}
const ttcnCfg = {
  name: "ttcn",
  startState: function() {
    return {
      tokenize: null,
      context: new Context$1(0, 0, "top", false),
      indented: 0,
      startOfLine: true
    };
  },
  token: function(stream, state) {
    var ctx = state.context;
    if (stream.sol()) {
      if (ctx.align == null) ctx.align = false;
      state.indented = stream.indentation();
      state.startOfLine = true;
    }
    if (stream.eatSpace()) return null;
    curPunc$2 = null;
    var style2 = (state.tokenize || tokenBase$6)(stream, state);
    if (style2 == "comment") return style2;
    if (ctx.align == null) ctx.align = true;
    if ((curPunc$2 == ";" || curPunc$2 == ":" || curPunc$2 == ",") && ctx.type == "statement") {
      popContext$2(state);
    } else if (curPunc$2 == "{") pushContext$2(state, stream.column(), "}");
    else if (curPunc$2 == "[") pushContext$2(state, stream.column(), "]");
    else if (curPunc$2 == "(") pushContext$2(state, stream.column(), ")");
    else if (curPunc$2 == "}") {
      while (ctx.type == "statement") ctx = popContext$2(state);
      if (ctx.type == "}") ctx = popContext$2(state);
      while (ctx.type == "statement") ctx = popContext$2(state);
    } else if (curPunc$2 == ctx.type) popContext$2(state);
    else if (indentStatements && ((ctx.type == "}" || ctx.type == "top") && curPunc$2 != ";" || ctx.type == "statement" && curPunc$2 == "newstatement"))
      pushContext$2(state, stream.column(), "statement");
    state.startOfLine = false;
    return style2;
  },
  languageData: {
    indentOnInput: /^\s*[{}]$/,
    commentTokens: { line: "#" }
  }
};
const ttcnCfg$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  ttcnCfg
});
var curPunc$1;
function wordRegexp$3(words2) {
  return new RegExp("^(?:" + words2.join("|") + ")$", "i");
}
wordRegexp$3([]);
var keywords$5 = wordRegexp$3(["@prefix", "@base", "a"]);
var operatorChars = /[*+\-<>=&|]/;
function tokenBase$5(stream, state) {
  var ch2 = stream.next();
  curPunc$1 = null;
  if (ch2 == "<" && !stream.match(/^[\s\u00a0=]/, false)) {
    stream.match(/^[^\s\u00a0>]*>?/);
    return "atom";
  } else if (ch2 == '"' || ch2 == "'") {
    state.tokenize = tokenLiteral(ch2);
    return state.tokenize(stream, state);
  } else if (/[{}\(\),\.;\[\]]/.test(ch2)) {
    curPunc$1 = ch2;
    return null;
  } else if (ch2 == "#") {
    stream.skipToEnd();
    return "comment";
  } else if (operatorChars.test(ch2)) {
    stream.eatWhile(operatorChars);
    return null;
  } else if (ch2 == ":") {
    return "operator";
  } else {
    stream.eatWhile(/[_\w\d]/);
    if (stream.peek() == ":") {
      return "variableName.special";
    } else {
      var word = stream.current();
      if (keywords$5.test(word)) {
        return "meta";
      }
      if (ch2 >= "A" && ch2 <= "Z") {
        return "comment";
      } else {
        return "keyword";
      }
    }
    var word = stream.current();
  }
}
function tokenLiteral(quote2) {
  return function(stream, state) {
    var escaped = false, ch2;
    while ((ch2 = stream.next()) != null) {
      if (ch2 == quote2 && !escaped) {
        state.tokenize = tokenBase$5;
        break;
      }
      escaped = !escaped && ch2 == "\\";
    }
    return "string";
  };
}
function pushContext$1(state, type2, col) {
  state.context = { prev: state.context, indent: state.indent, col, type: type2 };
}
function popContext$1(state) {
  state.indent = state.context.indent;
  state.context = state.context.prev;
}
const turtle = {
  name: "turtle",
  startState: function() {
    return {
      tokenize: tokenBase$5,
      context: null,
      indent: 0,
      col: 0
    };
  },
  token: function(stream, state) {
    if (stream.sol()) {
      if (state.context && state.context.align == null) state.context.align = false;
      state.indent = stream.indentation();
    }
    if (stream.eatSpace()) return null;
    var style2 = state.tokenize(stream, state);
    if (style2 != "comment" && state.context && state.context.align == null && state.context.type != "pattern") {
      state.context.align = true;
    }
    if (curPunc$1 == "(") pushContext$1(state, ")", stream.column());
    else if (curPunc$1 == "[") pushContext$1(state, "]", stream.column());
    else if (curPunc$1 == "{") pushContext$1(state, "}", stream.column());
    else if (/[\]\}\)]/.test(curPunc$1)) {
      while (state.context && state.context.type == "pattern") popContext$1(state);
      if (state.context && curPunc$1 == state.context.type) popContext$1(state);
    } else if (curPunc$1 == "." && state.context && state.context.type == "pattern") popContext$1(state);
    else if (/atom|string|variable/.test(style2) && state.context) {
      if (/[\}\]]/.test(state.context.type))
        pushContext$1(state, "pattern", stream.column());
      else if (state.context.type == "pattern" && !state.context.align) {
        state.context.align = true;
        state.context.col = stream.column();
      }
    }
    return style2;
  },
  indent: function(state, textAfter, cx2) {
    var firstChar = textAfter && textAfter.charAt(0);
    var context = state.context;
    if (/[\]\}]/.test(firstChar))
      while (context && context.type == "pattern") context = context.prev;
    var closing2 = context && firstChar == context.type;
    if (!context)
      return 0;
    else if (context.type == "pattern")
      return context.col;
    else if (context.align)
      return context.col + (closing2 ? 0 : 1);
    else
      return context.indent + (closing2 ? 0 : cx2.unit);
  },
  languageData: {
    commentTokens: { line: "#" }
  }
};
const turtle$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  turtle
});
function wordRegexp$2(words2) {
  return new RegExp("^((" + words2.join(")|(") + "))\\b");
}
var builtinArray = [
  "Clamp",
  "Constructor",
  "EnforceRange",
  "Exposed",
  "ImplicitThis",
  "Global",
  "PrimaryGlobal",
  "LegacyArrayClass",
  "LegacyUnenumerableNamedProperties",
  "LenientThis",
  "NamedConstructor",
  "NewObject",
  "NoInterfaceObject",
  "OverrideBuiltins",
  "PutForwards",
  "Replaceable",
  "SameObject",
  "TreatNonObjectAsNull",
  "TreatNullAs",
  "EmptyString",
  "Unforgeable",
  "Unscopeable"
];
var builtins = wordRegexp$2(builtinArray);
var typeArray = [
  "unsigned",
  "short",
  "long",
  // UnsignedIntegerType
  "unrestricted",
  "float",
  "double",
  // UnrestrictedFloatType
  "boolean",
  "byte",
  "octet",
  // Rest of PrimitiveType
  "Promise",
  // PromiseType
  "ArrayBuffer",
  "DataView",
  "Int8Array",
  "Int16Array",
  "Int32Array",
  "Uint8Array",
  "Uint16Array",
  "Uint32Array",
  "Uint8ClampedArray",
  "Float32Array",
  "Float64Array",
  // BufferRelatedType
  "ByteString",
  "DOMString",
  "USVString",
  "sequence",
  "object",
  "RegExp",
  "Error",
  "DOMException",
  "FrozenArray",
  // Rest of NonAnyType
  "any",
  // Rest of SingleType
  "void"
  // Rest of ReturnType
];
var types$1 = wordRegexp$2(typeArray);
var keywordArray = [
  "attribute",
  "callback",
  "const",
  "deleter",
  "dictionary",
  "enum",
  "getter",
  "implements",
  "inherit",
  "interface",
  "iterable",
  "legacycaller",
  "maplike",
  "partial",
  "required",
  "serializer",
  "setlike",
  "setter",
  "static",
  "stringifier",
  "typedef",
  // ArgumentNameKeyword except
  // "unrestricted"
  "optional",
  "readonly",
  "or"
];
var keywords$4 = wordRegexp$2(keywordArray);
var atomArray = [
  "true",
  "false",
  // BooleanLiteral
  "Infinity",
  "NaN",
  // FloatLiteral
  "null"
  // Rest of ConstValue
];
var atoms$1 = wordRegexp$2(atomArray);
var startDefArray = ["callback", "dictionary", "enum", "interface"];
var startDefs = wordRegexp$2(startDefArray);
var endDefArray = ["typedef"];
var endDefs = wordRegexp$2(endDefArray);
var singleOperators$1 = /^[:<=>?]/;
var integers = /^-?([1-9][0-9]*|0[Xx][0-9A-Fa-f]+|0[0-7]*)/;
var floats = /^-?(([0-9]+\.[0-9]*|[0-9]*\.[0-9]+)([Ee][+-]?[0-9]+)?|[0-9]+[Ee][+-]?[0-9]+)/;
var identifiers$1 = /^_?[A-Za-z][0-9A-Z_a-z-]*/;
var identifiersEnd = /^_?[A-Za-z][0-9A-Z_a-z-]*(?=\s*;)/;
var strings = /^"[^"]*"/;
var multilineComments = /^\/\*.*?\*\//;
var multilineCommentsStart = /^\/\*.*/;
var multilineCommentsEnd = /^.*?\*\//;
function readToken(stream, state) {
  if (stream.eatSpace()) return null;
  if (state.inComment) {
    if (stream.match(multilineCommentsEnd)) {
      state.inComment = false;
      return "comment";
    }
    stream.skipToEnd();
    return "comment";
  }
  if (stream.match("//")) {
    stream.skipToEnd();
    return "comment";
  }
  if (stream.match(multilineComments)) return "comment";
  if (stream.match(multilineCommentsStart)) {
    state.inComment = true;
    return "comment";
  }
  if (stream.match(/^-?[0-9\.]/, false)) {
    if (stream.match(integers) || stream.match(floats)) return "number";
  }
  if (stream.match(strings)) return "string";
  if (state.startDef && stream.match(identifiers$1)) return "def";
  if (state.endDef && stream.match(identifiersEnd)) {
    state.endDef = false;
    return "def";
  }
  if (stream.match(keywords$4)) return "keyword";
  if (stream.match(types$1)) {
    var lastToken = state.lastToken;
    var nextToken2 = (stream.match(/^\s*(.+?)\b/, false) || [])[1];
    if (lastToken === ":" || lastToken === "implements" || nextToken2 === "implements" || nextToken2 === "=") {
      return "builtin";
    } else {
      return "type";
    }
  }
  if (stream.match(builtins)) return "builtin";
  if (stream.match(atoms$1)) return "atom";
  if (stream.match(identifiers$1)) return "variable";
  if (stream.match(singleOperators$1)) return "operator";
  stream.next();
  return null;
}
const webIDL = {
  name: "webidl",
  startState: function() {
    return {
      // Is in multiline comment
      inComment: false,
      // Last non-whitespace, matched token
      lastToken: "",
      // Next token is a definition
      startDef: false,
      // Last token of the statement is a definition
      endDef: false
    };
  },
  token: function(stream, state) {
    var style2 = readToken(stream, state);
    if (style2) {
      var cur = stream.current();
      state.lastToken = cur;
      if (style2 === "keyword") {
        state.startDef = startDefs.test(cur);
        state.endDef = state.endDef || endDefs.test(cur);
      } else {
        state.startDef = false;
      }
    }
    return style2;
  },
  languageData: {
    autocomplete: builtinArray.concat(typeArray).concat(keywordArray).concat(atomArray)
  }
};
const webidl = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  webIDL
});
var ERRORCLASS = "error";
function wordRegexp$1(words2) {
  return new RegExp("^((" + words2.join(")|(") + "))\\b", "i");
}
var singleOperators = new RegExp("^[\\+\\-\\*/%&\\\\|\\^~<>!]");
var singleDelimiters = new RegExp("^[\\(\\)\\[\\]\\{\\}@,:`=;\\.]");
var doubleOperators = new RegExp("^((==)|(<>)|(<=)|(>=)|(<>)|(<<)|(>>)|(//)|(\\*\\*))");
var doubleDelimiters = new RegExp("^((\\+=)|(\\-=)|(\\*=)|(%=)|(/=)|(&=)|(\\|=)|(\\^=))");
var tripleDelimiters = new RegExp("^((//=)|(>>=)|(<<=)|(\\*\\*=))");
var identifiers = new RegExp("^[_A-Za-z][_A-Za-z0-9]*");
var openingKeywords = ["class", "module", "sub", "enum", "select", "while", "if", "function", "get", "set", "property", "try", "structure", "synclock", "using", "with"];
var middleKeywords = ["else", "elseif", "case", "catch", "finally"];
var endKeywords = ["next", "loop"];
var operatorKeywords = ["and", "andalso", "or", "orelse", "xor", "in", "not", "is", "isnot", "like"];
var wordOperators = wordRegexp$1(operatorKeywords);
var commonKeywords = ["#const", "#else", "#elseif", "#end", "#if", "#region", "addhandler", "addressof", "alias", "as", "byref", "byval", "cbool", "cbyte", "cchar", "cdate", "cdbl", "cdec", "cint", "clng", "cobj", "compare", "const", "continue", "csbyte", "cshort", "csng", "cstr", "cuint", "culng", "cushort", "declare", "default", "delegate", "dim", "directcast", "each", "erase", "error", "event", "exit", "explicit", "false", "for", "friend", "gettype", "goto", "handles", "implements", "imports", "infer", "inherits", "interface", "isfalse", "istrue", "lib", "me", "mod", "mustinherit", "mustoverride", "my", "mybase", "myclass", "namespace", "narrowing", "new", "nothing", "notinheritable", "notoverridable", "of", "off", "on", "operator", "option", "optional", "out", "overloads", "overridable", "overrides", "paramarray", "partial", "private", "protected", "public", "raiseevent", "readonly", "redim", "removehandler", "resume", "return", "shadows", "shared", "static", "step", "stop", "strict", "then", "throw", "to", "true", "trycast", "typeof", "until", "until", "when", "widening", "withevents", "writeonly"];
var commontypes = ["object", "boolean", "char", "string", "byte", "sbyte", "short", "ushort", "int16", "uint16", "integer", "uinteger", "int32", "uint32", "long", "ulong", "int64", "uint64", "decimal", "single", "double", "float", "date", "datetime", "intptr", "uintptr"];
var keywords$3 = wordRegexp$1(commonKeywords);
var types = wordRegexp$1(commontypes);
var stringPrefixes = '"';
var opening = wordRegexp$1(openingKeywords);
var middle = wordRegexp$1(middleKeywords);
var closing = wordRegexp$1(endKeywords);
var doubleClosing = wordRegexp$1(["end"]);
var doOpening = wordRegexp$1(["do"]);
function indent(_stream, state) {
  state.currentIndent++;
}
function dedent(_stream, state) {
  state.currentIndent--;
}
function tokenBase$4(stream, state) {
  if (stream.eatSpace()) {
    return null;
  }
  var ch2 = stream.peek();
  if (ch2 === "'") {
    stream.skipToEnd();
    return "comment";
  }
  if (stream.match(/^((&H)|(&O))?[0-9\.a-f]/i, false)) {
    var floatLiteral = false;
    if (stream.match(/^\d*\.\d+F?/i)) {
      floatLiteral = true;
    } else if (stream.match(/^\d+\.\d*F?/)) {
      floatLiteral = true;
    } else if (stream.match(/^\.\d+F?/)) {
      floatLiteral = true;
    }
    if (floatLiteral) {
      stream.eat(/J/i);
      return "number";
    }
    var intLiteral = false;
    if (stream.match(/^&H[0-9a-f]+/i)) {
      intLiteral = true;
    } else if (stream.match(/^&O[0-7]+/i)) {
      intLiteral = true;
    } else if (stream.match(/^[1-9]\d*F?/)) {
      stream.eat(/J/i);
      intLiteral = true;
    } else if (stream.match(/^0(?![\dx])/i)) {
      intLiteral = true;
    }
    if (intLiteral) {
      stream.eat(/L/i);
      return "number";
    }
  }
  if (stream.match(stringPrefixes)) {
    state.tokenize = tokenStringFactory(stream.current());
    return state.tokenize(stream, state);
  }
  if (stream.match(tripleDelimiters) || stream.match(doubleDelimiters)) {
    return null;
  }
  if (stream.match(doubleOperators) || stream.match(singleOperators) || stream.match(wordOperators)) {
    return "operator";
  }
  if (stream.match(singleDelimiters)) {
    return null;
  }
  if (stream.match(doOpening)) {
    indent(stream, state);
    state.doInCurrentLine = true;
    return "keyword";
  }
  if (stream.match(opening)) {
    if (!state.doInCurrentLine)
      indent(stream, state);
    else
      state.doInCurrentLine = false;
    return "keyword";
  }
  if (stream.match(middle)) {
    return "keyword";
  }
  if (stream.match(doubleClosing)) {
    dedent(stream, state);
    dedent(stream, state);
    return "keyword";
  }
  if (stream.match(closing)) {
    dedent(stream, state);
    return "keyword";
  }
  if (stream.match(types)) {
    return "keyword";
  }
  if (stream.match(keywords$3)) {
    return "keyword";
  }
  if (stream.match(identifiers)) {
    return "variable";
  }
  stream.next();
  return ERRORCLASS;
}
function tokenStringFactory(delimiter2) {
  var singleline = delimiter2.length == 1;
  var OUTCLASS = "string";
  return function(stream, state) {
    while (!stream.eol()) {
      stream.eatWhile(/[^'"]/);
      if (stream.match(delimiter2)) {
        state.tokenize = tokenBase$4;
        return OUTCLASS;
      } else {
        stream.eat(/['"]/);
      }
    }
    if (singleline) {
      state.tokenize = tokenBase$4;
    }
    return OUTCLASS;
  };
}
function tokenLexer(stream, state) {
  var style2 = state.tokenize(stream, state);
  var current = stream.current();
  if (current === ".") {
    style2 = state.tokenize(stream, state);
    if (style2 === "variable") {
      return "variable";
    } else {
      return ERRORCLASS;
    }
  }
  var delimiter_index = "[({".indexOf(current);
  if (delimiter_index !== -1) {
    indent(stream, state);
  }
  delimiter_index = "])}".indexOf(current);
  if (delimiter_index !== -1) {
    if (dedent(stream, state)) {
      return ERRORCLASS;
    }
  }
  return style2;
}
const vb = {
  name: "vb",
  startState: function() {
    return {
      tokenize: tokenBase$4,
      lastToken: null,
      currentIndent: 0,
      nextLineIndent: 0,
      doInCurrentLine: false
    };
  },
  token: function(stream, state) {
    if (stream.sol()) {
      state.currentIndent += state.nextLineIndent;
      state.nextLineIndent = 0;
      state.doInCurrentLine = 0;
    }
    var style2 = tokenLexer(stream, state);
    state.lastToken = { style: style2, content: stream.current() };
    return style2;
  },
  indent: function(state, textAfter, cx2) {
    var trueText = textAfter.replace(/^\s+|\s+$/g, "");
    if (trueText.match(closing) || trueText.match(doubleClosing) || trueText.match(middle)) return cx2.unit * (state.currentIndent - 1);
    if (state.currentIndent < 0) return 0;
    return state.currentIndent * cx2.unit;
  },
  languageData: {
    closeBrackets: { brackets: ["(", "[", "{", '"'] },
    commentTokens: { line: "'" },
    autocomplete: openingKeywords.concat(middleKeywords).concat(endKeywords).concat(operatorKeywords).concat(commonKeywords).concat(commontypes)
  }
};
const vb$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  vb
});
function mkVBScript(parserConf) {
  var ERRORCLASS2 = "error";
  function wordRegexp2(words2) {
    return new RegExp("^((" + words2.join(")|(") + "))\\b", "i");
  }
  var singleOperators2 = new RegExp("^[\\+\\-\\*/&\\\\\\^<>=]");
  var doubleOperators2 = new RegExp("^((<>)|(<=)|(>=))");
  var singleDelimiters2 = new RegExp("^[\\.,]");
  var brackets2 = new RegExp("^[\\(\\)]");
  var identifiers2 = new RegExp("^[A-Za-z][_A-Za-z0-9]*");
  var openingKeywords2 = ["class", "sub", "select", "while", "if", "function", "property", "with", "for"];
  var middleKeywords2 = ["else", "elseif", "case"];
  var endKeywords2 = ["next", "loop", "wend"];
  var wordOperators2 = wordRegexp2(["and", "or", "not", "xor", "is", "mod", "eqv", "imp"]);
  var commonkeywords = [
    "dim",
    "redim",
    "then",
    "until",
    "randomize",
    "byval",
    "byref",
    "new",
    "property",
    "exit",
    "in",
    "const",
    "private",
    "public",
    "get",
    "set",
    "let",
    "stop",
    "on error resume next",
    "on error goto 0",
    "option explicit",
    "call",
    "me"
  ];
  var atomWords2 = ["true", "false", "nothing", "empty", "null"];
  var builtinFuncsWords = [
    "abs",
    "array",
    "asc",
    "atn",
    "cbool",
    "cbyte",
    "ccur",
    "cdate",
    "cdbl",
    "chr",
    "cint",
    "clng",
    "cos",
    "csng",
    "cstr",
    "date",
    "dateadd",
    "datediff",
    "datepart",
    "dateserial",
    "datevalue",
    "day",
    "escape",
    "eval",
    "execute",
    "exp",
    "filter",
    "formatcurrency",
    "formatdatetime",
    "formatnumber",
    "formatpercent",
    "getlocale",
    "getobject",
    "getref",
    "hex",
    "hour",
    "inputbox",
    "instr",
    "instrrev",
    "int",
    "fix",
    "isarray",
    "isdate",
    "isempty",
    "isnull",
    "isnumeric",
    "isobject",
    "join",
    "lbound",
    "lcase",
    "left",
    "len",
    "loadpicture",
    "log",
    "ltrim",
    "rtrim",
    "trim",
    "maths",
    "mid",
    "minute",
    "month",
    "monthname",
    "msgbox",
    "now",
    "oct",
    "replace",
    "rgb",
    "right",
    "rnd",
    "round",
    "scriptengine",
    "scriptenginebuildversion",
    "scriptenginemajorversion",
    "scriptengineminorversion",
    "second",
    "setlocale",
    "sgn",
    "sin",
    "space",
    "split",
    "sqr",
    "strcomp",
    "string",
    "strreverse",
    "tan",
    "time",
    "timer",
    "timeserial",
    "timevalue",
    "typename",
    "ubound",
    "ucase",
    "unescape",
    "vartype",
    "weekday",
    "weekdayname",
    "year"
  ];
  var builtinConsts = [
    "vbBlack",
    "vbRed",
    "vbGreen",
    "vbYellow",
    "vbBlue",
    "vbMagenta",
    "vbCyan",
    "vbWhite",
    "vbBinaryCompare",
    "vbTextCompare",
    "vbSunday",
    "vbMonday",
    "vbTuesday",
    "vbWednesday",
    "vbThursday",
    "vbFriday",
    "vbSaturday",
    "vbUseSystemDayOfWeek",
    "vbFirstJan1",
    "vbFirstFourDays",
    "vbFirstFullWeek",
    "vbGeneralDate",
    "vbLongDate",
    "vbShortDate",
    "vbLongTime",
    "vbShortTime",
    "vbObjectError",
    "vbOKOnly",
    "vbOKCancel",
    "vbAbortRetryIgnore",
    "vbYesNoCancel",
    "vbYesNo",
    "vbRetryCancel",
    "vbCritical",
    "vbQuestion",
    "vbExclamation",
    "vbInformation",
    "vbDefaultButton1",
    "vbDefaultButton2",
    "vbDefaultButton3",
    "vbDefaultButton4",
    "vbApplicationModal",
    "vbSystemModal",
    "vbOK",
    "vbCancel",
    "vbAbort",
    "vbRetry",
    "vbIgnore",
    "vbYes",
    "vbNo",
    "vbCr",
    "VbCrLf",
    "vbFormFeed",
    "vbLf",
    "vbNewLine",
    "vbNullChar",
    "vbNullString",
    "vbTab",
    "vbVerticalTab",
    "vbUseDefault",
    "vbTrue",
    "vbFalse",
    "vbEmpty",
    "vbNull",
    "vbInteger",
    "vbLong",
    "vbSingle",
    "vbDouble",
    "vbCurrency",
    "vbDate",
    "vbString",
    "vbObject",
    "vbError",
    "vbBoolean",
    "vbVariant",
    "vbDataObject",
    "vbDecimal",
    "vbByte",
    "vbArray"
  ];
  var builtinObjsWords = ["WScript", "err", "debug", "RegExp"];
  var knownProperties = ["description", "firstindex", "global", "helpcontext", "helpfile", "ignorecase", "length", "number", "pattern", "source", "value", "count"];
  var knownMethods = ["clear", "execute", "raise", "replace", "test", "write", "writeline", "close", "open", "state", "eof", "update", "addnew", "end", "createobject", "quit"];
  var aspBuiltinObjsWords = ["server", "response", "request", "session", "application"];
  var aspKnownProperties = [
    "buffer",
    "cachecontrol",
    "charset",
    "contenttype",
    "expires",
    "expiresabsolute",
    "isclientconnected",
    "pics",
    "status",
    //response
    "clientcertificate",
    "cookies",
    "form",
    "querystring",
    "servervariables",
    "totalbytes",
    //request
    "contents",
    "staticobjects",
    //application
    "codepage",
    "lcid",
    "sessionid",
    "timeout",
    //session
    "scripttimeout"
  ];
  var aspKnownMethods = [
    "addheader",
    "appendtolog",
    "binarywrite",
    "end",
    "flush",
    "redirect",
    //response
    "binaryread",
    //request
    "remove",
    "removeall",
    "lock",
    "unlock",
    //application
    "abandon",
    //session
    "getlasterror",
    "htmlencode",
    "mappath",
    "transfer",
    "urlencode"
  ];
  var knownWords = knownMethods.concat(knownProperties);
  builtinObjsWords = builtinObjsWords.concat(builtinConsts);
  if (parserConf.isASP) {
    builtinObjsWords = builtinObjsWords.concat(aspBuiltinObjsWords);
    knownWords = knownWords.concat(aspKnownMethods, aspKnownProperties);
  }
  var keywords2 = wordRegexp2(commonkeywords);
  var atoms2 = wordRegexp2(atomWords2);
  var builtinFuncs = wordRegexp2(builtinFuncsWords);
  var builtinObjs = wordRegexp2(builtinObjsWords);
  var known = wordRegexp2(knownWords);
  var stringPrefixes2 = '"';
  var opening2 = wordRegexp2(openingKeywords2);
  var middle2 = wordRegexp2(middleKeywords2);
  var closing2 = wordRegexp2(endKeywords2);
  var doubleClosing2 = wordRegexp2(["end"]);
  var doOpening2 = wordRegexp2(["do"]);
  var noIndentWords = wordRegexp2(["on error resume next", "exit"]);
  var comment2 = wordRegexp2(["rem"]);
  function indent2(_stream, state) {
    state.currentIndent++;
  }
  function dedent2(_stream, state) {
    state.currentIndent--;
  }
  function tokenBase2(stream, state) {
    if (stream.eatSpace()) {
      return null;
    }
    var ch2 = stream.peek();
    if (ch2 === "'") {
      stream.skipToEnd();
      return "comment";
    }
    if (stream.match(comment2)) {
      stream.skipToEnd();
      return "comment";
    }
    if (stream.match(/^((&H)|(&O))?[0-9\.]/i, false) && !stream.match(/^((&H)|(&O))?[0-9\.]+[a-z_]/i, false)) {
      var floatLiteral = false;
      if (stream.match(/^\d*\.\d+/i)) {
        floatLiteral = true;
      } else if (stream.match(/^\d+\.\d*/)) {
        floatLiteral = true;
      } else if (stream.match(/^\.\d+/)) {
        floatLiteral = true;
      }
      if (floatLiteral) {
        stream.eat(/J/i);
        return "number";
      }
      var intLiteral = false;
      if (stream.match(/^&H[0-9a-f]+/i)) {
        intLiteral = true;
      } else if (stream.match(/^&O[0-7]+/i)) {
        intLiteral = true;
      } else if (stream.match(/^[1-9]\d*F?/)) {
        stream.eat(/J/i);
        intLiteral = true;
      } else if (stream.match(/^0(?![\dx])/i)) {
        intLiteral = true;
      }
      if (intLiteral) {
        stream.eat(/L/i);
        return "number";
      }
    }
    if (stream.match(stringPrefixes2)) {
      state.tokenize = tokenStringFactory2(stream.current());
      return state.tokenize(stream, state);
    }
    if (stream.match(doubleOperators2) || stream.match(singleOperators2) || stream.match(wordOperators2)) {
      return "operator";
    }
    if (stream.match(singleDelimiters2)) {
      return null;
    }
    if (stream.match(brackets2)) {
      return "bracket";
    }
    if (stream.match(noIndentWords)) {
      state.doInCurrentLine = true;
      return "keyword";
    }
    if (stream.match(doOpening2)) {
      indent2(stream, state);
      state.doInCurrentLine = true;
      return "keyword";
    }
    if (stream.match(opening2)) {
      if (!state.doInCurrentLine)
        indent2(stream, state);
      else
        state.doInCurrentLine = false;
      return "keyword";
    }
    if (stream.match(middle2)) {
      return "keyword";
    }
    if (stream.match(doubleClosing2)) {
      dedent2(stream, state);
      dedent2(stream, state);
      return "keyword";
    }
    if (stream.match(closing2)) {
      if (!state.doInCurrentLine)
        dedent2(stream, state);
      else
        state.doInCurrentLine = false;
      return "keyword";
    }
    if (stream.match(keywords2)) {
      return "keyword";
    }
    if (stream.match(atoms2)) {
      return "atom";
    }
    if (stream.match(known)) {
      return "variableName.special";
    }
    if (stream.match(builtinFuncs)) {
      return "builtin";
    }
    if (stream.match(builtinObjs)) {
      return "builtin";
    }
    if (stream.match(identifiers2)) {
      return "variable";
    }
    stream.next();
    return ERRORCLASS2;
  }
  function tokenStringFactory2(delimiter2) {
    var singleline = delimiter2.length == 1;
    var OUTCLASS = "string";
    return function(stream, state) {
      while (!stream.eol()) {
        stream.eatWhile(/[^'"]/);
        if (stream.match(delimiter2)) {
          state.tokenize = tokenBase2;
          return OUTCLASS;
        } else {
          stream.eat(/['"]/);
        }
      }
      if (singleline) {
        state.tokenize = tokenBase2;
      }
      return OUTCLASS;
    };
  }
  function tokenLexer2(stream, state) {
    var style2 = state.tokenize(stream, state);
    var current = stream.current();
    if (current === ".") {
      style2 = state.tokenize(stream, state);
      current = stream.current();
      if (style2 && (style2.substr(0, 8) === "variable" || style2 === "builtin" || style2 === "keyword")) {
        if (style2 === "builtin" || style2 === "keyword") style2 = "variable";
        if (knownWords.indexOf(current.substr(1)) > -1) style2 = "keyword";
        return style2;
      } else {
        return ERRORCLASS2;
      }
    }
    return style2;
  }
  return {
    name: "vbscript",
    startState: function() {
      return {
        tokenize: tokenBase2,
        lastToken: null,
        currentIndent: 0,
        nextLineIndent: 0,
        doInCurrentLine: false,
        ignoreKeyword: false
      };
    },
    token: function(stream, state) {
      if (stream.sol()) {
        state.currentIndent += state.nextLineIndent;
        state.nextLineIndent = 0;
        state.doInCurrentLine = 0;
      }
      var style2 = tokenLexer2(stream, state);
      state.lastToken = { style: style2, content: stream.current() };
      if (style2 === null) style2 = null;
      return style2;
    },
    indent: function(state, textAfter, cx2) {
      var trueText = textAfter.replace(/^\s+|\s+$/g, "");
      if (trueText.match(closing2) || trueText.match(doubleClosing2) || trueText.match(middle2)) return cx2.unit * (state.currentIndent - 1);
      if (state.currentIndent < 0) return 0;
      return state.currentIndent * cx2.unit;
    }
  };
}
const vbScript = mkVBScript({});
mkVBScript({ isASP: true });
const vbscript = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  vbScript
});
function parseWords(str) {
  var obj = {}, words2 = str.split(" ");
  for (var i2 = 0; i2 < words2.length; ++i2) obj[words2[i2]] = true;
  return obj;
}
var keywords$2 = parseWords("#end #else #break #stop #[[ #]] #{end} #{else} #{break} #{stop}");
var functions = parseWords("#if #elseif #foreach #set #include #parse #macro #define #evaluate #{if} #{elseif} #{foreach} #{set} #{include} #{parse} #{macro} #{define} #{evaluate}");
var specials = parseWords("$foreach.count $foreach.hasNext $foreach.first $foreach.last $foreach.topmost $foreach.parent.count $foreach.parent.hasNext $foreach.parent.first $foreach.parent.last $foreach.parent $velocityCount $!bodyContent $bodyContent");
var isOperatorChar$1 = /[+\-*&%=<>!?:\/|]/;
function chain$1(stream, state, f) {
  state.tokenize = f;
  return f(stream, state);
}
function tokenBase$3(stream, state) {
  var beforeParams = state.beforeParams;
  state.beforeParams = false;
  var ch2 = stream.next();
  if (ch2 == "'" && !state.inString && state.inParams) {
    state.lastTokenWasBuiltin = false;
    return chain$1(stream, state, tokenString$3(ch2));
  } else if (ch2 == '"') {
    state.lastTokenWasBuiltin = false;
    if (state.inString) {
      state.inString = false;
      return "string";
    } else if (state.inParams)
      return chain$1(stream, state, tokenString$3(ch2));
  } else if (/[\[\]{}\(\),;\.]/.test(ch2)) {
    if (ch2 == "(" && beforeParams)
      state.inParams = true;
    else if (ch2 == ")") {
      state.inParams = false;
      state.lastTokenWasBuiltin = true;
    }
    return null;
  } else if (/\d/.test(ch2)) {
    state.lastTokenWasBuiltin = false;
    stream.eatWhile(/[\w\.]/);
    return "number";
  } else if (ch2 == "#" && stream.eat("*")) {
    state.lastTokenWasBuiltin = false;
    return chain$1(stream, state, tokenComment$2);
  } else if (ch2 == "#" && stream.match(/ *\[ *\[/)) {
    state.lastTokenWasBuiltin = false;
    return chain$1(stream, state, tokenUnparsed);
  } else if (ch2 == "#" && stream.eat("#")) {
    state.lastTokenWasBuiltin = false;
    stream.skipToEnd();
    return "comment";
  } else if (ch2 == "$") {
    stream.eat("!");
    stream.eatWhile(/[\w\d\$_\.{}-]/);
    if (specials && specials.propertyIsEnumerable(stream.current())) {
      return "keyword";
    } else {
      state.lastTokenWasBuiltin = true;
      state.beforeParams = true;
      return "builtin";
    }
  } else if (isOperatorChar$1.test(ch2)) {
    state.lastTokenWasBuiltin = false;
    stream.eatWhile(isOperatorChar$1);
    return "operator";
  } else {
    stream.eatWhile(/[\w\$_{}@]/);
    var word = stream.current();
    if (keywords$2 && keywords$2.propertyIsEnumerable(word))
      return "keyword";
    if (functions && functions.propertyIsEnumerable(word) || stream.current().match(/^#@?[a-z0-9_]+ *$/i) && stream.peek() == "(" && !(functions && functions.propertyIsEnumerable(word.toLowerCase()))) {
      state.beforeParams = true;
      state.lastTokenWasBuiltin = false;
      return "keyword";
    }
    if (state.inString) {
      state.lastTokenWasBuiltin = false;
      return "string";
    }
    if (stream.pos > word.length && stream.string.charAt(stream.pos - word.length - 1) == "." && state.lastTokenWasBuiltin)
      return "builtin";
    state.lastTokenWasBuiltin = false;
    return null;
  }
}
function tokenString$3(quote2) {
  return function(stream, state) {
    var escaped = false, next2, end2 = false;
    while ((next2 = stream.next()) != null) {
      if (next2 == quote2 && !escaped) {
        end2 = true;
        break;
      }
      if (quote2 == '"' && stream.peek() == "$" && !escaped) {
        state.inString = true;
        end2 = true;
        break;
      }
      escaped = !escaped && next2 == "\\";
    }
    if (end2) state.tokenize = tokenBase$3;
    return "string";
  };
}
function tokenComment$2(stream, state) {
  var maybeEnd = false, ch2;
  while (ch2 = stream.next()) {
    if (ch2 == "#" && maybeEnd) {
      state.tokenize = tokenBase$3;
      break;
    }
    maybeEnd = ch2 == "*";
  }
  return "comment";
}
function tokenUnparsed(stream, state) {
  var maybeEnd = 0, ch2;
  while (ch2 = stream.next()) {
    if (ch2 == "#" && maybeEnd == 2) {
      state.tokenize = tokenBase$3;
      break;
    }
    if (ch2 == "]")
      maybeEnd++;
    else if (ch2 != " ")
      maybeEnd = 0;
  }
  return "meta";
}
const velocity = {
  name: "velocity",
  startState: function() {
    return {
      tokenize: tokenBase$3,
      beforeParams: false,
      inParams: false,
      inString: false,
      lastTokenWasBuiltin: false
    };
  },
  token: function(stream, state) {
    if (stream.eatSpace()) return null;
    return state.tokenize(stream, state);
  },
  languageData: {
    commentTokens: { line: "##", block: { open: "#*", close: "*#" } }
  }
};
const velocity$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  velocity
});
function words$1(str) {
  var obj = {}, words2 = str.split(",");
  for (var i2 = 0; i2 < words2.length; ++i2) {
    var allCaps = words2[i2].toUpperCase();
    var firstCap = words2[i2].charAt(0).toUpperCase() + words2[i2].slice(1);
    obj[words2[i2]] = true;
    obj[allCaps] = true;
    obj[firstCap] = true;
  }
  return obj;
}
function metaHook(stream) {
  stream.eatWhile(/[\w\$_]/);
  return "meta";
}
var atoms = words$1("null"), hooks = { "`": metaHook, "$": metaHook }, multiLineStrings = false;
var keywords$1 = words$1("abs,access,after,alias,all,and,architecture,array,assert,attribute,begin,block,body,buffer,bus,case,component,configuration,constant,disconnect,downto,else,elsif,end,end block,end case,end component,end for,end generate,end if,end loop,end process,end record,end units,entity,exit,file,for,function,generate,generic,generic map,group,guarded,if,impure,in,inertial,inout,is,label,library,linkage,literal,loop,map,mod,nand,new,next,nor,null,of,on,open,or,others,out,package,package body,port,port map,postponed,procedure,process,pure,range,record,register,reject,rem,report,return,rol,ror,select,severity,signal,sla,sll,sra,srl,subtype,then,to,transport,type,unaffected,units,until,use,variable,wait,when,while,with,xnor,xor");
var blockKeywords = words$1("architecture,entity,begin,case,port,else,elsif,end,for,function,if");
var isOperatorChar = /[&|~><!\)\(*#%@+\/=?\:;}{,\.\^\-\[\]]/;
var curPunc;
function tokenBase$2(stream, state) {
  var ch2 = stream.next();
  if (hooks[ch2]) {
    var result = hooks[ch2](stream, state);
    if (result !== false) return result;
  }
  if (ch2 == '"') {
    state.tokenize = tokenString2(ch2);
    return state.tokenize(stream, state);
  }
  if (ch2 == "'") {
    state.tokenize = tokenString$2(ch2);
    return state.tokenize(stream, state);
  }
  if (/[\[\]{}\(\),;\:\.]/.test(ch2)) {
    curPunc = ch2;
    return null;
  }
  if (/[\d']/.test(ch2)) {
    stream.eatWhile(/[\w\.']/);
    return "number";
  }
  if (ch2 == "-") {
    if (stream.eat("-")) {
      stream.skipToEnd();
      return "comment";
    }
  }
  if (isOperatorChar.test(ch2)) {
    stream.eatWhile(isOperatorChar);
    return "operator";
  }
  stream.eatWhile(/[\w\$_]/);
  var cur = stream.current();
  if (keywords$1.propertyIsEnumerable(cur.toLowerCase())) {
    if (blockKeywords.propertyIsEnumerable(cur)) curPunc = "newstatement";
    return "keyword";
  }
  if (atoms.propertyIsEnumerable(cur)) return "atom";
  return "variable";
}
function tokenString$2(quote2) {
  return function(stream, state) {
    var escaped = false, next2, end2 = false;
    while ((next2 = stream.next()) != null) {
      if (next2 == quote2 && !escaped) {
        end2 = true;
        break;
      }
      escaped = !escaped && next2 == "--";
    }
    if (end2 || !(escaped || multiLineStrings))
      state.tokenize = tokenBase$2;
    return "string";
  };
}
function tokenString2(quote2) {
  return function(stream, state) {
    var escaped = false, next2, end2 = false;
    while ((next2 = stream.next()) != null) {
      if (next2 == quote2 && !escaped) {
        end2 = true;
        break;
      }
      escaped = !escaped && next2 == "--";
    }
    if (end2 || !(escaped || multiLineStrings))
      state.tokenize = tokenBase$2;
    return "string.special";
  };
}
function Context(indented, column, type2, align, prev) {
  this.indented = indented;
  this.column = column;
  this.type = type2;
  this.align = align;
  this.prev = prev;
}
function pushContext(state, col, type2) {
  return state.context = new Context(state.indented, col, type2, null, state.context);
}
function popContext(state) {
  var t = state.context.type;
  if (t == ")" || t == "]" || t == "}")
    state.indented = state.context.indented;
  return state.context = state.context.prev;
}
const vhdl = {
  name: "vhdl",
  startState: function(indentUnit) {
    return {
      tokenize: null,
      context: new Context(-indentUnit, 0, "top", false),
      indented: 0,
      startOfLine: true
    };
  },
  token: function(stream, state) {
    var ctx = state.context;
    if (stream.sol()) {
      if (ctx.align == null) ctx.align = false;
      state.indented = stream.indentation();
      state.startOfLine = true;
    }
    if (stream.eatSpace()) return null;
    curPunc = null;
    var style2 = (state.tokenize || tokenBase$2)(stream, state);
    if (style2 == "comment" || style2 == "meta") return style2;
    if (ctx.align == null) ctx.align = true;
    if ((curPunc == ";" || curPunc == ":") && ctx.type == "statement") popContext(state);
    else if (curPunc == "{") pushContext(state, stream.column(), "}");
    else if (curPunc == "[") pushContext(state, stream.column(), "]");
    else if (curPunc == "(") pushContext(state, stream.column(), ")");
    else if (curPunc == "}") {
      while (ctx.type == "statement") ctx = popContext(state);
      if (ctx.type == "}") ctx = popContext(state);
      while (ctx.type == "statement") ctx = popContext(state);
    } else if (curPunc == ctx.type) popContext(state);
    else if (ctx.type == "}" || ctx.type == "top" || ctx.type == "statement" && curPunc == "newstatement")
      pushContext(state, stream.column(), "statement");
    state.startOfLine = false;
    return style2;
  },
  indent: function(state, textAfter, cx2) {
    if (state.tokenize != tokenBase$2 && state.tokenize != null) return 0;
    var firstChar = textAfter && textAfter.charAt(0), ctx = state.context, closing2 = firstChar == ctx.type;
    if (ctx.type == "statement") return ctx.indented + (firstChar == "{" ? 0 : cx2.unit);
    else if (ctx.align) return ctx.column + (closing2 ? 0 : 1);
    else return ctx.indented + (closing2 ? 0 : cx2.unit);
  },
  languageData: {
    indentOnInput: /^\s*[{}]$/,
    commentTokens: { line: "--" }
  }
};
const vhdl$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  vhdl
});
var keywords = (function() {
  function kw2(type2) {
    return { type: type2, style: "keyword" };
  }
  var operator2 = kw2("operator"), atom2 = { type: "atom", style: "atom" }, punctuation2 = { type: "punctuation", style: null }, qualifier = { type: "axis_specifier", style: "qualifier" };
  var kwObj = {
    ",": punctuation2
  };
  var basic = [
    "after",
    "all",
    "allowing",
    "ancestor",
    "ancestor-or-self",
    "any",
    "array",
    "as",
    "ascending",
    "at",
    "attribute",
    "base-uri",
    "before",
    "boundary-space",
    "by",
    "case",
    "cast",
    "castable",
    "catch",
    "child",
    "collation",
    "comment",
    "construction",
    "contains",
    "content",
    "context",
    "copy",
    "copy-namespaces",
    "count",
    "decimal-format",
    "declare",
    "default",
    "delete",
    "descendant",
    "descendant-or-self",
    "descending",
    "diacritics",
    "different",
    "distance",
    "document",
    "document-node",
    "element",
    "else",
    "empty",
    "empty-sequence",
    "encoding",
    "end",
    "entire",
    "every",
    "exactly",
    "except",
    "external",
    "first",
    "following",
    "following-sibling",
    "for",
    "from",
    "ftand",
    "ftnot",
    "ft-option",
    "ftor",
    "function",
    "fuzzy",
    "greatest",
    "group",
    "if",
    "import",
    "in",
    "inherit",
    "insensitive",
    "insert",
    "instance",
    "intersect",
    "into",
    "invoke",
    "is",
    "item",
    "language",
    "last",
    "lax",
    "least",
    "let",
    "levels",
    "lowercase",
    "map",
    "modify",
    "module",
    "most",
    "namespace",
    "next",
    "no",
    "node",
    "nodes",
    "no-inherit",
    "no-preserve",
    "not",
    "occurs",
    "of",
    "only",
    "option",
    "order",
    "ordered",
    "ordering",
    "paragraph",
    "paragraphs",
    "parent",
    "phrase",
    "preceding",
    "preceding-sibling",
    "preserve",
    "previous",
    "processing-instruction",
    "relationship",
    "rename",
    "replace",
    "return",
    "revalidation",
    "same",
    "satisfies",
    "schema",
    "schema-attribute",
    "schema-element",
    "score",
    "self",
    "sensitive",
    "sentence",
    "sentences",
    "sequence",
    "skip",
    "sliding",
    "some",
    "stable",
    "start",
    "stemming",
    "stop",
    "strict",
    "strip",
    "switch",
    "text",
    "then",
    "thesaurus",
    "times",
    "to",
    "transform",
    "treat",
    "try",
    "tumbling",
    "type",
    "typeswitch",
    "union",
    "unordered",
    "update",
    "updating",
    "uppercase",
    "using",
    "validate",
    "value",
    "variable",
    "version",
    "weight",
    "when",
    "where",
    "wildcards",
    "window",
    "with",
    "without",
    "word",
    "words",
    "xquery"
  ];
  for (var i2 = 0, l = basic.length; i2 < l; i2++) {
    kwObj[basic[i2]] = kw2(basic[i2]);
  }
  var types2 = [
    "xs:anyAtomicType",
    "xs:anySimpleType",
    "xs:anyType",
    "xs:anyURI",
    "xs:base64Binary",
    "xs:boolean",
    "xs:byte",
    "xs:date",
    "xs:dateTime",
    "xs:dateTimeStamp",
    "xs:dayTimeDuration",
    "xs:decimal",
    "xs:double",
    "xs:duration",
    "xs:ENTITIES",
    "xs:ENTITY",
    "xs:float",
    "xs:gDay",
    "xs:gMonth",
    "xs:gMonthDay",
    "xs:gYear",
    "xs:gYearMonth",
    "xs:hexBinary",
    "xs:ID",
    "xs:IDREF",
    "xs:IDREFS",
    "xs:int",
    "xs:integer",
    "xs:item",
    "xs:java",
    "xs:language",
    "xs:long",
    "xs:Name",
    "xs:NCName",
    "xs:negativeInteger",
    "xs:NMTOKEN",
    "xs:NMTOKENS",
    "xs:nonNegativeInteger",
    "xs:nonPositiveInteger",
    "xs:normalizedString",
    "xs:NOTATION",
    "xs:numeric",
    "xs:positiveInteger",
    "xs:precisionDecimal",
    "xs:QName",
    "xs:short",
    "xs:string",
    "xs:time",
    "xs:token",
    "xs:unsignedByte",
    "xs:unsignedInt",
    "xs:unsignedLong",
    "xs:unsignedShort",
    "xs:untyped",
    "xs:untypedAtomic",
    "xs:yearMonthDuration"
  ];
  for (var i2 = 0, l = types2.length; i2 < l; i2++) {
    kwObj[types2[i2]] = atom2;
  }
  var operators2 = ["eq", "ne", "lt", "le", "gt", "ge", ":=", "=", ">", ">=", "<", "<=", ".", "|", "?", "and", "or", "div", "idiv", "mod", "*", "/", "+", "-"];
  for (var i2 = 0, l = operators2.length; i2 < l; i2++) {
    kwObj[operators2[i2]] = operator2;
  }
  var axis_specifiers = [
    "self::",
    "attribute::",
    "child::",
    "descendant::",
    "descendant-or-self::",
    "parent::",
    "ancestor::",
    "ancestor-or-self::",
    "following::",
    "preceding::",
    "following-sibling::",
    "preceding-sibling::"
  ];
  for (var i2 = 0, l = axis_specifiers.length; i2 < l; i2++) {
    kwObj[axis_specifiers[i2]] = qualifier;
  }
  return kwObj;
})();
function chain(stream, state, f) {
  state.tokenize = f;
  return f(stream, state);
}
function tokenBase$1(stream, state) {
  var ch2 = stream.next(), mightBeFunction = false, isEQName = isEQNameAhead(stream);
  if (ch2 == "<") {
    if (stream.match("!--", true))
      return chain(stream, state, tokenXMLComment);
    if (stream.match("![CDATA", false)) {
      state.tokenize = tokenCDATA;
      return "tag";
    }
    if (stream.match("?", false)) {
      return chain(stream, state, tokenPreProcessing);
    }
    var isclose = stream.eat("/");
    stream.eatSpace();
    var tagName = "", c;
    while (c = stream.eat(/[^\s\u00a0=<>\"\'\/?]/)) tagName += c;
    return chain(stream, state, tokenTag(tagName, isclose));
  } else if (ch2 == "{") {
    pushStateStack(state, { type: "codeblock" });
    return null;
  } else if (ch2 == "}") {
    popStateStack(state);
    return null;
  } else if (isInXmlBlock(state)) {
    if (ch2 == ">")
      return "tag";
    else if (ch2 == "/" && stream.eat(">")) {
      popStateStack(state);
      return "tag";
    } else
      return "variable";
  } else if (/\d/.test(ch2)) {
    stream.match(/^\d*(?:\.\d*)?(?:E[+\-]?\d+)?/);
    return "atom";
  } else if (ch2 === "(" && stream.eat(":")) {
    pushStateStack(state, { type: "comment" });
    return chain(stream, state, tokenComment$1);
  } else if (!isEQName && (ch2 === '"' || ch2 === "'"))
    return startString(stream, state, ch2);
  else if (ch2 === "$") {
    return chain(stream, state, tokenVariable);
  } else if (ch2 === ":" && stream.eat("=")) {
    return "keyword";
  } else if (ch2 === "(") {
    pushStateStack(state, { type: "paren" });
    return null;
  } else if (ch2 === ")") {
    popStateStack(state);
    return null;
  } else if (ch2 === "[") {
    pushStateStack(state, { type: "bracket" });
    return null;
  } else if (ch2 === "]") {
    popStateStack(state);
    return null;
  } else {
    var known = keywords.propertyIsEnumerable(ch2) && keywords[ch2];
    if (isEQName && ch2 === '"') while (stream.next() !== '"') {
    }
    if (isEQName && ch2 === "'") while (stream.next() !== "'") {
    }
    if (!known) stream.eatWhile(/[\w\$_-]/);
    var foundColon = stream.eat(":");
    if (!stream.eat(":") && foundColon) {
      stream.eatWhile(/[\w\$_-]/);
    }
    if (stream.match(/^[ \t]*\(/, false)) {
      mightBeFunction = true;
    }
    var word = stream.current();
    known = keywords.propertyIsEnumerable(word) && keywords[word];
    if (mightBeFunction && !known) known = { type: "function_call", style: "def" };
    if (isInXmlConstructor(state)) {
      popStateStack(state);
      return "variable";
    }
    if (word == "element" || word == "attribute" || known.type == "axis_specifier") pushStateStack(state, { type: "xmlconstructor" });
    return known ? known.style : "variable";
  }
}
function tokenComment$1(stream, state) {
  var maybeEnd = false, maybeNested = false, nestedCount = 0, ch2;
  while (ch2 = stream.next()) {
    if (ch2 == ")" && maybeEnd) {
      if (nestedCount > 0)
        nestedCount--;
      else {
        popStateStack(state);
        break;
      }
    } else if (ch2 == ":" && maybeNested) {
      nestedCount++;
    }
    maybeEnd = ch2 == ":";
    maybeNested = ch2 == "(";
  }
  return "comment";
}
function tokenString$1(quote2, f) {
  return function(stream, state) {
    var ch2;
    while (ch2 = stream.next()) {
      if (ch2 == quote2) {
        popStateStack(state);
        if (f) state.tokenize = f;
        break;
      } else if (stream.match("{", false) && isInXmlAttributeBlock(state)) {
        pushStateStack(state, { type: "codeblock" });
        state.tokenize = tokenBase$1;
        return "string";
      }
    }
    return "string";
  };
}
function startString(stream, state, quote2, f) {
  let tokenize2 = tokenString$1(quote2, f);
  pushStateStack(state, { type: "string", name: quote2, tokenize: tokenize2 });
  return chain(stream, state, tokenize2);
}
function tokenVariable(stream, state) {
  var isVariableChar = /[\w\$_-]/;
  if (stream.eat('"')) {
    while (stream.next() !== '"') {
    }
    stream.eat(":");
  } else {
    stream.eatWhile(isVariableChar);
    if (!stream.match(":=", false)) stream.eat(":");
  }
  stream.eatWhile(isVariableChar);
  state.tokenize = tokenBase$1;
  return "variable";
}
function tokenTag(name, isclose) {
  return function(stream, state) {
    stream.eatSpace();
    if (isclose && stream.eat(">")) {
      popStateStack(state);
      state.tokenize = tokenBase$1;
      return "tag";
    }
    if (!stream.eat("/"))
      pushStateStack(state, { type: "tag", name, tokenize: tokenBase$1 });
    if (!stream.eat(">")) {
      state.tokenize = tokenAttribute;
      return "tag";
    } else {
      state.tokenize = tokenBase$1;
    }
    return "tag";
  };
}
function tokenAttribute(stream, state) {
  var ch2 = stream.next();
  if (ch2 == "/" && stream.eat(">")) {
    if (isInXmlAttributeBlock(state)) popStateStack(state);
    if (isInXmlBlock(state)) popStateStack(state);
    return "tag";
  }
  if (ch2 == ">") {
    if (isInXmlAttributeBlock(state)) popStateStack(state);
    return "tag";
  }
  if (ch2 == "=")
    return null;
  if (ch2 == '"' || ch2 == "'")
    return startString(stream, state, ch2, tokenAttribute);
  if (!isInXmlAttributeBlock(state))
    pushStateStack(state, { type: "attribute", tokenize: tokenAttribute });
  stream.eat(/[a-zA-Z_:]/);
  stream.eatWhile(/[-a-zA-Z0-9_:.]/);
  stream.eatSpace();
  if (stream.match(">", false) || stream.match("/", false)) {
    popStateStack(state);
    state.tokenize = tokenBase$1;
  }
  return "attribute";
}
function tokenXMLComment(stream, state) {
  var ch2;
  while (ch2 = stream.next()) {
    if (ch2 == "-" && stream.match("->", true)) {
      state.tokenize = tokenBase$1;
      return "comment";
    }
  }
}
function tokenCDATA(stream, state) {
  var ch2;
  while (ch2 = stream.next()) {
    if (ch2 == "]" && stream.match("]", true)) {
      state.tokenize = tokenBase$1;
      return "comment";
    }
  }
}
function tokenPreProcessing(stream, state) {
  var ch2;
  while (ch2 = stream.next()) {
    if (ch2 == "?" && stream.match(">", true)) {
      state.tokenize = tokenBase$1;
      return "processingInstruction";
    }
  }
}
function isInXmlBlock(state) {
  return isIn(state, "tag");
}
function isInXmlAttributeBlock(state) {
  return isIn(state, "attribute");
}
function isInXmlConstructor(state) {
  return isIn(state, "xmlconstructor");
}
function isEQNameAhead(stream) {
  if (stream.current() === '"')
    return stream.match(/^[^\"]+\"\:/, false);
  else if (stream.current() === "'")
    return stream.match(/^[^\"]+\'\:/, false);
  else
    return false;
}
function isIn(state, type2) {
  return state.stack.length && state.stack[state.stack.length - 1].type == type2;
}
function pushStateStack(state, newState) {
  state.stack.push(newState);
}
function popStateStack(state) {
  state.stack.pop();
  var reinstateTokenize = state.stack.length && state.stack[state.stack.length - 1].tokenize;
  state.tokenize = reinstateTokenize || tokenBase$1;
}
const xQuery = {
  name: "xquery",
  startState: function() {
    return {
      tokenize: tokenBase$1,
      cc: [],
      stack: []
    };
  },
  token: function(stream, state) {
    if (stream.eatSpace()) return null;
    var style2 = state.tokenize(stream, state);
    return style2;
  },
  languageData: {
    commentTokens: { block: { open: "(:", close: ":)" } }
  }
};
const xquery = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  xQuery
});
function words(str) {
  var obj = {}, words2 = str.split(" ");
  for (var i2 = 0; i2 < words2.length; ++i2) obj[words2[i2]] = true;
  return obj;
}
var bodiedOps = words("Assert BackQuote D Defun Deriv For ForEach FromFile FromString Function Integrate InverseTaylor Limit LocalSymbols Macro MacroRule MacroRulePattern NIntegrate Rule RulePattern Subst TD TExplicitSum TSum Taylor Taylor1 Taylor2 Taylor3 ToFile ToStdout ToString TraceRule Until While");
var pFloatForm = "(?:(?:\\.\\d+|\\d+\\.\\d*|\\d+)(?:[eE][+-]?\\d+)?)";
var pIdentifier = "(?:[a-zA-Z\\$'][a-zA-Z0-9\\$']*)";
var reFloatForm = new RegExp(pFloatForm);
var reIdentifier = new RegExp(pIdentifier);
var rePattern = new RegExp(pIdentifier + "?_" + pIdentifier);
var reFunctionLike = new RegExp(pIdentifier + "\\s*\\(");
function tokenBase(stream, state) {
  var ch2;
  ch2 = stream.next();
  if (ch2 === '"') {
    state.tokenize = tokenString;
    return state.tokenize(stream, state);
  }
  if (ch2 === "/") {
    if (stream.eat("*")) {
      state.tokenize = tokenComment;
      return state.tokenize(stream, state);
    }
    if (stream.eat("/")) {
      stream.skipToEnd();
      return "comment";
    }
  }
  stream.backUp(1);
  var m = stream.match(/^(\w+)\s*\(/, false);
  if (m !== null && bodiedOps.hasOwnProperty(m[1]))
    state.scopes.push("bodied");
  var scope = currentScope(state);
  if (scope === "bodied" && ch2 === "[")
    state.scopes.pop();
  if (ch2 === "[" || ch2 === "{" || ch2 === "(")
    state.scopes.push(ch2);
  scope = currentScope(state);
  if (scope === "[" && ch2 === "]" || scope === "{" && ch2 === "}" || scope === "(" && ch2 === ")")
    state.scopes.pop();
  if (ch2 === ";") {
    while (scope === "bodied") {
      state.scopes.pop();
      scope = currentScope(state);
    }
  }
  if (stream.match(/\d+ *#/, true, false)) {
    return "qualifier";
  }
  if (stream.match(reFloatForm, true, false)) {
    return "number";
  }
  if (stream.match(rePattern, true, false)) {
    return "variableName.special";
  }
  if (stream.match(/(?:\[|\]|{|}|\(|\))/, true, false)) {
    return "bracket";
  }
  if (stream.match(reFunctionLike, true, false)) {
    stream.backUp(1);
    return "variableName.function";
  }
  if (stream.match(reIdentifier, true, false)) {
    return "variable";
  }
  if (stream.match(/(?:\\|\+|\-|\*|\/|,|;|\.|:|@|~|=|>|<|&|\||_|`|'|\^|\?|!|%|#)/, true, false)) {
    return "operator";
  }
  return "error";
}
function tokenString(stream, state) {
  var next2, end2 = false, escaped = false;
  while ((next2 = stream.next()) != null) {
    if (next2 === '"' && !escaped) {
      end2 = true;
      break;
    }
    escaped = !escaped && next2 === "\\";
  }
  if (end2 && !escaped) {
    state.tokenize = tokenBase;
  }
  return "string";
}
function tokenComment(stream, state) {
  var prev, next2;
  while ((next2 = stream.next()) != null) {
    if (prev === "*" && next2 === "/") {
      state.tokenize = tokenBase;
      break;
    }
    prev = next2;
  }
  return "comment";
}
function currentScope(state) {
  var scope = null;
  if (state.scopes.length > 0)
    scope = state.scopes[state.scopes.length - 1];
  return scope;
}
const yacas = {
  name: "yacas",
  startState: function() {
    return {
      tokenize: tokenBase,
      scopes: []
    };
  },
  token: function(stream, state) {
    if (stream.eatSpace()) return null;
    return state.tokenize(stream, state);
  },
  indent: function(state, textAfter, cx2) {
    if (state.tokenize !== tokenBase && state.tokenize !== null)
      return null;
    var delta = 0;
    if (textAfter === "]" || textAfter === "];" || textAfter === "}" || textAfter === "};" || textAfter === ");")
      delta = -1;
    return (state.scopes.length + delta) * cx2.unit;
  },
  languageData: {
    electricInput: /[{}\[\]()\;]/,
    commentTokens: { line: "//", block: { open: "/*", close: "*/" } }
  }
};
const yacas$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  yacas
});
function mkZ80(ez80) {
  var keywords1, keywords2;
  if (ez80) {
    keywords1 = /^(exx?|(ld|cp)([di]r?)?|[lp]ea|pop|push|ad[cd]|cpl|daa|dec|inc|neg|sbc|sub|and|bit|[cs]cf|x?or|res|set|r[lr]c?a?|r[lr]d|s[lr]a|srl|djnz|nop|[de]i|halt|im|in([di]mr?|ir?|irx|2r?)|ot(dmr?|[id]rx|imr?)|out(0?|[di]r?|[di]2r?)|tst(io)?|slp)(\.([sl]?i)?[sl])?\b/i;
    keywords2 = /^(((call|j[pr]|rst|ret[in]?)(\.([sl]?i)?[sl])?)|(rs|st)mix)\b/i;
  } else {
    keywords1 = /^(exx?|(ld|cp|in)([di]r?)?|pop|push|ad[cd]|cpl|daa|dec|inc|neg|sbc|sub|and|bit|[cs]cf|x?or|res|set|r[lr]c?a?|r[lr]d|s[lr]a|srl|djnz|nop|rst|[de]i|halt|im|ot[di]r|out[di]?)\b/i;
    keywords2 = /^(call|j[pr]|ret[in]?|b_?(call|jump))\b/i;
  }
  var variables1 = /^(af?|bc?|c|de?|e|hl?|l|i[xy]?|r|sp)\b/i;
  var variables2 = /^(n?[zc]|p[oe]?|m)\b/i;
  var errors = /^([hl][xy]|i[xy][hl]|slia|sll)\b/i;
  var numbers2 = /^([\da-f]+h|[0-7]+o|[01]+b|\d+d?)\b/i;
  return {
    name: "z80",
    startState: function() {
      return {
        context: 0
      };
    },
    token: function(stream, state) {
      if (!stream.column())
        state.context = 0;
      if (stream.eatSpace())
        return null;
      var w;
      if (stream.eatWhile(/\w/)) {
        if (ez80 && stream.eat(".")) {
          stream.eatWhile(/\w/);
        }
        w = stream.current();
        if (stream.indentation()) {
          if ((state.context == 1 || state.context == 4) && variables1.test(w)) {
            state.context = 4;
            return "variable";
          }
          if (state.context == 2 && variables2.test(w)) {
            state.context = 4;
            return "variableName.special";
          }
          if (keywords1.test(w)) {
            state.context = 1;
            return "keyword";
          } else if (keywords2.test(w)) {
            state.context = 2;
            return "keyword";
          } else if (state.context == 4 && numbers2.test(w)) {
            return "number";
          }
          if (errors.test(w))
            return "error";
        } else if (stream.match(numbers2)) {
          return "number";
        } else {
          return null;
        }
      } else if (stream.eat(";")) {
        stream.skipToEnd();
        return "comment";
      } else if (stream.eat('"')) {
        while (w = stream.next()) {
          if (w == '"')
            break;
          if (w == "\\")
            stream.next();
        }
        return "string";
      } else if (stream.eat("'")) {
        if (stream.match(/\\?.'/))
          return "number";
      } else if (stream.eat(".") || stream.sol() && stream.eat("#")) {
        state.context = 5;
        if (stream.eatWhile(/\w/))
          return "def";
      } else if (stream.eat("$")) {
        if (stream.eatWhile(/[\da-f]/i))
          return "number";
      } else if (stream.eat("%")) {
        if (stream.eatWhile(/[01]/))
          return "number";
      } else {
        stream.next();
      }
      return null;
    }
  };
}
const z80 = mkZ80(false);
mkZ80(true);
const z80$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  z80
});
function mkParser(lang) {
  return {
    name: "mscgen",
    startState: startStateFn,
    copyState: copyStateFn,
    token: produceTokenFunction(lang),
    languageData: {
      commentTokens: { line: "#", block: { open: "/*", close: "*/" } }
    }
  };
}
const mscgen = mkParser({
  "keywords": ["msc"],
  "options": ["hscale", "width", "arcgradient", "wordwraparcs"],
  "constants": ["true", "false", "on", "off"],
  "attributes": ["label", "idurl", "id", "url", "linecolor", "linecolour", "textcolor", "textcolour", "textbgcolor", "textbgcolour", "arclinecolor", "arclinecolour", "arctextcolor", "arctextcolour", "arctextbgcolor", "arctextbgcolour", "arcskip"],
  "brackets": ["\\{", "\\}"],
  // [ and  ] are brackets too, but these get handled in with lists
  "arcsWords": ["note", "abox", "rbox", "box"],
  "arcsOthers": ["\\|\\|\\|", "\\.\\.\\.", "---", "--", "<->", "==", "<<=>>", "<=>", "\\.\\.", "<<>>", "::", "<:>", "->", "=>>", "=>", ">>", ":>", "<-", "<<=", "<=", "<<", "<:", "x-", "-x"],
  "singlecomment": ["//", "#"],
  "operators": ["="]
});
const msgenny = mkParser({
  "keywords": null,
  "options": ["hscale", "width", "arcgradient", "wordwraparcs", "wordwrapentities", "watermark"],
  "constants": ["true", "false", "on", "off", "auto"],
  "attributes": null,
  "brackets": ["\\{", "\\}"],
  "arcsWords": ["note", "abox", "rbox", "box", "alt", "else", "opt", "break", "par", "seq", "strict", "neg", "critical", "ignore", "consider", "assert", "loop", "ref", "exc"],
  "arcsOthers": ["\\|\\|\\|", "\\.\\.\\.", "---", "--", "<->", "==", "<<=>>", "<=>", "\\.\\.", "<<>>", "::", "<:>", "->", "=>>", "=>", ">>", ":>", "<-", "<<=", "<=", "<<", "<:", "x-", "-x"],
  "singlecomment": ["//", "#"],
  "operators": ["="]
});
const xu = mkParser({
  "keywords": ["msc", "xu"],
  "options": ["hscale", "width", "arcgradient", "wordwraparcs", "wordwrapentities", "watermark"],
  "constants": ["true", "false", "on", "off", "auto"],
  "attributes": ["label", "idurl", "id", "url", "linecolor", "linecolour", "textcolor", "textcolour", "textbgcolor", "textbgcolour", "arclinecolor", "arclinecolour", "arctextcolor", "arctextcolour", "arctextbgcolor", "arctextbgcolour", "arcskip", "title", "deactivate", "activate", "activation"],
  "brackets": ["\\{", "\\}"],
  // [ and  ] are brackets too, but these get handled in with lists
  "arcsWords": ["note", "abox", "rbox", "box", "alt", "else", "opt", "break", "par", "seq", "strict", "neg", "critical", "ignore", "consider", "assert", "loop", "ref", "exc"],
  "arcsOthers": ["\\|\\|\\|", "\\.\\.\\.", "---", "--", "<->", "==", "<<=>>", "<=>", "\\.\\.", "<<>>", "::", "<:>", "->", "=>>", "=>", ">>", ":>", "<-", "<<=", "<=", "<<", "<:", "x-", "-x"],
  "singlecomment": ["//", "#"],
  "operators": ["="]
});
function wordRegexpBoundary(pWords) {
  return new RegExp("^\\b(" + pWords.join("|") + ")\\b", "i");
}
function wordRegexp(pWords) {
  return new RegExp("^(?:" + pWords.join("|") + ")", "i");
}
function startStateFn() {
  return {
    inComment: false,
    inString: false,
    inAttributeList: false,
    inScript: false
  };
}
function copyStateFn(pState) {
  return {
    inComment: pState.inComment,
    inString: pState.inString,
    inAttributeList: pState.inAttributeList,
    inScript: pState.inScript
  };
}
function produceTokenFunction(pConfig) {
  return function(pStream, pState) {
    if (pStream.match(wordRegexp(pConfig.brackets), true, true)) {
      return "bracket";
    }
    if (!pState.inComment) {
      if (pStream.match(/\/\*[^\*\/]*/, true, true)) {
        pState.inComment = true;
        return "comment";
      }
      if (pStream.match(wordRegexp(pConfig.singlecomment), true, true)) {
        pStream.skipToEnd();
        return "comment";
      }
    }
    if (pState.inComment) {
      if (pStream.match(/[^\*\/]*\*\//, true, true))
        pState.inComment = false;
      else
        pStream.skipToEnd();
      return "comment";
    }
    if (!pState.inString && pStream.match(/\"(\\\"|[^\"])*/, true, true)) {
      pState.inString = true;
      return "string";
    }
    if (pState.inString) {
      if (pStream.match(/[^\"]*\"/, true, true))
        pState.inString = false;
      else
        pStream.skipToEnd();
      return "string";
    }
    if (!!pConfig.keywords && pStream.match(wordRegexpBoundary(pConfig.keywords), true, true))
      return "keyword";
    if (pStream.match(wordRegexpBoundary(pConfig.options), true, true))
      return "keyword";
    if (pStream.match(wordRegexpBoundary(pConfig.arcsWords), true, true))
      return "keyword";
    if (pStream.match(wordRegexp(pConfig.arcsOthers), true, true))
      return "keyword";
    if (!!pConfig.operators && pStream.match(wordRegexp(pConfig.operators), true, true))
      return "operator";
    if (!!pConfig.constants && pStream.match(wordRegexp(pConfig.constants), true, true))
      return "variable";
    if (!pConfig.inAttributeList && !!pConfig.attributes && pStream.match("[", true, true)) {
      pConfig.inAttributeList = true;
      return "bracket";
    }
    if (pConfig.inAttributeList) {
      if (pConfig.attributes !== null && pStream.match(wordRegexpBoundary(pConfig.attributes), true, true)) {
        return "attribute";
      }
      if (pStream.match("]", true, true)) {
        pConfig.inAttributeList = false;
        return "bracket";
      }
    }
    pStream.next();
    return null;
  };
}
const mscgen$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  mscgen,
  msgenny,
  xu
});
export {
  perl$1 as $,
  factor$1 as A,
  fcl$1 as B,
  forth$1 as C,
  fortran$1 as D,
  mllike as E,
  gas$1 as F,
  gherkin$1 as G,
  groovy$1 as H,
  haskell$1 as I,
  haxe$1 as J,
  http$1 as K,
  idl$1 as L,
  javascript$1 as M,
  julia$1 as N,
  livescript as O,
  lua$1 as P,
  mirc$1 as Q,
  mathematica$1 as R,
  modelica$1 as S,
  mumps$1 as T,
  mbox$1 as U,
  nginx$1 as V,
  nsis$1 as W,
  ntriples$1 as X,
  octave$1 as Y,
  oz$1 as Z,
  pascal$1 as _,
  apl$1 as a,
  pig$1 as a0,
  powershell as a1,
  properties$1 as a2,
  protobuf$1 as a3,
  pug$1 as a4,
  puppet$1 as a5,
  q$1 as a6,
  r$1 as a7,
  rpm as a8,
  ruby$1 as a9,
  xquery as aA,
  yacas$1 as aB,
  z80$1 as aC,
  mscgen$1 as aD,
  sas$1 as aa,
  scheme$1 as ab,
  shell$1 as ac,
  sieve$1 as ad,
  smalltalk$1 as ae,
  solr$1 as af,
  sparql$1 as ag,
  spreadsheet$1 as ah,
  stylus$1 as ai,
  swift$1 as aj,
  stex$1 as ak,
  verilog$1 as al,
  tcl$1 as am,
  textile$1 as an,
  tiddlywiki as ao,
  tiki$1 as ap,
  toml$1 as aq,
  troff$1 as ar,
  ttcn$1 as as,
  ttcnCfg$1 as at,
  turtle$1 as au,
  webidl as av,
  vb$1 as aw,
  vbscript as ax,
  velocity$1 as ay,
  vhdl$1 as az,
  asciiarmor as b,
  asn1$1 as c,
  asterisk$1 as d,
  brainfuck$1 as e,
  cobol$1 as f,
  clike$1 as g,
  clojure$1 as h,
  css as i,
  cmake$1 as j,
  coffeescript as k,
  commonlisp as l,
  cypher$1 as m,
  crystal$1 as n,
  d$2 as o,
  python as p,
  diff$1 as q,
  dockerfile as r,
  dtd$1 as s,
  dylan$1 as t,
  ebnf$1 as u,
  ecl$1 as v,
  eiffel$1 as w,
  elm$1 as x,
  erlang$1 as y,
  sql$1 as z
};
