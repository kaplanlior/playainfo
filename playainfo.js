EventsCollection = new Mongo.Collection('events');
ProvidersCollection = new Mongo.Collection('providers');

var hebrewChars = new RegExp("^[\u0590-\u05FF]|\s+$");

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


  $.validator.addMethod('hebrewText', function(value) {
    if (!value) {
      return true;
    }
    return hebrewChars.test(value);
  }, 'Please enter a valid hebrew text.');

  $.validator.addMethod('endDate', function(value, element) {
    startDate = $('.start_date').val();
    return Date.parse(startDate) <= Date.parse(value) || value === '';
  }, 'End date must be after start date');

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
    var self = this;
    self.autorun(function() {
      var id = FlowRouter.getParam('id');
      self.subscribe('provider', id);
    });
  });

  Template.addProvidersPage.helpers({
    provider: function() {
      return ProvidersCollection.findOne(FlowRouter.getParam('id'));
    },
    isEdit: function() {
      return FlowRouter.getParam('id');
    },
  });

  Template.addEventPage.helpers({
    provider: function() {
      return getProvider();
    },
  });

  Template.viewProvidersPage.helpers({
    isSelected: function(optionValue, realValue) {
      return optionValue == realValue ? 'selected' : '';
    }
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

  Template.addEventPage.onRendered(function() {
    $('.addEvent').validate({
      errorElement: 'span',
      rules: {
        english_title: {
          minlength: 3,
          required: true,
        },
        hebrew_title: {
          minlength: 3,
          required: true,
          hebrewText: true,
        },
        hebrew_description: {
          minlength: 10,
          required: false,
          hebrewText: true,
        },
        english_description: {
          minlength: 10,
          required: true,
        },
        start_date: {
          required: true,
        },
        end_date: {
          required: true,
          endDate: true,
        },
      },
    });
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
