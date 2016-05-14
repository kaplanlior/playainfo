EventsCollection = new Mongo.Collection('events');
ProvidersCollection = new Mongo.Collection('providers');
// TODO move to collection once we need to work with new types
ProviderTypesCollection = [
{value: 'Camp', label: 'Camp'},
{value: 'Installation', label: 'Installation'},
{value: 'Salon', label: 'Salon'},
{value: 'Production', label: 'Production'},
];

defaultItemOrder = {sort: {start: -1}};

function getProviderUuidByUrl() {
  return FlowRouter.getParam('uuid');
}

function getProvider() {
  uuid = getProviderUuidByUrl();
  result = ProvidersCollection.findOne({'uuid': uuid});
  return result;
}

function extractEventFromForm(formEvent) {
  return {
    title: formEvent.target.english_title.value,
    title_hebrew: formEvent.target.hebrew_title.value,
    desc: formEvent.target.english_desc.value,
    desc_hebrew: formEvent.target.hebrew_desc.value,
    start_time: formEvent.target.start_time.value,
    start_date: formEvent.target.start_date.value,
    end_time: formEvent.target.end_time.value,
    end_date: formEvent.target.end_date.value,
    recurring: formEvent.target.recurring.checked,
    allDay: formEvent.target.allDay.checked,
    adults_only: formEvent.target.adults_only.checked,
    for_kids: formEvent.target.for_kids.checked,
    party: formEvent.target.party.checked,
    performance: formEvent.target.performance.checked,
    movie: formEvent.target.movie.checked,
    game: formEvent.target.game.checked,
    workshop: formEvent.target.workshop.checked,
    lecture: formEvent.target.lecture.checked,
  };
}

