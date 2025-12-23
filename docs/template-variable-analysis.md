# Email Template Variable Analysis

This document analyzes each email template to identify variables that change between semesters (Fall/Spring) and programs (Splash/Sprout).

---

## SPLASH TEMPLATES

### 1. `splash-student-registration-open` - Student Registration Open

**Subject:** `[Registration Now Open] Fall Splash 2025 - Experience Yale for a Day`

| Variable | Current Value | Type |
|----------|---------------|------|
| `semester` | "Fall 2025" | Semester |
| `program` | "Splash" | Program |
| `registrationDeadline` | "October 1st" | Date |
| `eventDatesFull` | "Saturday, October 4th" | Date |
| `programTime` | "10 AM to 3:30 PM" | Time |
| `cost` | "$25" | Cost |
| `tshirtCost` | "$10" | Cost |
| `gradeRange` | "grades 7–12" | Program-specific |
| `studentRegLink` | "https://yale.learningu.org/learn/splash.html" | Link |
| `directors` | "Splash Fall 2025 Directors" | Team |

---

### 2. `splash-registration-due-tomorrow` - Registration Due Tomorrow

**Subject:** `Registration for Splash DUE TOMORROW`

| Variable | Current Value | Type |
|----------|---------------|------|
| `program` | "Splash" | Program |
| `semester` | "Fall 2025" | Semester |
| `eventDates` | "October 4th" | Date |
| `gradeRange` | "seventh to twelfth grade" | Program-specific |
| `cost` | "$25" | Cost |
| `tshirtCost` | "$10" | Cost |
| `registrationDeadlineFull` | "WEDNESDAY 10/1 AT 11:59PM" | Date (with day of week) |
| `directors` | "F25 Splash Directors" | Team |

---

### 3. `splash-student-logistics` - Student/Parent Logistics (2 days before)

**Subject:** `Splash Fall 2025 Logistical Information`

| Variable | Current Value | Type |
|----------|---------------|------|
| `program` | "Splash" | Program |
| `semester` | "Fall 2025" | Semester |
| `eventDatesFull` | "Saturday (October 4th)" | Date |
| `dropoff` | "Phelps Gate (344 College St, New Haven, CT 06511)" | Location |
| `buildings` | "Linsly-Chittenden Hall ("LC" — 63 High Street), and William L. Harkness Hall ("WLH" — 100 Wall Street)" | Location |
| `adminHQ` | "LC 104" | Location |
| `checkInTime` | "8:45 AM" | Time |
| `phone` | "(203) 868-0478" | Contact |
| `hasTwoBuildings` | true | Program-specific (Splash uses LC + WLH) |
| `directors` | "F25 Splash Directors" | Team |

---

### 4. `splash-tomorrow-student` - Day Before Reminder (Students)

**Subject:** `Yale Splash is TOMORROW!`

| Variable | Current Value | Type |
|----------|---------------|------|
| `program` | "Splash" | Program |
| `semester` | "Fall 2025" | Semester |
| `eventDates` | "October 4th" | Date |
| `dropoff` | "Phelps Gate (344 College St, New Haven, CT 06511)" | Location |
| `buildings` | "Linsly-Chittenden Hall ("LC" — 63 High Street), and William L. Harkness Hall ("WLH" — 100 Wall Street)" | Location |
| `adminHQ` | "LC 104" | Location |
| `checkInTime` | "8:45 AM" | Time |
| `phone` | "(203) 868-0478" | Contact |
| `hasTwoBuildings` | true | Program-specific |
| `directors` | "F25 Splash Director" | Team |

---

### 5. `splash-teacher-forms-orientation` - Teacher Forms & Orientation (REQUIRED)

**Subject:** `[REQUIRED] Splash Teacher Forms and Orientation`

