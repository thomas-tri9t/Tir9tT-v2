export type Project = {
  id: string;
  name: string;
  description: string;
  progress: number;
  status: "Active" | "On Hold" | "Completed" | "At Risk";
  health: "Healthy" | "Warning" | "Critical";
  owner: string;
  updatedAt: string;
};

export const projects: Project[] = [
  { id: "PRJ-001", name: "Network Appliance v4", description: "Enterprise networking firmware release.", progress: 72, status: "Active", health: "Healthy", owner: "Aaron Perillat", updatedAt: "2026-06-22" },
  { id: "PRJ-002", name: "Clear 3 Hearing Aid", description: "Class II medical device firmware.", progress: 48, status: "Active", health: "Warning", owner: "Kristi Wolf", updatedAt: "2026-06-21" },
  { id: "PRJ-003", name: "Bank Transfer Platform", description: "Mobile banking transfer module.", progress: 91, status: "Active", health: "Healthy", owner: "Jason Benson", updatedAt: "2026-06-23" },
  { id: "PRJ-004", name: "Wall Mount Testing Rig", description: "Hardware validation harness.", progress: 30, status: "At Risk", health: "Critical", owner: "George Siampos", updatedAt: "2026-06-19" },
  { id: "PRJ-005", name: "Appliance Configuration", description: "Product requirements for appliance config.", progress: 60, status: "Active", health: "Healthy", owner: "Becky Carlton", updatedAt: "2026-06-20" },
  { id: "PRJ-006", name: "Biometric Access Suite", description: "Fingerprint auth and access control.", progress: 100, status: "Completed", health: "Healthy", owner: "Alexander Kingston", updatedAt: "2026-05-30" },
];

export type GeneratedTestCase = {
  id: string;
  title: string;
  description: string;
  sourceReqIds: string[];
  sourceDocId?: string;
  priority: "High" | "Medium" | "Low";
  type: "Functional" | "Integration" | "Negative" | "Boundary";
  steps: { step: string; expected: string }[];
  createdAt: string;
  status: "Draft" | "Approved";
};

export type Activity = {
  id: string;
  user: string;
  action: string;
  target: string;
  project: string;
  type: "edit" | "create" | "reject" | "approve" | "comment" | "sync";
  timestamp: string;
};

export const activities: Activity[] = [
  { id: "a1", user: "Aaron Perillat", action: "edited test case", target: "TC-1042 — Login flow", project: "Network Appliance v4", type: "edit", timestamp: "12 min ago" },
  { id: "a2", user: "Kristi Wolf", action: "rejected requirement update", target: "REQ-218 — Audio gain", project: "Clear 3 Hearing Aid", type: "reject", timestamp: "38 min ago" },
  { id: "a3", user: "Jason Benson", action: "created test plan", project: "Bank Transfer Platform", target: "TP-12 — Transfer between accounts", type: "create", timestamp: "1 hr ago" },
  { id: "a4", user: "George Siampos", action: "approved requirement", target: "REQ-401 — Mount tolerance", project: "Wall Mount Testing Rig", type: "approve", timestamp: "2 hr ago" },
  { id: "a5", user: "Becky Carlton", action: "synced to Jira", target: "TC-873", project: "Appliance Configuration", type: "sync", timestamp: "3 hr ago" },
  { id: "a6", user: "Alexander Kingston", action: "commented on", target: "DEF-77 — Auth timeout", project: "Biometric Access Suite", type: "comment", timestamp: "4 hr ago" },
  { id: "a7", user: "Mario Maldari", action: "edited requirement", target: "REQ-19 — View transfer history", project: "Bank Transfer Platform", type: "edit", timestamp: "5 hr ago" },
  { id: "a8", user: "Simon Knight", action: "rejected test case", target: "TC-204 — Voice recognition", project: "Appliance Configuration", type: "reject", timestamp: "yesterday" },
  { id: "a9", user: "Aaron Perillat", action: "created defect", target: "DEF-91 — Packet loss", project: "Network Appliance v4", type: "create", timestamp: "yesterday" },
  { id: "a10", user: "Kristi Wolf", action: "synced to Polarion", target: "REQ-218", project: "Clear 3 Hearing Aid", type: "sync", timestamp: "2 days ago" },
];

export const testExecution = {
  total: 1284,
  executed: 974,
  passed: 812,
  failed: 102,
  scheduled: 198,
  notScheduled: 112,
  blocked: 60,
};

export const defectStats = {
  total: 184,
  open: 47,
  fixed: 62,
  closed: 75,
};

export const traceability = {
  linked: 712,
  traceable: 645,
  unlinked: 142,
  missing: 89,
};

