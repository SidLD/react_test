import { useEffect, useCallback, useRef } from "react"
import Spinner from "../../components/Spinner"
import { motion } from "framer-motion"
import "./lunch.style.scss"
import useStore from "../../store/app.store"
import { formatDate } from "../../lib/helper"
import { fetchLunchesAPI, fetchLunchesByIdAPI, fetchLunchesByTermAPI } from "../../lib/api.ts"

export const LunchPage = () => {
  const {
    markImageAsFailed,
    launches,
    loading,
    searchLoading,
    hasMore,
    page,
    searchTerm,
    selectedLaunch,
    failedImages,
    setLaunches,
    addLaunches,
    setSelectedLaunch,
    setLaunchpadData,
    setLoading,
    setSearchLoading,
    setViewLoading,
    setHasMore,
    incrementPage,
    setSearchTerm,
    setPage
  } = useStore()
  const searchTermRef = useRef(searchTerm);
  const debounceTimeout = useRef(null)

  // Fetch launches from API
  const fetchLaunches = async (pageNum) => {
    if (searchTerm.trim()) return
    setLoading(true)
    try {
      const limit = 10
      const offset = (pageNum - 1) * limit

      const {data} = await fetchLunchesAPI({
        limit,
        offset,
      })

      if(!data){
        alert('Something went wrong fetching data')
        return;
      }
      const newLaunches = data

      if (newLaunches.length === 0) {
        setHasMore(false)
      } else {
        addLaunches(newLaunches)
      }
    } catch (error) {
      console.error("Error fetching launches:", error)
    } finally {
      setLoading(false)
    }
  }

  // Search launches 
  const searchLaunches = useCallback(async (term) => {
    if (!term.trim()) {
      if (searchTermRef.current.trim()) {
        setLaunches([])        
        setHasMore(true)
        setPage(1)          
      }
      return
    }
    
    setSearchLoading(true);
    try {
      const response = await fetchLunchesByTermAPI(term)
      setLaunches(response.data);
      setHasMore(false);
    } catch (error) {
      console.error("Error searching launches:", error);
    } finally {
      setSearchLoading(false);
    }
  }, [page, setLaunches, setHasMore, setPage]);

  // get specific lunch
  const fetchLaunchpadData = async (siteId) => {
    setViewLoading(true)
    try {
      const response = await fetchLunchesByIdAPI(siteId)
      setLaunchpadData(response.data)
    } catch (error) {
      console.error("Error fetching launchpad data:", error)
      setLaunchpadData(null)
    } finally {
      setViewLoading(false)
    }
  }

  useEffect(() => {
    searchTermRef.current = searchTerm;
  }, [searchTerm]);

  // Handle view button click
  const handleViewClick = (launch) => {
    if (selectedLaunch && selectedLaunch.flight_number === launch.flight_number) {
      setSelectedLaunch(null)
      setLaunchpadData(null)
    } else {
      setSelectedLaunch(launch)
      if (launch.launch_site && launch.launch_site.site_id) {
        fetchLaunchpadData(launch.launch_site.site_id)
      }
    }
  }
  
  const debouncedSearch = useCallback(
    (term) => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current)
      }
      debounceTimeout.current = setTimeout(() => {
        searchLaunches(term)
      }, 500)
    },
    [searchLaunches]
  )

  useEffect(() => {
    fetchLaunches(page)
  }, [page])

  useEffect(() => {
    debouncedSearch(searchTerm)
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current)
      }
    }
  }, [searchTerm, debouncedSearch])

  useEffect(() => {
    const handleScroll = () => {
      if (searchTerm.trim()) return 
      if (loading || !hasMore) return 

      const offsetBelow = window.scrollY + window.innerHeight - document.body.offsetHeight + 10
      if (offsetBelow > 0) {
        incrementPage()
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [loading, hasMore, searchTerm])


 const handleImageError = (flightNumber) => {
    markImageAsFailed(flightNumber);
  };

  return (
    <div className="items-container">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {(searchLoading || loading) && launches.length === 0 ? (
        <div className="spinner-wrapper">
          <Spinner />
        </div>
      ) : launches.length === 0 && !loading && !searchLoading ? (
        <div className="no-results">No launches found</div>
      ) : (
        launches.map((launch, index) => (
          <div key={index} className="launch-item-container">
            {selectedLaunch && selectedLaunch.flight_number === launch.flight_number ? (
              <motion.div
                className="launch-item expanded"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="launch-header">
                  <div className="launch-title">
                    <h2 className="launch-name">{launch.mission_name}</h2>
                    {launch.upcoming && <span className="upcoming-tag">upcoming</span>}
                    {launch.launch_success !== undefined && (
                      <span className={`status-tag ${launch.launch_success ? "success" : "failed"}`}>
                        {launch.launch_success ? "success" : "failed"}
                      </span>
                    )}
                  </div>
                </div>

                <div className="launch-expanded-content">
                  <div className="launch-meta">
                    <span className="launch-date">{formatDate(launch.launch_date_utc)}</span>
                    {launch.links?.article_link && (
                      <a
                        href={launch.links.article_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="meta-link"
                      >
                        Article
                      </a>
                    )}
                    {launch.links?.video_link && (
                      <a href={launch.links.video_link} target="_blank" rel="noopener noreferrer" className="meta-link">
                        Video
                      </a>
                    )}
                  </div>

                  <div className="launch-details-content">
                    <div className="mission-patch-container">
                      <div className="mission-patch-wrapper">
                        {launch.links?.mission_patch_small && (
                          <img
                            src={launch.links.mission_patch_small || "/placeholder.svg"}
                            alt={`${launch.mission_name} patch`}
                            className={`mission-patch ${failedImages[launch.flight_number] ? "image-failed" : ""}`}
                            onError={() => handleImageError(launch.flight_number)}
                          />
                        )}
                      </div>
                    </div>

                    {launch.details && <p className="details-text">{launch.details}</p>}
                  </div>

                  <button className="hide-button" onClick={() => handleViewClick(launch)}>
                    HIDE
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                className="launch-item"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="launch-info">
                  <h2 className="launch-name">{launch.mission_name}</h2>
                  {launch.upcoming && <span className="upcoming-tag">upcoming</span>}
                  {launch.launch_success !== undefined && (
                    <span className={`status-tag ${launch.launch_success ? "success" : "failed"}`}>
                      {launch.launch_success ? "success" : "failed"}
                    </span>
                  )}
                </div>
                <button className="view-button" onClick={() => handleViewClick(launch)}>
                  VIEW
                </button>
              </motion.div>
            )}
          </div>
        ))
      )}

      {loading && launches.length > 0 && (
        <div className="spinner-wrapper">
          <Spinner />
        </div>
      )}

      {!hasMore && !loading && !searchLoading && launches.length > 0 && <div className="end-message">End of list.</div>}
    </div>
  )
}
