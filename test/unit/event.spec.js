import 'dotenv/config';
import app from '../../src/app';
import request from 'supertest';
import assert from 'assert';
import mongoose from 'mongoose';
import { expect } from 'chai';

process.env.TEST_DATABASE = 'mongodb://localhost:27017/MochaTestDB'
process.env.TEST_PORT= 8001

const event1 = {
  firstName: "John",
  lastName: "Brook",
  email: "example@gmail.com",
  date: new Date('2022-11-12').toISOString()
}

const event2 = {
  firstName: "John",
  lastName: "Brook",
  email: "example@gmail.com",
  date: "definitelyNotDate"
}

const event3 = {
  firstName: "John",
  email: "example1@gmail.com",
  date: new Date('2022-11-12').toISOString()
}

const event4 = {
  firstName: "John",
  lastName: "Brook",
  email: "example.com",
  date: new Date('2022-11-12').toISOString()
}

const server = app.listen(process.env.TEST_PORT, () => {
  console.log(`App running on port ${process.env.TEST_PORT}...`);
})

beforeEach(async () => {
  await mongoose.connect(process.env.TEST_DATABASE);
});

afterEach(async () => {
  await mongoose.connection.close();
});

describe("POST /api/v1/events", function() {
  it("should create new event",  async function() {
    let res = await request(server).post("/api/v1/events").send(event1);

    expect(res.body.data._id).to.be.string;
    delete res.body.data._id;

    assert.equal(res.statusCode, 201)
    assert.deepEqual(res.body.data, event1)
  })
})

describe("Error handling", function () {
  it("should respond with casting error", async function() {
      const res = await request(server).post("/api/v1/events").send(event2);
      expect(res.statusCode).to.eql(400)
      expect(res.body.message).to.eql('Invalid input data. Cast to date failed for value "definitelyNotDate" (type string) at path "date"')
  })

  it("should respond with lastName validation error", async function() {
    const res = await request(server).post("/api/v1/events").send(event3);
    expect(res.statusCode).to.eql(400)
    expect(res.body.message).to.eql("Invalid input data. Please tell us your last name")
  })

  it("should respond with duplicate key error", async function() {
    const res = await request(server).post("/api/v1/events").send(event1);
    expect(res.statusCode).to.eql(409)
    expect(res.body.message).to.eql('Duplicate fields')
  })

  it("should respond with email validation error", async function() {
    const res = await request(server).post("/api/v1/events").send(event4);
    expect(res.statusCode).to.eql(400)
    expect(res.body.message).to.eql('Invalid input data. Please provide a valid email')
  })
})
