import { Filter, ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { BadValuesError, NotFoundError } from "./errors";

export interface GroupDoc extends BaseDoc {
  members: Set<ObjectId>;
}

export default class GroupConcept {
  public readonly groups = new DocCollection<GroupDoc>("groups");

  async create(members: Set<ObjectId>): Promise<{ msg: string; group: GroupDoc | null }> {
    await this.canCreate(members);
    const _id = await this.groups.createOne({ members });
    return { msg: "Group created successfully!", group: await this.groups.readOne({ _id }) };
  }

  async getGroups(query: Filter<GroupDoc>): Promise<GroupDoc[]> {
    const groups = await this.groups.readMany(query, {
      sort: { dateUpdated: -1 },
    });
    return groups;
  }

  async getGroupById(_id: ObjectId): Promise<GroupDoc> {
    const group = await this.groups.readOne({ _id });
    if (group === null) {
      throw new NotFoundError(`Group not found!`);
    }
    return group;
  }

  async getGroupsOfMember(member: ObjectId): Promise<GroupDoc[]> {
    const groups = await this.getGroups({ member: member });
    const groupsOfMember = groups.filter((group) => group.members.has(member));
    return groupsOfMember;
  }

  async getMembers(_id: ObjectId): Promise<Set<ObjectId>> {
    const group = await this.getGroupById(_id);
    const members = group.members;
    return members;
  }

  async update(_id: ObjectId, update: Partial<GroupDoc>): Promise<{ msg: string }> {
    await this.getGroupById(_id);
    await this.groups.updateOne({ _id }, update);
    return { msg: "Group updated successfully!" };
  }

  async delete(_id: ObjectId): Promise<{ msg: string }> {
    await this.groups.deleteOne({ _id });
    return { msg: "Group deleted!" };
  }

  async groupExists(_id: ObjectId): Promise<void> {
    const maybeGroup = await this.groups.readOne({ _id });
    if (maybeGroup === null) {
      throw new NotFoundError(`Group not found!`);
    }
  }

  private async canCreate(members: Set<ObjectId>): Promise<void> {
    if (members.size == 0) {
      throw new BadValuesError("Members must be non-empty!");
    }
  }
}
