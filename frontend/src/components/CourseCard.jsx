function CourseCard({ course, index, onOpen }) {
  const themes = ['coral', 'blue', 'green', 'yellow']

  return (
    <article className="course-card" onClick={() => onOpen(course)}>
      <div className={`course-cover ${themes[index % themes.length]}`}><span className="cover-tag">{course.category || 'Featured'}</span><span className="cover-number">0{index + 1}</span><div className="cover-shape"></div></div>
      <div className="course-info">
        <div className="course-meta"><span>{course.category || 'General'}</span><span>{course.chapters?.length || 0} chapters</span></div>
        <h3>{course.title}</h3>
        <p>{course.description}</p>
        <div className="course-instructor">By {course.instructor?.name || 'Mentora instructor'}</div>
        <div className="course-rating"><span className="rating-stars">{'★'.repeat(Math.round(course.averageRating || 0))}{'☆'.repeat(5 - Math.round(course.averageRating || 0))}</span><span>{Number(course.averageRating || 0).toFixed(1)} ({course.reviews?.length || course.totalRatings || 0})</span></div>
        <div className="course-footer"><span className="price">{course.price ? `$${course.price}` : 'Free'}</span><span className="arrow">&#8594;</span></div>
      </div>
    </article>
  )
}

export default CourseCard
