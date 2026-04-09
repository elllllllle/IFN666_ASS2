import { useState, useEffect } from 'react'
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
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('title')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchBooks()
  }, [page, sort])

  async function fetchBooks(searchOverride) {
    setLoading(true)
    setError(null)
    const q = searchOverride !== undefined ? searchOverride : search

    const params = new URLSearchParams()
    if (q) params.append('title', q)
    params.append('sort', sort)
    params.append('page', page)
    params.append('limit', 12)

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/books?${params}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to fetch books')

      setBooks(data)

      // Parse Link header to get total pages
      const linkHeader = res.headers.get('Link')

      if (linkHeader) {
        const lastMatch = linkHeader.match(/<[^>]*[?&]page=(\d+)[^>]*>;\s*rel="last"/)
        if (lastMatch) {
          setTotalPages(parseInt(lastMatch[1]))
        } else {
          setTotalPages(1)
        }
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
    setPage(1)
    fetchBooks(search)
  }

  function handleSortChange(value) {
    setSort(value)
    setPage(1)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <Stack gap="lg" py="md">
      <Group justify="space-between" align="flex-end">
        <div>
          <Title order={2}>Browse Books</Title>
          <Text c="dimmed" size="sm" mt={4}>
            📖 Find your next favourite story
          </Text>
        </div>
      </Group>

      <Group gap="sm">
        <TextInput
          placeholder="Search by title..."
          leftSection={<IconSearch size={16} />}
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{ flex: 1 }}
        />
        <Button onClick={handleSearch}>Search</Button>
        <Select
          placeholder="Sort by"
          leftSection={<IconAdjustments size={16} />}
          data={SORT_OPTIONS}
          value={sort}
          onChange={handleSortChange}
          w={180}
          styles={{
            input: { backgroundColor: '#FFFEFB', borderColor: '#F6EDDD' },
          }}
        />
      </Group>

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
            <Button variant="outline" onClick={() => { setSearch(''); fetchBooks('') }}>
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

          {totalPages > 1 && (
            <Center mt="lg">
              <Pagination
                total={totalPages}
                value={page}
                onChange={setPage}
                color="#454545"
              />
            </Center>
          )}
        </>
      )}
    </Stack>
  )
}