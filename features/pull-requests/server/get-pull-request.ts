import { prisma } from "@/lib/db";
export async function getPullRequestById(
  installationId: number,
  pullRequestId: string
) {
  const pullRequest = await prisma.pullRequest.findUnique({
    where: { id: pullRequestId },
  });
   // Reject cross-tenant access — installationId must match the row
  if (!pullRequest || pullRequest.installationId !== installationId) {
    return null;
  }

  return pullRequest;
}