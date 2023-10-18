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
    const chatroom = await this.chatrooms.createOne(params);
    return { msg: "Chatroom successfully created!", chatroom: chatroom };
  }

  async copy(_id: ObjectId, group: ObjectId) {
    const oldChatroom = await this.getChatroomById(_id);

    const chatroom = await this.chatrooms.createOne({
      messages: new Set(oldChatroom.messages),
      group: group,
    });
    return { msg: "Chatroom successfully copied!", chatroom: chatroom };
  }

  async update(_id: ObjectId, update: Partial<ChatroomDoc>) {
    await this.chatrooms.updateOne(_id, update);
    return { msg: "Chatroom successfully updated!" };
  }

  async delete(_id: ObjectId) {
    await this.chatrooms.deleteOne({ _id });
    return { msg: "Chatroom successfully deleted!" };
  }

  async addMessage(_id: ObjectId, message: ObjectId): Promise<{ msg: string }> {
    const chatroom = await this.getChatroomById(_id);
    await this.chatrooms.updateOne({ _id }, { messages: new Set([message, ...chatroom.messages]) });
    return { msg: "Chatroom updated successfully!" };
  }

  async removeMessage(_id: ObjectId, message: ObjectId): Promise<{ msg: string }> {
    const chatroom = await this.getChatroomById(_id);
    if (chatroom.messages.has(message)) {
      let otherMessages;
      [message, ...otherMessages] = chatroom.messages;
      await this.chatrooms.updateOne({ _id }, { messages: new Set(otherMessages) });
      return { msg: "Chatroom updated successfully!" };
    } else {
      throw new NotFoundError("Chatroom does not contain this message.");
    }
  }
}