| Variable | Current Value | Type |
|----------|---------------|------|
| `program` | "Splash" | Program |
| `semesterShort` | "Fall '25" | Semester |
| `eventDates` | "October 4th" | Date |
| `trainingDeadline` | "Saturday, September 27th, at 11:59 PM EST" | Date |
| `zoomSession1.date` | "Sunday, September 28th" | Zoom |
| `zoomSession1.time` | "7-7:30" | Zoom |
| `zoomSession1.host` | "Krish Ramkumar" | Zoom |
| `zoomSession1.meetingId` | "739 968 0513" | Zoom |
| `zoomSession1.passcode` | "Splash" | Zoom |
| `zoomSession2.date` | "Monday, September 29th" | Zoom |
| `zoomSession2.time` | "7-7:30" | Zoom |
| `zoomSession2.host` | "Anh Minh Tran" | Zoom |
| `zoomSession2.meetingId` | "895 633 3798" | Zoom |
| `zoomSession2.passcode` | "Sprout" | Zoom |
| `materialsDeadline` | "October 1st by 11:59 PM" | Date |
| `directors` | "Fall Splash '25 Directors" | Team |

---

### 6. `splash-training-reminder` - Training Reminder (Tonight & Tomorrow)

**Subject:** `Reminder: Mandatory Teacher Training Tonight & Tomorrow`

| Variable | Current Value | Type |
|----------|---------------|------|
| `program` | "Splash" | Program |
| `zoomSession1.date` | "Sunday, September 28th" | Zoom |
| `zoomSession1.time` | "7-7:30PM" | Zoom |
| `zoomSession1.host` | "Krish Ramkumar" | Zoom |
| `zoomSession1.meetingId` | "739 968 0513" | Zoom |
| `zoomSession1.passcode` | "Splash" | Zoom |
| `zoomSession2.date` | "Monday, September 29th" | Zoom |
| `zoomSession2.time` | "7-7:30PM" | Zoom |
| `zoomSession2.host` | "Anh Minh Tran" | Zoom |
| `zoomSession2.meetingId` | "895 633 3798" | Zoom |
| `zoomSession2.passcode` | "Sprout" | Zoom |
| `certificationsFormLink` | "https://forms.gle/ZTy3oTmR2dD2NytA6" | Link |
| `directors` | "F25 Splash Directors" | Team |

---

### 7. `splash-teacher-training-resources` - Training Resources

**Subject:** `Splash Teacher Training Resources`

| Variable | Current Value | Type |
|----------|---------------|------|
| `program` | "Splash" | Program |
| `slidesLink` | "https://docs.google.com/presentation/d/1ZMy-LPn3FGsu8jJKeyfYGUx9hw72gMQpj-pZrcyBgIc/edit?usp=sharing" | Link |
| `pedagogyPacketLink` | "https://docs.google.com/document/d/10JgOvvLuFIjn_Sej3Mw2uMON4tmzSQdH6hAV9AH88T8/edit?usp=sharing" | Link |
| `teachingTipsLink` | "https://docs.google.com/document/d/1fIymsNIU7X9ukiJW7oVQarJP6bEBcQWxNXeKlg9DSCI/edit?usp=sharing" | Link |
| `eventDatesShort` | "Oct 4th" | Date |
| `directors` | "F25 Splash Directors" | Team |

---

### 8. `splash-printout-reminder` - Last Call for Printouts

**Subject:** `LAST CALL FOR PRINT-OUT SUBMISSIONS`

| Variable | Current Value | Type |
|----------|---------------|------|
| `program` | "Splash" | Program |
| `eventDatesFull` | "Saturday, October 4th" | Date |
| `printDeadline` | "October 1st by 11:59 PM" | Date |
| `directors` | "Fall Splash '25 Directors" | Team |

---

### 9. `splash-teacher-logistics` - Teacher Logistics (few days before)

**Subject:** `[PLEASE READ] Splash Program Logistics for Teachers!`

| Variable | Current Value | Type |
|----------|---------------|------|
| `program` | "Splash" | Program |
| `eventDates` | "October 4th" | Date |
| `printDeadline` | "Thursday, October 2nd" | Date |
| `adminHQ` | "LC 104" | Location |
| `phone` | "203-868-0478" | Contact |
| `directors` | "F25 Splash Directors" | Team |

