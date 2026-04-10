import { useState, useEffect } from 'react'
import {
  Stack, Title, Text, Group, Button, Tabs,
  Loader, Center, Alert, Grid, Paper,
  Badge, ActionIcon, Menu
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import {
  IconAlertCircle, IconPlus, IconBook2,
  IconTrash, IconDotsVertical, IconPencil
} from '@tabler/icons-react'
import { Link } from 'react-router'
import { notifications } from '@mantine/notifications'
import { useAuth } from '../context/AuthContext'
import ReadingLogItem from '../components/ReadingLog/ReadingLogItem'
import ShelfCard from '../components/Shelf/ShelfCard'
import CreateShelfModal from '../components/Shelf/CreateShelfModal'
import EditShelfModal from '../components/Shelf/EditShelfModal'
import LogModal from '../components/ReadingLog/AddToLogModal'

const STATUS_TABS = [
  { value: 'all', label: 'All Books' },
  { value: 'want-to-read', label: 'Want to Read' },
  { value: 'reading', label: 'Currently Reading' },
  { value: 'completed', label: 'Completed' },
]

export default function MyBooks() {
  const { token } = useAuth()
  const [activeTab, setActiveTab] = useState('logs')
  const [statusFilter, setStatusFilter] = useState('all')
  const [logs, setLogs] = useState([])
  const [allLogs, setAllLogs] = useState([])
  const [shelves, setShelves] = useState([])
  const [selectedShelf, setSelectedShelf] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedLog, setSelectedLog] = useState(null)
  const [editingShelf, setEditingShelf] = useState(null)
  const [logModalOpened, { open: openLogModal, close: closeLogModal }] = useDisclosure(false)
  const [shelfModalOpened, { open: openShelfModal, close: closeShelfModal }] = useDisclosure(false)
  const [editShelfModalOpened, { open: openEditShelfModal, close: closeEditShelfModal }] = useDisclosure(false)

  useEffect(() => {
    if (activeTab === 'logs') fetchLogs()
    if (activeTab === 'shelves') fetchShelves()
  }, [activeTab, statusFilter])

  async function fetchLogs() {
    setLoading(true)
    setError(null)

    const params = new URLSearchParams()
    if (statusFilter !== 'all') params.append('status', statusFilter)
    params.append('limit', 50)

    const allParams = new URLSearchParams()
    allParams.append('limit', 50)

    try {
      const [filteredRes, allRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/reading-logs?${params}`,
          { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${import.meta.env.VITE_API_URL}/reading-logs?${allParams}`,
          { headers: { 'Authorization': `Bearer ${token}` } }),
      ])
      const filteredData = await filteredRes.json()
      const allData = await allRes.json()
      if (!filteredRes.ok) throw new Error(filteredData.error || 'Failed to fetch logs')
      setLogs(filteredData)
      setAllLogs(allData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function fetchShelves() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/shelves`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to fetch shelves')
      setShelves(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleDeleteLog(log) {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/reading-logs/${log._id}`,
        {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        }
      )
      if (!res.ok) throw new Error('Failed to remove log')
      setLogs(prev => prev.filter(l => l._id !== log._id))
      setAllLogs(prev => prev.filter(l => l._id !== log._id))
      notifications.show({
        title: 'Removed',
        message: `"${log.book?.title}" removed from your logs.`,
        color: 'orange',
      })
    } catch (err) {
      notifications.show({ title: 'Error', message: err.message, color: 'red' })
    }
  }

  async function handleDeleteShelf(shelf) {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/shelves/${shelf._id}`,
        {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        }
      )
      if (!res.ok) throw new Error('Failed to delete shelf')
      setShelves(prev => prev.filter(s => s._id !== shelf._id))
      if (selectedShelf?._id === shelf._id) setSelectedShelf(null)
      notifications.show({
        title: 'Deleted',
        message: `"${shelf.name}" has been deleted.`,
        color: 'orange',
      })
    } catch (err) {
      notifications.show({ title: 'Error', message: err.message, color: 'red' })
    }
  }

  async function handleRemoveBookFromShelf(shelfId, bookId) {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/shelves/${shelfId}/books/${bookId}`,
        {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        }
      )
      if (!res.ok) throw new Error('Failed to remove book from shelf')
      setSelectedShelf(prev => ({
        ...prev,
        books: prev.books.filter(b => b._id !== bookId)
      }))
      notifications.show({
        title: 'Removed',
        message: 'Book removed from shelf.',
        color: 'orange',
      })
    } catch (err) {
      notifications.show({ title: 'Error', message: err.message, color: 'red' })
    }
  }

  function handleEditLog(log) {
    setSelectedLog(log)
    openLogModal()
  }

  function handleLogModalClose() {
    closeLogModal()
    setSelectedLog(null)
    fetchLogs()
  }

  function handleEditShelf(shelf) {
    setEditingShelf(shelf)
    openEditShelfModal()
  }

  function handleShelfUpdated(updatedShelf) {
    setShelves(prev => prev.map(s => s._id === updatedShelf._id ? updatedShelf : s))
    if (selectedShelf?._id === updatedShelf._id) setSelectedShelf(updatedShelf)
  }

  const counts = {
    all: allLogs.length,
    'want-to-read': allLogs.filter(l => l.status === 'want-to-read').length,
    reading: allLogs.filter(l => l.status === 'reading').length,
    completed: allLogs.filter(l => l.status === 'completed').length,
  }

  return (
    <Stack gap="lg" py="md">
      <Group justify="space-between" align="flex-end">
        <div>
          <Title order={2}>My Books</Title>
          <Text c="dimmed" size="sm" mt={4}>
            Your personal reading space
          </Text>
        </div>
      </Group>

      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="logs">📖 Reading Logs</Tabs.Tab>
          <Tabs.Tab
            value="shelves"
            onClick={() => setSelectedShelf(null)}
          >
            🔖 My Shelves
          </Tabs.Tab>
        </Tabs.List>

        {/* Reading Logs Tab */}
        <Tabs.Panel value="logs" pt="md">
          <Stack gap="md">
            <Group gap="xs">
              {STATUS_TABS.map(tab => (
                <Button
                  key={tab.value}
                  size="xs"
                  variant={statusFilter === tab.value ? 'filled' : 'outline'}
                  onClick={() => setStatusFilter(tab.value)}
                >
                  {tab.label} ({counts[tab.value] ?? 0})
                </Button>
              ))}
            </Group>

            {loading ? (
              <Center py="xl"><Loader color="#454545" /></Center>
            ) : error ? (
              <Alert icon={<IconAlertCircle size={16} />} color="red">{error}</Alert>
            ) : logs.length === 0 ? (
              <Center py="xl">
                <Stack align="center" gap="sm">
                  <Text c="dimmed">No books found</Text>
                  <Button variant="outline" component={Link} to="/">
                    Browse Books
                  </Button>
                </Stack>
              </Center>
            ) : (
              <Stack gap="sm">
                {logs.map(log => (
                  <ReadingLogItem
                    key={log._id}
                    log={log}
                    onEdit={handleEditLog}
                    onDelete={handleDeleteLog}
                  />
                ))}
              </Stack>
            )}
          </Stack>
        </Tabs.Panel>

        {/* Shelves Tab */}
        <Tabs.Panel value="shelves" pt="md">
          <Stack gap="md">
            {loading ? (
              <Center py="xl"><Loader color="#454545" /></Center>
            ) : error ? (
              <Alert icon={<IconAlertCircle size={16} />} color="red">{error}</Alert>
            ) : selectedShelf ? (
              // Shelf detail view
              <Stack gap="md">
                <Group justify="space-between" align="center">
                  <Group gap="sm" align="center">
                    <Title order={4}>{selectedShelf.name}</Title>
                    <Badge style={{ backgroundColor: '#F6EDDD', color: '#454545' }}>
                      {selectedShelf.books?.length || 0} books
                    </Badge>
                  </Group>

                  <Menu shadow="md" width={180} position="bottom-end">
                    <Menu.Target>
                      <ActionIcon variant="subtle" color="gray">
                        <IconDotsVertical size={16} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown style={{ backgroundColor: '#FFFEFB', borderColor: '#F6EDDD' }}>
                      <Menu.Item
                        leftSection={<IconPencil size={14} />}
                        onClick={() => handleEditShelf(selectedShelf)}
                      >
                        Edit Shelf Name
                      </Menu.Item>
                      <Menu.Divider />
                      <Menu.Item
                        color="red"
                        leftSection={<IconTrash size={14} />}
                        onClick={() => handleDeleteShelf(selectedShelf)}
                      >
                        Delete Shelf
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Group>

                {selectedShelf.books?.length === 0 ? (
                  <Center py="xl">
                    <Stack align="center" gap="sm">
                      <Text c="dimmed">No books on this shelf yet</Text>
                      <Button variant="outline" component={Link} to="/">
                        Browse Books
                      </Button>
                    </Stack>
                  </Center>
                ) : (
                  <Grid>
                    {selectedShelf.books?.map(book => (
                      <Grid.Col key={book._id} span={{ base: 6, sm: 4, md: 3 }}>
                        <Paper
                          withBorder
                          radius="md"
                          style={{ backgroundColor: '#FFFEFB', borderColor: '#F6EDDD' }}
                        >
                          <Stack gap={0}>
                            <div style={{
                              height: 140,
                              backgroundColor: '#F6EDDD',
                              borderRadius: '8px 8px 0 0',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                              {book.coverImage ? (
                                <img
                                  src={book.coverImage}
                                  alt={book.title}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px 8px 0 0' }}
                                />
                              ) : (
                                <IconBook2 size={40} color="#454545" opacity={0.3} />
                              )}
                            </div>
                            <Stack gap={4} p="sm">
                              <Text
                                fw={600}
                                size="sm"
                                lineClamp={2}
                                component={Link}
                                to={`/books/${book._id}`}
                                style={{ textDecoration: 'none', color: '#454545' }}
                              >
                                {book.title}
                              </Text>
                              <Text size="xs" c="dimmed">{book.author}</Text>
                              <Button
                                size="xs"
                                variant="subtle"
                                color="red"
                                leftSection={<IconTrash size={12} />}
                                onClick={() => handleRemoveBookFromShelf(selectedShelf._id, book._id)}
                              >
                                Remove
                              </Button>
                            </Stack>
                          </Stack>
                        </Paper>
                      </Grid.Col>
                    ))}
                  </Grid>
                )}
              </Stack>
            ) : (
              // Shelves list view
              <Stack gap="md">
                <Group justify="flex-end">
                  <Button
                    leftSection={<IconPlus size={16} />}
                    onClick={openShelfModal}
                  >
                    New Shelf
                  </Button>
                </Group>
                {shelves.length === 0 ? (
                  <Center py="xl">
                    <Stack align="center" gap="sm">
                      <Text c="dimmed">No shelves yet</Text>
                      <Button onClick={openShelfModal} leftSection={<IconPlus size={16} />}>
                        Create your first shelf
                      </Button>
                    </Stack>
                  </Center>
                ) : (
                  <Grid>
                    {shelves.map(shelf => (
                      <Grid.Col key={shelf._id} span={{ base: 12, sm: 6, md: 4 }}>
                        <ShelfCard
                          shelf={shelf}
                          onClick={() => setSelectedShelf(shelf)}
                          onDelete={handleDeleteShelf}
                          onEdit={handleEditShelf}
                        />
                      </Grid.Col>
                    ))}
                  </Grid>
                )}
              </Stack>
            )}
          </Stack>
        </Tabs.Panel>
      </Tabs>

      {/* Log edit modal */}
      {selectedLog && (
        <LogModal
          opened={logModalOpened}
          onClose={handleLogModalClose}
          book={selectedLog.book}
          logEntry={selectedLog}
        />
      )}

      {/* Create shelf modal */}
      <CreateShelfModal
        opened={shelfModalOpened}
        onClose={closeShelfModal}
        onCreated={shelf => setShelves(prev => [...prev, shelf])}
      />

      {/* Edit shelf modal */}
      {editingShelf && (
        <EditShelfModal
          opened={editShelfModalOpened}
          onClose={closeEditShelfModal}
          shelf={editingShelf}
          onUpdated={handleShelfUpdated}
        />
      )}
    </Stack>
  )
}