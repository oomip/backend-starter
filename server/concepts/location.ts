import { Filter, ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { BadValuesError, NotFoundError } from "./errors";

// GeoJSON from https://www.mongodb.com/docs/manual/reference/geojson/#std-label-geojson-point
export interface LocationDoc extends BaseDoc {
  type: string;
  coordinates: [longitude: number, latitude: number];
}

export default class LocationConcept {
  public readonly locations = new DocCollection<LocationDoc>("locations");

  async create(longitude: number, latitude: number): Promise<void> {
    await this.canCreate(longitude, latitude);
    if (await this.exists(longitude, latitude)) {
      await this.locations.createOne({ type: "Point", coordinates: [latitude, longitude] });
    }
  }

  async getLocations(query: Filter<LocationDoc>): Promise<LocationDoc[]> {
    const locations = await this.locations.readMany(query);
    return locations;
  }

  async getLocationbyId(_id: ObjectId): Promise<LocationDoc> {
    const location = await this.locations.readOne({ _id });
    if (location === null) {
      throw new NotFoundError("Location not found!");
    }
    return location;
  }

  async getNearbyLocations(_id: ObjectId, meters: number = 800): Promise<LocationDoc[]> {
    const location = await this.getLocationbyId(_id);
    const locations = await this.getLocations({
      // https://www.mongodb.com/docs/manual/reference/operator/query/nearSphere/#mongodb-query-op.-nearSphere
      $nearSphere: {
        $geometry: {
          type: "Point",
          coordinates: location.coordinates,
        },
        $minDistance: 0,
        $maxDistance: meters,
      },
    });
    return locations;
  }

  async update(_id: ObjectId, update: Partial<LocationDoc>): Promise<{ msg: string }> {
    await this.getLocationbyId(_id);
    await this.locations.updateOne({ _id }, update);
    return { msg: `Location updated!` };
  }

  async delete(_id: ObjectId): Promise<{ msg: string }> {
    await this.getLocationbyId(_id);
    await this.locations.deleteOne({ _id });
    return { msg: `Location deleted!` };
  }

  private async exists(longitude: number, latitude: number): Promise<Boolean> {
    return (await this.getLocations({ longitude, latitude })).length > 0;
  }

  private async canCreate(longitude: number, latitude: number) {
    if (longitude < -180 || longitude > 180) {
      throw new BadValuesError("Longitude must be between -180 and 180, both inclusive.");
    }
    if (latitude < -90 || latitude > 90) {
      throw new BadValuesError("Latitude must be between -90 and 90, both inclusive.");
    }
  }
}
