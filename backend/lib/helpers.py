import random
from functools import reduce


def random_cage():
    sizes = [200, 250, 300, 350, 400]
    return f'https://www.placecage.com/c/{random.choice(sizes)}/{random.choice(sizes)}'

# Define function to calculate aggregate sentiment score for a user. Reduces all user_sentiments as held in
# user_sentiments join table to an overall sentiment score. Uses reduce to iterate through the user.user_sentiments list.
# sentiment_sum function is used in the reducer, if/else logic therein accounts for the different arguments that will be passed in
# depending on whether it is two Sentiment objects being added together, in which case the .score property is needed, or
# whether is it the reduce accumulator, which will be a float and therefore has no .score property.
# From resulting aggregate sentiment, update user's "emotion" property, which will be used on the front end for rending emotional UI.

def calculate_user_aggregate_sentiment(user):
    def sentiment_sum(a, b):
        if getattr(a, 'score', None):
            return a.score + b.score
        else:
            return a + b.score
    user.aggregate_sentiment = reduce(sentiment_sum, user.user_sentiments, 0)
    if user.aggregate_sentiment >= 1.5:
        user.emotion = 'ecstatic'
    elif user.aggregate_sentiment > 0.5:
        user.emotion = 'happy'
    elif user.aggregate_sentiment > -0.5:
        user.emotion = 'neutral'
    elif user.aggregate_sentiment <= -1.5:
        user.emotion = 'angry'
    elif user.aggregate_sentiment <= -0.5:
        user.emotion = 'sad'