---

### 10. `splash-tomorrow-teacher` - Day Before (Teachers)

**Subject:** `Yale Splash IS TOMORROW!!!!`

| Variable | Current Value | Type |
|----------|---------------|------|
| `program` | "Splash" | Program |
| `eventDatesFull` | "Saturday, October 4th" | Date |
| `buildingsShort` | "LC" | Location (note: email says "we are in LC!!!") |
| `adminHQ` | "LC 104" | Location |
| `phone` | "203-809-0810" | Contact ⚠️ **DIFFERENT from other emails** |
| `directors` | "Splash Fall '25 Directors" | Team |

---

## SPROUT TEMPLATES

### 11. `teach-for-sprout` - Teach for Sprout Recruitment

**Subject:** `Teach for Sprout!`

| Variable | Current Value | Type |
|----------|---------------|------|
| `program` | "Sprout" | Program |
| `semesterShort` | "Spring '25" (⚠️ seems like error - dates are Fall) | Semester |
| `eventDates` | "November 15th and November 16th" | Date |
| `gradeRange` | "6th to 9th-grade" | Program-specific |
| `teacherRegDeadline` | "October 22nd" | Date |
| `teacherRegLink` | "https://yale.learningu.org/teach/Sprout/2025_Fall/teacherreg" | Link |
| `directors` | "Sprout Spring '25 Team" | Team |

---

### 12. `sprout-student-registration` - Student Registration Open

**Subject:** `Fall Sprout 2025 - Experience Yale for a Weekend`

| Variable | Current Value | Type |
|----------|---------------|------|
| `program` | "Sprout" | Program |
| `semester` | "Fall" | Semester |
| `registrationDeadline` | "November 12th" | Date |
| `gradeRange` | "6th-9th grade" / "6th to 9th grade" | Program-specific |
| `eventDates` | "November 15th and 16th" | Date |
| `programTime` | "10 AM to 3:10 PM" | Time |
| `buildings` | "Linsly-Chittenden Hall (63 High St, New Haven, CT 06511)" | Location |
| `cost` | "$40" | Cost |
| `tshirtCost` | "$10" | Cost |
| `studentRegLink` | "https://yale.learningu.org/learn/sprout.html" | Link |
| `directors` | "Sprout Fall 2025 Directors" | Team |

---

### 13. `sprout-teacher-forms-orientation` - Teacher Forms & Orientation (REQUIRED)

**Subject:** `[REQUIRED] Sprout Teacher Forms and Orientation`

| Variable | Current Value | Type |
|----------|---------------|------|
| `program` | "Sprout" | Program |
| `semesterShort` | "Fall '25" | Semester |
| `eventDatesShort` | "Nov 15-16th" | Date |
| `trainingDeadline` | "Friday, November 7th, at 11:59 PM EST" | Date |
| `zoomSession1.date` | "Saturday, November 8th" | Zoom |
| `zoomSession1.time` | "7-7:30" | Zoom |
| `zoomSession1.host` | "Haleigh Aldrich" | Zoom |
| `zoomSession1.meetingId` | "891 2253 7544" | Zoom |
| `zoomSession1.passcode` | "Sprout" | Zoom |
| `zoomSession2.date` | "Sunday, November 9th" | Zoom |
| `zoomSession2.time` | "7-7:30" | Zoom |
| `zoomSession2.host` | "Krish Ramkumar" | Zoom |
| `zoomSession2.meetingId` | "739 968 0513" | Zoom |
| `zoomSession2.passcode` | "Splash" | Zoom |
| `materialsDeadline` | "November 12th by 11:59 PM" | Date |
| `directors` | "Fall Sprout '25 Directors" | Team |

---

### 14. `sprout-volunteer-invitation` - Volunteer Invitation

