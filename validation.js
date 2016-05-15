//TODO if refreshing page when creating new event, server side validation doesn't work

var hebrewChars = new RegExp("^[\u0590-\u05FF]|\s+$");

if (Meteor.isClient) {
  $.validator.addMethod('hebrewText', function(value) {
    if (!value) {
      return true;
    }
    return hebrewChars.test(value);
  }, 'Please enter a valid hebrew text.');

  $.validator.addMethod('validDate', function(value, element) {
    // startDate = $('.start_date').val();
    // return Date.parse(startDate) <= Date.parse(value) || value === '';
    return true;
  }, 'End date must be after start date');

  Template.addEventPage.onRendered(function() {
    $('#addEvent').validate({
      errorElement: 'span',
      rules: {
        english_title: {
          minlength: 3,
          maxlength: 140,
          required: true,
        },
        hebrew_title: {
          minlength: 3,
          maxlength: 140,
          required: true,
          hebrewText: true,
        },
        hebrew_desc: {
          minlength: 10,
          maxlength: 270,
          required: false,
          hebrewText: true,
        },
        english_desc: {
          minlength: 10,
          maxlength: 250,
          required: true,
        },
        start_date: {
          // required: true,
        },
        end_date: {
          // required: true,
          validDate: true,
        },
      },
    });
  });
}
