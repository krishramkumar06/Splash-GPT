import { SemesterConfig } from "./types";

export const semesterConfigs: SemesterConfig[] = [
  {
    // Core Identifiers
    id: "splash-fall-2025",
    program: "Splash",
    semester: "Fall 2025",
    semesterShort: "Fall '25",

    // Event Dates
    eventDate1: new Date(2025, 9, 4),  // October 4, 2025
    eventDate2: null,
    sameWeekend: false,

    // Deadlines
    registrationDeadline: new Date(2025, 9, 1),    // October 1
    teacherRegDeadline: new Date(2025, 8, 15),     // September 15
    trainingDeadline: new Date(2025, 8, 27),       // September 27
    printDeadline: new Date(2025, 9, 2),           // October 2
    materialsDeadline: new Date(2025, 9, 1),       // October 1

    // Locations
    adminHQ: "LC 104",
    buildings: "Linsly-Chittenden Hall (\"LC\" — 63 High Street), and William L. Harkness Hall (\"WLH\" — 100 Wall Street)",
    buildingsShort: "LC and WLH",
    dropoff: "Phelps Gate (344 College St, New Haven, CT 06511)",

    // Costs
    cost: "$25",
    tshirtCost: "$10",
    gradeRange: "7th to 12th grade",
    gradeRangeShort: "7–12",

    // Contact
    phone: "203-868-0478",
    email: "yalesplash@gmail.com",

    // Directors
    directors: "F25 Splash Directors",
    directorsTeam: "Fall Splash '25 Directors",
    directorsLong: "Splash Fall 2025 Directors",

    // Links
    websiteLink: "https://yale.learningu.org",
    studentRegLink: "https://yale.learningu.org/learn/splash.html",
    teacherRegLink: "https://yale.learningu.org/teach/Splash/2025_Fall/teacherreg",
    certificationsFormLink: "https://forms.gle/ZTy3oTmR2dD2NytA6",
    materialsFormLink: "https://forms.gle/PLACEHOLDER",
    budgetLink: "https://PLACEHOLDER",
    
    // Training Resources
    slidesLink: "https://docs.google.com/presentation/d/1ZMy-LPn3FGsu8jJKeyfYGUx9hw72gMQpj-pZrcyBgIc/edit?usp=sharing",
    pedagogyPacketLink: "https://docs.google.com/document/d/10JgOvvLuFIjn_Sej3Mw2uMON4tmzSQdH6hAV9AH88T8/edit?usp=sharing",
    teachingTipsLink: "https://docs.google.com/document/d/1fIymsNIU7X9ukiJW7oVQarJP6bEBcQWxNXeKlg9DSCI/edit?usp=sharing",

    // Zoom Sessions
    zoomSessions: [
      {
        date: "Sunday, September 28th",
        time: "7-7:30 PM",
        host: "Krish Ramkumar",
        meetingId: "739 968 0513",
        passcode: "Splash",
        zoomLink: "https://yale.zoom.us/...",
      },
      {
        date: "Monday, September 29th",
        time: "7-7:30 PM",
        host: "Anh Minh Tran",
        meetingId: "895 633 3798",
        passcode: "Sprout",
        zoomLink: "https://yale.zoom.us/...",
      },
    ],
  },
  {
    // Core Identifiers
    id: "sprout-fall-2025",
    program: "Sprout",
    semester: "Fall 2025",
    semesterShort: "Fall '25",

    // Event Dates
    eventDate1: new Date(2025, 10, 15),  // November 15, 2025
    eventDate2: new Date(2025, 10, 16),  // November 16, 2025
    sameWeekend: true,

    // Deadlines
    registrationDeadline: new Date(2025, 10, 12),   // November 12
    teacherRegDeadline: new Date(2025, 9, 22),      // October 22
    trainingDeadline: new Date(2025, 10, 7),        // November 7
    printDeadline: new Date(2025, 10, 13),          // November 13
    materialsDeadline: new Date(2025, 10, 12),      // November 12

    // Locations
    adminHQ: "LC 105",
    buildings: "Linsly-Chittenden Hall (\"LC\" — 63 High Street)",
    buildingsShort: "LC",
    dropoff: "Phelps Gate (344 College St, New Haven, CT 06511)",

    // Costs
    cost: "$40",
    tshirtCost: "$10",
    gradeRange: "6th to 9th grade",
    gradeRangeShort: "6th-9th",

    // Contact
    phone: "203-868-0478",
    email: "yalesplash@gmail.com",

    // Directors
    directors: "F25 Sprout Directors",
    directorsTeam: "Fall Sprout '25 Directors",
    directorsLong: "Sprout Fall 2025 Directors",

    // Links
    websiteLink: "https://yale.learningu.org",
    studentRegLink: "https://yale.learningu.org/learn/sprout.html",
    teacherRegLink: "https://yale.learningu.org/teach/Sprout/2025_Fall/teacherreg",
    certificationsFormLink: "https://forms.gle/PLACEHOLDER",
    materialsFormLink: "https://forms.gle/PLACEHOLDER",
    budgetLink: "https://PLACEHOLDER",
    volunteerFormLink: "https://forms.gle/nipibiDxVbG2EW658",
    groupMeLink: "https://groupme.com/...",

    // Zoom Sessions
    zoomSessions: [
      {
        date: "Saturday, November 8th",
        time: "7-7:30 PM",
        host: "Haleigh Aldrich",
        meetingId: "891 2253 7544",
        passcode: "Sprout",
        zoomLink: "https://yale.zoom.us/...",
      },
      {
        date: "Sunday, November 9th",
        time: "7-7:30 PM",
        host: "Krish Ramkumar",
        meetingId: "739 968 0513",
        passcode: "Splash",
        zoomLink: "https://yale.zoom.us/...",
      },
    ],
  },
  {
    // Custom / New Semester Template
    id: "custom",
    program: "Splash",
    semester: "Spring 2026",
    semesterShort: "Spring '26",

    // Event Dates
    eventDate1: null,
    eventDate2: null,
    sameWeekend: true,

    // Deadlines
    registrationDeadline: null,
    teacherRegDeadline: null,
    trainingDeadline: null,
    printDeadline: null,
    materialsDeadline: null,

    // Locations
    adminHQ: "LC 104",
    buildings: "",
    buildingsShort: "",
    dropoff: "Phelps Gate (344 College St, New Haven, CT 06511)",

    // Costs
    cost: "$25",
    tshirtCost: "$10",
    gradeRange: "7th to 12th grade",
    gradeRangeShort: "7–12",

    // Contact
    phone: "203-868-0478",
    email: "yalesplash@gmail.com",

    // Directors
    directors: "",
    directorsTeam: "",
    directorsLong: "",

    // Links
    websiteLink: "https://yale.learningu.org",
    studentRegLink: "",
    teacherRegLink: "",
    certificationsFormLink: "",
    materialsFormLink: "",
    budgetLink: "",

    // Zoom Sessions
    zoomSessions: [],
  },
];

export function getSemesterConfig(id: string): SemesterConfig | undefined {
  return semesterConfigs.find((config) => config.id === id);
}

export function getConfigsByProgram(program: "Splash" | "Sprout"): SemesterConfig[] {
  return semesterConfigs.filter((config) => config.program === program || config.id === "custom");
}

// Helper to get default config based on program type
export function getDefaultConfigForProgram(program: "Splash" | "Sprout"): Partial<SemesterConfig> {
  if (program === "Splash") {
    return {
      cost: "$25",
      gradeRange: "7th to 12th grade",
      gradeRangeShort: "7–12",
      adminHQ: "LC 104",
      buildings: "Linsly-Chittenden Hall (\"LC\" — 63 High Street), and William L. Harkness Hall (\"WLH\" — 100 Wall Street)",
      buildingsShort: "LC and WLH",
      eventDate2: null,
    };
  } else {
    return {
      cost: "$40",
      gradeRange: "6th to 9th grade",
      gradeRangeShort: "6th-9th",
      adminHQ: "LC 105",
      buildings: "Linsly-Chittenden Hall (\"LC\" — 63 High Street)",
      buildingsShort: "LC",
      sameWeekend: true,
    };
  }
}
