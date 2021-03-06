import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import RedditPostEmbedded from './RedditPostEmbedded'
import RedditComment from './RedditComment'
import SentiRedditComment from './SentiRedditComment'
import { UserContext } from './UserContext'
import styled, { ThemeContext as StyleContext } from 'styled-components'

const Post = () => {

  const { pathname } = useLocation()
  const { updateUser } = useContext(UserContext)
  const [postWithComments, setPostWithComments] = useState([])
  const [comment, setComment] = useState('')
  const redditId = pathname.match(/posts\/(\w+)$/)[1]
  const token = localStorage.getItem('token')
  const styleTheme = useContext(StyleContext)


  useEffect(() => {
    axios.get(`/api/posts/${redditId}`, { headers: { 'Authorization': `Bearer ${token}` } })
      .then(initialResponse => {
        setPostWithComments(initialResponse.data)
        return initialResponse
      })
      .then(initialResponse => {
        if (initialResponse.data.reddit_author_avatar && initialResponse.data.reddit_comments.every(comment => comment.reddit_author_avatar)) return initialResponse
        axios.get(`/api/posts/${redditId}/avatars`, { headers: { 'Authorization': `Bearer ${token}` } })
          .then(avatarResponse => {
            setPostWithComments(avatarResponse.data)
            return initialResponse
          })
          .catch(err => console.log(err))
        return initialResponse
      })
      .then(initialResponse => {
        if (initialResponse.data.sentiment && initialResponse.data.reddit_comments.every(comment => comment.sentiment)) return
        axios.get(`api/posts/${redditId}/sentiment`, { headers: { 'Authorization': `Bearer ${token}` } })
          .then(sentimentResponse => setPostWithComments(sentimentResponse.data))
          .then(() => updateUser())
          .catch(err => console.log(err))
      })
      .then(() => updateUser())
      .catch(err => console.log(err))
  }, [redditId, token])

  if (postWithComments.length === 0) return null

  const addComment = () => {
    // if (!comment) return
    axios.post(`api/posts/${redditId}/comments`, { body: comment },
      {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => {
        setPostWithComments(res.data)
        setComment('')
      })
      .catch(err => console.log(err))
  }

  

  return (
    <main>
      <section className="post">
        <RedditPostEmbedded post={postWithComments} token={token} setPostWithComments={setPostWithComments}/>
      </section>
      <section className="reddit-comments">
        {postWithComments.reddit_comments.map((comment, i) => <RedditComment key={i} comment={comment} />)}
      </section>
      <section className="sentireddit-comments">
        {postWithComments.sentireddit_comments.map((comment, i) => (
          <SentiRedditComment 
            key={i} 
            comment={comment} 
            token={token}
            redditId={redditId}
            setPostWithComments={setPostWithComments}
          />
        ))}
      </section>
      <StyledInput
        name="text"
        onChange={(e) => setComment(e.target.value)}
        placeholder="Comment"
        value={comment}
        styleTheme={styleTheme}
      />
      <StyledButton styleTheme={styleTheme} onClick={addComment}>Add Comment</StyledButton>  
    </main>
  )
}

export default Post

const StyledInput = styled.textarea`
    padding: 1rem 4rem 1rem 2rem;
    margin-bottom: 1rem;
    border-radius: ${props => props.styleTheme.borderRadius};
    display: block;
    `
    
const StyledButton = styled.button`
    padding: 0.5rem 1rem;
    border-radius: ${props => props.styleTheme.borderRadius};
  `