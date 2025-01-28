import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";

@Injectable()
export class SchedulerService {
  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleHealthCheck() {
    try {
      await fetch(
        process.env.HEALTH_CHECK_URL ? process.env.HEALTH_CHECK_URL : "",
      );
    } catch (error) {
      console.error("Error while performing health check:", error);
    }
  }
}
