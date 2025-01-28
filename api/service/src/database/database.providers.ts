import * as mongoose from "mongoose";

const mongoDbUri = process.env.MONGODB || "";

export const databaseProviders = [
  {
    provide: "DATABASE_CONNECTION",
    useFactory: (): Promise<typeof mongoose> => mongoose.connect(mongoDbUri),
  },
];
