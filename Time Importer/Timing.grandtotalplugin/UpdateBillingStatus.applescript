-- Update billing status for time entries in Timing
-- Parameters will be replaced by JavaScript:
-- <billedIDs/> - comma-separated list of IDs marked as billed
-- <paidIDs/> - comma-separated list of IDs marked as paid

tell application "TimingHelper"
	try
		-- Update billed entries
		set billedIDsText to "<billedIDs/>"
		if billedIDsText is not "" then
			update billing status for time entries with ids billedIDsText to billed
		end if
	end try

	try
		-- Update paid entries
		set paidIDsText to "<paidIDs/>"
		if paidIDsText is not "" then
			update billing status for time entries with ids paidIDsText to paid
		end if
	end try
end tell
