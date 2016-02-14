Playa Info
----------
The Playa Info Scheduler (תוכניה) that all theme camps, art installations and any other content provider in Midburn will participate in building.

Product definition
------------------

This system will contain all activities offered throughout the Midburn event.

The system will be used by different content providers to gather information regarding each event and project, be it a one-time-event, continuous event, daily or any other. 

The providers of the information are:

1. Theme camps - Each cammp adds the entire schedule of events happening in the camp throughout Midburn
2. Art department - Adding art related events (where offered by the art installation). This includes the burning of art installations.
3. The Salon - Salon Manager will add all events planned throughout Midburn.
4. Production - Production related events and others.

Admin Interface
---------------

1. Management of groups:

	a. Add group (theme camp/art/salon/production) and sub-group (theme camp name/art installation name)

	b. view group

	c. delete group - Deleting the group removes all of its events.
	
2. Management of users

	a. Permissions (admin/user)

	b. Assign user to the group and/or sub-group (owner)

	c. Sub-groups are selected from a dropdown.

3. Management of schedule:

	a. View schedule with filter (per group and/or sub-group).

	b. Define schedule dates (from - to dates)

	c. Export schedule to excel/CSV (event name, description, date and time). Example: https://docs.google.com/spreadsheets/d/18mE6Q5u_LgWdrELrjN5tliuAziYJBIWqq_sziaq6x2Y/edit#gid=788140304

	d. If event happens more than one day, split it to each day.
	
	e. Export rows should be by ascending date and time. 
	
User interface:

1. Both Hebrew and English fields are required for all inputs (since the schedule will be in both)

2. Text fields come with basic font design toolbar (bold, underline, italic)

3. owner of a group or sub-group can create each event for his group/sub-group

4. No validation required for the event dates.

5. Events can only be defined between the dates of the Midburn event, defined by Admin.

6. Event fields:

	a. [Event name:] - max 50 chars - English and Hebrew.

	b. [Location:] - Initially: group name - English and Hebrew

	c. [Suitable for:] - Multi selection: [Any age], [Men only], [Women only], [Couples only], [children above age of] (if selected, numeric field appears).
	
	d. [Description] - Max 270 characeters - English and Hebrew.
	
	e. [Event dates] - Fields [From:] and [To:] with date and time field (both manual input and clicking opens a calender view). Only event days (defined by admin) are allowed. 
	
		i. [All day event] checkbox - Checking the field will remove the hours.
	
		ii. [Every day event] checkbox - Checking the field will remove the dates (only leave hours).
	
		iii. checking both checkboxes will make the event every day all day.
	
	f. [Icons] - User can multi select icons to the event: Movie, Music, Kids, Food, Workshop, Party, Adult, Live show, Game, Fire, Main event, Art.
	
	g. [Save] button. If there is a concurent event happening at the same time, a warning will be displayed and the user can select to save or return to unsaved event (to correct dates).

7. User Interface displays a list of all the group's events (table: Name, From, to) with action buttons: Edit, Delete

8. User can select to view interface in Hebrew or English. 
