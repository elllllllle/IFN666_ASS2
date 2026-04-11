import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router'
import {
  Grid, TextInput, Select, Group, Title, Text,
  Pagination, Center, Loader, Alert, Button, Stack
} from '@mantine/core'
import { IconSearch, IconAlertCircle, IconAdjustments } from '@tabler/icons-react'
import BookCard from '../components/Book/BookCard'

const SORT_OPTIONS = [
  { value: 'title', label: 'Title (A–Z)' },
  { value: '-title', label: 'Title (Z–A)' },
  { value: 'author', label: 'Author (A–Z)' },
  { value: '-author', label: 'Author (Z–A)' },
  { value: '-publishedYear', label: 'Newest first' },
  { value: 'publishedYear', label: 'Oldest first' },
]

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [totalPages, setTotalPages] = useState(1)
  const [inputValue, setInputValue] = useState(searchParams.get('title') || '')

  const search = searchParams.get('title') || ''
  const sort = searchParams.get('sort') || 'title'
  const page = Number(searchParams.get('page')) || 1

  useEffect(() => {
    setInputValue(search)
    fetchBooks()
  }, [searchParams])

  async function fetchBooks() {
    setLoading(true)
    setError(null)
    const q = searchParams.get('title') || ''
    const s = searchParams.get('sort') || 'title'
    const p = Number(searchParams.get('page')) || 1

    const params = new URLSearchParams()
    if (q) params.append('title', q)
    params.append('sort', s)
    params.append('page', p)
    params.append('limit', 12)

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/books?${params}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to fetch books')
      setBooks(data)
      const linkHeader = res.headers.get('Link')
      if (linkHeader) {
        const lastMatch = linkHeader.match(/<[^>]*[?&]page=(\d+)[^>]*>;\s*rel="last"/)
        setTotalPages(lastMatch ? parseInt(lastMatch[1]) : 1)
      } else {
        setTotalPages(1)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleSearch() {
    const urlParams = {}
    if (inputValue) urlParams.title = inputValue
    if (sort !== 'title') urlParams.sort = sort
    setSearchParams(urlParams, { replace: true })
  }

  function handleSortChange(val) {
    if (!val) return
    const urlParams = {}
    if (search) urlParams.title = search
    urlParams.sort = val
    setSearchParams(urlParams, { replace: true })
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSearch()
  }

  function handleClear() {
    setInputValue('')
    setSearchParams({}, { replace: true })
  }

  return (
    <Stack gap="lg" py="md">
      {/* Header */}
      <Group justify="space-between" align="flex-end">
        <div>
          <Title order={2}>Browse Books</Title>
          <Text c="dimmed" size="sm" mt={4}>
            📖 Find your next favourite story
          </Text>
        </div>
      </Group>

      {/* Search and Sort */}
      <Group gap="sm">
        <TextInput
          placeholder="Search by title..."
          leftSection={<IconSearch size={16} />}
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{ flex: 1 }}
        />
        <Button onClick={handleSearch}>Search</Button>
        <Select
          placeholder="Sort by"
          leftSection={<IconAdjustments size={16} />}
          data={SORT_OPTIONS}
          value={sort}
          onChange={val => val && handleSortChange(val)}
          allowDeselect={false}
          w={180}
          styles={{
            input: { backgroundColor: '#FFFEFB', borderColor: '#F6EDDD' },
          }}
        />
      </Group>

      {/* Content */}
      {loading ? (
        <Center py="xl">
          <Loader color="#454545" />
        </Center>
      ) : error ? (
        <Alert icon={<IconAlertCircle size={16} />} color="red">
          {error}
        </Alert>
      ) : books.length === 0 ? (
        <Center py="xl">
          <Stack align="center" gap="sm">
            <Text c="dimmed">No books found</Text>
            <Button variant="outline" onClick={handleClear}>
              Clear search
            </Button>
          </Stack>
        </Center>
      ) : (
        <>
          <Grid>
            {books.map(book => (
              <Grid.Col key={book._id} span={{ base: 6, sm: 4, md: 3 }}>
                <BookCard book={book} />
              </Grid.Col>
            ))}
          </Grid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Center mt="lg">
              <Pagination
                total={totalPages}
                value={page}
                onChange={p => {
                  const urlParams = {}
                  if (search) urlParams.title = search
                  if (sort !== 'title') urlParams.sort = sort
                  urlParams.page = p
                  setSearchParams(urlParams, { replace: true })
                }}
                color="#454545"
              />
            </Center>
          )}
        </>
      )}
    </Stack>
  )
}