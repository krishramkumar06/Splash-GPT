export const TEACH_FOR_SPROUT = {
  subject: "Teach for {{config.program}}!",
  body: `Dear {{user.first_name}},

Thank you to everyone who made Splash such a success this year! This year, nearly 500 students came to take a class designed by members of the Yale student body. If you are eager to teach again, or couldn't make this past Splash program, you don't have to wait long! Teacher registration for {{config.program}} {{config.semesterShort}} has opened and you can register your class (core or elective) at our website by following this link.

For those who need a refresher, {{config.program}} {{config.semesterShort}} is a 2-day program, running on the Saturday and Sunday of {{config.eventDatesFull}}. This semester, {{config.program}} will be for {{config.gradeRange}} students, where students from around the tri-state area will sign up to learn from you all, the undergraduate teachers. You can teach any topic, from "Bioethics and Law" to "Kombucha 101".

At {{config.program}}, you may teach a core class or an elective class. Core classes meet on both {{config.eventDates}}, allowing for a more immersive experience as students will better understand the class topics. Core class teachers must commit to teaching on both days. Please ensure you are available at your scheduled teaching time, as last-minute cancellations will leave students with a hole in their schedule!

Elective classes meet only once on either {{config.program}} days, which is ideal for teachers who are only available on one of the days. Similarly, committing to teaching at your scheduled time is extremely important for the students' experiences at {{config.program}}.

Again, here is the link at which you can register your classes, open from now until {{config.teacherRegDeadline}}:
{{config.teacherRegLink}}

Please email us with any questions you have. Thank you for making these programs possible, and happy teaching!

{{config.program}} {{config.semesterShort}} Team`,
};

