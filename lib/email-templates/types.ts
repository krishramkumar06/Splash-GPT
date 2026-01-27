export interface ZoomSession {
  date: string;           // "Sunday, September 28th"
  time: string;           // "7-7:30 PM"
  host: string;           // "Krish Ramkumar"
  meetingId: string;      // "739 968 0513"
  passcode: string;       // "Splash"
  zoomLink?: string;      // Full Zoom URL
  gcalLink?: string;      // Google Calendar link
}

export interface SemesterConfig {
  // Core Identifiers
  id: string;
  program: "Splash" | "Sprout";
  semester: string;              // "Fall 2025"
  semesterShort: string;         // "Fall '25"

  // Event Dates (stored as Date objects)
  eventDate1: Date | null;       // Main event date (or Day 1 for Sprout)
  eventDate2: Date | null;       // Day 2 for Sprout (null for Splash)
  sameWeekend: boolean;          // For Sprout: whether days are same weekend

  // Deadlines (stored as Date objects)
  registrationDeadline: Date | null;
  teacherRegDeadlineFake: Date | null;  // Fake deadline communicated in most emails
  teacherRegDeadlineReal: Date | null;  // Real deadline (a few days later, used in extension email)
  courseRevisionDeadlineSoft: Date | null;  // Soft deadline for teachers to revise courses
  materialsDeadlineSoft: Date | null;  // Soft/communicated deadline for course materials & forms
  materialsDeadlineHard: Date | null;  // Hard deadline for course materials & forms
  trainingDeadline: Date | null;
  printDeadline: Date | null;
  materialsDeadline: Date | null;  // Deprecated - use materialsDeadlineSoft instead

  // Locations
  adminHQ: string;               // "LC 104" or "LC 105"
  buildings: string;             // Full building description
  buildingsShort: string;        // "LC" or "LC and WLH"
  dropoff: string;               // "Phelps Gate (344 College St, New Haven, CT 06511)"

  // Costs
  cost: string;                  // "$25" or "$40"
  tshirtCost: string;            // "$10"
  gradeRange: string;            // "7th to 12th grade" or "6th to 9th grade"
  gradeRangeShort: string;       // "7–12" or "6th-9th"

  // Contact
  phone: string;                 // "203-868-0478"
  email: string;                 // "yalesplash@gmail.com"

  // Team / Directors (various formats used in emails)
  directorName: string;          // Individual director's name for email signatures
  directors: string;             // "F25 Splash Directors" (short signature)
  directorsTeam: string;         // "Fall Splash '25 Directors"
  directorsLong: string;         // "Splash Fall 2025 Directors"

  // Links
  websiteLink: string;           // "https://yale.learningu.org"
  studentRegLink: string;        // Student registration URL
  teacherRegLink: string;        // Teacher registration URL
  certificationsFormLink: string; // Teacher certifications form
  materialsFormLink: string;     // Course materials form
  budgetLink: string;            // Budget form
  volunteerFormLink?: string;    // Volunteer signup (Sprout mainly)
  groupMeLink?: string;          // GroupMe (Sprout only)
  
  // Training Resources Links
  slidesLink?: string;           // Training slides
  pedagogyPacketLink?: string;   // Pedagogy doc
  teachingTipsLink?: string;     // Teaching tips doc

  // Zoom Sessions
  zoomSessions: ZoomSession[];
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;             // HTML content
  audience: "teacher" | "student" | "parent" | "volunteer";
  program: "Splash" | "Sprout" | "both";
}

// Computed values interface (derived from SemesterConfig + date-utils)
// Profile export/import types
export interface ProfileMetadata {
  profileName: string;
  description?: string;
  exportedAt: string;
  exportedBy?: string;
  program: "Splash" | "Sprout";
  semester: string;
}

export interface SemesterProfile {
  metadata: ProfileMetadata;
  config: SemesterConfig;
}

export interface ComputedTemplateValues {
  // Program info
  program: string;
  semester: string;
  semesterShort: string;
  isTwoDays: boolean;

  // Fixed times (from program type)
  checkInTime: string;
  endTime: string;
  programTime: string;

  // Event dates (all computed formats)
  eventDates: string;            // "October 4th" or "November 15th and 16th"
  eventDatesFull: string;        // "Saturday, October 4th"
  eventDatesShort: string;       // "Oct 4th" or "Nov 15-16th"

  // Deadline formats
  registrationDeadline: string;
  registrationDeadlineFull: string;
  teacherRegDeadlineFake: string;      // Fake deadline (use in most emails)
  teacherRegDeadlineReal: string;      // Real deadline (use in extension email)
  courseRevisionDeadlineSoft: string;  // Soft course revision deadline
  materialsDeadlineSoft: string;       // Soft materials deadline
  materialsDeadlineHard: string;       // Hard materials deadline
  trainingDeadline: string;
  trainingDeadlineFull: string;
  printDeadline: string;
  materialsDeadline: string;           // Deprecated - for backwards compatibility

  // All other string fields pass through
  adminHQ: string;
  buildings: string;
  buildingsShort: string;
  dropoff: string;
  cost: string;
  tshirtCost: string;
  gradeRange: string;
  gradeRangeShort: string;
  phone: string;
  email: string;
  directors: string;
  directorsTeam: string;
  directorsLong: string;
  websiteLink: string;
  studentRegLink: string;
  teacherRegLink: string;
  catalogLink: string;
  certificationsFormLink: string;
  materialsFormLink: string;
  budgetLink: string;
  volunteerFormLink: string;
  groupMeLink: string;
  slidesLink: string;
  pedagogyPacketLink: string;
  teachingTipsLink: string;
}
