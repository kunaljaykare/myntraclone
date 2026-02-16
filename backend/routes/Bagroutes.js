const express = require("express");
const Bag = require("../models/Bag");
const router = express.Router();

// ADD ITEM TO BAG
router.post("/", async (req, res) => {
  try {
    const item = new Bag({
      ...req.body,
      savedForLater: false,
    });
    const savedItem = await item.save();
    res.status(200).json(savedItem);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// GET USER BAG
router.get("/:userid", async (req, res) => {
  try {
    const bag = await Bag.find({ userId: req.params.userid })
      .populate("productId");
    res.status(200).json(bag);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});
// UPDATE QUANTITY OR STATUS
router.put("/:itemid/quantity", async (req, res) => {
  try {
    const item = await Bag.findById(req.params.itemid);
    if (item.savedForLater) {
      return res.status(400).json({
        message: "Cannot update quantity of an item saved for later"
      })
    }
    item.quantity = req.body.quantity;
    await item.save();
    res.status(200).json(item);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error updating item quantity" });
  }
});

// SAVE FOR LATER
router.put("/:itemid/save", async (req, res) => {
  try {
    const item = await Bag.findByIdAndUpdate(
      req.params.itemid,
      { savedForLater: true },
      { new: true }
    );
    res.status(200).json(item);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error saving item for later" });
  }
});

// MOVE TO BAG
router.put("/:itemid/move-to-bag", async (req, res) => {
  try {
    const item = await Bag.findByIdAndUpdate(
      req.params.itemid,
      { savedForLater: false, quantity: 1 },
      { new: true }
    );
    res.status(200).json(item);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error moving item to bag" });
  }
});

// DELETE ITEM FROM BAG
router.delete("/:itemid", async (req, res) => {
  try {
    await Bag.findByIdAndDelete(req.params.itemid);
    res.status(200).json({ message: "Item removed from bag" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error removing item from bag" });
  }
});
/*
router.patch("/save-for-later/:id", async (req, res) => {
  try {
    const item = await Bag.findByIdAndUpdate(
      req.params.id,
      { status: "SAVED" },
      { new: true }
    );
    res.json(item);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error saving item for later" });
  }
});

router.patch("/move-to-cart/:id", async (req, res) => {
  try {
    const item = await Bag.findByIdAndUpdate(
      req.params.id,
      { status: "ACTIVE" },
      { new: true }
    );
    res.json(item);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error moving item to cart" });
  }
});

router.patch("/:userId", async (req, res) => {
  const items = await Bag.find({ userId: req.params.userId })
    .populate("productId");
  const active = items.filter(i => i.status === "ACTIVE");
  const saved = items.filter(i => i.status === "SAVED");
  res.json({ active, saved });
});
router.put("/:itemid", async (req, res) => {
  try {
    const update = {};

    if (req.body.quantity !== undefined) {
      update.quantity = req.body.quantity;
    }

    if (req.body.status !== undefined) {
      update.status = req.body.status; // "ACTIVE" or "SAVED"
    }

    const item = await Bag.findByIdAndUpdate(
      req.params.itemid,
      update,
      { new: true }
    );

    res.status(200).json(item);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating bag item" });
  }
});*/
module.exports = router;
