AppleScript:

```xml
		<enumeration name="billing status" code="BiSt">
			<enumerator name="not billable" code="BSNb" description="Work that should not be billed.">
				<cocoa string-value="not_billable" />
			</enumerator>
			<enumerator name="billable" code="BSBi" description="Work that can be billed but hasn't been yet.">
				<cocoa string-value="billable" />
			</enumerator>
			<enumerator name="billed" code="BSBd" description="Work that has been billed to the client.">
				<cocoa string-value="billed" />
			</enumerator>
			<enumerator name="paid" code="BSPa" description="Work that has been billed and paid for.">
				<cocoa string-value="paid" />
			</enumerator>

			<enumerator name="undetermined" code="BSUd" description="Matches time entries that do not have an explicit billing status set. Can only be used for filtering, not for creating time entries.">
				<cocoa string-value="undetermined" />
			</enumerator>

			<enumerator name="automatic" code="BSIn" description="Inherit the value from the parent level. Can only be used as a default billing status for projects, not for time entries.">
				<cocoa string-value="automatic" />
			</enumerator>
		</enumeration>
		<class name="report settings" code="ReSe" description="Holds settings to modify how a report is generated.">
			<cocoa class="ReportSettingsBuilder" />

			<property name="id" code="ID  " type="text" access="r" description="The unique identifier of the object.">
				<cocoa key="uniqueID" />
			</property>

			<property name="first grouping mode" code="GrM1" type="report grouping" description="The first criterion to group data by.">
				<cocoa key="groupingIndex0" />
			</property>
			<property name="second grouping mode" code="GrM2" type="report grouping" description="The second criterion to group data by.">
				<cocoa key="groupingIndex1" />
			</property>

			<property name="time entries included" code="TaIn" type="boolean" description="Whether to include time entries in the report">
				<cocoa key="tasksIncluded" />
			</property>
			<property name="time entry title included" code="TtIn" type="boolean" description="When time enties are included, whether to also provide the time entry's title.">
				<cocoa key="taskActivityTitleIncluded" />
			</property>
			<property name="also group by time entry title" code="AGTt" type="boolean" description="When including time entries and their titles, whether to also group by time entry title.">
				<cocoa key="alsoGroupByTaskActivityTitle" />
			</property>
			<property name="time entry timespan included" code="TtsI" type="boolean" description="When time entries are included, whether to also provide the time entry's timespan.">
				<cocoa key="taskActivityTimespanIncluded" />
			</property>
			<property name="time entry notes included" code="TnIn" type="boolean" description="When time entries are included, whether to also provide the time entry's notes.">
				<cocoa key="taskActivityNotesIncluded" />
			</property>
			<property name="time entry billing status included" code="TbSI" type="boolean" description="When time entries are included, whether to also provide the time entry's billing status.">
				<cocoa key="taskActivityBillingStatusIncluded" />
			</property>

			<property name="app usage included" code="AUIn" type="boolean" description="Whether to include app usage data in the report.">
				<cocoa key="appActivitiesIncluded" />
			</property>
			<property name="application info included" code="ApIn" type="boolean" description="When app usage is included, whether to also provide the application's name.">
				<cocoa key="appActivityApplicationIncluded" />
			</property>
			<property name="title info included" code="TiIn" type="boolean" description="When app usage is included, whether to also provide the activity's title.">
				<cocoa key="appActivityTitleIncluded" />
			</property>
			<property name="path info included" code="PiIn" type="boolean" description="When app usage is included, whether to also provide the activity's path">
				<cocoa key="appActivityPathIncluded" />
			</property>
			<property name="timespan info included" code="TsIn" type="boolean" description="When app usage is included, whether to also provide the activity's time span.">
				<cocoa key="appActivityTimespanIncluded" />
			</property>
			<property name="device info included" code="TsDe" type="boolean" description="When app usage is included, whether to also provide the activity's device.">
				<cocoa key="appActivityDeviceIncluded" />
			</property>

			<property name="also group by application" code="AGAp" type="boolean" description="When including app usage and application info, whether to also group by application." />

			<property name="include app activities covered by a time entry" code="iAPT" type="boolean" description="When including both app usage and time entries in a report, whether to include app usage that is already contained in a time entry.">
				<cocoa key="includeAppActivitiesThatArePartOfATaskActivity" />
			</property>

			<property name="billing status filter" code="BSFi" description="Filter time entries by billing status. Provide a list of billing statuses to include, or omit for no filtering.">
				<cocoa key="billingStatusFilterStrings" />
				<type type="billing status" list="yes" />
			</property>
		</class>

		<command name="add time entry" code="Addtaskx" description="Creates a new time entry.">
			<cocoa class="TimingUI.AddTaskCommand" />

			<parameter name="from" code="Stdt" type="date" optional="no" description="The start date of the new entry.">
				<cocoa key="startDate" />
			</parameter>

			<parameter name="to" code="Endt" type="date" optional="no" description="The end date of the time entry.">
				<cocoa key="endDate" />
			</parameter>

			<parameter name="with title" code="Desc" type="text" optional="yes" description="The title of the new entry.">
				<cocoa key="taskTitle" />
			</parameter>

			<parameter name="project" code="Proj" type="project" optional="yes" description="The name of the project to assign the entry's time to.">
				<cocoa key="project" />
			</parameter>

			<parameter name="notes" code="Note" type="text" optional="yes" description="The notes of the new entry.">
				<cocoa key="notes" />
			</parameter>

			<parameter name="billing status" code="BiSt" type="billing status" optional="yes" description="The billing status of the new entry.">
				<cocoa key="billingStatus" />
			</parameter>

			<parameter name="replace existing time entries" code="Oete" type="boolean" optional="yes" description="Whether to remove time entries that might already exist in the specified date range.">
				<cocoa key="overwriteExistingTimeEntries" />
			</parameter>
		</command>

		<command name="set billing status for entries" code="Setbilst" description="Sets the billing status for one or more time entries by their IDs.">
			<cocoa class="TimingUI.SetBillingStatusCommand" />

			<parameter name="with ids" code="EtId" optional="no" description="The IDs of time entries to update.">
				<type type="integer" list="yes" />
				<cocoa key="entryIDs" />
			</parameter>

			<parameter name="to" code="ToBs" type="billing status" optional="no" description="The billing status to set.">
				<cocoa key="targetBillingStatus" />
			</parameter>

			<result type="integer" description="The number of time entries updated." />
		</command>
```

