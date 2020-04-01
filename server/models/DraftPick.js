const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DraftPickSchema = new Schema({
  scadLeagueID: { type: String, required: true },
  ownerID: { type: Number, required: true },
  originalOwnerID: { type: Number, required: true },
  year: { type: Number, required: true },
  rd: { type: Number, required: true },
  pick: { type: Number },
  salary: { type: Number },
  playerID: { type: Number}
});

const DraftPick = mongoose.model("DraftPick", DraftPickSchema);

module.exports = DraftPick;