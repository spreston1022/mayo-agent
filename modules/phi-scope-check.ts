import { ZuploContext, ZuploRequest } from "@zuplo/runtime";

const scopePermissions: Record<string, string[]> = {
  "mcp:access": ["echo-endpoint"],
  "phi:read": ["phi-data", "get_patient_record", "list_lab_results"]
};

export default async function(
  request: ZuploRequest,
  context: ZuploContext
) {
  const body = await request.clone().json();

  if (body?.method !== "tools/call") {
    return request;
  }

  const toolName = body?.params?.name;
  const userPermissions: string[] = context.user?.data?.permissions ?? [];

  const hasAccess = userPermissions.some(
    scope => scopePermissions[scope]?.includes(toolName)
  );

  if (!hasAccess) {
    context.log.warn("Scope check failed", {
      user: context.user?.sub,
      tool: toolName,
      permissions: userPermissions
    });

    return new Response(
      JSON.stringify({
        error: "Insufficient permissions",
        code: "PHI_ACCESS_DENIED",
        tool: toolName,
        message: "Access to this tool requires additional approval"
      }),
      {
        status: 403,
        headers: { "Content-Type": "application/json" }
      }
    );
  }

  context.log.info("Scope check passed", {
    user: context.user?.sub,
    tool: toolName
  });

  return request;
}