Meteor.methods({
  addEvent: function(event) {
    EventsCollection.insert({
      title: event.title,
      title_hebrew: event.title_hebrew,
      desc: event.desc,
      desc_hebrew: event.desc_hebrew,
      start_time: event.start_time,
      start_date: event.start_date,
      end_time: event.end_time,
      end_date: event.end_date,
      recurring: event.recurring,
      all_day: event.allDay,
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
        start_time: event.start_time,
        start_date: event.start_date,
        end_time: event.end_time,
        end_date: event.end_date,
        recurring: event.recurring,
        all_day: event.allDay,
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
