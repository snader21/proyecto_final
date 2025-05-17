import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

import { Injectable } from '@nestjs/common';

import { BigQuery, BigQueryOptions } from '@google-cloud/bigquery';
import { GCPConfigService } from './gcp-config.service';

@Injectable()
export class BigQueryService {
  constructor(private readonly gcpConfigService: GCPConfigService) {}

  getDataWarehouse(): BigQuery {
    const options: BigQueryOptions = this.gcpConfigService.getCredentials();
    return new BigQuery(options);
  }

  async loadData(
    jsonData: any,
    datasetId: string,
    tableId: string,
  ): Promise<boolean> {
    const dataset = this.getDataWarehouse().dataset(datasetId);
    const table = dataset.table(tableId);
    await table.getMetadata();
    const [exists] = await table.exists();
    console.log(`Table exists at ${new Date()}: ${exists}`);

    const ndjson = jsonData.map((row: any) => JSON.stringify(row)).join('\n');

    const tempFilePath = path.join(
      os.tmpdir(),
      `temp-data-${Date.now()}.ndjson`,
    );
    fs.writeFileSync(tempFilePath, ndjson);

    const metadata = {
      sourceFormat: 'NEWLINE_DELIMITED_JSON',
      writeDisposition: 'WRITE_TRUNCATE',
    };

    let success = false;

    try {
      const [job] = await table.load(tempFilePath, metadata);

      if (job?.status?.errors) {
        console.error(`Load job completed with errors:`, job.status.errors);
      } else if (job?.status?.state === 'DONE') {
        success = true;
      } else {
        console.warn(`Job completed but not in a DONE state.`);
      }
    } catch (error) {
      console.error(`Error loading data:`, error);
    } finally {
      try {
        fs.unlinkSync(tempFilePath);
      } catch (unlinkError) {
        console.error(`Error deleting temp file:`, unlinkError);
      }
    }

    return success;
  }
}
