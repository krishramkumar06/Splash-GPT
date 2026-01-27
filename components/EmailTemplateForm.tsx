"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, MapPin, Users, Link2, Video, Highlighter, Download, Upload } from "lucide-react";
import { semesterConfigs, getDefaultConfigForProgram } from "@/lib/email-templates/config";
import { SemesterConfig, ZoomSession } from "@/lib/email-templates/types";
import {
  computeDateFormats,
  computeEventDateFormats,
  getNextDay,
  toDateInputValue,
  fromDateInputValue,
  FIXED_TIMES,
} from "@/lib/email-templates/date-utils";
import { RichTextEditor, textToHtml } from "@/components/RichTextEditor";
import { validateConfig, exportProfile, validateImportedProfile, deserializeConfig } from "@/lib/email-templates/profile-utils";

// Import all email templates
import {
  SPROUT_TEACHER_LOGISTICS,
  SPROUT_PARENT_LOGISTICS,
  SPROUT_VOLUNTEER_INVITATION,
  SPROUT_TEACHER_FORMS_ORIENTATION,
  SPROUT_STUDENT_REGISTRATION,
  TEACH_FOR_SPROUT,
  SPLASH_TOMORROW_TEACHER,
  SPLASH_TOMORROW_STUDENT,
  SPLASH_TEACHER_LOGISTICS,
  SPLASH_STUDENT_LOGISTICS,
  SPLASH_REGISTRATION_DUE_TOMORROW,
  SPLASH_TEACHER_TRAINING_RESOURCES,
  SPLASH_TRAINING_REMINDER,
  SPLASH_TEACHER_FORMS_ORIENTATION,
  SPLASH_STUDENT_REGISTRATION_OPEN,
  SPLASH_PRINTOUT_REMINDER,
  TEACH_FOR_SPLASH_RECRUITMENT,
  TEACHER_DEADLINE_EXTENSION,
  STUDENT_RECRUITMENT,
} from "@/constants/email-templates";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  audience: "teacher" | "student" | "parent" | "volunteer";
  program: "Splash" | "Sprout" | "both";
}

const EMAIL_TEMPLATES: EmailTemplate[] = [
  // ===== SPLASH TEMPLATES (Chronological Order) =====

  // Week 1: Teacher Recruitment (1/13)
  { id: "teacher-recruitment", name: "1. Teacher Recruitment", ...TEACH_FOR_SPLASH_RECRUITMENT, audience: "teacher", program: "both" },

  // Week 2: Teacher Deadline Extension (1/24-1/26)
  { id: "teacher-deadline-extension", name: "2. Teacher Deadline Extension", ...TEACHER_DEADLINE_EXTENSION, audience: "teacher", program: "both" },

  // Week 3: Student Registration Opens (1/27)
  { id: "student-recruitment", name: "3. Student Recruitment", ...STUDENT_RECRUITMENT, audience: "student", program: "both" },
  { id: "splash-student-registration-open", name: "4. Student Registration Open", ...SPLASH_STUDENT_REGISTRATION_OPEN, audience: "student", program: "Splash" },

  // Week 5: Teacher Forms & Training (2/10-2/17)
  { id: "splash-teacher-forms-orientation", name: "5. Teacher Forms & Orientation", ...SPLASH_TEACHER_FORMS_ORIENTATION, audience: "teacher", program: "Splash" },
  { id: "splash-training-reminder", name: "6. Training Reminder", ...SPLASH_TRAINING_REMINDER, audience: "teacher", program: "Splash" },
  { id: "splash-teacher-training-resources", name: "7. Teacher Training Resources", ...SPLASH_TEACHER_TRAINING_RESOURCES, audience: "teacher", program: "Splash" },

  // Week 6: Student Registration Reminders (2/17-2/24)
  { id: "splash-registration-due-tomorrow", name: "8. Registration Due Tomorrow", ...SPLASH_REGISTRATION_DUE_TOMORROW, audience: "student", program: "Splash" },

  // Week 7: Final Preparations (2/24)
  { id: "splash-printout-reminder", name: "9. Printout Submission Reminder", ...SPLASH_PRINTOUT_REMINDER, audience: "teacher", program: "Splash" },

  // Day Before (2/27)
  { id: "splash-student-logistics", name: "10. Student/Parent Logistics (2 days before)", ...SPLASH_STUDENT_LOGISTICS, audience: "parent", program: "Splash" },
  { id: "splash-teacher-logistics", name: "11. Teacher Logistics (day before)", ...SPLASH_TEACHER_LOGISTICS, audience: "teacher", program: "Splash" },
  { id: "splash-tomorrow-student", name: "12. Day Before - Students", ...SPLASH_TOMORROW_STUDENT, audience: "student", program: "Splash" },
  { id: "splash-tomorrow-teacher", name: "13. Day Before - Teachers", ...SPLASH_TOMORROW_TEACHER, audience: "teacher", program: "Splash" },

  // ===== SPROUT TEMPLATES (Chronological Order) =====

  // Teacher Recruitment
  { id: "teach-for-sprout", name: "1. Teach for Sprout", ...TEACH_FOR_SPROUT, audience: "teacher", program: "Sprout" },

  // Student Registration
  { id: "sprout-student-registration", name: "2. Student Registration Open", ...SPROUT_STUDENT_REGISTRATION, audience: "student", program: "Sprout" },

  // Teacher Forms & Volunteer Recruitment
  { id: "sprout-teacher-forms-orientation", name: "3. Teacher Forms & Orientation", ...SPROUT_TEACHER_FORMS_ORIENTATION, audience: "teacher", program: "Sprout" },
  { id: "sprout-volunteer-invitation", name: "4. Volunteer Invitation", ...SPROUT_VOLUNTEER_INVITATION, audience: "volunteer", program: "Sprout" },

  // Day Before
  { id: "sprout-parent-logistics", name: "5. Parent Logistics (2 days before)", ...SPROUT_PARENT_LOGISTICS, audience: "parent", program: "Sprout" },
  { id: "sprout-teacher-logistics", name: "6. Teacher Logistics (day before)", ...SPROUT_TEACHER_LOGISTICS, audience: "teacher", program: "Sprout" },
];

