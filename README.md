![GA Logo](./frontend/src/screenshots/GALogo.png)

# PROJECT 4 - SentiRed

By [Kianna Love](https://github.com/akirakianna) and [Alex Nicholas](https://github.com/alicnik)

MATERIAL UI IMPORTS USING DEFAULT INSTEAD OF NAMED, BETTER PERFORMANCE ACCORDING TO DOCS

## Overview

For my final project at GA, I **worked collaboratively** to create a **full-stack web application** within **8 days** which utilises a Python Flask RESTful API. We pair programmed throughout, using the driver navigator relationship. 

SentiRed is an application which uses machine learning/natural language analysis to track a user's sentiment score based on what they are reading and creates a dynamic Emotional UI based off of this.

Our final concept came from an amalgamation of ideas we both wanted to try out. I wanted to use Reddit's API (as it is incredibly detailed??) and find a way to incorporate Emotional UI - something I had been researching and was keen to try out. Alex wanted to implement Google's natural language API as he had been reasearching news algorithms and how they trigger an emotional response.

You can find our project online [here](

## Table of Contents

1. [Brief](#Project-Brief)
2. [Technologies used](#Technologies-Used)
3. [Approach](#Approach)
    - [Planning](#Planning-/-Thought-Process)
    - [Back-end](#Back-end)
    - [Front-end](#Front-end)
- [Challenges](#Challenges)
- [Victories](#Victories)
- [Lessons Learned](#Lessons-Learned)
- [Future Improvements](#Future-Features-and-Improvements)
- [Credit](#Credit) 

## Project Brief

* **Build a full-stack application** by making your own backend and your own front-end.
* **Use a Python Flask API** using a Flask REST Framework to serve your data from a Postgres database.
* **Consume your API with a separate front-end** built with React.
* **Be a complete product** - multiple relationships and CRUD functionality for at least a couple of models.
* **Implement thoughtful user stories/wireframes**.
* **Have a visually impressive design**.
* **Be deployed online** so it's publicly accessible.

## Technologies Used

* HTML
* CSS in JS (styled components)
* React.js
* Moment.js
* Python
* Flask
* Google Natural Language API
* Reddit API
* PRAW
* Marshmallow
* PostgreSQL
* SQLAlchemy
* Material UI
* React Hook Forms
* Yup
* TablePlus
* Git and GitHub


## Approach

### Planning / Thought Process

#### MVP

We initially spent some time discussing our idea and how best to approach the build. We created a shared Google Doc to create an outline.

- User must register an account to use our app.
- Home page will be similar to Reddit's, as it will return current trending Reddit posts - option to *toggle* between the main categories (Hot, New, Rising, Controversial, Best, Random).
- A single post page, which will return the full Reddit post, plus its associated comments from Reddit.
- Use Google's Natural Language API to measure the sentiment of the language in both posts and comments and push that analysis to the user's overall score.
- Have our UI change based on the user's sentiment score.
    - Change background colour, fonts.
    - Have a sliding scale (progress bar), where the slider moves when a user's sentiment score changes.
    - Possibly use an emoji as the slider which would also change at certain thresholds (😃, 😢, 😡). 
    - Change border radius depending on emotional state, i.e rounded for happy (bubbly), angular (spiky) for angry.
   
- User's will have the option to favourite a post, as well as comment on a post (on the single post page).
- User's will have their own account page, which will include their overall sentiment score, their favourited posts as well as their viewed posts.
- Stretch goals
     - D3 Data Visualisation
     - Animation when certain emotional levels are reached.
     - Reset password link.
     
After we had settled on the general idea for our project, we began by exploring the Reddit API (to see what information we could access and what endpoints we would want to use) and setting up our authorization.
The Reddit API would be returning the main chunk of our app's data, so we wanted to make sure that it worked the way we expected it to.

[delete - replace with other]
**Example of endpoint initially used for getting a post and its comments**:

- oauth.reddit.com/comments/{article_id}
     - response[0].data.children[0].selftext 
     - *returns the body of the post.*
     - response[0].data.children[0].title 
     - *returns the title of the post.*
     - response[0].data.children[0].secure_media        
     - *returns the images/video.*

#### Wireframes

We designed our app mobile first using Figma, as it allows you to quickly draft up an MVP of your product:

![GA Logo](./frontend/src/screenshots/SentiRedditMobileWireframe.png)

#### Entity Relationship Diagrams

We used Quick DBD to create our entity relationship diagrams (the relationships between our app's models): 
![GA Logo](./frontend/src/screenshots/SentiRedditModels.png)

READ TEXTBOOK!!!

### Back-end

We decided to split out our schemas and our models ...? WHY [alex]


#### Models

The relationships between our models were quite complex, so we spent a fair bit of time working them out. 

- Many to many
      -  
- One to many
- One to one

#### SQLAlchemy Models

From this diagram, we were able to define our models for the PostgreSQL database using SQLAlchemy. [correct?]

*While SQLAlchemy is not related to Flask, there is conveniently  a Flask integration designed to be used with Flask applications: `flask-sqlalchemy`.*









- Posts
    - ...
- Reddit Comments
    -  ....
- SentiRed Comments
- Sentiment 
- Users
    - For the user's we were

Due to potential billing costs, we had to try and rate limit the calls made to Google's API. To do so, we created an additional table (ApiCalls) to track all of the analysis calls made.

```py
class ApiCalls(db.Model, BaseModel):
    __tablename__ = 'api_calls'
    count = db.Column(db.Integer)
```

We initially couldn't decide whether or not Sentiment should have its own table. However, 

Join Tables ...



#### Schemata [Delete]

Our project has several Marshmallow schemas within which we were ... nested fields? [ASK?]

#### PRAW

Talk about briefly - then direct to challenges section ...

#### Controllers


### Front-end

#### Context 

#### Emotional UI
examples

#### Styled Components and Material UI
examples




#### UseContext

a way of passing props around your app without having to pass them through every component
props.children placeholder for the components that will be insdie of the provider.
it is unertain at that first point - you don't know what children is at that point
custom provider - all user context logic can live in file. create custom provider what it returns is the user context provider because 
by building the custom provider you can keep all of your usercontext logic in the userContext component.. in that file (keep it separate from app.js) ... don't hvae to list all of your values in app.js as you state the file in the custom provider in the user context file - much more readable.

props is an umbrella term for all the properties a component has - every component has props. when you call a component... state would be current something set current something, when that make api call and set the post as the post in state - the response will have all of the posts details... this will all be in state.

A prop is passing information (e.g variables, functions, state etc..) from a parent component to a child component. Our parent will be the main post page (post and comments) and in it will call the reddit post component sentireddit comment and redditcomment - these components will know what they have to do from props. One API call in the parent and pass the relevant parts to the children.

? Decided to include emoiton on the backend to limit the amount of API calls on the front end, makes more sense to include it with we calculate our aggragate sentiment .... as that what it ties on with always have an emoition from aggregate sentiment.

## Challenges
1 - Google Cloud language library would not load on my laptop, couldn't work out a solution decided to build the request instead of using the libray in case when deployed no one could access the sentiments ...?
We couldn't find a solution online - unanswered StackOverflow questions? mystery bug? Pythonrequest library EXAMPLE of request

2. Deployment Cors wouldn't allow reddit api to make requests to the browser heroku couldn't make requests to reddit api directly... fixed by moving routes in to the backend and the requests to the reddit api from there using PRAW...originally in home.js now in home controller examples



## Responsibilities

## Victories

* Pair programming for the duration of a full-stack build was ... While at points ... Steady pace ... Less mistakes ... Easy to debug ... 
* I learnt so many new libraries ... etc during this build ...

## Future Features


## Credit


