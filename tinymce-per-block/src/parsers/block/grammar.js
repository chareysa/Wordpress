/*
 * Generated by PEG.js 0.10.0.
 *
 * http://pegjs.org/
 */
"use strict";

function peg$subclass(child, parent) {
	function ctor() { this.constructor = child; }
	ctor.prototype = parent.prototype;
	child.prototype = new ctor();
}

function peg$SyntaxError(message, expected, found, location) {
	this.message  = message;
	this.expected = expected;
	this.found    = found;
	this.location = location;
	this.name     = "SyntaxError";

	if (typeof Error.captureStackTrace === "function") {
		Error.captureStackTrace(this, peg$SyntaxError);
	}
}

peg$subclass(peg$SyntaxError, Error);

peg$SyntaxError.buildMessage = function(expected, found) {
	var DESCRIBE_EXPECTATION_FNS = {
				literal: function(expectation) {
					return "\"" + literalEscape(expectation.text) + "\"";
				},

				"class": function(expectation) {
					var escapedParts = "",
							i;

					for (i = 0; i < expectation.parts.length; i++) {
						escapedParts += expectation.parts[i] instanceof Array
							? classEscape(expectation.parts[i][0]) + "-" + classEscape(expectation.parts[i][1])
							: classEscape(expectation.parts[i]);
					}

					return "[" + (expectation.inverted ? "^" : "") + escapedParts + "]";
				},

				any: function(expectation) {
					return "any character";
				},

				end: function(expectation) {
					return "end of input";
				},

				other: function(expectation) {
					return expectation.description;
				}
			};

	function hex(ch) {
		return ch.charCodeAt(0).toString(16).toUpperCase();
	}

	function literalEscape(s) {
		return s
			.replace(/\\/g, '\\\\')
			.replace(/"/g,  '\\"')
			.replace(/\0/g, '\\0')
			.replace(/\t/g, '\\t')
			.replace(/\n/g, '\\n')
			.replace(/\r/g, '\\r')
			.replace(/[\x00-\x0F]/g,          function(ch) { return '\\x0' + hex(ch); })
			.replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) { return '\\x'  + hex(ch); });
	}

	function classEscape(s) {
		return s
			.replace(/\\/g, '\\\\')
			.replace(/\]/g, '\\]')
			.replace(/\^/g, '\\^')
			.replace(/-/g,  '\\-')
			.replace(/\0/g, '\\0')
			.replace(/\t/g, '\\t')
			.replace(/\n/g, '\\n')
			.replace(/\r/g, '\\r')
			.replace(/[\x00-\x0F]/g,          function(ch) { return '\\x0' + hex(ch); })
			.replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) { return '\\x'  + hex(ch); });
	}

	function describeExpectation(expectation) {
		return DESCRIBE_EXPECTATION_FNS[expectation.type](expectation);
	}

	function describeExpected(expected) {
		var descriptions = new Array(expected.length),
				i, j;

		for (i = 0; i < expected.length; i++) {
			descriptions[i] = describeExpectation(expected[i]);
		}

		descriptions.sort();

		if (descriptions.length > 0) {
			for (i = 1, j = 1; i < descriptions.length; i++) {
				if (descriptions[i - 1] !== descriptions[i]) {
					descriptions[j] = descriptions[i];
					j++;
				}
			}
			descriptions.length = j;
		}

		switch (descriptions.length) {
			case 1:
				return descriptions[0];

			case 2:
				return descriptions[0] + " or " + descriptions[1];

			default:
				return descriptions.slice(0, -1).join(", ")
					+ ", or "
					+ descriptions[descriptions.length - 1];
		}
	}

	function describeFound(found) {
		return found ? "\"" + literalEscape(found) + "\"" : "end of input";
	}

	return "Expected " + describeExpected(expected) + " but " + describeFound(found) + " found.";
};

