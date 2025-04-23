import { z } from 'zod';

export const createProjectSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Project name is required'
    }),
    workspaceId: z.string({
      required_error: 'Workspace ID is required'
    })
  })
});

export const updateProjectSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    status: z.enum(['active', 'archived', 'deleted']).optional(),
    metadata: z.record(z.any()).optional()
  }),
  params: z.object({
    projectId: z.string({
      required_error: 'Project ID is required'
    })
  })
});

export const addMemberToProjectSchema = z.object({
  body: z.object({
    memberId: z.string({
      required_error: 'Member ID is required'
    }),
    role: z.enum(['admin', 'editor', 'viewer']).default('viewer')
  }),
  params: z.object({
    projectId: z.string({
      required_error: 'Project ID is required'
    })
  })
});

export default {
  createProjectSchema,
  updateProjectSchema,
  addMemberToProjectSchema
};