// school-student-mcp.mjs
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

/* ---------------- SCHEMAS ---------------- */

const AddSchoolSchema = z.object({
  name: z.string(),
  year: z.string()
});

const GetSchoolSchema = z.object({ id: z.string() });
const DeleteSchoolSchema = z.object({ id: z.string() });

const AddStudentSchema = z.object({
  schoolId: z.string(),
  fName: z.string(),
  sName: z.string().optional(),
  surname: z.string(),
  classes: z.string()
});

const GetStudentSchema = z.object({ id: z.string() });
const GetStudentsBySchoolSchema = z.object({ schoolId: z.string() });

/* ---------------- SERVER ---------------- */

const BASE_URL = process.env.API_BASE_URL || "http://localhost:3000";

const server = new Server(
  { name: "school-student-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

/* ---------------- HELPER ---------------- */

async function apiFetch(endpoint, method = "GET", body = null) {
  const url = `${BASE_URL}${endpoint}`;
  console.error(`[${method}] ${url}`);

  const options = {
    method,
    headers: { "Content-Type": "application/json" }
  };

  if (body) options.body = JSON.stringify(body);

  const response = await fetch(url, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `API error: ${response.status} ${response.statusText}`);
  }

  return data;
}

/* ---------------- TOOL LIST ---------------- */

server.setRequestHandler(ListToolsRequestSchema, async () => {
  console.error("=== LISTING TOOLS ===");
  return {
    tools: [
      /* ---- SCHOOL ---- */
      {
        name: "add-school",
        description: "Create a new school. Name and foundation year are required.",
        inputSchema: {
          type: "object",
          properties: {
            name: { type: "string", description: "School name (e.g., Atatürk Anatolian High School)" },
            year: { type: "string", description: "Foundation year (e.g., 1995)" }
          },
          required: ["name", "year"]
        }
      },
      {
        name: "get-school",
        description: "Get details of a specific school by ID.",
        inputSchema: {
          type: "object",
          properties: {
            id: { type: "string", description: "MongoDB ObjectId of the school" }
          },
          required: ["id"]
        }
      },
      {
        name: "get-all-schools",
        description: "List all schools in the system.",
        inputSchema: { type: "object", properties: {} }
      },
      {
        name: "delete-school",
        description: "Permanently delete a school by ID.",
        inputSchema: {
          type: "object",
          properties: {
            id: { type: "string", description: "MongoDB ObjectId of the school to delete" }
          },
          required: ["id"]
        }
      },

      /* ---- STUDENT ---- */
      {
        name: "add-student",
        description: "Register a new student in a school. The same name/surname combination cannot be duplicated within the same school.",
        inputSchema: {
          type: "object",
          properties: {
            schoolId: { type: "string", description: "ObjectId of the school the student belongs to" },
            fName: { type: "string", description: "Student first name" },
            sName: { type: "string", description: "Student middle name (optional)" },
            surname: { type: "string", description: "Student surname" },
            classes: { type: "string", description: "Class information (e.g., 10-A, 11-B)" }
          },
          required: ["schoolId", "fName", "surname", "classes"]
        }
      },
      {
        name: "get-student",
        description: "Get student information by ID.",
        inputSchema: {
          type: "object",
          properties: {
            id: { type: "string", description: "MongoDB ObjectId of the student" }
          },
          required: ["id"]
        }
      },
      {
        name: "get-students-by-school",
        description: "List all students in a specific school.",
        inputSchema: {
          type: "object",
          properties: {
            schoolId: { type: "string", description: "MongoDB ObjectId of the school" }
          },
          required: ["schoolId"]
        }
      }
    ]
  };
});

/* ---------------- TOOL HANDLERS ---------------- */

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  console.error("=== TOOL CALLED ===");
  console.error("Tool:", name);
  console.error("Args:", JSON.stringify(args, null, 2));

  try {
    switch (name) {

      /* ---- SCHOOL HANDLERS ---- */

      case "add-school": {
        const { name: schoolName, year } = AddSchoolSchema.parse(args);
        const data = await apiFetch("/school/add", "POST", { name: schoolName, year });
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              success: true,
              school: data.school,
              schoolId: data.schoolId,
              message: data.message
            }, null, 2)
          }]
        };
      }

      case "get-school": {
        const { id } = GetSchoolSchema.parse(args);
        const data = await apiFetch(`/school/get/${id}`);
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              schoolId: data.schoolId,
              name: data.name,
              year: data.year
            }, null, 2)
          }]
        };
      }

      case "get-all-schools": {
        const data = await apiFetch("/school/all");
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              count: data.count,
              schools: data.schools.map(s => ({
                id: s._id,
                name: s.name,
                year: s.year
              }))
            }, null, 2)
          }]
        };
      }

      case "delete-school": {
        const { id } = DeleteSchoolSchema.parse(args);
        const data = await apiFetch(`/school/delete/${id}`, "DELETE");
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              success: true,
              deletedSchool: data.school,
              message: data.message
            }, null, 2)
          }]
        };
      }

      /* ---- STUDENT HANDLERS ---- */

      case "add-student": {
        const { schoolId, fName, sName, surname, classes } = AddStudentSchema.parse(args);
        const data = await apiFetch("/student/add", "POST", {
          schoolId, fName, sName, surname, classes
        });
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              success: true,
              student: data.student,
              studentId: data.id,
              message: data.message
            }, null, 2)
          }]
        };
      }

      case "get-student": {
        const { id } = GetStudentSchema.parse(args);
        const data = await apiFetch(`/student/get/${id}`);
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              studentId: data.studentId,
              fullName: data.fullName,
              message: data.message
            }, null, 2)
          }]
        };
      }

      case "get-students-by-school": {
        const { schoolId } = GetStudentsBySchoolSchema.parse(args);
        const data = await apiFetch(`/student/school/${schoolId}`);
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              count: data.count,
              students: data.students,
              message: data.message
            }, null, 2)
          }]
        };
      }

      default:
        return { content: [{ type: "text", text: `Unknown tool: ${name}` }] };
    }

  } catch (error) {
    console.error("=== ERROR ===", error.message);
    return {
      content: [{
        type: "text",
        text: `Error: ${error instanceof Error ? error.message : String(error)}`
      }],
      isError: true
    };
  }
});

/* ---------------- CONNECT ---------------- */

console.error("=== STARTING SCHOOL-STUDENT MCP SERVER ===");
console.error("Base URL:", BASE_URL);
console.error("Available tools: add-school, get-school, get-all-schools, delete-school, add-student, get-student, get-students-by-school");

const transport = new StdioServerTransport();
await server.connect(transport);
console.error("=== SERVER CONNECTED ===");
