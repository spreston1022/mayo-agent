import { ZuploContext, ZuploRequest } from "@zuplo/runtime";

export default async function (request: ZuploRequest, context: ZuploContext) {
  context.log.info("PHI data accessed", {
    user: context.user?.sub
  });

  return new Response(
    JSON.stringify({
      patient: {
        id: "P-12345",
        name: "John Doe",
        dob: "1975-03-22",
        mrn: "MRN-987654",
        diagnosis: "Type 2 Diabetes",
        medications: ["Metformin 500mg", "Lisinopril 10mg"],
        last_visit: "2026-04-15",
        physician: "Dr. Sarah Johnson",
        phi_classification: "RESTRICTED"
      }
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" }
    }
  );
}