if (Meteor.isClient) {
  Meteor.startup(function() {
  });

  Template.registerHelper('authInProcess', function() {
    return Meteor.loggingIn();
  });

  Template.registerHelper('canShow', function() {
    return !!Meteor.user();
  });

  Template.registerHelper('formatTime', function(date, time) {
    return moment(date + ' ' + time).format('DD/MM/YY - HH:MM');
  });

  Template.event.helpers({
    displayRecurring: function() {
      return !this.recurring;
    },

    displayAllDay: function() {
      return !this.all_day;
    },
  });

  Template.viewEventsPage.onCreated(function() {
    this.state = new ReactiveDict();
  });

  Template.viewEventsPage.events({
    'input .search': function(event, instance) {
      instance.state.set('filter', event.target.value);
    },

    'click .eventDeleteButton': function() {
      id = this._id;
      new Confirmation({
        message: 'Delete event?',
        title: 'Confirmation',
        cancelText: 'Cancel',
        okText: 'Ok',
        success: false,
        focus: 'cancel',
      }, function(ok) {
        if (ok) {
          Meteor.call('deleteEvent', id);
          Bert.alert({
            title: 'Action successful',
            message: 'Successfully removed event',
            type: 'warning',
            style: 'growl-top-right',
            icon: 'fa-thumbs-up',
          });
        }
      });
    },

    'click .eventDeleteAllButton': function() {
      uuid = this.uuid;
      new Confirmation({
        message: 'Delete all events?',
        title: 'Confirmation',
        cancelText: 'Cancel',
        okText: 'Ok',
        success: false,
        focus: 'cancel',
      }, function(ok) {
        if (ok) {
          Meteor.call('deleteAllProviderEvents', uuid);
          Bert.alert({
            title: 'Action successful',
            message: 'Successfully removed all events',
            type: 'warning',
            style: 'growl-top-right',
            icon: 'fa-thumbs-up',
          });
        }
      });
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
      instance = Template.instance();
      filter = instance.state.get('filter');
      querry = {
        $and: [
        {'uuid': this.uuid},
        ],
      };
      if (filter) {
        regex = new RegExp('^.*'+filter+'.*', 'i');
        querry['$and'].push({
          $or: [
          {title: {$regex : regex}},
          {title_hebrew: {$regex : regex}},
          ],
        });
      }
      return EventsCollection.find(querry, defaultItemOrder);
    },
  });

  Template.viewProvidersPage.onCreated(function() {
    this.state = new ReactiveDict();
  });

  Template.viewProvidersPage.events({
    'change .file': function(event, instance) {
      Papa.parse(event.target.files[0], {
        complete: function(results) {
          Meteor.call('IngestEventsFromFile', results);
        },
      });
    },

    'input .search': function(event, instance) {
      instance.state.set('filter', event.target.value);
    },

    'click .providersDeleteButton': function() {
      uuid = this.uuid;
      new Confirmation({
        message: 'Delete provider?',
        title: 'Confirmation',
        cancelText: 'Cancel',
        okText: 'Ok',
        success: false,
        focus: 'cancel',
      }, function(ok) {
        if (ok) {
          Meteor.call('deleteProvider', uuid);
          Bert.alert({
            title: 'Action successful',
            message: 'Successfully removed provider',
            type: 'warning',
            style: 'growl-top-right',
            icon: 'fa-thumbs-up',
          });
        }
      });
    },

    'click .providersDeleteAllButton': function() {
      new Confirmation({
        message: 'Delete all providers?',
        title: 'Confirmation',
        cancelText: 'Cancel',
        okText: 'Ok',
        success: false,
        focus: 'cancel',
      }, function(ok) {
        if (ok) {
          Meteor.call('deleteAllProviders');
          Bert.alert({
            title: 'Action successful',
            message: 'Successfully removed all providers',
            type: 'warning',
            style: 'growl-top-right',
            icon: 'fa-thumbs-up',
          });
        }
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
      instance = Template.instance();
      filter = instance.state.get('filter');
      querry = {};
      if (filter) {
        regex = new RegExp('^.*'+filter+'.*', 'i');
        querry = {
          $or: [
          {name: {$regex : regex}},
          {nameHebrew: {$regex : regex}},
          ],
        };
      }
      return ProvidersCollection.find(querry, defaultItemOrder);
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
      action = providerId ? 'saved' : 'added';
      Bert.alert({
        title: 'Action successful',
        message: 'Successfully '+action+' provider',
        type: 'info',
        style: 'growl-top-right',
        icon: 'fa-thumbs-up',
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

  Template.addEventPage.onCreated(function() {
    this.state = new ReactiveDict();
  });

  Template.addEventPage.helpers({
    dateDisabled: function() {
      instance = Template.instance();
      recurring = instance.state.get('recurring');
      if (recurring === undefined) {
        recurring = this.recurring;
      }
      return (recurring) ? 'disabled' : '';
    },

    timeDisabled: function() {
      instance = Template.instance();
      allDay = instance.state.get('allDay');
      if (allDay === undefined) {
        allDay = this.all_day;
      }
      return (allDay) ? 'disabled' : '';
    },

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
    'change #recurring': function(event, instance) {
      instance.state.set('recurring', event.target.checked);
    },

    'change #allDay': function(event, instance) {
      instance.state.set('allDay', event.target.checked);
    },

    'submit .addEvent': function(formEvent) {
      formEvent.preventDefault();
      id = FlowRouter.getParam('id');
      uuid = FlowRouter.getParam('uuid');
      storedEvent = extractEventFromForm(formEvent);
      storedEvent.uuid = uuid;
      if (id) {
        storedEvent.id = id;
        Meteor.call('updateEvent', storedEvent);
      } else {
        Meteor.call('addEvent', storedEvent);
      }

      Bert.alert({
        title: 'Action successful',
        message: 'Succcessfully saved event',
        type: 'info',
        style: 'growl-top-right',
        icon: 'fa-thumbs-up',
      });

      FlowRouter.go('eventsPageRoute', {
        uuid: uuid,
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

