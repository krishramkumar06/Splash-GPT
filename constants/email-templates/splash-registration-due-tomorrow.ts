export const SPLASH_REGISTRATION_DUE_TOMORROW = {
  subject: "Registration for {{config.program}} DUE TOMORROW",
  body: "<p>Hello {{user.first_name}},</p>" +
        "<p>We just wanted to remind you that {{config.program}} at Yale {{config.semester}} student registration is closing soon!</p>" +
        "<p>{{config.program}} is a one-day program full of classes taught by Yale students on a diverse range of subjects. From \"Basics of Special Relativity\" to \"History of the Aztecs\" and \"An Introduction to Modular Origami,\" our classes cater to students from {{config.gradeRange}}. This fall, {{config.program}} will be happening on {{config.eventDates}}, and the <a href=\"{{config.catalogLink}}\">Class Catalog is available</a>!</p>" +
        "<p>{{config.program}} is a great opportunity to take a class on a subject you're already interested in, or to try out a subject you've never heard of before! The cost of the program is {{config.cost}}, including lunch. Shirts can be purchased for an additional {{config.tshirtCost}}, and Financial aid is always available to students who demonstrate need.</p>" +
        "<p>This is the final reminder that student registration closes <strong>TOMORROW, {{config.registrationDeadlineFull}} AT 11:59PM</strong>–we are near capacity so sign up ASAP! Payment and financial aid applications are also due at that same time.</p>" +
        "<p>Feel free to contact us at {{config.email}} if you have any questions or concerns. We are very excited to see you all this Saturday!</p>" +
        "<p>Best,</p>" +
        "<p>{{config.directors}}</p>",
};









