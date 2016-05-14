
var eventLogger = console;


if (Meteor.isServer) {
 eventLogger = LogManager.createLogger({logFile: 'events.log'});  
}

function prepareEvent(event) {
  return {
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
    adults_only: event.adults_only,
    for_kids: event.for_kids,
    party: event.party,
    performance: event.performance,
    movie: event.movie,
    game: event.game,
    workshop: event.workshop,
    lecture: event.lecture,
    uuid: event.uuid,
    modifiedAt: new Date(),
  };
}

Meteor.methods({
  addEvent: function(event) {
    eventLogger.info("Creating an event:", event);
    storedEvent = prepareEvent(event);
    storedEvent.createdAt = new Date();
    EventsCollection.insert(storedEvent);
  },

  updateEvent: function(event) {
    eventLogger.info("Updating an event:", event);
    storedEvent = prepareEvent(event);
    EventsCollection.update(event.id, {
      $set: storedEvent,
    });
  },

  deleteEvent: function(eventId) {
    eventLogger.info("Deleting an event with id:", eventId);
    EventsCollection.remove(eventId);
  },

  deleteAllProviderEvents: function(providerUuid) {
    eventLogger.info("Deleting all events from provider with uuid:", providerUuid);
    EventsCollection.remove({'uuid': providerUuid});
  },

  deleteProvider: function(providerUuid) {
    eventLogger.info("Deleting provider with uuid:", providerUuid);
    EventsCollection.remove({'uuid': providerUuid});
    ProvidersCollection.remove({'uuid': providerUuid});
  },

  deleteAllProviders: function() {
    eventLogger.info("Deleting all providers");
    EventsCollection.remove({});
    ProvidersCollection.remove({});
  },

  addProvider: function(provider) {
    eventLogger.info("Creating a provider:", provider);
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
    eventLogger.info("Updating provider:", provider);
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

  // IngestEventsFromFile: function(csvFile) {
  //   // console.log(csvFile);
  //   // for each line in csvFile
  //   provider = parseProvider(line);
  //   if (!isProviderExists(provider)) {
  //     insertProvider(provider);
  //   }
  //   time = parseTime(line);
  //   date = parseDate(line);
  //   tags = parseTags(line);
  //   engTitle = parseEnglishTitle(line);
  //   engDesc = parseEnglishDesc(line);
  //   hebTitle = parseHebrewTitle(line);
  //   hebDesc = parseHebrewDesc(line);

  //   // event = new Event{
  //   //   a = a;
  //   //   b= b;
  //   //   c = d;
  //   // }

  //   insertEvent(event);
  // },
});
