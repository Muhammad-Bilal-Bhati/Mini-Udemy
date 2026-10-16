import { useEffect, useState } from 'react'
import { api } from './api'
import AuthModal from './components/AuthModal'
import CourseCard from './components/CourseCard'
import CourseModal from './components/CourseModal'
import CreateCourseModal from './components/CreateCourseModal'
import Header from './components/Header'
import HeroSection from './components/HeroSection'
import StepsSection from './components/StepsSection'
import './App.css'

function App() {
  const [courses, setCourses] = useState([])
  const [totalCourses, setTotalCourses] = useState(0)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [sort, setSort] = useState('-createdAt')
  const [maxPrice, setMaxPrice] = useState('')
  const [minRating, setMinRating] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 3
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('udemy-user') || 'null'))
  const [authMode, setAuthMode] = useState(null)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [notice, setNotice] = useState('')
  const [createCourseOpen, setCreateCourseOpen] = useState(false)

  useEffect(() => { loadCourses() }, [])

  async function loadCourses(query = '') {
    setLoading(true)
    setError('')
    try {
      const result = await api.getCourses(query)
      setCourses(result.data || [])
      setTotalCourses(result.total || 0)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleSearch(event) {
    event.preventDefault()
    setPage(1)
    loadCourses(buildQuery({ page: 1 }))
  }

  function buildQuery(overrides = {}) {
    const filters = { category, search: search.trim(), sort, maxPrice, minRating, page, limit: pageSize, ...overrides }
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => { if (value !== '' && value !== undefined) params.set(key, value) })
    return `?${params.toString()}`
  }

  function applyFilters(nextCategory = category) {
    setCategory(nextCategory)
    setPage(1)
    loadCourses(buildQuery({ category: nextCategory, page: 1 }))
  }

  function handleAuth(nextUser) {
    setUser(nextUser)
    localStorage.setItem('udemy-user', JSON.stringify(nextUser))
    setAuthMode(null)
    setNotice(`Welcome, ${nextUser.name}`)
  }

  function signOut() {
    setUser(null)
    localStorage.removeItem('udemy-user')
    setNotice('You have been signed out')
  }

  async function enroll(course) {
    if (!user) {
      setSelectedCourse(null)
      setAuthMode('signin')
      return
    }
    try {
      await api.enroll(course._id)
      setNotice('You are enrolled. Your learning path starts now.')
    } catch (err) {
      setNotice(err.message)
    }
  }

  async function review(courseId, payload) {
    if (!user) throw new Error('Please log in first')
    const result = await api.review(courseId, payload)
    const updatedCourse = result.data
    setCourses((currentCourses) => currentCourses.map((course) => course._id === courseId ? updatedCourse : course))
    setSelectedCourse(updatedCourse)
    return result
  }

  function handleCourseCreated(course) {
    setCourses((currentCourses) => [course, ...currentCourses])
    setNotice('Course published successfully.')
  }

  return (
    <div className="app-shell">
      <Header user={user} onSignIn={() => setAuthMode('signin')} onSignUp={() => setAuthMode('signup')} onSignOut={signOut} onCreateCourse={() => setCreateCourseOpen(true)} />
      <main id="top">
        <HeroSection search={search} onSearchChange={setSearch} onSearch={handleSearch} />
        <section className="catalog-section" id="catalog">
          <div className="section-heading"><div><p className="eyebrow">THE CATALOG</p><h2>Find your next <em>deep dive.</em></h2></div><span className="course-count">{totalCourses} courses</span></div>
          <div className="category-row"><button className={category === '' ? 'category active' : 'category'} onClick={() => applyFilters('')}>All courses</button><button className={category === 'Design' ? 'category active' : 'category'} onClick={() => applyFilters('Design')}>Design</button><button className={category === 'Development' ? 'category active' : 'category'} onClick={() => applyFilters('Development')}>Development</button><button className={category === 'Business' ? 'category active' : 'category'} onClick={() => applyFilters('Business')}>Business</button></div>
          <div className="filter-bar"><input type="number" min="0" placeholder="Max price" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} /><select value={minRating} onChange={(event) => setMinRating(event.target.value)}><option value="">Any rating</option><option value="4">4+ stars</option><option value="3">3+ stars</option></select><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="-createdAt">Newest</option><option value="price">Price: low to high</option><option value="-price">Price: high to low</option><option value="-averageRating">Top rated</option></select><button className="outline-button" onClick={() => { setPage(1); loadCourses(buildQuery({ page: 1 })) }}>Apply filters</button></div>
          {error && <div className="error-banner">{error}. Is the backend running on port 5000?</div>}
          {loading ? <div className="loading-state">Loading your learning library...</div> : <div className="course-grid">{courses.map((course, index) => <CourseCard key={course._id} course={course} index={index} onOpen={setSelectedCourse} />)}</div>}
          {!loading && courses.length === 0 && <div className="empty-state">No courses found. Try a different search.</div>}
          {!loading && courses.length > 0 && <div className="pagination"><button className="outline-button" disabled={page === 1} onClick={() => { const nextPage = page - 1; setPage(nextPage); loadCourses(buildQuery({ page: nextPage })) }}>Previous</button><span>Page {page} of {Math.max(1, Math.ceil(totalCourses / pageSize))}</span><button className="outline-button" disabled={page >= Math.ceil(totalCourses / pageSize)} onClick={() => { const nextPage = page + 1; setPage(nextPage); loadCourses(buildQuery({ page: nextPage })) }}>Next</button></div>}
        </section>
        <StepsSection />
      </main>
      <footer><span className="brand"><span className="brand-mark">M</span> Mentora</span><span>Make room for better work.</span></footer>
      {selectedCourse && <CourseModal course={selectedCourse} onClose={() => setSelectedCourse(null)} onEnroll={enroll} onReview={review} user={user} />}
      {createCourseOpen && <CreateCourseModal onClose={() => setCreateCourseOpen(false)} onCreated={handleCourseCreated} />}
      {authMode && <AuthModal mode={authMode} onClose={() => setAuthMode(null)} onSuccess={handleAuth} />}
      {notice && <button className="toast" onClick={() => setNotice('')}>{notice} <span>x</span></button>}
    </div>
  )
}

export default App
