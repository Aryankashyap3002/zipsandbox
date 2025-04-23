import { StatusCodes } from 'http-status-codes';

import User from '../schema/user.js';
import Project from '../schema/project.js';
import Workspace from '../schema/workspace.js';
import ClientError from '../utils/errors/clientError.js';
import crudRepository from './crudRepository.js';

const projectRepository = {
    ...crudRepository(Project),
    
    getProjectDetailsById: async function (projectId) {
        const project = await Project.findById(projectId)
            .populate('members.memberId', 'username email avatar')
            .populate('workspaceId')
            .populate('createdBy', 'username email avatar');

        return project;
    },
    
    getProjectByProjectId: async function (projectId) {
        const project = await Project.findOne({ projectId });

        if (!project) {
            throw new ClientError({
                explanation: 'Invalid data sent from the client',
                message: 'Project not found',
                statusCode: StatusCodes.NOT_FOUND
            });
        }

        return project;
    },
    
    addMemberToProject: async function (projectId, memberId, role) {
        const project = await Project.findById(projectId);

        if (!project) {
            throw new ClientError({
                explanation: 'Invalid data sent from the client',
                message: 'Project not found',
                statusCode: StatusCodes.NOT_FOUND
            });
        }

        const isValidUser = await User.findById(memberId);
        if (!isValidUser) {
            throw new ClientError({
                explanation: 'Invalid data sent from the client',
                message: 'User not found',
                statusCode: StatusCodes.NOT_FOUND
            });
        }

        const isMemberAlreadyPartOfProject = project.members.find(
            (member) => member.memberId.toString() === memberId.toString()
        );

        if (isMemberAlreadyPartOfProject) {
            throw new ClientError({
                explanation: 'Invalid data sent from the client',
                message: 'User already part of project',
                statusCode: StatusCodes.FORBIDDEN
            });
        }

        project.members.push({
            memberId,
            role
        });

        project.lastModified = new Date();
        await project.save();

        return project;
    },
    
    fetchAllProjectsByMemberId: async function (memberId) {
        const projects = await Project.find({
            'members.memberId': memberId,
            status: { $ne: 'deleted' }
        })
        .populate('members.memberId', 'username email avatar')
        .populate('workspaceId', 'name')
        .populate('createdBy', 'username email avatar');

        return projects;
    },
    
    fetchProjectsByWorkspaceId: async function (workspaceId) {
        const projects = await Project.find({
            workspaceId: workspaceId,
            status: { $ne: 'deleted' }
        })
        .populate('members.memberId', 'username email avatar')
        .populate('createdBy', 'username email avatar');

        return projects;
    },
    
    softDeleteProject: async function (projectId) {
        const project = await Project.findByIdAndUpdate(
            projectId,
            { status: 'deleted', lastModified: new Date() },
            { new: true }
        );
        
        return project;
    },
    
    archiveProject: async function (projectId) {
        const project = await Project.findByIdAndUpdate(
            projectId,
            { status: 'archived', lastModified: new Date() },
            { new: true }
        );
        
        return project;
    },
    
    reactivateProject: async function (projectId) {
        const project = await Project.findByIdAndUpdate(
            projectId,
            { status: 'active', lastModified: new Date() },
            { new: true }
        );
        
        return project;
    },
    
    updateProjectMetadata: async function (projectId, metadata) {
        const project = await Project.findByIdAndUpdate(
            projectId,
            { 
                $set: { 'metadata': metadata },
                lastModified: new Date()
            },
            { new: true }
        );
        
        return project;
    }
};

export default projectRepository;