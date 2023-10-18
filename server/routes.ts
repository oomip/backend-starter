import { ObjectId } from "mongodb";

import { Router, getExpressRouter } from "./framework/router";

import { Activity, Chatroom, Gathering, Group, Location, Message, Post, User, WebSession } from "./app";
import { ActivityDoc } from "./concepts/activity";
import { ChatroomDoc } from "./concepts/chatroom";
// import { FriendDoc } from "./concepts/friend";
import { NotAllowedError } from "./concepts/errors";
import { GatheringDoc } from "./concepts/gathering";
import { GroupDoc } from "./concepts/group";
import { LocationDoc } from "./concepts/location";
import { MessageDoc } from "./concepts/message";
import { PostDoc, PostOptions } from "./concepts/post";
import { UserDoc } from "./concepts/user";
import { WebSessionDoc } from "./concepts/websession";
import Responses from "./responses";

class Routes {
  @Router.get("/session")
  async getSessionUser(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await User.getUserById(user);
  }

  // Users CRUD
  @Router.get("/users")
  async getUsers() {
    return await User.getUsers();
  }

  @Router.get("/users/:username")
  async getUser(username: string) {
    return await User.getUserByUsername(username);
  }

  @Router.post("/users")
  async createUser(session: WebSessionDoc, username: string, password: string) {
    WebSession.isLoggedOut(session);
    return await User.create(username, password);
  }

  @Router.patch("/users")
  async updateUser(session: WebSessionDoc, update: Partial<UserDoc>) {
    const user = WebSession.getUser(session);
    return await User.update(user, update);
  }

  @Router.delete("/users")
  async deleteUser(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    WebSession.end(session);
    return await User.delete(user);
  }

  // WebSession
  @Router.post("/login")
  async logIn(session: WebSessionDoc, username: string, password: string) {
    const u = await User.authenticate(username, password);
    WebSession.start(session, u._id);
    return { msg: "Logged in!" };
  }

  @Router.post("/logout")
  async logOut(session: WebSessionDoc) {
    WebSession.end(session);
    return { msg: "Logged out!" };
  }

  // Posts CRUD
  @Router.get("/posts")
  async getPosts(author?: string) {
    let posts;
    if (author) {
      const id = (await User.getUserByUsername(author))._id;
      posts = await Post.getByAuthor(id);
    } else {
      posts = await Post.getPosts({});
    }
    return Responses.posts(posts);
  }

  @Router.post("/posts")
  async createPost(session: WebSessionDoc, content: string, options?: PostOptions) {
    const user = WebSession.getUser(session);
    const created = await Post.create(user, content, options);
    return { msg: created.msg, post: await Responses.post(created.post) };
  }

  @Router.patch("/posts/:_id")
  async updatePost(session: WebSessionDoc, _id: ObjectId, update: Partial<PostDoc>) {
    const user = WebSession.getUser(session);
    await Post.isAuthor(user, _id);
    return await Post.update(_id, update);
  }

  @Router.delete("/posts/:_id")
  async deletePost(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    await Post.isAuthor(user, _id);
    return Post.delete(_id);
  }

  // Locations CRUD
  @Router.get("/locations")
  async getLocations(coordinates: [longitude: number, latitude: number]) {
    return await Location.getLocations({ coordinates });
  }

  @Router.post("/locations")
  async createLocation(longitude: number, latitude: number) {
    const created = await Location.create(longitude, latitude);
    return { msg: "Location created.", location: created };
  }

  @Router.patch("/locations/:_id")
  async updateLocation(_id: ObjectId, update: Partial<LocationDoc>) {
    return await Location.update(_id, update);
  }

  @Router.delete("/locations/:_id")
  async deleteLocation(_id: ObjectId) {
    return Location.delete(_id);
  }

  @Router.get("/locations/:_id/nearby")
  async getNearbyLocations(_id: ObjectId, params: { distance: number }) {
    const meters = params.distance ?? null;
    return Location.getNearbyLocations(_id, meters);
  }

  // Groups CRUD
  @Router.get("/groups")
  async getGroups(query: Partial<GroupDoc>) {
    // query.members = { $elemMatch: { $eq: member } }
    return await Group.getGroups(query);
  }

  @Router.post("/groups")
  async createGroup(members: Set<ObjectId>) {
    return await Group.create(members);
  }

  @Router.patch("/groups/:_id")
  async updateGroup(_id: ObjectId, update: Partial<GroupDoc>) {
    return await Group.update(_id, update);
  }

  @Router.delete("/groups/:_id")
  async deleteGroup(_id: ObjectId) {
    return await Group.delete(_id);
  }

  // Activities CRUD
  @Router.get("/activities")
  async getActivities(query: Partial<ActivityDoc>) {
    return await Activity.getActivities(query);
  }

  @Router.post("/activities")
  async createActivity(attrs: ActivityDoc) {
    const location = await Location.getLocationbyId(attrs.location);
    const baseUrl = "https://api.sunrise-sunset.org/json";

    await fetch(
      baseUrl +
        new URLSearchParams({
          lat: location.coordinates[1].toString(),
          long: location.coordinates[0].toString(),
        }),
    )
      .then((response) => response.json())
      .then((response) => {
        if (response.status === "OK") {
          const sunsetTime = new Date(response.results.sunset);
          if (attrs.date.getUTCHours() + 1 > sunsetTime.getUTCHours() && attrs.date.getUTCMinutes() > sunsetTime.getUTCMinutes() && attrs.date.getUTCSeconds() > sunsetTime.getUTCSeconds()) {
            throw new NotAllowedError("Start time must be at least an hour before sunset!");
          }
        }
      });
    return await Activity.create(attrs);
  }

