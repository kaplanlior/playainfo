FlowRouter.route('/', {
  action: function() {
    BlazeLayout.render('mainLayout', {content: 'viewEventsPage'});
  },
});

// FlowRouter.route('/events/', {
//   name: 'eventsPageRoute',
//   action: function(params) {
//     uuid = FlowRouter.getParam('uuid');
//     BlazeLayout.render('mainLayout', {content: 'viewEventsPage'});
//   },
// });

FlowRouter.route('/events/:uuid/', {
  name: 'eventsPageRoute',
  action: function(params) {
    BlazeLayout.render('mainLayout', {content: 'viewEventsPage'});
  },
});

FlowRouter.route('/events/:uuid/:id', {
  name: 'editEventPageRoute',
  action: function(params) {
    BlazeLayout.render('mainLayout', {content: 'addEventPage'});
  },
});

FlowRouter.route('/add-event/:uuid', {
  name: 'addEventPageRoute',
  action: function(params) {
    BlazeLayout.render('mainLayout', {content: 'addEventPage'});
  },
});

// FlowRouter.route('/add-event/', {
//   name: 'addEventPageRoute',
//   action: function(params) {
//     BlazeLayout.render('mainLayout', {content: 'addEventPage'});
//   },
// });

FlowRouter.route('/providers/', {
  name: 'viewProvidersPageRoute',
  //TODO add subscriptions
  // subscriptions: function(params) {
  //   this.register('providers', Meteor.subscribe('providers'));
  // },
  action: function(params) {
    BlazeLayout.render('mainLayout', {content: 'viewProvidersPage'});
  },
});

FlowRouter.route('/provider/', {
  name: 'addProvidersPageRoute',
  action: function(params) {
    BlazeLayout.render('mainLayout', {
      content: 'addProvidersPage',
      action: 'Add',
    });
  },
});

FlowRouter.route('/provider/:id?', {
  name: 'editProvidersPageRoute',
  //TODO add subscriptions
  // subscriptions: function(params) {
  //   this.register('singleProvider', Meteor.subscribe('singleProvider', params.id));
  // },
  action: function(params) {
    BlazeLayout.render('mainLayout', {
      content: 'addProvidersPage',
      action: 'Edit',
    });
  },
});

// FlowRouter.route('/events/:uuid/', {
//   name: 'viewEvents',
//   action: function(params) {
//     BlazeLayout.render('mainLayout', {content: 'viewEventsPageTest'});
//   },
// });
