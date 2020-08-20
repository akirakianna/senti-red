from flask import Blueprint, request, jsonify, g
from models.post_model import Post
from schemas.post_schema import PostSchema
from models.reddit_comment_model import RedditComment
from models.sentiment_model import Sentiment
from models.user_model import User
from datetime import datetime
from sentipraw import reddit
from sentiment_request import fetch_sentiment
from models.api_calls_model import ApiCalls
from lib.secure_route import secure_route
from lib.helpers import calculate_user_aggregate_sentiment
import re

from lib.helpers import random_cage

# import logging

# handler = logging.StreamHandler()
# handler.setLevel(logging.DEBUG)
# for logger_name in ("praw", "prawcore"):
#     logger = logging.getLogger(logger_name)
#     logger.setLevel(logging.DEBUG)
#     logger.addHandler(handler)


post_schema = PostSchema()

router = Blueprint(__name__, 'posts')


@router.route('/posts', methods=['GET'])
def index():
    posts = Post.query.all()
    return post_schema.jsonify(posts, many=True), 200


@router.route('/posts/<reddit_id>', methods=['GET'])
@secure_route
def get_one(reddit_id):
    post = Post.query.filter_by(reddit_id=reddit_id).first()
    user = User.query.get(g.current_user.id)
    # First, check to see whether the article is already in our db. If not, we make a call to the reddit API using an endpoint that returns both the post and any comments.
    # We instantiate the post in our db then use regex logic to find appropriate media for the post (i.e. jpg/png/gif/video) and update the model accordingly.
    # Then we cycle through the posts comments, instantiating each one as a model on our db and appending the comment to the post in our db.
    if not post:
        submission = reddit.request('GET', f'https://oauth.reddit.com/comments/{reddit_id}', {'limit': 3})
        data = submission[0]['data']['children'][0]['data']
        new_post = Post(
            reddit_id=data['id'],
            title=data['title'],
            body=data['selftext'],
            subreddit=data['subreddit'],
            reddit_author=data['author'],
            reddit_created_at=datetime.fromtimestamp(data['created_utc'])
        )
        if re.search('\.(png|gif|jpe?g|svg)$', data['url']):
            new_post.media = data['url']
        elif 'media' in data and data['media'] and 'reddit_video' in data['media']:
            new_post.media = data['media']['reddit_video']['fallback_url']
        elif 'preview' in data and data['preview'] and 'reddit_video_preview' in data['preview']:
            new_post.media = data['preview']['reddit_video_preview']['fallback_url']
        elif 'thumbnail' in data and data['thumbnail'] and data['thumbnail'] != 'self' and data['thumbnail'] != 'spoiler' and data['thumbnail'] != 'default':
            new_post.media = data['thumbnail']
        else:
            new_post.media = random_cage()
        for comment in submission[1]['data']['children']:
            if 'body' not in comment['data']:
                continue
            new_reddit_comment = RedditComment(
                body=comment['data']['body'],
                subreddit=comment['data']['subreddit'],
                reddit_created_at=datetime.fromtimestamp(comment['data']['created_utc']),
                reddit_author=comment['data']['author']
            )
            new_reddit_comment.save()
            new_post.reddit_comments.append(new_reddit_comment)
        new_post.save()
        user.viewed_posts.append(new_post)
        user.save()
        return post_schema.jsonify(new_post)
    user.viewed_posts.append(post)
    user.user_sentiments.append(post.sentiment)
    if post.reddit_comments:
        for comment in post.reddit_comments:
            user.user_sentiments.append(comment.sentiment)
    if post.sentireddit_comments:
        for comment in post.sentireddit_comments:
            user.user_sentiments.append(comment.sentiment)
    calculate_user_aggregate_sentiment(user)
    user.save()
    return post_schema.jsonify(post), 200

@router.route('/posts/<reddit_id>/avatars', methods=['GET'])
@secure_route
def get_redditor_avatars(reddit_id):
    post = Post.query.filter_by(reddit_id=reddit_id).first()
    #! Using Praw for avatar
    post.reddit_author_avatar = reddit.redditor(name=post.reddit_author).icon_img
    for comment in post.reddit_comments:
        comment.reddit_author_avatar = reddit.redditor(name=comment.reddit_author).icon_img
        comment.save()
    post.save()
    return post_schema.jsonify(post), 200


@router.route('/posts/<reddit_id>/sentiment', methods=['GET'])
@secure_route
def analyse_post_and_comments(reddit_id):
    post = Post.query.filter_by(reddit_id=reddit_id).first()
    user = User.query.get(g.current_user.id)
    if not post:
        return jsonify({'message': 'Could not return post'}), 404

    # Reddit post titles do not always end with a full stop. Google Natural Language API analyses by sentence
    # so we provide a full stop to ease the analysis. There is not always a body on a post, so both the title
    # and body are combined for the analysis.
    text_to_analyse = f'{post.title}. {post.body}'
    language_sentiment = fetch_sentiment(text_to_analyse)

    # Since sentiment is an individual class in its own table, we instantiate the Sentiment here to attach to the post.
    # language_sentiment is an object with .score and .magnitude properties on the object that Google returns.
    sentiment_instance = Sentiment(
        polarity=language_sentiment['score'],
        magnitude=language_sentiment['magnitude'],
        score=(language_sentiment['score'] * language_sentiment['magnitude']),
        post_id=post.id
    )
    sentiment_instance.save()
    user.user_sentiments.append(sentiment_instance)
    for comment in post.reddit_comments:
        calls = ApiCalls.query.get(1)
        if calls.count > 4500:
            break
        if comment.sentiment:
            continue
        language_sentiment = fetch_sentiment(comment.body)
        comment_sentiment_instance = Sentiment(
            polarity=language_sentiment['score'],
            magnitude=language_sentiment['magnitude'],
            score=(language_sentiment['score'] * language_sentiment['magnitude']),
            reddit_comment_id=comment.id
        )
        comment_sentiment_instance.save()
        user.user_sentiments.append(comment_sentiment_instance)
    calculate_user_aggregate_sentiment(user)
    user.save()
    post.save()
    return post_schema.jsonify(post), 200

