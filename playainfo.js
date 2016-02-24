Events = new Mongo.Collection("events");

if (Meteor.isClient) {
  Meteor.subscribe("events");
  
  Template.body.helpers({
    events: function() {
		return Events.find({}, {sort: {start: -1}});
	}
  });
  
  Template.body.events({
    "submit .new-event": function (event) {
      // Prevent default browser form submit
      event.preventDefault();
 
      // Get value from form element
      //var titleText = event.target.title.value;
	  //var titleDesc = event.target.description.value;
	  //var start = event.target.start.value;
	  //var end = event.target.end.value;
	  
	  
	  
      // Insert a task into the collection
	  
	  Meteor.call("addEvent", {
		titleText: event.target.title.value,
		titleDesc: event.target.description.value,
		start: event.target.start.value,
		end: event.target.end.value
	  });
	  
     // Events.insert({
     //   title: titleText,
	//	description: titleDesc,
	//	start: new Date(start),
	//	end: new Date(end),
     //   createdAt: new Date() // current time
     // });
 
      // Clear form
	  event.target.title.value = "";
	  event.target.description.value = "";
	  event.target.start.value = "";
	  event.target.end.value = "";
    }
  });
  
  Template.event.events({
	"click .delete": function () {
		Meteor.call("deleteEvent", this._id);
	  }
  });
}

if (Meteor.isServer) {
  Meteor.publish("events", function () {
    return Events.find();
  });
}

Meteor.methods({
  addEvent: function (event) {
    Events.insert({
        title: event.titleText,
		description: event.titleDesc,
		start: new Date(event.start),
		end: new Date(event.end),
        createdAt: new Date() // current time
    });
  },
  deleteEvent: function (eventId) {
    Events.remove(eventId);
  }
});