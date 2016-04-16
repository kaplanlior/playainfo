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
    return moment(rawTime).format();
  });

  Template.viewEventsPage.events({
    'click .eventDeleteButton': function() {
      Bert.alert({
        title: 'Action successful',
        message: 'Successfully removed the event',
        type: 'warning',
        style: 'growl-top-right',
        icon: 'fa-thumbs-up'
      });
      Meteor.call('deleteEvent', this._id);
    },

    'click .eventDeleteAllButton': function() {      
      Bert.alert({
        title: 'Action successful',
        message: 'Successfully removed all events',
        type: 'warning',
        style: 'growl-top-right',
        icon: 'fa-thumbs-up'
      });
      Meteor.call('deleteAllProviderEvents', this.uuid);
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
      Bert.alert({
        title: 'Action successful',
        message: 'Successfully removed provider',
        type: 'warning',
        style: 'growl-top-right',
        icon: 'fa-thumbs-up'
      });
    },

    'click .providersDeleteAllButton': function() {
      Meteor.call('deleteAllProviders');
      Bert.alert({
        title: 'Action successful',
        message: 'Successfully removed all providers',
        type: 'warning',
        style: 'growl-top-right',
        icon: 'fa-thumbs-up'
      });
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
      var action = providerId ? 'saved' : 'added';
      Bert.alert({
        title: 'Action successful',
        message: 'Successfully '+action+' a provider',
        type: 'info',
        style: 'growl-top-right',
        icon: 'fa-thumbs-up'
      });
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
  });

  Template.addEventPage.events({
    'submit .addEvent': function(formEvent) {
      formEvent.preventDefault();

      Meteor.call('addEvent', {
        title_hebrew: formEvent.target.hebrew_title.value,
        titleText: formEvent.target.english_title.value,
        titleDesc: formEvent.target.english_description.value,
        start: formEvent.target.start_date.value,
        end: formEvent.target.end_date.value,
        uuid: FlowRouter.getParam('uuid'),
      });

      Bert.alert({
        title: 'Action successful',
        message: 'Succcessfully added an event',
        type: 'info',
        style: 'growl-top-right',
        icon: 'fa-thumbs-up'
      });

      formEvent.target.hebrew_title.value = '';
      formEvent.target.english_title.value = '';
      formEvent.target.english_description.value = '';
      formEvent.target.start_date.value = '';
      formEvent.target.end_date.value = '';
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
      title: event.titleText,
      title_hebrew: event.title_hebrew,
      description: event.titleDesc,
      start: new Date(event.start),
      end: new Date(event.end),
      uuid: event.uuid,
      createdAt: new Date(),
    });
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
      createdAt: new Date(),
      uuid: uuid.v4(),
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
