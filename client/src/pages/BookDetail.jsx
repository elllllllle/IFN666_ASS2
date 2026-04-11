import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import {
  Stack, Title, Text, Badge, Button, Group,
  Loader, Center, Alert, Divider, Paper, Menu
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import {
  IconAlertCircle, IconArrowLeft, IconBook2,
  IconBookmark, IconCalendar, IconUser,
  IconChevronDown, IconEdit, IconTrash, IconBooks
} from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import { useAuth } from '../context/AuthContext'
import LogModal from '../components/ReadingLog/AddToLogModal'
import AddToShelfModal from '../components/Shelf/AddToShelfModal'

const STATUS_LABELS = {
  'want-to-read': 'Want to Read',
  'reading': 'Currently Reading',
  'completed': 'Completed',
}

export default function BookDetail() {
  const { id } = useParams()
  const { user, token } = useAuth()
  const navigate = useNavigate()
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [logEntry, setLogEntry] = useState(null)
  const [logModalOpened, { open: openLog, close: closeLog }] = useDisclosure(false)
  const [shelfModalOpened, { open: openShelf, close: closeShelf }] = useDisclosure(false)
  const [shelfEntry, setShelfEntry] = useState(null)

  useEffect(() => {
    fetchBook()
  }, [id])

  useEffect(() => {
    if (user && token && book) fetchLogEntry()
  }, [user, token, book])

  useEffect(() => {
    if (user && token && book) fetchShelfEntry()
  }, [user, token, book])

  async function fetchBook() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/books/${id}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Book not found')
      setBook(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function fetchLogEntry() {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/reading-logs?book=${id}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      )
      const data = await res.json()
      if (res.ok && Array.isArray(data) && data.length > 0) {
        const entry = data.find(log => log.book?._id === id || log.book === id)
        setLogEntry(entry || null)
      } else {
        setLogEntry(null)
      }
    } catch {
      // silently fail
    }
  }

  async function fetchShelfEntry() {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/shelves`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    )
    const data = await res.json()
    if (res.ok) {
      // Find if this book exists on any shelf
      const found = data.find(shelf =>
        shelf.books?.some(b => b._id === id || b === id)
      )
      setShelfEntry(found || null)
      }
    } catch {
      // silently fail
    }
  }

  async function handleRemove() {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/reading-logs/${logEntry._id}`,
        {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        }
      )
      if (!res.ok) throw new Error('Failed to remove from reading log')
      setLogEntry(null)
      notifications.show({
        title: 'Removed',
        message: `"${book.title}" has been removed from your reading log.`,
        color: 'orange',
      })
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: err.message,
        color: 'red',
      })
    }
  }

  async function handleRemoveFromShelf() {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/shelves/${shelfEntry._id}/books/${id}`,
      {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      }
    )
    if (!res.ok) throw new Error('Failed to remove from shelf')
    setShelfEntry(null)
    notifications.show({
      title: 'Removed',
      message: `"${book.title}" removed from "${shelfEntry.name}".`,
      color: 'orange',
    })
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: err.message,
        color: 'red',
      })
    }
  }

  function handleModalClose() {
    closeLog()
    fetchLogEntry()
  }

  function handleShelfModalClose() {
    closeShelf()
    fetchShelfEntry()
  }

  if (loading) return (
    <Center py="xl"><Loader color="#454545" /></Center>
  )

  if (error) return (
    <Alert icon={<IconAlertCircle size={16} />} color="red" mt="xl">
      {error}
    </Alert>
  )

  return (
    <Stack gap="lg" py="md">
      <Button
        variant="subtle"
        leftSection={<IconArrowLeft size={16} />}
        onClick={() => navigate(-1)}
        w="fit-content"
        style={{ color: '#454545' }}
      >
        Back
      </Button>

      <Paper
        withBorder
        p="xl"
        radius="md"
        style={{ backgroundColor: '#FFFEFB', borderColor: '#F6EDDD' }}
      >
        <Group align="flex-start" gap="xl">
          {/* Cover image or placeholder */}
          <div style={{
            width: 200,
            height: 280,
            backgroundColor: 'transparent',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            overflow: 'hidden',
            padding: 8,
          }}>
            {(() => {
              const coverUrl = book.coverImage ||
                (book.isbn ? `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg` : null)
              return coverUrl ? (
              <>
                <img
                src={coverUrl}
                alt={book.title}
                style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'top center', borderRadius: 4 }}
                onError={e => {
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'flex'
                }}
                />
                <div style={{ display: 'none', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                <IconBook2 size={64} color="#454545" opacity={0.3} />
                </div>
              </>
            ) : (
              <IconBook2 size={64} color="#454545" opacity={0.3} />
            )
          })()}
        </div>

          {/* Book info */}
          <Stack gap="sm" style={{ flex: 1 }}>
            <Title order={2}>{book.title}</Title>

            <Group gap="xs">
              <Text size="md">By:</Text>
              <Text size="md">{book.author}</Text>
            </Group>

            {book.publishedYear && (
              <Group gap="xs">
                <Text size="md">Published:</Text>
                <Text size="md">{book.publishedYear}</Text>
              </Group>
            )}

            {book.genre && (
              <Badge
                variant="light"
                size="md"
                style={{ backgroundColor: '#F6EDDD', color: '#454545', alignSelf: 'flex-start' }}
              >
                {book.genre}
              </Badge>
            )}

            {book.isbn && (
              <Text size="sm" c="dimmed">ISBN: {book.isbn}</Text>
            )}

            {/* Action buttons */}
            {user && (
              <Group mt="sm">
                {logEntry ? (
                  <Menu shadow="md" width={220} position="bottom-start">
                    <Menu.Target>
                      <Button
                        variant="outline"
                        rightSection={<IconChevronDown size={14} />}
                      >
                        {STATUS_LABELS[logEntry.status] || 'In Reading Log'}
                      </Button>
                    </Menu.Target>
                    <Menu.Dropdown
                      style={{ backgroundColor: '#FFFEFB', borderColor: '#F6EDDD' }}
                    >
                      <Menu.Label>Reading Log</Menu.Label>
                      <Menu.Item
                        leftSection={<IconEdit size={14} />}
                        onClick={openLog}
                      >
                        Edit Log
                      </Menu.Item>
                      <Menu.Divider />
                      <Menu.Item
                        color="red"
                        leftSection={<IconTrash size={14} />}
                        onClick={handleRemove}
                      >
                        Remove from My Logs
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                ) : (
                  <Button
                    leftSection={<IconBookmark size={16} />}
                    onClick={openLog}
                  >
                    Add to Reading Log
                  </Button>
                )}

                {/* Add to Shelf button */}
                {shelfEntry ? (
                  <Button
                    variant="outline"
                    color="red"
                    leftSection={<IconBooks size={16} />}
                    onClick={handleRemoveFromShelf}
                  >
                    Remove from "{shelfEntry.name}"
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    leftSection={<IconBooks size={16} />}
                    onClick={openShelf}
                  >
                    Add to Shelf
                  </Button>
                )}
              </Group>
            )}

            {!user && (
              <Text size="sm" c="dimmed" mt="sm">
                <a href="/login" style={{ color: '#454545', fontWeight: 600 }}>
                  Log in
                </a> to add this book to your reading log
              </Text>
            )}
          </Stack>
        </Group>

        {book.description && (
          <>
            <Divider my="lg" color="#F6EDDD" />
            <Stack gap="xs">
              <Text fw={600}>Description</Text>
              <Text size="md" style={{ lineHeight: 1.7 }}>
                {book.description}
              </Text>
            </Stack>
          </>
        )}
      </Paper>

      {book && (
        <LogModal
          opened={logModalOpened}
          onClose={handleModalClose}
          book={book}
          logEntry={logEntry}
        />
      )}

      {book && (
        <AddToShelfModal
          opened={shelfModalOpened}
          onClose={handleShelfModalClose}
          book={book}
        />
      )}
    </Stack>
  )
}