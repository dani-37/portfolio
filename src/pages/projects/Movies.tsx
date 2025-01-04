import React from "react";
import Page from "../../components/Pages.tsx";

const Movies = () => {
    const description = 'network based approach to movie recommender systems'

    const content = 
      <div className="relative space-y-5 text-gray-800 -mt-5">
        
        <img
          src="/images/graph.png"
          alt="Network graph of movies"
          className="w-42 h-60 object-cover rounded float-right pl-2 pb-2"
        />

        <p>
         My housemates and I love to watch movies together, but very often we'll have widely 
         different ideas of what to watch. if I wanted to watch Shrek and somebody wanted to watch James Bond, how could 
         we meet in the middle, and find something we'd both enjoy? To me, it seemed like a <b >
         graph-based</b> task.
        </p>

        <p>
          I wanted to use publicly available data to create 
          an algorithm that would let me input a list of movies and spit out recommendations. 
          Each movie would be represented by a <b>node</b>, and the <b>connection</b> between movie A and movie B would be determined
          by how much users who liked movie A liked movie B.
        </p>

        <p>
          It's a very interesting problem - how do you define "liking a movie"? How can we best capture user trends
          and movie qualities? I started by looking for datasets, and found the very nicely curated <a href='https://grouplens.org/datasets/movielens/' target="_blank" rel="noopener noreferrer" className="font-semibold" >
          MovieLens</a> database. It was very simple - just one huge table with movie-id, user-id, and rating.
        </p>

        <img
          src="/images/histogram.png"
          alt="Exploratory data analysis of movie dataset"
          className="w-42 h-60 object-cover rounded float-left pr-2 pb-2"
        />

        <p>
          I first <b >cleaned up the data</b> - processing a full 33 million rows was making my computer sound like a jet engine.
          I removed outliers in both users (some had more than 10k reviews) and movies (some had less than 10 reviews). This took the 
          number of rows down to 11 million, something a bit more managable. 
        </p>

        <p>
          Now, to the task. Given a list of movies, my goal was to find other movies the user would likely enjoy.
          To determine the graph's connection strengths, I weighted users' opinons,
          ensuring those who clearly liked a movie contribute more to its connections.
        </p>

        <p>
          My "test set" consisted of 3 clearly distinct categories: <i>The Romcom Lover</i>, <i>The Tarantino Fanatic</i>,
          and <i>Family Friendly Fun</i>. You can see the results below - the movies the user likes are on the left,
          and the recommendations on the right.
        </p>

        <p className="font-semibold italic">The Romcom Lover</p>

        <img
          src="/images/romcom.png"
          alt="Romcom movie recommendation example"
          className="w-full object-cover pb-5"
        />

        <p className="font-semibold italic">The Tarantino Fanatic</p>

        <img
          src="/images/tarantino.png"
          alt="Tarantino movie recommendation example"
          className="w-full object-cover pb-5"
        />

        <p className="font-semibold italic">Family Friendly Fun</p>

        <img
          src="/images/family.png"
          alt="Family friendly movie recommendation example"
          className="w-full object-cover pb-5"
        />

        <p>
          I'm quite happy with the recommendations. You can clearly see how different tastes are taken into account.
          Playing around with different movies I enjoy, I've found new ones to watch!
         </p>  

        <p>
          There were some challenging parts to this project, like accounting for 
          biases such as generous raters or popular movies. One other issue was <b > 
          sparcity</b>. Since I was working with matrices, users or movies with few reviews introduce a large number of missing 
          values. Dealing with these in a computationally efficient way made me learn about <b className="font-semibold"> 
          SciPy</b>'s optimisation techniques.
        </p>

        <p>
          If you want to look through the project, you can see the full code <a className="font-semibold" href="/movies.html" target="_blank">here</a>.
        </p>


      </div>

    return (
      <Page title={"movie decider"} description={description} content={content} dates={"2024"} page='projects'     />

    );
  };
  
export default Movies