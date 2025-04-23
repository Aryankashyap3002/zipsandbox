import { StatusCodes } from 'http-status-codes';

import {
    createProjectService,
    getProjectsUserIsMemberOfService,
    getProjectsByWorkspaceService,
    getProjectService,
    updateProjectService,
    addMemberToProjectService,
    getProjectFileTreeService,
    deleteProjectService,
    archiveProjectService,
    reactivateProjectService
} from '../services/projectService.js';
import {
    customErrorResponse,
    internalErrorResponse,
    successResponse
} from '../utils/common/responseObjects.js';

export const createProjectController = async (req, res) => {
    try {
        console.log("Project body ", req.body);
        const response = await createProjectService({
            ...req.body,
            createdBy: req.user
        });
        
        return res
            .status(StatusCodes.CREATED)
            .json(successResponse(response, 'Project created successfully'));
    } catch (error) {
        console.log('Create project controller error', error);
        if (error.statusCode) {
            return res.status(error.statusCode).json(customErrorResponse(error));
        }
        
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(internalErrorResponse(error));
    }
};

export const getProjectsUserIsMemberOfController = async (req, res) => {
    try {
        const response = await getProjectsUserIsMemberOfService(req.user);
        
        return res
            .status(StatusCodes.OK)
            .json(successResponse(response, 'Projects fetched successfully'));
    } catch (error) {
        console.log('Get projects user is member of controller error', error);
        if (error.statusCode) {
            return res.status(error.statusCode).json(customErrorResponse(error));
        }
        
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(internalErrorResponse(error));
    }
};

export const getProjectsByWorkspaceController = async (req, res) => {
    try {
        const response = await getProjectsByWorkspaceService(
            req.params.workspaceId,
            req.user
        );
        
        return res
            .status(StatusCodes.OK)
            .json(successResponse(response, 'Projects fetched successfully'));
    } catch (error) {
        console.log('Get projects by workspace controller error', error);
        if (error.statusCode) {
            return res.status(error.statusCode).json(customErrorResponse(error));
        }
        
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(internalErrorResponse(error));
    }
};

export const getProjectController = async (req, res) => {
    try {
        const response = await getProjectService(
            req.params.projectId,
            req.user
        );
        
        return res
            .status(StatusCodes.OK)
            .json(successResponse(response, 'Project fetched successfully'));
    } catch (error) {
        console.log('Get project controller error', error);
        if (error.statusCode) {
            return res.status(error.statusCode).json(customErrorResponse(error));
        }
        
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(internalErrorResponse(error));
    }
};

export const updateProjectController = async (req, res) => {
    try {
        const response = await updateProjectService(
            req.params.projectId,
            req.body,
            req.user
        );
        
        return res
            .status(StatusCodes.OK)
            .json(successResponse(response, 'Project updated successfully'));
    } catch (error) {
        console.log('Update project controller error', error);
        if (error.statusCode) {
            return res.status(error.statusCode).json(customErrorResponse(error));
        }
        
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(internalErrorResponse(error));
    }
};

export const addMemberToProjectController = async (req, res) => {
    try {
        const response = await addMemberToProjectService(
            req.params.projectId,
            req.body.memberId,
            req.body.role || 'viewer',
            req.user
        );
        
        return res
            .status(StatusCodes.OK)
            .json(successResponse(response, 'Member added to project successfully'));
    } catch (error) {
        console.log('Add member to project controller error', error);
        if (error.statusCode) {
            return res.status(error.statusCode).json(customErrorResponse(error));
        }
        
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(internalErrorResponse(error));
    }
};

export const getProjectFileTreeController = async (req, res) => {
    try {
        const response = await getProjectFileTreeService(
            req.params.projectId,
            req.user
        );
        
        return res
            .status(StatusCodes.OK)
            .json(successResponse(response, 'Project file tree fetched successfully'));
    } catch (error) {
        console.log('Get project file tree controller error', error);
        if (error.statusCode) {
            return res.status(error.statusCode).json(customErrorResponse(error));
        }
        
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(internalErrorResponse(error));
    }
};

export const deleteProjectController = async (req, res) => {
    try {
        const response = await deleteProjectService(
            req.params.projectId,
            req.user
        );
        
        return res
            .status(StatusCodes.OK)
            .json(successResponse(response, 'Project deleted successfully'));
    } catch (error) {
        console.log('Delete project controller error', error);
        if (error.statusCode) {
            return res.status(error.statusCode).json(customErrorResponse(error));
        }
        
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(internalErrorResponse(error));
    }
};

export const archiveProjectController = async (req, res) => {
    try {
        const response = await archiveProjectService(
            req.params.projectId,
            req.user
        );
        
        return res
            .status(StatusCodes.OK)
            .json(successResponse(response, 'Project archived successfully'));
    } catch (error) {
        console.log('Archive project controller error', error);
        if (error.statusCode) {
            return res.status(error.statusCode).json(customErrorResponse(error));
        }
        
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(internalErrorResponse(error));
    }
};

export const reactivateProjectController = async (req, res) => {
    try {
        const response = await reactivateProjectService(
            req.params.projectId,
            req.user
        );
        
        return res
            .status(StatusCodes.OK)
            .json(successResponse(response, 'Project reactivated successfully'));
    } catch (error) {
        console.log('Reactivate project controller error', error);
        if (error.statusCode) {
            return res.status(error.statusCode).json(customErrorResponse(error));
        }
        
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(internalErrorResponse(error));
    }
};