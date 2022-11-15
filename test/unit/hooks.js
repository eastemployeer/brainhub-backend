import mongoose from "mongoose";

export const mochaHooks = {
    afterAll: async function() {
      await mongoose.connect(process.env.TEST_DATABASE);
      await mongoose.connection.db.dropDatabase();
      await mongoose.connection.close();      
    }
  };