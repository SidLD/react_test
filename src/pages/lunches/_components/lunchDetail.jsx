import { motion } from "framer-motion"
import Spinner from "../../../components/Spinner"
import { MapPin, Info, Check, AlertTriangle } from "../../../assets/icons/icon"
import { formatDate } from "../../../lib/helper"

const LaunchDetails = ({ launch, launchpad, loading, onClose }) => {

  return (
    <motion.div
      className="launch-details-container"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="launch-details-content">
        <div className="launch-summary">
          <div className="launch-meta">
            {launch.upcoming && <span className="upcoming-tag">upcoming</span>}
            {launch.launch_success !== undefined && (
              <span className={`status-tag ${launch.launch_success ? "success" : "failed"}`}>
                {launch.launch_success ? "success" : "failed"}
              </span>
            )}
            <span className="launch-date">{formatDate(launch.launch_date_utc)}</span>
            {launch.links?.video_link && (
              <a href={launch.links.video_link} target="_blank" rel="noopener noreferrer" className="video-link">
                Video
              </a>
            )}
          </div>

          <div className="details-main-content">
            {launch.links?.mission_patch_small && (
              <div className="mission-patch-container">
                <img
                  src={launch.links.mission_patch_small || "/placeholder.svg"}
                  alt={`${launch.mission_name} patch`}
                  className="mission-patch"
                />
              </div>
            )}

            {launch.details && (
              <div className="mission-details">
                <p>{launch.details}</p>
              </div>
            )}
          </div>

          {launch.rocket && (
            <div className="rocket-info">
              <h3>Rocket</h3>
              <p>
                {launch.rocket.rocket_name} / {launch.rocket.rocket_type}
              </p>
            </div>
          )}
        </div>

        {/* Launchpad section */}
        <div className="launchpad-section">
          <h3>Launchpad Information</h3>

          {loading ? (
            <div className="loading-container">
              <Spinner />
              <p>Loading launchpad data...</p>
            </div>
          ) : launchpad ? (
            <>
              <div className="launchpad-info">
                <div className="info-item">
                  <MapPin />
                  <div>
                    <h4>Location</h4>
                    <p>
                      {launchpad.location.name}, {launchpad.location.region}
                    </p>
                  </div>
                </div>

                <div className="info-item">
                  <Info />
                  <div>
                    <h4>Status</h4>
                    <p className={`status ${launchpad.status}`}>{launchpad.status}</p>
                  </div>
                </div>

                <div className="info-item">
                  <Check />
                  <div>
                    <h4>Launch Statistics</h4>
                    <p>
                      {launchpad.successful_launches} successful / {launchpad.attempted_launches} attempted
                    </p>
                  </div>
                </div>
              </div>

              <div className="launchpad-details">
                <h4>About this launchpad</h4>
                <p>{launchpad.details}</p>

                <h4>Vehicles launched</h4>
                <ul className="vehicles-list">
                  {launchpad.vehicles_launched.map((vehicle, index) => (
                    <li key={index}>{vehicle}</li>
                  ))}
                </ul>

                {launchpad.wikipedia && (
                  <a href={launchpad.wikipedia} target="_blank" rel="noopener noreferrer" className="wiki-link">
                    Read more on Wikipedia
                  </a>
                )}
              </div>
            </>
          ) : (
            <div className="error-container">
              <AlertTriangle />
              <p>Failed to load launchpad data. Please try again.</p>
            </div>
          )}
        </div>

        <button className="hide-button" onClick={onClose}>
          HIDE
        </button>
      </div>
    </motion.div>
  )
}

export default LaunchDetails
