export const SPLASH_PRINTOUT_REMINDER = {
  subject: "LAST CALL FOR PRINT-OUT SUBMISSIONS",
  body: "<p>Dear {{user.first_name}},</p>" +
        "<p>We're so excited to see you this Saturday, {{config.eventDates}}, for {{config.program}}! As a reminder, we ask that you <a href=\"{{config.materialsFormLink}}\">fill out this form</a> with your course materials by <strong>{{config.materialsDeadline}}</strong>; we can print out 5 pages of black-and-white materials for each student in each section.</p>" +
        "<p>Thank you so much for teaching — keep an eye out for further information, and we look forward to seeing you on {{config.program}} day!</p>" +
        "<p>Best,</p>" +
        "<p>{{config.directorsTeam}}</p>",
};

