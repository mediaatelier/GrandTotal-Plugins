on processList(theList)

	set myclient to getOrCreateProject(item 1 of theList, missing value)
	set myproject to getOrCreateProject(item 2 of theList, myclient)


	repeat with i from 3 to length of theList
		getOrCreateProject(item i of theList, myproject)
	end repeat


	return ""

end processList



on getOrCreateProject(projectName, parentProject)
	if projectName = "" then
		return missing value
	end if

	tell application "TimingHelper"
		if parentProject is missing value then
			set results to (projects whose name is projectName)
			if results = {} then
				return (create project name projectName)
			else
				return (first item of results)
			end if
		else
			set results to (projects of parentProject whose name is projectName)
			if results = {} then
				return (create project name projectName parent project parentProject)
			else
				return (first item of results)
			end if
		end if
	end tell
end getOrCreateProject
