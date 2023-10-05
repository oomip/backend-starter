import ActivityConcept from "./concepts/activity";
import ChatroomConcept from "./concepts/chatroom";
import FriendConcept from "./concepts/friend";
import GatheringConcept from "./concepts/gathering";
import GroupConcept from "./concepts/group";
import LocationConcept from "./concepts/location";
import MessageConcept from "./concepts/message";
import PostConcept from "./concepts/post";
import UserConcept from "./concepts/user";
import WebSessionConcept from "./concepts/websession";

// App Definition using concepts
export const Activity = new ActivityConcept();
export const Chatroom = new ChatroomConcept();
export const Friend = new FriendConcept();
export const Gathering = new GatheringConcept();
export const Group = new GroupConcept();
export const Location = new LocationConcept();
export const Message = new MessageConcept();
export const Post = new PostConcept();
export const User = new UserConcept();
export const WebSession = new WebSessionConcept();
