# playainfo
The the Playa Info Scheduler (תוכניה) that all theme camps, art installations and any other content provider in Midburn will participate in building.

Initial product definition
--------------------------

This system will contain all activities offered in the event.

We would like to automate content gathering from the different content providers.
For starters, we want a form to gather the following data:

1. Theme camps
2. Art department
3. The Salon

Playinfo has a few fields per activity:

1. Owner (theme camp/art department/salon). If theme camp, then the identity of the specific camp should be select from a dropdown.
2. Hebrew name (50 characters)
3. English name (50 characters)
4. Date & Time
5. Location: Salon / art location on the playa ? / Theme camp (in this case, English & Hebrew name of the camp)
6. Who is the activity suitable for? (Symbol by camp)
7. Hebrew Description (270 characeters)
8. English Description (270 characters)

All this data needs to be stored in a data store that allows export to Excel.

Design Notes
------------
1. The system will be based on a scheduler, allowing the user to input the details for the 5 days in Midburn.(edited)
