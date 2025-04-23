import express from 'express';
import {
  createProjectController,
  getProjectsUserIsMemberOfController,
  getProjectsByWorkspaceController,
  getProjectController,
  updateProjectController,
  addMemberToProjectController,
  getProjectFileTreeController,
  deleteProjectController,
  archiveProjectController,
  reactivateProjectController
} from '../../controllers/projectController.js';
import { isAuthenticated } from '../../middlewares/authMiddleware.js';
import {
  createProjectSchema,
  addMemberToProjectSchema,
  updateProjectSchema
} from '../../validators/projectSchema.js';
import { validate } from '../../validators/zodValidator.js';

const router = express.Router();

// Get all projects the authenticated user is a member of
router.get('/', isAuthenticated, getProjectsUserIsMemberOfController);

// Create a new project
router.post(
  '/',
  isAuthenticated,

  createProjectController
);

// Get projects within a workspace
router.get(
  '/workspace/:workspaceId',
  isAuthenticated,
  getProjectsByWorkspaceController
);

// Get project details by ID
router.get(
  '/:projectId',
  isAuthenticated,
  getProjectController
);

// Update project details
router.put(
  '/:projectId',
  isAuthenticated,
  validate(updateProjectSchema),
  updateProjectController
);

// Delete a project (soft delete)
router.delete(
  '/:projectId',
  isAuthenticated,
  deleteProjectController
);

// Archive a project
router.put(
  '/:projectId/archive',
  isAuthenticated,
  archiveProjectController
);

// Reactivate an archived project
router.put(
  '/:projectId/reactivate',
  isAuthenticated,
  reactivateProjectController
);

// Add a member to a project
router.put(
  '/:projectId/members',
  isAuthenticated,
  validate(addMemberToProjectSchema),
  addMemberToProjectController
);

// Get project file tree
router.get(
  '/:projectId/tree',
  isAuthenticated,
  getProjectFileTreeController
);

export default router;