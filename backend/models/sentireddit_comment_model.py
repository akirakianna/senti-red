from app import db
from models.base_model import BaseModel
# from models.sentiment_model import Sentiment


class SentiRedditComment(db.Model, BaseModel):

    __tablename__ = 'sentireddit_comments'

    body = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'))
    
    sentiment = db.relationship(
        'Sentiment',
        uselist=False,
        backref='sentireddit_comment',
        passive_deletes=True
    )
