import { Module } from "@nestjs/common";
import { CommentsController } from "./comments.controller";
import { CommentsService } from "./comments.service";
import { DatabaseModule } from "src/database/database.module";
import { commentsProviders } from "./comments.providers";

@Module({
  imports: [DatabaseModule],
  controllers: [CommentsController],
  providers: [CommentsService, ...commentsProviders],
  exports: [CommentsService],
})
export class CommentsModule {}
