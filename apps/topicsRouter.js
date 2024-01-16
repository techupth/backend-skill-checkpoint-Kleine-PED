import { Router } from "express";
import { db } from "../utils/db.js";
import { ObjectId } from "mongodb";

export const topicsRouter = Router();
const collection = db.collection("topics");
//creating : .insertOne()
topicsRouter.post("/", async (req, res) => {
  const collection = db.collection("topics");

  const topicData = { ...req.body };
  const topics = await collection.insertOne(topicData);

  return res.json({
    message: "New topic has been created successfully",
  });
});

//getData : .find().toArray()
topicsRouter.get("/", async (req, res) => {
  try {
    const collection = db.collection("topics");
    const requestedLimit = Number(req.query.limit);

    if (requestedLimit > 10) {
      return res.status(400).json({
        message: "Invalid request, limit must not exceed 10 topics",
      });
    }

    const getAllTopics = await collection.find().limit(10).toArray();

    return res.json({ data: getAllTopics });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: { message: "Server Error!" } });
  }
});

//getDataById : .findOne()
topicsRouter.get("/:topicId", async (req, res) => {
  const collection = db.collection("topics");
  const topicId = req.params.topicId;

  try {
    const getTopicById = await collection.findOne({
      _id: new ObjectId(topicId),
    });

    if (!getTopicById) {
      return res.status(404).json({ error: { message: "Topic not found!" } });
    }

    return res.json({ data: getTopicById });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: { message: "Server Error!" } });
  }
});

//update data : .updateOne()
topicsRouter.put("/:topicId", async (req, res) => {
  try {
    const collection = db.collection("topics");
    const updatedTopicData = { ...req.body, modified_at: new Date() };
    // ใช้ ObjectId ที่ Import มาจากด้านบน ในการ Convert Type ด้วย
    const topicId = new ObjectId(req.params.id);

    await collection.updateOne(
      {
        _id: topicId,
      },
      {
        $set: updatedTopicData,
      }
    );
    return res.json({
      message: `Topic Id : ${topicId} has been updated successfully`,
    });
  } catch (error) {
    return res.status(404).json({
      message: "Cannot update, No data available!",
    });
  }
});

//delete data : .deleteOne()
topicsRouter.delete("/:topicId", async (req, res) => {
  try {
    const collection = db.collection("topics");
    const topicId = req.params.topicId;

    await collection.deleteOne({ _id: new ObjectId(topicId) });

    return res.json({
      message: `Topic Id : ${topicId} has been deleted successfully`,
    });
  } catch (error) {
    return res.status(404).json({
      message: "Cannot delete, No data available!",
    });
  }
});

export default topicsRouter;
