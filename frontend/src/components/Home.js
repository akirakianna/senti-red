import React, { useState, useEffect } from 'react'

import styled from 'styled-components'

import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import SearchIcon from '@material-ui/icons/Search'
import IconButton from '@material-ui/core/IconButton'
import RedditPostCard from './RedditPostCard'
import LoadingCard from './LoadingCard'

import axios from 'axios'
import CategoryCarousel from './CategoryCarousel'

const Home = () => {

  const [searchValue, setSearchValue] = useState('')
  const [category, setCategory] = useState('hot')
  const [redditPosts, setRedditPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const token = localStorage.getItem('token')

  useEffect(() => {
    setLoading(true)
    axios.get(`/api/home/${category}`, { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => {
        setRedditPosts(res.data.data.children)
        setLoading(false)
      })
      .catch(err => console.log(err))
  }, [category, token])

  const handleCategory = (e) => setCategory(e.target.value)

  const handleSearch = () => {
    setLoading(true)
    axios.get(`/api/home/search/${searchValue}`, { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => {
        setRedditPosts(res.data.data.children)
        setLoading(false)
      })
      .catch(err => console.log(err))
  }


  return <main>
    <SearchAndFilterDiv>
      <TextField
        value={searchValue}
        placeholder="Search..."
        variant="outlined"
        onChange={e => setSearchValue(e.target.value)}
        InputProps={{
          endAdornment:
            <InputAdornment position="end">
              <IconButton
                onClick={handleSearch}
              >
                <SearchIcon />
              </IconButton>
            </InputAdornment>
        }}
      />
      <CategoryCarousel handleCategory={handleCategory}/>
      
    </SearchAndFilterDiv>
    {loading ?
      Array(6).fill(0).map((el, i) => <LoadingCard key={i} />) :
      redditPosts.map((post, i) => <RedditPostCard key={i} post={post.data} loading={loading} />)
    }
  </main>

}

export default Home


const SearchAndFilterDiv = styled.div`
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-items: center;
    margin-bottom: 1rem;

    div:first-child {
      width: clamp(250px, 50vw, 500px);
    }

    @media only screen and (min-width: 1066px) {
      flex-direction: row;
      justify-content: space-between;

      div:first-child {
        width: 350px;
      }
    }
  `