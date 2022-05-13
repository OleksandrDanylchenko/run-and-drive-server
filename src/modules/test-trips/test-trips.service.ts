import { mkdirSync } from 'fs';
import { readdir, readFile } from 'fs/promises';

import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import { GetTestTripSummaryDto } from '@test-trips/dto/get-test-trip-summary.dto';
import { GetTestTripDto } from '@test-trips/dto/get-test-trip.dto';
import { TestTripFixture } from '@test-trips/types';

@Injectable()
export class TestTripsService {
  private logger = new Logger('TestTripsService');

  public readonly fixturesPath = `${process.cwd()}/src/fixtures`;

  constructor() {
    mkdirSync(this.fixturesPath, { recursive: true });
  }

  async findAll(): Promise<GetTestTripSummaryDto[]> {
    const fixturesFilenames = await readdir(this.fixturesPath);
    const fixturesFiles = await Promise.all(
      fixturesFilenames.map((filename) =>
        readFile(`${this.fixturesPath}/${filename}`),
      ),
    );
    const fixtures = fixturesFiles.map((file) =>
      JSON.parse(file.toString()),
    ) as TestTripFixture[];
    return fixtures.map((fixture) => {
      const { id, name, totalDistance, locations } = fixture;
      const startLocation = locations[0];
      const endLocation = locations[locations.length - 1];
      return {
        id,
        name,
        totalDistance,
        startLocation,
        endLocation,
      };
    });
  }

  async findOne(tripId: string): Promise<GetTestTripDto> {
    try {
      const fixtureFile = await readFile(`${this.fixturesPath}/${tripId}.json`);
      return JSON.parse(fixtureFile.toString()) as TestTripFixture;
    } catch (error) {
      this.logger.error(error);
      throw new NotFoundException(
        `No fixture was found for the trip ${tripId}`,
      );
    }
  }
}
