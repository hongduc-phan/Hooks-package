import { useState, useEffect } from 'react'
import { getFpTags, getGroupTags } from '@sangre-fp/connectors/tag-service-api'

export const useTags = group => {
  const [tags, setTags] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleFetch = async () => {
    setLoading(true)
    setError(null)

    try {
      setTags(await Promise.all([ getFpTags(), getGroupTags(group) ]))
    } catch (e) {
      setError(e)
    }

    setLoading(false);
  }

  useEffect(() => {
    handleFetch()
  }, [group])

  return {
    tags,
    loading,
    error
  }
}
