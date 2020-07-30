import React, { useState, useContext } from 'react'
import moment from 'moment'
import axios from 'axios'
import { Card, CardHeader, CardContent, Avatar } from '@material-ui/core'
import { UserContext } from './UserContext'
import IconButton from '@material-ui/core/IconButton'
import EditOutlinedIcon from '@material-ui/icons/EditOutlined'
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined'



const SentiRedditComment = ({ comment, token, redditId, setPostWithComments }) => {

  const [updatedComment, setUpdatedComment] = useState(comment.body)
  const [isEditing, setIsEditing] = useState(false)
  const { user } = useContext(UserContext)

  const editComment = () => {
    axios.put(`api/posts/${redditId}/comments/${comment.id}`, { body: updatedComment },
      {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => {
        setPostWithComments(res.data)
        setUpdatedComment('')
        setIsEditing(false)
      })
      .catch(err => console.log(err))

  }

  const deleteComment = () => {
    axios.delete(`api/posts/${redditId}/comments/${comment.id}`,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => {
        setPostWithComments(res.data)
      })
      .catch(err => console.log(err))
  }

  return (
    <Card>
      <CardHeader
        avatar={<Avatar src={comment.user.avatar} />}
        title={comment.user.username}
        subheader={comment.created_at !== comment.updated_at ? 
          `updated ${moment(comment.updated_at).fromNow()}` : 
          `posted ${moment(comment.updated_at).fromNow()}`
        }
        action={
          user.id === comment.user.id && 
          <>
          <IconButton 
            aria-label="settings"
            onClick={() => setIsEditing(previous => !previous)}
          >
            <EditOutlinedIcon />
          </IconButton>
          <IconButton 
            aria-label="settings"
            onClick={deleteComment}
          >
            <DeleteOutlineOutlinedIcon />
          </IconButton>
          </>
        }
      />
      <CardContent>
        <p>{comment.body}</p>
      </CardContent>
      {isEditing &&
        <>
          <input
            name="text"
            onChange={(event) => setUpdatedComment(event.target.value)}
            placeholder="Edit comment"
            value={updatedComment}
          />
          <button onClick={editComment}>Submit</button>
        </>
      }
    </Card>
  )
}

export default SentiRedditComment

