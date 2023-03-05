const { expect } = require("chai");
const { ethers } = require("hardhat");

// describe is used to group our tests
describe("Task contract", function () {
  let TaskContract;
  let taskContract;
  let owner;

  const NUM_TOTAL_TASKS = 5;
  let totalTasks;

  //   beforeEach(); // run before each it() or describe()
  //   after(); // run after it() or describe()
  //   it()// these are the test cases

  beforeEach(async function () {
    TaskContract = await ethers.getContractFactory("TaskContract");
    [owner] = await ethers.getSigners();
    taskContract = await TaskContract.deploy();

    totalTasks = [];
    for (let i = 0; i < NUM_TOTAL_TASKS; i++) {
      let task = {
        taskText: "task number " + i,
        isDeleted: false,
      };
      await taskContract.addTask(task.taskText, task.isDeleted);
      totalTasks.push(task);
    }
  });

  describe("AddTask", function () {
    it("should emit add task", async function () {
      let task = {
        taskText: "New Task ",
        isDeleted: false,
      };
      await expect(await taskContract.addTask(task.taskText, task.isDeleted))
        .to.emit(taskContract, "AddTask")
        .withArgs(owner.address, NUM_TOTAL_TASKS);
    });
  });

  describe("get all tasks", function () {
    it("should return correct number of total tasks", async function () {
      const allMyTasks = await taskContract.getMyTask();
      expect(allMyTasks.length).to.equal(NUM_TOTAL_TASKS);
    });
  });

  describe("Delete Task ", function () {
    it("should emit deleted tasks", async function () {
      const TASK_ID = 0;
      const TASK_DELETED = true;
      await expect(taskContract.deleteTask(TASK_ID, TASK_DELETED))
        .to.emit(taskContract, "DeleteTask")
        .withArgs(TASK_ID, TASK_DELETED);
    });
  });
});
