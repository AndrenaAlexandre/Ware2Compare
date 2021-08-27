// bringing in axios since I am using node.js
const axios = require("axios");
// bringing in prompt as my CLI
const prompt = require("prompt");
//hiding api using environment variable so bringing in dotenv
require("dotenv").config()
const apiKey = process.env.API_KEY;

//functions
const movieListOfActor = async (actor) => {
  try {
    //first we get the url for the actor via this end point using axios
    const actorResponse = await axios.get(
      `https://api.themoviedb.org/3/search/person?api_key=${apiKey}&query=${actor}`
    );
    //once we get that data back we go in a grab the id
    const actorId = actorResponse.data.results[0].id;
    //once we have the id for the actor we are able to search for their movies by that id via this end point using axios
    const moviesResponse = await axios.get(
      `https://api.themoviedb.org/3/person/${actorId}/movie_credits?api_key=${apiKey}`
    );
    //now we cast the data
    const listOfMovies = moviesResponse.data.cast;
    //finally return the data stored in the variable
    return listOfMovies;
  } catch (error) {
    console.log(error); //if we get an error ... SHOW ME!
  }
};

// great we have the data!

// now we want to compare the number of movies from each actor
const compareNumberOfMovies = async (firstActor, secondActor) => {
  try {
    // first lets get the list for the first and second actors
    const firstActorTotalMovies = await movieListOfActor(firstActor);
    const secondActorTotalMovies = await movieListOfActor(secondActor);
    // now lets compare the lists and return the approriate result
    if (firstActorTotalMovies.length > secondActorTotalMovies.length) {
      return `It looks to me that ${firstActor} has been in more movies than ${secondActor}`;
    } else if (firstActorTotalMovies.length < secondActorTotalMovies.length) {
      return `It looks to me that ${secondActor} has been in more movies than ${firstActor}`;
    } else {
      return `Wholly guacamole! It looks like ${firstActor} and ${secondActor} have been in the same number of movies!`;
    }
  } catch (error) {
    console.log(error);
  }
};

// now that we've got our move/actor functions lets get some input to decide which function to use and get data needed
// going to use prompt for this so now we create the function to do so
const main = async () => {
  while (true) {
    // setting up the different schemas I want input data to be stored and pulled from
    const PROMPT_SCHEMAS = [
      {
        name: "choice",
        type: "integer",
        description:
          "Choices:\n1 - See a list of your favorite actors movies\n2 - Compare two of your favorite actors and see who has been in the most movies\n3 - Exit \nWhat would you like to do?",
        required: true,
      },
      {
        name: "actorOne",
        description:
          "Enter the name of the actor you would like to search",
        type: "string",
        required: true,
      },
      {
        name: "actorTwo",
        description:
          "Enter the name of the second actor you would like to search",
        type: "string",
        required: true,
      },
    ];

    // now we are actually getting input from user then running the appropriate function
    const { choice } = await prompt.get(PROMPT_SCHEMAS[0]);

    if (choice === 1) {
      const { actorOne } = await prompt.get(PROMPT_SCHEMAS[1]);
      console.log(await movieListOfActor(actorOne));
    } else if (choice === 2) {
      const { actorOne, actorTwo } = await prompt.get([
        PROMPT_SCHEMAS[1],
        PROMPT_SCHEMAS[2],
      ]);
      console.log(await compareNumberOfMovies(actorOne, actorTwo));
    } else {
      console.log("Exiting...");
      break;
    }
  }
};
// and now we finally run our function. Voila <3
main();