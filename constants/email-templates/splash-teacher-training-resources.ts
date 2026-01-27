export const SPLASH_TEACHER_TRAINING_RESOURCES = {
  subject: "{{config.program}} Teacher Training Resources",
  body: "<p>Hello {{user.first_name}},</p>" +
        "<p>Thank you for attending the Yale {{config.program}} teacher training. As promised, here are the slides and resources with teaching tips:</p>" +
        "<ul>" +
        "<li><a href=\"{{config.slidesLink}}\">Slides</a></li>" +
        "<li><a href=\"{{config.pedagogyPacketLink}}\">Pedagogy Packet</a></li>" +
        "<li><a href=\"{{config.teachingTipsLink}}\">Teaching Tips</a></li>" +
        "</ul>" +
        "<p>Please email {{config.email}} if you have any questions. We would be excited to help you with any and every resource to ensure your hour of teaching goes smoothly on {{config.eventDates}}!</p>" +
        "<p>Best,<br>{{config.directorsTeam}}</p>",
};









