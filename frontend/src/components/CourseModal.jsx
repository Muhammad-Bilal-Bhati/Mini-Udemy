import { useEffect, useState } from 'react'
import { api } from '../api'

function CourseModal({ course, onClose, onEnroll, onReview, user }) {
  const [courseDetails, setCourseDetails] = useState(course)
  const [detailsLoading, setDetailsLoading] = useState(true)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [reviewBusy, setReviewBusy] = useState(false)
  const [reviewMessage, setReviewMessage] = useState('')
  const [chapterForm, setChapterForm] = useState({ title: '', description: '', videoURL: '', duration: '', isFreePreview: false })
  const [chapterBusy, setChapterBusy] = useState(false)
  const [chapterMessage, setChapterMessage] = useState('')

  useEffect(() => {
    let active = true
    api.getCourse(course._id)
      .then((result) => { if (active) setCourseDetails(result.data) })
      .catch(() => {})
      .finally(() => { if (active) setDetailsLoading(false) })
    return () => { active = false }
  }, [course._id])

  const displayedCourse = courseDetails || course

  async function submitReview(event) {
    event.preventDefault()
    setReviewBusy(true)
    setReviewMessage('')
    try {
      await onReview(course._id, { rating, comment })
      setComment('')
      setRating(0)
      setReviewMessage('Review submitted successfully.')
    } catch (error) {
      setReviewMessage(error.message)
    } finally {
      setReviewBusy(false)
    }
  }

  async function submitChapter(event) {
    event.preventDefault()
    setChapterBusy(true)
    setChapterMessage('')
    try {
      const result = await api.addChapter(course._id, { ...chapterForm, duration: Number(chapterForm.duration) || 0 })
      setCourseDetails(result.data)
      setChapterForm({ title: '', description: '', videoURL: '', duration: '', isFreePreview: false })
      setChapterMessage('Chapter added successfully.')
    } catch (error) {
      setChapterMessage(error.message)
    } finally {
      setChapterBusy(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal course-modal" onClick={(event) => event.stopPropagation()}>
        <button className="close-button" onClick={onClose}>x</button>
        <div className="modal-kicker">{displayedCourse.category || 'Course'}</div>
        <h2>{displayedCourse.title}</h2>
        <div className="modal-instructor">Taught by <strong>{displayedCourse.instructor?.name || 'Mentora instructor'}</strong></div>
        <div className="modal-rating"><span className="rating-stars">{'★'.repeat(Math.round(displayedCourse.averageRating || 0))}{'☆'.repeat(5 - Math.round(displayedCourse.averageRating || 0))}</span><strong>{Number(displayedCourse.averageRating || 0).toFixed(1)}</strong><span>({displayedCourse.reviews?.length || displayedCourse.totalRatings || 0} reviews)</span></div>
        <p>{displayedCourse.description}</p>
        <div className="modal-details"><span>{displayedCourse.chapters?.length || 0} chapters</span><span>{displayedCourse.price ? `$${displayedCourse.price}` : 'Free to start'}</span></div>
        <div className="chapter-list"><div className="chapter-list-heading">Course chapters {detailsLoading && <span>Loading...</span>}</div>{displayedCourse.chapters?.length ? displayedCourse.chapters.map((chapter, index) => <div className="chapter-item" key={chapter._id || index}><span className="chapter-number">{String(index + 1).padStart(2, '0')}</span><div><strong>{chapter.title}</strong><p>{chapter.description}</p></div><span className="chapter-duration">{chapter.duration ? `${chapter.duration} min` : ''}</span></div>) : !detailsLoading && <p className="no-chapters">No chapters published yet.</p>}</div>
        <button className="dark-button full" onClick={() => onEnroll(course)}>{user ? 'Enroll in this course' : 'Log in to enroll'}</button>
        {user?.role === 'instructor' && <form className="chapter-form" onSubmit={submitChapter}>
          <p className="review-title">Add a chapter</p>
          <input required placeholder="Chapter title" value={chapterForm.title} onChange={(event) => setChapterForm({ ...chapterForm, title: event.target.value })} />
          <textarea required placeholder="Chapter description" value={chapterForm.description} onChange={(event) => setChapterForm({ ...chapterForm, description: event.target.value })} />
          <div className="chapter-form-row"><input required type="url" placeholder="Video URL" value={chapterForm.videoURL} onChange={(event) => setChapterForm({ ...chapterForm, videoURL: event.target.value })} /><input type="number" min="0" placeholder="Minutes" value={chapterForm.duration} onChange={(event) => setChapterForm({ ...chapterForm, duration: event.target.value })} /></div>
          <label className="preview-toggle"><input type="checkbox" checked={chapterForm.isFreePreview} onChange={(event) => setChapterForm({ ...chapterForm, isFreePreview: event.target.checked })} /> Free preview</label>
          <button className="outline-button full" disabled={chapterBusy}>{chapterBusy ? 'Adding...' : 'Add chapter'}</button>
          {chapterMessage && <p className="review-message">{chapterMessage}</p>}
        </form>}
        {user?.role === 'student' && <form className="review-form" onSubmit={submitReview}>
          <p className="review-title">Already enrolled? Share your experience</p>
          <div className="rating-picker" aria-label="Choose a rating">
            {[1, 2, 3, 4, 5].map((value) => <button type="button" className={value <= rating ? 'star selected' : 'star'} key={value} onClick={() => setRating(value)} aria-label={`${value} star rating`}>*</button>)}
          </div>
          <textarea required minLength="3" value={comment} onChange={(event) => setComment(event.target.value)} placeholder="What did you think of this course?" />
          <button className="outline-button full" disabled={reviewBusy || rating === 0}>{reviewBusy ? 'Submitting...' : 'Submit review'}</button>
          {reviewMessage && <p className="review-message">{reviewMessage}</p>}
        </form>}
      </div>
    </div>
  )
}

export default CourseModal
