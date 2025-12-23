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
import { Calendar, MapPin, Users, Link2, Video, Highlighter } from "lucide-react";
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
  // Splash Templates
  { id: "splash-student-registration-open", name: "Student Registration Open", ...SPLASH_STUDENT_REGISTRATION_OPEN, audience: "student", program: "Splash" },
  { id: "splash-registration-due-tomorrow", name: "Registration Due Tomorrow", ...SPLASH_REGISTRATION_DUE_TOMORROW, audience: "student", program: "Splash" },
  { id: "splash-student-logistics", name: "Student/Parent Logistics (2 days before)", ...SPLASH_STUDENT_LOGISTICS, audience: "parent", program: "Splash" },
  { id: "splash-tomorrow-student", name: "Day Before - Students", ...SPLASH_TOMORROW_STUDENT, audience: "student", program: "Splash" },
  { id: "splash-teacher-forms-orientation", name: "Teacher Forms & Orientation", ...SPLASH_TEACHER_FORMS_ORIENTATION, audience: "teacher", program: "Splash" },
  { id: "splash-training-reminder", name: "Training Reminder", ...SPLASH_TRAINING_REMINDER, audience: "teacher", program: "Splash" },
  { id: "splash-teacher-training-resources", name: "Teacher Training Resources", ...SPLASH_TEACHER_TRAINING_RESOURCES, audience: "teacher", program: "Splash" },
  { id: "splash-printout-reminder", name: "Printout Submission Reminder", ...SPLASH_PRINTOUT_REMINDER, audience: "teacher", program: "Splash" },
  { id: "splash-teacher-logistics", name: "Teacher Logistics (few days before)", ...SPLASH_TEACHER_LOGISTICS, audience: "teacher", program: "Splash" },
  { id: "splash-tomorrow-teacher", name: "Day Before - Teachers", ...SPLASH_TOMORROW_TEACHER, audience: "teacher", program: "Splash" },
  // Sprout Templates
  { id: "teach-for-sprout", name: "Teach for Sprout", ...TEACH_FOR_SPROUT, audience: "teacher", program: "Sprout" },
  { id: "sprout-student-registration", name: "Student Registration Open", ...SPROUT_STUDENT_REGISTRATION, audience: "student", program: "Sprout" },
  { id: "sprout-teacher-forms-orientation", name: "Teacher Forms & Orientation", ...SPROUT_TEACHER_FORMS_ORIENTATION, audience: "teacher", program: "Sprout" },
  { id: "sprout-volunteer-invitation", name: "Volunteer Invitation", ...SPROUT_VOLUNTEER_INVITATION, audience: "volunteer", program: "Sprout" },
  { id: "sprout-parent-logistics", name: "Parent Logistics (2 days before)", ...SPROUT_PARENT_LOGISTICS, audience: "parent", program: "Sprout" },
  { id: "sprout-teacher-logistics", name: "Teacher Logistics (few days before)", ...SPROUT_TEACHER_LOGISTICS, audience: "teacher", program: "Sprout" },
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
      <label className="mb-1 block text-xs font-medium text-slate-600">{label}</label>
      <input
        type="date"
        value={toDateInputValue(value)}
        onChange={(e) => onChange(fromDateInputValue(e.target.value))}
        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
      {computedFormats && value && (
        <div className="mt-1 text-xs text-slate-500">
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
    <div className="rounded-lg border border-slate-200 bg-white">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-3 py-2 text-left"
      >
        <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <Icon className="h-4 w-4 text-slate-400" />
          {title}
        </span>
        <span className="text-xs text-slate-400">{isOpen ? "▲" : "▼"}</span>
      </button>
      {isOpen && <div className="space-y-3 border-t border-slate-100 px-3 py-3">{children}</div>}
    </div>
  );
}

