import { Client, Account, Databases, ID } from 'appwrite';
import conf from '../conf/conf.js';

class AuthService {
    client = new Client();
    account;
    databases;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.account = new Account(this.client);
        this.databases = new Databases(this.client);
    }

    async createAccount({ email, password, name }) {
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name);
            if (userAccount) {
                // Add name to the user document
                await this.databases.createDocument(
                    conf.appwriteDatabaseId,
                    conf.appwriteCollectionId,
                    ID.unique(), // Generate a unique ID for the document
                    { name, email } // Ensure only valid attributes are included
                );
                return this.login({ email, password });
            } else {
                return userAccount;
            }
        } catch (error) {
            throw error;
        }
    }

    async login({ email, password }) {
        try {
            // Check if there is an active session
            const currentSession = await this.getCurrentSession();
            if (currentSession) {
                // Log out the current session before creating a new one
                await this.logout();
            }
            await this.account.createEmailPasswordSession(email, password);
            const user = await this.getCurrentUser();
            return user;
        } catch (error) {
            throw error;
        }
    }

    async getCurrentSession() {
        try {
            return await this.account.getSession('current');
        } catch (error) {
            console.log("Appwrite service :: getCurrentSession :: error", error);
            return null;
        }
    }

    async getCurrentUser() {
        try {
            const user = await this.account.get();
            const userDocument = await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                user.$id
            );
            return { ...user, name: userDocument.name, email: userDocument.email };
        } catch (error) {
            console.log("Appwrite service :: getCurrentUser :: error", error);
            return null;
        }
    }

    async logout() {
        try {
            await this.account.deleteSession('current');
        } catch (error) {
            console.log("Appwrite service :: logout :: error", error);
        }
    }
}

const authService = new AuthService();

export default authService;