import { StatusCodes } from 'http-status-codes';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';
import directoryTree from 'directory-tree';

import projectRepository from '../repositories/projectRepository.js';
import workspaceRepository from '../repositories/workspaceRepository.js';
import userRepository from '../repositories/userRepository.js';
import { execPromisified } from '../utils/execUtility.js';
import ClientError from '../utils/errors/clientError.js';
import ValidationError from '../utils/errors/validationError.js';
import { addEmailtoMailQueue } from '../producers/mailQueueProducer.js';

const isUserAdminOfProject = (project, userId) => {
    const response = project.members.find(
        (member) =>
            (member.memberId.toString() === userId ||
            member.memberId._id.toString() === userId) &&
            member.role === 'admin'
    );
    return response;
};

export const isUserMemberOfProject = (project, userId) => {
    return project.members.find((member) => {
        return member.memberId._id.toString() === userId;
    });
};

export const createProjectService = async (projectData) => {
    try {
        // Check if workspace exists and user is a member
        const workspace = await workspaceRepository.getById(projectData.workspaceId);
        if (!workspace) {
            throw new ClientError({
                explanation: 'Invalid data sent from the client',
                message: 'Workspace not found',
                statusCode: StatusCodes.NOT_FOUND
            });
        }3
        
        // Generate unique project ID for file system
        const projectId = uuidv4();
        // Create project directory
        const projectPath = `./projects/${projectId}`;
        await fs.mkdir(projectPath, { recursive: true });
        
        // Create React project using Vite
        const projectName = projectData.name.toLowerCase().replace(/\s+/g, '-');
        const REACT_PROJECT_COMMAND = `npm create vite@latest ${projectName} -- --template react`;
        
        await execPromisified(REACT_PROJECT_COMMAND, {
            cwd: projectPath
        });
        
        // Store project metadata
        await fs.writeFile(
            path.join(projectPath, 'project-meta.json'),
            JSON.stringify({
                id: projectId,
                name: projectData.name,
                createdAt: new Date().toISOString(),
                createdBy: projectData.createdBy
            })
        );
        
        // Create entry in database
        const project = await projectRepository.create({
            name: projectData.name,
            createdBy: projectData.createdBy,
            workspaceId: projectData.workspaceId,
            projectId: projectId,
            projectPath: projectPath,
            members: [
                {
                    memberId: projectData.createdBy,
                    role: 'admin'
                }
            ]
        });
        
        return project;
    } catch (error) {
        console.log('Create project service error', error);
        if (error.name === 'ValidationError') {
            throw new ValidationError(
                {
                    error: error.errors
                },
                error.message
            );
        }
        throw error;
    }
};

export const getProjectsUserIsMemberOfService = async (userId) => {
    try {
        const response = await projectRepository.fetchAllProjectsByMemberId(userId);
        return response;
    } catch (error) {
        console.log('Get projects user is member of service error', error);
        throw error;
    }
};

export const getProjectsByWorkspaceService = async (workspaceId, userId) => {
    try {
        // Check if user is a member of the workspace
        const workspace = await workspaceRepository.getById(workspaceId);
        if (!workspace) {
            throw new ClientError({
                explanation: 'Invalid data sent from the client',
                message: 'Workspace not found',
                statusCode: StatusCodes.NOT_FOUND
            });
        }
        
        const response = await projectRepository.fetchProjectsByWorkspaceId(workspaceId);
        return response;
    } catch (error) {
        console.log('Get projects by workspace service error', error);
        throw error;
    }
};

export const getProjectService = async (projectId, userId) => {
    try {
        const project = await projectRepository.getProjectDetailsById(projectId);
        if (!project) {
            throw new ClientError({
                explanation: 'Invalid data sent from the client',
                message: 'Project not found',
                statusCode: StatusCodes.NOT_FOUND
            });
        }
        
        const isMember = isUserMemberOfProject(project, userId);
        if (!isMember) {
            throw new ClientError({
                explanation: 'User is not a member of the project',
                message: 'User is not a member of the project',
                statusCode: StatusCodes.UNAUTHORIZED
            });
        }
        
        return project;
    } catch (error) {
        console.log('Get project service error', error);
        throw error;
    }
};

export const updateProjectService = async (projectId, projectData, userId) => {
    try {
        const project = await projectRepository.getById(projectId);
        if (!project) {
            throw new ClientError({
                explanation: 'Invalid data sent from the client',
                message: 'Project not found',
                statusCode: StatusCodes.NOT_FOUND
            });
        }
        
        const isAdmin = isUserAdminOfProject(project, userId);
        if (!isAdmin) {
            throw new ClientError({
                explanation: 'User is not an admin of the project',
                message: 'User is not an admin of the project',
                statusCode: StatusCodes.UNAUTHORIZED
            });
        }
        
        const updatedProject = await projectRepository.update(projectId, {
            ...projectData,
            lastModified: new Date()
        });
        
        return updatedProject;
    } catch (error) {
        console.log('Update project service error', error);
        throw error;
    }
};

