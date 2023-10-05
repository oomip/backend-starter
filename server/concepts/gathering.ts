import { Filter, ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface GatheringDoc extends BaseDoc {
  name: string;
  members: Set<ObjectId>;
  groups: Set<ObjectId>;
  activity: ObjectId;
  date: Date;
}

export default class GatheringConcept {
  public readonly gatherings = new DocCollection<GatheringDoc>("gatherings");

  async create(params: GatheringDoc): Promise<void> {
    void this.gatherings.createOne(params);
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

  async update(_id: ObjectId, params: { name?: string; activity?: ObjectId; date?: Date }): Promise<void> {
    await this.getGatheringbyId(_id);
    void this.gatherings.updateOne({ _id }, params);
  }

  async addMember(_id: ObjectId, member: ObjectId): Promise<void> {
    const gathering = await this.getGatheringbyId(_id);
    if (gathering.members.has(member)) {
      throw new MemberAlreadyInGatheringError(member, gathering._id);
    }
    void this.gatherings.updateOne({ _id }, { members: gathering.members.add(member) });
  }

  async removeMember(_id: ObjectId, member: ObjectId): Promise<void> {
    const gathering = await this.getGatheringbyId(_id);
    if (!gathering.members.has(member)) {
      throw new NotFoundError("Member is not in gathering!");
    }
    void this.gatherings.updateOne({ _id }, { members: gathering.members.add(member) });
  }

  async assignGroups(_id: ObjectId, groups: ObjectId[]): Promise<void> {
    await this.getGatheringbyId(_id);
    void this.gatherings.updateOne({ _id }, { groups: new Set(groups) });
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
    super("Member {0} already in {1}!", member, gathering);
  }
}
