export const STUDENT_RECRUITMENT = {
  subject: "Invitation for Your Students: {{config.program}} at Yale University – {{config.semester}}",
  body: `Hello, I hope this email finds you well!

My name is {{config.directorName}}, and I am a Director of Yale {{config.program}}'s {{config.semester}} program. {{config.program}} is a one-day program full of classes taught by Yale students on a diverse range of subjects, such as Forensic Psychology, The Physics of Climate Change, Global Health 101, and more! More information, including our registration portal, can be found on our website, {{config.websiteLink}}.

This {{config.seasonLower}}, {{config.program}} will be on {{config.eventDatesFull}}, from {{config.programTime}}, and I would like to invite your students to join us! Registration is now open. {{config.program}} is {{config.cost}} for the day, with an option for a {{config.tshirtCost}} T-shirt. Financial Aid is available to all students who need it.

It would be greatly appreciated if you could pass the following message along to your students, parents, and teachers! We look forward to seeing your students on Yale's campus this {{config.seasonLower}}.

The email is below.

Thank you for your consideration,
{{config.directorName}}
{{config.program}} Director

_____

Hello!

{{config.program}} at Yale is a twice-a-year opportunity for middle and high school students ({{config.gradeRange}}) to attend classes taught by Yale students on our campus – and we would love to see you there this {{config.seasonLower}}!

{{config.program}} {{config.semester}} will be on {{config.eventDates}}, from {{config.programTime}}, and held on Yale's campus. Students can make a profile at any time. Classes include a wide variety of topics, from Introduction to Investing and Personal Finance to Competitive Pokémon Battling, and Introduction to Special Relativity. {{config.program}} is {{config.cost}} for the day, with an option for a {{config.tshirtCost}} T-shirt. Financial Aid for students is available upon request. More information and registration details can be found at {{config.studentRegLink}}! Make sure to create an account on our website to hear from us!

Please reach out to us at {{config.email}} with any questions.

We look forward to seeing you there!

All the best,
{{config.directorsLong}}`,
};