export const addMemberToProjectService = async (projectId, memberId, role, userId) => {
    try {
        const project = await projectRepository.getById(projectId);
        if (!project) {
            throw new ClientError({
                explanation: 'Invalid data sent from the client',
                message: 'Project not found',
                statusCode: StatusCodes.NOT_FOUND
            });
        }
        
        const isAdmin = isUserAdminOfProject(project, userId);
        if (!isAdmin) {
            throw new ClientError({
                explanation: 'User is not an admin of the project',
                message: 'User is not an admin of the project',
                statusCode: StatusCodes.UNAUTHORIZED
            });
        }
        
        const isValidUser = await userRepository.getById(memberId);
        if (!isValidUser) {
            throw new ClientError({
                explanation: 'Invalid data sent from the client',
                message: 'User not found',
                statusCode: StatusCodes.NOT_FOUND
            });
        }
        
        const isMember = project.members.find(member => 
            member.memberId.toString() === memberId.toString()
        );
        
        if (isMember) {
            throw new ClientError({
                explanation: 'User is already a member of the project',
                message: 'User is already a member of the project',
                statusCode: StatusCodes.UNAUTHORIZED
            });
        }
        
        const response = await projectRepository.addMemberToProject(projectId, memberId, role);
        
        // Send email notification
        const projectInviteEmail = {
            subject: `You've been invited to join ${project.name}`,
            text: `You have been invited to join the project ${project.name} with ${role} access.`,
            html: `<p>You have been invited to join the project <strong>${project.name}</strong> with <strong>${role}</strong> access.</p>`
        };
        
        addEmailtoMailQueue({
            ...projectInviteEmail,
            to: isValidUser.email
        });
        
        return response;
    } catch (error) {
        console.log('Add member to project service error', error);
        throw error;
    }
};

export const getProjectFileTreeService = async (projectId, userId) => {
    try {
        const project = await projectRepository.getProjectByProjectId(projectId);
        if (!project) {
            throw new ClientError({
                explanation: 'Invalid data sent from the client',
                message: 'Project not found',
                statusCode: StatusCodes.NOT_FOUND
            });
        }
        
        const isMember = project.members.find(member => 
            member.memberId.toString() === userId
        );
        
        if (!isMember) {
            throw new ClientError({
                explanation: 'User is not a member of the project',
                message: 'User is not a member of the project',
                statusCode: StatusCodes.UNAUTHORIZED
            });
        }
        
        const projectPath = path.resolve(project.projectPath);
        const tree = directoryTree(projectPath, {
            exclude: /node_modules|\.git/
        });
        
        return tree;
    } catch (error) {
        console.log('Get project file tree service error', error);
        throw error;
    }
};

export const deleteProjectService = async (projectId, userId) => {
    try {
        const project = await projectRepository.getById(projectId);
        if (!project) {
            throw new ClientError({
                explanation: 'Invalid data sent from the client',
                message: 'Project not found',
                statusCode: StatusCodes.NOT_FOUND
            });
        }
        
        const isAdmin = isUserAdminOfProject(project, userId);
        if (!isAdmin) {
            throw new ClientError({
                explanation: 'User is not an admin of the project',
                message: 'User is not an admin of the project',
                statusCode: StatusCodes.UNAUTHORIZED
            });
        }
        
        // Soft delete project in database
        const response = await projectRepository.softDeleteProject(projectId);
        
        return response;
    } catch (error) {
        console.log('Delete project service error', error);
        throw error;
    }
};

export const archiveProjectService = async (projectId, userId) => {
    try {
        const project = await projectRepository.getById(projectId);
        if (!project) {
            throw new ClientError({
                explanation: 'Invalid data sent from the client',
                message: 'Project not found',
                statusCode: StatusCodes.NOT_FOUND
            });
        }
        
        const isAdmin = isUserAdminOfProject(project, userId);
        if (!isAdmin) {
            throw new ClientError({
                explanation: 'User is not an admin of the project',
                message: 'User is not an admin of the project',
                statusCode: StatusCodes.UNAUTHORIZED
            });
        }
        
        const response = await projectRepository.archiveProject(projectId);
        
        return response;
    } catch (error) {
        console.log('Archive project service error', error);
        throw error;
    }
};

export const reactivateProjectService = async (projectId, userId) => {
    try {
        const project = await projectRepository.getById(projectId);
        if (!project) {
            throw new ClientError({
                explanation: 'Invalid data sent from the client',
                message: 'Project not found',
                statusCode: StatusCodes.NOT_FOUND
            });
        }
        
        const isAdmin = isUserAdminOfProject(project, userId);
        if (!isAdmin) {
            throw new ClientError({
                explanation: 'User is not an admin of the project',
                message: 'User is not an admin of the project',
                statusCode: StatusCodes.UNAUTHORIZED
            });
        }
        
        const response = await projectRepository.reactivateProject(projectId);
        
        return response;
    } catch (error) {
        console.log('Reactivate project service error', error);
        throw error;
    }
};