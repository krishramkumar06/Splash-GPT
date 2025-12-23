// Sprout Email Templates
export { SPROUT_TEACHER_LOGISTICS } from "./sprout-teacher-logistics";
export { SPROUT_PARENT_LOGISTICS } from "./sprout-parent-logistics";
export { SPROUT_VOLUNTEER_INVITATION } from "./sprout-volunteer-invitation";
export { SPROUT_TEACHER_FORMS_ORIENTATION } from "./sprout-teacher-forms-orientation";
export { SPROUT_STUDENT_REGISTRATION } from "./sprout-student-registration";
export { TEACH_FOR_SPROUT } from "./teach-for-sprout";

// Splash Email Templates
export { SPLASH_TOMORROW_TEACHER } from "./splash-tomorrow-teacher";
export { SPLASH_TOMORROW_STUDENT } from "./splash-tomorrow-student";
export { SPLASH_TEACHER_LOGISTICS } from "./splash-teacher-logistics";
export { SPLASH_STUDENT_LOGISTICS } from "./splash-student-logistics";
export { SPLASH_REGISTRATION_DUE_TOMORROW } from "./splash-registration-due-tomorrow";
export { SPLASH_TEACHER_TRAINING_RESOURCES } from "./splash-teacher-training-resources";
export { SPLASH_TRAINING_REMINDER } from "./splash-training-reminder";
export { SPLASH_TEACHER_FORMS_ORIENTATION } from "./splash-teacher-forms-orientation";
export { SPLASH_STUDENT_REGISTRATION_OPEN } from "./splash-student-registration-open";
export { SPLASH_PRINTOUT_REMINDER } from "./splash-printout-reminder";

// Template type
export interface EmailTemplate {
  subject: string;
  body: string;
}

// All templates grouped by program
export const SPROUT_TEMPLATES = {
  teacherLogistics: "SPROUT_TEACHER_LOGISTICS",
  parentLogistics: "SPROUT_PARENT_LOGISTICS",
  volunteerInvitation: "SPROUT_VOLUNTEER_INVITATION",
  teacherFormsOrientation: "SPROUT_TEACHER_FORMS_ORIENTATION",
  studentRegistration: "SPROUT_STUDENT_REGISTRATION",
  teachForSprout: "TEACH_FOR_SPROUT",
} as const;

export const SPLASH_TEMPLATES = {
  tomorrowTeacher: "SPLASH_TOMORROW_TEACHER",
  tomorrowStudent: "SPLASH_TOMORROW_STUDENT",
  teacherLogistics: "SPLASH_TEACHER_LOGISTICS",
  studentLogistics: "SPLASH_STUDENT_LOGISTICS",
  registrationDueTomorrow: "SPLASH_REGISTRATION_DUE_TOMORROW",
  teacherTrainingResources: "SPLASH_TEACHER_TRAINING_RESOURCES",
  trainingReminder: "SPLASH_TRAINING_REMINDER",
  teacherFormsOrientation: "SPLASH_TEACHER_FORMS_ORIENTATION",
  studentRegistrationOpen: "SPLASH_STUDENT_REGISTRATION_OPEN",
  printoutReminder: "SPLASH_PRINTOUT_REMINDER",
} as const;

