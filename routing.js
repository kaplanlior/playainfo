FlowRouter.route('/', {
  action: function() {
    BlazeLayout.render("mainLayout", {content: "viewEventsPage"});
  }
});

FlowRouter.route('/events/', {
  name: 'eventsPageRoute',
  action: function(params) {
    BlazeLayout.render("mainLayout", {content: "viewEventsPage"});
  }
});

FlowRouter.route('/add-event/', {
  name: 'addEventPageRoute',
  action: function(params) {
    BlazeLayout.render("mainLayout", {content: "addEventPage"});
  }
});

FlowRouter.route('/providers/', {
  name: 'viewProvidersPageRoute',
  action: function(params) {
    BlazeLayout.render("mainLayout", {content: "viewProvidersPage"});
  }
});

FlowRouter.route('/add-providers/', {
  name: 'addProvidersPageRoute',
  action: function(params) {
    BlazeLayout.render("mainLayout", {content: "addProvidersPage"});
  }
});