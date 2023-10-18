import { Filter, ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface GatheringDoc extends BaseDoc {
  name: string;
  members: Set<ObjectId>;
  groups: Set<ObjectId>;
  activity: ObjectId;
}

export default class GatheringConcept {
  public readonly gatherings = new DocCollection<GatheringDoc>("gatherings");

  async create(params: GatheringDoc) {
    const gathering = await this.gatherings.createOne(params);
    return { msg: "Gathering successfully created!", gathering: gathering };
  }

  async getGatherings(query: Filter<GatheringDoc>): Promise<GatheringDoc[]> {
    const gatherings = await this.gatherings.readMany(query);
    return gatherings;
  }

  async getGatheringbyId(_id: ObjectId): Promise<GatheringDoc> {
    const gathering = await this.gatherings.readOne({ _id });
    if (gathering === null) {
      throw new NotFoundError("Gathering not found!");
    }
    return gathering;
  }

  async getMembers(_id: ObjectId): Promise<Set<ObjectId>> {
    const gathering = await this.getGatheringbyId(_id);
    return gathering.members;
  }

  async getGatheringsOfMember(member: ObjectId): Promise<GatheringDoc[]> {
    const gatherings = await this.gatherings.readMany({ members: { $elemMatch: { $eq: member } } });
    return gatherings;
  }

  async update(_id: ObjectId, params: { name?: string; activity?: ObjectId; date?: Date }) {
    await this.getGatheringbyId(_id);
    await this.gatherings.updateOne({ _id }, params);
    return { msg: `Gathering successfully updated!` };
  }

  async addMember(_id: ObjectId, member: ObjectId) {
    const gathering = await this.getGatheringbyId(_id);
    if (gathering.members.has(member)) {
      throw new MemberAlreadyInGatheringError(member, gathering._id);
    }
    await this.gatherings.updateOne({ _id }, { members: gathering.members.add(member) });
    return { msg: `Member successfully added to Gathering!` };
  }

  async removeMember(_id: ObjectId, member: ObjectId) {
    const gathering = await this.getGatheringbyId(_id);
    if (!gathering.members.has(member)) {
      throw new NotFoundError("Member is not in gathering!");
    }
    await this.gatherings.updateOne({ _id }, { members: gathering.members.add(member) });
    return { msg: `Member successfully removed from Gathering!` };
  }

  async addGroup(_id: ObjectId, member: ObjectId) {
    const gathering = await this.getGatheringbyId(_id);
    if (gathering.members.has(member)) {
      throw new GroupAlreadyInGatheringError(member, gathering._id);
    }
    await this.gatherings.updateOne({ _id }, { members: gathering.members.add(member) });
    return { msg: `Group successfully added to Gathering!` };
  }

  async removeGroup(_id: ObjectId, member: ObjectId) {
    const gathering = await this.getGatheringbyId(_id);
    if (!gathering.members.has(member)) {
      throw new NotFoundError("Group is not in gathering!");
    }
    await this.gatherings.updateOne({ _id }, { members: gathering.members.add(member) });
    return { msg: `Group successfully removed from Gathering!` };
  }

  async delete(_id: ObjectId): Promise<{ msg: string }> {
    const gathering = await this.getGatheringbyId(_id);
    const name = gathering.name;
    await this.gatherings.deleteOne({ _id });
    return { msg: `Gathering '${name}' deleted!` };
  }
}

export class MemberAlreadyInGatheringError extends NotAllowedError {
  constructor(
    public readonly member: ObjectId,
    public readonly gathering: ObjectId,
  ) {
    super("Member {0} is already in {1}!", member, gathering);
  }
}

export class GroupAlreadyInGatheringError extends NotAllowedError {
  constructor(
    public readonly group: ObjectId,
    public readonly gathering: ObjectId,
  ) {
    super("Group {0} is already in {1}!", group, gathering);
  }
}
