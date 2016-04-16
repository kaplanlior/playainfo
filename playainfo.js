EventsCollection = new Mongo.Collection('events');
ProvidersCollection = new Mongo.Collection('providers');
// TODO move to collection once we need to work with new types
ProviderTypesCollection = [
  {value: 'Camp', label: 'Camp'},
  {value: 'Installation', label: 'Installation'},
  {value: 'Salon', label: 'Salon'},
  {value: 'Production', label: 'Production'},
];

function getProviderUuidByUrl() {
  return FlowRouter.getParam('uuid');
}

function getProvider() {
  uuid = getProviderUuidByUrl();
  result = ProvidersCollection.findOne({'uuid': uuid});
  return result;
}

if (Meteor.isClient) {
  Meteor.startup(function() {
  });

  Template.registerHelper('formatTime', function(rawTime) {
    return moment(rawTime).format('DD/MM/YY - HH:MM');
  });

  Template.viewEventsPage.events({
    'click .eventDeleteButton': function() {
      Meteor.call('deleteEvent', this._id);
    },

    'click .eventDeleteAllButton': function() {
      Meteor.call('deleteAllProviderEvents', this.uuid);
    },

    'click .eventEditButton': function() {
      FlowRouter.go('editEventPageRoute', {
        uuid: this.uuid,
        id: this._id,
      });
    },


  });

  Template.viewEventsPage.helpers({
    provider: function() {
      return getProvider();
    },

    events: function() {
      // uuid = FlowRouter.getParam('uuid');
      // TODO remove
      // if (uuid === '0') {
      //   return EventsCollection.find({}, {sort: {start: -1}});
      // }
      return EventsCollection.find({'uuid': this.uuid}, {sort: {start: -1}});
    },
  });

  Template.viewProvidersPage.events({
    'click .providersDeleteButton': function() {
      Meteor.call('deleteProvider', this.uuid);
    },

    'click .providersDeleteAllButton': function() {
      Meteor.call('deleteAllProviders');
    },

    'click .providersExport': async function() {
      csv = await Meteor.callPromise('exportProviders');
      blob = new Blob([csv], {type: 'text/plain;charset=utf-8'});
      // TODO add new Date() to filename
      saveAs(blob, 'providers.csv');
    },

    'click .providerEditButton': function() {
      FlowRouter.go('editProvidersPageRoute', {
        id: this._id,
      });
    },
  });

  Template.viewProvidersPage.helpers({
    providers: function() {
      return ProvidersCollection.find({}, {sort: {start: -1}});
    },
  });

  Template.addProvidersPage.events({
    'submit .addProvider': function(formEvent) {
      formEvent.preventDefault();
      providerId = FlowRouter.getParam('id');
      if (providerId) {
        Meteor.call('updateProvider', {
          id: providerId,
          hebrewName: formEvent.target.hebrewName.value,
          englishName: formEvent.target.englishName.value,
          type: formEvent.target.typeSelector.value,
        });
      } else {
        Meteor.call('addProvider', {
          hebrewName: formEvent.target.hebrewName.value,
          englishName: formEvent.target.englishName.value,
          type: formEvent.target.typeSelector.value,
        });
      }
      FlowRouter.go('viewProvidersPageRoute');
    },
  });

  Template.addProvidersPage.onCreated(function() {
    // var self = this;
    // self.autorun(function() {
    //   var id = FlowRouter.getParam('id');
    //   self.subscribe('provider', id);
    // });
  });

  Template.addProvidersPage.helpers({
    provider: function() {
      // if no id is found we are adding a new provider,
      // return empty object for context
      id = FlowRouter.getParam('id');
      return (id) ? ProvidersCollection.findOne(id) : {};
    },

    isEdit: function() {
      return FlowRouter.getParam('id');
    },

    isSelected: function(value) {
      return (value === this.type);
    },

    options: function() {
      return ProviderTypesCollection;
    },
  });

  Template.addEventPage.helpers({
    provider: function() {
      return getProvider();
    },

    event: function() {
      id = FlowRouter.getParam('id');
      result = EventsCollection.findOne(id);
      return (result) ? result : {};
    },
  });

  Template.addEventPage.events({
    'submit .addEvent': function(formEvent) {
      formEvent.preventDefault();
      id = FlowRouter.getParam('id');

      if (id) {
        Meteor.call('updateEvent', {
          title: formEvent.target.english_title.value,
          title_hebrew: formEvent.target.hebrew_title.value,
          desc: formEvent.target.english_desc.value,
          desc_hebrew: formEvent.target.hebrew_desc.value,
          start: formEvent.target.start_date.value,
          end: formEvent.target.end_date.value,
          uuid: FlowRouter.getParam('uuid'),
          id: id,
        });
      } else {
        Meteor.call('addEvent', {
          title: formEvent.target.english_title.value,
          title_hebrew: formEvent.target.hebrew_title.value,
          desc: formEvent.target.english_desc.value,
          desc_hebrew: formEvent.target.hebrew_desc.value,
          start: formEvent.target.start_date.value,
          end: formEvent.target.end_date.value,
          uuid: FlowRouter.getParam('uuid'),
        });
      }

      FlowRouter.go('eventsPageRoute', {
        uuid: FlowRouter.getParam('uuid'),
      });
    },
  });
}

if (Meteor.isServer) {
  // Uncomment below if autopublish is removed from project packages
  // Meteor.publish('EventsCollectionSub', function() {

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
      title: event.title,
      title_hebrew: event.title_hebrew,
      desc: event.desc,
      desc_hebrew: event.desc_hebrew,
      start: event.start,
      end: event.end,
      uuid: event.uuid,
      //TODO switch to moment.js?
      //check compatability with mongo ordering
      modifiedAt: new Date(),
      createdAt: new Date(),
    });
  },

  updateEvent: function(event) {
    EventsCollection.update(event.id, {
      $set: {
        title: event.title,
        title_hebrew: event.title_hebrew,
        desc: event.desc,
        desc_hebrew: event.desc_hebrew,
        start: event.start,
        end: event.end,
        uuid: event.uuid,
        modifiedAt: new Date(),
      }});
  },

  deleteEvent: function(eventId) {
    EventsCollection.remove(eventId);
  },

  deleteAllProviderEvents: function(providerUuid) {
    EventsCollection.remove({'uuid': providerUuid});
  },

  deleteProvider: function(providerUuid) {
    EventsCollection.remove({'uuid': providerUuid});
    ProvidersCollection.remove({'uuid': providerUuid});
  },

  deleteAllProviders: function() {
    EventsCollection.remove({});
    ProvidersCollection.remove({});
  },

  addProvider: function(provider) {
    ProvidersCollection.insert({
      name: provider.englishName,
      nameHebrew: provider.hebrewName,
      type: provider.type,
      uuid: uuid.v4(),
      modifiedAt: new Date(),
      createdAt: new Date(),
    });
  },

  updateProvider: function(provider) {
    ProvidersCollection.update(provider.id, {
      $set: {
        name: provider.englishName,
        nameHebrew: provider.hebrewName,
        type: provider.type,
        modifiedAt: new Date(), // current time },
      },
    });
  },

  exportEvents: function() {
    col = EventsCollection.find().map(function(u) {return u;});
    csv = Papa.unparse(col);
    return csv;
  },

  exportProviders: function() {
    col = ProvidersCollection.find().map(
      function(u) {
        return {
          'English name': u.name,
          'hebrew Name': u.nameHebrew,
          'Access Link': 'http://playainfo.midburn.org/events/' + u.uuid,
        };
      });
    csv = Papa.unparse(col);
    return csv;
  },
});
