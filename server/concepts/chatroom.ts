import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotFoundError } from "./errors";

export interface ChatroomDoc extends BaseDoc {
  group: ObjectId;
  messages: Set<ObjectId>;
}

export default class ChatroomConcept {
  public readonly chatrooms = new DocCollection<ChatroomDoc>("chatrooms");

  async getChatrooms(query: Partial<ChatroomDoc>) {
    const chatrooms = await this.chatrooms.readMany({ query });
    return chatrooms;
  }

  async getChatroomById(_id: ObjectId) {
    const chatroom = await this.chatrooms.readOne({ _id });
    if (chatroom === null) {
      throw new NotFoundError(`Chatroom not found!`);
    }
    return chatroom;
  }

  async create(params: ChatroomDoc) {
    void this.chatrooms.createOne(params);
  }

  async update(_id: ObjectId, update: Partial<ChatroomDoc>) {
    void this.chatrooms.updateOne(_id, update);
  }

  async delete(_id: ObjectId) {
    void this.chatrooms.deleteOne({ _id });
  }
}
