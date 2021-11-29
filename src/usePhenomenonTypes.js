import { useState, useEffect } from "react"
import drupalApi from "@sangre-fp/connectors/drupal-api"
import { keyBy, sortBy } from "lodash-es"

export const usePhenomenonTypes = groupId => {
  const [phenomenonTypes, setPhenomenonTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const handleFetch = async (groupId) => {
    setLoading(true)
    setError(null)

    try {
      if (Array.isArray(groupId)) {
        const phenonTypesRes = await Promise.all(
          groupId?.map(g => drupalApi.getPhenomenaTypes(g?.value  || g || 0))
        )
        let totalTypesTemp = []
        phenonTypesRes?.map(t => {
          t.map(temp => {
            if(temp.id.indexOf('[object Object]') == -1) {
              totalTypesTemp = totalTypesTemp.filter(type => type.id === temp.id).length < 1 ? totalTypesTemp.concat(temp) : totalTypesTemp
            }
          })
        })
        
        const typesUnique = [...new Set(totalTypesTemp)]

        setPhenomenonTypes(typesUnique)
      }
      else setPhenomenonTypes(await drupalApi.getPhenomenaTypes(groupId))
      setPhenomenonTypes(await drupalApi.getPhenomenaTypes(groupId))
    } catch (e) {
      console.error('22222222222', e)
      setError(e)
    }

    setLoading(false)
  };

  useEffect(() => {
    handleFetch(groupId)
  }, [groupId])

  return {
    phenomenonTypes: phenomenonTypes,
    phenomenonTypesById: keyBy(phenomenonTypes, "id"),
    loading,
    error
  }
}

export const PhenomenonTypeLoader = ({ children }) => {
  const loader = usePhenomenonTypes()

  return children(loader)
}
