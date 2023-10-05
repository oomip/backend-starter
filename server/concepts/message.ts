import { Filter, ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";
import { BadValuesError, NotAllowedError, NotFoundError } from "./errors";

export interface MessageDoc extends BaseDoc {
  author: ObjectId;
  content: string;
  date: Date;
}

export default class MessageConcept {
  public readonly messages = new DocCollection<MessageDoc>("messages");

  async create(content: string, author: ObjectId) {
    if (!content) {
      throw new BadValuesError("Messages cannot be empty!");
    }
    const _id = await this.messages.createOne({ author, content, date: new Date() });
    return { msg: "Message successfully created!", message: await this.messages.readOne({ _id }) };
  }

  async getMessages(query: Filter<MessageDoc>) {
    const messages = await this.messages.readMany(query, {
      sort: { dateUpdated: -1 },
    });
    return messages;
  }

  async getMessageById(_id: ObjectId) {
    const messages = await this.messages.readOne({ _id });
    if (messages === null) {
      throw new NotFoundError("Message not found!");
    }
    return messages;
  }

  async getByAuthor(author: ObjectId) {
    return await this.getMessages({ author });
  }

  async update(_id: ObjectId, update: Partial<MessageDoc>, user: ObjectId) {
    await this.isAuthor(user, _id);
    this.sanitizeUpdate(update);
    await this.messages.updateOne({ _id }, update);
    return { msg: "Message successfully updated!" };
  }

  async delete(_id: ObjectId, user: ObjectId) {
    await this.isAuthor(user, _id);
    await this.messages.deleteOne({ _id });
    return { msg: "Message deleted successfully!" };
  }

  async isAuthor(user: ObjectId, _id: ObjectId) {
    const message = await this.messages.readOne({ _id });
    if (!message) {
      throw new NotFoundError(`Message ${_id} does not exist!`);
    }
    if (message.author.toString() !== user.toString()) {
      throw new MessageAuthorNotMatchError(user, _id);
    }
  }

  private sanitizeUpdate(update: Partial<MessageDoc>) {
    // Make sure the update cannot change the author or date.
    const allowedUpdates = ["content"];
    for (const key in update) {
      if (!allowedUpdates.includes(key)) {
        throw new NotAllowedError(`Cannot update '${key}' field!`);
      }
    }
  }
}

export class MessageAuthorNotMatchError extends NotAllowedError {
  constructor(
    public readonly author: ObjectId,
    public readonly _id: ObjectId,
  ) {
    super("{0} is not the author of message {1}!", author, _id);
  }
}