Web API:

### List time entries. `(#time-entries-GETapi-v1-time-entries)`

_Requires authentication_

**GET** `api/v1/time-entries`

Return a list of time entries.

See [Display the specified time entry.](#time-entries-GETapi-v1-time-entries--time_entry_id-) for the returned attributes.

Items are ordered descending by their `start_date` field.

> If no date range filter is provided by setting *both* `start_date_min` *and* `start_date_max`,
this query returns all time entries between midnight (UTC) 30 days ago and end of day (UTC) today.

#### Query Parameters

- **start_date_min**: string - Restricts the query to time entries whose start date is equal to or later than this parameter.
    - Optional
    - Example: `"2019-01-01"`

- **start_date_max**: string - Restricts the query to time entries whose start date is equal to or earlier than this parameter.
    - Optional
    - Example: `"2019-01-01"`

- **projects**: string[] - Restricts the query to time entries associated with the given project. Can be repeated to include time entries from several projects. If you would like to include time entries that are not assigned to any project, you can provide an empty string, i.e. `projects[]=`
    - Optional
    - Example: `["\/projects\/1"]`

- **include_child_projects**: boolean - If true, the response will also contain time entries that belong to any child projects of the ones provided in `projects[]`. Default: `0`
    - Optional
    - Example: `"1"`

- **search_query**: string - Restricts the query to time entries whose title and/or notes contain all words in this parameter. The search is case-insensitive but diacritic-sensitive.
    - Optional
    - Example: `"meeting"`

- **is_running**: boolean - If provided, returns only time entries that are either running or not running. Default: `0`
    - Optional
    - Example: `"0"`

- **include_project_data**: boolean - If true, the properties of the time entry's project will be included in the response. Default: `0`
    - Optional
    - Example: `"1"`

- **include_team_members**: boolean - If true, the response will also contain time entries that belong to other team members, provided the current user has permission to view them. Default: `0`
    - Optional
    - Example: `"0"`

- **team_members**: string[] - Restricts the query to data associated with the given user. Can be repeated to include time entries from several users.
    - Optional
    - Example: `["\/users\/1"]`

- **billing_status**: string[] - Restricts the query to time entries with the given billing status. Can be repeated to include time entries with multiple statuses. Values: undetermined, not_billable, billable, billed, paid.
    - Optional
    - Example: `["billable"]`

#### Headers

- **Authorization**: `Bearer {{token}}`
- **Content-Type**: `application/json`
- **Accept**: `application/json`

#### Response

##### Status: 200 

```json
{
    "data": [
        {
            "self": "/time-entries/1",
            "start_date": "2019-01-01T00:00:00.000000+00:00",
            "end_date": "2019-01-01T01:00:00.000000+00:00",
            "duration": 3600,
            "project": {
                "self": "/projects/1",
                "team_id": null,
                "title": "Project at root level",
                "title_chain": [
                    "Project at root level"
                ],
                "color": "#FF0000",
                "productivity_score": 1,
                "is_archived": false,
                "notes": null,
                "parent": null,
                "default_billing_status": "billable",
                "custom_fields": {}
            },
            "title": "Client Meeting",
            "notes": "Some more detailed notes",
            "is_running": false,
            "creator_id": "/users/1",
            "creator_name": "Johnny Appleseed",
            "billing_status": "billable",
            "custom_fields": {}
        }
    ],
    "links": {
        "first": "http://timing-web.test/api/v1/time-entries?start_date_min=2019-01-01&start_date_max=2019-01-01&projects%5B0%5D=%2Fprojects%2F1&include_child_projects=1&search_query=meeting&is_running=0&include_project_data=1&include_team_members=0&team_members%5B0%5D=%2Fusers%2F1&billing_status%5B0%5D=billable&page=1",
        "last": "http://timing-web.test/api/v1/time-entries?start_date_min=2019-01-01&start_date_max=2019-01-01&projects%5B0%5D=%2Fprojects%2F1&include_child_projects=1&search_query=meeting&is_running=0&include_project_data=1&include_team_members=0&team_members%5B0%5D=%2Fusers%2F1&billing_status%5B0%5D=billable&page=1",
        "prev": null,
        "next": null
    },
    "meta": {
        "current_page": 1,
        "from": 1,
        "last_page": 1,
        "links": [
            {
                "url": null,
                "label": "« Previous",
                "page": null,
                "active": false
            },
            {
                "url": "http://timing-web.test/api/v1/time-entries?start_date_min=2019-01-01&start_date_max=2019-01-01&projects%5B0%5D=%2Fprojects%2F1&include_child_projects=1&search_query=meeting&is_running=0&include_project_data=1&include_team_members=0&team_members%5B0%5D=%2Fusers%2F1&billing_status%5B0%5D=billable&page=1",
                "label": "1",
                "page": 1,
                "active": true
            },
            {
                "url": null,
                "label": "Next »",
                "page": null,
                "active": false
            }
        ],
        "path": "http://timing-web.test/api/v1/time-entries",
        "per_page": 1000,
        "to": 1,
        "total": 1
    }
}
```

###### Headers

- **content-type**: `application/json`

---

## Reports `(#reports)`

### Generate report. `(#reports-GETapi-v1-report)`

_Requires authentication_

**GET** `api/v1/report`

Generate a report that can contain both time entries and app usage.

Returns a JSON array with several rows; each row includes the total duration (in seconds) belonging to the
corresponding other (configurable) columns.

The `include_app_usage` and `include_team_members` parameters govern whether to include app usage (otherwise, only time entries are returned) as well as data for other team members.

The `start_date_min`, `start_date_max`, `projects`(also see `include_child_projects`) and `search_query` parameters allow filtering the returned data.

The `columns`, `project_grouping_level`, `include_project_data`, `timespan_grouping_mode`, and `sort` parameters govern the presentation of the returned data.

> Fetching large amounts of app usage can put a substantial amount of load on our servers, so please be mindful before frequently requesting large amounts of data using this API.

> If no date range filter is provided by setting *both* `start_date_min` *and* `start_date_max`,
this query returns all time entries between midnight (UTC) 30 days ago and end of day (UTC) today.

#### Query Parameters

- **include_app_usage**: boolean - Whether to include app usage in the report. If false, only time entries are returned. Default: `0`
    - Optional
    - Example: `"0"`

- **include_team_members**: boolean - If true, the response will also contain time entries that belong to other team members, provided the current user has permission to view them. Default: `0`
    - Optional
    - Example: `"0"`

- **team_members**: string[] - Restricts the query to data associated with the given user. Can be repeated to include time entries from several users.
    - Optional
    - Example: `["\/users\/1"]`

- **start_date_min**: string - Restricts the query to data whose start date is equal to or later than this parameter.
    - Optional
    - Example: `"2019-01-01"`

- **start_date_max**: string - Restricts the query to data whose start date is equal to or earlier than this parameter.
    - Optional
    - Example: `"2019-01-01"`

- **projects**: string[] - Restricts the query to data associated with the given project. Can be repeated to include time entries from several projects. If you would like to include time entries that are not assigned to any project, you can provide an empty string, i.e. `projects[]=`
    - Optional
    - Example: `["\/projects\/1"]`

- **include_child_projects**: boolean - If true, the response will also contain time entries that belong to any child projects of the ones provided in `projects[]`. Default: `0`
    - Optional
    - Example: `"1"`

- **search_query**: string - Restricts the query to time entries whose title and/or notes contain all words in this parameter. The search is case-insensitive but diacritic-sensitive. Note: this parameter can not be used when app usage is included.
    - Optional
    - Example: `"meeting"`

- **billing_status**: string[] - Restricts the query to time entries with the given billing status. Can be repeated to include time entries with multiple statuses. Values: undetermined, not_billable, billable, billed, paid. Note: this parameter can not be used when app usage is included.
    - Optional
    - Example: `["billable"]`

- **columns**: string[] - Which columns to show. Can be repeated to provide multiple columns. The `user` column is ignored if `include_team_members` is false. Possible values: `project`, `title`, `notes`, `timespan`, `user`, `billing_status`. Default: `user`, `project`, `title`. `start_date` and `end_date` is shown when `timespan` column is sent.
    - Optional
    - Example: `["project"]`

- **project_grouping_level**: integer - When this argument is provided, report lines for projects below the given level will be aggregated by their parent project on the given level. For example, when `project_grouping_level` is 0, all times in sub-projects will be counted towards the corresponding project on the "root" (i.e. highest) level in the project tree. Can be a non-negative integer or -1. The default is -1, which indicates no grouping (i.e. all projects will be returned, regardless of how deep they are in the hierarchy). Requires `columns[]` to contain `project`.
    - Optional
    - Example: `"0"`

- **include_project_data**: boolean - If true, the properties of each line's project will be included in the response. Requires `columns[]` to contain `project`. Default: `0`
    - Optional
    - Example: `"1"`

- **timespan_grouping_mode**: string - When this argument is provided, report lines will be aggregated according to the given calendar unit. Possible values: `exact`, `day`, `week`, `month`, `year`. Default: `exact`
    - Optional
    - Example: `"day"`

- **sort**: string[] - Sort the results ascending by the given column; for descending order prefix the column name with a minus sign. Can be repeated to provide multiple sort columns. Default: `-duration`. Examples: `sort[]=-duration` -> Sort descending by duration. `sort[]=user&sort[]=-duration` -> Sort ascending by user, then descending by duration.
    - Optional
    - Example: `["-duration"]`

#### Headers

- **Authorization**: `Bearer {{token}}`
- **Content-Type**: `application/json`
- **Accept**: `application/json`

#### Response

##### Status: 200 

```json
{
    "data": [
        {
            "duration": 3600,
            "project": {
                "self": "/projects/1",
                "team_id": null,
                "title": "Project at root level",
                "title_chain": [
                    "Project at root level"
                ],
                "color": "#FF0000",
                "productivity_score": 1,
                "is_archived": false,
                "notes": null,
                "parent": null,
                "default_billing_status": "billable",
                "custom_fields": {}
            }
        }
    ]
}
```

###### Headers

- **content-type**: `application/json`

---

---

### Batch update time entries. `(#time-entries-PATCHapi-v1-time-entries-batch-update)`

_Requires authentication_

**PATCH** `api/v1/time-entries/batch-update`

Update multiple time entries at once.

This endpoint allows updating multiple time entries with the same data. All provided time entries will be updated with the fields specified in the `data` object.

> Only the fields provided in the `data` object will be updated. Omitted fields will remain unchanged.

> The title and project fields cannot both be empty after the update.

#### Headers

- **Authorization**: `Bearer {{token}}`
- **Content-Type**: `application/json`
- **Accept**: `application/json`

#### Body Parameters

- **time_entries**: string[] - Array of time entry IDs to update.
    - Required
    - Example: `[1,2,3]`

- **data**: object - Fields to update for all specified time entries.
    - Required
    - Example: `{"billing_status":"billed"}`

- **data.project**: string - The project this time entry is associated with. Can be a project reference in the form `"/projects/1"`, a project title (e.g. `"Project at root level"`), or an array with the project's entire title chain.
    - Optional
    - Example: `"Unproductive child project"`

- **data.title**: string - The time entry's title.
    - Optional
    - Example: `"Client Meeting"`

- **data.notes**: string - The time entry's notes.
    - Optional
    - Example: `"Some more detailed notes"`

- **data.custom_fields**: object - A list of custom field name/value pairs to update. For more details, see [Custom fields](#custom-fields).
    - Optional
    - Example: `{"field_name":"field_value"}`

- **data.billing_status**: string - Billing status: not_billable, billable, billed, paid. When omitted, the existing billing status is retained.
    - Optional
    - Example: `"billable"`

- **allow_editing_other_users**: boolean - Allow editing time entries that belong to other users (requires appropriate permissions).
    - Optional
    - Example: `false`

#### Response

##### Status: 200 

```json
{
    "data": [
        {
            "self": "/time-entries/1",
            "start_date": "2019-01-01T00:00:00.000000+00:00",
            "end_date": "2019-01-01T01:00:00.000000+00:00",
            "duration": 3600,
            "project": {
                "self": "/projects/2"
            },
            "title": "Client Meeting",
            "notes": "Some more detailed notes",
            "is_running": false,
            "creator_id": "/users/1",
            "creator_name": "Johnny Appleseed",
            "billing_status": "billed",
            "custom_fields": {
                "field_name": "field_value"
            }
        },
        {
            "self": "/time-entries/2",
            "start_date": "2019-01-01T02:00:00.000000+00:00",
            "end_date": "2019-01-01T03:00:00.000000+00:00",
            "duration": 3600,
            "project": {
                "self": "/projects/2"
            },
            "title": "Client Meeting",
            "notes": "Some more detailed notes",
            "is_running": false,
            "creator_id": "/users/1",
            "creator_name": "Johnny Appleseed",
            "billing_status": "billed",
            "custom_fields": {
                "field_name": "field_value"
            }
        },
        {
            "self": "/time-entries/3",
            "start_date": "2019-01-01T04:00:00.000000+00:00",
            "end_date": "2019-01-01T05:00:00.000000+00:00",
            "duration": 3600,
            "project": {
                "self": "/projects/2"
            },
            "title": "Client Meeting",
            "notes": "Some more detailed notes",
            "is_running": false,
            "creator_id": "/users/1",
            "creator_name": "Johnny Appleseed",
            "billing_status": "billed",
            "custom_fields": {
                "field_name": "field_value"
            }
        }
    ],
    "message": "Updated 3 time entries."
}
```

###### Headers

- **content-type**: `application/json`