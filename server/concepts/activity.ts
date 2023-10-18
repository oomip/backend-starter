import { Filter, ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { BadValuesError, NotFoundError } from "./errors";

export interface ActivityDoc extends BaseDoc {
  name: string;
  description: string;
  location: ObjectId;
  date: Date;
}

export default class ActivityConcept {
  public readonly activities = new DocCollection<ActivityDoc>("activities");

  async create(params: ActivityDoc): Promise<{ msg: string; activity: ObjectId }> {
    await this.canCreate(params);
    const activity = await this.activities.createOne(params);
    return { msg: "Activity successfully created!", activity: activity };
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
