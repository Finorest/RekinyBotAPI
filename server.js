require('dotenv').config();
const axios = require("axios");
const express = require("express");
const app = express();

app.use(express.json());

const DISCORD_BOT_SERVER_URL = "http://astro.pylex.xyz:10101";

// Store the previous member count

let previousMemberCount = null;

// Function to fetch data from the API

const fetchData = async () => {

  try {

    const response = await axios.get(

      "https://api.brawlstars.com/v1/clubs/%232YPGVJQ9R/members",

      {

        headers: {

          Accept: "application/json",

          Authorization: `Bearer ${process.env.BSAPI}`,

        },

      }

    );

    const data = response.data;

    const currentMemberCount = data.items.length;

    console.log(`Current member count: ${currentMemberCount}`);

    // Compare with the previous member count

    if (previousMemberCount !== null && previousMemberCount !== currentMemberCount) {

      // Send the JSON to the Discord bot server

      const payload = {

        previous: previousMemberCount,

        now: currentMemberCount,

      };

      await axios.post(DISCORD_BOT_SERVER_URL, payload);

      console.log(`Sent payload: ${JSON.stringify(payload)}`);

    }

    // Update the previous member count

    previousMemberCount = currentMemberCount;

  } catch (error) {

    console.error("Error fetching data:", error.message);

  }

};

// Set an interval to fetch data every 2 minutes

setInterval(fetchData, 2 * 60 * 1000);

// Start the Express server

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(`Server is running on port ${PORT}`);

});