export function EmailTemplateForm() {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [highlightVariables, setHighlightVariables] = useState(true);
  const [editorContent, setEditorContent] = useState<string>("");

  // Editable config state - start with first Splash config
  const [config, setConfig] = useState<SemesterConfig>(() => {
    const defaultConfig = semesterConfigs.find(c => c.program === "Splash") ?? semesterConfigs[0];
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
  const teacherRegFormats = useMemo(() => computeDateFormats(config.teacherRegDeadline), [config.teacherRegDeadline]);
  const trainingFormats = useMemo(() => computeDateFormats(config.trainingDeadline), [config.trainingDeadline]);
  const printFormats = useMemo(() => computeDateFormats(config.printDeadline), [config.printDeadline]);
  const materialsFormats = useMemo(() => computeDateFormats(config.materialsDeadline), [config.materialsDeadline]);

  // Auto-compute semester from event date
  const computedSemester = useMemo(() => {
    if (!config.eventDate1) return {
      semester: "",
      semesterShort: "",
      seasonLetter: "",
      shortYear: ""
    };

    const month = config.eventDate1.getMonth(); // 0-11
    const year = config.eventDate1.getFullYear();
    const shortYear = String(year).slice(-2);

    // Jan-Jun = Spring, Jul-Dec = Fall
    const season = month >= 6 ? "Fall" : "Spring";
    const seasonLetter = season === "Fall" ? "F" : "S";

    return {
      semester: `${season} ${year}`,
      semesterShort: `${season} '${shortYear}`,
      seasonLetter,
      shortYear
    };
  }, [config.eventDate1]);

  // Build computed template values for variable replacement
  const computedValues = useMemo(() => {
    // Generate zoom sessions list
    const zoomSessionsList = config.zoomSessions.map((session, index) => {
      const parts = [
        `${session.date} from ${session.time} - ${session.host}`,
        session.zoomLink ? `Zoom Link: ${session.zoomLink}` : null,
        `Meeting ID: ${session.meetingId}`,
        `Passcode: ${session.passcode}`,
        session.gcalLink ? `Click this link to add to your GCAL!: ${session.gcalLink}` : null
      ].filter(Boolean);
      return parts.join('\n');
    }).join('\n\n');

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

    return {
      // Program info
      program: config.program,
      semester: computedSemester.semester,
      semesterShort: computedSemester.semesterShort,
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
      teacherRegDeadline: teacherRegFormats?.short || "",
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
      directors,
      directorsTeam,
      directorsLong,
      websiteLink: config.websiteLink,
      studentRegLink,
      teacherRegLink,
      certificationsFormLink: config.certificationsFormLink,
      materialsFormLink: config.materialsFormLink,
      budgetLink: config.budgetLink,
      volunteerFormLink: config.volunteerFormLink || "",
      groupMeLink: config.groupMeLink || "",
      slidesLink: config.slidesLink || "",
      pedagogyPacketLink: config.pedagogyPacketLink || "",
      teachingTipsLink: config.teachingTipsLink || "",
      zoomSessionsList,
    };
  }, [config, isTwoDays, times, eventDateFormats, regDeadlineFormats, teacherRegFormats, trainingFormats, printFormats, materialsFormats, computedSemester]);

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
              { date: formatZoomDate(zoom1Date), time: "7-7:30 PM", host: "", meetingId: "", passcode: "" },
              { date: formatZoomDate(zoom2Date), time: "7-7:30 PM", host: "", meetingId: "", passcode: "" },
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

  const addZoomSession = () => {
    setConfig((prev) => ({
      ...prev,
      zoomSessions: [...prev.zoomSessions, { date: "", time: "7-7:30 PM", host: "", meetingId: "", passcode: "" }],
    }));
  };

  const removeZoomSession = (index: number) => {
    setConfig((prev) => ({
      ...prev,
      zoomSessions: prev.zoomSessions.filter((_, i) => i !== index),
    }));
  };

  // Filter templates by program
  const availableTemplates = useMemo(
    () => EMAIL_TEMPLATES.filter((t) => t.program === config.program || t.program === "both"),
    [config.program]
    );

  return (
    <div className="flex h-full flex-col bg-slate-50">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
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
          <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
            <Calendar className="h-4 w-4 text-slate-400" />
            <span className="text-sm font-medium text-slate-700">
              {computedSemester.semester || "No date set"}
            </span>
          </div>

          {/* Event Date Picker */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-slate-600">Event Date:</label>
            <input
              type="date"
              value={toDateInputValue(config.eventDate1)}
              onChange={(e) => handleEventDate1Change(fromDateInputValue(e.target.value))}
              className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Template Selector */}
          <Select value={selectedTemplateId} onValueChange={setSelectedTemplateId}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select template..." />
            </SelectTrigger>
            <SelectContent>
              <div className="px-2 py-1 text-xs font-semibold text-slate-500">Teachers</div>
              {availableTemplates.filter((t) => t.audience === "teacher").map((t) => (
                <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
              ))}
              <div className="px-2 py-1 text-xs font-semibold text-slate-500">Students/Parents</div>
              {availableTemplates.filter((t) => t.audience === "student" || t.audience === "parent").map((t) => (
                <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
              ))}
              {availableTemplates.filter((t) => t.audience === "volunteer").length > 0 && (
                <>
                  <div className="px-2 py-1 text-xs font-semibold text-slate-500">Volunteers</div>
                  {availableTemplates.filter((t) => t.audience === "volunteer").map((t) => (
                    <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                  ))}
                </>
              )}
              </SelectContent>
            </Select>
          </div>

        {/* Highlight Toggle */}
        <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5">
          <input
            type="checkbox"
            checked={highlightVariables}
            onChange={(e) => setHighlightVariables(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300"
          />
          <Highlighter className="h-4 w-4 text-amber-500" />
          <span className="text-sm text-slate-600">Highlight Variables</span>
            </label>
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
            <span className="ml-auto text-xs text-slate-500">
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
                <div className="rounded bg-slate-50 p-2 text-xs text-slate-600">
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
              label="Teacher Registration Deadline"
              value={config.teacherRegDeadline}
              onChange={(d) => updateConfig("teacherRegDeadline", d)}
              computedFormats={teacherRegFormats}
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
              label="Course Materials Deadline"
              value={config.materialsDeadline}
              onChange={(d) => updateConfig("materialsDeadline", d)}
              computedFormats={materialsFormats}
            />
          </Section>

          {/* Locations */}
          <Section title="Locations" icon={MapPin} defaultOpen={false}>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Admin HQ Room</label>
              <Input
                value={config.adminHQ}
                onChange={(e) => updateConfig("adminHQ", e.target.value)}
                className="text-sm"
                placeholder="LC 104"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Buildings (short)</label>
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
              <label className="mb-1 block text-xs font-medium text-slate-600">Auto-generated Signatures</label>
              <div className="space-y-1 rounded bg-slate-50 p-2 text-xs text-slate-600">
                <div><span className="font-medium">Short:</span> {computedValues.directors || "Set event date first"}</div>
                <div><span className="font-medium">Team:</span> {computedValues.directorsTeam || "Set event date first"}</div>
                <div><span className="font-medium">Long:</span> {computedValues.directorsLong || "Set event date first"}</div>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Phone</label>
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
              <label className="mb-1 block text-xs font-medium text-slate-600">Auto-generated Registration Links</label>
              <div className="space-y-1 rounded bg-slate-50 p-2 text-xs text-slate-600">
                <div>
                  <span className="font-medium">Student:</span>
                  <div className="mt-0.5 break-all">{computedValues.studentRegLink}</div>
                </div>
                <div>
                  <span className="font-medium">Teacher:</span>
                  <div className="mt-0.5 break-all">{computedValues.teacherRegLink}</div>
                </div>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Certifications Form</label>
              <Input
                value={config.certificationsFormLink}
                onChange={(e) => updateConfig("certificationsFormLink", e.target.value)}
                className="text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Materials Form</label>
              <Input
                value={config.materialsFormLink}
                onChange={(e) => updateConfig("materialsFormLink", e.target.value)}
                className="text-sm"
              />
            </div>
          </Section>

          {/* Zoom Sessions */}
          <Section title="Zoom Sessions" icon={Video} defaultOpen={false}>
            <div className="mb-2 rounded bg-blue-50 px-2 py-1.5 text-xs text-blue-700">
              First 2 session dates auto-populated (event date - 6 and - 5 days).
            </div>
            <div className="mb-2 flex justify-end">
              <Button variant="outline" size="sm" onClick={addZoomSession} className="h-7 text-xs">
                + Add Session
              </Button>
            </div>
            {config.zoomSessions.map((session, index) => (
              <div key={index} className="rounded border border-slate-200 bg-slate-50 p-2">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-600">Session {index + 1}</span>
            <Button
                    variant="ghost"
              size="sm"
                    onClick={() => removeZoomSession(index)}
                    className="h-5 px-2 text-xs text-red-500"
                  >
                    Remove
            </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    value={session.date}
                    onChange={(e) => updateZoomSession(index, "date", e.target.value)}
                    placeholder="Date"
                    className="text-xs"
                  />
                  <Input
                    value={session.host}
                    onChange={(e) => updateZoomSession(index, "host", e.target.value)}
                    placeholder="Host"
                    className="text-xs"
                  />
                  <Input
                    value={session.meetingId}
                    onChange={(e) => updateZoomSession(index, "meetingId", e.target.value)}
                    placeholder="Meeting ID"
                    className="text-xs"
                  />
                  <Input
                    value={session.passcode}
                    onChange={(e) => updateZoomSession(index, "passcode", e.target.value)}
                    placeholder="Passcode"
                    className="text-xs"
                  />
                </div>
              </div>
            ))}
          </Section>
            </div>

        {/* Right Panel - Editor */}
        <div className="flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white">
          {/* Subject Line */}
          {currentTemplate && (
            <div className="border-b border-slate-200 bg-slate-50 px-4 py-2">
              <div className="text-xs font-medium uppercase tracking-wider text-slate-400">Subject</div>
              <div className="mt-1 font-medium text-slate-900">{generatedSubject}</div>
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
              <div className="flex h-full flex-col items-center justify-center text-slate-400">
                <Calendar className="mb-3 h-12 w-12 opacity-20" />
                <p className="text-sm">Select a template to begin editing</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
