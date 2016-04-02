EventsCollection = new Mongo.Collection("events");
ProvidersCollection = new Mongo.Collection("providers");

if (Meteor.isClient) {

  Meteor.startup(function () {
  });
  
  Template.event.helpers({
    formatTime: function(rawTime) {
      return moment(rawTime).format();
    }
  });

  Template.viewEventsPage.events({
    "click .eventDeleteButton": function () {
      Meteor.call("deleteEvent", this._id);
    },

    "click .eventDeleteAllButton": function () {
      Meteor.call("deleteAllEvents");
    }
  });
  
  Template.viewEventsPage.helpers({
    eventsCollection: function() {
      return EventsCollection.find({}, {sort: {start: -1}});
    }
  });

  Template.viewProvidersPage.events({
    "click .providerDeleteButton": function () {
      Meteor.call("deleteProvider", this._id);
    },

    "click .providerDeleteAllButton": function () {
      Meteor.call("deleteAllProviders");
    }
  });

  Template.viewProvidersPage.helpers({
    providersCollection: function() {
      return ProvidersCollection.find({}, {sort: {start: -1}});
    }
  });


  Template.addProvidersPage.events({
    "submit .addProvider": function (formEvent) {
      formEvent.preventDefault();

      Meteor.call("addProvider", {
        hebrewName: formEvent.target.hebrewName.value,
        englishName: formEvent.target.englishName.value,
        type: formEvent.target.typeSelector.value
      });

      formEvent.target.hebrewName.value = "";
      formEvent.target.englishName.value = "";
    }
  });

  Template.addEventPage.events({
    "submit .addEvent": function (formEvent) {
      formEvent.preventDefault();

      Meteor.call("addEvent", {
        title_hebrew: formEvent.target.hebrew_title.value,
        titleText: formEvent.target.english_title.value,
        titleDesc: formEvent.target.english_description.value,
        start: formEvent.target.start_date.value,
        end: formEvent.target.end_date.value

      });

      formEvent.target.hebrew_title.value = "";
      formEvent.target.english_title.value = "";
      formEvent.target.english_description.value = "";
      formEvent.target.start_date.value = "";
      formEvent.target.end_date.value = "";
    }
  });
}

if (Meteor.isServer) {
  // Meteor.publish("EventsCollectionSub", function () {
  //   return EventsCollection.find();
  // });
}

Meteor.methods({
  addEvent: function (event) {
    EventsCollection.insert({
      title: event.titleText,
      title_hebrew: event.title_hebrew,
      description: event.titleDesc,
      start: new Date(event.start),
      end: new Date(event.end),
      createdAt: new Date() // current time
    });
  },

  deleteEvent: function (eventId) {
    EventsCollection.remove(eventId);
  },

  deleteAllEvents: function () {
    EventsCollection.remove({});
  },

  deleteProvider: function (eventId) {
    ProvidersCollection.remove(eventId);
  },

  deleteAllProviders: function () {
    ProvidersCollection.remove({});
  },

  addProvider: function(provider) {
    ProvidersCollection.insert({
      name: provider.englishName,
      nameHebrew: provider.hebrewName,
      type: provider.type,
      createdAt: new Date() // current time
    });
  }
});