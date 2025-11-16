tell application "TimingHelper"
	set reportSettings to make report settings
	set exportSettings to make export settings

	tell reportSettings
		set first grouping mode to raw
		set second grouping mode to by project
		set time entries included to true
		set time entry title included to true
		set also group by time entry title to true
		set time entry timespan included to true
		set time entry notes included to true
		set app usage included to false
		set application info included to false
		set timespan info included to false
		set also group by application to true
		try
			set billing status filter to {billable, billed, paid, undetermined}
		end try
	end tell

	tell exportSettings
		set file format to CSV
		set duration format to seconds
		set short entries included to true
	end tell

	save report with report settings reportSettings export settings exportSettings between (current date) - (365 * <years/> * days) and current date to "<destination/>"

	-- these commands are required to avoid accumulating old settings (and thus leaking memory)
	delete reportSettings
	delete exportSettings
end tell
