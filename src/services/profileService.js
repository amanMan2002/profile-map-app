import { Client, Databases, ID } from 'appwrite';
import conf from '../conf/conf.js';

class ProfileService {
    client = new Client();
    databases;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client);
    }

    async createProfile({ name, description, address }) {
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                ID.unique(),
                { name, description, address }
            );
        } catch (error) {
            console.log("Appwrite service :: createProfile :: error", error);
            throw error;
        }
    }

    async updateProfile(profileId, { name, description, address }) {
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                profileId,
                { name, description, address }
            );
        } catch (error) {
            console.log("Appwrite service :: updateProfile :: error", error);
            throw error;
        }
    }

    async deleteProfile(profileId) {
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                profileId
            );
            return true;
        } catch (error) {
            console.log("Appwrite service :: deleteProfile :: error", error);
            throw error;
        }
    }

    async getProfiles() {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId
            );
        } catch (error) {
            console.log("Appwrite service :: getProfiles :: error", error);
            throw error;
        }
    }
}

const profileService = new ProfileService();

export default profileService;