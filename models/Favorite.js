const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const favoriteSchema = Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  favorites: [
    {

      type: Schema.Types.ObjectId,
      ref: "news",
      required: true,

    }
  ],

});

module.exports = mongoose.model("favorites", favoriteSchema);
