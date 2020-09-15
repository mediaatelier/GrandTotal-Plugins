tell application "TimingHelper"
	set reportSettings to make report settings
	set exportSettings to make export settings
	
	get properties of reportSettings
	
	tell reportSettings
		set first grouping mode to raw
		set second grouping mode to by project
		set tasks included to true
		set task title included to true
		set also group by task title to true
		set task timespan included to true
		set task notes included to true
		set app usage included to false
		set application info included to false
		set timespan info included to false
		set also group by application to true
	end tell
	
	tell exportSettings
		set file format to CSV
		set duration format to seconds
		set short entries included to true
	end tell
	
	save report with report settings reportSettings export settings exportSettings between (current date) - (180 * days) and current date to "<destination/>"
	
	-- these commands are required to avoid accumulating old settings (and thus leaking memory)
	delete reportSettings
	delete exportSettings
end tell