/*
  This is a copy of the
  [el-translit](https://en.wiktionary.org/wiki/Module:el-translit)
  module from Wiktionary, licensed under
  [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/).
*/

local export = {}

local tt = {
	["α"] = "a",  ["ά"] = "á",  ["β"] = "v",  ["γ"] = "g",  ["δ"] = "d",
	["ε"] = "e",  ["έ"] = "é",  ["ζ"] = "z",  ["η"] = "i",  ["ή"] = "í",
	["θ"] = "th", ["ι"] = "i",  ["ί"] = "í",  ["ϊ"] = "ï",  ["ΐ"] = "ḯ",
	["κ"] = "k",  ["λ"] = "l",  ["μ"] = "m",  ["ν"] = "n",  ["ξ"] = "x",
	["ο"] = "o",  ["ό"] = "ó",  ["π"] = "p",  ["ρ"] = "r",  ["σ"] = "s",
	["ς"] = "s",  ["τ"] = "t",  ["υ"] = "y",  ["ύ"] = "ý",  ["ϋ"] = "ÿ",
	["ΰ"] = "ÿ́",  ["φ"] = "f",  ["χ"] = "ch", ["ψ"] = "ps", ["ω"] = "o",
	["ώ"] = "ó",
	["Α"] = "A",  ["Ά"] = "Á",  ["Β"] = "V",  ["Γ"] = "G",  ["Δ"] = "D",
	["Ε"] = "E",  ["Έ"] = "É",  ["Ζ"] = "Z",  ["Η"] = "I",  ["Ή"] = "Í",
	["Θ"] = "Th", ["Ι"] = "I",  ["Ί"] = "Í",  ["Κ"] = "K",  ["Λ"] = "L",
	["Μ"] = "M",  ["Ν"] = "N",  ["Ξ"] = "X",  ["Ο"] = "O",  ["Ό"] = "Ó",
	["Π"] = "P",  ["Ρ"] = "R",  ["Σ"] = "S",  ["Τ"] = "T",  ["Υ"] = "Y",
	["Ύ"] = "Ý",  ["Φ"] = "F",  ["Χ"] = "Ch", ["Ψ"] = "Ps", ["Ω"] = "O",
	["Ώ"] = "Ó",
-- punctuation
	["·"] = ";",
}

-- transliterates any words or phrases
function export.tr(text, lang, sc)
	-- Hack to get Greek headword in [[ἀναποδίζω]] to transliterate properly.
	if sc == "polytonic" then
		return require("Module:grc-translit").tr(text, lang, sc)
	end

	local gsub = mw.ustring.gsub
	local U = mw.ustring.char
	local acute = mw.ustring.char(0x301)
	local diaeresis = mw.ustring.char(0x308)

	text = gsub(gsub(text, "χ̌", "š"), "Χ̌", "Š") -- dialectal
	text = gsub(gsub(text, "ά̤", "ä́"), "Ά̤", "Ä́") -- dialectal
	text = gsub(gsub(text, "α̤", "ä"), "Α̤", "Ä") -- dialectal
	text = gsub(gsub(text, "ό̤", "ö́"), "Ό̤", "Ö́") -- dialectal
	text = gsub(gsub(text, "ο̤", "ö"), "Ο̤", "Ö") -- dialectal

	text = gsub(text, "([^A-Za-z0-9])[;" .. U(0x37E) .. "]", "%1?")

	text = gsub(text, "([αεηΑΕΗ])([υύ])()",
				function (vowel, upsilon, position)
					-- Find next character that is not whitespace or punctuation.
					local following = ""
					while true do
						local next = mw.ustring.sub(text, position, position)
						if next == "" then -- reached end of string
							break
						elseif next:find "[%s%p]" then
							position = position + 1
						else
							following = next
							break
						end
					end
					return tt[vowel]
						.. (upsilon == "ύ" and acute or "")
						.. ((following == "" or ("θκξπσςτφχψ"):find(following, 1, true)) and "f" or "v")
				end)

	text = gsub(text, "([αεοωΑΕΟΩ])([ηή])",
				function (vowel, ita)
					if ita == "ή" then
						return tt[vowel] .. "i" .. diaeresis .. acute
					else
						return tt[vowel] .. "i" .. diaeresis
					end
				end)

	text = gsub(text, "[ωΩ][ιί]",
				{["ωι"] = "oï", ["ωί"] = "oḯ",
				 ["Ωι"] = "Oï", ["Ωί"] = "Oḯ"})

	text = gsub(text, "[οΟ][υύ]",
				{["ου"] = "ou", ["ού"] = "oú",
				 ["Ου"] = "Ou", ["Ού"] = "Oú"})

	text = gsub(text, "(.?)([μΜ])π",
				function (before, mi)
					if before == "" or before == " " or before == "-" then
						if mi == "Μ" then
							return before .. "B"
						else
							return before .. "b"
						end
					end
				end)

	text = gsub(text, "(.?)([νΝ])τ",
				function (before, ni)
					if before == "" or before == " " or before == "-" then
						if ni == "Ν" then
							return before .. "D"
						else
							return before .. "d"
						end
					end
				end)

	text = gsub(text, "γ([γξχ])", "n%1")

	text = gsub(text, ".", tt)

	return text
end

return export