**Subject:** `Invitation to Volunteer at Sprout at Yale – Fall 2025`

| Variable | Current Value | Type |
|----------|---------------|------|
| `program` | "Sprout" | Program |
| `semester` | "Fall 2025" | Semester |
| `eventDatesFull` | "Saturday, November 15th, and Sunday, November 16th" | Date |
| `volunteerFormLink` | "https://forms.gle/nipibiDxVbG2EW658" | Link |
| `directors` | "Fall Sprout 2025 Team" | Team |

---

### 15. `sprout-parent-logistics` - Parent Logistics (2 days before)

**Subject:** `Sprout Fall 2025 Logistical Information`

| Variable | Current Value | Type |
|----------|---------------|------|
| `program` | "Sprout" | Program |
| `semester` | "Fall 2025" | Semester |
| `eventDatesFull` | "Saturday and Sunday (November 15th & 16th)" | Date |
| `cost` | "$40" | Cost |
| `tshirtCost` | "$10" | Cost |
| `dropoff` | "Phelps Gate (344 College St, New Haven, CT 06511)" | Location |
| `buildings` | "Linsly-Chittenden Hall ("LC" — 63 High Street)" | Location (only LC for Sprout) |
| `adminHQ` | "LC 104" | Location |
| `checkInTime` | "8:45 AM" | Time |
| `endTime` | "3:10PM" | Time |
| `phone` | "(203) 868-0478" | Contact |
| `directors` | "F25 Sprout Directors" | Team |

---

### 16. `sprout-teacher-logistics` - Teacher Logistics (few days before)

**Subject:** `[PLEASE READ] Sprout Program Logistics for Teachers!`

| Variable | Current Value | Type |
|----------|---------------|------|
| `program` | "Sprout" | Program |
| `eventDatesFull` | "THIS SATURDAY AND SUNDAY, November 15th and November 16th" | Date |
| `groupMeLink` | (mentioned but link not shown) | Link |
| `printDeadline` | "Thursday, November 13th" | Date |
| `adminHQ` | "LC 105" | Location ⚠️ **DIFFERENT from Splash (LC 104)** |
| `phone` | "203-868-0478" | Contact |
| `directors` | "F25 Sprout Directors" | Team |

---

## SUMMARY: All Unique Variables

### Core Identifiers
| Variable | Description | Example Values |
|----------|-------------|----------------|
| `program` | Program name | "Splash", "Sprout" |
| `semester` | Full semester | "Fall 2025", "Spring 2026" |
| `semesterShort` | Short semester | "Fall '25", "Spring '26" |
| `isTwoDays` | Multi-day program? | `true` (Sprout), `false` (Splash) |

### Event Dates
| Variable | Description | Example Values |
|----------|-------------|----------------|
| `eventDates` | Short date(s) | "October 4th", "November 15th and 16th" |
| `eventDatesFull` | Full date(s) | "Saturday, October 4th", "Saturday, November 15th and Sunday, November 16th" |
| `eventDatesShort` | Abbreviated | "Oct 4th", "Nov 15-16th" |

### Deadlines
| Variable | Description | Example Values |
|----------|-------------|----------------|
| `registrationDeadline` | Student reg closes | "October 1st", "November 12th" |
| `registrationDeadlineFull` | With day of week | "WEDNESDAY 10/1 AT 11:59PM" |
| `trainingDeadline` | Teacher certs due | "September 27th, at 11:59 PM EST" |
| `printDeadline` | Printout deadline | "October 2nd", "November 13th" |
| `materialsDeadline` | Course materials due | "October 1st by 11:59 PM" |
| `teacherRegDeadline` | Teacher reg closes | "October 22nd" |

### Times
| Variable | Description | Example Values |
|----------|-------------|----------------|
| `checkInTime` | Check-in starts | "8:45 AM" |
| `endTime` | Program ends | "3:30 PM" (Splash), "3:10 PM" (Sprout) |
| `programTime` | Full time range | "10 AM to 3:30 PM", "10 AM to 3:10 PM" |

