import React, { useContext } from 'react'
import { Card, CardHeader, Avatar, CardMedia, CardContent, IconButton } from '@material-ui/core'
import { randomCage } from '../utils/randomCage'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'
import FavoriteIcon from '@material-ui/icons/Favorite'
import { UserContext } from './UserContext'
import axios from 'axios'
import styled from 'styled-components'
import ReactMarkdown from 'react-markdown'

const RedditPostEmbedded = ({ post, token, setPostWithComments }) => {

  const { user, updateUser } = useContext(UserContext)

  const handleFavourite = () => {
    axios.put(`/api/users/${user.id}/saved`,
      { 'redditId': post.reddit_id },
      { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => {
        updateUser()
        setPostWithComments(res.data)
      })
  }

  const H2 = styled.h2`
    margin-left: 20px;
    font-size: clamp(1rem, 3vw, 1.5rem);
  `

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar src={post.reddit_author_avatar || randomCage()} />}
        action={
          <IconButton
            aria-label="settings"
            onClick={handleFavourite}
          >
            {user.saved_posts?.some(savedPost => post.id === savedPost.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
        }
        title={`r/${post.subreddit}`}
        subheader={post.reddit_author}
      />
      <CardContent>
        <CardMedia
          component={RegExp(/(placecage|.(jpe?g|png|gif|svg)$)/).test(post.media) ? 'img' : 'video'}
          src={post.media}
          style={{ height: 'clamp(250px, 30vw, 300px)', width: 'clamp(250px, 30vw, 300px)' }}
        />
        <H2>{post.title}</H2>
      </CardContent>
      {post.body && 
        <CardContent style={{ flexDirection: 'column' }}>
          <ReactMarkdown escapeHtml={false} source={post.body}/>
        </CardContent>
      }
    </Card>
  )
}

export default RedditPostEmbedded