export const almSync = {
  synced: 612,
  notSynced: 88,
  status: "Healthy",
  integrationHealth: 92,
};

export const users = [
  { id: "u1", name: "Aaron Perillat", email: "aaron@redside.com", role: "Admin", department: "Engineering", status: "Active" },
  { id: "u2", name: "Kristi Wolf", email: "kristi@redside.com", role: "Manager", department: "QA", status: "Active" },
  { id: "u3", name: "Jason Benson", email: "jason@redside.com", role: "Engineer", department: "Engineering", status: "Active" },
  { id: "u4", name: "George Siampos", email: "george@redside.com", role: "Reviewer", department: "QA", status: "Active" },
  { id: "u5", name: "Becky Carlton", email: "becky@redside.com", role: "Engineer", department: "Product", status: "Inactive" },
  { id: "u6", name: "Alexander Kingston", email: "alex@redside.com", role: "Manager", department: "Compliance", status: "Active" },
  { id: "u7", name: "Mario Maldari", email: "mario@redside.com", role: "Engineer", department: "Engineering", status: "Active" },
  { id: "u8", name: "Simon Knight", email: "simon@redside.com", role: "Reviewer", department: "QA", status: "Active" },
];

export const roles = [
  { id: "r1", name: "Admin", description: "Full system access", users: 2, permissions: 24 },
  { id: "r2", name: "Manager", description: "Project oversight, approvals", users: 4, permissions: 18 },
  { id: "r3", name: "Engineer", description: "Author requirements & test cases", users: 12, permissions: 12 },
  { id: "r4", name: "Reviewer", description: "Review and approve", users: 6, permissions: 8 },
  { id: "r5", name: "Viewer", description: "Read-only access", users: 9, permissions: 4 },
];

export const permissions = [
  { id: "p1", name: "requirements.create", category: "Requirements", description: "Create new requirements" },
  { id: "p2", name: "requirements.edit", category: "Requirements", description: "Modify requirements" },
  { id: "p3", name: "requirements.delete", category: "Requirements", description: "Delete requirements" },
  { id: "p4", name: "testcases.create", category: "Test Cases", description: "Create test cases" },
  { id: "p5", name: "testcases.execute", category: "Test Cases", description: "Execute test runs" },
  { id: "p6", name: "defects.manage", category: "Defects", description: "Manage defect lifecycle" },
  { id: "p7", name: "projects.admin", category: "Projects", description: "Full project administration" },
  { id: "p8", name: "users.manage", category: "Administration", description: "Manage users and roles" },
  { id: "p9", name: "integrations.configure", category: "Integrations", description: "Configure external tools" },
  { id: "p10", name: "reports.export", category: "Reports", description: "Export reports" },
];

export const defects = [
  { id: "DEF-91", title: "Packet loss on high throughput", severity: "Critical", status: "Open", owner: "Aaron Perillat", project: "Network Appliance v4", createdAt: "2026-06-20" },
  { id: "DEF-77", title: "Auth timeout after biometric retry", severity: "High", status: "Open", owner: "Alexander Kingston", project: "Biometric Access Suite", createdAt: "2026-06-18" },
  { id: "DEF-65", title: "Voice command not recognized", severity: "Medium", status: "Fixed", owner: "Simon Knight", project: "Appliance Configuration", createdAt: "2026-06-14" },
  { id: "DEF-52", title: "Incorrect balance after transfer", severity: "High", status: "Closed", owner: "Jason Benson", project: "Bank Transfer Platform", createdAt: "2026-06-08" },
  { id: "DEF-48", title: "UI layout breaks on tablet", severity: "Low", status: "Open", owner: "Becky Carlton", project: "Appliance Configuration", createdAt: "2026-06-05" },
  { id: "DEF-30", title: "Mount fails stress test at 80kg", severity: "Critical", status: "Fixed", owner: "George Siampos", project: "Wall Mount Testing Rig", createdAt: "2026-05-29" },
];

export type Requirement = {
  id: string;
  name: string;
  level: number;
  levelName: string;
  parent: string | null;
  priority: string;
  status: string;
  compliance: string[];
  group: string;
  testCases: string[];
  description?: string;
  documentId?: string;
  owner?: string;
  createdAt?: string;
};

