import { Client, Account, ID, Avatars, Databases } from "appwrite";
import conf from "../conf/conf";
import { setError } from "../store/errorSlice";
import store from "../store/store";

export class AuthService {
  client = new Client();
  account;
  avatars;
  databases;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    this.account = new Account(this.client);
    this.avatars = new Avatars(this.client);
    this.databases = new Databases(this.client);
  }

  // To create user account in appwrite.
  async createAccount({ email, password, name, username }) {
    try {
      const userAccount = await this.account.create(
        ID.unique(),
        email,
        password,
        name
      );
      if (!userAccount) throw Error;

      await this.login({ email, password });

      const avatarUrl = this.avatars.getInitials(name);

      return await this.userToDB({
        name: userAccount.name,
        accountId: userAccount.$id,
        username: username,
        email: userAccount.email,
        imageUrl: avatarUrl,
      });
    } catch (error) {
      store.dispatch(setError(error.message));
      console.log(error);
    }
  }

  // To create user in appwrite.
  async userToDB({ name, accountId, username, email, imageUrl }) {
    try {
      const newUser = await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteUsersCollectionId,
        username,
        {
          name,
          accountId,
          username,
          email,
          imageUrl,
          following: [],
          followers: [],
        }
      );

      return newUser;
    } catch (error) {
      console.log("appwrite service :: userToDB :: error: ", error);
    }
  }

  // To login the user.
  async login({ email, password }) {
    try {
      return await this.account.createEmailPasswordSession(email, password);
    } catch (error) {
      console.log("appwrite service :: login :: error: ", error);
    }
  }

  // To update following and followers in appwrite.
  async updateAppwriteFollowingFollowers(currentUserId, targetUserId) {
    try {
      const [currentUser, targetUser] = await Promise.all([
        this.databases.getDocument(
          conf.appwriteDatabaseId,
          conf.appwriteUsersCollectionId,
          currentUserId
        ),
        this.databases.getDocument(
          conf.appwriteDatabaseId,
          conf.appwriteUsersCollectionId,
          targetUserId
        ),
      ]);
      const updatedFollowing = currentUser?.following.includes(targetUserId)
        ? currentUser?.following?.filter(
            (targetId) => targetId !== targetUserId
          )
        : [...currentUser?.following, targetUserId];

      const updatedFollowers = targetUser?.followers.includes(currentUserId)
        ? targetUser?.followers?.filter(
            (currentId) => currentId !== currentUserId
          )
        : [...targetUser?.followers, currentUserId];

      const [updatedCurrentUserDoc, updatedTargetUserDoc] = await Promise.all([
        this.databases.updateDocument(
          conf.appwriteDatabaseId,
          conf.appwriteUsersCollectionId,
          currentUserId,
          { following: updatedFollowing }
        ),
        this.databases.updateDocument(
          conf.appwriteDatabaseId,
          conf.appwriteUsersCollectionId,
          targetUserId,
          { followers: updatedFollowers }
        ),
      ]);

      console.log("Updated following and followers successfully.");

      return updatedTargetUserDoc;
    } catch (error) {
      console.log(
        "appwrite service :: updateAppwriteFollowingFollowers :: error: ",
        error
      );
    }
  }

  // To get single user date from appwrite.
  async getUserData() {
    try {
      return await this.account.get();
    } catch (error) {
      console.log("appwrite service :: getUserData :: error: ", error);
    }
    return null;
  }

  // To get single user date from user collection from appwrite.
  async getUserDataFromDB(id) {
    try {
      const userData = await this.databases.getDocument(
        conf.appwriteDatabaseId,
        conf.appwriteUsersCollectionId,
        id
      );
      return userData;
    } catch (error) {
      console.log("appwrite service :: getUserDataFromDB :: error: ", error);
      return false;
    }
  }

  // To get All users from the user collection from appwrite.
  async getUsersDataFromDB() {
    try {
      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteUsersCollectionId
      );
    } catch (error) {
      console.log("appwrite service :: getUsersDataFromDB :: error: ", error);
      return false;
    }
  }

  // To logout the user
  async logout() {
    try {
      return await this.account.deleteSessions();
    } catch (error) {
      console.log("appwrite service :: logout :: error: ", error);
    }
  }
}

const authService = new AuthService();

export default authService;
