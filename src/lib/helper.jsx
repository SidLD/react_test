export const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365))

    if (diffYears > 0) {
      return `${diffYears} years ago`
    }

    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    if (diffDays > 0) {
      return `${diffDays} days ago`
    }

    const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
    return `${diffHours} hours ago`
  }
