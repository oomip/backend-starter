import { Filter, ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { BadValuesError, NotFoundError } from "./errors";

export interface ActivityDoc extends BaseDoc {
  name: string;
  description: string;
  location: ObjectId;
}

export default class ActivityConcept {
  public readonly activities = new DocCollection<ActivityDoc>("activities");

  async create(params: ActivityDoc): Promise<void> {
    await this.canCreate(params);
    void this.activities.createOne(params);
  }

  async getActivities(query: Filter<ActivityDoc>): Promise<ActivityDoc[]> {
    const activities = await this.activities.readMany(query);
    return activities;
  }

  async getActivitybyId(_id: ObjectId): Promise<ActivityDoc> {
    const activity = await this.activities.readOne({ _id });
    if (activity === null) {
      throw new NotFoundError("Activity not found!");
    }
    return activity;
  }

  async update(_id: ObjectId, update: Partial<ActivityDoc>): Promise<void> {
    await this.getActivitybyId(_id);
    void this.activities.updateOne({ _id }, update);
  }

  async delete(_id: ObjectId): Promise<{ msg: string }> {
    const activity = await this.getActivitybyId(_id);
    const name = activity.name;
    await this.activities.deleteOne({ _id });
    return { msg: `Activity '${name}' deleted!` };
  }

  private async canCreate(params: ActivityDoc) {
    const duplicate = await this.getActivities(params);
    if (duplicate) {
      throw new BadValuesError("This activity already exists!");
    }
  }
}
