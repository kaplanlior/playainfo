EventsCollection = new Mongo.Collection('events');
ProvidersCollection = new Mongo.Collection('providers');

function getProviderUuidByUrl() {
  uuid = '';
  try {
    uuid = FlowRouter.getParam('uuid');
  } catch (e) {
    log('Attempted to extract provider uuid from invalid URL');
  }
  return uuid;
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
      Meteor.call('deleteEvent', this._id);
    },

    'click .eventDeleteAllButton': function() {
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
  });

  Template.viewProvidersPage.helpers({
    providers: function() {
      return ProvidersCollection.find({}, {sort: {start: -1}});
    },
  });

  Template.addProvidersPage.events({
    'submit .addProvider': function(formEvent) {
      formEvent.preventDefault();

      Meteor.call('addProvider', {
        hebrewName: formEvent.target.hebrewName.value,
        englishName: formEvent.target.englishName.value,
        type: formEvent.target.typeSelector.value,
      });

      formEvent.target.hebrewName.value = '';
      formEvent.target.englishName.value = '';
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

      formEvent.target.hebrew_title.value = '';
      formEvent.target.english_title.value = '';
      formEvent.target.english_description.value = '';
      formEvent.target.start_date.value = '';
      formEvent.target.end_date.value = '';
    },
  });
}

if (Meteor.isServer) {
  // Meteor.publish('EventsCollectionSub', function() {
  //   return EventsCollection.find();
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

  exportEvents: function() {
    col = EventsCollection.find().map(function(u) {return u;});
    csv = Papa.unparse(col);
    return csv;
  },

  exportProviders: function() {
    col = ProvidersCollection.find().map(function(u) {return u;});
    csv = Papa.unparse(col);
    return csv;
  },
});
