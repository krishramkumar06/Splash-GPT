import { SemesterConfig, SemesterProfile, ProfileMetadata } from "./types";

/**
 * Validates that a SemesterConfig has all required fields filled
 */
export function validateConfig(config: SemesterConfig): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check required date fields
  if (!config.eventDate1) errors.push("Event date is required");

  // Check required deadline fields (at least one date should be set)
  if (!config.registrationDeadline) errors.push("Student registration deadline is required");
  if (!config.teacherRegDeadlineFake) errors.push("Teacher registration deadline (fake) is required");
  if (!config.teacherRegDeadlineReal) errors.push("Teacher registration deadline (real) is required");

  // Check required string fields
  if (!config.adminHQ?.trim()) errors.push("Admin HQ is required");
  if (!config.buildings?.trim()) errors.push("Buildings description is required");
  if (!config.buildingsShort?.trim()) errors.push("Buildings (short) is required");
  if (!config.dropoff?.trim()) errors.push("Dropoff location is required");
  if (!config.phone?.trim()) errors.push("Phone number is required");
  if (!config.email?.trim()) errors.push("Email is required");
  if (!config.cost?.trim()) errors.push("Cost is required");
  if (!config.websiteLink?.trim()) errors.push("Website link is required");

  return { valid: errors.length === 0, errors };
}

/**
 * Serializes a SemesterConfig to a JSON-safe format (converts Dates to ISO strings)
 */
export function serializeConfig(config: SemesterConfig): any {
  return {
    ...config,
    eventDate1: config.eventDate1?.toISOString() || null,
    eventDate2: config.eventDate2?.toISOString() || null,
    registrationDeadline: config.registrationDeadline?.toISOString() || null,
    teacherRegDeadlineFake: config.teacherRegDeadlineFake?.toISOString() || null,
    teacherRegDeadlineReal: config.teacherRegDeadlineReal?.toISOString() || null,
    courseRevisionDeadlineSoft: config.courseRevisionDeadlineSoft?.toISOString() || null,
    materialsDeadlineSoft: config.materialsDeadlineSoft?.toISOString() || null,
    materialsDeadlineHard: config.materialsDeadlineHard?.toISOString() || null,
    trainingDeadline: config.trainingDeadline?.toISOString() || null,
    printDeadline: config.printDeadline?.toISOString() || null,
    materialsDeadline: config.materialsDeadline?.toISOString() || null,
  };
}

/**
 * Deserializes a SemesterConfig from JSON (converts ISO strings to Dates)
 */
export function deserializeConfig(data: any): SemesterConfig {
  return {
    ...data,
    eventDate1: data.eventDate1 ? new Date(data.eventDate1) : null,
    eventDate2: data.eventDate2 ? new Date(data.eventDate2) : null,
    registrationDeadline: data.registrationDeadline ? new Date(data.registrationDeadline) : null,
    teacherRegDeadlineFake: data.teacherRegDeadlineFake ? new Date(data.teacherRegDeadlineFake) : null,
    teacherRegDeadlineReal: data.teacherRegDeadlineReal ? new Date(data.teacherRegDeadlineReal) : null,
    courseRevisionDeadlineSoft: data.courseRevisionDeadlineSoft ? new Date(data.courseRevisionDeadlineSoft) : null,
    materialsDeadlineSoft: data.materialsDeadlineSoft ? new Date(data.materialsDeadlineSoft) : null,
    materialsDeadlineHard: data.materialsDeadlineHard ? new Date(data.materialsDeadlineHard) : null,
    trainingDeadline: data.trainingDeadline ? new Date(data.trainingDeadline) : null,
    printDeadline: data.printDeadline ? new Date(data.printDeadline) : null,
    materialsDeadline: data.materialsDeadline ? new Date(data.materialsDeadline) : null,
  };
}

/**
 * Exports a profile as a downloadable JSON file
 */
export function exportProfile(config: SemesterConfig, metadata: Omit<ProfileMetadata, "exportedAt" | "program" | "semester">) {
  const profile: SemesterProfile = {
    metadata: {
      ...metadata,
      exportedAt: new Date().toISOString(),
      program: config.program,
      semester: config.semester,
    },
    config: serializeConfig(config),
  };

  const json = JSON.stringify(profile, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  const filename = `${config.program.toLowerCase()}-${config.semester.replace(/\s+/g, "-").toLowerCase()}-profile.json`;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}

/**
 * Validates and parses an imported profile JSON
 */
export function validateImportedProfile(jsonString: string): { valid: boolean; profile?: SemesterProfile; errors: string[] } {
  const errors: string[] = [];

  try {
    const data = JSON.parse(jsonString);

    // Check structure
    if (!data.metadata) {
      errors.push("Missing metadata section");
    }
    if (!data.config) {
      errors.push("Missing config section");
    }

    if (errors.length > 0) {
      return { valid: false, errors };
    }

    // Validate metadata
    if (!data.metadata.profileName?.trim()) {
      errors.push("Profile name is missing");
    }
    if (!data.metadata.program) {
      errors.push("Program type is missing");
    }
    if (!data.metadata.semester) {
      errors.push("Semester is missing");
    }

    // Deserialize and validate config
    const config = deserializeConfig(data.config);
    const configValidation = validateConfig(config);

    if (!configValidation.valid) {
      errors.push(...configValidation.errors);
    }

    if (errors.length > 0) {
      return { valid: false, errors };
    }

    return { valid: true, profile: data as SemesterProfile, errors: [] };
  } catch (error) {
    return { valid: false, errors: ["Invalid JSON format"] };
  }
}