function peg$parse(input, options) {
	options = options !== void 0 ? options : {};

	var peg$FAILED = {},

			peg$startRuleFunctions = { Document: peg$parseDocument },
			peg$startRuleFunction  = peg$parseDocument,

			peg$c0 = function(s, c) { return c },
			peg$c1 = function(s, ts, e) { return {
					blockType: s.blockType,
					attrs: s.attrs,
					rawContent: ts.join( '' ),
				} },
			peg$c2 = function(c) { return c },
			peg$c3 = function(ts) {
					return {
						blockType: 'html',
						attrs: {},
						rawContent: ts.join('')
					}
				},
			peg$c4 = "<!--",
			peg$c5 = peg$literalExpectation("<!--", false),
			peg$c6 = "wp:",
			peg$c7 = peg$literalExpectation("wp:", false),
			peg$c8 = "-->",
			peg$c9 = peg$literalExpectation("-->", false),
			peg$c10 = function(blockType, attrs) { return {
					type: 'WP_Block_Start',
					blockType,
					attrs,
					text: text()
				} },
			peg$c11 = "/wp",
			peg$c12 = peg$literalExpectation("/wp", false),
			peg$c13 = function() { return {
					type: 'WP_Block_End',
					text: text()
				} },
			peg$c14 = function(head, tail) { return [ head ].concat( tail ).join('')  },
			peg$c15 = function(attr) { return attr },
			peg$c16 = function(as) { return as.reduce( ( attrs, [ name, value ] ) => Object.assign(
					attrs,
					{ [ name ]: value }
				), {} ) },
			peg$c17 = ":",
			peg$c18 = peg$literalExpectation(":", false),
			peg$c19 = function(name, value) { return [ name, value ] },
			peg$c20 = function(head, tail) { return [ head ].concat( tail ).join('') },
			peg$c21 = /^[a-zA-Z]/,
			peg$c22 = peg$classExpectation([["a", "z"], ["A", "Z"]], false, false),
			peg$c23 = /^[0-9]/,
			peg$c24 = peg$classExpectation([["0", "9"]], false, false),
			peg$c25 = /^[\-_]/,
			peg$c26 = peg$classExpectation(["-", "_"], false, false),
			peg$c27 = /^[\r\n]/,
			peg$c28 = peg$classExpectation(["\r", "\n"], false, false),
			peg$c29 = /^[ \t]/,
			peg$c30 = peg$classExpectation([" ", "\t"], false, false),
			peg$c31 = peg$anyExpectation(),

			peg$currPos          = 0,
			peg$savedPos         = 0,
			peg$posDetailsCache  = [{ line: 1, column: 1 }],
			peg$maxFailPos       = 0,
			peg$maxFailExpected  = [],
			peg$silentFails      = 0,

			peg$result;

	if ("startRule" in options) {
		if (!(options.startRule in peg$startRuleFunctions)) {
			throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
		}

		peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
	}

	function text() {
		return input.substring(peg$savedPos, peg$currPos);
	}

	function location() {
		return peg$computeLocation(peg$savedPos, peg$currPos);
	}

	function expected(description, location) {
		location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos)

		throw peg$buildStructuredError(
			[peg$otherExpectation(description)],
			input.substring(peg$savedPos, peg$currPos),
			location
		);
	}

	function error(message, location) {
		location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos)

		throw peg$buildSimpleError(message, location);
	}

	function peg$literalExpectation(text, ignoreCase) {
		return { type: "literal", text: text, ignoreCase: ignoreCase };
	}

	function peg$classExpectation(parts, inverted, ignoreCase) {
		return { type: "class", parts: parts, inverted: inverted, ignoreCase: ignoreCase };
	}

	function peg$anyExpectation() {
		return { type: "any" };
	}

	function peg$endExpectation() {
		return { type: "end" };
	}

	function peg$otherExpectation(description) {
		return { type: "other", description: description };
	}

	function peg$computePosDetails(pos) {
		var details = peg$posDetailsCache[pos], p;

		if (details) {
			return details;
		} else {
			p = pos - 1;
			while (!peg$posDetailsCache[p]) {
				p--;
			}

			details = peg$posDetailsCache[p];
			details = {
				line:   details.line,
				column: details.column
			};

			while (p < pos) {
				if (input.charCodeAt(p) === 10) {
					details.line++;
					details.column = 1;
				} else {
					details.column++;
				}

				p++;
			}

			peg$posDetailsCache[pos] = details;
			return details;
		}
	}

	function peg$computeLocation(startPos, endPos) {
		var startPosDetails = peg$computePosDetails(startPos),
				endPosDetails   = peg$computePosDetails(endPos);

		return {
			start: {
				offset: startPos,
				line:   startPosDetails.line,
				column: startPosDetails.column
			},
			end: {
				offset: endPos,
				line:   endPosDetails.line,
				column: endPosDetails.column
			}
		};
	}

	function peg$fail(expected) {
		if (peg$currPos < peg$maxFailPos) { return; }

		if (peg$currPos > peg$maxFailPos) {
			peg$maxFailPos = peg$currPos;
			peg$maxFailExpected = [];
		}

		peg$maxFailExpected.push(expected);
	}

	function peg$buildSimpleError(message, location) {
		return new peg$SyntaxError(message, null, null, location);
	}

	function peg$buildStructuredError(expected, found, location) {
		return new peg$SyntaxError(
			peg$SyntaxError.buildMessage(expected, found),
			expected,
			found,
			location
		);
	}

	function peg$parseDocument() {
		var s0;

		s0 = peg$parseWP_Block_List();

		return s0;
	}

	function peg$parseWP_Block_List() {
		var s0, s1;

		s0 = [];
		s1 = peg$parseWP_Block();
		while (s1 !== peg$FAILED) {
			s0.push(s1);
			s1 = peg$parseWP_Block();
		}

		return s0;
	}

	function peg$parseWP_Block() {
		var s0;

		s0 = peg$parseWP_Block_Balanced();
		if (s0 === peg$FAILED) {
			s0 = peg$parseWP_Block_Html();
		}

		return s0;
	}

	function peg$parseWP_Block_Balanced() {
		var s0, s1, s2, s3, s4, s5;

		s0 = peg$currPos;
		s1 = peg$parseWP_Block_Start();
		if (s1 !== peg$FAILED) {
			s2 = [];
			s3 = peg$currPos;
			s4 = peg$currPos;
			peg$silentFails++;
			s5 = peg$parseWP_Block_End();
			peg$silentFails--;
			if (s5 === peg$FAILED) {
				s4 = void 0;
			} else {
				peg$currPos = s4;
				s4 = peg$FAILED;
			}
			if (s4 !== peg$FAILED) {
				s5 = peg$parseAny();
				if (s5 !== peg$FAILED) {
					peg$savedPos = s3;
					s4 = peg$c0(s1, s5);
					s3 = s4;
				} else {
					peg$currPos = s3;
					s3 = peg$FAILED;
				}
			} else {
				peg$currPos = s3;
				s3 = peg$FAILED;
			}
			if (s3 !== peg$FAILED) {
				while (s3 !== peg$FAILED) {
					s2.push(s3);
					s3 = peg$currPos;
					s4 = peg$currPos;
					peg$silentFails++;
					s5 = peg$parseWP_Block_End();
					peg$silentFails--;
					if (s5 === peg$FAILED) {
						s4 = void 0;
					} else {
						peg$currPos = s4;
						s4 = peg$FAILED;
					}
					if (s4 !== peg$FAILED) {
						s5 = peg$parseAny();
						if (s5 !== peg$FAILED) {
							peg$savedPos = s3;
							s4 = peg$c0(s1, s5);
							s3 = s4;
						} else {
							peg$currPos = s3;
							s3 = peg$FAILED;
						}
					} else {
						peg$currPos = s3;
						s3 = peg$FAILED;
					}
				}
			} else {
				s2 = peg$FAILED;
			}
			if (s2 !== peg$FAILED) {
				s3 = peg$parseWP_Block_End();
				if (s3 !== peg$FAILED) {
					peg$savedPos = s0;
					s1 = peg$c1(s1, s2, s3);
					s0 = s1;
				} else {
					peg$currPos = s0;
					s0 = peg$FAILED;
				}
			} else {
				peg$currPos = s0;
				s0 = peg$FAILED;
			}
		} else {
			peg$currPos = s0;
			s0 = peg$FAILED;
		}

		return s0;
	}

	function peg$parseWP_Block_Html() {
		var s0, s1, s2, s3, s4;

		s0 = peg$currPos;
		s1 = [];
		s2 = peg$currPos;
		s3 = peg$currPos;
		peg$silentFails++;
		s4 = peg$parseWP_Block_Balanced();
		peg$silentFails--;
		if (s4 === peg$FAILED) {
			s3 = void 0;
		} else {
			peg$currPos = s3;
			s3 = peg$FAILED;
		}
		if (s3 !== peg$FAILED) {
			s4 = peg$parseAny();
			if (s4 !== peg$FAILED) {
				peg$savedPos = s2;
				s3 = peg$c2(s4);
				s2 = s3;
			} else {
				peg$currPos = s2;
				s2 = peg$FAILED;
			}
		} else {
			peg$currPos = s2;
			s2 = peg$FAILED;
		}
		if (s2 !== peg$FAILED) {
			while (s2 !== peg$FAILED) {
				s1.push(s2);
				s2 = peg$currPos;
				s3 = peg$currPos;
				peg$silentFails++;
				s4 = peg$parseWP_Block_Balanced();
				peg$silentFails--;
				if (s4 === peg$FAILED) {
					s3 = void 0;
				} else {
					peg$currPos = s3;
					s3 = peg$FAILED;
				}
				if (s3 !== peg$FAILED) {
					s4 = peg$parseAny();
					if (s4 !== peg$FAILED) {
						peg$savedPos = s2;
						s3 = peg$c2(s4);
						s2 = s3;
					} else {
						peg$currPos = s2;
						s2 = peg$FAILED;
					}
				} else {
					peg$currPos = s2;
					s2 = peg$FAILED;
				}
			}
		} else {
			s1 = peg$FAILED;
		}
		if (s1 !== peg$FAILED) {
			peg$savedPos = s0;
			s1 = peg$c3(s1);
		}
		s0 = s1;

		return s0;
	}

	function peg$parseWP_Block_Start() {
		var s0, s1, s2, s3, s4, s5, s6, s7;

		s0 = peg$currPos;
		if (input.substr(peg$currPos, 4) === peg$c4) {
			s1 = peg$c4;
			peg$currPos += 4;
		} else {
			s1 = peg$FAILED;
			if (peg$silentFails === 0) { peg$fail(peg$c5); }
		}
		if (s1 !== peg$FAILED) {
			s2 = peg$parse__();
			if (s2 !== peg$FAILED) {
				if (input.substr(peg$currPos, 3) === peg$c6) {
					s3 = peg$c6;
					peg$currPos += 3;
				} else {
					s3 = peg$FAILED;
					if (peg$silentFails === 0) { peg$fail(peg$c7); }
				}
				if (s3 !== peg$FAILED) {
					s4 = peg$parseWP_Block_Type();
					if (s4 !== peg$FAILED) {
						s5 = peg$parseWP_Block_Attribute_List();
						if (s5 !== peg$FAILED) {
							s6 = peg$parse_();
							if (s6 === peg$FAILED) {
								s6 = null;
							}
							if (s6 !== peg$FAILED) {
								if (input.substr(peg$currPos, 3) === peg$c8) {
									s7 = peg$c8;
									peg$currPos += 3;
								} else {
									s7 = peg$FAILED;
									if (peg$silentFails === 0) { peg$fail(peg$c9); }
								}
								if (s7 !== peg$FAILED) {
									peg$savedPos = s0;
									s1 = peg$c10(s4, s5);
									s0 = s1;
								} else {
									peg$currPos = s0;
									s0 = peg$FAILED;
								}
							} else {
								peg$currPos = s0;
								s0 = peg$FAILED;
							}
						} else {
							peg$currPos = s0;
							s0 = peg$FAILED;
						}
					} else {
						peg$currPos = s0;
						s0 = peg$FAILED;
					}
				} else {
					peg$currPos = s0;
					s0 = peg$FAILED;
				}
			} else {
				peg$currPos = s0;
				s0 = peg$FAILED;
			}
		} else {
			peg$currPos = s0;
			s0 = peg$FAILED;
		}

		return s0;
	}

	function peg$parseWP_Block_End() {
		var s0, s1, s2, s3, s4, s5;

		s0 = peg$currPos;
		if (input.substr(peg$currPos, 4) === peg$c4) {
			s1 = peg$c4;
			peg$currPos += 4;
		} else {
			s1 = peg$FAILED;
			if (peg$silentFails === 0) { peg$fail(peg$c5); }
		}
		if (s1 !== peg$FAILED) {
			s2 = peg$parse__();
			if (s2 !== peg$FAILED) {
				if (input.substr(peg$currPos, 3) === peg$c11) {
					s3 = peg$c11;
					peg$currPos += 3;
				} else {
					s3 = peg$FAILED;
					if (peg$silentFails === 0) { peg$fail(peg$c12); }
				}
				if (s3 !== peg$FAILED) {
					s4 = peg$parse__();
					if (s4 !== peg$FAILED) {
						if (input.substr(peg$currPos, 3) === peg$c8) {
							s5 = peg$c8;
							peg$currPos += 3;
						} else {
							s5 = peg$FAILED;
							if (peg$silentFails === 0) { peg$fail(peg$c9); }
						}
						if (s5 !== peg$FAILED) {
							peg$savedPos = s0;
							s1 = peg$c13();
							s0 = s1;
						} else {
							peg$currPos = s0;
							s0 = peg$FAILED;
						}
					} else {
						peg$currPos = s0;
						s0 = peg$FAILED;
					}
				} else {
					peg$currPos = s0;
					s0 = peg$FAILED;
				}
			} else {
				peg$currPos = s0;
				s0 = peg$FAILED;
			}
		} else {
			peg$currPos = s0;
			s0 = peg$FAILED;
		}

		return s0;
	}

	function peg$parseWP_Block_Type() {
		var s0, s1, s2, s3;

		s0 = peg$currPos;
		s1 = peg$parseASCII_Letter();
		if (s1 !== peg$FAILED) {
			s2 = [];
			s3 = peg$parseASCII_AlphaNumeric();
			while (s3 !== peg$FAILED) {
				s2.push(s3);
				s3 = peg$parseASCII_AlphaNumeric();
			}
			if (s2 !== peg$FAILED) {
				peg$savedPos = s0;
				s1 = peg$c14(s1, s2);
				s0 = s1;
			} else {
				peg$currPos = s0;
				s0 = peg$FAILED;
			}
		} else {
			peg$currPos = s0;
			s0 = peg$FAILED;
		}

		return s0;
	}

	function peg$parseWP_Block_Attribute_List() {
		var s0, s1, s2, s3, s4;

		s0 = peg$currPos;
		s1 = [];
		s2 = peg$currPos;
		s3 = [];
		s4 = peg$parse_();
		if (s4 !== peg$FAILED) {
			while (s4 !== peg$FAILED) {
				s3.push(s4);
				s4 = peg$parse_();
			}
		} else {
			s3 = peg$FAILED;
		}
		if (s3 !== peg$FAILED) {
			s4 = peg$parseWP_Block_Attribute();
			if (s4 !== peg$FAILED) {
				peg$savedPos = s2;
				s3 = peg$c15(s4);
				s2 = s3;
			} else {
				peg$currPos = s2;
				s2 = peg$FAILED;
			}
		} else {
			peg$currPos = s2;
			s2 = peg$FAILED;
		}
		while (s2 !== peg$FAILED) {
			s1.push(s2);
			s2 = peg$currPos;
			s3 = [];
			s4 = peg$parse_();
			if (s4 !== peg$FAILED) {
				while (s4 !== peg$FAILED) {
					s3.push(s4);
					s4 = peg$parse_();
				}
			} else {
				s3 = peg$FAILED;
			}
			if (s3 !== peg$FAILED) {
				s4 = peg$parseWP_Block_Attribute();
				if (s4 !== peg$FAILED) {
					peg$savedPos = s2;
					s3 = peg$c15(s4);
					s2 = s3;
				} else {
					peg$currPos = s2;
					s2 = peg$FAILED;
				}
			} else {
				peg$currPos = s2;
				s2 = peg$FAILED;
			}
		}
		if (s1 !== peg$FAILED) {
			peg$savedPos = s0;
			s1 = peg$c16(s1);
		}
		s0 = s1;

		return s0;
	}

	function peg$parseWP_Block_Attribute() {
		var s0, s1, s2, s3;

		s0 = peg$currPos;
		s1 = peg$parseWP_Block_Attribute_Name();
		if (s1 !== peg$FAILED) {
			if (input.charCodeAt(peg$currPos) === 58) {
				s2 = peg$c17;
				peg$currPos++;
			} else {
				s2 = peg$FAILED;
				if (peg$silentFails === 0) { peg$fail(peg$c18); }
			}
			if (s2 !== peg$FAILED) {
				s3 = peg$parseWP_Block_Attribute_Value();
				if (s3 !== peg$FAILED) {
					peg$savedPos = s0;
					s1 = peg$c19(s1, s3);
					s0 = s1;
				} else {
					peg$currPos = s0;
					s0 = peg$FAILED;
				}
			} else {
				peg$currPos = s0;
				s0 = peg$FAILED;
			}
		} else {
			peg$currPos = s0;
			s0 = peg$FAILED;
		}

		return s0;
	}

	function peg$parseWP_Block_Attribute_Name() {
		var s0, s1, s2, s3;

		s0 = peg$currPos;
		s1 = peg$parseASCII_Letter();
		if (s1 !== peg$FAILED) {
			s2 = [];
			s3 = peg$parseASCII_AlphaNumeric();
			while (s3 !== peg$FAILED) {
				s2.push(s3);
				s3 = peg$parseASCII_AlphaNumeric();
			}
			if (s2 !== peg$FAILED) {
				peg$savedPos = s0;
				s1 = peg$c14(s1, s2);
				s0 = s1;
			} else {
				peg$currPos = s0;
				s0 = peg$FAILED;
			}
		} else {
			peg$currPos = s0;
			s0 = peg$FAILED;
		}

		return s0;
	}

	function peg$parseWP_Block_Attribute_Value() {
		var s0, s1, s2, s3;

		s0 = peg$currPos;
		s1 = peg$parseASCII_Letter();
		if (s1 !== peg$FAILED) {
			s2 = [];
			s3 = peg$parseASCII_AlphaNumeric();
			while (s3 !== peg$FAILED) {
				s2.push(s3);
				s3 = peg$parseASCII_AlphaNumeric();
			}
			if (s2 !== peg$FAILED) {
				peg$savedPos = s0;
				s1 = peg$c20(s1, s2);
				s0 = s1;
			} else {
				peg$currPos = s0;
				s0 = peg$FAILED;
			}
		} else {
			peg$currPos = s0;
			s0 = peg$FAILED;
		}

		return s0;
	}

	function peg$parseASCII_AlphaNumeric() {
		var s0;

		s0 = peg$parseASCII_Letter();
		if (s0 === peg$FAILED) {
			s0 = peg$parseASCII_Digit();
			if (s0 === peg$FAILED) {
				s0 = peg$parseSpecial_Chars();
			}
		}

		return s0;
	}

	function peg$parseASCII_Letter() {
		var s0;

		if (peg$c21.test(input.charAt(peg$currPos))) {
			s0 = input.charAt(peg$currPos);
			peg$currPos++;
		} else {
			s0 = peg$FAILED;
			if (peg$silentFails === 0) { peg$fail(peg$c22); }
		}

		return s0;
	}

	function peg$parseASCII_Digit() {
		var s0;

		if (peg$c23.test(input.charAt(peg$currPos))) {
			s0 = input.charAt(peg$currPos);
			peg$currPos++;
		} else {
			s0 = peg$FAILED;
			if (peg$silentFails === 0) { peg$fail(peg$c24); }
		}

		return s0;
	}

	function peg$parseSpecial_Chars() {
		var s0;

		if (peg$c25.test(input.charAt(peg$currPos))) {
			s0 = input.charAt(peg$currPos);
			peg$currPos++;
		} else {
			s0 = peg$FAILED;
			if (peg$silentFails === 0) { peg$fail(peg$c26); }
		}

		return s0;
	}

	function peg$parseNewline() {
		var s0;

		if (peg$c27.test(input.charAt(peg$currPos))) {
			s0 = input.charAt(peg$currPos);
			peg$currPos++;
		} else {
			s0 = peg$FAILED;
			if (peg$silentFails === 0) { peg$fail(peg$c28); }
		}

		return s0;
	}

	function peg$parse_() {
		var s0;

		if (peg$c29.test(input.charAt(peg$currPos))) {
			s0 = input.charAt(peg$currPos);
			peg$currPos++;
		} else {
			s0 = peg$FAILED;
			if (peg$silentFails === 0) { peg$fail(peg$c30); }
		}

		return s0;
	}

	function peg$parse__() {
		var s0, s1;

		s0 = [];
		s1 = peg$parse_();
		if (s1 !== peg$FAILED) {
			while (s1 !== peg$FAILED) {
				s0.push(s1);
				s1 = peg$parse_();
			}
		} else {
			s0 = peg$FAILED;
		}

		return s0;
	}

	function peg$parseAny() {
		var s0;

		if (input.length > peg$currPos) {
			s0 = input.charAt(peg$currPos);
			peg$currPos++;
		} else {
			s0 = peg$FAILED;
			if (peg$silentFails === 0) { peg$fail(peg$c31); }
		}

		return s0;
	}

	peg$result = peg$startRuleFunction();

	if (peg$result !== peg$FAILED && peg$currPos === input.length) {
		return peg$result;
	} else {
		if (peg$result !== peg$FAILED && peg$currPos < input.length) {
			peg$fail(peg$endExpectation());
		}

		throw peg$buildStructuredError(
			peg$maxFailExpected,
			peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null,
			peg$maxFailPos < input.length
				? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1)
				: peg$computeLocation(peg$maxFailPos, peg$maxFailPos)
		);
	}
}

module.exports = {
	SyntaxError: peg$SyntaxError,
	parse:       peg$parse
};