### Locations
| Variable | Description | Example Values |
|----------|-------------|----------------|
| `adminHQ` | Admin headquarters | "LC 104" (Splash), "LC 105" (Sprout) |
| `buildings` | Full building description | See examples |
| `buildingsShort` | Short building list | "LC", "LC and WLH" |
| `dropoff` | Drop-off location | "Phelps Gate (344 College St, New Haven, CT 06511)" |
| `hasTwoBuildings` | Uses multiple buildings? | `true` (Splash), `false` (Sprout) |

### Costs
| Variable | Description | Example Values |
|----------|-------------|----------------|
| `cost` | Program cost | "$25" (Splash), "$40" (Sprout) |
| `tshirtCost` | T-shirt cost | "$10" |
| `gradeRange` | Student grades | "7th to 12th grade", "6th to 9th grade" |

### Contact
| Variable | Description | Example Values |
|----------|-------------|----------------|
| `phone` | Contact phone | "203-868-0478", "203-809-0810" |
| `email` | Contact email | "yalesplash@gmail.com" |

### Team
| Variable | Description | Example Values |
|----------|-------------|----------------|
| `directors` | Short signature | "F25 Splash Directors", "F25 Sprout Directors" |
| `directorsTeam` | Team name | "Fall Splash '25 Directors", "Fall Sprout '25 Directors" |
| `directorsLong` | Full name | "Splash Fall 2025 Directors", "Sprout Fall 2025 Directors" |

### Links
| Variable | Description | Changes? |
|----------|-------------|----------|
| `studentRegLink` | Student registration | Per semester |
| `teacherRegLink` | Teacher registration | Per semester |
| `certificationsFormLink` | Teacher certifications | Per semester |
| `materialsFormLink` | Course materials | Per semester |
| `budgetLink` | Budget form | Per semester |
| `volunteerFormLink` | Volunteer signup | Per semester |
| `groupMeLink` | GroupMe (Sprout only) | Per semester |
| `slidesLink` | Training slides | May change |
| `pedagogyPacketLink` | Pedagogy doc | Rarely changes |
| `teachingTipsLink` | Teaching tips | Rarely changes |

### Zoom Sessions (Array)
| Variable | Description | Example |
|----------|-------------|---------|
| `zoomSessions[].date` | Session date | "Sunday, September 28th" |
| `zoomSessions[].time` | Session time | "7-7:30 PM" |
| `zoomSessions[].host` | Host name | "Krish Ramkumar" |
| `zoomSessions[].meetingId` | Zoom meeting ID | "739 968 0513" |
| `zoomSessions[].passcode` | Zoom passcode | "Splash" |
| `zoomSessions[].zoomLink` | Zoom URL | Full URL |
| `zoomSessions[].gcalLink` | Google Calendar link | Full URL |

---

## KEY DIFFERENCES: Splash vs Sprout

| Variable | Splash | Sprout |
|----------|--------|--------|
| `isTwoDays` | `false` | `true` |
| `cost` | $25 | $40 |
| `gradeRange` | 7th-12th | 6th-9th |
| `endTime` | 3:30 PM | 3:10 PM |
| `adminHQ` | LC 104 | LC 105 |
| `buildings` | LC + WLH | LC only |
| `hasTwoBuildings` | true | false |
| `hasGroupMe` | false | true |
| `hasCore Classes` | false | true |

---

## NOTED INCONSISTENCIES

1. **Phone numbers vary**: Most emails use `203-868-0478`, but `splash-tomorrow-teacher` uses `203-809-0810`
2. **Director naming varies**: "F25 Splash Directors", "Fall Splash '25 Directors", "Splash Fall 2025 Directors" - should standardize
3. **Sprout admin HQ**: `sprout-teacher-logistics` says LC 105, but `sprout-parent-logistics` says LC 104
4. **teach-for-sprout**: Says "Sprout Spring '25" but dates are for Fall - likely copy/paste error in original

