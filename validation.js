//TODO if refreshing page when creating new event, server side validation doesn't work

var hebrewChars = new RegExp("^[\u0590-\u05FF]|\s+$");

if (Meteor.isClient) {
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
}
