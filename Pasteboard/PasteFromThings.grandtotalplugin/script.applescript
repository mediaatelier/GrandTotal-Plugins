tell application id "com.culturedcode.ThingsMac"
	set theList to selected to dos
	set theResult to "["
	set theMax to number of items in theList
	set theCount to 0
	repeat with theItem in theList
		set theCount to theCount + 1
		set theResult to theResult & "{"
		set theResult to theResult & quote & "name" & quote & ":"
		set theResult to theResult & quote & my escapeString(name of theItem) & quote
		set theResult to theResult & ","
		
		set theResult to theResult & quote & "notes" & quote & ":"
		set theResult to theResult & quote & my escapeString(notes of theItem) & quote
		
		set theResult to theResult & ","
		
		set theResult to theResult & quote & "completiondate" & quote & ":"
		
		if (completion date of theItem = missing value) then
			set theResult to theResult & quote & quote
		else
			set theResult to theResult & quote & completion date of theItem & quote
		end if
		
		set theResult to theResult & "}"
		if (theCount = theMax) then
		else
			set theResult to theResult & ","
		end if
		
	end repeat
	set theResult to theResult & "]"
	return theResult
end tell


on escapeString(thestring)
	return my replace_chars(thestring, "\n", "\\n")
end escapeString

on replace_chars(this_text, search_string, replacement_string)
	set AppleScript's text item delimiters to the search_string
	set the item_list to every text item of this_text
	set AppleScript's text item delimiters to the replacement_string
	set this_text to the item_list as string
	set AppleScript's text item delimiters to ""
	return this_text
end replace_chars