// Date picker component
function DatePickerField({
  label,
  value,
  onChange,
  computedFormats,
}: {
  label: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  computedFormats?: ReturnType<typeof computeDateFormats>;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-muted-foreground">{label}</label>
      <input
        type="date"
        value={toDateInputValue(value)}
        onChange={(e) => onChange(fromDateInputValue(e.target.value))}
        className="w-full rounded-md border border-input bg-card text-foreground px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
      {computedFormats && value && (
        <div className="mt-1 text-xs text-muted-foreground">
          → {computedFormats.short}
        </div>
      )}
    </div>
  );
}

// Collapsible section
function Section({
  title,
  icon: Icon,
  children,
  defaultOpen = true,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="rounded-lg border border-border bg-card">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-3 py-2 text-left"
      >
        <span className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Icon className="h-4 w-4 text-muted-foreground" />
          {title}
        </span>
        <span className="text-xs text-muted-foreground">{isOpen ? "▲" : "▼"}</span>
      </button>
      {isOpen && <div className="space-y-3 border-t border-border px-3 py-3">{children}</div>}
    </div>
  );
}

export function EmailTemplateForm() {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [highlightVariables, setHighlightVariables] = useState(false);
  const [editorContent, setEditorContent] = useState<string>("");

  // Profile export/import state
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportConfirm, setShowImportConfirm] = useState(false);
  const [importedConfig, setImportedConfig] = useState<SemesterConfig | null>(null);
  const [exportProfileName, setExportProfileName] = useState("");
  const [exportDescription, setExportDescription] = useState("");
  const [exportedBy, setExportedBy] = useState("");

  // Editable config state - start with Spring 2026 custom config
  const [config, setConfig] = useState<SemesterConfig>(() => {
    const defaultConfig = semesterConfigs.find(c => c.id === "custom") ?? semesterConfigs[0];
    return { ...defaultConfig };
  });

  // Computed values
  const isTwoDays = config.program === "Sprout";
  const times = isTwoDays ? FIXED_TIMES.sprout : FIXED_TIMES.splash;

  // Compute all date formats
  const eventDateFormats = useMemo(
    () => computeEventDateFormats(config.eventDate1, config.eventDate2, isTwoDays),
    [config.eventDate1, config.eventDate2, isTwoDays]
  );
  const regDeadlineFormats = useMemo(() => computeDateFormats(config.registrationDeadline), [config.registrationDeadline]);
  const teacherRegFakeFormats = useMemo(() => computeDateFormats(config.teacherRegDeadlineFake), [config.teacherRegDeadlineFake]);
  const teacherRegRealFormats = useMemo(() => computeDateFormats(config.teacherRegDeadlineReal), [config.teacherRegDeadlineReal]);
  const courseRevisionSoftFormats = useMemo(() => computeDateFormats(config.courseRevisionDeadlineSoft), [config.courseRevisionDeadlineSoft]);
  const materialsSoftFormats = useMemo(() => computeDateFormats(config.materialsDeadlineSoft), [config.materialsDeadlineSoft]);
  const materialsHardFormats = useMemo(() => computeDateFormats(config.materialsDeadlineHard), [config.materialsDeadlineHard]);
  const trainingFormats = useMemo(() => computeDateFormats(config.trainingDeadline), [config.trainingDeadline]);
  const printFormats = useMemo(() => computeDateFormats(config.printDeadline), [config.printDeadline]);
  const materialsFormats = useMemo(() => computeDateFormats(config.materialsDeadline), [config.materialsDeadline]);

  // Auto-compute semester from event date
  const computedSemester = useMemo(() => {
    if (!config.eventDate1) return {
      semester: "",
      semesterShort: "",
      seasonLetter: "",
      shortYear: "",
      season: "",
      seasonLower: ""
    };

    const month = config.eventDate1.getMonth(); // 0-11
    const year = config.eventDate1.getFullYear();
    const shortYear = String(year).slice(-2);

    // Jan-Jun = Spring, Jul-Dec = Fall
    const season = month >= 6 ? "Fall" : "Spring";
    const seasonLetter = season === "Fall" ? "F" : "S";
    const seasonLower = season.toLowerCase();

    return {
      semester: `${season} ${year}`,
      semesterShort: `${season} '${shortYear}`,
      seasonLetter,
      shortYear,
      season,
      seasonLower
    };
  }, [config.eventDate1]);

  // Build computed template values for variable replacement
  const computedValues = useMemo(() => {
    // Generate zoom sessions list with HTML formatting
    const zoomSessionsList = config.zoomSessions.map((session, index) => {
      const sessionNum = index + 1;
      const parts = [
        `<p><strong>Session ${sessionNum}:</strong> {{config.zoom${sessionNum}Date}} from {{config.zoom${sessionNum}Time}}</p>`,
        `<ul>`,
        `<li><strong>Host:</strong> {{config.zoom${sessionNum}Host}}</li>`,
        session.zoomLink ? `<li><strong>Zoom Link:</strong> <a href="{{config.zoom${sessionNum}Link}}">Join Meeting</a></li>` : null,
        `<li><strong>Meeting ID:</strong> {{config.zoom${sessionNum}MeetingId}}</li>`,
        `<li><strong>Passcode:</strong> {{config.zoom${sessionNum}Passcode}}</li>`,
        session.gcalLink ? `<li><strong>Add to Calendar:</strong> <a href="{{config.zoom${sessionNum}GcalLink}}">Google Calendar</a></li>` : null,
        `</ul>`
      ].filter(Boolean);
      return parts.join('\n');
    }).join('\n');

    // Generate dynamic director signatures
    const { seasonLetter, shortYear, semesterShort, semester } = computedSemester;
    const directors = seasonLetter && shortYear
      ? `${seasonLetter}${shortYear} ${config.program} Directors`
      : "";
    const directorsTeam = semesterShort
      ? `${semesterShort.replace("'", "")} ${config.program} Directors`
      : "";
    const directorsLong = semester
      ? `${config.program} ${semester} Directors`
      : "";

    // Generate dynamic registration links
    const year = config.eventDate1?.getFullYear() || new Date().getFullYear();
    const month = config.eventDate1?.getMonth() || 0;
    const season = month >= 6 ? "Fall" : "Spring";
    const programLower = config.program.toLowerCase();

    const studentRegLink = `https://yale.learningu.org/learn/${programLower}.html`;
    const teacherRegLink = `https://yale.learningu.org/teach/${config.program}/${year}_${season}/teacherreg`;
    const catalogLink = `https://yale.learningu.org/learn/${config.program}/${year}_${season}/catalog`;

    return {
      // Program info
      program: config.program,
      semester: computedSemester.semester,
      semesterShort: computedSemester.semesterShort,
      season: computedSemester.season,
      seasonLower: computedSemester.seasonLower,
      isTwoDays: isTwoDays.toString(),

      // Fixed times
      checkInTime: FIXED_TIMES.checkIn,
      endTime: times.end,
      programTime: times.program,

      // Event dates
      eventDates: eventDateFormats?.range || "",
      eventDatesFull: eventDateFormats?.rangeFull || "",
      eventDatesShort: eventDateFormats?.rangeShort || "",

      // Deadlines
      registrationDeadline: regDeadlineFormats?.short || "",
      registrationDeadlineFull: regDeadlineFormats?.full || "",
      teacherRegDeadlineFake: teacherRegFakeFormats?.short || "",
      teacherRegDeadlineReal: teacherRegRealFormats?.short || "",
      courseRevisionDeadlineSoft: courseRevisionSoftFormats?.short || "",
      materialsDeadlineSoft: materialsSoftFormats?.short || "",
      materialsDeadlineHard: materialsHardFormats?.short || "",
      trainingDeadline: trainingFormats?.withTime || "",
      printDeadline: printFormats?.short || "",
      materialsDeadline: materialsFormats?.casual || "",

      // Pass through string fields
      adminHQ: config.adminHQ,
      buildings: config.buildings,
      buildingsShort: config.buildingsShort,
      dropoff: config.dropoff,
      cost: config.cost,
      tshirtCost: config.tshirtCost,
      gradeRange: config.gradeRange,
      gradeRangeShort: config.gradeRangeShort,
      phone: config.phone,
      email: config.email,
      directorName: config.directorName,
      directors,
      directorsTeam,
      directorsLong,
      websiteLink: config.websiteLink,
      studentRegLink,
      teacherRegLink,
      catalogLink,
      certificationsFormLink: config.certificationsFormLink,
      materialsFormLink: config.materialsFormLink,
      budgetLink: config.budgetLink,
      volunteerFormLink: config.volunteerFormLink || "",
      groupMeLink: config.groupMeLink || "",
      slidesLink: config.slidesLink || "",
      pedagogyPacketLink: config.pedagogyPacketLink || "",
      teachingTipsLink: config.teachingTipsLink || "",
      zoomSessionsList,

      // Hardcoded zoom session variables
      zoom1Date: config.zoomSessions[0]?.date || "",
      zoom1Time: config.zoomSessions[0]?.time || "",
      zoom1Host: config.zoomSessions[0]?.host || "",
      zoom1MeetingId: config.zoomSessions[0]?.meetingId || "",
      zoom1Passcode: config.zoomSessions[0]?.passcode || "",
      zoom1Link: config.zoomSessions[0]?.zoomLink || "",
      zoom1GcalLink: config.zoomSessions[0]?.gcalLink || "",
      zoom2Date: config.zoomSessions[1]?.date || "",
      zoom2Time: config.zoomSessions[1]?.time || "",
      zoom2Host: config.zoomSessions[1]?.host || "",
      zoom2MeetingId: config.zoomSessions[1]?.meetingId || "",
      zoom2Passcode: config.zoomSessions[1]?.passcode || "",
      zoom2Link: config.zoomSessions[1]?.zoomLink || "",
      zoom2GcalLink: config.zoomSessions[1]?.gcalLink || "",
    };
  }, [config, isTwoDays, times, eventDateFormats, regDeadlineFormats, teacherRegFakeFormats, teacherRegRealFormats, courseRevisionSoftFormats, materialsSoftFormats, materialsHardFormats, trainingFormats, printFormats, materialsFormats, computedSemester]);

  // Apply variable substitution (with optional highlighting of substituted values)
  const substituteVariables = useCallback((text: string, highlight: boolean = false): string => {
    let result = text;
    Object.entries(computedValues).forEach(([key, value]) => {
      const regex = new RegExp(`\\{\\{config\\.${key}\\}\\}`, "g");
      if (highlight) {
        // Wrap the substituted value with <mark> tags for TipTap's Highlight extension
        result = result.replace(regex, `<mark>${value}</mark>`);
      } else {
        result = result.replace(regex, value);
      }
    });
    return result;
  }, [computedValues]);

  // Get current template
  const currentTemplate = EMAIL_TEMPLATES.find((t) => t.id === selectedTemplateId);

  // Update editor when template or values change
  useEffect(() => {
    if (currentTemplate) {
      // Substitute variables and highlight the substituted values if enabled
      const substituted = substituteVariables(currentTemplate.body, highlightVariables);
      const html = textToHtml(substituted);
      setEditorContent(html);
    } else {
      setEditorContent("");
    }
  }, [currentTemplate, computedValues, highlightVariables, substituteVariables]);

  // Subject line with substitutions
  const generatedSubject = currentTemplate ? substituteVariables(currentTemplate.subject) : "";

  // Handlers
  const handleProgramChange = (program: "Splash" | "Sprout") => {
    const defaults = getDefaultConfigForProgram(program);
    setConfig((prev) => ({
      ...prev,
      program,
      ...defaults,
    }));
    setSelectedTemplateId("");
  };

  const updateConfig = <K extends keyof SemesterConfig>(key: K, value: SemesterConfig[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleEventDate1Change = (date: Date | null) => {
    updateConfig("eventDate1", date);

    // Auto-set Day 2 to next day if same weekend mode
    if (isTwoDays && config.sameWeekend && date) {
      updateConfig("eventDate2", getNextDay(date));
    }

    // Auto-populate deadlines based on event date
    if (date) {
      const eventDate = new Date(date);

      // Course materials & print materials: event date - 3 days
      const materialsDeadline = new Date(eventDate);
      materialsDeadline.setDate(materialsDeadline.getDate() - 3);

      // Training & certification: event date - 14 days
      const trainingDeadline = new Date(eventDate);
      trainingDeadline.setDate(trainingDeadline.getDate() - 14);

      // Registration deadline: event date - 5 days
      const registrationDeadline = new Date(eventDate);
      registrationDeadline.setDate(registrationDeadline.getDate() - 5);

      // Teacher registration deadline: event date - 15 days
      const teacherRegDeadline = new Date(eventDate);
      teacherRegDeadline.setDate(teacherRegDeadline.getDate() - 15);

      // Zoom session dates: event date - 6 and event date - 5
      const zoom1Date = new Date(eventDate);
      zoom1Date.setDate(zoom1Date.getDate() - 6);

      const zoom2Date = new Date(eventDate);
      zoom2Date.setDate(zoom2Date.getDate() - 5);

      // Format zoom dates like "Sunday, September 28th"
      const formatZoomDate = (d: Date) => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
        const day = d.getDate();
        const suffix = day === 1 || day === 21 || day === 31 ? 'st' :
                      day === 2 || day === 22 ? 'nd' :
                      day === 3 || day === 23 ? 'rd' : 'th';
        return `${days[d.getDay()]}, ${months[d.getMonth()]} ${day}${suffix}`;
      };

      setConfig((prev) => ({
        ...prev,
        materialsDeadline,
        printDeadline: new Date(materialsDeadline), // Same as materials
        trainingDeadline,
        registrationDeadline,
        teacherRegDeadline,
        zoomSessions: prev.zoomSessions.length >= 2
          ? [
              { ...prev.zoomSessions[0], date: formatZoomDate(zoom1Date) },
              { ...prev.zoomSessions[1], date: formatZoomDate(zoom2Date) },
              ...prev.zoomSessions.slice(2)
            ]
          : [
              { date: formatZoomDate(zoom1Date), time: "7-7:30 PM", host: "", meetingId: "", passcode: "", zoomLink: "", gcalLink: "" },
              { date: formatZoomDate(zoom2Date), time: "7-7:30 PM", host: "", meetingId: "", passcode: "", zoomLink: "", gcalLink: "" },
            ]
      }));
    }
  };

  const handleSameWeekendChange = (sameWeekend: boolean) => {
    updateConfig("sameWeekend", sameWeekend);
    if (sameWeekend && config.eventDate1) {
      updateConfig("eventDate2", getNextDay(config.eventDate1));
    }
  };

  const updateZoomSession = (index: number, key: keyof ZoomSession, value: string) => {
    setConfig((prev) => ({
      ...prev,
      zoomSessions: prev.zoomSessions.map((session, i) =>
        i === index ? { ...session, [key]: value } : session
      ),
    }));
  };

  // Profile Export/Import handlers
  const handleExportClick = () => {
    const validation = validateConfig(config);
    if (!validation.valid) {
      alert(`Cannot export incomplete profile:\n\n${validation.errors.join('\n')}`);
      return;
    }
    setShowExportModal(true);
  };

  const handleExportConfirm = () => {
    if (!exportProfileName.trim()) {
      alert("Please enter a profile name");
      return;
    }

    exportProfile(config, {
      profileName: exportProfileName,
      description: exportDescription || undefined,
      exportedBy: exportedBy || undefined,
    });

    setShowExportModal(false);
    setExportProfileName("");
    setExportDescription("");
    setExportedBy("");
  };

  const handleImportClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        const validation = validateImportedProfile(content);

        if (!validation.valid) {
          alert(`Cannot import profile:\n\n${validation.errors.join('\n')}`);
          return;
        }

        if (validation.profile) {
          const deserialized = deserializeConfig(validation.profile.config);
          setImportedConfig(deserialized);
          setShowImportConfirm(true);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleImportConfirm = () => {
    if (importedConfig) {
      setConfig(importedConfig);
      setImportedConfig(null);
      setShowImportConfirm(false);
    }
  };

  // Filter templates by program
  const availableTemplates = useMemo(
    () => EMAIL_TEMPLATES.filter((t) => t.program === config.program || t.program === "both"),
    [config.program]
    );

  return (
    <div className="flex h-full flex-col bg-muted ">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-border  bg-card  px-4 py-3">
        <div className="flex items-center gap-3">
          {/* Program Selector */}
          <Select value={config.program} onValueChange={(v) => handleProgramChange(v as "Splash" | "Sprout")}>
            <SelectTrigger className="w-[130px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Splash">Splash</SelectItem>
              <SelectItem value="Sprout">Sprout</SelectItem>
            </SelectContent>
          </Select>

          {/* Auto-computed Semester Display */}
          <div className="flex items-center gap-2 rounded-md border border-border bg-muted px-3 py-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">
              {computedSemester.semester || "No date set"}
            </span>
          </div>

          {/* Event Date Picker */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-muted-foreground">Event Date:</label>
            <input
              type="date"
              value={toDateInputValue(config.eventDate1)}
              onChange={(e) => handleEventDate1Change(fromDateInputValue(e.target.value))}
              className="rounded-md border border-input bg-card text-foreground px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Template Selector */}
          <Select value={selectedTemplateId} onValueChange={setSelectedTemplateId}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select template..." />
            </SelectTrigger>
            <SelectContent>
              <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">Teachers</div>
              {availableTemplates.filter((t) => t.audience === "teacher").map((t) => (
                <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
              ))}
              <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">Students/Parents</div>
              {availableTemplates.filter((t) => t.audience === "student" || t.audience === "parent").map((t) => (
                <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
              ))}
              {availableTemplates.filter((t) => t.audience === "volunteer").length > 0 && (
                <>
                  <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">Volunteers</div>
                  {availableTemplates.filter((t) => t.audience === "volunteer").map((t) => (
                    <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                  ))}
                </>
              )}
              </SelectContent>
            </Select>
          </div>

        {/* Export/Import Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportClick}
            className="flex items-center gap-2 rounded-lg border border-border bg-muted px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent"
          >
            <Download className="h-4 w-4" />
            <span>Export Profile</span>
          </button>
          <button
            type="button"
            onClick={handleImportClick}
            className="flex items-center gap-2 rounded-lg border border-border bg-muted px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent"
          >
            <Upload className="h-4 w-4" />
            <span>Import Profile</span>
          </button>

          {/* Highlight Press and Hold */}
          <button
            type="button"
            className={`flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 transition-colors ${
              highlightVariables ? "bg-amber-100 border-amber-300" : "bg-muted"
            }`}
            onMouseDown={() => setHighlightVariables(true)}
            onMouseUp={() => setHighlightVariables(false)}
            onMouseLeave={() => setHighlightVariables(false)}
            onTouchStart={() => setHighlightVariables(true)}
            onTouchEnd={() => setHighlightVariables(false)}
          >
            <Highlighter className={`h-4 w-4 ${highlightVariables ? "text-amber-600" : "text-amber-500"}`} />
            <span className={`text-sm ${highlightVariables ? "text-amber-700 font-medium" : "text-muted-foreground"}`}>
              {highlightVariables ? "Highlighting..." : "Hold to Highlight"}
            </span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid flex-1 grid-cols-[340px_1fr] gap-4 overflow-hidden p-4">
        {/* Left Panel - Variables */}
        <div className="flex flex-col gap-3 overflow-y-auto pr-2">
          {/* Program Badge */}
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
              config.program === "Splash" ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"
            }`}>
              {config.program} {computedSemester.semester}
            </span>
            {isTwoDays && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">2-Day Event</span>
            )}
            <span className="ml-auto text-xs text-muted-foreground">
              {times.program}
            </span>
          </div>

          {/* Event Dates - Only Day 2 for Sprout */}
          {isTwoDays && (
            <Section title="Sprout Day 2" icon={Calendar}>
              <div className="flex items-center gap-4 text-sm mb-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="weekend"
                    checked={config.sameWeekend}
                    onChange={() => handleSameWeekendChange(true)}
                    className="h-4 w-4"
                  />
                  Same weekend
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="weekend"
                    checked={!config.sameWeekend}
                    onChange={() => handleSameWeekendChange(false)}
                    className="h-4 w-4"
                  />
                  Different weekends
                </label>
              </div>

              <DatePickerField
                label="Day 2"
                value={config.eventDate2}
                onChange={(d) => updateConfig("eventDate2", d)}
                computedFormats={computeDateFormats(config.eventDate2)}
              />

              {eventDateFormats && (
                <div className="rounded bg-muted p-2 text-xs text-muted-foreground">
                  <strong>Combined:</strong> {eventDateFormats.range}
                </div>
              )}
            </Section>
          )}

          {/* Deadlines */}
          <Section title="Deadlines" icon={Calendar}>
            <div className="mb-2 rounded bg-blue-50 px-2 py-1.5 text-xs text-blue-700">
              Auto-populated based on event date. Adjust if needed.
            </div>
            <DatePickerField
              label="Registration Deadline"
              value={config.registrationDeadline}
              onChange={(d) => updateConfig("registrationDeadline", d)}
              computedFormats={regDeadlineFormats}
            />
            <DatePickerField
              label="Teacher Registration Deadline (fake)"
              value={config.teacherRegDeadlineFake}
              onChange={(d) => updateConfig("teacherRegDeadlineFake", d)}
              computedFormats={teacherRegFakeFormats}
            />
            <DatePickerField
              label="Teacher Registration Deadline (real)"
              value={config.teacherRegDeadlineReal}
              onChange={(d) => updateConfig("teacherRegDeadlineReal", d)}
              computedFormats={teacherRegRealFormats}
            />
            <DatePickerField
              label="Course Revision Deadline (soft)"
              value={config.courseRevisionDeadlineSoft}
              onChange={(d) => updateConfig("courseRevisionDeadlineSoft", d)}
              computedFormats={courseRevisionSoftFormats}
            />
            <DatePickerField
              label="Materials/Forms Deadline (soft/communicated)"
              value={config.materialsDeadlineSoft}
              onChange={(d) => updateConfig("materialsDeadlineSoft", d)}
              computedFormats={materialsSoftFormats}
            />
            <DatePickerField
              label="Materials/Forms Deadline (hard)"
              value={config.materialsDeadlineHard}
              onChange={(d) => updateConfig("materialsDeadlineHard", d)}
              computedFormats={materialsHardFormats}
            />
            <DatePickerField
              label="Training/Certifications Deadline"
              value={config.trainingDeadline}
              onChange={(d) => updateConfig("trainingDeadline", d)}
              computedFormats={trainingFormats}
            />
            <DatePickerField
              label="Print Materials Deadline"
              value={config.printDeadline}
              onChange={(d) => updateConfig("printDeadline", d)}
              computedFormats={printFormats}
            />
            <DatePickerField
              label="Course Materials Deadline (deprecated)"
              value={config.materialsDeadline}
              onChange={(d) => updateConfig("materialsDeadline", d)}
              computedFormats={materialsFormats}
            />
          </Section>

          {/* Locations */}
          <Section title="Locations" icon={MapPin} defaultOpen={false}>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Admin HQ Room</label>
              <Input
                value={config.adminHQ}
                onChange={(e) => updateConfig("adminHQ", e.target.value)}
                className="text-sm"
                placeholder="LC 104"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Buildings (short)</label>
              <Input
                value={config.buildingsShort}
                onChange={(e) => updateConfig("buildingsShort", e.target.value)}
                className="text-sm"
                placeholder="LC and WLH"
              />
            </div>
          </Section>

          {/* Team */}
          <Section title="Directors & Contact" icon={Users} defaultOpen={false}>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Director Name</label>
              <Input
                value={config.directorName}
                onChange={(e) => updateConfig("directorName", e.target.value)}
                className="text-sm"
                placeholder="Your Name"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Auto-generated Signatures</label>
              <div className="space-y-1 rounded bg-muted p-2 text-xs text-muted-foreground">
                <div><span className="font-medium">Short:</span> {computedValues.directors || "Set event date first"}</div>
                <div><span className="font-medium">Team:</span> {computedValues.directorsTeam || "Set event date first"}</div>
                <div><span className="font-medium">Long:</span> {computedValues.directorsLong || "Set event date first"}</div>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Phone</label>
              <Input
                value={config.phone}
                onChange={(e) => updateConfig("phone", e.target.value)}
                className="text-sm"
              />
            </div>
          </Section>

          {/* Links */}
          <Section title="Links" icon={Link2} defaultOpen={false}>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Auto-generated Links</label>
              <div className="space-y-1 rounded bg-muted p-2 text-xs text-muted-foreground">
                <div>
                  <span className="font-medium">Student Registration:</span>
                  <div className="mt-0.5 break-all">{computedValues.studentRegLink}</div>
                </div>
                <div>
                  <span className="font-medium">Teacher Registration:</span>
                  <div className="mt-0.5 break-all">{computedValues.teacherRegLink}</div>
                </div>
                <div>
                  <span className="font-medium">Class Catalog:</span>
                  <div className="mt-0.5 break-all">{computedValues.catalogLink}</div>
                </div>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Certifications Form</label>
              <Input
                value={config.certificationsFormLink}
                onChange={(e) => updateConfig("certificationsFormLink", e.target.value)}
                className="text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Materials Form</label>
              <Input
                value={config.materialsFormLink}
                onChange={(e) => updateConfig("materialsFormLink", e.target.value)}
                className="text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Budget Form</label>
              <Input
                value={config.budgetLink}
                onChange={(e) => updateConfig("budgetLink", e.target.value)}
                className="text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Volunteer Form</label>
              <Input
                value={config.volunteerFormLink || ""}
                onChange={(e) => updateConfig("volunteerFormLink", e.target.value)}
                className="text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">GroupMe Link</label>
              <Input
                value={config.groupMeLink || ""}
                onChange={(e) => updateConfig("groupMeLink", e.target.value)}
                className="text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Training Slides</label>
              <Input
                value={config.slidesLink || ""}
                onChange={(e) => updateConfig("slidesLink", e.target.value)}
                className="text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Pedagogy Packet</label>
              <Input
                value={config.pedagogyPacketLink || ""}
                onChange={(e) => updateConfig("pedagogyPacketLink", e.target.value)}
                className="text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Teaching Tips</label>
              <Input
                value={config.teachingTipsLink || ""}
                onChange={(e) => updateConfig("teachingTipsLink", e.target.value)}
                className="text-sm"
              />
            </div>
          </Section>

          {/* Zoom Sessions */}
          <Section title="Zoom Sessions" icon={Video} defaultOpen={false}>
            <div className="mb-2 rounded bg-blue-50 px-2 py-1.5 text-xs text-blue-700">
              Session dates auto-populated (event date - 6 and - 5 days).
            </div>

            {/* Session 1 */}
            <div className="mb-3 rounded border border-border bg-muted p-2">
              <div className="mb-2">
                <span className="text-xs font-medium text-muted-foreground">Session 1</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  value={config.zoomSessions[0]?.date || ""}
                  onChange={(e) => updateZoomSession(0, "date", e.target.value)}
                  placeholder="Date"
                  className="text-xs"
                />
                <Input
                  value={config.zoomSessions[0]?.time || ""}
                  onChange={(e) => updateZoomSession(0, "time", e.target.value)}
                  placeholder="Time (e.g., 7-7:30 PM)"
                  className="text-xs"
                />
                <Input
                  value={config.zoomSessions[0]?.host || ""}
                  onChange={(e) => updateZoomSession(0, "host", e.target.value)}
                  placeholder="Host"
                  className="text-xs"
                />
                <Input
                  value={config.zoomSessions[0]?.meetingId || ""}
                  onChange={(e) => updateZoomSession(0, "meetingId", e.target.value)}
                  placeholder="Meeting ID"
                  className="text-xs"
                />
                <Input
                  value={config.zoomSessions[0]?.passcode || ""}
                  onChange={(e) => updateZoomSession(0, "passcode", e.target.value)}
                  placeholder="Passcode"
                  className="text-xs col-span-2"
                />
                <Input
                  value={config.zoomSessions[0]?.zoomLink || ""}
                  onChange={(e) => updateZoomSession(0, "zoomLink", e.target.value)}
                  placeholder="Zoom Link"
                  className="text-xs col-span-2"
                />
                <Input
                  value={config.zoomSessions[0]?.gcalLink || ""}
                  onChange={(e) => updateZoomSession(0, "gcalLink", e.target.value)}
                  placeholder="Google Calendar Link"
                  className="text-xs col-span-2"
                />
              </div>
            </div>

            {/* Session 2 */}
            <div className="rounded border border-border bg-muted p-2">
              <div className="mb-2">
                <span className="text-xs font-medium text-muted-foreground">Session 2</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  value={config.zoomSessions[1]?.date || ""}
                  onChange={(e) => updateZoomSession(1, "date", e.target.value)}
                  placeholder="Date"
                  className="text-xs"
                />
                <Input
                  value={config.zoomSessions[1]?.time || ""}
                  onChange={(e) => updateZoomSession(1, "time", e.target.value)}
                  placeholder="Time (e.g., 7-7:30 PM)"
                  className="text-xs"
                />
                <Input
                  value={config.zoomSessions[1]?.host || ""}
                  onChange={(e) => updateZoomSession(1, "host", e.target.value)}
                  placeholder="Host"
                  className="text-xs"
                />
                <Input
                  value={config.zoomSessions[1]?.meetingId || ""}
                  onChange={(e) => updateZoomSession(1, "meetingId", e.target.value)}
                  placeholder="Meeting ID"
                  className="text-xs"
                />
                <Input
                  value={config.zoomSessions[1]?.passcode || ""}
                  onChange={(e) => updateZoomSession(1, "passcode", e.target.value)}
                  placeholder="Passcode"
                  className="text-xs col-span-2"
                />
                <Input
                  value={config.zoomSessions[1]?.zoomLink || ""}
                  onChange={(e) => updateZoomSession(1, "zoomLink", e.target.value)}
                  placeholder="Zoom Link"
                  className="text-xs col-span-2"
                />
                <Input
                  value={config.zoomSessions[1]?.gcalLink || ""}
                  onChange={(e) => updateZoomSession(1, "gcalLink", e.target.value)}
                  placeholder="Google Calendar Link"
                  className="text-xs col-span-2"
                />
              </div>
            </div>
          </Section>
            </div>

        {/* Right Panel - Editor */}
        <div className="flex flex-col overflow-hidden rounded-lg border border-border bg-card">
          {/* Subject Line */}
          {currentTemplate && (
            <div className="border-b border-border bg-muted px-4 py-2">
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Subject</div>
              <div className="mt-1 font-medium text-foreground">{generatedSubject}</div>
            </div>
          )}

          {/* Editor */}
          <div className="flex-1 overflow-hidden">
            {currentTemplate ? (
              <RichTextEditor
                content={editorContent}
                onChange={setEditorContent}
                highlightVariables={highlightVariables}
                className="h-full"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
                <Calendar className="mb-3 h-12 w-12 opacity-20" />
                <p className="text-sm">Select a template to begin editing</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Export Profile Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-card p-6 shadow-xl ">
            <h2 className="mb-4 text-xl font-semibold text-foreground ">Export Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground ">
                  Profile Name <span className="text-red-500">*</span>
                </label>
                <Input
                  value={exportProfileName}
                  onChange={(e) => setExportProfileName(e.target.value)}
                  placeholder="e.g., Spring 2026 Splash"
                  className=" "
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground ">
                  Exported By (optional)
                </label>
                <Input
                  value={exportedBy}
                  onChange={(e) => setExportedBy(e.target.value)}
                  placeholder="Your name"
                  className=" "
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground ">
                  Description (optional)
                </label>
                <textarea
                  value={exportDescription}
                  onChange={(e) => setExportDescription(e.target.value)}
                  placeholder="Notes about this configuration..."
                  rows={3}
                  className="w-full rounded-md border border-border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500   "
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowExportModal(false);
                  setExportProfileName("");
                  setExportDescription("");
                  setExportedBy("");
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleExportConfirm}>Export</Button>
            </div>
          </div>
        </div>
      )}

      {/* Import Confirmation Modal */}
      {showImportConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-card p-6 shadow-xl ">
            <h2 className="mb-4 text-xl font-semibold text-foreground ">Confirm Import</h2>
            <p className="mb-6 text-sm text-muted-foreground ">
              This will replace your current configuration with the imported profile. Are you sure?
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowImportConfirm(false);
                  setImportedConfig(null);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleImportConfirm}>Import</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
