EventsCollection = new Mongo.Collection("events");
ProvidersCollection = new Mongo.Collection("providers");

var hebrewChars = new RegExp("^[\u0590-\u05FF]|\s+$");

if (Meteor.isClient) {

  Meteor.startup(function() {});


  $.validator.addMethod('hebrewText', function(value) {
    if (!value) {
      return true;
    }
    return hebrewChars.test(value);
  }, 'Please enter a valid hebrew text.');

  $.validator.addMethod("endDate", function(value, element) {
    var startDate = $('.start_date').val();
    return Date.parse(startDate) <= Date.parse(value) || value == "";
  }, "End date must be after start date");

  Template.event.helpers({
    formatTime: function(rawTime) {
      return moment(rawTime).format();
    }
  });

  Template.viewEventsPage.events({
    "click .eventDeleteButton": function() {
      Meteor.call("deleteEvent", this._id);
    },

    "click .eventDeleteAllButton": function() {
      Meteor.call("deleteAllEvents");
    }
  });

  Template.viewEventsPage.helpers({
    eventsCollection: function() {
      return EventsCollection.find({}, {
        sort: {
          start: -1
        }
      });
    }
  });

  Template.viewProvidersPage.events({
    "click .providerDeleteButton": function() {
      Meteor.call("deleteProvider", this._id);
    },

    "click .providerDeleteAllButton": function() {
      Meteor.call("deleteAllProviders");
    },

    "click .providerEditButton": function() {
      FlowRouter.go('editProvidersPageRoute', {
        id: this._id
      });
    }
  });

  Template.viewProvidersPage.helpers({
    providersCollection: function() {
      return ProvidersCollection.find({}, {
        sort: {
          start: -1
        }
      });
    }
  });


  Template.addProvidersPage.events({
    "submit .addProvider": function(formEvent) {
      formEvent.preventDefault();
      var providerId = FlowRouter.getParam('id');
      if (providerId) {
        Meteor.call("updateProvider", {
          id: providerId,
          hebrewName: formEvent.target.hebrewName.value,
          englishName: formEvent.target.englishName.value,
          type: formEvent.target.typeSelector.value
        });
      } else {
        Meteor.call("addProvider", {
          hebrewName: formEvent.target.hebrewName.value,
          englishName: formEvent.target.englishName.value,
          type: formEvent.target.typeSelector.value
        });
      }
      FlowRouter.go('viewProvidersPageRoute');
    }
  });

  Template.addProvidersPage.onCreated(function() {
    var self = this;
    self.autorun(function() {
      var id = FlowRouter.getParam('id');
      self.subscribe("provider", id);
    });
  });

  Template.addProvidersPage.helpers({
    provider: function() {
      return ProvidersCollection.findOne(FlowRouter.getParam('id'));
    },
    isEdit: function() {
      return FlowRouter.getParam('id');
    }
  });

  Template.viewProvidersPage.helpers({
    isSelected: function(optionValue, realValue) {
      return optionValue == realValue ? 'selected' : '';
    }
  });


  Template.addEventPage.events({
    "submit .addEvent": function(formEvent) {
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

  Template.addEventPage.onRendered(function() {

    $('.addEvent').validate({
      errorElement: "span",
      rules: {
        english_title: {
          minlength: 3,
          required: true
        },
        hebrew_title: {
          minlength: 3,
          required: true,
          hebrewText: true
        },
        hebrew_description: {
          minlength: 10,
          required: false,
          hebrewText: true
        },
        english_description: {
          minlength: 10,
          required: true
        },
        start_date: {
          required: true
        },
        end_date: {
          required: true,
          endDate: true
        }
      }
    });
  });
}

if (Meteor.isServer) {
  // Uncomment below if autopublish is removed from project packages

  // Meteor.publish("EventsCollectionSub", function () {
  //   return EventsCollection.find();
  // });
  // Meteor.publish('provider', function() {
  //   return ProvidersCollection.find();
  // });
  // Meteor.publish('providers', function() {
  //   return ProvidersCollection.find();
  // });

}

Meteor.methods({
  addEvent: function(event) {
    EventsCollection.insert({
      title: event.titleText,
      title_hebrew: event.title_hebrew,
      description: event.titleDesc,
      start: new Date(event.start),
      end: new Date(event.end),
      createdAt: new Date() // current time
    });
  },

  deleteEvent: function(eventId) {
    EventsCollection.remove(eventId);
  },

  deleteAllEvents: function() {
    EventsCollection.remove({});
  },

  deleteProvider: function(eventId) {
    ProvidersCollection.remove(eventId);
  },

  deleteAllProviders: function() {
    ProvidersCollection.remove({});
  },

  addProvider: function(provider) {
    ProvidersCollection.insert({
      name: provider.englishName,
      nameHebrew: provider.hebrewName,
      type: provider.type,
      createdAt: new Date() // current time
    });
  },
  updateProvider: function(provider) {
    ProvidersCollection.update(provider.id, {
      $set: {
        name: provider.englishName,
        nameHebrew: provider.hebrewName,
        type: provider.type,
        modifiedAt: new Date() // current time },
      }
    });
  }
});