export const requirements: Requirement[] = [
  { id: "BR-001", name: "User Authentication", level: 0, levelName: "Business Requirement", parent: null, priority: "High", status: "Approved", compliance: ["FDA 21 CFR Part 820"], group: "Auth", testCases: ["TC-1001", "TC-1002"], documentId: "DOC-BRD-1", owner: "Aaron Perillat", createdAt: "2026-05-12", description: "Users must authenticate before accessing the system." },
  { id: "BR-002", name: "Role-Based Access Control", level: 0, levelName: "Business Requirement", parent: null, priority: "High", status: "Approved", compliance: ["FDA 21 CFR Part 820"], group: "Auth", testCases: ["TC-1010"], documentId: "DOC-BRD-1", owner: "Aaron Perillat", createdAt: "2026-05-12", description: "System shall support role-based access for Admin, Manager, Engineer, Viewer." },
  { id: "BR-003", name: "Audit Logging", level: 0, levelName: "Business Requirement", parent: null, priority: "Medium", status: "Under Review", compliance: ["ISO 13485"], group: "Compliance", testCases: [], documentId: "DOC-BRD-1", owner: "Kristi Wolf", createdAt: "2026-05-14", description: "All privileged actions must be captured in the audit log." },
  { id: "SR-001", name: "Biometric Login", level: 1, levelName: "System Requirement", parent: "BR-001", priority: "High", status: "Approved", compliance: ["FDA 21 CFR Part 820", "IEC 62304"], group: "Auth", testCases: ["TC-1003"], documentId: "DOC-SRD-1", owner: "Jason Benson", createdAt: "2026-05-18", description: "System shall support fingerprint biometric login on supported devices." },
  { id: "SR-002", name: "Fingerprint Capture", level: 2, levelName: "Functional Requirement", parent: "SR-001", priority: "Medium", status: "Under Review", compliance: ["IEC 62304"], group: "Auth", testCases: ["TC-1004"], documentId: "DOC-SRD-1", owner: "Jason Benson", createdAt: "2026-05-20", description: "Capture fingerprint at 500 dpi within 1.2s." },
  { id: "SR-003", name: "Sensor Calibration", level: 2, levelName: "Functional Requirement", parent: "SR-001", priority: "Medium", status: "Draft", compliance: [], group: "Hardware", testCases: [], documentId: "DOC-SRD-1", owner: "George Siampos", createdAt: "2026-05-22", description: "Sensor calibration tolerance ±2%." },
  { id: "FR-001", name: "Transfer Between Accounts", level: 0, levelName: "Functional Requirement", parent: null, priority: "High", status: "Approved", compliance: ["ISO 13485"], group: "Banking", testCases: ["TC-2001", "TC-2002"], documentId: "DOC-FRS-1", owner: "Jason Benson", createdAt: "2026-06-01", description: "Users can transfer funds between own accounts." },
  { id: "FR-002", name: "Transfer Validation", level: 1, levelName: "Functional Requirement", parent: "FR-001", priority: "High", status: "Approved", compliance: ["ISO 13485"], group: "Banking", testCases: ["TC-2003"], documentId: "DOC-FRS-1", owner: "Jason Benson", createdAt: "2026-06-02", description: "Validate balance, daily limits, and 2FA before commit." },
];

export type ReqDocument = {
  id: string;
  name: string;
  category: "Business Requirement" | "System Requirement" | "Functional Requirement" | "Non-Functional Requirement";
  uploadedBy: string;
  uploadedAt: string;
  pages: number;
  sizeKb: number;
};

export const reqDocuments: ReqDocument[] = [
  { id: "DOC-BRD-1", name: "BRD_v1.pdf", category: "Business Requirement", uploadedBy: "Aaron Perillat", uploadedAt: "2026-05-12", pages: 28, sizeKb: 842 },
  { id: "DOC-SRD-1", name: "SRD_v1.pdf", category: "System Requirement", uploadedBy: "Jason Benson", uploadedAt: "2026-05-18", pages: 64, sizeKb: 1820 },
  { id: "DOC-FRS-1", name: "FRS_v2.pdf", category: "Functional Requirement", uploadedBy: "Jason Benson", uploadedAt: "2026-06-01", pages: 41, sizeKb: 1240 },
];

export const reqCategories: ReqDocument["category"][] = [
  "Business Requirement",
  "System Requirement",
  "Functional Requirement",
  "Non-Functional Requirement",
];

export const integrations = [
  { id: "jira", name: "Jira", description: "Atlassian issue tracking", status: "Connected", health: 98, lastSync: "2 min ago", icon: "J" },
  { id: "polarion", name: "Polarion", description: "Siemens ALM platform", status: "Connected", health: 87, lastSync: "12 min ago", icon: "P" },
  { id: "azure", name: "Azure DevOps", description: "Microsoft DevOps", status: "Disconnected", health: 0, lastSync: "—", icon: "A" },
];