  @Router.patch("/activities/:_id")
  async updateActivity(_id: ObjectId, update: Partial<ActivityDoc>) {
    return await Activity.update(_id, update);
  }

  @Router.delete("/activities/:_id")
  async deleteActivity(_id: ObjectId) {
    return await Activity.delete(_id);
  }

  // Messages CRUD
  @Router.get("/messages")
  async getMessages(session: WebSessionDoc, query: Partial<MessageDoc>) {
    return await Message.getMessages(query);
  }

  @Router.post("/messages")
  async createMessage(session: WebSessionDoc, content: string) {
    const user = WebSession.getUser(session);
    return await Message.create(content, user);
  }

  @Router.patch("/messages/:_id")
  async updateMessage(session: WebSessionDoc, _id: ObjectId, update: Partial<MessageDoc>) {
    const user = WebSession.getUser(session);
    return await Message.update(_id, update, user);
  }

  @Router.delete("/messages/:_id")
  async deleteMessage(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    return await Message.delete(_id, user);
  }

  // Chatrooms CRUD
  @Router.get("/chatrooms")
  async getChatrooms(query: Partial<ChatroomDoc>) {
    return await Chatroom.getChatrooms(query);
  }

  @Router.post("/chatrooms")
  async createChatroom(attrs: ChatroomDoc) {
    return await Chatroom.create(attrs);
  }

  @Router.patch("/chatrooms/:_id")
  async updateChatroom(_id: ObjectId, update: Partial<ChatroomDoc>) {
    return await Chatroom.update(_id, update);
  }

  @Router.delete("/chatrooms/:_id")
  async deleteChatroom(_id: ObjectId) {
    return await Chatroom.delete(_id);
  }

  // Gatherings CRUD
  @Router.get("/gatherings")
  async getGatherings(query: Partial<GatheringDoc>) {
    return await Gathering.getGatherings(query);
  }

  @Router.post("/gatherings")
  async createGathering(attrs: GatheringDoc) {
    return await Gathering.create(attrs);
  }

  @Router.patch("/gatherings/:_id")
  async updateGathering(_id: ObjectId, update: Partial<GatheringDoc>) {
    return await Gathering.update(_id, update);
  }

  @Router.delete("/gatherings/:_id")
  async deleteGathering(_id: ObjectId) {
    return await Gathering.delete(_id);
  }

  @Router.post("gatherings/:_id/join")
  async joinGathering(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    const gathering = await Gathering.getGatheringbyId(_id);
    await Gathering.addMember(_id, user);
    for (const groupId of gathering.groups) {
      const group = await Group.getGroupById(groupId);
      if (group.members.size == 2) {
        // create group at 3 members
        const newGroup = (await Group.create(group.members)).group;
        if (newGroup !== null) {
          await Group.addMember(newGroup._id, user);
          await Gathering.addGroup(gathering._id, newGroup._id);
        }
      } else if (2 < group.members.size && group.members.size < 8) {
        await Group.addMember(group._id, user);
        await Gathering.addGroup(gathering._id, group._id);
      }
    }
  }

  @Router.post("gatherings/:_id/leave")
  async leaveGathering(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    return await Gathering.removeMember(_id, user);
  }

  // @Router.get("/friends")
  // async getFriends(session: WebSessionDoc) {
  //   const user = WebSession.getUser(session);
  //   return await User.idsToUsernames(await Friend.getFriends(user));
  // }

  // @Router.delete("/friends/:friend")
  // async removeFriend(session: WebSessionDoc, friend: string) {
  //   const user = WebSession.getUser(session);
  //   const friendId = (await User.getUserByUsername(friend))._id;
  //   return await Friend.removeFriend(user, friendId);
  // }

  // @Router.get("/friend/requests")
  // async getRequests(session: WebSessionDoc) {
  //   const user = WebSession.getUser(session);
  //   return await Responses.friendRequests(await Friend.getRequests(user));
  // }

  // @Router.post("/friend/requests/:to")
  // async sendFriendRequest(session: WebSessionDoc, to: string) {
  //   const user = WebSession.getUser(session);
  //   const toId = (await User.getUserByUsername(to))._id;
  //   return await Friend.sendRequest(user, toId);
  // }

  // @Router.delete("/friend/requests/:to")
  // async removeFriendRequest(session: WebSessionDoc, to: string) {
  //   const user = WebSession.getUser(session);
  //   const toId = (await User.getUserByUsername(to))._id;
  //   return await Friend.removeRequest(user, toId);
  // }

  // @Router.put("/friend/accept/:from")
  // async acceptFriendRequest(session: WebSessionDoc, from: string) {
  //   const user = WebSession.getUser(session);
  //   const fromId = (await User.getUserByUsername(from))._id;
  //   return await Friend.acceptRequest(fromId, user);
  // }

  // @Router.put("/friend/reject/:from")
  // async rejectFriendRequest(session: WebSessionDoc, from: string) {
  //   const user = WebSession.getUser(session);
  //   const fromId = (await User.getUserByUsername(from))._id;
  //   return await Friend.rejectRequest(fromId, user);
  // }
}

export default getExpressRouter(new Routes());
